export function createUpgradesData(game, hasUpgrade){
  return [
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
  ];
}
