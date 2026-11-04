(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const canvas = $("guidePreview");
  const controls = {ratio:$("guideRatio"),theme:$("guideTheme"),frame:$("guideFrame"),arrow:$("guideArrow"),name:$("guideName"),english:$("guideEnglish"),distance:$("guideDistance"),layout:$("guideLayout")};
  const STORAGE_KEY = "guidesignGeneratorSlots", SLOT_COUNT = 5;
  const THEMES = {blue:["#0756a5","#fff"],deepblue:["#003b70","#fff"],navy:["#102747","#fff"],green:["#08783e","#fff"],brown:["#704522","#fff"],white:["#fff","#064b87"],black:["#171717","#fff"]};
  let fg = "#fff";
  const getSettings = () => Object.fromEntries(Object.entries(controls).map(([k,v])=>[k,v.value]));
  function fitFont(c,text,maxWidth,start,weight=700){let size=start;c.font=`${weight} ${size}px system-ui,-apple-system,"Noto Sans JP",sans-serif`;while(c.measureText(text).width>maxWidth&&size>12){size--;c.font=`${weight} ${size}px system-ui,-apple-system,"Noto Sans JP",sans-serif`;}return size;}
  function arrowPath(c,pts,head,width){c.save();c.strokeStyle=fg;c.fillStyle=fg;c.lineWidth=width;c.lineCap="butt";c.lineJoin="round";c.beginPath();c.moveTo(...pts[0]);pts.slice(1).forEach(p=>c.lineTo(...p));c.stroke();const [x1,y1]=pts.at(-2),[x2,y2]=pts.at(-1),a=Math.atan2(y2-y1,x2-x1),bx=x2-Math.cos(a)*head,by=y2-Math.sin(a)*head,h=head*.62;c.beginPath();c.moveTo(x2,y2);c.lineTo(bx+Math.sin(a)*h,by-Math.cos(a)*h);c.lineTo(bx-Math.sin(a)*h,by+Math.cos(a)*h);c.closePath();c.fill();c.restore();}
  function drawArrow(c, type, x, y, size) {
    const u = size / 100;
    const p = (a, b) => [x + a * u, y + b * u];
    const d = pts => arrowPath(
      c,
      pts.map(([a, b]) => p(a, b)),
      28 * u,
      13 * u
    );
  
    // 基本の直線矢印
    const simple = {
      right:     [[3, 50], [97, 50]],
      left:      [[97, 50], [3, 50]],
      up:        [[50, 97], [50, 3]],
      down:      [[50, 3], [50, 97]],
      upRight:   [[3, 97], [97, 3]],
      upLeft:    [[97, 97], [3, 3]],
      downRight: [[3, 3], [97, 97]],
      downLeft:  [[97, 3], [3, 97]]
    };
  
    if (simple[type]) return d(simple[type]);
  
    // 曲がる矢印
    const turns = {
      turnRight:     [[50, 97], [50, 50], [97, 50]],
      turnLeft:      [[50, 97], [50, 50], [3, 50]],
      turnUpRight:   [[3, 90], [50, 90], [50, 3]],
      turnUpLeft:    [[97, 90], [50, 90], [50, 3]],
      turnDownRight: [[3, 10], [50, 10], [50, 97]],
      turnDownLeft:  [[97, 10], [50, 10], [50, 97]]
    };
  
    if (turns[type]) return d(turns[type]);
  
    // Uターン
    if (type === "uRight") {
      return d([
        [25, 97], [25, 35], [38, 18],
        [62, 18], [75, 35], [75, 97]
      ]);
    }
  
    if (type === "uLeft") {
      return d([
        [75, 97], [75, 35], [62, 18],
        [38, 18], [25, 35], [25, 97]
      ]);
    }
  
    // 直進＋左右分岐
    if (
      type === "straightRight" ||
      type === "straightLeft" ||
      type === "both"
    ) {
      d([[50, 97], [50, 3]]);
  
      if (type !== "straightRight") {
        d([[50, 50], [3, 50]]);
      }
  
      if (type !== "straightLeft") {
        d([[50, 50], [97, 50]]);
      }
    }
  }

  function drawToCanvas(target){const ratio=Number(controls.ratio.value)||4,H=target.height,W=H*ratio;target.width=W;const c=target.getContext("2d"),palette=THEMES[controls.theme.value]||THEMES.blue;fg=palette[1];c.fillStyle=palette[0];c.fillRect(0,0,W,H);const pad=H*.055;
    if(controls.frame.value==="outer"||controls.frame.value==="inner"){const inset=controls.frame.value==="inner"?pad:2;c.strokeStyle=fg;c.lineWidth=Math.max(3,H*.012);c.strokeRect(inset,inset,W-inset*2,H-inset*2);}
    c.strokeStyle=fg;c.lineWidth=Math.max(3,H*.012);c.beginPath();c.moveTo(H,H*.16);c.lineTo(H,H*.84);c.stroke();const inset=controls.frame.value==="inner"?pad*1.8:pad;drawArrow(c,controls.arrow.value,inset,inset,H-inset*2);
    const tx=H+H*.16,right=W-H*.12,avail=right-tx,jp=controls.name.value||"",en=controls.english.value||"",dist=controls.distance.value||"";c.fillStyle=fg;c.textBaseline="middle";c.textAlign="left";
    if(controls.layout.value==="A"){const gap=H*.035,ds=dist?fitFont(c,dist,avail*.28,H*.19,600):0,dw=dist?Math.min(avail*.28,ds*4.5):0,jw=Math.max(20,avail-dw-gap),js=fitFont(c,jp,jw,H*.34,700);c.font=`700 ${js}px system-ui,-apple-system,"Noto Sans JP",sans-serif`;c.fillText(jp,tx,H*.40,jw);if(dist){c.textAlign="right";c.font=`600 ${ds}px system-ui,-apple-system,"Noto Sans JP",sans-serif`;c.fillText(dist,right,H*.40,dw);}const es=fitFont(c,en,avail,H*.19,500);c.textAlign="left";c.font=`500 ${es}px system-ui,-apple-system,"Noto Sans JP",sans-serif`;c.fillText(en,tx,H*.72,avail);
    }else{for(const r of [{t:jp,y:.25,s:.27,w:700},{t:en,y:.52,s:.19,w:500},{t:dist,y:.77,s:.16,w:600}]){const size=fitFont(c,r.t,avail,H*r.s,r.w);c.font=`${r.w} ${size}px system-ui,-apple-system,"Noto Sans JP",sans-serif`;c.fillText(r.t,tx,H*r.y,avail);}}
  }
  function draw(){const h=500;canvas.width=h*(Number(controls.ratio.value)||4);canvas.height=h;drawToCanvas(canvas);}
  function applySettings(s={}){for(const [k,el] of Object.entries(controls)){if(typeof s[k]==="string"&&Array.from(el.options).some(o=>o.value===s[k]))el.value=s[k];else if(typeof s[k]==="string"&&el.tagName==="INPUT")el.value=s[k];}draw();}
  function download(){const out=document.createElement("canvas");out.height=1200;out.width=out.height*(Number(controls.ratio.value)||4);drawToCanvas(out);out.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`${(controls.name.value.trim()||"guidesign").replace(/[\\/:*?"<>|]/g,"_")}.png`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);},"image/png");}
  function slots(){try{const v=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");return Array.from({length:SLOT_COUNT},(_,i)=>Array.isArray(v)&&v[i]&&typeof v[i].name==="string"&&v[i].settings?v[i]:null);}catch{return Array(SLOT_COUNT).fill(null);}}
  function setSlots(v){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(v));return true;}catch(e){console.error(e);alert("保存に失敗しました。ブラウザの保存容量や設定をご確認ください。");return false;}}
  function makeButton(label,fn,cls=""){const b=document.createElement("button");b.type="button";b.textContent=label;if(cls)b.className=cls;b.addEventListener("click",fn);return b;}
  function renderSlots(){const list=$("guideStorageList");list.replaceChildren();slots().forEach((item,i)=>{const box=document.createElement("div");box.className="guidesign-storage-slot";const head=document.createElement("div");head.className="guidesign-slot-header";const title=document.createElement("b");title.textContent=`スロット ${i+1}`;const status=document.createElement("span");status.className="guidesign-slot-status";status.textContent=item?"保存済み":"空きスロット";head.append(title,status);box.append(head);
      if(!item){const d=document.createElement("div");d.className="guidesign-slot-date";d.textContent="まだ設定は保存されていません。";box.append(d,makeButton("現在の設定を保存",()=>saveSlot(i)));}else{const n=document.createElement("div");n.className="guidesign-slot-name";n.textContent=item.name;const d=document.createElement("div");d.className="guidesign-slot-date";const date=new Date(item.savedAt);d.textContent=Number.isNaN(date.getTime())?"保存日時不明":`最終保存：${date.toLocaleString("ja-JP")}`;const actions=document.createElement("div");actions.className="guidesign-slot-actions";actions.append(makeButton("読み込む",()=>loadSlot(i)),makeButton("上書き保存",()=>saveSlot(i,true)),makeButton("削除",()=>deleteSlot(i),"delete-button"));box.append(n,d,actions);}list.append(box);});}
  function saveSlot(i,overwrite=false){const data=slots();let name=overwrite&&data[i]?data[i].name:prompt(`スロット ${i+1} に保存する名前を入力してください。`,controls.name.value.trim()||"名称未設定");if(name===null)return;name=name.trim();if(!name){alert("保存名を入力してください。");return;}data[i]={name,savedAt:new Date().toISOString(),settings:getSettings()};if(setSlots(data)){renderSlots();alert(`「${name}」を保存しました。`);}}
  function loadSlot(i){const item=slots()[i];if(!item||!confirm(`「${item.name}」を読み込みますか？\n現在の設定は置き換えられます。`))return;applySettings(item.settings);closeModal();}
  function deleteSlot(i){const data=slots();if(!data[i]||!confirm(`「${data[i].name}」を削除しますか？`))return;data[i]=null;if(setSlots(data))renderSlots();}
  function openModal(){renderSlots();$("guideStorageModal").hidden=false;$("guideCloseStorageBtn").focus();}function closeModal(){$("guideStorageModal").hidden=true;$("guideStorageBtn").focus();}
  Object.values(controls).forEach(el=>el.addEventListener("input",draw));$("guideDownloadBtn").addEventListener("click",download);$("guideResetBtn").addEventListener("click",()=>{Object.assign(controls.ratio,{value:"4"});controls.theme.value="blue";controls.frame.value="none";controls.arrow.value="right";controls.name.value="望意岡";controls.english.value="Motchiy Oka";controls.distance.value="500 m";controls.layout.value="A";draw();});$("guideStorageBtn").addEventListener("click",openModal);$("guideCloseStorageBtn").addEventListener("click",closeModal);$("guideStorageModal").addEventListener("click",e=>{if(e.target===$("guideStorageModal"))closeModal();});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("guideStorageModal").hidden)closeModal();});draw();
})();
