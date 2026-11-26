#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Instalador idempotente del Mod Loader de NaBlooLife.

Copia el loader, los mods y sus assets desde este repo al juego de NaBlooLife,
y engancha game.html. Correrlo varias veces no duplica archivos ni etiquetas.
"""

import re
import shutil
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent

MODS_VERSION = "16"
LOADER_VERSION = "17"

# archivos que viven en la raíz del repo FreeLife / NaBlooLife
FILES = [
    "modloader.js",
    "mods.js",
    "gang.js",
    "arms.js",
    "politician.js",
    "femboy.js",
    "special-life.js",
    "elite-life.js",
    "vip.js",
    "melon.js",
    "cheat.js",
    "chess.js",
    "chess-engine.js",
    "chess-events.js",
    "chess-puzzles.js",
]

# assets propios que no vienen en el juego base
ASSETS = [
    "special/gangbang.png",
    "special/politician.png",
    "emoji/265f-fe0f.png",
    "emoji/1f485.png",
    "emoji/1f4dd.png",
    "emoji/1f3ce-fe0f.png",
    "emoji/2696-fe0f.png",
    "emoji/1f3a8.png",
    "emoji/1f58d-fe0f.png",
    "emoji/1f46e.png",
]

# se copian enteras: armas nuevas y vehículos de Elite Life
ASSET_DIRS = ["guns", "boats", "aircraft"]


def copy_file(src: Path, dst: Path) -> bool:
    if not src.is_file():
        print(f"  ERROR: no existe {src}")
        return False
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)
    print(f"  Copiado: {dst}")
    return True


def copy_asset_dir(src: Path, dst: Path) -> bool:
    if not src.is_dir():
        print(f"  ERROR: no existe {src}")
        return False
    dst.mkdir(parents=True, exist_ok=True)
    shutil.copytree(src, dst, dirs_exist_ok=True)
    print(f"  Copiado: {dst} (carpeta completa)")
    return True


def hook_game_html(target_dir: Path) -> bool:
    """Quita las etiquetas viejas y las vuelve a poner al final del body."""
    path = target_dir / "game.html"
    if not path.is_file():
        print(f"  ERROR: no existe {path}")
        return False

    content = path.read_text(encoding="utf-8")

    # idempotencia: fuera las etiquetas anteriores, con cualquier versión
    content = re.sub(
        r'[ \t]*<script\s+src="mods\.js(?:\?[^"]*)?"></script>[ \t]*\r?\n?',
        "",
        content,
        flags=re.IGNORECASE,
    )
    content = re.sub(
        r'[ \t]*<script\s+src="modloader\.js(?:\?[^"]*)?"></script>[ \t]*\r?\n?',
        "",
        content,
        flags=re.IGNORECASE,
    )
    content = re.sub(
        r'[ \t]*<script\s+src="(?:elite-life|vip)\.js(?:\?[^"]*)?"></script>[ \t]*\r?\n?',
        "",
        content,
        flags=re.IGNORECASE,
    )

    if "</body>" not in content:
        print(f"  ERROR: {path} no tiene </body>")
        return False

    # NaBlooLife nuevo inyecta el loader solo desde game.html; solo hay que
    # actualizar esa versión. En builds viejos se agrega la etiqueta estática.
    dynamic = re.search(r'(_ml\.src\s*=\s*")modloader\.js\?[^"]*(")', content)
    if dynamic:
        content = re.sub(
            r'(_ml\.src\s*=\s*")modloader\.js\?[^"]*(")',
            rf'\1modloader.js?v={LOADER_VERSION}\2',
            content,
        )
        tags = (
            f'    <script src="mods.js?v={MODS_VERSION}"></script>\n'
            '    <script src="elite-life.js?v=2"></script>\n'
            '    <script src="vip.js?v=2"></script>\n'
        )
        detail = f"mods.js v{MODS_VERSION} + elite/vip + inyección dinámica v{LOADER_VERSION}"
    else:
        tags = (
            f'    <script src="mods.js?v={MODS_VERSION}"></script>\n'
            '    <script src="elite-life.js?v=2"></script>\n'
            '    <script src="vip.js?v=2"></script>\n'
            f'    <script src="modloader.js?v={LOADER_VERSION}"></script>\n'
        )
        detail = f"mods.js v{MODS_VERSION} + modloader.js v{LOADER_VERSION}"

    content = content.replace("</body>", tags + "</body>", 1)
    path.write_text(content, encoding="utf-8")
    print(f"  Enganchado: {detail}")
    return True


def main() -> int:
    if len(sys.argv) < 2:
        print("Uso: python nabloolife/instalar.py <ruta_NaBlooLife>")
        return 1

    target_dir = Path(sys.argv[1]).expanduser().resolve()
    if not target_dir.is_dir():
        print(f"Error: {target_dir} no es un directorio válido")
        return 1

    print("=== Mod Loader NaBlooLife ===")
    print(f"Origen:  {ROOT}")
    print(f"Destino: {target_dir}")

    ok = True
    print("\n-- Archivos JS --")
    for name in FILES:
        ok = copy_file(ROOT / name, target_dir / name) and ok

    print("\n-- Assets --")
    for rel in ASSETS:
        # los assets faltantes no rompen la instalación de los mods
        copy_file(ROOT / rel, target_dir / rel)
    for rel in ASSET_DIRS:
        ok = copy_asset_dir(ROOT / rel, target_dir / rel) and ok

    print("\n-- game.html --")
    ok = hook_game_html(target_dir) and ok

    print("\n=== Instalación completa ===" if ok else "\n=== Instalación con errores ===")
    print("Puedes volver a correrlo sin miedo: es idempotente.")
    return 0 if ok else 1


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    raise SystemExit(main())
