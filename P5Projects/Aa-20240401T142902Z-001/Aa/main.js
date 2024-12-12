function preload() {
  photo = loadImage("./pp.png");
}

function setup() {
  createCanvas(photo.width, photo.height);
  
	let img = draw_image();
	
	img = draw_noise(img);
	img = draw_color_glitch(img, 5);
	img = draw_shift_glitch(img, 10);
	
  background(0);
	image(img, 0, 0);
	
	draw_scanline();
}

function draw_image(){
	image(photo, 0, 0);

  push();
  blendMode(HARD_LIGHT);
	image(photo, 0, 0);
  pop();
	
  filter(GRAY);

	push();
  blendMode(OVERLAY);
	tint(255, 200);
	image(photo, 0, 0);
	pop();

	let img = get();
	clear();
	
  return img;
}

function draw_noise(img){
  background(0);
  image(img, 0, 0);

  let noise_size = 5;

  push();
  strokeWeight(0);
	for(let i=0;i<img.width;i+=noise_size){
		for(let j=0;j<img.height;j+=noise_size){
			if(random()<0.4){
				fill(random([0, 255]), 50*noise(i, j));
				rect(i, j, noise_size);
			}
		}
	}
  pop();
	
	let img_noise = get();
	clear();
	
  return img_noise;
}

function draw_color_glitch(img, shift_size){
  background(0);

  let left_color = color(255, 0, 0);
  let right_color = color(0, 255, 255);

  push();
  blendMode(ADD);

  tint(left_color);
  image(img, -shift_size, 0);

  tint(right_color);
  image(img, shift_size, 0);
  pop();
	
	let img_glitch = get();
	clear();
	
  return img_glitch;
}

function draw_shift_glitch(img, shift_size){
  background(0);	
	image(img, 0, 0);

	for(let i=0;i<100;i++){
		let sx = random(img.width*0.5);
		let sy = random(img.height*0.05);
		let x = random(img.width - sx*0.5);
		let y = random(img.height - sy*0.5);
		let ix = x + random(-1, 1)*shift_size;
		let iy = y ;
		image(img, ix, iy, sx, sy, x, y, sx, sy);
	}
	
	let img_glitch = get();
	clear();
	
  return img_glitch;
}

function draw_scanline(){
	push();
  stroke(0, 50);
  strokeWeight(1);
  for(let i=0;i<height;i+=height/200){
    line(0, i, width, i);
  }
  pop();
}