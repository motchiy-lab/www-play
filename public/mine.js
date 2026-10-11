const presets = {
  easy: [9, 9, 10],
  normal: [16, 16, 40],
  hard: [30, 16, 99],
  extreme: [40, 25, 250],
  lunatic: [80, 40, 1200],
};

const AUTHOR_TWITTER_URL = "https://twitter.com/leoved_kuru";
const mineImg = "mine_assets/mine.png";
const flagImg = "mine_assets/flag.png";

const els = {
  preset: document.getElementById("preset"),
  width: document.getElementById("width"),
  height: document.getElementById("height"),
  mines: document.getElementById("mines"),
  applyPresetBtn: document.getElementById("applyPresetBtn"),
  startBtn: document.getElementById("startBtn"),
  timer: document.getElementById("timer"),
  mineCount: document.getElementById("mineCount"),
  scoreDisplay: document.getElementById("scoreDisplay"),
  board: document.getElementById("board"),
  overlay: document.getElementById("overlay"),
  resultTitle: document.getElementById("resultTitle"),
  resultText: document.getElementById("resultText"),
  retryBtn: document.getElementById("retryBtn"),
  shareBtn: document.getElementById("shareBtn"),
  authorBtn: document.getElementById("authorBtn"),
};

let board = [];
let width = 9;
let height = 9;
let mines = 10;
let flagsPlaced = 0;
let firstClick = true;
let gameEnded = false;
let timer = 0;
let timerId = null;
let cellSize = 24;
let openedSafeCells = 0;
let totalSafeCells = 0;
let lastScore = 0;
let lastClearTime = 0;

function applyPreset() {
  const p = presets[els.preset.value];
  els.width.value = p[0];
  els.height.value = p[1];
  els.mines.value = p[2];
}

function clampSettings() {
  width = Math.max(2, parseInt(els.width.value || "9", 10));
  height = Math.max(2, parseInt(els.height.value || "9", 10));
  mines = Math.max(1, parseInt(els.mines.value || "10", 10));

  const maxMines = width * height - 1;
  if (mines > maxMines) mines = maxMines;

  els.width.value = width;
  els.height.value = height;
  els.mines.value = mines;
}

function calcCellSize() {
  const shell = document.querySelector(".board-shell");
  const hud = document.querySelector(".hud");
  const controls = document.querySelector(".controls");
  const note = document.querySelector(".muted");

  const availableW = Math.max(180, window.innerWidth - 24);
  const usedH =
    document.querySelector("h1").offsetHeight +
    controls.offsetHeight +
    hud.offsetHeight +
    note.offsetHeight +
    72;

  const availableH = Math.max(180, window.innerHeight - usedH);
  const size = Math.floor(Math.min(availableW / width, availableH / height));
  cellSize = Math.max(8, Math.min(32, size));
  if (shell) shell.style.maxWidth = `${availableW}px`;
}

function updateHud() {
  els.timer.textContent = String(timer);
  els.mineCount.textContent = String(Math.max(0, mines - flagsPlaced));
  els.scoreDisplay.textContent = String(lastScore);
}

function startTimer() {
  clearInterval(timerId);
  timer = 0;
  els.timer.textContent = "0";
  timerId = setInterval(() => {
    if (gameEnded) return;
    timer++;
    els.timer.textContent = String(timer);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
}

function createBoard() {
  clampSettings();
  calcCellSize();

  board = [];
  flagsPlaced = 0;
  firstClick = true;
  gameEnded = false;
  timer = 0;
  lastScore = 0;
  lastClearTime = 0;
  openedSafeCells = 0;
  totalSafeCells = width * height - mines;

  els.overlay.classList.remove("show");
  els.overlay.setAttribute("aria-hidden", "true");
  els.resultTitle.textContent = "";
  els.resultText.textContent = "";

  els.board.innerHTML = "";
  els.board.style.gridTemplateColumns = `repeat(${width}, ${cellSize}px)`;
  els.board.style.gap = "0px";

  for (let y = 0; y < height; y++) {
    board[y] = [];
    for (let x = 0; x < width; x++) {
      const cellEl = document.createElement("div");
      cellEl.className = "cell";
      cellEl.style.width = `${cellSize}px`;
      cellEl.style.height = `${cellSize}px`;
      cellEl.style.fontSize = `${Math.max(8, Math.floor(cellSize * 0.58))}px`;

      const cell = {
        mine: false,
        open: false,
        flag: false,
        count: 0,
        el: cellEl,
      };
      board[y][x] = cell;

      let longPressTimer = null;
      let longPressTriggered = false;

      cellEl.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        toggleFlag(x, y);
      });

      cellEl.addEventListener("pointerdown", () => {
        if (gameEnded) return;
        longPressTriggered = false;
        clearTimeout(longPressTimer);
        longPressTimer = setTimeout(() => {
          if (gameEnded) return;
          longPressTriggered = true;
          toggleFlag(x, y);
        }, 380);
      });

      const cancelPress = () => {
        clearTimeout(longPressTimer);
      };

      cellEl.addEventListener("pointerup", cancelPress);
      cellEl.addEventListener("pointerleave", cancelPress);
      cellEl.addEventListener("pointercancel", cancelPress);

      cellEl.addEventListener("click", () => {
        if (gameEnded) return;
        if (longPressTriggered) {
          longPressTriggered = false;
          return;
        }
        openCell(x, y);
      });

      els.board.appendChild(cellEl);
    }
  }

  updateHud();
}

