# Ajedrez en YourLife — investigación y diseño

> Documento de trabajo. Fecha: 2026-11-21. Investiga el dominio real (títulos, Elo, plata, la
> plataforma online, edad) y cierra con la decisión técnica del minijuego y cómo encajarlo en el juego.
> Todas las cifras están verificadas contra fuentes públicas; las que son estimaciones van marcadas.

---

## 0. Resumen ejecutivo

1. **La carrera tiene 4 escalones reales**: CM (2200) → FM (2300) → IM (2400 + 3 normas) → GM
   (2500 + 3 normas). Los títulos femeninos van 200 puntos abajo (WCM 2000 … WGM 2300) y son
   *adicionales*, no excluyentes: una mujer puede tener GM y WGM a la vez.
2. **El Elo es una resta de expectativas**: `ΔR = K × (resultado − esperado)`. La gracia para el juego
   es que el K cambia con la edad y el nivel (40/20/10), así que un pibe de 15 sube rapidísimo y un
   GM de 30 casi no se mueve. Eso da progresión creíble gratis.
3. **FIDE y online son dos ratings distintos y con sistemas distintos**: FIDE usa Elo; chess.com usa
   Glicko-1 y Lichess Glicko-2, que además de rating llevan *desviación* (cuánta confianza hay en ese
   número). Un pibe de 800 online puede ser 1200 FIDE sin contradicción.
4. **Casi nadie vive de premios.** El dinero real es un portafolio: premios + clases + streaming +
   sponsors + ligas. Un GM cobra 100–200 USD/hora de clase; un IM 60–125; un profe sin título 20–50.
5. **El ciclo mundial** son clasificatorios (World Cup, Grand Swiss, Circuit, rating) → Candidates (8
   jugadores, 14 rondas) → match a 14 partidas por el título. El match 2026 (Gukesh–Sindarov, Ginebra,
   24/11 al 12/12) reparte **2,5 millones de USD** y es el más joven de la historia: los dos tienen 20.
6. **Online**: bullet (<3 min), blitz (3–10), rapid (10–60) y diario/clásico. Los puzzles tienen su
   propio rating. El torneo semanal de titulados paga 10.000 USD y exige cámara y proctor.
7. **Edad**: el GM más joven de la historia es Abhimanyu Mishra (12a 4m 25d, 2021); en 2026 Faustino
   Oro se metió segundo (12a 6m 26d). El pico promedio de un GM ronda los **30–31 años**.
8. **Drama**: trampa, acusación falsa, tablas pactadas, filtración de preparación, apuro de tiempo,
   sponsor que se cae, alumno que supera al maestro. Todo tiene mecánica clara.
9. **Nombre parodia propuesto: `Pawnder`** (pawn + ponder). Alternativas abajo. Cero logo, cero verde
   de chess.com, cero string "chess.com" en el código.
10. **Minijuego — recomendación**: motor de ajedrez propio mínimo (legal moves + mate + tablas) con
    **una partida "clave" por torneo** y botón *Simular* para el resto. Los puzzles reutilizan el mismo
    motor. Es la opción que da ajedrez de verdad sin romper el ritmo de vida del juego.

---

## 1. Títulos FIDE y cómo se ganan

### 1.1 La tabla

| Título | Rating mínimo | Normas | Performance de la norma | Notas |
|---|---|---|---|---|
| **GM** — Grandmaster | 2500 | Sí, 3 normas / 27 partidas | 2600 | El techo de la carrera |
| **IM** — International Master | 2400 | Sí, 3 normas / 27 partidas | 2450 | |
| **FM** — FIDE Master | 2300 | No | — | Solo rating |
| **CM** — Candidate Master | 2200 | No | — | Solo rating; muchos jugadores lo saltean |
| **WGM** — Woman Grandmaster | 2300 | Sí | 2400 | Título femenino, *además* del abierto |
| **WIM** — Woman International Master | 2200 | Sí | 2250 | |
| **WFM** — Woman FIDE Master | 2100 | No | — | |
| **WCM** — Woman Candidate Master | 2000 | No | — | |

Dos aclaraciones que importan para el juego:

- **Los títulos son de por vida.** Si después bajás a 2300 seguís siendo GM. No se revocan.
- **Hay títulos "condicionales"**: si cumplís las normas pero te falta el rating, FIDE te lo deja
  otorgado y se confirma cuando llegás al número. Es una mecánica perfecta para un evento de "me falta
  un punto".
- **Ruta directa**: además de normas+rating, ciertos resultados dan el título de una: últimos 16 de la
  World Cup, Olimpiada, campeonatos continentales, mundiales juveniles (oro en el Mundial Juvenil = GM),
  etc. Casi siempre con un piso de rating (~2300) para que no lo gane un desconocido.

### 1.2 Qué es una norma (el detalle que hace que IM/GM sean difíciles)

Una norma no es "jugar bien un torneo", es un paquete de condiciones:

1. **Performance ≥ umbral** (2600 para GM, 2450 para IM) en un evento de **al menos 9 rondas**.
2. **Al menos 50% de los rivales con título** (CM y WCM *no* cuentan).
3. **GM**: al menos **un tercio** de los rivales deben ser GM, y **mínimo 3**. **IM**: un tercio IM o
   GM, mínimo 3.
4. **Rivales de al menos 2 federaciones distintas** a la propia, y **máximo 3/5** de tu propia
   federación (si no, te armás un torneo de amigos y sacás norma).
