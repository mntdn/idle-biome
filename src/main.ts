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

	d.appendChild(utils.createButton('Tick', '', () => {execTick();}));
	d.appendChild(utils.createButton('Start', '', () => {mainProcess();}));
	d.appendChild(utils.createButton('Pause', '', () => {window.clearTimeout(currentTimeout);}));
	d.appendChild(utils.createButton('Draw Path', '', () => {curPath = path.drawPath(state.currentLevel!.player.currentPath)}));
	d.appendChild(utils.createButton('Remove Path', '', () => {path.removePath(curPath)}));
}

state.currentLevel = new Level();
state.currentLevel.init();
state.currentLevel!.movePlayer(new TilePos(0,0,-0));

const execTick = () => {
	if(state.currentLevel){
		state.currentLevel.tileIdMap.forEach(t => {
			let toUpdate = false;
			if (t.stats.hasTickAction) {
				t.stats.tickExec();
				toUpdate = true;
			}
			if (toUpdate || t.needsUpdate)
				t.updateTile();
		})
	}
}

var tickTimeMs = 1000;
var currentTimeout: number;

const mainProcess = () => {
	execTick();
	setTimer();
};

const setTimer = () => {
	currentTimeout = window.setTimeout(mainProcess, tickTimeMs);
};
