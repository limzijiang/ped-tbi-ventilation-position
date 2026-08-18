/* Build ped-tbi-etco2-teaching.pptx — mirrors the 31-slide HTML deck.
   Design rules followed: dark theme throughout, one repeating motif (rounded
   tinted cards), every slide carries a visual element, every named source is a
   hyperlink, no emoji (emoji runs crash Mac PowerPoint), no accent stripes. */
const pptxgen = require('pptxgenjs');

/* ---------- palette ---------- */
const C = {
  bg:'0C0E13', card:'171D27', card2:'212A38', line:'323C4C',
  ink:'E9EDF3', white:'FFFFFF', muted:'A6B0BE', dim:'8A94A3',
  red:'E2404C', redBg:'2A1519', amber:'F0A836', amberBg:'2B2113',
  teal:'3EC6B4', tealBg:'12262A', blue:'6FB6EF', green:'5FBF6A',
};
const F = 'Arial';
const W = 13.333, H = 7.5, M = 0.62, CW = W - M*2;

/* ---------- single source of truth for citations ---------- */
const DOI = {
  btf3:      'https://doi.org/10.1080/10903127.2023.2187905',
  btf3exec:  'https://doi.org/10.1227/neu.0000000000002672',
  btfPed:    'https://doi.org/10.1097/PCC.0000000000001735',
  epic:      'https://doi.org/10.1001/jamasurg.2019.1152',
  epic4kids: 'https://doi.org/10.1016/j.annemergmed.2020.09.435',
  headMeta:  'https://doi.org/10.1007/s12028-024-02020-3',
  cochrane:  'https://doi.org/10.1002/14651858.CD009986.pub2',
  yang:      'https://doi.org/10.1001/jamanetworkopen.2019.9448',
  gap:       'https://doi.org/10.1038/s41598-021-89913-x',
  lites:     'https://doi.org/10.1001/jamanetworkopen.2024.57506',
  co2meta:   'https://doi.org/10.1186/s13054-025-05604-3',
  mimic:     'https://doi.org/10.1007/s12028-021-01312-2',
  kannan:    'https://doi.org/10.1097/PEC.0000000000000803',
  emsProt:   'https://doi.org/10.1016/j.ajem.2024.07.063',
  emsStd:    'https://doi.org/10.1016/j.injury.2021.01.008',
  acs:       'https://www.facs.org/quality-programs/trauma/quality/best-practices-guidelines/',
};

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';               // must be set before any slide
pres.author = '林自強';
pres.title  = '小兒疑似頭部外傷：抬高床頭、避免過度換氣、EtCO2 監測';

/* ---------- run builders (fresh object every call — pptxgenjs mutates) ---- */
const t  = (text, o={}) => Object.assign({ text }, { options: Object.assign({ fontFace:F, fontSize:14, color:C.ink }, o) });
const b  = (text, o={}) => t(text, Object.assign({ bold:true, color:C.white }, o));
const lk = (text, url, o={}) => t(text, Object.assign({ hyperlink:{ url }, color:C.blue, underline:{ style:'sng' } }, o));

/* ---------- chrome ---------- */
let n = 0;
function newSlide(kicker, title, sub){
  const s = pres.addSlide();
  s.background = { color: C.bg };
  n++;
  if (kicker) s.addText(kicker.toUpperCase(), { x:M, y:0.24, w:CW, h:0.34, fontFace:F,
    fontSize:11.5, bold:true, color:C.red, charSpacing:2.4, margin:0, valign:'middle' });
  if (title) s.addText(title, { x:M, y:0.52, w:CW, h:0.62, fontFace:F, fontSize:29,
    bold:true, color:C.white, valign:'top', margin:0 });
  if (sub) s.addText(sub, { x:M, y:1.14, w:CW, h:0.32, fontFace:F, fontSize:13.5, color:C.muted, margin:0 });
  s.addText(String(n), { x:W-1.1, y:H-0.5, w:0.5, h:0.3, fontFace:F, fontSize:11, color:C.dim, align:'right' });
  s.addText('小兒疑似 TBI：抬高床頭 · 避免過度換氣 · EtCO2', { x:M, y:H-0.5, w:6, h:0.3,
    fontFace:F, fontSize:10.5, color:'5A6472' });
  return s;
}
const TOP = 1.62;          // first content row when there is a sub-title
const TOPN = 1.36;         // first content row when there is not

/* ---------- components ---------- */
function card(s, o){
  const tone = o.tone || 'plain';
  const fill = { plain:C.card, red:C.redBg, teal:C.tealBg, amber:C.amberBg }[tone];
  const edge = { plain:C.line, red:'6E2A31', teal:'23604F', amber:'6B5220' }[tone];
  s.addShape(pres.ShapeType.roundRect, { x:o.x, y:o.y, w:o.w, h:o.h,
    fill:{ color:fill }, line:{ color:edge, width:1 }, rectRadius:0.09 });
  let cy = o.y + 0.16;
  if (o.lbl){
    s.addText(o.lbl.toUpperCase(), { x:o.x+0.22, y:cy, w:o.w-0.44, h:0.24, fontFace:F,
      fontSize:10.5, bold:true, color:C.dim, charSpacing:1.6, margin:0 });
    cy += 0.26;
  }
  if (o.title){
    s.addText(o.title, { x:o.x+0.22, y:cy, w:o.w-0.44, h:0.32, fontFace:F, fontSize:16.5,
      bold:true, color:C.white, margin:0 });
    cy += 0.38;
  }
  if (o.body) s.addText(o.body, { x:o.x+0.22, y:cy, w:o.w-0.44, h:o.y+o.h-cy-0.14,
    fontFace:F, fontSize:o.fs||13, color:C.ink, margin:0, valign:'top', lineSpacingMultiple:1.18 });
  if (o.bullets){
    const items = o.bullets.map((it,i) => {
      const runs = Array.isArray(it) ? it : [t(it)];
      const last = i === o.bullets.length-1;
      return runs.map((r,j) => {
        const opt = Object.assign({}, r.options, { fontSize:o.fs||13, bullet:{ code:'2022', indent:14 } });
        if (j < runs.length-1) delete opt.breakLine; else if (!last) opt.breakLine = true;
        if (j > 0) delete opt.bullet;
        return { text:r.text, options:opt };
      });
    }).flat();
    s.addText(items, { x:o.x+0.24, y:cy, w:o.w-0.46, h:o.y+o.h-cy-0.14, margin:0,
      valign:'top', color:C.ink, fontFace:F, paraSpaceAfter:5 });
  }
}
function stat(s,o){
  s.addShape(pres.ShapeType.roundRect,{ x:o.x, y:o.y, w:o.w, h:o.h, fill:{color:C.card2},
    line:{color:C.line,width:1}, rectRadius:0.08 });
  const nfs = o.nfs||30, nh = nfs*1.32/72;          // room for the tallest glyph + leading
  s.addText(o.n, { x:o.x, y:o.y+0.1, w:o.w, h:nh, fontFace:F, fontSize:nfs, bold:true,
    color:o.tone||C.red, align:'center', margin:0, valign:'middle' });
  s.addText(o.k, { x:o.x+0.1, y:o.y+0.12+nh, w:o.w-0.2, h:o.h-0.22-nh, fontFace:F, fontSize:11,
    color:C.muted, align:'center', margin:0, valign:'top' });
}
/* the recurring 比喻 device — tinted card + label chip, no edge stripe */
function analogy(s,o){
  s.addShape(pres.ShapeType.roundRect,{ x:o.x, y:o.y, w:o.w, h:o.h, fill:{color:C.amberBg},
    line:{color:'6B5220',width:1}, rectRadius:0.08 });
  s.addShape(pres.ShapeType.roundRect,{ x:o.x+0.2, y:o.y+0.17, w:0.62, h:0.3,
    fill:{color:C.amber}, line:{color:C.amber,width:1}, rectRadius:0.14 });
  s.addText('比喻', { x:o.x+0.2, y:o.y+0.17, w:0.62, h:0.3, fontFace:F, fontSize:11.5,
    bold:true, color:'1A1206', align:'center', valign:'middle', margin:0 });
  s.addText(o.runs, { x:o.x+0.92, y:o.y+0.13, w:o.w-1.14, h:o.h-0.26, fontFace:F,
    fontSize:o.fs||12.5, color:C.ink, margin:0, valign:'middle', lineSpacingMultiple:1.16 });
}
function note(s,o){
  s.addShape(pres.ShapeType.roundRect,{ x:o.x, y:o.y, w:o.w, h:o.h, fill:{color:'1D2028'},
    line:{color:'4A4331',width:1}, rectRadius:0.07 });
  s.addText(o.runs, { x:o.x+0.24, y:o.y+0.12, w:o.w-0.48, h:o.h-0.24, fontFace:F,
    fontSize:o.fs||12.5, color:C.ink, margin:0, valign:'middle', lineSpacingMultiple:1.16 });
}
function quote(s,o){
  s.addText(o.runs, { x:o.x, y:o.y, w:o.w, h:o.h, fontFace:F, fontSize:o.fs||16,
    color:C.white, italic:true, margin:0, valign:'middle', lineSpacingMultiple:1.2 });
}
function table(s,o){
  const head = o.head.map(h => ({ text:h, options:{ bold:true, color:C.dim, fontSize:11,
    fill:{color:C.card2}, valign:'middle' } }));
  const rows = o.rows.map(r => r.map(c => {
    const cell = (typeof c === 'string') ? { text:c } : c;
    return { text:cell.text, options:Object.assign({ fontSize:o.fs||11.5, color:C.ink,
      valign:'middle', fill:{ color: cell.key ? '241A1E' : C.card } }, cell.opt||{}) };
  }));
  s.addTable([head, ...rows], { x:o.x, y:o.y, w:o.w, colW:o.colW, rowH:o.rowH||0.3,
    fontFace:F, border:{ type:'solid', color:C.line, pt:0.75 }, margin:5, autoPage:false });
}
function srcline(s,y,runs,h){
  s.addText(runs, { x:M, y, w:CW, h:h||0.34, fontFace:F, fontSize:10.5, color:C.dim,
    margin:0, valign:'top', lineSpacingMultiple:1.15 });
}
const sm = { fontSize:10.5, color:C.dim };

