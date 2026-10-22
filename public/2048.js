let board;
let score = 0;
let highScore = 0;
let gameOver = false;
let moveInProgress = false;
let activeTileElements = {};
let nextTileId = 0;

let baseTileValue = 2;

let TILE_SIZE = 100;
const GRID_SIZE = 4;

const TILE_IMAGE_VALUES = [
  2, 4, 8, 16, 32, 64, 128, 256, 512, 1024,
];

// 画像オブジェクトを保持して、初期化と並行して読み込む
const tileImageCache = new Map();

function preloadTileImages() {
  for (const value of TILE_IMAGE_VALUES) {
    if (tileImageCache.has(value)) continue;

    const img = new Image();
    img.src = `/2048_assets/${value}.png`;
    tileImageCache.set(value, img);
  }
}

// JS実行開始直後に画像の取得を開始する。
// 読み込み完了は待たない。
preloadTileImages();

// DOMが利用可能になった時点でゲームを初期化する
function initGame() {
  const boardElement = document.getElementById("game-board");

  if (!boardElement) {
    console.error("2048: #game-board が見つかりません。");
    return;
  }

  if (
    !document.getElementById("score") ||
    !document.getElementById("high-score") ||
    !document.getElementById("game-over-overlay") ||
    !document.getElementById("final-score")
  ) {
    console.error("2048: ゲームに必要なHTML要素が不足しています。");
    return;
  }

  // 初期化後にイベントを登録する
  window.addEventListener("resize", resizeBoard);
  document.addEventListener("keydown", handleKeydown);

  boardElement.addEventListener("pointerdown", handlePointerDown);
  boardElement.addEventListener("pointerup", handlePointerUp);
  boardElement.addEventListener("pointercancel", handlePointerCancel);

  setGame();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGame, {
    once: true,
  });
} else {
  initGame();
}

function setGame() {
  board = Array.from(
    { length: GRID_SIZE },
    () => Array(GRID_SIZE).fill(null),
  );

  score = 0;
  gameOver = false;
  moveInProgress = false;

  document.getElementById("score").innerText = score;

  const storedHighScore = localStorage.getItem("2048HighScore");
  highScore = storedHighScore ? parseInt(storedHighScore, 10) || 0 : 0;
  document.getElementById("high-score").innerText = highScore;

  const boardElement = document.getElementById("game-board");
  boardElement.innerHTML = "";

  activeTileElements = {};
  nextTileId = 0;

  // サイズを計算してから背景セルを生成する
  resizeBoard();

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const cell = document.createElement("div");

      cell.id = `grid-cell-${r}-${c}`;
      cell.className = "grid-background-cell";
      cell.dataset.r = r;
      cell.dataset.c = c;

      Object.assign(cell.style, {
        position: "absolute",
        left: `${c * TILE_SIZE}px`,
        top: `${r * TILE_SIZE}px`,
        width: `${TILE_SIZE}px`,
        height: `${TILE_SIZE}px`,
        border: "1px solid #ccc",
        boxSizing: "border-box",
        backgroundColor: "#eee",
      });

      boardElement.appendChild(cell);
    }
  }

  document.getElementById("game-over-overlay").style.display = "none";

  addRandomTile();
  addRandomTile();
  updateBoard();
}

function resizeBoard() {
  const boardElement = document.getElementById("game-board");
  if (!boardElement) return;

  const nextTileSize = boardElement.clientWidth / GRID_SIZE;
  if (!nextTileSize) return;

  TILE_SIZE = nextTileSize;

  boardElement.style.gridTemplateColumns =
    `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`;
  boardElement.style.gridTemplateRows =
    `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`;

  for (const cell of boardElement.children) {
    const row = Number(cell.dataset.r);
    const column = Number(cell.dataset.c);

    cell.style.width = `${TILE_SIZE}px`;
    cell.style.height = `${TILE_SIZE}px`;
    cell.style.left = `${column * TILE_SIZE}px`;
    cell.style.top = `${row * TILE_SIZE}px`;

    if (cell.classList.contains("game-tile")) {
      cell.style.fontSize = `${Math.max(8, TILE_SIZE * 0.48)}px`;
    }
  }
}

