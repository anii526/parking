export class DriveRoutePoint {
    constructor(public x = 0, public y = 0, public isFinal = false) {}
    public render(env: CanvasRenderingContext2D): void {
        env.fillStyle = "rgba(30,120,0,0.8)";
        env.rect(this.x - 5, this.y - 5, 10, 10);
        env.fill();
    }
}
