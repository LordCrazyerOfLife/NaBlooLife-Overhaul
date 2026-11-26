"""Mirror the Free Life web build locally for personal offline modding.
Usage: python -I fl_download.py <out_dir>
"""
import json, os, re, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor

BASE = "https://html-classic.itch.zone/html/20222767/"
OUT = os.path.abspath(sys.argv[1])
UA = {"User-Agent": "Mozilla/5.0"}


def get(rel):
    req = urllib.request.Request(BASE + rel, headers=UA)
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.read()


def save(rel, data):
    rel = rel.split("?")[0]
    path = os.path.normpath(os.path.join(OUT, rel))
    if not path.startswith(OUT + os.sep):  # never write outside OUT
        raise ValueError(f"unsafe path: {rel}")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(data)


# 1) HTML + service worker
game = get("game.html")
save("game.html", game)
for rel in ("index.html", "sw.js", "packs/index.json"):
    save(rel, get(rel))

# 2) Scripts: everything referenced as *.js, crawled transitively
JS_RE = re.compile(rb'["\'`(=]\s*([A-Za-z0-9_\-/]+\.js)(?:\?[^"\'`\s)]*)?')
seen, queue, failed = set(), [], []


def enqueue(blob):
    for m in JS_RE.finditer(blob):
        rel = m.group(1).decode()
        if rel not in seen and not rel.startswith(("http", "/")) and rel != "sw.js":
            seen.add(rel)
            queue.append(rel)


enqueue(game)
while queue:
    rel = queue.pop()
    try:
        data = get(rel)
    except Exception as e:  # dynamic/false-positive names just 404
        failed.append((rel, str(e)))
        continue
    save(rel, data)
    enqueue(data)
print(f"scripts: {len(seen) - len(failed)} ok, {len(failed)} not found")

# 3) Unpack assets from packs/*.bin using index.json [pack, offset, length]
idx = json.loads(open(os.path.join(OUT, "packs", "index.json"), "rb").read())
by_pack = {}
for key, (p, off, ln) in idx["f"].items():
    by_pack.setdefault(p, []).append((key, off, ln))


def unpack(p):
    blob = get("packs/" + idx["p"][p])
    for key, off, ln in by_pack.get(p, []):
        save(key, blob[off:off + ln])
    return len(by_pack.get(p, []))


with ThreadPoolExecutor(6) as ex:
    total = sum(ex.map(unpack, range(len(idx["p"]))))
print(f"assets: {total} unpacked")

# 4) Play straight from files: drop the "no service worker -> index.html" redirect
g = open(os.path.join(OUT, "game.html"), "rb").read()
g2 = g.replace(b'"serviceWorker"in navigator&&!navigator.serviceWorker.controller&&location.replace("index.html"),', b"")
open(os.path.join(OUT, "game.html"), "wb").write(g2)
print("redirect patched:", g != g2)
