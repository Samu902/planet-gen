import GUI from 'lil-gui';
import type { SceneData } from './rendering';
import { Vector3 } from 'three';
import { Planet, shaders, type ShaderOption } from './planet';

interface GUIParams {
    camera_position: Vector3;
    rotateSpeed: number;
    // > planet params
    // >> geometry
    tilingFactor1: number,
    heightFactor1: number,
    offset1: number,
    tilingFactor2: number,
    heightFactor2: number,
    offset2: number,
    tilingFactor3: number,
    heightFactor3: number
    offset3: number,
    // >> fragment
    shader: ShaderOption
}

export function setupGUI(sceneData: SceneData, planet: Planet): GUIParams {
    const gui = new GUI();
    const params: GUIParams = {
        camera_position: new Vector3(0, 5, 10),
        rotateSpeed: 0.0005,
        // > planet params
        // >> geometry
        tilingFactor1: planet.tilingFactor1,
        heightFactor1: planet.heightFactor1,
        offset1: planet.offset1,
        tilingFactor2: planet.tilingFactor2,
        heightFactor2: planet.heightFactor2,
        offset2: planet.offset2,
        tilingFactor3: planet.tilingFactor3,
        heightFactor3: planet.heightFactor3,
        offset3: planet.offset3,
        // >> fragment
        shader: planet.shader
    };

    gui.addColor(params, 'camera_position').onChange((value: Vector3) => {
        sceneData.camera.position.set(value.x, value.y, value.z)
    });

    gui.add(params, 'rotateSpeed', 0, 0.01);

    // planet settings
    const planetGui = gui.addFolder('Planet settings');
    const geometryGui = planetGui.addFolder('Geometry');
    geometryGui.add(params, 'tilingFactor1', 0.1, 1.25).onChange((value: number) => {
        planet.tilingFactor1 = value;
        planet.update();
    });
    geometryGui.add(params, 'heightFactor1', 0.1, 1).onChange((value: number) => {
        planet.heightFactor1 = value;
        planet.update();
    });
    geometryGui.add(params, 'offset1', 0, 99999).onChange((value: number) => {
        planet.offset1 = value;
        planet.update();
    });
    geometryGui.add(params, 'tilingFactor2', 0.75, 2.5).onChange((value: number) => {
        planet.tilingFactor2 = value;
        planet.update();
    });
    geometryGui.add(params, 'heightFactor2', 0.01, 0.25).onChange((value: number) => {
        planet.heightFactor2 = value;
        planet.update();
    });
    geometryGui.add(params, 'offset2', 0, 99999).onChange((value: number) => {
        planet.offset2 = value;
        planet.update();
    });
    geometryGui.add(params, 'tilingFactor3', 2, 5).onChange((value: number) => {
        planet.tilingFactor3 = value;
        planet.update();
    });
    geometryGui.add(params, 'heightFactor3', 0.001, 0.025).onChange((value: number) => {
        planet.heightFactor3 = value;
        planet.update();
    });
    geometryGui.add(params, 'offset3', 0, 99999).onChange((value: number) => {
        planet.offset3 = value;
        planet.update(); //il problema è che la rigenera a caso ad ogni cambiento: serve un seed forse?
    });
    const fragmentGui = planetGui.addFolder('Fragment');
    fragmentGui.add(params, 'shader', Object.keys(shaders)).onChange((value: ShaderOption) => {
        planet.shader = value;
        planet.update();
    });

    function animateRotation() {
        requestAnimationFrame(animateRotation);
        sceneData.sky.rotation.y += params.rotateSpeed;
    }
    animateRotation();

    return params;
}