/* ======================= 1 · TITLE ======================= */
{
  const s = pres.addSlide(); s.background = { color:C.bg }; n++;
  s.addShape(pres.ShapeType.rect,{ x:0, y:0, w:W, h:H, fill:{ color:'1A0E12' } });
  s.addShape(pres.ShapeType.ellipse,{ x:-2.4, y:-2.6, w:9.5, h:7.2,
    fill:{ color:C.red, transparency:82 }, line:{ color:C.red, width:0 } });
  s.addText('EMT / EMT-P 進階救護教學', { x:M, y:1.75, w:CW, h:0.34, fontFace:F, fontSize:13,
    bold:true, color:C.red, charSpacing:2.6 });
  s.addText([ b('小兒疑似頭部外傷的三件事', { fontSize:40, breakLine:true }),
              t('抬高床頭 · 避免過度換氣 · EtCO2 監測', { fontSize:34, bold:true, color:C.red }) ],
    { x:M, y:2.2, w:CW, h:1.5, margin:0, valign:'top', lineSpacingMultiple:1.18 });
  s.addText('先看成人證據力，再看小兒有多少 —— 然後化簡成現場記得住的口訣', {
    x:M, y:3.9, w:CW, h:0.4, fontFace:F, fontSize:16, color:C.muted, margin:0 });
  s.addShape(pres.ShapeType.line,{ x:M, y:4.6, w:8.6, h:0, line:{ color:C.line, width:1 } });
  s.addText([
    t('實證來源：BTF 院前指引 3rd ed（2023）· BTF 小兒重度 TBI 指引 3rd ed（2019）· EPIC / EPIC4Kids · Cochrane · 2024–2025 meta-analyses', { fontSize:11.5, color:C.dim, breakLine:true }),
    t('2026-08-17 版　·　線上投影片與長文版：', { fontSize:11.5, color:C.dim }),
    lk('limzijiang.github.io/ped-tbi-ventilation-position', 'https://limzijiang.github.io/ped-tbi-ventilation-position/', { fontSize:11.5 }),
  ], { x:M, y:4.8, w:CW, h:0.9, margin:0, valign:'top', lineSpacingMultiple:1.3 });
  s.addNotes('開場：這堂課只講三件事，而且會誠實說明每一件事的證據有多少。重點順序是：別吹快 > 血壓血氧 > 床頭角度。');
}

/* ======================= 2 · BOTTOM LINE ======================= */
{
  const s = newSlide('Bottom line','一句話結論','三個數字 + 一個例外，其餘都是細節');
  const mw = (CW - 0.5)/3;
  [['30°','頭（整床／整板）抬高\n但血壓先達標',C.red],
   ['10','成人約 10 次/分\n小孩照 EtCO2 調',C.amber],
   ['40','EtCO2 目標 40\n範圍 35–45',C.teal]].forEach((m,i)=>{
    stat(s,{ x:M+i*(mw+0.25), y:TOP, w:mw, h:1.78, n:m[0], k:m[1], tone:m[2], nfs:40 });
  });
  card(s,{ x:M, y:TOP+1.96, w:CW, h:1.36, tone:'red', lbl:'唯一的例外', body:'' });
  s.addText([ b('只有出現腦疝徵象才可以吹快'),
    t('（瞳孔散大固定、姿勢異常、Cushing triad、GCS<9 或持續惡化），目標 '),
    b('EtCO2 30–35', { color:C.red }), t('，時間越短越好。一到院、徵象一改善就回到 40。') ],
    { x:M+0.24, y:TOP+2.28, w:CW-0.48, h:0.95, fontFace:F, fontSize:14.5, color:C.ink,
      margin:0, valign:'top', lineSpacingMultiple:1.2 });
  analogy(s,{ x:M, y:TOP+3.5, w:CW, h:0.86, runs:[
    t('過度換氣是'), b('滅火器',{color:C.amber}),
    t('：真的失火時該按下去，但沒有人會一路噴著滅火器開車 —— 預防性地一直吹快，等於把腦血流一路噴掉。') ]});
  s.addNotes('口訣先給，證據後補。學員記得住的是三個數字，不是研究名稱。');
}

/* ======================= 3 · 二次腦傷 ======================= */
{
  const s = newSlide('Why it matters','我們在對抗的是「二次腦傷」','撞擊那一下我們改不了；接下來 30 分鐘可以');
  const cw = (CW-0.35)/2;
  card(s,{ x:M, y:TOP, w:cw, h:2.05, tone:'red', title:'三個可修正的傷害', bullets:[
    [b('缺氧　'), t('SpO2 < 90%')],
    [b('低血壓　'), t('（依年齡別目標）')],
    [b('低碳酸　'), t('EtCO2 < 35，也就是吹太快')] ], fs:13.5 });
  card(s,{ x:M+cw+0.35, y:TOP, w:cw, h:2.05, tone:'teal', title:'為什麼低碳酸會傷腦', bullets:[
    'CO2 掉 → 腦血管收縮 → 腦血流下降',
    [t('受傷早期約一半病人腦血流已掉到剩 '), b('1/3')],
    '此時再吹快＝在缺血的腦上再減供血' ], fs:13.5 });
  analogy(s,{ x:M, y:TOP+2.25, w:CW, h:0.9, runs:[
    t('CO2 是腦血管的'), b('瓦斯旋鈕',{color:C.amber}),
    t('。把 CO2 吹掉，就是把旋鈕轉小 —— 螢幕上的「腦壓」看起來乖了，但爐火（腦血流）也一起小了。') ]});
  note(s,{ x:M, y:TOP+3.3, w:CW, h:0.92, runs:[
    b('本課的排序邏輯：'),
    t('有病人預後證據的優先教（避免過度換氣、血壓、血氧）；只有生理指標證據的放後面（抬高床頭）。') ]});
  s.addNotes('把「二次腦傷」講成唯一能改變的東西，學員才會認真看待通氣速率這種看似瑣碎的事。');
}

/* ======================= 4 · EVIDENCE MAP ======================= */
{
  const s = newSlide('Evidence map','三項干預的證據力不一樣','教學力度應該跟著證據力走，不要三件事都講得一樣硬');
  table(s,{ x:M, y:TOP, w:CW, colW:[2.5,4.0,3.0,2.59], rowH:0.62, fs:11.5,
    head:['干預','成人證據','小兒證據','臨床結果證據'],
    rows:[
      [{text:'避免過度換氣',key:1,opt:{bold:true,color:C.white}},
       {text:'多篇觀察性研究方向一致＋EPIC 前後對照（較強）',key:1},
       {text:'BTF 小兒指引 Level III（weak）',key:1},{text:'死亡率、神經預後',key:1}],
      ['連續 EtCO2 監測','BTF 3rd ed Strong 建議，但屬過程指標（中）','不表態能否取代 PaCO2','無直接 RCT'],
      ['抬高床頭 30°','降 ICP 有效；Cochrane 評 very low（最弱）','完全沒有分級建議','無任何資料'],
    ]});
  s.addText('證據等級為本簡報依各指引原文與系統性回顧結論歸納（概算式分級，非官方 GRADE 評分）。',
    { x:M, y:TOP+2.05, w:CW, h:0.26, fontFace:F, fontSize:10.5, color:C.dim, margin:0 });
  analogy(s,{ x:M, y:TOP+2.45, w:CW, h:1.0, runs:[
    t('像出門帶的三樣東西：'), b('安全帶',{color:C.amber}), t('（避免吹快，證據硬）、'),
    b('後照鏡',{color:C.amber}), t('（EtCO2，幫你知道有沒有做對）、'),
    b('坐墊高度',{color:C.amber}), t('（抬高床頭，合理、舒服，但沒人證明它救命）。') ]});
  s.addNotes('這張表決定後面所有內容的講述力度。學員最容易犯的錯是把三件事講得一樣重要。');
}

