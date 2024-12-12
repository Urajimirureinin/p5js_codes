let playButton; // 再生ボタン
let volumeSlider; // 音量のスライド
let speedSlider; // 再生速度のスライド
let myFont;

function setup(){ // 全体の設定

  createCanvas(windowWidth,windowHeight);

  colorMode(HSB);
  textSize(width / 20);
  textFont(myFont);
  textAlign(CENTER, CENTER);

    playButton = createButton("Play"); //　再生ボタンの定義
    playButton.size(100, 50);         // 再生ボタンの大きさを設定
    playButton.position(100, 20);    // 再生ボタンの位置を設定
    playButton.style('background-color', color(30));// 再生ボタンの位置を設定
    playButton.style('color', color(200));   // 再生ボタンの背景の色を設定
    playButton.mousePressed(play_stop);// 再生ボタンを押した時の関数を設定

    volumeSlider = createSlider(0, width, width/2);// 音量のバーを設定
    volumeSlider.position(250, 50);// 音量のバーの位置を設定

    speedSlider = createSlider(0, width, width/2);// 再生速度のバーを設定
    speedSlider.position(400, 50);// 再生速度のバーの位置を設定
    amplitude = new p5.Amplitude();

  fft = new p5.FFT();// FFTを設定

}

function draw(){ 
  const level = amplitude.getLevel()

  background(2500*level,30,90);

  let spectrum = fft.analyze();
  noStroke();

  for (let i = 0; i< spectrum.length; i++){
        fill(255, 255*i/spectrum.length, 0);
    let x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x+50, height, width / spectrum.length, h )
  }

    let volume = map(volumeSlider.value(), 0, width, 0, 0.5); // 音量の変数を定義
    volume = constrain(volume, 0.001, 1);// 音量を0.001~0.1に圧縮
  sound.amp(volume); // 音量を決定

    let speed = map(speedSlider.value(), 0.1, width, 0, 2); // 再生速度の変数を定義
    speed = constrain(speed, 0.5, 2); // 再生速度を0.5~2に圧縮
    sound.rate(speed); // 再生速度を決定
  fill(5);
  let a = Math.floor(Math.atan(level*10)/Math.PI*192)+12449;
  let aa = String.fromCharCode(a);
  text(aa,random(width),random(height))
}


function preload(){  //  音源を定義する

  sound = loadSound('13647.mp3');
  myFont = loadFont('ipaexm.ttf'); // 音声データを読み込む
  //  予めOpen Processingにアップロードする
}

function play_stop() { // 音源を再生・停止する

  if (sound.isPlaying()) { // 音源が再生している時
    sound.pause(); //  音源を停止する
        playButton.html("Pause"); // ボタンを停止に変える
  } 

    else { // 音源が停止している時
    sound.loop(); // 音源を再生する
        playButton.html("Play"); //  ボタンを再生に変える
  }

}

function keyPressed(){
  if(key === " "){
    play_stop();
  }
  return false;
}