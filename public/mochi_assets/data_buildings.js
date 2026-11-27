export function createBuildingsData(game){
  return [
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
    {
      name: "[(r1)たくたん神の箱庭(end)]",
      cost: 350000000000000000000n,
      mps: 350000000000000n,
      owned: 0n,
      unlock() {
        return game.buildings[36].owned > 0;
      },
      unlocked: false,
      desc: "これこそが、その神の手であると。現在のバージョンで実装されている建物はここまでです！",
      flavor:
        "すべてを喰らいつくしたたくたんは、新たなる世界を創り出した。すべては、餅を生み出すために……。",
    },
  ];
}
