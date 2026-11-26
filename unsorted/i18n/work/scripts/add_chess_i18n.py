"""Agrega los textos del mod de ajedrez a ui.tsv (exactos) y rules.tsv (con números/nombres). Idempotente."""
import sys

I18N = r"C:\Users\Mxzzy\Downloads\FreeLife\i18n"
MARK = "## --- chess mod (chess.js) ---"

UI = """
Play, train and compete	Juega, entrena y compite	Jogue, treine e compita
My Chess	Mi ajedrez	Meu xadrez
Improve	Mejorar	Melhorar
Tournaments	Torneos	Torneios
Puzzles	Problemas	Problemas
Train your tactics	Entrena tu táctica	Treine sua tática
No coach	Sin entrenador	Sem treinador
Club coach	Entrenador de club	Treinador de clube
IM coach	Entrenador MI	Treinador MI
GM coach	Entrenador GM	Treinador GM
Final Rounds	Rondas finales	Rodadas finais
Always simulate	Simular siempre	Simular sempre
Ask me to play them	Preguntarme si las juego	Perguntar se eu quero jogar
Give Lessons	Dar clases	Dar aulas
Play Live	Jugar en vivo	Jogar ao vivo
Rapid	Rápida	Rápida
Titled players only	Solo jugadores titulados	Só jogadores titulados
Stream	Transmitir	Fazer live
Join Pawnder	Únete a Pawnder	Entre no Pawnder
Play chess online	Juega ajedrez en línea	Jogue xadrez online
FIDE Unrated	FIDE sin rating	FIDE sem rating
FIDE: Unrated	FIDE: sin rating	FIDE: sem rating
Unrated	Sin rating	Sem rating
Still unrated	Todavía sin rating	Ainda sem rating
Local Club Open	Abierto del club local	Aberto do clube local
National Youth Championship	Campeonato Nacional Juvenil	Campeonato Nacional Juvenil
Regional Open	Abierto Regional	Aberto Regional
National Championship	Campeonato Nacional	Campeonato Nacional
International Open	Abierto Internacional	Aberto Internacional
Super Grandmaster Invitational	Torneo de invitación de súper GMs	Torneio de convidados de super GMs
Candidates Tournament	Torneo de Candidatos	Torneio de Candidatos
Grandmaster	Gran Maestro	Grande Mestre
International Master	Maestro Internacional	Mestre Internacional
FIDE Master	Maestro FIDE	Mestre FIDE
Candidate Master	Candidato a Maestro	Candidato a Mestre
Woman Grandmaster	Gran Maestra Femenina	Grande Mestra Feminina
Woman International Master	Maestra Internacional Femenina	Mestra Internacional Feminina
Woman FIDE Master	Maestra FIDE Femenina	Mestra FIDE Feminina
Woman Candidate Master	Candidata a Maestra Femenina	Candidata a Mestra Feminina
Final Round	Ronda final	Rodada final
Your rating	Tu rating	Seu rating
Opponent	Rival	Adversário
Play the game	Jugar la partida	Jogar a partida
Simulate it	Simularla	Simular
Prize	Premio	Prêmio
Norm	Norma	Norma
Champion!	¡Campeón!	Campeão!
New Title!	¡Nuevo título!	Novo título!
Awesome	Genial	Demais
Titles are for life.	Los títulos son de por vida.	Os títulos são vitalícios.
World Championship Match	Match por el Campeonato Mundial	Match pelo Campeonato Mundial
You won the Candidates! You've earned the right to challenge the World Champion in a 14-game match.	¡Ganaste el Torneo de Candidatos! Te ganaste el derecho de retar al Campeón del Mundo en un match a 14 partidas.	Você venceu o Torneio de Candidatos! Conquistou o direito de desafiar o Campeão Mundial num match de 14 partidas.
Play the match	Jugar el match	Jogar o match
I declined my World Championship match. People think I'm crazy.	Rechacé mi match por el Campeonato Mundial. La gente cree que estoy loco.	Recusei meu match pelo Campeonato Mundial. O pessoal acha que eu enlouqueci.
World Champion!	¡Campeón del mundo!	Campeão mundial!
So close	Tan cerca	Foi por pouco
You are the new World Chess Champion!	¡Eres el nuevo Campeón Mundial de Ajedrez!	Você é o novo Campeão Mundial de Xadrez!
The champion kept the crown.	El campeón retuvo la corona.	O campeão manteve a coroa.
Final score	Marcador final	Placar final
Burned out	Quemado	Esgotado
You've already studied a lot this year.	Ya estudiaste bastante este año.	Você já estudou bastante este ano.
Study session	Sesión de estudio	Sessão de estudo
I studied endgames.	Estudié finales.	Estudei finais.
I solved tactics puzzles.	Resolví problemas de táctica.	Resolvi problemas de tática.
I went over grandmaster games.	Repasé partidas de grandes maestros.	Revisei partidas de grandes mestres.
I worked on my openings.	Trabajé mis aperturas.	Trabalhei minhas aberturas.
I analyzed my losses.	Analicé mis derrotas.	Analisei minhas derrotas.
I practiced calculation.	Practiqué cálculo.	Pratiquei cálculo.
You studied endgames. Your chess is improving.	Estudiaste finales. Tu ajedrez está mejorando.	Você estudou finais. Seu xadrez está melhorando.
You solved tactics puzzles. Your chess is improving.	Resolviste problemas de táctica. Tu ajedrez está mejorando.	Você resolveu problemas de tática. Seu xadrez está melhorando.
You went over grandmaster games. Your chess is improving.	Repasaste partidas de grandes maestros. Tu ajedrez está mejorando.	Você revisou partidas de grandes mestres. Seu xadrez está melhorando.
You worked on your openings. Your chess is improving.	Trabajaste tus aperturas. Tu ajedrez está mejorando.	Você trabalhou suas aberturas. Seu xadrez está melhorando.
You analyzed your losses. Your chess is improving.	Analizaste tus derrotas. Tu ajedrez está mejorando.	Você analisou suas derrotas. Seu xadrez está melhorando.
You practiced calculation. Your chess is improving.	Practicaste cálculo. Tu ajedrez está mejorando.	Você praticou cálculo. Seu xadrez está melhorando.
Hire a Coach	Contratar entrenador	Contratar treinador
A good coach makes you improve much faster. Paid every year.	Un buen entrenador te hace mejorar mucho más rápido. Se paga cada año.	Um bom treinador faz você melhorar muito mais rápido. É pago todo ano.
I stopped working with my chess coach.	Dejé de trabajar con mi entrenador de ajedrez.	Parei de trabalhar com meu treinador de xadrez.
I couldn't afford my chess coach anymore.	Ya no me alcanzaba para pagar a mi entrenador de ajedrez.	Não consegui mais pagar meu treinador de xadrez.
Not yet	Todavía no	Ainda não
You need at least an 1800 rating to give chess lessons.	Necesitas al menos 1800 de rating para dar clases de ajedrez.	Você precisa de pelo menos 1800 de rating para dar aulas de xadrez.
Booked	Agenda llena	Agenda cheia
You already have your students for this year.	Ya tienes tus alumnos para este año.	Você já tem seus alunos para este ano.
Parents won't hire a kid as a chess coach.	Ningún papá va a contratar a un niño como profe de ajedrez.	Nenhum pai vai contratar uma criança como professor de xadrez.
Chess lessons	Clases de ajedrez	Aulas de xadrez
You're too young to make an account.	Eres muy chiquito para crearte una cuenta.	Você é novo demais para criar uma conta.
I made an account on Pawnder.	Me hice una cuenta en Pawnder.	Criei uma conta no Pawnder.
Welcome to Pawnder! Your ratings start at 800 and move fast at first.	¡Bienvenido a Pawnder! Tus ratings empiezan en 800 y al principio se mueven rápido.	Bem-vindo ao Pawnder! Seus ratings começam em 800 e no início mudam rápido.
You've played enough online this year.	Ya jugaste bastante en línea este año.	Você já jogou bastante online este ano.
Only titled players can play Titled Tuesdays.	Solo los jugadores titulados pueden jugar los Titled Tuesday.	Só jogadores titulados podem jogar o Titled Tuesday.
11 rounds of 5-minute blitz against the best titled players online.	11 rondas de blitz a 5 minutos contra los mejores titulados en línea.	11 rodadas de blitz de 5 minutos contra os melhores titulados online.
Nobody watches a stream from an unknown player. Get to 1800 online or earn a title first.	Nadie ve el stream de un desconocido. Llega a 1800 en línea o gana un título primero.	Ninguém assiste live de um desconhecido. Chegue a 1800 online ou conquiste um título antes.
You've already done your streaming for this year.	Ya hiciste tus streams de este año.	Você já fez suas lives deste ano.
Pawnder stream	Stream en Pawnder	Live no Pawnder
Pawnder · Rapid 5+3	Pawnder · Rápida 5+3	Pawnder · Rápida 5+3
I played live rapid games on Pawnder.	Jugué partidas rápidas en vivo en Pawnder.	Joguei partidas rápidas ao vivo no Pawnder.
I spent some time solving chess puzzles.	Pasé un rato resolviendo problemas de ajedrez.	Passei um tempo resolvendo problemas de xadrez.
Too many tournaments	Demasiados torneos	Torneios demais
Opponent is thinking…	El rival está pensando…	O adversário está pensando…
Check! Your move.	¡Jaque! Te toca.	Xeque! Sua vez.
Your move.	Te toca.	Sua vez.
Correct! Keep going.	¡Correcto! Sigue.	Correto! Continue.
Solved (with a hint).	Resuelto (con pista).	Resolvido (com dica).
Solved!	¡Resuelto!	Resolvido!
Next puzzle	Siguiente problema	Próximo problema
Promote to	Coronar a	Promover para
Hint	Pista	Dica
Resign?	¿Te rindes?	Abandonar?
This counts as a loss.	Esto cuenta como derrota.	Isso conta como derrota.
You resigned.	Te rendiste.	Você abandonou.
Keep playing	Seguir jugando	Continuar jogando
Offer draw	Ofrecer tablas	Oferecer empate
You just offered a draw. Wait a few moves.	Acabas de ofrecer tablas. Espera unas jugadas.	Você acabou de oferecer empate. Espere alguns lances.
Your opponent accepted the draw.	Tu rival aceptó las tablas.	Seu adversário aceitou o empate.
Your opponent declined the draw.	Tu rival rechazó las tablas.	Seu adversário recusou o empate.
Simulate	Simular	Simular
You have the white pieces. Your move.	Llevas las blancas. Te toca.	Você está de brancas. Sua vez.
You have the black pieces.	Llevas las negras.	Você está de pretas.
You won!	¡Ganaste!	Você venceu!
You lost	Perdiste	Você perdeu
Checkmate!	¡Jaque mate!	Xeque-mate!
You got checkmated.	Te dieron jaque mate.	Você levou xeque-mate.
You ran out of time.	Se te acabó el tiempo.	Seu tempo acabou.
Draw by stalemate.	Tablas por ahogado.	Empate por afogamento.
Draw by insufficient material.	Tablas por material insuficiente.	Empate por material insuficiente.
Draw by 50-move rule.	Tablas por la regla de las 50 jugadas.	Empate pela regra dos 50 lances.
Draw by threefold repetition.	Tablas por triple repetición.	Empate por repetição tripla.
White to move. Checkmate in 1.	Juegan blancas. Mate en 1.	Brancas jogam. Mate em 1.
White to move. Checkmate in 2.	Juegan blancas. Mate en 2.	Brancas jogam. Mate em 2.
White to move. Find the best move.	Juegan blancas. Encuentra la mejor jugada.	Brancas jogam. Encontre o melhor lance.
Black to move. Checkmate in 1.	Juegan negras. Mate en 1.	Pretas jogam. Mate em 1.
Black to move. Checkmate in 2.	Juegan negras. Mate en 2.	Pretas jogam. Mate em 2.
Black to move. Find the best move.	Juegan negras. Encuentra la mejor jugada.	Pretas jogam. Encontre o melhor lance.
The chess board is still loading. Try again in a second.	El tablero todavía está cargando. Intenta de nuevo en un segundo.	O tabuleiro ainda está carregando. Tente de novo em um segundo.
No puzzles available.	No hay problemas disponibles.	Não há problemas disponíveis.
Resign game	Rendirse	Abandonar
It's a draw	Tablas	Empate
Score	Puntos	Pontos
Result	Resultado	Resultado
Match score	Marcador del match	Placar do match
Games played	Partidas jugadas	Partidas jogadas
Simulate this game	Simular esta partida	Simular esta partida
Simulate the rest	Simular el resto	Simular o resto
You have the white pieces.	Tienes las piezas blancas.	Você tem as peças brancas.
You have the black pieces.	Tienes las piezas negras.	Você tem as peças pretas.
"""

