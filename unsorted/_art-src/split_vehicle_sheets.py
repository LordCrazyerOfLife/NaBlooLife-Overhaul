from PIL import Image, ImageFilter, ImageOps
import numpy as np
from scipy import ndimage
import os, shutil

SHEETS = [
    {
        "path": "_art-src/vehicle-sheets/CARROS EXOTICOS.png",
        "out": "cars",
        "close_iter": 6,
        "names": [
            "exotic-01-urus-green", "exotic-02-giulia-white", "exotic-03-458-red", "exotic-04-gtr-gray",
            "exotic-05-ghost-black", "exotic-06-mclaren-blue", "exotic-07-chiron-gold", "exotic-08-gt3rs-white",
            "exotic-09-r8-white", "exotic-10-vantage-green", "exotic-11-challenger-black", "exotic-12-huracan-purple",
        ],
    },
    {
        "path": "_art-src/vehicle-sheets/CARROS MODESTOS.png",
        "out": "cars",
        "close_iter": 6,
        "names": [
            "modest-01-k5-white", "modest-02-accord-blue", "modest-03-sonata-gray", "modest-04-altima-white",
            "modest-05-3series-blue", "modest-06-mazda6-red", "modest-07-camry-silver", "modest-08-civic-white",
            "modest-09-corolla-gray", "modest-10-sentra-white", "modest-11-accord-blue", "modest-12-k5-red",
        ],
    },
    {
        "path": "_art-src/vehicle-sheets/ferraris.png",
        "out": "cars",
        "close_iter": 6,
        "names": [
            "ferrari-01-458-red", "ferrari-02-f8-yellow", "ferrari-03-488-pista-red", "ferrari-04-812-gray",
            "ferrari-05-f430-red", "ferrari-06-458-speciale-white", "ferrari-07-laferrari-red", "ferrari-08-488-spider-blue",
            "ferrari-09-sf90-yellow", "ferrari-10-enzo-black", "ferrari-11-testarossa-red", "ferrari-12-308-white",
        ],
    },
    {
        "path": "_art-src/vehicle-sheets/Cadillac.png",
        "out": "cars",
        "close_iter": 6,
        "names": [
            "cadillac-01-ct5-black", "cadillac-02-ct4-white", "cadillac-03-escalade-black", "cadillac-04-ct5-silver",
            "cadillac-05-ct6-blue", "cadillac-06-escalade-white", "cadillac-07-ct5-burgundy", "cadillac-08-escalade-black",
            "cadillac-09-ct4-white", "cadillac-10-ct5-gray", "cadillac-11-ct6-gold", "cadillac-12-xt4-white",
        ],
    },
    {
        "path": "_art-src/vehicle-sheets/Mercedes.png",
        "out": "cars",
        "close_iter": 6,
        "names": [
            "mercedes-01-amg-gt-silver", "mercedes-02-g-class-black", "mercedes-03-c-class-white", "mercedes-04-amg-gt-red",
            "mercedes-05-amg-gt-green", "mercedes-06-c-class-blue", "mercedes-07-s-class-black", "mercedes-08-gle-white",
            "mercedes-09-amg-gt-purple", "mercedes-10-a-class-lime", "mercedes-11-sl-gray", "mercedes-12-metris-gold",
        ],
    },
    {
        "path": "_art-src/vehicle-sheets/MOTOS.png",
        "out": "bikes",
        "names": [
            "sportbike-01-ducati-red", "sportbike-02-yamaha-blue", "sportbike-03-bmw-black", "sportbike-04-kawasaki-green",
            "sportbike-05-suzuki-white", "sportbike-06-ktm-orange", "sportbike-07-honda-red", "sportbike-08-aprilia-black",
            "sportbike-09-triumph-black", "sportbike-10-bmw-white", "sportbike-11-mvagusta-red", "sportbike-12-ktm-black",
        ],
    },
    {
        "path": "_art-src/vehicle-sheets/heliocopters.png",
        "out": "aircraft",
        "cols": 3,
        "rows": 4,
        "names": [
            "heli-01-blackhawk-black", "heli-02-police-white", "heli-03-lifeflight-red", "heli-04-fbi-black",
            "heli-05-news-blue", "heli-06-apache-military", "heli-07-corporate-black", "heli-08-air-ambulance-red",
            "heli-09-corporate-green", "heli-10-klm-blue", "heli-11-airbus-black", "heli-12-netjets-white",
        ],
    },
    {
        "path": "_art-src/vehicle-sheets/BARCOS.png",
        "out": "boats",
        "names": [
            "ship-01-cruise", "ship-02-container", "ship-03-offshore", "ship-04-navy",
            "ship-05-superyacht-black", "ship-06-superyacht-white", "ship-07-superyacht-gold", "ship-08-superyacht-blue",
            "ship-09-speedboat", "ship-10-sport-yacht", "ship-11-fishing-yacht", "ship-12-catamaran",
        ],
    },
]

def cutout(rgb, close_iter=3):
    a = np.array(rgb)
    mask = a.max(axis=2) > 14
    struct = np.ones((5, 5)) if close_iter >= 6 else np.ones((3, 3))
    mask = ndimage.binary_closing(mask, structure=struct, iterations=close_iter)
    mask = ndimage.binary_fill_holes(mask)
    mask = ndimage.binary_opening(mask, iterations=1)
    lab, n = ndimage.label(mask)
    if n:
        sizes = ndimage.sum(mask, lab, range(1, n + 1))
        mask = lab == (1 + int(np.argmax(sizes)))
    alpha = (mask * 255).astype(np.uint8)
    alpha = np.array(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.5)))
    img = Image.fromarray(np.dstack([a, alpha]), "RGBA")
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        img = ImageOps.expand(img, border=5, fill=(0, 0, 0, 0))
    return img

made = []
for sheet in SHEETS:
    im = Image.open(sheet["path"]).convert("RGB")
    W, H = im.size
    cols = sheet.get("cols", 4)
    rows = sheet.get("rows", 3)
    assert W % cols == 0
    for i, name in enumerate(sheet["names"]):
        col, row = i % cols, i // cols
        x0, x1 = round(col * W / cols), round((col + 1) * W / cols)
        y0, y1 = round(row * H / rows), round((row + 1) * H / rows)
        out = cutout(im.crop((x0, y0, x1, y1)), sheet.get("close_iter", 3))
        dest = os.path.join(sheet["out"], name + ".png")
        out.save(dest, optimize=True)
        made.append((dest, out.size))

print(f"generated {len(made)} images")
for d, s in made:
    print(d, s)

src = "_art-src/vehicle-sheets"
os.makedirs(src, exist_ok=True)
# source sheets are already archived under _art-src/vehicle-sheets
