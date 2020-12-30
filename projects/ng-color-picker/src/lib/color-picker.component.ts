import { AfterViewInit, Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { hsvToRgb, rgbToHex, rgbToHsv, stringToRgb } from "./color-utils";

import { BASIC_COLORS } from "./basic-colors";

@Component({
  selector: "tt-color-picker",
  templateUrl: "./color-picker.component.html",
  styleUrls: ["./color-picker.component.less"]
})
export class ColorPickerComponent implements AfterViewInit {
  basicColors = BASIC_COLORS;

  customColorCount = 16;

  hsvColor: number[] = [];
  rgbColor: number[] = [];

  hsvForm: FormGroup;
  rgbForm: FormGroup;

  @Input()
  hexColor = "#ffffff";

  // save as hex
  @Input()
  customColors: string[] = [];

  @Output()
  readonly customColorsChange: EventEmitter<string[]> = new EventEmitter();

  @Output()
  readonly colorChange: EventEmitter<string> = new EventEmitter();

  private customColorIndex = 0;

  constructor(private formBuilder: FormBuilder) {
    this.rgbColor = stringToRgb(this.hexColor);
    this.hsvColor = rgbToHsv(this.rgbColor);

    this.hsvForm = this.formBuilder.group({
      hsv_h: [this.hsvColor[0], [Validators.min(0), Validators.max(359)]],
      hsv_s: [this.hsvColor[1], [Validators.min(0), Validators.max(255)]],
      hsv_v: [this.hsvColor[2], [Validators.min(0), Validators.max(255)]]
    });

    this.rgbForm = this.formBuilder.group({
      rgb_r: [this.rgbColor[0], [Validators.min(0), Validators.max(255)]],
      rgb_g: [this.rgbColor[1], [Validators.min(0), Validators.max(255)]],
      rgb_b: [this.rgbColor[2], [Validators.min(0), Validators.max(255)]]
    });

    // hsv changed by user from input
    this.hsvForm.valueChanges.subscribe((change) => {
      if (this.hsvForm.valid) {
        this.onHsvChangeFromGui([change.hsv_h, change.hsv_s, change.hsv_v]);
      }
    });

    // rbg changed by user from input
    this.rgbForm.valueChanges.subscribe((change) => {
      if (this.rgbForm.valid) {
        this.onRgbChangeFromGui([change.rgb_r, change.rgb_g, change.rgb_b]);
      }
    });
  }

  ngAfterViewInit() {
    this.colorChange.emit(this.hexColor);
  }

  onRgbChangeFromGui(rgb: number[]) {
    this.rgbColor = [...rgb];
    this.hsvColor = rgbToHsv(rgb);
    this.hexColor = rgbToHex(rgb);
    this.hsvForm.patchValue(
      {
        hsv_h: this.hsvColor[0],
        hsv_s: this.hsvColor[1],
        hsv_v: this.hsvColor[2]
      },
      {
        emitEvent: false
      }
    );
    this.colorChange.emit(this.hexColor);
  }

  onHsvChangeFromGui(hsv: number[]) {
    this.hsvColor = [...hsv];
    this.rgbColor = hsvToRgb(hsv);
    this.hexColor = rgbToHex(this.rgbColor);
    this.rgbForm.patchValue(
      {
        rgb_r: this.rgbColor[0],
        rgb_g: this.rgbColor[1],
        rgb_b: this.rgbColor[2]
      },
      {
        emitEvent: false
      }
    );
    this.colorChange.emit(this.hexColor);
  }

  onHexChangeFromGUi(hex: string) {
    this.rgbColor = stringToRgb(hex);
    this.hsvColor = rgbToHsv(this.rgbColor);
    this.hexColor = hex;
    this.hsvForm.patchValue(
      {
        hsv_h: this.hsvColor[0],
        hsv_s: this.hsvColor[1],
        hsv_v: this.hsvColor[2]
      },
      {
        emitEvent: false
      }
    );
    this.rgbForm.patchValue(
      {
        rgb_r: this.rgbColor[0],
        rgb_g: this.rgbColor[1],
        rgb_b: this.rgbColor[2]
      },
      {
        emitEvent: false
      }
    );
    this.colorChange.emit(this.hexColor);
  }

  onHsvChangeFromPalette(hsv: number[]) {
    if (
      hsv[0] === this.hsvColor[0] &&
      hsv[1] === this.hsvColor[1] &&
      hsv[2] === this.hsvColor[2]
    ) {
      return;
    }

    // don't re-assign to hsvColor, it will cause input change of tt-color-palette
    this.hsvColor[0] = hsv[0];
    this.hsvColor[1] = hsv[1];
    this.hsvColor[2] = hsv[2];

    this.rgbColor = hsvToRgb(hsv);
    this.hexColor = rgbToHex(this.rgbColor);

    this.hsvForm.patchValue(
      {
        hsv_h: this.hsvColor[0],
        hsv_s: this.hsvColor[1],
        hsv_v: this.hsvColor[2]
      },
      {
        emitEvent: false
      }
    );

    this.rgbForm.patchValue(
      {
        rgb_r: this.rgbColor[0],
        rgb_g: this.rgbColor[1],
        rgb_b: this.rgbColor[2]
      },
      {
        emitEvent: false
      }
    );

    this.colorChange.emit(this.hexColor);
  }

  addToCustom() {
    if (
      this.customColorIndex < this.customColorCount &&
      this.customColors.length < this.customColorCount
    ) {
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
