#!/usr/bin/env python
"""Actualiza los precios de cars.js con precios reales (MSRP, USD).

Uso:
  python update_car_prices.py --missing          # lista los carros que no estan en car_prices.json
  python update_car_prices.py                    # dry-run: muestra los cambios, no escribe nada
  python update_car_prices.py --apply            # escribe cars.js (backup en _art-src/cars.js.bak-prices)
  python update_car_prices.py --fetch            # intenta buscar los que faltan en la web (ver nota)

Fuente de verdad: car_prices.json  ->  {"Toyota Camry": 28400, "Ford Bronco": 39630, ...}
Cambia el precio base en window.CARS / LUXURY_CARS (4to campo de cada fila) y en REAL_CAR_PRICES.
Sanity check: un precio nuevo fuera de 0.25x-4x del actual se rechaza (casi seguro es basura).

NOTA sobre --fetch: DuckDuckGo y Bing bloquean bots (captcha), asi que la busqueda web es
best-effort: usa la API de Wikipedia/Wikidata si hay precio y, si no, deja el carro en "missing".
Lo confiable es llenar car_prices.json (a mano o con Claude + WebSearch) y correr --apply.
"""
import argparse, io, json, os, re, shutil, sys, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.abspath(__file__))
CARS_JS = os.path.join(ROOT, "cars.js")
PRICES = os.path.join(ROOT, "car_prices.json")
BACKUP = os.path.join(ROOT, "_art-src", "cars.js.bak-prices")
ROW = re.compile(r'\["([^"]+)", "([^"]+)", "(\w+|4x4)", ([\d.e]+)((?:, "[^"]+", "\w+")?)\]')
REAL = re.compile(r'("([^"]+)": )([\d.e]+)(,?)')


def num(x):
    return float(x)


def fmt(n):
    return str(int(round(n)))


def load_prices():
    if not os.path.exists(PRICES):
        return {}
    with io.open(PRICES, encoding="utf-8") as f:
        return {k: v for k, v in json.load(f).items() if not k.startswith("_")}


def sections(s):
    """(inicio, fin) de los bloques de CARS, LUXURY_CARS y REAL_CAR_PRICES."""
    def span(a, b):
        i = s.index(a)
        return i, s.index(b, i)
    return (span("window.CARS = [", "window.EXTENDED_CARS"),
            span("window.LUXURY_CARS = [", "window.REAL_CAR_PRICES"),
            span("window.REAL_CAR_PRICES = {", "window.CAR_FROM"))


def fetch_one(name):
    """Best-effort: Wikidata no guarda MSRP de forma fiable; solo devuelve algo si hay una
    propiedad 'price' (P2284). Casi siempre devuelve None -> el carro queda en missing."""
    try:
        q = urllib.parse.urlencode({"action": "wbsearchentities", "search": name, "language": "en",
                                    "format": "json", "limit": 1})
        req = urllib.request.Request("https://www.wikidata.org/w/api.php?" + q,
                                     headers={"User-Agent": "car-price-updater/1.0"})
        d = json.load(urllib.request.urlopen(req, timeout=15))
        if not d.get("search"):
            return None
        qid = d["search"][0]["id"]
        req = urllib.request.Request(f"https://www.wikidata.org/wiki/Special:EntityData/{qid}.json",
                                     headers={"User-Agent": "car-price-updater/1.0"})
        claims = json.load(urllib.request.urlopen(req, timeout=15))["entities"][qid]["claims"]
        for c in claims.get("P2284", []):
            v = c["mainsnak"]["datavalue"]["value"]
            if v.get("unit", "").endswith("Q4917"):  # USD
                return float(v["amount"])
    except Exception:
        pass
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--missing", action="store_true")
    ap.add_argument("--fetch", action="store_true")
    a = ap.parse_args()

    s = io.open(CARS_JS, encoding="utf-8", newline="").read()
    prices = load_prices()
    (c0, c1), (l0, l1), (r0, r1) = sections(s)

    names = {}
    for lo, hi in ((c0, c1), (l0, l1)):
        for m in ROW.finditer(s[lo:hi]):
            names.setdefault(f"{m[1]} {m[2]}", num(m[4]))

    missing = [n for n in names if n not in prices]
    if a.fetch:
        for n in missing:
            p = fetch_one(n)
            if p:
                prices[n] = p
                print(f"  fetch  {n}: {fmt(p)}")
        with io.open(PRICES, "w", encoding="utf-8") as f:
            json.dump(prices, f, indent=1, ensure_ascii=False)
        missing = [n for n in names if n not in prices]
    if a.missing:
        print(f"{len(missing)} sin precio en car_prices.json:")
        print("\n".join(missing))
        return

    changes, rejected = [], []

    def ok(name, cur, new):
        if not (0.25 * cur <= new <= 4 * cur):
            rejected.append((name, cur, new))
            return False
        return True

    def sub_row(m):
        name = f"{m[1]} {m[2]}"
        new = prices.get(name)
        if new is None or not ok(name, num(m[4]), new):
            return m[0]
        if round(num(m[4])) != round(new):
            changes.append((name, num(m[4]), new))
        return f'["{m[1]}", "{m[2]}", "{m[3]}", {fmt(new)}{m[5]}]'

    def sub_real(m):
        new = prices.get(m[2])
        if new is None or not ok(m[2], num(m[3]), new):
            return m[0]
        return f"{m[1]}{fmt(new)}{m[4]}"

    out = (s[:c0] + ROW.sub(sub_row, s[c0:c1]) + s[c1:l0]
           + ROW.sub(sub_row, s[l0:l1]) + s[l1:r0] + REAL.sub(sub_real, s[r0:r1]) + s[r1:])

    for n, old, new in changes:
        print(f"  {n:34s} {fmt(old):>9s} -> {fmt(new):>9s}")
    for n, old, new in rejected:
        print(f"  RECHAZADO {n}: {fmt(old)} -> {fmt(new)} (fuera de rango)")
    print(f"{len(changes)} cambios, {len(rejected)} rechazados, {len(missing)} sin precio.")
    if a.apply and out != s:
        os.makedirs(os.path.dirname(BACKUP), exist_ok=True)
        shutil.copy(CARS_JS, BACKUP)
        io.open(CARS_JS, "w", encoding="utf-8", newline="").write(out)
        print("cars.js actualizado. Sube el ?v= de cars.js en game.html pa saltarte el cache.")
    elif not a.apply:
        print("(dry-run: usa --apply pa escribir)")


if __name__ == "__main__":
    sys.exit(main())
