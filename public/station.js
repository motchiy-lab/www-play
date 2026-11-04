// DOM
const canvas = document.getElementById('preview');
const ctx = canvas.getContext('2d');
const iconFile = document.getElementById('iconFile');
const iconMode = document.getElementById('iconMode');
const nameIn = document.getElementById('name');
const rubyIn = document.getElementById('ruby');
const enIn = document.getElementById('en');
const prevIn = document.getElementById('prev');
const prevEnIn = document.getElementById('prevEn');
const nextIn = document.getElementById('next');
const nextEnIn = document.getElementById('nextEn');
const companyIn = document.getElementById('company');
const themeSel = document.getElementById('theme');
const arrowStyleSel = document.getElementById('arrowStyle');
const resetBtn = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');
const canvasSizeSel = document.getElementById('canvasSize');
const bgFile = document.getElementById('bgFile');
const bgMode = document.getElementById('bgMode');
const surpriseBtn = document.getElementById('surpriseBtn');

// 初期謎環状線
const CIRCULAR = [
    {jp:'裁縫兵器', kana:'さいほうへいき', en:'Saihou Heiki'},
    {jp:'餅井', kana:'もっちい', en:'Motchiy'},
    {jp:'祭夜山本', kana:'ぱーりないやまもと', en:'Parinai Yamamoto'},
    {jp:'最高裁', kana:'さいこうさい', en:'Supreme Court'},
    {jp:'蕾', kana:'らい', en:'Rai'},
    {jp:'零無', kana:'れのん', en:'Renon'},
    {jp:'干支', kana:'えと', en:'Eto'},
    {jp:'託誕', kana:'たくたん', en:'Takutan'},
    {jp:'解刃', kana:'かいは', en:'Kaiha'},
    {jp:'丸亀先輩', kana:'まるがめせんぱい', en:'Marugame Senpai'}
];

// テーマパレット
const THEMES = {
    sky:{bg:'#ffffff', border:'#cfe8ff', bar:'#eef7ff', text:'#10324a', sub:'#5f7d91', arrow:'#8cc6ff', sep:'#b8e1ff'},
    purple:{bg:'#faf8ff', border:'#e7dcfb', bar:'#f3ecff', text:'#30284f', sub:'#6a5c99', arrow:'#9c85d9', sep:'#d5c7ff'},
    pink:{bg:'#fff7fa', border:'#f7c9d9', bar:'#fde3eb', text:'#4f2838', sub:'#a85c7c', arrow:'#f58cad', sep:'#ffd1e8'},
    teal:{bg:'#f6fffd', border:'#a6e4d9', bar:'#d6f5ef', text:'#004d44', sub:'#337d73', arrow:'#3fc3b5', sep:'#bff0e9'},
    mono:{bg:'#ffffff', border:'#dddddd', bar:'#f6f6f6', text:'#111111', sub:'#666666', arrow:'#999999', sep:'#cccccc'},
    night:{bg:'#071029', border:'#18304f', bar:'#0f1b3b', text:'#ffffff', sub:'#aab6de', arrow:'#4c69c9', sep:'#15233e'},
    retro:{bg:'#fffdf5', border:'#e2c892', bar:'#f4e4b5', text:'#3e2c00', sub:'#7a5e1f', arrow:'#d9a441', sep:'#e5cd8b'},
    blue:{bg:'#e6f4ff', border:'#bfdff7', bar:'#dceeff', text:'#123456', sub:'#345678', arrow:'#9fd0ff', sep:'#dbeeff'},
    yellow:{bg:'#fffbe6', border:'#fff2bf', bar:'#fff5d6', text:'#665500', sub:'#998800', arrow:'#fff1a8', sep:'#fff4cc'},
    lime:{bg:'#f6ffea', border:'#e0f7c9', bar:'#eafed4', text:'#2e6b00', sub:'#5aa22b', arrow:'#d6ff9a', sep:'#e9ffd6'},
    brown:{bg:'#fbf5ef', border:'#e8d9c8', bar:'#f3e6d8', text:'#5a3b2b', sub:'#8a6b57', arrow:'#e2c6a7', sep:'#f3e6d8'},
    orange:{bg:'#fff6ea', border:'#ffdcb3', bar:'#ffe8c8', text:'#7a3f00', sub:'#c46d20', arrow:'#ffc99a', sep:'#ffe8c8'},
    spring:{bg:'#fff7fb', border:'#ffdbe6', bar:'#fff0f6', text:'#3b2a2b', sub:'#ad5f7a', arrow:'#ff9fbf', sep:'#ffe8f0'},
    sunrise:{bg:'#fffaf0', border:'#ffe5c4', bar:'#fff3e0', text:'#4a3314', sub:'#a66b3a', arrow:'#ffd39f', sep:'#fff0de'},
    moon:{bg:'#08102a', border:'#1b2a4b', bar:'#0f1830', text:'#ffffff', sub:'#9fb7e6', arrow:'#6d88c6', sep:'#14223b'}
};

// ---------- EASTER EGG: special themes (image backgrounds only) ----------
const SPECIAL_THEMES = {
    hoshiYume: { label: "星の夢", img: "https://img.atwiki.jp/mootchiiy/attach/254/521/dream_sp.jpeg" },
    hoshiKaze: { label: "星の風", img: "https://img.atwiki.jp/mootchiiy/attach/254/522/dream_sm.jpeg" },
    science:  { label: "サイエンス", img: "https://img.atwiki.jp/mootchiiy/attach/254/524/labo.jpeg" },
    melodic:  { label: "メロディックフロー", img: "https://img.atwiki.jp/mootchiiy/attach/254/523/musics.jpeg" }
};

// Preload Image objects for special themes
const specialImages = {};
Object.keys(SPECIAL_THEMES).forEach(k=>{
    const im = new Image();
    im.src = SPECIAL_THEMES[k].img;
    specialImages[k] = im;
});