function newGame() {
  setGame();
}

function updateBoard() {
  const boardElement = document.getElementById("game-board");

  const oldActiveTileElements = { ...activeTileElements };
  activeTileElements = {};

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const tile = board[r][c];
      if (!tile) continue;

      const tileId = tile.id;
      const tileValue = tile.value;
      let tileElement = oldActiveTileElements[tileId];

      if (tileElement) {
        activeTileElements[tileId] = tileElement;

        tileElement.style.left = `${c * TILE_SIZE}px`;
        tileElement.style.top = `${r * TILE_SIZE}px`;

        const img = tileElement.querySelector("img");

        if (Number(tileElement.dataset.value) !== tileValue) {
          tileElement.querySelector(".game-tile__value")?.remove();
          img.hidden = false;
          img.src = `/2048_assets/${tileValue}.png`;
          img.alt = `Tile ${tileValue}`;
          img.dataset.value = tileValue;
        
          // 一瞬だけ縮めて、素早く弾ませる
          tileElement.style.transition = "none";
          tileElement.style.transform = "scale(0.88)";
          
          // 縮小状態を即座に確定させる
          tileElement.getBoundingClientRect();
          
          requestAnimationFrame(() => {
            tileElement.style.transition =
              "transform 100ms cubic-bezier(0.2, 1.3, 0.4, 1)";
            tileElement.style.transform = "scale(1.1)";
          
            setTimeout(() => {
              tileElement.style.transition = "transform 50ms ease-out";
              tileElement.style.transform = "scale(1)";
            }, 100);
          });
        }

        tileElement.dataset.r = r;
        tileElement.dataset.c = c;
        tileElement.dataset.value = tileValue;
      } else {
        tileElement = document.createElement("div");
        tileElement.id = tileId;
        tileElement.className = "game-tile";

        Object.assign(tileElement.style, {
          position: "absolute",
          width: `${TILE_SIZE}px`,
          height: `${TILE_SIZE}px`,
          left: `${c * TILE_SIZE}px`,
          top: `${r * TILE_SIZE}px`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: `${Math.max(8, TILE_SIZE * 0.48)}px`,
          fontWeight: "bold",
          backgroundColor: "#ccc",
          borderRadius: "5px",
        });

        tileElement.dataset.r = r;
        tileElement.dataset.c = c;
        tileElement.dataset.value = tileValue;

        const img = document.createElement("img");
        img.src = `/2048_assets/${tileValue}.png`;
        img.alt = `Tile ${tileValue}`;
        img.style.width = "100%";
        img.style.height = "100%";
        img.dataset.value = tileValue;
        img.addEventListener("error", () => {
          showTileFallback(img, tileElement);
        });

        tileElement.appendChild(img);
        // アニメーション開始状態を、DOMに追加する前に設定する
        tileElement.style.transform = "scale(0.65)";
        tileElement.style.opacity = "0";
        tileElement.style.transition = "none";
        
        boardElement.appendChild(tileElement);
        activeTileElements[tileId] = tileElement;
        
        // 初期状態をブラウザに反映してから、アニメーションを開始
        tileElement.getBoundingClientRect();
        
        requestAnimationFrame(() => {
          tileElement.style.transition =
            "transform 120ms cubic-bezier(0.2, 1.3, 0.4, 1), opacity 90ms ease-out";
          tileElement.style.transform = "scale(1)";
          tileElement.style.opacity = "1";
        });
      }
    }
  }

  for (const tileId in oldActiveTileElements) {
    if (!activeTileElements[tileId]) {
      oldActiveTileElements[tileId]?.remove();
    }
  }

  document.getElementById("score").innerText = score;

  if (gameOver) {
    document.getElementById("final-score").innerText = score;
    document.getElementById("game-over-overlay").style.display = "flex";

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("2048HighScore", String(highScore));
      document.getElementById("high-score").innerText = highScore;
    }
  }
}

