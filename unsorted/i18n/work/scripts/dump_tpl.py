import re, sys
pat = re.compile(r'`([^`]*)`')
for f in sys.argv[1:]:
    src = open(f, encoding='utf-8').read()
    uniq = []
    for s in pat.findall(src):
        words = re.findall(r'[A-Za-z][A-Za-z\'-]+', s)
        if len(words) < 4:
            continue
        if s in uniq:
            continue
        uniq.append(s)
    open(f + '.tpl.txt', 'w', encoding='utf-8').write('\n'.join(uniq))
    print(f, len(uniq))
