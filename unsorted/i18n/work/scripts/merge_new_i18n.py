"""Appends the new (2026-11-24) translations to ui.tsv and rules.tsv. Idempotent."""
import glob, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
WORK = os.path.dirname(HERE)
I18N = os.path.dirname(WORK)

UI_FILES = ["new_futbol_ui.tsv", "new_futbol_events.tsv", "new_licenses.tsv",
            "new_casino.tsv", "new_auctions.tsv", "new_misc.tsv", "new_extra_ui.tsv",
            "new_fix.tsv", "new_rest.tsv", "new_futbol_moments1.tsv",
            "new_futbol_moments2.tsv", "new_mods_ui.tsv", "new_last.tsv", "new_zoo_adoption.tsv", "new_mentalhealth.tsv", "new_pending.tsv", "new_rich.tsv", "new_bm.tsv"]
RULE_FILES = ["new_rules.tsv", "new_rules2.tsv", "new_rules3.tsv"]

def rows(path):
    out = []
    for n, line in enumerate(open(path, encoding="utf-8"), 1):
        line = line.rstrip("\n").rstrip("\r")
        if not line.strip() or line.startswith("#"):
            continue
        cols = line.split("\t")
        if len(cols) != 3:
            sys.exit(f"{os.path.basename(path)}:{n}: expected 3 columns, got {len(cols)}: {line!r}")
        out.append(cols)
    return out

def keys_of(path):
    k = set()
    for line in open(path, encoding="utf-8"):
        line = line.rstrip("\n")
        if line.strip() and not line.startswith("#") and "\t" in line:
            k.add(line.split("\t")[0].strip().lower())
    return k

ui_path = os.path.join(I18N, "ui.tsv")
have = keys_of(ui_path)
add_ui, skipped = [], 0
for f in UI_FILES:
    for en, es, pt in rows(os.path.join(WORK, f)):
        k = en.strip().lower()
        if k in have:
            skipped += 1
            continue
        have.add(k)
        add_ui.append((en.strip(), es.strip(), pt.strip()))

existing = open(ui_path, encoding="utf-8").read()
MARK = "## --- new mods & UI (2026-11-24) ---"
with open(ui_path, "a", encoding="utf-8", newline="\n") as fh:
    if add_ui and MARK not in existing:
        fh.write(f"\n{MARK}\n")
    for en, es, pt in add_ui:
        fh.write(f"{en}\t{es}\t{pt}\n")

rules_path = os.path.join(I18N, "rules.tsv")
have_r = {l.split("\t")[0] for l in open(rules_path, encoding="utf-8") if l.strip() and "\t" in l}
add_r, skipped_r = [], 0
for f in RULE_FILES:
    for pat, es, pt in rows(os.path.join(WORK, f)):
        if pat in have_r:
            skipped_r += 1
            continue
        have_r.add(pat)
        add_r.append((pat, es, pt))

with open(rules_path, "a", encoding="utf-8", newline="\n") as fh:
    for pat, es, pt in add_r:
        fh.write(f"{pat}\t{es}\t{pt}\n")

print(f"ui.tsv: +{len(add_ui)} (skipped {skipped} already present)")
print(f"rules.tsv: +{len(add_r)} (skipped {skipped_r} already present)")