// ---------- SURPRISE: 二次配列（漢字・かな・アルファベット） ----------
// 仕様: 配列は二次配列で、index 0 = 漢字群、1 = かな群、2 = 英字群
const SURPRISE_SETS = [
    // 漢字候補（繋げて駅名にする）
    ['花','森','木','土','山','月','葉','石','大','小','里','音','桜','梅','水','赤','根','柚','子','場','牛','鳥','馬','和','風','嵐','蛇','轍','道','持','港','川','河','悠','絶','滅','冥','葱','雷','雨','露','知','域','生','息','浮','原','神','手','柔','岩','決','結','晶','草','樹','森','竹','忘','如','月','星','弓','矢','剣','鉄','金','銅','鹿','錫','鈴','犬','国','力','春','夏','秋','冬','可','罰','顎','黒','穴','粋','五','七','八','住','百','点','満','兎','田','栗','雪','愚','仮','面','之','愉','快','続','氷','憶','麦','綱','面','綿','丸','亀','製','麺','労','働','先','輩','明','暗','潮','塩','汐','滝','世','術','由','白','湯','発','開','超','劣','感','電','凍','燃','焼','裂','作','創','弾','王','皇','菊','聴','救','鷲','泉','出','雲','元','下','基','本','戸','都','北','西','東','南','京','奈','羅','呼','薨','申','猿','猪','柵','麗','拠','礼','札','読','甲','交','花','彁','椦','椛','柊','榊','梛','棗','珀','瑚','湊','颯','翠','蒼','蓮','碧','煌','楓','朔','瑛','凛','昴','紬','惺','綾','斎','遼','鷹','稜','禄','莞','渚','悠','零','壱','弐','参','肆','伍','陸','漆','捌','玖','拾','EX','Z','X','Ω','Δ','α','β','Λ','Σ','Ψ',],

    // かな候補（ルビに使う）
    ['はな','もり','き','つち','やま','つき','は','いし','だい','しょう','さと','おと','さくら','うめ','みず','あか','ね','ゆず','こ','ば','うし','とり','うま','わ','かぜ','あらし','へび','わだち','みち','もつ','みなと','かわ','かわ','ゆう','ぜつ','めつ','めい','ねぎ','かみなり','あめ','つゆ','しる','いき','いき','いき','うかぶ','はら','かみ','て','やわら','いわ','けつ','むすぶ','しょう','くさ','じゅ','もり','たけ','わすれる','ごとし','つき','ほし','ゆみ','や','つるぎ','てつ','きん','どう','しか','すず','すず','いぬ','くに','ちから','はる','なつ','あき','ふゆ','か','ばつ','あご','くろ','あな','いき','ご','しち','はち','すむ','ひゃく','てん','まん','うさぎ','た','くり','ゆき','ぐ','かり','めん','の','ゆ','かい','つづく','こおり','おく','むぎ','つな','めん','めん','まる','かめ','せい','めん','ろう','はたらく','さき','はい','あかるい','くらい','しお','しお','しお','たき','よ','じゅつ','ゆ','しろ','ゆ','はつ','ひらく','ちょう','おとる','かん','でん','こおる','もえる','やく','さく','つくる','そう','だん','おう','こう','きく','きく','すくう','わし','いずみ','で','くも','もと','した','もと','ほん','と','みやこ','きた','にし','ひがし','みなみ','きょう','な','ら','よぶ','こう','さる','さる','いのしし','さく','れい','きょ','れい','ふだ','よむ','こう','こう','フラワー','か','しょう','もみじ','ひいらぎ','さかき','なぎ','なつめ','はく','こ','みなと','はやて','すい','あお','れん','あお','こう','かえで','さく','えい','りん','すばる','つむぎ','せい','あや','さい','りょう','たか','りょう','ろく','かん','なぎさ','ゆう','ゼロ','ワン','ツー','スリー','フォー','ファイブ','シックス','セブン','エイト','ナイン','テン','イーエックス','ゼット','エックス','オメガ','デルタ','アルファ','ベータ','ラムダ','シグマ','プサイ',],

    // 英語候補（アルファベット単体や短いフレーズ）
    ['hana','mori','ki','tsuchi','yama','tsuki','ha','ishi','dai','shou','sato','oto','sakura','ume','mizu','aka','ne','yuzu','ko','ba','ushi','tori','uma','wa','kaze','arashi','hebi','wadachi','michi','motsu','minato','kawa','kawa','yuu','zetsu','metsu','mei','negi','kaminari','ame','tsuyu','shiru','iki','iki','iki','ukabu','hara','kami','te','yawara','iwa','ketsu','musubu','shou','kusa','ju','mori','take','wasureru','gotoshi','tsuki','hoshi','yumi','ya','tsurugi','tetsu','kin','dou','shika','suzu','suzu','inu','kuni','chikara','haru','natsu','aki','fuyu','ka','batsu','ago','kuro','ana','iki','go','shichi','hachi','sumu','hyaku','ten','man','usagi','ta','kuri','yuki','gu','kari','men','no','yu','kai','tsuzuku','koori','oku','mugi','tsuna','men','men','maru','kame','sei','men','rou','hataraku','saki','hai','akarui','kurai','shio','shio','shio','taki','yo','jutsu','yu','shiro','yu','hatsu','hiraku','chou','otoru','kan','den','kooru','moeru','yaku','saku','tsukuru','sou','dan','ou','kou','kiku','kiku','sukuu','washi','izumi','de','kumo','moto','shita','moto','hon','to','miyako','kita','nishi','higashi','minami','kyou','na','ra','yobu','kou','saru','saru','inosshishi','saku','rei','kyo','rei','fuda','yomu','kou','kou',' Flower ','ka','shou','momiji','hiiragi','sakaki','nagi','natsume','haku','ko','minato','hayate','sui','ao','ren','ao','kou','kaede','saku','ei','rin','subaru','tsumugi','sei','aya','sai','ryou','taka','ryou','roku','kan','nagisa','yuu',' Zero ',' One ',' Two ',' Three ',' Four ',' Five ',' Six ',' Seven ',' Eight ',' Nine ',' Ten ',' EX ',' Z ',' X ',' Omega ',' Delta ',' Alpha ',' Beta ',' Lambda ',' Sigma ',' Psi ']
];

