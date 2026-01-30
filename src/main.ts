import utils from "./shared/utils";
import path from "./shared/path";
import './style/main.scss';
import state from './state';

import SquareGridLevel from "./classes/SquareGridLevel"
import Biome from "./classes/Biome";

// if I need to intercept keypresses
window.addEventListener("keydown", (e:KeyboardEvent) => {
	state.handleKeypress(e);
	e.preventDefault();
}, false);

var curPath = "";

var dMenu = document.querySelector('#app .menu-box');
if (dMenu) {
	let d = (dMenu as HTMLElement);

	d.appendChild(utils.createButton('Tick', '', () => {state.execTick();}));
	d.appendChild(utils.createButton('Start', '', () => {state.playGame();}));
	d.appendChild(utils.createButton('Pause', '', () => {state.stopGame()}));
	d.appendChild(utils.createButton('Draw Path', '', () => {curPath = path.drawPath(state.currentLevel!.player.currentPath, 'red')}));
	d.appendChild(utils.createButton('Remove Path', '', () => {path.removePath(curPath)}));
}

state.biome = new Biome();
state.biome.init();

state.currentLevel = new SquareGridLevel();
state.currentLevel.init();
state.currentLevel.showPlayerStats();
state.currentLevel.redraw();
// document.onmousemove = state.currentLevel.mouseMoveHandler;
