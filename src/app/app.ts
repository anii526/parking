/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/*
env 	Target canvas
img 	Specifies the image, canvas, or video element to use 	 	
sx 	Optional. The x coordinate where to start clipping 	Play it �	
sy 	Optional. The y coordinate where to start clipping 	Play it �	
swidth 	Optional. The width of the clipped image 	Play it �	
sheight 	Optional. The height of the clipped image 	Play it �	
x 	The x coordinate where to place the image on the canvas 	Play it �	
y 	The y coordinate where to place the image on the canvas 	Play it �	
width 	Optional. The width of the image to use (stretch or reduce the image) 	Play it �	
height 	Optional. The height of the image to use (stretch or reduce the image)
*/
export function LoadImageToCanvas(
    env: CanvasRenderingContext2D,
    imageObj: HTMLImageElement,
    positionX: number,
    positionY: number,
    angleInRad: number,
    axisX: number,
    axisY: number
) {
    env.translate(positionX, positionY);
    env.rotate(angleInRad);
    env.drawImage(imageObj, -axisX, -axisY);
    env.rotate(-angleInRad);
    env.translate(-positionX, -positionY);
}