function showTileFallback(image, tileElement) {
  image.hidden = true;

  let label = tileElement.querySelector(".game-tile__value");

  if (!label) {
    label = document.createElement("span");
    label.className = "game-tile__value";
    tileElement.appendChild(label);
  }

  label.textContent = tileElement.dataset.value;

  tileElement.style.backgroundColor =
    `hsl(${(Math.log2(Number(tileElement.dataset.value)) * 34) % 360} 55% 42%)`;
}

function addRandomTile() {
  const emptyCells = [];

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (board[r][c] === null) {
        emptyCells.push({ r, c });
      }
    }
  }

  if (emptyCells.length === 0) return;

  const { r, c } = emptyCells[
    Math.floor(Math.random() * emptyCells.length)
  ];

  const value = baseTileValue * (Math.random() < 0.9 ? 1 : 2);

  board[r][c] = {
    value,
    id: `tile-${nextTileId++}`,
  };
}

function createTile(value) {
  return { value, id: `tile-${nextTileId++}` };
}

function debugAddTile(row, col, value) {
  if (
    !Number.isInteger(row) ||
    !Number.isInteger(col) ||
    row < 0 ||
    row >= GRID_SIZE ||
    col < 0 ||
    col >= GRID_SIZE
  ) {
    console.error("行・列は0～3の整数で指定してください :(");
    return false;
  }

  if (value == 114514) {
    console.error("お前やりますねスギ！");
    return false;
  }
  
  if (!Number.isSafeInteger(value) || value < 2) {
    console.error("タイルの値は2以上の安全な整数で指定してください :(");
    return false;
  }

  if (board[row][col] !== null) {
    console.error("指定した位置には既にタイルがあります :(");
    return false;
  }
  board[row][col] = createTile(value);
  gameOver = checkGameOver();
  updateBoard();

  return true;
}

/**
 * 指定された行・列をスライド・合体させる。
 */
function slide(row, fixedIndex, direction) {
  const originalPositions = new Map();

  row.forEach((tile, index) => {
    if (!tile) return;

    if (direction === "left" || direction === "right") {
      originalPositions.set(tile.id, { r: fixedIndex, c: index });
    } else {
      originalPositions.set(tile.id, { r: index, c: fixedIndex });
    }
  });

  const tempBoardForSlide = row.filter((tile) => tile !== null);
  const changes = [];

  for (let i = 0; i < tempBoardForSlide.length - 1; i++) {
    if (tempBoardForSlide[i].value === tempBoardForSlide[i + 1].value) {
      const sourceTile = tempBoardForSlide[i + 1];
      const targetTileId = tempBoardForSlide[i].id;

      tempBoardForSlide[i].value *= 2;
      score += tempBoardForSlide[i].value;
      tempBoardForSlide.splice(i + 1, 1);

      changes.push({
        id: sourceTile.id,
        from: originalPositions.get(sourceTile.id),
        to: targetTileId,
        type: "mergeSource",
      });

      i++;
    }
  }

  while (tempBoardForSlide.length < GRID_SIZE) {
    tempBoardForSlide.push(null);
  }

  originalPositions.forEach((oldPos, tileId) => {
    const currentTile = tempBoardForSlide.find(
      (tile) => tile && tile.id === tileId,
    );

    if (!currentTile) return;

    const newIndex = tempBoardForSlide.indexOf(currentTile);
    const newPos =
      direction === "left" || direction === "right"
        ? { r: fixedIndex, c: newIndex }
        : { r: newIndex, c: fixedIndex };

    if (oldPos.r !== newPos.r || oldPos.c !== newPos.c) {
      changes.push({
        id: tileId,
        from: oldPos,
        to: newPos,
        type: "move",
      });
    }
  });

  return { newRow: tempBoardForSlide, changes };
}