// state
let state = { icon: null, bg: null };

// base design
const BASE_W = 1200;
const BASE_H = 600;

// file handlers
iconFile.addEventListener('change', e=>{
    const f = e.target.files && e.target.files[0];
    if(!f){ state.icon = null; draw(); return; }
    const r = new FileReader();
    r.onload = ev => { const img = new Image(); img.onload = ()=>{ state.icon = img; draw(); }; img.src = ev.target.result; };
    r.readAsDataURL(f);
});

bgFile.addEventListener('change', e=>{
    const f = e.target.files && e.target.files[0];
    if(!f){ state.bg = null; draw(); return; }
    const r = new FileReader();
    r.onload = ev => { const img = new Image(); img.onload = ()=>{ state.bg = img; draw(); }; img.src = ev.target.result; };
    r.readAsDataURL(f);
});

// transforms
function computeTransform(targetCanvas){
    const w = targetCanvas.width, h = targetCanvas.height;
    const scaleX = w / BASE_W;
    const scaleY = h / BASE_H;
    const scaleMin = Math.min(scaleX, scaleY);
    return { w, h, scaleX, scaleY, scaleMin };
}

function X(x,t){ return x * t.scaleX; }
function Y_byBaseRatio(ratio, t){ return (ratio * BASE_H) * t.scaleMin; }
function Wb(wBase,t){ return wBase * t.scaleX; }
function Hb(hBase,t){ return hBase * t.scaleMin; }
function S(n,t){ return n * t.scaleMin; }

// text fit
function fitTextPx(ctx, text, basePx, maxWpx, minPx=8, weight='700', scaleFont=1){
    let s = Math.round(basePx * scaleFont);
    ctx.font = `${weight} ${s}px "Noto Sans JP", sans-serif`;
    while(text && ctx.measureText(text).width > maxWpx && s > minPx){
        s -= 2;
        ctx.font = `${weight} ${s}px "Noto Sans JP", sans-serif`;
    }
    return s;
}

// shapes
function drawNormalBox(ctx,x,y,w,h,side,color,notch){
    ctx.save(); ctx.fillStyle=color; ctx.beginPath();
    if(side==='left'){ ctx.moveTo(x+notch,y); ctx.lineTo(x+w,y); ctx.lineTo(x+w,y+h); ctx.lineTo(x+notch,y+h); ctx.lineTo(x,y+h/2); }
    else { ctx.moveTo(x,y); ctx.lineTo(x+w-notch,y); ctx.lineTo(x+w,y+h/2); ctx.lineTo(x+w-notch,y+h); ctx.lineTo(x,y+h); }
    ctx.closePath(); ctx.fill(); ctx.restore();
}

function drawDiamondBoth(ctx,x,y,w,h,color,sepColor,tip){
    ctx.save(); ctx.fillStyle=color; ctx.beginPath();
    ctx.moveTo(x,y+h/2); ctx.lineTo(x+tip,y); ctx.lineTo(x+w-tip,y); ctx.lineTo(x+w,y+h/2); ctx.lineTo(x+w-tip,y+h); ctx.lineTo(x+tip,y+h);
    ctx.closePath(); ctx.fill();
    if(sepColor){ ctx.fillStyle = sepColor; ctx.fillRect(x + w/2 - Math.max(2, tip*0.14), y, Math.max(4, tip*0.28), h); }
    ctx.restore();
}

function drawDiamondSingleLeft(ctx,x,y,w,h,color,tip){
    ctx.save(); ctx.fillStyle=color; ctx.beginPath();
    ctx.moveTo(x,y+h/2); ctx.lineTo(x+tip,y); ctx.lineTo(x+w,y); ctx.lineTo(x+w,y+h); ctx.lineTo(x+tip,y+h); ctx.closePath(); ctx.fill();
    ctx.restore();
}

function drawDiamondSingleRight(ctx,x,y,w,h,color,tip){
    ctx.save(); ctx.fillStyle=color; ctx.beginPath();
    ctx.moveTo(x+w,y+h/2); ctx.lineTo(x+w-tip,y); ctx.lineTo(x,y); ctx.lineTo(x,y+h); ctx.lineTo(x+w-tip,y+h); ctx.closePath(); ctx.fill();
    ctx.restore();
}

// ---------- special background renderers ----------
function renderSpringBackground(c, t){
    const g = c.createLinearGradient(0,0,t.w, t.h);
    g.addColorStop(0, '#fff7fb');
    g.addColorStop(1, '#fff0f6');
    c.fillStyle = g; c.fillRect(0,0,t.w,t.h);
    const petals = Math.floor(18 * (t.scaleX));
    for(let i=0;i<petals;i++){
        const px = Math.random() * t.w;
        const py = Math.random() * t.h * 0.7;
        const rx = 6 + Math.random()*14;
        const ry = 4 + Math.random()*8;
        const rot = Math.random()*Math.PI*2;
        c.save(); c.translate(px, py); c.rotate(rot);
        c.beginPath(); c.ellipse(0,0, rx, ry, 0, 0, Math.PI*2);
        c.fillStyle = `rgba(255, ${150 + Math.floor(Math.random()*80)}, ${180 + Math.floor(Math.random()*40)}, ${0.7 + Math.random()*0.3})`; c.fill();
        c.restore();
        c.beginPath(); c.arc(px + rx*1.5, py + ry*0.2, Math.max(1, rx*0.4), 0, Math.PI*2);
        c.fillStyle = 'rgba(255,220,235,0.35)'; c.fill();
    }
}

