"""Merge Haiku batch outputs into FreeLife/i18n/events.tsv.
Usage: python -I merge.py <tr_dir> <events.tsv>
- validates every batches/bNNN.out.tsv against batches/bNNN.tsv (ids, columns, placeholders, pronoun tokens)
- if ids were renumbered but line counts match, realigns by position (only if placeholders then check out)
- good rows + reused test rows -> events.tsv; bad rows -> full/retry.tsv for another pass
"""
import collections, glob, json, os, re, sys

TR, OUT = sys.argv[1], sys.argv[2]
PH = re.compile(r"\{[^{}\s]+\}")
PRON = {"{he}", "{He}", "{she}", "{She}", "{him}", "{his}", "{His}", "{her}", "{Her}", "{hers}", "{himself}",
        "{herself}", "{T_him}", "{he2}", "{they}", "{them}", "{their}", "{They}", "{Their}"}


def ok(en, tr):
    if not tr.strip() or "\t" in tr:
        return False
    got = collections.Counter(PH.findall(tr))
    if any(t in PRON for t in got):
        return False
    return got == collections.Counter(t for t in PH.findall(en) if t not in PRON)


good = dict(json.load(open(os.path.join(TR, "reuse.json"), encoding="utf-8")))
retry, stats = [], collections.Counter()
for inp in sorted(glob.glob(os.path.join(TR, "batches", "b[0-9][0-9][0-9].tsv")) + glob.glob(os.path.join(TR, "batches", "r*.tsv"))):
    if inp.endswith(".out.tsv"):
        continue
    src = [l.rstrip("\r\n").split("\t", 1) for l in open(inp, encoding="utf-8") if l.strip()]
    outp = inp[:-4] + ".out.tsv"
    if not os.path.exists(outp):
        stats["batches missing"] += 1
        retry += src
        continue
    out = [l.rstrip("\r\n").split("\t") for l in open(outp, encoding="utf-8") if l.strip()]
    by_id = {r[0]: r for r in out if len(r) == 3}
    if len(set(by_id) & {s for s, _ in src}) < len(src) // 2 and len(out) == len(src):
        by_id = {s: [s] + r[1:] for (s, _), r in zip(src, out) if len(r) == 3}  # renumbered: realign
        stats["batches realigned"] += 1
    for sid, en in src:
        r = by_id.get(sid)
        if r and ok(en, r[1]) and ok(en, r[2]):
            good[en] = (r[1].strip(), r[2].strip())
            stats["ok"] += 1
        else:
            retry.append([sid, en])
            stats["retry"] += 1
with open(os.path.join(TR, "batches", "retry.tsv"), "w", encoding="utf-8") as f:
    for sid, en in retry:
        f.write(f"{sid}\t{en}\n")
with open(OUT, "w", encoding="utf-8") as f:
    f.write("# bulk event/log text: english<TAB>español<TAB>português (BR). Machine-translated (Claude Haiku), validated.\n")
    for en, (es, pt) in good.items():
        f.write(f"{en}\t{es}\t{pt}\n")
print(dict(stats), "| events.tsv rows:", len(good), "| retry:", len(retry))
