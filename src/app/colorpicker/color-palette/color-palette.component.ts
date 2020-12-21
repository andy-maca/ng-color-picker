import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { stringToRgb } from '../color-utils';

@Component({
  selector: 'app-color-palette',
  templateUrl: './color-palette.component.html',
  styleUrls: ['./color-palette.component.less'],
})
export class ColorPaletteComponent implements AfterViewInit {
  static readonly COLORS = ["#F00","#F0F", "#00F","#0FF","#0F0", "#FF0", "#F00"];

  @Input()
  color: string;

  @Output()
  colorChange: EventEmitter<string> = new EventEmitter(true);

  @ViewChild('canvas', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('cursor', {static: true})
  cursor: ElementRef<HTMLElement>;

  private horizontalColorSteps = ColorPaletteComponent.COLORS;
  private ctx: CanvasRenderingContext2D;
  private mousedown: boolean = false;
  private cursorSize: number = 0;

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.cursorSize = this.cursor.nativeElement.clientHeight;
    this.canvas.nativeElement.height = this.canvas.nativeElement.clientHeight;
    this.canvas.nativeElement.width = this.canvas.nativeElement.clientWidth;

    this.draw();

    if(this.color) {
      this.setCursorLocationByColor(this.color);
    }
  }

  private draw() {
    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;

    this.ctx.clearRect(0, 0, width, height);

    //horizontal linear gradient
    var hGrad = this.ctx.createLinearGradient(0, 0, width, 0);
    this.horizontalColorSteps.forEach((v, index) => {
      hGrad.addColorStop(index / this.horizontalColorSteps.length, v);
    });
    this.ctx.fillStyle = hGrad;
		this.ctx.fillRect(0, 0, width, height);

    //vertical linear gradient
    var vGrad = this.ctx.createLinearGradient(0, 0, 0, height);
    vGrad.addColorStop(0, 'rgba(255,255,255,0)');
		vGrad.addColorStop(1, 'rgba(255,255,255,1)');
    this.ctx.fillStyle = vGrad;
    this.ctx.fillRect(0, 0, width, height);
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(evt: MouseEvent) {
    this.mousedown = false;
  }

  onMouseDown(evt: MouseEvent) {
    this.mousedown = true;
    this.pickColorByPosition(evt.offsetX, evt.offsetY);
  }

  onMouseMove(evt: MouseEvent) {
    if (this.mousedown) {
      this.pickColorByPosition(evt.offsetX, evt.offsetY);
    }
  }

  private getColorAtPosition(x: number, y: number): string {
    const imageData = this.ctx.getImageData(x, y, 1, 1).data
    return `rgba(${imageData[0]}, ${imageData[1]}, ${imageData[2]}, 1)`;
  }

  private pickColorByPosition(x: number, y: number) {
    this.colorChange.emit(this.getColorAtPosition(x, y));
    this.cursor.nativeElement.style.top = `${y - this.cursorSize/2}px`;
    this.cursor.nativeElement.style.left = `${x - this.cursorSize/2}px`;
  }

  private setCursorLocationByColor(color: string) {
    const rgb = stringToRgb(color);
    for(let px = 0; px < this.canvas.nativeElement.width; px++) {
      for(let py = 0; py <= this.canvas.nativeElement.height; py++) {
        const imagePixel = this.ctx.getImageData(px, py, 1, 1).data;
        if (imagePixel[0] === rgb.r && imagePixel[1] === rgb.g && imagePixel[2] === rgb.b) {
          this.cursor.nativeElement.style.top = `${py}px`;
          this.cursor.nativeElement.style.left = `${px}px`;
          return;
        }
      }
    }
  }
}
