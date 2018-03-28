const ytdl = require('youtube-dl');
const {transcode} = require('../ffmpeg/ffmpeg-util.js');
const {createWriteStream, stat} = require('fs');


// all unavailable formats for youtube with their downloadable equivalents (for transcoding)
let formatRemaps = {
  'mp3': 'm4a',
  'avi': 'mp4',
  'mov': 'mp4',
  'wav': 'm4a',
}

// given a stream, format, and a filename, it transcodes and downloads a stream
module.exports.downloadVideo = (url, format, filename, callback) => {
  let downloadFormat = format;
  // remap formats to downloadable types
  if (Object.keys(formatRemaps).includes(format))
    downloadFormat = formatRemaps[format];
  // get stream (-f format)
  let stream = ytdl(url, ['-f', downloadFormat]);

  // check if transcoding is necessary
  if (Object.keys(formatRemaps).includes(format)) {
    // transcode stream and pipe to file
    let r = transcode(stream, format).pipe(createWriteStream(filename));

    // download percentage event (broken)
    /*let dataDownloaded = 0;
    stat(filename, (stats) => {
      // give progress updates
      r.on('data', (chunk) => {
        dataDownloaded += chunk.length
        callback(dataDownloaded / stats.size * 100);
      })
    });*/

    // when file finishes, alert user
    r.on('close', () => callback(100) );
  }
  else {
    // pipe to file
    let r = stream.pipe(createWriteStream(filename));

    // when file finishes, alert user
    r.on('close', () => callback(100) );
  }
}
