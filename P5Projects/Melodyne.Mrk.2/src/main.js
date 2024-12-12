import { piano_keys } from './piano_datas.js'

let piano_keys_viewable = [];

for (let i = 1; i <= 6; ++i) {
    switch (i) {
        case 1:
            for (let j = 0; j <= piano_keys.one.length-1; ++j) {
                piano_keys_viewable.push(piano_keys.one[j].note);
            }
            break;
        case 2:
            for (let j = 0; j <= piano_keys.two.length-1; ++j) {
                piano_keys_viewable.push(piano_keys.two[j].note);
            }
            break;
        case 3:
            for (let j = 0; j <= piano_keys.three.length-1; ++j) {
                piano_keys_viewable.push(piano_keys.three[j].note);
            }
            break;
        case 4:
            for (let j = 0; j <= piano_keys.four.length-1; ++j) {
                piano_keys_viewable.push(piano_keys.four[j].note);
            }
            break;
        case 5:
            for (let j = 0; j <= piano_keys.five.length-1; ++j) {
                piano_keys_viewable.push(piano_keys.five[j].note);
            }
            break;
        case 6:
            for (let j = 0; j <= piano_keys.six.length-1; ++j) {
                piano_keys_viewable.push(piano_keys.six[j].note);
            }
            break;
        default:
            console.log("there is no keys 'piano_keys.["+i+"].note'");
    }
}

let piano_keys_scroll = 0; // 縦スクロールオフセット
let horizontal_scroll = 0; // 横スクロールオフセット
let keyHeight = 20; // 各音階の高さ
let numKeys; // 表示する音階数
let gridWidth; // 1グリッドの幅
let bar_num=16;

//////////p5jscodes//////////

window.setup = () => {
    createCanvas(windowWidth, windowHeight); // キャンバスのサイズ
    numKeys = piano_keys_viewable.length;
    gridWidth = width / bar_num;
    piano_keys_viewable.reverse();
}

window.draw = () => {
    background(255); // 背景を白色に設定
  
    let startIndex = Math.floor(piano_keys_scroll / keyHeight); // 縦スクロール位置に応じた開始インデックス
    let endIndex = Math.min(startIndex + Math.ceil(height / keyHeight), numKeys); // 表示範囲の終わりインデックス

    for (let i = startIndex; i < endIndex; i++) {
        let y = (i - startIndex) * keyHeight - (piano_keys_scroll % keyHeight);
    
        // 黒鍵と白鍵の背景
        if (piano_keys_viewable[i].includes("#")) {
            fill(200); // 黒鍵は灰色
        } else {
            fill(240); // 白鍵は少し明るめ
        }
        rect(-horizontal_scroll, y, width, keyHeight);
    
        // 音階ラベル
        fill(0);
        textSize(12);
        textAlign(LEFT, CENTER);
        text(piano_keys_viewable[i], 5 - horizontal_scroll, y + keyHeight / 2);
    }
  
    // 水平線
    stroke(180);
    for (let i = 0; i <= Math.ceil(height / keyHeight); i++) {
        line(-horizontal_scroll, i * keyHeight - (piano_keys_scroll % keyHeight), width - horizontal_scroll, i * keyHeight - (piano_keys_scroll % keyHeight));
    }
  
    // 垂直線
    for (let i = 0; i <= bar_num; i++) {
        line(i * gridWidth - horizontal_scroll, 0, i * gridWidth - horizontal_scroll, height);
    }
}

window.mouseWheel = (event) => {
    if (keyIsDown(SHIFT)) {
        // シフトキーが押されている場合は横方向にスクロール
        horizontal_scroll += event.delta;
        horizontal_scroll = constrain(horizontal_scroll, 0, 30 * gridWidth - width); // 横スクロール範囲を制限
    } else {
        // シフトキーが押されていない場合は縦方向にスクロール
        piano_keys_scroll += event.delta;
        piano_keys_scroll = constrain(piano_keys_scroll, 0, numKeys * keyHeight - height); // 縦スクロール範囲を制限
    }
}

window.windowResized = () => {
        resizeCanvas(windowWidth, windowHeight, true);
        gridWidth = width / bar_num;
}