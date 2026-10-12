const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = 300;
}
window.addEventListener("resize", resize);
resize();

// ===== 画像 =====
const img = {};
const files = [
  "run_assets/character_1.png",
  "run_assets/character_2.png",
  "run_assets/character_over.png",
  "run_assets/obstacle_ground.png",
  "run_assets/obstacle_air.png",
  "run_assets/sun.png",
  "run_assets/moon.png",
  "run_assets/blue_moon.png",
  "run_assets/clouds.png",
];

let loaded = 0;
let started = false;
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
let player, obstacles, clouds, celestial;
let frame = 0,
  gameOver = false;
let score = 0,
  highScore = 0;
let speed = 6;
let multiplier = 1;
let day = true,
  cycleCount = 0;

// ===== 初期化 =====
function start() {
  highScore = Number(localStorage.getItem("dino_high") || 0);

  player = {
    x: 50,
    y: 200,
    vy: 0,
    jumping: false,
    frame: 0,
    w: 40,
    h: 40,
  };

  obstacles = [];
  clouds = [{ x: 0 }, { x: 400 }];

  celestial = { x: canvas.width, type: "sun" };

  loop();
}

// ===== 入力 =====
function jump() {
  if (!player.jumping && !gameOver) {
    player.vy = -12;
    player.jumping = true;
  }
  if (gameOver) {
    location.reload();
  }
}

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") jump();
});
window.addEventListener("touchstart", jump);

// ===== 衝突判定（余白カット）=====
function hit(a, b) {
  const margin = 6;
  return (
    a.x + margin < b.x + b.w - margin &&
    a.x + a.w - margin > b.x + margin &&
    a.y + margin < b.y + b.h - margin &&
    a.y + a.h - margin > b.y + margin
  );
}

// ===== ループ =====
function loop() {
  frame++;
  update();
  draw();
  requestAnimationFrame(loop);
}

// ===== 更新 =====
function update() {
  if (gameOver) return;

  // スピード上昇
  speed += 0.001;

  // プレイヤー
  player.y += player.vy;
  player.vy += 0.6;

  if (player.y >= 200) {
    player.y = 200;
    player.vy = 0;
    player.jumping = false;
  }

  if (frame % 10 === 0) {
    player.frame = 1 - player.frame;
  }

  // 障害物生成
  if (frame % 90 === 0) {
    obstacles.push({
      x: canvas.width,
      y: Math.random() < 0.5 ? 220 : 150,
      type: Math.random() < 0.5 ? "ground" : "air",
      w: 40,
      h: 40,
    });
  }

  // 移動
  obstacles.forEach((o) => (o.x -= speed));
  obstacles = obstacles.filter((o) => o.x > -50);

  // 衝突
  obstacles.forEach((o) => {
    if (hit(player, o)) {
      gameOver = true;
      if (score > highScore) {
        highScore = Math.floor(score);
        localStorage.setItem("dino_high", highScore);
      }
    }
  });

  // 雲
  clouds.forEach((c) => {
    c.x -= speed * 0.3;
    if (c.x < -300) c.x = canvas.width;
  });

  // 太陽/月
  celestial.x -= speed * 0.25;
  if (celestial.x < -100) {
    celestial.x = canvas.width;
    day = !day;
    cycleCount++;

    if (!day) {
      if (cycleCount % 10 === 0) {
        celestial.type = "blue_moon";
        multiplier = 1.1;
      } else {
        celestial.type = "moon";
        multiplier = 1;
      }
    } else {
      celestial.type = "sun";
      multiplier = 1;
    }
  }

  // スコア
  score += 0.1 * multiplier;
}

// ===== 描画 =====
function draw() {
  ctx.fillStyle = day ? "#fff" : "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  if (!day) ctx.filter = "invert(1)";

  // 雲
  clouds.forEach((c) => {
    drawSprite("run_assets/clouds.png", c.x, 50, 300, 100, () => {
      ctx.fillStyle = day ? "#d8ecff" : "#444";
      ctx.beginPath();
      ctx.ellipse(c.x + 150, 90, 120, 24, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  });

  // 太陽/月
  let cel = "run_assets/sun.png";
  if (!day) {
    cel =
      celestial.type === "blue_moon"
        ? "run_assets/blue_moon.png"
        : "run_assets/moon.png";
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
  let char;
  if (gameOver) {
    char = img["run_assets/character_over.png"];
  } else {
    char =
      img[
        player.frame
          ? "run_assets/character_2.png"
          : "run_assets/character_1.png"
      ];
  }
  drawSprite(
    gameOver ? "run_assets/character_over.png" : `run_assets/character_${player.frame + 1}.png`,
    player.x,
    player.y,
    player.w,
    player.h,
    () => drawFallbackPlayer(),
  );

  // 障害物
  obstacles.forEach((o) => {
    let name =
      o.type === "ground"
        ? "run_assets/obstacle_ground.png"
        : "run_assets/obstacle_air.png";
    drawSprite(name, o.x, o.y, o.w, o.h, () => {
      ctx.fillStyle = "#3d8b4f";
      if (o.type === "ground") {
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

  ctx.restore();

  // UI
  ctx.fillStyle = day ? "#000" : "#fff";
  ctx.font = "20px sans-serif";
  ctx.fillText("Score: " + Math.floor(score), 20, 30);
  ctx.fillText("High: " + highScore, 20, 60);

  if (multiplier > 1) {
    ctx.fillText("x1.1 BONUS!", 20, 90);
  }

  if (gameOver) {
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
