const ytdl = require('youtube-dl');
const https = require('https');


// returns the full video info
/*
{
  title: video title
  thumbnail: thumbnail img url
  url: youtube watch url
  trueUrl: actual video url
  author: creator / channel that uploaded video
  duration: the duration of the video
}
*/
async function getInfo(url) {
  return new Promise(function(resolve, reject) {
    ytdl.getInfo(url, (err, info) => {
      if (err) reject(err);
      else resolve({
        title: info.fulltitle,
        thumbnail: info.thumbnail,
        url: url,
        trueUrl: info.url,
        author: info.uploader,
        duration: info.duration
      });
    });
  });
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

// get the video download url
module.exports.getVideoDownloadUrl = async query => {
  // return promise
  return new Promise((resolve, reject) => {
    // if it has the formatting of a url, the get it
    if(query.indexOf('://www.youtube.com/watch?v=') !== -1) {
      getInfo(query).then(info => {
        resolve(info.trueUrl);
      }).catch(e => reject(e));
    }
    // otherwise get the url first, and then return
    else {
      getUrl(query).then(url => {
        getInfo(url).then(info => {
          resolve(info.trueUrl);
        }).catch(e => reject(e));
      }).catch(e => reject(e));
    }
  });
}

module.exports.getVideoInfo = getInfo;

module.exports.getVideoUrl = getUrl;
