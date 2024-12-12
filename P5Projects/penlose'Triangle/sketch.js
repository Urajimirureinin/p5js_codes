let angleX = 0;
let angleY = 0;
let lastX;
let lastY;
let isDragging = false;

function setup() {
  createCanvas(600, 600, WEBGL);
  lastX = mouseX;
  lastY = mouseY;
}

function draw() {
  background(0, 0, 255);
  
  if (isDragging) {
    let deltaX = mouseX - lastX;
    let deltaY = mouseY - lastY;

    angleX += deltaY * 0.01;
    angleY -= deltaX * 0.01;

    lastX = mouseX;
    lastY = mouseY;
  }
  
  rotateX(angleX);
  rotateY(angleY);

  stroke(255);
  strokeWeight(3);
  noFill();
  
  // Draw edges of the cuboid
  beginShape(LINES);
  // Front face
  vertex(-100, -100, -100);
  vertex(100, -100, -100);
  
  vertex(100, -100, -100);
  vertex(100, 100, -100);
  
  vertex(100, 100, -100);
  vertex(-100, 100, -100);
  
  vertex(-100, 100, -100);
  vertex(-100, -100, -100);
  
  // Back face
  vertex(-100, -100, 100);
  vertex(100, -100, 100);
  
  vertex(100, -100, 100);
  vertex(100, 100, 100);
  
  vertex(100, 100, 100);
  vertex(-100, 100, 100);
  
  vertex(-100, 100, 100);
  vertex(-100, -100, 100);
  
  // Connecting edges
  vertex(-100, -100, -100);
  vertex(-100, -100, 100);
  
  vertex(100, -100, -100);
  vertex(100, -100, 100);
  
  vertex(100, 100, -100);
  vertex(100, 100, 100);
  
  vertex(-100, 100, -100);
  vertex(-100, 100, 100);
  endShape();
}

function mousePressed() {
  isDragging = true;
  lastX = mouseX;
  lastY = mouseY;
}

function mouseReleased() {
  isDragging = false;
}
