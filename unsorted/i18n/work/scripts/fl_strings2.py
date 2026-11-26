"""Collect prose strings for spellchecking, skipping word/name list files."""
import json, re, os, sys

src, out_path = sys.argv[1], sys.argv[2]
SKIP = {"zxcvbn.js", "wiki-words.js", "gamertags.js", "social-names.js", "random-names.js", "names.js",
        "country-names.js", "cities.js", "email-pool.js"}
STR = re.compile(r'"((?:[^"\\\n]|\\.){3,})"|\'((?:[^\'\\\n]|\\.){3,})\'|`((?:[^`\\]|\\.){3,})`', re.S)
out = {}
for dp, _, fs in os.walk(src):
    for fn in fs:
        if not fn.endswith((".js", ".html")) or fn in SKIP:
            continue
        t = open(os.path.join(dp, fn), encoding="utf-8", errors="replace").read()
        for m in STR.finditer(t):
            s = next(g for g in m.groups() if g is not None)
            if not re.search(r"[a-z]{2,} [a-z]", s):
                continue
            if len(s.split()) > 60 and s.count(".") < 2 and s.count(",") < 2:
                continue  # bare word lists
            out.setdefault(s, fn)
json.dump(sorted(out), open(out_path, "w", encoding="utf-8"))
json.dump(out, open(out_path.replace(".json", "_files.json"), "w", encoding="utf-8"))
print(len(out))