RULES = r"""
^Work on your chess \((\d) left this year\)$	Trabaja en tu ajedrez (te quedan $1 este año)	Treine seu xadrez (restam $1 este ano)
^Puzzle rating (\d+) · (\d+) solved$	Rating de problemas $1 · $2 resueltos	Rating de problemas $1 · $2 resolvidos
^peak (\d+)$	pico $1	pico $1
^(\d+)/5 games for a rating$	$1/5 partidas para tener rating	$1/5 partidas para ter rating
^Norms IM (\d)/3 GM (\d)/3$	Normas MI $1/3 GM $2/3	Normas MI $1/3 GM $2/3
^Age (\d+)\+$	Edad $1+	Idade $1+
^Under (\d+) only$	Solo menores de $1	Só para menores de $1
^Invitation only \((\d+)\+\)$	Solo por invitación ($1+)	Só por convite ($1+)
^(\d+) rounds · invited$	$1 rondas · por invitación	$1 rodadas · por convite
^(\d+) rounds · parents pay the fee$	$1 rondas · tus papás pagan la inscripción	$1 rodadas · seus pais pagam a inscrição
^(\d+) rounds · fee (\S+) \+ travel$	$1 rondas · inscripción $2 + viaje	$1 rodadas · inscrição $2 + viagem
^(\d+) rounds · fee (\S+)$	$1 rondas · inscripción $2	$1 rodadas · inscrição $2
^Earn (\S+)/hour$	Gana $1/hora	Ganhe $1/hora
^Rapid 5\+3 vs a real opponent · (\d+\??)$	Rápida 5+3 contra un rival de verdad · $1	Rápida 5+3 contra um adversário de verdade · $1
^([\d,]+) followers$	$1 seguidores	$1 seguidores
^(.+): you have ([\d.]+)/(\d+) going into the last round\.$	$1: llevas $2/$3 antes de la última ronda.	$1: você tem $2/$3 antes da última rodada.
^Your opponent is (.+) \((\d+)\)\.$	Tu rival es $1 ($2).	Seu adversário é $1 ($2).
^(.+) · Round (\d+)$	$1 · Ronda $2	$1 · Rodada $2
^You won the (.+)!$	¡Ganaste el $1!	Você venceu o $1!
^A solid tournament at the (.+)\.$	Buen torneo en el $1.	Um bom torneio no $1.
^A rough tournament at the (.+)\.$	Torneo difícil en el $1.	Um torneio difícil no $1.
^First rating: (\d+)$	Primer rating: $1	Primeiro rating: $1
^(\d+)(?:st|nd|rd|th)$	$1.º	$1º
^(IM|GM) norm \((\d)/3\)$	Norma de $1 ($2/3)	Norma de $1 ($2/3)
^I played the (.+) and scored ([\d.]+)/(\d+), finishing (\d+)(?:st|nd|rd|th)\. I won (.+)\.$	Jugué el $1, hice $2/$3 y quedé en el puesto $4. Gané $5.	Joguei o $1, fiz $2/$3 e terminei em $4º lugar. Ganhei $5.
^I played the (.+) and scored ([\d.]+)/(\d+), finishing (\d+)(?:st|nd|rd|th)\.$	Jugué el $1, hice $2/$3 y quedé en el puesto $4.	Joguei o $1, fiz $2/$3 e terminei em $4º lugar.
^I earned an? (IM|GM) norm!$	¡Conseguí una norma de $1!	Consegui uma norma de $1!
^I earned the title of (.+)!$	¡Me dieron el título de $1!	Recebi o título de $1!
^FIDE has awarded you the title of (.+) \((\w+)\)\.$	La FIDE te otorgó el título de $1 ($2).	A FIDE concedeu a você o título de $1 ($2).
^I became the World Chess Champion after tiebreaks! I earned (.+)\.$	¡Me convertí en Campeón Mundial de Ajedrez en el desempate! Gané $1.	Virei Campeão Mundial de Xadrez no desempate! Ganhei $1.
^I became the World Chess Champion! I earned (.+)\.$	¡Me convertí en Campeón Mundial de Ajedrez! Gané $1.	Virei Campeão Mundial de Xadrez! Ganhei $1.
^I lost the World Championship match after tiebreaks\. I still earned (.+)\.$	Perdí el match por el Campeonato Mundial en el desempate. Igual gané $1.	Perdi o match pelo Campeonato Mundial no desempate. Mesmo assim ganhei $1.
^I lost the World Championship match\. I still earned (.+)\.$	Perdí el match por el Campeonato Mundial. Igual gané $1.	Perdi o match pelo Campeonato Mundial. Mesmo assim ganhei $1.
^([\d.]+) – ([\d.]+) after tiebreaks$	$1 – $2 en el desempate	$1 – $2 no desempate
^Current: (.+)$	Actual: $1	Atual: $1
^(.+) \((\S+)/yr\) \(current\)$	$1 ($2/año) (actual)	$1 ($2/ano) (atual)
^(.+) \((\S+)/yr\)$	$1 ($2/año)	$1 ($2/ano)
^(.+) \(current\)$	$1 (actual)	$1 (atual)
^I hired a new chess coach \((.+)\)\.$	Contraté un nuevo entrenador de ajedrez ($1).	Contratei um novo treinador de xadrez ($1).
^I gave (\d+) hours of chess lessons and earned (.+)\.$	Di $1 horas de clases de ajedrez y gané $2.	Dei $1 horas de aulas de xadrez e ganhei $2.
^You taught (\d+) hours of lessons this year and earned (.+)\.$	Diste $1 horas de clases este año y ganaste $2.	Você deu $1 horas de aula este ano e ganhou $2.
^You need (.+) to enter \(fee \+ travel\)\.$	Necesitas $1 para inscribirte (inscripción + viaje).	Você precisa de $1 para se inscrever (inscrição + viagem).
^You need (.+) to enter \(fee\)\.$	Necesitas $1 para inscribirte.	Você precisa de $1 para se inscrever.
^You've already played (\d+) tournaments this year\. Rest up!$	Ya jugaste $1 torneos este año. ¡Descansa!	Você já jogou $1 torneios este ano. Descanse!
^I played (\d+) (bullet|blitz|rapid) games on Pawnder \((\d+)W (\d+)D (\d+)L\)\.$	Jugué $1 partidas de $2 en Pawnder ($3G $4T $5P).	Joguei $1 partidas de $2 no Pawnder ($3V $4E $5D).
^(Bullet|Blitz|Rapid) session$	Sesión de $1	Sessão de $1
^You played (\d+) (bullet|blitz|rapid) games\.$	Jugaste $1 partidas de $2.	Você jogou $1 partidas de $2.
^(\d+)W (\d+)D (\d+)L$	$1G $2T $3P	$1V $2E $3D
^I played Pawnder Titled Tuesday and scored ([\d.]+)/11, winning (.+)\.$	Jugué el Titled Tuesday de Pawnder, hice $1/11 y gané $2.	Joguei o Titled Tuesday do Pawnder, fiz $1/11 e ganhei $2.
^I played Pawnder Titled Tuesday and scored ([\d.]+)/11\.$	Jugué el Titled Tuesday de Pawnder e hice $1/11.	Joguei o Titled Tuesday do Pawnder e fiz $1/11.
^I streamed chess on Pawnder and gained ([\d,]+) followers\.$	Transmití ajedrez en Pawnder y gané $1 seguidores.	Fiz live de xadrez no Pawnder e ganhei $1 seguidores.
^You gained ([\d,]+) followers\. You have ([\d,]+) now\.$	Ganaste $1 seguidores. Ahora tienes $2.	Você ganhou $1 seguidores. Agora tem $2.
^Puzzle · rated (\d+)$	Problema · nivel $1	Problema · nível $1
^Your puzzle rating: (\d+)$	Tu rating de problemas: $1	Seu rating de problemas: $1
^Puzzle rating: (\d+) → (\d+)$	Rating de problemas: $1 → $2	Rating de problemas: $1 → $2
^Rapid rating: (\d+) → (\d+)$	Rating de rápidas: $1 → $2	Rating de rápidas: $1 → $2
^Wrong move\. The answer was (\S+)\.$	Jugada incorrecta. La respuesta era $1.	Lance errado. A resposta era $1.
^Not quite\. The answer was (\S+)\.$	Casi. La respuesta era $1.	Quase. A resposta era $1.
^Banned until age (\d+)$	Suspendido hasta los $1 años	Suspenso até os $1 anos
^FIDE suspended you until age (\d+)\.$	La FIDE te suspendió hasta los $1 años.	A FIDE te suspendeu até os $1 anos.
^(\d+) years$	$1 años	$1 anos
^(.+) per year$	$1 por año	$1 por ano
^Game (\d+)$	Partida $1	Partida $1
^Tiebreak game (\d+)$	Partida de desempate $1	Partida de desempate $1
^World Championship · (.+)$	Campeonato Mundial · $1	Campeonato Mundial · $1
^Match score: ([\d.]+) – ([\d.]+)$	Marcador del match: $1 – $2	Placar do match: $1 – $2
^World Championship match vs (.+) \((\d+)\)\.$	Match por el Campeonato Mundial contra $1 ($2).	Match pelo Campeonato Mundial contra $1 ($2).
^(.+) with a firearm$	$1 con arma de fuego	$1 com arma de fogo
^(.+) and illegal firearm possession$	$1 y posesión ilegal de arma de fuego	$1 e porte ilegal de arma de fogo
^(.+) and possession of an automatic weapon$	$1 y posesión de arma automática	$1 e posse de arma automática
^attempted purchase of an illegal firearm$	intento de compra de arma de fuego ilegal	tentativa de compra de arma de fogo ilegal
^You have to be at least (\d+) years old to buy that\.$	Tienes que tener al menos $1 años para comprar eso.	Você precisa ter pelo menos $1 anos para comprar isso.
^Power (\d+%)$	Poder $1	Poder $1
^Police heat \+(\d+)$	Calor policial +$1	Atenção da polícia +$1
^Magazines (\d+)$	Cargadores $1	Pentes $1
^Parts (\d+)$	Piezas $1	Peças $1
^Price: (.+)$	Precio: $1	Preço: $1
^(.+) ×(\d+)$	$1 ×$2	$1 ×$2
^Switch \((.+)\)$	Switch ($1)	Switch ($1)
"""

