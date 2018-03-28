// spawn instance of ffmpeg
const spawn = require('child_process').spawn;
const os = require('os');
const path = require('path');

// ffmpeg binary path
const FFMPEG_BIN_PATH = path.join(__dirname, 'ffmpeg.exe');

module.exports.transcode = (stream, format) => {
  // base args
  let args = ['-i', '-', '-f', format, 'pipe:1'];

  // special mp4 flags
  if (format == 'mp4') args.concat(['-movflags', 'frag_keyframe+faststart']);

  // spawn process
  let child = spawn(FFMPEG_BIN_PATH, args, {
    cwd: os.tmpdir()
  });

  // handle exit code
  child.on('exit', (err) => {
    // throw any errors
    if (err) throw err;
  });

  // stop piping stream when stdin closes
  child.stdin.on('error', () => {
    stream.unpipe(child.stdin);
  });

  // pipe data to ffmpeg
  stream.pipe(child.stdin);

  // return output stream
  return child.stdout;
}
