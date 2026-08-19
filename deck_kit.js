/* deck_kit.js — 「紅色系 PPT 風格」的 pptxgenjs 底層
 *
 * 用法：
 *   const K = require('./deck_kit.js');
 *   const s = K.pres.addSlide(); K.light(s); K.head(s, '關鍵研究', 'KEY STUDIES');
 *   ...
 *   K.save('/絕對路徑/檔名.pptx');
 *
 * 需要 `npm install pptxgenjs`。工作目錄路徑不要有空白。
 */
const pptxgen = require("pptxgenjs");

/* ---- 色票 ---------------------------------------------------------- */
const C = {
  cherry:  "990011",  // 主色：標題、關鍵數字、表頭
  cherryD: "6B000C",  // 深紅整頁底
  cream:   "FCF6F5",  // 內容頁底色
  gold:    "C89211",  // kicker、口訣
  ink:     "241C1D",  // 內文
  muted:   "6E6265",  // 次要說明
  navy:    "2F3C7E",  // 第二觀點
  tint:    "F6EAEB",  // 紅卡填色
  tint2:   "EDEFF7",  // 藍卡填色
  border:  "E4D7D8",  // 白卡框線
  zebra:   "FBF3F3",  // 表格斑馬列
  green:   "1E7A4B",  // 正向判定
  yellow:  "FFF4D6", yellowLine: "E8CE84",   // 口訣黃卡
  onDark:  "F1D6D9",  // 深底上的副標
  white:   "FFFFFF",
};

const F = "Arial";          // 中文交給 PowerPoint fallback，最穩定
const W = 13.33, H = 7.5;   // 16:9
const M = 0.62;             // 左右邊界

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";

/* ---- 版面骨架 ------------------------------------------------------ */
const light = (s) => { s.background = { color: C.cream }; };
const dark  = (s) => { s.background = { color: C.cherryD }; };

/** kicker（金色英文小標）＋ 中文大標。內容從 y≈1.55 開始。 */
function head(s, title, kicker) {
  if (kicker) s.addText(kicker, { x: M, y: 0.34, w: 8, h: 0.3, fontFace: F,
    fontSize: 13, bold: true, color: C.gold, charSpacing: 2, margin: 0 });
  s.addText(title, { x: M, y: kicker ? 0.68 : 0.46, w: W - 2 * M, h: 0.7,
    fontFace: F, fontSize: 30, bold: true, color: C.cherry, margin: 0, valign: "middle" });
}

/** 圓角白卡（含極淡陰影）。o = {x,y,w,h,fill,line} */
function card(s, o) {
  s.addShape(pres.ShapeType.roundRect, {
    x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: 0.09,
    fill: { color: o.fill || C.white },
    line: { color: o.line || C.border, width: 1 },
    shadow: { type: "outer", color: "000000", blur: 8, offset: 1, angle: 90, opacity: 0.07 },
  });
}

/** 實心編號圓點 */
function numDot(s, n, x, y, d = 0.46, color = C.cherry) {
  s.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d,
    fill: { color }, line: { type: "none" } });
  s.addText(String(n), { x, y, w: d, h: d, fontFace: F, fontSize: 17, bold: true,
    color: C.white, align: "center", valign: "middle", margin: 0 });
}

/** 判定膠囊：pill(s, '給', x, y, {w,h,color}) */
function pill(s, text, x, y, o = {}) {
  const w = o.w || 1.25, h = o.h || 0.48;
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: h / 2,
    fill: { color: o.color || C.cherry }, line: { type: "none" } });
  s.addText(text, { x, y, w, h, fontFace: F, fontSize: o.fontSize || 15, bold: true,
    color: C.white, align: "center", valign: "middle", margin: 0 });
}

/** 底部收尾金句（灰色斜體） */
function foot(s, t) {
  s.addText(t, { x: M, y: H - 0.52, w: W - 2 * M, h: 0.3, fontFace: F,
    fontSize: 10.5, color: C.muted, italic: true, margin: 0 });
}

/* ---- 表格 ----------------------------------------------------------
 * 深紅表頭 + 連續斑馬列。keyCol 指定的那一欄用紅色粗體（放結果數字）。
 * 注意：列的 fill 一定要用 line:{type:"none"}，寫 width:0 PowerPoint 仍會畫髮絲線。
 */
function table(s, o) {
  const { x = M, y = 1.6, w = W - 2 * M, colW, head: hdr, rows,
          rowH = 0.8, keyCol = -1, headSize = 13.5, bodySize = 12.5 } = o;
  const colX = [x];
  for (let i = 1; i < colW.length; i++) colX.push(colX[i - 1] + colW[i - 1]);

  s.addShape(pres.ShapeType.roundRect, { x, y, w, h: 0.5, rectRadius: 0.08,
    fill: { color: C.cherry }, line: { type: "none" } });
  hdr.forEach((h, i) => s.addText(h, { x: colX[i] + 0.22, y, w: colW[i] - 0.3, h: 0.5,
    fontFace: F, fontSize: headSize, bold: true, color: C.white, valign: "middle", margin: 0 }));

  rows.forEach((r, ri) => {
    const ry = y + 0.5 + ri * rowH;
    s.addShape(pres.ShapeType.rect, { x, y: ry, w, h: rowH,
      fill: { color: ri % 2 ? C.zebra : C.white }, line: { type: "none" } });
    r.forEach((c, ci) => s.addText(c, { x: colX[ci] + 0.22, y: ry, w: colW[ci] - 0.3, h: rowH,
      fontFace: F, fontSize: ci === 0 ? bodySize + 1 : bodySize,
      bold: ci === 0 || ci === keyCol, color: ci === keyCol ? C.cherry : C.ink,
      valign: "middle", lineSpacing: 21, margin: 0 }));
  });
  return y + 0.5 + rows.length * rowH;   // 回傳表格底部 y，方便接下一塊
}

