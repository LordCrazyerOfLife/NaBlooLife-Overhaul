"""Rename item-NNN.png in a folder using <folder>/names.json = [{"n":1,"file":"kebab-name","label":"Readable Name"}, ...].
  python -I _art-src/rename_items.py tenis
Skips duplicates by appending -2, -3. Writes the final names.json (file now includes .png, plus 'original')."""
import json, os, re, sys
d = sys.argv[1]
names = json.load(open(os.path.join(d, 'names.json'), encoding='utf-8'))
used, out = set(), []
for e in names:
    src = f"item-{int(e['n']):03d}.png"
    if not os.path.exists(os.path.join(d, src)): print('missing', src); continue
    base = re.sub(r'[^a-z0-9]+', '-', e['file'].lower().removesuffix('.png')).strip('-')[:60] or 'item'
    name, k = base, 2
    while name in used: name = f'{base}-{k}'; k += 1
    used.add(name)
    os.rename(os.path.join(d, src), os.path.join(d, name + '.png'))
    out.append({'file': name + '.png', 'original': src, 'label': e.get('label', name)})
json.dump(out, open(os.path.join(d, 'names.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
left = [f for f in os.listdir(d) if f.startswith('item-')]
print(d, len(out), 'renamed;', len(left), 'item-* left', left[:5])
