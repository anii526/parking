import { Car } from "./car";
import { DriveRoutePoint, getShortAngle } from "./app";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
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
    public steeringDelta = 0;
    public steeringCorrection = 0;
    public sharpestSteeringCorrection = 0;
    public brakeOnEnd = false;
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
