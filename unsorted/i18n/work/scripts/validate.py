"""Validate translated batches. Usage: python -I validate.py <in.tsv> <out.tsv> [--show N]
Checks: same ids/order, 3 columns, identical {placeholder} multiset in es and pt, non-empty, not untranslated.
"""
import re, sys, collections

src = [l.rstrip("\n").split("\t", 1) for l in open(sys.argv[1], encoding="utf-8") if l.strip()]
out = [l.rstrip("\n").split("\t") for l in open(sys.argv[2], encoding="utf-8") if l.strip()]
show = int(sys.argv[sys.argv.index("--show") + 1]) if "--show" in sys.argv else 0
PH = re.compile(r"\{[^{}\s]+\}")
# filled by the game with English pronouns ("him"/"her"): must be rewritten, never kept
PRONOUNS = {"{he}", "{He}", "{she}", "{She}", "{him}", "{his}", "{His}", "{her}", "{Her}", "{hers}",
            "{himself}", "{herself}", "{T_him}", "{he2}", "{they}", "{them}", "{their}", "{They}", "{Their}"}
by_id = {}
problems = collections.Counter()
bad = []
for row in out:
    if len(row) != 3:
        problems["wrong column count"] += 1
        bad.append(("cols", row))
        continue
    by_id[row[0]] = row
for i, (sid, en) in enumerate(src):
    row = by_id.get(sid)
    if not row:
        problems["missing id"] += 1
        bad.append(("missing", [sid, en]))
        continue
    want = collections.Counter(t for t in PH.findall(en) if t not in PRONOUNS)
    for lang, tr in (("es", row[1]), ("pt", row[2])):
        got = collections.Counter(PH.findall(tr))
        if not tr.strip():
            problems[f"{lang} empty"] += 1
            bad.append((f"{lang} empty", [sid, en]))
        elif any(t in PRONOUNS for t in got):
            problems[f"{lang} kept an English pronoun token"] += 1
            bad.append((f"{lang} pronoun token", [sid, en, tr]))
        elif got != want:
            problems[f"{lang} placeholder mismatch"] += 1
            bad.append((f"{lang} placeholders", [sid, en, tr]))
        elif tr.strip() == en.strip() and len(en.split()) > 2:
            problems[f"{lang} left in English"] += 1
            bad.append((f"{lang} untranslated", [sid, en]))
extra = set(by_id) - {s for s, _ in src}
if extra:
    problems["unknown ids"] += len(extra)
ok = len(src) - len({b[1][0] for b in bad})
print(f"{len(src)} source, {len(out)} output lines, {ok} fully valid")
for k, v in problems.most_common():
    print(f"  {k}: {v}")
sys.stdout.reconfigure(encoding="utf-8")
for kind, row in bad[:show]:
    print(" ", kind, "|", " | ".join(row)[:220])
