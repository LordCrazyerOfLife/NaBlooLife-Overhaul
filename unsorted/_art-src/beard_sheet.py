import sys
from PIL import Image, ImageDraw
import numpy as np

F = r"C:\Users\Mxzzy\Downloads\FreeLife\faces"
OUT = sys.argv[1]
SKIN, HAIR = (224, 172, 130), (60, 40, 25)


def tint(img, rgb):
    a = img.split()[-1]
    solid = Image.new("RGBA", img.size, rgb + (255,))
    solid.putalpha(a)
    return solid


def face(stage, beard=None):
    base = tint(Image.open(f"{F}/stage{stage}-base.png").convert("RGBA"), SKIN)
    if beard is not None:
        base.alpha_composite(tint(beard, HAIR))
    return base


sheet = Image.new("RGBA", (7 * 130, 2 * 145), (200, 215, 230, 255))
d = ImageDraw.Draw(sheet)
for i in range(1, 14):
    b = Image.open(f"{F}/stage4-facial-hair{i}.png").convert("RGBA")
    x, y = ((i - 1) % 7) * 130, ((i - 1) // 7) * 145
    sheet.alpha_composite(face(4, b).resize((125, 125)), (x, y))
    d.text((x + 4, y + 127), f"#{i}", fill=(0, 0, 0, 255))
sheet.save(OUT)

for s in (3, 4, 5):
    a = np.array(Image.open(f"{F}/stage{s}-base.png"))[:, :, 3] > 128
    ys, xs = np.where(a)
    b = np.array(Image.open(f"{F}/stage{s}-facial-hair10.png"))[:, :, 3] > 128
    by, bx = np.where(b)
    print(f"stage{s}: base x{xs.min()}-{xs.max()} y{ys.min()}-{ys.max()} | beard10 x{bx.min()}-{bx.max()} y{by.min()}-{by.max()}")
