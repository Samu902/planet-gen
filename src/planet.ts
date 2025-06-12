import * as THREE from 'three'
import { createNoise3D } from 'simplex-noise';
import type { SceneData } from './rendering';

export interface PlanetData {
    mesh: THREE.Mesh,
    tilingFactor1: number,
    heightFactor1: number,
    offset1: number,
    tilingFactor2: number,
    heightFactor2: number,
    offset2: number,
    tilingFactor3: number,
    heightFactor3: number,
    offset3: number
}

export function generatePlanet(sceneData: SceneData): PlanetData {

    // const loader = new THREE.TextureLoader();
    // const texture = loader.load('/t.jpg');

    //const geometry = new THREE.SphereGeometry(2, 64, 64);
    //const material = new THREE.MeshStandardMaterial({ color: '#ffffff', map: texture });

    const geometry = new THREE.IcosahedronGeometry(2, 10);
    const material = new THREE.MeshStandardMaterial({ color: '#ffffff', wireframe: true });

    const planet = new THREE.Mesh(geometry, material);
    planet.position.set(0, 0, 0);


    const noise = createNoise3D();
    const positionAttribute = planet.geometry.attributes.position;
    const vertex = new THREE.Vector3();

    const data: PlanetData = {
        mesh: planet,
        tilingFactor1: 0.25,
        heightFactor1: 0.25,
        offset1: 0,
        tilingFactor2: 1,
        heightFactor2: 0.1,
        offset2: 0,
        tilingFactor3: 2,
        heightFactor3: 0.05,
        offset3: 0
    }

    for (let i = 0; i < positionAttribute.count; i++) {
        vertex.fromBufferAttribute(positionAttribute, i);
        let noiseValue1 = noise(vertex.x * data.tilingFactor1 + data.offset1, vertex.y * data.tilingFactor1 + data.offset1, vertex.z * data.tilingFactor1 + data.offset1);
        let noiseValue2 = noise(vertex.x * data.tilingFactor2 + data.offset2, vertex.y * data.tilingFactor2 + data.offset2, vertex.z * data.tilingFactor2 + data.offset2);
        let noiseValue3 = noise(vertex.x * data.tilingFactor3 + data.offset3, vertex.y * data.tilingFactor3 + data.offset3, vertex.z * data.tilingFactor3 + data.offset3);
        vertex.multiplyScalar(1 + data.heightFactor1 * noiseValue1 + data.heightFactor2 * noiseValue2 + data.heightFactor3 * noiseValue3);
        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    positionAttribute.needsUpdate = true;
    data.mesh.geometry.computeVertexNormals();

    return data;
}

export function updatePlanet(planetData: PlanetData) {
    const geometry = new THREE.IcosahedronGeometry(2, 10);
    planetData.mesh.geometry = geometry;

    const noise = createNoise3D();
    const positionAttribute = planetData.mesh.geometry.attributes.position;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < positionAttribute.count; i++) {
        vertex.fromBufferAttribute(positionAttribute, i);
        let noiseValue1 = noise(vertex.x * planetData.tilingFactor1 + planetData.offset1, vertex.y * planetData.tilingFactor1 + planetData.offset1, vertex.z * planetData.tilingFactor1 + planetData.offset1);
        let noiseValue2 = noise(vertex.x * planetData.tilingFactor2 + planetData.offset2, vertex.y * planetData.tilingFactor2 + planetData.offset2, vertex.z * planetData.tilingFactor2 + planetData.offset2);
        let noiseValue3 = noise(vertex.x * planetData.tilingFactor3 + planetData.offset3, vertex.y * planetData.tilingFactor3 + planetData.offset3, vertex.z * planetData.tilingFactor3 + planetData.offset3);
        vertex.multiplyScalar(1 + planetData.heightFactor1 * noiseValue1 + planetData.heightFactor2 * noiseValue2 + planetData.heightFactor3 * noiseValue3);
        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    positionAttribute.needsUpdate = true;
    planetData.mesh.geometry.computeVertexNormals();
}
