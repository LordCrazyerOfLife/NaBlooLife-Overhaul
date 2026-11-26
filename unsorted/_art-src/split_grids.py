from PIL import Image, ImageFilter, ImageOps
import numpy as np, os
from scipy import ndimage

def cutout(rgb, it=6, thr=14):
    a = np.array(rgb)
    mask = a.max(axis=2) > thr
    mask = ndimage.binary_closing(mask, structure=np.ones((5, 5)), iterations=it)
    mask = ndimage.binary_fill_holes(mask)
    mask = ndimage.binary_opening(mask, iterations=1)
    lab, n = ndimage.label(mask)
    if n:
        sizes = ndimage.sum(mask, lab, range(1, n + 1))
        mask = lab == (1 + int(np.argmax(sizes)))
    alpha = np.array(Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6)))
    img = Image.fromarray(np.dstack([a, alpha]), "RGBA")
    return img.crop(img.getbbox())

def fit(img, w, h):
    s = min(w / img.size[0], h / img.size[1])
    return img.resize((max(1, round(img.size[0] * s)), max(1, round(img.size[1] * s))), Image.LANCZOS)

# (archivo, cols, rows, carpeta, prefijo, nombres, caja(w,h))
H = (120, 76)
JOBS = [
 ("_art-src/grids/HONDA.png", 4, 3, "cars", None, ["honda-01-civic-white","honda-02-accord-gray","honda-03-crv-white","honda-04-nsx-red","honda-05-type-r-white","honda-06-pilot-black","honda-07-odyssey-gray","honda-08-fit-white","honda-09-s2000-blue","honda-10-element-tan","honda-11-integra-white","honda-12-sedan-blue"], H),
 ("_art-src/grids/KOENIGSEGG.png", 4, 3, "cars", None, ['koenigsegg-01-jesko-white', 'koenigsegg-02-regera-blue', 'koenigsegg-03-agera-rs-carbon', 'koenigsegg-04-ccx-silver', 'koenigsegg-05-one1-white', 'koenigsegg-06-gemera-green', 'koenigsegg-07-jesko-absolut-white', 'koenigsegg-08-ccxr-blue', 'koenigsegg-09-cc850-red', 'koenigsegg-10-agera-r-gray', 'koenigsegg-11-jesko-attack-purple', 'koenigsegg-12-regera-orange'], H),
 ("_art-src/grids/TOYOTA.png", 4, 3, "cars", None, ["toyota-01-camry-white","toyota-02-corolla-gray","toyota-03-rav4-white","toyota-04-supra-red","toyota-05-tacoma-white","toyota-06-land-cruiser-black","toyota-07-sienna-gray","toyota-08-prius-white","toyota-09-gr-corolla-blue","toyota-10-fj-cruiser-tan","toyota-11-yaris-white","toyota-12-4runner-blue"], H),
 ("_art-src/grids/PLANES.png", 4, 3, "aircraft", None, ["plane-01-airliner-blue","plane-02-airliner-red-stripe","plane-03-bizjet-gold","plane-04-turboprop-navy","plane-05-superjumbo-white","plane-06-bizjet-black-red","plane-07-regional-blue","plane-08-cargo-purple","plane-09-supersonic-white","plane-10-bizjet-navy","plane-11-jumbo-blue","plane-12-bizjet-black"], (300, 200)),
 ("_art-src/grids/CONCESONARIOS.png", 4, 3, "dealers", None, ["mercedes","bmw","ferrari","lamborghini","toyota","ford","chevrolet","honda","audi","porsche","tesla","rolls-royce"], (160, 120)),
 ("_art-src/grids/RELOJES.png", 4, 3, "jewelry", None, [f"watch-{i:02d}-{n}" for i, n in enumerate(["datejust-steel","chrono-gold","octagon-blue","nautilus-rose","skeleton-tonneau","square-roman","diver-black","prx-blue","pilot-chrono","speed-chrono","daydate-green","tank-leather"], 1)], (120, 120)),
 ("_art-src/grids/CUBAN.png", 5, 4, "jewelry", None, [f"cuban-{i:02d}" for i in range(1, 21)], (120, 120)),
 ("_art-src/grids/CASAS.png", 4, 3, "houses", None, [f"mansion-{i:02d}" for i in range(1, 13)], (120, 120)),
 ("_art-src/grids/CASAS2.png", 4, 3, "houses", None, [f"mansion-{i:02d}" for i in range(13, 25)], (120, 120)),
 ("_art-src/grids/CASAS4.png", 4, 3, "houses", None, [f"mansion-{i:02d}" for i in range(25, 37)], (120, 120)),
 ("_art-src/grids/CASAS3.png", 4, 4, "houses", None, [f"home-{i:02d}" for i in range(1, 17)], (120, 120)),
]
def run(root="."):
    made = []
    for path, cols, rows, out, _, names, box in JOBS:
        im = Image.open(os.path.join(root, path)).convert("RGB")
        W, Hh = im.size
        os.makedirs(os.path.join(root, out), exist_ok=True)
        for i, name in enumerate(names):
            c, r = i % cols, i // cols
            cell = im.crop((round(c*W/cols), round(r*Hh/rows), round((c+1)*W/cols), round((r+1)*Hh/rows)))
            img = fit(cutout(cell), *box)
            img = ImageOps.expand(img, border=2, fill=(0, 0, 0, 0))
            dest = os.path.join(root, out, name + ".png")
            img.save(dest, optimize=True); made.append(dest)
    return made
if __name__ == "__main__":
    print(len(run()))
