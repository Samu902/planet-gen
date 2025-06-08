import './style.css'
import { render, setupScene } from './rendering.ts';
import { setupGUI } from './ui.ts';
import { setupControls } from './input.ts';

// create scene
const sceneData = setupScene();

// GUI setup
setupGUI(sceneData);

// input setup
setupControls(sceneData);

// start render loop
render(sceneData);
