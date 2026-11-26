"""Split the second batch of grids (trophies, Pagani, Ram, jewelry, hair).

Run from the project root:  python -I _art-src/split_grids2.py
Sources live in _art-src/grids/. Output goes to trophies/, cars/, jewelry/ and hair/.
"""
from PIL import Image, ImageFilter, ImageOps
import numpy as np
from scipy import ndimage
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, '_art-src', 'grids')


def cutout(rgb, it=3, thr=14, size=5, keep_all=False, hole_max=None):
    a = np.array(rgb)
    mask = a.max(axis=2) > thr
    mask = ndimage.binary_closing(mask, structure=np.ones((size, size)), iterations=it)
    if hole_max is None:
        mask = ndimage.binary_fill_holes(mask)
    else:
        # fill only SMALL holes: big ones (handles, ring bands) stay transparent
        holes = ndimage.binary_fill_holes(mask) & ~mask
        lab_h, nh = ndimage.label(holes)
        if nh:
            sizes_h = ndimage.sum(holes, lab_h, range(1, nh + 1))
            small = np.isin(lab_h, [i + 1 for i, v in enumerate(sizes_h) if v < hole_max])
            mask = mask | small
    mask = ndimage.binary_opening(mask, iterations=1)
    lab, n = ndimage.label(mask)
    if n and not keep_all:
        sizes = ndimage.sum(mask, lab, range(1, n + 1))
        mask = lab == (1 + int(np.argmax(sizes)))
    alpha = np.array(Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7)))
    img = Image.fromarray(np.dstack([a, alpha]), 'RGBA')
    return img.crop(img.getbbox())


def fit(img, w, h):
    s = min(w / img.size[0], h / img.size[1])
    return img.resize((max(1, round(img.size[0] * s)), max(1, round(img.size[1] * s))), Image.LANCZOS)


def cells(im, cols, rows):
    W, H = im.size
    for i in range(cols * rows):
        c, r = i % cols, i // cols
        yield i, im.crop((round(c * W / cols), round(r * H / rows), round((c + 1) * W / cols), round((r + 1) * H / rows)))


def pad(img, n=2):
    return ImageOps.expand(img, border=n, fill=(0, 0, 0, 0))


TROPHY = {
    'TROPHIES UEFA.png': ['uefa-01-champions-league', 'uefa-02-europa-league', 'uefa-03-conference-league', 'uefa-04-super-cup',
                          'uefa-05-nations-league', 'uefa-06-euro', 'uefa-07-womens-champions-league', 'uefa-08-womens-euro',
                          'uefa-09-futsal-cup', 'uefa-10-youth-cup', 'uefa-11-goalkeeper-statue', 'uefa-12-gold-ball'],
    'trofeos individuales.png': ['award-01-ballon-dor', 'award-02-the-best', 'award-03-uefa-mens-player', 'award-04-golden-boot',
                                 'award-05-golden-glove', 'award-06-kopa-trophy', 'award-07-yashin-trophy', 'award-08-uefa-womens-player',
                                 'award-09-club-world-cup', 'award-10-uefa-young-player', 'award-11-laureus', 'award-12-fair-play'],
    'trofeos internacionales.png': ['intl-01-world-cup', 'intl-02-euro', 'intl-03-copa-america', 'intl-04-africa-cup',
                                    'intl-05-libertadores', 'intl-06-club-world-cup', 'intl-07-confederations-cup', 'intl-08-olympic',
                                    'intl-09-nations-league', 'intl-10-u20-world-cup', 'intl-11-u17-world-cup', 'intl-12-womens-world-cup'],
    'NBA.png': ['nba-01-larry-obrien', 'nba-02-finals-mvp', 'nba-03-mvp', 'nba-04-defensive-player', 'nba-05-rookie-of-the-year',
                'nba-06-sixth-man', 'nba-07-coach-of-the-year', 'nba-08-all-star-mvp', 'nba-09-all-defensive-team',
                'nba-10-scoring-champion', 'nba-11-steals-leader', 'nba-12-blocks-leader'],
}
CARS = {
    'Pagani.png': ['pagani-01-zonda-silver', 'pagani-02-huayra-blue', 'pagani-03-huayra-bc-black', 'pagani-04-huayra-black-gold',
                   'pagani-05-zonda-gray', 'pagani-06-huayra-purple', 'pagani-07-huayra-r-green', 'pagani-08-zonda-black-red',
                   'pagani-09-huayra-navy', 'pagani-10-zonda-r-silver', 'pagani-11-huayra-r-blue', 'pagani-12-imola-black-purple'],
    'Rams.png': ['ram-01-1500-limited-black', 'ram-02-1500-trx-red', 'ram-03-1500-big-horn-gray', 'ram-04-1500-rho-white',
                 'ram-05-1500-rebel-blue', 'ram-06-3500-dually-black', 'ram-07-1500-laramie-red', 'ram-08-1500-night-gray',
                 'ram-09-1500-tradesman-white', 'ram-10-power-wagon-tan', 'ram-11-1500-sport-black', 'ram-12-1500-longhorn-blue'],
}
JEWELS = {
    'joyas.png': ['gem-01-solitaire-ring', 'gem-02-emerald-pendant', 'gem-03-tennis-bracelet', 'gem-04-sapphire-studs',
                  'gem-05-lion-signet', 'gem-06-ruby-halo-ring', 'gem-07-pearl-bracelet', 'gem-08-heart-pendant',
                  'gem-09-diamond-watch', 'gem-10-sapphire-gold-ring', 'gem-11-drop-earrings', 'gem-12-gold-bangle'],
    'joyas ancestrales.png': ['anc-01-falcon-collar', 'anc-02-royal-crown', 'anc-03-lapis-seal-ring', 'anc-04-jade-mask-pendant',
                              'anc-05-lion-cuff', 'anc-06-ruby-pearl-brooch', 'anc-07-coin-necklace', 'anc-08-emerald-ring',
                              'anc-09-pearl-collar', 'anc-10-lion-bangle', 'anc-11-ruby-brooch', 'anc-12-dragon-cuff'],
}
HAIRS = {
    'MAS PELOS.png': [f'nh{i:02d}' for i in range(1, 13)],
    'Nuevoa cabellos.png': [f'nh{i:02d}' for i in range(13, 25)],
}


