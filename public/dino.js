const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = 300;
  ctx.imageSmoothingEnabled = false;
}
window.addEventListener("resize", resize);
resize();

const urlParams = new URLSearchParams(window.location.search);

// ===== 画像 =====
const img = {};
const files = [
  "dino_assets/character_1.png",
  "dino_assets/character_2.png",
  "dino_assets/character_over.png",
  "dino_assets/obstacle_ground.png",
  "dino_assets/obstacle_air.png",
  "dino_assets/sun.png",
  "dino_assets/moon.png",
  "dino_assets/blue_moon.png",
  "dino_assets/clouds.png",
  "dino_assets/shaved_ice.png",
  "dino_assets/melon.png",
  "dino_assets/apple.png",
  "dino_assets/candy.png",
];

const ITEM_TYPES = [
  { name: "shaved_ice", weight: 0.1, score: 100, color: "#2196f3" }, // 10%
  { name: "melon",      weight: 0.2, score: 50,  color: "#4caf50" }, // 20%
  { name: "apple",      weight: 0.3, score: 30,  color: "#f44336" }, // 30%
  { name: "candy",      weight: 0.4, score: 10,  color: "#e91e63" }  // 40%
];


let loaded = 0;
let started = false;
let notCycle = urlParams.has('notCycle');
let noItem = urlParams.has('noItem');
let onlyGround = urlParams.has('onlyGround');

files.forEach((f) => {
  img[f] = new Image();
  const onSettled = () => {
    loaded++;
    if (loaded === files.length && !started) {
      started = true;
      start();
    }
  };
  img[f].onload = onSettled;
  img[f].onerror = onSettled;
  img[f].src = `/${f}`;
});

// ===== 状態 =====
let player, obstacles, clouds, celestial, items;
let frame = 0,
  gameOver = false;
let score = 0,
  highScore = 0;
let speed = 6;
let multiplier = 1;
let day = true,
  cycleCount = 0;

// 夜の暗さを管理（0 = 昼, 1 = 夜）
let nightAlpha = 0; 

// ===== 初期化 =====
function start() {
  highScore = Number(localStorage.getItem("dino_high") || 0);

  player = {
    x: 50,
    y: 185,
    vy: 0,
    jumping: false,
    diving: false,
    frame: 0,
    w: 64,
    h: 64,
  };

  obstacles = [];
  items = [];
  clouds = [{ x: 0 }, { x: 400 }];

  celestial = { x: canvas.width, type: "sun" };

  loop();
}

// ===== 入力 =====
function jump() {
  if (!player.jumping && !gameOver) {
    player.vy = -13;
    player.jumping = true;
    playTone(800, 0.08);
  }
  if (player.jumping) {

  }
  if (gameOver) {
    location.reload();
  }
}

function dive() {
  if (player.jumping && !gameOver) {
    player.vy += 1;
  }
}

window.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") jump();
  if (e.code === "ArrowDown") { player.diving = true; }
});

window.addEventListener('keyup', (e) => {
  if (e.code === "ArrowDown") { player.diving = false; }
});

// スマホのダブルタップズームを防止しつつジャンプ
window.addEventListener("touchstart", (e) => {
  if (e.cancelable) e.preventDefault();
  jump();
}, { passive: false });

// ===== 衝突判定（余白カット）=====
function hit(a, b) {
  const margin = 12;
  return (
    a.x + margin < b.x + b.w - margin &&
    a.x + a.w - margin > b.x + margin &&
    a.y + margin < b.y + b.h - margin &&
    a.y + a.h - margin > b.y + margin
  );
}

// ===== ループ =====
function loop() {
  if (player.diving) {
    dive();
  }
  
  frame++;
  update();
  draw();
  
  if (!gameOver) {
    requestAnimationFrame(loop);
  }
}

