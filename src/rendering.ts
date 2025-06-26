import * as THREE from 'three';
import { Planet } from './planet';
import spaceBackground from './assets/space.png';

export interface SceneData {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    sky: THREE.Mesh;
    skySpeed: number;
    sunLight: THREE.DirectionalLight;
    ambientLight: THREE.AmbientLight;
}

export function setupScene(): { sceneData: SceneData, planet: Planet } {

    // --- Scene, camera and renderer ---

    // create scene
    let scene = new THREE.Scene();

    // create and setup camera
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 10);

    // create and setup renderer
    let renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('sceneCanvas') as HTMLCanvasElement });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // automatic canvas resize
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // update camera
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        // update renderer
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
    });

    // --- Lighting ---

    // directional light as 'sun'
    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(-10, 5, 5);
    scene.add(sunLight);

    // ambient light to brighten the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // --- Space skydome ---

    // load tiled space texture
    const loader = new THREE.TextureLoader();
    const texture = loader.load(spaceBackground);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(7, 5);

    // create a huge sphere as background 
    const skyGeo = new THREE.SphereGeometry(500, 32, 32);
    const skyMat = new THREE.MeshBasicMaterial({ map: texture, color: 0x88aaaa });
    skyMat.side = THREE.BackSide; // render sphere inside

    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);

    // --- Planet ---

    const sceneData = {
        scene: scene,
        camera: camera,
        renderer: renderer,
        sky: sky,
        skySpeed: 0.0005,
        sunLight: sunLight,
        ambientLight: ambientLight
    };

    const planet = new Planet(sceneData);
    scene.add(planet.mesh);

    return { sceneData, planet };
}

export function render(sceneData: SceneData, planet: Planet): void {
    function loop() {
        requestAnimationFrame(loop);
        sceneData.renderer.render(sceneData.scene, sceneData.camera);
    }
    loop();
}
