import './style.css'
import { setupScene } from './rendering.ts';
import { setupGUI } from './ui.ts';
import { setupControls } from './input.ts';

// create scene
const sceneData = setupScene();

// GUI setup
setupGUI(sceneData);

// Input setup
setupControls(sceneData);

