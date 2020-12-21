import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.less']
})
export class ColorSliderComponent implements AfterViewInit {
  private ctx: CanvasRenderingContext2D;
  private startColor: string;
  private stopColor: string;
  private handlerDragging = false;

  //two colors for start and stop, [start, stop]
  @Input()
  set colors(value: string[]) {
    if (value && value.length >= 2) {
      this.startColor = value[0];
      this.stopColor = value[1];
      this.draw();
    }
  }

  @Output()
  colorChange: EventEmitter<{}> = new EventEmitter(true);

  @ViewChild('canvas', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('handler', {static: true})
  handler: ElementRef<HTMLDivElement>;

  @HostListener('window:mouseup')
  onMouseUpOnWindow() {
    this.handlerDragging = false;
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMoveOnWindow(evt: MouseEvent) {
    if (this.handlerDragging) {
      let mouseOffsetCanvasTop = evt.y - this.canvas.nativeElement.offsetTop;
      if (mouseOffsetCanvasTop < 0) {
        mouseOffsetCanvasTop = 0;
      } else if (mouseOffsetCanvasTop > this.canvas.nativeElement.height) {
        mouseOffsetCanvasTop = this.canvas.nativeElement.height;
      }

      this.setHandlerPosition(mouseOffsetCanvasTop);
    }
  }

  ngAfterViewInit(): void {
    this.canvas.nativeElement.height = this.canvas.nativeElement.clientHeight;
    this.canvas.nativeElement.width = this.canvas.nativeElement.clientWidth;

    this.draw();
  }

  onMouseDown(evt: MouseEvent) {
    this.setHandlerPosition(evt.offsetY);;
  }

  private draw() {
    if (!this.ctx) {
      this.ctx = this.canvas.nativeElement.getContext('2d');
    }

    if (!this.startColor || !this.stopColor) {
      return;
    }

    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;

    this.ctx.clearRect(0, 0, width, height);

    //vertical linear gradient
    var vGrad = this.ctx.createLinearGradient(0, 0, 0, height);
    vGrad.addColorStop(0, this.startColor);
		vGrad.addColorStop(1, this.stopColor);
    this.ctx.fillStyle = vGrad;
    this.ctx.fillRect(0, 0, width, height);
  }

  private getColorAtPosition(x: number, y: number): string {
    const imageData = this.ctx.getImageData(x, y, 1, 1).data
    return `rgba(${imageData[0]}, ${imageData[1]}, ${imageData[2]}, 1)`;
  }

  private setHandlerPosition(mouseOffsetCanvasTop: number) {
    if (this.handler) {
      this.handler.nativeElement.style.marginTop = (mouseOffsetCanvasTop-10) + "px";
      this.colorChange.emit(this.getColorAtPosition(0,mouseOffsetCanvasTop));
    }
  }
}
