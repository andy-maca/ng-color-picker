import { async, ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";

import { ColorPaletteComponent } from "./color-palette.component";

describe("ColorPaletteComponent", () => {
  let component: ColorPaletteComponent;
  let fixture: ComponentFixture<ColorPaletteComponent>;
  let element: HTMLElement;
  let paletteCanvas: HTMLCanvasElement;
  let sliderCanvas: HTMLCanvasElement;
  let cursor: HTMLElement;
  let hsv: number[] = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPaletteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPaletteComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;

    paletteCanvas = element.querySelector<HTMLCanvasElement>(".color-palette canvas");
    sliderCanvas = element.querySelector<HTMLCanvasElement>(".color-slider canvas");
    cursor = element.querySelector<HTMLElement>(".cursor-symbol");

    cursor.style.height = "20px";
    cursor.style.width = "20px";
    hsv = [];
    component.hsvColor = [0, 0, 255];
    component.hsvColorChange.subscribe((v: number[]) => {
      hsv = v;
    });
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    element.remove();
  });

  it("should create", () => {
    expect(component).toBeTruthy();

    expect(paletteCanvas).toBeDefined();
    expect(sliderCanvas).toBeDefined();
    expect(paletteCanvas.clientHeight).toBe(paletteCanvas.height);
    expect(paletteCanvas.clientWidth).toBe(paletteCanvas.width);
    expect(sliderCanvas.clientHeight).toBe(sliderCanvas.height);
    expect(sliderCanvas.clientWidth).toBe(sliderCanvas.width);

    expect(paletteCanvas.clientHeight).toBeGreaterThan(0);
    expect(paletteCanvas.clientWidth).toBeGreaterThan(0);
    expect(sliderCanvas.clientHeight).toBeGreaterThan(0);
    expect(sliderCanvas.clientWidth).toBeGreaterThan(0);
  });

  it("should emit correct HSV value when mouse down/drag on the palette", fakeAsync(() => {
    component.mouseDownOnPalette({offsetX: 10, offsetY: 10} as MouseEvent);
    tick();
    expect(hsv).toEqual([347, 238, 255]);

    const rect = paletteCanvas.getBoundingClientRect();
    component.onMouseMoveOnWindow({
      x: rect.left + paletteCanvas.width,
      y: rect.top + paletteCanvas.height
    } as MouseEvent);
    tick();
    expect(hsv).toEqual([0, 0, 255]);
  }));

  it("should emit correct HSV value when mouse down/drag slider handler", fakeAsync(() => {
    const rect = sliderCanvas.getBoundingClientRect();
    component.mouseDownOnSlider({y: rect.top + sliderCanvas.height / 2} as MouseEvent);
    tick();
    expect(hsv).toEqual([0, 0, 128]);

    component.handler.nativeElement.dispatchEvent(new MouseEvent("mousedown"));
    component.onMouseMoveOnWindow({
      x: rect.left + sliderCanvas.width,
      y: rect.top + sliderCanvas.height
    } as MouseEvent);
    tick();
    expect(hsv).toEqual([0, 0, 0]);
  }));
});
