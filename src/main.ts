import utils from "./shared/utils";
import path from "./shared/path";
import './style/main.scss';
import state from './state';
import Level from "./classes/Level";
import TilePos from "./classes/TilePos";

// if I need to intercept keypresses
// window.addEventListener("keydown", (e:KeyboardEvent) => {
// 	console.log(e);
// 	e.preventDefault();
// }, false);

var curPath = "";

var dMenu = document.querySelector('#app .menu-box');
if (dMenu) {
	let d = (dMenu as HTMLElement);

	d.appendChild(utils.createButton('Tick', '', () => {state.execTick();}));
	d.appendChild(utils.createButton('Start', '', () => {state.playGame();}));
	d.appendChild(utils.createButton('Pause', '', () => {state.stopGame()}));
	d.appendChild(utils.createButton('Draw Path', '', () => {curPath = path.drawPath(state.currentLevel!.player.currentPath)}));
	d.appendChild(utils.createButton('Remove Path', '', () => {path.removePath(curPath)}));
}

state.currentLevel = new Level();
state.currentLevel.init();
state.currentLevel!.movePlayer(new TilePos(0,0,0));