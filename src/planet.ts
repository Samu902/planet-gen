import * as THREE from 'three'
import { createNoise3D, type NoiseFunction3D } from 'simplex-noise';
import type { SceneData } from './rendering';
import uvVertShader from './shaders/uv.vert';
import uvFragShader from './shaders/uv.frag';
import solidVertShader from './shaders/solid.vert';
import solidFragShader from './shaders/solid.frag';

export type ShaderOption = 'uv' | 'solid';
export type ShaderPair = { vert: string, frag: string };

export const shaders: { [key in ShaderOption]: ShaderPair } = {
    'uv': { vert: uvVertShader, frag: uvFragShader },
    'solid': { vert: solidVertShader, frag: solidFragShader }
};

export class Planet {

    radius: number;
    mesh: THREE.Mesh;

    noise: NoiseFunction3D;

    tilingFactor1: number = 0.25;
    heightFactor1: number = 0.25;
    offset1: number = 0;
    tilingFactor2: number = 1;
    heightFactor2: number = 0.1;
    offset2: number = 0;
    tilingFactor3: number = 2;
    heightFactor3: number = 0.05;
    offset3: number = 0;

    shader: ShaderOption = Object.keys(shaders)[0] as ShaderOption

    constructor(radius: number = 2) {
        // const loader = new THREE.TextureLoader();
        // const texture = loader.load('/t.jpg');

        //const geometry = new THREE.SphereGeometry(2, 64, 64);
        //const material = new THREE.MeshStandardMaterial({ color: '#ffffff', map: texture });
        this.radius = radius;

        const geometry = new THREE.IcosahedronGeometry(this.radius, 10);
        //const material = new THREE.MeshStandardMaterial({ color: '#ffffff', wireframe: true });
        const material = new THREE.RawShaderMaterial({ vertexShader: shaders['uv'].vert, fragmentShader: shaders['uv'].frag, glslVersion: THREE.GLSL3 });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(0, 0, 0);


        this.noise = createNoise3D();
        const positionAttribute = this.mesh.geometry.attributes.position;
        const vertex = new THREE.Vector3();

        for (let i = 0; i < positionAttribute.count; i++) {
            vertex.fromBufferAttribute(positionAttribute, i);
            //let noiseValue1 = this.noise(vertex.x * this.tilingFactor1 + this.offset1, vertex.y * this.tilingFactor1 + this.offset1, vertex.z * this.tilingFactor1 + this.offset1);
            //let noiseValue2 = this.noise(vertex.x * this.tilingFactor2 + this.offset2, vertex.y * this.tilingFactor2 + this.offset2, vertex.z * this.tilingFactor2 + this.offset2);
            //let noiseValue3 = this.noise(vertex.x * this.tilingFactor3 + this.offset3, vertex.y * this.tilingFactor3 + this.offset3, vertex.z * this.tilingFactor3 + this.offset3);
            let noiseValue1 = this.noise(...vertex.multiplyScalar(this.tilingFactor1).addScalar(this.offset1).toArray());
            let noiseValue2 = this.noise(...vertex.multiplyScalar(this.tilingFactor2).addScalar(this.offset2).toArray());
            let noiseValue3 = this.noise(...vertex.multiplyScalar(this.tilingFactor3).addScalar(this.offset3).toArray());
            vertex.normalize().multiplyScalar(this.radius).multiplyScalar(1 + this.heightFactor1 * noiseValue1 + this.heightFactor2 * noiseValue2 + this.heightFactor3 * noiseValue3);
            positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }

        positionAttribute.needsUpdate = true;
        this.mesh.geometry.computeVertexNormals();
    }

    update() {

        //const geometry = new THREE.IcosahedronGeometry(2, 10);
        //this.mesh.geometry = geometry;
        this.mesh.material = new THREE.RawShaderMaterial({ vertexShader: shaders[this.shader].vert, fragmentShader: shaders[this.shader].frag, glslVersion: THREE.GLSL3 });

        const positionAttribute = this.mesh.geometry.attributes.position;
        const vertex = new THREE.Vector3();

        for (let i = 0; i < positionAttribute.count; i++) {
            vertex.fromBufferAttribute(positionAttribute, i);
            let noiseValue1 = this.noise(...vertex.multiplyScalar(this.tilingFactor1).addScalar(this.offset1).toArray());
            let noiseValue2 = this.noise(...vertex.multiplyScalar(this.tilingFactor2).addScalar(this.offset2).toArray());
            let noiseValue3 = this.noise(...vertex.multiplyScalar(this.tilingFactor3).addScalar(this.offset3).toArray());
            vertex.normalize().multiplyScalar(this.radius).multiplyScalar(1 + this.heightFactor1 * noiseValue1 + this.heightFactor2 * noiseValue2 + this.heightFactor3 * noiseValue3);
            positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }

        positionAttribute.needsUpdate = true;
        this.mesh.geometry.computeVertexNormals();
    }
}