function renderSunriseBackground(c, t){
    const g = c.createLinearGradient(0,0,t.w, t.h);
    g.addColorStop(0, '#fff7e6'); g.addColorStop(1, '#fff4d6');
    c.fillStyle = g; c.fillRect(0,0,t.w,t.h);
    const cx = t.w * 0.5, cy = t.h * 0.25, r = Math.max(t.w,t.h)*0.9;
    const rg = c.createRadialGradient(cx, cy, r*0.02, cx, cy, r);
    rg.addColorStop(0, 'rgba(255,240,200,0.95)');
    rg.addColorStop(0.25, 'rgba(255,220,150,0.7)');
    rg.addColorStop(0.6, 'rgba(255,200,120,0.2)');
    rg.addColorStop(1, 'rgba(255,200,120,0)');
    c.fillStyle = rg; c.fillRect(0,0,t.w,t.h);
    const rays = 32;
    c.save(); c.globalCompositeOperation = 'lighter';
    for(let i=0;i<rays;i++){
        const ang = (i / rays) * Math.PI * 2 + (Math.random()-0.5)*0.05;
        const len = r * (0.6 + Math.random()*0.6);
        c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(ang) * len, cy + Math.sin(ang) * len);
        c.strokeStyle = `rgba(255,230,170,${0.08 + Math.random()*0.06})`; c.lineWidth = Math.max(1, t.scaleMin * (8 + Math.random()*8)); c.stroke();
    }
    c.restore();
}

function renderMoonBackground(c, t){
    c.fillStyle = '#061028'; c.fillRect(0,0,t.w,t.h);
    // larger stars than before for better visibility
    const starCount = Math.floor(50 * t.scaleX);
    for(let i=0;i<starCount;i++){
        const x = Math.random() * t.w;
        const y = Math.random() * t.h * 0.8;
        // increase star radius multiplier for visibility
        const r = (0.8 + Math.random()*3.2) * t.scaleMin * 1.6;
        c.beginPath(); c.arc(x,y, Math.max(0.8, r),0,Math.PI*2);
        c.fillStyle = `rgba(255,255,220,${0.6 + Math.random()*0.4})`; c.fill();
    }
    // crescent moon
    const mx = t.w * 0.8, my = t.h * 0.22, mr = Math.max(28, 60 * t.scaleMin);
    c.save(); c.beginPath(); c.arc(mx, my, mr, 0, Math.PI*2); c.fillStyle = '#fff8d9'; c.fill();
    c.globalCompositeOperation = 'destination-out';
    c.beginPath(); c.arc(mx + mr*0.4, my - mr*0.08, mr, 0, Math.PI*2); c.fill();
    c.globalCompositeOperation = 'source-over';
    c.restore();
    const lg = c.createRadialGradient(mx, my + mr*0.3, mr*0.5, mx, my + mr*0.3, mr*3);
    lg.addColorStop(0, 'rgba(255,240,200,0.12)'); lg.addColorStop(1, 'rgba(255,240,200,0)');
    c.fillStyle = lg; c.fillRect(mx - mr*3, my - mr*3, mr*6, mr*6);
}

