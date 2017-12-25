'use strict';


const Electron = require('electron');
const BrowserWindow = Electron.BrowserWindow;
const Url = require('url');


module.exports = class WindowManager {


	constructor() {
		this.windows = [];
	}


	newWindow(params) {

		// @todo offset from previous
		// @todo pass dirPath

		let win = new BrowserWindow({
			width: 1500,
			height: 640,
			x: 40,
			y: 60,
			title: 'Words', // @todo
		});

		let url = Url.format({
			protocol: 'file',
			slashes: true,
			pathname: `${__dirname}/../views/finder.html`,
			// query: params,
		});

		win.loadURL(url);

		win.webContents.openDevTools();

		win.on('close', () => {
			this.destroyWindow(win);
		});

		this.windows.push(win);

	}


	destroyWindow(win) {

		const idx = this.windows.indexOf(win);

		if(idx > -1) {
			this.windows.splice(idx, 1);
		}

		win = null;

	}


}