5. El torneo suele necesitar un **promedio de Elo alto** (para GM, del orden de 2380+).
6. Se pueden mezclar normas de distintos torneos; con 27 partidas cubiertas alcanza.

Para el juego esto se traduce en una regla simple y legible: *"Norma GM: torneo de 9+ rondas, 6/9
puntos o más, con al menos 3 GMs en la lista"*. El jugador no necesita la fórmula, necesita entender
que **hay que viajar y jugar contra gente fuerte**.

### 1.3 Cuánta gente hay en cada escalón (2026, aprox.)

| Título | Titulares | Activos | Elo medio de los activos |
|---|---|---|---|
| GM | ~1.900 | ~1.330 | 2471 |
| IM | ~4.300 | ~2.460 | 2319 |
| FM | ~9.900 | ~5.160 | 2210 |
| CM | ~3.900 | ~2.530 | 2081 |
| WGM | ~343 | ~180 | 2196 |
| WIM | ~944 | ~441 | 2089 |
| WFM | ~2.249 | ~906 | 1999 |
| WCM | ~1.413 | ~713 | 1847 |

Dato lindo para el juego: **hay más FMs que GMs e IMs juntos**. Y el Elo medio de un GM activo (2471)
es *más bajo* que el requisito para ser GM (2500) porque muchos ya no compiten en serio. Un GM retirado
que da clases a 2400 es realista.

### 1.4 El esqueleto de la "carrera"

```
Sin título (1400–2199)
   │  +100 Elo
   ▼
CM 2200  ── solo rating, se logra en un buen torneo
   │  +100
   ▼
FM 2300  ── solo rating, el salto "de club a maestro"
   │  +100 y 3 normas de 2450
   ▼
IM 2400
   │  +100 y 3 normas de 2600
   ▼
GM 2500  ── entrada al circuito cerrado, invitaciones, sponsors
```

Cada escalón son ~100 puntos **y** un obstáculo distinto: CM/FM son números; IM/GM son números *más*
actuaciones. Es exactamente la estructura de "ascensos" que pediste.

---

## 2. El sistema de rating

### 2.1 Elo: la fórmula

Para el jugador A contra B:

```
E_A = 1 / (1 + 10^((R_B − R_A) / 400))        ← probabilidad esperada de puntuar
R'_A = R_A + K × (S_A − E_A)                  ← S = 1 victoria, 0.5 tablas, 0 derrota
```

FIDE no usa la fórmula directa: usa una **tabla** (8.1.2) que redondea a dos decimales. Para el juego
la fórmula alcanza y sobra. Diferencias de expectativa:

| Diferencia de Elo | El más fuerte puntúa | El más débil puntúa |
|---|---|---|
| 0 | 50% | 50% |
| 100 | 64% | 36% |
| 200 | 76% | 24% |
| 300 | 85% | 15% |
| 400 | 92% | 8% |

Ejemplo concreto: un 1650 le gana a un 1800. `E = 1/(1+10^(150/400)) = 0.297`. Con K=20:
`20 × (1 − 0.297) = +14` puntos.

### 2.2 El K-factor (la parte que hace que la progresión se sienta bien)

| K | A quién |
|---|---|
| **40** | Jugador nuevo, hasta completar 30 partidas |
| **40** | Menores, hasta el final del año en que cumplen 18, **siempre que estén bajo 2300** |
| **20** | Todos los demás por debajo de 2400 |
| **10** | Quien alguna vez publicó 2400 o más (queda para siempre, aunque baje) |

Extra: si `K × partidas del período > 700`, se baja K para no explotar el rating. Es un tope anti-abuso
(útil si el jugador simula 100 partidas en un año).

**Por qué esto es oro para el juego**: el mismo resultado vale distinto según la etapa. Un pibe de 14
con 2100 gana +6 por partida; ese mismo pibe a los 30 con 2700 gana +1,5. La curva de progresión sale
sola, sin scriptearla.

### 2.3 Reglas de borde que conviene copiar

- **Piso 1400**: FIDE no publica ratings por debajo de 1400. El que baja de ahí queda "no rated".
- **Primer rating**: hacen falta **5 partidas** contra rivales con Elo, que pueden estar repartidas en
  hasta 26 meses.
- **Rating inicial**: promedio de los rivales + dos rivales imaginarios de 1800 tablas, con tope 2200.
- **Regla de los 400**: una diferencia mayor a 400 se cuenta como 400 (para jugadores bajo 2650, desde
  octubre 2025). Rapid y blitz la mantienen para todos. Partidas con 600+ de diferencia no se ratan si
  alguno supera 2600.
- **Períodos mensuales**: FIDE actualiza una vez por mes. Para el juego: actualizar al cerrar el
  torneo/año, no partida por partida.

### 2.4 Glicko (online)

Glicko agrega **RD** (*rating deviation*): cuánta confianza tiene el sistema en tu número.

- Recién empezás: RD alto → cada partida mueve el rating muchísimo (cientos de puntos).
- Jugás mucho: RD bajo → las partidas mueven poco.
- Dejás de jugar: RD sube de nuevo → la próxima partida vuelve a mover fuerte.

**Glicko-2** suma **volatilidad** (qué tan errático venís). Es el que usa Lichess.
**Chess.com usa Glicko-1** (según la propia ayuda y la comparativa de Lichess). Arranca en 1500 en
Glicko-2; chess.com históricamente arrancaba en 1200 y hoy deja elegir.

