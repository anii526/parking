/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
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
