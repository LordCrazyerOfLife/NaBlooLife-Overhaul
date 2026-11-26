"""Mutton chops: patillas gruesas que bajan por la quijada y se unen al bigote, barbilla afeitada.
Salida: stage{3,4,5}-facial-hair14.png (silueta blanca, 250x250, como las del juego) + barba-preview.png."""
import sys
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

F = r"C:\Users\Mxzzy\Downloads\FreeLife\faces"
OUT = sys.argv[1]
S = 4  # supersampling


def mirror(pts):
    return [(250 - x, y) for x, y in pts]


# Mitad izquierda, en coordenadas de 250x250 (en sentido horario desde la patilla junto a la oreja).
LEFT = [
    (43, 116), (46, 109), (52, 107), # punta redondeada de la patilla, delante de la oreja
    (56, 112), (59, 140), (64, 160), # borde interno de la patilla bajando por la mejilla
    (74, 176), (88, 186),            # se curva hacia la comisura
    (104, 185), (118, 186),          # borde de arriba del bigote
    (125, 189),                      # muesca del philtrum (centro)
]
LEFT_BOTTOM = [
    (125, 197), (112, 198),          # borde de abajo del bigote
    (100, 201), (95, 208),           # la chuleta baja junto a la boca
    (94, 218), (86, 226),            # punta de la chuleta, sin tocar la barbilla
    (70, 232), (50, 205),            # vuelve por la quijada (recortada por la cara)
    (44, 182), (42, 150),            # borde externo: pegado a la cara, sin tapar la oreja
]


def chops_polygon():
    # izq-arriba -> der-arriba -> der-abajo -> izq-abajo
    right_top = mirror(LEFT[:-1])[::-1]
    poly = LEFT + right_top + list(reversed(mirror(LEFT_BOTTOM[1:]))) + LEFT_BOTTOM
    return [(x * S, y * S) for x, y in poly]


def make(stage):
    base = Image.open(f"{F}/stage{stage}-base.png").convert("RGBA")
    face_a = base.split()[-1].resize((250 * S, 250 * S), Image.LANCZOS)
    m = Image.new("L", (250 * S, 250 * S), 0)
    ImageDraw.Draw(m).polygon(chops_polygon(), fill=255)
    m = m.filter(ImageFilter.GaussianBlur(S * 0.6))
    # Solo dentro de la cara, y encogido 1px para no salirse del contorno
    face_in = face_a.filter(ImageFilter.MinFilter(2 * S + 1))
    alpha = Image.fromarray(np.minimum(np.array(m), np.array(face_in)).astype("uint8"))
    alpha = alpha.resize((250, 250), Image.LANCZOS)
    out = Image.new("RGBA", (250, 250), (255, 255, 255, 0))
    out.putalpha(alpha)
    return out


def tint(img, rgb):
    t = Image.new("RGBA", img.size, rgb + (255,))
    t.putalpha(img.split()[-1])
    return t


layers = {s: make(s) for s in (3, 4, 5)}
for s, img in layers.items():
    img.save(f"{OUT}/stage{s}-facial-hair14.png")

# Preview: etapas 3/4/5 con distintos colores de piel/pelo, más la silueta blanca cruda
combos = [((224, 172, 130), (60, 40, 25)), ((141, 85, 54), (20, 14, 10)), ((250, 214, 185), (190, 110, 50))]
prev = Image.new("RGBA", (4 * 260, 300), (205, 218, 232, 255))
d = ImageDraw.Draw(prev)
for i, (s, (skin, hair)) in enumerate(zip((3, 4, 5), combos)):
    f = tint(Image.open(f"{F}/stage{s}-base.png").convert("RGBA"), skin)
    f.alpha_composite(tint(layers[s], hair))
    prev.alpha_composite(f, (i * 260 + 5, 10))
    d.text((i * 260 + 10, 268), f"stage{s} (edad {['joven', 'adulto', 'viejo'][i]})", fill=(0, 0, 0, 255))
raw = Image.new("RGBA", (250, 250), (40, 40, 40, 255))
raw.alpha_composite(layers[4])
prev.alpha_composite(raw, (3 * 260 + 5, 10))
d.text((3 * 260 + 10, 268), "capa cruda (blanco = barba)", fill=(0, 0, 0, 255))
prev.save(f"{OUT}/barba-preview.png")
print("ok")
