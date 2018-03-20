// includes
const downloader = require('./modules/downloader.js');

// download file
module.exports.download = (query, path, format) => {
  if (path == '')
    throw 'Unspecified filepath.'
  if (query == '')
    throw 'Please provide a search query.'
  downloader.download(query, path, format);
}
