"""Cut a sheet of loose items on black into transparent PNGs by blob detection (no fixed grid needed).

  python -I _art-src/split_blobs.py "GRIDS/TENIS.png" ropa_out [--thr 11] [--grow 4] [--sheet 120x54]

Items come out in reading order (rows by y-centre, then left to right) as item-001.png, item-002.png... at the
original resolution, plus _preview_<W>x<H>.png (a contact sheet with every item fitted into that box).
Black items on black need a LOW --thr (the background is ~0); raise --grow if one item breaks into pieces,
lower it if neighbouring items merge (e.g. glasses sitting right above a chain).
"""
import argparse, os, sys
import numpy as np
from scipy import ndimage
from PIL import Image, ImageFilter
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from split_grids2 import fit

ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('out')
ap.add_argument('--thr', type=int, default=11); ap.add_argument('--grow', type=int, default=4)
ap.add_argument('--min', type=int, default=400, help='ignore blobs smaller than this many pixels')
ap.add_argument('--rowgap', type=int, default=40); ap.add_argument('--sheet', default='120x54')
ap.add_argument('--prefix', default='item')
g = ap.parse_args()
os.makedirs(g.out, exist_ok=True)
a = np.array(Image.open(g.src).convert('RGB'))
mask = ndimage.binary_opening(a.max(axis=2) > g.thr, iterations=1)
lab, _ = ndimage.label(ndimage.binary_dilation(mask, iterations=g.grow))
items = []
for l in range(1, lab.max() + 1):
    m = mask & (lab == l)
    if m.sum() < g.min: continue
    ys, xs = np.where(m); items.append((ys.mean(), xs.mean(), l))
items.sort()
rows, cur = [], [items[0]]
for it in items[1:]:
    if it[0] - np.mean([c[0] for c in cur]) > g.rowgap: rows.append(cur); cur = [it]
    else: cur.append(it)
rows.append(cur)
pieces = []
for r in rows:
    for y, x, l in sorted(r, key=lambda t: t[1]):
        m = ndimage.binary_fill_holes(ndimage.binary_closing(mask & (lab == l), structure=np.ones((7, 7)), iterations=3))
        alpha = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))
        rgba = Image.fromarray(np.dstack([a, np.array(alpha)]), 'RGBA')
        p = rgba.crop(rgba.getbbox())
        p.save(os.path.join(g.out, f'{g.prefix}-{len(pieces) + 1:03d}.png'), optimize=True)
        pieces.append(p)
w, h = map(int, g.sheet.split('x'))
cols = 10
sheet = Image.new('RGBA', (cols * (w + 10), ((len(pieces) + cols - 1) // cols) * (h + 10)), (40, 40, 44, 255))
for i, p in enumerate(pieces):
    f = fit(p, w, h)
    sheet.alpha_composite(f, ((i % cols) * (w + 10) + 5 + (w - f.size[0]) // 2, (i // cols) * (h + 10) + 5 + (h - f.size[1]) // 2))
sheet.save(os.path.join(g.out, f'_preview_{w}x{h}.png'))
print(f'{len(pieces)} items in {len(rows)} rows ->', g.out, [len(r) for r in rows])
