import { IColor } from '../color/Color';
import { IDisplayOptions } from './DisplayOptions';

export interface ICellOptions {
  x: number
  y: number
  background: IColor
  foreground: IColor
  display: Partial<IDisplayOptions>
}
