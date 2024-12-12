import { piano_keys } from './piano_datas.js' // 音階と音階ごとの周波数のオブジェクト

let piano_keys_viewable = [];
// 音階を配列にまとめる
for (let i = 1; i <= 6; ++i) {
    switch (i) {
        case 1:
            for (let j = 0; j <= piano_keys.one.length - 1; ++j) {
                piano_keys_viewable.push(piano_keys.one[j].note);
            }
            break;
        case 2:
            for (let j = 0; j <= piano_keys.two.length - 1; ++j) {
                piano_keys_viewable.push(piano_keys.two[j].note);
            }
            break;
        case 3:
            for (let j = 0; j <= piano_keys.three.length - 1; ++j) {
                piano_keys_viewable.push(piano_keys.three[j].note);
            }
            break;
        case 4:
            for (let j = 0; j <= piano_keys.four.length - 1; ++j) {
                piano_keys_viewable.push(piano_keys.four[j].note);
            }
            break;
        case 5:
            for (let j = 0; j <= piano_keys.five.length - 1; ++j) {
                piano_keys_viewable.push(piano_keys.five[j].note);
            }
            break;
        case 6:
            for (let j = 0; j <= piano_keys.six.length - 1; ++j) {
                piano_keys_viewable.push(piano_keys.six[j].note);
            }
            break;
        default:
            console.log("there is no keys 'piano_keys.[" + i + "].note'");
    }
}

let piano_keys_scroll = 0; // 横方向スクロールの値
let horizontal_scroll = 0; // 縦方向スクロールの値
let keyHeight = 20; // ピアノロールの縦幅
let grid_width; // 縦線を表示する間隔
let bar_num = 16; // バーの数
let numKeys = 88; // ピアノロールの音階の数

let midiNotes = []; // midiのノーツをしまう配列
let midiLoaded = false; // midiが読み込まれているか判定する。
let BPM = 120; // デフォルト値
let totalDuration = 0; // 全体のmidiの再生時間

let zoomLevel = 1; // ズームレベル(ズームしているほど値が大きくなる)
const zoomMin = 0.5; // ズームイン上限
const zoomMax = 2; // ズームアウト下限

let MIDI_notes; // midiデータを入れるオブジェクト

window.setup = () => {
    createCanvas(windowWidth, windowHeight);
    numKeys = piano_keys_viewable.length; // ピアノロールに表示する音階の数を、配列にまとめた音階の数にする
    grid_width = width / bar_num; // 間隔の再計算
    piano_keys_viewable.reverse(); // 音階を逆順に並び替え

    loadMIDI('../output_files/input_audio_chinpo_basic_pitch.mid'); // midi読み込み
};

// midi読み込みの関数
function loadMIDI(filePath) {
    fetch(filePath)
        .then(response => response.arrayBuffer())
        .then(data => {
            MIDI_notes = new Midi(data); // midiクラスとして宣言
            console.log(MIDI_notes); 

            // BPM取得
            if (MIDI_notes.header.tempos && MIDI_notes.header.tempos.length > 0) {
                BPM = MIDI_notes.header.tempos[0].bpm || 120; // デフォルト値
            }

            // 全体の長さ取得（秒）
            totalDuration = MIDI_notes.duration || 0;

            // 小節数計算
            const secondsPerBar = (60 / BPM) * 4; // 1小節の秒数（4拍分）
            bar_num = Math.ceil(totalDuration / secondsPerBar);

            // MIDIノート情報取得
            MIDI_notes.tracks.forEach(track => {
                track.notes.forEach(note => {
                    midiNotes.push({
                        time: note.time,
                        duration: note.duration,
                        midi: note.midi,
                        velocity: note.velocity
                    });
                });
            });

            midiNotes.sort((a, b) => a.time - b.time); // 時間順にソート
            midiLoaded = true; // midiが読み込まれたことにする

            grid_width = (width / bar_num) * zoomLevel; // 再計算
        })
        .catch(err => console.error("MIDI ファイルの読み込みに失敗しました:", err));
}

window.draw = () => {
    background(255);

    let startIndex = Math.floor(piano_keys_scroll / keyHeight); // 縦スクロール位置に応じた開始インデックス
    let endIndex = Math.min(startIndex + Math.ceil(height / keyHeight), numKeys); // 表示範囲の終わりインデックス

    // 鍵盤の描画
    for (let i = startIndex; i < endIndex; i++) {
        let y = (i - startIndex) * keyHeight - (piano_keys_scroll % keyHeight); // 盤の高さ指定

        // 黒鍵と白鍵の背景
        if (piano_keys_viewable[i].includes("#")) {
            fill(200); // 黒鍵の色
        } else {
            fill(240); // 白鍵の色
        }
        rect(-horizontal_scroll, y, 2*zoomLevel*width, keyHeight); // 鍵盤描画

        // 音階ラベル
        fill(0); // テキストの色
        textSize(12); // テキストのサイズ
        textAlign(LEFT, CENTER); // 左揃え中央
        text(piano_keys_viewable[i], 5 - horizontal_scroll, y + keyHeight / 2); // 文字表示
    }

    // 水平線
    stroke(180);
    for (let i = 0; i <= Math.ceil(height / keyHeight); i++) {
        line(-horizontal_scroll, i * keyHeight - (piano_keys_scroll % keyHeight), width - horizontal_scroll, i * keyHeight - (piano_keys_scroll % keyHeight));
    }

    // 垂直線
    for (let i = 0; i <= bar_num + 1; i++) {
        line(i * grid_width - horizontal_scroll, 0, i * grid_width - horizontal_scroll, height);
    }

    // MIDI ノートの描画
    if (midiLoaded) {
        noStroke();
        fill(0, 255, 127, 200); // midiノーツの色

        // midiノーツを一個ずつ表示していく
        midiNotes.forEach(note => {
            const y = height - ((note.midi - 69) * keyHeight) - (piano_keys_scroll) - 3;
            const x = map(note.time, 0, getMaxTime(), 0, bar_num * grid_width * zoomLevel) - horizontal_scroll;
            const w = map(note.duration, 0, getMaxTime(), 0, bar_num * grid_width * zoomLevel);
            rect(x, y, w, keyHeight - 2);
        });
    }
};

// midiの最後のノーツを取得してそれまでの長さを返す
function getMaxTime() {
    if (midiNotes.length > 0) {
        return midiNotes[midiNotes.length - 1].time;
    }
    return 0;
}

// マウスが動かされたときの処理
window.mouseWheel = (event) => {
    // マウス操作 + shiftキー は横移動
    if (keyIsDown(SHIFT)) {
        horizontal_scroll += event.delta;
        horizontal_scroll = constrain(horizontal_scroll, 0, bar_num * grid_width * zoomLevel - width); // 横スクロールの制限
    } 
    // マウス操作 + controlキー は拡大・縮小
    else if (keyIsDown(CONTROL)) { 
        const zoomChange = -event.delta * 0.001;
        zoomLevel = constrain(zoomLevel + zoomChange, zoomMin, zoomMax); // 拡大縮小の上、下限
        grid_width = (width / bar_num) * zoomLevel; 
    }
    // マウス操作 は縦移動
    else {             
        piano_keys_scroll += event.delta;
        piano_keys_scroll = constrain(piano_keys_scroll, 0, numKeys * keyHeight - height); // 縦スクロールの制限
    }
};

// ウィンドウがリサイズされたときの処理
window.windowResized = () => {
    resizeCanvas(windowWidth, windowHeight, true);
    grid_width = (width / bar_num) * zoomLevel; // 間隔の制限
};
