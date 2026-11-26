# YourLife: contexto del proyecto (handoff)

> Última actualización: 2026-11-24 (sesión 5: Mental Health, fútbol, grids). Léelo completo antes de tocar nada.
>
> **Resumen de dónde estamos:** (1) traducción ES/PT del juego **terminada** (45,952 líneas) con una segunda pasada
> de calidad pendiente; (2) **freebuff** conectado (opencode gratis) y probado; (3) tres mods propios hechos desde
> cero: **Chess Career** (`64646464`), **Gang Bang** (`13131313`) y arte nuevo (barba, armas, bandana);
> (4) **ACTUALIZADO 2026-11-25: el usuario es el dueño del juego y tiene permiso para distribuirlo** (lo de "esperar el
> permiso del dev" y las restricciones de redistribuir que salen más abajo ya NO aplican; se les olvidó actualizar el md).
> Ya se distribuye como APK/IPA (Capacitor, `mobile/`).
>
> **Reglas que el usuario fue marcando (respétalas):**
> - "Solo traducir, no arreglar nada" mientras dure la traducción (bugs del i18n: solo anotarlos).
> - **Nada de personas reales** en las pandillas del mod (se pidió y se rechazó): gente 100% inventada.
> - ~~Nada de redistribuir~~ OBSOLETO: el usuario es el dueño y puede distribuir (APK/IPA incluido). Se puede ayudar a empaquetar.
> - Hablarle en Spanglish dominicano y directo (ver el CLAUDE.md global).

## Qué es
- **YourLife** (`penguinrecreations.itch.io/bitlife`) es un fan remake de BitLife en HTML/JS puro: sin engine,
  sin backend y con los saves en `localStorage`.
- **Uso:** el usuario lo bajó **para modearlo y jugarlo en local, nada más**. No se resube, no se postea y no
  se mete al repo ni al canal. El código trae el header *"Unauthorized copying, re-hosting or redistribution is
  prohibited"*.
- **Reglas de trabajo:** analizar y modear localmente está bien. Nada de redistribuir ni de copiar assets o
  textos de BitLife a proyectos propios.
- **Origen del build:** `https://html-classic.itch.zone/html/20222767/` (versión v3.25.1). Los assets venían
  empaquetados en `packs/p0-p29.bin` y su índice en `packs/index.json`, con formato `[pack, offset, len]` y sin
  cifrado.

## Carpeta `C:\Users\Mxzzy\Downloads\FreeLife\`
| Ruta | Qué es |
|---|---|
| `Jugar.bat` | Levanta `python -m http.server 8765` y abre `http://127.0.0.1:8765/game.html`. Hace falta servirlo así porque con `file://` el juego se rompe. |
| `game.html` | El core: ~88k líneas de JS inline, ya prettificado. |
| `*.js` (108) | Sistemas: `settings.js`, `mafia.js`, `serial-killer.js`, `milev-*.js`, `church.js`, etc. |
| `_original\` | **Backup** de los 111 JS/HTML minificados originales, antes de tocar nada. Es la fuente para extraer texto. |
| assets | 9,910 archivos (~240MB): `faces/`, `jobev/`, `sounds/`, `emoji/`… ya desempacados de los `.bin`. |
| `i18n.js`, `i18n\` | El sistema de idiomas (ver abajo). |
| `CONTEXT.md` | Este archivo. |
| `AJEDREZ.md` | La investigación y el diseño del mod de ajedrez (la escribió el usuario; 36KB). |
| `chess.js`, `chess-engine.js`, `chess-events.js`, `chess-puzzles.js` | **Mod Chess Career** (ver su sección). |
| `gang.js` | **Mod Gang Bang** (carrera especial de pandilla). |
| `mods.js` | El registro oficial de mods del juego. **Tiene 2 entradas nuestras** (`64646464` y `13131313`). |
| `guns/` | Íconos 120×120 de las armas del mod de pandilla (glock, switch en 8 colores, arp, draco). |
| `switches/` | Los PNG de la Glock con switch en 8 colores: grandes, de 120 y la hoja `_todos.png`. |
| `special/gangbang.png` | Ícono de la carrera Gang Bang (bandana). |
| `_art-src/` | **Fuentes del arte nuevo** (SVG en HTML + scripts de Python/Node): ver sección de arte. |
| raíz (sueltos) | PNG de muestra: `glock-extended*.png`, `draco*.png`, `arp*.png`, `glock-switch*.png`, `barba-preview.png`, `cara-completa.png`, `piezas-ajedrez-demo.png`, `stage3/4/5-facial-hair14.png` (la barba, **sin instalar**). |
| `i18n\*.bak`, `*.bak-*` | Backups de seguridad de hoy (`ui.tsv.bak`, `rules.tsv.bak`, `events.tsv.bak-pre-merge` y 2 `.bak-mojibake`). Se pueden borrar cuando todo esté estable. |

**Cambios hechos al juego** (todos marcados con `[mod]` donde se pudo):
1. **Redirect quitado:** `game.html` ya no tiene `"serviceWorker"in navigator&&!...controller&&location.replace("index.html")`,
   así que carga directo sin service worker.
2. **Todo prettificado:** se pasó por Prettier 3.3.3 (`--print-width 110`). Las variables siguen siendo `e`, `t`,
   `a`, pero las funciones globales tienen nombre (`openMainMenu`, `jobIcon`, `petSprite`…).
3. **Scripts de idiomas en el `<head>` de `game.html`:** `i18n.js`, `i18n/es.js` y `i18n/pt.js`, más un
   `document.write` que carga `i18n/<lang>.events.js`.
4. **`settings.js`:** la fila "Languages" ya no lleva `err`, y la función `openLanguages()` abre la lista con
   banderas (`flags/us|es|br.png`). La elección se guarda en `localStorage["bitlifepp-settings"].lang`
   (`en|es|pt`) y recarga la página.
5. **Ortografía (30 fixes):**
   - "Two age up's" → "Two age-ups" y "NPC's can" → "NPCs can"
   - "wacking" → "whacking" y "somebodys" → "somebody's"
   - Británico → americano en prosa: colour, favourite, honour, neighbour, humour, flavours, harbour, centre,
     apologise, criticised y behaviour. Los nombres propios no se tocaron (Marsh Harbour, David Harbour, Honour
     Cross).
   - La prosa del dev ya estaba limpia; los "duplicados" que salen son huecos de plantilla (`in ${city} in ${country}`).

## Sistema de idiomas (`i18n.js`)
- **Enfoque: traducción en runtime sobre el DOM.** Un `MutationObserver` cambia cada text node por su
  traducción, así que no se tocan las 223k líneas del juego. También traduce los atributos `placeholder`,
  `title` y `aria-label`, y los mensajes de `alert`, `confirm` y `prompt`.
- **Problema clave resuelto:** el juego **lee texto de la pantalla en su lógica**, por ejemplo
  `"ASSETS" !== sTitle.textContent`, buscar la sección `.sec` con texto `"Misc."`, o
  `jmTable.textContent.match(/Employer:…Salary/)`. Por eso `i18n.js` sobrescribe los getters de
  `Node.prototype.textContent` y `HTMLElement.prototype.innerText` para que **devuelvan el inglés original** de
  los nodos traducidos (guardado en un `WeakMap`). El jugador ve español y el código sigue viendo inglés.
  ⚠️ Para probar qué se ve en pantalla, usa `node.data` o screenshots, **no** `innerText` ni `textContent`.
- **Orden de búsqueda:**
  1. Match exacto, sin importar mayúsculas. Si el original va en MAYÚSCULAS, la salida también.
  2. Reintento sin la puntuación final (`: ! ? . ...`).
  3. Plantillas de eventos.
  4. Reglas regex de `rules.tsv`.
- **Plantillas:** `"I let {full} copy my homework."` se convierte en una regex donde cada `{x}` es `(.+?)`. Los
  valores capturados se traducen si están en el diccionario, respetando la minúscula: "my dog" → "mi perro".
  - **Indexadas** por la primera palabra literal (`start`) o, si la plantilla empieza con `{x}`, por su palabra
    literal más rara (`inner`). Cada regex se compila la primera vez que se usa.
  - **Rendimiento:** unos 15µs por miss (2000 misses en 29ms).
- **Archivos en `i18n\`:**
  - `ui.tsv`: ~630 textos de interfaz traducidos **a mano** (+ ~640 de los mods, en la sección `## --- chess mod ---`),
    en columnas `en<TAB>es<TAB>pt`. Ganan siempre. Hoy `es.js`/`pt.js` traen ~1,270 textos.
  - `rules.tsv`: 27 regex del juego (`Age: N years (YYYY)`, `Died at N`, los bisabuelos…) + ~70 de los mods. Hoy: 96.
  - `events.tsv`: el texto masivo traducido por Haiku (validado).
  - `build_i18n.py`: genera `es.js`/`pt.js` (UI + reglas) y `es.events.js`/`pt.events.js` (eventos, con
    `weak:1`, o sea que nunca pisan la UI). **Después de editar cualquier `.tsv`, corre `python build_i18n.py`.**
- **Lo que ya se vio funcionando en el juego, con screenshots:**
  - La UI en ES y PT: pantalla de carga, selector de dispositivo, género, main screen, stats, Actividades,
    Settings e Idiomas.
  - El cambio de idioma desde Settings.
  - `ACTIVIDADES` abre bien aunque el código compara el título en inglés.
- **Probado el 2026-11-20 en una vida real:** los `events.js` cargan y el log sale en español.
  - Bugs vistos (el usuario pidió **no arreglarlos todavía**):
    - Hay plantillas demasiado genéricas que mezclan idiomas, por ejemplo "A famine struck Somalia **y los** Horn
      of Africa", porque una plantilla tipo `{1} and the {2}` se come la frase.
    - Algunos valores que mete el juego no están en el diccionario ("who is unemployed").

## Traducción masiva de eventos: estado
- **Extracción:** `work\scripts\extract.mjs` (acorn) sacó **45,952 unidades** (~329k palabras) de `_original\`.
  - Cada `${expr}` se vuelve `{1}`, `{2}`…; el HTML se parte en text nodes; las listas de palabras y nombres
    se excluyen.
  - También incluye palabras sueltas en minúscula que existen en el diccionario (`wife`, `librarian`): son los
    valores que el juego mete dentro de las frases.
  - El resultado está en `work\units.jsonl`.
- **Modelo:** Claude **Haiku** vía subagentes, con 800 líneas por lote. Prueba de 500: calidad natural, ~97-100%
  de líneas válidas por lote.
- **Progreso: TERMINADA (2026-11-21).** Hay **45,952 filas en `events.tsv`**, o sea todas las unidades
  (`merge.py` da `ok: 45462` + 490 reusadas). Los archivos se regeneraron: 33,302 frases + 12,645 plantillas por idioma.
  - **Quién tradujo qué:**
    - Haiku: b001-b020 y b022.
    - Freebuff (opencode `big-pickle`, gratis): b021, b023-b057, los `r024/r026/r035/r036`, que son los restos de lotes
      que se cortaron, y `r999`, las 137 líneas que fallaron la validación.
  - **Calidad de big-pickle:** ~98.5% de líneas válidas. Aproximadamente 1 de cada 4-5 líneas suena literal ("Psiquiatra
    Sr.", botones en infinitivo, `¡` mal cerrado), pero se entiende todo. Solo se revisó el español.
  - **Pendiente: una segunda pasada de revisión.** Que solo corrija las líneas de freebuff, con
    `deepseek-v4.1-flash-free` y fallback a `nemotron-3.5-super-vl-free`. El wrapper ya soporta la lista de modelos
    en `freebuff\backends\models.txt`. El usuario dijo "lo haremos después".
  - `merge.py` reporta un "retry" inflado porque cuenta líneas que ya cubren los `r0xx`. Lo que vale es `ok`.
- **Archivos en `i18n\work\`:**
  - `INSTRUCTIONS.md`: las reglas para el traductor (pronombres, `¡` una sola vez, imperativos, nombres propios…).
  - `batches\bNNN.tsv`: los lotes de entrada (`id<TAB>en`). Sus salidas son `bNNN.out.tsv` (`id<TAB>es<TAB>pt`).
  - `reuse.json`: las 490 traducciones de la prueba que se reutilizan.
  - `scripts\validate.py`: `python -I validate.py in.tsv out.tsv --show N`.
  - `scripts\merge.py`: `python -I merge.py <work> <FreeLife\i18n\events.tsv>`. Valida, realinea los ids si Haiku
    los renumeró, escribe `events.tsv` y saca los fallidos a `batches\retry.tsv`.
- **Prompt que se le pasaba a cada agente Haiku**
  (`model: haiku`, `subagent_type: general-purpose`, en background y con unos 10 en paralelo):
  ```
  Translation job. First read the instructions file and follow it exactly:
  C:\Users\Mxzzy\Downloads\FreeLife\i18n\work\INSTRUCTIONS.md
  INPUT: C:\Users\Mxzzy\Downloads\FreeLife\i18n\work\batches\bNNN.tsv
  OUTPUT: C:\Users\Mxzzy\Downloads\FreeLife\i18n\work\batches\bNNN.out.tsv
  ```
- **Flujo (ya se completó una vez; sirve para retomar o repetir, p. ej. la segunda pasada):**
  1. Traducir los lotes que faltan.
  2. Correr `merge.py`.
  3. Re-traducir `retry.tsv`.
  4. Correr `merge.py` otra vez.
  5. Correr `build_i18n.py`.
  6. Probar en el juego.
- **Gotchas conocidos:**
  - **Pronombres:** `{he}`, `{him}`, `{his}`, `{He}`, `{She}`, `{himself}`, `{T_him}` y `{he2}` los llena el juego
    con palabras en inglés, así que **no pueden quedar** en la traducción. El validador los rechaza.
  - **Ids:** a veces Haiku renumera los ids (1, 2, 3…). `merge.py` realinea por posición si el conteo cuadra.
  - **Haiku a veces mete `{first}` donde no había nada:** el validador lo rechaza y la línea va a reintento.
  - **Concordancia de género:** con valores desconocidos sale cosas como "Una {1} llamada" aunque `{1}` sea "man".
    Es una limitación aceptada.
  - **Plurales con `{2}`:** en inglés `{2}` puede ser una "s" de plural, y entonces sale "audicións". Pendiente.
  - **Valores sin traducir:** los que mete el juego y no están en el diccionario (ej. "a Ferrari") se quedan en
    inglés dentro de la frase traducida.
  - ⚠️ **Mojibake (acentos rotos) — pasó el 2026-11-21:** freebuff escribió `b024` y `b057` con el encoding mal
    ("VocÃª estÃ¡", "QuÃ©date") y **719 líneas** salieron rotas en el juego. El `validate.py` NO lo detecta
    (los placeholders estaban bien). Se arregló recodificando (`s.encode('cp1252').decode('utf-8')`); los originales
    quedaron como `*.bak-mojibake`. **Después de cada tanda de freebuff, revisa con el regex
    `Ã[\x80-\xbf¡-ÿ]|Â[\xa0-\xbf]|â€` en `events.tsv`**, y vuelve a correr `merge.py` + `build_i18n.py`.
  - Los lotes `b024`, `b035`, `b036` y `b026` se cortaron a medias: lo que faltaba se sacó a `r024`, `r035`, `r036`
    y `r026` (mismos ids, solo las líneas pendientes) y `merge.py` los toma solos (`r*.tsv`).

## Freebuff (CONECTADO desde 2026-11-20)
- **Idea del usuario:** gastar menos uso de Claude pasándole el trabajo pesado a **otra IA del usuario (no es
  Gemini)** a través de un MCP llamado **freebuff**.
- **Spec:** `C:\Users\Mxzzy\Downloads\Script\freebuff-spec.md`. Tools `freebuff_task`, `status`, `result`,
  `reply`, `cancel` y `list`, en stdio, con reportes de ≤1500 caracteres, solo dentro del workspace permitido y
  con un backend mock.
- **Estado (2026-11-20): CONECTADO y probado.** Está registrado en scope user (`claude mcp add freebuff -s user`).
  - El CLI `freebuff` (Codebuff) **no tiene modo headless**, así que el backend real es
    `freebuff\backends\opencode.mjs`: un wrapper de `opencode run --format json` con modelos free (default
    `opencode/big-pickle`, se cambia con `OPENCODE_MODEL`). Hace falta opencode ≥1.18 (hay 1.19.6). Con 1.17, el
    free tier devuelve 426.
  - **Fixes de Claude:** el `session_id` se valida antes de meterlo en la línea de shell (había inyección), y el
    contrato REPORT ahora va primero y en inglés (al final, el modelo lo tomaba por prompt injection y no lo mandaba).
  - **Prueba real:** task + reply en la misma sesión, REPORT limpio, ~15s por job y `cost: 0`. Los e2e viejos pasan.
  - ⚠️ **opencode auto-aprueba `bash` y `write`** (corre sin `--dangerously-skip-permissions`, pero sus defaults ya
    lo permiten). El `cwd` no es sandbox: el agente puede tocar fuera si quiere. No le pases tareas con datos no
    confiables.
  - `deepseek-v4-flash-free` dio "Unexpected server error" en la prueba; `big-pickle` funciona. Con opencode 1.19.6
    la lista de modelos gratis es: `big-pickle`, `deepseek-v4.1-flash-free`, `mimo-v2.6-flash-free`,
    `nemotron-3.5-super-vl-free`, `nemotron-3.5-lightning-free`, `longcat-2.5-free`, `hy4-flash-free`,
    `flint-40b-free`, `beam-free`, `iceman-free` y `tidepool-alpha-free` (`opencode models` la muestra).
  - **Mejoras al wrapper `backends/opencode.mjs` (hechas después):**
    - **Auto-continue:** los modelos gratis a veces cortan el turno sin escribir nada; si la respuesta no trae el
      bloque `REPORT`, manda "continúa" en la misma sesión (hasta `OPENCODE_MAX_ROUNDS`, default 8). Sin esto
      b021/b024/b025 fallaron al principio.
    - **Fallback de modelos:** si el modelo da error, pasa al siguiente de `backends\models.txt` (uno por línea).
      **Ese archivo se borró después de probarlo**, así que hoy usa solo `big-pickle`. Para la segunda pasada:
      crear `models.txt` con `opencode/deepseek-v4.1-flash-free` y `opencode/nemotron-3.5-super-vl-free`.
      El JSON de salida ahora trae el campo `model`.
  - **Los jobs viven dentro de la sesión de Claude Code:** si se cierra o se reinicia, la cola muere (los `running`
    pasan a `failed`). Hay que re-lanzarlos. Cuatro corren en paralelo y cada lote tarda 4-12 min.
  - Prompt que funcionó para cada lote: el de abajo (Haiku) más `Work in chunks of at most 100 lines per write
    (append)` y pedir el REPORT con "verified: input vs output".
- **`C:\Users\Mxzzy\Downloads\Script\server.mjs` ("cmd-local", lo hizo la otra IA):** en modo `--http`, cualquier
  web puede ejecutarle comandos (POST `text/plain` a `127.0.0.1:7331/order`, sin preflight). La spec pide el
  arreglo: exigir token, rechazar requests con `Origin` o que no sean JSON, y validar `Host`. **No usar el modo
  HTTP hasta que esté arreglado.**

## Cómo probar el juego desde Claude
- **Server:** `python -m http.server 8765 --bind 127.0.0.1 --directory "C:\Users\Mxzzy\Downloads\FreeLife"`,
  corriéndolo en background.
- **Brave con debug, en un perfil aparte:**
  `"C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe" --remote-debugging-port=9333 --user-data-dir=<scratchpad>\brave-rea --no-first-run http://127.0.0.1:8765/game.html`
- **Scripts:**
  - `work\scripts\cdp.mjs`: `node cdp.mjs 127.0.0.1:8765 -e "<js async>"` evalúa JS en la página y devuelve JSON.
    No recargues desde el mismo eval: usa `setTimeout(()=>location.reload(),50)` y espera unos 9s.
  - `work\scripts\shot.mjs`: `node shot.mjs 127.0.0.1:8765 out.png "<js previo>"` saca un screenshot a 430x900
    en modo móvil. **Mejor `shot2.mjs`** (misma firma): espera a que cargue y no recarga por error.
  - `work\scripts\hardreload.mjs`: borra caché y recarga la pestaña.
  - **Tests de los mods** (se pasan a `cdp.mjs` como archivo, p. ej. `node cdp.mjs 127.0.0.1:8765 events-test.js`):
    `events-test.js` (los 30 eventos de ajedrez), `board-autoplay.js` (una partida completa en el tablero),
    `puzzle-test.js`, `gang-test.js`, `gang-crew-test.js` y `guns-test.js`.
  - Si el Brave de debug no está abierto, hay que levantarlo otra vez (se cierra al reiniciar la sesión). El perfil
    de prueba guarda el idioma y los mods activados, así que no hay que repetirlo (ver "Cómo activar un mod a mano").
- **Trampas al probar:**
  - **Pestañas:** solo puede haber una abierta (`tab-lock.js`), o sale "Already open".
  - **Emulación móvil:** dispara el selector "How are you playing?". Pásalo con el elemento cuyo
    `textContent === 'Play on Mobile'`.
  - **Vida nueva:** `.pk-btn.pk-m` (male) → `.pk-btn.pk-c0` (la primera cara) → `#ageBtn`. Los popups están en
    `#evWrap`, `#toast` y `.notice`.
  - **Salida de Python en Windows:** con `-I`, lee stdin y escribe stdout en UTF-8 con
    `sys.stdin/stdout.reconfigure(encoding='utf-8')`, o salen cosas como "Ã±".
  - **Caché:** Brave guarda los `.js`. Para ver cambios usa `node hardreload.mjs 127.0.0.1:8765` (borra caché y
    recarga) o Ctrl+F5. Los mods se cargan con `src: "x.js?v=1"`: sube el `v` si cambias algo y quieres forzarlo.
  - **El Age up se bloquea** mientras haya un `.notice-wrap` abierto, el `#evWrap` abierto o algo en
    `popupQueue` (`game.html:66261`). En los tests hay que hacer clic en `.notice-wrap` para cerrar los avisos.
  - **`shot2.mjs`:** el botón "Play on Mobile" **recarga el juego**; solo se le da clic si está visible (ya está
    arreglado en el script). Espera ~6s al cargar.
  - **Chrome/Brave headless** no arranca si ya hay un Brave de debug abierto (`exit 21`); usa CDP sobre ese mismo.
  - **PowerShell:** los nombres de variable no distinguen mayúsculas (`$f` y `$F` son la misma): ya me rompió una ruta.
  - Tras `socSelCard()` la pantalla `screen` se cierra: si vuelves a un menú, hay que hacer
    `screen.classList.add("open")` (lo hace `openGang()`).
  - `localPrice(0)` devuelve 5 (mínimo); por eso los mods usan un `price()` propio que deja el 0 en 0.
- **Herramientas:**
  - REA MCP: `inspect_web_page` y `analyze_web_bundle` sirven para el análisis estático.
  - Node 24.22.3, con `npx prettier@3.3.3`.
  - acorn: `npm i acorn@8.12.1 acorn-walk@8.3.4` en una carpeta de herramientas (hay que reinstalarlo si se usa
    `extract.mjs`).
  - pyspellchecker: `pip install --target <dir> pyspellchecker==0.8.1`.

## Mod de ajedrez (Chess Career) — 2026-11-21
- **Diseño:** está en `AJEDREZ.md`, la investigación que escribió el usuario. Se siguió casi todo.
- **Cómo se activa:** Settings → Mods → Redeem Code → **`64646464`**. Queda registrado en `mods.js` (entrada con `src`).
  Aparece en Actividades → Ajedrez a partir de los 6 años. **No toca `game.html`:** envuelve `openActivities` igual
  que `vampire.js` y se engancha a `#ageBtn` igual que `acting.js`.
- **Archivos:**
  - `chess.js`: la carrera, el menú, el tablero y los puzzles.
  - `chess-engine.js`: el motor, propio. Funciona también como Web Worker y en Node.
  - `chess-puzzles.js`: **362 puzzles originales** generados por autojuego: 27 mates en 1, 129 mates en 2 y 206
    tácticas. Van de 764 a 1935 de rating y todos están validados.
- **Traducción ES/PT de los mods:** sección `## --- chess mod ---` en `ui.tsv` (~610 textos) y en `rules.tsv`
  (~70 reglas). Se regenera (idempotente) con `python -I i18n\work\scripts\add_chess_i18n.py` y después
  `python -I i18n\build_i18n.py`. Cubre ajedrez, eventos, pandilla y armas. Español probado en el juego; el
  portugués se vio en pantalla en los eventos y en el menú de pandilla.
- **Carrera:**
  - Elo FIDE real: K 40/20/10, primer rating tras 5 partidas, piso de 1400.
  - Títulos CM/FM/IM/GM más los femeninos. IM/GM piden 3 normas.
  - 7 torneos, del club al Candidates, más el Mundial a 14 partidas.
  - Coach, estudio, clases, y la plataforma online parodia **Pawnder** (bullet/blitz/rapid, Titled Tuesday,
    streaming, Play Live).
  - Talento oculto que sale de Smarts, con un techo (potencial). Calibrado simulando vidas: el casual queda en ~1500,
    el serio en FM/GM, el prodigio pasa de 2650. Nadie supera 2882.
- **Partida clave:** la última ronda de cada torneo se puede jugar en el tablero o simular. En "Final Rounds" se puede
  elegir simular siempre.
- **Motor:**
  - Perft 20/400/8902/197281 OK, más Kiwipete y las posiciones 3 y 4.
  - Bot alpha-beta con quiescencia. La fuerza va por Elo (profundidad 1-3 más "temperatura") y tarda ~1s por jugada
    al nivel máximo. La profundidad 4 se descartó porque tardaba ~4s.
- **Eventos (`chess-events.js`): 30 eventos con decisiones**, hechos el 2026-11-21.
  - Salen al hacer Age up (~55% de los años en que jugaste ajedrez, ~12% si no). Cada uno tiene condiciones
    (rating, edad, título, seguidores, actividad del año); ninguno se repite antes de 5 años y algunos son únicos
    (`once`: el libro, la apertura con tu nombre, el papá mánager).
  - Temas: oferta de trampa, acusación falsa, rivalidad, apuro de tiempo, tablas pactadas, filtración de preparación,
    patrocinador (llega y se va), liga europea, alumno que te gana, burnout, partida viral, pastillas, retiro,
    prodigio de 9 años, libro, exhibición en escuela, tahúr del parque, apuesta, apertura con tu nombre, trolls,
    comentarista, Olimpiada, club en problemas, romance, error garrafal, cuenta hackeada y campamento de élite.
  - **Mecánicas nuevas:** `c.banUntil` (la FIDE te suspende hasta cierta edad y los torneos se bloquean), `c.sponsor` y
    `c.league` (pagan cada año; la liga te suelta si bajas de 2200), cuenta de Pawnder con rating -X.
  - **Cada texto va como `T("english","español","português")`** y `add_chess_i18n.py` los pasa solos al `ui.tsv`.
    Regla: comillas dobles, sin template literals ni valores dinámicos dentro de `T()`.
  - **Debug:** `FL_CHESS.event()` lista los eventos que aplican ahora; `FL_CHESS.event("cheat_offer")` lo dispara.
- **Textos:** el usuario pidió primero dejarlos en inglés y **después pidió el español y el portugués**; ya están
  (ver "Traducción ES/PT del mod"). Lo que sí sigue en inglés: la notación de las jugadas ("Kxd2").
  - ⚠️ Los textos que arma `chess.js` (menús, tablero, torneos) **no se extraen solos**: están escritos a mano en
    `add_chess_i18n.py` (bloques `UI` y `RULES`). Si agregas texto nuevo en `chess.js`, agrégalo ahí también.
    Los de `chess-events.js` y `gang.js` sí salen solos de los `T()`.
  - Se cambiaron dos palabras para no pisar traducciones del juego: "Resign" → "Resign game" (ya significa
    renunciar al trabajo) y "Draw" → "It's a draw".
- **Herramientas de prueba en `i18n\work\scripts\`:**
  - `hardreload.mjs`: borra el caché y recarga.
  - `shot2.mjs`: screenshot móvil estable.
  - `board-autoplay.js` y `puzzle-test.js`: se pasan a `cdp.mjs` como archivo.
- **Generador de puzzles:** `i18n\work\scripts\gen-puzzles.js`.
  - Uso: `node gen-puzzles.js <salida.js> <minutos>`. Saca ~3 puzzles/min por proceso.
  - Verifica que la solución sea única: mate en 1, mate en 2 con una sola primera jugada, o táctica de +2.5 con la
    segunda mejor jugada 2 peones peor.

## Mundial jugable + i18n genérico — 2026-11-21 (sesión 2)
- **Mundial (`worldMatch` en `chess.js`):** ya NO es simulado de golpe. Es un match a 14 partidas (gana el primero a 7.5):
  cada partida pregunta *Play the game / Simulate this game / Simulate the rest*; se juega en el tablero (reloj 30+30; el
  botón Simulate del tablero también vale), los colores alternan, y a 7-7 hay desempate rápido (15+10) de a 2 partidas,
  máx. 6; si sigue empatado el campeón conserva la corona. "Final Rounds → Always simulate" lo simula todo.
  Debug: `FL_CHESS.world()`. Probado en el juego (jugar, simular desde el tablero, rendirse, marcador). Mod ahora `chess.js?v=3`.
  Textos nuevos agregados a `add_chess_i18n.py` (UI + RULES). Backup: `i18n\work\chess.js.bak-pre-world`.
- **i18n genérico (`i18n.js`):** (a) entre plantillas que encajan gana la de **más texto literal**, no la primera;
  (b) las plantillas muy genéricas (<10 letras literales, ej. `{1} and the {2}`) se rechazan si capturan 3+ palabras
  sin traducción (antes: "A famine struck Somalia **y los** Horn of Africa"; ahora queda entero en inglés, sin mezclar);
  (c) los valores capturados de 2+ palabras también se traducen como oración/regla. Costo ~22µs por miss.
  Backup: `i18n\work\i18n.js.bak-pre-spec`.
- **`i18n\glossary.tsv` (NUEVO):** ~150 valores sueltos que mete el juego (man, boy, kid, nanny, cop, delitos como
  "drug trafficking", lugares, etc.), con es/pt. `build_i18n.py` lo suma a los eventos (weak: la UI gana). Para agregar
  más: editar el tsv y correr `python -I build_i18n.py`.
- **Arreglado después (misma sesión):** artículo + valor ("the cop" → "la policía", con género por terminación, solo es/pt),
  plurales `{2}`="s" ("audición" → "audiciones"), tokens pegados a una letra pueden ir vacíos (singular: "1 year ago"),
  y "a el"/"de el" → "al"/"del" en español. Lo del `�` era un artefacto de la consola: **no hay U+FFFD reales** en `events.tsv`.
- **Sigue pendiente del i18n:** la concordancia de género con valores desconocidos ("Una {1} llamada") y el género de
  sustantivos ambiguos (siempre sale "la policía").

## Vendedores de armas (arms.js) — 2026-11-21 (sesión 2)
- **Archivo:** `arms.js` (lo carga `gang.js` al arrancar, o sea que sale con el código `13131313`; `arms.js?v=3`). Backups: `i18n\work\arms.js.bak-pre-kits`, `gang.js.bak-pre-arms`.
- **Dónde está:** Actividades → "Gun Dealers" (16+) y en el menú de la pandilla (fila "Gun Dealers"). Estado: `state.arms` (`guns`, `carry`, `mags`, `parts`, `license`).
- **Tienda legal** (18/21 años): Glock 19, revólver .38, .45; escopetas (pump, doble cañón, táctica); caza (.22, rifle de venado .308, arco).
  Se pueden llevar y usar; **si te arrestan en algo ilegal llevándola te suma un cargo** (`… with a firearm`, +2/+4 años) y te la quitan.
- **Dealers de la calle** (16+): **Lil Ray** (Street Glock, switches, cargadores Glock), **Mr. Ortiz** (Draco, Mini Draco, ARP, Mini ARP, auto sears; +40% si no eres de la pandilla rango 1+), **Ghost** (accesorios y todos los cargadores).
  Riesgo al comprar ilegal: 5% estafa, 3% trampa de la policía (arresto). Armas ilegales: cargo `… and illegal firearm possession` (+3/+6); con switch/auto sear: `… and possession of an automatic weapon` (+6/+10).
- **Accesorios por arma** (slots optic/muzzle/grip/rail/stock/trigger): mira punto rojo, mira 4x, compensador, silenciador, empuñadura vertical, láser, linterna, brace, **switch** (Glock, 8 colores) y **auto sear** (Draco/ARP). **Cargadores sueltos** (ext y tambor por familia glock/ak/ar) que se compran aparte y se cargan desde el detalle del arma; el que sacas vuelve al inventario.
- **Kits ya armados** (sección "Ready-Made"): 9 armas con accesorios instalados, 10% más baratas que por separado (`KITS` en `arms.js`). El nombre del kit solo se ve mientras la config siga igual.
- **Ícono compuesto:** `pic(gun)` arma un SVG (PNG base de `guns/` en base64 + piezas dibujadas encima, posiciones en `POS`) y se usa en la lista del arsenal, el detalle (preview grande) y los popups. Con switch instalado cambia a `guns/switch-<color>.png`.
  Limitaciones: los Mini usan el mismo PNG que el grande; `glock.png` ya trae cargador extendido dibujado; el brace del ARP queda detrás del tubo.
- **Con la pandilla** (`gang.js`): `FL_ARMS.power()/heat()/busted()` se suman al poder, calor y arrestos; solo una arma a la vez (`FL_GANG_STOW`). La "Strap" vieja de la pandilla sigue funcionando.
- **Caza:** licencia $60 (una vez), 2 salidas por año, 3% de accidente; paga $60-320.
- **i18n:** `arms.js` entra a `add_chess_i18n.py` (T() + reglas de los cargos dinámicos). Los textos de cargos que arma el juego ("I was arrested for …") siguen sin traducción completa.
- **Pendiente:** probar en vivo la integración con el menú de pandilla (la prueba se canceló), íconos propios de escopetas/rifles (hoy son SVG simples), ícono propio de Mini Draco / Mini ARP.

## Carrera especial "Gang Bang" (gang.js) — 2026-11-21
- **Cómo se activa:** Redeem Code **`13131313`**. Aparece de primera en Ocupación → Special Careers (envuelve
  `openSpecialCareers`). El ícono es `special/gangbang.png`: una bandana roja de cachemira hecha en SVG, de 120×120.
- **Contexto:** el menú de "Special Careers" del juego (`game.html:15090`, `SPECIAL_PACKS`) trae paquetes
  (Street Hustler, Músico, Político, Atleta, Papa…) pero el dev dejó `SPECIAL_LOCKED = true`: todos salen grises y dan
  "job pack is not available right now". Nuestro mod **inyecta una fila nueva arriba de la lista**; no desbloquea los
  demás. (Los 5 trabajos de la categoría `"Streets"` sí existen en `jobs.js:1229`, no son de pandillas.)
- **Pandillas (nombres elegidos por el usuario):** Gangster Disciples 💎, Black Disciples 🖤, Slime Gang 🐍,
  Toss Gang 🎲, 95 Mob 💯 y Bloodhounds 🐕. Se elige al unirse (selector).
  - **Bloodhounds confirmado** por el usuario (2026-11-21).
- **La gente es 100% ficticia** (decisión del usuario tras pedir personas reales y que yo lo rechazara):
  - Al unirte se generan 11 personas con nombre, apodo, edad, papel (OG, Big Homie, Homie, Lil Homie, rapero,
    buscavidas) y "confianza". **Sin rangos formales** para ellos. Con los años envejecen, suben de papel y a veces
    alguien cae preso o se sale (entra un Lil Homie nuevo).
  - Interacciones: pasar el rato, pedirle consejo a un OG, meterte en la canción del rapero, o que el buscavidas te
    meta a un negocio.
  - **No meter personas reales ni sus rangos**: son alegatos o gente privada. Está en las reglas de arriba.
- **Tu progreso propio** (Prospect → Soldier → Enforcer → Lieutenant → Shot Caller → Boss) **se dejó**, porque es lo que
  hace avanzar la carrera. Se le ofreció al usuario quitarlo y **todavía no respondió**.
- **Qué trae:** iniciación (golpiza o trabajo), 8 acciones (4 por año; "Lay Low" no cuenta), "calor policial" que sube
  la probabilidad de arresto (usa `arrest(delito, [min,max])` del juego: juicio y cárcel reales), parte de la plata
  según rango y **10 eventos** al hacer Age up.
- **Estado:** `state.gangLife`. El nombre de la carrera es la constante `CAREER` arriba en `gang.js`.
  - ⚠️ "Gang Bang" **también significa sexo grupal en inglés**; se avisó y el usuario lo mantuvo. Cambiarlo es una línea.
- **Armas ("The Strap"):** íconos propios en `guns/`.
  | Arma | Precio EE. UU. | Bono en robos/guerras | Calor extra | Requisito |
  |---|---|---|---|---|
  | Glock con cargador extendido | $1,200 | +8% | +3 | — |
  | Glock con switch (8 colores) | $2,500 | +14% | +6 | — |
  | ARP | $3,500 | +18% | +8 | rango Enforcer |
  | Draco | $4,000 | +22% | +10 | rango Enforcer |
  - Desde los 16 años. Se lleva **una sola** a la vez (cambiar o "Guardarla"). Precios con `price()` (cambian por país).
  - Si te arrestan armado te quitan el arma; la mitad de las veces el cargo es "possession of an illegal firearm"
    (2-6 años; 3-8 si era el switch o la Draco).
  - Colores del switch: rojo, azul, verde, dorado, rosado, morado, naranja y blanco.
- **Textos:** van con `T("en","es","pt")`; `add_chess_i18n.py` los saca de `gang.js` y de `chess-events.js`.
- **Pendiente que se ofreció:** íconos del menú de armas más claros y grandes (hoy son oscuros y el color del switch
  casi no se distingue a 120px).

## Vehículos, grids, concesionarios y fútbol por semanas — 2026-11-23/24 (sesión 3)
- **Grids** (hojas 4x3 sobre negro) en `_art-src/grids/`; `_art-src/split_grids.py` las corta a PNG transparentes (`python _art-src/split_grids.py`).
  Salieron: `cars/honda-*`, `toyota-*`, `koenigsegg-*`; `aircraft/plane-*`; `houses/home-*` y `mansion-*`; `jewelry/watch-NN-*` y `cuban-*`; `dealers/<marca>.png`.
  Los sprites nuevos de carros van a 120px de ancho; motos/boats/aircraft a 300px (originales grandes en `_art-src/vehicle-full-size/`).
- **cars.js:** 190 modelos, solo marcas reales (las inventadas Halden/Ventura/etc. se quitaron; los PNG `lux-*` que quedan los usa `special-life.js`). Cada carro lleva `[make, model, type, precio, sprite, color]`.
  Precios = MSRP aproximado de memoria en `car_prices.json`; `update_car_prices.py --apply` los vuelca a `cars.js` (la búsqueda web no sirve: DDG/Bing bloquean bots).
  `yearPick()` (game.html) hace que cada año salga ~55% de los carros con arte propio (hash de modelo+año).
- **Precios x2.25:** `goodsLvl("car")` en game.html multiplica por `window.VEHICLE_PRICE_MULT || 2.25` (todos los dealers de carros) y `elite-life.js` multiplica su `CATALOG` (barcos, aviones, helis, sportbikes). Casas, joyas e instrumentos NO.
- **Concesionarios por marca** (`BRAND_DEALERS` en game.html, junto a `restockCars`): 12 marcas con su edificio; abren o cierran cada año por hash (Toyota/Ford 90% ... Ferrari 35%, Lambo/Rolls 30%), venden solo su marca, aparecen en Shopping debajo de los 3 dealers normales ("Official dealership"). Se regeneran al hacer Age up; no en la era de 1800.
- **houses.js** +52 casas, **jewelry.js** +32 piezas, **elite-life.js** +12 aviones.
- **Fútbol (`futbol.js?v=5`):** el entrenamiento de un clic al año ahora son **bloques de semanas** (`weekBlockStep`): pro = pre-season / liga / early / copa / mid / continental / run-in; juvenil = 3 bloques. Cada bloque: elegir foco (10 + descanso) e intensidad Light/Normal/Hard (botón que la cicla).
  Estado nuevo: `f.fatigue`, `f.plan`. Hard sube la progresión pero acumula fatiga; fatiga alta baja form/fit y sube el riesgo de lesión; la progresión depende de potencial, edad, coach y juvenil. La fatiga baja 45 al empezar cada temporada.
  `wageFor` tiene prima de superestrella (hasta ~32M para skill/fama máximos; promedio de la liga ~2.3M).
- **Economía (2026-11-24):** todo precio/sueldo está en **dólares de 2026** y se indexa con `inflFx(r)` (game.html, junto a `wageLvl`): `r^(año_en_juego-2026)`, r=1.03 (1.08 coleccionables); no aplica en la era de 1800. `window.inflFx` lo usan los mods.
  - **Carros (dealers legacy = 3 normales + luxury):** `makeCar(e, t, untouched)`: nuevo = `precio*goodsLvl*2.25*inflFx`; usado = `nuevo*0.85^edad` (sin ruido); `window.PRICE_OVERRIDES` (en cars.js, **vacío**) = precio fijo exacto por "Make Model"; `window.COLLECTIBLE_CARS` (Bugatti Chiron, LaFerrari, Enzo y los Koenigsegg) se inflan al 8%. `untouched=true` lo usan los **concesionarios de marca** (precio original, sin x2.25 ni inflación). `carro.collectible` queda en el objeto.
  - **Sueldos:** `wage()`/`wageHr()` multiplican por `inflFx()`; cada Age up los trabajos que tienes suben 3% (`payAnnualIncome`); también `wageFor` y el contrato de fútbol (`f.lastInflYear`), carreras de `special-life.js` (carreras y jueces), actuación, iglesia y ofertas de baloncesto. **No** inflados: sueldos de empleados de `drugs.js`, ingresos de fighter/musician/cartel/mafia.
  - **Impuestos:** `tax-engine.js` ya era progresivo (tramos por país). Ahora `calculate` desinfla el ingreso, aplica los tramos de 2026 e infla el resultado (wrapper `u` sobre `u0`) para que la inflación no empuje a todos al tramo máximo. Tasa efectiva en EE. UU.: ~19% con $50k, ~49% con $3M.
  - **Mantenimiento:** `carUpkeep(precio)` = `5.63*precio^0.637` al año (≈$4k con un carro de $30k, ≈$75k con uno de $3M), mensual en `expense`; los carros ya comprados lo recalculan cada Age up.
  - **Lifestyle creep:** en cada Age up se cobra 0.5% de los activos entre $250k y $1M, 1.2% entre $1M y $5M y 2% por encima (`state.lifestyleCost`, log "Keeping up my lifestyle…"); escala con el país.
- **Subastas v2 (`auctions.js?v=2`, mod `auction-house`):** fila "Auction House" al final de Shopping (18+, envuelve `openShopping`). Estado: `state.auction` (`year, lots, rivals, mkt, bubble, gala, board, estateDone`), `state.art[]` (cuadros, tokens, tablero) y `state.silly[]`.
  - **Comprar:** catálogo anual de 6-10 lotes (hypercar coleccionable, exóticos, carro barato, relojes/cadenas, 2 cuadros de artistas ficticios, 2 tokens digitales si hay burbuja, lote "US Marshals seizure" seguro si eres de pandilla, 25% si no). 10 rivales ficticios (con jeque anónimo y coleccionista suizo) con máximo privado, agresividad y memoria (`heat`). **Bidding war:** si un rival supera a otro, hasta 3 re-pujas seguidas x1.5-3 el incremento. Reserva por lote, comisión de la casa 10/15/20/25% según el valor, **falsificaciones** (6% hypercars, 10% joyas, 14% cuadros, 20% tokens) salvo que pagues autenticación (3% del estimado, antes de pujar).
  - **Pandilla:** con `gangLife.member` y heat>0 aparece "Shell company" (+20% de comisión, baja `gangLife.heat` entre 3 y 20 según el monto).
  - **Vender:** "Your collection": consignas carros (sin préstamo), joyas y cuadros; simula 3-5 postores, reserva 50%, comisión 12%. **Fama** (`fameOf()`: fútbol, actuación, música, pelea, ajedrez campeón, pandilla) multiplica hasta x2.5 ("Owned by ..."); **infamia** (`state.serial.kills/fame`) hasta x4 con textos de coleccionistas de memorabilia macabra. Al morir (`die()` envuelto) la familia subasta todo (x0.85 y 10% de comisión), suma a `state.money` y deja una línea en el log.
  - **Inversión:** cada Age up los carros coleccionables suben 8% (crisis -22%, boom +25%), el índice de arte se mueve (crisis/escándalo), los tokens digitales se inflan x1.6-2.6 por año durante una burbuja y al reventar valen x0.02.
  - **Eventos:** cuadro en el ático (2%/año), hallazgo en venta de garage (3%), juez sobornado con un cuadro (12%/año si `state.job.judge`), gala benéfica (gastas de más: felicidad +3..+12 y a veces cuadro), tablero del Mundial de ajedrez (`state.chess.champion`).
  - **$SILLY (memecoin "Silly Penguin", ícono `freelife/penguin1.png`):** en "Hot tokens"; compras con $1k/$5k/$50k/$250k (x inflación). Al siguiente Age up siempre vale $0 (`sillyRug`): "You invested $X in $SILLY. The developer stopped updating it on <fecha>. Your investment is now worth $0.00." con fila "Change -999%". Es independiente del sistema de cripto de `invest.js` (que ya tiene logos en `freelife/crypto/`).
  - **No conectado todavía:** Politician (subastas benéficas para imagen) y barcos/aviones/casas como lotes. **Sin probar en vivo** (hotfix pendiente junto con lo demás).
- **Casino (`casino-games.js?v=1`, mod `casino-games`):** el juego solo trae **Blackjack** (`blackjackBet`/`blackjackTable` en game.html, ~línea 87600); Craps, High-Low, Keno, Roulette, Slots, Sports Betting y Texas Hold'em son filas de `openCasinoGames` que llaman `comingSoon()`, y con la piel `flui` ni se muestran (la sección "Premium" se oculta). El mod envuelve `openCasinoGames`, agrega la sección si falta y los activa.
  - **Estilo del blackjack que se reutiliza:** mismo modal (`ev`/`evWrap`, `.jcw`), pantalla de apuesta (`gm-range`, "Session Earnings", `state.casinoLife`), cartas `.bj-card` 40x56 que vuelan desde el borde derecho en 70 ms (`.bj-fly`) y se voltean con `squeeze` (135 ms), botones `.bj-pop` (80 ms), `.bj-result`, sonidos `sfx("CardFlip"|"CardFlipFast"|"CasinoWin2"|"CasinoLose2"|"CasinoOpen")`, Golden Neko (+20% de la ganancia, `nekoLuck()`), 2 casinos al azar (`state.casinos`) y crupier con cara (`npcFace`/`randomLook`), notice con frase y vuelta a apostar. Al final de cada mano hay "Again" (misma apuesta) y "Continue".
  - **Juegos:** Roulette (europea, tira horizontal que desacelera, 10 tipos de apuesta incl. número, paga 2.7% de ventaja), Slots (3 carretes con tiras verticales, RTP ~93%, pagos x7/x14/x27/x55/x130/x500 y dos limones devuelven la apuesta), High-Low (la apuesta se multiplica por 0.96/prob con cartas reales del mazo; los empates pierden; cash out), Craps (pass / don't pass, dados que ruedan, punto), Keno (80 números, 1-10 picks, 20 bolas, tabla calibrada a ~92% RTP), Sports Betting (3 partidos de equipos ficticios, cuotas Poisson con 6% de margen, marcador en vivo de 90 min) y Texas Hold'em heads-up contra el crupier (ante + check/bet/fold por calle, evaluador de 7 cartas y equity Monte Carlo para el crupier).
  - Las apuestas se descuentan al empezar y el pago se suma en `settle()`. **Sin probar en vivo** (hotfix pendiente). Textos en inglés (sin i18n).
- **Sesión 4 (2026-11-24), todo sin probar en vivo (hotfix pendiente):**
  - **Renombre a "YourLife":** `Free Life` -> `YourLife` y `FREE LIFE` -> `YOURLIFE` en el texto visible (game.html, settings.js, mods.js, modloader.js, i18n, docs...). **No se tocó:** las líneas de copyright/licencia del dev (`Copyright`, `Unauthorized`, `©`), la carpeta de assets `freelife/`, la clase CSS `.flui`, las claves `bitlifepp-*` ni los PNG (`logo.png`, `logo-wide.png`, `logo-west.png` todavía dicen "Free Life" en la imagen). Después hay que correr `python -I i18n/build_i18n.py` (ya se corrió).
  - **Mod Loader = el nuevo Workshop** (`modloader.js?v=20`): una sola pantalla "MOD LOADER" con (1) los mods propios, (2) los mods por código del viejo Workshop (`BL_MODS.REGISTRY`, sin escribir código; se guardan en `bitlifepp-ported`) y (3) el resto de interruptores del Workshop, que se reutilizan llamando a la función original `openModSettings()` (guardada en `origWorkshop`) para que sigan todos sus casos especiales. `window.openModSettings` ahora apunta al Loader (Settings, menú principal). Se quitaron las 6 entradas "flags" falsas del loader (apuntaban `src` a un PNG) y el interruptor `modLoader` del Workshop; el Loader siempre está activo. La fila de Settings se llama "Mod Loader".
  - **Emojis Apple en el tema normal** (`settings.js?v=83`): `ao()` hace que `img[src^="emoji/"]` pase a `freelife/apple/<hex>.png` cuando el icon pack no es "bitlife" y no es 2018 (todos los `emoji/*.png` tienen versión Apple). Sólo emojis; el arte de la piel Free Life (`c[...]`) sigue exclusivo de `flui`. Los dados del casino dejaron de usar glifos Unicode (pips con CSS).
  - **Precios de carros por clase** (`tierClamp` en game.html): modestos 1k-150k, medios 150k-550k, lujo 550k-20M, según el precio de catálogo, x inflación; la depreciación se detiene en el piso de la clase y los coleccionables no se deprecian. Bases subidas en `car_prices.json`: Rolls-Royce Ghost 600k, SF90 650k, Revuelto 850k, Enzo 2.5M, LaFerrari 3.5M.
  - **Fútbol:** `futbol.js` estaba **subido incompleto** (terminaba en `//__PART4__`): `yearTick()` nunca se llamaba, así que las semanas, eventos y temporada no arrancaban solos. Ahora se engancha a `#ageBtn` (como chess/gang) con un candado en captura mientras hay decisiones en pantalla (`flowActive` en memoria, porque `f.pending` se guarda con la vida). Nuevo: objetivos de temporada (`makeObjectives/objectiveStep/objectiveReview`, 3 metas por año con premio/castigo), **derbi jugable** (`keyMatchStep`, 6 momentos con decisiones según tus atributos), **eventos con memoria** (`f.memLog` + 6 `FOLLOWUPS` que reaparecen por decisiones pasadas), **menú por pestañas** Today/Career/Club (`applyTabs`). `futbol.js?v=9`.
  - **Casino** (`casino-games.js?v=2`): las animaciones de ruleta y slots no se movían porque se disparaban antes de mostrar el popup (display:none = sin layout ni transiciones); `openModal` ahora abre primero y arranca en 2 frames. Botones y selects más grandes para touch, keno en 8 columnas, atajos de teclado en PC (Enter/Esc/1-9/flechas).
  - **Scroll del popup de Adopción:** el CSS original `#ev:has(> .jcw > .jm-x){overflow:visible !important}` impedía hacer scroll en popups altos. Script al final de game.html: si el contenido no cabe, activa `overflow:auto !important` y mueve la X adentro.
  - **Licencias** (`licenses.js?v=1`, mod `licenses`): Activities -> Licenses. Moto, CDL, bote, piloto privado, helicóptero y permiso de armas, cada una con examen escrito (preguntas al azar, nota mínima) y prueba práctica (mini-juego de timing en el mismo popup). Requisitos de edad, previas (moto/CDL piden la de manejar; heli pide piloto), tarifas con inflación, reintento más barato, permiso bloqueado con antecedentes (`state.felony`). Desbloquean sportbikes, barcos, aviones, helicópteros (`elite-life.js?v=6`), compra legal de armas (`arms.js`) y trabajos de chofer (`felonCheck` en game.html). Estado: `state.licenses`, `state.licProg`; la de manejar sigue siendo `state.license`.
- **Peinados nuevos al nacer:** el pack completo (`HAIR_PACK`, 80 estilos con PNG en `hair/`) estaba detrás del flag `hairPack`, que se reseteaba a false con vidas viejas. `hairPackOn = () => true` (game.html), la pestaña de New Life se llama "New Hairstyles" (antes "Barber Expanded") y `randomLook` mete un peinado del pack con 30% desde los 8 años (los 3 candidatos de nacimiento y NPCs). Pendiente de confirmar: la carpeta Downloads/emoji apple (1766 PNG Apple con nombre en vez de código hex, fechada 2026-11-22) NO está importada en el juego.
- **Joyas en el avatar (`jewelry-wear.js?v=1`, mod `jewelry-wear`):** 4 slots (`state.jewelEq = {neck, wrist, mouth, ears}` -> ids de `state.jewelry`): cuello (chain/necklace/pendant/choker), muñeca (watch/bracelet), boca (grillz, 3 piezas nuevas en la joyería con PNG `jewelry/grillz-*.png` hechos con `grillz.py`) y orejas (earrings). Se equipan desde Assets > Jewelry > pieza > "Wear" (fila agregada en `jewelry.js`, `T()`). El avatar es solo la cabeza 250x250, así que con cuello o muñeca la cara se reduce a 0.82 y se dibujan cuello, camiseta y antebrazo; orejas y boca se anclan con la silueta de `stage*-base` (ojos `ACCESSORIES.eyeY`, mentón, ancho de cara). Se engancha en `composeFace` (game.html) con `FL_DRESS_JEWELRY(canvas, info)` solo para `state.look`, y `FL_JEWEL_KEY()` entra en las claves de caché del avatar (`renderAvatar` y `npcFace`).
- **Texto "I was born into a famous family":** salía en CADA carga del juego (el `setTimeout` de 700 ms de Famous Life llamaba `say()` siempre). Ahora solo si `state.age === 0` y una vez (`state.famousBornSaid`).
- **Fútbol, entrenar cuando tú quieras (`futbol.js?v=11`):** los bloques de entrenamiento ya NO son pasos forzados de la temporada. Cada temporada da `f.trainLeft` bloques (4 pro, 3 juvenil) y los usas desde la pestaña Today de tu trabajo (fila "Training" -> `trainNow`, con botón "Not now"); no se puede entrenar lesionado. Fatiga, intensidad y lesiones siguen igual. **Tope de eventos:** máximo `MAX_EVENTS = 6` tarjetas de evento por temporada (`f.evCount`): cuentan los momentos de decisión de liga/copa/juvenil (`counted()`) y los eventos al azar (2 a 5 espacios por año). Excepciones que no cuentan ni se saltan: seguimientos de decisiones pasadas (`fu_*`), eventos especiales (`SPECIAL_EVENTS`: injury, callup, retirement, firstteam, clause, scouts, captain), derbi, copas (`momentStep("cup")`), selección y Mundial/torneos de selecciones, continental (Champions y similares), traspasos/contratos, resultados y objetivos. Solo cuentan los momentos de liga/juvenil y los eventos al azar.
- **Lote 2 de grids (2026-11-24), cortado con `_art-src/split_grids2.py`** (fuentes en `_art-src/grids/`): **trofeos** (`trophies/`: `uefa-*`, `award-*`, `intl-*`, `nba-*`; 48 PNG), **Pagani** (12 en `cars/pagani-*`) y **Ram** (12 en `cars/ram-*`), **joyas** modernas (`jewelry/gem-*`) y ancestrales (`jewelry/anc-*`), **24 peinados** a color (`hair/nh01..nh24-hair-base.png`, 500x500 como el resto del pack).
  - **Trofeos de fútbol:** `trophyArt(nombre)` en futbol.js elige el PNG por competición o premio (Champions, Europa, Conference, Libertadores, Concacaf, Mundial, Euro/Copa América/Gold Cup/Copa Africana según la confederación de tu liga, Balón de Oro, Bota y Guante de Oro, The Best...). La selección ahora juega "European Championship / Copa América / Gold Cup" en vez de "Continental Championship". Nuevos premios: Kopa Trophy (<=21 años) y Yashin Trophy (porteros). Las vidas viejas también ven el arte nuevo (se resuelve al mostrar el cabinet).
  - **NBA:** fila "Trophy Case" en el job de baloncesto (`cabinetScreen` en basketball.js): Larry O'Brien por cada título y un trofeo por premio (MVP, Finals MVP, DPOY, ROY, Sixth Man...).
  - **Carros:** Pagani (12 modelos, coleccionables) en el luxury y en el dealer de Lamborghini; Ram (12 trucks) en la lista normal. **Joyas:** 24 piezas nuevas en la joyería (las ancestrales son raras y caras; collares/pulseras/aretes/relojes se pueden usar con Wear). **Pelo:** entradas `nh01-nh24` en `HAIR_PACK` (color fijo, sin tinte).
- **Limpieza para pushear:** se borraron los `.txt` de extracción de textos de la raíz, `CONTINUAR.txt`, `hello.txt`, todos los `*.bak*`, `__pycache__`, `_art-src/vehicle-full-size`, `desbugeado/` y los backups viejos de i18n. Se agregó `.gitignore`. La carpeta vacía `GRIDS/` (y su gemela `grids/`, es la misma en Windows) no se pudo borrar porque Windows la tiene abierta: cerrarla en el Explorer y borrarla a mano.
- **Backups:** ya no se guardan en el repo (se limpiaron para el push); el historial queda en git.
- **Sin probar en vivo:** todo esto solo pasó `node --check` y la verificación de que existen los PNG. Falta jugarlo (dealers de marca, bloques de semanas, precios).
- **Ideas de fútbol pendientes** (las que se propusieron): partidos clave jugables por momentos, eventos con memoria, objetivos por temporada, menú por pestañas.

## Sesión 5 (2026-11-24): fútbol, Mental Health, herramienta de grids
- **Fútbol (`futbol.js?v=15`):** (1) `applyEffects` ya no pisa `f.skill` con el promedio de atributos (movía 70% -> 54% tras entrenar): ahora suma el cambio del promedio. (2) El flujo de temporada es una cadena de popups; si uno se pierde (`jCard` sale temprano) `flowActive` quedaba en true y Age up se bloqueaba hasta recargar: `flowStalled()` detecta que no hay popup/cola/notice por >2.5s y retoma el flujo (`resumeFlow`). (3) Cabinet: Youth MVP sale en el review juvenil, "National team titles" separado de individuales en Career numbers, tope de trofeos 400.
- **Mental Health (`mentalhealth.js?v=2`, mod `mental-health`):** Activities -> Mental Health. Depresión, ansiedad, ADHD, bipolar (I/II), PTSD sobre el sistema base (`state.mind`, `state.depressed`, ills Anxiety/ADHD/PTSD, que adopta y neutraliza para no duplicar el drenaje). Estado `state.mhx`: `c[id]` con `lvl` (carga de síntomas), `dx` (false = oculto, "wrong" = bipolar mal diagnosticado como depresión), `meds[]`, `tried`, `bad`. Síntomas ocultos hasta una evaluación (que puede fallar); efectos anuales en stats, `state.job.perf` (o `state.school.grades`) y `rel` de la gente cercana; terapia global (`m.th`: semanal/quincenal/mensual/grupo, terapeuta con `eff`), meds por condición (respuesta individual, efectos secundarios, adherencia; dejarlas de golpe recae; antidepresivo solo puede disparar manía en bipolar), autocuidado, hablar con alguien, crisis con líneas de ayuda reales, sin muerte por suicidio. Combate de Military Expanded = trauma (envuelve `runMilEvent`); activos y veteranos no pagan. Costo anual en `payCare` (si no alcanza, se pausa).
  - **Antidepresivos con arte:** 12 cajas en `meds/` (Zoloft, Lexapro, Prozac, Cymbalta, Effexor, Wellbutrin, Remeron, Desyrel, Paxil, Celexa, Elavil, Trintellix) con ficha propia en `MEDS`; `recommend()` hace que el psiquiatra recomiende una según comorbilidades, edad, severidad, lo ya probado (`r.tried`) y los efectos que te hicieron dejar otra (`r.bad`); pantalla `openMedList` con imágenes. Los ids `ssri`/`atyp` quedan ocultos (`hide`) por compatibilidad.
  - **Sadismo = rasgo, no trastorno** (`state.mhx.sad`: `v`, `urge`, `guilt`, `known`): el log de vida (MutationObserver con `VIOLENT`) dispara `onViolence`: felicidad +, reembolsa la culpa base (`mindBump`), `Remorse` bajo, Melon (brutality +, disguise -) y `state.serial.notice` +; urge que se resiste, se redirige (gimnasio), se trata o se actúa. Meter el medidor en la pantalla de Crime debajo de Melon.
  - **Sin probar en vivo del todo:** el flujo evaluación -> terapia -> meds y el sadismo vía log sí se probaron con CDP; los popups de eventos (urge, crisis, manía, pánico) y el tick por Age up NO se vieron en pantalla. Textos en inglés, sin i18n. Debug: `FL_MH.give("ptsd")`, `FL_MH.tick()`, `FL_MH.eventNow("mania")`, `FL_MH.crisis()`.
- **Herramienta de grids:** `python -I _art-src/split_grid.py [--list] [--only texto] [--preview]` lee `_art-src/grids.json` (src, cols/rows, names izq->der y arriba->abajo, out, box, cut, keep_all, mode hair). Para un grid nuevo: PNG en `_art-src/grids/` y una entrada en el json. Reproduce idéntico los grids de trofeos, carros, joyas, pelo y meds. `split_grids2.py` sigue como librería de helpers (`cutout`, `fit`, `cells`, `pad`). `--preview` escribe `_art-src/_preview/` (ignorado en git).

## Sesión 6 (2026-11-24): crímenes, zoo dueño, stats más fáciles
- **`crime-extra.js` (mod `crime-extra`):** prende las 4 filas de Crime que el juego trae sin terminar: Train Robbery (estaba en `CRIMES_OFF`; el mod hace `CRIMES_OFF.delete("train")`), Street Racing, Illegal Betting y Trespassing (estas 3 están en `CRIMES_TAB_ONLY`, o sea el click no hace nada; el mod envuelve `openCrime` y les pone `onclick`, y envuelve `crimeEvent`). Estado en `state.crimeX`. Agrega cargos a `CHARGES` (illegal gambling, street racing, military base...). Deuda del loan shark y heat de tren se resuelven en el age up.
- **Zoo dueño (en `zoo.js?v=3`):** la fila "Zoo" de Assets (antes `data-soon` -> `comingSoon`) ahora abre `openBiz()`: comprar el zoo (18+), construir recintos por zona (8 animales c/u), **comprar animales con su PNG de `zoo/`**, staff, tickets, publicidad, clínica vet, cría, venta. `bizYear` corre solo (`ownerTick`) aunque no seas zookeeper. Se envuelve `openAssets` y si la fila no existe (sin `bitlifeMode`) la inserta.
- **12 PNG nuevos conectados** (campo `file:` en `SP`): grizzly, kodiak, cinnamonbear, russetbear, americanbear, bananapython, blackrat, bluekrait, forestcobra, greensnake, milksnake. `bear-polar.png` sigue sin usar (duplica `polarbear`).
- **Cheat Menu quitado** del registro de `modloader.js` (el archivo `cheat.js` sigue en disco).
- **Stats más fáciles:** `easy-stats.js` (mod `easy-stats`): cada cumpleaños Happiness/Health suben 0-6 si están bajos y baja el stress de Mental Health. Además `mentalhealth.js` quedó más suave (stress base 16, onsets x0.6, penalización máx de Happiness -12 y Health -6).
- **NBA Career (`nba.js?v=1` + `nba-data.js`, mod `nba-career`):** Occupation > Special Careers > Pro Athlete > "NBA Career" (se agrega debajo de las filas de fútbol envolviendo `openSpecialCareers`). `nba-data.js` lo genera `_art-src/gen-nba-data.py` desde `nba/jugadores.txt` (30 equipos, 529 jugadores, coaches, `rep` por equipo puesto a mano) y usa `nba/logos/ABBR.png`. Flujo: high school (14-17) -> ofertas de college -> declarar al draft -> lotería/pick (escala rookie) o two-way -> agencia libre, extensiones, trades, patrocinios (marcas inventadas), playoffs simulados de los 30 equipos, premios (All-Star, All-NBA, MVP, DPOY, ROY, 6MOY, Finals MVP, scoring) con los trofeos `trophies/nba-*.png`, ~25 eventos con decisiones, retiro + Hall of Fame (legacy >= 60) y oferta de analista. Estado `state.nba`; trabajo real `state.job.nba` (el juego paga el sueldo). No bloquea Age up. Probado solo con un harness de node (stubs): 200 vidas sin errores; falta verlo en pantalla. Jugadores reales solo como nombres de plantilla; los eventos no les inventan escándalos.
- **Reclutamiento según rendimiento en high school:** NBA (`collegeOffers`): ofertas 1-5 y prestigio dependen de `ovr + hype*0.4 + fame*0.2` (sin tirada fuerte = solo community college). Fútbol (`scoutAppeal` + `scoutOffers`, futbol.js?v=16): `skill*0.65 + fame*0.2 + hype*0.15`; >=85 trae 3 academias élite + una extranjera top, 72+ primera división + extranjera, 55+ mid/2da división, menos = solo 2da; los buenos reciben scouts desde los 16.
- **Pelo sobre la cara (2026-11-24):** los peinados del pack original `dread-black/blonde/green/red`, `braids-bw`, `emo-pink1/2` y `rainbow-long` tenían mechones cruzando ojos y mejillas. Se les borró el alfa dentro de la silueta de la cara (de la línea de las cejas hacia abajo; máscara de `faces/stage4-base` + `f-stage4-base`, con huecos de ojos rellenos). Originales en `_art-src/hair-orig/`. Los `tx**` y `nh**` no tenían el problema.
- **Fútbol, ya no te escogen siempre (`futbol.js?v=17`):** al empezar, el entrenador del colegio hace un tryout (chance `0.2 + skill/110 + salud`, entre 30% y 90%; un reintento tras entrenar; si fallas dos veces puedes rendirte y reiniciar luego). Las academias ahora son un trial: `0.5 + (skill - (rep del club - 15))/120` (+0.1 si eres gifted), mínimo 30% máximo 95%; si fallas pierdes la oferta y los scouts vuelven al año siguiente.
- **Fútbol, balance (`futbol.js?v=18`, `futbol-events.js?v=2`):** entrenamiento ~2x más rápido (`weekBlockStep`: base `ri(2,4)*0.5`, `room` mín 0.4, y un bloque normal casi siempre mueve algo); las jugadas de partido (`momentStep`) tienen +14% y mínimo 30% de éxito; los 9 textos de fallo burlones ("look ridiculous", "giraffe on ice"...) ahora son neutros/alentadores y el título del fallo es "Not this time". Esos textos cambiaron en inglés, así que su traducción ES/PT vieja ya no calza (hay que retraducirlos).
- **Genética de familia (`genetics.js`, mod `family-genetics`):** el juego base tira el color de piel por separado para ti, tus padres, hermanos, abuelos, tíos y primos (`randomLook`), y los hijos solo se mezclan en `babyCard` (`mixSkin`). El mod ajusta padres/hermanos/abuelos/tíos/primos a un tono vecino al tuyo (usa `state.mod.skinColor` si lo cambiaste) y revisa cada hijo propio no adoptado: si su piel queda fuera del rango de los dos padres (+-12 de luminancia) la re-tira entre ambos. Marca `_g` en cada persona. Probado en jsdom: los padres salen con tu tono.
- **Sonido de stats (`sound-fix.js`, mod `sound-fix`):** el juego decide statUp/statDown sumando todo lo que cambió en el redibujo (un resultado bueno que cuesta Health sonaba mal). `play` es `const` y no se puede envolver, así que el mod reemplaza `SND.statUp/statDown` por objetos con `get src()` que decide al momento: sigue el signo de Happiness y, si no se movió, la suma vieja. `FL_SND.result(true|false)` fuerza el sonido 1 s; lo llaman futbol (momentos), nba (eventos) y crime-extra.
- **Log de fútbol (`futbol.js?v=20`):** los eventos y jugadas escribían "Título: opción" o "Título: it worked." en la vida. Ahora `firstPerson(msg)` pasa el texto del resultado a primera persona (You -> I, your -> my, "tells you" -> "tells me") y eso se registra. Queda en presente y en inglés (sin i18n).
- **Mental Health vs la barra (`mentalhealth.js?v=3`):** los eventos del mod salían según trastornos ocultos, sin mirar la barra "Salud mental" del juego (`mindOf().mh`). Ahora `mhCalm()` multiplica por 0.1 (barra >= 85), 0.35 (>= 70) o 0.7 (>= 55) la chance de eventos, de que aparezcan depresión/ansiedad/bipolar, y la crisis solo sale con la barra < 70; además la barra sube baja el stress objetivo.
- **Objetivos de temporada realistas (`makeObjectives`, futbol.js?v=21):** antes los goles eran `pos.goal*(4+skill/9)` (un delantero de 15 años con skill 45 debía meter 14) y el score juvenil era siempre 65. Ahora salen de lo que el simulador da de verdad: apps esperadas (pro: `38*playRate` según skill vs rep del club; juvenil: 22) x tasa de gol x 0.8, menos con 32+ años; score juvenil = esperado - 3; rating según skill vs club; el portero juvenil se juzga por rating porque el sim juvenil no cuenta clean sheets.
- **Fútbol: eventos de vida, relaciones y fama (2026-11-24, futbol.js?v=23):** `futbol-events-life.js` agrega 36 eventos (27 con `life: true`: familia, amigos, pareja, casa, mascota, multa de tráfico, vacaciones, fans...; el resto de fútbol pequeño y humano); `pickEvent` elige vida vs fútbol 45/55 y la card dice "Life" en vez de "Football Life". `coachRel`/`clubRel` ahora pesan: el entrenador cambia tus minutos (`playRate += (coachRel-50)/260`, `< 20` => x0.65), el club cambia el aumento al renovar (`bump` x `0.4 + clubRel/80`) y con club < 25 (y expirado o coach < 25) no te ofrece renovar. Hay barras de Coach, Club, Fitness y Fama arriba en el job (pestaña Today).
- **`fame-bar.js` (mod `fame-bar`):** barra "Fama" debajo de Looks (envuelve `renderStats`; usa el máximo `fame` de cualquier carrera; se aparta si ya está la del modo artista).
- **`mobile-fix.js` (mod `mobile-fix`):** 100dvh, popups que se achican (zoom hasta 0.6, luego scroll) y notices con scroll, `overscroll-behavior` (adiós pull-to-refresh), swipe derecha = atrás/cerrar, swipe abajo = cerrar popup con X, tap en `title` muestra toast, guardado (`blSaveLife`) cada pocos toques y al ocultar/congelar/cerrar, letra del log 15px en pantallas <= 480px. Sin probar en un celular real.
- **`juice-plus.js` (mod `juice-plus`):** vibración por texto del popup (arresto, muerte, golpe, victorias grandes), dinero que rueda con sonido de monedas, confetti (`FL_JUICE2.confetti()`), ticker de noticias del mundo bajo la barra superior (toque = lista), mensajes de mamá/papá/ex/pareja/amigo/hermano/agente entre años con respuestas. Reglas de confetti/vibración en `RULES`.
- **Barras y fuente del juego (`ui-bars.js`, ahora base en `game.html`):** `FL_BARS.html(label, valor, color, hint)` dibuja la barra con el markup del juego (`statBar` -> `.bar/.bi/.fill/.pct`, etiqueta en Mulish 900 color `--link`). zoo.js, nba.js, mentalhealth.js y el job de fútbol delegan en él (con la barra vieja de respaldo). Los colores viejos se mapean a las clases del juego (`crit`, `low`, `fame`, `insane`). Ticker, mensajes y toast usan `"Avenir Next","Mulish","Nunito"`. Para barras nuevas: usa siempre `FL_BARS.html`.
- **Barras en oscuro:** `ui-bars.js?v=2` arregla las etiquetas en azul oscuro y las notas grises (opacity .75/.7/.8) que se veían negras sobre el tema oscuro (`.phone.dark`); `melon.js?v=2` (Brutality/Disguise en Crime) también usa `FL_BARS`. Las barras de los archivos originales del juego (`<i><u>`) se dejan: ya tienen su estilo.
- **Pendiente:** no se probó en vivo (el arranque de Brave con CDP lo bloqueó el permiso). Textos nuevos: traducidos con opencode el 2026-11-24 (`i18n/work/new_pending.tsv`, 346 líneas, ya en `ui.tsv`); lo que queda sin traducir en el audit son nombres de jugadores/equipos y basura de código. Mod nuevo `barbershop.js` (barbero/tinte/afeitado cobran; precios en `PRICES`, sin probar en vivo). Si el click de Zoo en Assets no responde, revisa el log `[zoo]` en consola.

- **`rich-life.js` (mod `rich-life`, 2026-11-24):** lo q pasa cuando eres rico. Pedigüeños (familia/panas piden préstamo; si dices q no baja la relación y mandan un mensaje enojado; algunos préstamos se pagan con interés), paparazzi (comprar mansión >= $1M o carro >= $150k con fama >= 20 o fortuna >= $5M sale en el ticker vía `FL_JUICE2.addNews`), estafas (inversión falsa, 'príncipe', romance, contratista), robo en casa si presumes mucho, **police heat** (compras q tu sueldo no explica; detectives desde 45%; `arrest("money laundering")` si te quedas callado), fans vs críticos (según `love` y fama) y **impuestos** (tax season cada año con ganancia >= $100k: declarar todo 20%, declarar mitad, o contador 15%; auditoría si hay dinero sin declarar, puede acabar en `arrest("tax evasion")`). Estado en `state.richlife`. Textos ES/PT en `i18n/work/new_rich.tsv` + 3 reglas de titulares en `new_rules3.tsv`. Probado con stubs, **no en el juego real**.

- **`blackmarket.js` (mod `black-market`, 2026-11-24):** Activities -> Black Market (18+). 4 dealers (Antique Peddler, Arms Dealer, Art Thief, Jewel Fencer) reparten los 24 items del arte `blackmarket/bm-*.png`, cortado de `GRIDS/BLACK MARKET*.png` con `split_grid.py` (entradas nuevas en `_art-src/grids.json`; `keep_all` en katanas, nunchakus, karambit y bolso negro porque la hoja fina/oscura se perdía). Inspirado en el BitLife original: actitud del dealer (precio y regateo), fakes hasta tasarlos (4% del valor), vender a un fence (30-42% del valor, para que no se pueda flipear), y razias de la policía (riesgo sube con items, armas y el heat de Rich Life; compras suman heat vía `FL_RICH`). Estado `state.bmarket`. Street Chemist y Wildlife Smuggler del original NO están (no hay arte). Textos ES/PT en `i18n/work/new_bm.tsv` + 10 reglas en `new_rules3.tsv`. Probado con vidas simuladas en Node (3000 vidas: 0 errores; jugador ligero ~9 compras, ~2 razias y ~47% de arrestos por vida, afinable en `tick()`/`raid()`); **no visto en el juego real**.

- **`social-nan-fix.js` (mod `social-nan-fix`):** un jugador reportó NaN al postear una selfie en cualquier red. Un solo número malo en `state.social[x]` (subs, fake, momentum, views... faltante o NaN) contamina todos los posts (`NaN + x = NaN`). El mod repara esos campos a 0 antes de `socialPost`/`socialBuy` y al abrir `openSocial`/`openSocialAccount`. **No se encontró el origen exacto** (las 4 formas de crear cuentas traen todos los campos; `fighter.js:1950` no puede dar NaN); es una red de seguridad. Si reaparece, mirar la consola: avisa `[social-nan-fix] repaired N bad social number(s)`.

- **Mods que pasaron a base del juego (2026-11-24):** los que son arreglos o extienden algo que ya existía ya NO están en `modloader.js`: se cargan con `<script>` en `game.html` (bloque `[base]` justo después de `tab-lock.js`), siempre encendidos y sin aparecer en Mod Loader. Son 14: `ui-bars`, `barbershop`, `social-nan-fix`, `event-juice`, `casino-games`, `adoption` (adoption-menu), `crime-extra`, `genetics` (family-genetics), `sound-fix`, `fame-bar`, `mobile-fix`, `juice-plus`, `easy-stats` y `jewelry-wear`. Siguen como **mods** (15): Black Market, Rich Life, Chess Career, Gang Bang, Femboy Journey, Special Life, Political Career, Melon, North Korea, Football Career, Auction House, Licenses, Mental Health, NBA Career y Zookeeper. Los límites son un juicio mío (melon, auction-house y licenses eran dudosos: se quedaron mods); para pasar otro a base: sacar su entrada de `MODS` y agregar su `<script>` al bloque. `modloader.js?v=22`. Backups de antes del cambio en el scratchpad de la sesión (se pierden). **No se probó en el navegador**: si algo de esos 14 no arranca, mirar la consola.

- **Inversiones 100% reales (2026-11-24, `invest.js?v=55`, editado directo; marcas `[mod]`):** (1) **Cripto: 30 monedas reales**, sin las inventadas (se quitaron PenguinCoin, FishCoin, SnowmanCoin, FrostCoin, SealCoin, IceCubeCoin y los nombres parodia). Los ids viejos `CRNG`, `CTETA`... se mantienen (partidas guardadas y mercado de usernames `MARKET_COINS` en game.html) pero siempre salen con nombre y arte reales; la 30ª es PENGU (arte `pngu.png`, precios de `d.PENGU` **aproximados**). Salen por año de lanzamiento en todos los modos (`m()`), `cryptoShown: 30`. (2) **Fondos: 30 reales** (VFIAX, VTSAX, Contrafund, SPDR sectoriales, SPY, QQQ, VOO, ARKK, GLD, TLT...), con año de inicio (`ipo`) y `real: !0`; los 14 ids viejos se mantienen. Iconos genéricos `fund-*` (no hay logos). (3) **Acciones: 30 reales** (las 12 de parodia ahora siempre salen como Ford, Coca-Cola, etc.; +Boeing). (4) **Penny: 30 reales** (15 viejos + Polaroid, Bethlehem Steel, LTV, Zenith, Netscape, Xerox, Avon, Enron, WorldCom, Lehman, Circuit City, Borders, Pets.com, Webvan, Bed Bath & Beyond; los 8 últimos con ícono genérico rosa). Los 10 negocios locales ('Bob's Bait & Tackle') siguen. `real: !0` = visible en cualquier modo (en `ee()`); la compra ya no exige el modo Free Life UI para cripto. **Migración:** si una partida vieja tenía monedas inventadas, se venden al valor actual y el dinero va a `state.money` (en `z()`). Bonos NO se tocaron. Probado con un harness en Node (listas por año y modo, 6 años simulados sin precios inválidos, migración); **no visto en el juego real**.

## Cómo está hecho el juego (lo que se averiguó)
- **HTML, CSS y JS puro, escrito a mano.** Sin React/Vue/jQuery y sin bundler (ni webpack, Vite ni imports). Solo un
  **minificador** al final: el script principal es una línea de ~2.09 millones de caracteres con `!0`/`!1` y variables
  de una letra (por eso se prettificó). Los ~108 `.js` son `<script>` clásicos con funciones globales.
- **La UI son strings de HTML:** cada menú es `sList.innerHTML = '<div class="sec">…</div><div class="row">…'`. El
  contenedor es `.phone` (~430px; en modo PC solo lo centran). Variables CSS (`--blue`, `--money`…) en `game.html`.
- **La "piel" de YourLife** (el pingüino azul) la mete `settings.js`: pone la clase `.phone.flui` e inyecta ~21k
  caracteres de CSS (línea 1047), más canvas animados de nieve (`fl-hsnow`, `fl-logsnow`). Se apaga en Settings → UI Pack.
- **Fuentes:** Avenir Next/Mulish/Nunito para el texto, **Molot** para títulos, Courier para recibos. Íconos: emoji de
  Apple en PNG (`emoji/`, `freelife/apple/`) y arte propio en `ui/`, `jobev/`, etc.
- Las claves `bitlifepp-*` del `localStorage` y los nombres de assets (`navbarBitizenSeal.png`, camelCase estilo iOS)
  sugieren que el proyecto nació como clon de BitLife ("BitLife++"). **No mezclar nada de esto con proyectos propios.**
- **Helpers del juego que usan los mods** (números de línea de `game.html`, cambian si se re-prettifica):
  | Qué | Dónde |
  |---|---|
  | `jCard({tag, iconSrc, title, lead, rows, choices:[[texto, fn]]})` popup con decisiones | 48119 |
  | `socSelCard({icon,title,lead,label,opts,btn,onGo})` popup con selector (cierra `screen`) | 24214 |
  | `notice(título, texto, cb, true)` aviso "toca para continuar" · `iosConfirm` · `queuePopup(fn)` | 78022 · 55285 · 78537 |
  | `arrest(delito, [añosMin, añosMax])` flujo completo: cargos, juicio, cárcel · tabla `CHARGES` | 48182 · 47979 |
  | `openActivities` · `openSpecialCareers` · `openOccupation` | 45940 · 15090 |
  | `localPrice(n)` (mínimo 5) · `usd(n)` · `say(texto)` log de vida · `chaChing()` · `renderStats()` | 12102 |
  - `state` = `{age, money, gender, first, stats:{Happiness, Health, Smarts, Looks}, …}`. **Se borra y recarga al
    cambiar de vida** (`Object.keys(state)…delete`, líneas 72554 y 83462), así que cada vida tiene su `state.chess` y
    su `state.gangLife`.

## Receta para hacer un mod nuevo (así se hicieron los dos)
1. Un `.js` en la raíz, todo dentro de un IIFE. **No toca `game.html`.**
2. Registrarlo en `mods.js`, dentro del objeto `e`, con `src` en vez de `flags`:
   `64646464: { name, icon, desc, src: "chess.js?v=1" }`. Con `src`, el juego inyecta el `<script>` solo (`mods.js:80`, la función que hace `createElement("script")`).
3. `boot()` espera (`setTimeout`) a que existan `openActivities`/`sList`/`#ageBtn` antes de engancharse.
4. **Enganche al menú:** guardar la función original, reemplazarla por una que la llame y le inserte una fila con
   `insertAdjacentHTML` (así lo hacen `vampire.js` y nuestros dos mods).
5. **Enganche al Age up:** `document.getElementById("ageBtn").addEventListener("click", () => setTimeout(tick, 0))`.
6. **Estado:** `state.algo`, JSON puro (sin funciones), se crea perezoso para no romper saves viejos.
7. **Textos:** `T("english","español","português")` y correr `add_chess_i18n.py` + `build_i18n.py`.
- **Cómo activar un mod a mano (tests):** `localStorage["bitlifepp-ported"] = JSON.stringify([{code:"64646464",on:true}])`
  y recargar. Para el jugador: Settings → Mods → Redeem Code.
- **Códigos del juego en `mods.js`** (del dev): Military Expanded `06061944`, Extended Hair `24681012`, Tattoos
  `13381313`, Infamous Killers `18880831`, Unlock All Themes `77777777`, Family Pack `01011900`, Infinite Lovers
  `14021402`. **Los nuestros:** Chess Career `64646464`, Gang Bang `13131313`.
  - `window.REDEEM_CODES` se usa en `mods.js:120` pero **no se define en ningún archivo**: un mod podría definirlo
    para que un código ejecute una acción directa.

## Arte propio (`_art-src\`)
- **Estilo:** emoji de Apple (degradado de cilindro, brillo arriba a la izquierda, borde suave y sombra), sin logos ni
  marcas. Todo se dibuja en **SVG dentro de un `.html`** y se renderiza a PNG transparente.
- **Fuentes guardadas:** `bandana-icon.html`, `glock-extended.html`, `glock-switch.html`, `draco.html`, `arp.html`,
  `switch_colors.py`, `make_beard.py`, `full_face.py`, `beard_sheet.py`, `chess-pieces-demo.html`, y los renderizadores
  `snap-transparent.mjs` / `snap.mjs`.
- **Cómo se renderiza:** `node snap-transparent.mjs <archivo.html> <salida.png> <ancho> <alto>` (usa el Brave de debug
  en el puerto 9333 con fondo transparente). Luego se recorta al contenido y se escala a 114px en un lienzo de 120×120
  para que pese igual que los íconos de `special/` y `emoji/` (los scripts de ejemplo están en el historial; son ~10
  líneas de Pillow).
- **Barba (`make_beard.py`):** las caras son **capas blancas de 250×250** que el juego pinta por código
  (`composeFace`, `game.html:13236`: color de pelo para barba/cejas, de piel para la base). Hacen falta 3 PNG
  (`stage3/4/5-facial-hair14.png`, una por edad adulta) recortados con la silueta de cada base.
  - Las mutton chops (patillas) están hechas y en la raíz, **sin instalar**. Para instalarlas: mover los 3 PNG a
    `faces/`, agregar el `14` a `"facial-hair"` de las etapas 3, 4 y 5 en `faces/manifest.js`, cambiar `length: 14` →
    `15` en Shave (`game.html:56153`) y el `13` → `14` en el random de vida nueva (`game.html:14512`).
- **Armas:** Draco = **Micro Draco** (guardamanos de madera clara solo abajo con tope al frente, banana grande, culatín
  marrón); ARP = AR pistol **sin accesorios** (sin mirilla ni brace; tubo de buffer con forro de goma); cargador de las
  Glock con el mismo ángulo en las dos (`skewX(4)`). El usuario pasó fotos de referencia y corrigió dos veces: **no
  agregar attachments que no pidió**.
- **Piezas de ajedrez:** 12 SVG; las del mod están embebidas en `chess.js` (`DEFS`, `pieceSvg`).

## El dev y compartir (situación al 2026-11-21, **OBSOLETA desde 2026-11-25**: el usuario es el dueño y tiene permiso; esta sección se deja solo como historial)
- El usuario **espera el permiso del dev** para poder ayudarlo. Publicó la idea en el canal de ideas del Discord del
  juego (el Discord casi no se mueve). El subreddit sí tiene movimiento (último post ~15 días).
- **Plan:** si en ~1 semana no hay respuesta, subir el post al Reddit (borrador en inglés ya hecho: "full Spanish/
  Portuguese translation + Chess career mod, played locally; if you want them officially I'll hand everything over;
  if not I'll keep it to my copy") con un clip de 20-30 s. Cómo presentarlo: "modeé mi copia local" y abrir con el
  valor (traducción + mod), no con "le hice reverse engineering"; no usar el ángulo de BitLife.
- **Qué se puede compartir y qué no:**
  - El código de los mods (motor, puzzles, carrera, eventos, pandilla) es **original**; igual, se comparte solo con el OK
    del dev. Nunca llevar dentro `game.html`, `mods.js` completo, los emojis/assets ni los diccionarios (`events.tsv`
    contiene todo el texto del dev traducido línea por línea).
  - Para empaquetarlo como userscript (Tampermonkey) haría falta: crear el Web Worker desde un `Blob`, elegir el
    contexto del iframe de itch.io (`html-classic.itch.zone`), probar que los nombres de función coincidan con la
    versión online, meter el diccionario si se quiere ES/PT, y no funciona en celular (no hay consola).
- Si alguien pregunta cómo sacar el código del juego: que le pida permiso al dev; no ayudar a sacarlo ni a empaquetarlo
  como APK para repartirlo. El usuario dijo que un conocido lo quería solo para su propio teléfono: uso personal, nada más.

## Próximos pasos
1. **Esperar el permiso del dev** (ver arriba). No publicar nada del juego mientras tanto.
2. **Segunda pasada de la traducción** (el usuario dijo "lo haremos después"): revisar solo las líneas de freebuff con
   `deepseek-v4.1-flash-free` y fallback a `nemotron-3.5-super-vl-free` (crear `freebuff\backends\models.txt`). Que el
   revisor escriba **solo las líneas que cambia** (más rápido y seguro), guardar el original como `.out.v1.tsv`, aceptar
   cada línea solo si pasa `validate.py`, y revisar también el portugués. **Revisar mojibake al terminar.**
3. **Pandilla:** preguntar si se quitan los rangos propios (Prospect → Boss); íconos del menú de
   armas más claros/grandes; decidir si se cambia el nombre "Gang Bang".
4. **Ajedrez (si el usuario lo pide):** el Mundial hoy es simulado (la partida clave solo existe en los torneos);
   puzzles más difíciles (hoy el máximo es 1935: generar con `gen-puzzles.js` buscando mate en 3 y tácticas de +2000);
   pulir el caballo SVG; notación de jugadas en ES/PT.
5. **Barba:** instalarla si el usuario lo pide (pasos en "Arte propio").
6. **i18n del juego:** primera tanda hecha (ver "Mundial jugable + i18n genérico"); falta lo de la lista "Sigue pendiente".
7. **Limpieza:** borrar los `*.bak` / `*.bak-*` de `i18n\` cuando todo esté estable. Quedaron abiertos un `python -m
   http.server 8765` y un Brave de debug (puerto 9333) de la sesión: cerrarlos si no se usan.

## Casas nuevas (2026-11-24)
- `GRIDS/MAS CASAS.png` y `GRIDS/Casas2.png` (estilo plano, realista) copiadas a `_art-src/grids/CASAS6.png` y `CASAS5.png`, entradas en `grids.json`, cortadas con `split_grid.py --only CASAS` -> `houses/realhome-01..24.png` (01-12 = MAS CASAS, 13-24 = Casas2). Agregadas al final de `HOUSES` en `houses.js?v=3` ($185k-$790k, 3-5 br). Las casas viejas CASAS..CASAS4 (home-/mansion-) ya estaban todas en el juego. **No visto en el navegador.**

## Landlord (2026-11-24, `landlord.js?v=1`, base: script en el bloque `[base]` de game.html)
- Assets -> Landlord (reemplaza la fila "coming soon"; solo propiedades no `old`/`royal`). Estado: `p.ll` por propiedad (`mode` rent/off, `rent`, `tenant`, `issues[]`, `mgr`, `ins`, `lost`, `vacYears`, `earned`) y `state.landlord` (`tickAge`, `total`).
- Cada propiedad tiene switch de rentar/no rentar (se puede cambiar cuando sea). Al Age up (+1.1s): aplicantes (1-3, background check $60, aceptar/rechazar), pago de renta (12 meses menos meses vacíos/perdidos, manager se lleva 10%), mood del inquilino (renta vs mercado `value*0.0055/mes`, problemas abiertos), lease (renovación), se va si está harto, problemas de mantenimiento (14 tipos, algunos ocultos hasta inspeccionar; contratista / handyman barato 70% / DIY 50%; sin arreglar baja condición y puede acabar en demanda), manager e insurance (75% menos daños) por propiedad, renovar (cosmético/mayor).
- Actividades con inquilino: chat (1/año), inspeccionar, desalojar (legal, puede perder), cash for keys. 20 eventos random en `EVENTS` (late, party, noise, pet, upgrade, leaveearly, prepay, burglary, pipe, fire, shady/ilegal con heat de `FL_RICH`, neighbor, code, baby, skip, lawsuit, referral, tax, squatters y vandalismo en vacías). Debug: `FL_LAND.open()`, `FL_LAND.tick()`, `FL_LAND.event(p, "late")`.
- Textos en inglés, sin i18n. Probado con stubs en Node (40 años, 3 casas, todos los eventos y todas las opciones sin errores); **no visto en el navegador**.

## Business Empire + grids de negocios (2026-11-24, `bizempire.js?v=1`, base: script en `[base]` de game.html)
- **Arte nuevo** (cortado con `_art-src/split_blobs.py`, nombrado por Haiku con `_art-src/rename_items.py`; cada carpeta tiene `names.json`, `_preview_120x54.png` y `_numbered-N.png`): `ropa/` (139 prendas), `ropa2/` (12 tiendas de ropa), `tenis/` (70), `comida/` (73 platos), `comida-business/` (12 restaurantes), `concesionarios-business/` (12), `gyms/` (12), `heladerias/` (12), `tiendas/` (12), `joyeria/` (12). Nombres dudosos: ver names.json (ropa 11/13/133, comida 35/41, tenis varios). Los GRIDS originales siguen en `GRIDS/`.
- **Business Empire:** sección arriba de Activities -> Business (año >= 1990, 18+), segunda capa al lado del sistema de negocios por eras (no lo toca). Estado `state.empire` = `{cos[], market[], rivals{}, eco, tickAge, nid}`. 8 industrias (`CATS`: clothing, sneaker, food, icecream, gym, dealer, jewelry, retail) con costo/ingreso/margen por local.
  - **Comprar:** "Businesses for sale" (9 listados al año; locales con dueño o franquicias de marcas reales). Se OFERTA: pedir el asking, 90/80/70%, contraoferta, el vendedor se va tras 3 rondas o 25% al rechazar; franquicias casi no negocian; due diligence (1.5%) revela problemas ocultos (demanda, deudas, ventas cayendo); pago en cash o préstamo 50%. **Crear:** elegir industria + fachada genérica (sin marcas reales) y abrir desde cero.
  - **Crecer:** etapas Local/Regional/National/Global (límite de locales 3/15/60/500; requisitos de locales y reputación), abrir 1/5/10 locales, productos del catálogo (`ropa`, `tenis`, `comida`, con hype que cambia), marketing, rivales (3 por industria) y adquisiciones (antitrust).
  - **Gente y dinero:** 3 directores (ops/marketing/finance, nivel 0-3, pueden irse), préstamos 8%, inversionistas (hasta 50%), IPO (nacional, 15+ locales: precio de acción, vender/recomprar), política de dividendos (0/50/100%), vender la empresa (3 ofertas de compra), bancarrota tras 3 años en pérdida. 20 eventos (`EVENTS`): viral, recall, sindicato, demanda, hackeo, escándalo, proveedor, celebridad, inspección, robo, rival roba director, auditoría, guerra de precios, alcalde, ángel, buyout de TU empresa, premio, desfalco, copycats, activista.
  - Los costos de empresa se pagan primero de la caja de la empresa y luego de tu banco (`payCo`). Dinero en dólares 2026 x `inflFx(1.03)`. Debug: `FL_EMP.open()`, `FL_EMP.tick()`, `FL_EMP.state()`.
  - Textos en inglés, sin i18n. Probado con stubs en Node (35 años, todos los eventos); **no visto en el navegador**. No suma al net worth del juego (`netWorth` es const del base); se ve en Your empire.

## Fútbol: copas secundarias y selección por semanas (2026-11-25, `futbol.js?v=26`)
- **Copa secundaria:** en la temporada, el 40% de las veces reemplaza al derby (`keyMatchStep`): `secondaryCupStep` simula las rondas con plantilla rotada (EFL Cup, Supercopa, Supercoppa, DFB Super Cup, Trophée des Champions, Johan Cruyff Shield, Taça da Liga, o "<liga> League Cup"); si llegas a la final se juega interactiva con `keyMatchStep(f, cfg)` (6 momentos, penales si empata, trofeo `cup`). `keyMatchStep` ahora acepta `cfg {tag, name, opp, lead}`.
- **Selección cada 4 años (Mundial y continental):** `natCallStep` (en `buildSeasonSteps`) ofrece la convocatoria; si aceptas, `f.natCup` queda activo y **Age se bloquea** (aviso "National team duty") hasta que termine el torneo. Se avanza con el botón **1 Week** (`week.js`): cada semana = un partido (`natMatchStep`: grupo de 4, 3 partidos, luego eliminatorias; 3 decisiones tácticas por partido; goles/asistencias tuyos según skill/posición/titularidad). `natFinish` aplica caps, goles, fama, trofeos (copa, Golden Boot/Ball) e historial y desbloquea Age. Si rechazas (`f.natDeclined`) pierdes fama y no se simula el torneo. `simulateNational` ya no simula el torneo si hay `natCup`/rechazo/`natDone` ese año.
- **Label:** en la card de momentos, "Minute" ahora dice "Competition/Competición" (`ui.tsv` + `build_i18n.py` corrido).
- Textos nuevos en inglés, sin traducir. **Sin probar en el navegador.**
- **Recibimientos en clubes grandes (2026-11-25, `futbol.js?v=27`):** al fichar por un club con `rep >= 82` (transferStep: ofertas y "Pídele ofertas a tu agente"), después de la card "Transfer complete" sale `welcomeStep` con una bienvenida distinta cada vez (`WELCOMES`: presentación en el estadio, aeropuerto, rueda de prensa, vestuario, número de camiseta de una leyenda, hinchas del club anterior, derby si es misma liga, cena con el dueño (rep 88+), plan del míster, visita a la cantera); no repite la anterior (`f.lastWelcome`). La liga pone el ambiente (`WELCOME_FLAVOR`: lluvia en Inglaterra, bengalas en Italia, barra en Argentina...). Cada opción mueve fama/hype/club/coach/felicidad con algo de riesgo. Textos en inglés, sin traducir, sin probar en el navegador.

## Penales jugables (2026-11-25, `penalty.js?v=1` base, `futbol.js?v=28`)
- **`penalty.js`:** minijuego en canvas (overlay fijo 960x600 escalado, `FL_PEN`). Tu jugador de espaldas (camiseta con tu apellido y número, color por club), portero en el arco, estadio con hinchada alrededor (como el boceto), pelota con perspectiva y red que se mueve. **Haces clic donde quieres tirar**: tu skill (`skill` 0-100) decide cuánto se desvía el tiro (el círculo punteado del retículo muestra la zona de error); las esquinas son más difíciles de atajar pero pueden dar en el poste/travesaño o irse afuera. El portero (`keeper` 0-1) a veces te lee (5-25%) y se lanza; si su zona cubre el tiro, ataja. APIs: `FL_PEN.kick({...,onDone})`, `FL_PEN.shootout({myTeam,oppTeam,oppRate,keeper,onDone({won,my,opp})})` (tanda de 5 + muerte súbita, tú pateas los tuyos y el rival se simula), `FL_PEN.practice({...,onDone({scored,total})})`. El botón de arriba a la derecha salta/simula.
- **Dónde se usa (fútbol):** tanda de penales en la final de copa secundaria (empate en `keyMatchStep` con `cfg`), en las eliminatorias de la selección que terminan empatadas (`natMatchStep`), y **Penalty practice** en las Acciones del hub (5 tiros; con 3+ da form/felicidad; guarda `f.penBest`). Si `FL_PEN` no carga, cae a moneda. El `contPlay` de la copa continental sigue resolviendo penales en automático.
- Textos ES/PT en `i18n/ui.tsv` (23 entradas). **Sin probar en el navegador** (solo `node --check`): ajustar balance en `decide()` (ruido `noiseFor`, `reads`, radio `R` del portero).
- **Test de penales en Node:** `node dev/pen_test.js C:/Users/Mxzzy/Downloads/FreeLife/penalty.js` (DOM y canvas falsos; Monte Carlo de `FL_PEN._decide`, 5 tiros completos por el loop de frames, tanda, práctica y botón Skip). Encontró un bug real (TypeError al cerrar el overlay tras el último tiro) ya corregido. Balance actual (aimando bien, keeper 0.5): centro ~76% gol; esquinas 62-76% según skill (skill 50 ~52%, riesgo de poste/afuera); `noiseFor` = (0.55+(100-skill)/55)*12.

## Arreglos de fútbol (2026-11-25, `futbol.js?v=29`)
- **Prisión:** `runSteps` corta la temporada si `state.prison` (ya no salen eventos/momentos/traspasos a mitad de flujo), `eventStep` no sale preso y `natBlocking` ignora la selección si estás preso.
- **Agente que no para:** `f.joinedYear`/`f.clubTrack` (se fijan en `joinClub` y en `beginSeason` si el club cambió; saves viejos = +5 años). `transferStep` no ofrece nada hasta 2 temporadas después de fichar (salvo contrato vencido o club/míster < 25), y `agentCard` también lo bloquea.
- **Selección:** la convocatoria ahora es un **anuncio previo** (`natCallStep` + `natSelectP`: skill, forma, fama, caps, confianza del míster). Puedes quedar fuera ("left out", sin torneo, -felicidad) o ser convocado (primera convocatoria incluida), y solo entonces se juega por semanas con Age bloqueado. `f.natHandled === year()` evita que `simulateNational` simule el torneo solo. Un `natCup` de otro año se descarta.
- **Penales en eventos:** las opciones `pen: true` de los momentos (Take it, Panenka, Put your hand up first, Take the fifth x2, Take the last penalty) abren el minijuego (`FL_PEN.kick`, presión 0.85) y el resultado decide gol/fallo; `panenka: true` hace que el portero se tire casi siempre (28% se queda) -> tirar al medio. Si `FL_PEN` no carga, tira la moneda como antes.
- **Arte nuevo de penales (2026-11-25, `penalty.js?v=2`, hecho con Opus 5.5):** estadio y jugadores rehechos en vector (1500 líneas): tribuna de fondo con techo y focos, laterales en ángulo con 25 filas/pasillos/barandas y hinchas como mini-personajes (piel variada, camisetas lisas/rayas/bufanda, gorras, banderas), césped con franjas, vallas genéricas, banquillos, viñeta, red con volumen, tirador de espaldas COMPLETO (pies en y~584) con carrerilla/patada/celebración, portero ~85px que espera, se estira y cae. Lo estático (fondo, multitud en 2 versiones normal/celebrando, vallas/techo/focos) se pinta una vez en canvas offscreen y por frame solo se dibuja la multitud en 30 bandas desplazadas (ondea; salta con bengalas/confeti al gol; se hunde al fallo). `G`, `SPOT`, `KEEPER_BASE`, la API y la lógica no cambiaron; el aviso "Click where you want to shoot" subió a y~64-96. `dev/pen_test.js` ahora toma solo el primer canvas como el del juego. Sin verificar: 60fps en móvil, DPR alto y la animación de bandas en movimiento.
- **Age en gris en el campamento (2026-11-25, `futbol.js?v=30`):** mientras `natBlocking(f)` (selección en campamento, partidos semana a semana) el botón `#ageBtn` lleva la clase `fl-natlock` (gris, opacidad .55, cursor not-allowed); se sincroniza cada 400 ms y al unirse/terminar (`FL_FUT_SYNC`). Al tocarlo sigue saliendo el aviso "National team duty".

## Garage + salir con alguien (2026-11-25, `garage.js?v=1`, base)
- **Garage:** Assets -> Garage (reemplaza las filas sueltas de carros "Vehicles" y la fila de elite-life; también activa el placeholder "Race Car Garage" del modo BitLife y el "Garage" del menú de cada carro, que decía coming soon). Pantalla con 4 secciones: **Cars** (`state.cars`, menú nativo `openCar`), **Motorcycles** (`eliteVehicles` kind `sportbikes`), **Marina** (`boats`) y **Hangar** (`planes` + `helicopters`), cada una con su fila "Visit ..." a la tienda (`FL_ELITE_LIFE.openVehicleStore`). Los datos no se movieron.
- **Mismas actividades que un carro** para motos/barcos/aviones/helis (`openVehicle`): View, Abandon, Drive (Ride/Sail/Fly, 1 vez al año, pide licencia con `FL_LICENSES`), Garage, Gift (`victims()`), Maintenance (2% del precio, +10-20 cond), Pay Off (gris sin préstamo, igual que los carros), Repair, Sell (dealer 85%, anuncio a 95-135% con ofertas/sin respuesta, mercado negro) y Scrap (8%).
- **Llevar a alguien:** al usar cualquier vehículo (carros incluidos, `openCar` envuelto) sale "who comes along?" con pareja (`state.lovers`), familia (`parents`/`family`, 4+ años) y amigos (`friends`), según asientos libres (`cap` en elite, `seatsOfCar(type)` en carros) y "Take the whole crew" si hay 3+ asientos. Efecto: felicidad +6-12 (solo: +3-7), relación con cada acompañante +4-10 (10% de discusión: -2 a -5) y una escena distinta según pareja/familia/amigo y tipo de vehículo (`SCENES`).
- Probado en Node: `node dev/garage_test.js C:/Users/Mxzzy/Downloads/FreeLife/garage.js` (menús, todas las actividades, ventas, regalo, scrap, salir con pareja). El flujo del carro (wrapper de `openCar`) y todo lo visual **no se vieron en el navegador**. Textos en inglés, sin i18n.

## Selección = país donde naciste (2026-11-25, `futbol.js?v=31`)
- Bug: `state.country` es el país donde vives ahora y es un CÓDIGO ("us", "ar"), pero fútbol lo usaba como nombre; `flagFor` caía a la bandera del CLUB y la selección salía con nombre/fuerza equivocados. Ahora `bornCode()` (`state.birthCountry`, se fija pronto; si la vida ya emigró usa `state.immigration.from`) y `bornName()` (alias: United Kingdom -> England) deciden la selección: bandera, nombre, fuerza (`natPower`), rivales del grupo (se excluye tu país), trofeos ("<país> · World Cup") y la pantalla National team (con aviso "solo puedes jugar por el país en el que naciste"). Emigrar o fichar por un club de otro país ya no cambia tu selección. `schoolClub` (liga/ciudad inicial) sigue usando `state.country`.

## joyas2 (2026-11-25)
- `_art-src/grids/joyas2.png` (hoja de ~200 piezas sueltas) cortada con `_art-src/split_joyas2.py` (blobs; la banda de lentes usa un umbral más bajo) a `jewelry/` como **197 PNG sin guion**, por tipo y número: `stud1-11`, `hoop1-11`, `earring1-22` (colgantes), `charm1-22`, `grill1-33`, `chain1-16`, `pendant1-40`, `shades1-26`, `crown1-8`, `ring1-2` (aros dorados), `headwear1-6` (durags, bandanas, gorra). Reordenar con `python -I _art-src/split_joyas2.py <carpeta_salida> 2` (genera `_sheet.png` con los nombres). Los lentes totalmente negros sobre fondo negro (`shades3`, `shades4`, `shades11`, `shades14`) salen como siluetas sin detalle. **Todavía no están conectadas al juego** (`jewelry.js`).

## Accessories+ (2026-11-25, `accessories-plus.js?v=1`, base)
- Activities -> Accessories (y Menu -> Accessories) ahora, debajo de eyewear/scars/headwear, tiene **Jewelry** y **Barbershop**. **Jewelry** (`FL_ACCPLUS.openJewelry`): ves lo que llevas puesto por zona (Neck, Wrist, Grillz, Ears) con la imagen de la pieza, tocas una zona y eliges de las joyas que tienes (`state.jewelry` filtrado con `FL_JEWEL_WEAR.slot`), o "Take it off"; "Take off everything" quita todo. El avatar se actualiza al instante (usa `FL_JEWEL_WEAR.toggle`). **Barbershop:** Barber/Hair Stylist (14+), Dye Job (18+) y Shave (16+) abren `SALON_OPEN[...]` con el precio de `barbershop.js`, más un acceso al Salon & Spa completo. Probado en Node con `node dev/acc_test.js C:/Users/Mxzzy/Downloads/FreeLife/accessories-plus.js`; **no visto en el navegador**. ES/PT en `i18n/ui.tsv`.
- **Espejo (2026-11-25, `accessories-plus.js?v=2`):** Accessories tiene arriba "Mirror": pantalla MIRROR con tu avatar **grande y en vivo** (canvas 520x520 que redibuja cada frame el avatar del perfil, que ya lleva pelo, barba, tinte, eyewear, headwear, cicatrices y joyas), tu nombre y edad, y filas con lo que llevas (Eyewear/Scars/Eye Patch/Headwear abren el picker del juego; cada zona de joyas abre su selector; Barber). Las pantallas Jewelry y de cada zona también muestran el espejo arriba, así ves cómo te queda al elegir. Limitación: el avatar del juego es 250x250, el espejo lo amplía (~2x) y se ve algo suave. `node dev/acc_test.js ...` prueba el flujo; no visto en el navegador.

## Barbero con todos los peinados (2026-11-25, `barber-all.js?v=1`, base)
- El Barber/Hair Stylist (y Barber Expanded) ahora muestran **una sola lista**: "Your normal hair" + todos los peinados base de tu género y etapa de vida (`hairList(stage)`; hombres y mujeres ya tenían arte distinto) + todos los del Hair Pack (`HAIR_PACK`, 104) que van con tu género. Se hace envolviendo `salonPreview` (después de barbershop.js, así el precio y la regla "mismo look = sin cobro" siguen). Etiquetas de género en `FL_BARBER_ALL.TAG`: solo hombres `hhc1-5`, `short1-5`, `buzz`, `nh01/04/07/09/10/19/23`; solo mujeres `nh14/16/17/18/21/22/24` y `rainbow-long`; el resto (tx01-48, dreads, emo, braids, west1-10, long1-3, nh02/03/05/06/08/11/12/13/15/20) es unisex. Resultado: hombre = base + 96 del pack; mujer = base + 86. Elegir uno base pone `mod.style` y limpia `mod.xHair`; elegir uno del pack pone `mod.xHair`. Probado en Node con `node dev/barber_test.js C:/Users/Mxzzy/Downloads/FreeLife/barber-all.js`; no visto en el navegador. Para mover un peinado de género, editar `TAG`.

## Grillz en la joyería y cadenas más grandes (2026-11-25, `jewelry.js?v=18`, `jewelry-wear.js?v=3`)
- **Grillz a la venta:** los 33 diseños de `jewelry/grill1..33.png` (de joyas2) se agregaron al catálogo `plain` de `jewelry.js` como `noun: "grillz"` con nombre por material, detectado por color de cada imagen: Gold (7, $1.2k-25k), Iced Gold (6, hasta $450k), Two-Tone (6), Silver (7, $300-4k), Diamond (2), Black Diamond (1), Ruby (1), Emerald (1), Emerald Gold (1), Ruby & Sapphire (1) — "<nombre> No. N". Con peso ~1 cada uno salen ~6-8 en las ~55 piezas que tiene la joyería cada año; el stock guardado (`state.jewelStock`) se regeneró subiendo su versión a 6. Al ponértelos (`FL_JEWEL_WEAR`, zona mouth) `drawGrillz` ahora pinta rojo/verde/azul/negro según la piedra del nombre (antes solo oro/plata/diamante).
- **Cadenas:** `drawChain` dibuja la cadena ~2.7x el ancho del cuello (antes 1.55x), empezando un poco más arriba, para que rodee el cuello; pendants/dijes 2.0x y chokers 1.9x.

## Vacaciones cortas en jet/avión/helicóptero (2026-11-25, `garage.js?v=2`)
- En el Garage, **Fly** de aviones y helicópteros pregunta "where to?": vuelo local (como antes) o **"Short vacation abroad"** (`openTrips`): lista los 8 países más cercanos al tuyo (`state.country`) con bandera, distancia, horas y costo; los que pasan del alcance salen en gris ("out of range"). Alcances: helicóptero 900 km, avioneta/seaplane/turboprop 1800 km, jet 4000 km. Distancia = capital a capital con una tabla de coordenadas de los 199 países (`GEO` en garage.js); se excluyen países de riesgo (kp, af, ss, sy, ye, so, ly). Costo = combustible por km (heli $11, avioneta $14, jet $32, x `inflFx`) + tasas.
- **Es una vacación de verdad:** exige 18+, cuenta como la vacación del año (`state.vacationAt`, compartida con Activities -> Vacation: si ya tomaste una dice "already went on vacation"), da felicidad (+2-5 y lo de llevar gente +6-12) y salud (+0-3), 65% de disparar un momento de vacaciones del juego (`tripMoment`: accent / disconnected, `state.tripSeen`), y puedes llevar a pareja/familia/amigos (relación +4-10, 10% discusión). 12% de imprevisto (clima -> desvío y gasto extra, aduana -> multa, aviso del motor -> -10 de condición). Lleva registro: `state.visited` (países, se muestra en el Garage) y `state.trips`.
- Probado en Node (`dev/garage_test.js`: jet y helicóptero, alcance, bloqueo del segundo viaje del año); no visto en el navegador.

## Pantalla negra al cargar (2026-11-25)
- **Reporte:** jugadores nuevos entrando por https://lordcrazyeroflife.github.io/NaBlooLife/ ven la pantalla negra/vacía y no carga (la mayoría de navegadores). El sitio sirve todo con 200 (game.html 3.7 MB, packs, sw.js).
- **Causa más probable (análisis estático, no se pudo reproducir: el Brave headless no saca capturas ni del sitio en vivo ni del local):** `game.html` tenía el `<link rel="stylesheet">` de **Google Fonts** en el `<head>`, que bloquea el render y **retiene la ejecución de todos los scripts siguientes**. Con `fonts.googleapis.com` lento, bloqueado o con paquetes descartados (redes de colegios/trabajo, ISP, algunas regiones, DNS) la página se queda vacía hasta el timeout del navegador, que puede ser enorme.
- **Arreglos aplicados:** (1) fuentes no bloqueantes (`preconnect` + `media="print" onload="this.media='all'"` + `<noscript>`); (2) watchdog al inicio del `<head>` de game.html: si pasan 20 s sin `DOMContentLoaded`, overlay con "Reload" y "Repair and reload" (borra `bitlifepp*`/`fl-*` de localStorage, la IndexedDB `bitlifepp`, service workers y caches; pide confirmación); (3) IndexedDB con timeout de 5 s y `onblocked` en `livesDb()` (game.html) y en `x()` (auth.js), sin dejar la promesa rechazada cacheada; (4) `index.html`: espera máx. 4 s al service worker y entra al juego igual (si no hay SW y no estás en un iframe, también entra); (5) `sw.js`: si falla bajar `packs/index.json` el SW se instala igual y las imágenes van por red normal. **Hay que pushear para que los jugadores lo reciban** (index.html, game.html, auth.js, sw.js).
- Pedir al que siga con negro: F12 -> Network, qué petición queda en pending (sobre todo `fonts.googleapis.com`), y la consola.

## Cadenas que rodean el cuello, v2 (2026-11-25, `jewelry-wear.js?v=4`)
- Las capturas del usuario seguían mostrando cadenas/pendants chicos y colgando bajo la barbilla: el arte de la cara trae su PROPIO cuello (~60 unidades de ancho, mucho más que el `neckW` calculado del ancho de la cara) y los pendants (`pendant-*`, `pendant1..37`) son piezas chicas con una cadenita corta arriba, así que ningún multiplicador las hacía rodear el cuello. Ahora `drawChain` **mide el cuello real** (`measureNeck`: recorre una fila bajo la barbilla del canvas ya dibujado mientras el píxel sea piel `info.skin`; si falla usa la estimación vieja) y: piezas enteras (cuban, chains, chokers, collares `encrusted`/`anc-`, razón alto/ancho <= 0.96) se dibujan a ~2x el cuello (choker 1.75x, collares 2.1x); **pendants**: se dibuja una cadena de verdad alrededor del cuello (curva en V con eslabones, color del metal de la pieza `metalCol`) que arranca junto al cuello y se abre sobre los hombros, y el pendant cuelga de la V (ancho >= 44 y >= 1.55x medio cuello, tope de alto según el espacio). No se pudo ver en el navegador.
- **Grillz distintos (2026-11-25, `jewelry-wear.js?v=5`):** antes `drawGrillz` dibujaba siempre los mismos 6 dientes con código (solo cambiaba el color), así que los 33 diseños nuevos se veían igual al ponértelos. Ahora los diseños `grill1..33` se dibujan con su propia imagen sobre los dientes (ancho = 0.40 x ancho de la cara x escala, alto por proporción, centrado en la línea de la boca; solo con cara feliz, como antes). Los 3 originales (`grillz-gold/silver/diamond`, iconos cuadrados) conservan el dibujo por código. Si la imagen queda grande/chica o alta/baja en la boca, ajustar `0.4` y `h * 0.4` en `drawGrillz`.

## Sesión 6 (2026-11-25): crash br/mx, APK liviano, Time Machine, toggle mental health
- **Crash en países con símbolo `X$` (Brazil, México, etc.):** `curFix` en `game.html` (observer de moneda) reemplazaba `$5` por `R$5`, que seguía
  matcheando `\$\d` y se re-disparaba infinito. Fix: lookbehind `(?<![A-Za-z$])` en el regex.
- **Build mobile** (`mobile/prepare-www.mjs`): flags `--webp` (PNG -> WebP **manteniendo el nombre .png**, el WebView lee los bytes; lossless <24KB, lossy q90 el resto,
  usa `sharp`) y `--ogg` (WAV -> OGG Vorbis + reescribe `.wav`->`.ogg` en los textos del www). **`--ogg` SOLO en Android**: iOS no reproduce Vorbis.
  Excluye los scratch `_numbered-*`/`_preview*`. Resultado medido: www 368 MB -> 214 MB (PNG 265->135 MB, WAV 34->4 MB). `mobile/www|android|ios` en `.gitignore`.
- **Time Machine empeoraba Mental Health/Insanity:** `timeTravel` hace `log.innerHTML = t.log` y los observers del log (`MIND_TRIGGERS` en game.html y el de `mentalhealth.js`)
  re-aplicaban cada muerte/despido/trauma viejo. Fix: flag `window.FL_RESTORING` (800 ms) que ambos observers respetan. Otros mods con observers de log podrían tener el mismo problema.
- **Toggle `noMentalHealth`** (Mods > Mental Health): `mindYear`/`mindBump` no-op, sin barras Mental Health/Insanity, sin Therapy, y `mentalhealth.js` `active()` = false. `window.FL_noMH()`.
  `ward.js` no está gateado (solo se llega vía ins alto, que no sube con el toggle).
- Harness de pruebas: jsdom en `%TEMP%\jsd` (no está en el repo); necesita `structuredClone` y stubs de canvas/ResizeObserver.
- **SVGs:** los que vivían en carpetas ya raster se pasaron a PNG (sharp) y se borraron: `networks/*` (15), `serial/organs/{kidney,liver,lungs}`, `crime/idcard`, `social/discord-verified`. Quedan 44 SVG en `social/discord/` y `social/roblox/` (recreaciones de UI sin raster al lado). Refs actualizadas en `game.html`, `serial-killer.js`, `acting.js`; `packs/index.json` quedó desactualizado (el SW cae a red).
- **Crypto (invest.js):** la tabla `d` (precio de fin de año real por moneda, de memoria, 2009-2025) ahora aplica en **todos los modos** (antes `q()` salía si no era Free Life UI, y en modo clásico BTC era random). Desde 2026 sigue la simulación por estados (normal/rally/mania/crash...), pero las monedas grandes (`BIGCAP`) ya no pueden morir (`failed` -> `crash`) y tienen techo/piso suave (`coinLimits`/`softLimits`: ~15x y ~2% de su ATH real) pa q BTC no llegue a millones. Granularidad anual: dentro del año el camino es un puente aleatorio entre fines de año.

## Sesión 6 (cont., 2026-11-25): grids nuevos, pelo, VIP islas, devtools
- **Grids nuevos separados** (los de `GRIDS/` en la raíz ya estaban procesados; son copia/archivo): `ISLAS2.png` -> `islands/island-01..12-*` (384px) y `ISlas1.webp` -> `islands/wild-01..12-*` (194px, fuente chica); `Mas motos`, `dirtbikes` y `pasolas` -> `bikes/moto-*`, `dirt-*`, `scooter-*` (36 PNG, 300px; **sin conectar** a `bikes.js`/garage); `grills2` -> `jewelry/grill34..45`; `1 DIENTE` -> `jewelry/tooth-01..12-*` (**ni grills ni teeth están en el catálogo** de `jewelry.js`); `medallas` (84) -> `medals/medal-01..84.png` sin nombrar y sin conectar. Todo con `split_grid.py` (entradas nuevas en `grids.json`) salvo medallas: `_art-src/split_medals.py` (las filas no son uniformes, corta por valles de proyección). `medallas de guerra.png` es idéntica a `medallas.png`.
- **VIP (`vip.js`):** sección "Islands · Coming Soon" con fila "Islands Expansion" (logo = `island-01-modern-villa`) + 12 Private + 12 Wild, todas grises con etiqueta SOON; no se pueden desbloquear (no están en `IDS`). `FL_VIP.islands` tiene la lista.
- **Pelo fuera de lugar (`hairfit.js`, enganchado en `composeFace` justo después de cargar las capas):** los `nh01-24` tenían la línea del pelo a la altura de los ojos. `FL_HAIRFIT(v, k, stage)` mide la cabeza (tope de `stageN-base`) y los ojos (tope de `stageN-eye-base`) de la cara actual (etapa/género), mide cada capa `hair/*` (tope y hairline por las columnas centrales) y, si la hairline cae más de 17% del tramo cabeza->ojos por debajo de su sitio (63%), aplasta la corona y sube el resto; si el pelo llega al borde inferior (largos) estira la parte baja para no dejar un corte plano. Los pelos que ya están bien no se tocan. Ajusta 17 de los nh y 7 tx (tx13, 21, 23, 25, 32, 33, 46); funciona igual para pelos nuevos. Probado con PNG reales y `node-canvas` (px de pelo sobre ojos: 15,948 -> 0 en nh01). La lógica pura está en `plan()` (exportada pa Node).
- **DevTools con Ctrl+Shift+Alt+S (Ctrl+Shift+S plano NO se toca: es el de capturas de pantalla) (`devtools.js` + `dev/eruda.js`):** JS no puede abrir el F12 del navegador, así que carga Eruda (devtools en la página, MIT) la primera vez que se usa. `dev/` no va al APK; allí solo avisa que no está.
- **Volver al mismo lugar (Mind & Body):** `mbRes` (game.html) ya no cierra toda la pantalla al terminar una actividad de Activities > Mind & Body (Martial Arts, Gym, Library, Walk...). Se queda Mind & Body abierto y al tocar el resultado reabre la misma tarjeta (`window.__mbKey`, con el mismo estilo/instrumento elegido); la X de la tarjeta vuelve a la lista de Mind & Body. Si la actividad trae su propio `after` (ej. cita en la biblioteca) se respeta ese y se comporta como antes. Otras actividades fuera de Mind & Body no se tocaron.
- **Botón Back (tab cyan "Atrás") vuelve a la pantalla exacta:** antes `back-tab` (game.html, junto a `Activities`/`Relationships` tabs) solo hacía click en el tab raíz (Activities). Ahora guarda el recorrido de filas que tocaste (`trail`: dataset + texto de la fila; solo taps que cambian `sTitle`, así que filas de comprar/toggle que re-renderizan la misma pantalla NUNCA se reproducen; la flecha `<` hace pop) y al pulsar Back reabre el tab y reproduce los taps con datos frescos. Se limpia al tocar otro tab o al hacer Age/1 week/Time machine. Ej.: Activities > Salon & Spa > Tanning (acción) > Back = Salon & Spa. Si no encuentra una fila en el replay se queda en el nivel que alcanzó. Reemplaza lo de Mind & Body de arriba solo en parte: el cambio de `mbRes` sigue activo.
- **Find Heirloom, la oscuridad se movía con la linterna:** `mobile-fix.js` (`.jcw img,.ev img,.jm img{max-width:100%}`) recortaba a 100% el anillo `.hl-scene .ring` (que es `width:230%` a propósito, así cubre toda la escena sea donde sea la linterna). Fix: `.jm .hl-scene img{max-width:none}` y `mobile-fix.js?v=3`. Cuidado: esa regla global de `max-width` puede romper cualquier otro minijuego con imágenes absolutas más grandes que su contenedor.
- **Pelo "rectangular" (dread-*, emo-pink1/2, braids-bw, rainbow-long):** el recorte del 24-nov borraba el alfa dentro de la silueta de la cara con un corte recto en y=194 (borde plano + esquinas cuadradas = hueco rectangular). `_art-src/fix_hair_face.py` los regenera desde `_art-src/hair-orig/` con línea de pelo en arco (alta al centro, baja en las sienes), borde irregular, esquinas redondeadas y borde suave. Sobrescribe `hair/<nombre>-hair-base.png`. Cache de capas `hair/` subido a `?v=10`. No tocan a `hairfit.js` (esos pelos no se ajustan). Los `nh`/`tx` aplastados por `hairfit` pueden verse planos arriba; si molesta, afinar `HAIRLINE_AT`/`MIN_SCALE` en `hairfit.js`.
- **Motos nuevas conectadas + showroom rotativo (`elite-life.js`):** los 36 PNG de `bikes/moto-*` (12), `dirt-*` (12) y `scooter-*` (12) están en `CATALOG.sportbikes` (mismo `kind` que las sportbikes, así el Garage las pone en su sección Motorcycles y el flag `type` = moto / dirt bike / scooter). El dealer ahora se titula MOTORCYCLES. Precios base de catálogo (el multiplicador x2.25 de vehículos de la línea ~978 se aplica a todos). **Stock por año para TODOS los dealers (motos, barcos, aviones, helicópteros):** `showroom(kind)` guarda en `state.eliteStock` una selección random distinta cada año (16 motos; ~55% del catálogo en los demás); 28% usados (condición 45-88%, más baratos; al comprarlos la moto queda con esa condición) y el resto nuevos con el precio moviéndose -6%/+8%. Se borra el stock al hacer Age. Comprar quita ese modelo de la lista del año.
- **Bloqueo de atajos quitado (game.html):** el juego traía dos listeners que hacían `preventDefault`: uno en el `<head>` (clic derecho + F12 + Ctrl/Cmd+Shift/Alt+I/J/C/K + Ctrl+U + Ctrl+S) y otro cerca de `blReload` (cualquier Ctrl+S, o sea también Ctrl+Shift+S). Se quitaron las teclas y en escritorio vuelve el clic derecho; el menú contextual sigue bloqueado solo en pantallas táctiles (`pointer: coarse`) por el long-press. Se mantienen `selectstart`/`dragstart` y `user-select:none` (no son atajos). Con F12 ya funcionando, `devtools.js` (Eruda, Ctrl+Shift+Alt+S) queda como extra, sobre todo para móvil/webview.
- **Varias del mismo modelo (`elite-life.js?v=8`):** el showroom ya no excluye lo que posees; cada listado del año trae unidades (`qty`: nuevos 1-3, usados 1) y comprar gasta una unidad, así que puedes tener 2+ motos (o barcos/aviones/helis) del mismo modelo. La fila muestra `N available` y `you own N`. Si se agotan los listados dice `Sold out for <año>`. Cada compra es un objeto aparte en `state.eliteVehicles` (el garage usa identidad de objeto, así que vender una no toca la otra).
- **"Error / Error" quitado + Islands en el menú (`vip.js?v=5`):** `comingSoon()` (game.html) mostraba literalmente "Error / Error" en cualquier placeholder: ahora dice "Coming soon - This isn't available yet". El caso típico era **Main Menu > My Stuff**, que no tenía handler: ahora abre la pantalla VIP (`FL_VIP.open`). El menú principal tiene una fila **Islands (Soon)** con `islands/island-01-modern-villa.png` de ícono que abre VIP y salta a la sección "Islands · Coming Soon" (25 filas SOON). Los links de Community también usan `comingSoon` (ahora sin 'Error'). `Job Packs` sigue con su aviso propio.
- **Champions jugable (`futbol.js?v=32`):** la copa continental (`f.cont`, creada al final de la temporada) ya no es un botón que simula: **Age queda bloqueado** (`contBlocking`, igual que el campamento de selección; botón gris + aviso) y **cada 1 Week es un partido que juegas** con `keyMatchStep` generalizado (`cfg.n` decisiones, `cfg.variety`, `cfg.group`, `cfg.onFinish`): grupos 3, octavos 3, cuartos 4, semis 6, final 6 (`CONT_MOMENTS`). Además de 'Your chance' y 'Danger' hay **penalti que tiras tú** (`FL_PEN.kick`; portero: penalti en contra) y **tiro libre**. Empate en eliminatorias = tanda (`penaltyShootout`); en grupo se permite el empate. `contFixture`/`contSettle` mantienen tabla y bracket (rival fijo en `f.cont.cur`); `contPlay` queda como simulación para saves viejos con una copa sin terminar de otro año (se resuelve sola). Campeón: trofeo + $8M. Exportado en `FL_FUTBOL.cont` (make/play/fixture/blocking). Probado en jsdom: 3/4/6 decisiones por ronda, campeón, y Age se libera al terminar.
- **Islas en Shopping (`elite-life.js?v=9`, `garage.js?v=4`, `vip.js?v=6`):** nuevo dealer **Archipelago Estates** (`CATS.islands`, Shopping > Garage, Marina & Hangar) con las 24 islas de `islands/` (12 privadas: villas, manor, faro, granja, golf...; 12 salvajes) en `CATALOG.islands` (precio base $0.9M-$18M, el x2.25 global de vehículos se aplica igual; `speed` = acres, `cap` = invitados). Mismo showroom rotativo por año (13 de 24, 28% 'Run-down' con condición menor, cada isla es una sola unidad), pero se puede comprar una isla repetida otro año. Se guardan en `state.eliteVehicles` con `kind:'islands'`; el Garage tiene sección **Islands** (visitar con compañía, regalar, vender, abandonar; sin Scrap; sin licencia) y la fila de tienda. VIP y menú principal dejaron de decir SOON: las filas abren el showroom (`FL_ELITE_LIFE.openVehicleStore('islands')`).
- **Relojes nuevos, grillz de un diente y carros JDM (2026-11-25):** `relojes2.png` -> `jewelry/watch-13..24-*` (12) y **agregados** al catálogo de `jewelry.js?v=19` (nombres genéricos, sin marcas, tipo `watch`). `1 DIENTE` -> `jewelry/tooth-01..12-*` **agregados** como `grillz` ("... Tooth Cap", $300-$400k); `jewelry-wear.js?v=6` los dibuja como UNA pieza pequeña sobre un diente frontal (`A.width*0.075`), no en toda la boca. `JDM.png` (60 carros de drift) -> `cars/jdm-01..60.png` (240px) **solo separados, sin conectar**; las filas no son uniformes, se cortan con `_art-src/split_jdm.py` (valles de proyección, como medallas). `grills2` (grill34..45) sigue sin conectar.
- **Carrera especial Drift Boy (`drift.js?v=1`, mod `drift-boy` en `modloader.js`):** Occupation > Special Careers. Estado `state.drift`; usa `state.cars` (cualquier carro; tuneo en `car.dt` = tires/susp/diff/turbo 0-5; rating por tipo + JDM + `dbonus` + cond). Etapas: Street Racer -> Local Circuit (4 wins + 20 rep) -> Pro (12 wins + 50 rep + sponsor) -> Drift King (2 títulos + 85 rep). **Batalla tándem** (`tandem()`): corrida de líder + corrida de perseguidor, 2-3 decisiones c/u (entrada, mid-corner, transición...; 3 opciones: agresiva/media/segura con riesgo de choque), jueces puntúan Angle/Speed/Line con pesos por escenario, empate = One More Time. Escenarios: Port Lot, Tokyo (Daikoku/Shuto), Local Circuit, Hakone, Fuji. 15 actividades (entrenar: parking, track day, simulador, replays, reflejos/físico; carro: tuneo, mecánico que da descuento o estafa, garage/chasis con 3 starters Silvia S15 / AE86 / RX-7 FD + clásicos japoneses con stock anual; calle: car meet (sponsor/rival/sensei/policía), takeover (fama + heat), clips (followers); carrera: sponsors con negociación, equipo (copiloto/mecánico con sueldo), viaje a Japón competir/entrenar). 8 actividades tienen 5 resultados aleatorios, tuneo 5 variantes, consejo del mecánico 5, entrenar en Hakone 5; **43 eventos anuales** (`EV`). Límite 7 actividades por año; torneo 1 por año (octavos/semis/final). Heat > policía (persecución, multa o `arrest`). **Los sprites de los 3 starters y los clásicos son `cars/jdm-NN.png` elegidos a ojo del grid JDM (los nombres pueden no coincidir con la imagen)**; el resto de los 60 JDM sigue sin conectarse a dealers. `special-life.js` ahora cuenta 'Drift Boy' en la regla de una sola carrera. Probado una vez en jsdom (cargar, unirse, todas las actividades, batalla, tick anual, 0 errores).
- **Tienda JDM Mods (`jdmmods.js` + `jdmmods-data.js`, mod `jdm-mods` en `modloader.js`):** fila nueva en **Shopping** (antes de Real Estate Brokers). **Carros de drift:** los 60 `cars/jdm-NN.png` ya se venden aquí (nombres elegidos a ojo: Silvia S13/S14/S15, 180SX, AE86, RX-7 FC/FD, Skyline R32/R33/R34, Lancer Evo, Impreza, Chaser, Mark II...), selección random de 12 cada año (30% usados con condición 45-88%) en `state.jdmShop`; al comprar entran a `state.cars` con `cls:'Drift'`, `dbonus`, `dt` y `parts:[]` (mismos campos que usa Drift Boy). **Piezas:** las 105 de `PIEZAS.png` cortadas por blobs (`split_blobs.py --thr 14 --grow 2 --min 900`) en `jdmparts/` y nombradas/precificadas en `_art-src/make_jdm_catalog.py` (fuente única: genera `names.json`, renombra y escribe `jdmmods-data.js`). 7 categorías (Engine & Turbo, Intake & Cooling, Suspension & Steering, Brakes, Wheels & Tires, Interior & Safety, Body & Aero), una pieza por slot y carro (comprar otra del mismo slot reemplaza), cada una suma puntos a `carRating` de `drift.js?v=2` (tope +40); el roll cage baja el daño de choque 30% y el arnés a la mitad el riesgo de lesión. Algunas piezas del sheet salieron en pares (ruedas, llantas): se venden como set. `drift.js` ofrece 'Visit the JDM Mods shop' en Garage & chassis.
- **Fix baloncesto (`nba.js?v=5`, `basketball.js?v=29`):** (1) **Dos 'declare for the draft' al terminar la universidad:** `basketball.js` (carrera vieja, popup 'Pro Draft' enganchado a `collegeYear`/`graduationCard`) y `nba.js` (carrera NBA, 'Declare for the draft?') disparaban cada uno el suyo; ahora `basketball.js` se calla mientras `state.nba` esté activa (`nbaOn()`). (2) **Sin contrato = historial borrado y rookie otra vez:** solo `retireCard` guardaba `n.legacy`; las otras salidas (sin ofertas en free agency, nadie te llamó tras el draft, walk away, overseas) ponían `retired` sin archivar y al volver a empezar `begin()` reiniciaba todo. Ahora todas pasan por `endCareer(n, how)` (guarda `legacy` con `how`, temporadas y All-Stars), `begin()` apila la carrera anterior en `state.nba.past`, y el hub de una carrera terminada muestra 'Career history' (stats de esas temporadas). No se probó en vivo.
