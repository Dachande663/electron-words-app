const Electron = require('electron');
const electron = Electron.app;

const WindowManager = require('./src/WindowManager');
const windows = new WindowManager();

const App = require('./src/App');
const app = new App({ Electron: electron, WindowManager: windows });

app.init();
