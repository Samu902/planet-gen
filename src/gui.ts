import GUI from 'lil-gui';
import type { SceneData } from './rendering';
import { Vector3 } from 'three';
import { updatePlanet, type PlanetData } from './planet';

interface GUIParams {
    camera_position: Vector3;
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
        rotateSpeed: 0.0005,
        //---planet -> fare sezioni
        // copia le value iniziali da planet data
        tilingFactor1: planetData.tilingFactor1,
        heightFactor1: planetData.heightFactor1,
        offset1: planetData.offset1,
        tilingFactor2: planetData.tilingFactor2,
        heightFactor2: planetData.heightFactor2,
        offset2: planetData.offset2,
        tilingFactor3: planetData.tilingFactor3,
        heightFactor3: planetData.heightFactor3,
        offset3: planetData.offset3
    };

    gui.addColor(params, 'camera_position').onChange((value: Vector3) => {
        sceneData.camera.position.set(value.x, value.y, value.z)
    });

    gui.add(params, 'rotateSpeed', 0, 0.01);

    // planet settings
    const planetGui = gui.addFolder('Planet settings');
    planetGui.add(params, 'tilingFactor1', 0.1, 1.25).onChange((value: number) => {
        planetData.tilingFactor1 = value;
        updatePlanet(planetData);
    });
    planetGui.add(params, 'heightFactor1', 0.1, 1).onChange((value: number) => {
        planetData.heightFactor1 = value;
        updatePlanet(planetData);
    });
    planetGui.add(params, 'offset1', 0, 99999).onChange((value: number) => {
        planetData.offset1 = value;
        updatePlanet(planetData);
    });
    planetGui.add(params, 'tilingFactor2', 0.75, 2.5).onChange((value: number) => {
        planetData.tilingFactor2 = value;
        updatePlanet(planetData);
    });
    planetGui.add(params, 'heightFactor2', 0.01, 0.25).onChange((value: number) => {
        planetData.heightFactor2 = value;
        updatePlanet(planetData);
    });
    planetGui.add(params, 'offset2', 0, 99999).onChange((value: number) => {
        planetData.offset2 = value;
        updatePlanet(planetData);
    });
    planetGui.add(params, 'tilingFactor3', 2, 5).onChange((value: number) => {
        planetData.tilingFactor3 = value;
        updatePlanet(planetData);
    });
    planetGui.add(params, 'heightFactor3', 0.001, 0.025).onChange((value: number) => {
        planetData.heightFactor3 = value;
        updatePlanet(planetData);
    });
    planetGui.add(params, 'offset3', 0, 99999).onChange((value: number) => {
        planetData.offset3 = value;
        updatePlanet(planetData);
    });

    function animateRotation() {
        requestAnimationFrame(animateRotation);
        sceneData.sky.rotation.y += params.rotateSpeed;
    }
    animateRotation();

    return params;
}
