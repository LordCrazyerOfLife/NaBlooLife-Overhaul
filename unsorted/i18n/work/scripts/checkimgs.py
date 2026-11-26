import re, os, glob

files = ["arms.js", "gang.js", "mods.js", "modloader.js"]
pat = re.compile(r"[\"']((?:guns|splash|icons?|img)[^\"']*?\.(?:png|jpg|jpeg|webp))(?:\?v=\d+)?[\"']", re.I)

seen = {}
for f in files:
    if not os.path.exists(f):
        continue
    for m in pat.finditer(open(f, encoding="utf-8", errors="replace").read()):
        seen.setdefault(m.group(1), set()).add(f)

missing, ok = [], []
for p, where in sorted(seen.items()):
    (ok if os.path.exists(p) else missing).append((p, ", ".join(sorted(where))))

print(f"referencias distintas: {len(seen)} | existen: {len(ok)} | FALTAN: {len(missing)}")
for p, w in missing:
    print(f"  FALTA  {p}   <- {w}")
for p, w in ok:
    print(f"  ok     {p}   <- {w}")
