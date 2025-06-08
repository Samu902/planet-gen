import { clamp } from 'three/src/math/MathUtils.js';
import type { SceneData } from './rendering';

interface InputParams {
    rotateSpeed: number;
    zoomSpeed: number;
    minZoom: number;
    maxZoom: number;
}

export function setupControls(sceneData: SceneData): void {
    let params: InputParams = {
        rotateSpeed: 0.005,
        zoomSpeed: 0.25,
        minZoom: 2.5,
        maxZoom: 15
    } 

    // document.addEventListener('keydown', (event: KeyboardEvent) => {
    //     switch (event.key) {
    //         case 'w': sceneData.camera.position.z -= 0.3; break;
    //     }
    // });

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    // mouse down and up: update dragging boolean
    document.addEventListener('mousedown', () => { isDragging = true; });
    document.addEventListener('mouseup', () => { isDragging = false; });

    // mouse dragging: rotate the planet
    document.addEventListener('mousemove', (event: MouseEvent) => {
        if (isDragging) {
            const deltaX = event.clientX - previousMousePosition.x;
            const deltaY = event.clientY - previousMousePosition.y;

            sceneData.planet.rotation.y -= deltaX * params.rotateSpeed;
            sceneData.planet.rotation.x += deltaY * params.rotateSpeed;

            previousMousePosition.x = event.clientX;
            previousMousePosition.y = event.clientY;
        }
    });

    let currentZoom = 10;

    document.addEventListener("wheel", (event: WheelEvent) => {
        // compute zoom based on mouse scrolling and zoom speed, then clamp 
        currentZoom = clamp(currentZoom + Math.sign(event.deltaY) * params.zoomSpeed, params.minZoom, params.maxZoom);
        sceneData.camera.position.z = currentZoom;
        event.preventDefault(); // prevent default zoom or scrolling in the window
    });

}
