import re, sys
pat = re.compile(r'"((?:[^"\\]|\\.)*)"')
def good(s):
    if len(s) < 3: return False
    if re.search(r'[{}<>#;=]|\.(js|png|css|com)\b|https?:|^[a-z0-9-]+$', s): return False
    if re.search(r'\d+(px|ms|em|%)', s): return False
    words = re.findall(r"[A-Za-z][A-Za-z'’\-]+", s)
    if not words: return False
    letters = sum(len(w) for w in words)
    if letters < len(s) * 0.55: return False
    if len(words) < 2: return False
    return True
for f in sys.argv[1:]:
    src = open(f, encoding='utf-8').read()
    seen = []
    for s in pat.findall(src):
        if good(s) and s not in seen:
            seen.append(s)
    open(f + '.clean.txt', 'w', encoding='utf-8').write('\n'.join(seen))
    print(f, len(seen))
