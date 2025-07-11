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
    heightFactor2: number = 0.1;
    offset2: number = 0;
    tilingFactor3: number = 2;
    heightFactor3: number = 0.05;
    offset3: number = 0;

    mm: MaterialManager;

    shader: ShaderOption;

    color: THREE.Color = new THREE.Color('#ff0000');
    palette: { [key: string]: THREE.Color; } = {
        '0': new THREE.Color('#0044aa'), // oceano
        '1': new THREE.Color('#228866'), // costa
        '2': new THREE.Color('#88cc55'), // prato
        '3': new THREE.Color('#aaaa55'), // collina
        '4': new THREE.Color('#ffffff')  // montagna
    };
    wind: number = 1;

    constructor(sceneData: SceneData, radius: number = 2) {

        this.sceneData = sceneData;
        this.radius = radius;

        this.mm = MaterialManager.getInstance();
        this.shader = this.mm.getShaderNames()[4] as ShaderOption

        const geometry = new THREE.IcosahedronGeometry(this.radius, 30);
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

        const seaLevel = 0; // qualunque valore compreso tra -1 e 1
        const noiseMax1 = 0.05;

        for (let i = 0; i < positionAttribute.count; i++) {
            vertex.fromBufferAttribute(positionAttribute, i);

            let baseNoise = this.noise(...vertex.clone().multiplyScalar(this.tilingFactor1).addScalar(this.offset1).toArray());

            // Appiattiamo tutto ciò che è "sotto il mare"
            let elevation = clamp(baseNoise, seaLevel, noiseMax1);

            // Aggiungiamo dettagli solo sopra il livello del mare
            let detail1 = this.noise(...vertex.clone().multiplyScalar(this.tilingFactor2).addScalar(this.offset2).toArray());
            let detail2 = this.noise(...vertex.clone().multiplyScalar(this.tilingFactor3).addScalar(this.offset3).toArray());

            let displacement = this.heightFactor1 * elevation
                + this.heightFactor2 * elevation * detail1
                + this.heightFactor3 * elevation * detail2;

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
