import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface SceneData {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    planet: THREE.Mesh;
    //objects: THREE.Object3D[];
}

export function setupScene(): SceneData {
    // create scene
    let scene = new THREE.Scene();

    // create and setup camera
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    // create and setup renderer
    let renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('sceneCanvas') as HTMLCanvasElement });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', () => {
        // Nuove dimensioni
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Aggiornamento della camera
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        // Opzione: adattiamo leggermente la posizione per evitare brusche transizioni
        camera.position.z = Math.max(8, width / height * 10);

        // Aggiornamento del renderer
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
    });

    // Illuminazione
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    scene.add(light);

    // OrbitControls per esplorazione fluida
    // controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.05;


    // Pianeta
    const planet = getPlanet();
    scene.add(planet);

    return {
        scene: scene,
        camera: camera,
        renderer: renderer,
        planet: planet
    };
}

export function getPlanet(): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    const material = new THREE.MeshStandardMaterial({ color: '#ff0000' });
    const planet = new THREE.Mesh(geometry, material);
    return planet;
}

// export function animate(): void {
//     function loop() {
//         requestAnimationFrame(loop);
//         controls.update();
//         renderer.render(scene, camera);
//     }
//     loop();
// }