async function handleKeydown(e) {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
    e.preventDefault();
  }

  if (gameOver || moveInProgress) return;

  const directions = {
    ArrowLeft: "left",
    ArrowRight: "right",
    ArrowUp: "up",
    ArrowDown: "down",
    a: "left",
    d: "right",
    w: "up",
    s: "down",
  };

  const direction = directions[e.key];
  if (!direction) return;

  const oldActiveTileElementsMap = new Map();

  for (const tileId in activeTileElements) {
    const element = activeTileElements[tileId];

    oldActiveTileElementsMap.set(tileId, {
      element,
      r: Number(element.dataset.r),
      c: Number(element.dataset.c),
      value: Number(element.dataset.value),
    });
  }

  const allChanges = [];
  let hasMoved = false;

  switch (direction) {
    case "left":
      hasMoved = moveLeft(allChanges);
      break;
    case "right":
      hasMoved = moveRight(allChanges);
      break;
    case "up":
      hasMoved = moveUp(allChanges);
      break;
    case "down":
      hasMoved = moveDown(allChanges);
      break;
  }

  if (!hasMoved) return;

  moveInProgress = true;

  try {
    await animateMovesAndMerges(oldActiveTileElementsMap, allChanges);

    addRandomTile();
    gameOver = checkGameOver();
    updateBoard();
  } finally {
    moveInProgress = false;
  }
}

let swipeStart = null;

function handlePointerDown(event) {
  if (event.pointerType === "touch") {
    swipeStart = { x: event.clientX, y: event.clientY };
  }
}

function handlePointerUp(event) {
  if (!swipeStart || event.pointerType !== "touch") return;

  const deltaX = event.clientX - swipeStart.x;
  const deltaY = event.clientY - swipeStart.y;
  swipeStart = null;

  if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 24) return;

  let key;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    key = deltaX > 0 ? "ArrowRight" : "ArrowLeft";
  } else {
    key = deltaY > 0 ? "ArrowDown" : "ArrowUp";
  }

  document.dispatchEvent(new KeyboardEvent("keydown", { key, code: key }));
}

function handlePointerCancel() {
  swipeStart = null;
}

async function animateMovesAndMerges(oldActiveTileElementsMap, changes) {
  const animationPromises = [];
  const ANIMATION_DURATION = 140;

  const newBoardStateById = new Map();

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const tile = board[r][c];

      if (tile) {
        newBoardStateById.set(tile.id, {
          value: tile.value,
          r,
          c,
        });
      }
    }
  }

  changes
    .filter((change) => change.type === "mergeSource")
    .forEach((change) => {
      const element = oldActiveTileElementsMap.get(change.id)?.element;
      if (!element || !change.from) return;

      const target = newBoardStateById.get(change.to);
      if (!target) {
        element.remove();
        return;
      }
      element.style.transition =
        `left ${ANIMATION_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1),
         top ${ANIMATION_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1),
         opacity ${ANIMATION_DURATION}ms ease-out,
         transform ${ANIMATION_DURATION}ms ease-out`;
      
      element.style.left = `${target.c * TILE_SIZE}px`;
      element.style.top = `${target.r * TILE_SIZE}px`;
      element.style.opacity = "0";
      element.style.transform = "scale(0.85)";

      animationPromises.push(
        new Promise((resolve) => {
          const cleanup = () => {
            element.removeEventListener("transitionend", onEnd);
            element.remove();
            resolve();
          };

          const onEnd = (event) => {
            if (event.target === element && event.propertyName === "opacity") {
              cleanup();
            }
          };

          element.addEventListener("transitionend", onEnd);
          // transitionend が発火しない場合も処理を完了させる
          setTimeout(cleanup, ANIMATION_DURATION + 50);
        }),
      );
    });

  changes
    .filter((change) => change.type === "move")
    .forEach((change) => {
      const element = oldActiveTileElementsMap.get(change.id)?.element;
      if (!element || !change.to) return;

      element.style.transition =
        `left ${ANIMATION_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1),
         top ${ANIMATION_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`;
      
      element.style.left = `${change.to.c * TILE_SIZE}px`;
      element.style.top = `${change.to.r * TILE_SIZE}px`;

      animationPromises.push(
        new Promise((resolve) => {
          let done = false;

          const cleanup = () => {
            if (done) return;
            done = true;
            element.removeEventListener("transitionend", onEnd);
            clearTimeout(fallbackTimer);
            resolve();
          };

          const onEnd = (event) => {
            if (
              event.target === element &&
              (event.propertyName === "left" ||
                event.propertyName === "top")
            ) {
              cleanup();
            }
          };

          element.addEventListener("transitionend", onEnd);

          const fallbackTimer = setTimeout(
            cleanup,
            ANIMATION_DURATION + 50,
          );
        }),
      );
    });

  await Promise.all(animationPromises);
}

