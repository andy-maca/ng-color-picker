import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { hsvToRgb, rgbToHex, rgbToHsv, stringToRgb } from '../color-utils';

@Component({
  selector: 'tt-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.less']
})
export class ColorPickerComponent {
  basicColors = [
    "#000000", "#AA0000", "#005500", "#AA5500", "#00AA00", "#AAAA00", "#00FF00", "#AAFF00",
    "#00007F", "#AA007F", "#00557F", "#AA557F", "#00AA7F", "#AAAA7F", "#00FF7F", "#AAFF7F",
    "#0000FF", "#AA00FF", "#0055FF", "#AA55FF", "#00AAFF", "#AAAAFF", "#00FFFF", "#AAFFFF",
    "#550000", "#FF0000", "#555500", "#FF5500", "#55AA00", "#FFAA00", "#55FF00", "#FFFF00",
    "#55007F", "#FF007F", "#55557F", "#FF557F", "#FF557F", "#FFAA7F", "#55FF7F", "#FFFF7F",
    "#5500FF", "#FF00FF", "#5555FF", "#FF55FF", "#55AAFF", "#FFAAFF", "#55FFFF", "#FFFFFF"
  ];

  customColorCount = 16;

  hexColor = "";
  hsvColor = [0, 0, 255];
  rgbColor = [];

  hsvForm: FormGroup;
  rgbForm: FormGroup;

  //save as hex
  @Input()
  customColors = [];

  @Output()
  customColorsChange: EventEmitter<string[]> = new EventEmitter();

  private customColorIndex: number = 0;

  constructor(private formBuilder: FormBuilder) {
    this.rgbColor = hsvToRgb(this.hsvColor);
    this.hexColor = rgbToHex(this.rgbColor);

    this.hsvForm = this.formBuilder.group({
      hsv_h: [this.hsvColor[0]],
      hsv_s: [this.hsvColor[1]],
      hsv_v: [this.hsvColor[2]]
    });

    this.rgbForm = this.formBuilder.group({
      rgb_r: [this.rgbColor[0]],
      rgb_g: [this.rgbColor[1]],
      rgb_b: [this.rgbColor[2]]
    });

    // hsv changed by user from input
    this.hsvForm.valueChanges.subscribe((change) => {
      this.onHsvChangeFromGui([change.hsv_h, change.hsv_s, change.hsv_v]);
    });

    // rbg changed by user from input
    this.rgbForm.valueChanges.subscribe((change) => {
      this.onRgbChangeFromGui([change.rgb_r, change.rgb_g, change.rgb_b]);
    });
  }

  onRgbChangeFromGui(rgb: number[]) {
    this.rgbColor = [...rgb];
    this.hsvColor = rgbToHsv(rgb);
    this.hexColor = rgbToHex(rgb);
    this.hsvForm.patchValue({
      hsv_h: this.hsvColor[0],
      hsv_s: this.hsvColor[1],
      hsv_v: this.hsvColor[2]
    }, {
      emitEvent: false
    })
  }

  onHsvChangeFromGui(hsv: number[]) {
    this.hsvColor = [...hsv];
    this.rgbColor = hsvToRgb(hsv);
    this.hexColor = rgbToHex(this.rgbColor);
    this.rgbForm.patchValue({
      rgb_r: this.rgbColor[0],
      rgb_g: this.rgbColor[1],
      rgb_b: this.rgbColor[2]
    }, {
      emitEvent: false
    });
  }

  onHexChangeFromGUi(hex: string) {
    this.rgbColor = stringToRgb(hex);
    this.hsvColor = rgbToHsv(this.rgbColor);
    this.hexColor = hex;
    this.hsvForm.patchValue({
      hsv_h: this.hsvColor[0],
      hsv_s: this.hsvColor[1],
      hsv_v: this.hsvColor[2]
    }, {
      emitEvent: false
    });
    this.rgbForm.patchValue({
      rgb_r: this.rgbColor[0],
      rgb_g: this.rgbColor[1],
      rgb_b: this.rgbColor[2]
    }, {
      emitEvent: false
    });
  }

  onHsvChangeFromPalette(hsv: number[]) {
    if (hsv[0] === this.hsvColor[0] && hsv[1] === this.hsvColor[1] && hsv[2] === this.hsvColor[2]) {
      return;
    }

    this.hsvColor = hsv;
    this.rgbColor = hsvToRgb(hsv);
    this.hexColor = rgbToHex(this.rgbColor);

    this.hsvForm.patchValue({
      hsv_h: this.hsvColor[0],
      hsv_s: this.hsvColor[1],
      hsv_v: this.hsvColor[2]
    }, {
      emitEvent: false
    });


    this.rgbForm.patchValue({
      rgb_r: this.rgbColor[0],
      rgb_g: this.rgbColor[1],
      rgb_b: this.rgbColor[2]
    }, {
      emitEvent: false
    });
  }

  addToCustom() {
    if (this.customColorIndex < this.customColorCount && this.customColors.length < this.customColorCount) {
      this.customColors.push(this.hexColor);
    } else {
      if (this.customColorIndex === this.customColorCount) {
        this.customColorIndex = 0;
      }
      this.customColors[this.customColorIndex] = this.hexColor;
    }

    this.customColorsChange.emit(this.customColors);
    this.customColorIndex++;
  }

  arrayOfCount(count: number) {
    return [...Array(count).keys()];
  }
}
