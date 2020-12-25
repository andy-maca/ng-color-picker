import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { hsvToRgb } from "../color-utils";

/**
 * Color palette for Hue, Saturation and Value
 *
 * @export
 * @class ColorPaletteComponent
 */
@Component({
  selector: "tt-color-palette",
  templateUrl: "./color-palette.component.html",
  styleUrls: ["./color-palette.component.less"],
})
export class ColorPaletteComponent implements AfterViewInit {
  private hue = 100;
  private sat = 100;
  private value = 255;

  private paletteCanvasHeight: number = 0;
  private paletteCanvasWidth: number = 0;

  private sliderCanvasHeight: number = 0;
  private sliderCanvasWidth: number = 0;

  private handlerDragging = false;
  private handlerOffsetTop = 0;

  private paletteDragging: boolean = false;
  private cursorSize: number = 0;

  @Input()
  set hsvColor(hsv: number[]) {
    if (
      hsv &&
      hsv.length >= 3 &&
      (this.hue !== hsv[0] ||
      this.sat !== hsv[1] ||
      this.value !== hsv[2])
    ) {
      this.hue = hsv[0];
      this.sat = hsv[1];
      this.value = hsv[2];

      if (this.sliderCanvasHeight > 0 && this.sliderCanvasWidth > 0 &&
          this.paletteCanvasHeight > 0 && this.paletteCanvasWidth > 0) {
        this.drawSlider();
        this.setCursorPosition();
        this.setHandlerPosition(this.valueToY(this.value));
      }
    }
  }

  @Output()
  hsvColorChange: EventEmitter<number[]> = new EventEmitter(true);

  @ViewChild("paletteCanvas", { static: true })
  paletteCanvas: ElementRef<HTMLCanvasElement>;

  @ViewChild("cursor", { static: true })
  cursor: ElementRef<HTMLElement>;

  @ViewChild("sliderCanvas", { static: true })
  sliderCanvas: ElementRef<HTMLCanvasElement>;

  @ViewChild("handler", { static: true })
  handler: ElementRef<HTMLDivElement>;

  @HostListener("window:mouseup")
  onMouseUpOnWindow() {
    this.paletteDragging = false;
    this.handlerDragging = false;
  }

  @HostListener("window:mousemove", ["$event"])
  onMouseMoveOnWindow(evt: MouseEvent) {
    if (this.handlerDragging) {
      const clientRect = this.sliderCanvas.nativeElement.getBoundingClientRect();
      let mouseOffsetCanvasTop = evt.y - clientRect.top;
      if (mouseOffsetCanvasTop < 0) {
        mouseOffsetCanvasTop = 0;
      } else if (mouseOffsetCanvasTop > this.sliderCanvasHeight) {
        mouseOffsetCanvasTop = this.sliderCanvasHeight;
      }

      this.setHandlerPosition(mouseOffsetCanvasTop);
      this.hsvColorChange.emit([this.hue, this.sat, this.value]);
    }

    if (this.paletteDragging) {
      const clientRect = this.paletteCanvas.nativeElement.getBoundingClientRect();
      let mouseOffsetCanvasTop = evt.y - clientRect.top;
      let mouseOffsetCanvasLeft = evt.x - clientRect.left;
      if (mouseOffsetCanvasTop < 0) {
        mouseOffsetCanvasTop = 0;
      } else if (mouseOffsetCanvasTop > this.paletteCanvasHeight) {
        mouseOffsetCanvasTop = this.paletteCanvasHeight;
      }

      if (mouseOffsetCanvasLeft < 0) {
        mouseOffsetCanvasLeft = 0;
      } else if (mouseOffsetCanvasLeft > this.paletteCanvasWidth) {
        mouseOffsetCanvasLeft = this.paletteCanvasWidth;
      }

      this.pickColorFromPalette(mouseOffsetCanvasLeft, mouseOffsetCanvasTop);
      this.hsvColorChange.emit([this.hue, this.sat, this.value]);
    }
  }

  mouseDownOnPalette(evt: MouseEvent) {
    this.paletteDragging = true;
    this.pickColorFromPalette(evt.offsetX, evt.offsetY);
    this.hsvColorChange.emit([this.hue, this.sat, this.value]);
  }

  mouseDownOnSlider(evt: MouseEvent) {
    const clientRect = this.sliderCanvas.nativeElement.getBoundingClientRect();
    this.setHandlerPosition(evt.y - clientRect.top);
    this.hsvColorChange.emit([this.hue, this.sat, this.value]);
  }

  ngAfterViewInit() {
    this.cursorSize = this.cursor.nativeElement.clientHeight;

    this.paletteCanvasHeight = this.paletteCanvas.nativeElement.clientHeight;
    this.paletteCanvasWidth = this.paletteCanvas.nativeElement.clientWidth;
    this.paletteCanvas.nativeElement.height = this.paletteCanvasHeight;
    this.paletteCanvas.nativeElement.width = this.paletteCanvasWidth;

    this.sliderCanvasHeight = this.sliderCanvas.nativeElement.clientHeight;
    this.sliderCanvasWidth = this.sliderCanvas.nativeElement.clientWidth;
    this.sliderCanvas.nativeElement.height = this.sliderCanvasHeight;
    this.sliderCanvas.nativeElement.width = this.sliderCanvasWidth;

    this.handlerOffsetTop = -this.handler.nativeElement.offsetHeight / 2;

    this.drawPalette();
    this.drawSlider();
    this.setCursorPosition();
    this.setHandlerPosition(this.valueToY(this.value));
  }