/* ======================= 5 · 抬高床頭 數據 ======================= */
{
  const s = newSlide('成人 · 抬高床頭 1/3','30° 確實降腦壓 —— 但只降腦壓','2024 年系統性回顧與 meta 分析，25 篇研究（16 篇可量化）');
  const sw = (CW-0.75)/4;
  [['−5.58','ICP（mmHg）\n30° vs 平躺，p<0.00001',C.red,30],
   ['−2.48','CPP（mmHg）\np=0.13 無差異',C.amber,30],
   ['0','腦氧 SjvO2、PbtO2\n無差異',C.amber,30],
   ['無資料','死亡率／功能預後',C.white,24]].forEach((v,i)=>{
    stat(s,{ x:M+i*(sw+0.25), y:TOP, w:sw, h:1.55, n:v[0], k:v[1], tone:v[2], nfs:v[3] });
  });
  card(s,{ x:M, y:TOP+1.75, w:CW, h:0.95, body:'' });
  s.addText([ t('TBI 次群組結果一致；抬高超過 30° 通常再降一些 ICP，但 '),
    b('45° 並沒有比 30° 更好'), t('。也就是說：30° 是合理的停損點，沒有理由抬更高。') ],
    { x:M+0.24, y:TOP+1.9, w:CW-0.48, h:0.65, fontFace:F, fontSize:13.5, color:C.ink,
      margin:0, valign:'middle', lineSpacingMultiple:1.18 });
  analogy(s,{ x:M, y:TOP+2.9, w:CW, h:1.0, runs:[
    t('抬高床頭像'), b('把水塔的洩壓閥打開',{color:C.amber}),
    t('：管壓（ICP）確實降了，但如果幫浦（血壓）本來就弱，頂樓（腦）拿到的水並沒有變多 —— 這正是 CPP 沒改善的意思。') ]});
  srcline(s, TOP+4.06, [ t('來源：',sm), lk('Neurocritical Care 2024 系統性回顧／meta 分析', DOI.headMeta, sm) ]);
  s.addNotes('重點不是 5.58 這個數字，是「只降了一個中間指標」。');
}

/* ======================= 6 · Cochrane ======================= */
{
  const s = newSlide('成人 · 抬高床頭 2/3','Cochrane：證據品質 very low，而且可能有害','這一頁是為什麼「抬高」不能教成鐵律');
  s.addShape(pres.ShapeType.rect,{ x:M, y:TOP, w:0.035, h:1.0, fill:{color:C.red}, line:{color:C.red,width:0} });
  quote(s,{ x:M+0.24, y:TOP, w:CW-0.24, h:1.0, runs:[ t('「研究之間缺乏一致性、資料稀少、受試者反應變異大，且沒有證據顯示此效果與臨床結果有適當相關 —— 使我們無法對臨床實務下結論。」',{ italic:true, color:C.white, fontSize:15.5 }) ]});
  const cw = (CW-0.35)/2;
  card(s,{ x:M, y:TOP+1.2, w:cw, h:1.75, tone:'red', title:'可能的傷害', bullets:[
    [t('靜脈回流減少 → '), b('CPP 下降、腦缺血')],
    '在 autoregulation 受損者風險更高',
    '低血容外傷病人容易被抬出低血壓' ], fs:13 });
  card(s,{ x:M+cw+0.35, y:TOP+1.2, w:cw, h:1.75, tone:'teal', title:'Cochrane 的替代建議', bullets:[
    [t('角度應'), b('個別化'), t('，依 ICP／CPP／血壓反應調整')],
    '不是套用固定 30° 目標' ], fs:13 });
  analogy(s,{ x:M, y:TOP+3.15, w:CW, h:0.9, runs:[
    t('為了讓電費帳單漂亮而'), b('關掉冷氣主機',{color:C.amber}),
    t(' —— 數字（ICP）確實好看了，但人在裡面熱昏（腦缺血）。降腦壓不是目的，維持腦灌流才是。') ]});
  srcline(s, TOP+4.2, [ t('來源：',sm), lk('Cochrane 2017：Elevation of the Head in Severe TBI', DOI.cochrane, sm) ]);
  s.addNotes('這段話要念出來。它是全課唯一一個「指引級文獻說我們不知道」的例子。');
}

/* ======================= 7 · 院前協定 ======================= */
{
  const s = newSlide('成人 · 抬高床頭 3/3','院前協定自己也不統一','如果它真的很關鍵，協定不會長這樣');
  const cw = (CW-0.35)/2;
  card(s,{ x:M, y:TOP, w:cw, h:2.0, tone:'amber', title:'美國 32 州 EMS 協定盤點' });
  stat(s,{ x:M+0.35, y:TOP+0.72, w:cw-0.7, h:1.1, n:'15 / 32', k:'（46.9%）才明文寫「抬高床頭」為降腦壓措施', tone:C.amber, nfs:30 });
  card(s,{ x:M+cw+0.35, y:TOP, w:cw, h:2.0, title:'另一份協定 benchmark 研究', bullets:[
    [t('抬高床頭被寫進協定的比例，'), b('遠低於'), t('氧氣／通氣與血壓目標')],
    '腦疝處置與再評估頻率是最大缺口' ], fs:13 });
  note(s,{ x:M, y:TOP+2.2, w:CW, h:1.0, runs:[
    b('ACS Best Practices 談後送時只寫：'),
    t('避免低血壓、缺氧、高碳酸、低體溫，並快速送到最高等級創傷中心 —— '), b('沒有指定床頭角度。') ]});
  srcline(s, TOP+3.4, [ t('來源：',sm), lk('Am J Emerg Med 2024 州級協定回顧', DOI.emsProt, sm),
    t('　·　',sm), lk('Injury 2021：EMS 協定標準化呼籲', DOI.emsStd, sm),
    t('　·　',sm), lk('ACS Best Practices in TBI', DOI.acs, sm) ]);
  s.addNotes('用「協定自己都不寫」來收斂床頭角度的分量，避免學員把它當救命動作。');
}

/* ======================= 8 · 過度換氣 觀察性證據 ======================= */
{
  const s = newSlide('成人 · 過度換氣 1/4','吹太快與吹太慢都增加死亡','這是本課證據最硬的一段');
  table(s,{ x:M, y:TOP, w:CW, colW:[3.6,8.49], rowH:0.5, fs:11.5,
    head:['研究','發現'],
    rows:[
      ['Davis（2005）、Caulfield（2009）','院前過度換氣、到院 PaCO2 偏低 → 死亡率上升、GOS 較差'],
      [{text:'Dumont（2010）',key:1},{text:'過度換氣與換氣不足「兩端」都獨立增加死亡風險',key:1,opt:{bold:true,color:C.white}}],
      ['院前 RSI 觀察','接受院前 RSI 者 15% 到院 PaCO2 < 25 mmHg（未插管對照組 8%）'],
      ['LITES Network（2024）','院前 EtCO2 < 35 與缺氧、低血壓並列為可修正的有害事件'],
      ['Crit Care 2025 meta（約 42,000 人）','缺氧 aOR 1.39；低碳酸 aOR 1.64；高碳酸 aOR 1.74（95% CI 0.91–3.32，未達顯著）'],
    ]});
  srcline(s, TOP+2.68, [ t('Davis／Caulfield／Dumont 三篇為 ',sm), lk('BTF 院前指引 3rd ed', DOI.btf3, sm),
    t(' 所引用之依據研究。其餘見 ',sm), lk('JAMA Netw Open 2024（LITES）', DOI.lites, sm),
    t('、',sm), lk('Crit Care 2025 meta', DOI.co2meta, sm) ], 0.58);
  analogy(s,{ x:M, y:TOP+3.4, w:CW, h:0.95, runs:[
    t('院前 RSI 那個 '), b('15% vs 8%',{color:C.amber}), t(' 說明的不是知識不足，是'),
    b('手會抖',{color:C.amber}), t(' —— 插管後緊張，一分鐘就多捏了十下。所以速率必須「設定」，不能「即興」。') ]});
  s.addNotes('這一頁是全課的說服核心：不是理論，是多篇資料方向一致。');
}

/* ======================= 9 · U 型曲線 + 帶狀圖 ======================= */
{
  const s = newSlide('成人 · 過度換氣 2/4','PaCO2 是 U 型曲線，最低點在 40 附近','不是「越低越安全」，也不是「隨便就好」');
  /* linear 20–60 band: value v -> x = M + (v-20)/40*CW */
  const px = v => M + (v-20)/40*CW;
  const seg = (a,z,fill,label,col) => {
    s.addShape(pres.ShapeType.rect,{ x:px(a), y:TOP, w:px(z)-px(a), h:0.62,
      fill:{ color:fill }, line:{ color:C.line, width:0.75 } });
    if (label) s.addText(label, { x:px(a), y:TOP, w:px(z)-px(a), h:0.62, fontFace:F,
      fontSize:12, bold:true, color:col||C.white, align:'center', valign:'middle', margin:0 });
  };
  seg(20,30,'3A1D22','< 30　救援專用','F4A0A7');
  seg(30,35,'4A3A18','30–35',C.amber);
  seg(35,45,'12403C','35–45　目標區（瞄 40）',C.teal);
  seg(45,50,C.card2,'');
  seg(50,60,'3A1D22','> 50　過度堆積','F4A0A7');
  [20,30,40,50,60].forEach(v => {
    const align = v===20 ? 'left' : (v===60 ? 'right' : 'center');
    const x = v===20 ? px(20) : (v===60 ? px(60)-0.6 : px(v)-0.3);
    s.addText(String(v), { x, y:TOP+0.64, w:0.6, h:0.24, fontFace:F, fontSize:10.5,
      color:C.dim, align, margin:0 });
  });
  s.addText('橫軸為 PaCO2（mmHg）線性刻度 20–60；整條帶為示意圖，區間依下列文獻繪製。',
    { x:M, y:TOP+0.9, w:CW, h:0.24, fontFace:F, fontSize:10.5, color:C.dim, margin:0 });
  const cw = (CW-0.35)/2;
  card(s,{ x:M, y:TOP+1.3, w:cw, h:1.5, tone:'teal', title:'MIMIC-III／IV 顱腦損傷分析', bullets:[
    [t('院內死亡率最低點：PaCO2 '), b('≈ 39.5 mmHg')],
    [t('整體風險最低區間：'), b('35–45')] ], fs:13 });
  card(s,{ x:M+cw+0.35, y:TOP+1.3, w:cw, h:1.5, tone:'red', title:'兩端都是壞事', bullets:[
    '吹太快 → 腦血管收縮、腦缺血',
    '吹太慢 → 腦血管擴張、ICP 上升' ], fs:13 });
  analogy(s,{ x:M, y:TOP+3.0, w:CW, h:0.8, runs:[
    t('像'), b('烤箱溫度',{color:C.amber}), t('：太低麵包不熟、太高直接焦掉。沒有「保險起見調低一點」這種選項。') ]});
  srcline(s, TOP+3.96, [ t('來源：',sm), lk('Neurocrit Care：first 24-h PaCO2 最佳目標（MIMIC-III/IV）', DOI.mimic, sm) ]);
  s.addNotes('帶狀圖是線性刻度，區段位置與標示數值一致（已驗）。');
}

