import './style.css'
import { render, setupScene } from './rendering.ts';
import { setupGUI } from './gui.ts';
import { setupInput } from './input.ts';

// create scene
const { sceneData, planetData } = setupScene();

// GUI setup
const guiParams = setupGUI(sceneData, planetData);

// input setup
const inputParams = setupInput(sceneData, planetData);

// start render loop
render(sceneData);
