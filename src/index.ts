import "core-js";
import "./style.css";
import { World } from "./app/world";
import { Car } from "./app/car";

/* eslint-disable @typescript-eslint/no-explicit-any */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const $ = require("jquery");

// console.log("hello world");

export let canvas: HTMLCanvasElement;
export let context: CanvasRenderingContext2D;
let car: Car;
$(document).ready(() => {
    canvas = document.getElementById("sim") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    context = ctx;
    car = new Car();
    const world = new World();

    const pressedKeys: any = {};

    $(document).keydown((e: any) => {
        pressedKeys[e.keyCode] = true;
    });

    $(document).keyup((e: any) => {
        delete pressedKeys[e.keyCode];
    });

    car.xpos = 300;

    world.addObject(car);

    setInterval(() => {
        //ctx.clearRect(0,0,1000,1000);

        //Camera movement:
        const distanceX = Math.abs(car.xpos - world.viewCenterX);
        if (distanceX > 4) {
            const xspeed = 0.0004 * Math.pow(distanceX, 2);
            if (car.xpos > world.viewCenterX) {
                world.translateX = -xspeed;
            }
            if (car.xpos < world.viewCenterX) {
                world.translateX = xspeed;
            }
        } else {
            world.translateX = 0;
        }

        const distanceY = Math.abs(car.ypos - world.viewCenterY);
        if (distanceY > 4) {
            const yspeed = 0.0003 * Math.pow(distanceY, 2);
            if (car.ypos > world.viewCenterY) {
                world.translateY = -yspeed;
            }
            if (car.ypos < world.viewCenterY) {
                world.translateY = yspeed;
            }
        } else {
            world.translateY = 0;
        }

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
    }, 50);
    world.tick();
});

import * as PIXI from "pixi.js";
// import { Car2 } from "./app2/car2";

const app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1,
});
document.body.appendChild(app.view);

const container = new PIXI.Container();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
app.stage.addChild(container);

const texture = PIXI.Texture.from("./assets/sports_car_grey.png");

const car2 = new PIXI.Sprite(texture);
car2.anchor.set(0.5);
car2.x = 100;
car2.y = 100;
container.addChild(car2);

// const physicCar = new Car2();

// app.ticker.add((dt: number) => {
app.ticker.maxFPS = 30;
app.ticker.add(() => {
    if (car) {
        const { xpos, ypos, heading } = car;
        car2.x = xpos;
        car2.y = ypos;
        car2.rotation = -heading;

        // console.log(heading);
    }

    // if (physicCar) {
    //     const { carLocationX, carLocationY, carHeading } = physicCar.update(car2.x, car2.y, dt);
    //     car2.x = carLocationX;
    //     car2.y = carLocationY;
    //     car2.rotation = carHeading - Math.PI / 2;

    //     console.log(carHeading);
    // }

    // if (pressedKeys[39]) {
    //     physicCar.steerAngle += 0.001;
    // }
    // if (pressedKeys[37]) {
    //     physicCar.steerAngle -= 0.001;
    // }

    // if (pressedKeys[38]) {
    //     physicCar.carSpeed += 0.1;
    // }

    // if (pressedKeys[40]) {
    //     physicCar.carSpeed -= 0.1;
    // }
    // if (pressedKeys[32]) {
    //     physicCar.carSpeed = 0;
    // }
});

// const pressedKeys: any = {};

// $(document).keydown((e: any) => {
//     pressedKeys[e.keyCode] = true;
// });

// $(document).keyup((e: any) => {
//     delete pressedKeys[e.keyCode];
// });
