# 小兒疑似頭部外傷：抬高床頭 · 避免過度換氣 · EtCO₂ 監測

EMT / EMT-P 教學材料。先呈現成人證據力，再對照小兒證據，最後給可記住的現場口訣與 OSCE 情境。

| 格式 | 連結 | 說明 |
|---|---|---|
| 投影片（31 頁 HTML） | https://limzijiang.github.io/ped-tbi-ventilation-position/ | 單一檔案、離線可開、← → 翻頁、`F` 全螢幕、列印即成一頁一張 PDF |
| 長文閱讀版 | https://limzijiang.github.io/ped-tbi-ventilation-position/reading.html | 捲動式、含側欄目錄與閱讀進度條 |
| PowerPoint | [`ped-tbi-etco2-teaching.pptx`](ped-tbi-etco2-teaching.pptx) | 31 頁，深色主題，含講者備忘稿與可點擊 DOI |

實證來源：BTF 院前指引 3rd ed（2023）、BTF 小兒重度 TBI 指引 3rd ed（2019）、EPIC / EPIC4Kids、Cochrane、2024–2025 meta-analyses。
關鍵數字皆回原文或 PubMed 核對，見各版本的「數字查核」頁。

## 兩個回原文核對後推翻的常見說法

1. **BTF 院前指引 3rd ed 沒有年齡別通氣速率。** 原文只寫「約 10 次/分，EtCO₂ 35–45」。流傳的「嬰兒 25、兒童 20」是舊版／EPIC 教材數字，本次未取得原文確證。
2. **BTF 3rd ed 的小兒血壓是「要維持的目標」而非「低血壓定義」**，且遠高於 70+2×年齡：≤28d >70、1–12mo >84、1–5y >90、≥6y >100、成人 ≥110（皆 Weak）。

## 檔案

| 檔案 | 用途 |
|---|---|
| `index.html` / `reading.html` | 產出檔，圖片已內嵌為 data URI |
| `deck_src.html` / `reading_src.html` | 編輯用原始檔，圖片以 `__IMG_*__` token 佔位 |
| `build.py` | 把 `fig/` 的圖內嵌進兩份原始檔 → 產生 `index.html`、`reading.html` |
| `make_pptx.js` | pptxgenjs 產生器 → `ped-tbi-etco2-teaching.pptx` |
| `fig/` | 期刊原圖與裁切合成圖 |

改內容後：

```bash
python3 build.py && node make_pptx.js
```

## 圖片版權

所引用之期刊原圖（JAMA Surgery Figure 3、JAMA Network Open Figure 1）版權屬 American Medical Association，
僅為院內教學討論之引用，已於各圖下方標註完整出處與權利人。