// ===== 更新 =====
function update() {
  if (gameOver) return;

  // スピード上昇
  speed += 0.001;

  // プレイヤー
  player.y += player.vy;
  player.vy += 0.6;

  if (player.y >= 182) {
    player.y = 182;
    player.vy = 0;
    player.jumping = false;
  }

  if (frame % 10 === 0) {
    if (!player.jumping) {
      player.frame = 1 - player.frame;
    }
  }

  if (frame % 250 === 0 && !noItem) {
    if (Math.random() < 0.5) {
      const rand = Math.random();
      let cumulativeWeight = 0;
      let selectedType = ITEM_TYPES[ITEM_TYPES.length - 1];

      for (const type of ITEM_TYPES) {
        cumulativeWeight += type.weight;
        if (rand < cumulativeWeight) {
          selectedType = type;
          break;
        }
      }

      items.push({
        x: canvas.width,
        y: 65,
        w: 48,
        h: 48,
        type: selectedType.name,
        scoreValue: selectedType.score,
        color: selectedType.color,
        collected: false
      });
    }
  }

  let frequency = 70;
  if(score >= 1500) { frequency = 40; }
  else if(score >= 1200) { frequency = 45; }
  else if(score >= 800) { frequency = 50; }
  else if(score >= 500) { frequency = 60; }
  
  if (frame % frequency === 0) {
    if (!onlyGround){
      const isGround = Math.random() < 0.5;
      obstacles.push({
        x: canvas.width,
        y: isGround ? 185 : 100,
        type: isGround ? "ground" : "air",
        w: 64,
        h: 64,
      });
    } else {
      obstacles.push({
        x: canvas.width,
        y: 185,
        type: "hurdle",
        w: 64,
        h: 64,
      });
    }
  }

  // 障害物の移動と削除
  obstacles.forEach((o) => (o.x -= speed));
  obstacles = obstacles.filter((o) => o.x > -50);

  items.forEach((i) => (i.x -= speed));
  items = items.filter((i) => i.x > -50);

  // 衝突（障害物）
  obstacles.forEach((o) => {
    if (hit(player, o)) {
      gameOver = true;
      if (score > highScore) {
        highScore = Math.floor(score);
        localStorage.setItem("dino_high", highScore);
      }
      draw();
    }
  });

  items.forEach((i) => {
    if (!i.collected && hit(player, i)) {
      score += i.scoreValue;
      i.collected = true;
      playTone(1000, 0.05, 0);
      playTone(1300, 0.08, 0.06);
    }
  });
  items = items.filter((i) => i.x > -50 && !i.collected);

  // 雲
  clouds.forEach((c) => {
    c.x -= 6 * 0.3;
    if (c.x < -300) c.x = canvas.width;
  });

  // 太陽/月
  celestial.x -= 6 * 0.25;
  if (celestial.x < -100) {
    celestial.x = canvas.width;
    if(!notCycle) {
      day = !day;
    }
    cycleCount++;

    if (!day) {
      if ((cycleCount + 1) % 10 === 0) {
        celestial.type = "blue_moon";
        multiplier = 2.0;
      } else {
        celestial.type = "moon";
        multiplier = 1;
      }
    } else {
      celestial.type = "sun";
      multiplier = 1;
    }
  }

  // 昼夜のフェード処理
  if (!day && nightAlpha < 1) {
    nightAlpha = Math.min(1, nightAlpha + 0.02);
  } else if (day && nightAlpha > 0) {
    nightAlpha = Math.max(0, nightAlpha - 0.02);
  }

  // スコア
  score += 0.1 * multiplier;
}

