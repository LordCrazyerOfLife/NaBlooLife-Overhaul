"""Apply spelling fixes to Free Life prose. Usage: python -I fix_spelling.py <game_dir>"""
import os, re, sys

ROOT = sys.argv[1]
FILES = ["game.html", "church.js", "fighter.js", "settings.js"]
WORDS = {  # lowercase-only on purpose: capitalised forms here are proper nouns (Marsh Harbour, Honour Cross)
    "coloured": "colored", "colours": "colors", "colour": "color", "flavours": "flavors",
    "neighbouring": "neighboring", "neighbours": "neighbors", "neighbour": "neighbor",
    "behaviour": "behavior", "harbour": "harbor", "honour": "honor", "favourite": "favorite",
    "humour": "humor", "centre": "center", "criticised": "criticized", "apologise": "apologize",
    "wacking": "whacking", "somebodys": "somebody's",
}
PHRASES = {"Two age up's per year": "Two age-ups per year", "NPC's can wear": "NPCs can wear"}
rx = re.compile(r"\b(" + "|".join(sorted(WORDS, key=len, reverse=True)) + r")\b")
total = 0
for fn in FILES:
    p = os.path.join(ROOT, fn)
    t = open(p, encoding="utf-8").read()
    n0 = t
    t, n = rx.subn(lambda m: WORDS[m.group(1)], t)
    for a, b in PHRASES.items():
        n += t.count(a)
        t = t.replace(a, b)
    if t != n0:
        open(p, "w", encoding="utf-8", newline="").write(t)
    print(f"{fn}: {n} fixes")
    total += n
print("total", total)
