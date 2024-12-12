function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop(); // 初期描画だけ実行
  let button = createButton('テトリスへ戻る');
  button.position((windowWidth - button.width) / 2, height / 2 + 100);
  button.mousePressed(() => {
    window.location.href="index.html"
  });
}

function draw() {
  background(30); // ダークな背景

  // ランダムなカラフルなエラー要素
  for (let i = 0; i < 100; i++) {
    fill(random(100, 255), random(100, 255), random(100, 255), random(50, 200));
    noStroke();
    ellipse(random(width), random(height), random(10, 100));
  }

  // エラーっぽいテキスト
  fill(255, 0, 0);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("このメッセージが表示されるのはおかしいよ。 😵‍💫", width / 2, height / 2 - 50);

  fill(255);
  textSize(16);
  text("Code 404: Missing Semicolon", width / 2, height / 2);
}

// リサイズ時にキャンバスを再生成
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}
