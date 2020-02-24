import { WriteStream } from 'tty';

export interface ICanvasOptions {
  stream: WriteStream
  width: number
  height: number
}
