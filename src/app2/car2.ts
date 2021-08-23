export class Car2 {
    public carSpeed = 0;

    public frontWheelX = 0;
    public frontWheelY = 0;

    public backWheelX = 0;
    public backWheelY = 0;

    public wheelBase = 10;

    public carHeading = 0;
    public steerAngle = 0;

    public carLocationX = 0;
    public carLocationY = 0;

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    update(carLocationX: number, carLocationY: number, dt: number) {
        this.carLocationX = carLocationX;
        this.carLocationY = carLocationY;
        // this.carHeading = carHeading;
        this.frontWheelX = this.carLocationX + (this.wheelBase / 2) * Math.cos(this.carHeading);
        this.frontWheelY = this.carLocationY + (this.wheelBase / 2) * Math.sin(this.carHeading);

        this.backWheelX = this.carLocationX - (this.wheelBase / 2) * Math.cos(this.carHeading);
        this.backWheelY = this.carLocationY - (this.wheelBase / 2) * Math.sin(this.carHeading);

        this.backWheelX += this.carSpeed * dt * Math.cos(this.carHeading);
        this.backWheelY += this.carSpeed * dt * Math.sin(this.carHeading);

        this.frontWheelX += this.carSpeed * dt * Math.cos(this.carHeading + this.steerAngle);
        this.frontWheelY += this.carSpeed * dt * Math.sin(this.carHeading + this.steerAngle);

        this.carLocationX = (this.frontWheelX + this.backWheelX) / 2;
        this.carLocationY = (this.frontWheelY + this.backWheelY) / 2;

        this.carHeading = Math.atan2(this.frontWheelY - this.backWheelY, this.frontWheelX - this.backWheelX);

        return { carLocationX: this.carLocationX, carLocationY: this.carLocationY, carHeading: this.carHeading };
    }
}
