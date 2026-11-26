import { createBuildingsData } from "./mochi_assets/data_buildings.js";
import { createUpgradesData } from "./mochi_assets/data_upgrades.js";
import { createDivineUpgradesData } from "./mochi_assets/data_divine.js";
import { createItemsData } from "./mochi_assets/data_items.js";
import { createJajutsuData } from "./mochi_assets/data_jajutsu.js";
import { createAchievementsData } from "./mochi_assets/data_achievements.js";

const panel = document.getElementById("panel");
const count = document.getElementById("count");
const mps = document.getElementById("mps");
const cookie = document.getElementById("cookie");

const jajutsuGlowStyle = document.createElement("style");

jajutsuGlowStyle.textContent = `
  @keyframes jajutsu-failure-glow {
    0% {
      filter: drop-shadow(0 0 0 rgba(255, 0, 0, 0));
    }
    40% {
      filter: drop-shadow(0 0 18px rgba(255, 0, 0, 0.65));
    }
    100% {
      filter: drop-shadow(0 0 0 rgba(255, 0, 0, 0));
    }
  }

  .jajutsu-failure-glow {
    animation: jajutsu-failure-glow 900ms ease-out;
  }
`;

document.head.appendChild(jajutsuGlowStyle);

// 最後に確認したカーソルの位置
let jajutsuPointerX = window.innerWidth / 2;
let jajutsuPointerY = window.innerHeight / 2;

document.addEventListener("pointermove", (event) => {
  jajutsuPointerX = event.clientX;
  jajutsuPointerY = event.clientY;
});

document.addEventListener("pointerdown", (event) => {
  jajutsuPointerX = event.clientX;
  jajutsuPointerY = event.clientY;
});

function flashJajutsuFailure() {
  const count = 12;

  for (let i = 0; i < count; i++) {
    const mark = document.createElement("span");
    mark.className = "jajutsu-failure-particle";
    mark.textContent = "❌";

    // 円周方向に飛び散らせる
    const angle = (Math.PI * 2 * i / count)
      + (Math.random() - 0.5) * 0.35;

    const distance = 60 + Math.random() * 45;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    mark.style.left = `${jajutsuPointerX}px`;
    mark.style.top = `${jajutsuPointerY}px`;
    mark.style.setProperty("--dx", `${dx}px`);
    mark.style.setProperty("--dy", `${dy}px`);
    mark.style.setProperty(
      "--rotation",
      `${Math.random() * 70 - 35}deg`
    );
    mark.style.animationDelay = `${Math.random() * 60}ms`;

    document.body.appendChild(mark);

    mark.addEventListener("animationend", () => {
      mark.remove();
    }, { once: true });
  }
}

const statusDisplay = document.createElement("div");
statusDisplay.id = "game-status";
statusDisplay.style.cssText = `
  margin-top: 6px;
  margin-bottom: 12px;
  font-size: 0.9em;
  line-height: 1.7;
  opacity: 0.9;
  text-align: center;
`;

mps.insertAdjacentElement("afterend", statusDisplay);

const MULTIPLIER_SCALE = 1000000n;

function formatNumber(n) {
  n = BigInt(n);

  const units = [
    [10n ** 68n, "無量大数"],
    [10n ** 64n, "不可思議"],
    [10n ** 60n, "那由他"],
    [10n ** 56n, "阿僧祇"],
    [10n ** 52n, "恒河沙"],
    [10n ** 48n, "極"],
    [10n ** 44n, "載"],
    [10n ** 40n, "正"],
    [10n ** 36n, "澗"],
    [10n ** 32n, "溝"],
    [10n ** 28n, "穣"],
    [10n ** 24n, "秭"],
    [10n ** 20n, "垓"],
    [10n ** 16n, "京"],
    [10n ** 12n, "兆"],
    [10n ** 8n, "億"],
    [10n ** 4n, "万"],
  ];

  for (const u of units) {
    if (n >= u[0]) {
      let val = Number(n / (u[0] / 100n)) / 100;
      return val + u[1];
    }
  }

  return n.toString();
}

let game = {
  cookies: 0n,
  clickPower: 1n,
  clickMultiplier: MULTIPLIER_SCALE,

    // 転生による永続データと強化
  mikan: 0n,
  reincarnations: 0,
  reinClickMultiplier: MULTIPLIER_SCALE,
  reinBuildingsMultiplier: MULTIPLIER_SCALE,
  reinItemPriceMultiplier: MULTIPLIER_SCALE,
  reinJajutsu: 0,

  stats: {
    clicks: 0n,
    buildingsBought: 0n,
    upgradesBought: 0n,
  },

  buildings: [],
  upgrades: [],
  divineUpgrades: [],
  items: [],
  jajutsuItems: [],
  achievements: [],
};

// 各リソースの読み込み
game.buildings = createBuildingsData(game);
game.upgrades = createUpgradesData(game, hasUpgrade);
game.items = createItemsData(game, getClickPower, () => debugMode, hasDivineUpgrade);
game.divineUpgrades = createDivineUpgradesData(game, hasDivineUpgrade);
game.jajutsuItems = createJajutsuData(game, () => debugMode );
game.achievements = createAchievementsData(game);

game.buildings.forEach((b) => {
  b.multiplier ??= MULTIPLIER_SCALE;
});

const reincarnationInitialState = {
  cookies: game.cookies,
  clickPower: game.clickPower,
  clickMultiplier: game.clickMultiplier,

  stats: { ...game.stats },

  buildings: game.buildings.map((x) => ({ ...x })),
  upgrades: game.upgrades.map((x) => ({ ...x })),
  items: game.items.map((x) => ({ ...x })),
  achievements: game.achievements.map((x) => ({ ...x })),
  jajutsuItems: game.jajutsuItems.map((x) => ({ ...x })),
};

function createReincarnationInitialBonus() {
  return {
    cookies: undefined,
    clickPower: undefined,
    clickMultiplier: undefined,
    buildings: {},
    items: {},
    upgrades: {},
    jajutsuItems: {},
  };
}
let reincarnationInitialBonus = createReincarnationInitialBonus();

