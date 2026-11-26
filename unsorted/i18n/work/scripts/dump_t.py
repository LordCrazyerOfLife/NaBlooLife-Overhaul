import re, sys

pat = re.compile(r'\bT\(\s*"((?:[^"\\]|\\.)*)"')
for f in sys.argv[1:]:
    src = open(f, encoding='utf-8').read()
    uniq = []
    for s in pat.findall(src):
        if s not in uniq:
            uniq.append(s)
    with open(f + '.strings.txt', 'w', encoding='utf-8') as out:
        out.write('\n'.join(uniq))
    print(f, len(uniq))
