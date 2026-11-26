import re, sys

def load(p):
    keys = set()
    for line in open(p, encoding='utf-8'):
        line = line.rstrip('\n')
        if not line.strip() or line.startswith('#') or '\t' not in line:
            continue
        keys.add(line.split('\t')[0].strip().lower())
    return keys

ui = load('i18n/ui.tsv')
pat = re.compile(r'\bT\(\s*"((?:[^"\\]|\\.)*)"')
for f in sys.argv[1:]:
    src = open(f, encoding='utf-8').read()
    uniq = []
    for s in pat.findall(src):
        if s not in uniq:
            uniq.append(s)
    miss = [s for s in uniq if s.lower() not in ui]
    out = f + '.missing.txt'
    open(out, 'w', encoding='utf-8').write('\n'.join(miss))
    print(f, len(miss))