function rebuildReincarnationInitialBonus() {
  reincarnationInitialBonus =
    createReincarnationInitialBonus();
  for (const upgrade of game.divineUpgrades) {
    if (
      upgrade.bought &&
      typeof upgrade.initialBonusEffect === "function"
    ) {
      upgrade.initialBonusEffect(
        reincarnationInitialBonus
      );
    }
  }
  return reincarnationInitialBonus;
}
function applyInitialBonusFields(
  target,
  bonus,
  allowedFields
) {
  if (!target || !bonus) return;
  for (const field of allowedFields) {
    if (
      !Object.prototype.hasOwnProperty.call(
        bonus,
        field
      )
    ) {
      continue;
    }
    const value = bonus[field];
    target[field] =
      typeof target[field] === "bigint"
        ? BigInt(value)
        : value;
  }
}
function applyInitialBonusToList(
  list,
  bonuses,
  allowedFields
) {
  const bonusEntries = Object.entries(bonuses);
  for (const [name, bonus] of bonusEntries) {
    const target = list.find(
      (item) => item.name === name
    );
    if (!target) {
      console.warn(
        `転生ボーナス対象が見つかりません: ${name}`
      );
      continue;
    }
    applyInitialBonusFields(
      target,
      bonus,
      allowedFields
    );
  }
}
function applyReincarnationInitialBonus() {
  const bonus = reincarnationInitialBonus;
  if (bonus.cookies !== undefined) {
    game.cookies = BigInt(bonus.cookies);
  }
  if (bonus.clickPower !== undefined) {
    game.clickPower = BigInt(bonus.clickPower);
  }
  if (bonus.clickMultiplier !== undefined) {
    game.clickMultiplier =
      BigInt(bonus.clickMultiplier);
  }
  applyInitialBonusToList(
    game.buildings,
    bonus.buildings,
    [
      "owned",
      "mps",
      "multiplier",
      "cost",
      "unlocked",
    ]
  );
  applyInitialBonusToList(
    game.items,
    bonus.items,
    [
      "owned",
      "cost",
      "unlocked",
    ]
  );

  applyInitialBonusToList(
    game.upgrades,
    bonus.upgrades,
    [
      "bought",
      "unlocked",
    ]
  );
  applyInitialBonusToList(
    game.jajutsuItems,
    bonus.jajutsuItems,
    [
      "owned",
      "cost",
      "unlocked",
    ]
  );

  for (const upgrade of game.upgrades) {
    if (upgrade.bought) {
      upgrade.effect();
    }
  }
  for (const item of game.items) {
    for (let i = 0n; i < item.owned; i++) {
      item.effect();
    }
  }
  for (const item of game.jajutsuItems) {
    for (let i = 0n; i < item.owned; i++) {
      item.effect();
    }
  }
}

let tab = "buildings";

function getJajutsuChance(item) {
  return game.reinJajutsu + item.baseJajutsu;
}

function isUnlocked(obj) {
  if (!obj.unlock) return true;
  return obj.unlock();
}

function getUpgrade(name) {
  return game.upgrades.find(upgrade => upgrade.name === name);
}

function getDivineUpgrade(name) {
  return game.divineUpgrades.find(
    (upgrade) => upgrade.name === name
  );
}

function getItem(name) {
  return game.items.find(upgrade => upgrade.name === name);
}

function hasUpgrade(name) {
  return getUpgrade(name)?.bought ?? false;
}

function hasDivineUpgrade(name) {
  return getDivineUpgrade(name)?.bought ?? false;
}

function hasItem(name) {
  return getItem(name)?.bought ?? false;
}


function updateUnlocks() {
  let unlockedAnything = false;

  game.buildings.forEach((b) => {
    if (!b.unlocked && b.unlock && b.unlock()) {
      b.unlocked = true;
      unlockedAnything = true;
    }
  });

  game.upgrades.forEach((u) => {
    if (!u.unlocked && u.unlock && u.unlock()) {
      u.unlocked = true;
      unlockedAnything = true;
    }
  });

  game.items.forEach((it) => {
    if (!it.unlocked && it.unlock && it.unlock()) {
      it.unlocked = true;
      unlockedAnything = true;
    }
  });
  
  game.jajutsuItems.forEach((it) => {
    if (!it.unlocked && it.unlock && it.unlock()) {
      it.unlocked = true;
      unlockedAnything = true;
    }
  });

  game.divineUpgrades.forEach((u) => {
    if (!u.unlocked && u.unlock && u.unlock()) {
      u.unlocked = true;
      unlockedAnything = true;
    }
  });
  if (unlockedAnything) render();
}
// デバッグ用＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// すべてをアンロック
function allUnlock() {
  game.buildings.forEach((b) => {
    b.unlocked = true;
  });
  game.upgrades.forEach((u) => {
    u.unlocked = true;
  });
  game.items.forEach((it) => {
    it.unlocked = true;
  });
}

// 自動クリックの開始終了。さいほうへいき様のタップ速度にあわせて毎秒7回
let autoClickInterval = null;
function autoClickStart() {
  if (autoClickInterval !== null) return;
  autoClickInterval = setInterval(() => {
    cookie.click();
  }, 1000 / 7);
}
function autoClickStop() {
  if (autoClickInterval === null) return;
  clearInterval(autoClickInterval);
  autoClickInterval = null;
}

