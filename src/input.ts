import { clamp } from 'three/src/math/MathUtils.js';
import type { SceneData } from './rendering';
import type { PlanetData } from './planet';

interface InputParams {
    rotateSpeed: number;
    zoomSpeed: number;
    minZoom: number;
    maxZoom: number;
}

export function setupInput(sceneData: SceneData, planetData: PlanetData): InputParams {
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

    // mouse dragging: rotate the planet (only when dragging outside GUI)
    document.addEventListener('mousemove', (event: MouseEvent) => {
        if (isDragging) {
            const guiRect = document.getElementsByClassName('lil-gui')[0].getBoundingClientRect();

            if (event.clientX < guiRect.left || event.clientX > guiRect.right || event.clientY < guiRect.top || event.clientY > guiRect.bottom) {
                const deltaX = event.clientX - previousMousePosition.x;
                const deltaY = event.clientY - previousMousePosition.y;
    
                planetData.mesh.rotation.y -= deltaX * params.rotateSpeed;
                planetData.mesh.rotation.x += deltaY * params.rotateSpeed;
    
                previousMousePosition.x = event.clientX;
                previousMousePosition.y = event.clientY;
            }
        }
    });

    let currentZoom = 10;

    document.addEventListener("wheel", (event: WheelEvent) => {
        // compute zoom based on mouse scrolling and zoom speed, then clamp 
        currentZoom = clamp(currentZoom + Math.sign(event.deltaY) * params.zoomSpeed, params.minZoom, params.maxZoom);
        sceneData.camera.position.z = currentZoom;
        event.preventDefault(); // prevent default zoom or scrolling in the window
    });

    return params;
}