/* ======================= 10 · EPIC 是什麼 ======================= */
{
  const s = newSlide('成人 · 過度換氣 3/4','EPIC 研究：把指引真的做下去會怎樣','Arizona 全州前後對照，2007–2015');
  const cw = (CW-0.35)/2;
  card(s,{ x:M, y:TOP, w:cw, h:2.1, title:'介入是一個「套餐」', bullets:[
    [t('避免過度換氣：'), b('設定速率'), t('、'), b('兩指捏球'), t('、連續 EtCO2 目標 40（35–45）')],
    '避免缺氧', '積極治療低血壓' ], fs:13 });
  card(s,{ x:M+cw+0.35, y:TOP, w:cw, h:2.1, tone:'teal', title:'結果', bullets:[
    '存活出院改善',
    [t('效果集中在「'), b('重度但還沒到 critical'), t('」且接受正壓通氣／插管者')],
    [t('最重傷的族群'), b('反而變差',{color:C.red}), t(' —— 下一頁看原圖')] ], fs:13 });
  analogy(s,{ x:M, y:TOP+2.3, w:CW, h:1.0, runs:[
    t('指引像'), b('雨傘',{color:C.amber}), t('：太陽天用不到（輕傷本來就會好），颱風天撐不住（critical 怎麼做都難救），'),
    b('中到大雨最有用',{color:C.amber}), t('。這叫「依嚴重度的機會之窗」。') ]});
  srcline(s, TOP+3.5, [ t('來源：',sm), lk('Spaite DW, et al. JAMA Surgery 2019（EPIC）', DOI.epic, sm) ]);
  s.addNotes('先講套餐內容，再看圖。學員要知道 EPIC 不是單一動作的實驗。');
}

/* ======================= 11 · EPIC 原圖 ======================= */
{
  const s = newSlide('成人 · 過度換氣 4/4 · 原圖','EPIC 原始 Figure 3：獲益完全取決於嚴重度', null);
  const iw = 11.5, ih = iw*578/1953;      // 3.40"
  s.addShape(pres.ShapeType.rect,{ x:(W-iw)/2-0.1, y:TOPN, w:iw+0.2, h:ih+0.2,
    fill:{ color:'FFFFFF' }, line:{ color:'FFFFFF', width:0 } });
  s.addImage({ path:'fig/epic_jamasurg_fig3.jpg', x:(W-iw)/2, y:TOPN+0.1, w:iw, h:ih });
  note(s,{ x:M, y:TOPN+ih+0.42, w:CW, h:1.22, fs:12, runs:[
    b('怎麼讀：'), t('接受正壓通氣（PPV）者，頭傷嚴重度 3–4 存活出院 '),
    b('aOR 3.52（1.96–6.34）'), t('；但嚴重度 5–6 是 '), b('aOR 0.72（0.58–0.88）'),
    t(' —— 最重的那群反而更差。插管（ETI）呈現同樣的方向（3.14 vs 0.67）。這是「機會之窗」最直接的證據，也提醒我們：'),
    b('同一個做法在不同嚴重度不是同一件事',{color:C.red}), t('。') ]});
  srcline(s, TOPN+ih+1.78, [ t('Spaite DW, et al. ',sm), lk('JAMA Surg. 2019;154(7):e191152', DOI.epic, sm),
    t(', Figure 3. © American Medical Association．為院內教學討論引用。',sm) ]);
  s.addNotes('引導提問：為什麼最重的那群反而更差？答案可能是存活偏差與更積極插管，但重點是「別以為做越多越好」。');
}

/* ======================= 12 · 目標值分層 ======================= */
{
  const s = newSlide('成人 · 目標值','三層目標，記「一個常規、兩個例外」','BTF 院前指引 3rd ed 原文用的是 EtCO2，不是 PaCO2 —— 對現場更友善');
  table(s,{ x:M, y:TOP, w:CW, colW:[3.1,5.9,3.09], rowH:0.52, fs:11.5,
    head:['情境','目標','來源與強度'],
    rows:[
      [{text:'常規（無腦疝徵象）',key:1,opt:{bold:true,color:C.white}},
       {text:'連續 capnography 維持 EtCO2 35–45；策略上求 eucapnia、避免 hypocapnia（EtCO2 35–40）',key:1},
       {text:'BTF 院前 3rd ed｜Strong',key:1}],
      ['例外一：腦疝／急性惡化','過度換氣目標 EtCO2 30–35，以 capnography 導引','BTF 院前 3rd ed｜Strong'],
      ['例外二：院內 refractory 顱內高壓','輕度 PaCO2 32–35（SIBICC Tier 2）；<30 僅作 rescue，時間越短越好','ACS / SIBICC｜共識'],
      ['一般 ICU 通氣','PaCO2 35–40、pH 7.35–7.45、SpO2 ≥94%','ACS Best Practices｜共識'],
    ]});
  card(s,{ x:M, y:TOP+2.55, w:CW, h:1.28, tone:'red', title:'BTF 3rd ed 列的腦疝／惡化徵象' });
  s.addText([ t('Cushing triad（高血壓＋心跳慢＋呼吸型態異常）· '), b('瞳孔固定放大'),
    t(' · 姿勢異常（posturing）· '), b('GCS < 9'),
    t(' · 持續惡化。指引也明講：這些徵象的預測力只是中到低，但在這個族群風險效益關係反轉。') ],
    { x:M+0.24, y:TOP+3.08, w:CW-0.48, h:0.68, fontFace:F, fontSize:12.5, color:C.ink,
      margin:0, valign:'top', lineSpacingMultiple:1.16 });
  srcline(s, TOP+4.0, [ t('來源：',sm), lk('BTF 院前指引 3rd ed（Prehosp Emerg Care 2023）', DOI.btf3, sm),
    t('　·　',sm), lk('Executive Summary（Neurosurgery 2023）', DOI.btf3exec, sm) ]);
  s.addNotes('現場只需要記兩個數字帶：35–45 常規、30–35 腦疝。PaCO2 那兩列是給院內同仁的背景。');
}

/* ======================= 13 · 成人 EtCO2 ======================= */
{
  const s = newSlide('成人 · EtCO2','指引強力推薦 —— 但指引自己說它不夠','這句話一定要念給學員聽');
  s.addShape(pres.ShapeType.rect,{ x:M, y:TOP, w:0.035, h:0.85, fill:{color:C.red}, line:{color:C.red,width:0} });
  quote(s,{ x:M+0.24, y:TOP, w:CW-0.24, h:0.85, fs:15, runs:[
    t('Capnography ',{italic:true,color:C.white,fontSize:15}), b('不保證',{italic:true,fontSize:15}),
    t('能避免無意識的過度換氣 —— 因為 EtCO2 與 PaCO2 有落差，加上院前操作的現實困難。',{italic:true,color:C.white,fontSize:15}) ]});
  const cw = (CW-0.35)/2;
  card(s,{ x:M, y:TOP+1.05, w:cw, h:1.75, tone:'teal', title:'所以要配套', bullets:[
    [b('先設定速率'), t('，再用 EtCO2 確認')],
    '紀律性捏球（兩指、小容量）',
    '不能只盯數字、不管手' ], fs:13 });
  card(s,{ x:M+cw+0.35, y:TOP+1.05, w:cw, h:1.75, tone:'red', title:'落差本身就是壞消息' });
  s.addText([ t('成人回溯研究：EtCO2–PaCO2 '), b('gap 每增加 1 kPa（≈7.5 mmHg），死亡率 2.7 倍'),
    t('，且 EtCO2 '), b('系統性低估'), t(' PaCO2。') ],
    { x:M+cw+0.59, y:TOP+1.58, w:cw-0.48, h:1.1, fontFace:F, fontSize:12.5, color:C.ink,
      margin:0, valign:'top', lineSpacingMultiple:1.16 });
  analogy(s,{ x:M, y:TOP+3.0, w:CW, h:0.88, runs:[
    t('EtCO2 像'), b('裝在門口的溫度計',{color:C.amber}),
    t('量整棟房子：走廊（死腔）越長，讀數離房內真實溫度越遠。肺一有問題，走廊就變長。') ]});
  srcline(s, TOP+4.04, [ t('來源：',sm), lk('BTF 院前指引 3rd ed', DOI.btf3, sm),
    t('　·　',sm), lk('Sci Rep：EtCO2–PaCO2 gradient 與死亡率', DOI.gap, sm) ]);
  s.addNotes('強調：指引推薦一個工具，同時警告它不夠 —— 這正是為什麼要教手法而不只是教儀器。');
}

