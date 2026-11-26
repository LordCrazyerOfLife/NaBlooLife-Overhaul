"""Re-cut the pack hairs that used to cross eyes and cheeks (dread-*, emo-pink*, braids-bw, rainbow-long).

The first fix erased every hair pixel inside the face silhouette from the eyebrow line down with a dead-straight cut
at y=194, which left a rectangular notch: flat bottom edge across the forehead and square corners. This redoes it from
the untouched originals (_art-src/hair-orig/) with a natural hole: the cut line is slightly arched and ragged, the top
corners are rounded, and the edge is feathered a few pixels.   python -I _art-src/fix_hair_face.py
"""
import os, zlib
import numpy as np
from PIL import Image
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
NAMES = ['dread-black', 'dread-blonde', 'dread-green', 'dread-red', 'emo-pink1', 'emo-pink2', 'braids-bw', 'rainbow-long']
BROW_Y, CX, HALF_W = 194, 250, 207


def silhouette():
    m = np.zeros((500, 500), bool)
    for f in ('stage4-base.png', 'f-stage4-base.png'):
        a = np.array(Image.open(os.path.join(ROOT, 'faces', f)).convert('RGBA').resize((500, 500), Image.NEAREST))[:, :, 3] > 40
        m |= ndimage.binary_fill_holes(a)
    return ndimage.binary_dilation(m, iterations=3)


def disk(r):
    y, x = np.ogrid[-r:r + 1, -r:r + 1]
    return x * x + y * y <= r * r


def cut_line(name):
    rng = np.random.RandomState(zlib.crc32(name.encode()) & 0xFFFF)
    x = np.arange(500)
    ph = rng.uniform(0, 6.28, 3)
    noise = 6 * np.sin(x / 21 + ph[0]) + 4 * np.sin(x / 9 + ph[1]) + 3 * np.sin(x / 41 + ph[2])
    arch = 54 * ((x - CX) / HALF_W) ** 2 - 32  # a real hairline: high in the middle, hair comes lower at the temples
    return BROW_Y + arch + noise


def hole(sil, name):
    yy = np.arange(500)[:, None]
    m = sil & (yy >= cut_line(name)[None, :])
    # round the top corners without eating the narrow part around the chin
    split = BROW_Y + 110
    top = ndimage.binary_opening(m & (yy < split), structure=disk(20))
    return top | (m & (yy >= split))


def main():
    sil = silhouette()
    for n in NAMES:
        src = os.path.join(HERE, 'hair-orig', f'{n}-hair-base.png')
        im = np.array(Image.open(src).convert('RGBA'))
        h = ndimage.gaussian_filter(hole(sil, n).astype(float), 3)
        f = np.clip((0.75 - h) / 0.5, 0, 1)  # feathered edge; deep inside the face the hair is fully gone
        im[:, :, 3] = (im[:, :, 3] * f).astype(np.uint8)
        Image.fromarray(im, 'RGBA').save(os.path.join(ROOT, 'hair', f'{n}-hair-base.png'), optimize=True)
        print(n, 'ok')


if __name__ == '__main__':
    main()
