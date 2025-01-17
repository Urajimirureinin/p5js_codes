let time = 0; 
let a, b;
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1.0);
  a = windowWidth;
  b = windowHeoght
}

function w(val) {
  if (val == null) return width;
  return width <= height ? width * val : height * val;
}

function h(val) {
  if (val == null) return height;
  return width <= height ? width * val : height * val;;
}

function makeCircle(numSides, radius) {
  const points = [];
  const radiansPerStep = (Math.PI * 2) / numSides;
  for (let theta = 0; theta < Math.PI * 2; theta += radiansPerStep) {
    const x = 0.5 + radius * Math.cos(theta) + a;
    const y = 0.5 + radius * Math.sin(theta) + b;
    points.push([x, y]);
  }
  return points;
}

function distortPolygon(polygon) {
  return polygon.map(point => {
    const x = point[0];
    const y = point[1];
    const distance = dist(0.5, 0.5, x, y);
    const noiseFn = (x, y) => {
      const noiseX = (x + 0.31) * distance * 2 + time;
      const noiseY = (y - 1.73) * distance * 2 + time;
      return noise(noiseX, noiseY);
    };
    const theta = noiseFn(x, y) * Math.PI * 2;
    const amountToNudge = 0.1;
    const newX = x + (amountToNudge * Math.cos(theta)) + a;
    const newY = y + (amountToNudge * Math.sin(theta)) + b;
    return [newX, newY];
  });
}

function chaikin(arr, num) {
  if (num === 0) return arr;
  const l = arr.length;
  const smooth = arr.map((c, i) => {
    return [
      [0.75 * c[0] + 0.25 * arr[(i + 1) % l][0], 0.75 * c[1] + 0.25 * arr[(i + 1) % l][1]],
      [0.25 * c[0] + 0.75 * arr[(i + 1) % l][0], 0.25 * c[1] + 0.75 * arr[(i + 1) % l][1]]
    ];
  }).flat();
  return num === 1 ? smooth : chaikin(smooth, num - 1);
}

function draw() {
  background(0, 0, 100);
  noFill();
  stroke(0, 0, 0);
  strokeWeight(w(0.001));
  
  for (let i = 0.05; i < 0.4; i += 0.0025) {
    let noiseRadius = i + noise(time) * 0.005;
    const circle = makeCircle(200, noiseRadius);
    const distortedCircle = distortPolygon(circle);
    const smoothCircle = chaikin(distortedCircle, 4);

    beginShape();
    smoothCircle.forEach(point => vertex(w(point[0]), h(point[1])));
    endShape(CLOSE);
  }
  time += 0.01;
}