/* ======================= 14 · 小兒全貌 ======================= */
{
  const s = newSlide('小兒 · 全貌','小兒的證據，三句話講完','2019 BTF 小兒重度 TBI 指引 3rd ed 的實際內容');
  const cw = (CW-0.7)/3;
  card(s,{ x:M, y:TOP, w:cw, h:2.35, tone:'red', lbl:'抬高床頭', title:'沒有建議',
    body:'指引沒有任何分級建議，連 Level III 都沒有。屬「良好臨床實務／生理合理性」層級。', fs:12.5 });
  card(s,{ x:M+cw+0.35, y:TOP, w:cw, h:2.35, tone:'amber', lbl:'過度換氣', title:'Level III（weak）',
    body:'受傷後 48 小時內不建議預防性重度過度換氣至 PaCO2 < 30；若為 refractory 顱內高壓而使用，建議加上腦缺血的進階監測。這是指引中唯一一條關於通氣的建議。', fs:12.5 });
  card(s,{ x:M+2*(cw+0.35), y:TOP, w:cw, h:2.35, lbl:'EtCO2', title:'不表態',
    body:'因資料不足，不對「EtCO2 可否取代 PaCO2」做出任何建議（for or against 都沒有）。TQIP 亦同。', fs:12.5 });
  note(s,{ x:M, y:TOP+2.55, w:CW, h:1.05, runs:[
    b('教學上的意義：'), t('小兒這三件事幾乎都是從成人外推來的。這不代表不要做 —— 代表'),
    b('講的時候要說出「這是外推」',{color:C.red}), t('，並且把力氣放在成人證據硬的那一項（別吹快）。') ]});
  srcline(s, TOP+3.8, [ t('來源：',sm), lk('Kochanek PM, et al. Pediatr Crit Care Med. 2019;20(3S):S1-S82', DOI.btfPed, sm) ]);
  s.addNotes('學員常以為小兒有自己的一套證據。實際上只有一條 Level III。');
}

/* ======================= 15 · 小兒生理 ======================= */
{
  const s = newSlide('小兒 · 生理','為什麼小孩更不該吹快','指引引用的兒童生理研究，方向很一致');
  const cw = (CW-0.35)/2;
  card(s,{ x:M, y:TOP, w:cw, h:2.3, tone:'teal', title:'兒童 TBI 的三個事實', bullets:[
    [b('Hyperemia（腦血流過多）不常見'), t(' → 「用吹快壓 hyperemia」的理由不成立')],
    [t('與較差預後相關的是'), b('腦血流過低'), t('，不是過高')],
    [t('低碳酸會降低 '), b('CSF buffering'), t('，日後 ICP 波動更難擋')] ], fs:12.5 });
  card(s,{ x:M+cw+0.35, y:TOP, w:cw, h:2.3, tone:'red', title:'結論' });
  s.addText([ t('指引因此把目標訂在'), b('正常 PaCO2 35–45'), t('，而不是某個 EtCO2 數字。\n\n'),
    t('注意措辭差異：小兒指引講 '), b('PaCO2'), t('，院前指引講 '), b('EtCO2'),
    t(' —— 因為它不願意保證兩者可以互換（見下一頁 Bland-Altman 原圖）。') ],
    { x:M+cw+0.59, y:TOP+0.62, w:cw-0.48, h:1.6, fontFace:F, fontSize:12.5, color:C.ink,
      margin:0, valign:'top', lineSpacingMultiple:1.16 });
  analogy(s,{ x:M, y:TOP+2.5, w:CW, h:0.95, runs:[
    t('CSF buffering 像'), b('活期存款',{color:C.amber}),
    t('：低碳酸把它花掉了。平常看不出差別，等下一次 ICP 帳單來（搬動、抽痰、躁動），才發現沒錢付。') ]});
  s.addNotes('這一頁回答「為什麼不能照成人做」。');
}

/* ======================= 16 · EPIC4Kids 數據 ======================= */
{
  const s = newSlide('小兒 · EPIC4Kids 1/2','最直接的小兒院前證據','EPIC 的預先計畫小兒次分析：2,801 名 <18 歲（前 2,041／後 760）');
  table(s,{ x:M, y:TOP, w:CW, colW:[2.3,4.2,3.0,2.59], rowH:0.44, fs:11.5,
    head:['結果','族群','aOR（95% CI）','判讀'],
    rows:[
      ['存活出院','全體（中度＋重度＋critical）','1.16（0.70–1.92）','未改善'],
      [{text:'存活到住院',key:1},{text:'全體',key:1},{text:'2.41（1.17–5.21）',key:1,opt:{bold:true,color:C.white}},{text:'顯著改善',key:1}],
      [{text:'存活出院',key:1},{text:'重度（RSS-Head 3–4）',key:1},{text:'8.42（1.01 – >100）',key:1,opt:{bold:true,color:C.white}},{text:'顯著，但 CI 極寬',key:1}],
      ['存活出院','重度且接受正壓通氣','9.13（0.79 – >100）','方向一致，未達顯著'],
      ['存活出院','中度、critical','—','無顯著效益'],
    ]});
  s.addText('RSS-Head＝Regional Severity Score-Head。',
    { x:M, y:TOP+2.45, w:CW, h:0.24, fontFace:F, fontSize:10.5, color:C.dim, margin:0 });
  note(s,{ x:M, y:TOP+2.82, w:CW, h:1.05, runs:[
    b('誠實地讀這張表：'),
    t('8.42 這個數字很漂亮，但信賴區間下界貼在 1.01、上界破百 —— 意思是「方向大概是好的，幅度完全不知道」。'),
    b('不要在教材上寫成「存活率提高 8 倍」。',{color:C.red}) ]});
  srcline(s, TOP+4.05, [ t('來源：',sm), lk('EPIC4Kids, Ann Emerg Med', DOI.epic4kids, sm) ]);
  s.addNotes('這是教學員讀信賴區間的最好例子 —— 點估計漂亮不代表結論強。');
}

/* ======================= 17 · EPIC4Kids 判讀 ======================= */
{
  const s = newSlide('小兒 · EPIC4Kids 2/2','作者的結論：存在「依嚴重度的機會之窗」','和成人 EPIC 的 Figure 3 是同一個故事');
  const cw = (CW-0.7)/3;
  card(s,{ x:M, y:TOP, w:cw, h:1.75, lbl:'中度', title:'看不到效益', body:'本來大多會好，天花板效應。', fs:12.5 });
  card(s,{ x:M+cw+0.35, y:TOP, w:cw, h:1.75, tone:'teal', lbl:'重度', title:'這裡有救',
    body:'避免缺氧／低血壓／吹快，最可能改變結局的族群。', fs:12.5 });
  card(s,{ x:M+2*(cw+0.35), y:TOP, w:cw, h:1.75, tone:'red', lbl:'Critical', title:'看不到效益',
    body:'傷害已經定型，院前做什麼都難翻盤。', fs:12.5 });
  analogy(s,{ x:M, y:TOP+1.95, w:CW, h:1.0, runs:[
    t('再說一次那把'), b('傘',{color:C.amber}), t('：晴天不用、颱風沒用、中到大雨最有價值。教學上要讓學員相信「'),
    b('看起來很嚴重但還有機會',{color:C.amber}), t('」的那個孩子，就是他們最該把基本功做好的人。') ]});
  note(s,{ x:M, y:TOP+3.15, w:CW, h:0.85, runs:[
    b('作者結論原意：'), t('此型態支持繼續廣泛推行小兒院前 TBI 指引 —— 不是「指引沒用」。') ]});
  s.addNotes('避免學員把「全體沒改善」誤讀成「不用做」。');
}

/* ======================= 18 · Bland-Altman 原圖 ======================= */
{
  const s = newSlide('小兒 · EtCO2 落差 · 原圖','小兒 EtCO2 有多不可信：肺好的時候還行，肺壞了就報廢', null);
  const iw = 9.4, ih = iw*770/1944;       // 3.72"
  s.addShape(pres.ShapeType.rect,{ x:(W-iw)/2-0.1, y:TOPN, w:iw+0.2, h:ih+0.2,
    fill:{ color:'FFFFFF' }, line:{ color:'FFFFFF', width:0 } });
  s.addImage({ path:'fig/etco2_gap_AC.jpg', x:(W-iw)/2, y:TOPN+0.1, w:iw, h:ih });
  note(s,{ x:M, y:TOPN+ih+0.34, w:CW, h:1.08, fs:11.5, runs:[
    b('怎麼讀：'), t('縱軸是 '), b('PaCO2 − EtCO2'),
    t('；藍線是平均偏差，橘線是事先設定「可接受」的 0–5 mmHg 帶，深色線是一致性界限。左圖（全部病人）平均高 '),
    b('2.7 mmHg'), t('，但'), b('不到一半的配對落在可接受帶內'), t('；右圖（24 小時內發生 PARDS）平均高 '),
    b('近 10 mmHg'), t('，散布明顯更寬 —— 死腔變大、V/Q 不匹配。受傷後'), b('最初 8 小時'), t('一致性也較差。') ]});
  srcline(s, TOPN+ih+1.52, [ t('Yang JT, et al. ',sm), lk('JAMA Netw Open. 2019;2(8):e199448', DOI.yang, sm),
    t(', Figure 1 之 panel A 與 C（並列裁切）。© American Medical Association．為院內教學討論引用。',sm) ], 0.6);
  s.addNotes('請學員看右圖的藍線位置：那是「螢幕顯示 40、動脈其實 50」的畫面。');
}

