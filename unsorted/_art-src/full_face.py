"""Cara completa con la barba nueva, apilando las capas en el mismo orden que composeFace (game.html:13257)."""
import os
import sys
from PIL import Image, ImageDraw

F = r"C:\Users\Mxzzy\Downloads\FreeLife\faces"
BEARD_DIR, OUT = sys.argv[1], sys.argv[2]


def layer(name):
    p = os.path.join(F, name + ".png")
    if not os.path.exists(p):
        p = os.path.join(BEARD_DIR, name + ".png")
    return Image.open(p).convert("RGBA") if os.path.exists(p) else None


def tint(img, rgb):
    # Igual que el juego: se pinta el color encima respetando el alpha de la capa (source-atop).
    t = Image.new("RGBA", img.size, rgb + (255,))
    t.putalpha(img.split()[-1])
    return t


def shade(rgb, k):
    return tuple(round(c * k) for c in rgb)


def compose(stage, skin, eyes, hair, brow, cut, mood="happy"):
    light = f"lighting-{mood}" if layer(f"stage{stage}-lighting-{mood}") else (
        "lighting-happy" if mood == "happy" else "lighting-angry-sad")
    stack = [
        (f"stage{stage}-base", skin),
        (f"stage{stage}-eye-base", None),
        (f"stage{stage}-iris-base", eyes),
        (f"stage{stage}-iris-lighting", None),
        (f"stage{stage}-{light}", None),
        (f"stage{stage}-eyebrows-{mood}{brow}", shade(hair, 0.8)),
        (f"stage{stage}-facial-hair14", hair),
        (f"stage{stage}-hair-base{cut}", hair),
        (f"stage{stage}-hair-lighting{cut}", None),
    ]
    out = Image.new("RGBA", (250, 250), (0, 0, 0, 0))
    missing = []
    for name, color in stack:
        img = layer(name)
        if img is None:
            missing.append(name)
            continue
        out.alpha_composite(tint(img, color) if color else img)
    return out, missing


looks = [
    # (stage, piel, ojos, pelo, cejas, corte, emoción, etiqueta)
    (4, (224, 172, 130), (70, 110, 60), (60, 40, 25), 5, 12, "happy", "adulto · castano"),
    (4, (141, 85, 54), (70, 45, 25), (20, 14, 10), 3, 30, "angry", "adulto · negro · enojado"),
    (3, (250, 214, 185), (60, 120, 190), (190, 110, 50), 3, 7, "happy", "joven · pelirrojo"),
    (5, (230, 190, 160), (90, 90, 90), (200, 200, 200), 2, 4, "sad", "viejo · canoso · triste"),
]
W = 300
sheet = Image.new("RGBA", (W * len(looks), W + 30), (205, 218, 232, 255))
d = ImageDraw.Draw(sheet)
for i, (st, skin, eyes, hair, brow, cut, mood, label) in enumerate(looks):
    face, missing = compose(st, skin, eyes, hair, brow, cut, mood)
    if missing:
        print("faltan capas:", missing)
    sheet.alpha_composite(face.resize((W - 10, W - 10), Image.LANCZOS), (i * W + 5, 5))
    d.text((i * W + 10, W + 8), label, fill=(0, 0, 0, 255))
sheet.save(OUT)
print("ok")
