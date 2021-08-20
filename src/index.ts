import { CanvasFunctions, Car, Driver, DriveRoutePoint, World } from "./app";
import "core-js";
import "./style.css";

/* eslint-disable @typescript-eslint/no-explicit-any */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const $ = require("jquery");

console.log("hello world");

export let canvas: any;
export let context: any;
$(document).ready(() => {
    canvas = document.getElementById("sim") as any;
    const ctx = (canvas as any).getContext("2d");
    context = ctx;
    const car = new Car();
    const world = new World();

    const aiCar = new Car();
    const driver = new Driver(aiCar);

    world.addObject(aiCar);
    world.addObject(driver);

    const aiCar2 = new Car();
    const driver2 = new Driver(aiCar2);
    aiCar2.xpos = 0;
    aiCar2.ypos = 0;

    world.addObject(aiCar2);
    world.addObject(driver2);

    canvas.addEventListener("mousemove", (evt: any) => {
        const mousePos = CanvasFunctions.getMousePos(canvas, evt);

        const mouseX = world.viewCenterX - canvas.width * 0.5 + mousePos.x;
        const mouseY = world.viewCenterY - canvas.height * 0.5 + mousePos.y;
        context.rect(mouseX - 3, mouseY - 3, 3, 3);
        context.stroke();
    });

    canvas.addEventListener(
        "click",
        (evt: any) => {
            const mousePos = CanvasFunctions.getMousePos(canvas, evt);

            const mouseX = mousePos.x + world.viewCenterX - canvas.width * 0.5;
            const mouseY = mousePos.y + world.viewCenterY - canvas.height * 0.5;

            console.log(world.viewCenterX + ", " + canvas.width * 0.5);
            const message = "Mouse position: " + mousePos.x + "," + mousePos.y + ":" + mouseX + ", " + mouseY;
            //document.editor.mouseDown(mouseX,mouseY)

            console.log(message);
        },
        false
    );

    const pressedKeys: any = {};

    $(document).keydown((e: any) => {
        pressedKeys[e.keyCode] = true;
    });

    $(document).keyup((e: any) => {
        delete pressedKeys[e.keyCode];
    });

    car.xpos = 300;

    world.addObject(car);

    let setTarget = false;
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

        if (car.xpos && setTarget == false) {
            driver2.setTarget(new DriveRoutePoint(aiCar.xpos, aiCar.ypos, false));
            driver2.reachedTarget = false;

            driver.setTarget(new DriveRoutePoint(car.xpos, car.ypos, false));
            driver.reachedTarget = false;
            setTarget = false;
        }
    }, 50);
    world.tick();
});