  /**
   * Draw palette canvas
   * Refers to https://code.woboq.org/qt5/qtbase/src/widgets/dialogs/qcolordialog.cpp.html
   */
  private drawPalette() {
    const paletteCtx = this.paletteCanvas.nativeElement.getContext("2d");
    const imageData = paletteCtx.createImageData(
      this.paletteCanvasWidth,
      this.paletteCanvasHeight
    );

    for (let i = 0; i < imageData.data.length; i += 4) {
      const x = (i / 4) % this.paletteCanvasWidth;
      const y = Math.floor(i / 4 / this.paletteCanvasWidth);
      const h = this.xToHue(x);
      const s = this.yToSat(y);
      const rgb = hsvToRgb([h, s, 200]);
      imageData.data[i] = rgb[0];
      imageData.data[i + 1] = rgb[1];
      imageData.data[i + 2] = rgb[2];
      imageData.data[i + 3] = 255;
    }

    paletteCtx.putImageData(imageData, 0, 0);
  }

  /**
   * Draw slider canvas with current HSV value
   * Refers to https://code.woboq.org/qt5/qtbase/src/widgets/dialogs/qcolordialog.cpp.html
   */
  private drawSlider() {
    if (!this.sliderCanvasWidth || !this.sliderCanvasHeight) {
      return;
    }

    const sliderCtx = this.sliderCanvas.nativeElement.getContext("2d");

    const imageData = sliderCtx.createImageData(
      this.sliderCanvasWidth,
      this.sliderCanvasHeight
    );

    for (let i = 0; i < imageData.data.length; i += 4) {
      const y = Math.floor(i / 4 / this.sliderCanvasWidth);
      const value = this.yToValue(y);
      const rgb = hsvToRgb([this.hue, this.sat, value]);
      imageData.data[i] = rgb[0];
      imageData.data[i + 1] = rgb[1];
      imageData.data[i + 2] = rgb[2];
      imageData.data[i + 3] = 255;
    }

    sliderCtx.putImageData(imageData, 0, 0);
  }

  /**
   * Pick color at mouse position in palette canvas
   * @param x X coordinate relative to top of palette canvas
   * @param y Y coordinate relative to left of palette canvas
   */
  private pickColorFromPalette(x: number, y: number) {
    this.hue = this.xToHue(x);
    this.sat = this.yToSat(y);

    console.debug(
      `Palette: pick color hsv(${this.hue}, ${this.sat}, ${this.value}) at (${x}, ${y})`
    );

    this.cursor.nativeElement.style.top = `${y - this.cursorSize / 2}px`;
    this.cursor.nativeElement.style.left = `${x - this.cursorSize / 2}px`;
    this.drawSlider();
  }

  /**
   * Set position of cross cursor in palette canvas according to current `Hue` and `Sat` value
   */
  private setCursorPosition() {
    if (this.hue >= 0 && this.sat >= 0) {
      const px = Math.round(
        ((359 - this.hue) * (this.paletteCanvasWidth - 1)) / 359
      );
      const py = Math.round(
        ((255 - this.sat) * (this.paletteCanvasHeight - 1)) / 255
      );
      this.cursor.nativeElement.style.top = `${py - this.cursorSize / 2}px`;
      this.cursor.nativeElement.style.left = `${px - this.cursorSize / 2}px`;

      console.debug(
        `Palette: set cursor to position(${px}, ${py}) with hsv(${this.hue}, ${this.sat}, ${this.value})`
      );
    }
  }

  /**
   * Set position of slider handler in slider canvas
   * @param y Y coordinate relate to top of slider canvas
   */
  private setHandlerPosition(y: number) {
    this.value = this.yToValue(y);
    console.debug(
      `Palette: pick color brightness ${this.value} at position ${y}`
    );

    this.handler.nativeElement.style.top = y + this.handlerOffsetTop + "px";
  }

  /**
   * Get Hue of HSV by x coordinate in palette canvas
   * @param x
   */
  private xToHue(x: number) {
    return Math.round(359 - (x * 359) / this.paletteCanvasWidth);
  }

  /**
   * Get Sat of HSV by y coordinate in palette canvas
   * @param x
   */
  private yToSat(y: number) {
    return Math.round(255 - (y * 255) / this.paletteCanvasHeight);
  }

  /**
   * Get Value of HSV by y coordinate in slider canvas
   * @param y
   */
  private yToValue(y: number) {
    return Math.round(255 - (y / this.sliderCanvasHeight) * 255);
  }

  /**
   * Get y coordinate in slider canvas from Value of HSV
   * @param v Value of HSV
   */
  private valueToY(v: number) {
    return ((255 - v) * this.sliderCanvasHeight) / 255;
  }
}
