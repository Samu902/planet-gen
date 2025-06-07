import GUI from 'lil-gui';
import type { SceneData } from './rendering';

interface GUIParams {
    color: string;
    height: number;
    rotateSpeed: number;
}

export function setupGUI(sceneData: SceneData): void {
    const gui = new GUI();
    const params: GUIParams = { color: '#ff0000', height: 1, rotateSpeed: 0.01 };

    gui.addColor(params, 'color').onChange((value: string) => {
        //sceneData.planet.material.color.set(value);
    });

    gui.add(params, 'height', 0.5, 3).onChange((value: number) => {
        sceneData.planet.scale.set(1, value, 1);
    });

    gui.add(params, 'rotateSpeed', 0, 0.1);
    
    function animateRotation() {
        requestAnimationFrame(animateRotation);
        sceneData.planet.rotation.y += params.rotateSpeed;
    }
    animateRotation();
}
