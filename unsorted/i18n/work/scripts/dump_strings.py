import re, sys

# crude but effective: string literals with at least 2 words, no CSS/class/html-only
pat = re.compile(r'"((?:[^"\\]|\\.)*)"|\'((?:[^\'\\]|\\.)*)\'|`((?:[^`\\]|\\.)*)`')
bad = re.compile(r'[{}<>#;]|^\s*(px|em|rem|%|\d)|class=|style=|\.js|\.png|http|data-|function|undefined|null')

for f in sys.argv[1:]:
    src = open(f, encoding='utf-8').read()
    uniq = []
    for m in pat.finditer(src):
        s = next(g for g in m.groups() if g is not None)
        s = s.strip()
        if len(s) < 4 or s in uniq:
            continue
        # need at least 2 words with letters, and a good letter ratio
        words = re.findall(r"[A-Za-z][A-Za-z'\-]+", s)
        if len(words) < 2:
            continue
        letters = sum(len(w) for w in words)
        if letters < len(s) * 0.5:
            continue
        if bad.search(s) and not re.search(r'\s[a-z]', s):
            continue
        if re.match(r'^[a-z\-]+(:[a-z\-]+)+$', s):
            continue
        uniq.append(s)
    open(f + '.all.txt', 'w', encoding='utf-8').write('\n'.join(uniq))
    print(f, len(uniq))
