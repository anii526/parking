/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export class App {
    //
}
export class Coord {
    constructor(public x = 0, public y = 0) {
        this.x = x;
        this.y = y;
    }
}

export class DriveRoutePoint {
    constructor(public x = 0, public y = 0, public isFinal = false) {
        this.x = x;
        this.y = y;
        this.isFinal = isFinal;
    }
    public render(env: any): void {
        env.fillStyle = "rgba(30,120,0,0.8)";
        env.rect(this.x - 5, this.y - 5, 10, 10);
        env.fill();
    }
}

export class CanvasFunctions {
    public static getMousePos = (canvas: any, evt: any) => {
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
function LoadImageToCanvas(
    env: any,
    imageObj: any,
    positionX: any,
    positionY: any,
    angleInRad: any,
    axisX: any,
    axisY: any
) {
    env.translate(positionX, positionY);
    env.rotate(angleInRad);
    env.drawImage(imageObj, -axisX, -axisY);
    env.rotate(-angleInRad);
    env.translate(-positionX, -positionY);
}

export class Wheel {
    public parent: any;
    public xoffset: any;
    public yoffset: any;
    public length = 10;
    public maxAngle = Math.PI * 0.35;
    public minAngle = -Math.PI * 0.35;

    public heading = 0;
    public vr = 0; //Rotational speed
    public boundTo: any[];
    public frontCoord: any;
    public backCoord: any;
    public center: any;
    public alpha = 1;
    constructor(yoffset: any, xoffset: any, parent: any) {
        this.parent = parent;
        this.xoffset = xoffset;
        this.yoffset = yoffset;
        this.length = 10;
        this.maxAngle = Math.PI * 0.35;
        this.minAngle = -Math.PI * 0.35;

        this.heading = 0;
        this.vr = 0; //Rotational speed
        this.boundTo = [];

        this.frontCoord = new Coord();
        this.backCoord = new Coord();
        this.center = new Coord();
    }
    public bindTo(obj: any) {
        this.boundTo.push(obj);
    }
    public rotateTo(newHeading: any) {
        this.heading = newHeading;
        for (const index in this.boundTo) {
            this.boundTo[index].rotateTo(newHeading);
        }
    }

    public increment(value: any) {
        this.rotateTo(value);
        //this.rotateTo( Math.max( Math.min(this.heading + value, this.maxAngle), this.minAngle))
    }

    public render(env: any) {
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
    public setTrottle(amount: any) {
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
    public trottleUp(amount: any) {
        if (this.trottle + amount <= 1) {
            this.trottle += amount;
        } else {
            this.trottle = 1;
        }
        this.update();
    }
    public trottleDown(amount: any) {
        if (this.trottle - amount >= 0) {
            this.trottle -= amount;
        } else {
            if (this.trottle - amount > -1) {
                this.trottle -= amount;
            }
        }
        this.update();
    }
    public trottleDownToZero(amount: any) {
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

function Wheels(parent) {
    this.mindrivingCircle = 80;
    this.frontWheels = [];
    this.backWheels = [];
    this.steerDist = 0;
    this.parent = parent;
    this.addFrontWheel = function (wheel) {
        this.frontWheels.push(wheel);
        this.update();
    };

    this.addBackWheel = function (wheel) {
        this.backWheels.push(wheel);
        this.update();
    };
    this.steerToDist = function (dist) {
        this.steerDist = dist;
        for (var index in this.frontWheels) {
            var targetAngle = Math.atan(
                (this.centerOfBackWheels - this.frontWheels[index].xoffset) / (this.frontWheels[index].yoffset - dist)
            );

            this.frontWheels[index].rotateTo(targetAngle);
        }
    };

    this.increment = function (val) {
        if (this.steerAngle + val > Math.PI) {
            newSteerAngle = -this.steerAngle + val;
        } else {
            newSteerAngle = this.steerAngle + val;
        }

        var ackDistance = Math.tan(newSteerAngle) * 100;
        if (Math.abs(ackDistance) > this.mindrivingCircle) {
            this.steerAngle = newSteerAngle;
            this.steerToDist(ackDistance);
        }
        //Angle of steer to ackerman distance:
    };

    //reduce to zero
    this.reduce = function (val) {
        val = val || 1.05;

        //this.steerAngle = Math.atan(this.steerDist)/100

        if (Math.abs(this.steerDist * val) <= 1100) {
            this.steerDist *= val;
            this.steerToDist(this.steerDist);
        }
    };

    this.steerAngle = 0.5 * Math.PI;

    this.incrementDistance = function (val) {
        this.steerDist += val;
        this.steerToDist(this.steerDist);
    };

    this.update = function () {
        //Center of back wheels (x)
        sum = 0;
        totalBackWheels = 0;
        for (var index in this.backWheels) {
            totalBackWheels += 1;
            sum += this.backWheels[index].xoffset;
        }
        if (totalBackWheels > 0) {
            this.centerOfBackWheels = sum / totalBackWheels;
        }
        //Anckerman center:
    };

    this.render = function (env) {
        //Do not draw debug:
        //return(true)

        var anckermanPos = this.parent.getPosition(this.centerOfBackWheels, this.steerDist);
        if (this.getAckermanRadius() > 1 && this.getAckermanRadius() < 1000) {
            var ackermanCenter = this.getAckermanpos();

            env.beginPath();
            //console.log(this.getAckermanRadius())
            env.arc(ackermanCenter.x, ackermanCenter.y, 2, 0, 2 * Math.PI, false);
            env.stroke();

            for (index in this.frontWheels) {
                env.lineWidth = 0.5;
                env.strokeStyle = "rgba(200,200,200,0.9)";
                env.beginPath();
                env.moveTo(this.frontWheels[index].center.x, this.frontWheels[index].center.y);
                env.lineTo(anckermanPos.x, anckermanPos.y);
                env.stroke();
            }

            env.beginPath();
            //console.log(this.getAckermanRadius())
            env.arc(anckermanPos.x, anckermanPos.y, this.getAckermanRadius(), 0, 2 * Math.PI, false);
            env.stroke();
        }
    };
    this.getAckermanpos = function () {
        return this.parent.getPosition(this.centerOfBackWheels, this.steerDist);
    };
    this.getRelativeAckermanPos = function () {
        return new Coord(this.centerOfBackWheels, this.steerDist);
    };

    this.getAckermanRadius = function () {
        return Math.abs(this.steerDist);
    };
}

document.loadedImages = {};
function Car() {
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
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    var parent = this;
    this.imageObj.onload = function () {
        parent.imageLoaded = true;
        console.log(this.src);
    };

    //Following determines the car sizes (pixels):
    this.height = 190 / 2;
    this.length = this.height;
    this.width = 45;

    this.leftFrontWheel = new Wheel(-(this.width / 2), this.height / 3, this);
    this.rightFrontWheel = new Wheel(this.width / 2, this.height / 3, this);

    //this.midLeftFrontWheel = new Wheel(-(this.width/2), this.height/6, this)
    //this.midRightFrontWheel = new Wheel((this.width/2), this.height/6, this)

    //this.leftFrontWheel.bindTo(this.rightFrontWheel)
    this.leftBackWheel = new Wheel(-(this.width / 2), -(this.height / 3), this);
    this.rightBackWheel = new Wheel(this.width / 2, -(this.height / 3), this);
    this.wheels = [this.leftFrontWheel, this.rightFrontWheel, this.leftBackWheel, this.rightBackWheel];
    this.steering = new Wheels(this);
    this.steering.addFrontWheel(this.leftFrontWheel);
    this.steering.addFrontWheel(this.rightFrontWheel);

    //this.steering.addFrontWheel(this.midLeftFrontWheel);
    //this.steering.addFrontWheel(this.midRightFrontWheel);

    this.steering.addBackWheel(this.leftBackWheel);
    this.steering.addBackWheel(this.rightBackWheel);

    this.steerIncrement = function (increment) {
        //this.leftFrontWheel.increment(increment);
        this.steering.increment(increment);
    };

    this.blinkersLeft = function () {
        if (this.blinkers != 2) {
            this.blinkers = -1;
        }
    };
    this.blinkersRight = function () {
        if (this.blinkers != 2) {
            this.blinkers = 1;
        }
    };

    this.blinkersReset = function () {
        this.blinkers = 0;
    };

    this.blinkersWarning = function () {
        this.blinkers = 2;
    };

    this.render = function (env) {
        for (var index in this.wheels) {
            this.wheels[index].render(env);
        }

        env.lineWidth = 2;
        env.strokeStyle = "#666";
        env.beginPath();
        env.moveTo(this.frontCoord.x, this.frontCoord.y);
        env.lineTo(this.backCoord.x, this.backCoord.y);
        env.stroke();

        /*
    env.strokeStyle = "#2222FF";
    env.lineWidth = 1
    env.beginPath();
    //console.log(this.getAckermanRadius())
    ack = this.steering.getAckermanpos()
    env.arc(ack.x, ack.y, this.dCenterAck, 0, 2*Math.PI, false)
    env.stroke()*/

        /*
    env.lineWidth =2
    env.strokeStyle = "#FF2222";
    env.beginPath();
          env.moveTo(this.xpos, this.ypos);
          env.lineTo(this.targetX, this.targetY);
          env.stroke();*/
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
            env.fillStyle = grd;

            env.beginPath();

            var leftLightPos = this.getPosition(-0.5 * this.length, 0.4 * this.width);
            var grd = env.createRadialGradient(leftLightPos.x, leftLightPos.y, 0, leftLightPos.x, leftLightPos.y, 5);
            grd.addColorStop(0, "rgba(255,0,0,1)");
            grd.addColorStop(1, "rgba(255,0,0,0)");

            env.arc(leftLightPos.x, leftLightPos.y, 5, 0, 2 * Math.PI, false);
            env.fillStyle = grd;
            env.fill();

            var rightLightPos = this.getPosition(-0.5 * this.length, -0.4 * this.width);
            var grd = env.createRadialGradient(
                rightLightPos.x,
                rightLightPos.y,
                0,
                rightLightPos.x,
                rightLightPos.y,
                5
            );
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
                var leftLightPos = this.getPosition(-0.47 * this.length, 0.42 * this.width);
                var grd = env.createRadialGradient(
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
                var rightLightPos = this.getPosition(-0.47 * this.length, -0.42 * this.width);
                var grd = env.createRadialGradient(
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
    };

    this.brakeReverse = function (val) {
        if (this.reverse == false) {
            this.engine.trottleDownToZero(0.1);
            this.braking = 5;
            if (this.vforward < 0.01) {
                this.reverse = true;
            }
        } else {
            this.engine.trottleDown(val);
        }
    };

    this.brake = function (power) {
        if (power == 0) {
            return false;
        }

        this.engine.trottleDownToZero(0.3);
        this.braking = power | 5;
        if (this.vforward < 0.001) {
            this.vforward = 0;
        }
    };

    this.getPosition = function (relX, relY) {
        this.alpha = this.heading;
        /*
    this.componentAlpha = Math.PI - this.alpha - Math.atan(relX / relY)
     this.component = Math.cos(this.componentAlpha)*relY
    //Calculate the coordinates of the front and back of the car :)
    return( new Coord( this.xpos + Math.cos(this.componentAlpha)*this.component, this.ypos + Math.sin(this.componentAlpha)*this.component));		
    */
        return new Coord(
            this.xpos + relY * Math.cos(-this.alpha) - relX * Math.sin(-this.alpha),
            this.ypos + relY * Math.sin(-this.alpha) + relX * Math.cos(-this.alpha)
        );
    };

    this.setPositionFromBack = function (ack, ackDist, distance) {
        //ack.x = ack.x - this.backCoord.x;
        //ack.y = ack.y - this.backCoord.y;

        var ackToBackDistance = ackDist;
        //Distance Back to center =
        var dBackCenter = this.steering.centerOfBackWheels;
        //Distance back to ack center
        //= ackToBackDistance
        var dCenterAck = Math.sqrt(dBackCenter * dBackCenter + ackToBackDistance * ackToBackDistance);
        //	rotation = this.heading + rotation
        //console.log( dCenterAck*Math.sin(rotation), dCenterAck*Math.cos(rotation)-this.width)
        //New coordinates are:

        this.dCenterAck = dCenterAck;

        this.backWheelsPosition = this.getPosition(this.steering.centerOfBackWheels, 0);

        var x = this.xpos - ack.x;
        var y = this.ypos - ack.y;

        var A = Math.atan2(x, y);
        //distance

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

        //console.log(dCenterAck*Math.cos(rotation))
        //this.ypos += dCenterAck*Math.cos(rotation)
    };

    this.frontCoord = new Coord(this.x, this.y);
    this.backCoord = new Coord(this.x, this.y);

    this.tick = function () {
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
        xOffset = Math.sin(this.alpha) * 0.5 * this.length;
        yOffset = Math.cos(this.alpha) * 0.5 * this.length;

        this.frontCoord.x = xOffset + this.xpos;
        this.frontCoord.y = yOffset + this.ypos;
        this.backCoord.x = this.xpos - xOffset;
        this.backCoord.y = this.ypos - yOffset;

        this.engine.tick();
        var f = this.engine.getForce();

        this.vforward += f;
        this.vforward *= this.friction;

        var r = this.steering.steerDist;
        if (Math.abs(r) > 0 && Math.abs(r) < 1000) {
            var ackerAlphaMovement = Math.asin((0.5 * this.vforward) / r) / 2;

            this.dxAcker = r * Math.sin(ackerAlphaMovement) - r * Math.sin(0);
            this.dyAcker = r * Math.cos(ackerAlphaMovement) - r * Math.cos(0);
            this.setPositionFromBack(this.steering.getAckermanpos(), r, this.vforward);

            //this.xpos += this.dxAcker
            //this.ypos += this.dyAcker

            if (iterations % 10 == 0) {
                //console.log(this.steering.getRelativeAckermanPos())
                //console.log(this.vforward)
                //console.log(this.dyAcker, this.dxAcker)
            }
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
    };
    this.tick();
}

function getShortAngle(a1, a2) {
    return Math.cos(a1 - a2 + Math.PI / 2);
}

function Driver(car) {
    this.car = car;
    //this.driveRoute = [new DriveRoutePoint(300,300), new DriveRoutePoint(100,300), new DriveRoutePoint(100,100), new DriveRoutePoint(300,300)  ]
    this.driveRoute = [new DriveRoutePoint(300, 300)];

    this.reachedTarget = true;
    this.breakOnEnd = false;

    this.breakingDistance = 300; //30
    this.slowSpeed = 0.3;
    this.normalSpeed = 5;
    this.targetReachedDistance = 170; //15

    this.chooseTurnAround = function () {
        //
    };

    this.tick = function () {
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

        //Calculate desired heading to target:
        this.headingToTarget = Math.atan2(this.currentTarget.x - this.car.xpos, this.currentTarget.y - this.car.ypos);

        //Calculate the difference in heading:
        this.headingDelta = this.car.heading - this.headingToTarget;

        //Calculate the distance to the target:
        this.distanceToTarget = Math.sqrt(
            Math.pow(this.car.xpos - this.currentTarget.x, 2) + Math.pow(this.car.ypos - this.currentTarget.y, 2)
        );

        if (this.distanceToTarget <= this.targetReachedDistance) {
            this.reachedTarget = true;

            if (this.car.vforward > 0) {
                this.car.brake(1);
                this.car.engine.setTrottle(0);
            }

            this.gotoNextTarget(this.currentTarget.isFinal);
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

        //if (Math.abs(this.steeringDelta)>2) {
        //this.car.steering.increment(0.1)
        //} else {

        this.car.steering.increment(this.steeringCorrection);
        //}
    };

    this.popNextTarget = function () {
        return this.driveRoute.shift();
    };

    this.gotoNextTarget = function () {
        var target = this.popNextTarget();
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
    };
    this.gotoNextTarget();

    this.setTarget = function (coord) {
        this.reachedTarget = false;
        this.currentTarget = coord;
    };

    this.render = function (env) {
        env.lineWidth = 2;
        env.strokeStyle = "rgba(80,255,80,0.4)";
        env.beginPath();
        env.moveTo(this.car.xpos, this.car.ypos);
        env.lineTo(this.currentTarget.x, this.currentTarget.y);
        env.stroke();

        /*
    env.font="20px Georgia";
    env.fillText(this.steeringDelta,this.car.xpos+30,this.car.ypos+30);
    */
        for (var index in this.driveRoute) {
            this.driveRoute[index].render(env);
        }
    };
}

// function subdivideOver(xStart, yStart, xEnd, yEnd, minDistance) {
//     var angle = Math.atan2(xEnd - xStart, yEnd - yStart);
//     var distance = Math.sqrt(Math.pow(xEnd - xStart, 2) + Math.pow(yEnd - yStart, 2));
//     // var amount = Math.floor(distance / minDistance);
//     var coords = [];
//     for (var d = 0; d < distance; d += minDistance) {
//         //Precalc cos and sin to make this faster :)
//         //console.log(d)
//         coords.push(new Coord(xStart + Math.sin(angle) * d, yStart + Math.cos(angle) * d));
//     }
//     return coords;
// }

Wegmeubulair = {};

Wegmeubulair.pylon = function (x, y, rotation) {
    this.xpos = x || 30;
    this.ypos = y || 30;
    this.rotation = rotation | 0;
    console.log(x, y);
    this.render = function (env) {
        env.strokeStyle = "#AA0000";
        env.lineWidth = 2;
        env.beginPath();
        env.rect(this.xpos - 3.0, this.ypos - 3.0, 6, 6);
        env.stroke();
    };
    this.tick = function () {
        //
    };
};

Wegmeubulair.tarmac10 = function (x, y, rotation) {
    this.xpos = x || 10;
    this.ypos = y || 10;
    this.rotation = rotation | 0;
    console.log(x, y);
    this.render = function (env) {
        env.strokeStyle = "#AA0000";
        env.lineWidth = 2;
        env.beginPath();
        env.rect(this.xpos - 3.0, this.ypos - 3.0, 6, 6);
        env.stroke();
    };
    this.tick = function () {
        this.xpos += 0.01;
    };
};

/*
Wegmeubulair_pylonnen = function(xStart, yStart, xEnd, yEnd, distanceBetween){		
    this.xStart = xStart;
    this.yStart = yStart;
    this.xEnd = xEnd;
    this.yEnd = yEnd;
    this.pylonPositions = subdivideOver(xStart, yStart, xEnd, yEnd, distanceBetween)		
    this.render = function(env){
        env.strokeStyle = "#AA0000";
        env.lineWidth=2;
        for(var i in this.pylonPositions){
            env.beginPath();			
            env.rect(this.pylonPositions[i].x-3,this.pylonPositions[i].y-3,6,6);
            env.stroke();
        }			


    }	
    

}

*/

// function RoutePoint(x, y, id) {
//     this.id = id || "unset";
//     this.position = new Coord(x, y);
//     this.render = function (env) {
//         env.strokeStyle = "#666666";
//         env.fillStyle = "#666666";
//         env.lineWidth = 1;
//         env.beginPath();
//         //console.log(this.getAckermanRadius())
//         env.arc(this.position.x, this.position.y, 3, 0, 2 * Math.PI, false);
//         env.stroke();
//         env.fill();
//     };
//     this.setId = function (id) {
//         this.id = id;
//     };
// }

// function Route(id) {
//     this.points = {};
//     this.id = id;
//     this.pointIdPosition = 0;
//     this.addPoint = function (routePoint) {
//         this.points[this.pointIdPosition] = routePoint;
//         this.pointIdPosition++;
//     };
// }

// function Routes() {
//     //
// }

// function RoadSection(id) {
//     this.width = 200;
//     this.height = 200;

//     this.tick = function () {};

//     this.render = function () {};
// }

function Level() {
    /*
//w = new Wegmeubulair();
this.objects = []

//Vak:
this.objects.push(new Wegmeubulair_pylonnen(200,200,250,200, 20))
this.objects.push(new Wegmeubulair_pylonnen(250,220,250,400, 20))
*/

    this.render = function (env) {
        for (var index in this.objects) {
            this.objects[index].render(env);
        }
    };
}

EditorModi = {};
EditorModi.array = function () {
    this.pointA = Coord();
    this.pointB = Coord();

    this.render = function () {
        //
    };

    this.leftClick = function (position, n) {
        if (n == 0) {
            this.pointA.x = position.x;
            this.pointA.y = position.y;
        }
        if (n == 1) {
            this.pointB.x = position.x;
            this.pointB.y = position.y;
        }
    };
};

AvailableObjects = {
    Wegmeubulair: {
        name: "Wegmeubulair",
        contents: Wegmeubulair,
    },
};

// function Editor(appendTo, canvii) {
//     $(appendTo).append('<div id="editor"></div>');

//     this.modi = ["place", "place_array"];
//     this.modus = "place_array";

//     //Array tool:
//     this.pointA = new Coord();
//     this.pointB = new Coord();
//     this.timesClicked = 0;

//     this.processArrayToolClick = function (x, y) {
//         if (this.selectedCatalogObject == undefined) {
//             this.timesClicked = 0;
//             return 0;
//         }

//         this.timesClicked++;
//         if (this.timesClicked == 1) {
//             console.log(this);
//             this.pointA.x = x;
//             this.pointA.y = y;
//         }
//         if (this.timesClicked == 2) {
//             this.pointB.x = x;
//             this.pointB.y = y;

//             var points = subdivideOver(this.pointA.x, this.pointA.y, this.pointB.x, this.pointB.y, 25);
//             for (var index in points) {
//                 world.addObject(new this.selectedCatalogObject(points[index].x, points[index].y));
//             }
//             this.timesClicked = 0;
//         }
//     };

//     this.mouseDown = function (x, y) {
//         if (this.modus == "place") {
//             world.addObject(new this.selectedCatalogObject(x, y));
//         }

//         if (this.modus == "place_array") {
//             this.processArrayToolClick(x, y);
//         }
//     };

//     this.drawCatalog = function () {
//         this.html = "";
//         for (var groupId in AvailableObjects) {
//             this.html += '<div class="editorCatalogGroup"><h3>' + AvailableObjects[groupId].name + "</h3>";

//             for (var objectId in AvailableObjects[groupId].contents) {
//                 this.html +=
//                     '<div class="editorCatalogObject" id="' +
//                     groupId +
//                     "_" +
//                     objectId +
//                     '">' +
//                     objectId +
//                     '<canvas id="canvas_' +
//                     groupId +
//                     "_" +
//                     objectId +
//                     '">width="75px" height="75px"></canvas></div>';
//             }
//             this.html += "</div>";
//         }
//         $("#editor").html(this.html);

//         for (var groupId in AvailableObjects) {
//             for (var objectId in AvailableObjects[groupId].contents) {
//                 var canvasContext = document.getElementById("canvas_" + groupId + "_" + objectId).getContext("2d");
//                 var o = new AvailableObjects[groupId].contents[objectId]();
//                 o.render(canvasContext);
//             }
//         }

//         $(".editorCatalogObject").on("click", function (e, i) {
//             document.editor.setSelectedCatalogObject(e.currentTarget.id);
//         });

//         this.selectedCatalogObject = false;
//         this.setSelectedCatalogObject = function (id) {
//             var parts = id.split("_");
//             this.selectedCatalogObject = AvailableObjects[parts[0]].contents[parts[1]];
//             console.log("Selected " + id + " from the catalog");
//         };
//     };

//     this.drawCatalog();
// }

function World() {
    this.translateX = 0;
    this.translateY = 0;
    this.viewCenterX = canvas.width / 2;
    this.viewCenterY = canvas.height / 2;
    this.targetFrameTime = 40; //Time in milisec per frame, to set FPS to 60 = 1000/60 => 16.6, 24 fps => 41

    this.maxParticles = 10000;
    this.objects = [];
    this.particles = [];
    this.recalculateWorld = false;

    this.tick = function () {
        var date = new Date();
        var tickStart = date.getMilliseconds();

        //Recalculate all object id's
        if (this.recalculateWorld) {
            var newObjects = [];
            var pointer = 0;
            for (var objectIndex in this.objects) {
                if (this.objects[objectIndex] != null) {
                    newObjects.push(this.objects[objectIndex]);
                    this.objects[objectIndex].worldId = pointer;
                    pointer++;
                }
            }
            this.objects = newObjects;
        }

        for (var objectIndex in this.objects) {
            if (this.objects[objectIndex] != null) {
                this.objects[objectIndex].tick();
            }
        }

        for (var particleIndex in this.particles) {
            if (this.objects[objectIndex] != null) {
                this.particles[particleIndex].tick();
            }
        }

        var date = new Date();
        var tickEnd = date.getMilliseconds();

        this.render(tickEnd - tickStart);
    };

    this.render = function (tickTime) {
        var date = new Date();
        var frameStart = date.getMilliseconds();
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

        var cellSize = 100;

        for (var y = this.minY - (this.viewCenterY % cellSize); y < this.maxY; y += cellSize) {
            context.beginPath();
            context.moveTo(this.minX, y);
            context.lineTo(this.maxX, y);
            context.stroke();
        }

        for (var x = this.minX - (this.viewCenterX % cellSize); x < this.maxX; x += cellSize) {
            context.beginPath();
            context.moveTo(x, this.minY);
            context.lineTo(x, this.maxY);
            context.stroke();
        }

        for (var particleIndex in this.particles) {
            if (this.particles[particleIndex] != null) {
                this.particles[particleIndex].render();
            }
        }

        for (var objectIndex in this.objects) {
            if (this.objects[objectIndex] != null) {
                this.objects[objectIndex].render(context);
            }
        }

        var endDate = new Date();
        var frameStop = endDate.getMilliseconds();
        var frameTime = frameStop - frameStart;
        //context.font="30px Arial";
        //context.fillText(frameTime + " / " + tickTime,playerOrganism.physics.xpos, playerOrganism.physics.ypos);

        self = this;
        var timeout = this.targetFrameTime - frameTime - tickTime;
        if (timeout <= 0 || timeout > this.targetFrameTime) {
            setTimeout(function () {
                self.tick();
            }, 1);
        } else {
            setTimeout(function () {
                self.tick();
            }, timeout);
        }
    };

    this.addParticle = function (particle) {
        this.particles.push(particle);
        if (this.particles.length - 1 >= this.maxParticles) {
            this.particles.shift();
        }
    };

    this.addObject = function (objectToAdd) {
        this.objects.push(objectToAdd);
        objectToAdd.worldId = this.objects.length - 1;
    };

    this.removeObject = function (id) {
        this.recalculateWorld = true;
        this.objects[id] = null;
    };
}

$(document).ready(function () {
    canvas = document.getElementById("sim");
    var ctx = canvas.getContext("2d");
    context = ctx;
    //document.editor = new Editor('.simWrapper')
    car = new Car();
    level = new Level();
    world = new World();

    aiCar = new Car();
    driver = new Driver(aiCar);

    world.addObject(aiCar);
    world.addObject(driver);

    aiCar2 = new Car();
    driver2 = new Driver(aiCar2);
    aiCar2.xpos = 0;
    aiCar2.ypos = 0;

    world.addObject(aiCar2);
    world.addObject(driver2);

    canvas.addEventListener("mousemove", function (evt) {
        var mousePos = CanvasFunctions.getMousePos(canvas, evt);

        var mouseX = world.viewCenterX - canvas.width * 0.5 + mousePos.x;
        var mouseY = world.viewCenterY - canvas.height * 0.5 + mousePos.y;
        context.rect(mouseX - 3, mouseY - 3, 3, 3);
        context.stroke();
    });

    canvas.addEventListener(
        "click",
        function (evt) {
            var mousePos = CanvasFunctions.getMousePos(canvas, evt);

            mouseX = mousePos.x + world.viewCenterX - canvas.width * 0.5;
            mouseY = mousePos.y + world.viewCenterY - canvas.height * 0.5;

            console.log(world.viewCenterX + ", " + canvas.width * 0.5);
            var message = "Mouse position: " + mousePos.x + "," + mousePos.y + ":" + mouseX + ", " + mouseY;
            //document.editor.mouseDown(mouseX,mouseY)

            console.log(message);
        },
        false
    );

    var pressedKeys = {};

    $(document).keydown(function (e) {
        pressedKeys[e.keyCode] = true;
    });

    $(document).keyup(function (e) {
        delete pressedKeys[e.keyCode];
    });

    iterations = 0;
    testAngle = 0;
    car.xpos = 300;

    world.addObject(car);

    setTarget = false;
    setInterval(function () {
        //ctx.clearRect(0,0,1000,1000);

        //Camera movement:
        var distanceX = Math.abs(car.xpos - world.viewCenterX);
        if (distanceX > 4) {
            var xspeed = 0.0004 * Math.pow(distanceX, 2);
            if (car.xpos > world.viewCenterX) {
                world.translateX = -xspeed;
            }
            if (car.xpos < world.viewCenterX) {
                world.translateX = xspeed;
            }
        } else {
            world.translateX = 0;
        }

        var distanceY = Math.abs(car.ypos - world.viewCenterY);
        if (distanceY > 4) {
            var yspeed = 0.0003 * Math.pow(distanceY, 2);
            if (car.ypos > world.viewCenterY) {
                world.translateY = -yspeed;
            }
            if (car.ypos < world.viewCenterY) {
                world.translateY = yspeed;
            }
        } else {
            world.translateY = 0;
        }

        //world.render();
        //level.render(ctx)

        iterations++;
        //car.heading+=0.01;

        if (pressedKeys[39]) {
            car.steerIncrement(0.05);
        }
        if (pressedKeys[37]) {
            car.steerIncrement(-0.05);
        }

        if (pressedKeys[38]) {
            car.engine.trottleUp(0.01);
        }

        if (pressedKeys[40]) {
            car.brakeReverse(0.01);
        }

        if (car.xpos && setTarget == false) {
            driver2.setTarget(new DriveRoutePoint(aiCar.xpos, aiCar.ypos, 0));
            driver2.reachedTarget = false;

            driver.setTarget(new DriveRoutePoint(car.xpos, car.ypos, 0));
            driver.reachedTarget = false;
            setTarget = false;
        }
    }, 50);
    world.tick();
});
