"use strict";

const ytdl = require('ytdl-core');
const Speaker = require('speaker');
const asciiPixels = require('ascii-pixels');
const Throttle = require('stream-throttle').Throttle;
const pcmAudio = require('youtube-terminal/lib/pcm-audio');
const ffmpeg = require('youtube-terminal/lib/ffmpeg');
const RawImageStream = require('youtube-terminal/lib/raw-image-stream');
const cursor = require('../lib/Cursor').create();

ytdl.getInfo('https://www.youtube.com/watch?v=dQw4w9WgXcQ', (error, info) => {
  if (error) return console.error(error);

  playAudio(info);
  playVideo(info);
});

function playVideo(info) {
  const options = {fps: 12, width: cursor._width, contrast: 50 * 2.55, invert: true};
  const video = info.formats.filter(format => format.resolution === '144p' && format.audioBitrate === null).sort((a, b) => a.container === 'webm' ? -1 : 1)[0];
  const m = video.size.match(/^(\d+)x(\d+)$/);
  const videoSize = {width: m[1], height: m[2]};
  const frameWidth = Math.round(options.width);
  const frameHeight = Math.round(videoSize.height / (videoSize.width / frameWidth));
  const frameSize = frameWidth * frameHeight * 3;
  const splitRegex = new RegExp(`.{1,${options.width}}`, 'g');

  ffmpeg.rawImageStream(video.url, options)
    .pipe(new Throttle({rate: frameSize * 12}))
    .pipe(new RawImageStream(frameSize))
    .on('data', frameData => {
      var ascii = asciiPixels({
        data: frameData,
        width: frameWidth,
        height: frameHeight,
        format: 'RGB24'
      }, options).match(splitRegex);

      for (var y = 0; y < frameHeight; y++) cursor.moveTo(0, y).write(ascii[y + 1] || '');

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
