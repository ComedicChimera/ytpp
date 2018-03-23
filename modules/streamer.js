const spawn = require('child_process').spawn;
const os = require('os');

// ffplay process
let child;

// whether or not it is paused
let paused = true;


module.exports.playStream = (stream, volume, device) => {
  // stop now playing
  if (child != null) {
    child.write('q');
    paused = false;
  }

  // basic arguments
  let arguments = ['-i', '-', '-nodisp', '-volume', String(volume)];

  // spawn subprocess
  child = spawn(process.env.FFPLAY_BIN_PATH, arguments, {
    cwd: os.tmpdir()
  });

  // when process is done, cleanup
  child.on('exit', (err) => {
    child = null;
    paused = false;
    if (err) throw err;
  });

  // unpipe if streaming fails
  child.stdin.on('error', (err) => {
    stream.unpipe(child.stdin);
  });

  // pipe stream to ffplay
  stream.pipe(child.stdin);
}


// update pause state
module.exports.setPause = () => {
  // if no player currently running, silently fail
  if (child == null)
    return;

  // pause / unpause
  child.kill(paused ? 'SIGCONT' : 'SIGSTOP');
  paused = !paused;
}

// stop playing
module.exports.stop = () => {
  // if no player, silently fail
  if (child == null)
    return;

  // kill child process
  // child will cleanup on its own
  child.kill();

  // reset pause state
  pause = false;
}
