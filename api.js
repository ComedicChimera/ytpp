// includes
const downloader = require('./modules/downloader.js');
const streamer = require('./modules/streamer.js');

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
  return streamer.devices;
}
