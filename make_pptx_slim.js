/* EMT CH27 頭部外傷：3H-Bombs（課本骨幹）＋ EPIC4Kids 延伸 — 13 頁 */
const { pres, C, F, W, H, M, GRID, light, dark, head, card, numDot, pill,
        foot, table, titleSlide, statementSlide, save } = require('./deck_kit.js');

const DOI = {
  epic4kids: 'https://doi.org/10.1016/j.annemergmed.2020.09.435',
  epic:      'https://doi.org/10.1001/jamasurg.2019.1152',
  yang:      'https://doi.org/10.1001/jamanetworkopen.2019.9448',
  btf3:      'https://doi.org/10.1080/10903127.2023.2187905',
  btf3exec:  'https://doi.org/10.1227/neu.0000000000002672',
  btfPed:    'https://doi.org/10.1097/PCC.0000000000001735',
};
const lk = (text, url, o = {}) => ({ text, options: Object.assign(
  { fontFace: F, hyperlink: { url }, color: C.navy, underline: { style: 'sng' } }, o) });
const tx = (text, o = {}) => ({ text, options: Object.assign({ fontFace: F }, o) });

/* 1 ── 封面 */
titleSlide({
  kicker: 'EMT 教科書 CH27 · 頭頸脊椎與顏面外傷',
  title: '頭部外傷的\n3H-Bombs',
  subtitle: '低血氧 · 低血壓 · 過度通氣 —— 加上小兒的延伸證據',
  source: '課本 p.732–733（EPIC-TBI）＋ EPIC4Kids 小兒次分析',
  author: '2026-08 教學版',
}).addNotes('全課只講三顆炸彈與一組數字。小兒的部分是延伸，不是另一套規則。');

/* 2 ── 金句：3H-Bombs */
{
  const s2 = statementSlide({
    kicker: 'THE CORE',
    line: '頭部外傷照護，首重避免 3H-Bombs',
    sub: '低血氧 · 低血壓 · 過度通氣',
    mnemonic: '九十、一一〇、四十',
    mnemonicNote: 'SpO₂ ≥ 90%\nSBP ≥ 110 mmHg\nEtCO₂ 35–45 mmHg',
  });
  s2.addText('Hypoxemia · Hypotension · Hyperventilation',
    { x: 1.5, y: 4.14, w: 10.3, h: 0.34, fontFace: F, fontSize: 15,
      color: 'D9B7BB', margin: 0 });
  s2.addNotes('課本 p.732 原文。三個 H 開頭的字，三個數字，這是整章的骨架。');
}

/* 3 ── 三個數字：一次就夠 */
{
  const s = pres.addSlide(); light(s);
  head(s, '到院前只要發生「一次」，死亡率就翻倍', 'WHY IT MATTERS');
  const data = [
    ['2 倍', '一次低血氧', 'SpO₂ < 90%\n到院前只要記錄到一次'],
    ['2 倍', '一次低血壓', 'SBP < 90 mmHg\n到院前只要記錄到一次'],
    ['2–6 倍', '過度換氣', '吹太快\n是三者中傷害幅度最大的'],
  ];
  data.forEach(([n, lab, desc], i) => {
    const g = GRID.three(i);
    card(s, { x: g.x, y: 1.62, w: g.w, h: 2.62 });
    s.addText([tx(n, { fontSize: 46, bold: true, color: C.cherry })],
      { x: g.x + 0.3, y: 1.82, w: 3.2, h: 0.85, margin: 0, valign: 'middle' });
    s.addText(lab, { x: g.x + 0.3, y: 2.72, w: 3.2, h: 0.35, fontFace: F,
      fontSize: 15.5, bold: true, color: C.ink, margin: 0 });
    s.addText(desc, { x: g.x + 0.3, y: 3.12, w: 3.2, h: 0.9, fontFace: F,
      fontSize: 12.5, color: C.muted, lineSpacing: 18, margin: 0, valign: 'top' });
  });
  card(s, { x: M, y: 4.55, w: W - 2 * M, h: 1.05, fill: C.tint, line: 'E0C4C7' });
  s.addText('這三個數字是可以「被我們製造」出來的 —— 也就可以被我們避免',
    { x: M + 0.4, y: 4.62, w: W - 2 * M - 0.8, h: 0.55, fontFace: F, fontSize: 17.5,
      bold: true, color: C.cherry, margin: 0, valign: 'middle' });
  s.addText('教學定位：這一頁講完，學員才會願意在意後面那些「看起來很瑣碎」的速率與數字。',
    { x: M + 0.4, y: 5.12, w: W - 2 * M - 0.8, h: 0.4, fontFace: F, fontSize: 14,
      color: C.navy, margin: 0 });
  foot(s, '課本 p.732，依 EPIC-TBI（Excellence in Prehospital Injury Care – TBI）。');
  s.addNotes('強調「一次」。不是持續低血氧才算，是紀錄到一次就與死亡率倍增相關。');
}

