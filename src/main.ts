import Tile from './classes/Tile';
import { ETileType } from "./enums/ETileType";
import utils from "./shared/utils";
import './style/main.scss';
import state from './state';
import Level from './classes/Level';

var dMenu = document.querySelector('#app .menu-box');
if (dMenu) {
	let d = (dMenu as HTMLElement);

	d.appendChild(utils.createButton('Tick', '', () => {execTick();}));
	d.appendChild(utils.createButton('Start', '', () => {mainProcess();}));
	d.appendChild(utils.createButton('Pause', '', () => {window.clearTimeout(currentTimeout);}));
}

state.currentLevel = new Level();

const execTick = () => {
	state.tileIdMap.forEach(t => {
		let toUpdate = false;
		if (t.stats.hasTickAction) {
			t.stats.tickExec();
			toUpdate = true;
		}
		if (toUpdate || t.needsUpdate)
			t.updateTile();
	})
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
