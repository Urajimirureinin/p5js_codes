import { piano_keys } from './piano_datas.js'

let piano_keys_viewable = [];
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

let piano_keys_scroll = 0; // 縦スクロールオフセット
let horizontal_scroll = 0; // 横スクロールオフセット
let keyHeight = 20; // 各音階の高さ
let grid_width; // 1グリッドの幅
let bar_num = 16; // 小節数
let numKeys = 88; // 88鍵盤

let midiNotes = []; // MIDI ノートデータ
let midiLoaded = false; // MIDI データの読み込みフラグ

let MIDI_notes;

// ズーム関連変数
let zoomLevel = 1; // ズーム率
const zoomMin = 0.5; // 最小ズーム率
const zoomMax = 2; // 最大ズーム率

window.setup = () => {
    createCanvas(windowWidth, windowHeight); // canvasのセットアップ
    numKeys = piano_keys_viewable.length;
    grid_width = width / bar_num;
    piano_keys_viewable.reverse();

    // MIDI ファイルの読み込み
    loadMIDI('../output_files/input_audio_chinpo_basic_pitch.mid');
}

function loadMIDI(filePath) {
    fetch(filePath)
        .then(response => response.arrayBuffer())
        .then(data => {
            MIDI_notes = new Midi(data); // Tone.js を使って MIDI を解析
            console.log(MIDI_notes);
            MIDI_notes.tracks.forEach(track => {
                track.notes.forEach(note => {
                    midiNotes.push({
                        time: note.time, // ノートの時間
                        duration: note.duration, // ノートの長さ
                        midi: note.midi, // MIDI ノート番号
                        velocity: note.velocity // ベロシティ
                    });
                });
            });

            // 時間順にソート
            midiNotes.sort((a, b) => a.time - b.time);
            midiLoaded = true;
        })
        .catch(err => console.error("MIDI ファイルの読み込みに失敗しました:", err));
}

window.draw = () => {
    background(255);

    let startIndex = Math.floor(piano_keys_scroll / keyHeight); // 縦スクロール位置に応じた開始インデックス
    let endIndex = Math.min(startIndex + Math.ceil(height / keyHeight), numKeys); // 表示範囲の終わりインデックス

    // 鍵盤の描画
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
        line(i * grid_width - horizontal_scroll, 0, i * grid_width - horizontal_scroll, height);
    }

    // MIDI ノートの描画
    if (midiLoaded) {
        noStroke();
        fill(0, 255, 127, 200);

        midiNotes.forEach(note => {
            const y = height - ((note.midi - 69) * keyHeight) - (piano_keys_scroll) - 3; // MIDI ノート番号を Y 座標に変換
            const x = map(note.time, 0, getMaxTime(), 0, bar_num * grid_width * zoomLevel) - horizontal_scroll; // 時間を X 座標に変換
            const w = map(note.duration, 0, getMaxTime(), 0, bar_num * grid_width * zoomLevel); // ノートの長さ
            rect(x, y, w, keyHeight - 2); // ノートを矩形として描画
        });
    }
}

// MIDI の最大時間を取得
function getMaxTime() {
    if (midiNotes.length > 0) {
        return midiNotes[midiNotes.length - 1].time;
    }
    return 0;
}

window.mouseWheel = (event) => {
    if (keyIsDown(SHIFT)) {
        // シフトキーが押されている場合は横方向にスクロール
        horizontal_scroll += event.delta;
        horizontal_scroll = constrain(horizontal_scroll, 0, bar_num * grid_width * zoomLevel - width);
    } else if (keyIsDown(CONTROL)) {
        // コントロールキーが押されている場合はズーム
        const zoomChange = -event.delta * 0.001;
        zoomLevel = constrain(zoomLevel + zoomChange, zoomMin, zoomMax);
        grid_width = (width / bar_num) * zoomLevel; // ズーム率に基づいてグリッド幅を再計算
    } else {
        // 縦方向にスクロール
        piano_keys_scroll += event.delta;
        piano_keys_scroll = constrain(piano_keys_scroll, 0, numKeys * keyHeight - height);
    }
}

window.windowResized = () => {
    resizeCanvas(windowWidth, windowHeight, true);
    grid_width = (width / bar_num) * zoomLevel; // ズーム率に基づいてグリッド幅を再計算
}
