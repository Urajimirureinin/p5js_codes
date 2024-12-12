let img;
let threshold = 100; // 明るさの閾値

function preload() {
  img = loadImage('tamairi4.png'); // 画像のパスを指定
}

function setup() {
}

function draw() {
  createCanvas(img.width, img.height);
  clear();
  img.loadPixels();
  threshold = document.getElementById('brightness').value;

  // 画像のピクセルを処理
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let index = (x + y * img.width) * 4;
      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      
      // 明るさを計算
      let brightness = (r + g + b) / 3;
      
      if (brightness <= threshold) {
        img.pixels[index + 3] = 0; // 透明度を100%にする
      }
    }
  }
  img.updatePixels();
  image(img, 0, 0);

  // ダウンロードボタンを作成
  let button = createButton("画像をダウンロード");
  button.position(10, img.height + 10);
  button.mousePressed(downloadImage);
}

function downloadImage() {
  saveCanvas('processed_image', 'png');
}