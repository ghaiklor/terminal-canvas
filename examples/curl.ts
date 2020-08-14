/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/prefer-ts-expect-error */

import { Canvas } from '..';
// @ts-ignore
import ChopStream from 'chop-stream';
import { Throttle } from 'stream-throttle';
import { createServer } from 'http';
import ffmpeg from 'fluent-ffmpeg';
import ytdl from 'ytdl-core';

const PORT = process.env.PORT ?? 8080;
const CHARACTERS = ' .,:;i1tfLCG08@'.split('');

createServer(async (request, response) => {
  const url = (request.headers['x-youtube-url'] ?? 'https://www.youtube.com/watch?v=Hiqn1Ur32AE') as string;
  const useColors = (request.headers['x-use-colors'] ?? 'false') === 'true';
  const width = parseInt((request.headers['x-viewport-width'] ?? '100') as string, 10);
  const height = parseInt((request.headers['x-viewport-height'] ?? '100') as string, 10);

  // @ts-ignore
  const canvas = Canvas.create({ stream: response, height, width }).reset();
  const info = await ytdl.getInfo(url);

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
      if (useColors) {
        for (let y = 0; y < frameHeight; y += 1) {
          for (let x = 0; x < frameWidth; x += 1) {
            const offset = (y * frameWidth + x) * 3;
            const r = frameData[offset];
            const g = frameData[offset + 1];
            const b = frameData[offset + 2];

            canvas
              .moveTo(x + (canvas.width / 2 - frameWidth / 2), y + (canvas.height / 2 - frameHeight / 2))
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

            canvas
              .moveTo(x + (canvas.width / 2 - frameWidth / 2), y + (canvas.height / 2 - frameHeight / 2))
              .write(CHARACTERS[Math.round(brightness * 14)]);
          }
        }
      }

      canvas.flush();
    });
}).listen(PORT);
