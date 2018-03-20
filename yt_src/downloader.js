const ytdl = require('ytdl-core');


module.exports.download = (query, path, format) => {
  let stream;
  if (query.indexOf('://www.youtube.com/watch?v=') !== -1) {
    stream = getStream(query, format);
  }
  else {
    stream = getStream(getUrl(query), format);
  }
}

let formatRemaps = {
  'mp3': 'm4a',
  'avi': 'mp4',
  'mov': 'mp4',
  'wav': 'm4a',
}

function getStream(url, format) {
  if (Object.keys(formatRemaps).includes(format))
    format = formatRemaps[format];
  return ytdl(url, {filter: (format) => format.container === format});
}

function getUrl(query) {
  
}
