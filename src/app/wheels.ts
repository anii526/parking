import { Coord } from "./coord";
import { Car } from "./car";
import { Wheel } from "./wheel";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
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
