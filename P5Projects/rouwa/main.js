let img;
function preload() {
  img = loadImage("img.jpeg");
}
function setup() {
	createCanvas(500, 500);
	smooth();
	image(img, 0, 0, width, height);
}
function draw(){
	image(img, 0, 0, width, height);
	getPixel();
}
function getPixel() {
	for (let x = 0; x <= width; x += 1) {
	  for (let y = height; y >= 0; y -= 1) {
		const index = Math.round(random());
		const color = get(x, y);
		const r = color[0];
		const g = color[1];
		const b = color[2];
		if (100 < r && g < 70 && b < 100) {
		  if (index === 1) drawLine(x, y, r, g, b);
		}
	  }
	}
}
function drawLine(x, y, r, g, b) {
	let length = random(30,80);
	stroke(`rgba(${r}, ${g}, ${b}, 1)`);
	strokeWeight(1);
	noFill();
	line(x, y, x, y+length);
}