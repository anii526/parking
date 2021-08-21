import { canvas, context } from "..";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
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

export function getShortAngle(a1: number, a2: number) {
    return Math.cos(a1 - a2 + Math.PI / 2);
}

export class Driver {
    public car: Car;
    public driveRoute: DriveRoutePoint[];

    public reachedTarget = true;
    public breakOnEnd = false;

    public breakingDistance = 300; //30
    public slowSpeed = 0.3;
    public normalSpeed = 5;
    public targetReachedDistance = 170; //15
    public currentTarget?: DriveRoutePoint;
    public headingToTarget = 0;
    public headingDelta = 0;
    public distanceToTarget = 0;
    public steeringDelta: any;
    public steeringCorrection: any;
    public sharpestSteeringCorrection: any;
    public brakeOnEnd: any;
    constructor(car: Car) {
        this.car = car;
        this.driveRoute = [new DriveRoutePoint(300, 300)];

        this.reachedTarget = true;
        this.breakOnEnd = false;

        this.breakingDistance = 300; //30
        this.slowSpeed = 0.3;
        this.normalSpeed = 5;
        this.targetReachedDistance = 170; //15
        this.gotoNextTarget();
    }

    public chooseTurnAround() {
        //
    }

    public tick() {
        if (this.reachedTarget == true) {
            if (this.car.vforward > 0) {
                this.car.engine.setTrottle(0);
                this.car.brake(1);
            } else {
                this.car.engine.setTrottle(0);
                this.car.brake(0);
            }

            return false;
        }

        if (this.currentTarget) {
            //Calculate desired heading to target:
            this.headingToTarget = Math.atan2(
                this.currentTarget.x - this.car.xpos,
                this.currentTarget.y - this.car.ypos
            );
        }
        //Calculate the difference in heading:
        this.headingDelta = this.car.heading - this.headingToTarget;

        if (this.currentTarget) {
            //Calculate the distance to the target:
            this.distanceToTarget = Math.sqrt(
                Math.pow(this.car.xpos - this.currentTarget.x, 2) + Math.pow(this.car.ypos - this.currentTarget.y, 2)
            );
        }

        if (this.distanceToTarget <= this.targetReachedDistance) {
            this.reachedTarget = true;

            if (this.car.vforward > 0) {
                this.car.brake(1);
                this.car.engine.setTrottle(0);
            }

            this.gotoNextTarget();
        }

        if (this.reachedTarget == true) {
            return false;
        }

        //Do we stand still and do we need to drive?
        if (this.distanceToTarget >= this.breakingDistance && this.car.vforward < this.normalSpeed) {
            this.car.engine.trottleUp(0.02);
        }

        if (this.distanceToTarget < this.breakingDistance) {
            if (this.car.vforward > this.slowSpeed) {
                if (this.car.vforward > this.slowSpeed * 2) {
                    this.car.brake(0.98);
                }

                this.car.brake(0.3);
            } else {
                this.car.engine.trottleUp(0.05);
            }
        }

        //Steer the wheels;
        //High heading delta = sharp steering, low: center the steering

        this.steeringDelta = getShortAngle(
            this.headingToTarget,
            this.car.heading - this.car.steering.steerAngle + 0.5 * Math.PI
        );

        this.steeringCorrection = this.steeringDelta * 0.6;

        this.sharpestSteeringCorrection = 0.2;

        if (this.steeringCorrection > this.sharpestSteeringCorrection) {
            this.steeringCorrection = this.sharpestSteeringCorrection;
        }

        if (this.steeringCorrection < -this.sharpestSteeringCorrection) {
            this.steeringCorrection = -this.sharpestSteeringCorrection;
        }

        this.car.steering.increment(this.steeringCorrection);
    }

    public popNextTarget() {
        return this.driveRoute.shift();
    }

    public gotoNextTarget() {
        const target = this.popNextTarget();
        if (target) {
            this.currentTarget = target;
            this.reachedTarget = false;
        } else {
            if (this.brakeOnEnd) {
                this.car.engine.trottleDown(0.9);
                this.car.brake(1);
            }
            this.car.blinkersWarning();
        }
    }

    public setTarget(coord: DriveRoutePoint) {
        this.reachedTarget = false;
        this.currentTarget = coord;
    }

    public render(env: CanvasRenderingContext2D) {
        env.lineWidth = 2;
        env.strokeStyle = "rgba(80,255,80,0.4)";
        env.beginPath();
        env.moveTo(this.car.xpos, this.car.ypos);
        if (this.currentTarget) {
            env.lineTo(this.currentTarget.x, this.currentTarget.y);
        }
        env.stroke();

        for (const index in this.driveRoute) {
            this.driveRoute[index].render(env);
        }
    }
}

export class World {
    public translateX: number;
    public translateY: number;
    public viewCenterX: number;
    public viewCenterY: number;
    public targetFrameTime: number;
    public maxParticles: number;
    public objects: Array<Car | Driver>;
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
        //context.font="30px Arial";
        //context.fillText(frameTime + " / " + tickTime,playerOrganism.physics.xpos, playerOrganism.physics.ypos);

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

    public addObject(objectToAdd: Car | Driver) {
        this.objects.push(objectToAdd);
    }
}
