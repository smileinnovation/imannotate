import { BoundingBox } from './boundingbox';
import { Subject, Observable } from 'rxjs';

export class Annotator {
    private image: HTMLImageElement;
    private element: Element;
    private aside: Element;
    private canvasRescale: boolean;
    private canvas: any;
    private ctx: CanvasRenderingContext2D;
    private boxesList: Array<BoundingBox>;
    private boxeSubject: Subject<BoundingBox>;
    public boxes: Observable<BoundingBox>;
    private boxInProgress: boolean;

    private removeBoxSubject: Subject<BoundingBox>;
    public removeBox: Observable<BoundingBox>;

    constructor(element) {
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
        });
        image.src = url;
        this.image = image;
    }


    rescaleCanvas() {
        if (this.canvasRescale) {
            const ratio = this.image.naturalWidth / this.image.naturalHeight;
            const canvas = this.canvas;
            canvas.width = '';
            canvas.style.width = '100%';
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.width / ratio;
            canvas.style.width = 'auto';
        }
        this.drawBoundingBoxes();
    }

    createCanvas() {
        if (!!this.canvas) {
            this.rescaleCanvas();
            return;
        }
        console.log('creating canvas');
        const canvas = document.createElement('canvas');
        const ratio = this.image.naturalWidth / this.image.naturalHeight;
        this.element.appendChild(canvas);
        canvas.style.width = '100%';
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.width / ratio;
        canvas.style.width = 'auto';
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;

        let x, y = null;
        let down = false;
        this.canvas.addEventListener('mousedown', (evt) => {
            const rect = evt.target.getBoundingClientRect();
            x = evt.clientX - rect.left;
            y = evt.clientY - rect.top;
            down = true;
        });

        this.canvas.addEventListener('mousemove', (evt) => {
            const rect = evt.target.getBoundingClientRect();
            if (!down) {
                this.resetBoundingBoxesColor();
                // check if mouse is inside a box
                const toAlpha = [];
                this.boxesList.forEach(elem => {
                    if (this.ctx.isPointInPath(elem.path, evt.clientX - rect.left, evt.clientY - rect.top)) {
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
                return;
            }

            this.clearCanvas();
            this.resetBoundingBoxesColor();
            this.drawBoundingBoxes();

            // draw current boxes
            this.drawRect(
                x,
                y,
                (evt.clientX - rect.left - x),
                (evt.clientY - rect.top - y),
                null
            );
        });

        this.canvas.addEventListener('mouseup', (evt) => {
            down = false;
            const rect = evt.target.getBoundingClientRect();

            const bx = Math.min(x, evt.clientX - rect.left) / this.canvas.clientWidth,
                by = Math.min(y, evt.clientY - rect.top) / this.canvas.clientHeight,
                bw = Math.max(x, evt.clientX - rect.left) / this.canvas.clientWidth,
                bh = Math.max(y, evt.clientY - rect.top) / this.canvas.clientHeight;

            const box = new BoundingBox(bx, by, bw, bh);
            this.boxInProgress = true;
            this.boxeSubject.next(box);
        });

        window.addEventListener('keyup', (evt) => {
            if (evt.key === 'Escape') {
                this.clearCanvas();
                this.resetBoundingBoxesColor();
                this.drawBoundingBoxes();
                down = false;
                this.boxInProgress = false;
            }
        });

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
        // elem.style.top = ((box.y) * this.canvas.clientHeight).toString() + 'px';
        // elem.style.left = ((box.x) * this.canvas.clientWidth).toString() + 'px';
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
