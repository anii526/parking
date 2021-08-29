import { CollisionSprite } from "./collision-sprite";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as PIXI from "pixi.js";
import { CollisionShape } from "./collision-shape";
console.clear();

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

//
// APPLICATION
// ===========================================================================
export enum COLLISION {
    NONE = 0x4caf50,
    AABB = 0x2196f3,
    SHAPE = 0xf44336,
}

let vw = window.innerWidth;
let vh = window.innerHeight;

const app = new PIXI.Application({
    width: vw,
    height: vh,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1,
});
document.body.appendChild(app.view);

const sprites: CollisionSprite[] = [];
const container = new PIXI.Container();

for (let i = 0; i < 10; i++) {
    sprites.push(createSprite());
}

const text = new PIXI.Text("Drag the shapes around", {
    fill: "rgba(255,255,255,0.9)",
    fontSize: 16,
});

text.position.set(12);

const graphics = new PIXI.Graphics();
app.stage.addChild(container, graphics, text);
app.ticker.add(update);
window.addEventListener("resize", onResize);
// container.updateTransform();
//
// CREATE SPRITE
// ===========================================================================
function createSprite() {
    const sides = random(4, 16) | 0;
    const step = (Math.PI * 2) / sides;
    const points = [];

    let minX = Infinity;
    let minY = Infinity;

    for (let i = 0; i < sides - 1; i++) {
        const theta = step * i + random(step);
        const radius = random(100, 160);

        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);

        minX = Math.min(minX, x);
        minY = Math.min(minY, y);

        points.push(new PIXI.Point(x, y));
    }

    points.forEach((point) => {
        point.x = point.x - minX;
        point.y = point.y - minY;
    });

    const graphics = new PIXI.Graphics().beginFill(0xffffff).drawPolygon(points).endFill();

    const sprite = new CollisionSprite(app.renderer.generateTexture(graphics));

    sprite.alpha = 0.6;
    sprite.x = random(100, vw - 100);
    sprite.y = random(100, vh - 100);
    sprite.pivot.x = sprite.width * 0.5;
    sprite.pivot.y = sprite.height * 0.5;
    sprite.rotation = random(Math.PI * 2);
    sprite.scale.set(random(0.4, 1));

    sprite.hitArea = new PIXI.Polygon(points);
    sprite.shape = new CollisionShape(sprite, points);
    sprite.collisionID = 1;
    sprite.collision = COLLISION.NONE;
    sprite.tint = sprite.collision;

    sprite.dragging = false;
    sprite.newPosition = new PIXI.Point();
    sprite.lastPosition = new PIXI.Point();

    sprite.interactive = true;
    sprite.buttonMode = true;
    sprite
        .on("pointerdown", onDragStart)
        .on("pointerup", onDragEnd)
        .on("pointerupoutside", onDragEnd)
        .on("pointermove", onDragMove);

    graphics.destroy();
    container.addChild(sprite);

    return sprite;
}

//
// DETECT COLLISIONS
// ===========================================================================
function detectCollisions() {
    container.updateTransform();

    for (let i = 0; i < sprites.length; i++) {
        const sprite = sprites[i];
        sprite.collision = COLLISION.NONE;

        if (sprite.collisionID) {
            sprite.shape.update();
            sprite.collisionID = 0;
        }
    }

    for (let i = 0; i < sprites.length; i++) {
        const sprite1 = sprites[i];

        for (let j = i + 1; j < sprites.length; j++) {
            const sprite2 = sprites[j];

            // Check for AABB intersections to determine what shapes might be overlapping
            if (sprite1.shape.intersectsAABB(sprite2.shape)) {
                if (sprite1.collision === COLLISION.NONE) {
                    sprite1.collision = COLLISION.AABB;
                }

                if (sprite2.collision === COLLISION.NONE) {
                    sprite2.collision = COLLISION.AABB;
                }

                if (sprite1.shape.intersectsShape(sprite2.shape)) {
                    sprite1.collision = COLLISION.SHAPE;
                    sprite2.collision = COLLISION.SHAPE;
                }
            }

            sprite2.tint = sprite2.collision;
        }

        sprite1.tint = sprite1.collision;
    }
}

//
// UPDATE
// ===========================================================================
function update() {
    detectCollisions();

    graphics.clear().lineStyle(1, 0xffffff, 0.8);

    for (let i = 0; i < sprites.length; i++) {
        // sprites[i].rotation += 0.01;
        const box = sprites[i].shape.AABB;
        graphics.drawRect(box.x, box.y, box.width, box.height);
    }
}

//
// DRAG EVENTS
// ===========================================================================
function onDragStart(this: any, event: { data: any }) {
    this.dragging = true;
    this.dragData = event.data;
    this.lastPosition = this.dragData.getLocalPosition(this.parent, this.lastPosition);
}

function onDragMove(this: any) {
    if (this.dragging) {
        const newPosition = this.dragData.getLocalPosition(this.parent, this.newPosition);
        this.position.x += newPosition.x - this.lastPosition.x;
        this.position.y += newPosition.y - this.lastPosition.y;
        this.lastPosition.copyFrom(newPosition);
        this.collisionID++;
    }
}

function onDragEnd(this: any) {
    this.dragData = null;
    this.dragging = false;
}

function onResize() {
    vw = window.innerWidth;
    vh = window.innerHeight;
    app.renderer.resize(vw, vh);
}

function random(min: number, max?: number | null | undefined) {
    if (max == null) {
        max = min;
        min = 0;
    }
    if (min > max) {
        const tmp = min;
        min = max;
        max = tmp;
    }
    return min + (max - min) * Math.random();
}
