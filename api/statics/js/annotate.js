/*jshint esversion: 6 */

class BoundingBox {

    constructor(x, y, w, h){
        this.label = "";
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;

        let r = Math.ceil(Math.random() * 150 + 50),
            g = Math.ceil(Math.random() * 150 + 50),
            b = Math.ceil(Math.random() * 150 + 50);

        this.color = `rgba(${r}, ${g}, ${b}, 1.0)`;
        let id = Math.round(Math.random() * 999999);
        this.id = id.toString();
        this.old_color = null;
        this.textColor = "white";
        this.hasAlpha = false;
    }
}

class Annotator {

    constructor(element, aside){
        this.boxes = [];
        this.canvas = null;
        this.ctx = null;
        this.image = null;
        this.canvasRescale = true;
        this.labelsClasses = [];

        if (typeof(element) === 'string') {
            this.element = document.querySelector(element);
        } else {
            this.element = element;
        }

        if (typeof(aside) == 'string') {
            this.aside = document.querySelector(aside);
        } else {
            this.aside = aside;
        }

        if (!!this.aside) {
            this.aside.addEventListener('click', (evt) => {
                let target = evt.target;
                if (!target.hasAttribute('data-label')) {
                    return;
                }
                let id = target.getAttribute('data-label');
                this.removeBox(id);
                target.remove();
            });

            this.aside.addEventListener('mousemove', (evt) => {
                let target = evt.target;
                if(!target.hasAttribute('data-label')) {
                    this.resetBoundingBoxesColor();
                    this.clearCanvas();
                    this.drawBoundingBoxes();
                    return;
                }

                let id = target.getAttribute('data-label');
                let box = this.getBoundingBox(id);
                if (!!box) {
                    this.resetBoundingBoxesColor();
                    this.setBoxesAlpha(0.1);
                    box.color = 'rgba(255,0,0,1)';
                    this.clearCanvas();
                    this.drawBoundingBoxes();
                }
            });

            this.aside.addEventListener('mouseleave', () => {
                this.resetBoundingBoxesColor();
                this.clearCanvas();
                this.drawBoundingBoxes();
            });

        }
    }

    loadImage(url) {
        let image = new Image();
        image.addEventListener('load', () => {
            this.createCanvas();
        });
        image.src = url;
        this.image = image;
    }


    rescaleCanvas() {
        if (this.canvasRescale) {
            let ratio = this.image.naturalWidth / this.image.naturalHeight;
            let canvas = this.canvas;
            canvas.width = "";
            canvas.style.width = "100%";
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.width/ratio;
            canvas.style.width = "auto";
            while (document.body.scrollHeight > document.body.offsetHeight) {
                canvas.height -= document.body.scrollHeight - document.body.offsetHeight;
                canvas.width   = canvas.height * ratio;
            }
        }	
        this.drawBoundingBoxes();
    }

    createCanvas() {
        if (!!this.canvas) {
            this.rescaleCanvas();
            return;
        }

        let canvas = document.createElement('canvas');
        let ratio = this.image.naturalWidth / this.image.naturalHeight;
        this.element.appendChild(canvas);
        canvas.style.width = "100%";
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.width/ratio;
        canvas.style.width = "auto";
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;

        let x, y = null;
        let down = false;
        this.canvas.addEventListener('mousedown', (evt) => { 
            let rect = evt.target.getBoundingClientRect(); 
            x = evt.clientX - rect.left;
            y = evt.clientY - rect.top;
            down = true;
        });

        this.canvas.addEventListener('mousemove', (evt) => {
            if (!down) {
                return;
            }
            this.clearCanvas();
            this.drawBoundingBoxes();
            let rect = evt.target.getBoundingClientRect(); 
            // draw current boxes
            this.drawRect(
                x, 
                y,
                (evt.clientX - rect.left - x),
                (evt.clientY - rect.top  - y));
        });

        this.canvas.addEventListener('mouseup', (evt) => {
            down = false;
            let rect = evt.target.getBoundingClientRect(); 

            let bx = Math.min(x, evt.clientX - rect.left) / this.canvas.clientWidth, 
                by = Math.min(y, evt.clientY - rect.top)  / this.canvas.clientHeight,
                bw = Math.max(x, evt.clientX - rect.left) / this.canvas.clientWidth,
                bh = Math.max(y, evt.clientY - rect.top)  / this.canvas.clientHeight;

            let boxes = new BoundingBox(bx, by, bw, bh);

            let label = prompt("Label");
            if (label) {
                boxes.label = label;
                this.boxes.push(boxes);
                this.aside.querySelectorAll("[data-label]").forEach(elem => {
                    elem.remove();
                });
                this.setList();
            } else {
                this.clearCanvas();
            }
            this.drawBoundingBoxes();
        });

        window.addEventListener('resize', () => {
            this.rescaleCanvas();
        });

        this.rescaleCanvas();
    }


