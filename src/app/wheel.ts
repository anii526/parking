import { Car } from "./car";
import { Coord } from "./coord";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export class Wheel {
    public parent: Car;
    public xoffset: number;
    public yoffset: number;
    public length = 10;
    public maxAngle = Math.PI * 0.35;
    public minAngle = -Math.PI * 0.35;

    public heading = 0;
    public vr = 0; //Rotational speed
    public frontCoord: Coord;
    public backCoord: Coord;
    public center: Coord;
    public alpha = 1;
    constructor(yoffset: number, xoffset: number, parent: Car) {
        this.parent = parent;
        this.xoffset = xoffset;
        this.yoffset = yoffset;
        this.length = 10;
        this.maxAngle = Math.PI * 0.35;
        this.minAngle = -Math.PI * 0.35;

        this.heading = 0;
        this.vr = 0; //Rotational speed

        this.frontCoord = new Coord();
        this.backCoord = new Coord();
        this.center = new Coord();
    }
    public rotateTo(newHeading: number) {
        this.heading = newHeading;
    }

    public increment(value: number) {
        this.rotateTo(value);
    }

    public render(env: CanvasRenderingContext2D) {
        env.lineWidth = 5;
        env.strokeStyle = "#222222";
        this.alpha = this.heading + this.parent.heading;
        //Calculate the center coordinates of the wheel
        this.center = this.parent.getPosition(this.xoffset, this.yoffset);

        //Calculate the coordinates of the front and back of the car :)
        const xOffset = Math.sin(this.alpha) * 0.5 * this.length;
        const yOffset = Math.cos(this.alpha) * 0.5 * this.length;

        this.frontCoord.x = xOffset + this.center.x;
        this.frontCoord.y = yOffset + this.center.y;
        this.backCoord.x = this.center.x - xOffset;
        this.backCoord.y = this.center.y - yOffset;

        env.beginPath();
        env.moveTo(this.frontCoord.x, this.frontCoord.y);
        env.lineTo(this.backCoord.x, this.backCoord.y);
        env.stroke();

        //Draw center
        env.lineWidth = 2;
        env.strokeStyle = "#000000";
        env.beginPath();
        env.moveTo(this.center.x, this.center.y);
        env.lineTo(this.backCoord.x, this.backCoord.y);
        env.stroke();

        //Axel:
        const centerOfParent = this.parent.getPosition(this.xoffset, 0);

        //Draw center
        env.lineWidth = 2;
        env.strokeStyle = "#555555";
        env.beginPath();
        env.moveTo(this.center.x, this.center.y);
        env.lineTo(centerOfParent.x, centerOfParent.y);
        env.stroke();
    }
}
