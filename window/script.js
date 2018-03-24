// get remote and ipcRenderer (interprocess communication), dialog (for saving)
const {remote, ipcRenderer} = require('electron');

// access the queue manager
const queue = remote.require('./scripts/queue.js');
const downloader = remote.require('./scripts/downloader.js');

// setup jquery
window.$ = window.jQuery = require('jquery');

// apply event handlers on document ready
$(document).ready(() => {
  // configure download handler
  $('#download').mousedown(() => {
    // try and fail if anything goes wrong
    try {
      setStatus('Downloading...', true); // <- set working status
      // get use variables
      let query = $('#query').val(), path = $('#file-path').val();
      if (path == '')
        throw 'Unspecified filepath.'
      if (query == '')
        throw 'Please provide a search query.'
      // download from downloader file
      downloader.download(query, path, $('#format').val());
    }
    catch (e) {
      console.trace(e);
    }
  });

  // configure audio stream handler
  $('#stream').mousedown(() => {
    // get device id to stream to
    getDevices().then(devices => {
      let deviceId = devices[$('#device').val()];
      try {
        // check query and get true url
        let query = $('#query').val();
        if (query == '')
          throw 'Please provide a search query.';
        // play stream
        downloader.getURLFromQuery(query).then(url => {
          playStream(url, $('#volume').val(), deviceId);
        }, err => {
          if (err) throw err;
        });
      }
      catch (e) {
        console.trace(e);
      }
    },
    err => {
      console.trace(err);
    });

  });

  // configure pause button
  $('#set-pause').mousedown(() => {
    // set pause internal api call
    // no known points of fatal failure so no need for try catch
    setStreamPause();

    // update text
    $('#set-pause').html($('#set-pause').html() == 'Pause' ? 'Resume' : 'Pause');
  });

  $('#stop-stream').mousedown(() => {
    // stop audio
    stopStream();
  });

  // allow searching
  $('#search').mousedown(() => {
    // get info and eval promise
    downloader.getVideoInfo($('#query').val()).then(data => {
      let htmlifiedResponse = `<img height=\'54px\' width=\'96px\' src=\'${data.thumbnail}\'/>
      \n<span class=\'title\'>${data.title}</span>
      \n<br /><span class=\'video-url\'>${data.url}</span>`;

      // add into search results
      $('#search-results').html(htmlifiedResponse);
    },
    err => {
      // update status if failed to get info
      console.trace(err);
    });
  });

  // select download location
  $('#select-file').mousedown(() => {
    // open dialog
    let filename = remote.dialog.showSaveDialog();
    // set result into the file-name field
    $('#file-path').val(filename);
  });

  // add to queue button
  $('#add-elem-to-queue').mousedown(() => {
    queue.addToQueue($('#query').val(), () => {
      $('.queue').html(queue.renderQueue());
    });
  })
});

// set progress bar and status message
function setStatus(message, working) {
  // set status variable
  $('#status').html(message);
  // TODO update working status
}

// handle volume displaying and updating
function updateAllVolume(value) {
  updateVolume(value);
  if (value == 0)
    $('#volume-icon').attr('src', '../images/volume-silent.png');
  else if (value <= 33)
    $('#volume-icon').attr('src', '../images/volume-low.png');
  else if (value <= 67)
    $('#volume-icon').attr('src', '../images/volume-medium.png');
  else
    $('#volume-icon').attr('src', '../images/volume-high.png');

}

// allow main process to set the remote status
ipcRenderer.on('set-status', (event, args) => {
  setStatus(args.message, args.progress);
});