/* 4 ── 三個目標值 */
{
  const s = pres.addSlide(); light(s);
  head(s, '三個要守住的數字', 'TARGETS');
  const rows = [
    ['Hypoxemia\n低血氧', 'SpO₂ ≥ 90%', '持續給氧、持續監測；低於 90% 立即處理'],
    ['Hypotension\n低血壓', 'SBP ≥ 110 mmHg', '課本給的是成人值；小兒見下方註'],
    ['Hyperventilation\n過度通氣', 'EtCO₂ 35–45 mmHg', '有監測器材時以 EtCO₂ 為準，不是憑感覺'],
  ];
  table(s, { y: 1.62, colW: [3.2, 3.3, 5.59], head: ['3H', '目標', '現場做法'],
    rows, rowH: 0.92, keyCol: 1 });
  card(s, { x: M, y: 4.9, w: W - 2 * M, h: 1.28, fill: C.tint2, line: 'C9CFE6' });
  s.addText('延伸：小兒的血壓目標要用年齡別', { x: M + 0.4, y: 5.0, w: 11, h: 0.35,
    fontFace: F, fontSize: 15, bold: true, color: C.navy, margin: 0 });
  s.addText('≤28 天 > 70　·　1–12 個月 > 84　·　1–5 歲 > 90　·　≥6 歲 > 100　·　成人 ≥ 110 mmHg（BTF 院前指引 3rd ed）\n注意：常見的 SBP < 70+(2×年齡) 是低血壓的「定義」，上面這組是要「維持的目標」，兩者不可混用。',
    { x: M + 0.4, y: 5.36, w: 11.6, h: 0.75, fontFace: F, fontSize: 12.5,
      color: C.ink, lineSpacing: 19, margin: 0, valign: 'top' });
  foot(s, '課本 p.732；小兒血壓目標為延伸，取自 BTF 院前指引 3rd ed Table 1。');
  s.addNotes('小兒血壓那條是本課唯一補充課本的地方，要講清楚是延伸不是課本原文。');
}

/* 5 ── 沒有監測器材時：年齡別速率 */
{
  const s = pres.addSlide(); light(s);
  head(s, '沒有 EtCO₂ 監測時，用「次數」控制', 'VENTILATION RATE');
  const rows = [
    ['成人', '10–12 次/分', '20 次/分'],
    ['兒童', '20 次/分', '25 次/分'],
    ['嬰兒', '25 次/分', '30 次/分'],
  ];
  table(s, { y: 1.62, colW: [3.2, 4.4, 4.49],
    head: ['對象', '一般情況（維持 EtCO₂ 35–45）', '腦壓升高時（目標 30–35）'], rows, rowH: 0.86, keyCol: 1 });
  card(s, { x: M, y: 4.7, w: W - 2 * M, h: 1.5, fill: C.yellow, line: C.yellowLine });
  s.addText('記法：一般是 10 / 20 / 25，腦壓高時每一格「往上跳一階」→ 20 / 25 / 30',
    { x: M + 0.4, y: 4.84, w: 11.6, h: 0.42, fontFace: F, fontSize: 16,
      bold: true, color: '6B4A00', margin: 0, valign: 'middle' });
  s.addText('有監測器材時，速率只是起點，EtCO₂ 才是終點 —— 吹到數字進帶寬就停手，不要繼續照表加速。\n嬰兒照成人的 10 次/分一定會積 CO₂；成人照嬰兒的 25 次/分就是在製造第三顆炸彈。',
    { x: M + 0.4, y: 5.3, w: 11.6, h: 0.78, fontFace: F, fontSize: 12.5,
      color: C.ink, lineSpacing: 20, margin: 0, valign: 'top' });
  foot(s, '課本 p.732〈適當通氣及氧合〉與 p.733〈腦壓升高相關處置〉。');
  s.addNotes('這兩排數字最容易記混。用「往上跳一階」串起來，比死背六個數字容易。');
}

