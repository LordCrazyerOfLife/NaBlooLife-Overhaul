import os, sys, numpy as np
from scipy import ndimage
from PIL import Image, ImageFilter, ImageDraw
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from split_grids2 import fit

src = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'grids', 'joyas2.png')
out = sys.argv[1]
grow = int(sys.argv[2]) if len(sys.argv) > 2 else 2
os.makedirs(out, exist_ok=True)
im = Image.open(src).convert('RGB')
a = np.array(im)
mask = ndimage.binary_opening(a.max(axis=2) > 24, iterations=1)
SH0, SH1 = 798, 925  # sunglasses band: black lenses on black need a much lower threshold and a stronger fill
mask[SH0:SH1] = False
lowm = np.zeros_like(mask)
sub = a[SH0:SH1].max(axis=2) > 14
sub = ndimage.binary_closing(sub, structure=np.ones((7, 7)), iterations=1)
sub = ndimage.binary_fill_holes(sub)
sub = ndimage.binary_opening(sub, iterations=2)
lowm[SH0:SH1] = sub
mask = mask | lowm
lab, _ = ndimage.label(ndimage.binary_dilation(mask, iterations=grow))
# glasses: glue lenses, bridge and arms together
lab2, _ = ndimage.label(ndimage.binary_dilation(lowm, iterations=6))
lab = np.where(lowm, lab2 + lab.max() + 1, lab)
items = []
for l in np.unique(lab):
    if l == 0:
        continue
    m = mask & (lab == l)
    n = int(m.sum())
    if n < 350:
        continue
    ys, xs = np.where(m)
    items.append(dict(l=int(l), y=ys.mean(), x=xs.mean(), w=xs.max() - xs.min(), h=ys.max() - ys.min(), n=n))

def kind(it):
    y, x, w, h = it['y'], it['x'], it['w'], it['h']
    if y < 108:
        return 'stud' if x < 750 else 'hoop'
    if y < 178:
        return 'earring'
    if y < 262:
        return 'charm'
    if y < 450:
        return 'grill'
    if y < 545:
        return 'chain'
    if y < 800:
        return 'chain' if w > h * 1.15 else 'pendant'
    if y < 920:
        return 'shades'
    if x >= 1120 or 900 < x < 1000:
        return 'headwear'
    return 'ring' if w > h * 1.62 else 'crown'


# reading order inside each kind: by row band then x
items.sort(key=lambda t: (9999 if t['y'] >= 920 else round(t['y'] / 45), t['x']))
counts = {}
saved = []
for it in items:
    k = kind(it)
    counts[k] = counts.get(k, 0) + 1
    blob = mask & (lab == it['l'])
    if k == 'shades':
        # keep the thin dark frames and arms that sit right next to the lenses
        near = ndimage.binary_dilation(blob, iterations=10)
        low = (a.max(axis=2) > 8) & near
        blob = blob | ndimage.binary_opening(low, iterations=1)
        m = ndimage.binary_fill_holes(ndimage.binary_closing(blob, structure=np.ones((7, 7)), iterations=1))
    else:
        m = ndimage.binary_fill_holes(ndimage.binary_closing(blob, structure=np.ones((5, 5)), iterations=2))
    alpha = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
    rgba = Image.fromarray(np.dstack([a, np.array(alpha)]), 'RGBA')
    p = rgba.crop(rgba.getbbox())
    name = f'{k}{counts[k]}'
    p.save(os.path.join(out, name + '.png'), optimize=True)
    saved.append((name, p))
print(len(saved), 'items', counts)

# numbered contact sheet to check the split
cols = 12
cw, ch = 120, 90
sheet = Image.new('RGB', (cols * cw, ((len(saved) + cols - 1) // cols) * ch), (40, 40, 44))
dr = ImageDraw.Draw(sheet)
for i, (name, p) in enumerate(saved):
    f = fit(p, cw - 10, ch - 24)
    x, y = (i % cols) * cw, (i // cols) * ch
    sheet.paste(f, (x + 5 + (cw - 10 - f.size[0]) // 2, y + 16 + (ch - 24 - f.size[1]) // 2), f)
    dr.text((x + 3, y + 2), name, fill=(255, 220, 80))
sheet.save(os.path.join(out, '_sheet.png'))
