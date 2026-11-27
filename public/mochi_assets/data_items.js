export function createItemsData(game, getClickPower, isDebug, hasDivineUpgrade){
  return [
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
        game.buildings[10].multiplier += 100000n;
      },
      unlocked: false,
      desc: "ぺったんうさぎの生産性+10%。",
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
        game.buildings[12].multiplier += 140000n;
      },
      unlocked: false,
      desc: "裏・最高裁判所の生産性+14%。",
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
        game.buildings[12].multiplier += 220000n;
      },
      unlocked: false,
      desc: "裏・最高裁判所の生産性+22%。",
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
        game.buildings.slice(0, 13).forEach(building => {
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
        game.buildings[17].multiplier += 200000n;
      },
      unlocked: false,
      desc: "神域の二元庭の生産性+20%。",
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
        game.buildings[18].multiplier += 350000n;
      },
      unlocked: false,
      desc: "真覚醒たくたんの生産性+35%。",
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
        game.buildings[19].multiplier += 350000n;
      },
      unlocked: false,
      desc: "真超覚醒たくたんの生産性+35%。",
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
        game.buildings[22].multiplier += 150000n;
      },
      unlocked: false,
      desc: "終末邪術ラボの生産性+15%。",
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
        game.buildings[22].multiplier += 250000n;
      },
      unlocked: false,
      desc: "クリック力、終末邪術ラボの生産性+25%。",
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
        game.buildings[23].multiplier += 250000n;
        game.buildings[5].multiplier -= 30000n;
        game.buildings[6].multiplier -= 30000n;
      },
      unlocked: false,
      desc: "覚醒干支の生産性+25%。ただし、[(disad)覚醒たくたん、超覚醒たくたんの生産性-3%(end)]。",
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
        game.buildings[24].multiplier += 500000n;
      },
      unlocked: false,
      desc: "1847 シュトッベの生産性+50%。",
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
        game.buildings[26].multiplier += 500000n;
      },
      unlocked: false,
      desc: "社員レノンの生産性+50%。",
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
        game.buildings[16].multiplier += 2500000n;
      },
      unlocked: false,
      desc: "特別なカクテル。Motchiyサーバーの生産性+250%。",
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
        game.buildings[25].multiplier += 800000n;
      },
      unlocked: false,
      desc: "特別なカクテル。『楽園』ガレージの生産性+80%。",
      flavor: "「僕らにとって特別な味わいです、と言って僕はグラスを傾けました」― ボンファイア・レノックス",
    },
    
    {
      name: "[(r1)焦げた手記の切れ端(end)]",
      cost: 1000000000000n,
      owned: 0n,
      unlock() {
        return hasDivineUpgrade("ある先輩のヒラメキ・刹");
      },
      effect() {
        game.buildings.slice(1, 17).forEach(building => {
          building.multiplier += 1500000n;
        });
      },
      unlocked: false,
      desc: "バイトたくたんを除くすべてのグレード1の設備の生産力+150%。",
      flavor: "ボート……関数……鉄鋼……ファーム……",
    },
    {
      name: "[(r1)ひび割れた亡国の水晶片(end)]",
      cost: 1000000000000n,
      owned: 0n,
      unlock() {
        return hasDivineUpgrade("ある先輩のヒラメキ・刹");
      },
      effect() {
        game.buildings.slice(0, 17).forEach(building => {
          building.cost = (building.cost * 90n) / 100n;
        });
      },
      unlocked: false,
      desc: "すべてのグレード1の設備の現在価格-10%。",
      flavor: "もう光を放たない水晶。でも少しだけ温かい。",
    },{
      name: "[(r1)白い砂のアンプル(end)]",
      cost: 100000000000000n,
      owned: 0n,
      unlock() {
        return hasDivineUpgrade("ある先輩のヒラメキ・考");
      },
      effect() {
        game.buildings.slice(1, 17).forEach(building => {
          building.multiplier += 3000000n;
        });
      },
      unlocked: false,
      desc: "バイトたくたんを除くすべてのグレード1の設備の生産力+300%。",
      flavor: "とても細かい砂のアンプル。揺らすと心地の良い音がする。",
    },
    {
      name: "[(r1)割れたペンケース(end)]",
      cost: 100000000000000n,
      owned: 0n,
      unlock() {
        return hasDivineUpgrade("ある先輩のヒラメキ・考");
      },
      effect() {
        game.buildings.slice(0, 17).forEach(building => {
          building.cost = (building.cost * 75n) / 100n;
        });
      },
      unlocked: false,
      desc: "すべてのグレード1の設備の現在価格-25%。",
      flavor: "ひどく割れてしまったペンケース。使い物にはならない。",
    },{
      name: "[(r1)氷を写した古い写真(end)]",
      cost: 10000000000000000n,
      owned: 0n,
      unlock() {
        return hasDivineUpgrade("ある先輩のヒラメキ・究");
      },
      effect() {
        game.buildings.slice(1, 17).forEach(building => {
          building.multiplier += 7000000n;
        });
      },
      unlocked: false,
      desc: "バイトたくたんを除くすべてのグレード1の設備の生産力+700%。",
      flavor: "どこかの氷山が映ったモノクロの写真。色はなくとも、その奥の太陽の明るさは想像に易い。",
    },
    {
      name: "[(r1)ボロボロのメモ帳(end)]",
      cost: 10000000000000000n,
      owned: 0n,
      unlock() {
        return hasDivineUpgrade("ある先輩のヒラメキ・究");
      },
      effect() {
        game.buildings.slice(0, 17).forEach(building => {
          building.cost = (building.cost * 60n) / 100n;
        });
      },
      unlocked: false,
      desc: "すべてのグレード1の設備の現在価格-40%。",
      flavor: "肝心のページはすべて破り取られてしまっている。劣化した表紙は、なでるだけで崩れそうだ。",
    },{
      name: "[(r1)縫い直されたリボン(end)]",
      cost: 10000000000000000n,
      owned: 0n,
      unlock() {
        return hasDivineUpgrade("ある先輩のヒラメキ・厳");
      },
      effect() {
        game.buildings.slice(1, 17).forEach(building => {
          building.multiplier += 15000000n;
        });
      },
      unlocked: false,
      desc: "バイトたくたんを除くすべてのグレード1の設備の生産力+1500%。",
      flavor: "何度も何度も縫い直された黒いリボン。縫い目は丁寧で、よく見ないと縫い直したことが分からない。",
    },
    {
      name: "[(r1)白い磁器のカケラ(end)]",
      cost: 10000000000000000n,
      owned: 0n,
      unlock() {
        return hasDivineUpgrade("ある先輩のヒラメキ・厳");
      },
      effect() {
        game.buildings.slice(0, 17).forEach(building => {
          building.cost = (building.cost * 40n) / 100n;
        });
      },
      unlocked: false,
      desc: "すべてのグレード1の設備の現在価格-60%。",
      flavor: "赤い花の模様が見える、磁器の小さな欠片。花瓶だったのだろうか。",
    },
    {
      name: "[(r1)ココロオブシディアンの原石(end)]",
      cost: 1000000000000000000n,
      owned: 0n,
      unlock() {
        return hasDivineUpgrade("ある先輩のヒラメキ・完終");
      },
      effect() {
        game.buildings.slice(0, 17).forEach(building => {
          building.cost = (building.cost * 40n) / 100n;
          building.multiplier += 2000000n;
        });
      },
      unlocked: false,
      desc: "すべてのグレード1の設備の現在価格-60%、設備の生産力+200%。",
      flavor: "大きくて不純物のないココロオブシディアンの原石。ただそれだけ。",
    },
    
    {
      name: "[(disad)ガドリニウムの匣(end)]",
      cost: 100n,
      owned: 0n,
      effect() {
      },
      unlock(){
        return isDebug();
      },
      unlocked: false,
      desc: "テスト用のアイテム。",
      flavor: "ガドリニウム。原子番号64番、元素記号Gd。名前の由来は研究者ヨハン・ガドリンから。",
    },
    {
      name: "[(disad)マイトネリウムの匣(end)]",
      cost: 100n,
      owned: 0n,
      effect() {
      },
      unlock(){
        return isDebug();
      },
      unlocked: false,
      desc: "テスト用のアイテム。",
      flavor: "マイトネリウム。原子番号109番、元素記号Mt。名前の由来は研究者リーゼ・マイトナーから。",
    },
  ];
}
