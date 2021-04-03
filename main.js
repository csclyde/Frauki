var electron = require('electron');
var app = electron.app;  // Module to control application life.
var BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
var ipcMain = electron.ipcMain;


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
var mainWindow = null;


function createWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true, 
    frame: false, 
    cursor: 'none', 
    enableRemoteModule: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  mainWindow.loadFile('index.html');
  mainWindow.app = app;

  // Open the devtools.
  // mainWindow.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  ipcMain.on('close-app', function(event, arg) {
    app.exit(0);
  });
}

app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
});
