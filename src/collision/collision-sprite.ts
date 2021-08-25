import { COLLISION } from "./index";
import * as PIXI from "pixi.js";
import { CollisionShape } from "./collision-shape";
export class CollisionSprite extends PIXI.Sprite {
    public shape!: CollisionShape;
    public collisionID = 0;
    public collision = COLLISION.NONE;
    public dragging = false;
    public newPosition = new PIXI.Point();
    public lastPosition = new PIXI.Point();
}
