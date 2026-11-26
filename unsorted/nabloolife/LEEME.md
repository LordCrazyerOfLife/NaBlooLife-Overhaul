# Mod Loader NaBlooLife

Instala en NaBlooLife los mods de YourLife sin duplicar scripts ni parchear a mano:

- **Chess Career** (`chess.js` + motor, puzzles y eventos)
- **Gang Bang** (`gang.js` + vendedores de armas y assets)
- **Political Career** (`politician.js`)
- **Special Life** (`special-life.js`): piloto de carreras ilegales con heat nacional, juez con evidencia/sobornos/represalias y artista con lienzo dibujable y galería en `localStorage`
- **Elite Life** (`elite-life.js`): tiendas de botes/yates, aviones y helicópteros en Shopping, con compra, marina/hangar en Assets, mantenimiento anual y venta
- **VIP Everything** (`vip.js`): desbloquea todos los packs y objetos premium con un interruptor dentro de Main Menu → VIP Everything; se puede volver a bloquear sin recargar
- **Femboy Journey** (`femboy.js`): 12 eventos para que un amigo hombre adulto explore su lado femenino, cambie de nombre, salga del armario, haga transición y hasta intente seducirte
- **Melon** (`melon.js`): medidores de brutalidad/disfraz y vida híbrida
- **Cheat Menu** (`cheat.js`): panel de trampas flotante

## Instalación

```bash
python nabloolife/instalar.py "C:\ruta\NaBlooLife"
```

El instalador:

1. Copia `modloader.js`, `mods.js` y los JS de los mods a la raíz del juego.
2. Copia los assets propios: emojis de los mods, `guns/`, `boats/` y `aircraft/`.
3. Engancha `game.html` con `mods.js`, `elite-life.js` y `vip.js`; si el build ya inyecta el loader solo, actualiza esa inyección a la versión nueva. Si no, agrega también `modloader.js` al final del `<body>`.

Es **idempotente**: si lo corres otra vez, reemplaza los archivos y vuelve a dejar solo esas dos etiquetas, sin duplicarlas.

## Uso

- Abre **Main Menu → Mods → Mod Loader**.
- Ahí puedes encender o apagar cada mod. El estado se guarda en `localStorage` (`modloader-enabled`).
- Los cambios se aplican la próxima vez que cargue el juego.
- Los mods aparecen en **Occupation → Special Careers**.

## Compatibilidad con `mods.js`

`mods.js` ya trae los códigos:

- `13131313` → Gang Bang
- `17760704` → Political Career
- `14141414` → Femboy Journey
- `11111111` → Mod Loader

Chess Career se carga desde **Mod Loader**, no desde un código, para que no salga duplicado.

No hace falta escribir ningún código de 8 dígitos: el loader los carga solo.

## Desarrollo

Para agregar un mod nuevo:

1. Agrega su entrada en `MODS` dentro de `modloader.js` (en la raíz del repo).
2. Agrega el archivo a `FILES` en `nabloolife/instalar.py` si el mod tiene un JS propio.
3. Si usa assets nuevos, agrégalos a `ASSETS` o `ASSET_DIRS`.
4. Vuelve a correr el instalador.

---

**Notas:**

- El loader bueno es el de la raíz (`modloader.js`), no el viejo duplicado que había en esta carpeta.
- `game.html` solo necesita las etiquetas de `mods.js`, `elite-life.js`, `vip.js` y, si aplica, `modloader.js`; no edites los mods a mano ahí.
