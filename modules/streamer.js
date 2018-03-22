const portAudio = require('naudiodon');

module.exports.playStream = (stream, volume, device) => {
  let ao = new portAudio.AudioOutput({
    channelCount: 2,
    sampleFormat: portAudio.SampleFormat16Bit,
    sampleRate: 44100
  });
  stream.on('end', ao.end);
  stream.pipe(ao);
  ao.start();
}
