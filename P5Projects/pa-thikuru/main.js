let colors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
    '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
    '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
    '#FF5722'
  ];
  
  class Particle {
    constructor(x, y, size) {
      this.base_size = size;
      this.spawn = createVector(x, y);
      this.init();
    }
    init() {
      this.size = this.base_size * random(0.5, 1.5);
      this.start = millis();
      this.position = this.spawn.copy();
      this.velocity = createVector(0, 0);
      this.acceleration = createVector(0, 0);
      this.duration = 1000 * random(0.2,1.2);
      this.drag = random(0.9, 1);
      this.addForce(
        new p5.Vector.fromAngle(random(TWO_PI), random(10))
      );
      this.color = random(colors);
    }
    display() {
      let s = 1;
      if (millis() - this.start < this.duration * 0.1) {
        s = map(millis() - this.start, 0, this.duration * 0.1, 0, 1);
      } else if (millis() - this.start > this.duration * 0.5) {
        s = map(millis() - this.start, this.duration * 0.5, this.duration, 1, 0);
      }
      fill(this.color);
      circle(this.position.x, this.position.y, this.size * s * map(this.velocity.mag(),0,500,0.5,1.2));
    }
    update() {
      this.velocity.add(this.acceleration);
      this.velocity.limit(500);
      this.velocity.mult(this.drag);
      this.position.add(this.velocity.copy().mult(1 / _targetFrameRate));
      this.acceleration.mult(0);
      if (this.position.y > height || millis() - this.start > this.duration) {
        this.init();
      }
    }
    addForce(vector) {
      this.acceleration.add(vector);
    }
  }
  
  let particles = [], field = [], fieldStep;
  function setup() {
    // p5.js キャンバスを作成
    createCanvas(windowWidth, windowHeight);
    // カスタムの初期化
    init();
    // 60 フレーム/秒に設定
    frameRate(60);
  }
  
  function init() {
    // キャンバス上の全ての描画をクリア
    clear();
    // テキストのフォントサイズを設定
    textSize(12);
    // テキストのスタイルを太字に設定
    textStyle(BOLD);
    // setup() 関数で createCanvas() 関数を使用してキャンバスを作成すると、そのキャンバスの幅が width として設定され、同様に height 変数にはキャンバスの高さが設定される。
    // この変数はグローバルスコープで利用でき、描画関数や他の関数内でも参照することができできる
    // テキストボックスの幅設定
    let text_box_width = min(width, 1200) * 0.8;
    // 最小のフォントサイズを計算
    let minSizeW = 12 / textWidth("テキストa") * text_box_width;
    textSize(minSizeW);
    // 中央配置
    text("テキストa", width / 2 - text_box_width / 2, height / 2);
    // テキストを透明
    noFill();
    particles = [];
    let step = 5;
    let i = 0;
    for (let x = 0; x < width; x += step) {
      for (let y = 0; y < height; y += step) {
        let target_x = x + step / 2,
          target_y = y + step / 2;
        let alpha = get(target_x, target_y)[3];
        if (alpha > 0.5) {
          particles.push(new Particle(target_x, target_y, step * 3, i));
          i++;
        }
      }
    }
  
    step = fieldStep = floor(max(width,height)/min(20,min(width,height)));
    i = 0;
    for (let x = 0; x < width; x += step) {
      for (let y = 0; y < height; y += step) {
        i++;
        let a = noise(i)*TWO_PI;
        field[`${x}-${y}`] = a;
        translate(x,y);
        rotate(a);
        rect(-step/4,-step/2,step/2,step)
        resetMatrix();
      }
    }
    clear();
  }
  
  // 描画
  function draw() {
    // キャンバスの背景色
    background(255);
    particles.forEach((particle, i) => {
      particle.update();
      particle.display();
    });
  }