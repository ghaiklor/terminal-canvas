/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/prefer-ts-expect-error */

import ytdl, { videoInfo } from 'ytdl-core';
import { Canvas } from '..';
// @ts-ignore
import ChopStream from 'chop-stream';
import Speaker from 'speaker';
import { Throttle } from 'stream-throttle';
import ffmpeg from 'fluent-ffmpeg';

const YOUTUBE_URL = process.env.YOUTUBE_URL ?? 'https://www.youtube.com/watch?v=Hiqn1Ur32AE';
const CHARACTERS = ' .,:;i1tfLCG08@'.split('');
const canvas = Canvas.create().reset();

function playVideo (info: videoInfo): void {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const video = info.formats.find(
    (format) => format.quality === 'tiny' && format.container === 'webm' && typeof format.audioChannels === 'undefined',
  )!;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const videoSize = { width: video.width!, height: video.height! }!;
  const scale = Math.min(canvas.width / videoSize.width, canvas.height / videoSize.height);
  const frameWidth = Math.floor(videoSize.width * scale);
  const frameHeight = Math.floor(videoSize.height * scale);
  const frameSize = frameWidth * frameHeight * 3;

  ffmpeg(video.url)
    .format('rawvideo')
    .videoFilters([
      { filter: 'fps', options: 30 },
      { filter: 'scale', options: `${frameWidth}:${frameHeight}` },
    ])
    .outputOptions('-pix_fmt', 'rgb24')
    .outputOptions('-update', '1')
    .on('start', () => canvas.saveScreen().reset())
    .on('end', () => canvas.restoreScreen())
    .pipe(new Throttle({ rate: frameSize * 30 }))
    .pipe(new ChopStream(frameSize))
    .on('data', (frameData: number[]) => {
      if (process.env.USE_COLOR === 'true') {
        for (let y = 0; y < frameHeight; y += 1) {
          for (let x = 0; x < frameWidth; x += 1) {
            const offset = (y * frameWidth + x) * 3;
            const r = frameData[offset];
            const g = frameData[offset + 1];
            const b = frameData[offset + 2];

            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            canvas
              .moveTo(x + (canvas.width / 2 - frameWidth / 2), y)
              .background(`rgb(${r}, ${g}, ${b})`)
              .write(' ');
          }
        }
      } else {
        const contrastFactor = 2.95;

        for (let y = 0; y < frameHeight; y += 1) {
          for (let x = 0; x < frameWidth; x += 1) {
            const offset = (y * frameWidth + x) * 3;
            const r = Math.max(0, Math.min(contrastFactor * (frameData[offset] - 128) + 128, 255));
            const g = Math.max(0, Math.min(contrastFactor * (frameData[offset + 1] - 128) + 128, 255));
            const b = Math.max(0, Math.min(contrastFactor * (frameData[offset + 2] - 128) + 128, 255));
            const brightness = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;

            canvas.moveTo(x + (canvas.width / 2 - frameWidth / 2), y).write(CHARACTERS[Math.round(brightness * 14)]);
          }
        }
      }

      canvas.flush();
    });
}

function playAudio (info: videoInfo): NodeJS.WritableStream {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const audio = info.formats.find(
    (format) => format.quality === 'tiny' && format.container === 'webm' && format.audioChannels === 2,
  )!;

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
})().catch((error) => process.stderr.write(error));

process.on('SIGTERM', () => canvas.restoreScreen());
