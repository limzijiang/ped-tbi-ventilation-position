#!/usr/bin/env python3
"""Inline the two journal figures as data URIs -> index.html (self-contained deck)."""
import base64, pathlib

root = pathlib.Path(__file__).parent
src = (root / "deck_src.html").read_text(encoding="utf-8")

IMGS = {
    "__IMG_EPIC__":  root / "fig" / "epic_jamasurg_fig3.jpg",
    "__IMG_ETCO2__": root / "fig" / "etco2_gap_AC.jpg",
}

for token, path in IMGS.items():
    b64 = base64.b64encode(path.read_bytes()).decode()
    assert token in src, f"token {token} missing from deck_src.html"
    src = src.replace(token, f"data:image/jpeg;base64,{b64}")

out = root / "index.html"
out.write_text(src, encoding="utf-8")
print(f"wrote {out}  ({out.stat().st_size/1024:.0f} KB)")