/* 6 ── 每 5 分鐘記錄五項 */
{
  const s = pres.addSlide(); light(s);
  head(s, '每 5 分鐘，重複記錄這五項', 'MONITORING');
  const items = [['血壓', 'SBP 有沒有掉到目標以下'], ['SpO₂', '有沒有掉到 90% 以下'],
    ['EtCO₂', '有沒有掉到 35 以下（＝吹太快）'], ['GCS', '有沒有比上一次掉 ≥2 分'],
    ['瞳孔大小', '有沒有變大、對光反射有沒有變差']];
  card(s, { x: M, y: 1.62, w: 7.5, h: 3.9 });
  items.forEach(([k, v], i) => {
    const y = 1.92 + i * 0.68;
    numDot(s, i + 1, M + 0.42, y + 0.04, 0.4);
    s.addText(k, { x: M + 1.0, y, w: 1.7, h: 0.48, fontFace: F, fontSize: 15,
      bold: true, color: C.cherry, valign: 'middle', margin: 0 });
    s.addText(v, { x: M + 2.6, y, w: 4.6, h: 0.48, fontFace: F, fontSize: 12.5,
      color: C.muted, valign: 'middle', margin: 0 });
  });
  card(s, { x: M + 7.9, y: 1.62, w: 4.19, h: 3.9, fill: C.tint, line: 'E0C4C7' });
  s.addText('為什麼是「重複」', { x: M + 8.3, y: 1.9, w: 3.4, h: 0.4, fontFace: F,
    fontSize: 16, bold: true, color: C.cherry, margin: 0 });
  s.addText('這五項全部是「趨勢題」，不是「單點題」。\n\nGCS 掉 ≥2 分、瞳孔變化，都要有前一次的紀錄才看得出來。\n\n只量一次，等於沒有量。',
    { x: M + 8.3, y: 2.42, w: 3.4, h: 2.9, fontFace: F, fontSize: 13,
      color: C.ink, lineSpacing: 21, margin: 0, valign: 'top' });
  foot(s, '課本 p.733〈密切監測與詳細記錄〉，依 EPIC-TBI 建議。');
  s.addNotes('可以要求學員在情境演練中真的每 5 分鐘喊一次這五項。');
}

/* 7 ── 腦壓升高的四個徵象 */
{
  const s = pres.addSlide(); light(s);
  head(s, '什麼時候算「腦壓升高」', 'RECOGNITION');
  const four = [
    ['GCS 下降 ≥ 2 分', '和上一次紀錄比，不是和正常值比'],
    ['瞳孔對光反射\n變得不明顯或消失', '含瞳孔放大、兩側不等大'],
    ['偏癱或單側肢體無力', '新出現的、之前沒有的'],
    ['庫欣氏徵象', '心跳過緩 ＋ 血壓升高 ＋ 呼吸不規則\n（三者合稱，是晚期表現）'],
  ];
  four.forEach(([t, d], i) => {
    const g = GRID.four(i);
    card(s, { x: g.x, y: g.y, w: g.w, h: g.h });
    numDot(s, i + 1, g.x + 0.36, g.y + 0.32, 0.46);
    s.addText(t, { x: g.x + 0.96, y: g.y + 0.24, w: 4.8, h: 0.62, fontFace: F,
      fontSize: 16, bold: true, color: C.cherry, valign: 'middle', margin: 0 });
    s.addText(d, { x: g.x + 0.4, y: g.y + 1.0, w: 5.2, h: 0.9, fontFace: F,
      fontSize: 13, color: C.muted, lineSpacing: 21, margin: 0, valign: 'top' });
  });
  card(s, { x: M, y: 6.28, w: W - 2 * M, h: 0.72, fill: C.tint, line: 'E0C4C7' });
  s.addText('出現以上任一情況，才啟動下一頁的處置 —— 沒有這些徵象就不要吹快。',
    { x: M + 0.4, y: 6.28, w: 11.6, h: 0.72, fontFace: F, fontSize: 14.5,
      bold: true, color: C.cherry, valign: 'middle', margin: 0 });
  foot(s, '課本 p.733〈腦壓升高相關處置〉。');
  s.addNotes('庫欣氏徵象是晚期。不要等到三個都齊了才動作。');
}

