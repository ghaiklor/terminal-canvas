// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import ChopStream from 'chop-stream';

import { Canvas } from '..';
import { Throttle } from 'stream-throttle';
import ffmpeg from 'fluent-ffmpeg';
import Speaker from 'speaker';
import ytdl, { videoInfo } from 'ytdl-core';

const YOUTUBE_URL = process.env.YOUTUBE_URL ?? 'https://www.youtube.com/watch?v=Hiqn1Ur32AE';
const CHARACTERS = ' .,:;i1tfLCG08@'.split('');
const canvas = Canvas.create().reset();

function imageToAscii(data: number[], width: number, height: number): string {
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

function playVideo(info: videoInfo): void {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const video = info.formats.find(format => format.quality === 'tiny' && format.container === 'webm' && format.audioChannels === undefined)!;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const videoSize = { width: video.width!, height: video.height! };
  const frameHeight = Math.round(canvas.height * 2);
  const frameWidth = Math.round(frameHeight * (videoSize.width / videoSize.height));
  const frameSize = frameWidth * frameHeight * 3;

  return ffmpeg(video.url)
    .format('rawvideo')
    .videoFilters([
      { filter: 'fps', options: 30 },
      { filter: 'scale', options: `${frameWidth}:-1` }
    ])
    .outputOptions('-pix_fmt', 'rgb24')
    .outputOptions('-update', '1')
    .on('start', () => canvas.saveScreen().reset())
    .on('end', () => canvas.restoreScreen())
    .pipe(new Throttle({ rate: frameSize * 30 }))
    .pipe(new ChopStream(frameSize))
    .on('data', function (frameData: number[]) {
      const ascii = imageToAscii(frameData, frameWidth, frameHeight);

      for (let y = 0; y < frameHeight; y++) {
        for (let x = 0; x < frameWidth; x++) {
          canvas
            .moveTo(x + (canvas.width / 2 - frameWidth / 2), y)
            .write(ascii[y * frameWidth + x] ?? '');
        }
      }

      canvas.flush();
    });
}

function playAudio(info: videoInfo): NodeJS.WritableStream {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const audio = info.formats.find(format => format.quality === 'tiny' && format.container === 'webm' && format.audioChannels === 2)!;

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const speaker = new Speaker({ channels: 2, sampleRate: 44100 });

  return ffmpeg(audio.url)
    .noVideo()
    .audioCodec('pcm_s16le')
    .format('s16le')
    .pipe(speaker);
}

(async () => {
  const info = await ytdl.getInfo(YOUTUBE_URL);

  playVideo(info);
  playAudio(info);
})().catch(error => console.error(error));

process.on('SIGTERM', () => canvas.restoreScreen());