// 衛宮切嗣になる
const timeAlterState = {
  speed: 1,
  realElapsedMs: 0,
  gameElapsedMs: 0,
  lastRealTime: performance.now(),
};
function updateAlteredTime() {
  const now = performance.now();
  const delta = now - timeAlterState.lastRealTime;
  timeAlterState.realElapsedMs += delta;
  timeAlterState.gameElapsedMs += delta * timeAlterState.speed;
  timeAlterState.lastRealTime = now;
}
function timeAlter(speed) {
  if (
    typeof speed !== "number" ||
    !Number.isFinite(speed) ||
    speed < 0
  ) {
    throw new RangeError(
      "speed must be a finite number >= 0"
    );
  }
  timeAlterSpeed = speed;
  console.log(
    `時間倍率を ${speed}x に変更しました`,
    timeAlterStatus()
  );
}
function timeAlterStatus() {
  const realElapsedMs =
    performance.now() - timeAlterStartedAt;
  return {
    speed: timeAlterSpeed,
    realElapsedMs,
    simulatedElapsedMs:
      Number(timeAlterTickCount) * tick,
    effectiveElapsedMs:
      (Number(timeAlterTickCount) + timeAlterCredit) * tick,
    pendingTicks: timeAlterCredit,
    tickCount: timeAlterTickCount,
  };
}
window.timeAlter = timeAlter;
window.timeAlterStatus = timeAlterStatus;

window.openTab = openTab;

// デバッグモード
let debugMode = false;
function enableDebug() {
  debugMode = true;
  allUnlock();
  console.log("デバッグモードを有効化しました");
}
function disableDebug() {
  debugMode = false;
  console.log("デバッグモードを無効化しました");
}
window.enableDebug = enableDebug;
window.disableDebug = disableDebug;

//セーブデータ消去・再読み込み
function fullReset(){
  localStorage.clear();
  window.location.reload();
}
window.fullReset = fullReset;

//金銭の邪術、とりあえず一垓
function plusCookie(){
  game.cookies += 100000000000000000000n;
}
function resetCookie(){
  game.cookies = 0n;
}
window.plusCookie = plusCookie;
window.resetCookie = resetCookie;
// ひたすら　デバッグ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

const tooltip = document.getElementById("tooltip");

function showTooltip(e, title, desc, flavor, index) {
  tooltip.innerHTML =
    "<b>" +
    title +
    "</b><br>" +
    desc +
    (flavor ? "<span class='flavor'>" + flavor + "</span>" : "") +
    (
      debugMode && index !== undefined
        ? `<br><small style="color:#888">Index: ${index}</small>`
        : ""
    );

  tooltip.style.opacity = 0;
  tooltip.style.display = "block";

  let tooltipWidth = tooltip.offsetWidth;
  let screenWidth = window.innerWidth;
  let x = e.pageX + 10;
  let y = e.pageY + 10;

  if (x + tooltipWidth > screenWidth) {
    x = e.pageX - tooltipWidth - 10;
  }

  tooltip.style.left = x + "px";
  tooltip.style.top = y + "px";
  tooltip.style.opacity = 1;
}

function moveTooltip(e) {
  let tooltipWidth = tooltip.offsetWidth;
  let screenWidth = window.innerWidth;

  let x = e.pageX + 10;
  let y = e.pageY + 10;

  if (x + tooltipWidth > screenWidth) {
    x = e.pageX - tooltipWidth - 10;
  }

  tooltip.style.left = x + "px";
  tooltip.style.top = y + "px";
}

function hideTooltip() {
  tooltip.style.opacity = 0;
}

function innerHTMLReplacing(text) {
  text = text.replace("[(red)", "<span style='color:red'>");
  text = text.replace("[(blue)", "<span style='color:blue'>");
  text = text.replace("[(green)", "<span style='color:green'>");
  text = text.replace("[(yellow)", "<span style='color:yellow'>");
  text = text.replace("[(purple)", "<span style='color:purple'>");
  text = text.replace("[(cyan)", "<span style='color:cyan'>");
  text = text.replace("[(pink)", "<span style='color:pink'>");

  text = text.replace("[(r1)", "<span style='color:#b0e5eb'>");
  text = text.replace("[(r2)", "<span style='color:#aebcf5'>");
  text = text.replace("[(r3)", "<span style='color:#f5f5ae'>");
  text = text.replace("[(r4)", "<span style='color:#f7d49c'>");
  text = text.replace("[(disad)", "<span style='color:#ff9999'>");

  text = text.replace("[(horaku)", "<span style='color:#b9fae6'>");

  text = text.replace("[(ruby)", "<ruby>");
  text = text.replace("(/ruby)]", "</ruby>");
  text = text.replace("[(rt)", "<rt>");
  text = text.replace("(/rt)]", "</rt>");

  text = text.replace("(end)]", "</span>");
  return text;
}

function innerHTMLRemoving(text) {
  text = text.replace("[(red)", "");
  text = text.replace("[(blue)", "");
  text = text.replace("[(green)", "");
  text = text.replace("[(yellow)", "");
  text = text.replace("[(purple)", "");
  text = text.replace("[(cyan)", "");
  text = text.replace("[(pink)", "");

  text = text.replace("[(r1)", "");
  text = text.replace("[(r2)", "");
  text = text.replace("[(r3)", "");
  text = text.replace("[(r4)", "");

  text = text.replace("[(horaku)", "");

  text = text.replace("[(ruby)", "");
  text = text.replace("(/ruby)]", "");
  text = text.replace("[(rt)", "(");
  text = text.replace("(/rt)]", ")");

  text = text.replace("(end)]", "");
  return text;
}

function openTab(t, el) {
  tab = t;

  document
    .querySelectorAll(".tab")
    .forEach((x) => x.classList.remove("active"));

  el.classList.add("active");

  render();
}

function unlockAchievement(id) {
  let a = game.achievements.find((x) => x.id === id);

  if (!a || a.unlocked) return;

  a.unlocked = true;
  toast("Achievement: " + a.name);

  render();
}

