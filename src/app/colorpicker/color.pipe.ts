import { Pipe, PipeTransform } from '@angular/core';
import { rgbToHsv, stringToHex, stringToRgb } from './color-utils';

@Pipe({
  name: 'color'
})
export class ColorPipe implements PipeTransform {

  transform(value: string, type: string): any {
    let result = "";

    if (type === "rgb") {
      const rgbValue = stringToRgb(value);
      result = `rgb(${rgbValue[0]},${rgbValue[1]},${rgbValue[2]})`;
    } else if (type === "hex") {
      result = stringToHex(value);
    } else if (type === "hsv") {
      const rgbValue = stringToRgb(value);
      const hsvValue = rgbToHsv(rgbValue[0], rgbValue[1], rgbValue[2]);
      result = `hsv(${hsvValue[0]},${hsvValue[1]},${hsvValue[2]})`;
    } else {
      console.error(`Unsupported type to convert the color value ${value}`);
    }

    return result;
  }

}
