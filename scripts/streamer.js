// audio player
let audio;

// position in stream
let time;


// play audio stream
function playStream(url, volume, device) {
  audio = new Audio(url);
  audio.volume = volume / 100;
  audio.setSinkId(device);
  audio.play();
}


// returns a promise of a dict of devices
// { name: id }
async function getDevices() {
  return new Promise(async (resolve, reject) => {
    let devices = await navigator.mediaDevices.enumerateDevices();
    let audioDevices = devices.filter(device => device.kind === 'audiooutput');
    let deviceDict = {};
    for(var device of devices) {
      deviceDict[device.label] = device.deviceId;
    }
    resolve(deviceDict);
  });
}

// stop the audio
function stopStream() {
  if (audio) {
    audio.pause();
    audio = null;
  }
}

// invert pause
function setStreamPause() {
  if (audio.paused) {
    audio.currentTime = time;
    audio.play();
  }
  else {
    time = audio.currentTime;
    audio.pause();
  }
}

// update volume
function updateVolume(newVol) {
  if (audio)
    audio.volume = newVol / 100;
}
