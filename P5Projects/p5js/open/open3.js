var paths = []; // 木の成長に使う枝のリスト
var flowers = []; // 花のリスト
var size=0;
function setup() {
  createCanvas(windowHeight, windowWidth, WEBGL); // 3Dキャンバスを使用
  smooth(); 
  frameRate(55); // 木がゆっくり成長するように設定
  paths.push(new Pathfinder());
  colorMode(HSB);
  angleMode(DEGREES);
  strokeWeight(4);
}

function draw() {  
  background(230, 50, 15);
  rotateX(-30);
  orbitControl(4, 4); // 3Dマウスコントロール

  // 全ての枝を描画
  for (var i = 0; i < paths.length; i++) {
    paths[i].update(); // 枝の位置と方向を更新
    paths[i].display(); // 枝を描画
  }

  // 花を描画
  for (var i = 0; i < flowers.length; i++) {
    drawFlower(flowers[i].x, flowers[i].y, flowers[i].z);
  }
  size++;
}

function mousePressed() {
  // マウスをクリックした位置に花を追加
  let x = mouseX - width / 2;
  let y = mouseY - height / 2;
  let z = random(-200, 200); // 適当にZ座標を設定
  flowers.push(createVector(x, y, z));
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
        let pX = size * petalCut * (r * sin(phi)+hangDown*cos(phi)) * sin(theta);
        let pY = -size * petalCut * (r * cos(phi)-hangDown*sin(phi));
        let pZ = size * petalCut * (r * sin(phi)+hangDown*cos(phi)) * cos(theta);
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
    this.velocity = createVector(0, -0.1, 0); // 幹の成長方向
    this.diameter = 20; // 幹の直径
  } else {
    this.location = parent.location.copy(); // 親の枝の位置をコピー
    this.velocity = parent.velocity.copy(); // 親の枝の方向をコピー
    var area = PI * sq(parent.diameter / 2); // 枝の断面積を計算
    var newDiam = sqrt(area / 2 / PI) * 2; // 新しい枝の直径を計算
    this.diameter = newDiam;
    parent.diameter = newDiam; // 親の枝も更新
  }

  this.update = function() {
    if (this.diameter > 2) { // 枝の成長を止める直径
      this.location.add(this.velocity); // 枝の位置を更新
      var bump = new createVector(random(-.87, .87), random(-.87, .87), random(-.87, .87)); // 成長方向のばらつきを設定
      bump.mult(0.1); // ばらつきを減少
      this.velocity.add(bump); // 次の成長に適用
      this.velocity.normalize(); // ベクトルを正規化
      if (random(0, 1) < .01) { // 枝が分岐する確率
        paths.push(new Pathfinder(this)); // 新しい枝を追加
      }
    }
  }

  this.display = function() {
    push();
    translate(this.location.x, this.location.y, this.location.z);
    fill(15, 170 - (this.diameter * 2.8), 0); // 木の色
    sphere(this.diameter); // 枝の代わりに球を描画
    pop();
  }
}
