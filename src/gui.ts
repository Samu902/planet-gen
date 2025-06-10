import GUI from 'lil-gui';
import type { SceneData } from './rendering';
import { Vector3 } from 'three';
import { updatePlanet, type PlanetData } from './planet';

interface GUIParams {
    camera_position: Vector3;
    height: number;
    rotateSpeed: number;

    tilingFactor1: number,
    heightFactor1: number,
    offset1: number,
    tilingFactor2: number,
    heightFactor2: number,
    offset2: number,
    tilingFactor3: number,
    heightFactor3: number
    offset3: number,
}

export function setupGUI(sceneData: SceneData, planetData: PlanetData): GUIParams {
    const gui = new GUI();
    const params: GUIParams = { 
        // ---scene
        camera_position: new Vector3(0, 5, 10), 
        height: 1, 
        rotateSpeed: 0.0005,
        //---planet -> fare sezioni
        // copia le value iniziali da planet data
        tilingFactor1: 0.25,
        heightFactor1: 0.25,
        offset1: 2,
        tilingFactor2: 1,
        heightFactor2: 0.1,
        offset2: 2,
        tilingFactor3: 2,
        heightFactor3: 0.05,
        offset3: 0
    };

    gui.addColor(params, 'camera_position').onChange((value: Vector3) => {
        sceneData.camera.position.set(value.x, value.y, value.z)
    });

    gui.add(params, 'height', 0.5, 3).onChange((value: number) => {
        planetData.mesh.scale.set(1, value, 1);
    });

    gui.add(params, 'tilingFactor1', 0.5, 3).onChange((value: number) => {
        planetData.tilingFactor1 = value;
        updatePlanet(planetData);
    });

    gui.add(params, 'rotateSpeed', 0, 0.01);

    function animateRotation() {
        requestAnimationFrame(animateRotation);
        sceneData.sky.rotation.y += params.rotateSpeed;
    }
    animateRotation();

    return params;
}
