'use strict';


module.exports = class App {


	constructor({ Electron, WindowManager }) {
		this.electron = Electron;
		this.windows = WindowManager;
	}


	init() {

		this.electron.on('ready', () => {
			this.windows.newWindow();
		});


		this.electron.on('window-all-closed', () => {
			if (process.platform !== 'darwin') {
				app.quit();
			}
		});


		this.electron.on('activate', () => {
			if(this.windows.length === 0) {
				this.windows.newWindow();
			}
		});

	}


}
