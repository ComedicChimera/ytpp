// includes
const downloader = require('./modules/downloader.js');
const streamer = require('./modules/streamer.js');
const portAudio = require('naudiodon');

// download file
module.exports.download = (query, path, format) => {
  if (path == '')
    throw 'Unspecified filepath.'
  if (query == '')
    throw 'Please provide a search query.'
  // download from downloader file
  downloader.download(query, path, format);
}

// get a list of devices
module.exports.getDevices = () => {
  let deviceNames = {};
  for(var x of portAudio.getDevices()) {
    if (x.maxOutputChannels == 2) {
      deviceNames[x.name] = x.id;
    }
  }
  return deviceNames;
}

// play stream
module.exports.playStream = (query, volume, device) => {
  if (query == '')
    throw 'Please provide a search query.';
  downloader.getStreamFromQuery(query).then(stream => {
    streamer.playStream(stream, volume, device);
  }, err => {
    throw err;
  });
}
