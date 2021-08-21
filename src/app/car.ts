import { CarEngine, Wheel, Wheels, Coord, LoadImageToCanvas } from "./app";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export class Car {
    public xpos = 100;
    public ypos = 100;
    public friction = 0.95; //-1
    public mass = 50;
    public blinkers = 0; //0 = off , -1 left, 1: right, 2 all
    public blinkerIteration = 0;

    public vforward = 0;
    public engine: CarEngine;
    public reverse = false;
    public heading = 0;
    public braking = 0;
    public imgUrl = "./assets/sports_car_grey.png";

    public imageObj: HTMLImageElement;
    public imageXoffset = 2;
    public imageYoffset = 5;
    public imageLoaded = false;

    //Following determines the car sizes (pixels):
    public height = 190 / 2;
    public length: number;
    public width = 45;

    public leftFrontWheel: Wheel;
    public rightFrontWheel: Wheel;

    public leftBackWheel: Wheel;
    public rightBackWheel: Wheel;
    public wheels: Wheel[];
    public steering: Wheels;
    public frontCoord: Coord;
    public backCoord: Coord;
    public alpha = 1;
    public x = 0;
    public y = 0;
    public dCenterAck = 0;
    public backWheelsPosition: Coord;
    public dxAcker = 0;
    public dyAcker = 0;
    public targetX = 0;
    public targetY = 0;
    constructor() {
        this.xpos = 100;
        this.ypos = 100;
        this.friction = 0.95; //-1
        this.mass = 50;
        this.blinkers = 0; //0 = off , -1 left, 1: right, 2 all
        this.blinkerIteration = 0;

        this.vforward = 0;
        this.engine = new CarEngine();
        this.reverse = false;
        this.heading = 0;
        this.braking = 0;
        this.imgUrl = "./assets/sports_car_grey.png";

        this.imageObj = new Image();
        this.imageObj.src = this.imgUrl;
        this.imageXoffset = 2;
        this.imageYoffset = 5;
        this.imageLoaded = false;

        this.imageObj.onload = () => {
            this.imageLoaded = true;
            console.log(this.imageObj.src);
        };

        //Following determines the car sizes (pixels):
        this.height = 190 / 2;
        this.length = this.height;
        this.width = 45;

        this.leftFrontWheel = new Wheel(-(this.width / 2), this.height / 3, this);
        this.rightFrontWheel = new Wheel(this.width / 2, this.height / 3, this);

        this.leftBackWheel = new Wheel(-(this.width / 2), -(this.height / 3), this);
        this.rightBackWheel = new Wheel(this.width / 2, -(this.height / 3), this);
        this.wheels = [this.leftFrontWheel, this.rightFrontWheel, this.leftBackWheel, this.rightBackWheel];
        this.steering = new Wheels(this);
        this.steering.addFrontWheel(this.leftFrontWheel);
        this.steering.addFrontWheel(this.rightFrontWheel);

        this.steering.addBackWheel(this.leftBackWheel);
        this.steering.addBackWheel(this.rightBackWheel);

        this.frontCoord = new Coord(this.x, this.y);
        this.backCoord = new Coord(this.x, this.y);

        this.backWheelsPosition = new Coord();

        this.tick();
    }

    public steerIncrement(increment: number) {
        this.steering.increment(increment);
    }

    public blinkersLeft() {
        if (this.blinkers != 2) {
            this.blinkers = -1;
        }
    }
    public blinkersRight() {
        if (this.blinkers != 2) {
            this.blinkers = 1;
        }
    }

    public blinkersReset() {
        this.blinkers = 0;
    }

    public blinkersWarning() {
        this.blinkers = 2;
    }

    public render(env: CanvasRenderingContext2D) {
        for (const index in this.wheels) {
            this.wheels[index].render(env);
        }

        env.lineWidth = 2;
        env.strokeStyle = "#666";
        env.beginPath();
        env.moveTo(this.frontCoord.x, this.frontCoord.y);
        env.lineTo(this.backCoord.x, this.backCoord.y);
        env.stroke();

        this.steering.render(env);

        if (this.imageLoaded) {
            LoadImageToCanvas(
                env,
                this.imageObj,
                this.xpos,
                this.ypos,
                -this.heading,
                this.width / 2 + this.imageXoffset,
                this.height / 2 + this.imageYoffset
            );
        }
        //Draw braking lights:

        if (this.braking > 0) {
            // Fill with gradient
            let grd;
            console.log("строка ниже под вопросом");
            env.fillStyle = grd || "";

            env.beginPath();

            const leftLightPos = this.getPosition(-0.5 * this.length, 0.4 * this.width);
            grd = env.createRadialGradient(leftLightPos.x, leftLightPos.y, 0, leftLightPos.x, leftLightPos.y, 5);
            grd.addColorStop(0, "rgba(255,0,0,1)");
            grd.addColorStop(1, "rgba(255,0,0,0)");

            env.arc(leftLightPos.x, leftLightPos.y, 5, 0, 2 * Math.PI, false);
            env.fillStyle = grd;
            env.fill();

            const rightLightPos = this.getPosition(-0.5 * this.length, -0.4 * this.width);
            grd = env.createRadialGradient(rightLightPos.x, rightLightPos.y, 0, rightLightPos.x, rightLightPos.y, 5);
            grd.addColorStop(0, "rgba(255,0,0,1)");
            grd.addColorStop(1, "rgba(255,0,0,0)");

            env.fillStyle = grd;
            env.arc(rightLightPos.x, rightLightPos.y, 5, 0, 2 * Math.PI, false);
            env.fill();
        }
        //Draw blinkers:

        if (this.blinkers != 0) {
            this.blinkerIteration += 1;
            if (this.blinkerIteration > 20) {
                this.blinkerIteration = 1;
            }

            if (this.blinkers == -1 || this.blinkers == 2) {
                env.beginPath();
                const leftLightPos = this.getPosition(-0.47 * this.length, 0.42 * this.width);
                const grd = env.createRadialGradient(
                    leftLightPos.x,
                    leftLightPos.y,
                    0,
                    leftLightPos.x,
                    leftLightPos.y,
                    5
                );
                grd.addColorStop(0, "rgba(255,150,0," + Math.max(5 / this.blinkerIteration, 0) + ")");
                grd.addColorStop(1, "rgba(255,150,0,0)");

                env.arc(leftLightPos.x, leftLightPos.y, 5, 0, 2 * Math.PI, false);
                env.fillStyle = grd;
                env.fill();
            }

            if (this.blinkers == 1 || this.blinkers == 2) {
                env.beginPath();
                const rightLightPos = this.getPosition(-0.47 * this.length, -0.42 * this.width);
                const grd = env.createRadialGradient(
                    rightLightPos.x,
                    rightLightPos.y,
                    0,
                    rightLightPos.x,
                    rightLightPos.y,
                    5
                );
                grd.addColorStop(0, "rgba(255,150,0," + Math.max(5 / this.blinkerIteration, 0) + ")");
                grd.addColorStop(1, "rgba(255,150,0,0)");

                env.fillStyle = grd;
                env.arc(rightLightPos.x, rightLightPos.y, 5, 0, 2 * Math.PI, false);
                env.fill();
            }
        }
    }

    public brakeReverse(val: number) {
        if (this.reverse == false) {
            this.engine.trottleDownToZero(0.1);
            this.braking = 5;
            if (this.vforward < 0.01) {
                this.reverse = true;
            }
        } else {
            this.engine.trottleDown(val);
        }
    }

    public brake(power: number) {
        if (power == 0) {
            return false;
        }

        this.engine.trottleDownToZero(0.3);
        this.braking = power | 5;
        if (this.vforward < 0.001) {
            this.vforward = 0;
        }
    }

    public getPosition(relX: number, relY: number) {
        this.alpha = this.heading;
        return new Coord(
            this.xpos + relY * Math.cos(-this.alpha) - relX * Math.sin(-this.alpha),
            this.ypos + relY * Math.sin(-this.alpha) + relX * Math.cos(-this.alpha)
        );
    }

    public setPositionFromBack(ack: Coord, ackDist: number, distance: number) {
        const ackToBackDistance = ackDist;
        //Distance Back to center =
        const dBackCenter = this.steering.centerOfBackWheels;
        //Distance back to ack center
        //= ackToBackDistance
        const dCenterAck = Math.sqrt(dBackCenter * dBackCenter + ackToBackDistance * ackToBackDistance);
        //	rotation = this.heading + rotation
        //console.log( dCenterAck*Math.sin(rotation), dCenterAck*Math.cos(rotation)-this.width)
        //New coordinates are:

        this.dCenterAck = dCenterAck;

        this.backWheelsPosition = this.getPosition(this.steering.centerOfBackWheels, 0);

        const x = this.xpos - ack.x;
        const y = this.ypos - ack.y;

        const A = Math.atan2(x, y);
        //distance

        let angularSpeed;
        if (ackDist < 0) {
            angularSpeed = -(distance / (Math.PI * 2.0 * this.dCenterAck)) * Math.PI * 2;
        } else {
            angularSpeed = (distance / (Math.PI * 2.0 * this.dCenterAck)) * Math.PI * 2;
        }
        this.targetX = ack.x + dCenterAck * Math.sin(A + angularSpeed);
        this.targetY = ack.y + dCenterAck * Math.cos(A + angularSpeed);
        this.heading += angularSpeed;

        this.xpos = this.targetX;
        this.ypos = this.targetY;
    }

    public tick() {
        if (this.reverse == true && this.vforward > 0.01) {
            this.reverse = false;
        }

        if (this.braking > 0) {
            this.vforward *= 0.95;
            this.braking -= 1;
        }
        //this.steering.reduce();
        this.alpha = this.heading;
        //Calculate the coordinates of the front and back of the car :)
        let xOffset = Math.sin(this.alpha) * 0.5 * this.length;
        let yOffset = Math.cos(this.alpha) * 0.5 * this.length;

        this.frontCoord.x = xOffset + this.xpos;
        this.frontCoord.y = yOffset + this.ypos;
        this.backCoord.x = this.xpos - xOffset;
        this.backCoord.y = this.ypos - yOffset;

        this.engine.tick();
        const f = this.engine.getForce();

        this.vforward += f;
        this.vforward *= this.friction;

        const r = this.steering.steerDist;
        if (Math.abs(r) > 0 && Math.abs(r) < 1000) {
            const ackerAlphaMovement = Math.asin((0.5 * this.vforward) / r) / 2;

            this.dxAcker = r * Math.sin(ackerAlphaMovement) - r * Math.sin(0);
            this.dyAcker = r * Math.cos(ackerAlphaMovement) - r * Math.cos(0);
            this.setPositionFromBack(this.steering.getAckermanpos(), r, this.vforward);
        } else {
            this.xpos += this.vforward * Math.sin(this.heading);
            this.ypos += this.vforward * Math.cos(this.heading);
        }
        //Calculate the coordinates of the front and back of the car :)
        xOffset = Math.sin(this.alpha) * 0.5 * this.length;
        yOffset = Math.cos(this.alpha) * 0.5 * this.length;

        this.frontCoord.x = xOffset + this.xpos;
        this.frontCoord.y = yOffset + this.ypos;
        this.backCoord.x = this.xpos - xOffset;
        this.backCoord.y = this.ypos - yOffset;

        if (this.steering.steerAngle > 2) {
            this.blinkersRight();
        } else if (this.steering.steerAngle < 1) {
            this.blinkersLeft();
        } else {
            this.blinkersReset();
        }
    }
}
