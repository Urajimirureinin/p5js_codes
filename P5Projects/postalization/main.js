let img;

function preload() {
  img = loadImage("a.png");
}

function setup() {
  createCanvas(img.width, img.height);

  img.loadPixels();

  const fromMax = 256;
  const toMax = 4;

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const pixel = getPixel(x, y);

      const r = red(pixel);
      const g = green(pixel);
      const b = blue(pixel);

      const nr = posterize(r, fromMax, toMax);
      const ng = posterize(g, fromMax, toMax);
      const nb = posterize(b, fromMax, toMax);

      setPixel(x, y, [nr, ng, nb]);
    }
  }

  img.updatePixels();
  image(img, 0, 0);
}

function posterize(value, fromMax, toMax) {
  const i = floor((toMax / fromMax) * value);
  const v = ceil(((fromMax - 1) / (toMax - 1)) * i);
  return v;
}

function getPixel(x, y) {
  const i = (y * img.width + x) * 4;
  return [
    img.pixels[i],
    img.pixels[i + 1],
    img.pixels[i + 2],
    img.pixels[i + 3],
  ];
}

function setPixel(x, y, pixel) {
  const i = (y * img.width + x) * 4;
  img.pixels[i + 0] = pixel[0];
  img.pixels[i + 1] = pixel[1];
  img.pixels[i + 2] = pixel[2];
}