UI += """
My chess league team released me.	Mi equipo de la liga de ajedrez me dejó ir.	Meu time da liga de xadrez me dispensou.
"""


RULES += r"""
^Rep (\d+)$	Reputación $1	Reputação $1
^Heat (\d+)$	Calor $1	Atenção $1
^Requires rank: (.+)$	Requiere rango: $1	Requer patente: $1
^(.+) · (Prospect|Soldier|Enforcer|Lieutenant|Shot Caller|Boss)$	$1 · $2	$1 · $2
^Bond (\d+)$	Confianza $1	Confiança $1
^(\d+) members$	$1 miembros	$1 membros
^Buy · (.+)$	Comprar · $1	Comprar · $1
^Term (\d+)–(\d+) · Election in (\d+) years?$	Mandato $1–$2 · Elección en $3 años	Mandato $1–$2 · Eleição em $3 anos
^(\d{4})–(\d{4}) · Election in 1 year$	$1–$2 · Elección en 1 año	$1–$2 · Eleição em 1 ano
^(\d{4})–(\d{4}) · Election in (\d+) years?$	$1–$2 · Elección en $3 años	$1–$2 · Eleição em $3 anos
^(\d{4})–(\d{4}) · Election this year$	$1–$2 · Elección este año	$1–$2 · Eleição este ano
^(\d{4}) · (\d+) years?$	$1 · $2 años	$1 · $2 anos
^Term (\d+)–(\d+) · Election this year$	Mandato $1–$2 · Elección este año	Mandato $1–$2 · Eleição este ano
^Campaign Actions \((\d+) left\)$	Acciones de campaña ($1 restantes)	Ações de campanha ($1 restantes)
^Actions \((\d+) left\)$	Acciones ($1 restantes)	Ações ($1 restantes)
^Election in 1 year$	Elección en 1 año	Eleção em 1 ano
^Election in (\d+) years?$	Elección en $1 años	Eleição em $1 anos
^(.+) · Approval (\d+)%$	$1 · Aprobación $2%	$1 · Aprovação $2%
^Candidate for (.+)$	Candidato a $1	Candidato a $1
^Running for (.+)$	Candidato a $1	Candidato a $1
^Run for (.+)$	Postúlate a $1	Candidate-se a $1
^Term (\d+) years$	Mandato de $1 años	Mandato de $1 anos
^(.+)/year$	$1/año	$1/ano
^Your share (\d+)%$	Tu porcentaje $1%	Sua porcentagem $1%
^Opponent share (\d+)%$	Porcentaje del rival $1%	Porcentagem do rival $1%
^Personal money: (.+)$	Dinero personal: $1	Dinheiro pessoal: $1
"""


