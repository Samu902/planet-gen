import type { SceneData } from './rendering';

export function setupControls(sceneData: SceneData): void {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
        switch (event.key) {
            case 'w': sceneData.camera.position.z -= 0.3; break;
            case 's': sceneData.camera.position.z += 0.3; break;
            case 'ArrowUp': sceneData.planet.position.y += 0.1; break;
            case 'ArrowDown': sceneData.planet.position.y -= 0.1; break;
            case 'ArrowLeft': sceneData.planet.position.x -= 0.1; break;
            case 'ArrowRight': sceneData.planet.position.x += 0.1; break;
        }
    });

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    document.addEventListener('mousedown', () => { isDragging = true; });
    document.addEventListener('mouseup', () => { isDragging = false; });
    
    document.addEventListener('mousemove', (event: MouseEvent) => {
        if (isDragging) {
            const deltaX = event.clientX - previousMousePosition.x;
            sceneData.planet.rotation.y += deltaX * 0.005;
            previousMousePosition.x = event.clientX;
        }
    });
}
