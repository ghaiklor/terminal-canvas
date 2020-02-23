import { IColor } from '../color/Color';
import { DisplayOptions } from './DisplayOptions';

export interface CellOptions {
  x: number
  y: number
  background: IColor
  foreground: IColor
  display: Partial<DisplayOptions>
}
