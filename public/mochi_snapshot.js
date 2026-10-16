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

function flashJajutsuFailure() {
  cookie.classList.remove("jajutsu-failure-glow");

  // 連続して失敗した場合にもアニメーションを再実行する
  void cookie.offsetWidth;

  cookie.classList.add("jajutsu-failure-glow");

  cookie.addEventListener(
    "animationend",
    () => cookie.classList.remove("jajutsu-failure-glow"),
    { once: true }
  );
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

  // 神界アップグレード（通常アップグレードとは別配列）
  divineUpgrades: [
    {
      name: "日本の神の導き・I",
      cost: 1n,
      bought: false,
      effect() {
        game.reinClickMultiplier += 1000000n;
      },
      unlocked: true,
      desc: "クリック力を+100%する。",
      flavor: "日本の神から授けられた、最初の加護。",
    },
    {
      name: "日本の神の導き・II",
      cost: 5n,
      bought: false,
      effect() {
        game.reinClickMultiplier += 3000000n;
      },
      unlock() {
        return hasDivineUpgrade("日本の神の導き・I");
      },
      unlocked: false,
      desc: "クリック力を+300%する。",
      flavor: "輝く星のように闇を切り裂く。",
    },
    {
      name: "日本の神の導き・III",
      cost: 15n,
      bought: false,
      effect() {
        game.reinClickMultiplier += 5000000n;
      },
      unlock() {
        return hasDivineUpgrade("日本の神の導き・II");
      },
      unlocked: false,
      desc: "クリック力を+500%する。",
      flavor: "天空を駆ける、光の翼広げ。",
    },
    {
      name: "日本の神の導き・IV",
      cost: 50n,
      bought: false,
      effect() {
        game.reinClickMultiplier += 10000000n;
      },
      unlock() {
        return hasDivineUpgrade("日本の神の導き・III");
      },
      unlocked: false,
      desc: "クリック力を+1000%する。",
      flavor: "運命の戦士、その名を呼び覚ませ。",
    },
    {
      name: "日本の神の導き・V",
      cost: 250n,
      bought: false,
      effect() {
        game.reinClickMultiplier += 30000000n;
      },
      unlock() {
        return hasDivineUpgrade("日本の神の導き・IV");
      },
      unlocked: false,
      desc: "クリック力を+3000%する。",
      flavor: "Motchiy　Motchiy　日本の神！",
    },
    
    {
      name: "最高裁の導き・I",
      cost: 1n,
      bought: false,
      effect() {
        game.reinItemPriceMultiplier -= 100000n;
      },
      unlocked: true,
      desc: "アイテムの値段を-10%する。",
      flavor: "最高裁から授けられた、最初の加護。",
    },
    
    {
      name: "山本の導き・I",
      cost: 1n,
      bought: false,
      effect() {
        game.reinBuildingsMultiplier += 1000000n;
      },
      unlocked: true,
      desc: "建物の生産力を+100%する。",
      flavor: "山本から授けられた、最初の加護。",
    },
    
    {
      name: "邪術神の導き・I",
      cost: 1n,
      bought: false,
      effect() {
        game.reinJajutsu += 1;
      },
      unlocked: true,
      desc: "邪術度を+1%する。",
      flavor: "「ファーw」― さいほうへいき",
    },
    {
      name: "邪術神の導き・II",
      cost: 5n,
      bought: false,
      effect() {
        game.reinJajutsu += 4;
      },
      unlock() {
        return hasDivineUpgrade("邪術神の導き・I");
      },
      unlocked: false,
      desc: "邪術度を+4%する。",
      flavor: "「ところで邪術の使い方には慣れました？　アイテムタブから邪術を使えますよ！」― さいほうへいき",
    },
  ],

  stats: {
    clicks: 0n,
    buildingsBought: 0n,
    upgradesBought: 0n,
  },

  buildings: [
    {
      name: "バイトたくたん",
      cost: 30n,
      mps: 1n,
      owned: 0n,
      desc: "安価な労働力。時には機械に劣るかもしれないが、やはり人の手で作る餅が安心できる。",
      flavor: "ぜひ、Twitterで@2nStPvpFot9537をフォローしよう！",
    },
    {
      name: "農場",
      cost: 100n,
      mps: 4n,
      owned: 0n,
      desc: "餅を栽培する農場。とても効率よく餅の収穫ができる。",
      flavor:
        "餅米を田んぼで育てる？　そうではない、この餅は木になる実なのだ。",
    },
    {
      name: "工場",
      cost: 500n,
      mps: 20n,
      owned: 0n,
      desc: "餅を全自動で製造する工場。無数のマシンが超高速で餅をつく。",
      flavor: "多少の温かみを犠牲に、利益は増えていく。",
    },
    {
      name: "西日本",
      cost: 2000n,
      mps: 50n,
      owned: 0n,
      desc: "日本の西側の半分。東日本の価格が上がっても、こちらを安価で購入できる。",
      flavor: "西日本では餅は丸いらしい。",
    },
    {
      name: "東日本",
      cost: 2000n,
      mps: 50n,
      owned: 0n,
      desc: "日本の東側の半分。西日本の価格が上がっても、こちらを安価で購入できる。",
      flavor: "東日本では角餅が主流らしい。",
    },
    {
      name: "覚醒たくたん",
      cost: 10000n,
      mps: 300n,
      owned: 0n,
      desc: "覚醒した労働力。SSランクのたくたん。",
      flavor: "インフレはどこでも避けがたいものだ。",
    },
    {
      name: "超覚醒たくたん",
      cost: 50000n,
      mps: 1000n,
      owned: 0n,
      desc: "さらに覚醒した労働力。SSSランクに上がり、さらに生産性が上昇した。",
      flavor: "とはいえこのゲームはそもそもインフレを楽しむゲームではある。",
    },
    {
      name: "邪術ラボ",
      cost: 3000000n,
      mps: 2500n,
      owned: 0n,
      desc: "邪術ラボ。怪しげな術を用いて餅を作っているんだそう。",
      flavor: "「僕の【旧き氷域の邪術】の出番かな。……違う？」― さいほうへいき",
    },
    {
      name: "最高裁判所",
      cost: 5500000n,
      mps: 4000n,
      owned: 0n,
      desc: "最高裁判所では、裁判の結果を左右する賄賂に餅が使われる。",
      flavor: "「その収益の一部を君に分けてやるという訳さ」― 『最高裁』",
    },
    // 10
    {
      name: "餅工場惑星",
      cost: 10000000n,
      mps: 9500n,
      owned: 0n,
      desc: "いっそのこと新たに星を作る。広大な面積を生産に費やせる。",
      flavor:
        "人口爆発の問題を、居住地の提供と食料の生産という二つのアプローチで解決させた。",
    },
    {
      name: "ぺったんうさぎ",
      cost: 70000000n,
      mps: 12000n,
      owned: 0n,
      desc: "月で餅をついてくれるうさぎさんを雇おう。",
      flavor: "「……もう一度『月の観手』する必要はなさそうだね」― Motchiy",
    },
    {
      name: "バイト干支",
      cost: 250000000n,
      mps: 25000n,
      owned: 0n,
      desc: "そこそこ高価な労働力。その業績はたくたんの比ではない。",
      flavor: "「別にそのうち俺UZランクになるから！！」― たくたん",
    },
    {
      name: "裏・最高裁判所",
      cost: 600000000n,
      mps: 85000n,
      owned: 0n,
      desc: "地下闘技場とか闇オークションとかみたいなノリの裁判所。",
      flavor:
        "「こちらは権力者しか利用しないから、収益も相応に高いのだよ」― 『最高裁』",
    },
    {
      name: "山本の研究所",
      cost: 1550000000n,
      mps: 150000n,
      owned: 0n,
      desc: "パーリナイ山本の研究所。しかし何を研究しているのかはよく分からない。",
      flavor:
        "「餅の研究？　違うね、あくまでアレは副産物だ。少し薬品が残留しているかもしれないな」― パーリナイ山本",
    },
    {
      name: "西邪馬台国",
      cost: 4500000000n,
      mps: 450000n,
      owned: 0n,
      desc: "時は遡り、邪馬台国の西半分。",
      flavor: "卑弥呼もお餅で買収されてしまったのかもしれない。",
    },
    {
      name: "東邪馬台国",
      cost: 4500000000n,
      mps: 450000n,
      owned: 0n,
      desc: "時は遡り、邪馬台国の東半分。",
      flavor: "邪馬台国の統一は、武力ではなく餅によって成し遂げられた。",
    },
    {
      name: "Motchiyサーバー",
      cost: 10000000000n,
      mps: 1000000n,
      owned: 0n,
      desc: "このゲームをホストしているサーバー。購入すると、これより上位の施設がアンロックされる！",
      flavor: "「ゲームが気に入ったら寄付してね」― Motchiy",
    },
    {
      name: "[(r1)神域の二元庭(end)]",
      cost: 8225000000n,
      mps: 3400000n,
      owned: 0n,
      unlock() {
        return game.buildings[16].owned > 0;
      },
      unlocked: false,
      desc: "この世界をはるかな高みから監視し、操作する神の庭園。",
      flavor: "「ここが僕の家です」― さいほうへいき",
    },
    {
      name: "[(r1)真覚醒たくたん(end)]",
      cost: 23590000000n,
      mps: 28500000n,
      owned: 0n,
      unlock() {
        return game.buildings[16].owned > 0;
      },
      unlocked: false,
      desc: "超覚醒を更に超えた力を手にしたたくたん。",
      flavor: "しかし、それでも干支には届かない。",
    },
    // 20
    {
      name: "[(r1)真超覚醒たくたん(end)]",
      cost: 66550000000n,
      mps: 74900000n,
      owned: 0n,
      unlock() {
        return game.buildings[16].owned > 0;
      },
      unlocked: false,
      desc: "この力はもはや、Motchiyを遥かに超越せし高みに到達している。",
      flavor: "それでも干支のほうが強い。",
    },
    {
      name: "[(r1)虚数世界農場(end)]",
      cost: 156375000000n,
      mps: 208500000n,
      owned: 0n,
      unlock() {
        return game.buildings[16].owned > 0;
      },
      unlocked: false,
      desc: "存在しない虚数の世界に、広大な餅農場を築き上げる。",
      flavor:
        "唯一の懸念は、作られた餅も虚数でできているので、現実世界に持ち出せるか、という点。",
    },
    {
      name: "[(r1)量子化Motchiyサーバー(end)]",
      cost: 521850000000n,
      mps: 695800000n,
      owned: 0n,
      unlock() {
        return game.buildings[16].owned > 0;
      },
      unlocked: false,
      desc: "量子コンピュータを超越し、そもそものハードウェア自体が超量子により作られているサーバーマシン。",
      flavor:
        "ありとあらゆる並行世界の重ね合わせにより、無限の演算速度を得た。",
    },
    {
      name: "[(r1)終末邪術ラボ(end)]",
      cost: 2121850000000n,
      mps: 1395800000n,
      owned: 0n,
      unlock() {
        return game.buildings[16].owned > 0;
      },
      unlocked: false,
      desc: "終末を超越し、そのインスピレーションを以て再構築された邪術理論によるラボ。",
      flavor: "「【旧き氷域の邪術】の真髄、とくと見よ！」― さいほうへいき",
    },
    {
      name: "[(r1)覚醒干支(end)]",
      cost: 8171850000000n,
      mps: 3895800000n,
      owned: 0n,
      unlock() {
        return game.buildings[16].owned > 0;
      },
      unlocked: false,
      desc: "覚醒したバイト干支。覚醒たくたんのおよそ366万倍働く。",
      flavor: "「ふざけるなァアアア！」― たくたん",
    },
    {
      name: "[(r1)1847 シュトッベ(end)]",
      cost: 30985750000000n,
      mps: 9085000000n,
      owned: 0n,
      unlock() {
        return game.buildings[16].owned > 0;
      },
      unlocked: false,
      desc: "遠いところにある小惑星。Motchiyの加護を受けているとされる。",
      flavor:
        "一説によれば、Motchiyサーバーのマスターマシンがここにあるらしい。",
    },
    {
      name: "[(r1)『楽園』ガレージ(end)]",
      cost: 90000350000000n,
      mps: 19005000000n,
      owned: 0n,
      unlock() {
        return game.buildings[16].owned > 0;
      },
      unlocked: false,
      desc: "『チーム奉樂』の活動拠点……のレプリカ。面白い設備を整えれば、彼らが協力してくれるかもしれない。",
      flavor: "「面白そうだね！　いいんじゃない？」― ミングル",
    },
    {
      name: "[(r1)社員レノン(end)]",
      cost: 230000350000000n,
      mps: 78005000000n,
      owned: 0n,
      unlock() {
        return game.buildings[16].owned > 0;
      },
      unlocked: false,
      desc: "バイトではなく、正社員を雇う。とてもよく働くがサラリーは高い。",
      flavor: "本当によく働いているのだろうか？",
    },
    {
      name: "[(r1)虚構星臨装置(end)]",
      cost: 1070000350000000n,
      mps: 261005000000n,
      owned: 0n,
      unlock() {
        return game.buildings[16].owned > 0;
      },
      unlocked: false,
      desc: "虚構の上に作り上げられた偽りの『餅』を、真実へ昇華させる装置。",
      flavor: "",
    },
    {
      name: "[(r1)ハンドラ・ベルディヤの餅時計(end)]",
      cost: 3250000350000000n,
      mps: 881005000000n,
      owned: 0n,
      unlock() {
        return game.buildings[16].owned > 0;
      },
      unlocked: false,
      desc: "ハンドラ・ベルディヤ氏の作った時計。時間の進むエネルギーで餅を生産する。",
      flavor: "もはや水力も火力も不要！　時代は時間力だ。",
    },
    // 30
    {
      name: "[(r1)小規模なMod(end)]",
      cost: 8650000000000000n,
      mps: 2038440000000n,
      owned: 0n,
      unlock() {
        return game.buildings[16].owned > 0;
      },
      unlocked: false,
      desc: "世界に小規模な機能を追加するMod。バージョンは0.0.1α。",
      flavor: "注：0.0.2αで修正予定のバグが334個存在している。",
    },
    {
      name: "[(r1)超覚醒干支(end)]",
      cost: 29199500000000000n,
      mps: 777844000000n,
      owned: 0n,
      unlock() {
        return game.buildings[16].owned > 0;
      },
      unlocked: false,
      desc: "さらに覚醒した干支。圧倒的な労働力を見せる。",
      flavor:
        "干支は自分の生産力が高すぎて、機械がオーバーフローするのではないかと心配になった。",
    },
    {
      name: "[(r1)社員kaiha(end)]",
      cost: 165082800000000000n,
      mps: 3291844000000n,
      owned: 0n,
      unlock() {
        return game.buildings[16].owned > 0;
      },
      unlocked: false,
      desc: "小説の人。無数の仮想たくたんを物語から生み出し、強制労働させる。",
      flavor:
        "『たくたんは香辛料を体に入れ込む：Rewind：Rewind』",
    },
    {
      name: "[(r1)社員Rai(end)]",
      cost: 639882800000000000n,
      mps: 8086000000000n,
      owned: 0n,
      unlock() {
        return game.buildings[16].owned > 0;
      },
      unlocked: false,
      desc: "なんかすごそう、よく分からないけどすごそう。優先して採用したいけどよく分からない。",
      flavor:
        "一体ライって誰なんでしょう。",
    },
    {
      name: "[(r1)覚醒レノン(end)]",
      cost: 2225500000000000000n,
      mps: 19151000000000n,
      owned: 0n,
      unlock() {
        return game.buildings[16].owned > 0;
      },
      unlocked: false,
      desc: "UZ++++++ぐらいになったレノン。まさに最強。",
      flavor:
        "二十四時間どころか、一日あたり三十兆時間働く！",
    },
    {
      name: "[(r1)中規模なMod(end)]",
      cost: 9025000000000000000n,
      mps: 75351000000000n,
      owned: 0n,
      unlock() {
        return game.buildings[16].owned > 0;
      },
      unlocked: false,
      desc: "まあまあ規模の大きなチートの塊。バージョンは0.1.1。",
      flavor:
        "それでもインフレには抗えないかもしれない……。",
    },
    {
      name: "[(r1)超虚数ブーメラン星雲(end)]",
      cost: 31100000000000000000n,
      mps: 34070000000000n,
      owned: 0n,
      unlock() {
        return game.buildings[16].owned > 0;
      },
      unlocked: false,
      desc: "絶対零度を超越しすぎて逆にとてつもない高温になり、時の進みさえ引っ張られて異常に加速した宇宙の区域。",
      flavor:
        "熱中症になるので、アクエリアスを持っていこう。",
    },
    {
      name: "[(r1)終焉覚醒たくたん(end)]",
      cost: 100000000000000000000n,
      mps: 100000000000000n,
      owned: 0n,
      unlock() {
        return game.buildings[16].owned > 0;
      },
      unlocked: false,
      desc: "すべては彼の掌に収束する。",
      flavor:
        "干支では絶対に到達できない、すべての世界の力を吸収して最強へと至ったたくたん。しかし……？",
    },
  ],

  
  upgrades: [
    {
      name: "強化クリック",
      cost: 100n,
      bought: false,
      effect() {
        game.clickPower += 1n;
      },
      unlocked: true,
      desc: "クリック力+1。",
      flavor: "指を鍛え、筋肉を強化する。",
    },
    {
      name: "青銅の指",
      cost: 500n,
      bought: false,
      effect() {
        game.clickPower += 20n;
      },
      unlocked: true,
      desc: "クリック力+20。",
      flavor:
        "やはり人間には限界がある。鍛錬には見切りをつけ、素材を置き換えた。",
    },
    {
      name: "鉄の指",
      cost: 5000n,
      bought: false,
      effect() {
        game.clickPower += 50n;
      },
      unlocked: true,
      desc: "クリック力+50。",
      flavor: "より上質な素材へ。",
    },
    {
      name: "鋼の指",
      cost: 10000n,
      bought: false,
      effect() {
        game.clickPower += 150n;
      },
      unlocked: true,
      desc: "クリック力+150。",
      flavor: "頑丈な鋼は、今なお工業の根幹を占めている。",
    },
    {
      name: "ジュラルミンの指",
      cost: 30000n,
      bought: false,
      effect() {
        game.clickPower += 500n;
      },
      unlocked: true,
      desc: "クリック力+500。",
      flavor: "強度と軽度を十分に両立させたすごい金属。",
    },
    {
      name: "ダイヤモンドの指",
      cost: 70000n,
      bought: false,
      effect() {
        game.clickPower += 1250n;
      },
      unlocked: true,
      desc: "クリック力+1250。",
      flavor: "ドリルなどにも使われる最硬の物質。",
    },
    {
      name: "ウルトラダイヤモンドの指",
      cost: 120000n,
      bought: false,
      effect() {
        game.clickPower += 2500n;
      },
      unlocked: true,
      desc: "クリック力+2500。",
      flavor: "ダイヤモンドをさらに強化し、さらなる効率を手に入れた。",
    },
    {
      name: "ミラクルダイヤモンドの指",
      cost: 350000n,
      bought: false,
      effect() {
        game.clickPower += 7000n;
      },
      unlocked: true,
      desc: "クリック力+7000。",
      flavor: "空気との摩擦で発火するスピードにも耐えられる！",
    },
    {
      name: "邪術ダイヤモンドの指",
      cost: 4000000n,
      bought: false,
      effect() {
        game.clickPower += 13000n;
      },
      unlocked: true,
      desc: "クリック力+13000。",
      flavor: "さあ、科学に見切りをつけたら次は邪術だ。",
    },
    {
      name: "超邪術ダイヤモンドの指",
      cost: 7850000n,
      bought: false,
      effect() {
        game.clickPower += 20000n;
      },
      unlocked: true,
      desc: "クリック力+20000。",
      flavor: "【旧き氷域の邪術】に終わりはない。",
    },
    {
      name: "真邪術ダイヤモンドの指",
      cost: 45000000n,
      bought: false,
      unlock() {
        return game.clickPower > 400000;
      },
      effect() {
        game.clickPower += 85000n;
      },
      unlocked: false,
      desc: "クリック力+85000。",
      flavor: "邪術パワーが強すぎるため、聖なる者が使うと光と闇が両方備わり最強に見えるが、悪しき者が使うと逆に頭がおかしくなって死ぬ。",
    },
    {
      name: "ココロオブシディアンの指・疑似",
      cost: 300000000n,
      bought: false,
      unlock() {
        return game.clickPower > 8000000;
      },
      effect() {
        game.clickPower += 1000000n;
      },
      unlocked: false,
      desc: "クリック力+1000000。",
      flavor: "ココロオブシディアン……を模倣して作った疑似的な鉱物。まがい物だが、それでも十分すごい。",
    },
    {
      name: "ココロオブシディアンの指・真",
      cost: 2500000000n,
      bought: false,
      unlock() {
        return game.clickPower > 135000000;
      },
      effect() {
        game.clickPower += 7500000n;
      },
      unlocked: false,
      desc: "クリック力+7500000。",
      flavor: "本物のココロオブシディアンの指。ありとあらゆるこの世の神秘を強欲に喰らい、餅へと変化させる。",
    },

    
    {
      name: "ファースト・ギフトボックス",
      cost: 1000000n,
      bought: false,
      unlock() {
        return game.cookies >= 1000000n;
      },
      effect() {
        game.buildings.slice(0, 17).forEach(building => {
          building.multiplier += 50000n;
        });
      },
      unlocked: false,
      desc: "すべてのグレード1の設備の生産力+5%。",
      flavor: "餅作りをがんばっているあなたのために、誰かが用意してくれた小さなギフトボックス。白い箱に黄色のリボンが巻かれている。",
    },
    {
      name: "ジェントル・ギフトボックス",
      cost: 50000000n,
      bought: false,
      unlock() {
        return game.cookies >= 50000000n;
      },
      effect() {
        game.buildings.slice(0, 17).forEach(building => {
          building.multiplier += 300000n;
        });
      },
      unlocked: false,
      desc: "すべてのグレード1の設備の生産力+30%。",
      flavor: "餅作りをがんばっているあなたのために、誰かが用意してくれた小さなギフトボックス。緑の箱に赤色のリボンが巻かれている。",
    },
    {
      name: "ウォーム・ギフトボックス",
      cost: 750000000n,
      bought: false,
      unlock() {
        return game.cookies >= 750000000n;
      },
      effect() {
        game.buildings.slice(0, 17).forEach(building => {
          building.multiplier += 750000n;
        });
      },
      unlocked: false,
      desc: "すべてのグレード1の設備の生産力+75%。",
      flavor: "餅作りをがんばっているあなたのために、誰かが用意してくれた小さなギフトボックス。黄色の箱に白色のリボンが巻かれている。",
    },
    {
      name: "[(r1)アミティ・ギフトボックス(end)]",
      cost: 10000000000000n,
      bought: false,
      unlock() {
        return game.cookies >= 10000000000000n;
      },
      effect() {
        game.buildings.slice(0, 40).forEach(building => {
          building.multiplier += 750000n;
        });
      },
      unlocked: false,
      desc: "すべてのグレード1と2の設備の生産力+75%。",
      flavor: "餅作りをがんばっているあなたのために、誰かが用意してくれた綺麗なギフトボックス。桃色の箱に白色のリボンが巻かれている。",
    },
    {
      name: "[(r1)ビリーブ・ギフトボックス(end)]",
      cost: 10000000000000000n,
      bought: false,
      unlock() {
        return game.cookies >= 10000000000000000n;
      },
      effect() {
        game.buildings.slice(0, 40).forEach(building => {
          building.multiplier += 1200000n;
        });
      },
      unlocked: false,
      desc: "すべてのグレード1と2の設備の生産力+120%。",
      flavor: "餅作りをがんばっているあなたのために、誰かが用意してくれた綺麗なギフトボックス。青色の箱に金色のリボンが巻かれている。",
    },
  
    {
      name: "たくたん改造",
      cost: 1000n,
      bought: false,
      unlock() {
        return game.buildings[0].owned > 0;
      },
      effect() {
        game.buildings[0].mps += 2n;
      },
      unlocked: false,
      desc: "バイトたくたんの生産性+2。",
      flavor: "たくたんはサイボーグになった。",
    },
    {
      name: "たくたん魔改造",
      cost: 10000n,
      bought: false,
      unlock() {
        return hasUpgrade("たくたん改造");
      },
      effect() {
        game.buildings[0].mps += 8n;
      },
      unlocked: false,
      desc: "バイトたくたんの生産性+8。",
      flavor: "さらに高性能な設備を取り入れよう。",
    },
    {
      name: "たくたん絶改造",
      cost: 100000n,
      bought: false,
      unlock() {
        return hasUpgrade("たくたん魔改造");
      },
      effect() {
        game.buildings[0].mps += 128n;
      },
      unlocked: false,
      desc: "バイトたくたんの生産性+128。",
      flavor: "かなりの部分がメカメカしくなっている。",
    },
    {
      name: "たくたん爆改造",
      cost: 1000000n,
      bought: false,
      unlock() {
        return hasUpgrade("たくたん絶改造");
      },
      effect() {
        game.buildings[0].mps += 1024n;
      },
      unlocked: false,
      desc: "バイトたくたんの生産性+1024。",
      flavor: "世の中には『テセウスの船』という話があるが……。",
    },
    {
      name: "たくたん神改造",
      cost: 100000000n,
      bought: false,
      unlock() {
        return hasUpgrade("たくたん爆改造");
      },
      effect() {
        game.buildings[0].mps += 32768n;
      },
      unlocked: false,
      desc: "バイトたくたんの生産性+32768。",
      flavor: "もはや人造の天使とでもいうべき姿だ。",
    },
    {
      name: "たくたん極改造",
      cost: 10000000000n,
      bought: false,
      unlock() {
        return hasUpgrade("たくたん神改造");
      },
      effect() {
        game.buildings[0].mps += 1048576n;
      },
      unlocked: false,
      desc: "バイトたくたんの生産性+1048576。",
      flavor: "餅作りに特化した金属塊になりつつある。",
    },
    {
      name: "たくたん天改造",
      cost: 1000000000000n,
      bought: false,
      unlock() {
        return hasUpgrade("たくたん極改造");
      },
      effect() {
        game.buildings[0].mps += 16777216n;
      },
      unlocked: false,
      desc: "バイトたくたんの生産性+16777216。",
      flavor: "もはや人間とは呼べないのかもしれない。",
    },
    {
      name: "たくたん超改造",
      cost: 100000000000000n,
      bought: false,
      unlock() {
        return hasUpgrade("たくたん天改造");
      },
      effect() {
        game.buildings[0].mps += 268435456n;
      },
      unlocked: false,
      desc: "バイトたくたんの生産性+268435456。",
      flavor: "脳にまで改造が及ぶ。たくたんの自我は薄れている。",
    },
    {
      name: "たくたん廻改造",
      cost: 10000000000000000n,
      bought: false,
      unlock() {
        return hasUpgrade("たくたん超改造");
      },
      effect() {
        game.buildings[0].mps += 8589934592n;
      },
      unlocked: false,
      desc: "バイトたくたんの生産性+8589934592。",
      flavor: "ついに全てのパーツが機械化してしまった。",
    },
    {
      name: "たくたん黎改造",
      cost: 1000000000000000000n,
      bought: false,
      unlock() {
        return hasUpgrade("たくたん廻改造");
      },
      effect() {
        game.buildings[0].mps += 137438953472n;
      },
      unlocked: false,
      desc: "バイトたくたんの生産性+137438953472。",
      flavor: "はじめから餅生産機を作るのと大差ないのでは？",
    },
    {
      name: "たくたん改造：Rewind",
      cost: 1000000000000000000000n,
      bought: false,
      unlock() {
        return hasUpgrade("たくたん黎改造");
      },
      effect() {
        game.buildings[0].mps += 2199023255552n;
      },
      unlocked: false,
      desc: "バイトたくたんの生産性+2199023255552。",
      flavor: "香辛料を体に入れ込む。",
    },
    
    // 農場
    {
      name: "スーパー自動餅トラクター",
      cost: 550n,
      bought: false,
      unlock() {
        return game.buildings[1].owned >= 1;
      },
      effect() {
        game.buildings[1].mps += 3n;
      },
      unlocked: false,
      desc: "農場の生産性+3。",
      flavor: "自動でガシャンガシャンと餅を耕してくれる耕運機。",
    },
    {
      name: "ウルトラ自動餅トラクター",
      cost: 25000n,
      bought: false,
      unlock() {
        return hasUpgrade("スーパー自動餅トラクター");
      },
      effect() {
        game.buildings[1].mps += 120n;
      },
      unlocked: false,
      desc: "農場の生産性+120。",
      flavor: "とんでもない拘束で耕せる耕運機。その最高速度は亜音速にまで至る。",
    },

    // 工場
    {
      name: "作業用フィジカルAI",
      cost: 1200n,
      bought: false,
      unlock() {
        return game.buildings[2].owned >= 1;
      },
      effect() {
        game.buildings[2].mps += 15n;
      },
      unlocked: false,
      desc: "工場の生産性+15。",
      flavor: "最新の技術を投入し、生産ラインを効率化する。",
    },
    {
      name: "スーパーバイザーフィジカルAI",
      cost: 38000n,
      bought: false,
      unlock() {
        return hasUpgrade("作業用フィジカルAI");
      },
      effect() {
        game.buildings[2].mps += 180n;
      },
      unlocked: false,
      desc: "工場の生産性+180。",
      flavor: "工場は見違えるほど高密度に、そして驚くほどに効率化。",
    },
    
    // 惑星餅工場
    {
      name: "巨大惑星エアーパンピング",
      cost: 23000000n,
      bought: false,
      unlock() {
        return game.buildings[9].owned >= 1;
      },
      effect() {
        game.buildings[9].multiplier += 500000n;
      },
      unlocked: false,
      desc: "餅工場惑星の生産性+50%。",
      flavor: "惑星を拡大し、生産面積をさらに確保する。",
    },

    // 覚醒たくたん・超覚醒たくたん
    {
      name: "餅つきの秘伝書",
      cost: 50000n,
      bought: false,
      unlock() {
        return (game.buildings[5].owned >= 1) && (game.buildings[6].owned >= 1);
      },
      effect() {
        game.buildings[5].multiplier += 300000n;
        game.buildings[6].multiplier += 300000n;
      },
      unlocked: false,
      desc: "覚醒たくたん、超覚醒たくたんの生産性+30%。",
      flavor: "餅つきの性能を向上させることができる秘伝書。",
    },
    {
      name: "餅つきの秘伝書・真",
      cost: 150000n,
      bought: false,
      unlock() {
        return hasUpgrade("餅つきの秘伝書");
      },
      effect() {
        game.buildings[5].multiplier += 1000000n;
        game.buildings[6].multiplier += 1000000n;
      },
      unlocked: false,
      desc: "覚醒たくたん、超覚醒たくたんの生産性+100%。",
      flavor: "餅つきの性能を大きく向上させることができる秘伝書。",
    },
  
    // 邪術ラボ
    {
      name: "超高性能邪術管理装置",
      cost: 4500000n,
      bought: false,
      unlock() {
        return game.buildings[7].owned >= 1;
      },
      effect() {
        game.buildings[7].multiplier += 300000n;
      },
      unlocked: false,
      desc: "邪術ラボの生産性+30%。",
      flavor: "素晴らしい設備だ！　すでにある邪術のメカニズムを超高性能なコンピュータで管理することで、新たな邪術の研究が非常に捗るだろう。",
    },
    {
      name: "超高性能邪ジェネレーティヴAI",
      cost: 7500000n,
      bought: false,
      unlock() {
        return hasUpgrade("超高性能邪術管理装置");
      },
      effect() {
        game.buildings[7].multiplier += 1500000n;
      },
      unlocked: false,
      desc: "邪術ラボの生産性+150%。",
      flavor: "あらゆるパターンを学習した最強のAIが、新たな邪術を創り出す。さいほうへいきはリストラの危機にある……。",
    },

    // ぺったんうさぎ
    {
      name: "月神の加護",
      cost: 135000000n,
      bought: false,
      unlock() {
        return game.buildings[10].owned >= 1;
      },
      effect() {
        game.buildings[10].multiplier += 750000n;
      },
      unlocked: false,
      desc: "ぺったんうさぎの生産性+75%。",
      flavor: "遠い異世界から、月に豊かな実りの加護が訪れた。",
    },

    // Motchiyサーバー
    {
      name: "究極クラスターアップグレードピース",
      cost: 30000000000n,
      bought: false,
      unlock() {
        return game.buildings[16].owned >= 1;
      },
      effect() {
        game.buildings[16].multiplier += 750000n;
      },
      unlocked: false,
      desc: "Motchiyサーバーの生産性+75%。",
      flavor: "Motchiyサーバーの処理をさらに高速化させるリソースの爆増増築。",
    },
    {
      name: "Motel™ 1024",
      cost: 250000000000n,
      bought: false,
      unlock() {
        return hasUpgrade("究極クラスターアップグレードピース");
      },
      effect() {
        game.buildings[16].multiplier += 1350000n;
      },
      unlocked: false,
      desc: "Motchiyサーバーの生産性+135%。",
      flavor: "この世でもっとも性能の高いCPUを開発してみる。",
    },
    {
      name: "Motel™ 9999999",
      cost: 250000000000n,
      bought: false,
      unlock() {
        return (hasUpgrade("Motel™ 1024") && game.buildings[21].owned >= 1);
      },
      effect() {
        game.buildings[16].multiplier += 1000000n;
        game.buildings[21].multiplier += 1000000n;
      },
      unlocked: false,
      desc: "Motchiyサーバー、量子化Motchiyサーバーの生産性+100%。",
      flavor: "量子世界に適応した最高の処理装置！",
    },
    
    {
      name: "[(r1)風光語りの羽ペン(end)]",
      cost: 230000000000n,
      bought: false,
      unlock() {
        return game.buildings[20].owned >= 1;
      },
      effect() {
        game.buildings[20].multiplier += 1150000n;
      },
      unlocked: false,
      desc: "虚数世界農場の生産性+115%。",
      flavor: "虚構と現実を効率よく同調させる装置。効果てきめんだが、使い方を間違えると操作者も虚構の住民にされかねない危険物。",
    },
    
    {
      name: "[(r1)原始回帰(end)]",
      cost: 1000000000000000000000000n,
      bought: false,
      unlock() {
        return (game.buildings[0].owned >= 1) && (game.buildings[5].owned >= 1) && (game.buildings[6].owned >= 1) && (game.buildings[18].owned >= 1) && (game.buildings[19].owned >= 1) && (game.buildings[36].owned >= 1);
      },
      effect() {
        game.buildings[0].multiplier += 50000000n;
        
      },
      unlocked: false,
      desc: "たくたんの生産性+5000%。ただし、[(disad)覚醒、超覚醒、真覚醒、真超覚醒、終焉覚醒たくたんの生産性-1000%(end)]。",
      flavor: "すべての派生した力を、最初のたくたんへと巻き戻す。ただし倍率が下がりまくるので、x10以上になっていない場合は……。",
    },
  ],

  items: [
    {
      name: "たくたんフロストコーヒー",
      cost: 500n,
      owned: 0n,
      effect() {
        game.clickPower += 2n;
      },
      unlocked: true,
      desc: "クリック力+2。",
      flavor: "たくたんは甘味料を体に入れ込む。",
    },
    {
      name: "アーチャウ茶",
      cost: 4000n,
      owned: 0n,
      unlock() {
        return getClickPower() >= 100n;
      },
      effect() {
        game.clickPower += 16n;
      },
      unlocked: false,
      desc: "クリック力+16。",
      flavor: "Tenorで『Ahchaw Tea』と検索してみよう。",
    },
    {
      name: "無調整竹ミルク",
      cost: 30000n,
      owned: 0n,
      unlock() {
        return getClickPower() >= 1000n;
      },
      effect() {
        game.clickPower += 128n;
      },
      unlocked: false,
      desc: "クリック力+128。",
      flavor: "たけのこ？　違う、普通に竹だ。硬い竹。",
    },
    {
      name: "竹カフェオレフラッペ",
      cost: 250000n,
      owned: 0n,
      unlock() {
        return getClickPower() >= 10000n;
      },
      effect() {
        game.clickPower += 1024n;
      },
      unlocked: false,
      desc: "クリック力+1024。",
      flavor: "無調整竹ミルクよりもはるかに味がマシになった。",
    },
    {
      name: "Motchiyのペースト",
      cost: 1000000n,
      owned: 0n,
      unlock() {
        return getClickPower() >= 50000n;
      },
      effect() {
        game.clickPower += 8192n;
      },
      unlocked: false,
      desc: "クリック力+8192。",
      flavor: "鯖主を潰してペーストにするとは、なんという不敬。",
    },
    {
      name: "液状化最高裁",
      cost: 1850000n,
      owned: 0n,
      unlock() {
        return getClickPower() >= 300000n;
      },
      effect() {
        game.clickPower += 16384n;
      },
      unlocked: false,
      desc: "クリック力+16384。",
      flavor: "どこかの宗教が修行に使うらしい。",
    },
    {
      name: "液状化最高裁EXTRA",
      cost: 7000000n,
      owned: 0n,
      unlock() {
        return getClickPower() >= 1000000n;
      },
      effect() {
        game.clickPower += 65536n;
      },
      unlocked: false,
      desc: "クリック力+65536。",
      flavor:
        "ふつうの液状化最高裁に慣れていないと、これに手を出してはいけない……。",
    },

    {
      name: "星声",
      cost: 1000n,
      owned: 0n,
      unlock() {
        return game.buildings[0].owned >= 1;
      },
      effect() {
        game.buildings[0].mps += 1n;
      },
      unlocked: false,
      desc: "バイトたくたんの生産性+1。",
      flavor: "カカロの凸を進めよう。",
    },
    {
      name: "月相",
      cost: 10000n,
      owned: 0n,
      unlock() {
        return game.buildings[0].owned >= 1;
      },
      effect() {
        game.buildings[0].mps += 3n;
      },
      unlocked: false,
      desc: "バイトたくたんの生産性+3。",
      flavor: "ついでに凌陽も。",
    },
    
    {
      name: "無償ジュエル",
      cost: 30000n,
      owned: 0n,
      unlock() {
        return (game.buildings[0].owned >= 1) && (game.buildings[5].owned >= 1) && (game.buildings[6].owned >= 1);
      },
      effect() {
        game.buildings[0].multiplier += 5000n;
        game.buildings[5].multiplier += 30000n;
        game.buildings[6].multiplier += 30000n;
      },
      unlocked: false,
      desc: "バイトたくたんの生産性+0.5%、覚醒たくたんと超覚醒たくたんの生産性+3%。",
      flavor: "対価を支払ってたらそれは無償石ではないのでは？",
    },
    {
      name: "有償ジュエル",
      cost: 50000n,
      owned: 0n,
      unlock() {
        return (game.buildings[0].owned >= 1) && (game.buildings[5].owned >= 1) && (game.buildings[6].owned >= 1);
      },
      effect() {
        game.buildings[0].multiplier += 5000n;
        game.buildings[5].multiplier += 50000n;
        game.buildings[6].multiplier += 50000n;
      },
      unlocked: false,
      desc: "バイトたくたんの生産性+0.5%、覚醒たくたんと超覚醒たくたんの生産性+5%。",
      flavor: "まあ時は金なりと言いますしね。",
    },
    {
      name: "凌陽ぬいぐるみ",
      cost: 150000n,
      owned: 0n,
      unlock() {
        return (game.buildings[0].owned >= 1) && (game.buildings[5].owned >= 1) && (game.buildings[6].owned >= 1);
      },
      effect() {
        game.buildings[0].multiplier += 10000n;
        game.buildings[5].multiplier += 80000n;
        game.buildings[6].multiplier += 80000n;
      },
      unlocked: false,
      desc: "バイトたくたんの生産性+1%、覚醒たくたんと超覚醒たくたんの生産性+8%。",
      flavor: "凌陽、鳴潮におけるたくたんの推しキャラのひとり。……あれ違ったっけ？",
    },
    
    {
      name: "B級最高裁コイン",
      cost: 7000000n,
      owned: 0n,
      unlock() {
        return game.buildings[8].owned >= 1;
      },
      effect() {
        game.buildings[8].multiplier += 30000n;
      },
      unlocked: false,
      desc: "最高裁判所の生産性+3%。",
      flavor: "まあまあな価値があるキラキラしたコイン。たくさん集めると、裁判で有利になれるらしい。",
    },
    {
      name: "A級最高裁コイン",
      cost: 20000000n,
      owned: 0n,
      unlock() {
        return game.buildings[8].owned >= 1;
      },
      effect() {
        game.buildings[8].multiplier += 70000n;
      },
      unlocked: false,
      desc: "最高裁判所の生産性+7%。",
      flavor: "けっこうな価値のあるコイン。少ない枚数でも持っていれば判決が有利になるとされ、裏社会では常に高値で取引される。",
    },
    
    {
      name: "金のニンジン",
      cost: 50000000n,
      owned: 0n,
      unlock() {
        return game.buildings[10].owned >= 1;
      },
      effect() {
        game.buildings[10].multiplier += 50000n;
      },
      unlocked: false,
      desc: "金のニンジンの生産性+5%。",
      flavor: "キラキラしたニンジン。すごそうに見えるが、食べても安全なのか不安にも思えてくる。",
    },
    
    {
      name: "S級最高裁コイン",
      cost: 550000000n,
      owned: 0n,
      unlock() {
        return game.buildings[12].owned >= 1;
      },
      effect() {
        game.buildings[12].multiplier += 50000n;
      },
      unlocked: false,
      desc: "裏・最高裁判所の生産性+5%。",
      flavor: "非常に高い価値を持つコイン、一般販売がされる機会は少ない。支払えばほぼ確実に無罪になる。",
    },
    {
      name: "SSS級最高裁コイン",
      cost: 1000000000n,
      owned: 0n,
      unlock() {
        return game.buildings[12].owned >= 1;
      },
      effect() {
        game.buildings[12].multiplier += 120000n;
      },
      unlocked: false,
      desc: "裏・最高裁判所の生産性+12%。",
      flavor: "司法を一日間全部奪えるぐらいすごいコイン。",
    },
    
    {
      name: "なんかすごそうなカフェオレ",
      cost: 2750000000n,
      owned: 0n,
      unlock() {
        return game.buildings[13].owned >= 1;
      },
      effect() {
        game.buildings[13].multiplier += 120000n;
      },
      unlocked: false,
      desc: "山本の研究所の生産性+12%。",
      flavor: "山本の研究所で作られた、飲めばたちどころに心拍数が五千を超えるすごいカフェオレ。普通の人が飲めばしぬ。",
    },
    {
      name: "なんか怪しいチップ",
      cost: 2750000000n,
      owned: 0n,
      unlock() {
        return game.buildings[13].owned >= 1;
      },
      effect() {
        game.buildings.slice(0, 14).forEach(building => {
          building.multiplier += 50000n;
        });
      },
      unlocked: false,
      desc: "山本の研究所以前のすべての設備の生産性+5%。",
      flavor: "山本の研究所で作られた、紫色に輝く謎のチップ。見るからにヤバそうだが、性能アップが図れるらしい……壊れたりしないよね？",
    },
    
    {
      name: "[(r1)王造の相反酒(end)]",
      cost: 6000000000n,
      owned: 0n,
      unlock() {
        return game.buildings[17].owned >= 1;
      },
      effect() {
        game.buildings[17].multiplier += 50000n;
      },
      unlocked: false,
      desc: "神域の二元庭の生産性+5%。",
      flavor: "「酒ですよ。市販の消毒液を水で薄めただけだけど酒ですよ」― さいほうへいき",
    },
    
    {
      name: "[(r1)ショアキーパーぬいぐるみ(end)]",
      cost: 20000000000n,
      owned: 0n,
      unlock() {
        return game.buildings[18].owned >= 1;
      },
      effect() {
        game.buildings[18].multiplier += 50000n;
      },
      unlocked: false,
      desc: "真覚醒たくたんの生産性+5%。",
      flavor: "たくたんが自身の妻などと称している人。それについてはともかく、ぬいぐるみをあげれば喜んでくれるに違いない。",
    },
    
    {
      name: "[(r1)カルテジアぬいぐるみ(end)]",
      cost: 50000000000n,
      owned: 0n,
      unlock() {
        return game.buildings[19].owned >= 1;
      },
      effect() {
        game.buildings[19].multiplier += 50000n;
      },
      unlocked: false,
      desc: "真超覚醒たくたんの生産性+5%。",
      flavor: "たくたんが自身の愛娘などと称している人。それについてはともかく（ry",
    },

    {
      name: "[(r1)旧き氷水(end)]",
      cost: 1500000000000n,
      owned: 0n,
      unlock() {
        return game.buildings[22].owned > 0;
      },
      effect() {
        game.buildings[22].multiplier += 50000n;
      },
      unlocked: false,
      desc: "終末邪術ラボの生産性+5%。",
      flavor:
        "禁忌の邪術を利用して製造された、ひんやり冷たい氷水。捻挫した時に当てておけば、痛みがすこし和らぐ。",
    },
    {
      name: "[(r1)旧き銀雪(end)]",
      cost: 3500000000000n,
      owned: 0n,
      unlock() {
        return game.buildings[22].owned > 0;
      },
      effect() {
        game.clickMultiplier += 40000n;
        game.buildings[22].multiplier += 40000n;
      },
      unlocked: false,
      desc: "クリック力、終末邪術ラボの生産性+4%。",
      flavor:
        "禁忌の邪術を利用して製造された、真っ白でフワフワの雪。スキーにとても向いている上質な素材だが、製造コストの問題でスキー場を賄うのは難しそうだ。",
    },
    
    {
      name: "[(r1)はちみつ(end)]",
      cost: 600000000000n,
      owned: 0n,
      unlock() {
        return game.buildings[23].owned > 0;
      },
      effect() {
        game.buildings[23].multiplier += 50000n;
        game.buildings[5].multiplier -= 30000n;
        game.buildings[6].multiplier -= 30000n;
      },
      unlocked: false,
      desc: "覚醒干支の生産性+5%。ただし、[(disad)覚醒たくたん、超覚醒たくたんの生産性-3%(end)]。",
      flavor:
        "「はちみつちょうだい」― 干支",
    },
    
    {
      name: "[(r1)列車用備長炭キット(end)]",
      cost: 18500000000000n,
      owned: 0n,
      unlock() {
        return game.buildings[24].owned > 0;
      },
      effect() {
        game.buildings[24].multiplier += 50000n;
      },
      unlocked: false,
      desc: "1847 シュトッベの生産性+5%。",
      flavor:
        "地球、餅工場惑星、シュトッベの間を行き来する銀河鉄道のよりよい燃料。樫の木一本を備長炭にするだけで、三日間の航行が可能になる。",
    },
    
    {
      name: "[(r1)ファイターコイン2750枚(end)]",
      cost: 150000000000000n,
      owned: 0n,
      unlock() {
        return game.buildings[26].owned > 0;
      },
      effect() {
        game.buildings[26].multiplier += 50000n;
      },
      unlocked: false,
      desc: "社員レノンの生産性+5%。",
      flavor:
        "追加ファイターが購入できるコイン。瞬獄殺。",
    },

    {
      name: "ヌサ・ペニダ島クッキー",
      cost: 10000n,
      owned: 0n,
      unlock() {
        return game.buildings[0].cost >= 50000n;
      },
      effect() {
        game.buildings[0].cost = (game.buildings[0].cost * 95n - 100n) / 100n;
      },
      unlocked: false,
      desc: "バイトたくたんの現在価格-5%、さらに-100。",
      flavor:
        "インドネシアにあるヌサ・ペニダ島の形をもしたクッキー。どうしてこの島がチョイスされたのかはわからない。",
    },
    {
      name: "大ニコバル島クッキー",
      cost: 30000n,
      owned: 0n,
      unlock() {
        return game.buildings[1].cost >= 150000n;
      },
      effect() {
        game.buildings[1].cost = (game.buildings[1].cost * 95n - 100n) / 100n;
      },
      unlocked: false,
      desc: "農場の現在価格-5%、さらに-100。",
      flavor: "インド領最南端の島、それが大ニコバル島。",
    },
    {
      name: "フリンダース島クッキー",
      cost: 90000n,
      owned: 0n,
      unlock() {
        return game.buildings[2].cost >= 450000n;
      },
      effect() {
        game.buildings[2].cost = (game.buildings[2].cost * 95n - 100n) / 100n;
      },
      unlocked: false,
      desc: "工場の現在価格-5%、さらに-100。",
      flavor: "オーストラリア領の島、人口はおよそ千人らしい。",
    },

    {
      name: "[(horaku)『[(ruby)雪色の火花[(rt)ホワイト・コーラス(/rt)](/ruby)]』(end)]",
      cost: 100000000000000000n,
      owned: 0n,
      unlock() {
        return game.buildings[25].owned > 0;
      },
      effect() {
        game.clickMultiplier += 30000n;
      },
      unlocked: false,
      desc: "特別なカクテル。クリック力+3%。",
      flavor:
        "「ここには面白いものがいっぱいあるね！　ためしに竹ミルクでカクテルを作ってみたけど」― ミングル",
    },
    {
      name: "[(horaku)『[(ruby)コトバの質量[(rt)ネイビー・ダイアリー(/rt)](/ruby)]』(end)]",
      cost: 100000000000000000n,
      owned: 0n,
      unlock() {
        return game.buildings[25].owned > 0;
      },
      effect() {
        game.buildings[16].multiplier += 250000n;
      },
      unlocked: false,
      desc: "特別なカクテル。Motchiyサーバーの生産性+25%。",
      flavor:
        "ミングルは液状化最高裁を用いてカクテルを作ろうとしていたが、さすがに制止が入ったので無難な材料に落ち着いた。",
    },
    {
      name: "[(horaku)『[(ruby)楽園に降る霧[(rt)フォー・レイン(/rt)](/ruby)]』(end)]",
      cost: 1500000000000000000n,
      owned: 0n,
      unlock() {
        return game.buildings[25].owned > 0;
      },
      effect() {
        game.buildings[25].multiplier += 300000n;
      },
      unlocked: false,
      desc: "特別なカクテル。『楽園』ガレージの生産性+30%。",
      flavor: "「僕らにとって特別な味わいです、と言って僕はグラスを傾けました」― ボンファイア・レノックス",
    },
    
    {
      name: "[(disad)ガドリニウムの匣(end)]",
      cost: 100n,
      owned: 0n,
      effect() {
      },
      unlocked: true,
      desc: "テスト用のアイテム。",
      flavor: "ガドリニウム。原子番号64番、元素記号Gd。名前の由来は研究者ヨハン・ガドリンから。",
    },
    {
      name: "[(disad)マイトネリウムの匣(end)]",
      cost: 100n,
      owned: 0n,
      effect() {
      },
      unlocked: true,
      desc: "テスト用のアイテム。",
      flavor: "マイトネリウム。原子番号109番、元素記号Mt。名前の由来は研究者リーゼ・マイトナーから。",
    },
  ],

  jajutsuItems: [
    {
      name: "[(disad)錬成：巡回する橋(end)]",
      cost: 100n,
      owned: 0n,
      baseJajutsu: -999,
      effect() {
        alert("グッジョブ！　成功したよ");
      },
      unlocked: true,
      desc: "テスト用のアイテム。",
      flavor: "なぜか、なぜか、なぜか。問う声は消えずにいる。",
    },
    {
      name: "[(disad)錬成：枢軸の種(end)]",
      cost: 100n,
      owned: 0n,
      baseJajutsu: 50,
      effect() {
        alert("グッジョブ！　成功したよ");
      },
      unlocked: true,
      desc: "テスト用のアイテム。",
      flavor: "もしもその種が、滅びゆく国に根ざしたならば――。",
    },
    {
      name: "[(disad)錬成：均衡の筆(end)]",
      cost: 100n,
      owned: 0n,
      baseJajutsu: 100,
      effect() {
        alert("グッジョブ！　成功したよ");
      },
      unlocked: true,
      desc: "テスト用のアイテム。",
      flavor: "あるいは、それを『希望』と呼ぼう。",
    },
  ],

  achievements: [
    {
      id: "click1",
      name: "ファーストペンギン",
      desc: "1回クリックする。",
      unlocked: false,
    },
    {
      id: "click10",
      name: "バッチ！",
      desc: "10回クリックする。",
      unlocked: false,
    },
    {
      id: "click100",
      name: "「まだまだ序の口」",
      desc: "100回クリックする。",
      unlocked: false,
    },
    {
      id: "click314",
      name: "丸餅",
      desc: "314回クリックする。",
      unlocked: false,
    },
    {
      id: "click777",
      name: "ラッキー！",
      desc: "777回クリックする。",
      unlocked: false,
    },
    {
      id: "click1000",
      name: "「個人消費には向かない……」",
      desc: "1000回クリックする。",
      unlocked: false,
    },
    {
      id: "click10000",
      name: "村ひとつ養える",
      desc: "10000回クリックする。",
      unlocked: false,
    },
    {
      id: "click65535",
      name: "16bitの限界",
      desc: "65535回クリックする。",
      unlocked: false,
    },
    {
      id: "click100000",
      name: "腱鞘炎もいとわない",
      desc: "100000回クリックする。",
      unlocked: false,
    },
    {
      id: "click1000000",
      name: "「クリックに人生を費やした」",
      desc: "1000000回クリックする。",
      unlocked: false,
    },

    {
      id: "own_takutan",
      name: "雇用契約",
      desc: "たくたんを雇用する。",
      unlocked: false,
    },
    {
      id: "own_takutan10",
      name: "いい企業",
      desc: "たくたんを10人雇用する。",
      unlocked: false,
    },
    {
      id: "own_takutan101",
      name: "大企業！",
      desc: "たくたんを101人雇用する。",
      unlocked: false,
    },

    {
      id: "own_farm",
      name: "クワとスキ",
      desc: "農園を購入する。",
      unlocked: false,
    },
    {
      id: "own_farm10",
      name: "大規模農家",
      desc: "農園を10個購入する。",
      unlocked: false,
    },
    {
      id: "own_farm100",
      name: "「土地が足りない……」",
      desc: "農園を100個購入する。",
      unlocked: false,
    },

    {
      id: "own_factory",
      name: "産業革命",
      desc: "工場を購入する。",
      unlocked: false,
    },
    {
      id: "own_factory10",
      name: "立派な産業都市",
      desc: "工場を10個購入する。",
      unlocked: false,
    },
    {
      id: "own_factory100",
      name: "「環境問題は？」",
      desc: "工場を100個購入する。",
      unlocked: false,
    },

    {
      id: "own_west",
      name: "「西風の果てで」",
      desc: "西日本を購入する。",
      unlocked: false,
    },
    {
      id: "own_west10",
      name: "超えて行く・西",
      desc: "西日本を10個購入する。",
      unlocked: false,
    },
    {
      id: "own_east",
      name: "「極東からの餅」",
      desc: "東日本を購入する。",
      unlocked: false,
    },
    {
      id: "own_east10",
      name: "超えて行く・東",
      desc: "西日本を10個購入する。",
      unlocked: false,
    },

    {
      id: "own_sstakutan",
      name: "インフレの予兆",
      desc: "覚醒たくたんを雇用する。",
      unlocked: false,
    },
    {
      id: "own_sstakutan10",
      name: "「問題ないさ」",
      desc: "覚醒たくたんを10人雇用する。",
      unlocked: false,
    },
    {
      id: "own_sstakutan100",
      name: "「SSランク……」",
      desc: "覚醒たくたんを100人雇用する。",
      unlocked: false,
    },

    {
      id: "own_ssstakutan",
      name: "健全な成長",
      desc: "超覚醒たくたんを雇用する。",
      unlocked: false,
    },
    {
      id: "own_ssstakutan10",
      name: "「問題……ない」",
      desc: "超覚醒たくたんを10人雇用する。",
      unlocked: false,
    },
    {
      id: "own_ssstakutan100",
      name: "「次はZ？」",
      desc: "超覚醒たくたんを100人雇用する。",
      unlocked: false,
    },

    {
      id: "own_evil",
      name: "怪しい製品",
      desc: "邪術ラボを設立する。",
      unlocked: false,
    },
    {
      id: "own_evil10",
      name: "餅創りの邪術",
      desc: "邪術ラボを10棟設立する。",
      unlocked: false,
    },

    {
      id: "own_court",
      name: "「俺が法律の最高峰だ」",
      desc: "最高裁判所を設立する。",
      unlocked: false,
    },
    {
      id: "own_court10",
      name: "「六法全書で殴る」",
      desc: "最高裁判所を10棟設立する。",
      unlocked: false,
    },

    {
      id: "own_planet",
      name: "「土地がないなら……」",
      desc: "餅工場惑星を製造する。",
      unlocked: false,
    },
    {
      id: "own_planet10",
      name: "太陽より大きい！",
      desc: "餅工場惑星を10個製造する。",
      unlocked: false,
    },

    {
      id: "own_rabbit",
      name: "「討伐しなかったっけ？」",
      desc: "ぺったんうさぎを雇用する。",
      unlocked: false,
    },
    {
      id: "own_rabbit10",
      name: "ニンジン代もばかにならない",
      desc: "ぺったんうさぎを10匹雇用する。",
      unlocked: false,
    },

    {
      id: "own_eto",
      name: "@jingyunlrn46010",
      desc: "バイト干支を雇用する。",
      unlocked: false,
    },
    {
      id: "own_eto10",
      name: "「別に餅とかどうでもいいけど」",
      desc: "バイト干支を10人雇用する。",
      unlocked: false,
    },

    {
      id: "own_truecourt",
      name: "「やり直しだ」",
      desc: "裏・最高裁判所を設立する。",
      unlocked: false,
    },
    {
      id: "own_truecourt10",
      name: "所詮正義は慈悲による",
      desc: "裏・最高裁判所を10棟設立する。",
      unlocked: false,
    },

    {
      id: "own_yamamotolab",
      name: "断定的",
      desc: "山本の研究所を設立する。",
      unlocked: false,
    },
    {
      id: "own_yamamotolab10",
      name: "紅色",
      desc: "山本の研究所を10棟設立する。",
      unlocked: false,
    },

    {
      id: "own_westyama",
      name: "「時を戻そう……」・西",
      desc: "西邪馬台国を手中に収める。",
      unlocked: false,
    },
    {
      id: "own_westyama10",
      name: "支配者・西",
      desc: "西邪馬台国を10個手中に収める。",
      unlocked: false,
    },
    {
      id: "own_eastyama",
      name: "「時を戻そう……」・東",
      desc: "東邪馬台国を手中に収める。",
      unlocked: false,
    },
    {
      id: "own_eastyama10",
      name: "支配者・東",
      desc: "東邪馬台国を10個手中に収める。",
      unlocked: false,
    },

    {
      id: "own_motchiy",
      name: "「ここからだ」",
      desc: "Motchiyサーバーを購入する。",
      unlocked: false,
    },
    {
      id: "own_motchiy100",
      name: "「……アッハッハッハッハ！」",
      desc: "Motchiyサーバーを100台購入する。",
      unlocked: false,
    },
  ],
};

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
    // 失敗時は効果を発動せず、餅を赤く光らせる
    flashJajutsuFailure();
    save();
    render();
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

  const showJajutsu = game.reinJajutsu >= 1;

  if (!showJajutsu) {
    itemSubtab = "normal";
  }

  // サブタブ
  const subtabs = document.createElement("div");
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

  if (showJajutsu) {
    addSubtab("邪術", "jajutsu");
  }

  panel.appendChild(subtabs);

  const items =
    itemSubtab === "jajutsu"
      ? game.jajutsuItems
      : game.items;

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
        innerHTMLReplacing(it.desc),
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
const upgradeSubtabBar = document.createElement("div");

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

// 桁数方式：100億で1個、1000億で2個、1兆で3個……
function getMikanGain(cookies) {
  cookies = BigInt(cookies);

  if (cookies < REINCARNATION_THRESHOLD) {
    return 0n;
  }

  return BigInt(cookies.toString().length - 10);
}

// 左上の転生ポップアップ
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

  const gain = getMikanGain(game.cookies);
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

  const gain = getMikanGain(game.cookies);

  if (gain <= 0n) {
    toast("転生には100億餅以上が必要です😭");
    return;
  }

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
    reinJajutsu: game.reinJajustu,

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


