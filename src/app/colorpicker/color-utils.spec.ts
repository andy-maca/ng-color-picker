import { hsvToRgb, rgbToHex, rgbToHsv, stringToRgb } from "./color-utils";

describe('ColorUtils', () => {
  it('should convert HSV to RGB correctly', () => {
    expect(hsvToRgb([0,0,0])).toEqual([0,0,0]);
    expect(hsvToRgb([0,0,255])).toEqual([255,255,255]);
    expect(hsvToRgb([0,255,255])).toEqual([255,0,0]);
    expect(hsvToRgb([255,255,255])).toEqual([64,0,255]);
    expect(hsvToRgb([255,255,0])).toEqual([0,0,0]);
    expect(hsvToRgb([255,0,0])).toEqual([0,0,0]);
    expect(hsvToRgb([255,0,255])).toEqual([255,255,255]);
    expect(hsvToRgb([251,35,50])).toEqual([44,43,50]);
  });

  it('should convert RGB to HSV correctly', () => {
    expect(rgbToHsv([0,0,0])).toEqual([0,0,0]);
    expect(rgbToHsv([255,255,255])).toEqual([0,0,255]);
    expect(rgbToHsv([255,0,0])).toEqual([0,255,255]);
    expect(rgbToHsv([64,0,255])).toEqual([255,255,255]);
    expect(rgbToHsv([255,255,255])).toEqual([0,0,255]);
    expect(rgbToHsv([255,255,254])).toEqual([60,1,255]);
    expect(rgbToHsv([254,255,255])).toEqual([180,1,255]);
    expect(rgbToHsv([255,254,255])).toEqual([300,1,255]);
    expect(rgbToHsv([44,43,50])).toEqual([248,35,50]);
  });

  it('should convert RGB to HEX correctly', () => {
    expect(rgbToHex([44,43,50])).toBe("#2c2b32");
    expect(rgbToHex([255,255,255])).toBe("#ffffff");
    expect(rgbToHex([138,250,120])).toBe("#8afa78");
  });

  it('should convert string to RGB correctly', () => {
    expect(stringToRgb("#8afa78")).toEqual([138,250,120]);
    expect(stringToRgb("#856e3a")).toEqual([133,110,58]);
  });
});
