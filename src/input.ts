import { clamp } from 'three/src/math/MathUtils.js';
import type { SceneData } from './rendering';
import { Planet } from './planet';
import { Vector3 } from 'three';

interface InputParams {
    rotateSpeed: number;
    zoomSpeed: number;
    minZoom: number;
    maxZoom: number;
}

export function setupInput(sceneData: SceneData, planet: Planet): InputParams {
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

    // mouse down and up: update dragging boolean and set initial mouse position
    document.addEventListener('mousedown', (event: MouseEvent) => {
        isDragging = true;
        previousMousePosition = { x: event.clientX, y: event.clientY };
    });
    document.addEventListener('mouseup', (/* event: MouseEvent */) => {
        isDragging = false;
    });

    // mouse dragging: world-wisely rotate the planet (only when dragging outside GUI)
    document.addEventListener('mousemove', (event: MouseEvent) => {
        if (isDragging) {
            const guiRect = document.getElementsByClassName('lil-gui')[0].getBoundingClientRect();

            if (event.clientX < guiRect.left || event.clientX > guiRect.right || event.clientY < guiRect.top || event.clientY > guiRect.bottom) {
                const deltaX = event.clientX - previousMousePosition.x;
                const deltaY = event.clientY - previousMousePosition.y;

                planet.mesh.rotateOnWorldAxis(new Vector3(0, 1, 0), deltaX * params.rotateSpeed);
                planet.mesh.rotateOnWorldAxis(new Vector3(1, 0, 0), deltaY * params.rotateSpeed);

                planet.skyMesh.rotateOnWorldAxis(new Vector3(0, 1, 0), deltaX * params.rotateSpeed);
                planet.skyMesh.rotateOnWorldAxis(new Vector3(1, 0, 0), deltaY * params.rotateSpeed);

                previousMousePosition.x = event.clientX;
                previousMousePosition.y = event.clientY;
            }
        }
    });

    let currentZoom = 10;

    // compute zoom based on mouse scrolling and zoom speed, then clamp 
    document.addEventListener("wheel", (event: WheelEvent) => {
        const guiRect = document.getElementsByClassName('lil-gui')[0].getBoundingClientRect();

            if (event.clientX < guiRect.left || event.clientX > guiRect.right || event.clientY < guiRect.top || event.clientY > guiRect.bottom) {
                currentZoom = clamp(currentZoom + Math.sign(event.deltaY) * params.zoomSpeed, params.minZoom, params.maxZoom);
                sceneData.camera.position.z = currentZoom;
            }
    });

    return params;
}