def run():
    made = []
    for f, names in TROPHY.items():
        im = Image.open(os.path.join(SRC, f)).convert('RGB')
        os.makedirs(os.path.join(ROOT, 'trophies'), exist_ok=True)
        for i, cell in cells(im, 4, 3):
            out = pad(fit(cutout(cell, it=4, size=5, hole_max=2500), 104, 120))
            dest = os.path.join(ROOT, 'trophies', names[i] + '.png')
            out.save(dest, optimize=True)
            made.append(dest)
    for f, names in CARS.items():
        im = Image.open(os.path.join(SRC, f)).convert('RGB')
        for i, cell in cells(im, 4, 3):
            out = pad(fit(cutout(cell, it=6, size=5), 120, 76))
            dest = os.path.join(ROOT, 'cars', names[i] + '.png')
            out.save(dest, optimize=True)
            made.append(dest)
    for f, names in JEWELS.items():
        im = Image.open(os.path.join(SRC, f)).convert('RGB')
        for i, cell in cells(im, 4, 3):
            out = pad(fit(cutout(cell, it=4, size=5, hole_max=2500, keep_all=(names[i] in ('gem-04-sapphire-studs', 'gem-11-drop-earrings'))), 120, 120))
            dest = os.path.join(ROOT, 'jewelry', names[i] + '.png')
            out.save(dest, optimize=True)
            made.append(dest)
    # hair: one full-colour 500x500 layer, placed on the head like the other pack hairs
    for f, names in HAIRS.items():
        im = Image.open(os.path.join(SRC, f)).convert('RGB')
        for i, cell in cells(im, 4, 3):
            hair = cutout(cell, it=3, thr=9, size=5)
            w = 452
            hair = hair.resize((w, max(1, round(hair.size[1] * w / hair.size[0]))), Image.LANCZOS)
            canvas = Image.new('RGBA', (500, 500), (0, 0, 0, 0))
            canvas.alpha_composite(hair.crop((0, 0, w, min(hair.size[1], 494))), (24, 4))
            dest = os.path.join(ROOT, 'hair', names[i] + '-hair-base.png')
            canvas.save(dest, optimize=True)
            made.append(dest)
    return made


if __name__ == '__main__':
    print(len(run()), 'images')
