import struct, sys, glob, os

def ihdr(path):
    with open(path, "rb") as f:
        head = f.read(33)
    if head[:8] != b"\x89PNG\r\n\x1a\n":
        return None
    w, h = struct.unpack(">II", head[16:24])
    bit, ctype = head[24], head[25]
    return w, h, bit, ctype

def alpha_info(path):
    try:
        from PIL import Image
    except Exception:
        return "sin PIL"
    im = Image.open(path).convert("RGBA")
    px = im.getdata()
    total = len(px)
    op = sum(1 for p in px if p[3] > 8)
    return f"opacos {100.0*op/total:.1f}% bbox={im.getchannel('A').getbbox()}"

files = sys.argv[1:]
if not files:
    files = sorted(glob.glob("guns/*.png")) + sorted(glob.glob("guns/attachments/*.png")) + sorted(glob.glob("guns/glock-parts/*.png"))

for p in files:
    info = ihdr(p)
    size = os.path.getsize(p)
    if not info:
        print(f"{p}: NO ES PNG ({size} bytes)")
        continue
    w, h, bit, ctype = info
    print(f"{p}: {w}x{h} bit={bit} ctype={ctype} {size}B | {alpha_info(p)}")