function checkAchievements() {
  if (game.stats.clicks >= 1n) {
    unlockAchievement("click1");
  }
  if (game.stats.clicks >= 10n) {
    unlockAchievement("click10");
  }
  if (game.stats.clicks >= 100n) {
    unlockAchievement("click100");
  }
  if (game.stats.clicks >= 314n) {
    unlockAchievement("click314");
  }
  if (game.stats.clicks >= 777n) {
    unlockAchievement("click777");
  }
  if (game.stats.clicks >= 1000n) {
    unlockAchievement("click1000");
  }
  if (game.stats.clicks >= 10000n) {
    unlockAchievement("click10000");
  }
  if (game.stats.clicks >= 65535n) {
    unlockAchievement("click65535");
  }
  if (game.stats.clicks >= 100000n) {
    unlockAchievement("click100000");
  }
  if (game.stats.clicks >= 1000000n) {
    unlockAchievement("click1000000");
  }

  if (game.buildings[0].owned >= 1) {
    unlockAchievement("own_takutan");
  }
  if (game.buildings[0].owned >= 10) {
    unlockAchievement("own_takutan10");
  }
  if (game.buildings[0].owned >= 101) {
    unlockAchievement("own_takutan101");
  }

  if (game.buildings[1].owned >= 1) {
    unlockAchievement("own_farm");
  }
  if (game.buildings[1].owned >= 10) {
    unlockAchievement("own_farm10");
  }
  if (game.buildings[1].owned >= 101) {
    unlockAchievement("own_farm100");
  }

  if (game.buildings[2].owned >= 1) {
    unlockAchievement("own_factory");
  }
  if (game.buildings[2].owned >= 10) {
    unlockAchievement("own_factory10");
  }
  if (game.buildings[2].owned >= 101) {
    unlockAchievement("own_factory100");
  }

  if (game.buildings[3].owned >= 1) {
    unlockAchievement("own_west");
  }
  if (game.buildings[3].owned >= 10) {
    unlockAchievement("own_west10");
  }
  if (game.buildings[4].owned >= 1) {
    unlockAchievement("own_east");
  }
  if (game.buildings[4].owned >= 10) {
    unlockAchievement("own_east10");
  }

  if (game.buildings[5].owned >= 1) {
    unlockAchievement("own_sstakutan");
  }
  if (game.buildings[5].owned >= 10) {
    unlockAchievement("own_sstakutan10");
  }
  if (game.buildings[5].owned >= 101) {
    unlockAchievement("own_sstakutan100");
  }

  if (game.buildings[6].owned >= 1) {
    unlockAchievement("own_ssstakutan");
  }
  if (game.buildings[6].owned >= 10) {
    unlockAchievement("own_ssstakutan10");
  }
  if (game.buildings[6].owned >= 101) {
    unlockAchievement("own_ssstakutan100");
  }

  if (game.buildings[7].owned >= 1) {
    unlockAchievement("own_evil");
  }
  if (game.buildings[7].owned >= 10) {
    unlockAchievement("own_evil10");
  }

  if (game.buildings[8].owned >= 1) {
    unlockAchievement("own_court");
  }
  if (game.buildings[8].owned >= 10) {
    unlockAchievement("own_court10");
  }

  if (game.buildings[9].owned >= 1) {
    unlockAchievement("own_planet");
  }
  if (game.buildings[9].owned >= 10) {
    unlockAchievement("own_planet10");
  }

  if (game.buildings[10].owned >= 1) {
    unlockAchievement("own_rabbit");
  }
  if (game.buildings[10].owned >= 10) {
    unlockAchievement("own_rabbit10");
  }

  if (game.buildings[11].owned >= 1) {
    unlockAchievement("own_eto");
  }
  if (game.buildings[11].owned >= 10) {
    unlockAchievement("own_eto10");
  }

  if (game.buildings[12].owned >= 1) {
    unlockAchievement("own_truecourt");
  }
  if (game.buildings[12].owned >= 10) {
    unlockAchievement("own_truecourt10");
  }

  if (game.buildings[13].owned >= 1) {
    unlockAchievement("own_yamamotolab");
  }
  if (game.buildings[13].owned >= 10) {
    unlockAchievement("own_yamamotolab10");
  }

  if (game.buildings[14].owned >= 1) {
    unlockAchievement("own_westyama");
  }
  if (game.buildings[14].owned >= 10) {
    unlockAchievement("own_westyama10");
  }
  if (game.buildings[15].owned >= 1) {
    unlockAchievement("own_eastyama");
  }
  if (game.buildings[15].owned >= 10) {
    unlockAchievement("own_eastyama10");
  }

  if (game.buildings[16].owned >= 1) {
    unlockAchievement("own_motchiy");
  }
  if (game.buildings[16].owned >= 100) {
    unlockAchievement("own_motchiy100");
  }
}

function render() {
  count.textContent = formatNumber(game.cookies);
  mps.textContent = formatNumber(getFinalMps()) + " / sec";
  updateStatusDisplay();
  renderUpgradeSubtabs();
  renderItemSubtabs();

  if (tab === "buildings") renderBuildings();
  if (tab === "upgrades") renderUpgrades();
  if (tab === "items") renderItems();
  if (tab === "achievements") renderAchievements();
}

function renderBuildings() {
  panel.innerHTML = "";

  game.buildings.forEach((b, i) => {
    if (b.unlock && !b.unlocked) return;

    let d = document.createElement("button");
    d.type = "button";
    d.className = "card";

    d.onmouseenter = (e) =>
      showTooltip(
        e,
        innerHTMLReplacing(b.name),
        innerHTMLReplacing(b.desc),
        b.flavor,
        i,
      );
    d.onmousemove = moveTooltip;
    d.onmouseleave = hideTooltip;

    d.innerHTML =
      "<b>" +
      innerHTMLReplacing(b.name) +
      "</b><br>" +
      "Owned: " +
      b.owned +
      "<br>Cost: " +
      formatNumber(b.cost) +
      "<br>MPS: " +
      formatNumber(b.mps) +
      " x " +
      (
        Number(b.multiplier) /
        Number(MULTIPLIER_SCALE)
      ).toLocaleString("ja-JP", {
        maximumFractionDigits: 6,
      });

    d.onclick = (e) => buyBuilding(i, e);

    panel.appendChild(d);
  });
}

function buyBuilding(i, e) {
  let b = game.buildings[i];

  if (game.cookies < b.cost) {
    toast(`餅が足りません😭（あと${formatNumber(b.cost - game.cookies)}）`);
    return;
  }

  game.cookies -= b.cost;
  particle(e.clientX, e.clientY, "-" + formatNumber(b.cost), true);
  b.owned++;
  b.cost = (b.cost * 115n + 50n) / 100n;
  toast(innerHTMLRemoving(b.name) + "を購入した");
  checkAchievements();

  render();
}

