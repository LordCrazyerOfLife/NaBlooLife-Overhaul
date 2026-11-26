"""Appends the bold-split casino/auction templates to events.tsv, keeping its line endings."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
I18N = os.path.dirname(os.path.dirname(HERE))
path = os.path.join(I18N, "events.tsv")

TPL = [
    ("The {lot} is yours for {price} + {premium} premium = {total}.",
     "{lot} es tuyo por {price} + {premium} de comisión = {total}.",
     "{lot} é seu por {price} + {premium} de comissão = {total}."),
    ("The {lot} is yours for {price} + {premium} premium + {shell} shell fee = {total}.",
     "{lot} es tuyo por {price} + {premium} de comisión + {shell} de empresa fantasma = {total}.",
     "{lot} é seu por {price} + {premium} de comissão + {shell} de empresa de fachada = {total}."),
    ("{winner} took the {lot} for {price}. After the 12% commission you receive {net}.",
     "{winner} se llevó {lot} por {price}. Después de la comisión del 12%, recibes {net}.",
     "{winner} levou {lot} por {price}. Depois da comissão de 12%, você recebe {net}."),
    ("{name} ({title}) took the {lot} for {price}.",
     "{name} ({title}) se llevó {lot} por {price}.",
     "{name} ({title}) levou {lot} por {price}."),
    ("{lot}: nobody reached the reserve. You keep it.",
     "{lot}: nadie alcanzó la reserva. Te lo quedas.",
     "{lot}: ninguém atingiu a reserva. Fica com você."),
    ("You have {money} on <b>{what}</b>.",
     "Tienes {money} en <b>{what}</b>.",
     "Você tem {money} em <b>{what}</b>."),
    ("You have {money} on the <b>pass line</b>.",
     "Tienes {money} en la <b>línea de pase</b>.",
     "Você tem {money} na <b>linha de passe</b>."),
    ("You have {money} on the <b>don't pass line</b>.",
     "Tienes {money} en la <b>línea de no pasar</b>.",
     "Você tem {money} na <b>linha de não passar</b>."),
    ("Pick 1 to 10 numbers. Bet: <b>{money}</b>.",
     "Elige de 1 a 10 números. Apuesta: <b>{money}</b>.",
     "Escolha de 1 a 10 números. Aposta: <b>{money}</b>."),
    ("Your stake: <b>{money}</b>. Pick a result.",
     "Tu apuesta: <b>{money}</b>. Elige un resultado.",
     "Sua aposta: <b>{money}</b>. Escolha um resultado."),
    ("{a} vs {b}<br>Your pick: <b>{pick}</b> at x{odds}.",
     "{a} vs {b}<br>Tu elección: <b>{pick}</b> a x{odds}.",
     "{a} vs {b}<br>Sua escolha: <b>{pick}</b> a x{odds}."),
    ('Ante <b>{money}</b>. Pot: <b id="txP">{pot}</b>',
     'Ante <b>{money}</b>. Bote: <b id="txP">{pot}</b>',
     'Ante <b>{money}</b>. Pote: <b id="txP">{pot}</b>'),
    ("Pot: <b>{money}</b> &middot; Streak: <b>{streak}</b>",
     "Bote: <b>{money}</b> &middot; Racha: <b>{streak}</b>",
     "Pote: <b>{money}</b> &middot; Sequência: <b>{streak}</b>"),
    ("The point is <b>{point}</b>. Roll it again before a 7.",
     "El punto es <b>{point}</b>. Tira otra vez antes de un 7.",
     "O ponto é <b>{point}</b>. Role de novo antes de um 7."),
    ("Rolled <b>{sum}</b>. Point is <b>{point}</b>.",
     "Salió <b>{sum}</b>. El punto es <b>{point}</b>.",
     "Saiu <b>{sum}</b>. O ponto é <b>{point}</b>."),
    ("Picked <b>{k}</b>/10 &middot; top prize <b>x{top}</b>",
     "Elegiste <b>{k}</b>/10 &middot; premio mayor <b>x{top}</b>",
     "Escolheu <b>{k}</b>/10 &middot; prêmio máximo <b>x{top}</b>"),
    ("Ball <b>{i}</b>/20 &middot; hits: <b>{hits}</b>",
     "Bola <b>{i}</b>/20 &middot; aciertos: <b>{hits}</b>",
     "Bola <b>{i}</b>/20 &middot; acertos: <b>{hits}</b>"),
    ("Full time: <b>{h} - {a}</b>",
     "Final del partido: <b>{h} - {a}</b>",
     "Fim de jogo: <b>{h} - {a}</b>"),
    ("You: <b>{hand}</b> &middot; Dealer: <b>{dealer}</b>",
     "Tú: <b>{hand}</b> &middot; Crupier: <b>{dealer}</b>",
     "Você: <b>{hand}</b> &middot; Crupiê: <b>{dealer}</b>"),
    ("The dealer bets <b>{money}</b>.",
     "El crupier apuesta <b>{money}</b>.",
     "O crupiê aposta <b>{money}</b>."),
]

data = open(path, "r", encoding="utf-8", newline="").read()
nl = "\r\n" if "\r\n" in data else "\n"
have = {line.split("\t")[0] for line in data.splitlines() if "\t" in line}
add = [t for t in TPL if t[0] not in have]
if not data.endswith(("\n", "\r")):
    data += nl
with open(path, "a", encoding="utf-8", newline="") as f:
    f.write("".join("\t".join(t) + nl for t in add))
print(f"events.tsv: +{len(add)} templates (skipped {len(TPL) - len(add)} present), newline={nl!r}")
