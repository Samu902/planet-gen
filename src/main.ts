import './style.css'
import { render, setupScene } from './rendering.ts';
import { setupGUI } from './gui.ts';
import { setupInput } from './input.ts';

// create scene
const { sceneData, planet } = setupScene();

// GUI setup
/* const guiParams =  */setupGUI(sceneData, planet);

// input setup
/* const inputParams =  */setupInput(sceneData, planet);

// start render loop
render(sceneData, planet);