/* 8 ── 腦壓升高的三個處置 */
{
  const s = pres.addSlide(); light(s);
  head(s, '腦壓升高時的三個處置', 'MANAGEMENT');
  const layers = [
    ['解開頸圈', '減少頸部靜脈壓迫', '最快、最沒有副作用的一步。頸椎保護改用徒手固定維持中立位。', C.cherry],
    ['輕度過度通氣', '目標 EtCO₂ 30–35 mmHg', '沒有監測器材時用次數：成人 20 次/分、兒童 25 次/分、嬰兒 30 次/分。\n徵象一改善就回到 35–45 —— 這是暫時措施，不是新的常態。', C.navy],
    ['藥物', '若有相關藥物流程', '可考慮降腦壓藥物、鎮靜藥物，甚至肌肉鬆弛劑。依各地 SOP 授權。', C.gold],
  ];
  layers.forEach(([t, sub, body, col], i) => {
    const y = 1.6 + i * 1.72;
    card(s, { x: M, y, w: W - 2 * M, h: 1.5 });
    s.addShape(pres.ShapeType.roundRect, { x: M + 0.28, y: y + 0.26, w: 0.16, h: 0.98,
      rectRadius: 0.08, fill: { color: col }, line: { type: 'none' } });
    s.addText(t, { x: M + 0.62, y: y + 0.24, w: 3.6, h: 0.42, fontFace: F,
      fontSize: 17, bold: true, color: col, margin: 0, valign: 'middle' });
    s.addText(sub, { x: M + 0.62, y: y + 0.72, w: 3.8, h: 0.42, fontFace: F,
      fontSize: 12.5, color: C.muted, margin: 0, valign: 'top' });
    s.addText(body, { x: M + 4.6, y, w: 7.2, h: 1.5, fontFace: F, fontSize: 13.5,
      color: C.ink, lineSpacing: 21, margin: 0, valign: 'middle' });
  });
  foot(s, '課本 p.733；表 27-2 為完整處置整理。');
  s.addNotes('第 2 項是唯一會用到「吹快」的時機。強調它是暫時的、有終點的。');
}

/* 9 ── EPIC4Kids：這套做法用在小孩身上的結果 */
{
  const s = pres.addSlide(); light(s);
  head(s, '延伸：同一套指引用在小孩身上', 'EPIC4KIDS');
  s.addText('EPIC 研究的預先計畫小兒次分析：2,801 名 <18 歲（導入前 2,041／導入後 760），送 Arizona 第一級創傷中心',
    { x: M, y: 1.48, w: W - 2 * M, h: 0.32, fontFace: F, fontSize: 13, color: C.muted, margin: 0 });
  const rows = [
    ['全體 · 存活出院', '1.16（0.70–1.92）', '未改善'],
    ['全體 · 存活到住院', '2.41（1.17–5.21）', '顯著改善'],
    ['重度 TBI · 存活出院', '8.42（1.01 – >100）', '顯著，但區間極寬'],
    ['重度＋正壓通氣 · 存活出院', '9.13（0.79 – >100）', '方向一致，未達顯著'],
  ];
  table(s, { y: 1.9, colW: [4.6, 4.0, 3.49],
    head: ['族群與結果', '校正後勝算比 aOR（95% CI）', '判讀'], rows, rowH: 0.8, keyCol: 1 });
  card(s, { x: M, y: 5.42, w: W - 2 * M, h: 1.05, fill: C.tint, line: 'E0C4C7' });
  s.addText([
    tx('8.42 的信賴區間下界貼在 1.01、上界破百 —— 方向大概是好的，幅度完全不知道。', { fontSize: 14.5, bold: true, color: C.cherry }),
    tx('　不要在教材上寫成「存活率提高 8 倍」。', { fontSize: 14.5, bold: true, color: C.ink }),
  ], { x: M + 0.4, y: 5.42, w: 11.6, h: 1.05, margin: 0, valign: 'middle', lineSpacing: 22 });
  foot(s, [lk('EPIC4Kids, Ann Emerg Med', DOI.epic4kids, { fontSize: 10.5, italic: true })]);
  s.addNotes('這是教學員讀信賴區間最好的例子：點估計漂亮不等於結論強。');
}

