import * as THREE from 'three'

export function getPlanet(): THREE.Mesh {

    const loader = new THREE.TextureLoader();
    const texture = loader.load('/t.jpg');

    const geometry = new THREE.SphereGeometry(2, 64, 64);
    const material = new THREE.MeshStandardMaterial({ color: '#ffffff', map: texture });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.set(0, 0, 0);
    return planet;
}