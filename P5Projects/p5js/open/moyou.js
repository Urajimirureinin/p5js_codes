function setup() {
    createCanvas(800, 800);
    noLoop();
    strokeWeight(2);
    stroke(0);
  }
  
  function draw() {
    background(255);
    let baseSize = 40; // 基本のサイズ
    let rows = height / baseSize;
    let cols = width / baseSize;
  
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let size = map(x, 0, cols, baseSize, baseSize); // x座標に基づいてサイズを調整
        let offsetX = x * size;
        let offsetY = y * size;
        if (y % 2 === 0) {
          offsetX += size / 2;
        }
        drawAsanoha(offsetX, offsetY, size);
      }
    }
  }
  
  function drawAsanoha(x, y, size) {
    let h = size * sqrt(3) / 2;
    
    // 六角形の頂点を計算
    let vertices = [];
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI / 6 * i;
      let vx = x + cos(angle) * size / 2;
      let vy = y + sin(angle) * size / 2;
      vertices.push(createVector(vx, vy));
    }
  
    // 中心の点
    let center = createVector(x, y);
  
    // 麻の葉模様を描く
    for (let i = 0; i < 6; i++) {
      let next = (i + 1) % 6;
      line(vertices[i].x, vertices[i].y, center.x, center.y);
      line(vertices[i].x, vertices[i].y, vertices[next].x, vertices[next].y);
      let mid = p5.Vector.lerp(vertices[i], vertices[next], 0.5);
      line(center.x, center.y, mid.x, mid.y);
    }
  }
  
  