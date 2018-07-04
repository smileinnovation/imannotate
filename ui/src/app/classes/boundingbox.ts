
export class BoundingBox {
    label: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    id: string;
    old_color: string;
    textColor: string;
    hasAlpha: boolean;
    path: Path2D;

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        const r = Math.ceil(Math.random() * 150 + 50),
              g = Math.ceil(Math.random() * 150 + 50),
              b = Math.ceil(Math.random() * 150 + 50);
        this.color = `rgba(${r}, ${g}, ${b}, 1.0)`;
        const id = Math.round(Math.random() * 999999);
        this.id = id.toString();
        this.old_color = null;
        this.textColor = 'white';
        this.hasAlpha = false;
        this.id = 'label-' + Math.floor(Math.random() * 99999999).toString();
    }
}