function moveLeft(allChanges) {
  let moved = false;

  for (let r = 0; r < GRID_SIZE; r++) {
    const originalRow = board[r].map((tile) =>
      tile ? { ...tile } : null,
    );

    const { newRow, changes } = slide(board[r], r, "left");
    board[r] = newRow;

    if (JSON.stringify(originalRow) !== JSON.stringify(newRow)) {
      moved = true;
      allChanges.push(...changes);
    }
  }

  return moved;
}

function moveRight(allChanges) {
  let moved = false;

  for (let r = 0; r < GRID_SIZE; r++) {
    const originalRow = board[r].map((tile) =>
      tile ? { ...tile } : null,
    );

    const rowForSlide = [...board[r]].reverse();
    const { newRow, changes } = slide(rowForSlide, r, "right");
    newRow.reverse();

    changes.forEach((change) => {
      if (change.from) {
        change.from.c = GRID_SIZE - 1 - change.from.c;
      }

      if (change.to && typeof change.to === "object") {
        change.to.c = GRID_SIZE - 1 - change.to.c;
      }

      allChanges.push(change);
    });

    board[r] = newRow;

    if (JSON.stringify(originalRow) !== JSON.stringify(newRow)) {
      moved = true;
    }
  }

  return moved;
}

function moveUp(allChanges) {
  let moved = false;

  for (let c = 0; c < GRID_SIZE; c++) {
    const originalCol = board.map((row) =>
      row[c] ? { ...row[c] } : null,
    );

    const colTiles = board.map((row) => row[c]);
    const { newRow: newCol, changes } = slide(colTiles, c, "up");

    for (let r = 0; r < GRID_SIZE; r++) {
      board[r][c] = newCol[r];
    }

    if (JSON.stringify(originalCol) !== JSON.stringify(newCol)) {
      moved = true;
      allChanges.push(...changes);
    }
  }

  return moved;
}

function moveDown(allChanges) {
  let moved = false;

  for (let c = 0; c < GRID_SIZE; c++) {
    const originalCol = board.map((row) =>
      row[c] ? { ...row[c] } : null,
    );

    const colTiles = board.map((row) => row[c]).reverse();
    const { newRow: newCol, changes } = slide(colTiles, c, "down");

    newCol.reverse();

    for (let r = 0; r < GRID_SIZE; r++) {
      board[r][c] = newCol[r];
    }

    if (JSON.stringify(originalCol) !== JSON.stringify(newCol)) {
      moved = true;

      changes.forEach((change) => {
        if (change.from) {
          change.from.r = GRID_SIZE - 1 - change.from.r;
        }

        if (change.to && typeof change.to === "object") {
          change.to.r = GRID_SIZE - 1 - change.to.r;
        }

        allChanges.push(change);
      });
    }
  }

  return moved;
}

function isBoardFull() {
  return board.every((row) => row.every((tile) => tile !== null));
}

function checkGameOver() {
  if (!isBoardFull()) return false;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const current = board[r][c];

      if (
        c < GRID_SIZE - 1 &&
        current.value === board[r][c + 1].value
      ) {
        return false;
      }

      if (
        r < GRID_SIZE - 1 &&
        current.value === board[r + 1][c].value
      ) {
        return false;
      }
    }
  }

  return true;
}

function demonstrationGod() {
  const values = [
    131072, 65536, 32768, 16384,
    512, 1024, 2048, 4096,
    256, 128, 64, 32,
    2, 4, 8, 16
  ];

  let index = 0;

  for (let row = 0; row < GRID_SIZE; row++) {
    // 偶数行は左→右、奇数行は右→左
    for (let i = 0; i < GRID_SIZE; i++) {
      const col = row % 2 === 0
        ? i
        : GRID_SIZE - 1 - i;

      board[row][col] = createTile(values[index++]);
    }
  }

  gameOver = checkGameOver();
  updateBoard();
}

window.demonstrationGod = demonstrationGod;
window.addTile = debugAddTile;
