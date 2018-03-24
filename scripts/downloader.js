const {setRemoteStatus} = require('../main.js');
const https = require('https');
const fs = require('fs');
const {transcode} = require('../ffmpeg/ffmpeg-util.js');
const ytdl = require('youtube-dl');


// main download function
module.exports.download = (query, path, format) => {
  // variable to hold the stream
  let stream;
  // check if it is a url
  if (query.indexOf('://www.youtube.com/watch?v=') !== -1) {
    // create, download, and transcode stream
    stream = getStream(query, format);
    downloadStream(stream, format, path);
  }
  // else use custom search method to get it
  else {
    getUrl(query).then(result => {
        // create, download, and transcode stream
        stream = getStream(result, format);
        downloadStream(stream, format, path);
      },
      err => {
        console.log(err);
      }
    );
  }
}

// get a transcoded download stream from the query
module.exports.getURLFromQuery = async query => {
  return new Promise((resolve, reject) => {
    // apply url rules
    // return stream
    if (query.indexOf('://www.youtube.com/watch?v=') !== -1) {
      ytdl.getInfo(query, ['-f', 'm4a'], (err, info) => {
        if (err) reject(err);
        resolve(info.url);
      });
    }
    else {
      getUrl(query).then(result => {
        ytdl.getInfo(result, ['-f', 'm4a'], (err, info) => {
          if (err) reject(err);
          resolve(info.url);
        });
      }, err => { reject(err); })
    }
  });
}

// all unavailable formats for youtube with their downloadable equivalents (for transcoding)
let formatRemaps = {
  'mp3': 'm4a',
  'avi': 'mp4',
  'mov': 'mp4',
  'wav': 'm4a',
}

// given a stream, format, and a filename, it transcodes and downloads a stream
function downloadStream(stream, format, filename) {
  // check if transcoding is necessary
  if (Object.keys(formatRemaps).includes(format)) {
    // transcode stream and pipe to file
    let r = transcode(stream, format).pipe(fs.createWriteStream(filename));

    // when file finishes, alert user
    r.on('close', () => setRemoteStatus('Download Complete!', false) );
  }
  else {
    // pipe to file
    let r = stream.pipe(fs.createWriteStream(filename));

    // when file finishes, alert user
    r.on('close', () => setRemoteStatus('Download Complete!', false) );
  }
}

// use ytdl to get stream
function getStream(url, format) {
  // remap formats to downloadable types
  if (Object.keys(formatRemaps).includes(format))
    format = formatRemaps[format];
  // get stream (-f format)
  return ytdl(url, ['-f', format]);
}

// get the page url
// returns promise
async function getUrl(query) {
  // return new promise
  return new Promise((resolve, reject) => {
    // get search page
    https.get('https://www.youtube.com/results?search_query=' + encodeURIComponent(query), res => {
      // rejection if https failed
      if (res.statusCode !== 200)
        reject(res.statusCode);
      // get page data
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        // find url and return it
        resolve('https://www.youtube.com/watch?v=' + data.match(/href=\"\/watch[^\"]+/g)[0].slice(15));
      });
    });
  });
}

module.exports.getVideoUrl = getUrl;

// get video info
module.exports.getVideoInfo = async (query) => {
  // return usable promise
  return new Promise((resolve, reject) => {
    // it is it is a url, don't call getUrl
    if (query.indexOf('://www.youtube.com/watch?v=') !== -1) {
      let data = ytdl.getInfo(query, (err, info) => {
        if (err) reject(err);
        else resolve({
          title: info.title,
          thumbnail: info.thumbnail,
          url: query
        });
      });
    }
    else {
      // else getUrl and return response
      getUrl(query).then(url => {
        let data = ytdl.getInfo(url, (err, info) => {
          if (err) reject(err);
          else resolve({
            title: info.title,
            thumbnail: info.thumbnail,
            url: url
          });
        });
      },
      err => {
        reject(err);
      });
    }
  });
}
