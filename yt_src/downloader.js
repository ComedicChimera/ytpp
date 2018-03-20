const ytdl = require('ytdl-core');
const {win} = require('../main.js');
const ytSearch = require('youtube-search');


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
  }
  else {
    getUrl(query).then(result => {

      },
      err => {
        console.log(err);
      }
    );
  }
}

let formatRemaps = {
  'mp3': 'm4a',
  'avi': 'mp4',1
  'mov': 'mp4',
  'wav': 'm4a',
}

function getStream(url, format) {
  if (Object.keys(formatRemaps).includes(format))
    format = formatRemaps[format];
  return ytdl(url, {filter: (format) => format.container === format});
}

async getUrl(query) {
  return new Promise((resolve, reject) => {
    youtube_search(query, {maxResults: 1, key: "--"}, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}
