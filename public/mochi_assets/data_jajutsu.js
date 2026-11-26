export function createJajutsuData(game, isDebug){
  return [
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
