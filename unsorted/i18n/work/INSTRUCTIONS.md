# Translation job: life-simulator game text -> Latin American Spanish + Brazilian Portuguese

The game is a BitLife-style life simulator: you live a whole life (birth, school, family, jobs, crime,
military, church, fame...), with dark humor and slang.

## Files
- INPUT: a .tsv where each line is `id<TAB>english`.
- OUTPUT: a .tsv where each line is `id<TAB>spanish<TAB>portuguese`.
  - One output line per input line, SAME ORDER, and the id copied EXACTLY from the input line
    (ids are numbers like 4345 or 26190; never renumber them 1, 2, 3...).
  - No header, no blank lines, no commentary, no tabs or newlines inside a translation.

## Rules
1. Placeholders in curly braces are filled in by the game later. Copy them EXACTLY, the same number of
   times: `{1}`, `{2}`, `{n}`, `{name}`, `{rel}`, `{first}`, `{full}`, `{mom}`, `{item}`, `{amt}`, `{g}`, etc.
   You may move them to where they fit grammatically. Never translate what is inside the braces.
2. EXCEPTION - pronoun placeholders: `{he}` `{He}` `{she}` `{She}` `{him}` `{his}` `{His}` `{her}` `{Her}`
   `{himself}` `{herself}` `{T_him}` `{he2}` `{they}` `{them}` `{their}`. The game fills these with English
   words ("him", "her"), so they must NOT appear in your translation. Rewrite the sentence with a native
   pronoun or none: "Tell {him} to stop" -> "Dile que pare" / "Fala pra parar";
   "{He} lost {his} keys." -> "Perdió sus llaves." / "Perdeu as chaves."
   Prefer wording that works for both genders.
3. Spanish: neutral Latin American, informal "tú". Portuguese: Brazilian, "você", casual.
   Natural like a mobile game, not literal or stiff. Keep jokes and slang feeling like jokes and slang.
4. Keep the voice: "I ..." log lines stay first person ("I got a job" -> "Conseguí un trabajo" /
   "Consegui um emprego"). "You ..." stays second person.
5. Buttons/choices (short imperative phrases like "Take the job", "Buy a toy"): Spanish tú-imperative
   ("Acepta el trabajo", "Compra un juguete"); Portuguese você-imperative ("Aceite o emprego", "Compre um brinquedo").
   Short labels/nouns stay short.
6. Single lowercase words (e.g. `wife`, `librarian`, `forest`) are values the game inserts into sentences:
   translate them as a single lowercase word or short phrase, no article ("wife" -> "esposa" / "esposa").
7. Do not translate people's names, brand/company names, or titles of real movies, shows, songs, games,
   organizations and places that are known by their English name. Keep numbers, emojis, symbols, `@`,
   `%`, currency signs and trailing punctuation like ":" or "...".
8. Spanish exclamations/questions: one opening mark per sentence (`¡Hola! ¡Ya somos amigos!`), never two
   opening marks for one sentence.
9. When English doesn't show gender, prefer neutral wording; if you must choose, use masculine.

## How to work
Read the input file. Translate it in chunks of about 200 lines, appending each chunk to the output file
(create it with the first chunk). When finished, check the output has exactly as many lines as the input and
that the ids match in order. Reply only with: `<input file>: <input lines> in, <output lines> out`.
