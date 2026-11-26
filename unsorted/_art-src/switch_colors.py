"""Genera variantes de glock-switch.html con el switch de colores. Uso: python switch_colors.py <dir>"""
import sys

D = sys.argv[1]
src = open(rf"{D}\glock-switch.html", encoding="utf-8").read()

OLD_BODY = '<rect x="31" y="35" width="9" height="20" rx="2.5" fill="#2a2c31" stroke="#0b0c0e" stroke-width="1.6"/>'
OLD_LEVER = '<rect x="26" y="41" width="7" height="6" rx="1.5" fill="#3d4047" stroke="#0b0c0e" stroke-width="1.2"/>'
OLD_SHINE = '<path d="M33 38 L33 52" stroke="#6b6f78" stroke-width="1" opacity=".7"/>'
assert OLD_BODY in src and OLD_LEVER in src and OLD_SHINE in src, "no encontré el switch en glock-switch.html"

# nombre: (base, palanca más clara, brillo)
COLORS = {
    "red": ("#d62828", "#f05454", "#ffb3b3"),
    "blue": ("#1f6fd6", "#4a92f0", "#b8d6ff"),
    "green": ("#1f9e45", "#3fc566", "#b6f0c6"),
    "gold": ("#c99a1c", "#f0c23f", "#fff0b3"),
    "pink": ("#e0459b", "#f479bd", "#ffd0e9"),
    "purple": ("#7a3fd1", "#9d6af0", "#dccbff"),
    "orange": ("#ec6a12", "#ff9440", "#ffd6b3"),
    "white": ("#d9dce2", "#f4f5f8", "#ffffff"),
}

for name, (base, lever, shine) in COLORS.items():
    html = (
        src.replace(OLD_BODY, OLD_BODY.replace('fill="#2a2c31"', f'fill="{base}"'))
        .replace(OLD_LEVER, OLD_LEVER.replace('fill="#3d4047"', f'fill="{lever}"'))
        .replace(OLD_SHINE, OLD_SHINE.replace('stroke="#6b6f78"', f'stroke="{shine}"').replace('opacity=".7"', 'opacity=".9"'))
    )
    open(rf"{D}\gs-{name}.html", "w", encoding="utf-8").write(html)
print(" ".join(COLORS))
