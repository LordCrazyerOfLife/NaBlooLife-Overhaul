import re, sys, json

# futbol-events.js: title/text/t/msg/riskMsg/+ followups
src = open('futbol-events.js', encoding='utf-8').read()
keys = ['title', 't', 'msg', 'riskMsg']
out = []
for k in keys:
    for m in re.finditer(r'\b' + k + r':\s*"((?:[^"\\]|\\.)*)"', src):
        out.append(m.group(1))
# text: "..." or text: () => "..." or (f) => expr ? "...": "..."
for m in re.finditer(r'\btext:\s*(?:\([^)]*\)\s*=>\s*)?(?:\w+\s*\?\s*)?"((?:[^"\\]|\\.)*)"', src):
    out.append(m.group(1))
for m in re.finditer(r'\btext:\s*\([^)]*\)\s*=>\s*\n\s*\w+\s*\?\s*\n?\s*"((?:[^"\\]|\\.)*)"\s*\n?\s*:\s*"((?:[^"\\]|\\.)*)"', src):
    out.append(m.group(1)); out.append(m.group(2))
uniq = []
for s in out:
    if s not in uniq:
        uniq.append(s)
open('futbol-events.strings.txt', 'w', encoding='utf-8').write('\n'.join(uniq))
print(len(uniq))
