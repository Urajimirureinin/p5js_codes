var tree, size; // 木の描画用グラフィックスバッファ
var paths = []; // 木の成長に使う枝のリスト
var flowers = []; // 花のリスト
var a;
function setup() {
  createCanvas(800, 800, WEBGL); // 3Dキャンバスを使用
  tree = createGraphics(800, 800); // 木を描くためのグラフィックスバッファ
  ellipseMode(CENTER); 
  smooth(); 
  frameRate(55); // 木がゆっくり成長するように設定
  paths.push(new Pathfinder());
  colorMode(HSB);
  angleMode(DEGREES);
  strokeWeight(4);
  size = 50;
}

function draw() {  
  background(230, 50, 15);
  image(tree, -width/2, -height/2, width, height); // キャンバスに木を描画
  tree.noStroke(); // 木には輪郭線を描かない

  rotateX(-30);
  orbitControl(4, 4); // 3Dマウスコントロール

  // 全ての枝を描画
  for (var i = 0; i < paths.length; i++) {
    var loc = paths[i].location.copy(); // 現在の位置をコピー
    var diam = paths[i].diameter; // 枝の直径を取得
    tree.fill(15, 170 - (diam * 2.8), 0); // 木の色
    tree.ellipse(loc.x, loc.y, diam, diam); // 次の楕円を描画
    paths[i].update(); // 枝の位置と方向を更新
  }

  // 花を描画
  for (var i = 0; i < flowers.length; i++) {
    drawFlower(flowers[i].x, flowers[i].y);
  }
}

function mousePressed() {
  // マウスをクリックした位置に花を追加
  flowers.push(createVector(mouseX - width / 2, mouseY - height / 2));
}

function drawFlower(x, y) {
    a=random();
  push();
  translate(x, y, a);

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
    this.location = createVector(400, 800); // 最初の枝（幹）の位置
    this.velocity = createVector(0, -1); // 幹の成長方向
    this.diameter = 55; // 幹の直径
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
      var bump = new createVector(random(-.87, .87), random(-.87, .87)); // 成長方向のばらつきを設定
      bump.mult(0.1); // ばらつきを減少
      this.velocity.add(bump); // 次の成長に適用
      this.velocity.normalize(); // ベクトルを正規化
      if (random(0, 1) < .01) { // 枝が分岐する確率
        paths.push(new Pathfinder(this)); // 新しい枝を追加
      }
    }
  }
}
