const ytdl = require('ytdl-core');
const {win} = require('../main.js');
const https = require('https');
const fs = require('fs');
const transcoder = require('stream-transcoder');


function setRemoteStatus(message, progress) {
  win.webContents.send('set-status', {
    message: message,
    progress: progress
  });
}

module.exports.download = (query, path, format) => {
  let stream;
  if (query.indexOf('://www.youtube.com/watch?v=') !== -1) {
    stream = getStream(query, format);
    downloadStream(stream, format, path);
  }
  else {
    getUrl(query).then(result => {
        stream = getStream(result);
        downloadStream(stream, format, path);
      },
      err => {
        console.log(err);
      }
    );
  }
}

let formatRemaps = {
  'mp3': 'm4a',
  'avi': 'mp4',
  'mov': 'mp4',
  'wav': 'm4a',
}

function downloadStream(stream, format, filename) {
  if (Object.keys(formatRemaps).includes(format)) {
    new transcoder(stream)
      .format(format)
      .stream()
      .pipe(fs.createWriteStream(filename));
  }
  else {
    stream.pipe(fs.createWriteStream(filename));
  }
}

function getStream(url, format) {
  if (Object.keys(formatRemaps).includes(format))
    format = formatRemaps[format];
  return ytdl(url, {filter: (format) => format.container === format});
}

async function getUrl(query) {
  return new Promise((resolve, reject) => {
    https.get('https://www.youtube.com/results?search_query=' + encodeURIComponent(query), res => {
      if (res.statusCode !== 200)
        reject(res.statusCode);
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve('https://www.youtube.com/watch?v=' + data.match(/href=\"\/watch[^\"]+/g)[0].slice(15));
      });
    });
  });
}