Consecuencia de diseño: **dos ratings separados**, y el online con "provisional" (`?`) durante las
primeras partidas. Eso explica por qué un jugador puede tener 900 online y 1500 FIDE: son poblaciones y
sistemas distintos.

### 2.5 Ratings típicos (para calibrar la escalera del juego)

**FIDE (solo se publica desde 1400; activos ~221.000):**

| Elo | Nivel | Percentil dentro de FIDE activo |
|---|---|---|
| 1400 | piso de la lista | 100% |
| 1500 | club flojo | ~85% |
| 1600 | club | ~67% |
| 1800 | club fuerte | ~35% |
| 2000 | experto | ~13% |
| 2200 | CM | ~4% |
| 2400 | IM | ~0,8% |
| 2500 | GM | ~0,3% |
| 2600 | top ~100 | ~0,1% |
| 2700 | top ~25 | puñado |
| 2750+ | top 10 | |
| 2800+ | candidato al título | |
| 2882 | récord histórico (Carlsen) | |

**Online (chess.com, orden de magnitud, cambia por ritmo y por mes):**

| Elo | Nivel |
|---|---|
| <500 | nunca jugó / casual |
| 600–800 | principiante |
| 900–1100 | intermedio bajo |
| 1200–1400 | intermedio |
| 1500–1700 | avanzado (top ~5% online) |
| 1800–2000 | experto (top ~1%) |
| 2100–2300 | maestro |
| 2400+ | título FIDE a la vista |

Ojo con el efecto estadístico: la **mediana online es bajísima** (~530–600 en rapid activo) porque hay
millones de cuentas casuales. Un 1500 online ya está arriba del 90% de la gente. Eso hay que reflejarlo
en los textos: el jugador de 1200 no es "malo", es mejor que 9 de cada 10.

---

## 3. Cómo se gana plata un ajedrecista

### 3.1 Premios: la pirámide

| Nivel | Torneo | Bolsa | Primer premio |
|---|---|---|---|
| Local | open de club, 30–80 jugadores | 500–3.000 USD | 150–800 |
| Nacional | open con titulados | 5.000–30.000 | 1.000–5.000 |
| Internacional | open tipo Sitges / Dubai | 20.000–100.000 | 4.000–15.000 |
| Élite | Sinquefield Cup 2026 | **475.000** | **103.125** |
| Élite | Norway Chess 2026 | 1,69 M NOK (~150k USD) | 700.000 NOK (~69k) |
| Élite | Candidates 2026 | **807.932** | **~170.000 €** |
| Élite | World Cup | ~2 M entre 206 jugadores | (reparto profundo) |
| Élite | Esports World Cup 2026 | **1.500.000** | **250.000** |
| Liga | Global Chess League 2026 | **1.000.000** | (franquicias) |
| Match | Campeonato del Mundo 2026 | **2.500.000** | **1.300.000** |

El Mundial 2026 tiene una estructura rara y muy jugosa para el juego: **200.000 USD por cada partida
ganada**, y el resto se reparte en partes iguales. Si el match termina 7,5–6,5 con 13 decisivas (o en
tiebreaks), el campeón se lleva 1,3 M y el rival 1,2 M. Es decir: **ganar partidas paga**, y un match
cerrado paga casi lo mismo para los dos.

Carreras acumuladas (solo premios, sin streaming): Carlsen **12,2 M**, Anand **9,46 M**, Kasparov
**7,95 M**. Un top-100 de por vida junta unos pocos millones; un IM de 2450 que juega opens, mucho
menos.

### 3.2 Clases y coaching (el ingreso más estable)

Tarifas 2026, una hora, online, 1 a 1:

| Nivel del profe | USD/hora |
|---|---|
| Sin título / club (1200–1800) | 15–40 |
| Fuerte de club / experto (1800–2200) | 25–50 |
| FM / CM | 40–80 |
| IM | 60–125 |
| GM | 100–200 (nombres conocidos: más) |
| Súper GM / academia premium | 160–250+ |

En Lichess los números son más bajos (GM 35–100). Las clases grupales bajan a 10–40 por sesión, y las
academias cobran 50–180 USD/mes. Dato de mercado: un coach estructurado mejora ~120 puntos en 6 meses
vs ~45 del autodidacta — buen gancho para el evento "contratar coach".

**Para el juego**: el coaching es el ingreso que no depende de ganar. Debería ser el "sueldo base" de
la etapa adulta, y escalar con el título. Un GM dando 10 clases/semana a 150 USD = 6.000/mes, más que
la mayoría de los premios de un open.

### 3.3 Streaming y YouTube

- **Suscripciones**: Twitch 50/50 (Partner Plus 70/30), Kick 95/5. Hikaru, solo en Kick, se estima
  ~57.000 USD/mes de subs con ~38 h al mes.
- **YouTube**: AdSense + miembros; canales de ajedrez grandes superan el millón de vistas/mes.
- **Sponsors**: plataformas online, casas de apuestas, apps de entrenamiento, relojes, bancos. En el
  circuito, un sponsor de un torneo (Salesforce en el Mundial 2026) también paga apariciones.
- **Torneos de contenido**: Titled Tuesday paga **10.000 USD semanales** (2.500 al primero) y encima
  da puntos para el circuito.