/* 10 ── EPIC4Kids 判讀：機會之窗 */
{
  const s = pres.addSlide(); light(s);
  head(s, '效果集中在「看起來很嚴重、但還有機會」的孩子', 'INTERPRETATION');
  const g0 = GRID.two(0), g1 = GRID.two(1);
  card(s, { x: g0.x, y: 1.62, w: g0.w, h: 3.3, fill: C.tint2, line: 'C9CFE6' });
  s.addText('三個族群，三種結果', { x: g0.x + 0.42, y: 1.86, w: 5.2, h: 0.4, fontFace: F,
    fontSize: 17, bold: true, color: C.navy, margin: 0 });
  [['中度', '看不到效益 —— 本來大多會好'],
   ['重度', '這裡有救 —— 效益集中在這一群'],
   ['最危急（critical）', '看不到效益 —— 傷害已經定型']].forEach(([k, v], i) => {
    const y = 2.42 + i * 0.78;
    s.addShape(pres.ShapeType.ellipse, { x: g0.x + 0.42, y: y + 0.15, w: 0.14, h: 0.14,
      fill: { color: C.navy }, line: { type: 'none' } });
    s.addText(k, { x: g0.x + 0.72, y, w: 2.0, h: 0.44, fontFace: F, fontSize: 14,
      bold: true, color: C.ink, valign: 'middle', margin: 0 });
    s.addText(v, { x: g0.x + 2.5, y, w: 3.2, h: 0.44, fontFace: F, fontSize: 12.5,
      color: C.muted, valign: 'middle', margin: 0 });
  });
  s.addText('作者結論：存在「依嚴重度的機會之窗」，並支持繼續推廣小兒院前 TBI 指引 —— 不是「指引沒用」。',
    { x: g0.x + 0.42, y: 4.34, w: 5.2, h: 0.5, fontFace: F, fontSize: 12.5,
      color: C.navy, lineSpacing: 19, margin: 0, valign: 'top' });
  card(s, { x: g1.x, y: 1.62, w: g1.w, h: 3.3, fill: C.tint, line: 'E0C4C7' });
  s.addText('對現場的意思', { x: g1.x + 0.42, y: 1.86, w: 5.2, h: 0.4, fontFace: F,
    fontSize: 17, bold: true, color: C.cherry, margin: 0 });
  s.addText('把基本功做好，最可能改變結局的\n就是那個「看起來很糟、但還沒到最糟」的孩子。\n\n對他而言，3H-Bombs 每避免一顆，\n都是實實在在的差別。\n\n這也解釋了為什麼全體數據看不出效果 ——\n效益被中度與 critical 兩群稀釋掉了。',
    { x: g1.x + 0.42, y: 2.42, w: 5.2, h: 2.4, fontFace: F, fontSize: 13.5,
      color: C.ink, lineSpacing: 22, margin: 0, valign: 'top' });
  card(s, { x: M, y: 5.14, w: W - 2 * M, h: 0.9 });
  s.addText('教學版說法：「這套東西不會把所有孩子救回來 —— 但它救得回來的那一群，正是你們最常遇到的那一群。」',
    { x: M + 0.4, y: 5.14, w: 11.6, h: 0.9, fontFace: F, fontSize: 14.5,
      bold: true, color: C.cherry, valign: 'middle', margin: 0 });
  foot(s, '同前註。成人 EPIC 主研究也呈現同樣的嚴重度依賴型態。');
  s.addNotes('避免學員把「全體沒改善」誤讀成「不用做」。');
}