function placeMines(safeX, safeY) {
  let placed = 0;
  while (placed < mines) {
    const x = (Math.random() * width) | 0;
    const y = (Math.random() * height) | 0;
    if ((x === safeX && y === safeY) || board[y][x].mine) continue;
    board[y][x].mine = true;
    placed++;
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (board[y][x].mine) continue;

      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          if (board[y + dy]?.[x + dx]?.mine) count++;
        }
      }
      board[y][x].count = count;
    }
  }
}

function openCell(x, y) {
  if (gameEnded) return;
  const cell = board[y]?.[x];
  if (!cell || cell.open || cell.flag) return;

  if (firstClick) {
    placeMines(x, y);
    startTimer();
    firstClick = false;
  }

  cell.open = true;
  cell.el.classList.add("open");

  if (cell.mine) {
    cell.el.classList.add("mine");
    cell.el.innerHTML = `<img src="${mineImg}" alt="地雷">`;
    loseGame();
    return;
  }

  openedSafeCells++;
  if (cell.count > 0) {
    cell.el.textContent = String(cell.count);
  } else {
    floodOpen(x, y);
  }

  if (openedSafeCells >= totalSafeCells) {
    winGame();
    return;
  }
}

function floodOpen(startX, startY) {
  const queue = [[startX, startY]];
  const seen = new Set([`${startX},${startY}`]);

  while (queue.length) {
    const [x, y] = queue.shift();
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        const key = `${nx},${ny}`;
        const cell = board[ny]?.[nx];
        if (!cell || seen.has(key) || cell.open || cell.flag || cell.mine)
          continue;

        seen.add(key);
        cell.open = true;
        cell.el.classList.add("open");
        openedSafeCells++;

        if (cell.count > 0) {
          cell.el.textContent = String(cell.count);
        } else {
          queue.push([nx, ny]);
        }

        if (openedSafeCells >= totalSafeCells) return;
      }
    }
  }
}

function toggleFlag(x, y) {
  if (gameEnded) return;
  const cell = board[y]?.[x];
  if (!cell || cell.open) return;

  cell.flag = !cell.flag;
  if (cell.flag) {
    cell.el.classList.add("flagged");
    cell.el.innerHTML = `<img src="${flagImg}" alt="旗">`;
    flagsPlaced++;
  } else {
    cell.el.classList.remove("flagged");
    cell.el.innerHTML = "";
    flagsPlaced--;
  }
  updateHud();
}

function revealAllMines() {
  for (const row of board) {
    for (const cell of row) {
      if (cell.mine) {
        cell.el.classList.add("mine", "open");
        cell.el.innerHTML = `<img src="${mineImg}" alt="地雷">`;
      }
    }
  }
}

function computeScore() {
  const area = width * height;
  const density = mines / area;
  const timeFactor = Math.max(1, lastClearTime);
  const raw = ((area * mines * (1 + density)) / timeFactor) * 10;
  return Math.max(1, Math.floor(raw));
}

function showResult(isWin) {
  const pageUrl = location.href.split("#")[0];

  els.overlay.classList.add("show");
  els.overlay.setAttribute("aria-hidden", "false");

  if (isWin) {
    lastScore = computeScore();
    els.scoreDisplay.textContent = String(lastScore);
    els.resultTitle.textContent = "🎉 クリア！";
    els.resultText.innerHTML =
      `タイム: ${lastClearTime} 秒\n` +
      `面積: ${width} × ${height} = ${width * height}\n` +
      `地雷数: ${mines}\n\n` +
      `スコア: <span class="score">${lastScore}</span>`;

    els.shareBtn.style.display = "";
    els.shareBtn.onclick = () => {
      const text = `わーい！Play on Heikiのマインスイーパーをクリアしたよ！スコア：${lastScore}！${pageUrl} #マインスイーパー #PlayOnHeiki`;
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
      window.open(tweetUrl, "_blank", "noopener,noreferrer");
    };
  } else {
    els.resultTitle.textContent = "💥 ゲームオーバー";
    els.resultText.innerHTML =
      `タイム: ${timer} 秒\n` +
      `面積: ${width} × ${height} = ${width * height}\n` +
      `地雷数: ${mines}`;

    els.shareBtn.style.display = "none";
  }

  els.retryBtn.onclick = () => startGame();
  els.authorBtn.onclick = () =>
    window.open(AUTHOR_TWITTER_URL, "_blank", "noopener,noreferrer");
}

function winGame() {
  if (gameEnded) return;
  gameEnded = true;
  stopTimer();
  lastClearTime = timer;
  lastScore = computeScore();
  updateHud();
  showResult(true);
}

function loseGame() {
  if (gameEnded) return;
  gameEnded = true;
  stopTimer();
  revealAllMines();
  showResult(false);
}

function startGame() {
  stopTimer();
  createBoard();
}

els.applyPresetBtn.addEventListener("click", applyPreset);
els.startBtn.addEventListener("click", startGame);
els.retryBtn.addEventListener("click", startGame);

window.addEventListener("resize", () => {
  if (!board.length) return;
  calcCellSize();
  els.board.style.gridTemplateColumns = `repeat(${width}, ${cellSize}px)`;
  for (const row of board) {
    for (const cell of row) {
      cell.el.style.width = `${cellSize}px`;
      cell.el.style.height = `${cellSize}px`;
      cell.el.style.fontSize = `${Math.max(8, Math.floor(cellSize * 0.58))}px`;
    }
  }
});

applyPreset();
startGame();