function buyItem(i, e) {
  const it = game.items[i];
  const price = getItemPrice(it);

  if (game.cookies < price) {
    toast(
      `餅が足りません（あと${formatNumber(price - game.cookies)}）`
    );
    return;
  }

  game.cookies -= price;

  particle(
    e.clientX,
    e.clientY,
    "-" + formatNumber(price),
    true
  );

  it.owned++;
  it.effect();

  it.cost = (it.cost * 115n + 50n) / 100n;
  toast("Item: " + innerHTMLRemoving(it.name));

  save();
  render();
}

function buyJajutsuItem(i, e) {
  const it = game.jajutsuItems[i];

  if (!it || (it.unlock && !it.unlocked)) return;

  const price = getItemPrice(it);

  if (game.cookies < price) {
    toast(
      `餅が足りません（あと${formatNumber(price - game.cookies)}）`
    );
    return;
  }

  // 購入処理
  game.cookies -= price;
  it.owned++;
  it.cost = (it.cost * 115n + 50n) / 100n;

  // 合計邪術度で成功判定
  const chance = getJajutsuChance(it);
  const success = Math.random() * 100 < chance;

  if (!success) {
    it.owned--;
    save();
    render();
    // 再描画後にアニメーションを開始
    requestAnimationFrame(() => {
      flashJajutsuFailure();
    });
    return;
  }

  // 成功時のみ効果を発動
  it.effect();

  toast("邪術成功：" + innerHTMLRemoving(it.name));

  save();
  render();
}

function renderUpgrades() {
  panel.innerHTML = "";

  // 転生前に神界タブが選ばれていた場合の安全策
  if (game.reincarnations <= 0) {
    upgradeSubtab = "normal";
  }

  const divine = upgradeSubtab === "divine";
  const upgrades = divine
    ? game.divineUpgrades
    : game.upgrades;

  upgrades.forEach((u, i) => {
    if (u.unlock && !u.unlocked) return;

    const d = document.createElement("button");
    d.type = "button";
    d.className = "card";

    d.onmouseenter = (e) =>
      showTooltip(
        e,
        innerHTMLReplacing(u.name),
        innerHTMLReplacing(u.desc),
        u.flavor,
        i,
      );

    d.onmousemove = moveTooltip;
    d.onmouseleave = hideTooltip;

    if (u.bought) d.style.opacity = ".5";

    d.innerHTML =
      "<b>" +
      innerHTMLReplacing(u.name) +
      "</b><br>Cost: " +
      formatNumber(u.cost) +
      (divine ? " みかん" : " 餅");

    d.onclick = (e) => {
      if (divine) {
        buyDivineUpgrade(i, e);
      } else {
        buyUpgrade(i, e);
      }
    };

    panel.appendChild(d);
  });
}

function buyDivineUpgrade(i, e) {
  const u = game.divineUpgrades[i];
  if (!u || !u.unlocked) {
    toast("この神界アップグレードはまだ解放されていません");
    return;
  }
  if (u.bought) {
    toast("この神界アップグレードは購入済みです");
    return;
  }
  if (game.mikan < u.cost) {
    toast(`みかんが足りません😭（あと${formatNumber(u.cost - game.mikan)}個）`);
    return;
  }

  game.mikan -= u.cost;
  u.effect();
  u.bought = true;

  save();

  toast("神界アップグレードを購入：" + u.name);
  render();
}

function buyUpgrade(i, e) {
  let u = game.upgrades[i];

  if (u.bought) {
    toast("このアップグレードは購入済みです");
    return;
  }
  if (game.cookies < u.cost) {
    toast(`餅が足りません（あと${formatNumber(u.cost - game.cookies)}）`);
    return;
  }

  game.cookies -= u.cost;
  particle(e.clientX, e.clientY, "-" + formatNumber(u.cost), true);
  u.effect();
  u.bought = true;

  save();

  toast("Upgrade: " + innerHTMLRemoving(u.name));

  render();
}

function renderItems() {
  panel.innerHTML = "";
  const subtabs = document.createElement("div");

  const jajutsu = itemSubtab === "jajutsu";
  const items = jajutsu
    ? game.jajutsuItems
    : game.items;
/*
  subtabs.className = "subtabs";

  function addSubtab(label, value) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.className =
      itemSubtab === value ? "active" : "";

    button.onclick = () => {
      itemSubtab = value;
      render();
    };

    subtabs.appendChild(button);
  }

  addSubtab("通常", "normal");

  if (game.reinJajutsu >= 1) {
    addSubtab("邪術", "jajutsu");
  }

  panel.appendChild(subtabs);

  */

  items.forEach((it, i) => {
    if (it.unlock && !it.unlocked) return;

    const d = document.createElement("button");
    d.type = "button";
    d.className = "card";

    const desc = jajutsu
      ? innerHTMLReplacing(it.desc) +
        "<br><br>邪術度：" +
        getJajutsuChance(it) +
        "%（基礎邪術度" +
        it.baseJajutsu +
        "%）"
      : innerHTMLReplacing(it.desc);

    d.onmouseenter = (e) =>
      showTooltip(
        e,
        innerHTMLReplacing(it.name),
        desc,
        it.flavor,
        i,
      );

    d.onmousemove = moveTooltip;
    d.onmouseleave = hideTooltip;

    const price = getItemPrice(it);

    d.innerHTML =
      "<b>" + innerHTMLReplacing(it.name) + "</b><br>" +
      "Owned: " + it.owned +
      "<br>Cost: " + formatNumber(price);

    d.onclick = (e) => {
      if (itemSubtab === "jajutsu") {
        buyJajutsuItem(i, e);
      } else {
        buyItem(i, e);
      }
    };

    panel.appendChild(d);
  });
}

