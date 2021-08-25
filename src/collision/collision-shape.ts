/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as PIXI from "pixi.js";
import { Edge } from "./edge";
export class CollisionShape {
    public edges: Edge[];
    public points: PIXI.Point[];
    public AABB: PIXI.Rectangle;
    public bounds: PIXI.Bounds;
    public intersectionPoint: PIXI.Point;
    public target: PIXI.Sprite;
    public vertices: PIXI.Point[];
    constructor(target: PIXI.Sprite, vertices: PIXI.Point[]) {
        this.edges = [];
        this.points = [];
        this.AABB = new PIXI.Rectangle();
        this.bounds = new PIXI.Bounds();
        this.intersectionPoint = new PIXI.Point();
        this.target = target;
        this.vertices = vertices;

        for (let i = 0; i < vertices.length; i++) {
            const p1 = vertices[i];
            const p2 = vertices[i + 1] || vertices[0];
            this.points.push(p1.clone());
            this.edges.push(new Edge(p1, p2));
        }

        this.update();
    }
    public update() {
        const transform = this.target.transform.worldTransform;
        const vertices = this.vertices;
        const points = this.points;
        const bounds = this.bounds;

        bounds.clear();

        for (let i = 0; i < points.length; i++) {
            const vertex = transform.apply(points[i], vertices[i]);
            bounds.addPoint(vertex);
        }

        bounds.getRectangle(this.AABB);
    }

    public intersectsAABB(shape: CollisionShape) {
        const a = this.bounds;
        const b = shape.bounds;

        return !(a.maxX < b.minX || a.maxY < b.minY || a.minX > b.maxX || a.minY > b.maxY);
    }

    public intersectsShape(shape: CollisionShape) {
        const edges1 = this.edges;
        const edges2 = shape.edges;

        for (let i = 0; i < edges1.length; i++) {
            const edge1 = edges1[i];

            for (let j = 0; j < edges2.length; j++) {
                const edge2 = edges2[j];
                if (edge1.intersects(edge2, true, this.intersectionPoint)) {
                    return true;
                }
            }
        }

        return false;
    }
}