- **Clases grabadas / cursos / libros**: ingreso pasivo, típico del GM que ya no compite.

Referencia: se estima que Nakamura factura **más de 1 M al año** por streaming, muy por encima de sus
premios (~285k en 2023). Es el ejemplo perfecto de "el ajedrez como contenido".

### 3.4 Ligas por equipos

- **Global Chess League** (India, franquicias, 2026: bolsa de 1 M): equipos con sponsor tecnológico,
  los jugadores cobran contrato + aparición.
- **Bundesliga alemana** y ligas nacionales: pagan viaje, hotel y una fee por tablero; es el ingreso
  silencioso de muchos IMs europeos.
- **Olimpiada**: no paga premios grandes, pero da federación, becas y visibilidad.

### 3.5 El ciclo del Campeonato del Mundo

```
Clasificatorios (2025–26)
  ├─ FIDE World Cup (206 jugadores, eliminación directa)      → plazas
  ├─ Grand Swiss (suizo de élite)                             → 2 plazas
  ├─ FIDE Circuit (suma de resultados del año)                → 1 plaza
  └─ Rating promedio más alto del período                      → 1 plaza
                    │
                    ▼
Candidates (8 jugadores, 14 rondas, todos contra todos ida y vuelta)
  2026: Pafos, Chipre, 28/3–16/4 → ganó Javokhir Sindarov con 10/14 invicto
                    │
                    ▼
Match por el título (14 partidas clásicas, primero a 7,5)
  2026: Gukesh (campeón) vs Sindarov (retador), Ginebra, 24/11–11/12
  Desempate 12/12: 4 partidas 15+10 → 2 de 10+5 → 2 de 3+2 → 3+2 sueltas
```

Datos del match 2026 que sirven como guion: los dos tienen 20 años (el match más joven de la historia),
Sindarov llega 4º del mundo con 2782 y Gukesh 26º con 2710 tras un año flojo, y Carlsen ya dijo que
Sindarov es favorito. Toda la narrativa de "el campeón en crisis vs el pibe imparable" está servida.

### 3.6 La verdad económica

**La mayoría de los titulados no vive de premios.** Viven de un portafolio: clases + liga + contenido +
algún sponsor. El premio grande es el lottery ticket. Para el juego: el jugador debe poder elegir entre
"girar por el circuito" (poco ingreso estable, chance de gloria) y "profesor con 20 alumnos" (ingreso
seguro, rating estancado). Esa tensión es más interesante que un número de plata.

---

## 4. La plataforma online (parodia de chess.com)

### 4.1 Ritmos

| Categoría | Definición típica | Ejemplos |
|---|---|---|
| **Bullet** | menos de 3 min por jugador | 1+0, 2+1 |
| **Blitz** | 3 a 10 min | 3+0, 5+0, 3+2 |
| **Rapid** | 10 a 60 min | 10+0, 15+10 |
| **Diario / clásico** | días por movimiento, o 60+ min | 30+0, 90+30 |

FIDE aparte: clásico **90 min + 30 s** de incremento desde la movida 1 (y 30 más para el resto), rapid
15+10, blitz 3+2. Los tres son listas de rating distintas.

Para el juego: **cuatro ratings separados** (bullet, blitz, rapid, puzzle). Bullet y blitz correlacionan
fuerte; rapid es más "plano" (el que es 1000 en blitz suele ser ~1250 en rapid).

### 4.2 Puzzles

- Tienen **rating propio**, independiente del de partidas.
- Modos: puzzle del día, *Puzzle Rush* (resolver la mayor cantidad en 3/5 min con vidas), *Puzzle
  Battle* (1v1 con el mismo set), sets por tema (mate en 2, clavadas, finales).
- En el juego: es la actividad de "entrenar" que sube un stat oculto de táctica y el rating de puzzles.
  Cada puzzle resuelto = +rating de puzzle; fallado = −. Sirve para progresar sin jugar partidas.

### 4.3 Torneos para titulados

**Titled Tuesday** (el modelo a parodiar):

- Todos los martes, **11 rondas suizas, 5+0** (hasta sep-2025 era 3+1).
- **10.000 USD** semanales: 2.500 / 1.500 / 1.000 / 700 / 400 / 400 / 250×4.
- Bonos de 250: mejor mujer, mejor senior (50+), mejor sub-16, mejor sub-16 femenina, mejor no-GM,
  mejor no-IM, mejor debut, **bote por puntaje perfecto** (que crece cada semana que nadie lo logra),
  mejor partida, mejor jugada brillante, premios para streamers.
- Solo titulados verificados. **Proctor obligatorio** y dos cámaras (cara+cuarto, escritorio+pantallas).
- **No se puede ofrecer tablas antes de la movida 40.**
- Desempates: Buchholz Cut 1, Buchholz, Sonneborn-Berger, etc.

El "bote por puntaje perfecto" que crece semana a semana es una mecánica de expectativa buenísima:
el jugador mira el número subir y se tienta.

### 4.4 Fair play

- Detección por algoritmo (correlación con motor, tiempos de movida, precisión anómala).
- **Proctor** (software) + cámaras + revisión manual de cuartos y pantallas.
- Cierres de cuentas y baneos, incluso a titulados (chess.com reportó 11 cuentas de titulados cerradas
  en su actualización de fair play de diciembre 2025).
