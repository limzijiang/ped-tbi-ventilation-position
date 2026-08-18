#!/usr/bin/env python3
"""Inline the journal figures as data URIs so every output file is self-contained.

  deck_src.html    -> index.html     (31-slide presentation)
  reading_src.html -> reading.html   (long-form scrolling article)
"""
import base64, pathlib

root = pathlib.Path(__file__).parent

IMGS = {
    "__IMG_EPIC__":  root / "fig" / "epic_jamasurg_fig3.jpg",
    "__IMG_ETCO2__": root / "fig" / "etco2_gap_AC.jpg",
}
DATA_URI = {tok: "data:image/jpeg;base64," + base64.b64encode(p.read_bytes()).decode()
            for tok, p in IMGS.items()}

for src_name, out_name in (("deck_src.html", "index.html"),
                           ("reading_src.html", "reading.html")):
    src = (root / src_name).read_text(encoding="utf-8")
    for tok, uri in DATA_URI.items():
        assert tok in src, f"token {tok} missing from {src_name}"
        src = src.replace(tok, uri)
    out = root / out_name
    out.write_text(src, encoding="utf-8")
    print(f"wrote {out.name}  ({out.stat().st_size/1024:.0f} KB)")
