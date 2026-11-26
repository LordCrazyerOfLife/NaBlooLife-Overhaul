"""Cut grid sheets (cols x rows on black) into transparent PNGs, driven by _art-src/grids.json.

  python -I _art-src/split_grid.py --list                 # what the manifest covers
  python -I _art-src/split_grid.py                        # run everything
  python -I _art-src/split_grid.py --only MEDICAMENTOS    # grids whose src or out contains the text
  python -I _art-src/split_grid.py --only meds --preview  # also writes _art-src/_preview/<out>.png (contact sheet)

New grid: drop the PNG in _art-src/grids/, add one entry to grids.json (names left-to-right, top-to-bottom,
box = max w,h; tune cut.thr / cut.hole_max / keep_all if a piece comes out eaten or with extra blobs).
"""
import argparse, json, os, sys
import numpy as np
from scipy import ndimage
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from PIL import Image, ImageFilter
from split_grids2 import cutout, fit, cells, pad  # the shared cut-out helpers

ROOT = os.path.dirname(HERE)


def segment(im, g):
    """Cut animals that do not sit in even cells: label the non-black blobs (grown a little so antlers, tails and
    tusks stay with their animal), keep the N biggest and order them by rows (g['layout'] = pieces per row)."""
    a = np.array(im)
    mask = ndimage.binary_opening(a.max(axis=2) > g.get('thr', 12), iterations=1)
    lab, k = ndimage.label(ndimage.binary_dilation(mask, iterations=g.get('grow', 6)))
    n = sum(g['layout'])
    areas = ndimage.sum(mask, lab, range(1, k + 1))
    found = []
    for l in (np.argsort(areas)[::-1][:n] + 1):
        m = ndimage.binary_fill_holes(ndimage.binary_closing(mask & (lab == l), structure=np.ones((5, 5)), iterations=2))
        ys, xs = np.where(m)
        alpha = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))
        rgba = Image.fromarray(np.dstack([a, np.array(alpha)]), 'RGBA')
        found.append((ys.mean(), xs.mean(), rgba.crop(rgba.getbbox())))
    found.sort(key=lambda t: t[0])
    out, i = [], 0
    for count in g['layout']:
        out += [pad(fit(t[2], *g['box'])) for t in sorted(found[i:i + count], key=lambda t: t[1])]
        i += count
    return out


def piece(cell, g, name):
    cut = dict(g.get('cut', {}))
    if name in g.get('keep_all', []):
        cut['keep_all'] = True
    img = cutout(cell, **cut)
    if g.get('mode') == 'hair':  # one full-colour 500x500 layer placed on the head like the pack hairs
        w = 452
        img = img.resize((w, max(1, round(img.size[1] * w / img.size[0]))), Image.LANCZOS)
        canvas = Image.new('RGBA', (500, 500), (0, 0, 0, 0))
        canvas.alpha_composite(img.crop((0, 0, w, min(img.size[1], 494))), (24, 4))
        return canvas
    return pad(fit(img, *g['box']))


def run(only=None, preview=False):
    made = []
    for g in json.load(open(os.path.join(HERE, 'grids.json'), encoding='utf-8'))['grids']:
        if only and only.lower() not in (g['src'] + ' ' + g['out']).lower():
            continue
        im = Image.open(os.path.join(HERE, 'grids', g['src'])).convert('RGB')
        out_dir = os.path.join(ROOT, g['out'])
        os.makedirs(out_dir, exist_ok=True)
        outs = []
        if g.get('mode') == 'segment':
            for name, p in zip(g['names'], segment(im, g)):
                dest = os.path.join(out_dir, name + g.get('suffix', '') + '.png')
                p.save(dest, optimize=True)
                outs.append(p)
                made.append(dest)
            g = dict(g, cols=max(g['layout']), rows=len(g['layout']))
        for i, cell in ([] if g.get('mode') == 'segment' else cells(im, g['cols'], g['rows'])):
            dest = os.path.join(out_dir, g['names'][i] + g.get('suffix', '') + '.png')
            p = piece(cell, g, g['names'][i])
            p.save(dest, optimize=True)
            outs.append(p)
            made.append(dest)
        if preview:
            cw, ch = max(p.size[0] for p in outs) + 8, max(p.size[1] for p in outs) + 8
            sheet = Image.new('RGBA', (g['cols'] * cw, g['rows'] * ch), (40, 40, 40, 255))
            for k, p in enumerate(outs):
                sheet.alpha_composite(p, ((k % g['cols']) * cw + 4, (k // g['cols']) * ch + 4))
            os.makedirs(os.path.join(HERE, '_preview'), exist_ok=True)
            sheet.save(os.path.join(HERE, '_preview', os.path.splitext(g['src'])[0] + '.png'))
    return made


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--only')
    ap.add_argument('--preview', action='store_true')
    ap.add_argument('--list', action='store_true')
    a = ap.parse_args()
    if a.list:
        for g in json.load(open(os.path.join(HERE, 'grids.json'), encoding='utf-8'))['grids']:
            print(f"{g['src']:32} -> {g['out']}/  ({len(g['names'])} pieces)")
    else:
        print(len(run(a.only, a.preview)), 'images')
