var w = 400;
var h = 400;
var t = 150;
function setup() {
  createCanvas(windowWidth,windowHeight);
  background(0);
  w=width;
  h=height
}

function draw() {
  background(0);
  for(j = 0;j < 40;j++){
    var seed = (j - frameCount) * 0.02;
    var pre_y = noise(seed) * t - t/2 + h/10 * sin(0) + h / 2;
    var c = color(noise(seed) * 255,noise(seed + 1) * 255,noise(seed + 2) * 255); 
    stroke(c);
    for(i = 0;i < w;i+=3){
      var y = noise(seed + 0.01 * (i + 1)) * t - t/2 + h/20 * sin(TWO_PI/360*i * 0.8) + h / 2;
      line(i, pre_y, i + 3, y);
      pre_y = y;
    }
  }
}