/* ======================= 19 · EtCO2 三紅旗 ======================= */
{
  const s = newSlide('小兒 · EtCO2 怎麼教','教「它會怎麼騙你」比教數字有用','三個紅旗：這時候螢幕上的數字比真實值低');
  const cw = (CW-0.7)/3;
  card(s,{ x:M, y:TOP, w:cw, h:1.5, tone:'red', title:'① 灌流差',
    body:'低血壓、休克、CPR 中 —— 肺送不到血，吐不出 CO2。', fs:12.5 });
  card(s,{ x:M+cw+0.35, y:TOP, w:cw, h:1.5, tone:'red', title:'② 肺有問題',
    body:'溺水、氣喘、肺挫傷、PARDS —— 死腔變大，差距可達 10 mmHg。', fs:12.5 });
  card(s,{ x:M+2*(cw+0.35), y:TOP, w:cw, h:1.5, tone:'red', title:'③ 受傷／插管最初數小時',
    body:'最初 8 小時一致性最差。', fs:12.5 });
  card(s,{ x:M, y:TOP+1.7, w:CW, h:1.28, tone:'amber', title:'所以現場的規則只有一句' });
  s.addText([ b('螢幕 40，真實可能是 45–50。'), t('因此：'),
    b('絕不因為螢幕數字偏低就再吹快',{color:C.red}),
    t(' —— 先問「是不是我吹太快」，再問「是不是血壓掉了」，最後才想儀器。先確認有正常方形波，再讀值。') ],
    { x:M+0.24, y:TOP+2.22, w:CW-0.48, h:0.68, fontFace:F, fontSize:13, color:C.ink,
      margin:0, valign:'top', lineSpacingMultiple:1.16 });
  analogy(s,{ x:M, y:TOP+3.18, w:CW, h:0.92, runs:[
    t('看到體重計數字下降就以為變健康 —— 其實是'), b('脫水',{color:C.amber}),
    t('。EtCO2 掉下來也一樣：可能是通氣「進步」，更可能是灌流變差或你手太快。') ]});
  s.addNotes('這一頁是小兒段落最實用的一頁。EtCO2 低估的方向要講清楚：真實值比螢幕高。');
}

/* ======================= 20 · 年齡別門檻 ======================= */
{
  const s = newSlide('小兒 · 年齡別門檻','這一頁的證據比姿勢和通氣都硬','BTF 院前指引 3rd ed 的血壓目標，比傳統「70+2×年齡」高很多');
  const tw = 6.9;
  table(s,{ x:M, y:TOP, w:tw, colW:[2.3,3.1,1.5], rowH:0.36, fs:11.5,
    head:['年齡','收縮壓目標（BTF 3rd ed）','強度'],
    rows:[ ['≤ 28 天','> 70 mmHg','Weak'], ['1–12 個月','> 84 mmHg','Weak'],
      ['1–5 歲','> 90 mmHg','Weak'], ['≥ 6 歲','> 100 mmHg','Weak'],
      [{text:'成人',key:1},{text:'≥ 110 mmHg',key:1,opt:{bold:true,color:C.white}},{text:'Weak',key:1}] ]});
  s.addText('缺氧：連續量 SpO2、給氧維持 > 90%（Strong）；SpO2 < 90% 即為 hypoxemia（ACS 寫求 ≥94%），建議每 5 分鐘查一次。',
    { x:M, y:TOP+2.36, w:CW, h:0.26, fontFace:F, fontSize:10.5, color:C.dim, margin:0 });
  card(s,{ x:M+tw+0.35, y:TOP, w:CW-tw-0.35, h:2.3, tone:'red', title:'兩套數字並存' });
  s.addText([ t('研究與多數 SOP 用的低血壓'), b('定義'), t('是 '), b('SBP < 70+(2×年齡)'),
    t('；BTF 院前指引給的是要'), b('維持'), t('的'), b('目標'), t('，明顯更高。\n\n'),
    t('教學講法：'), b('「低於 70+2×年齡＝已經出事；但我們要追的是上面那張表。」',{color:C.red}) ],
    { x:M+tw+0.59, y:TOP+0.6, w:CW-tw-0.83, h:1.55, fontFace:F, fontSize:12, color:C.ink,
      margin:0, valign:'top', lineSpacingMultiple:1.16 });
  note(s,{ x:M, y:TOP+2.72, w:CW, h:1.1, fs:12, runs:[
    b('PEGASUS（Kannan 2018，5 家兒童創傷中心，236 名重度 TBI 兒童）：'),
    t('早期低血壓發生率 '), b('26%'), t('（60/234），死亡率 '), b('23.3% vs 8.6%（p=0.01）'), t('；'),
    b('30 分鐘內'), t('以輸液／血品／升壓劑處理者 92%（55/60），院內死亡 '), b('aRR 0.46（0.24–0.90）'),
    t('、不良出院 GOS '), b('aRR 0.54（0.39–0.76）'), t('。') ]});
  srcline(s, TOP+3.94, [ t('來源：',sm), lk('BTF 院前指引 3rd ed Executive Summary, Table 1', DOI.btf3exec, sm),
    t('　·　',sm), lk('Kannan N, et al. Pediatr Emerg Care. 2018;34(5):325-329', DOI.kannan, sm),
    t('（依 PubMed 檢索核對）',sm) ], 0.6);
  s.addNotes('務必分清「定義」與「目標」。這是最容易被誤用的一頁。');
}

/* ======================= 21 · 口訣主頁 ======================= */
{
  const s = newSlide('EMT 教學版','口訣：頭抬 30、吹 10 下、盯 40','瞳孔放大才可以吹快，而且只吹到 30–35');
  const cw = (CW-0.35)/2;
  card(s,{ x:M, y:TOP+0.15, w:cw, h:2.35, tone:'teal', title:'三個數字', bullets:[
    [b('30°'), t('　整床／整板抬高（血壓達標才做）')],
    [b('10'), t('　成人約 10 次/分；小孩用年齡正常速率起步')],
    [b('40'), t('　EtCO2 瞄 40，帶寬 35–45')] ], fs:14 });
  card(s,{ x:M+cw+0.35, y:TOP+0.15, w:cw, h:2.35, tone:'red', title:'一個例外', bullets:[
    '瞳孔散大固定／姿勢異常／Cushing triad／GCS<9／持續惡化',
    [t('→ 吹快，目標 '), b('EtCO2 30–35')],
    [t('→ 一到院、徵象一改善就'), b('回到 40')] ], fs:14 });
  note(s,{ x:M, y:TOP+2.75, w:CW, h:1.05, fs:13.5, runs:[
    b('更順口的版本：'), t('「'), b('三十、十、四十；瞳孔放大降到三十五'), t('」。速率只是手段，'),
    b('EtCO2 才是終點',{color:C.teal}), t('。') ]});
  s.addNotes('請學員複誦一次。這是全課唯一要求背下來的東西。');
}

/* ======================= 22 · 通氣操作 ======================= */
{
  const s = newSlide('操作 1/4 · 通氣','通氣要教「節拍器」，不要教「感覺」','吹過頭的主因不是不懂，是緊張');
  const cw = (CW-0.35)/2;
  card(s,{ x:M, y:TOP, w:cw, h:2.25, tone:'teal', title:'三個動作', bullets:[
    [b('設定節拍'), t('：手機節拍器／監視器嗶聲／心中數「1-2-3-4-5-6」再擠一次')],
    [b('兩指捏球'), t('，不是滿掌握 —— 成人只需 500–600 mL')],
    [b('看胸廓微起就停'), t('，不追「起得漂亮」')] ], fs:12.5 });
  card(s,{ x:M+cw+0.35, y:TOP, w:cw, h:2.25, tone:'red', title:'課堂一定要演的錯誤示範', bullets:[
    '故意憑感覺捏 → EtCO2 掉到 25',
    '當場講：腦血管收縮、腦血流下降',
    [b('看過一次比聽十次有效')] ], fs:12.5 });
  analogy(s,{ x:M, y:TOP+2.45, w:CW, h:0.85, runs:[
    t('唱歌'), b('沒有伴奏會越唱越快',{color:C.amber}), t(' —— 人在壓力下天生會加速。所以速率要「設定」，不能「即興」。') ]});
  note(s,{ x:M, y:TOP+3.5, w:CW, h:0.72, runs:[
    b('鐵律一句話：'), t('「緊張的時候你一定會吹快，所以我們用節拍器，不用感覺。」') ]});
  s.addNotes('現場示範：拿 BVM 和節拍器，讓兩位學員各捏 30 秒，比較 EtCO2。');
}