// ===== 描画 =====
function draw() {
  const bgVal = Math.floor(255 * (1 - nightAlpha));
  ctx.fillStyle = `rgb(${bgVal}, ${bgVal}, ${bgVal})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();

  // 雲
  clouds.forEach((c) => {
    drawSprite("dino_assets/clouds.png", c.x, 50, 300, 100, () => {
      ctx.fillStyle = day ? "#d8ecff" : "#444";
      ctx.beginPath();
      ctx.ellipse(c.x + 150, 90, 120, 24, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  });

  // 太陽/月
  let cel = "dino_assets/sun.png";
  if (!day) {
    cel = celestial.type === "blue_moon" ? "dino_assets/blue_moon.png" : "dino_assets/moon.png";
  }
  drawSprite(cel, celestial.x, 30, 80, 80, () => {
    ctx.fillStyle = celestial.type === "sun" ? "#ffd34d" : "#e6e9ff";
    ctx.beginPath();
    ctx.arc(celestial.x + 40, 70, 32, 0, Math.PI * 2);
    ctx.fill();
  });

  // 地面
  ctx.fillStyle = "#888";
  ctx.fillRect(0, 240, canvas.width, 5);

  // プレイヤー
  drawSprite(
    gameOver ? "dino_assets/character_over.png" : `dino_assets/character_${player.frame + 1}.png`,
    player.x, player.y, player.w, player.h,
    () => drawFallbackPlayer(),
  );

  // 障害物
  obstacles.forEach((o) => {
    let name = o.type === "ground" ? "dino_assets/obstacle_ground.png"
      : o.type === "hurdle" ? "dino_assets/obstacle_ground.png"
      : "dino_assets/obstacle_air.png";
    drawSprite(name, o.x, o.y, o.w, o.h, () => {
      ctx.fillStyle = "#3d8b4f";
      if (o.type === "ground" || o.type === "hurdle") {
        ctx.fillRect(o.x + 12, o.y, 16, o.h);
        ctx.fillRect(o.x + 2, o.y + 12, 12, 8);
        ctx.fillRect(o.x + 26, o.y + 20, 12, 8);
      } else {
        ctx.beginPath();
        ctx.moveTo(o.x, o.y + 20);
        ctx.lineTo(o.x + 20, o.y + 8);
        ctx.lineTo(o.x + 40, o.y + 20);
        ctx.lineTo(o.x + 20, o.y + 16);
        ctx.fill();
      }
    });
  });

  items.forEach((i) => {
    const imgName = `dino_assets/${i.type}.png`;
    drawSprite(imgName, i.x, i.y, i.w, i.h, () => {
      ctx.fillStyle = i.color;
      ctx.fillRect(i.x, i.y, i.w, i.h);
      ctx.fillStyle = "#fff";
      ctx.font = "10px sans-serif";
      ctx.fillText(i.type.toUpperCase(), i.x + 2, i.y + 18);
    });
  });

  if (nightAlpha > 0) {
    ctx.save();
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillStyle = `rgba(0, 0, 0, ${nightAlpha * 0.30})`; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  ctx.restore();

  // UI
  const textVal = Math.floor(255 * nightAlpha);
  ctx.fillStyle = `rgb(${textVal}, ${textVal}, ${textVal})`;
  ctx.font = "20px sans-serif";
  ctx.fillText("Score: " + Math.floor(score), 20, 30);
  ctx.fillText("High: " + highScore, 20, 60);

  if (multiplier > 1) {
    ctx.fillText("x2 BONUS!", 20, 90);
  }

  if (gameOver) {
    playTone(150, 0.15);
    ctx.fillStyle = "red";
    ctx.font = `${Math.min(40, canvas.width / 8)}px sans-serif`;
    const gameOverText = "GAME OVER";
    ctx.fillText(
      gameOverText,
      (canvas.width - ctx.measureText(gameOverText).width) / 2,
      150,
    );
    ctx.font = `${Math.min(20, canvas.width / 12)}px sans-serif`;
    const restartText = "Tap or SPACE to restart";
    ctx.fillText(
      restartText,
      (canvas.width - ctx.measureText(restartText).width) / 2,
      180,
    );
  }
}

function drawSprite(name, x, y, width, height, fallback) {
  const sprite = img[name];
  if (sprite?.complete && sprite.naturalWidth > 0) {
    ctx.drawImage(sprite, x, y, width, height);
    return;
  }
  fallback();
}

function drawFallbackPlayer() {
  ctx.fillStyle = gameOver ? "#c44" : "#4b6cb7";
  ctx.fillRect(player.x + 4, player.y + 8, 30, 25);
  ctx.fillRect(player.x + 20, player.y, 18, 18);
  ctx.fillStyle = "#fff";
  ctx.fillRect(player.x + 30, player.y + 5, 4, 4);
  ctx.fillStyle = "#252525";
  ctx.fillRect(player.x + 8, player.y + 31, 8, 9);
  ctx.fillRect(player.x + 25, player.y + 31, 8, 9);
}

let audioCtx = null;
function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}
function playTone(frequency, duration, startTimeOffset = 0) {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.type = 'square'; 
    oscillator.frequency.value = frequency;
    const now = ctx.currentTime + startTimeOffset;
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + duration);
}
