import { BoundingBox } from './boundingbox';
import { Subject, Observable } from 'rxjs';

export class Annotator {
  public canvas: any;
  public boxes: Observable<BoundingBox>;
  public removeBox: Observable<BoundingBox>;

  private canvasRescale: boolean;
  private image: HTMLImageElement;
  private element: Element;
  private aside: Element;
  private ctx: CanvasRenderingContext2D;
  private boxesList: Array<BoundingBox>;
  private boxeSubject: Subject<BoundingBox>;
  private boxInProgress: boolean;
  private isMobile: boolean;
  private removeBoxSubject: Subject<BoundingBox>;

  constructor(element) {
    this.isMobile = false;
    this.canvasRescale = true;
    this.boxInProgress = false;
    this.boxeSubject = new Subject<BoundingBox>();
    this.boxes = this.boxeSubject.asObservable();

    this.removeBoxSubject = new Subject<BoundingBox>();
    this.removeBox = this.removeBoxSubject.asObservable();

    this.boxesList = new Array<BoundingBox>();

    if (typeof (element) === 'string') {
      this.element = document.querySelector(element);
    } else {
      this.element = element;
    }
  }

  setBoundingBoxes(list: Array<BoundingBox>) {
    this.boxesList = list;
    this.boxInProgress = false;
    this.drawBoundingBoxes();
  }

  loadImage(url) {
    const image = new Image();
    image.addEventListener('load', () => {
      this.createCanvas();
      this.reset();
      this.rescaleCanvas();
    });
    image.src = url;
    this.image = image;
  }


  // rescale the canvas is needed
  // TODO: not efficient, enhance that
  rescaleCanvas() {
    if (this.canvasRescale) {
      const ratio = this.image.naturalWidth / this.image.naturalHeight;
      const canvas = this.canvas;

      const w = canvas.parentElement.clientWidth
      canvas.width = w;
      canvas.height = canvas.width / ratio;

      if (canvas.height > canvas.parentElement.offsetHeight) {
        canvas.height = canvas.parentElement.offsetHeight;
        canvas.width = canvas.height * ratio;

      }
    }
    this.drawBoundingBoxes();
  }

  // create the canvas element, and prepare event handlers
  createCanvas() {
    if (!!this.canvas) {
      this.rescaleCanvas();
      return;
    }
    const canvas = document.createElement('canvas');
    const ratio = this.image.naturalWidth / this.image.naturalHeight;
    this.element.appendChild(canvas);
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.rescaleCanvas()

    let ecx=0, ecy=0;

    let x, y = null;
    let down = false;

    ["mousedown", "touchstart"].forEach( evname => {
      // keep the start event position to be able to draw
      // box from that point.
      this.canvas.addEventListener(evname, (evt) => {
        evt.preventDefault();
        if(evt["touches"]) {
          this.isMobile = true;
        }
        const rect = evt.target.getBoundingClientRect();
        const ecx = evt.clientX ? evt.clientX : evt.touches[0].clientX;
        const ecy = evt.clientY ? evt.clientY : evt.touches[0].clientY;
        x = ecx - rect.left;
        y = ecy - rect.top;
        down = true;
      });
    });


    ["mousemove", "touchmove"].forEach(evname => {
      // draw box or highlight (for mouse only) to display controls
      this.canvas.addEventListener(evname, (evt) => {
        evt.preventDefault();
        if(evt.touches && evt.touches.length > 1) {
          // two fingers on canvas, drop
          return
        }
        evt.preventDefault();
        const rect = evt.target.getBoundingClientRect();
        ecx = evt.clientX ? evt.clientX : evt.touches[0].clientX;
        ecy = evt.clientY ? evt.clientY : evt.touches[0].clientY;
        if (!down) {
          // mouse event and not drawing box, so the mouse is "hover"
          // so we will check if mouse position is "over" a box
          this.resetBoundingBoxesColor();


          const toAlpha = [];
          this.boxesList.forEach(elem => {
            if (this.ctx.isPointInPath(elem.path, ecx - rect.left, ecy - rect.top)) {
              toAlpha.push(elem);
            }
          });

          if (!this.boxInProgress) {
            Array.from(document.querySelectorAll('.annotate-controls')).forEach(
              control => control.classList.remove('visible')
            );

            if (toAlpha.length > 0) {
              this.highlightBoxes();
            }
            toAlpha.forEach(box => {
              box.color = 'rgba(255,0,0,1)';
              const controls: HTMLDivElement = document.querySelector('#' + box.id);
              controls.classList.add('visible');
            });
            this.clearCanvas();
            this.drawBoundingBoxes();
          }
          // because we checked "hover", we should not draw, so return now !
          return;
        }

        // reinit canvas and draw current selection
        this.clearCanvas();
        this.resetBoundingBoxesColor();
        this.drawBoundingBoxes();

        // draw current boxes
        this.drawRect(
          x,
          y,
          (ecx - rect.left - x),
          (ecy - rect.top - y),
          null
        );
      });
    });

    ["mouseup", "touchend"].forEach(evname => {
      // mouse up or touch end, finish drawing box and wait for label
      this.canvas.addEventListener(evname, (evt) => {
        evt.preventDefault();
        down = false;
        ecx = evt.clientX ? evt.clientX : ecx;
        ecy = evt.clientY ? evt.clientY : ecy;

        const rect = evt.target.getBoundingClientRect();
        const bx = Math.min(x, ecx - rect.left) / this.canvas.clientWidth,
          by = Math.min(y, ecy - rect.top) / this.canvas.clientHeight,
          bw = Math.max(x, ecx - rect.left) / this.canvas.clientWidth,
          bh = Math.max(y, ecy - rect.top) / this.canvas.clientHeight;

        const box = new BoundingBox(bx, by, bw, bh);
        this.boxInProgress = true;
        this.boxeSubject.next(box);
      });
    });


    // Esc key should reset selection
    window.addEventListener('keyup', (evt) => {
      if (evt.key === 'Escape') {
        this.clearCanvas();
        this.resetBoundingBoxesColor();
        this.drawBoundingBoxes();
        down = false;
        this.boxInProgress = false;
      }
    });

    // rescale canvas on window resize (or mobile rotation)
    window.addEventListener('resize', () => {
      this.rescaleCanvas();
    });

    this.rescaleCanvas();
  }

