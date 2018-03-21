const nodeAudio = require('node-core-audio');

let audioEngine = nodeAudio.createNewAudioEngine();

// devices (name, id)
let devices = {

}

(function() {
  let deviceCount = engine.getNumDevices();
  for(var i = 0; i < deviceCount; i++) {
    devices[engine.getDeviceName(i)] = i;
  }
});

module.exports = {
  devices: devices
}