def from_events():
    # Saca los T("en", "es", "pt") de los mods: chess-events.js (eventos de ajedrez) y gang.js (Gang Bang).
    import re
    src = "".join(open(rf"C:\Users\Mxzzy\Downloads\FreeLife\{f}", encoding="utf-8").read() for f in ("chess-events.js", "gang.js", "arms.js", "politician.js"))
    s = r'"((?:[^"\\]|\\.)*)"'
    rows = re.findall(r"T\(\s*" + s + r"\s*,\s*" + s + r"\s*,\s*" + s + r"\s*\)", src)
    un = lambda x: x.replace('\\"', '"').replace("\\\\", "\\")
    return [(un(a), un(b), un(c)) for a, b, c in rows]


def existing_keys(path):
    # claves que ya están en el diccionario fuera de la sección del mod (para no generar conflictos)
    text = open(path, encoding="utf-8").read()
    if MARK in text:
        text = text[: text.index(MARK)]
    return {l.split("\t")[0].lower() for l in text.splitlines() if l and not l.startswith("#") and "\t" in l}


_have = existing_keys(I18N + r"\ui.tsv")
_mine = {l.split("\t")[0].lower() for l in UI.strip().splitlines() if "\t" in l}
_ev = []
for en, es, pt in from_events():
    k = en.lower()
    if k in _have or k in _mine:
        continue
    _mine.add(k)
    _ev.append(f"{en}\t{es}\t{pt}")
print("textos de eventos:", len(_ev))
UI += "\n" + "\n".join(_ev) + "\n"


def add(path, block):
    with open(path, encoding="utf-8") as f:
        text = f.read()
    if MARK in text:  # ya estaba: reemplaza la sección
        text = text[: text.index(MARK)].rstrip("\n") + "\n"
    lines = [l for l in block.strip("\n").split("\n") if l.strip()]
    for l in lines:
        if len(l.split("\t")) != 3:
            sys.exit(f"línea mal formada en {path}: {l!r}")
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(text.rstrip("\n") + "\n" + MARK + "\n" + "\n".join(lines) + "\n")
    return len(lines)


print("ui.tsv +", add(I18N + r"\ui.tsv", UI))
print("rules.tsv +", add(I18N + r"\rules.tsv", RULES))
