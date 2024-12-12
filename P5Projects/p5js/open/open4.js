var paths = []; // 木の成長に使う枝のリスト
var flowers = []; // 花のリスト
var spheres = []; // 枝の位置に表示される球のリスト

function setup() {
  createCanvas(800, 800, WEBGL); // 3Dキャンバスを使用
  smooth(); 
  frameRate(); // 木がゆっくり成長するように設定
  paths.push(new Pathfinder());
  colorMode(HSB);
  angleMode(DEGREES);
  strokeWeight(4);
}

function draw() {
    background(37,46,96);

  let dirX = (mouseX / width - 0.5) * 2;
  let dirY = (mouseY / height - 0.5) * 2;
  directionalLight(255, 127, 80, -dirX, -dirY, -1);
  orbitControl(4, 4); // 視点の回転

  // 全ての枝を更新し、成長を描画
  for (var i = 0; i < paths.length; i++) {
    paths[i].update();
  }

  // 全ての球を描画
  for (var i = 0; i < spheres.length; i++) {
    drawSphere(spheres[i].x, spheres[i].y, spheres[i].z, spheres[i].diameter);
  }

  // 花を描画
  for (var i = 0; i < flowers.length; i++) {
    drawFlower(flowers[i].x, flowers[i].y, flowers[i].z);
  }
}

function mousePressed() {
    // マウスをクリックした位置に最も近いsphereを探す
    let x = mouseX - width / 2;
    let y = mouseY - height / 2;
    let z = random(100)-50;
    let closestSphere = null;
    let minDist = Infinity;
  
    for (let i = 0; i < spheres.length; i++) {
      let d = dist(x, y, z, spheres[i].x, spheres[i].y, spheres[i].z);
      if (d < minDist) {
        minDist = d;
        closestSphere = spheres[i];
      }
    }
  
    // 最も近いsphereの位置に花を追加
    if (closestSphere) {
      flowers.push(createVector(closestSphere.x, closestSphere.y, closestSphere.z));
    }
}

function drawSphere(x, y, z, diameter) {
  push();
  translate(x, y, z);
  fill(104, 100, 50); // 木の色
  sphere(diameter); // 枝の代わりに球を描画
  pop();
}

function drawFlower(x, y, z) {
  push();
  translate(x, y, z);

  for(let r = 0; r <= 1.02; r += 0.02){
    stroke(340, -r*50+100, r*50+50);
    beginShape(POINTS);
    for(let theta = -2*180; theta <= 180*15; theta += 2){
      let phi = (180/2)*Math.exp(-theta/(8*180));
      let petalCut = 1 - (1/2) * pow((5/4)*pow(1-((3.6*theta%360)/180), 2)-1/4, 2);
      let hangDown = 2*pow(r, 2)*pow(1.3*r-1, 2)*sin(phi);

      if(0 < petalCut * (r * sin(phi)+hangDown*cos(phi))){
        let pX = 30 * petalCut * (r * sin(phi)+hangDown*cos(phi)) * sin(theta);
        let pY = -30 * petalCut * (r * cos(phi)-hangDown*sin(phi));
        let pZ = 30 * petalCut * (r * sin(phi)+hangDown*cos(phi)) * cos(theta);
        vertex(pX, pY, pZ);
      }
    }
    endShape();
  }

  pop();
}

function Pathfinder(parent) {
  if (parent === undefined) {
    this.location = createVector(0, 200, 0); // 最初の枝（幹）の位置
    this.velocity = createVector(0, -1, 0); // 幹の成長方向
    this.diameter = 10; // 幹の直径
  } else {
    this.location = parent.location.copy(); // 親の枝の位置をコピー
    this.velocity = parent.velocity.copy(); // 親の枝の方向をコピー
    var area = PI * sq(parent.diameter * 2 / 5); // 枝の断面積を計算
    var newDiam = sqrt(area / 2 / PI) * 2; // 新しい枝の直径を計算
    this.diameter = newDiam;
    parent.diameter = newDiam; // 親の枝も更新
  }

  this.update = function() {
    if (this.diameter > 0.1) { // 枝の成長を止める直径
      this.location.add(this.velocity); // 枝の位置を更新
      var bump = new createVector(random(-.5, .5), random(-.5, .5), random(-.5, .5)); // 成長方向のばらつきを設定
      bump.mult(0.1); // ばらつきを減少
      this.velocity.add(bump); // 次の成長に適用
      this.velocity.normalize(); // ベクトルを正規化

      // 各更新で球をリストに追加
      spheres.push({x: this.location.x, y: this.location.y, z: this.location.z, diameter: this.diameter});

      if (random(0, 1) < .03) { // 枝が分岐する確率
        paths.push(new Pathfinder(this)); // 新しい枝を追加
      }
    }
  }
}
