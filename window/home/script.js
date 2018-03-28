// setup jquery
window.$ = window.jQuery = require('jquery');

const youtube = require('../../scripts/youtube.js');

let player;

$(() => {
  function createHandler(id, callback) {
    $('#' + id).mousedown(callback);
  }
  createHandler('start-stream', () => {
    youtube.getVideoDownloadUrl($('#query').val()).then(url => {
      if (player != null && player.queue.length == 0) {
        player = new Player(url, $('#output-device').val());
        player.play();
      }
      else if (player == null) {
        player = new Player(url, $('#output-device').val());
        player.play();
      }
      player.queue.push(url);
    }).catch(e => console.log(e));
  });
  createHandler('stop', () => {
    if (player != null) {
      player.stop();
      player = null;
    }
  });

  createHandler('search', () => {
    youtube.getVideoUrl($('#query').val()).then(url => {
      youtube.getVideoInfo(url).then(info => {
        $('#search-results').html(`<img src='${info.thumbnail}' height='54px' width='96px'/>
          <span class='title'>${info.title}</span>
          <span class='author'>${info.author}</span>
          <span class='url'>${info.url}</span>
          `)
      }).catch(e => console.log(e));
    }).catch(e => console.log(e));
  });

  const {BrowserWindow} = require('electron').remote.require('electron');
  const path = require('path'), urllib = require('url');

  createHandler('download', () => {
    // create sub window
    let subWin = new BrowserWindow({width: 640, height: 480});

    // clear out menu
    subWin.setMenu(null);

    // load index.html
    subWin.loadURL(urllib.format({
      pathname: '../../window/download/index.html',
      protocol: 'file:',
      slashes: true
    }));

    // Open the DevTools.
    subWin.webContents.openDevTools()

    // setup the query string
    subWin.webContents.executeJavaScript(`setup(\'${$('#query').val()}\');`);

    // when window is closed, close window
    subWin.on('closed', () => {
      subWin = null;
    });
  });
});

function updateVolume() {
  if (player != null)
    player.setVolume(Number($('#volume-input').val()));
}
