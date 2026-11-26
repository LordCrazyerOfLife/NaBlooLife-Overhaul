import re, io, os

s = io.open("game.html", encoding="utf-8", newline="").read()
blocks = re.findall(r"<script\b[^>]*>(.*?)</script>", s, re.S)
os.makedirs("_chk", exist_ok=True)
for i, b in enumerate(blocks):
    io.open("_chk/b%d.js" % i, "w", encoding="utf-8", newline="\n").write(b)
print(len(blocks), "scripts")
