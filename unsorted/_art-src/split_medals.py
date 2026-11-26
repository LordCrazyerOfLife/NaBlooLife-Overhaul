"""Cut grids/medallas.png (12 x 7 = 84 war medals on black) into medals/medal-NN.png.

The rows are not evenly spaced, so a plain cols x rows split cuts medals in half. This finds the empty black bands
between rows/columns (projection profile) and cuts each medal out of its own box.
  python -I _art-src/split_medals.py
"""
import os, sys
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from split_grids2 import cutout, fit, pad

ROOT = os.path.dirname(HERE)
SRC = os.path.join(HERE, 'grids', 'medallas.png')
OUT = os.path.join(ROOT, 'medals')
COLS, ROWS, BOX = 12, 7, (120, 150)


def spans(profile, n, empty):
    """the n runs of 'non-empty' positions, in order."""
    on = profile >= empty
    runs, start = [], None
    for i, v in enumerate(on):
        if v and start is None:
            start = i
        elif not v and start is not None:
            runs.append((start, i)); start = None
    if start is not None:
        runs.append((start, len(on)))
    runs = [r for r in runs if r[1] - r[0] > 12]  # drop specks
    if len(runs) != n:
        raise SystemExit(f'expected {n} bands, found {len(runs)}: {runs}')
    return runs


def main():
    im = Image.open(SRC).convert('RGB')
    a = np.array(im).max(axis=2) > 25
    H, W = a.shape
    rows = spans(a.sum(axis=1), ROWS, W * 0.02)
    cols = spans(a.sum(axis=0), COLS, H * 0.02)
    os.makedirs(OUT, exist_ok=True)
    n = 0
    for r0, r1 in rows:
        for c0, c1 in cols:
            n += 1
            cell = im.crop((max(0, c0 - 6), max(0, r0 - 6), min(W, c1 + 6), min(H, r1 + 6)))
            pad(fit(cutout(cell, it=3, thr=12, size=5), *BOX)).save(os.path.join(OUT, f'medal-{n:02d}.png'), optimize=True)
    print(n, 'medals')


if __name__ == '__main__':
    main()
