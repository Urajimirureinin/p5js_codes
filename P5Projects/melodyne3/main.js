// View
const playButton = document.getElementById('play-button')

const fileInput = document.getElementById('fileInput');
const file = fileInput.files[0];
console.log(fileInput)
const smfData = new Uint8Array(file);

// PicoAudio.jsの初期化
const picoAudio = new PicoAudio()
picoAudio.init()

let picotuneDemoSmf = smfData;

// 曲データの初期化
const parsedSMF = picoAudio.parseSMF(picotuneDemoSmf)
picoAudio.setData(parsedSMF)

// ボタン操作
playButton.addEventListener('click', () => {
  // 再生状態を初期化して再生する
  picoAudio.initStatus()
  picoAudio.play()
})

///////////////////////////////////////////////////////
//// 描画周り

// View
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

// 描画に関する値
const ChannelColors = [
	"#f66", "#fa6", "#f6f", "#6f6",
	"#6af", "#66f", "#f22", "#fa2",
	"#f2f", "#fff", "#2f2", "#2af",
	"#22f", "#a00", "#060", "#006",
]
const BackgroundColor = '#dde'
const NoteWidth = 4
const ScrollSize = 3

// 再生中の音を管理する(今回は `チャンネル名/音の高さ` というkeyにしてしまう)
const playingNotes = new Map()

// PicoAudioのイベントリスナ 鳴ってる音をMapに入れる
picoAudio.addEventListener('noteOn', (note) => {
  const key = `${ note.channel }/${ note.pitch }`
  playingNotes.set(key, note.velocity)
})
picoAudio.addEventListener('noteOff', (note) => {
  const key = `${ note.channel }/${ note.pitch }`
  playingNotes.set(key, 0)
})

// canvas初期化
context.globalAlpha = 1
context.fillStyle = BackgroundColor
context.fillRect(0, 0, canvas.width, canvas.height)

// canvasの更新
const step = () => {  
  // すでに描画されているものを少し下にそのまま描画し直す(これにより下方向にスクロールする)
  context.globalAlpha = 1
  context.drawImage(canvas, 0, ScrollSize);

  // 上部は今鳴ってる音だけを描画したいのでクリアする
  context.globalAlpha = 1
  context.fillStyle = BackgroundColor
  context.fillRect(0, 0, canvas.width, ScrollSize)
  
  // 鳴ってる音を上部に描画する
  playingNotes.forEach((value, key) => {
    if (value) {
      // key から channel と pitch の情報を分離する
      const [channel, pitch] = key.split('/')
      
      // 低音域はあまり使用しないので100px分シフトする
      const x = NoteWidth * pitch - 100
      
      // 鳴ってる音の描画
      context.globalAlpha = Math.min(value * 1.2, 1)
      context.fillStyle = ChannelColors[channel]
      context.fillRect(x, 0, NoteWidth, ScrollSize)
    }
  })

  window.requestAnimationFrame(step)
}

window.requestAnimationFrame(step)
