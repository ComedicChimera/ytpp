// includes
const {app, BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');

// configure ffmpeg and send-key
process.env.FFMPEG_BIN_PATH = path.join(__dirname, 'ffmpeg.exe');
process.env.FFPLAY_BIN_PATH = path.join(__dirname, 'ffplay.exe');
process.env.SEND_KEY_BIN_PATH = path.join(__dirname, 'modules/ffplay-ipc/send-key.exe');

// window variable
let win;

// create browser window
function createWindow() {
  win = new BrowserWindow({width: 960, height: 720});

  // remove top menu
  win.setMenu(null);

  // load index.html
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  win.webContents.openDevTools()

  // when window is closed, close window
  win.on('closed', () => {
    win = null;
  });
}

// start app when ready
app.on('ready', createWindow);

// when the windows are all closed
app.on('window-all-closed', () => {
  // do not close if on MacOS
  if (process.platform !== 'darwin')
    app.quit();
});

// MacOS doc reopen
app.on('activate', () => {
  if (win === null)
    createWindow();
});

// sets the remote page status (status message and progress bar)
module.exports.setRemoteStatus = (message, progress) => {
  win.webContents.send('set-status', {
    message: message,
    progress: progress
  });
}
