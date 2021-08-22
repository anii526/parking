import { canvas, context } from "..";
import { Car } from "./car";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export class World {
    public translateX: number;
    public translateY: number;
    public viewCenterX: number;
    public viewCenterY: number;
    public targetFrameTime: number;
    public maxParticles: number;
    public objects: Array<Car>;
    public recalculateWorld: boolean;
    public minX = 0;
    public maxX = 0;
    public minY = 0;
    public maxY = 0;
    constructor() {
        this.translateX = 0;
        this.translateY = 0;
        this.viewCenterX = canvas.width / 2;
        this.viewCenterY = canvas.height / 2;
        this.targetFrameTime = 40; //Time in milisec per frame, to set FPS to 60 = 1000/60 => 16.6, 24 fps => 41

        this.maxParticles = 10000;
        this.objects = [];
        this.recalculateWorld = false;
    }

    public tick() {
        let date = new Date();
        const tickStart = date.getMilliseconds();

        //Recalculate all object id's
        if (this.recalculateWorld) {
            const newObjects = [];
            for (const objectIndex in this.objects) {
                if (this.objects[objectIndex] != null) {
                    newObjects.push(this.objects[objectIndex]);
                }
            }
            this.objects = newObjects;
        }

        for (const objectIndex in this.objects) {
            if (this.objects[objectIndex] != null) {
                this.objects[objectIndex].tick();
            }
        }

        date = new Date();
        const tickEnd = date.getMilliseconds();

        this.render(tickEnd - tickStart);
    }

    public render(tickTime: number) {
        const date = new Date();
        const frameStart = date.getMilliseconds();
        //Empty the canvas
        context.clearRect(-10000, -10000, 10000 * canvas.width, 10000 * canvas.height);
        context.translate(this.translateX, this.translateY);

        this.viewCenterX = this.viewCenterX - this.translateX;
        this.viewCenterY = this.viewCenterY - this.translateY;

        this.minX = this.viewCenterX - 0.5 * canvas.width;
        this.maxX = this.viewCenterX + 0.5 * canvas.width;
        this.minY = this.viewCenterY - 0.5 * canvas.height;
        this.maxY = this.viewCenterY + 0.5 * canvas.height;

        //Draw background (Grid)
        context.fillStyle = "#053066";
        context.fillRect(-10000, -10000, 10000 * canvas.width, 10000 * canvas.height);
        context.lineWidth = 1;
        context.strokeStyle = "#DDDDDD";

        const cellSize = 100;

        for (let y = this.minY - (this.viewCenterY % cellSize); y < this.maxY; y += cellSize) {
            context.beginPath();
            context.moveTo(this.minX, y);
            context.lineTo(this.maxX, y);
            context.stroke();
        }

        for (let x = this.minX - (this.viewCenterX % cellSize); x < this.maxX; x += cellSize) {
            context.beginPath();
            context.moveTo(x, this.minY);
            context.lineTo(x, this.maxY);
            context.stroke();
        }

        for (const objectIndex in this.objects) {
            if (this.objects[objectIndex] != null) {
                this.objects[objectIndex].render(context);
            }
        }

        const endDate = new Date();
        const frameStop = endDate.getMilliseconds();
        const frameTime = frameStop - frameStart;

        const timeout = this.targetFrameTime - frameTime - tickTime;
        if (timeout <= 0 || timeout > this.targetFrameTime) {
            setTimeout(() => {
                this.tick();
            }, 1);
        } else {
            setTimeout(() => {
                this.tick();
            }, timeout);
        }
    }

    public addObject(objectToAdd: Car) {
        this.objects.push(objectToAdd);
    }
}