/* ---- 整頁樣板 ------------------------------------------------------ */
/** 封面：深紅底 + 兩顆同色系圓 + 金框說明膠囊 */
function titleSlide(o) {
  const s = pres.addSlide(); dark(s);
  s.addShape(pres.ShapeType.ellipse, { x: 9.5, y: -1.9, w: 6.4, h: 6.4,
    fill: { color: C.cherry }, line: { type: "none" } });
  s.addShape(pres.ShapeType.ellipse, { x: 11.1, y: 4.2, w: 3.4, h: 3.4,
    fill: { color: "7A000E" }, line: { type: "none" } });
  if (o.kicker) s.addText(o.kicker, { x: M, y: 1.35, w: 8.6, h: 0.32, fontFace: F,
    fontSize: 13, bold: true, color: C.gold, charSpacing: 3, margin: 0 });
  s.addText(o.title, { x: M, y: 1.85, w: 8.8, h: 1.9, fontFace: F, fontSize: 44,
    bold: true, color: C.white, lineSpacing: 52, margin: 0 });
  if (o.subtitle) s.addText(o.subtitle, { x: M, y: 3.95, w: 8.8, h: 0.5, fontFace: F,
    fontSize: 22, color: C.onDark, margin: 0 });
  if (o.source) {
    s.addShape(pres.ShapeType.roundRect, { x: M, y: 4.95, w: 7.4, h: 0.62, rectRadius: 0.31,
      fill: { color: C.white, transparency: 88 }, line: { color: C.gold, width: 1 } });
    s.addText(o.source, { x: M + 0.28, y: 4.95, w: 7.0, h: 0.62, fontFace: F,
      fontSize: 13, color: "FFE9C4", valign: "middle", margin: 0 });
  }
  if (o.author) s.addText(o.author, { x: M, y: 6.2, w: 8.8, h: 0.35, fontFace: F,
    fontSize: 14, color: "D9B7BB", margin: 0 });
  return s;
}

/** 金句頁：深紅底 + 一顆大圓 + 金色口訣膠囊 */
function statementSlide(o) {
  const s = pres.addSlide(); dark(s);
  s.addShape(pres.ShapeType.ellipse, { x: -2.2, y: 4.4, w: 5.6, h: 5.6,
    fill: { color: C.cherry }, line: { type: "none" } });
  if (o.kicker) s.addText(o.kicker, { x: 1.5, y: 1.9, w: 10.3, h: 0.4, fontFace: F,
    fontSize: 15, bold: true, color: C.gold, charSpacing: 3, margin: 0 });
  s.addText(o.line, { x: 1.5, y: 2.45, w: 10.3, h: 1.0, fontFace: F, fontSize: 40,
    bold: true, color: C.white, margin: 0 });
  if (o.sub) s.addText(o.sub, { x: 1.5, y: 3.5, w: 10.3, h: 0.7, fontFace: F,
    fontSize: 25, color: C.onDark, margin: 0 });
  if (o.mnemonic) {
    s.addShape(pres.ShapeType.roundRect, { x: 1.5, y: 4.6, w: 6.4, h: 0.86, rectRadius: 0.43,
      fill: { color: "FFC000" }, line: { type: "none" } });
    s.addText(o.mnemonic, { x: 1.5, y: 4.6, w: 6.4, h: 0.86, fontFace: F, fontSize: 22,
      bold: true, color: "3B2A00", align: "center", valign: "middle", margin: 0 });
    if (o.mnemonicNote) s.addText(o.mnemonicNote, { x: 8.2, y: 4.6, w: 4.5, h: 0.86,
      fontFace: F, fontSize: 15, color: C.onDark, valign: "middle", margin: 0 });
  }
  return s;
}

/* ---- 常用格線（照抄即可，別自己算） -------------------------------- */
const GRID = {
  two:   (i) => ({ x: M + i * 6.28, w: 6.0 }),                       // 兩欄對照
  three: (i) => ({ x: M + i * 4.08, w: 3.78 }),                      // 三張卡
  four:  (i) => ({ x: M + (i % 2) * 6.28, y: 1.62 + Math.floor(i / 2) * 2.32,
                   w: 6.0, h: 2.05 }),                               // 2×2
};

const save = (path) => pres.writeFile({ fileName: path }).then(f => (console.log("wrote", f), f));

module.exports = { pptxgen, pres, C, F, W, H, M, GRID,
  light, dark, head, card, numDot, pill, foot, table, titleSlide, statementSlide, save };