/* ======================= 23 · 速率落差 ======================= */
{
  const s = newSlide('操作 2/4 · 速率','小兒速率：一個必須誠實講的落差','流傳很廣的「嬰兒 25、兒童 20」其實不在現行第 3 版裡');
  table(s,{ x:M, y:TOP, w:CW, colW:[3.6,6.2,2.29], rowH:0.62, fs:11.5,
    head:['來源','速率寫法','核對狀態'],
    rows:[
      [{text:'BTF 院前指引 3rd ed（2023，現行）',key:1,opt:{bold:true,color:C.white}},
       {text:'需正壓通氣者維持「約 10 次/分，EtCO2 35–45」—— 全文未列任何年齡別速率',key:1},
       {text:'✓ 已核對原文',key:1}],
      ['舊版／EPIC 現場教材流傳版本','嬰兒（0–24 月）25、兒童（2–14 歲）20、>14 歲 10','○ 廣泛引用，本次未取得原文確證'],
    ]});
  card(s,{ x:M, y:TOP+1.75, w:CW, h:1.75, tone:'amber', title:'怎麼教才不會錯', bullets:[
    [b('把 EtCO2 當終點，速率當起點。'), t('嬰兒照 10 次/分一定會 CO2 堆積 —— 生理上就該比成人快。')],
    [t('做法：'), b('從該年齡的正常呼吸速率下緣起步 → 看 EtCO2 → 調整到 35–45')],
    [t('如果你們的地方 SOP 寫了年齡別速率，'), b('以 SOP 為準',{color:C.red}), t('，但仍以 EtCO2 收斂。')] ], fs:12.5 });
  note(s,{ x:M, y:TOP+3.7, w:CW, h:0.8, runs:[
    b('要寫進正式教材前：'), t('請核對 BTF 3rd ed 全文或地方協定原文，不要沿用二手數字。這一頁本身就是教學員「查原文」的示範。') ]});
  s.addNotes('這是本課最重要的誠實揭露。講師自己也要記得：3rd ed 沒有年齡別速率。');
}

/* ======================= 24 · 姿勢操作 ======================= */
{
  const s = newSlide('操作 3/4 · 姿勢','抬高床頭要加一個前置條件才能教','先血壓，後抬頭 —— 順序寫進流程卡');
  const boxes = ['① 血壓達標？\n（依年齡別目標）','② 整床／整板傾斜 30°\n（reverse Trendelenburg）',
    '③ 2 分鐘內重測血壓','④ 血壓掉 → 放平'];
  const bw = (CW - 3*0.42)/4;
  boxes.forEach((txt,i)=>{
    const x = M + i*(bw+0.42);
    s.addShape(pres.ShapeType.roundRect,{ x, y:TOP, w:bw, h:0.95, fill:{color:C.card2},
      line:{color:i===3?'6E2A31':C.line,width:1}, rectRadius:0.08 });
    s.addText(txt, { x:x+0.1, y:TOP, w:bw-0.2, h:0.95, fontFace:F, fontSize:12,
      color:i===3?'F4A0A7':C.ink, align:'center', valign:'middle', margin:0, lineSpacingMultiple:1.1 });
    if (i<3) s.addText('→', { x:x+bw, y:TOP, w:0.42, h:0.95, fontFace:F, fontSize:20,
      bold:true, color:C.red, align:'center', valign:'middle', margin:0 });
  });
  const cw = (CW-0.35)/2;
  card(s,{ x:M, y:TOP+1.15, w:cw, h:1.9, tone:'teal', title:'做對的細節', bullets:[
    [b('已上背板 → 整板傾斜'), t('，不折頸、不在頭下塞枕頭')],
    '頭頸維持中立位', '抬高不能延遲後送' ], fs:12.5 });
  card(s,{ x:M+cw+0.35, y:TOP+1.15, w:cw, h:1.9, tone:'amber', title:'嬰兒的大後枕' });
  s.addText([ t('平躺於成人長背板會使頸椎屈曲 → 墊'), b('軀幹'), t('（不是墊頭）維持中立位。\n\n'),
    b('證據標註：'), t('這是廣泛教學的院前原則，本次檢索'), b('未找到指引分級證據'), t('支持 —— 屬 good practice。') ],
    { x:M+cw+0.59, y:TOP+1.72, w:cw-0.48, h:1.2, fontFace:F, fontSize:12, color:C.ink,
      margin:0, valign:'top', lineSpacingMultiple:1.16 });
  note(s,{ x:M, y:TOP+3.25, w:CW, h:0.75, runs:[
    b('一句話：'), t('抬高床頭是「有空才做的加分題」，血壓和血氧是「不做就不及格」。') ]});
  s.addNotes('流程卡順序不可顛倒。學員最常做的錯事是先抬頭再量血壓。');
}

/* ======================= 25 · 真正救命的 ======================= */
{
  const s = newSlide('操作 4/4 · 真正救命的','不要讓學員把重點放錯','這三件事的證據都比床頭角度硬得多');
  const cw = (CW-0.7)/3;
  card(s,{ x:M, y:TOP, w:cw, h:1.6, tone:'teal', lbl:'氧氣', title:'SpO2 > 90%',
    body:'力求 ≥94%。每 5 分鐘量一次。SpO2 < 90% 即為缺氧。', fs:12.5 });
  card(s,{ x:M+cw+0.35, y:TOP, w:cw, h:1.6, tone:'teal', lbl:'血壓', title:'30 分鐘內處理',
    body:'依年齡別目標。PEGASUS：及時處理 → 死亡 aRR 0.46。', fs:12.5 });
  card(s,{ x:M+2*(cw+0.35), y:TOP, w:cw, h:1.6, tone:'teal', lbl:'後送', title:'最高等級創傷中心',
    body:'ACS：快速後送＋沿途避免低血壓、缺氧、高碳酸、低體溫。', fs:12.5 });
  card(s,{ x:M, y:TOP+1.8, w:CW, h:1.1, tone:'red', title:'最致命的組合' });
  s.addText([ t('缺氧與低血壓'), b('併存'), t('比任何單一項都差；未被處理的低血壓，死亡 OR '),
    b('3.4'), t('、殘障 OR '), b('3.7'), t('。') ],
    { x:M+0.24, y:TOP+2.32, w:CW-0.48, h:0.5, fontFace:F, fontSize:13, color:C.ink, margin:0, valign:'top' });
  analogy(s,{ x:M, y:TOP+3.1, w:CW, h:0.9, runs:[
    t('床頭角度是'), b('裝潢',{color:C.amber}), t('，血壓與血氧是'), b('地基',{color:C.amber}),
    t('。沒有人會在地基還在下沉的時候討論牆要漆什麼顏色。') ]});
  s.addNotes('這是收斂頁：把注意力拉回三件真正有預後證據的事。');
}

/* ======================= 26 · OSCE ======================= */
{
  const s = newSlide('檢核／OSCE','五個情境，考的都是同一件事','學員最常錯的是 B 和 D');
  table(s,{ x:M, y:TOP, w:CW, colW:[6.4,5.69], rowH:0.55, fs:11,
    head:['情境','正確處置'],
    rows:[
      ['A　5 歲、車禍、GCS 7、已 BVM、SpO2 96%、SBP 88、EtCO2 顯示 28',
       '吹太快了 → 放慢，EtCO2 回到 35–45；同時處理 SBP 88（1–5 歲目標 >90）'],
      [{text:'B　同上，但 EtCO2 顯示 33，學員說「再吹快一點比較安全」',key:1},
       {text:'錯。35 以下就是在傷害腦部，沒有「保險起見吹低一點」',key:1,opt:{bold:true,color:C.white}}],
      ['C　8 個月嬰兒、墜落、GCS 6、右瞳散大固定、姿勢異常',
       '符合腦疝 → 吹快，目標 EtCO2 30–35，並持續評估、盡速後送'],
      [{text:'D　3 歲、GCS 8、SBP 68、學員先把擔架床頭抬到 30°',key:1},
       {text:'順序錯。先處理低血壓（1–5 歲目標 >90），血壓沒到不要抬',key:1,opt:{bold:true,color:C.white}}],
      ['E　溺水後的 6 歲、已插管、EtCO2 38 但看起來很喘、SpO2 89%',
       '肺有問題 → EtCO2 低估 PaCO2；不要因數字漂亮而放心，先解決氧合'],
    ]});
  note(s,{ x:M, y:TOP+3.55, w:CW, h:0.75, runs:[
    b('共同答案：'), t('五題考的都是「'), b('別吹快、血壓優先、EtCO2 是儀表不是目標',{color:C.red}), t('」。') ]});
  s.addNotes('可以當成分組討論題，每組抽一題並說明理由。');
}

