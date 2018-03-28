const youtube = require('./youtube.js');


// return an html version of the queue
module.exports.draw = (queue) => {
  // html holder
  let html = '';
  for(var elem of queue) {
    youtube.getVideoInfo(elem).then(() => {
      // template of list element
      html += `<li><div class=\'queue-element\'>\n\t<img height=\'54px\' width=\'96px\'
      src=\'${item.thumbnailUrl}\'/>\n\t
      <span class=\'title\'>${item.title}</span>\n\t
      <span class=\'author\'>${item.author}</span>\n\t
      <span class=\'duration\'>${item.duration}</span>\n
      </div></li>`;
    }).catch(e => console.log(e));
  }
  return html;
}
