const USHRT_MAX = 0xffff;

function fuzzyCompare(p1, p2) {
  return Math.abs(p1 - p2) * 100000 <= Math.min(Math.abs(p1), Math.abs(p2));
}

export function rgbToHex(rgb: number[]) {
  let r: number, g: number, b: number;
  if (rgb && rgb.length >= 3) {
    r = rgb[0];
    g = rgb[1];
    b = rgb[2];
  } else {
    return null;
  }

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

// r: 0-255
// g: 0-255
// b: 0-255
//
// returns: [ 0-359, 0-255, 0-255 ]
// refers to https://code.woboq.org/qt5/qtbase/src/gui/painting/qcolor.cpp.html
export function rgbToHsv(rgb: number[]): number[] {
  let r: number, g: number, b: number;
  if (rgb && rgb.length >= 3) {
    r = rgb[0];
    g = rgb[1];
    b = rgb[2];
  } else {
    return null;
  }

  r = r * 0x101;
  g = g * 0x101;
  b = b * 0x101;

  let h = 0;
  let s = 0;
  let v = 0;
  r = r / USHRT_MAX;
  g = g / USHRT_MAX;
  b = b / USHRT_MAX;
  const max = r > g && r > b ? r : g > b ? g : b;
  const min = r < g && r < b ? r : g < b ? g : b;
  const delta = max - min;
  v = Math.round(max * USHRT_MAX);
  if (Math.abs(delta) <= 0.000000000001) {
    // achromatic case, hue is undefined
    h = USHRT_MAX;
    s = 0;
  } else {
    // chromatic case
    let hue = 0;
    s = Math.round((delta / max) * USHRT_MAX);
    if (fuzzyCompare(r, max)) {
      hue = (g - b) / delta;
    } else if (fuzzyCompare(g, max)) {
      hue = 2.0 + (b - r) / delta;
    } else if (fuzzyCompare(b, max)) {
      hue = 4.0 + (r - g) / delta;
    } else {
      console.error(`rgbToHsv: fail to convert RBG(${r}, ${g}, ${b}) to HSV`);
    }
    hue *= 60;
    if (hue < 0.0) {
      hue += 360.0;
    }
    h = Math.round(hue * 100);
  }

  h = Math.floor(h === USHRT_MAX ? 0 : h / 100);
  s = s >> 8;
  v = v >> 8;
  return [h, s, v];
}

// h: 0-359
// s: 0-255
// v: 0-255
//
// returns: [ 0-255, 0-255, 0-255 ]
// refers to https://code.woboq.org/qt5/qtbase/src/gui/painting/qcolor.cpp.html
export function hsvToRgb(hsv: number[]) {
  let h: number, s: number, v: number;
  if (hsv && hsv.length >= 3) {
    h = hsv[0];
    s = hsv[1];
    v = hsv[2];
  } else {
    return null;
  }

  h = h == -1 ? USHRT_MAX : (h % 360) * 100;
  s = s * 0x101;
  v = v * 0x101;

  let r = 0,
    g = 0,
    b = 0;
  if (s === 0 || h === USHRT_MAX) {
    // achromatic case
    r = g = b = v;
  } else {
    //chromatic case
    h = h === 36000 ? 0 : h / 6000;
    s = s / USHRT_MAX;
    v = v / USHRT_MAX;
    const i = Math.floor(h);
    const f = h - i;
    let p = v * (1.0 - s);

    if (i & 1) {
      const q = v * (1.0 - s * f);
      switch (i) {
        case 1:
          r = Math.round(q * USHRT_MAX);
          g = Math.round(v * USHRT_MAX);
          b = Math.round(p * USHRT_MAX);
          break;
        case 3:
          r = Math.round(p * USHRT_MAX);
          g = Math.round(q * USHRT_MAX);
          b = Math.round(v * USHRT_MAX);
          break;
        case 5:
          r = Math.round(v * USHRT_MAX);
          g = Math.round(p * USHRT_MAX);
          b = Math.round(q * USHRT_MAX);
          break;
      }
    } else {
      const t = v * (1.0 - s * (1.0 - f));
      switch (i) {
        case 0:
          r = Math.round(v * USHRT_MAX);
          g = Math.round(t * USHRT_MAX);
          b = Math.round(p * USHRT_MAX);
          break;
        case 2:
          r = Math.round(p * USHRT_MAX);
          g = Math.round(v * USHRT_MAX);
          b = Math.round(t * USHRT_MAX);
          break;
        case 4:
          r = Math.round(t * USHRT_MAX);
          g = Math.round(p * USHRT_MAX);
          b = Math.round(v * USHRT_MAX);
          break;
      }
    }
  }

  r = r >> 8;
  g = g >> 8;
  b = b >> 8;

  return [r, g, b];
}

export function stringToRgb(colorStr: string): number[] {
  let fakeDiv = document.createElement("div");
  fakeDiv.style.color = colorStr;
  document.body.appendChild(fakeDiv);

  const computedColor = window.getComputedStyle(fakeDiv);
  const pv = computedColor.getPropertyValue("color");
  document.body.removeChild(fakeDiv);

  const rgb = pv.substr(4).split(")")[0].split(",");
  return [+rgb[0], +rgb[1], +rgb[2]];
}