/* ======================= 27 · 誠實揭露 ======================= */
{
  const s = newSlide('誠實揭露','要對學員說的三句話','教材的可信度來自敢講不確定的地方');
  card(s,{ x:M, y:TOP, w:CW, h:2.05, bullets:[
    [t('「『不要吹快』'), b('有病人預後證據'), t(' —— 但小兒的正式建議只有 '), b('Level III（weak）'), t('，而 EPIC4Kids 只在重度次群組顯著，信賴區間極寬。」')],
    [t('「『連續 EtCO2』被'), b('強力推薦'), t(' —— 但指引自己說它防不了吹過頭，小兒指引甚至'), b('不表態'), t('它能否取代 PaCO2。」')],
    [t('「『抬高床頭 30°』確實降腦壓 5.6 mmHg —— 但 '), b('CPP、腦氧、死亡率、功能預後全都沒有獲益證據'), t('，Cochrane 評 very low quality，小兒指引'), b('沒有任何建議'), t('。」')],
  ], fs:12.5 });
  card(s,{ x:M, y:TOP+2.25, w:CW, h:1.5, tone:'red', title:'三個真正的證據缺口', bullets:[
    [t('小兒院前 '), b('EtCO2 導引通氣'), t(' 沒有 RCT')],
    [t('小兒 '), b('姿勢／床頭角度'), t(' 完全沒有分級證據')],
    [t('BTF 3rd ed '), b('未提供年齡別通氣速率'), t(' —— 現場最需要的那個數字反而消失了')] ], fs:12.5 });
  note(s,{ x:M, y:TOP+3.95, w:CW, h:0.72, runs:[
    b('可以往上提的建議：'), t('地方 SOP 若要納入小兒 TBI 通氣，應明訂「以 EtCO2 35–45 為終點」而非只寫固定速率。') ]});
  s.addNotes('這一頁讓學員知道我們沒有把外推當定論，反而更容易接受前面的建議。');
}

/* ======================= 28 · 名詞對照 ======================= */
{
  const s = newSlide('附錄 · 名詞對照','名詞與英文對照','方便學員之後自己查文獻');
  const cw = (CW-0.4)/2;
  table(s,{ x:M, y:TOP, w:cw, colW:[2.7,3.19], rowH:0.28, fs:11,
    head:['臨床','英文'],
    rows:[ ['顱內壓','ICP, intracranial pressure'], ['腦灌流壓','CPP, cerebral perfusion pressure'],
      ['腦血流','CBF, cerebral blood flow'], ['低碳酸／高碳酸','hypocapnia / hypercapnia'],
      ['正常碳酸','eucapnia, normocapnia'], ['腦疝','herniation'],
      ['腦血流自動調節','autoregulation'], ['死腔','dead space'],
      ['小兒急性呼吸窘迫症候群','PARDS'], ['脊椎活動限制','SMR, spinal motion restriction'] ]});
  table(s,{ x:M+cw+0.4, y:TOP, w:cw, colW:[2.7,3.19], rowH:0.28, fs:11,
    head:['方法學／統計','英文'],
    rows:[ ['校正後勝算比','aOR, adjusted odds ratio'], ['校正後相對風險','aRR, adjusted relative risk'],
      ['信賴區間','95% CI'], ['系統性回顧／統合分析','systematic review / meta-analysis'],
      ['平均差','MD, mean difference'], ['一致性界限','limits of agreement（Bland-Altman）'],
      ['前後對照實施研究','before-after implementation study'], ['預先計畫次分析','preplanned secondary analysis'],
      ['格拉斯哥預後量表','GOS, Glasgow Outcome Scale'], ['分級證據等級','Level I / II / III；Strong / Weak'] ]});
  s.addNotes('這兩張表是學員最常帶走的部分。');
}

/* ======================= 29 · 數字查核 ======================= */
{
  const s = newSlide('附錄 · 數字查核','關鍵數字從哪裡來','✓ 官方指引／同儕審查原文　○ 單一來源、未核對原文');
  table(s,{ x:M, y:TOP, w:CW, colW:[4.6,6.2,1.29], rowH:0.34, fs:11,
    head:['數字','查核來源','等級'],
    rows:[
      ['ICP −5.58 mmHg；CPP p=0.13','Neurocrit Care 2024 meta 摘要','✓'],
      ['Cochrane very low quality','Cochrane Review 2017','✓'],
      [{text:'EtCO2 35–45／腦疝 30–35（Strong）',key:1},{text:'BTF 3rd ed Executive Summary 原文核對',key:1,opt:{bold:true,color:C.white}},{text:'✓',key:1}],
      [{text:'年齡別 SBP 目標 70／84／90／100',key:1},{text:'BTF 3rd ed Table 1 原文核對',key:1,opt:{bold:true,color:C.white}},{text:'✓',key:1}],
      [{text:'「約 10 次/分、無年齡別速率」',key:1},{text:'BTF 3rd ed 原文核對（確認缺漏）',key:1,opt:{bold:true,color:C.white}},{text:'✓',key:1}],
      ['成人 EPIC aOR 3.52 / 0.72','JAMA Surg 2019 Figure 3 原圖','✓'],
      ['PEGASUS 26%／23.3% vs 8.6%／aRR 0.46','Kannan 2018 摘要（PubMed 核對）','✓'],
      ['嬰兒 25／兒童 20 次/分','二手引用，未取得原文','○'],
      ['嬰兒墊軀幹（大後枕）','教學共識，無分級證據','○'],
    ]});
  s.addText('證據來源以 OpenEvidence 檢索（5 次查詢）起始，關鍵數字再回原文／PubMed 核對。',
    { x:M, y:TOP+3.6, w:CW, h:0.26, fontFace:F, fontSize:10.5, color:C.dim, margin:0 });
  s.addNotes('這張表保護講者，也教學員怎麼分級證據。');
}

/* ======================= 30–31 · 參考文獻 ======================= */
const REFS = [
  ['Prehospital Guidelines for the Management of Traumatic Brain Injury – 3rd Edition. Prehosp Emerg Care. 2023.', DOI.btf3],
  ['Guidelines for Prehospital Management of TBI 3rd Edition: Executive Summary. Neurosurgery. 2023.', DOI.btf3exec],
  ['Kochanek PM, et al. Guidelines for the Management of Pediatric Severe TBI, 3rd Edition. Pediatr Crit Care Med. 2019;20(3S):S1-S82.', DOI.btfPed],
  ['Spaite DW, et al. Statewide Implementation of Prehospital TBI Treatment Guidelines and Survival (EPIC). JAMA Surg. 2019;154(7):e191152.', DOI.epic],
  ['EPIC4Kids: Effect of Implementing the Out-of-Hospital TBI Treatment Guidelines in Children. Ann Emerg Med.', DOI.epic4kids],
  ['Effects of Head Elevation on ICP, CPP and Cerebral Oxygenation: Systematic Review and Meta-analysis. Neurocrit Care. 2024.', DOI.headMeta],
  ['Elevation of the Head During Intensive Care Management in People With Severe TBI. Cochrane Database Syst Rev. 2017.', DOI.cochrane],
  ['Yang JT, et al. Agreement Between PaCO2 and EtCO2 in Children. JAMA Netw Open. 2019;2(8):e199448.', DOI.yang],
  ['End-Tidal to Arterial CO2 Gradient Is Associated With Increased Mortality in TBI. Sci Rep. 2021.', DOI.gap],
  ['Adverse Prehospital Events and Outcomes After TBI (LITES Network). JAMA Netw Open. 2024.', DOI.lites],
  ['Impact of Oxygen and Carbon Dioxide Levels on Mortality in Moderate-to-Severe TBI: SR and Meta-analysis. Crit Care. 2025.', DOI.co2meta],
  ['Optimal Targets of First 24-h PaCO2 in Cerebral Injury (MIMIC-III/IV). Neurocrit Care. 2021.', DOI.mimic],
  ['Kannan N, et al. Timely Hemodynamic Resuscitation and Outcomes in Severe Pediatric TBI (PEGASUS). Pediatr Emerg Care. 2018;34(5):325-329.', DOI.kannan],
  ['Prehospital Care for TBI: Review of U.S. State EMS Protocols. Am J Emerg Med. 2024.', DOI.emsProt],
  ['EMS Protocols for TBI in the United States: A Call for Standardization. Injury. 2021.', DOI.emsStd],
  ['ACS. Best Practices in the Management of Traumatic Brain Injury.', DOI.acs],
];
[[0,8,'參考文獻 1/2','References'],[8,16,'參考文獻 2/2','References（續）']].forEach(([a,z,kick,title])=>{
  const s = newSlide(kick, title, '每一條都可點開');
  const runs = [];
  REFS.slice(a,z).forEach(([txt,url],i)=>{
    runs.push(t(String(a+i+1)+'. ', { fontSize:12, color:C.dim }));
    const o = { fontSize:12 }; if (i < z-a-1) o.breakLine = true;
    runs.push(lk(txt, url, o));
  });
  s.addText(runs, { x:M, y:TOP, w:CW, h:4.3, fontFace:F, color:C.ink, margin:0,
    valign:'top', lineSpacingMultiple:1.34, paraSpaceAfter:3 });
  if (z === 16) note(s,{ x:M, y:TOP+3.9, w:CW, h:0.85, fs:11.5, runs:[
    b('圖片使用聲明：'),
    t('本簡報引用之期刊原圖（JAMA Surgery Figure 3、JAMA Network Open Figure 1）版權屬 American Medical Association，僅為院內教學討論之引用，已於各圖下方標註完整出處與權利人。') ]});
  s.addNotes('所有連結皆為 DOI 或發行機構官方頁面，不使用搜尋結果或聚合網站。');
});

pres.writeFile({ fileName:'ped-tbi-etco2-teaching.pptx' })
  .then(f => console.log('wrote', f, '—', n, 'slides'));