// ---------- main draw ----------
function drawToCanvas(targetCanvas){
    const c = targetCanvas.getContext('2d');
    const t = computeTransform(targetCanvas);
    const w = t.w, h = t.h;
    const selTheme = themeSel.value;

    const isStandard = (targetCanvas.width >= 1100);
    const is640 = (targetCanvas.width === 640);
    const is480 = (targetCanvas.width === 480);

    let nameRatio = isStandard ? 0.48 : 0.50;
    let enOffsetRatio = 0.075;
    let separatorRatio = isStandard ? 0.62 : 0.68;
    let areaRatio = isStandard ? 0.69 : 0.73;
    if(is640){ separatorRatio = 0.60; areaRatio = 0.72; nameRatio = 0.48; }
    if(is480){ separatorRatio = 0.57; areaRatio = 0.70; nameRatio = 0.47; }

    // --- special theme (image background) handling ---
    let palette;
    if(Object.prototype.hasOwnProperty.call(SPECIAL_THEMES, selTheme)){
        const img = specialImages[selTheme];
        if(img && img.complete && img.naturalWidth > 0){
            try { c.drawImage(img, 0, 0, w, h); } catch(e){ c.fillStyle = '#f0f3f8'; c.fillRect(0,0,w,h); }
        } else {
            c.fillStyle = '#f0f3f8'; c.fillRect(0,0,w,h);
            if(img){
                img.onload = ()=>{ draw(); }; // redraw when ready
            }
        }
        palette = THEMES['sky'];
    } else {
        if(selTheme === 'spring'){ renderSpringBackground(c, t); }
        else if(selTheme === 'sunrise'){ renderSunriseBackground(c, t); }
        else if(selTheme === 'moon'){ renderMoonBackground(c, t); }
        else { palette = THEMES[selTheme] || THEMES['sky']; c.fillStyle = palette.bg; c.fillRect(0,0,t.w,t.h); }
        if(!palette) palette = THEMES[selTheme] || THEMES['sky'];
    }

    // user background image overlay (uploaded by user)
    if(state.bg){
        c.save();
        let alpha = 1;
        if(bgMode.value === '30') alpha = 0.3;
        else if(bgMode.value === '50') alpha = 0.5;
        c.globalAlpha = alpha; c.drawImage(state.bg, 0, 0, w, h); c.restore();
    }

    // if palette still missing, default
    palette = palette || THEMES['sky'];

    // frame & bar
    c.strokeStyle = palette.border; c.lineWidth = Math.max(1, S(12, t));
    const frameX = X(12, t), frameY = S(12, t), frameW = Wb(BASE_W - 24, t), frameH = Hb(BASE_H - 24, t);
    c.strokeRect(frameX, frameY, frameW, frameH);
    c.fillStyle = palette.bar; c.fillRect(X(24, t), S(36, t), Wb(BASE_W - 48, t), Hb(isStandard ? 70 : 60, t));

    // icon moved slightly right
    const ICON_X_BASE = isStandard ? 160 : (is640 ? 130 : 120);
    const ICON_Y_BASE = isStandard ? 200 : (is640 ? 150 : 140);
    const ICON_R_BASE = isStandard ? 110 : (is640 ? 90 : 80);
    const iconX = X(ICON_X_BASE, t);
    const iconY = Y_byBaseRatio(ICON_Y_BASE/BASE_H, t);
    const iconR = S(ICON_R_BASE, t);
    if(state.icon){
        try{
            if(iconMode.value === 'circle'){
                c.save(); c.beginPath(); c.arc(iconX, iconY, iconR, 0, Math.PI*2); c.closePath(); c.clip();
                c.drawImage(state.icon, iconX - iconR, iconY - iconR, iconR*2, iconR*2); c.restore();
                c.beginPath(); c.arc(iconX, iconY, iconR, 0, Math.PI*2); c.strokeStyle = palette.sep || palette.border; c.lineWidth = Math.max(1, S(6, t)); c.stroke();
            } else { const s = iconR*2; c.drawImage(state.icon, iconX - iconR, iconY - iconR, s, s); }
        } catch(e){ console.warn('icon draw error', e); }
    }

    // center texts
    c.textAlign = 'center';
    const centerMaxWpx = Wb(BASE_W * 0.8, t);
    const nameFontPx = fitTextPx(c, nameIn.value || '', 110, centerMaxWpx, 14, '800', t.scaleMin);
    const rubyFontPx = fitTextPx(c, rubyIn.value || '', 36, centerMaxWpx, 10, '600', t.scaleMin);
    const enFontPx = fitTextPx(c, enIn.value || '', 42, Wb(BASE_W * 0.7, t), 10, '700', t.scaleMin);
    const nameBaseYpx = Y_byBaseRatio(nameRatio, t);
    const enBaseYpx = nameBaseYpx + S(enOffsetRatio * BASE_H, t);
    const rubyYpx = nameBaseYpx - Math.max(Math.round(nameFontPx * 0.9), S(24, t));
    c.fillStyle = palette.sub; c.font = `600 ${rubyFontPx}px "Noto Sans JP", sans-serif`; c.fillText(rubyIn.value || '', X(BASE_W/2, t), rubyYpx);
    c.fillStyle = palette.text; c.font = `800 ${nameFontPx}px "Noto Sans JP", sans-serif`; c.fillText(nameIn.value || '', X(BASE_W/2, t), nameBaseYpx);
    c.fillStyle = palette.text; c.font = `700 ${enFontPx}px "Noto Sans JP", sans-serif`; c.fillText(enIn.value || '', X(BASE_W/2, t), enBaseYpx);

    // separator
    const separatorYpx = Y_byBaseRatio(separatorRatio, t);
    const sepLineWidth = is640 ? Math.max(1, S(8, t)) : (is480 ? Math.max(1, S(7, t)) : Math.max(1, S(6, t)));
    c.strokeStyle = palette.border; c.lineWidth = sepLineWidth;
    c.beginPath(); c.moveTo(X(80, t), separatorYpx); c.lineTo(X(BASE_W - 80, t), separatorYpx); c.stroke();

    // prev/next area and variables
    const marginLeftBase = isStandard ? 80 : 50;
    const marginRightBase = isStandard ? 80 : 50;
    const gapBase = isStandard ? 14 : 10;
    const singleWBase = isStandard ? 360 : (is640 ? 300 : 260);
    const hasPrev = prevIn.value && prevIn.value.trim() !== '';
    const hasNext = nextIn.value && nextIn.value.trim() !== '';
    const notchPx = Math.max(6, 20 * t.scaleX);
    const tipPx = Math.max(10, (is640 ? 22 : (is480 ? 18 : 28)) * t.scaleX);
    const arrowThicknessPx = is640 ? Math.max(2, S(12, t)) : (is480 ? Math.max(2, S(10, t)) : Math.max(1, S(6, t)));
    const areaYpxComputed = Y_byBaseRatio(areaRatio, t);
    const areaHpx = Hb(isStandard ? 120 : 90, t);

    function drawArrowTips(leftXpx, boxWpx, areaYpx, areaHpx){
        c.fillStyle = palette.arrow;
        c.beginPath(); c.moveTo(leftXpx + S(6, t), areaYpx + areaHpx/2); c.lineTo(leftXpx + S(24, t), areaYpx + areaHpx/2 - S(18, t)); c.lineTo(leftXpx + S(24, t), areaYpx + areaHpx/2 + S(18, t)); c.closePath(); c.fill();
        const rightTipX = leftXpx + boxWpx;
        c.beginPath(); c.moveTo(rightTipX - S(6, t), areaYpx + areaHpx/2); c.lineTo(rightTipX - S(24, t), areaYpx + areaHpx/2 - S(18, t)); c.lineTo(rightTipX - S(24, t), areaYpx + areaHpx/2 + S(18, t)); c.closePath(); c.fill();
    }

    // styles handling
    if(arrowStyleSel.value === 'normal'){
        if(hasPrev && hasNext){
            const availBase = BASE_W - marginLeftBase - marginRightBase - gapBase;
            const boxWBase = Math.floor(availBase / 2);
            const leftXpx = X(marginLeftBase, t);
            const rightXpx = X(marginLeftBase + boxWBase + gapBase, t);
            const boxWpx = Wb(boxWBase, t);
            drawNormalBox(c, leftXpx, areaYpxComputed, boxWpx, areaHpx, 'left', palette.arrow, notchPx);
            drawNormalBox(c, rightXpx, areaYpxComputed, boxWpx, areaHpx, 'right', palette.arrow, notchPx);
            c.fillStyle = '#fff';
            c.textAlign = 'left';
            const pNamePx = fitTextPx(c, prevIn.value || '', 34, boxWpx - S(80, t), 10, '700', t.scaleMin);
            c.font = `700 ${pNamePx}px "Noto Sans JP", sans-serif`; c.fillText(prevIn.value || '', leftXpx + S(40, t), areaYpxComputed + areaHpx/2 - S(6, t));
            const pEnPx = Math.max(S(18, t), fitTextPx(c, prevEnIn.value || '', 40, boxWpx - S(80, t), 10, '600', t.scaleMin));
            c.font = `600 ${Math.round(pEnPx)}px "Noto Sans JP", sans-serif`; c.fillText(prevEnIn.value || '', leftXpx + S(40, t), areaYpxComputed + areaHpx/2 + S(28, t));
            c.textAlign = 'right';
            const nNamePx = fitTextPx(c, nextIn.value || '', 34, boxWpx - S(80, t), 10, '700', t.scaleMin);
            c.font = `700 ${nNamePx}px "Noto Sans JP", sans-serif`; c.fillText(nextIn.value || '', rightXpx + boxWpx - S(40, t), areaYpxComputed + areaHpx/2 - S(6, t));
            const nEnPx = Math.max(S(18, t), fitTextPx(c, nextEnIn.value || '', 40, boxWpx - S(80, t), 10, '600', t.scaleMin));
            c.font = `600 ${Math.round(nEnPx)}px "Noto Sans JP", sans-serif`; c.fillText(nextEnIn.value || '', rightXpx + boxWpx - S(40, t), areaYpxComputed + areaHpx/2 + S(28, t));
            drawArrowTips(leftXpx, boxWpx, areaYpxComputed, areaHpx);
        } else if(hasPrev){
            const boxWBase = Math.min(singleWBase, BASE_W - marginLeftBase - marginRightBase);
            const boxWpx = Wb(boxWBase, t);
            const xpx = X(marginLeftBase, t);
            drawNormalBox(c, xpx, areaYpxComputed, boxWpx, areaHpx, 'left', palette.arrow, notchPx);
            c.fillStyle = '#fff'; c.textAlign = 'left';
            const pNamePx = fitTextPx(c, prevIn.value || '', 36, boxWpx - S(80, t), 10, '700', t.scaleMin);
            c.font = `700 ${pNamePx}px "Noto Sans JP", sans-serif`; c.fillText(prevIn.value || '', xpx + S(40, t), areaYpxComputed + areaHpx/2 - S(6, t));
            const pEnPx = Math.max(S(18, t), fitTextPx(c, prevEnIn.value || '', 40, boxWpx - S(80, t), 10, '600', t.scaleMin));
            c.font = `600 ${Math.round(pEnPx)}px "Noto Sans JP", sans-serif`; c.fillText(prevEnIn.value || '', xpx + S(40, t), areaYpxComputed + areaHpx/2 + S(28, t));
            drawArrowTips(xpx, boxWpx, areaYpxComputed, areaHpx);
        } else if(hasNext){
            const boxWBase = Math.min(singleWBase, BASE_W - marginLeftBase - marginRightBase);
            const boxWpx = Wb(boxWBase, t);
            const xBase = BASE_W - marginRightBase - boxWBase;
            const xpx = X(xBase, t);
            drawNormalBox(c, xpx, areaYpxComputed, boxWpx, areaHpx, 'right', palette.arrow, notchPx);
            c.fillStyle = '#fff'; c.textAlign = 'right';
            const nNamePx = fitTextPx(c, nextIn.value || '', 36, boxWpx - S(80, t), 10, '700', t.scaleMin);
            c.font = `700 ${nNamePx}px "Noto Sans JP", sans-serif`; c.fillText(nextIn.value || '', xpx + boxWpx - S(40, t), areaYpxComputed + areaHpx/2 - S(6, t));
            const nEnPx = Math.max(S(18, t), fitTextPx(c, nextEnIn.value || '', 40, boxWpx - S(80, t), 10, '600', t.scaleMin));
            c.font = `600 ${Math.round(nEnPx)}px "Noto Sans JP", sans-serif`; c.fillText(nextEnIn.value || '', xpx + boxWpx - S(40, t), areaYpxComputed + areaHpx/2 + S(28, t));
            drawArrowTips(xpx, boxWpx, areaYpxComputed, areaHpx);
        }
    } else if(arrowStyleSel.value === 'between'){
        const centerGapBase = isStandard ? 220 : (is640 ? 140 : 120);
        const leftWBase = Math.floor((BASE_W - marginLeftBase - marginRightBase - centerGapBase) / 2);
        const rightWBase = leftWBase;
        const leftXpx = X(marginLeftBase, t);
        const rightXpx = X(marginLeftBase + leftWBase + centerGapBase, t);
        const leftWpx = Wb(leftWBase, t);
        const rightWpx = Wb(rightWBase, t);

        if(hasPrev){
            drawNormalBox(c, leftXpx, areaYpxComputed, leftWpx, areaHpx, 'left', palette.arrow, notchPx);
            c.fillStyle = '#fff'; c.textAlign = 'left';
            const pNamePx = fitTextPx(c, prevIn.value || '', 34, leftWpx - S(80, t), 10, '700', t.scaleMin);
            c.font = `700 ${pNamePx}px "Noto Sans JP", sans-serif`; c.fillText(prevIn.value || '', leftXpx + S(40, t), areaYpxComputed + areaHpx/2 - S(6, t));
            const pEnPx = Math.max(S(18, t), fitTextPx(c, prevEnIn.value || '', 40, leftWpx - S(80, t), 10, '600', t.scaleMin));
            c.font = `600 ${Math.round(pEnPx)}px "Noto Sans JP", sans-serif`; c.fillText(prevEnIn.value || '', leftXpx + S(40, t), areaYpxComputed + areaHpx/2 + S(28, t));
            drawArrowTips(leftXpx, leftWpx, areaYpxComputed, areaHpx);
        }

        if(hasNext){
            drawNormalBox(c, rightXpx, areaYpxComputed, rightWpx, areaHpx, 'right', palette.arrow, notchPx);
            c.fillStyle = '#fff'; c.textAlign = 'right';
            const nNamePx = fitTextPx(c, nextIn.value || '', 34, rightWpx - S(80, t), 10, '700', t.scaleMin);
            c.font = `700 ${nNamePx}px "Noto Sans JP", sans-serif`; c.fillText(nextIn.value || '', rightXpx + rightWpx - S(40, t), areaYpxComputed + areaHpx/2 - S(6, t));
            const nEnPx = Math.max(S(18, t), fitTextPx(c, nextEnIn.value || '', 40, rightWpx - S(80, t), 10, '600', t.scaleMin));
            c.font = `600 ${Math.round(nEnPx)}px "Noto Sans JP", sans-serif`; c.fillText(nextEnIn.value || '', rightXpx + rightWpx - S(40, t), areaYpxComputed + areaHpx/2 + S(28, t));
            drawArrowTips(rightXpx, rightWpx, areaYpxComputed, areaHpx);
        }

        // larger dashed connector for visibility
        const gapXpx = X(marginLeftBase + leftWBase, t);
        const gapEndXpx = X(marginLeftBase + leftWBase + centerGapBase, t);
        c.save();
        c.strokeStyle = palette.sep;
        c.lineWidth = Math.max(1, S(3, t)); // thicker than before
        // longer dashes and gaps
        c.setLineDash([12 * t.scaleMin, 10 * t.scaleMin]);
        c.beginPath(); c.moveTo(gapXpx + S(12,t), areaYpxComputed + areaHpx/2); c.lineTo(gapEndXpx - S(12,t), areaYpxComputed + areaHpx/2); c.stroke();
        c.setLineDash([]);
        c.restore();

    } else {
        const bandXpx = X(isStandard ? 80 : 60, t);
        const bandWpx = Wb(BASE_W - (isStandard ? 160 : 120), t);
        if(hasPrev && hasNext){
            drawDiamondBoth(c, bandXpx, areaYpxComputed, bandWpx, areaHpx, palette.arrow, palette.sub, tipPx);
            c.fillStyle = '#fff'; c.textAlign = 'center';
            const halfMax = (bandWpx / 2) - S(60, t);
            const pNamePx = fitTextPx(c, prevIn.value || '', 34, halfMax, 10, '700', t.scaleMin);
            c.font = `700 ${pNamePx}px "Noto Sans JP", sans-serif`; c.fillText(prevIn.value || '', bandXpx + bandWpx/4, areaYpxComputed + areaHpx/2 - S(6, t));
            const pEnPx = Math.max(S(18, t), fitTextPx(c, prevEnIn.value || '', 40, halfMax, 10, '600', t.scaleMin));
            c.font = `600 ${Math.round(pEnPx)}px "Noto Sans JP", sans-serif`; c.fillText(prevEnIn.value || '', bandXpx + bandWpx/4, areaYpxComputed + areaHpx/2 + S(28, t));
            const nNamePx = fitTextPx(c, nextIn.value || '', 34, halfMax, 10, '700', t.scaleMin);
            c.font = `700 ${nNamePx}px "Noto Sans JP", sans-serif`; c.fillText(nextIn.value || '', bandXpx + (3*bandWpx)/4, areaYpxComputed + areaHpx/2 - S(6, t));
            const nEnPx = Math.max(S(18, t), fitTextPx(c, nextEnIn.value || '', 40, halfMax, 10, '600', t.scaleMin));
            c.font = `600 ${Math.round(nEnPx)}px "Noto Sans JP", sans-serif`; c.fillText(nextEnIn.value || '', bandXpx + (3*bandWpx)/4, areaYpxComputed + areaHpx/2 + S(28, t));
        } else if(hasPrev){
            const boxWpx = Wb(Math.min(singleWBase, BASE_W - marginLeftBase - marginRightBase), t);
            drawDiamondSingleLeft(c, X(marginLeftBase, t), areaYpxComputed, boxWpx, areaHpx, palette.arrow, tipPx);
            c.fillStyle = '#fff'; c.textAlign = 'left';
            const pNamePx = fitTextPx(c, prevIn.value || '', 34, boxWpx - S(80, t), 10, '700', t.scaleMin);
            c.font = `700 ${pNamePx}px "Noto Sans JP", sans-serif`; c.fillText(prevIn.value || '', X(marginLeftBase + 40, t), areaYpxComputed + areaHpx/2 - S(6, t));
            const pEnPx = Math.max(S(18, t), fitTextPx(c, prevEnIn.value || '', 40, boxWpx - S(80, t), 10, '600', t.scaleMin));
            c.font = `600 ${Math.round(pEnPx)}px "Noto Sans JP", sans-serif`; c.fillText(prevEnIn.value || '', X(marginLeftBase + 40, t), areaYpxComputed + areaHpx/2 + S(28, t));
        } else if(hasNext){
            const boxWpx = Wb(Math.min(singleWBase, BASE_W - marginLeftBase - marginRightBase), t);
            const xBase = BASE_W - marginRightBase - Math.min(singleWBase, BASE_W - marginLeftBase - marginRightBase);
            drawDiamondSingleRight(c, X(xBase, t), areaYpxComputed, boxWpx, areaHpx, palette.arrow, tipPx);
            c.fillStyle = '#fff'; c.textAlign = 'right';
            const nNamePx = fitTextPx(c, nextIn.value || '', 34, boxWpx - S(80, t), 10, '700', t.scaleMin);
            c.font = `700 ${nNamePx}px "Noto Sans JP", sans-serif`; c.fillText(nextIn.value || '', X(xBase + boxWpx - 40, t), areaYpxComputed + areaHpx/2 - S(6, t));
            const nEnPx = Math.max(S(18, t), fitTextPx(c, nextEnIn.value || '', 40, boxWpx - S(80, t), 10, '600', t.scaleMin));
            c.font = `600 ${Math.round(nEnPx)}px "Noto Sans JP", sans-serif`; c.fillText(nextEnIn.value || '', X(xBase + boxWpx - 40, t), areaYpxComputed + areaHpx/2 + S(28, t));
        }
    }

    // company sign
    c.textAlign = 'right'; c.fillStyle = palette.sub;
    const compFont = fitTextPx(c, companyIn.value || '', 20, Wb(BASE_W * 0.45, t), 10, '700', t.scaleMin);
    c.font = `700 ${compFont}px "Noto Sans JP", sans-serif`;
    const companyY = Y_byBaseRatio((BASE_H - 26) / BASE_H, t);
    c.fillText(companyIn.value || '', X(BASE_W - 30, t), companyY);
}

