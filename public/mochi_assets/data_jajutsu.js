export function createJajutsuData(game, isDebug){
  return [
    {
      name: "錬成：深い傷",
      cost: 10000n,
      owned: 0n,
      baseJajutsu: 50,
      effect() {
        game.cookies = (game.cookies * BigInt(Math.floor(Math.random() * 191) + 10)) / 100n;
      },
      unlocked: true,
      desc: "成功すると、現在の所持餅をランダムで10%〜200%にする。",
      flavor: "ギャンブルタイムだ！",
    },
    {
      name: "錬成：浅い幸",
      cost: 10000n,
      owned: 0n,
      baseJajutsu: 50,
      effect() {
        game.cookies = (game.cookies * BigInt(Math.floor(Math.random() * 151) + 50)) / 100n;
      },
      unlocked: true,
      desc: "成功すると、現在の所持餅をランダムで50%〜150%にする。",
      flavor: "得ることには、失うことも伴う。",
    },
    
    {
      name: "強化：風を切る風",
      cost: 30000n,
      owned: 0n,
      baseJajutsu: 75,
      effect() {
        game.clickPower += 100n;
      },
      unlocked: true,
      desc: "成功すると、クリック力を+100。",
      flavor: "力をつけるごとに、周囲の風が黒くなる。",
    },
    {
      name: "強化：失われた水",
      cost: 2400000n,
      owned: 0n,
      baseJajutsu: 60,
      effect() {
        game.clickPower += 35000n;
      },
      unlock() {
        return game.clickPower >= 500000n
      },
      unlocked: false,
      desc: "成功すると、クリック力を+35000。",
      flavor: "「寒いから水道凍ってるんだが！？」― さいほうへいき",
    },
    {
      name: "強化：切削の遺骨",
      cost: 45000000n,
      owned: 0n,
      baseJajutsu: 35,
      effect() {
        game.clickPower += 100000n;
      },
      unlock() {
        return game.clickPower >= 1500000n
      },
      unlocked: false,
      desc: "成功すると、クリック力を+100000。",
      flavor: "「ラグー食べたいね」― Motchiy",
    },
    {
      name: "強化：無垢な雷雲",
      cost: 490000000n,
      owned: 0n,
      baseJajutsu: 35,
      effect() {
        game.clickPower += 5000000n;
      },
      unlock() {
        return game.clickPower >= 35000000n
      },
      unlocked: false,
      desc: "成功すると、クリック力を+5000000。",
      flavor: "その雷は力場を捻じ曲げ、時空さえも歪め尽くす。",
    },
    
    {
      name: "[(disad)錬成：巡回する橋(end)]",
      cost: 100n,
      owned: 0n,
      baseJajutsu: -999999999999,
      effect() {
        alert("グッジョブ！　成功したよ");
      },
      unlock(){
        return isDebug();
      },
      unlocked: false,
      desc: "テスト用のアイテム。絶対に成功しない邪術。",
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
      unlock(){
        return isDebug();
      },
      unlocked: false,
      desc: "テスト用のアイテム。成功するかもしれない邪術。",
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
      unlock(){
        return isDebug();
      },
      unlocked: false,
      desc: "テスト用のアイテム。確実に成功する邪術。",
      flavor: "あるいは、それを『希望』と呼ぼう。",
    },
  ];
}
