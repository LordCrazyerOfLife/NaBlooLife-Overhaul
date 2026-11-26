/* [mod] Eventos de la carrera de ajedrez (Chess Career). 30 eventos con decisiones.
 * Cada texto va como T("english", "español", "português"): el juego usa el inglés y el i18n traduce;
 * i18n/work/scripts/add_chess_i18n.py saca los tres idiomas de acá al ui.tsv.
 * REGLA: los textos de T() van entre comillas dobles, sin template literals ni valores dinámicos.
 *
 * X (contexto que arma chess.js): c (state.chess), yr (actividad del año que terminó), age, fide, title,
 *   online (mejor rating online o 0), chance(p), beats(elo), out(texto, efectos, log)
 * Efectos: str, fide, money (USD), H (felicidad), He (salud), S (smarts), L (looks), followers, online (delta a los
 *   3 ritmos), ban (años sin torneos FIDE), onlineBan (true), sponsor (USD/año, 0 = se va), league (USD/año)
 */
(function (root) {
  const T = (en) => en;

  const LABELS = [
    T("Rating", "Rating", "Rating"),
    T("Money", "Dinero", "Dinheiro"),
    T("Happiness", "Felicidad", "Felicidade"),
    T("Health", "Salud", "Saúde"),
    T("Smarts", "Inteligencia", "Inteligência"),
    T("Looks", "Apariencia", "Aparência"),
    T("Followers", "Seguidores", "Seguidores"),
    T("Online rating", "Rating en línea", "Rating online"),
    T("Banned", "Suspendido", "Suspenso"),
    T("Sponsor", "Patrocinador", "Patrocinador"),
    T("League contract", "Contrato de liga", "Contrato de liga"),
    T("Chess Life", "Vida de ajedrez", "Vida no xadrez"),
    T("years", "años", "anos"),
    T("per year", "por año", "por ano"),
    T("Account closed", "Cuenta cerrada", "Conta encerrada"),
    T("Ended", "Terminado", "Encerrado"),
  ];

  const EVENTS = [
    // 1
    {
      id: "cheat_offer", icon: "emoji/1f3a7.png",
      when: (X) => X.fide >= 1800 && X.yr.tourneys > 0,
      title: T("Shady Offer", "Oferta turbia", "Oferta suspeita"),
      lead: T("A shady guy offers you a tiny earpiece connected to a chess engine for your next tournament.", "Un tipo turbio te ofrece un audífono diminuto conectado a un motor de ajedrez para tu próximo torneo.", "Um cara suspeito te oferece um fone minúsculo ligado a um motor de xadrez para o seu próximo torneio."),
      choices: [
        [T("Use it", "Usarlo", "Usar"), (X) => X.chance(0.65)
          ? X.out(T("Nobody noticed. You crushed the field, but you know the truth.", "Nadie se dio cuenta. Arrasaste en el torneo, pero tú sabes la verdad.", "Ninguém percebeu. Você arrasou no torneio, mas sabe a verdade."), { fide: 45, money: 2500, H: -5 }, T("I cheated with an engine in a tournament and got away with it.", "Hice trampa con un motor en un torneo y no me atraparon.", "Trapaceei com um motor num torneio e não me pegaram."))
          : X.out(T("The arbiter found the earpiece. FIDE banned you and everyone knows.", "El árbitro encontró el audífono. La FIDE te suspendió y todo el mundo se enteró.", "O árbitro achou o fone. A FIDE te suspendeu e todo mundo ficou sabendo."), { fide: -80, H: -25, ban: 3, followers: -2000 }, T("I got caught cheating with an engine and FIDE banned me.", "Me atraparon haciendo trampa con un motor y la FIDE me suspendió.", "Fui pego trapaceando com um motor e a FIDE me suspendeu."))],
        [T("Say no", "Decir que no", "Dizer não"), (X) => X.out(T("You told him to get lost. You'd rather lose honestly.", "Lo mandaste a volar. Prefieres perder con honestidad.", "Você mandou ele sumir. Prefere perder com honestidade."), { H: 5 }, T("I turned down an offer to cheat at chess.", "Rechacé una oferta para hacer trampa en el ajedrez.", "Recusei uma oferta para trapacear no xadrez."))],
        [T("Report him", "Denunciarlo", "Denunciar"), (X) => X.out(T("The federation thanked you. Your name came up in the news as the honest one.", "La federación te dio las gracias. Saliste en las noticias como el honesto de la historia.", "A federação te agradeceu. Você apareceu nas notícias como o honesto da história."), { H: 8, followers: 800 }, T("I reported a guy who was selling chess cheating devices.", "Denuncié a un tipo que vendía aparatos para hacer trampa en el ajedrez.", "Denunciei um cara que vendia aparelhos para trapacear no xadrez."))],
      ],
    },
    // 2
    {
      id: "false_accusation", icon: "emoji/1f4f0.png",
      when: (X) => (X.fide >= 2000 || X.online >= 1900) && (X.yr.tourneys > 0 || X.yr.online > 0),
      title: T("Cheating Accusation", "Acusación de trampa", "Acusação de trapaça"),
      lead: T("After a great result, a well-known player publicly accuses you of cheating. You didn't.", "Después de un gran resultado, un jugador conocido te acusa públicamente de hacer trampa. No lo hiciste.", "Depois de um ótimo resultado, um jogador conhecido te acusa publicamente de trapaça. Você não trapaceou."),
      choices: [
        [T("Sue him", "Demandarlo", "Processar"), (X) => X.chance(0.6)
          ? X.out(T("You won the lawsuit. He had to pay and apologize publicly.", "Ganaste la demanda. Tuvo que pagarte y pedirte perdón en público.", "Você ganhou o processo. Ele teve que pagar e pedir desculpas em público."), { money: 25000, H: 15, followers: 3000 }, T("I sued a player who falsely accused me of cheating and won.", "Demandé a un jugador que me acusó de trampa sin pruebas y gané.", "Processei um jogador que me acusou de trapaça sem provas e ganhei."))
          : X.out(T("The judge threw out the case. Your lawyer still sent you the bill.", "El juez desestimó el caso. Igual tu abogado te mandó la factura.", "O juiz arquivou o caso. Mesmo assim seu advogado mandou a conta."), { money: -8000, H: -10 }, T("I lost a lawsuit against a player who accused me of cheating.", "Perdí una demanda contra un jugador que me acusó de trampa.", "Perdi um processo contra um jogador que me acusou de trapaça."))],
        [T("Ignore it", "Ignorarlo", "Ignorar"), (X) => X.out(T("It died down after a few weeks, but some people still whisper.", "Se calmó después de unas semanas, pero todavía hay gente que murmura.", "Acalmou depois de algumas semanas, mas ainda tem gente cochichando."), { H: -8 }, T("I ignored a cheating accusation against me.", "Ignoré una acusación de trampa en mi contra.", "Ignorei uma acusação de trapaça contra mim."))],
        [T("Make a video about it", "Hacer un video sobre eso", "Fazer um vídeo sobre isso"), (X) => X.out(T("Your response video blew up. Drama is good for views.", "Tu video de respuesta explotó. El drama da vistas.", "Seu vídeo de resposta bombou. Drama dá views."), { followers: 12000, H: -3 }, T("I made a viral video answering a cheating accusation.", "Hice un video viral respondiendo a una acusación de trampa.", "Fiz um vídeo viral respondendo a uma acusação de trapaça."))],
      ],
    },
    // 3
    {
      id: "rivalry", icon: "emoji/1f525.png",
      when: (X) => X.fide >= 1600 && X.yr.tourneys >= 2,
      title: T("A Rivalry Is Born", "Nace una rivalidad", "Nasce uma rivalidade"),
      lead: T("You keep getting paired against the same player at every tournament. People are calling it a rivalry.", "Te toca el mismo rival en todos los torneos. La gente ya lo llama una rivalidad.", "Você sempre pega o mesmo adversário em todos os torneios. O pessoal já chama de rivalidade."),
      choices: [
        [T("Trash talk him online", "Tirarle en redes", "Provocar nas redes"), (X) => X.chance(0.5)
          ? X.out(T("The beef got you fired up. You've never studied harder.", "El pique te motivó. Nunca habías estudiado tanto.", "A treta te motivou. Você nunca estudou tanto."), { str: 25, followers: 2500 }, T("I started a public rivalry with another chess player.", "Empecé una rivalidad pública con otro ajedrecista.", "Comecei uma rivalidade pública com outro enxadrista."))
          : X.out(T("He crushed you in your next game and the internet roasted you.", "Te aplastó en la siguiente partida y el internet te funó.", "Ele te esmagou na partida seguinte e a internet te zoou."), { H: -12, followers: 1500 }, T("I trash talked a rival and then lost to him.", "Le tiré a un rival y después perdí contra él.", "Provoquei um rival e depois perdi para ele."))],
        [T("Show respect", "Mostrar respeto", "Mostrar respeito"), (X) => X.out(T("You shook hands and grabbed a coffee. Turns out he's pretty cool.", "Se dieron la mano y fueron por un café. Resulta que es buena gente.", "Vocês apertaram as mãos e tomaram um café. Ele é gente boa."), { H: 8 }, T("I made peace with my chess rival.", "Hice las paces con mi rival de ajedrez.", "Fiz as pazes com meu rival de xadrez."))],
        [T("Study his games", "Estudiar sus partidas", "Estudar as partidas dele"), (X) => X.out(T("You found the holes in his repertoire. Next time you'll be ready.", "Encontraste los huecos de su repertorio. La próxima vez vas a estar listo.", "Você achou os furos no repertório dele. Na próxima vez vai estar pronto."), { str: 15, S: 2 }, T("I studied every game of my chess rival.", "Estudié todas las partidas de mi rival.", "Estudei todas as partidas do meu rival."))],
      ],
    },
    // 4
    {
      id: "time_trouble", icon: "emoji/23f1-fe0f.png",
      when: (X) => X.yr.tourneys > 0,
      title: T("Time Trouble", "Apuro de tiempo", "Apuro de tempo"),
      lead: T("You're winning, but you only have 10 seconds left on your clock.", "Vas ganando, pero solo te quedan 10 segundos en el reloj.", "Você está ganhando, mas só tem 10 segundos no relógio."),
      choices: [
        [T("Play fast and go for mate", "Jugar rápido y buscar el mate", "Jogar rápido e buscar o mate"), (X) => X.chance(0.55)
          ? X.out(T("Checkmate with one second left! The crowd went wild.", "¡Jaque mate con un segundo en el reloj! El público se volvió loco.", "Xeque-mate com um segundo no relógio! A plateia foi à loucura."), { fide: 12, H: 10 }, T("I checkmated my opponent with one second left on my clock.", "Le di jaque mate a mi rival con un segundo en el reloj.", "Dei xeque-mate no meu adversário com um segundo no relógio."))
          : X.out(T("Your flag fell. You lost a completely winning game.", "Se te cayó la bandera. Perdiste una partida que tenías ganada.", "Seu tempo acabou. Você perdeu uma partida ganha."), { fide: -12, H: -12 }, T("I lost a winning chess game on time.", "Perdí por tiempo una partida que tenía ganada.", "Perdi no tempo uma partida que estava ganha."))],
        [T("Trade pieces and play safe", "Cambiar piezas y jugar seguro", "Trocar peças e jogar seguro"), (X) => X.out(T("You simplified into an easy endgame and won it slowly.", "Simplificaste a un final fácil y lo ganaste con calma.", "Você simplificou para um final fácil e venceu com calma."), { fide: 6 }, T("I won a tense chess game by playing it safe.", "Gané una partida tensa jugando seguro.", "Venci uma partida tensa jogando seguro."))],
        [T("Offer a draw", "Ofrecer tablas", "Oferecer empate"), (X) => X.out(T("Your opponent accepted instantly. You'll never know if you would've won.", "Tu rival aceptó al instante. Nunca vas a saber si ganabas.", "Seu adversário aceitou na hora. Você nunca vai saber se teria vencido."), {}, T("I offered a draw in a winning position.", "Ofrecí tablas en una posición ganadora.", "Ofereci empate numa posição ganha."))],
      ],
    },
    // 5
    {
      id: "arranged_draw", icon: "emoji/1f91d.png",
      when: (X) => X.fide >= 2100 && X.yr.tourneys > 0,
      title: T("Quick Draw?", "¿Tablas rápidas?", "Empate rápido?"),
      lead: T("In the last round, a draw qualifies both you and your opponent. He whispers an offer to agree to a draw before the game.", "En la última ronda, unas tablas clasifican a los dos. Tu rival te susurra que pacten las tablas antes de jugar.", "Na última rodada, um empate classifica os dois. Seu adversário sussurra para combinarem o empate antes do jogo."),
      choices: [
        [T("Agree to the draw", "Pactar las tablas", "Combinar o empate"), (X) => X.chance(0.85)
          ? X.out(T("Ten moves and a handshake. You both qualified.", "Diez jugadas y un apretón de manos. Los dos clasificaron.", "Dez lances e um aperto de mão. Os dois se classificaram."), { money: 1500 }, T("I agreed to a quick draw to qualify for the next event.", "Pacté unas tablas rápidas para clasificar.", "Combinei um empate rápido para me classificar."))
          : X.out(T("The arbiter noticed. Both of you were fined and disqualified.", "El árbitro se dio cuenta. Los dos fueron multados y descalificados.", "O árbitro percebeu. Os dois foram multados e desclassificados."), { money: -1000, fide: -20, H: -15 }, T("I got disqualified for arranging a draw.", "Me descalificaron por pactar unas tablas.", "Fui desclassificado por combinar um empate."))],
        [T("Play to win", "Jugar a ganar", "Jogar para vencer"), (X) => X.beats(X.fide)
          ? X.out(T("You won the game and the tournament. Fortune favors the bold.", "Ganaste la partida y el torneo. La suerte favorece a los valientes.", "Você venceu a partida e o torneio. A sorte favorece os ousados."), { fide: 15, money: 4000, H: 12 }, T("I refused a draw and won the tournament.", "Rechacé las tablas y gané el torneo.", "Recusei o empate e venci o torneio."))
          : X.out(T("You pushed too hard and lost. Now neither of you is happy.", "Te arriesgaste demasiado y perdiste. Ahora ninguno de los dos está contento.", "Você arriscou demais e perdeu. Agora nenhum dos dois está feliz."), { fide: -15, H: -10 }, T("I refused a draw offer and lost the game.", "Rechacé las tablas y perdí la partida.", "Recusei o empate e perdi a partida."))],
        [T("Tell the arbiter", "Decírselo al árbitro", "Contar ao árbitro"), (X) => X.out(T("He got a warning. Half the players think you're a snitch, the other half respect you.", "Le dieron una advertencia. La mitad de los jugadores te ve como soplón y la otra mitad te respeta.", "Ele levou uma advertência. Metade dos jogadores te acha dedo-duro, a outra metade te respeita."), { H: 3 }, T("I reported an illegal draw offer to the arbiter.", "Denuncié una oferta ilegal de tablas al árbitro.", "Denunciei uma oferta ilegal de empate ao árbitro."))],
      ],
    },
    // 6
    {
      id: "prep_leak", icon: "emoji/1f4bb.png",
      when: (X) => X.fide >= 2350 && X.yr.tourneys > 0,
      title: T("Prep Leak", "Filtración", "Vazamento"),
      lead: T("Your secret opening preparation leaked online right before a big tournament.", "Tu preparación secreta de aperturas se filtró en internet justo antes de un torneo importante.", "Sua preparação secreta de aberturas vazou na internet bem antes de um torneio importante."),
      choices: [
        [T("Change your whole repertoire", "Cambiar todo tu repertorio", "Mudar todo o repertório"), (X) => X.out(T("You spent weeks learning new lines. Exhausting, but nobody saw it coming.", "Pasaste semanas aprendiendo líneas nuevas. Agotador, pero nadie se lo esperaba.", "Você passou semanas aprendendo linhas novas. Cansativo, mas ninguém esperava."), { S: 3, H: -6, str: 5 }, T("I rebuilt my whole opening repertoire after a leak.", "Rehice todo mi repertorio de aperturas después de una filtración.", "Refiz todo o meu repertório de aberturas depois de um vazamento."))],
        [T("Play it anyway", "Jugarla igual", "Jogar mesmo assim"), (X) => X.chance(0.4)
          ? X.out(T("Your opponents prepared for the leak, but you had a twist ready. It worked.", "Tus rivales se prepararon para la filtración, pero tenías una sorpresa lista. Funcionó.", "Seus adversários se prepararam para o vazamento, mas você tinha uma surpresa pronta. Funcionou."), { fide: 15 }, T("I used my leaked preparation anyway and it worked.", "Usé igual mi preparación filtrada y me salió bien.", "Usei minha preparação vazada mesmo assim e deu certo."))
          : X.out(T("Everyone knew your moves. It was a disaster.", "Todo el mundo se sabía tus jugadas. Fue un desastre.", "Todo mundo sabia seus lances. Foi um desastre."), { fide: -25, H: -8 }, T("My leaked preparation got punished at the board.", "Me castigaron la preparación filtrada en el tablero.", "Minha preparação vazada foi punida no tabuleiro."))],
        [T("Find who leaked it", "Buscar quién la filtró", "Descobrir quem vazou"), (X) => X.out(T("It was your own second. You fired him.", "Fue tu propio segundo. Lo despediste.", "Foi seu próprio auxiliar. Você o demitiu."), { H: -5, S: 1 }, T("I fired my chess second for leaking my preparation.", "Despedí a mi segundo por filtrar mi preparación.", "Demiti meu auxiliar por vazar minha preparação."))],
      ],
    },
    // 7
    {
      id: "sponsor_offer", icon: "emoji/1f4b0.png",
      when: (X) => !X.c.sponsor && (X.title === "GM" || X.c.followers >= 15000 || X.fide >= 2550),
      title: T("Sponsorship Offer", "Oferta de patrocinio", "Proposta de patrocínio"),
      lead: T("A brand wants to sponsor you and put their logo on your stream and your tournament jacket.", "Una marca quiere patrocinarte y poner su logo en tu stream y en tu chaqueta de torneo.", "Uma marca quer te patrocinar e colocar o logo dela na sua live e na sua jaqueta de torneio."),
      choices: [
        [T("Sign the deal", "Firmar el contrato", "Assinar o contrato"), (X) => X.out(T("You're officially a sponsored player. Money every year!", "Ya eres oficialmente un jugador patrocinado. ¡Plata todos los años!", "Agora você é oficialmente um jogador patrocinado. Dinheiro todo ano!"), { sponsor: X.title === "GM" ? 30000 : 15000, H: 10 }, T("I signed a sponsorship deal for my chess career.", "Firmé un contrato de patrocinio para mi carrera de ajedrez.", "Assinei um contrato de patrocínio para minha carreira no xadrez."))],
        [T("Decline", "Rechazar", "Recusar"), (X) => X.out(T("You didn't like the brand. You'd rather stay independent.", "No te gustó la marca. Prefieres seguir independiente.", "Você não gostou da marca. Prefere continuar independente."), {}, T("I turned down a chess sponsorship.", "Rechacé un patrocinio de ajedrez.", "Recusei um patrocínio de xadrez."))],
      ],
    },
    // 8
    {
      id: "sponsor_drop", icon: "emoji/1f4c9.png",
      when: (X) => X.c.sponsor > 0,
      title: T("Sponsor Pulled Out", "El patrocinador se fue", "O patrocinador saiu"),
      lead: T("Your sponsor pulled out after a scandal at their own company.", "Tu patrocinador se retiró después de un escándalo en su propia empresa.", "Seu patrocinador saiu depois de um escândalo na própria empresa."),
      choices: [
        [T("Look for a new sponsor", "Buscar otro patrocinador", "Procurar outro patrocinador"), (X) => X.chance(0.5)
          ? X.out(T("You found a smaller sponsor. It's something.", "Conseguiste un patrocinador más chico. Algo es algo.", "Você conseguiu um patrocinador menor. Já é alguma coisa."), { sponsor: Math.round(X.c.sponsor * 0.5) }, T("I found a new chess sponsor.", "Conseguí un nuevo patrocinador de ajedrez.", "Consegui um novo patrocinador de xadrez."))
          : X.out(T("Nobody bit. You're on your own for now.", "Nadie mordió el anzuelo. Por ahora estás solo.", "Ninguém topou. Por enquanto você está sozinho."), { sponsor: 0, H: -10 }, T("I lost my chess sponsor.", "Perdí a mi patrocinador de ajedrez.", "Perdi meu patrocinador de xadrez."))],
        [T("Cut your expenses", "Recortar gastos", "Cortar gastos"), (X) => X.out(T("No more business class flights. You'll survive.", "Se acabaron los vuelos en primera clase. Vas a sobrevivir.", "Chega de voos de classe executiva. Você vai sobreviver."), { sponsor: 0, H: -5 }, T("I lost my chess sponsor and cut my expenses.", "Perdí a mi patrocinador de ajedrez y recorté gastos.", "Perdi meu patrocinador de xadrez e cortei gastos."))],
      ],
    },
    // 9
    {
      id: "student_better", icon: "emoji/1f9d1-200d-1f3eb.png",
      when: (X) => X.yr.lessons > 0 && X.age >= 22,
      title: T("The Student Wins", "El alumno gana", "O aluno vence"),
      lead: T("One of your teenage students just beat you in a blitz game, and he's grinning.", "Uno de tus alumnos adolescentes te acaba de ganar una partida de blitz, y está sonriendo.", "Um dos seus alunos adolescentes acabou de te vencer numa partida de blitz, e está sorrindo."),
      choices: [
        [T("Congratulate him", "Felicitarlo", "Parabenizar"), (X) => X.out(T("Nothing makes a coach prouder. His parents doubled your fee.", "No hay nada que enorgullezca más a un entrenador. Sus papás te doblaron la tarifa.", "Nada deixa um treinador mais orgulhoso. Os pais dele dobraram seu pagamento."), { money: 2000, H: 10 }, T("One of my chess students beat me and I was proud.", "Uno de mis alumnos de ajedrez me ganó y me sentí orgulloso.", "Um dos meus alunos de xadrez me venceu e fiquei orgulhoso."))],
        [T("Challenge him to a rematch", "Retarlo a la revancha", "Desafiar para uma revanche"), (X) => X.beats(Math.max(1200, X.fide - 150))
          ? X.out(T("You won the rematch 5-0. Lesson learned, kid.", "Ganaste la revancha 5-0. Lección aprendida, chamaco.", "Você venceu a revanche por 5 a 0. Lição aprendida, garoto."), { H: 6 }, T("I beat my chess student in a rematch.", "Le gané la revancha a mi alumno de ajedrez.", "Venci meu aluno de xadrez na revanche."))
          : X.out(T("He won again. Maybe he should be teaching you.", "Volvió a ganar. Tal vez él debería darte clases a ti.", "Ele venceu de novo. Talvez ele devesse te dar aula."), { H: -10 }, T("My chess student beat me twice.", "Mi alumno de ajedrez me ganó dos veces.", "Meu aluno de xadrez me venceu duas vezes."))],
        [T("Send him to a stronger coach", "Mandarlo con un entrenador más fuerte", "Mandar para um treinador mais forte"), (X) => X.out(T("You lost a student, but gained a lot of respect.", "Perdiste un alumno, pero ganaste mucho respeto.", "Você perdeu um aluno, mas ganhou muito respeito."), { money: -500, H: 5 }, T("I sent my best student to a stronger coach.", "Mandé a mi mejor alumno con un entrenador más fuerte.", "Mandei meu melhor aluno para um treinador mais forte."))],
      ],
    },
    // 10
    {
      id: "chess_parent", icon: "emoji/1f468.png", once: true,
      when: (X) => X.age >= 10 && X.age <= 16 && X.fide >= 1500,
      title: T("Chess Dad", "Papá ajedrecista", "Pai do xadrez"),
      lead: T("Your dad wants to quit his job to become your full-time chess manager.", "Tu papá quiere dejar su trabajo para ser tu mánager de ajedrez a tiempo completo.", "Seu pai quer largar o emprego para ser seu empresário de xadrez em tempo integral."),
      choices: [
        [T("Let him", "Dejarlo", "Deixar"), (X) => X.out(T("He drives you everywhere and books every tournament. You're improving fast, but it's a lot of pressure.", "Te lleva a todos lados y te inscribe en todos los torneos. Mejoras rápido, pero es mucha presión.", "Ele te leva para todo lado e te inscreve em todos os torneios. Você melhora rápido, mas é muita pressão."), { str: 40, H: -12 }, T("My dad quit his job to manage my chess career.", "Mi papá dejó su trabajo para manejar mi carrera de ajedrez.", "Meu pai largou o emprego para cuidar da minha carreira no xadrez."))],
        [T("Tell him no", "Decirle que no", "Dizer não"), (X) => X.out(T("You want chess to stay fun. He was a little hurt, but he understood.", "Quieres que el ajedrez siga siendo divertido. Le dolió un poco, pero lo entendió.", "Você quer que o xadrez continue divertido. Ele ficou um pouco chateado, mas entendeu."), { H: 8 }, T("I told my dad I didn't want him managing my chess.", "Le dije a mi papá que no quería que manejara mi ajedrez.", "Disse ao meu pai que não queria que ele cuidasse do meu xadrez."))],
      ],
    },
    // 11
    {
      id: "burnout", icon: "emoji/1f634.png",
      when: (X) => X.age >= 14 && (X.yr.tourneys >= 3 || X.yr.train >= 3),
      title: T("Burnout", "Agotamiento", "Esgotamento"),
      lead: T("You're exhausted. You see chess positions when you close your eyes.", "Estás agotado. Ves posiciones de ajedrez cuando cierras los ojos.", "Você está exausto. Vê posições de xadrez quando fecha os olhos."),
      choices: [
        [T("Take a break", "Tomarte un descanso", "Fazer uma pausa"), (X) => X.out(T("A few months away from the board did wonders for your mind.", "Unos meses lejos del tablero te hicieron mucho bien.", "Alguns meses longe do tabuleiro fizeram muito bem para você."), { H: 15, He: 5, str: -15 }, T("I took a break from chess to recover from burnout.", "Me tomé un descanso del ajedrez para recuperarme del agotamiento.", "Dei uma pausa no xadrez para me recuperar do esgotamento."))],
        [T("Push through", "Seguir de largo", "Seguir em frente"), (X) => X.chance(0.5)
          ? X.out(T("You found a second wind. Champions are made like this.", "Te llegó un segundo aire. Así se hacen los campeones.", "Você ganhou um novo fôlego. É assim que se fazem campeões."), { str: 20, He: -5 }, T("I pushed through chess burnout and got stronger.", "Seguí a pesar del agotamiento y me hice más fuerte.", "Segui apesar do esgotamento e fiquei mais forte."))
          : X.out(T("You crashed hard. Your health and your chess both suffered.", "Te estrellaste feo. Tu salud y tu ajedrez lo pagaron.", "Você desabou feio. Sua saúde e seu xadrez pagaram o preço."), { He: -12, H: -12, str: -10 }, T("I ignored my chess burnout and crashed.", "Ignoré el agotamiento y me derrumbé.", "Ignorei o esgotamento e desabei."))],
        [T("Just play casually online", "Jugar tranquilo en línea", "Jogar só por diversão online"), (X) => X.out(T("Silly bullet games with friends reminded you why you love chess.", "Partidas de bullet con amigos te recordaron por qué amas el ajedrez.", "Partidas de bullet com amigos te lembraram por que você ama xadrez."), { H: 10, online: 30 }, T("I played casual online chess to beat burnout.", "Jugué ajedrez en línea por diversión para salir del agotamiento.", "Joguei xadrez online por diversão para sair do esgotamento."))],
      ],
    },
    // 12
    {
      id: "league_offer", icon: "emoji/1f3c6.png",
      when: (X) => X.fide >= 2350 && !X.c.league,
      title: T("League Contract", "Contrato de liga", "Contrato de liga"),
      lead: T("A team in a European chess league offers you a contract to play a few weekends a year.", "Un equipo de una liga europea de ajedrez te ofrece un contrato para jugar unos fines de semana al año.", "Um time de uma liga europeia de xadrez te oferece um contrato para jogar alguns fins de semana por ano."),
      choices: [
        [T("Sign", "Firmar", "Assinar"), (X) => X.out(T("Free hotels, a salary and good teammates. Not bad at all.", "Hotel gratis, sueldo y buenos compañeros. Nada mal.", "Hotel de graça, salário e bons colegas de time. Nada mal."), { league: X.fide >= 2550 ? 25000 : 12000, H: 6 }, T("I signed with a team in a European chess league.", "Firmé con un equipo de una liga europea de ajedrez.", "Assinei com um time de uma liga europeia de xadrez."))],
        [T("Negotiate", "Negociar", "Negociar"), (X) => X.chance(0.6)
          ? X.out(T("They raised the offer. You're worth it.", "Subieron la oferta. Lo vales.", "Eles aumentaram a proposta. Você vale isso."), { league: X.fide >= 2550 ? 35000 : 18000, H: 8 }, T("I negotiated a better chess league contract.", "Negocié un mejor contrato de liga.", "Negociei um contrato de liga melhor."))
          : X.out(T("They signed someone else instead.", "Firmaron a otro en tu lugar.", "Eles contrataram outra pessoa."), { H: -6 }, T("I lost a chess league contract by negotiating too hard.", "Perdí un contrato de liga por negociar demasiado.", "Perdi um contrato de liga por negociar demais."))],
        [T("Decline", "Rechazar", "Recusar"), (X) => X.out(T("You'd rather focus on individual events.", "Prefieres enfocarte en los torneos individuales.", "Você prefere focar nos torneios individuais."), {}, T("I turned down a chess league contract.", "Rechacé un contrato de liga de ajedrez.", "Recusei um contrato de liga de xadrez."))],
      ],
    },
    // 13
    {
      id: "viral_game", icon: "emoji/1f4fa.png",
      when: (X) => (X.fide >= 1400 || X.online >= 1200) && (X.yr.tourneys > 0 || X.yr.online > 0 || X.yr.live > 0),
      title: T("Viral Game", "Partida viral", "Partida viral"),
      lead: T("One of your games went viral because of a crazy queen sacrifice.", "Una de tus partidas se hizo viral por un sacrificio de dama loquísimo.", "Uma das suas partidas viralizou por causa de um sacrifício de dama maluco."),
      choices: [
        [T("Stream about it", "Hacer stream sobre eso", "Fazer live sobre isso"), (X) => X.out(T("Thousands of people watched you explain the game. New fans everywhere.", "Miles de personas te vieron explicar la partida. Fans nuevos por todos lados.", "Milhares de pessoas te viram explicar a partida. Fãs novos por todo lado."), { followers: 8000, H: 8 }, T("One of my chess games went viral and I streamed about it.", "Una de mis partidas se hizo viral e hice stream sobre eso.", "Uma das minhas partidas viralizou e eu fiz live sobre isso."))],
        [T("Stay humble", "Mantener la humildad", "Manter a humildade"), (X) => X.out(T("You let the game speak for itself.", "Dejaste que la partida hablara por sí sola.", "Você deixou a partida falar por si."), { followers: 2000, H: 5 }, T("One of my chess games went viral.", "Una de mis partidas de ajedrez se hizo viral.", "Uma das minhas partidas de xadrez viralizou."))],
      ],
    },
    // 14
    {
      id: "bathroom", icon: "emoji/1f6bd.png",
      when: (X) => X.yr.tourneys > 0 && X.age >= 13,
      title: T("Suspicious Trips", "Viajes sospechosos", "Idas suspeitas"),
      lead: T("Your opponent goes to the bathroom after every single move.", "Tu rival va al baño después de cada jugada.", "Seu adversário vai ao banheiro depois de cada lance."),
      choices: [
        [T("Ignore it", "Ignorarlo", "Ignorar"), (X) => X.beats(X.fide + 150)
          ? X.out(T("You beat him anyway. Maybe he just drinks a lot of water.", "Le ganaste igual. Tal vez solo toma mucha agua.", "Você venceu mesmo assim. Talvez ele só beba muita água."), { fide: 8 }, T("I beat a suspicious opponent anyway.", "Le gané igual a un rival sospechoso.", "Venci um adversário suspeito mesmo assim."))
          : X.out(T("He played like a computer and beat you.", "Jugó como una computadora y te ganó.", "Ele jogou como um computador e te venceu."), { fide: -10, H: -8 }, T("I lost to an opponent who was probably cheating.", "Perdí contra un rival que probablemente hacía trampa.", "Perdi para um adversário que provavelmente trapaceava."))],
        [T("Tell the arbiter", "Decírselo al árbitro", "Contar ao árbitro"), (X) => X.chance(0.5)
          ? X.out(T("They found a phone hidden in the bathroom. He was expelled.", "Encontraron un teléfono escondido en el baño. Lo expulsaron.", "Acharam um celular escondido no banheiro. Ele foi expulso."), { fide: 10, H: 10, followers: 1500 }, T("I caught an opponent cheating with a phone in the bathroom.", "Atrapé a un rival haciendo trampa con un teléfono en el baño.", "Peguei um adversário trapaceando com um celular no banheiro."))
          : X.out(T("They found nothing. He just has a small bladder. Awkward.", "No encontraron nada. Solo tiene la vejiga chiquita. Qué incómodo.", "Não acharam nada. Ele só tem a bexiga pequena. Que constrangedor."), { H: -8 }, T("I wrongly accused an opponent of cheating.", "Acusé injustamente a un rival de hacer trampa.", "Acusei injustamente um adversário de trapaça."))],
      ],
    },
    // 15
    {
      id: "pills", icon: "emoji/1f48a.png",
      when: (X) => X.age >= 17 && X.yr.tourneys >= 2,
      title: T("Focus Pills", "Pastillas para concentrarse", "Remédio para foco"),
      lead: T("A teammate offers you pills that supposedly help you focus during long tournaments.", "Un compañero te ofrece unas pastillas que supuestamente ayudan a concentrarse en torneos largos.", "Um colega te oferece uns comprimidos que supostamente ajudam a focar em torneios longos."),
      choices: [
        [T("Take them", "Tomarlas", "Tomar"), (X) => X.chance(0.75)
          ? X.out(T("You played the best chess of your life. Your heart was racing for days.", "Jugaste el mejor ajedrez de tu vida. Tu corazón estuvo acelerado por días.", "Você jogou o melhor xadrez da sua vida. Seu coração ficou acelerado por dias."), { fide: 15, He: -10 }, T("I took focus pills during a chess tournament.", "Tomé pastillas para concentrarme en un torneo de ajedrez.", "Tomei remédio para foco durante um torneio de xadrez."))
          : X.out(T("You failed a random drug test and got suspended.", "Saliste positivo en un control antidopaje y te suspendieron.", "Você foi pego num antidoping e foi suspenso."), { He: -10, H: -15, ban: 1 }, T("I got suspended from chess for failing a drug test.", "Me suspendieron del ajedrez por dar positivo en un control antidopaje.", "Fui suspenso do xadrez por falhar num antidoping."))],
        [T("Stick to coffee", "Quedarte con el café", "Ficar no café"), (X) => X.out(T("Lots of coffee. Your hands were shaking, but you held on.", "Mucho café. Te temblaban las manos, pero aguantaste.", "Muito café. Suas mãos tremiam, mas você aguentou."), { He: -2 }, T("I survived a long chess tournament on coffee.", "Sobreviví a un torneo largo a punta de café.", "Sobrevivi a um torneio longo na base do café."))],
        [T("Sleep well instead", "Mejor dormir bien", "Dormir bem"), (X) => X.out(T("Eight hours of sleep every night. Old school, but it works.", "Ocho horas de sueño cada noche. A la antigua, pero funciona.", "Oito horas de sono toda noite. Das antigas, mas funciona."), { He: 5, H: 3 }, T("I turned down focus pills and slept well instead.", "Rechacé las pastillas y mejor dormí bien.", "Recusei os comprimidos e dormi bem."))],
      ],
    },
    // 16
    {
      id: "retire", icon: "emoji/1f474.png",
      when: (X) => X.age >= 45 && X.c.peak - (X.c.fide || 0) >= 120,
      title: T("Time to Retire?", "¿Hora de retirarse?", "Hora de se aposentar?"),
      lead: T("You've been playing worse every year. Maybe it's time to retire from competitive chess.", "Cada año juegas peor. Tal vez es hora de retirarte del ajedrez competitivo.", "Você joga pior a cada ano. Talvez seja hora de se aposentar do xadrez competitivo."),
      choices: [
        [T("Retire with dignity", "Retirarte con dignidad", "Se aposentar com dignidade"), (X) => X.out(T("You played your farewell game in front of your family. Everyone stood up and clapped.", "Jugaste tu partida de despedida frente a tu familia. Todos se pararon a aplaudir.", "Você jogou sua partida de despedida na frente da família. Todos se levantaram para aplaudir."), { H: 15 }, T("I retired from competitive chess.", "Me retiré del ajedrez competitivo.", "Me aposentei do xadrez competitivo."))],
        [T("Keep fighting", "Seguir peleando", "Continuar lutando"), (X) => X.out(T("Age is just a number. You booked three more tournaments.", "La edad es solo un número. Te inscribiste en tres torneos más.", "Idade é só um número. Você se inscreveu em mais três torneios."), { str: 15, H: 5 }, T("I refused to retire from chess.", "Me negué a retirarme del ajedrez.", "Me recusei a me aposentar do xadrez."))],
      ],
    },
    // 17
    {
      id: "prodigy_simul", icon: "emoji/1f467.png",
      when: (X) => X.age >= 25 && X.title,
      title: T("Little Prodigy", "Pequeño prodigio", "Pequeno prodígio"),
      lead: T("A 9-year-old prodigy beat you during a simultaneous exhibition. The video is everywhere.", "Un prodigio de 9 años te ganó en una simultánea. El video está en todas partes.", "Um prodígio de 9 anos te venceu numa simultânea. O vídeo está em todo lugar."),
      choices: [
        [T("Laugh it off", "Tomarlo con humor", "Levar na esportiva"), (X) => X.out(T("You posted the clip yourself with a crying emoji. People loved it.", "Tú mismo subiste el clip con un emoji llorando. A la gente le encantó.", "Você mesmo postou o vídeo com um emoji chorando. O pessoal adorou."), { followers: 5000, H: 6 }, T("A 9-year-old beat me at chess and I laughed about it online.", "Un niño de 9 años me ganó al ajedrez y me reí de eso en redes.", "Uma criança de 9 anos me venceu no xadrez e eu ri disso nas redes."))],
        [T("Offer to coach the kid", "Ofrecerte a entrenarlo", "Se oferecer para treinar a criança"), (X) => X.out(T("The parents said yes. You might be coaching a future champion.", "Los papás dijeron que sí. Puede que estés entrenando a un futuro campeón.", "Os pais aceitaram. Talvez você esteja treinando um futuro campeão."), { money: 4000, H: 8 }, T("I started coaching a 9-year-old chess prodigy.", "Empecé a entrenar a un prodigio de ajedrez de 9 años.", "Comecei a treinar um prodígio de xadrez de 9 anos."))],
        [T("Demand a rematch", "Exigir la revancha", "Exigir revanche"), (X) => X.out(T("You won the rematch, but beating a child didn't look great.", "Ganaste la revancha, pero ganarle a un niño no se vio muy bien.", "Você venceu a revanche, mas vencer uma criança não pegou bem."), { H: -6, followers: -500 }, T("I demanded a rematch against a 9-year-old.", "Le exigí la revancha a un niño de 9 años.", "Exigi revanche contra uma criança de 9 anos."))],
      ],
    },
    // 18
    {
      id: "book_deal", icon: "emoji/1f4d6.png", once: true,
      when: (X) => X.age >= 22 && (X.title === "IM" || X.title === "GM" || X.c.followers >= 30000),
      title: T("Book Deal", "Contrato de libro", "Contrato de livro"),
      lead: T("A publisher wants you to write a chess book.", "Una editorial quiere que escribas un libro de ajedrez.", "Uma editora quer que você escreva um livro de xadrez."),
      choices: [
        [T("Write it", "Escribirlo", "Escrever"), (X) => X.out(T("It took a year, but your book is out. Chess players love it.", "Te tomó un año, pero tu libro ya salió. A los ajedrecistas les encanta.", "Levou um ano, mas seu livro saiu. Os enxadristas adoraram."), { money: 18000, S: 4, H: 8 }, T("I wrote a chess book.", "Escribí un libro de ajedrez.", "Escrevi um livro de xadrez."))],
        [T("Decline", "Rechazar", "Recusar"), (X) => X.out(T("You'd rather play than write about playing.", "Prefieres jugar que escribir sobre jugar.", "Você prefere jogar a escrever sobre jogar."), {}, T("I turned down a chess book deal.", "Rechacé un contrato para escribir un libro de ajedrez.", "Recusei um contrato de livro de xadrez."))],
      ],
    },
    // 19
    {
      id: "simul_school", icon: "emoji/1f3eb.png",
      when: (X) => X.title && X.age >= 18,
      title: T("School Exhibition", "Exhibición en una escuela", "Exibição numa escola"),
      lead: T("A school invites you to play a simultaneous exhibition against 20 kids at once.", "Una escuela te invita a jugar una simultánea contra 20 niños a la vez.", "Uma escola te convida para jogar uma simultânea contra 20 crianças ao mesmo tempo."),
      choices: [
        [T("Accept", "Aceptar", "Aceitar"), (X) => X.out(T("You won 19 games and let the shyest kid get a draw. Best day ever.", "Ganaste 19 partidas y dejaste que el niño más tímido sacara tablas. El mejor día.", "Você venceu 19 partidas e deixou a criança mais tímida empatar. Melhor dia."), { money: 600, H: 12, followers: 600 }, T("I played a chess exhibition against 20 kids at a school.", "Jugué una simultánea contra 20 niños en una escuela.", "Joguei uma simultânea contra 20 crianças numa escola."))],
        [T("Decline", "Rechazar", "Recusar"), (X) => X.out(T("You were too busy this week.", "Estabas muy ocupado esa semana.", "Você estava muito ocupado nessa semana."), {}, T("I turned down a school chess exhibition.", "Rechacé una exhibición de ajedrez en una escuela.", "Recusei uma exibição de xadrez numa escola."))],
      ],
    },
    // 20
    {
      id: "park_hustler", icon: "emoji/1f333.png",
      when: (X) => X.age >= 12,
      title: T("Park Hustler", "El estafador del parque", "O malandro da praça"),
      lead: T("A chess hustler in the park challenges you to a blitz game for $20.", "Un tahúr del ajedrez en el parque te reta a una partida de blitz por $20.", "Um malandro do xadrez na praça te desafia para um blitz valendo $20."),
      choices: [
        [T("Play him", "Jugarle", "Jogar"), (X) => X.beats(1850)
          ? X.out(T("You took his money and his pride. He wants a rematch tomorrow.", "Le quitaste la plata y el orgullo. Quiere la revancha mañana.", "Você levou o dinheiro e o orgulho dele. Ele quer revanche amanhã."), { money: 20, H: 6 }, T("I beat a chess hustler in the park.", "Le gané a un tahúr del ajedrez en el parque.", "Venci um malandro do xadrez na praça."))
          : X.out(T("He talked trash the whole game and beat you. Classic hustler.", "Te habló basura toda la partida y te ganó. Típico tahúr.", "Ele provocou a partida inteira e te venceu. Malandro clássico."), { money: -20, H: -4 }, T("A chess hustler in the park took my money.", "Un tahúr del ajedrez en el parque me sacó la plata.", "Um malandro do xadrez na praça levou meu dinheiro."))],
        [T("Walk away", "Seguir caminando", "Ir embora"), (X) => X.out(T("You kept walking. He called you chicken.", "Seguiste caminando. Te gritó gallina.", "Você seguiu andando. Ele te chamou de frouxo."), {}, T("I ignored a chess hustler in the park.", "Ignoré a un tahúr del ajedrez en el parque.", "Ignorei um malandro do xadrez na praça."))],
      ],
    },
    // 21
    {
      id: "rich_bet", icon: "emoji/1f3b2.png",
      when: (X) => X.age >= 18 && X.fide >= 1500,
      title: T("Big Bet", "Apuesta grande", "Aposta alta"),
      lead: T("A rich guy at your chess club bets $1,000 that he can beat you.", "Un tipo con plata de tu club apuesta $1,000 a que te gana.", "Um ricaço do seu clube aposta $1.000 que consegue te vencer."),
      choices: [
        [T("Take the bet", "Aceptar la apuesta", "Aceitar a aposta"), (X) => X.beats(1650)
          ? X.out(T("Easy money. He paid up with a smile.", "Plata fácil. Te pagó sonriendo.", "Dinheiro fácil. Ele pagou sorrindo."), { money: 1000, H: 6 }, T("I won a $1,000 chess bet.", "Gané una apuesta de ajedrez de $1,000.", "Ganhei uma aposta de xadrez de $1.000."))
          : X.out(T("He was way better than he looked. Ouch.", "Era mucho mejor de lo que parecía. Auch.", "Ele era bem melhor do que parecia. Ai."), { money: -1000, H: -8 }, T("I lost a $1,000 chess bet.", "Perdí una apuesta de ajedrez de $1,000.", "Perdi uma aposta de xadrez de $1.000."))],
        [T("Decline", "Rechazar", "Recusar"), (X) => X.out(T("You don't gamble on chess.", "Tú no apuestas en el ajedrez.", "Você não aposta no xadrez."), {}, T("I turned down a chess bet.", "Rechacé una apuesta de ajedrez.", "Recusei uma aposta de xadrez."))],
      ],
    },
    // 22
    {
      id: "opening_named", icon: "emoji/2b50.png", once: true,
      when: (X) => X.title === "GM" && X.age >= 24,
      title: T("Your Own Opening", "Tu propia apertura", "Sua própria abertura"),
      lead: T("A new opening line you played so often is now officially named after you.", "Una línea de apertura que jugaste tantas veces ahora lleva oficialmente tu nombre.", "Uma linha de abertura que você jogou tantas vezes agora leva oficialmente o seu nome."),
      choices: [
        [T("Thank the chess world", "Agradecerle al mundo del ajedrez", "Agradecer ao mundo do xadrez"), (X) => X.out(T("Your name will live forever in opening books.", "Tu nombre va a vivir para siempre en los libros de aperturas.", "Seu nome vai viver para sempre nos livros de aberturas."), { H: 20, followers: 4000 }, T("A chess opening was named after me.", "Le pusieron mi nombre a una apertura de ajedrez.", "Uma abertura de xadrez ganhou o meu nome."))],
        [T("Brag about it", "Presumirlo", "Se gabar"), (X) => X.out(T("You made it your whole personality. Your friends are tired of hearing it.", "Lo convertiste en toda tu personalidad. Tus amigos ya están cansados de oírlo.", "Isso virou toda a sua personalidade. Seus amigos já cansaram de ouvir."), { H: 15, followers: 6000 }, T("A chess opening was named after me and I won't stop talking about it.", "Le pusieron mi nombre a una apertura y no dejo de hablar de eso.", "Uma abertura ganhou o meu nome e eu não paro de falar disso."))],
      ],
    },
    // 23
    {
      id: "trolls", icon: "emoji/1f47a.png",
      // es sobre el chat de tu stream: hace falta haber streameado este año
      when: (X) => X.c.followers >= 1500 && X.yr.stream > 0,
      title: T("Stream Trolls", "Trolls en el stream", "Trolls na live"),
      lead: T("Trolls are spamming your stream chat and calling you a fraud.", "Unos trolls están llenando el chat de tu stream y diciendo que eres un fraude.", "Uns trolls estão lotando o chat da sua live e te chamando de fraude."),
      choices: [
        [T("Ban them all", "Banearlos a todos", "Banir todos"), (X) => X.out(T("Clean chat, happy viewers.", "Chat limpio, espectadores contentos.", "Chat limpo, espectadores felizes."), { H: 3 }, T("I banned trolls from my chess stream.", "Baneé a los trolls de mi stream de ajedrez.", "Bani os trolls da minha live de xadrez."))],
        [T("Roast them back", "Devolverles la burla", "Zoar de volta"), (X) => X.out(T("You roasted them so hard the clip went viral.", "Te burlaste tan fuerte de ellos que el clip se hizo viral.", "Você zoou tanto que o clipe viralizou."), { followers: 4000, H: 6 }, T("I roasted trolls on my chess stream and it went viral.", "Me burlé de los trolls en mi stream y se hizo viral.", "Zoei os trolls na minha live e viralizou."))],
        [T("Ignore them", "Ignorarlos", "Ignorar"), (X) => X.out(T("You ignored them, but it still got under your skin.", "Los ignoraste, pero igual te afectó.", "Você ignorou, mas mesmo assim te afetou."), { H: -6 }, T("Trolls ruined my chess stream.", "Los trolls me arruinaron el stream de ajedrez.", "Os trolls estragaram minha live de xadrez."))],
      ],
    },
    // 24
    {
      id: "commentator", icon: "emoji/1f3a4.png",
      when: (X) => X.age >= 20 && (X.title === "IM" || X.title === "GM" || X.c.followers >= 20000),
      title: T("Commentator Gig", "Trabajo de comentarista", "Trabalho de comentarista"),
      lead: T("A big tournament wants you as a live commentator.", "Un torneo importante te quiere como comentarista en vivo.", "Um grande torneio quer você como comentarista ao vivo."),
      choices: [
        [T("Accept", "Aceptar", "Aceitar"), (X) => X.out(T("You were funny and sharp on air. They already want you back next year.", "Estuviste chistoso y certero en vivo. Ya te quieren de vuelta el año que viene.", "Você foi engraçado e afiado ao vivo. Já querem você de volta no ano que vem."), { money: 6000, followers: 5000, H: 8 }, T("I worked as a live chess commentator.", "Trabajé como comentarista de ajedrez en vivo.", "Trabalhei como comentarista de xadrez ao vivo."))],
        [T("Decline", "Rechazar", "Recusar"), (X) => X.out(T("You'd rather be the one playing.", "Prefieres ser tú el que juega.", "Você prefere ser quem joga."), {}, T("I turned down a chess commentator job.", "Rechacé un trabajo de comentarista de ajedrez.", "Recusei um trabalho de comentarista de xadrez."))],
      ],
    },
    // 25
    {
      id: "olympiad", icon: "emoji/1f3c5.png",
      when: (X) => X.fide >= 2350 && X.age >= 15,
      title: T("Chess Olympiad", "Olimpiada de Ajedrez", "Olimpíada de Xadrez"),
      lead: T("Your national federation selected you for the Chess Olympiad team.", "Tu federación nacional te seleccionó para el equipo de la Olimpiada de Ajedrez.", "Sua federação nacional te convocou para o time da Olimpíada de Xadrez."),
      choices: [
        [T("Represent your country", "Representar a tu país", "Representar o seu país"), (X) => X.beats(X.fide)
          ? X.out(T("You scored great on your board and your country celebrated.", "Hiciste un gran resultado en tu tablero y tu país lo celebró.", "Você fez um ótimo resultado no seu tabuleiro e o país comemorou."), { fide: 15, H: 15, followers: 3000 }, T("I represented my country at the Chess Olympiad.", "Representé a mi país en la Olimpiada de Ajedrez.", "Representei meu país na Olimpíada de Xadrez."))
          : X.out(T("A tough event, but wearing your country's colors was special.", "Fue un torneo difícil, pero llevar los colores de tu país fue especial.", "Foi um torneio difícil, mas vestir as cores do seu país foi especial."), { fide: -8, H: 8 }, T("I represented my country at the Chess Olympiad.", "Representé a mi país en la Olimpiada de Ajedrez.", "Representei meu país na Olimpíada de Xadrez."))],
        [T("Decline", "Rechazar", "Recusar"), (X) => X.out(T("The federation was not happy with you.", "La federación no quedó nada contenta contigo.", "A federação não ficou nada feliz com você."), { H: -5 }, T("I turned down a spot on my country's Olympiad team.", "Rechacé un lugar en el equipo olímpico de mi país.", "Recusei uma vaga no time olímpico do meu país."))],
      ],
    },
    // 26
    {
      id: "club_closing", icon: "emoji/1f3e0.png",
      when: (X) => X.age >= 10 && X.age <= 30 && (X.yr.tourneys > 0 || X.yr.train > 0),
      title: T("Club in Trouble", "El club en problemas", "Clube em apuros"),
      lead: T("Your local chess club is about to close because it can't pay the rent.", "Tu club de ajedrez local está por cerrar porque no puede pagar el alquiler.", "Seu clube de xadrez local está para fechar porque não consegue pagar o aluguel."),
      choices: [
        [T("Donate money", "Donar dinero", "Doar dinheiro"), (X) => X.out(T("You saved the club. They hung your photo on the wall.", "Salvaste el club. Colgaron tu foto en la pared.", "Você salvou o clube. Penduraram sua foto na parede."), { money: -1500, H: 12 }, T("I donated money to save my chess club.", "Doné dinero para salvar mi club de ajedrez.", "Doei dinheiro para salvar meu clube de xadrez."))],
        [T("Organize a fundraiser tournament", "Organizar un torneo benéfico", "Organizar um torneio beneficente"), (X) => X.out(T("Half the city showed up. The club is saved.", "Llegó media ciudad. El club se salvó.", "Meia cidade apareceu. O clube está salvo."), { H: 10, followers: 1200 }, T("I organized a tournament to save my chess club.", "Organicé un torneo para salvar mi club de ajedrez.", "Organizei um torneio para salvar meu clube de xadrez."))],
        [T("Let it go", "Dejarlo ir", "Deixar para lá"), (X) => X.out(T("The club closed. It's not the same playing at home.", "El club cerró. No es lo mismo jugar en casa.", "O clube fechou. Não é a mesma coisa jogar em casa."), { H: -8 }, T("My chess club closed down.", "Mi club de ajedrez cerró.", "Meu clube de xadrez fechou."))],
      ],
    },
    // 27
    {
      id: "romance", icon: "emoji/1f498.png",
      when: (X) => X.age >= 18 && X.age <= 45 && X.yr.tourneys > 0,
      title: T("Tournament Romance", "Romance de torneo", "Romance de torneio"),
      lead: T("You hit it off with another player during the tournament's free day.", "Hiciste clic con otro jugador durante el día libre del torneo.", "Você se deu bem com outro jogador no dia de folga do torneio."),
      choices: [
        [T("Ask them out", "Invitarlo a salir", "Chamar para sair"), (X) => X.chance(0.6)
          ? X.out(T("You spent the whole night talking about openings. A perfect date.", "Se pasaron la noche entera hablando de aperturas. Una cita perfecta.", "Vocês passaram a noite inteira falando de aberturas. Um encontro perfeito."), { H: 15 }, T("I went on a date with another chess player.", "Salí con otro ajedrecista.", "Saí com outro enxadrista."))
          : X.out(T("They said they only date grandmasters. Brutal.", "Te dijeron que solo salen con grandes maestros. Brutal.", "Disseram que só saem com grandes mestres. Brutal."), { H: -8 }, T("Another chess player turned me down.", "Otro ajedrecista me rechazó.", "Outro enxadrista me recusou."))],
        [T("Stay focused on chess", "Enfocarte en el ajedrez", "Focar no xadrez"), (X) => X.out(T("No distractions. You won your next game.", "Nada de distracciones. Ganaste la siguiente partida.", "Sem distrações. Você venceu a partida seguinte."), { fide: 5 }, T("I chose chess over romance.", "Elegí el ajedrez antes que el romance.", "Escolhi o xadrez em vez do romance."))],
      ],
    },
    // 28
    {
      id: "blunder_rage", icon: "emoji/1f621.png",
      when: (X) => X.yr.tourneys > 0 && X.age >= 8,
      title: T("Terrible Blunder", "Error garrafal", "Erro grotesco"),
      lead: T("You blundered your queen in a winning position and lost the game.", "Dejaste colgada la dama en una posición ganadora y perdiste la partida.", "Você entregou a dama numa posição ganha e perdeu a partida."),
      choices: [
        [T("Shake hands politely", "Dar la mano con educación", "Apertar a mão com educação"), (X) => X.out(T("It hurt, but you handled it like a pro.", "Dolió, pero lo manejaste como un profesional.", "Doeu, mas você lidou como um profissional."), { H: -5 }, T("I lost a chess game after a terrible blunder.", "Perdí una partida por un error garrafal.", "Perdi uma partida por um erro grotesco."))],
        [T("Throw a tantrum", "Hacer un berrinche", "Dar um chilique"), (X) => X.out(T("You knocked the pieces over. Someone filmed it, of course.", "Tiraste las piezas al piso. Alguien lo grabó, obviamente.", "Você derrubou as peças. Alguém filmou, claro."), { H: 4, followers: 3000, fide: -5 }, T("I threw a tantrum after losing a chess game and it got filmed.", "Hice un berrinche después de perder una partida y me grabaron.", "Dei um chilique depois de perder uma partida e me filmaram."))],
        [T("Analyze what went wrong", "Analizar qué salió mal", "Analisar o que deu errado"), (X) => X.out(T("You'll never make that mistake again.", "Nunca vas a volver a cometer ese error.", "Você nunca mais vai cometer esse erro."), { str: 10, S: 1 }, T("I learned from a painful chess blunder.", "Aprendí de un error doloroso en el ajedrez.", "Aprendi com um erro doloroso no xadrez."))],
      ],
    },
    // 29
    {
      id: "hacked", icon: "emoji/1f512.png",
      when: (X) => X.c.online && !X.c.onlineBan && X.age >= 12,
      title: T("Account Hacked", "Cuenta hackeada", "Conta hackeada"),
      lead: T("Someone hacked your Pawnder account and lost dozens of games on purpose.", "Alguien hackeó tu cuenta de Pawnder y perdió decenas de partidas a propósito.", "Alguém hackeou sua conta do Pawnder e perdeu dezenas de partidas de propósito."),
      choices: [
        [T("Contact support", "Contactar a soporte", "Falar com o suporte"), (X) => X.out(T("They restored your account, but not your ratings.", "Te devolvieron la cuenta, pero no los ratings.", "Devolveram sua conta, mas não os ratings."), { online: -120, H: -5 }, T("My Pawnder account got hacked.", "Me hackearon la cuenta de Pawnder.", "Hackearam minha conta do Pawnder."))],
        [T("Make a new account", "Hacer una cuenta nueva", "Criar uma conta nova"), (X) => X.out(T("Fresh start. Your new ratings climbed back fast.", "Borrón y cuenta nueva. Tus ratings nuevos subieron rápido.", "Começo do zero. Seus novos ratings subiram rápido."), { online: -60, H: 2 }, T("I made a new Pawnder account after getting hacked.", "Me hice una cuenta nueva de Pawnder después del hackeo.", "Criei uma conta nova no Pawnder depois do hack."))],
      ],
    },
    // 30
    {
      id: "training_camp", icon: "emoji/1f3d5-fe0f.png",
      when: (X) => X.age >= 10 && X.age <= 25 && X.fide >= 1900,
      title: T("Elite Training Camp", "Campamento de élite", "Campo de treinamento de elite"),
      lead: T("An elite chess training camp with grandmasters invites you. It costs $3,000.", "Un campamento de entrenamiento de élite con grandes maestros te invita. Cuesta $3,000.", "Um campo de treinamento de elite com grandes mestres te convida. Custa $3.000."),
      choices: [
        [T("Go", "Ir", "Ir"), (X) => X.out(T("Two weeks of intense training with the best. You came back a different player.", "Dos semanas de entrenamiento intenso con los mejores. Volviste siendo otro jugador.", "Duas semanas de treino intenso com os melhores. Você voltou outro jogador."), { money: X.age < 18 ? 0 : -3000, str: 40, S: 2 }, T("I went to an elite chess training camp.", "Fui a un campamento de entrenamiento de ajedrez de élite.", "Fui a um campo de treinamento de xadrez de elite."))],
        [T("Decline", "Rechazar", "Recusar"), (X) => X.out(T("Too expensive. You'll keep training on your own.", "Muy caro. Vas a seguir entrenando por tu cuenta.", "Caro demais. Você vai continuar treinando sozinho."), {}, T("I skipped an elite chess training camp.", "No fui a un campamento de ajedrez de élite.", "Não fui a um campo de xadrez de elite."))],
      ],
    },
  ];

  root.FL_CHESS_EVENTS = EVENTS;
  root.FL_CHESS_LABELS = LABELS;
})(typeof window !== "undefined" ? window : globalThis);