  resetBoundingBoxesColor() {
    this.boxesList.forEach((b) => {
      if (b.old_color) {
        b.hasAlpha = false;
        b.color = b.old_color;
        b.old_color = null;
      }
    });
  }

  // do highlight on certain boxes, eg. when mouse if over
  highlightBoxes() {
    this.boxesList.forEach((b) => {
      if (b.hasAlpha) {
        return;
      }
      b.hasAlpha = true;
      b.old_color = b.color;
      b.color = 'rgba(55, 55, 55, 0.3)';
    });
  }

  getBoundingBox(id) {
    let box = null;
    this.boxesList.forEach((b) => {
      if (b.id === id) {
        box = b;
      }
    });
    return box;
  }

  writeText(box) {
    this.ctx.font = '16px Arial';
    this.ctx.beginPath();
    this.ctx.fillStyle = box.color;

    const textSize = this.ctx.measureText(box.label);
    let textBoxY = (box.y * this.canvas.clientHeight) - 25;
    let textY = (box.y * this.canvas.clientHeight) - 8;
    if (textBoxY < 0) {
      textBoxY += 25;
      textY += 25;
    }

    this.ctx.rect(
      (box.x * this.canvas.clientWidth) - 1,
      textBoxY,
      textSize.width + 12,
      25);

    this.ctx.fill();

    this.ctx.fillStyle = box.textColor;
    this.ctx.fillText(
      box.label,
      (box.x * this.canvas.clientWidth) + 4,
      textY
    );
  }

  clearCanvas() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  // draw boxes that are in "this.boxesList"
  drawBoundingBoxes() {
    // draw old boxes
    // tslint:disable-next-line:no-unused-expression
    this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    this.boxesList.forEach(box => {
      const path = this.drawRect(
        box.x * this.canvas.clientWidth,
        box.y * this.canvas.clientHeight,
        (box.width - box.x) * this.canvas.clientWidth,
        (box.height - box.y) * this.canvas.clientHeight,
        box.color);
      box.path = path;
      this.writeText(box);
      this.drawControls(box);
    });
  }

  // draw rect and return the path. Path is needed to check "hover" later
  // so we will store path in box element
  drawRect(x, y, w, h, color): Path2D {
    if (!color) {
      color = 'red';
    }

    const path = new Path2D();
    path.rect(x, y, w, h);
    const ctx = this.ctx;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke(path);
    return path;
  }


  // TODO: useless now
  toJson() {
    const boxes = [];
    this.boxesList.forEach((box) => {
      boxes.push({
        label: box.label,
        x: box.x,
        y: box.y,
        w: box.width,
        h: box.height,
      });
    });
    return JSON.stringify({
      image: this.image.src,
      boxes: boxes,
    });
  }

  // draw button to delete current box
  drawControls(box: BoundingBox) {
    const old: HTMLDivElement = document.querySelector('#' + box.id);
    if (old) { return; }

    const removeButton = document.createElement('button');
    removeButton.classList.add('btn', 'btn-danger');
    removeButton.innerHTML = '<i class="material-icons">delete</i>';
    removeButton.addEventListener('click', (evt) => {
      this.removeBoxSubject.next(box);
      removeButton.remove();
    });

    const elem = document.createElement('div');
    elem.id = box.id;
    elem.appendChild(removeButton);
    elem.classList.add('annotate-controls');

    // always display controls for mobile - because "hover" is not available
    if (this.isMobile) {
      elem.classList.add('visible');
      elem.classList.add('mobile');
    }
    elem.style.top = (box.y * 100).toString() + '%';
    elem.style.left = (box.x * 100).toString() + '%';
    this.element.appendChild(elem);
  }

  reset() {
    this.boxesList = [];
    this.clearCanvas();
    this.drawBoundingBoxes();
  }
}
