import GUI from 'lil-gui';
import type { SceneData } from './rendering';
import { Vector3 } from 'three';

interface GUIParams {
    camera_position: Vector3;
    height: number;
    rotateSpeed: number;
}

export function setupGUI(sceneData: SceneData): void {
    const gui = new GUI();
    const params: GUIParams = { camera_position: new Vector3(0, 5, 10), height: 1, rotateSpeed: 0.0005 };

    gui.addColor(params, 'camera_position').onChange((value: Vector3) => {
        sceneData.camera.position.set(value.x, value.y, value.z)
    });

    gui.add(params, 'height', 0.5, 3).onChange((value: number) => {
        sceneData.planet.scale.set(1, value, 1);
    });

    gui.add(params, 'rotateSpeed', 0, 0.1);
    
    function animateRotation() {
        requestAnimationFrame(animateRotation);
        sceneData.sky.rotation.y += params.rotateSpeed;
    }
    animateRotation();
}
