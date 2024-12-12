function setup() {
    createCanvas(800, 600);
    noLoop();
  }
  
  function draw() {
    let startColor = color(255, 0, 0);  // 赤
    let endColor = color(148, 0, 211);  // 紫
  
    for (let i = 0; i < height; i++) {
      let inter = map(i, 0, height, 0, 1);
      let c = lerpColor(startColor, endColor, inter);
      stroke(c);
      line(0, i, width, i);
    }
    
    // 赤から紫までのグラデーション
    for (let j = 0; j < 6; j++) {
      let inter = map(j, 0, 6, 0, 1);
      let col = lerpColor(startColor, endColor, inter);
      fill(col);
      noStroke();
      rect((width / 6) * j, 0, width / 6, height);
    }
  }
  