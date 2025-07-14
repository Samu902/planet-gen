import * as THREE from 'three'
import { type SceneData } from './rendering'
import { createNoise3D, type NoiseFunction3D } from 'simplex-noise';
import { clamp } from 'three/src/math/MathUtils.js';
import { MaterialManager, type ShaderOption } from './materialManager';

export class Planet {

    sceneData: SceneData;

    radius: number;
    mesh: THREE.Mesh;
    skyMesh: THREE.Mesh;

    noise: NoiseFunction3D;

    tilingFactor1: number = 0.4;
    heightFactor1: number = 0.9;
    offset1: number = 0;
    tilingFactor2: number = 1;
    heightFactor2: number = 0.2;
    offset2: number = 0;
    tilingFactor3: number = 3.5;
    heightFactor3: number = 0.01;
    offset3: number = 0;

    mm: MaterialManager;

    shader: ShaderOption;

    color: THREE.Color = new THREE.Color('#ff0000');
    palette: { [key: string]: THREE.Color; } = {
        '0': new THREE.Color('#0044aa'), // oceano
        '1': new THREE.Color('#e6d153'), // sabbia
        '2': new THREE.Color('#88cc55'), // prato
        '3': new THREE.Color('#bfbf96'), // roccia
        '4': new THREE.Color('#ffffff')  // neve
    };
    wind: number = 1;

    constructor(sceneData: SceneData, radius: number = 2) {

        this.sceneData = sceneData;
        this.radius = radius;

        this.mm = MaterialManager.getInstance();
        this.shader = this.mm.getShaderNames()[4] as ShaderOption

        const geometry = new THREE.SphereGeometry(this.radius, 400, 200);
        const material = this.mm.getMaterial(this.shader);

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(0, 0, 0);


        const skyGeometry = new THREE.SphereGeometry(this.radius * 1.1, 20, 20);
        //geometry.computeVertexNormals();
        const skyMaterial = this.mm.getMaterial('textured_biomes/clouds'); //da cambiare

        this.skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);
        this.skyMesh.position.set(0, 0, 0);
        this.skyMesh.visible = false;


        this.noise = createNoise3D();

        this.update();
    }

    update() {

        const positionAttribute = this.mesh.geometry.getAttribute('position');
        const vertex = new THREE.Vector3();

        const seaLevel = 0;
        const plainCut = 0.1;
        const plainLevel = 0.01;
        const mountainLevel = 0.5;
        const detailLevel = 0.2;
        const maxLevel = 0.08;

        for (let i = 0; i < positionAttribute.count; i++) {
            vertex.fromBufferAttribute(positionAttribute, i);

            // appiattisce tutto ciò che è "sotto il mare" e sopra il livello "pianura"
            let plainNoiseLarge = this.noise(...vertex.clone().multiplyScalar(this.tilingFactor1).addScalar(this.offset1).toArray());
            let plainNoiseSmall = this.noise(...vertex.clone().multiplyScalar(this.tilingFactor1 * 6).addScalar(this.offset1).toArray());
            let plainElevation = clamp(clamp((plainNoiseLarge * 0.8 + plainNoiseSmall * 0.2), seaLevel, plainCut), seaLevel, plainLevel);
            let coastPadding = 0.25;
            let coastFactor = clamp((plainNoiseLarge * 0.8 + plainNoiseSmall * 0.2), seaLevel, plainCut + coastPadding) / (plainCut - seaLevel + coastPadding);

            // aggiunge dettagli solo sopra il livello del mare e non sulla costa
            let mountainNoiseLarge = this.noise(...vertex.clone().multiplyScalar(this.tilingFactor2).addScalar(this.offset2).toArray());
            let mountainNoiseSmall = this.noise(...vertex.clone().multiplyScalar(this.tilingFactor2 * 6).addScalar(this.offset2).toArray());
            let mountainElevation = clamp((mountainNoiseLarge * 0.7 + clamp(mountainNoiseSmall, 0.3, 0.9) * 0.3), mountainLevel * 0.1, 1) * mountainLevel;

            let detailNoise = this.noise(...vertex.clone().multiplyScalar(this.tilingFactor3).addScalar(this.offset3).toArray());
            let detailElevation = clamp(detailNoise, detailLevel * 0.2, 0.6);

            let displacement = this.heightFactor1 * plainElevation
                + (plainElevation > 0 ? this.heightFactor2 * mountainElevation * coastFactor : 0)
                + (plainElevation > 0 ? this.heightFactor3 * detailElevation * coastFactor: 0);

            vertex.normalize().multiplyScalar(this.radius * (1 + displacement));
            positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }

        positionAttribute.needsUpdate = true;
        this.mesh.geometry.computeVertexNormals();
        this.mesh.geometry.computeTangents();

        let updatedUniforms;
        switch (this.shader) {
            case 'uv':
                break;
            case 'solid':
                updatedUniforms = {
                    lightDirection: { value: this.sceneData.sunLight.position.clone().multiplyScalar(1).normalize() },
                    customColor: { value: this.color }
                }
                break;
            case 'wireframe':
                break;
            case 'solid_biomes':
                updatedUniforms = {
                    lightDirection: { value: this.sceneData.sunLight.position.clone().multiplyScalar(1).normalize() },
                    palette: {
                        value: Object.values(this.palette)
                    },
                    minHeight: { value: this.radius - 0.001 },
                    maxHeight: { value: this.radius * (1 + maxLevel) }
                }
                break;
            case 'textured_biomes':
                updatedUniforms = {
                    minHeight: { value: this.radius - 0.001 },
                    maxHeight: { value: this.radius * (1 + maxLevel) },
                    lightDirection: { value: this.sceneData.sunLight.position.clone().multiplyScalar(1).normalize() },
                    wind: { value: this.wind }
                }
                break;
        }
        this.mesh.material = MaterialManager.getInstance().getMaterial(this.shader, updatedUniforms);
        this.skyMesh.material = MaterialManager.getInstance().getMaterial('textured_biomes/clouds', {
            lightDirection: { value: this.sceneData.sunLight.position.clone().multiplyScalar(1).normalize() },
            wind: { value: this.wind }
        })
    }
}
