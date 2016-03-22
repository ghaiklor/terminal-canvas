"use strict";

const ytdl = require('ytdl-core');
const Speaker = require('speaker');
const Throttle = require('stream-throttle').Throttle;
const pcmAudio = require('youtube-terminal/lib/pcm-audio');
const ffmpeg = require('youtube-terminal/lib/ffmpeg');
const RawImageStream = require('youtube-terminal/lib/raw-image-stream');
const cursor = require('../lib/Cursor').create();

const CHARACTERS = ' .,:;i1tfLCG08@'.split('');

function imageToAscii(data, width, height) {
  var contrastFactor = 2.95;
  var ascii = '';

  for (var y = 0; y < height; y += 2) {
    for (var x = 0; x < width; x++) {
      var offset = (y * width + x) * 3;
      var r = Math.max(0, Math.min(contrastFactor * (data[offset] - 128) + 128, 255));
      var g = Math.max(0, Math.min(contrastFactor * (data[offset + 1] - 128) + 128, 255));
      var b = Math.max(0, Math.min(contrastFactor * (data[offset + 2] - 128) + 128, 255));
      var brightness = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      ascii += CHARACTERS[Math.round(brightness * 14)];
    }
  }

  return ascii;
}

function playVideo(info) {
  const options = {fps: 30, width: cursor._width};
  const video = info.formats.filter(format => format.resolution === '144p' && format.audioBitrate === null).sort((a, b) => a.container === 'webm' ? -1 : 1)[0];
  const m = video.size.match(/^(\d+)x(\d+)$/);
  const videoSize = {width: m[1], height: m[2]};
  const frameWidth = Math.round(options.width);
  const frameHeight = Math.round(videoSize.height / (videoSize.width / frameWidth));
  const frameSize = frameWidth * frameHeight * 3;

  ffmpeg.rawImageStream(video.url, options)
    .pipe(new Throttle({rate: frameSize * options.fps}))
    .pipe(new RawImageStream(frameSize))
    .on('data', function (frameData) {
      var ascii = imageToAscii(frameData, frameWidth, frameHeight);

      for (var y = 0; y < frameHeight; y++) {
        for (var x = 0; x < frameWidth; x++) {
          cursor.moveTo(x, y).write(ascii[y * frameWidth + x] || '');
        }
      }

      cursor.flush();
    });
}

function playAudio(info) {
  const audio = info.formats.filter(format => format.resolution === null).sort((a, b) => b.audioBitrate - a.audioBitrate)[0];
  const speaker = new Speaker();
  const updateSpeaker = codec => {
    speaker.channels = codec.audio_details[2] === 'mono' ? 1 : 2;
    speaker.sampleRate = parseInt(codec.audio_details[1].match(/\d+/)[0], 10)
  };

  pcmAudio(audio.url).on('codecData', updateSpeaker).pipe(speaker);
}

ytdl.getInfo('https://www.youtube.com/watch?v=Hiqn1Ur32AE', (error, info) => {
  if (error) return console.error(error);

  playVideo(info);
  playAudio(info);
});
