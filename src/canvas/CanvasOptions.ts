import { WriteStream } from 'tty';

export interface CanvasOptions {
  stream: WriteStream
  width: number
  height: number
}