- Casos célebres: Carlsen–Niemann 2022 (retiro de una partida, acusación, demanda), las acusaciones
  cruzadas de Kramnik, y los "speedruns" de cuentas nuevas que la comunidad mira con lupa.

Para el juego: **el baneo es una consecuencia de evento**, no un sistema. Si el jugador usa ayuda
externa (una opción de decisión), probabilidad de detección que sube con el Elo y con la reincidencia →
cuenta cerrada, rating online a cero, sponsor perdido, vergüenza pública. Y la **acusación falsa** como
evento inverso: te acusan sin pruebas y tenés que decidir si demandás, si lo ignorás o si lo usás para
hacerte famoso.

### 4.5 Cultura de streamers

- El streamer es el nuevo embajador: reacciona a torneos, hace speedruns, juega con chat, vende cursos.
- Se mezcla con el circuito: los mismos nombres están en Titled Tuesday, en la liga y en Twitch.
- Para el juego: "hacerte streamer" es una segunda carrera que compite por tiempo con entrenar. Sube
  fama y plata, baja Elo si le dedicás todo.

### 4.6 Nombre parodia

**Regla dura**: nada de "chess.com", nada de su logo (el peón verde), nada de su verde característico
(#81b64c), nada de su dominio ni de sus nombres de torneo. Igual que el juego hace con BitLife
("YourLife"), Ultimate Fighting, Walmart, etc.

Propuestas (ordenadas por mi preferencia):

| Nombre | Por qué | Riesgo |
|---|---|---|
| **Pawnder** | juego de palabras pawn + ponder; suena a app, se dice fácil en español | bajo |
| **JaqueMate.io** | local, obvio, muy latino | puede existir el dominio |
| **64** | minimalista, se ve bien como logo | genérico |
| **Gambito** | término de ajedrez, suena a marca | puede haber tiendas |
| **Peonera** | slang, gracioso | muy informal |
| **ChessPit** | "el pozo", con actitud | suena agresivo |

**Recomendación: `Pawnder`**, con identidad propia: peón *distinto* (no el de chess.com), paleta
violeta/crema, tipografía redondeada. El sitio dentro del juego se llama "Pawnder", y los torneos
"Pawnder Tuesdays".

---

## 5. Edad y progreso

### 5.1 Récords de precocidad (GM)

| # | Jugador | Edad al GM | Año |
|---|---|---|---|
| 1 | Abhimanyu Mishra | 12a 4m 25d | 2021 |
| 2 | Faustino Oro | 12a 6m 26d | 2026 |
| 3 | Sergey Karjakin | 12a 7m 0d | 2002 |
| 4 | D. Gukesh | 12a 7m 17d | 2019 |
| 5 | Yağız Kaan Erdoğmuş | 12a 9m 29d | 2024 |
| 6 | Javokhir Sindarov | 12a 10m | 2018 |
| 7 | R. Praggnanandhaa | 12a 10m 13d | 2018 |
| 8 | Nodirbek Abdusattorov | 13a 1m 11d | 2017 |
| 9 | Parimarjan Negi | 13a 4m 22d | 2006 |
| 10 | Magnus Carlsen | 13a 4m 27d | 2004 |

Mujeres: **Hou Yifan** es la GM más joven de la historia con 14a 6m (2008). Judit Polgár llegó a 2735
y nunca fue campeona mundial femenina (jugaba el abierto).

Antes de 1980 el récord era Fischer con 15a 6m (1958). O sea: **la precocidad explotó en los últimos 25
años** por entrenamiento temprano, motores y circuitos juveniles. En el juego eso se traduce en que el
talento alto + coach + horas puede dar GM a los 12–14; sin eso, GM a los 20–24 es lo normal.

### 5.2 Pico y declive

- Estudio de 2025 (Scientific Reports, modelos estadísticos + ML sobre ratings históricos): **pico
  promedio de un GM ≈ 30,65 años**. Varía: quien llegó al GM más joven suele picar antes; las mujeres
  de élite muestran curvas algo distintas (muestra chica).
- En la práctica los mundiales se ganan entre los **20 y los 35**: Carlsen pico 2882 a los 26; Kasparov
  2851 a los 33; Anand 2817 a los 36; Korchnoi seguía top-10 pasados los 50.
- El declive no es lineal: después de los 40 se pierde **velocidad y cálculo** (blitz cae primero),
  pero **conocimiento y técnica** aguantan. Un GM de 55 puede seguir siendo 2500 en clásico y 2300 en
  bullet.
- Después de los 50 existen circuitos senior (50+ y 65+) con títulos mundiales propios: buena salida
  para una carrera larga.

### 5.3 Cómo modelarlo en el juego (curva concreta)

```
crecimiento anual = talento × coach × horas × curvaEdad − desgaste
curvaEdad:  8–12  → 1.3   (aprenden como esponjas)
           13–19  → 1.0   (el grueso del salto)
           20–29  → 0.45  (afinado fino)
           30–38  → 0.15  (pico, casi meseta)
           39–50  → −0.1  (declive suave)
           51+    → −0.25 (declive claro; el clásico aguanta más que el bullet)
```

Números de referencia para calibrar: un talento normal gana **60–120 Elo/año** en la adolescencia; un
prodigio, **250–400**. De 1800 a 2500 hay 700 puntos: son 3–4 años de prodigio o 8–10 de jugador serio.
El GM a los 12 es un outlier de 1 entre millones; el juego debería permitirlo solo con talento máximo,
coach de élite y dedicación completa.

**Etapas de vida del juego** (amarre directo):

| Edad | Etapa | Qué habilita |
|---|---|---|
| 6–12 | Niño | club escolar, primer torneo, puzzles |
| 13–17 | Adolescente | circuito juvenil, primer rating FIDE, normas |
| 18–29 | Joven adulto | circuito abierto, IM/GM, primeras invitaciones |
| 30–39 | Prime | pico, Candidates, match mundial, coaching caro |
| 40–55 | Veterano | declive suave, ligas, academia, stream |
| 56+ | Senior | torneos 50+/65+, legado, alumnos |

---

## 6. Ideas para eventos y drama

Cada evento debería tener: **disparador**, **decisión** (2–4 opciones) y **consecuencia** en Elo,
plata, fama, relaciones o salud mental. Tabla de arranque:

| # | Evento | Disparador | Decisión | Consecuencias |
|---|---|---|---|---|
| 1 | **Oferta de trampa** | Torneo decisivo, Elo alto | Aceptar / rechazar / denunciar | Éxito +Elo y plata; detección → ban, escándalo, sponsor perdido |
| 2 | **Acusación falsa** | Racha sospechosa | Demandar / ignorar / hacer show | Plata y fama, o desgaste y enemigos |
| 3 | **Rivalidad** | Mismo rival 3 torneos seguidos | Provocar en prensa / respeto / estudiar su repertorio | Motivación (+Elo temporal) o presión (−) |
| 4 | **Apuro de tiempo** | Partida igualada, reloj en 30 s | Simplificar / complicar / ofrecer tablas | Victoria, derrota o tablas; sube "nervios" |
| 5 | **Tablas pactadas** | Última ronda, tablas clasifican a los dos | Pactar / jugar / denunciar | Clasificación fácil pero reputación manchada; sanción si se descubre |
| 6 | **Filtración de preparación** | Antes de un match importante | Cambiar repertorio / mantener / contraatacar | Sorpresa (+), confusión (−) |
| 7 | **Sponsor que se cae** | Crisis económica o escándalo | Buscar otro / bajar costos / aceptar torneo berreta | Ingreso, imagen, nivel de juego |
| 8 | **El alumno te supera** | Tenés academia y un alumno joven | Seguir enseñando / competir / sabotear | Dinero vs Elo vs ética (karma) |
| 9 | **Padre-manager** | Adolescente con talento | Firmar con él / independizarte / demandar | Plata rápida, burnout, libertad |
| 10 | **Burnout** | 30+ torneos al año | Parar / seguir / cambiar a online | Salud mental, Elo, plata |
| 11 | **Oferta de liga** | Contrato de franquicia | Firmar / negociar / rechazar | Sueldo fijo, menos torneos, presión |
| 12 | **Virality** | Una partida se hace viral | Aprovechar (stream) / mantener perfil bajo | Fama, sponsors, distracción |
| 13 | **Motor en el baño** | Rumores en un open | Ignorar / investigar / acusar | Escándalo, justicia, enemigos |
| 14 | **Doping/estimulantes** | Torneo largo, cansancio | Tomar / dormir / café | Energía temporal, riesgo de sanción y salud |
| 15 | **Retiro y regreso** | A los 40, mal año | Retirarte / seguir / volver a los 45 | Legado, salud, chance de un último título |

Los mejores para el juego son los que **enfrentan plata contra rating** (7, 8, 11) y los que **enfrentan
integridad contra resultado** (1, 5, 13). Son decisiones que el jugador recuerda.

---

## 7. El minijuego: la decisión más grande

### 7.1 Restricciones reales del proyecto

Antes de elegir, lo que el código impone:

- **Móvil vertical** (~430×900) con `pcMode` opcional. Nada de UI pensada para desktop.
- **Sin backend, sin dependencias nuevas**: HTML/JS puro, assets locales, saves en `localStorage`.
- **El loop es "Age up"**, no una sesión de juego. El jugador toca *Age* y vive un año. No podés pedirle
  40 partidas de 40 movidas por año sin matar el ritmo.
- **i18n en runtime**: `i18n.js` traduce nodos de texto y el código sigue leyendo inglés. Todo texto
  nuevo del minijuego tiene que entrar en `i18n/ui.tsv` (y correr `build_i18n.py`), o va a quedar en
  inglés cuando el jugador esté en ES/PT.
- **Rendimiento**: el juego ya es un `game.html` de ~3,6 MB con 100+ módulos. Un motor de ajedrez no
  puede bloquear el hilo más de ~100 ms por jugada.
- **Arte**: hay un demo de piezas en `piezas-ajedrez-demo.png` (montaje de aprobación). Son 12 piezas
  las que hacen falta, idealmente PNG con transparencia o SVG inline.

### 7.2 Las cuatro opciones

| Opción | Qué es | Coste | Riesgo | Valor |
|---|---|---|---|---|
| **A. Motor completo** | Ajedrez jugable de verdad vs bot, con reloj, enroque, promoción, tablas | Alto (~1.500–2.000 líneas) | Medio (bugs de reglas) | Muy alto |
| **B. Puzzles de candidatas** | Posición + 3–4 movidas para elegir; una es la mejor | Bajo (~250 líneas) | Bajo | Medio |
| **C. Híbrido** | Torneo simulado + **una partida clave jugable**; puzzles con el mismo motor | Medio-alto | Medio | **Muy alto** |
| **D. Simulación pura** | Todo por dado según diferencia de Elo | Muy bajo | Nulo | Bajo |

### 7.3 Recomendación: **C (híbrido)**

La razón es de ritmo, no de tecnología. Un torneo de 9 rondas son ~9 partidas; jugarlas todas es
inviable en un life sim. Pero **una** partida decisiva por torneo —la última ronda, o la que define la
norma— es un momento de 3–6 minutos que el jugador *quiere* jugar. El resto se simula con Elo.

Concretamente:

- **Torneo**: 9 rondas simuladas por `E = 1/(1+10^(ΔElo/400))` con algo de ruido. El jugador ve la
  tabla, los resultados y sus puntos.
- **Partida clave**: se juega la ronda decisiva (la que da el título, la norma o el primer premio).
  Formato 5+0 (blitz) o 10+0, bot con la fuerza del rival. Si el jugador no quiere jugar, botón
  **"Simular"** que resuelve por Elo.
- **Resultado**: la partida jugada *reemplaza* el resultado simulado de esa ronda. Si ganás, la norma
  sale; si perdés, no. El resto sigue igual.
- **Puzzles**: modo entrenamiento aparte, con rating de puzzle propio, usando el mismo motor para
  validar la jugada correcta.

Ventaja: el jugador que ama el ajedrez juega ajedrez real; el que no, aprieta *Simular* y sigue con su
vida. Y el motor se escribe una vez, se usa para las dos cosas.

### 7.4 Alcance del motor (v1)

**Sí, en la v1:**

- Tablero 0x88 o 10×12; generación de movimientos legales (incluye jaque, clavadas, enroque, al paso).
- Promoción (elegir pieza), jaque mate, ahogado, material insuficiente, regla de 50 movidas.
- Triple repetición vía hash de posición (Map de claves FEN-simplificadas). Si complica, se puede
  dejar para v1.1 y avisar en la UI.
- Bot: minimax + alpha-beta + tablas pieza-casilla + quiescencia + MVV-LVA. Profundidad 1–4.
- Reloj simple con incremento, bandera, y "tiempo agotado = derrota".
- Resaltado de última jugada, jaque y movidas legales; coordenadas; flip de tablero.
- Botón *Rendirse*, *Tablas* (solo si la posición lo permite), *Simular*.

**No, en la v1:**

- Aperturas con libro, PGN, análisis, flechas de evaluación, variantes (Chess960, etc.).
- Motor fuerte de verdad. No hace falta: el bot solo tiene que *parecer* del nivel del rival.

### 7.5 Fuerza del bot (escala por Elo)

| Elo del rival | Profundidad | Comportamiento |
|---|---|---|
| 600–900 | 1 | elige entre las 3 mejores con ruido; a veces cuelga pieza |
| 1000–1300 | 1–2 | ruido bajo; castiga errores obvios |
| 1400–1700 | 2 | juega sólido, falla en táctica profunda |
| 1800–2100 | 3 | castiga casi todo lo que cuelgues |
| 2200+ | 3–4 | sin piedad, pero con presupuesto de tiempo |

Implementación del "ruido": en vez de elegir siempre la mejor, elegir entre las N mejores con
probabilidad proporcional a `exp(−(eval_loss)/T)`, con `T` según el nivel. Es más creíble que tirar
movidas al azar y no requiere un motor distinto por nivel.

### 7.6 Arquitectura y pruebas

- Archivo nuevo `chess.js` (IIFE, como los demás módulos), cargado con `<script src="chess.js?v=1">`.
- Estado en `state.chess`, **JSON puro** (nada de funciones): `{ fide, online:{bullet,blitz,rapid,puzzle},
  title, norms, games, best, coach, coachHours, tournaments, ban }`.
- **Test de aceptación del motor (perft)**: desde la posición inicial, los conteos deben ser
  `20 / 400 / 8.902 / 197.281` para profundidad 1–4. Si esos números dan, la generación de movimientos
  está bien y el resto son detalles.
- **Test de Elo**: 1400 vs 1400, K=20, victoria → +10 / −10 exactos.
- **Presupuesto**: la búsqueda corre en un `setTimeout` por jugada, depth ≤4, y con un tope de nodos
  (~150k) para no clavar el teléfono.
- **Fallback**: cualquier excepción del motor cae en *Simular* y muestra un aviso; nunca deja la partida
  colgada.

### 7.7 Integración con el juego

1. **Entrada en ACTIVIDADES**: `["chess", "Chess", "Play, train and compete", 1]` con edad mínima 6.
   El listado está en `openActivities()` dentro de `game.html` (~línea 45940); hay que agregar el ítem
   y su handler.
2. **Pantalla propia**: reusar el patrón de overlay de los módulos (`ev.innerHTML`, `sTitle`, `sBack`).
3. **Textos**: todo lo visible va a `i18n/ui.tsv` (ES/PT) y después `python build_i18n.py`.
4. **Notificaciones**: `notice()` para resultados y torneos; el log de la vida con frases cortas.
5. **Sonido**: `SND` / `play("...")` con 3–4 efectos (movida, captura, jaque, victoria). No hace falta
   más.
6. **Economía**: usar `localPrice()` para convertir premios y clases a la moneda del país del jugador.
7. **Assets**: `chess/` con 12 PNG (o SVG inline) + sonidos. El demo actual es un montaje; hay que
   recortar cada pieza con transparencia y fijar el tamaño de casilla (ideal 44–52 px en móvil).

### 7.8 Por qué no empezar por el motor completo suelto

Porque el 80% del valor está en la **carrera** (títulos, Elo, plata, drama) y el motor es el 20% que
más bugs trae. El orden correcto es:

1. Estado + simulación de torneos + títulos + Elo (sin UI de tablero).
2. Puzzles de candidatas (barato, ya divierte).
3. Motor + partida clave (el postre).

Así, si el motor se atrasa, el modo carrera ya es jugable y el jugador puede *simular* todo.

---

## 8. Cómo encaja en YourLife (resumen técnico)

| Pieza | Dónde | Nota |
|---|---|---|
| Módulo | `chess.js` + `<script>` en `game.html` | IIFE, sin dependencias |
| Estado | `state.chess` | JSON puro, compatible con saves viejos (`state.chess ||= {}`) |
| Entrada | `openActivities()` | edad 6+, junto a Mind & Body |
| Textos | `i18n/ui.tsv` | ~80–120 filas nuevas; correr `build_i18n.py` |
| Logros | `notice()` / log | frases cortas, en inglés en el código |
| Dinero | `localPrice()` | premios y clases |
| Arte | `chess/*.png` | 12 piezas + sonidos |
| Pruebas | perft + Elo unitario + partida completa | ver 7.6 |

**Migración**: si el jugador ya tiene una partida guardada, `state.chess` no existe → se inicializa
perezosamente. No tocar el resto del save.

---

## 9. Fuentes

- FIDE Handbook, *Title Regulations* (B.01) — <https://handbook.fide.com/chapter/B012024>
- FIDE Handbook, *Rating Regulations* (B.02) — <https://handbook.fide.com/chapter/B022024>
- FIDE, *Table for Direct Titles 2026* — <https://handbook.fide.com/chapter/B01DirectTitles2026>
- FIDE, *New FIDE Rating and Title Regulations* (2024) — <https://www.fide.com/new-fide-rating-and-title-regulations-come-into-effect/>
- FIDE, *World Championship Match 2026: prize fund* — <https://www.fide.com/salesforce-fide-world-championship-match-2026-schedule-format-and-prize-fund-confirmed/>
- Wikipedia, *World Chess Championship 2026* — <https://en.wikipedia.org/wiki/World_Chess_Championship_2026>
- Wikipedia, *Candidates Tournament 2026* — <https://en.wikipedia.org/wiki/Candidates_Tournament_2026>
- Chess.com, *FIDE titles* — <https://support.chess.com/en/articles/8557897-how-do-i-get-a-chess-title-grandmaster-im-etc>
- Chess.com, *How do ratings work* (Glicko) — <https://support.chess.com/en/articles/8566476-how-do-ratings-work-on-chess-com>
- Lichess, *Chess rating systems* — <https://lichess.org/page/rating-systems>
- Glickman, *Example of the Glicko-2 system* — <https://glicko.net/glicko/glicko2.pdf>
- Chess.com, *Titled Tuesday* — <https://www.chess.com/article/view/titled-tuesday>
- Chess.com, *2026 Titled Tuesday* — <https://www.chess.com/events/info/2026-titled-tuesday-blitz>
- Liquipedia, *Sinquefield Cup 2026* — <https://liquipedia.net/chess/Sinquefield_Cup/2026>
- Norway Chess, *Prize Money* — <https://norwaychess.no/en/prize-money>
- Chess.com, *Biggest prizewinners 2025* — <https://www.chess.com/article/view/biggest-chess-prizewinners-2025>
- Scientific Reports (2025), *Estimating the peak age of chess players* — <https://www.nature.com/articles/s41598-025-10386-3>
- Chess.com, *Youngest Grandmasters* — <https://www.chess.com/article/view/youngest-chess-grandmasters>
- Russian Chess School, *Online coaching cost 2026* — <https://www.russianchessschool.com/post/how-much-does-online-chess-coaching-cost-in-the-us>
- ChessDrive, *Chess coach price table* — <https://chessdrive.io/blog/chess-coach>
- TheChessWorld, *Highest earning chess streamers* — <https://thechessworld.com/articles/general-information/highest-earning-chess-streamers-in-2024/>
- CheckmateX, *Chess.com percentiles 2026* — <https://checkmatex.app/blog/what-is-a-good-chess-rating-2026>
- JD Chess, *Average Elo by platform 2026* — <https://jdchess.com/en/blog/what-is-elo-in-chess>

---

## 10. Checklist antes de programar

- [ ] Decidir nombre final de la plataforma (recomendado: **Pawnder**).
- [ ] Aprobar el alcance híbrido (torneo simulado + 1 partida clave + puzzles).
- [ ] Recortar las 12 piezas del montaje `piezas-ajedrez-demo.png` a PNG con transparencia.
- [ ] Definir la tabla de torneos (nombre, país, bolsa, nivel mínimo) — 15–20 eventos.
- [ ] Escribir `chess.js` con: estado, torneos simulados, Elo, títulos.
- [ ] Perft 20/400/8.902/197.281 en verde.
- [ ] Agregar textos a `ui.tsv` y reconstruir i18n.
- [ ] Probar una vida completa: niño → club → IM → GM → senior.
