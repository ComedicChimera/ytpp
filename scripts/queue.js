// use for video data
const ytdl = require('youtube-dl');
const {getVideoUrl} = require('./downloader.js');

// song queue
let queue = [];

// add song to queue
// query == url or name
module.exports.addToQueue = (query, callback) => {
  // info == ytdl.getInfo
  getData(query).then(info => {
    // add to queue
    queue.push(info);
    callback();
  },
  // throw any errors
  err => {
    if (err) throw err;
  });
}

// return an html version of the queue
module.exports.renderQueue = () => {
  // html holder
  let html = '';
  for(var item of queue) {
    // template of list element
    html += `<li><div class=\'queue-element\'>\n\t<img height=\'54px\' width=\'96px\'
    src=\'${item.thumbnailUrl}\'/>\n\t
    <span class=\'title\'>${item.title}</span>\n\t
    <span class=\'author\'>${item.author}</span>\n\t
    <span class=\'duration\'>${item.duration}</span>\n
    </div></li>`;
  }
  return html;
}

async function getData(query) {
  // get a promise of data
  return new Promise(function(resolve, reject) {
    // get the video url
    getUrl(query).then(url => {
      // get info for queue
      ytdl.getInfo(url, ['-f', 'm4a'], (err, info) => {
        if (err) reject(err);
        resolve({
          title: info.fulltitle,
          url: info.url,
          author: info.uploader,
          duration: info.duration,
          thumbnailUrl: info.thumbnail
        });
      });
    },
    // handle errors
    err => { if (err) reject(err) }
  )
  },
  err => {
    // handle errors
    if (err) reject(err);
  });
}

function getUrl(query) {
  // use downloaders get url algorithm to get data
  return new Promise(function(resolve, reject) {
    if (query.indexOf('://www.youtube.com/watch?v=') !== -1)
      resolve(query);
    else
      getVideoUrl(query).then(url => resolve(url), err => { if (err) reject(err) });
  });

}