// wrapper draw
function draw(){
    const sel = canvasSizeSel.value;
    if(sel === 'standard'){ canvas.width = 1200; canvas.height = 600; }
    else if(sel === '640x256'){ canvas.width = 640; canvas.height = 256; }
    else { canvas.width = 480; canvas.height = 240; }
    drawToCanvas(canvas);
}

// random center pick
function pickRandomCenter(){
    const idx = Math.floor(Math.random() * CIRCULAR.length);
    const prevIdx = (idx - 1 + CIRCULAR.length) % CIRCULAR.length;
    const nextIdx = (idx + 1) % CIRCULAR.length;
    const center = CIRCULAR[idx], prev = CIRCULAR[prevIdx], next = CIRCULAR[nextIdx];
    nameIn.value = center.jp; rubyIn.value = center.kana; enIn.value = center.en;
    prevIn.value = prev.jp; prevEnIn.value = prev.en;
    nextIn.value = next.jp; nextEnIn.value = next.en;
}

const BASE_THEME_OPTIONS = [
    ['sky','薄水色'],['purple','薄紫'],['pink','ピンク'],['teal','青緑'],
    ['mono','モノクロ'],['night','夜空'],['retro','レトロ'],
    ['blue','青（パステル）'],['yellow','黄色（パステル）'],['lime','黄緑（パステル）'],['brown','ブラウン（パステル）'],['orange','オレンジ（パステル）'],
    ['spring','春（桜）'],['sunrise','日の出'],['moon','月夜']
];

