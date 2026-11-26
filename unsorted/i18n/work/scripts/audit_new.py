"""Rough coverage audit for the new modules: extracts quoted literals and checks
them against ui.tsv exact keys, rules.tsv regexes and events.tsv templates."""
import re, sys, os

HERE = os.path.dirname(os.path.abspath(__file__))
I18N = os.path.dirname(os.path.dirname(HERE))

def load_ui():
    keys = set()
    for line in open(os.path.join(I18N, "ui.tsv"), encoding="utf-8"):
        line = line.rstrip("\n")
        if line.strip() and not line.startswith("#") and "\t" in line:
            keys.add(" ".join(line.split("\t")[0].split()).lower())
    return keys

def load_rules():
    out = []
    for line in open(os.path.join(I18N, "rules.tsv"), encoding="utf-8"):
        line = line.rstrip("\n")
        if line.strip() and not line.startswith("#") and "\t" in line:
            pat = line.split("\t")[0]
            try:
                out.append(re.compile(pat, re.I))
            except re.error:
                pass
    return out

TOK = re.compile(r"\{[^{}\s]+\}")

def tpl_rx(en):
    src, last = "", 0
    for m in TOK.finditer(en):
        src += re.escape(en[last:m.start()]) + r"(.+?)"
        last = m.end()
    return re.compile("^" + src + re.escape(en[last:]) + "$", re.I)

def load_tpls():
    out = []
    for line in open(os.path.join(I18N, "events.tsv"), encoding="utf-8"):
        line = line.rstrip("\n")
        if not line.strip() or line.startswith("#") or "\t" not in line:
            continue
        en = line.split("\t")[0]
        if TOK.search(en):
            out.append(tpl_rx(en))
    return out

LIT = re.compile(r'(["\'])((?:\\.|(?!\1).)*)\1|`((?:\\.|[^`\\])*)`')
BAD = re.compile(r"[;{}]|=>|function|return |\.length|\.map\(|querySelector|innerHTML|className|style=|px[;\"']|#[0-9a-f]{3,6}|https?://|^\.\.?/")
WORD = re.compile(r"[A-Za-z]")

def literals(src):
    for m in LIT.finditer(src):
        s = m.group(2) if m.group(1) else m.group(3)
        s = s.replace("\\n", " ").replace("\\t", " ").replace("\\'", "'").replace('\\"', '"')
        s = re.sub(r"\$\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}", "{X}", s)
        s = re.sub(r"<[^>]+>", " ", s)
        s = " ".join(s.split())
        if len(s) < 8 or not WORD.search(s) or BAD.search(s):
            continue
        if len(s.split()) < 2:
            continue
        yield s

def main(files):
    ui, rules, tpls = load_ui(), load_rules(), load_tpls()
    total = miss_n = 0
    for f in files:
        src = open(os.path.join(I18N, "..", f), encoding="utf-8").read()
        miss = []
        seen = set()
        for s in literals(src):
            k = s.lower()
            if k in seen:
                continue
            seen.add(k)
            total += 1
            if k in ui or any(r.match(s) for r in rules) or any(t.match(s) for t in tpls):
                continue
            miss.append(s)
        miss_n += len(miss)
        print(f"== {f}: {len(seen)} strings, {len(miss)} missing")
        for s in miss:
            print("   ", s)
    print(f"TOTAL {total} strings, {miss_n} missing ({100*(total-miss_n)/max(1,total):.1f}% covered)")

if __name__ == "__main__":
    main(sys.argv[1:])