function renderAchievements() {
  panel.innerHTML = "";

  game.achievements.forEach((a) => {
    let d = document.createElement("div");

    d.className = "achievement";

    if (a.unlocked) d.classList.add("unlocked");

    d.innerHTML = "<b>" + a.name + "</b><br>" + a.desc;

    panel.appendChild(d);
  });
}

cookie.onclick = (e) => {
  const power = getClickPower();
  game.cookies += power;
  game.stats.clicks++;

  if (game.stats.clicks >= 10n) {
    game.achievements[0].unlocked = true;
  }
  checkAchievements();
  particle(e.clientX,e.clientY,"+" + formatNumber(power));

  render();
};

function particle(x, y, text, spent = false) {
  let p = document.createElement("div");

  p.className = "mochi-particle";
  if (spent) p.classList.add("mochi-particle--spent");
  p.textContent = text;

  p.style.left = `${x}px`;
  p.style.top = `${y}px`;

  document.body.appendChild(p);

  setTimeout(() => p.remove(), 1000);
}

// 神界倍率込みの最終クリック力
function getClickPower() {
  return (
    game.clickPower *
    game.clickMultiplier *
    game.reinClickMultiplier /
    MULTIPLIER_SCALE /
    MULTIPLIER_SCALE
  );
}

// 通常倍率込みの建物生産力
function getmps() {
  let total = 0n;

  game.buildings.forEach((b) => {
    total +=
      (b.mps * b.multiplier * b.owned) /
      MULTIPLIER_SCALE;
  });

  return total;
}

// 神界倍率込みの最終生産力
function getFinalMps() {
  return (
    getmps() *
    game.reinBuildingsMultiplier /
    MULTIPLIER_SCALE
  );
}

function getItemPrice(item) {
  const numerator =
    item.cost * game.reinItemPriceMultiplier;

  const price =
    (numerator + MULTIPLIER_SCALE - 1n) /
    MULTIPLIER_SCALE;

  return price > 0n ? price : 1n;
}

function updateStatusDisplay() {
  const hasReincarnated = game.reincarnations > 0;
  statusDisplay.innerHTML = `
    ${
      hasReincarnated
        ? `
          <div>クリック力：${formatNumber(getClickPower())} （うち神界バフ${formatNumber((game.reinClickMultiplier - MULTIPLIER_SCALE) * 100n / MULTIPLIER_SCALE)} %）</div>
          <div>みかん：${formatNumber(game.mikan)} 個</div>
          <div>転生回数：${game.reincarnations} 回</div>
          <div>邪術度：${game.reinJajutsu}%</div>
        `
        : `<div>クリック力：${formatNumber(getClickPower())}</div>`
    }
  `;
}

function updateCounter() {
  count.textContent = formatNumber(game.cookies);
  mps.textContent = formatNumber(getFinalMps()) + " / sec";

  updateStatusDisplay();
  updateReincarnationUI();
}

let cookieRemainder = 0n; // 既存の余りを保持

const tick = 50; // 従来どおり50ms
let timeAlterSpeed = 1;
let timeAlterCredit = 0;
let timeAlterTickCount = 0n;

const timeAlterStartedAt = performance.now();

setInterval(() => {
  if (reincarnationInProgress) return;
  timeAlterCredit += timeAlterSpeed;

  const productionTick = () => {
    const mps = getFinalMps();
    const increment =
      (mps * BigInt(tick)) / 1000n;
    const remainder =
      (mps * BigInt(tick)) % 1000n;
    game.cookies += increment;
    cookieRemainder += remainder;
    if (cookieRemainder >= 1000n) {
      game.cookies += cookieRemainder / 1000n;
      cookieRemainder %= 1000n;
    }
    timeAlterTickCount++;
  };
  while (timeAlterCredit >= 1) {
    productionTick();
    timeAlterCredit -= 1;
  }

  updateUnlocks();
  updateCounter();
}, tick);

function toast(msg) {
  let t = document.getElementById("toast");

  t.textContent = msg;
  t.className = "toast show";

  setTimeout(() => (t.className = "toast"), 2000);
}


/* REINCARNATION */

const REINCARNATION_THRESHOLD = 10_000_000_000n;
let reincarnationInProgress = false;
let upgradeSubtab = "normal";
let itemSubtab = "normal";

// 通常・神界サブタブを、メインタブ列の直下に配置する
const upgradeSubtabBar = document.createElement("div");// 通常・邪術サブタブをメインタブ列の直下に配置
const itemSubtabBar = document.createElement("div");
itemSubtabBar.id = "item-subtab-bar";
itemSubtabBar.style.cssText = `
  display: none;
  width: 100%;
  gap: 0;
  margin-bottom: 16px;
  box-sizing: border-box;
`;

panel.parentNode.insertBefore(itemSubtabBar, panel);

function renderItemSubtabs() {
  const visible =
    tab === "items" && game.reinJajutsu >= 1;

  itemSubtabBar.style.display = visible ? "flex" : "none";

  if (!visible) {
    itemSubtab = "normal";
    return;
  }

  itemSubtabBar.innerHTML = "";

  const subtabs = [
    { label: "通常", key: "normal" },
    { label: "邪術", key: "jajutsu" }, // 真
  ];

  for (const subtab of subtabs) {
    const button = document.createElement("button");

    button.type = "button";
    button.className =
      "tab" + (itemSubtab === subtab.key ? " active" : "");
    button.textContent = subtab.label;
    button.style.flex = "1";
    button.style.minWidth = "0";
    button.style.boxSizing = "border-box";

    button.setAttribute(
      "aria-pressed",
      String(itemSubtab === subtab.key)
    );

    button.onclick = () => {
      itemSubtab = subtab.key;
      render();
    };

    itemSubtabBar.appendChild(button);
  }
}

upgradeSubtabBar.id = "upgrade-subtab-bar";
upgradeSubtabBar.style.cssText = `
  display: none;
  width: 100%;
  gap: 0;
  margin-bottom: 16px;
  box-sizing: border-box;
`;

panel.parentNode.insertBefore(upgradeSubtabBar, panel);

