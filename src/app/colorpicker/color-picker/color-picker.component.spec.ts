import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { stringToRgb } from "../color-utils";
import { ColorPickerModule } from "../colorpicker.module";

import { BASIC_COLORS } from "./basic-colors";
import { ColorPickerComponent } from "./color-picker.component";

describe("ColorPickerComponent", () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ColorPickerModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    element.remove();
  });

  function getFormControlInput(name: string) {
    return element.querySelector<HTMLInputElement>(`input[formcontrolname='${name}']`);
  }

  function getHSV() {
    const h = getFormControlInput("hsv_h").value;
    const s = getFormControlInput("hsv_s").value;
    const v = getFormControlInput("hsv_v").value;
    return [+h, +s, +v];
  }

  function getRGB() {
    const r = getFormControlInput("rgb_r").value;
    const g = getFormControlInput("rgb_g").value;
    const b = getFormControlInput("rgb_b").value;
    return [+r, +g, +b];
  }

  function getHex() {
    return element.querySelector<HTMLInputElement>(".hex-value input");
  }

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should init basic colors correctly", async(() => {
    const basicColorElements = element.querySelectorAll<HTMLElement>("ul.basic-colors>li");
    expect(basicColorElements.length).toBe(BASIC_COLORS.length);
    BASIC_COLORS.forEach((color, i) => {
      expect(stringToRgb(basicColorElements[i].style.backgroundColor)).toEqual(stringToRgb(color));
    });

    spyOn(component, "onHexChangeFromGUi").and.callThrough();
    basicColorElements[0].click();
    fixture.detectChanges();
    expect(component.onHexChangeFromGUi).toHaveBeenCalledWith(BASIC_COLORS[0]);
    expect(component.hexColor).toBe("#000000");
    expect(getHSV()).toEqual([0, 0, 0]);
    expect(getRGB()).toEqual([0, 0, 0]);
    fixture.whenStable().then(() => {
      expect(getHex().value).toBe("#000000");
    });
  }));

  it("should init custom colors correctly", async(() => {
    const customColorElements = element.querySelectorAll<HTMLElement>("ul.custom-colors>li");
    expect(customColorElements.length).toBe(component.customColorCount);
    customColorElements.forEach((e) => {
      expect(stringToRgb(e.style.backgroundColor)).toEqual(stringToRgb(component.hexColor));
    });

    expect(component.hexColor).toBe("#ffffff");
    expect(getHSV()).toEqual([0, 0, 255]);
    expect(getRGB()).toEqual([255, 255, 255]);
    fixture.whenStable().then(() => {
      expect(getHex().value).toBe("#ffffff");
    });
  }));

  it("should change HSV & RGB & HEX inputs when color change from palette", async(() => {
    const newHsv = [180, 180, 180];
    component.onHsvChangeFromPalette(newHsv);
    fixture.detectChanges();
    expect(component.hsvColor).toEqual(newHsv);
    expect(component.rgbColor).toEqual([53, 180, 180]);
    expect(component.hexColor).toEqual("#35b4b4");
    expect(getHSV()).toEqual(newHsv);
    expect(getRGB()).toEqual([53, 180, 180]);

    fixture.whenStable().then(() => {
      expect(getHex().value).toBe("#35b4b4");
    });
  }));

  it("should change color palette, RGB & HEX inputs when any HSV input change", async(() => {
    const hElement = getFormControlInput("hsv_h");
    hElement.value = "100";
    hElement.dispatchEvent(new Event("input"));

    const sElement = getFormControlInput("hsv_s");
    sElement.value = "150";
    sElement.dispatchEvent(new Event("input"));

    const vElement = getFormControlInput("hsv_v");
    vElement.value = "200";
    vElement.dispatchEvent(new Event("input"));

    fixture.detectChanges();

    expect(component.hsvColor).toEqual([100, 150, 200]);
    expect(component.rgbColor).toEqual([122, 200, 82]);
    expect(component.hexColor).toEqual("#7ac852");
    expect(getHSV()).toEqual([100, 150, 200]);
    expect(getRGB()).toEqual([122, 200, 82]);

    fixture.whenStable().then(() => {
      expect(getHex().value).toBe("#7ac852");
    });
  }));

  it("should change color palette, HSV & HEX inputs when any RGB input change", async(() => {
    const rElement = getFormControlInput("rgb_r");
    rElement.value = "100";
    rElement.dispatchEvent(new Event("input"));

    fixture.detectChanges();

    expect(component.hsvColor).toEqual([180, 155, 255]);
    expect(component.rgbColor).toEqual([100, 255, 255]);
    expect(component.hexColor).toEqual("#64ffff");
    expect(getHSV()).toEqual([180, 155, 255]);
    expect(getRGB()).toEqual([100, 255, 255]);

    fixture.whenStable().then(() => {
      expect(getHex().value).toBe("#64ffff");
    });
  }));

  it("should change color palette, HSV & RGB inputs when HEX input change", async(() => {
    const hexElement = getHex();
    hexElement.value = "#64d557";
    hexElement.dispatchEvent(new Event("input"));

    fixture.detectChanges();

    expect(component.hsvColor).toEqual([113, 151, 213]);
    expect(component.rgbColor).toEqual([100, 213, 87]);
    expect(component.hexColor).toEqual("#64d557");
    expect(getHSV()).toEqual([113, 151, 213]);
    expect(getRGB()).toEqual([100, 213, 87]);
  }));

  it("should add to custom color correctly", () => {
    expect(component.customColors.length).toBe(0);
    for (let i = 0; i < component.customColorCount; i++) {
      component.hexColor = BASIC_COLORS[i];
      component.addToCustom();
    }
    expect(component.customColors.length).toBe(component.customColorCount);
    component.hexColor = "#ffffff";
    component.addToCustom();
    expect(component.customColors.length).toBe(component.customColorCount);
    expect(component.customColors[0]).toBe(component.hexColor);
  });
});
