"""Find likely English typos in Free Life's player-facing text.
Usage: python -I spell.py <pylib> <strings.json> <out.tsv>
Only lowercase words (skips names/brands) that are unknown to the dictionary, rare in the game,
and one edit away from a common word are reported, with an example sentence.
"""
import json, re, sys, collections

sys.path.insert(0, sys.argv[1])
from spellchecker import SpellChecker

sp = SpellChecker(distance=1)
strings = json.load(open(sys.argv[2], encoding="utf-8"))
WORD = re.compile(r"(?<![\w'’$\-])([a-z][a-z']{2,})(?![\w\-])")
count, example = collections.Counter(), {}
for s in strings:
    clean = re.sub(r"<[^>]*>|\$\{[^}]*\}|https?://\S+|\S+@\S+|\\[nt]", " ", s)
    for w in WORD.findall(clean):
        w = w.strip("'")
        count[w] += 1
        example.setdefault(w, clean.strip()[:160])

rows = []
for w, n in count.items():
    if n > 3 or w in sp or w.endswith(("'s", "s'")) and w[:-2] in sp:
        continue
    fix = sp.correction(w)
    if not fix or fix == w or sp.word_usage_frequency(fix) < 1e-6:
        continue
    rows.append((w, fix, n, example[w]))
rows.sort(key=lambda r: -sp.word_usage_frequency(r[1]))
with open(sys.argv[3], "w", encoding="utf-8") as f:
    for r in rows:
        f.write("\t".join(map(str, r)) + "\n")
print(len(rows), "candidates")