function renderUpgradeSubtabs() {
  const visible =
    tab === "upgrades" && game.reincarnations > 0;

  upgradeSubtabBar.style.display = visible ? "flex" : "none";

  if (!visible) return;

  upgradeSubtabBar.innerHTML = "";

  const subtabs = [
    { label: "通常", key: "normal" },
    { label: "神界", key: "divine" },
  ];

  for (const subtab of subtabs) {
    const button = document.createElement("button");

    button.type = "button";
    button.className =
      "tab" + (upgradeSubtab === subtab.key ? " active" : "");
    button.textContent = subtab.label;

    // メインタブ列と同じ幅を2等分する
    button.style.flex = "1";
    button.style.minWidth = "0";
    button.style.boxSizing = "border-box";

    button.setAttribute(
      "aria-pressed",
      String(upgradeSubtab === subtab.key)
    );

    button.onclick = () => {
      upgradeSubtab = subtab.key;
      render();
    };

    upgradeSubtabBar.appendChild(button);
  }
}

function getReincarnationBonus() {
  const r = game.reincarnations;
  return BigInt(Math.floor(Math.pow(2, r / 5)) - 1);
}

const MIKAN_BASE_COOKIES = 10n ** 10n;

function bigIntCubeRoot(value) {
  if (value < 0n) throw new RangeError("負の数は計算できません");
  if (value < 2n) return value;

  const bitLength = BigInt(value.toString(2).length);
  let x = 1n << ((bitLength + 2n) / 3n);

  while (true) {
    const nextX = (2n * x + value / (x * x)) / 3n;
    if (nextX >= x) return x;
    x = nextX;
  }
}
function getMikanGain(cookies) {
  cookies = BigInt(cookies);

  if (cookies < REINCARNATION_THRESHOLD) {
    return 0n;
  }

  return bigIntCubeRoot(cookies / MIKAN_BASE_COOKIES);
}

const reincarnationPopup = document.createElement("button");

reincarnationPopup.id = "reincarnation-popup";
reincarnationPopup.type = "button";
reincarnationPopup.style.cssText = `
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 10000;
  display: none;
  padding: 12px 16px;
  border: 2px solid #e6a23c;
  border-radius: 12px;
  background: #fff4d6;
  color: #5c3700;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 16px #0003;
`;

document.body.appendChild(reincarnationPopup);

// 暗転オーバーレイ
const reincarnationOverlay = document.createElement("div");

reincarnationOverlay.id = "reincarnation-overlay";
reincarnationOverlay.style.cssText = `
  position: fixed;
  inset: 0;
  z-index: 10001;
  background: #000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 450ms ease;
`;

document.body.appendChild(reincarnationOverlay);

function updateReincarnationUI() {
  if (!reincarnationPopup.isConnected) return;
  
  const gain = getMikanGain(game.cookies) + getReincarnationBonus();
  const available = gain > 0n;

  reincarnationPopup.style.display = available ? "block" : "none";

  if (available) {
    reincarnationPopup.textContent =
      `転生可能！ ダブルクリックで転生（みかん +${gain}個）`;
  }
}

// ポップアップをダブルクリックした場合のみ転生
reincarnationPopup.addEventListener("dblclick", reincarnate);

function reincarnate() {
  if (reincarnationInProgress) return;

  const gain = getMikanGain(game.cookies) + getReincarnationBonus();

  if (gain <= 0n) {
    toast("転生には100億餅以上が必要です😭");
    return;
  }
  const initialBonus = rebuildReincarnationInitialBonus();
  reincarnationInProgress = true;

  // 暗転開始
  reincarnationOverlay.style.pointerEvents = "auto";
  reincarnationOverlay.style.opacity = "1";

  setTimeout(() => {
    game.mikan += gain;
    game.reincarnations++;
    game.cookies = reincarnationInitialState.cookies;
    game.clickPower = reincarnationInitialState.clickPower;
    game.clickMultiplier =
      reincarnationInitialState.clickMultiplier;

    game.stats = { ...reincarnationInitialState.stats };

    game.buildings =
      reincarnationInitialState.buildings.map((x) => ({ ...x }));

    game.upgrades =
      reincarnationInitialState.upgrades.map((x) => ({ ...x }));

    game.items =
      reincarnationInitialState.items.map((x) => ({ ...x }));

    game.jajutsuItems =
  reincarnationInitialState.jajutsuItems.map((x) => ({ ...x }));

    game.achievements =
      reincarnationInitialState.achievements.map((x) => ({ ...x }));
    cookieRemainder = 0n;
    timeAlterSpeed = 1;
    timeAlterCredit = 0;
    timeAlterTickCount = 0n;
    autoClickStop();
    game.reinClickMultiplier = MULTIPLIER_SCALE;
    game.reinBuildingsMultiplier = MULTIPLIER_SCALE;
    game.reinItemPriceMultiplier = MULTIPLIER_SCALE;
    game.reinJajutsu = 0;
    for (const upgrade of game.divineUpgrades) {
      if (upgrade.bought) {
        upgrade.effect();
      }
    }
    reincarnationInitialBonus = initialBonus;
    applyReincarnationInitialBonus();
    updateUnlocks();
    checkAchievements();
    if (game.reincarnations > 0) {
      upgradeSubtab = "divine";
    }

    save();
    updateCounter();
    render();
    updateReincarnationUI();

    toast(`転生！　みかんを${gain}個獲得しました`);

    // 暗転解除
    requestAnimationFrame(() => {
      reincarnationOverlay.style.opacity = "0";
      setTimeout(() => {
        reincarnationOverlay.style.pointerEvents = "none";
        reincarnationInProgress = false;
      }, 450);
    });
  }, 450);
}

