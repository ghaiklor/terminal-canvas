const ytdl = require('ytdl-core');
const Speaker = require('speaker');
const Throttle = require('stream-throttle').Throttle;
const pcmAudio = require('youtube-terminal/lib/pcm-audio');
const ffmpeg = require('youtube-terminal/lib/ffmpeg');
const ChopStream = require('chop-stream');
const canvas = require('..').create();

const CHARACTERS = ' .,:;i1tfLCG08@'.split('');

function imageToAscii(data, width, height) {
  const contrastFactor = 2.95;
  let ascii = '';

  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * 3;
      const r = Math.max(0, Math.min(contrastFactor * (data[offset] - 128) + 128, 255));
      const g = Math.max(0, Math.min(contrastFactor * (data[offset + 1] - 128) + 128, 255));
      const b = Math.max(0, Math.min(contrastFactor * (data[offset + 2] - 128) + 128, 255));
      const brightness = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      ascii += CHARACTERS[Math.round(brightness * 14)];
    }
  }

  return ascii;
}

function playVideo(info) {
  const video = info.formats.filter(format => format.quality === 'tiny' && format.audioBitrate === null).sort((a) => a.container === 'webm' ? -1 : 1)[0];
  const videoSize = { width: video.width, height: video.height };
  const frameHeight = Math.round(canvas.height * 2);
  const frameWidth = Math.round(frameHeight * (videoSize.width / videoSize.height));
  const frameSize = frameWidth * frameHeight * 3;

  ffmpeg.rawImageStream(video.url, { fps: 30, width: frameWidth })
    .on('start', () => canvas.saveScreen().reset())
    .on('end', () => canvas.restoreScreen())
    .pipe(new Throttle({ rate: frameSize * 30 }))
    .pipe(new ChopStream(frameSize))
    .on('data', function (frameData) {
      const ascii = imageToAscii(frameData, frameWidth, frameHeight);

      for (let y = 0; y < frameHeight; y++) {
        for (let x = 0; x < frameWidth; x++) {
          canvas
            .moveTo(x + (canvas.width / 2 - frameWidth / 2), y)
            .write(ascii[y * frameWidth + x] || '');
        }
      }

      canvas.flush();
    });
}

function playAudio(info) {
  const audio = info.formats.filter(format => format.quality === 'tiny').sort((a, b) => b.audioBitrate - a.audioBitrate)[0];
  const speaker = new Speaker();
  const updateSpeaker = codec => {
    speaker.channels = codec.audio_details[2] === 'mono' ? 1 : 2;
    speaker.sampleRate = parseInt(codec.audio_details[1].match(/\d+/)[0], 10);
  };

  pcmAudio(audio.url).on('codecData', updateSpeaker).pipe(speaker);
}

ytdl.getInfo('https://www.youtube.com/watch?v=Hiqn1Ur32AE', (error, info) => {
  if (error) return console.error(error);

  playVideo(info);
  playAudio(info);
});

process.on('SIGTERM', () => canvas.restoreScreen());
