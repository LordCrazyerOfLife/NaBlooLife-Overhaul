"""
Fetch flags for the 97 newly-added countries in NaBlooLife.

Reuses the round-flag approach from country_adder.py (download from
flagcdn.com, center-crop to a square, resize, apply an anti-aliased
circular mask) but sized to match this project's existing flags
(118x118, same as every flags/<code>.png already in the repo).

Run this yourself, in your own terminal, from inside the game folder
(next to game.html):

    pip install pillow
    python fetch_missing_flags.py

It only writes files for codes that don't already have a flag, so it's
safe to re-run if some downloads fail (just run it again).
"""
import os
import time
import urllib.request
from io import BytesIO

from PIL import Image, ImageDraw

SIZE = 118  # matches every existing flags/<code>.png in this project

MISSING_CODES = [
    "ag", "al", "am", "az", "ba", "bb", "bf", "bg", "bh", "bi", "bj", "bn",
    "bt", "bw", "by", "cf", "cg", "ci", "cm", "cv", "cy", "dm", "er", "fj",
    "fm", "ga", "gd", "gh", "gm", "gn", "gq", "gw", "hn", "is", "kg", "kh",
    "ki", "km", "kn", "kp", "la", "lc", "li", "lk", "lr", "ls", "lt", "lu",
    "lv", "ly", "md", "me", "mg", "mh", "mk", "ml", "mm", "mr", "mt", "mu",
    "mv", "mw", "mz", "na", "ne", "nr", "om", "ps", "pw", "rw", "sb", "sc",
    "sd", "si", "sl", "sm", "sn", "so", "sr", "ss", "st", "sz", "td", "tg",
    "tj", "tl", "tm", "to", "tt", "tv", "tz", "uz", "va", "vc", "vu", "ye",
    "zm",
]


def make_round_flag(code, path, size=SIZE):
    """Download a country flag from flagcdn.com and save it as a round PNG."""
    url = f"https://flagcdn.com/w320/{code}.png"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (NaBlooLifeModTool)"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = resp.read()

    img = Image.open(BytesIO(data)).convert("RGBA")

    # center-crop to a square so the flag stays centered and undistorted
    w, h = img.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    img = img.crop((left, top, left + side, top + side))
    img = img.resize((size, size), Image.LANCZOS)

    # smooth anti-aliased circular mask
    scale = 4
    mask = Image.new("L", (size * scale, size * scale), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size * scale - 1, size * scale - 1), fill=255)
    mask = mask.resize((size, size), Image.LANCZOS)

    round_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    round_img.paste(img, (0, 0), mask=mask)
    round_img.save(path, "PNG")


def main():
    if not os.path.isdir("flags"):
        print("Run this from inside the game folder (the one with game.html and a flags/ folder).")
        return

    ok, failed = 0, []
    for code in MISSING_CODES:
        out_path = os.path.join("flags", f"{code}.png")
        if os.path.exists(out_path):
            continue
        try:
            make_round_flag(code, out_path)
            print(f"  {code}.png  OK")
            ok += 1
        except Exception as e:
            print(f"  {code}.png  FAILED: {e}")
            failed.append(code)
        time.sleep(0.15)  # be polite to flagcdn.com

    print(f"\nDone: {ok} flags downloaded.")
    if failed:
        print(f"Failed ({len(failed)}): {', '.join(failed)}")
        print("Just run this script again — it skips flags that already exist.")


if __name__ == "__main__":
    main()