/* SAVE */
function save() {
  const data = {
    version: 2,

    cookies: game.cookies.toString(),
    clickPower: game.clickPower.toString(),
    clickMultiplier: game.clickMultiplier.toString(),

    mikan: game.mikan.toString(),
    reincarnations: game.reincarnations,

    reinClickMultiplier: game.reinClickMultiplier.toString(),
    reinBuildingsMultiplier: game.reinBuildingsMultiplier.toString(),
    reinItemPriceMultiplier: game.reinItemPriceMultiplier.toString(),
    reinJajutsu: game.reinJajutsu,

    stats: {
      clicks: game.stats.clicks.toString(),
      buildingsBought: game.stats.buildingsBought.toString(),
      upgradesBought: game.stats.upgradesBought.toString(),
    },

    buildings: Object.fromEntries(
      game.buildings.map((b) => [
        b.name,
        {
          owned: b.owned.toString(),
          cost: b.cost.toString(),
          mps: b.mps.toString(),
          multiplier: b.multiplier.toString(),
          unlocked: b.unlocked ?? false,
        },
      ])
    ),

    upgrades: Object.fromEntries(
      game.upgrades.map((u) => [
        u.name,
        {
          bought: u.bought,
          unlocked: u.unlocked ?? false,
        },
      ])
    ),

    items: Object.fromEntries(
      game.items.map((it) => [
        it.name,
        {
          owned: it.owned.toString(),
          cost: it.cost.toString(),
          unlocked: it.unlocked ?? false,
        },
      ])
    ),

    jajutsuItems: Object.fromEntries(
      game.jajutsuItems.map((it) => [
        it.name,
        {
          owned: it.owned.toString(),
          cost: it.cost.toString(),
          unlocked: it.unlocked ?? false,
        },
      ])
    ),

    achievements: Object.fromEntries(
      game.achievements.map((a) => [
        a.id,
        { unlocked: a.unlocked },
      ])
    ),

    divineUpgrades: Object.fromEntries(
      game.divineUpgrades.map((u) => [
        u.name,
        { bought: u.bought },
      ])
    ),
  };

  localStorage.setItem("cookieEmpirePro_Snapshot", JSON.stringify(data));
}

/* LOAD */

function load() {
  const s = localStorage.getItem("cookieEmpirePro_Snapshot");
  if (!s) return;

  const data = JSON.parse(s);

  if (data.cookies != null) game.cookies = BigInt(data.cookies);
  if (data.clickPower != null) game.clickPower = BigInt(data.clickPower);
  if (data.clickMultiplier != null) {
    game.clickMultiplier = BigInt(data.clickMultiplier);
  }

  if (data.mikan != null) game.mikan = BigInt(data.mikan);
  if (data.reincarnations != null) {
    game.reincarnations = Number(data.reincarnations);
  }
  
  if (data.reinClickMultiplier != null) game.reinClickMultiplier = BigInt(data.reinClickMultiplier);
  if (data.reinBuildingsMultiplier != null) game.reinBuildingsMultiplier = BigInt(data.reinBuildingsMultiplier);
  if (data.reinItemPriceMultiplier != null) game.reinItemPriceMultiplier = BigInt(data.reinItemPriceMultiplier);
  if (data.reinJajutsu != null) game.reinJajutsu = Number(data.reinJajutsu);

  if (data.stats) {
    if (data.stats.clicks != null) {
      game.stats.clicks = BigInt(data.stats.clicks);
    }
    if (data.stats.buildingsBought != null) {
      game.stats.buildingsBought = BigInt(data.stats.buildingsBought);
    }
    if (data.stats.upgradesBought != null) {
      game.stats.upgradesBought = BigInt(data.stats.upgradesBought);
    }
  }

  // 旧配列形式と新しい名前キー形式の両方に対応
  function savedEntry(saved, current, key) {
    if (!saved) return undefined;

    if (Array.isArray(saved)) {
      const index = current.indexOf(key);
      return index >= 0 ? saved[index] : undefined;
    }

    return saved[key];
  }

  // 建物
  for (const b of game.buildings) {
    const saved = savedEntry(
      data.buildings,
      game.buildings.map((x) => x.name),
      b.name
    );

    if (!saved) continue;

    if (saved.owned != null) b.owned = BigInt(saved.owned);
    if (saved.cost != null) b.cost = BigInt(saved.cost);
    if (saved.mps != null) b.mps = BigInt(saved.mps);
    if (saved.multiplier != null) {
      b.multiplier = BigInt(saved.multiplier);
    }
    if (saved.unlocked != null) b.unlocked = saved.unlocked;
  }

  // 通常アップグレード
  for (const u of game.upgrades) {
    const saved = savedEntry(
      data.upgrades,
      game.upgrades.map((x) => x.name),
      u.name
    );

    if (!saved) continue;

    if (saved.bought != null) u.bought = saved.bought;
    if (saved.unlocked != null) u.unlocked = saved.unlocked;
  }

  // アイテム
  for (const it of game.items) {
    const saved = savedEntry(
      data.items,
      game.items.map((x) => x.name),
      it.name
    );

    if (!saved) continue;

    if (saved.owned != null) it.owned = BigInt(saved.owned);
    if (saved.cost != null) it.cost = BigInt(saved.cost);
    if (saved.unlocked != null) it.unlocked = saved.unlocked;
  }

  for (const it of game.jajutsuItems) {
    const saved = savedEntry(
      data.jajutsuItems,
      game.jajutsuItems.map((x) => x.name),
      it.name
    );

    if (!saved) continue;

    if (saved.owned != null) it.owned = BigInt(saved.owned);
    if (saved.cost != null) it.cost = BigInt(saved.cost);
    if (saved.unlocked != null) it.unlocked = saved.unlocked;
  }

  // 実績はIDで管理
  for (const a of game.achievements) {
    const saved = savedEntry(
      data.achievements,
      game.achievements.map((x) => x.id),
      a.id
    );

    if (saved && saved.unlocked != null) {
      a.unlocked = saved.unlocked;
    }
  }

  // 神界アップグレード
  for (const u of game.divineUpgrades) {
    const saved = data.divineUpgrades?.[u.name];

    if (saved && saved.bought != null) {
      u.bought = saved.bought;
    }
  }
}

setInterval(save, 5000);

load();
render();