function updateThemeOptions(){
    const prevSelected = themeSel.value;
    themeSel.innerHTML = '';
    BASE_THEME_OPTIONS.forEach(([val,label])=>{
        const opt = document.createElement('option');
        opt.value = val; opt.textContent = label;
        themeSel.appendChild(opt);
    });

    const company = companyIn.value.trim();
    if(company === "Twotone Cosmos" || company === "ツートン・コスモス"){
        addSpecialThemeOption('hoshiYume');
        addSpecialThemeOption('hoshiKaze');
    } else if(company === "白羽根研究所"){
        addSpecialThemeOption('science');
    } else if(company === "ミックステープ楽団"){
        addSpecialThemeOption('melodic');
    }

    if(prevSelected && Array.from(themeSel.options).some(o => o.value === prevSelected)){
        themeSel.value = prevSelected;
    } else {
        themeSel.value = Array.from(themeSel.options).some(o=>o.value==='sky') ? 'sky' : themeSel.options[0].value;
    }
}

function addSpecialThemeOption(key){
    if(!SPECIAL_THEMES[key]) return;
    if(Array.from(themeSel.options).some(o=>o.value===key)) return;
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = SPECIAL_THEMES[key].label;
    themeSel.appendChild(opt);
}

// ランダム駅名
function generateRandomStationName(){
    // SURPRISE_SETS is [kanjiArray, kanaArray, engArray]
    const jpArr = SURPRISE_SETS[0];
    const kanaArr = SURPRISE_SETS[1];
    const engArr = SURPRISE_SETS[2];

    // 1～5個をランダムに連結
    const jpLen = Math.floor(Math.random() * 5) + 1;
    let one = [
        Math.floor(Math.random()*jpArr.length),
        Math.floor(Math.random()*jpArr.length),
        Math.floor(Math.random()*jpArr.length),
        Math.floor(Math.random()*jpArr.length),
        Math.floor(Math.random()*jpArr.length),
        Math.floor(Math.random()*jpArr.length)
    ];

    let jp = ''; for(let i=0;i<jpLen;i++) jp += jpArr[one[i]];
    let kana = ''; for(let i=0;i<jpLen;i++) kana += kanaArr[one[i]];
    // 英語は読みやすさのため単語連結
    let eng = ''; for(let i=0;i<jpLen;i++) eng += engArr[one[i]];
    return { jp, kana, en: eng };
}

