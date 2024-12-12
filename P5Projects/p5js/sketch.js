let realMin = -1;  // 実部最小値
let realMax = 1;   // 実部最大値
let imMin = -1;    // 虚部最小値
let imMax = 1;     // 虚部最大値

let NReal = 1000;  // 実部方向
let NIm = 1000;    // 虚部方向

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  let img = createImage(NReal, NIm);
  img.loadPixels();
  for (let ix = 0; ix < NReal; ix++) {
    for (let iy = 0; iy < NIm; iy++) {
      let x = map(ix, 0, NReal, realMin, realMax);
      let y = map(iy, 0, NIm, imMin, imMax);
      let z = createComplex(x, y);
      let root = rootOfFunc(z);
      let angle = (atan2(root.im, root.re) + TWO_PI) % TWO_PI * 180 / PI;
      let col = color(angle, 100, 100);
      img.set(ix, iy, col);
    }
  }
  img.updatePixels();
  image(img, 0, 0, width, height);
}

function createComplex(re, im) {
  return { re: re, im: im };
}

function newtonMethod(z) {
  let f = pow(z.re, 5) - 10 * pow(z.re, 3) * pow(z.im, 2) + 5 * z.re * pow(z.im, 4) + pow(z.im, 5) + 1;
  let dfRe = 5 * pow(z.re, 4) - 30 * pow(z.re, 2) * pow(z.im, 2) + 5 * pow(z.im, 4);
  let dfIm = 20 * pow(z.re, 3) * z.im - 20 * z.re * pow(z.im, 3);
  let denominator = sq(dfRe) + sq(dfIm);
  if (denominator != 0) {
    return {
      re: z.re - (f * dfRe / denominator),
      im: z.im - (f * dfIm / denominator)
    };
  } else {
    return createComplex(0, 0);
  }
}

function rootOfFunc(z) {
  let counter = 0;
  while (true) {
    let zNew = newtonMethod(z);
    let eps = dist(z.re, z.im, zNew.re, zNew.im);
    if (eps < abs(realMax - realMin) * 1E-10) {
      break;
    }
    if (counter == 100) {
      break;
    }
    z = zNew;
    counter += 1;
  }
  return z;
}
