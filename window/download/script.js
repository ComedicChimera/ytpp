const {getVideoUrl} = require('../../scripts/youtube.js');
const {downloadVideo} = require('../../scripts/download.js');

// called when download button is clicked
function download() {
  let query = document.getElementById('search-query').value,
      format = document.getElementById('format').value,
      filename = document.getElementById('file-path').value
  if(query.indexOf('://www.youtube.com/watch?v=') !== -1) {
    downloadVideo(query, format, filename, (pc) => {
      console.log(pc);
    });
  }
  else {
    getVideoUrl(query).then(url => {
      downloadVideo(url, format, filename, (pc) => {
        console.log(pc);
      });
    }).catch(e => console.log(e));
  }
}

// for opening the save dialog
const {remote} = require('electron');

function openFilePrompt() {
  // open dialog
   let filename = remote.dialog.showSaveDialog();
   // set result into the file-name field
   document.getElementById('file-path').value = filename;
}

function setup(preQuery) {
  document.getElementById('search-query').value = preQuery
}