// Surprise button behavior
surpriseBtn.addEventListener('click', ()=>{
    // ensure theme options are up to date (special themes depend on company)
    updateThemeOptions();

    // pick random theme from currently visible options
    const opts = Array.from(themeSel.options).map(o=>o.value);
    if(opts.length > 0){
        themeSel.value = opts[Math.floor(Math.random() * opts.length)];
    }

    // generate main / prev / next
    const main = generateRandomStationName();
    const prev = generateRandomStationName();
    const next = generateRandomStationName();

    // apply to inputs
    nameIn.value = main.jp;
    rubyIn.value = main.kana;
    enIn.value = main.en;

    prevIn.value = prev.jp;
    prevEnIn.value = prev.en;
    nextIn.value = next.jp;
    nextEnIn.value = next.en;

    // redraw
    draw();
});

// bindings
[nameIn, rubyIn, enIn, prevIn, prevEnIn, nextIn, nextEnIn, /*companyIn handled below*/, themeSel, arrowStyleSel, iconMode, bgMode, canvasSizeSel].forEach(el => el.addEventListener('input', draw));
iconFile.addEventListener('change', ()=>{});
bgFile.addEventListener('change', ()=>{});

// company changes update theme options
companyIn.addEventListener('input', ()=>{
    updateThemeOptions();
    draw();
});

resetBtn.addEventListener('click', ()=>{
    pickRandomCenter();
    companyIn.value = 'Saihouheiki Railway';
    updateThemeOptions();
    themeSel.value = 'sky';
    arrowStyleSel.value = 'normal';
    iconMode.value = 'circle';
    iconFile.value = '';
    bgFile.value = '';
    bgMode.value = 'none';
    state.icon = null; state.bg = null;
    draw();
});

downloadBtn.addEventListener('click', ()=>{
    const exportScale = 2;
    const out = document.createElement('canvas');
    out.width = canvas.width * exportScale;
    out.height = canvas.height * exportScale;
    // drawToCanvas expects canvas with correct pixel size; scaling context is not used here
    drawToCanvas(out);
    out.toBlob(blob=>{
        if(!blob) return;
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
        a.download = `${(enIn.value || 'station').replace(/\s+/g,'_')}.png`; document.body.appendChild(a); a.click();
        setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 150);
    }, 'image/png');
});

// init
(function init(){ pickRandomCenter(); updateThemeOptions(); draw(); })();
window.addEventListener('resize', ()=>{ draw(); });
