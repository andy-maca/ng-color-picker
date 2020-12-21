import { Component, OnInit } from '@angular/core';
import { RgbToHex, rgbToHsv, stringToRgb } from '../color-utils';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.less']
})
export class ColorPickerComponent implements OnInit {
  basicColors = [
    "#000000", "#AA0000", "#005500", "#AA5500", "#00AA00", "#AAAA00", "#00FF00", "#AAFF00",
    "#00007F", "#AA007F", "#00557F", "#AA557F", "#00AA7F", "#AAAA7F", "#00FF7F", "#AAFF7F",
    "#0000FF", "#AA00FF", "#0055FF", "#AA55FF", "#00AAFF", "#AAAAFF", "#00FFFF", "#AAFFFF",
    "#550000", "#FF0000", "#555500", "#FF5500", "#55AA00", "#FFAA00", "#55FF00", "#FFFF00",
    "#55007F", "#FF007F", "#55557F", "#FF557F", "#FF557F", "#FFAA7F", "#55FF7F", "#FFFF7F",
    "#5500FF", "#FF00FF", "#5555FF", "#FF55FF", "#55AAFF", "#FFAAFF", "#55FFFF", "#FFFFFF"
  ];

  customColors = [
    "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF",
    "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"
  ];

  color = "rgb(255,127,0)";

  rgbColor = [];
  hsvColor = [];
  hexColor = "";

  constructor() { }

  ngOnInit() {
  }

  onColorChange(color: string) {
    this.rgbColor = stringToRgb(color);
    this.hsvColor = rgbToHsv(this.rgbColor[0], this.rgbColor[1], this.rgbColor[2]);
    this.hexColor = RgbToHex(this.rgbColor[0], this.rgbColor[1], this.rgbColor[2]);
  }

}
