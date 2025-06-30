import GUI from 'lil-gui';
import type { SceneData } from './rendering';
import { Vector3 } from 'three';
import { Planet } from './planet';
import { MaterialManager, type ShaderOption } from './materialManager';

interface GUIParams {
    // > world params
    rotateSpeed: number;
    sunPosition: Vector3;
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
        // > world params
        rotateSpeed: sceneData.skySpeed,
        sunPosition: sceneData.sunLight.position,
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

    gui.add(params, 'rotateSpeed', 0, 0.01);
    const sunPositionGui = gui.addFolder('Sun position');
    sunPositionGui.add(params.sunPosition, 'x', -20, 20).onChange((value: number) => {
        sceneData.sunLight.position.x = value;
        planet.update();
    });
    sunPositionGui.add(params.sunPosition, 'y', -20, 20).onChange((value: number) => {
        sceneData.sunLight.position.y = value;
        planet.update();
    });
    sunPositionGui.add(params.sunPosition, 'z', -20, 20).onChange((value: number) => {
        sceneData.sunLight.position.z = value;
        planet.update();
    });

    // > planet settings
    const planetGui = gui.addFolder('Planet settings');
    // >> geometry settings
    const geometryGui = planetGui.addFolder('Geometry');
    geometryGui.add(params, 'tilingFactor1', 0.1, 1.25).onChange((value: number) => {
        planet.tilingFactor1 = value;
        planet.update();
    });
    geometryGui.add(params, 'heightFactor1', 0.1, 1).onChange((value: number) => {
        planet.heightFactor1 = value;
        planet.update();
    });
    geometryGui.add(params, 'offset1', 0, 10).onChange((value: number) => {
        planet.offset1 = value;
        planet.update();
    });
    geometryGui.add(params, 'tilingFactor2', 0.75, 2.5).onChange((value: number) => {
        planet.tilingFactor2 = value;
        planet.update();
    });
    geometryGui.add(params, 'heightFactor2', 0.01, 1).onChange((value: number) => {
        planet.heightFactor2 = value;
        planet.update();
    });
    geometryGui.add(params, 'offset2', 0, 10).onChange((value: number) => {
        planet.offset2 = value;
        planet.update();
    });
    geometryGui.add(params, 'tilingFactor3', 2, 5).onChange((value: number) => {
        planet.tilingFactor3 = value;
        planet.update();
    });
    geometryGui.add(params, 'heightFactor3', 0.001, 0.25).onChange((value: number) => {
        planet.heightFactor3 = value;
        planet.update();
    });
    geometryGui.add(params, 'offset3', 0, 10).onChange((value: number) => {
        planet.offset3 = value;
        planet.update();
    });
    // >> fragment settings
    const fragmentGui = planetGui.addFolder('Fragment');
    fragmentGui.add(params, 'shader', MaterialManager.getInstance().getShaderNames()).onChange((value: ShaderOption) => {
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
