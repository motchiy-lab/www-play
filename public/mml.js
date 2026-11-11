class SimpleMMLPlayer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timeouts = [];
    this.notes = { 'c':0, 'c#':1, 'd':2, 'd#':3, 'e':4, 'f':5, 'f#':6, 'g':7, 'g#':8, 'a':9, 'a#':10, 'b':11 };
  }

  initAudio() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  parseAndPlay(mmlString) {
    this.initAudio();
    this.stop();
    this.isPlaying = true;

    let tempo = 120;
    let octave = 4;
    let defaultLength = 4;
    
    // 簡易トークナイズ
    const tokens = mmlString.toLowerCase().replace(/\s+/g, '').match(/([tlo><r-cdefgab][0-9]*#?)/g) || [];
    let currentTime = this.ctx.currentTime + 0.05;

    for (let i = 0; i < tokens.length; i++) {
      if (!this.isPlaying) break;

      const token = tokens[i];
      const cmd = token[0];
      const numMatch = token.match(/\d+/);
      const num = numMatch ? parseInt(numMatch[0], 10) : null;

      if (cmd === 't') {
        if (num) tempo = num;
      } else if (cmd === 'o') {
        if (num && num >= 0 && num <= 8) octave = num;
      } else if (cmd === '<') {
        octave = Math.min(8, octave + 1);
      } else if (cmd === '>') {
        octave = Math.max(0, octave - 1);
      } else if (cmd === 'l') {
        if (num) defaultLength = num;
      } else if (this.notes[cmd] !== undefined || cmd === 'r') {
        // 音名または休符
        let noteName = cmd;
        if (token.includes('#')) noteName += '#';
        
        let length = num ? num : defaultLength;
        // 1拍の長さ(秒) = 60 / テンポ
        // 全音符 = 4拍。指定されたlength（4分音符なら4）で割る
        const duration = (60 / tempo) * (4 / length);

        if (cmd !== 'r') {
          const noteIndex = this.notes[noteName];
          // MIDIノート番号計算 (C4 = 60)
          const midiNote = (octave + 1) * 12 + noteIndex;
          const frequency = 440 * Math.pow(2, (midiNote - 69) / 12);
          
          this.playTone(frequency, currentTime, duration - 0.02);
        }

        currentTime += duration;
      }
    }

    // すべての音が鳴り終わった後の処理
    const totalDurationMs = (currentTime - this.ctx.currentTime) * 1000;
    const endTimeout = setTimeout(() => {
      this.stop();
    }, Math.max(0, totalDurationMs));
    this.timeouts.push(endTimeout);
  }

  playTone(freq, startTime, duration) {
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'triangle'; // 聞きやすい三角波（好みでsquareやsawtoothに変更可）
    osc.frequency.setValueAtTime(freq, startTime);

    // プチプチ音（クリックノイズ）を防ぐエンベロープ
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.005);
    gainNode.gain.setValueAtTime(0.2, startTime + duration - 0.005);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  stop() {
    this.isPlaying = false;
    this.timeouts.forEach(t => clearTimeout(t));
    this.timeouts = [];
    
    const playBtn = document.getElementById('mml-play-btn');
    const stopBtn = document.getElementById('mml-stop-btn');
    const statusText = document.getElementById('mml-status');
    
    if(playBtn && stopBtn && statusText) {
      playBtn.disabled = false;
      stopBtn.disabled = true;
      statusText.textContent = "Ready";
    }
  }
}

// プレイヤーのインスタンス化とイベント割り当て
const player = new SimpleMMLPlayer();

document.getElementById('mml-play-btn').addEventListener('click', () => {
  const mmlText = document.getElementById('mml-input').value;
  document.getElementById('mml-play-btn').disabled = true;
  document.getElementById('mml-stop-btn').disabled = false;
  document.getElementById('mml-status').textContent = "Playing...";
  player.parseAndPlay(mmlText);
});

document.getElementById('mml-stop-btn').addEventListener('click', () => {
  player.stop();
});

document.querySelectorAll('.mml-sample-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    player.stop();
    const mmlData = e.target.getAttribute('data-mml');
    document.getElementById('mml-input').value = mmlData;
  });
});
