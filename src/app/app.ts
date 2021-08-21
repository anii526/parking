import { Car } from "./car";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function getShortAngle(a1: number, a2: number) {
    return Math.cos(a1 - a2 + Math.PI / 2);
}
export class Coord {
    constructor(public x = 0, public y = 0) {}
}

export class DriveRoutePoint {
    constructor(public x = 0, public y = 0, public isFinal = false) {}
    public render(env: CanvasRenderingContext2D): void {
        env.fillStyle = "rgba(30,120,0,0.8)";
        env.rect(this.x - 5, this.y - 5, 10, 10);
        env.fill();
    }
}

export class CanvasFunctions {
    public static getMousePos = (canvas: HTMLCanvasElement, evt: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top,
        };
    };
}

// function rotateAndPaintImage(context, image, angleInRad, positionX, positionY, axisX, axisY) {
//     context.translate(positionX, positionY);
//     context.rotate(angleInRad);
//     context.drawImage(image, -axisX, -axisY);
//     context.rotate(-angleInRad);
//     context.translate(-positionX, -positionY);
// }

/*
env 	Target canvas
img 	Specifies the image, canvas, or video element to use 	 	
sx 	Optional. The x coordinate where to start clipping 	Play it �	
sy 	Optional. The y coordinate where to start clipping 	Play it �	
swidth 	Optional. The width of the clipped image 	Play it �	
sheight 	Optional. The height of the clipped image 	Play it �	
x 	The x coordinate where to place the image on the canvas 	Play it �	
y 	The y coordinate where to place the image on the canvas 	Play it �	
width 	Optional. The width of the image to use (stretch or reduce the image) 	Play it �	
height 	Optional. The height of the image to use (stretch or reduce the image)
*/
export function LoadImageToCanvas(
    env: CanvasRenderingContext2D,
    imageObj: HTMLImageElement,
    positionX: number,
    positionY: number,
    angleInRad: number,
    axisX: number,
    axisY: number
) {
    env.translate(positionX, positionY);
    env.rotate(angleInRad);
    env.drawImage(imageObj, -axisX, -axisY);
    env.rotate(-angleInRad);
    env.translate(-positionX, -positionY);
}

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

export class CarEngine {
    public maxPower: number;
    public revs: number;
    public maxPowerInReverse: number;
    public power: number;
    public trottle: number;
    constructor() {
        this.maxPower = 1;
        this.revs = 1000;
        this.maxPowerInReverse = 0.2;
        this.power = 0;
        this.trottle = 0;
    }
    public setTrottle(amount: number) {
        this.trottle = amount;
        this.update();
    }
    public update() {
        if (this.trottle >= 0) {
            this.power = this.maxPower * this.trottle;
        } else {
            this.power = this.maxPowerInReverse * this.trottle;
        }
    }
    public trottleUp(amount: number) {
        if (this.trottle + amount <= 1) {
            this.trottle += amount;
        } else {
            this.trottle = 1;
        }
        this.update();
    }
    public trottleDown(amount: number) {
        if (this.trottle - amount >= 0) {
            this.trottle -= amount;
        } else {
            if (this.trottle - amount > -1) {
                this.trottle -= amount;
            }
        }
        this.update();
    }
    public trottleDownToZero(amount: number) {
        if (this.trottle - amount >= 0) {
            this.trottle -= amount;
        } else {
            this.trottle = 0;
        }
        this.update();
    }
    public getForce() {
        return this.power;
    }
    public tick() {
        if (this.trottle > 0) {
            this.trottleDownToZero(0.001);
        } else if (this.trottle < 0) {
            this.trottleUp(0.001);
        }
    }
}

export class Wheels {
    public mindrivingCircle: number;
    public frontWheels: Wheel[];
    public backWheels: Wheel[];
    public steerDist: number;
    public parent: Car;
    public steerAngle: number;
    public centerOfBackWheels: number;
    constructor(parent: Car) {
        this.mindrivingCircle = 80;
        this.frontWheels = [];
        this.backWheels = [];
        this.steerDist = 0;
        this.parent = parent;
        this.steerAngle = 0.5 * Math.PI;
        this.centerOfBackWheels = 0;
    }
    public addFrontWheel(wheel: Wheel) {
        this.frontWheels.push(wheel);
        this.update();
    }

    public addBackWheel(wheel: Wheel) {
        this.backWheels.push(wheel);
        this.update();
    }
    public steerToDist(dist: number) {
        this.steerDist = dist;
        for (const index in this.frontWheels) {
            const targetAngle = Math.atan(
                (this.centerOfBackWheels - this.frontWheels[index].xoffset) / (this.frontWheels[index].yoffset - dist)
            );

            this.frontWheels[index].rotateTo(targetAngle);
        }
    }
    public increment(val: number) {
        let newSteerAngle: number;
        if (this.steerAngle + val > Math.PI) {
            newSteerAngle = -this.steerAngle + val;
        } else {
            newSteerAngle = this.steerAngle + val;
        }

        const ackDistance = Math.tan(newSteerAngle) * 100;
        if (Math.abs(ackDistance) > this.mindrivingCircle) {
            this.steerAngle = newSteerAngle;
            this.steerToDist(ackDistance);
        }
    }

    //reduce to zero
    public reduce(val: number) {
        val = val || 1.05;

        if (Math.abs(this.steerDist * val) <= 1100) {
            this.steerDist *= val;
            this.steerToDist(this.steerDist);
        }
    }
    public incrementDistance(val: number) {
        this.steerDist += val;
        this.steerToDist(this.steerDist);
    }

    public update() {
        //Center of back wheels (x)
        let sum = 0;
        let totalBackWheels = 0;
        for (const index in this.backWheels) {
            totalBackWheels += 1;
            sum += this.backWheels[index].xoffset;
        }
        if (totalBackWheels > 0) {
            this.centerOfBackWheels = sum / totalBackWheels;
        }
        //Anckerman center:
    }
    public render(env: CanvasRenderingContext2D) {
        //Do not draw debug:
        //return(true)

        const anckermanPos = this.parent.getPosition(this.centerOfBackWheels, this.steerDist);
        if (this.getAckermanRadius() > 1 && this.getAckermanRadius() < 1000) {
            const ackermanCenter = this.getAckermanpos();

            env.beginPath();
            env.arc(ackermanCenter.x, ackermanCenter.y, 2, 0, 2 * Math.PI, false);
            env.stroke();

            for (const index in this.frontWheels) {
                env.lineWidth = 0.5;
                env.strokeStyle = "rgba(200,200,200,0.9)";
                env.beginPath();
                env.moveTo(this.frontWheels[index].center.x, this.frontWheels[index].center.y);
                env.lineTo(anckermanPos.x, anckermanPos.y);
                env.stroke();
            }

            env.beginPath();
            env.arc(anckermanPos.x, anckermanPos.y, this.getAckermanRadius(), 0, 2 * Math.PI, false);
            env.stroke();
        }
    }
    public getAckermanpos() {
        return this.parent.getPosition(this.centerOfBackWheels, this.steerDist);
    }
    public getRelativeAckermanPos() {
        return new Coord(this.centerOfBackWheels, this.steerDist);
    }

    public getAckermanRadius() {
        return Math.abs(this.steerDist);
    }
}