/* 11 ── 小兒 EtCO₂ 的但書（原圖） */
{
  const s = pres.addSlide(); light(s);
  head(s, '但書：小孩的 EtCO₂ 會低估真實 CO₂', 'CAVEAT');
  const iw = 7.5, ih = iw * 770 / 1944;
  s.addImage({ path: 'etco2_gap_AC.jpg', x: M, y: 1.6, w: iw, h: ih });
  /* 影像外框：用無填色矩形，不要用 transparency:100 的實心填色 */
  s.addShape(pres.ShapeType.rect, { x: M, y: 1.6, w: iw, h: ih,
    fill: { type: 'none' }, line: { color: C.border, width: 1 } });
  s.addText('Yang JT, et al. JAMA Netw Open. 2019;2(8):e199448, Figure 1（panel A 與 C）© American Medical Association．為院內教學討論引用。',
    { x: M, y: 1.6 + ih + 0.12, w: iw, h: 0.5, fontFace: F, fontSize: 9.5,
      color: C.muted, lineSpacing: 14, margin: 0, valign: 'top' });
  card(s, { x: M + 8.0, y: 1.6, w: 4.09, h: 4.4, fill: C.tint, line: 'E0C4C7' });
  s.addText('三個紅旗', { x: M + 8.4, y: 1.86, w: 3.3, h: 0.4, fontFace: F,
    fontSize: 17, bold: true, color: C.cherry, margin: 0 });
  s.addText('此時螢幕上的數字\n比動脈血的真實值低：',
    { x: M + 8.4, y: 2.3, w: 3.3, h: 0.6, fontFace: F, fontSize: 12.5,
      color: C.muted, lineSpacing: 19, margin: 0, valign: 'top' });
  [['灌流差', '低血壓、休克、CPR 中'],
   ['肺有問題', '溺水、氣喘、肺挫傷\n差距可達 10 mmHg'],
   ['受傷最初數小時', '最初 8 小時一致性最差']].forEach(([k, v], i) => {
    const y = 3.0 + i * 0.86;
    s.addText(k, { x: M + 8.4, y, w: 3.3, h: 0.3, fontFace: F, fontSize: 14,
      bold: true, color: C.ink, margin: 0 });
    s.addText(v, { x: M + 8.4, y: y + 0.3, w: 3.3, h: 0.5, fontFace: F, fontSize: 11.5,
      color: C.muted, lineSpacing: 16, margin: 0, valign: 'top' });
  });
  s.addText('所以：螢幕 40，真實可能是 45–50。\n絕不因為數字偏低就再吹快。',
    { x: M + 8.4, y: 5.5, w: 3.3, h: 0.44, fontFace: F, fontSize: 12,
      bold: true, color: C.cherry, lineSpacing: 17, margin: 0, valign: 'top' });
  foot(s, '全部病人平均高 2.7 mmHg，不到一半落在可接受的 0–5 mmHg 內；發生小兒 ARDS 者平均高近 10 mmHg。');
  s.addNotes('這一頁不是要否定 EtCO₂，是要學員知道它往哪個方向錯。');
}