    setList() {
        let list = this.boxes.sort((a, b) => {
            return a.label > b.label;
        });
        list.forEach(box => this.addToList(box));
    }

    addToList(boxes) {
        if(!this.aside) {
            return;
        }

        let el = document.createElement('span');
        //el.classList.add("label");

        this.labelsClasses.forEach(cl => {
            el.classList.add(cl);
        });

        el.innerHTML = boxes.label;
        el.setAttribute('data-label', boxes.id);
        el.style.backgroundColor = boxes.color;
        el.style.color = boxes.textColor;
        this.aside.appendChild(el);
    }


    resetBoundingBoxesColor(){
        this.boxes.forEach((b)=>{
            if (b.old_color) {
                b.hasAlpha = false;
                b.color = b.old_color;
                b.old_color = null;
            }
        });
    }

    setBoxesAlpha(alpha) {
        this.boxes.forEach((b) => {
            if (b.hasAlpha) {
                return;
            }
            b.hasAlpha = true;
            b.old_color = b.color;
            b.color = 'rgba(55, 55, 55, 0.3)';
            //b.color = b.color.replace(/,[^,]+?\)$/, `, ${alpha})`);
        });
    }

    getBoundingBox(id) {
        let box = null;
        this.boxes.forEach((b) => {
            if (b.id === id) {
                box = b;
            }
        });
        return box;
    }

    removeBox(id) {
        this.boxes.forEach((box, i, arr) => {
            if (box.id === id) {
                arr.splice(i, 1);
            }
        });
        this.clearCanvas();
        this.drawBoundingBoxes();
    }

    writeText(box) {
        this.ctx.font = "16px Arial";
        this.ctx.beginPath();
        this.ctx.fillStyle = box.color;

        let textSize = this.ctx.measureText(box.label);
        let textBoxY = (box.y * this.canvas.clientHeight)-25;
        let textY    = (box.y * this.canvas.clientHeight)-8;
        if (textBoxY < 0) {
            textBoxY += 25;
            textY += 25;
        }

        this.ctx.rect(
            (box.x * this.canvas.clientWidth)-1, 
            textBoxY,
            textSize.width + 12, 
            25);

        this.ctx.fill();

        this.ctx.fillStyle = box.textColor;
        this.ctx.fillText(
            box.label,
            (box.x * this.canvas.clientWidth)+4,
            textY
        );
    }

    clearCanvas() {
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    }

    drawBoundingBoxes() {
        // draw old boxes
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
        this.boxes.forEach(box => {
            this.drawRect(
                box.x * this.canvas.clientWidth, 
                box.y * this.canvas.clientHeight, 
                (box.width  - box.x) * this.canvas.clientWidth, 
                (box.height - box.y) * this.canvas.clientHeight, 
                box.color);
            this.writeText(box);
        });
    }

    drawRect(x, y, w, h, color) {
        if (!color) {
            color = "red";
        }
        let ctx = this.ctx;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.rect(x, y, w, h);
        ctx.stroke();
    }


    toJson() {
        let boxes = [];
        this.boxes.forEach((box) => {
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

    reset() {
        this.boxes = [];
        this.aside.querySelectorAll('[data-label]').forEach((elem) => {
            elem.remove();
        });
        this.clearCanvas();
        this.drawBoundingBoxes();
    }
}
