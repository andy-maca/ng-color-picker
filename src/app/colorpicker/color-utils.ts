
export function RgbToHex(r: number, g: number, b: number) {
  let r_s = r.toString(16);
  let g_s = g.toString(16);
  let b_s: string = b.toString(16);

  if (r_s.length == 1) {
    r_s = "0" + r_s;
  }

  if (g_s.length == 1) {
    g_s = "0" + g_s;
  }

  if (b_s.length == 1) {
    b_s = "0" + b_s;
  }

  return "#" + r_s + g_s + b_s;
}

export function rgbToHsv(r: number, g: number, b: number): number[] {
  r /= 255;
  g /= 255;
  b /= 255;
  const n = Math.min(Math.min(r, g), b);
  const v = Math.max(Math.max(r, g), b);
  const m = v - n;
  if (m === 0) {
    return [null, 0, 100 * v];
  }
  const h =
    r === n ? 3 + (b - g) / m : g === n ? 5 + (r - b) / m : 1 + (g - r) / m;
  return [60 * (h === 6 ? 0 : h), 100 * (m / v), 100 * v];
}

export function stringToRgb(colorStr: string): number[] {
  // get RGB from named color in div
  let fakeDiv = document.createElement("div");
  fakeDiv.style.color = colorStr;
  document.body.appendChild(fakeDiv);

  const computedColor = window.getComputedStyle(fakeDiv);
  const pv = computedColor.getPropertyValue("color");
  document.body.removeChild(fakeDiv);

  // code ripped from RGBToHex() (except pv is substringed)
  const rgb = pv.substr(4).split(")")[0].split(",");

  return [+rgb[0], +rgb[1], +rgb[2]];
}

export function stringToHex(colorStr: string): string {
  const rgb = stringToRgb(colorStr);
  return RgbToHex(rgb[0], rgb[1], rgb[2]);
}