/* 12 ── 現場口訣 + 兩題檢核 */
{
  const s = pres.addSlide(); light(s);
  head(s, '現場帶走這一頁就夠', 'TAKE-HOME');
  card(s, { x: M, y: 1.6, w: W - 2 * M, h: 1.28, fill: C.yellow, line: C.yellowLine });
  s.addText('九十、一一〇、四十；腦壓高才吹快，只吹到三十五',
    { x: M + 0.4, y: 1.6, w: 11.6, h: 1.28, fontFace: F, fontSize: 22,
      bold: true, color: '6B4A00', align: 'center', valign: 'middle', margin: 0 });
  const qs = [
    ['5 歲、GCS 7、已 BVM、SpO₂ 96%、SBP 88、EtCO₂ 28', '吹太快 → 放慢到 35–45；同時處理血壓（1–5 歲目標 >90）', '常見錯誤：以為 28 是「通氣良好」'],
    ['3 歲、GCS 8、右瞳放大、對光反射消失、心跳變慢', '符合腦壓升高 → 解頸圈＋吹到 EtCO₂ 30–35（或 25 次/分）', '這是唯一該吹快的情境'],
  ];
  qs.forEach(([q, a, note], i) => {
    const y = 3.1 + i * 1.6;
    card(s, { x: M, y, w: W - 2 * M, h: 1.42 });
    numDot(s, i + 1, M + 0.34, y + 0.28, 0.42);
    s.addText(q, { x: M + 0.94, y: y + 0.22, w: 5.4, h: 0.55, fontFace: F,
      fontSize: 13, color: C.ink, lineSpacing: 19, margin: 0, valign: 'top' });
    s.addText(a, { x: M + 6.5, y: y + 0.22, w: 5.3, h: 0.6, fontFace: F,
      fontSize: 13, bold: true, color: C.cherry, lineSpacing: 19, margin: 0, valign: 'top' });
    s.addText(note, { x: M + 0.94, y: y + 0.95, w: 10.8, h: 0.35, fontFace: F,
      fontSize: 11.5, color: C.muted, margin: 0 });
  });
  foot(s, '兩題都在考同一件事：別吹快、血壓優先、EtCO₂ 是儀表不是目標。');
  s.addNotes('讓學員複誦一次口訣，再做這兩題。');
}

/* 13 ── 參考 */
{
  const s = pres.addSlide(); light(s);
  head(s, '出處', 'SOURCES');
  card(s, { x: M, y: 1.6, w: W - 2 * M, h: 4.62 });
  const refs = [
    ['EMT 教科書中冊 CH27 頭頸脊椎與顏面外傷，p.732–733（3H-Bombs、通氣速率、五項監測、腦壓升高處置）', null],
    ['EPIC4Kids: Effect of Implementing the Out-of-Hospital TBI Treatment Guidelines in Children. Ann Emerg Med.', DOI.epic4kids],
    ['Spaite DW, et al. Statewide Implementation of Prehospital TBI Treatment Guidelines (EPIC). JAMA Surg. 2019.', DOI.epic],
    ['Yang JT, et al. Agreement Between PaCO₂ and EtCO₂ in Children. JAMA Netw Open. 2019;2(8):e199448.', DOI.yang],
    ['Prehospital Guidelines for the Management of TBI – 3rd Edition（小兒血壓目標 Table 1）. Prehosp Emerg Care. 2023.', DOI.btf3],
    ['Kochanek PM, et al. Guidelines for the Management of Pediatric Severe TBI, 3rd Edition. Pediatr Crit Care Med. 2019.', DOI.btfPed],
  ];
  refs.forEach(([t, url], i) => {
    const y = 1.86 + i * 0.6;
    s.addText(String(i + 1), { x: M + 0.36, y, w: 0.35, h: 0.5, fontFace: F,
      fontSize: 12, bold: true, color: C.cherry, margin: 0, valign: 'top' });
    s.addText([url ? lk(t, url, { fontSize: 11.5 }) : tx(t, { fontSize: 11.5, color: C.ink })],
      { x: M + 0.78, y, w: 11.0, h: 0.6, lineSpacing: 16, margin: 0, valign: 'top' });
  });
  s.addShape(pres.ShapeType.line, { x: M + 0.36, y: 5.5, w: 11.4, h: 0,
    line: { color: 'E0C4C7', width: 1 } });
  s.addText('課本未涵蓋「抬高床頭」：該做法只有降腦壓的生理證據，Cochrane 評為 very low quality，小兒指引無任何分級建議 —— 血壓沒達標前不要抬。',
    { x: M + 0.36, y: 5.62, w: 11.4, h: 0.44, fontFace: F, fontSize: 12,
      color: C.navy, lineSpacing: 18, margin: 0, valign: 'top' });
  foot(s, '2026-08 整理。圖片版權屬 American Medical Association，僅為院內教學討論引用。');
  s.addNotes('若有人問抬高床頭，用最後一行回答：它不在 3H 裡，證據也最弱。');
}

save('ped-tbi-3H-EPIC4Kids.pptx');
