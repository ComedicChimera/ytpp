// includes
const downloader = require('./modules/downloader.js');

// download file
module.exports.download = (query, path, format) => {
  if (path == '')
    throw 'Unspecified filepath.'
  if (query == '')
    throw 'Please provide a search query.'
  // download from downloader file
  downloader.download(query, path, format);
}

// play stream
module.exports.getStreamUrl = (query) => {
  return new Promise(async (resolve, reject) => {
    if (query == '')
      throw 'Please provide a search query.';
    downloader.getURLFromQuery(query).then(url => {
      resolve(url);
    }, err => {
      reject(err);
    });
  });
}

// get youtube info
module.exports.getInfo = downloader.getVideoInfo;
