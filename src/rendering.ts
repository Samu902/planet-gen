import * as THREE from 'three';
import { getPlanet as createPlanet } from './planet';

export interface SceneData {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    planet: THREE.Mesh;
    sky: THREE.Mesh;
}

export function setupScene(): SceneData {

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
    sunLight.position.set(-10, 5, 0);
    scene.add(sunLight);

    // ambient light to brighten the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // --- Space skydome ---

    // load tiled space texture
    const loader = new THREE.TextureLoader();
    const texture = loader.load('/space.png');
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

    const planet = createPlanet();
    scene.add(planet);

    return {
        scene: scene,
        camera: camera,
        renderer: renderer,
        planet: planet,
        sky: sky
    };
}

export function render(sceneData: SceneData): void {
    function loop() {
        requestAnimationFrame(loop);
        sceneData.renderer.render(sceneData.scene, sceneData.camera);
    }
    loop();
}
