const queue = require('../../scripts/queue.js');


class Player {
  constructor(url, device) {
    this._audio = document.getElementById('player');
    this._audio.src = url;
    this._audio.setSinkId(Player.devices[device]);
    this.queue = [];
    this._audio.on('ended', () => {
      this.queue.shift();
      this.play(this.queue[0], this._audio.sinkId);
      queue.draw(this.queue);
    });
  }

  play() {
    this._audio.play();
  }

  stop() {
    this._audio.stop();
  }

  set volume(amount) {
    this._audio.volume = Number(amount) / 100;
  }
}

// get the devices
new Promise((resolve, reject) => {
  navigator.mediaDevices.enumerateDevices().then(devices => {
    let audioDevices = devices.filter(device => device.kind === 'audiooutput');
    let deviceDict = {};
    for(var device of devices) {
      deviceDict[device.label] = device.deviceId;
    }
    Player.devices = deviceDict;
    resolve();
  }).catch(e => reject(e));
}).then(() => {
  for(var device of Object.keys(Player.devices)) {
    $('#output-device').append(`<option>${device}</option>`);
  }
}).catch(e => console.log(e));
