/* eslint-disable @typescript-eslint/no-explicit-any */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const $ = require("jquery");

import * as PIXI from "pixi.js";
import { Car2 } from "./car2";

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

const physicCar = new Car2();

app.ticker.maxFPS = 60;
app.ticker.add((dt: number) => {
    // app.ticker.add(() => {
    // if (car) {
    //     const { xpos, ypos, heading } = car;
    //     car2.x = xpos;
    //     car2.y = ypos;
    //     car2.rotation = -heading;

    //     // console.log(heading);
    // }

    if (physicCar) {
        const { carLocationX, carLocationY, carHeading } = physicCar.update(car2.x, car2.y, dt);
        car2.x = carLocationX;
        car2.y = carLocationY;
        car2.rotation = carHeading - Math.PI / 2;

        console.log(carHeading);
    }

    if (pressedKeys[39]) {
        physicCar.steerAngle += 0.05;
        if (physicCar.steerAngle > 0.7) {
            physicCar.steerAngle = 0.7;
        }
    }
    if (pressedKeys[37]) {
        physicCar.steerAngle -= 0.05;
        if (physicCar.steerAngle < -0.7) {
            physicCar.steerAngle = -0.7;
        }
    }

    if (pressedKeys[38]) {
        physicCar.carSpeed += 0.1;
    }

    if (pressedKeys[40]) {
        physicCar.carSpeed -= 0.1;
    }
    if (pressedKeys[32]) {
        physicCar.carSpeed = 0;
        physicCar.steerAngle = 0;
    }
});

const pressedKeys: any = {};

$(document).keydown((e: any) => {
    pressedKeys[e.keyCode] = true;
});

$(document).keyup((e: any) => {
    delete pressedKeys[e.keyCode];
});
