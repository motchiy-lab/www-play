export function createDivineUpgradesData(game, hasDivineUpgrade){
  return [
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
      name: "最高裁の導き・II",
      cost: 5n,
      bought: false,
      effect() {
        game.reinItemPriceMultiplier -= 100000n;
      },
      unlock() {
        return hasDivineUpgrade("最高裁の導き・I");
      },
      unlocked: false,
      desc: "アイテムの値段を-10%する。",
      flavor: "賄賂である餅さえ渡せば、いくらでも罪は消えるだろう。",
    },
    {
      name: "最高裁の導き・III",
      cost: 15n,
      bought: false,
      effect() {
        game.reinItemPriceMultiplier -= 100000n;
      },
      unlock() {
        return hasDivineUpgrade("最高裁の導き・II");
      },
      unlocked: false,
      desc: "アイテムの値段を-10%する。",
      flavor: "さらに、不定期的に免罪符である最高裁コインがオークションにかけられるという。",
    },
    {
      name: "最高裁の導き・IV",
      cost: 50n,
      bought: false,
      effect() {
        game.reinItemPriceMultiplier -= 100000n;
      },
      unlock() {
        return hasDivineUpgrade("最高裁の導き・III");
      },
      unlocked: false,
      desc: "アイテムの値段を-10%する。",
      flavor: "しかしそんな不正の横行する最高裁こそが最上位の存在であり、裁けるものはいない。",
    },
    {
      name: "最高裁の導き・V",
      cost: 250n,
      bought: false,
      effect() {
        game.reinItemPriceMultiplier -= 100000n;
      },
      unlock() {
        return hasDivineUpgrade("最高裁の導き・IV");
      },
      unlocked: false,
      desc: "アイテムの値段を-10%する。",
      flavor: "悲しきかな、正義というものはだいたいそういうものである。",
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
      name: "山本の導き・II",
      cost: 5n,
      bought: false,
      effect() {
        game.reinBuildingsMultiplier += 2000000n;
      },
      unlock() {
        return hasDivineUpgrade("山本の導き・I");
      },
      unlocked: false,
      desc: "建物の生産力を+200%する。",
      flavor: "一日目、初めに餅があった。",
    },
    {
      name: "山本の導き・III",
      cost: 15n,
      bought: false,
      effect() {
        game.reinBuildingsMultiplier += 5000000n;
      },
      unlock() {
        return hasDivineUpgrade("山本の導き・II");
      },
      unlocked: false,
      desc: "建物の生産力を+500%する。",
      flavor: "二日目、餅をつく人手が生み出された。三日目、餅を作る施設が作られた。",
    },
    {
      name: "山本の導き・IV",
      cost: 50n,
      bought: false,
      effect() {
        game.reinBuildingsMultiplier += 10000000n;
      },
      unlock() {
        return hasDivineUpgrade("山本の導き・III");
      },
      unlocked: false,
      desc: "建物の生産力を+1000%する。",
      flavor: "四日目、施設が効率化した。五日目、さらなる施設が解禁された。",
    },
    {
      name: "山本の導き・V",
      cost: 250n,
      bought: false,
      effect() {
        game.reinBuildingsMultiplier += 20000000n;
      },
      unlock() {
        return hasDivineUpgrade("山本の導き・IV");
      },
      unlocked: false,
      desc: "建物の生産力を+2000%する。",
      flavor: "六日目、人々は餅を求め続けた。そして七日目、すべては巻き戻る。",
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
    {
      name: "邪術神の導き・III",
      cost: 15n,
      bought: false,
      effect() {
        game.reinJajutsu += 15;
      },
      unlock() {
        return hasDivineUpgrade("邪術神の導き・II");
      },
      unlocked: false,
      desc: "邪術度を+15%する。",
      flavor: "「邪術というのはこの世界の根源なんです。すべては邪術から始まっています」― さいほうへいき",
    },
    {
      name: "邪術神の導き・IV",
      cost: 50n,
      bought: false,
      effect() {
        game.reinJajutsu += 30;
      },
      unlock() {
        return hasDivineUpgrade("邪術神の導き・III");
      },
      unlocked: false,
      desc: "邪術度を+30%する。",
      flavor: "「邪術に不可能はありません。でも、絶対もありません」― さいほうへいき",
    },
    {
      name: "邪術神の導き・V",
      cost: 250n,
      bought: false,
      effect() {
        game.reinJajutsu += 100000;
      },
      unlock() {
        return hasDivineUpgrade("邪術神の導き・IV");
      },
      unlocked: false,
      desc: "邪術度を+100000%する。",
      flavor: "「ですから、邪術の腕がいくら上がろうとも、できないことはあるのです」― さいほうへいき",
    },
    
    {
      name: "たくたん王の導き・I",
      cost: 3n,
      bought: false,
      effect() {
      },
      initialBonusEffect(bonus) {
        bonus.buildings["バイトたくたん"] ??= {};
        const building = bonus.buildings["バイトたくたん"];
        building.owned = (building.owned ?? 0n) + 1n;
        building.multiplier = (building.multiplier ?? 0n) + 1000000n;
      },
      unlock() {
        return hasDivineUpgrade("日本の神の導き・I") && hasDivineUpgrade("山本の導き・I") && hasDivineUpgrade("最高裁の導き・I");
      },
      unlocked: false,
      desc: "転生時の初期所有たくたん+1、たくたんの生産性を+100%。",
      flavor: "香辛料が加速している！",
    },
    {
      name: "たくたん王の導き・II",
      cost: 15n,
      bought: false,
      effect() {
      },
      initialBonusEffect(bonus) {
        bonus.buildings["バイトたくたん"] ??= {};
        const building = bonus.buildings["バイトたくたん"];
        building.owned = (building.owned ?? 0n) + 10n;
        building.multiplier = (building.multiplier ?? 0n) + 3000000n;
      },
      unlock() {
        return hasDivineUpgrade("日本の神の導き・II")
          && hasDivineUpgrade("山本の導き・II")
          && hasDivineUpgrade("最高裁の導き・II");
      },
      unlocked: false,
      desc: "転生時の初期所有たくたん+10、たくたんの生産性を+300%。",
      flavor: "遥か高みさえも喰らい尽くす。",
    },
    {
      name: "たくたん王の導き・III",
      cost: 250n,
      bought: false,
      effect() {
      },
      initialBonusEffect(bonus) {
        bonus.buildings["バイトたくたん"] ??= {};
        const building = bonus.buildings["バイトたくたん"];
        building.owned = (building.owned ?? 0n) + 30n;
        building.multiplier = (building.multiplier ?? 0n) + 10000000n;
      },
      unlock() {
        return hasDivineUpgrade("日本の神の導き・III")
          && hasDivineUpgrade("山本の導き・III")
          && hasDivineUpgrade("最高裁の導き・III");
      },
      unlocked: false,
      desc: "転生時の初期所有たくたん+30、たくたんの生産性を+1000%。",
      flavor: "あまたの星星は、いつか香辛料へと成り果てる。",
    },
    {
      name: "たくたん王の導き・IV",
      cost: 850n,
      bought: false,
      effect() {
      },
      initialBonusEffect(bonus) {
        bonus.buildings["バイトたくたん"] ??= {};
        const building = bonus.buildings["バイトたくたん"];
        building.owned = (building.owned ?? 0n) + 100n;
        building.multiplier = (building.multiplier ?? 0n) + 30000000n;
      },
      unlock() {
        return hasDivineUpgrade("日本の神の導き・IV")
          && hasDivineUpgrade("山本の導き・IV")
          && hasDivineUpgrade("最高裁の導き・IV");
      },
      unlocked: false,
      desc: "転生時の初期所有たくたん+100、たくたんの生産性を+3000%。",
      flavor: "世界を、地を、天を香辛料で埋め尽くす時が来た！",
    },
    {
      name: "たくたん王の導き・V",
      cost: 1500n,
      bought: false,
      effect() {
      },
      initialBonusEffect(bonus) {
        bonus.buildings["バイトたくたん"] ??= {};
        const building = bonus.buildings["バイトたくたん"];
        building.owned = (building.owned ?? 0n) + 300n;
        building.multiplier = (building.multiplier ?? 0n) + 100000000n;
      },
      unlock() {
        return hasDivineUpgrade("日本の神の導き・V")
          && hasDivineUpgrade("山本の導き・V")
          && hasDivineUpgrade("最高裁の導き・V");
      },
      unlocked: false,
      desc: "転生時の初期所有たくたん+300、たくたんの生産性を+10000%。より上級なアップグレードを解放する。",
      flavor: "いかなる神さえも香辛料の前には敵うまい！",
    },

    {
      name: "ある先輩のヒラメキ・刹",
      cost: 3000n,
      bought: false,
      effect() {
        game.reinBuildingsMultiplier += 1000000n;
      },
      initialBonusEffect(bonus) {
      },
      unlock() {
        return hasDivineUpgrade("たくたん王の導き・V");
      },
      unlocked: false,
      desc: "建物の生産力を+100%し、いくつかの特殊なアイテムを解放する。",
      flavor: "「そうでしたね。そろそろ、僕も参加すべきですか」",
    },
    {
      name: "ある先輩のヒラメキ・考",
      cost: 3000n,
      bought: false,
      effect() {
        game.reinBuildingsMultiplier += 1000000n;
      },
      initialBonusEffect(bonus) {
      },
      unlock() {
        return hasDivineUpgrade("たくたん王の導き・V");
      },
      unlocked: false,
      desc: "建物の生産力を+100%し、いくつかの特殊なアイテムを解放する。",
      flavor: "いくつもの春を過ごした。いくつもの終わりと始まりを見届けた。",
    },
    {
      name: "ある先輩のヒラメキ・究",
      cost: 3000n,
      bought: false,
      effect() {
        game.reinBuildingsMultiplier += 1000000n;
      },
      initialBonusEffect(bonus) {
      },
      unlock() {
        return hasDivineUpgrade("たくたん王の導き・V");
      },
      unlocked: false,
      desc: "建物の生産力を+100%し、いくつかの特殊なアイテムを解放する。",
      flavor: "棺を抱えて海を渡った。彼は耳を澄ませるが、聞こえたのは静かな風だけ。",
    },
    {
      name: "ある先輩のヒラメキ・厳",
      cost: 3000n,
      bought: false,
      effect() {
        game.reinBuildingsMultiplier += 1000000n;
      },
      initialBonusEffect(bonus) {
      },
      unlock() {
        return hasDivineUpgrade("たくたん王の導き・V");
      },
      unlocked: false,
      desc: "建物の生産力を+100%し、いくつかの特殊なアイテムを解放する。",
      flavor: "「だから僕はまだ探すんです。約束の果たせる地を」",
    },
    {
      name: "ある先輩のヒラメキ・完終",
      cost: 50000n,
      bought: false,
      effect() {
        game.reinBuildingsMultiplier += 30000000n;
      },
      initialBonusEffect(bonus) {
      },
      unlock() {
        return hasDivineUpgrade("たくたん王の導き・V");
      },
      unlocked: false,
      desc: "建物の生産力を+3000%し、いくつかの特殊なアイテムを解放する！",
      flavor: "いつかその輪廻が報われる時は来るのだろうか？",
    },
  ];
}
