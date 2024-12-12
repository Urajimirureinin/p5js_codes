let playButton;

window.setup = () => {
  createCanvas(400, 200);
  
  // ボタンを作成
  playButton = createButton('Play MIDI');
  playButton.position(150, 100);
  playButton.mousePressed(playMIDI);
};

window.draw = () => {
  background(220);
  textAlign(CENTER, CENTER);
  textSize(16);
  text('Press the button to play MIDI', width / 2, height / 2 - 40);
};

async function playMIDI() {
  const midiUrl = '../output_files/input_audio_chinpo_basic_pitch.mid'; // 再生するMIDIファイルのパスを指定

  // MIDIファイルを取得して再生
  const response = await fetch(midiUrl);
  const arrayBuffer = await response.arrayBuffer();
  const midi = await new Tone.Midi(arrayBuffer);

  // シンセサイザーを作成
  const synth = new Tone.PolySynth(Tone.Synth).toDestination();

  // MIDIファイルをTone.jsで再生
  midi.tracks.forEach(track => {
    track.notes.forEach(note => {
      synth.triggerAttackRelease(
        note.name,
        note.duration,
        note.time,
        note.velocity
      );
    });
  });

  // 再生を開始
  Tone.Transport.start();
}
