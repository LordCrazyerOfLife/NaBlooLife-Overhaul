/* [mod] Football Career — event pack.
 *
 * Pure data for futbol.js: 40 off-pitch and dressing-room events, each with
 * three choices and stat-based consequences. No DOM access here, so the list
 * stays JSON-ish and easy to extend.
 *
 * Effect keys: skill, fit, fame, money, hap, coach, club, form, hype, injury
 * (weeks), ban (matches), wagePct. `run(f, api)` can override anything.
 */
(() => {
  "use strict";
  if (window.FL_FUTBOL_EVENTS) return;

  const EV = [
    {
      id: "injury",
      w: 9,
      min: 14,
      tier: "any",
      title: "The knee goes",
      text: (f) =>
        f.pro
          ? "A late tackle in training and your knee buckles. The physio's face says it before the scan does."
          : "You plant your foot wrong in a school match and hear something pop. The coach tells everyone to stand back.",
      choices: [
        {
          t: "Play through the pain",
          e: { fit: -14, coach: 8, club: 6, fame: 1 },
          msg: "You tape it up and finish the session. The coach calls you a warrior. The physio tells you to be careful next time.",
          risk: 0.35,
          riskE: { injury: 8, fit: -12, hap: -6 },
          riskMsg: "The knee gives way completely. You are out for two months and the club doctor is furious.",
        },
        {
          t: "Get the scan immediately",
          e: { fit: -6, money: -1800, coach: -2 },
          msg: "You miss two weeks but avoid the worst. The scan shows inflammation, not a tear.",
        },
        {
          t: "Hide it and keep training",
          e: { skill: 1, fit: -9, coach: -6, club: -5 },
          msg: "Nobody finds out. You keep training on a bad knee, because nobody ever got dropped for being honest.",
          risk: 0.5,
          riskE: { injury: 10, fit: -18, hap: -8, coach: -10 },
          riskMsg: "It tears in a match. The manager finds out you hid it and benches you for a month.",
        },
      ],
    },
    {
      id: "party",
      w: 8,
      min: 14,
      max: 22,
      tier: "any",
      title: "Secret party",
      text: () =>
        "The whole squad is going to a party the night before a match. Someone has already posted the address in the group chat.",
      choices: [
        {
          t: "Go and enjoy it",
          e: { fame: 2, hap: 8, fit: -10, coach: -8 },
          msg: "You get home at 4am. The photos are already circulating. Training is going to hurt.",
          risk: 0.3,
          riskE: { coach: -12, club: -8, fit: -6 },
          riskMsg: "The manager sees the photos and fines the entire squad. He remembers who was front and centre.",
        },
        {
          t: "Show up for an hour",
          e: { hap: 4, fame: 1, fit: -4, coach: -2 },
          msg: "You make an appearance, take one photo, and leave before it gets stupid.",
        },
        {
          t: "Stay home and sleep",
          e: { fit: 6, coach: 6, club: 2, hap: -3 },
          msg: "You sleep nine hours. The squad calls you boring. The manager calls you professional.",
        },
      ],
    },
    {
      id: "coach",
      w: 8,
      min: 17,
      tier: "pro",
      title: "Touchline argument",
      text: () =>
        "The manager hooks you at half-time and screams that you are playing like you have never seen a football. The dressing room goes silent.",
      choices: [
        {
          t: "Apologise and listen",
          e: { coach: 9, skill: 2, hap: -4 },
          msg: "You take it, nod, and ask what he wants differently. He calms down and actually explains it.",
        },
        {
          t: "Scream back",
          e: { coach: -16, club: -6, fame: 3, hap: 3 },
          msg: "You tell him the tactics are garbage. The room hears every word. So does the board.",
          risk: 0.45,
          riskE: { coach: -14, club: -12, ban: 2 },
          riskMsg: "He drops you from the squad for two matches. The press reports a 'dressing-room rift'.",
        },
        {
          t: "Say nothing and leave",
          e: { coach: -6, hap: -2, fame: 1 },
          msg: "You walk out without a word. Silence can be louder than shouting, and he hates it.",
        },
      ],
    },
    {
      id: "sponsor",
      w: 7,
      min: 18,
      tier: "pro",
      title: "Sponsor offer",
      text: () =>
        "A drinks company wants your face on a billboard. The money is real. The product tastes like battery acid.",
      choices: [
        {
          t: "Sign the deal",
          e: { money: 120000, fame: 5, hap: 4 },
          msg: "You sign. The billboard goes up outside the stadium and your teammates joke about it for a week.",
        },
        {
          t: "Negotiate for more",
          e: { money: 70000, fame: 3, hap: 3 },
          msg: "You push for a bigger fee and get a shorter deal. Not bad for a day's work.",
          risk: 0.3,
          riskE: { fame: -2, hap: -3 },
          riskMsg: "They get offended and walk away. The deal dies over a percentage point.",
        },
        {
          t: "Turn it down",
          e: { coach: 4, club: 4, hap: 2, fame: -1 },
          msg: "You pass. The club loves that you are focused, and your stomach loves you too.",
        },
      ],
    },
    {
      id: "fixing",
      w: 5,
      min: 19,
      tier: "pro",
      title: "A man with a briefcase",
      text: () =>
        "After training, a man in a cheap suit offers you a briefcase of cash to 'take it easy' on Sunday. He says everyone does it.",
      choices: [
        {
          t: "Take the money",
          e: { money: 250000, club: -14, coach: -8, hap: -6 },
          msg: "You take it. Every pass on Sunday feels heavier than the ball.",
          risk: 0.55,
          riskE: { ban: 18, fame: -25, club: -30, money: -200000 },
          riskMsg: "The federation opens an investigation. You are banned for a season and the money is seized.",
        },
        {
          t: "Report him",
          e: { club: 16, coach: 10, fame: 4, hap: 5 },
          msg: "You report him to the club and the federation. The story leaks, but you come out clean.",
        },
        {
          t: "Walk away quietly",
          e: { hap: -2, club: 3 },
          msg: "You say nothing and leave. He finds another player by Tuesday.",
        },
      ],
    },
    {
      id: "doping",
      w: 4,
      min: 19,
      tier: "pro",
      title: "The needle",
      text: () =>
        "A doctor connected to the club offers 'vitamins' that recover you twice as fast. He guarantees nobody tests for it.",
      choices: [
        {
          t: "Take it",
          e: { fit: 18, skill: 2, hap: -6, club: -2 },
          msg: "You feel incredible for three weeks. Every time a tester appears, your heart stops.",
          risk: 0.4,
          riskE: { ban: 24, fame: -30, club: -25, money: -300000 },
          riskMsg: "You test positive. Two years out, and every trophy you won gets an asterisk.",
        },
        {
          t: "Refuse and report the doctor",
          e: { club: 10, coach: 6, fit: -2, hap: 4 },
          msg: "You refuse and tell the club doctor. The 'vitamin' program quietly disappears.",
          risk: 0.2,
          riskE: { club: -6, fame: -3 },
          riskMsg: "The doctor has friends. The club makes your life difficult for a few months.",
        },
        {
          t: "Refuse politely",
          e: { fit: -3, hap: 2 },
          msg: "You say no and move on. No drama, no needles, no headlines.",
        },
      ],
    },
    {
      id: "fight",
      w: 6,
      min: 15,
      tier: "any",
      title: "Locker-room fight",
      text: () =>
        "A teammate mocks your family in front of everyone. The room goes quiet. Your hands decide before your brain does.",
      choices: [
        {
          t: "Swing",
          e: { club: -10, coach: -8, fame: 4, hap: 2 },
          msg: "You land one before three players pull you apart. The video is on the internet within the hour.",
          risk: 0.35,
          riskE: { club: -10, coach: -10, ban: 3, hap: -4 },
          riskMsg: "He has a cut over his eye. The club suspends you for three matches.",
        },
        {
          t: "Walk away",
          e: { coach: 7, club: 4, hap: -2 },
          msg: "You walk out. The manager hears about it and tells the squad you are the only adult in the room.",
        },
        {
          t: "Answer with a goal",
          e: { skill: 2, fame: 2, coach: 5 },
          msg: "You say nothing and score twice in the next match. The room changes its mind about you.",
        },
      ],
    },
    {
      id: "rumor",
      w: 7,
      min: 18,
      tier: "pro",
      title: "Press rumour",
      text: () =>
        "A tabloid prints that you are feuding with the manager, sleeping with a teammate's partner, and looking for a move. One of those is true.",
      choices: [
        {
          t: "Deny everything publicly",
          e: { fame: 3, coach: 5, club: 4 },
          msg: "You release a short statement. The club backs you and the story dies in two days.",
        },
        {
          t: "Ignore it",
          e: { fame: -2, hap: -3 },
          msg: "You say nothing. The story grows legs and follows you into the next press conference.",
        },
        {
          t: "Lean into it",
          e: { fame: 8, coach: -6, club: -6, hap: 3 },
          msg: "You post a cryptic emoji. The internet explodes. The manager does not find it funny.",
          risk: 0.3,
          riskE: { coach: -8, club: -8, fame: 4 },
          riskMsg: "The club issues a formal warning about your social media use.",
        },
      ],
    },
    {
      id: "penalty",
      w: 7,
      min: 17,
      tier: "pro",
      title: "Penalty duty",
      text: () =>
        "The manager names you the penalty taker. The last player who missed one here still gets booed a year later.",
      choices: [
        {
          t: "Embrace it",
          e: { skill: 2, fame: 4, coach: 6 },
          msg: "You start staying after training to practise. Every penalty in the next month is yours.",
        },
        {
          t: "Ask to share the duty",
          e: { coach: -3, club: -1, hap: 2 },
          msg: "You suggest the best finisher takes the big ones. The manager agrees, but notes your hesitation.",
        },
        {
          t: "Say you are not ready",
          e: { coach: -8, fame: -2, hap: 1 },
          msg: "You turn it down. The dressing room notices, and so does every defender in the league.",
        },
      ],
    },
    {
      id: "disrespect",
      w: 6,
      min: 17,
      tier: "pro",
      title: "Rival disrespect",
      text: () =>
        "A rival star points at you in the tunnel and says your goals are 'stat-padding against farmers'. A camera is right behind him.",
      choices: [
        {
          t: "Answer on the pitch",
          e: { skill: 2, fame: 3, form: 4 },
          msg: "You score in the return match and give him a long, silent look. The clip goes viral.",
        },
        {
          t: "Fire back in the interview",
          e: { fame: 5, coach: -3, hap: 3 },
          msg: "You call his career 'a highlight reel from 2019'. The quote is on every back page.",
        },
        {
          t: "Ignore him completely",
          e: { coach: 4, hap: 2, fame: -1 },
          msg: "You say nothing. He spends the derby trying to provoke you and gets a yellow card for it.",
        },
      ],
    },
    {
      id: "agent",
      w: 6,
      min: 18,
      tier: "pro",
      title: "Corrupt agent",
      text: () =>
        "An agent offers to 'find' you a move abroad if you give him 20% of everything, forever. His office is a car phone and a cousin.",
      choices: [
        {
          t: "Sign with him",
          e: { money: -40000, fame: 4, hype: 12 },
          msg: "He brings you two offers by Friday. Both look real. So does the 20% he takes.",
          risk: 0.4,
          riskE: { money: -120000, hap: -6, club: -4 },
          riskMsg: "He disappears with your signing bonus and a company car.",
        },
        {
          t: "Use him for one deal",
          e: { hype: 8, fame: 2, hap: 2 },
          msg: "You get one deal out of him and cut ties. He calls you ungrateful.",
        },
        {
          t: "Stick with family",
          e: { money: -5000, hap: 4, club: 4 },
          msg: "You hire your cousin. He is terrible at contracts but he does not steal.",
        },
      ],
    },
    {
      id: "exotic",
      w: 5,
      min: 25,
      tier: "pro",
      title: "The exotic league",
      text: () =>
        "A club in a desert league offers you triple your wage, a villa and a car. The league has eleven teams and a drone camera.",
      choices: [
        {
          t: "Take the money",
          e: { money: 900000, fame: -4, fit: -4, hap: 6 },
          msg: "You sign. The villa is enormous. The stadium is half full. Your bank account is very full.",
        },
        {
          t: "Ask for a sporting project",
          e: { club: 4, hype: 6, hap: 2 },
          msg: "You ask who else they are signing. They name three players you have never heard of. You pass.",
        },
        {
          t: "Reject and stay",
          e: { club: 8, coach: 5, money: 0 },
          msg: "You stay where the football means something. Your agent calls you a romantic.",
        },
      ],
    },
    {
      id: "criticism",
      w: 7,
      min: 17,
      tier: "any",
      title: "Fans turn",
      text: (f) =>
        `A section of the ${f.club.name} support starts chanting for you to be sold. They have printed a banner with your name on it and a bin next to it.`,
      choices: [
        {
          t: "Win them back",
          e: { skill: 2, coach: 5, form: 5, hap: -2 },
          msg: "You stay late, work harder, and applaud them at the end even when they boo. It works.",
        },
        {
          t: "Clap back",
          e: { fame: 3, club: -6, hap: 4 },
          msg: "You point at the banner and smile. The internet loves it. The stadium does not.",
          risk: 0.25,
          riskE: { club: -8, coach: -5, hap: -3 },
          riskMsg: "A group of fans waits outside the training ground. The club has to increase security.",
        },
        {
          t: "Let your agent leak a move",
          e: { hype: 10, club: -8, coach: -4, fame: 2 },
          msg: "Your agent plants a story about 'interest from abroad'. The fans boo louder and the board starts listening.",
        },
      ],
    },
    {
      id: "teammate",
      w: 6,
      min: 14,
      tier: "any",
      title: "The teammate goes down",
      text: () =>
        "Your closest friend in the squad tears his hamstring in training. It is the same position you play.",
      choices: [
        {
          t: "Support him fully",
          e: { club: 5, hap: 4, fit: 2 },
          msg: "You drive him to the clinic and sit with him. The squad sees who you are.",
        },
        {
          t: "Focus on taking his place",
          e: { skill: 3, coach: 6, form: 4, hap: -3 },
          msg: "You train like a machine. The coach notices. Your friend notices too.",
        },
        {
          t: "Visit him and ask for his legend",
          e: { skill: 1, club: 3, hap: 5, coach: 2 },
          msg: "He laughs and shows you a trick he learned when he was fifteen. It actually works.",
        },
      ],
    },
    {
      id: "legend",
      w: 5,
      min: 14,
      tier: "any",
      title: "Extra training with a legend",
      text: (f) =>
        `A former club legend, ${f.club.name}'s favourite son, offers to stay after training to work with you one-on-one. Nobody else is invited.`,
      choices: [
        {
          t: "Say yes, every day",
          e: { skill: 4, fit: -3, coach: 3, legend: 1 },
          msg: "Three weeks of extra sessions. Your first touch changes. Your legs hate you.",
        },
        {
          t: "Say yes once a week",
          e: { skill: 2, fit: 1, coach: 1, legend: 1 },
          msg: "You keep it balanced. He says you are smart, not hungry.",
        },
        {
          t: "Politely decline",
          e: { fit: 3, legend: -1, coach: -2 },
          msg: "You protect your legs. He nods, but tells the manager you are 'comfortable'.",
        },
      ],
    },
    {
      id: "investment",
      w: 5,
      min: 20,
      tier: "any",
      title: "Your cousin has a plan",
      text: () =>
        "Your cousin has a 'guaranteed' investment: a chain of football-themed barbershops. He needs fifty thousand and he swears it is impossible to lose.",
      choices: [
        {
          t: "Invest everything",
          e: { money: -50000, hap: 5, fame: 1 },
          msg: "The first shop opens. The second one never does.",
          risk: 0.5,
          riskE: { money: -50000, hap: -8 },
          riskMsg: "The landlord takes the chairs. Your cousin stops answering the phone.",
          good: true,
        },
        {
          t: "Invest a small amount",
          e: { money: -10000, hap: 3 },
          msg: "You put in a little. If it works, great. If not, it is a haircut you can afford.",
        },
        {
          t: "Invest in your own training",
          e: { money: -12000, skill: 3, fit: 2 },
          msg: "You spend the money on a private coach and a nutritionist instead.",
        },
      ],
    },
    {
      id: "callup",
      w: 5,
      min: 19,
      tier: "pro",
      title: "Last-minute call-up",
      text: () =>
        "The national team calls. Their striker is injured and a flight is booked in three hours. You have not slept.",
      choices: [
        {
          t: "Go immediately",
          e: { fame: 6, fit: -6, hap: 8, hype: 10, national: 1 },
          msg: "You go. The first session is a blur, but you are in the room with the best players in the country.",
        },
        {
          t: "Ask for one day",
          e: { fit: 4, coach: -2, national: 0 },
          msg: "You arrive rested and sharp. The staff are impressed, but the coach remembers the hesitation.",
        },
        {
          t: "Declare yourself injured",
          e: { coach: 2, club: 4, national: -2, hap: -3 },
          msg: "You stay with the club. The national coach labels you 'not ready'. It will cost you later.",
        },
      ],
    },
    {
      id: "dive",
      w: 6,
      min: 17,
      tier: "pro",
      title: "The temptation",
      text: () =>
        "With the score level in injury time, a defender's leg hangs out. There is contact. There is not enough contact.",
      choices: [
        {
          t: "Go down",
          e: { fame: 2, club: -4, hap: -3, form: 3 },
          msg: "The whistle blows. You win the penalty. The replay shows your dive in slow motion on every screen.",
          risk: 0.35,
          riskE: { club: -8, fame: -6, coach: -5, ban: 2 },
          riskMsg: "The VAR catches it. You are booked, then banned for two matches for simulation.",
        },
        {
          t: "Stay on your feet",
          e: { club: 8, coach: 5, fame: 1, hap: 4 },
          msg: "You stay up and the chance goes. The manager hugs you after the match anyway.",
        },
        {
          t: "Try a shot anyway",
          e: { skill: 1, fame: 3, form: 3 },
          msg: "You shoot through the contact. The ball clips the post and goes wide. At least it was real.",
        },
      ],
    },
    {
      id: "weight",
      w: 5,
      min: 15,
      max: 30,
      tier: "any",
      title: "Holiday weight",
      text: () =>
        "Six weeks off, four family barbecues and one very proud grandmother later, the club scale does not lie.",
      choices: [
        {
          t: "Own it and work it off",
          e: { fit: 8, skill: 1, hap: -4, coach: 3 },
          msg: "You run every morning for a month. The weight comes off and your legs feel better than before.",
        },
        {
          t: "Hide it with baggy clothes",
          e: { fit: -6, coach: -3, hap: 2 },
          msg: "You wear a baggy top for two weeks. The fitness coach is not fooled for one session.",
        },
        {
          t: "Blame the club nutritionist",
          e: { coach: -6, club: -4, hap: 3 },
          msg: "You throw the nutritionist under the bus. He has text messages from you ordering pizza.",
        },
      ],
    },
    {
      id: "position",
      w: 4,
      min: 18,
      tier: "pro",
      title: "Position change",
      text: () =>
        "The manager thinks your future is in a different position. It is less glamorous, more running and probably better for your career.",
      choices: [
        {
          t: "Embrace the change",
          e: { skill: 3, coach: 8, form: 3, hap: -2 },
          msg: "You learn the role. Two months later you are undroppable in a position you never wanted.",
        },
        {
          t: "Refuse",
          e: { coach: -10, club: -4, hap: 3 },
          msg: "You say you are a striker, not a midfielder. The manager says fine, and picks someone else.",
        },
        {
          t: "Ask for a trial period",
          e: { skill: 2, coach: 3, hap: 1 },
          msg: "You agree to try it for five matches. You are not convinced, but you are curious.",
        },
      ],
    },
    {
      id: "scouts",
      w: 6,
      min: 15,
      tier: "any",
      title: "European scouts",
      text: () =>
        "Three men in club jackets sit in the stands with notebooks. Everyone in the squad knows exactly who they are watching.",
      choices: [
        {
          t: "Play for the scouts",
          e: { fame: 3, form: 3, coach: -3, hype: 12 },
          msg: "You try the spectacular every time you touch the ball. One scout writes something down. Your coach does not.",
        },
        {
          t: "Play your normal game",
          e: { skill: 2, coach: 4, hype: 8 },
          msg: "You keep it simple and effective. The scouts speak to your coach at full time.",
        },
        {
          t: "Do not even look at them",
          e: { form: 2, coach: 6, hype: 3, hap: 2 },
          msg: "You focus on the match. The result is a team performance and the coach loves it.",
        },
      ],
    },
    {
      id: "strike",
      w: 4,
      min: 20,
      tier: "pro",
      title: "Player strike",
      text: () =>
        "The squad has not been paid in two months. The senior players want to refuse to play. The board says it is 'a temporary cash-flow issue'.",
      choices: [
        {
          t: "Join the strike",
          e: { club: -10, coach: 2, fame: 4, hap: 3 },
          msg: "You stand with the squad. The board calls you ungrateful. The players call you a leader.",
          risk: 0.3,
          riskE: { club: -10, ban: 2, money: -20000 },
          riskMsg: "The board fines the ringleaders. Your name is on the list.",
        },
        {
          t: "Play and stay quiet",
          e: { club: 6, coach: -2, hap: -4 },
          msg: "You play. The fans do not know the difference. The dressing room does.",
        },
        {
          t: "Negotiate between the sides",
          e: { club: 8, coach: 5, fame: 3, hap: 2 },
          msg: "You get both sides into a room. The wages are paid within a week. Nobody thanks you publicly.",
        },
      ],
    },
    {
      id: "rival",
      w: 6,
      min: 16,
      tier: "any",
      title: "The kid behind you",
      text: () =>
        "A sixteen-year-old from the academy is training with the first team and he is faster, sharper and louder than you were at his age.",
      choices: [
        {
          t: "Mentor him",
          e: { club: 6, coach: 5, hap: 3, skill: 1 },
          msg: "You take him under your wing. The coach notices that you make the people around you better.",
        },
        {
          t: "Compete harder",
          e: { skill: 3, fit: -3, coach: 4, form: 3 },
          msg: "You raise your level. The kid raises his. Both of you get better, and the coach is delighted.",
        },
        {
          t: "Make his life difficult",
          e: { club: -6, coach: -4, hap: 2, fame: -1 },
          msg: "You smash him in training and freeze him out. The senior players notice and lose respect for you.",
        },
      ],
    },
    {
      id: "invader",
      w: 3,
      min: 14,
      tier: "any",
      title: "Pitch invader",
      text: () =>
        "A fan runs onto the pitch, dodges two stewards, and stops in front of you holding a phone and a marker pen.",
      choices: [
        {
          t: "Sign something",
          e: { fame: 3, hap: 4, club: 1 },
          msg: "You sign his shirt. He gets tackled by security mid-selfie. The clip is everywhere.",
        },
        {
          t: "Point him out to security",
          e: { club: 4, coach: 2, hap: 1 },
          msg: "You wave the stewards over. Professional, sensible, completely unmemorable.",
        },
        {
          t: "Take a selfie with him",
          e: { fame: 6, club: -2, hap: 5 },
          msg: "You take the selfie. It gets four million views. The club fines you for 'encouraging pitch invasions'.",
        },
      ],
    },
    {
      id: "playinghurt",
      w: 5,
      min: 18,
      tier: "pro",
      title: "The final is Sunday",
      text: () =>
        "Your ankle is swollen and the physio says twenty percent chance of making it worse. The manager says it is your call.",
      choices: [
        {
          t: "Play",
          e: { club: 10, coach: 8, fame: 4, fit: -10 },
          msg: "You play. Every sprint burns. You get through seventy minutes and the stadium sings your name.",
          risk: 0.4,
          riskE: { injury: 10, fit: -14, hap: -6 },
          riskMsg: "The ankle goes in the second half. You leave on a stretcher and miss the next two months.",
        },
        {
          t: "Start on the bench",
          e: { club: 4, coach: 2, fit: 2, hap: -2 },
          msg: "You start on the bench and come on for the last twenty. You are not the hero, but you are available.",
        },
        {
          t: "Sit it out",
          e: { fit: 6, coach: -8, club: -6, hap: -6 },
          msg: "You watch from the stands with ice on your ankle. The team wins. You feel like you did not.",
        },
      ],
    },
    {
      id: "cover",
      w: 4,
      min: 19,
      tier: "pro",
      title: "Video-game cover",
      text: () =>
        "A football game wants you on the cover. The catch: the photoshoot is in Los Angeles, three days before a derby.",
      choices: [
        {
          t: "Do the shoot",
          e: { money: 200000, fame: 12, fit: -4, coach: -5 },
          msg: "You fly out, shoot for two days, and sleep on the plane back. The cover looks incredible.",
        },
        {
          t: "Send a body double",
          e: { money: 120000, fame: 6, coach: 0 },
          msg: "The game uses a model with your face digitally added. Nobody can tell. Your coach can tell.",
        },
        {
          t: "Turn it down until summer",
          e: { coach: 6, club: 4, fame: -2 },
          msg: "You ask them to wait until the season ends. The game agrees. The manager remembers.",
        },
      ],
    },
    {
      id: "scandal",
      w: 5,
      min: 18,
      tier: "pro",
      title: "Social-media scandal",
      text: () =>
        "A five-year-old tweet of yours resurfaces. You were fifteen, it was a joke, and the internet has decided it is a national emergency.",
      choices: [
        {
          t: "Apologise sincerely",
          e: { fame: 2, club: 4, hap: -4, coach: 3 },
          msg: "You post a short apology and take the questions. The story burns out in three days.",
        },
        {
          t: "Double down",
          e: { fame: 7, club: -8, coach: -6, hap: 3 },
          msg: "You call it a joke and tell people to relax. Half the internet loves it. The board does not.",
          risk: 0.3,
          riskE: { club: -10, fame: -8, money: -50000 },
          riskMsg: "A sponsor drops you and the club issues a statement distancing itself from your comments.",
        },
        {
          t: "Delete everything and go dark",
          e: { fame: -5, hap: 2, coach: 2 },
          msg: "You delete every post and hand your accounts to the club. Peace, at the cost of your reach.",
        },
      ],
    },
    {
      id: "captain",
      w: 4,
      min: 20,
      tier: "pro",
      title: "The armband",
      text: () =>
        "The captain is leaving. The manager offers you the armband, but warns that the dressing room has opinions.",
      choices: [
        {
          t: "Take it",
          e: { coach: 8, club: 7, fame: 5, hap: 4, captain: 1 },
          msg: "You take the armband. The first team talk is awkward. The second one is not.",
        },
        {
          t: "Ask for a vote",
          e: { club: 8, coach: 4, hap: 3, captain: 1 },
          msg: "The squad votes. You win comfortably, which makes the armband mean more.",
        },
        {
          t: "Turn it down",
          e: { coach: -4, hap: -2, club: 2 },
          msg: "You say you prefer to lead without it. The manager respects the honesty, but picks someone else.",
        },
      ],
    },
    {
      id: "retirement",
      w: 3,
      min: 30,
      tier: "pro",
      title: "The easy way out",
      text: () =>
        "A club in a small league offers you a player-manager role with a huge salary and no pressure. It is the softest landing in football.",
      choices: [
        {
          t: "Take the deal",
          e: { money: 600000, fame: -6, hap: 6, fit: -6, coach: 0 },
          msg: "You sign. The football is slow, the weather is warm, and nobody expects anything.",
        },
        {
          t: "Stay and fight for your place",
          e: { club: 6, coach: 4, fit: -3, hap: 2 },
          msg: "You stay. The legs are heavier every year, but you are not done yet.",
        },
        {
          t: "Ask to coach here when you retire",
          e: { club: 10, coach: 5, hap: 4 },
          msg: "You tell the board you want to finish here and coach afterwards. They love the loyalty.",
        },
      ],
    },
    {
      id: "testimonial",
      w: 3,
      min: 28,
      tier: "pro",
      title: "Testimonial match",
      text: () =>
        "The club offers you a testimonial: one match, all proceeds to you, and every legend they can still get on a plane.",
      choices: [
        {
          t: "Take every penny",
          e: { money: 400000, fame: 4, hap: 4, club: -2 },
          msg: "The stadium sells out. You score a penalty. The money lands in your account.",
        },
        {
          t: "Give it to the academy",
          e: { club: 14, fame: 8, hap: 8, money: 0 },
          msg: "You donate the gate to the youth academy. They name a pitch after you.",
        },
        {
          t: "Split it with the old squad",
          e: { money: 200000, club: 6, hap: 6, fame: 3 },
          msg: "You split the proceeds with the players who made your career. Nobody argues.",
        },
      ],
    },
    {
      id: "charity",
      w: 4,
      min: 20,
      tier: "any",
      title: "Foundation",
      text: () =>
        "Your team wants to launch a foundation in your name. It is good PR, real work, and a lot of photos with children holding scarves.",
      choices: [
        {
          t: "Launch it properly",
          e: { money: -100000, fame: 8, hap: 7, club: 6 },
          msg: "You fund it with real money and show up every month. It becomes the thing you are most proud of.",
        },
        {
          t: "Do the photos and leave",
          e: { fame: 3, hap: -2, club: 1 },
          msg: "You attend the launch, take the photos, and never go back. The internet eventually notices.",
          risk: 0.3,
          riskE: { fame: -6, club: -4, hap: -4 },
          riskMsg: "A journalist finds the foundation has done nothing in a year. Your face is on the story.",
        },
        {
          t: "Support an existing charity instead",
          e: { money: -30000, fame: 4, hap: 5, club: 3 },
          msg: "You put your name behind a charity that already works. Less glamorous, more useful.",
        },
      ],
    },
    {
      id: "clause",
      w: 4,
      min: 20,
      tier: "pro",
      title: "Release clause",
      text: () =>
        "A superclub wants you. They are willing to pay the release clause, but your club is offering a new deal with a bigger clause and a bigger wage.",
      choices: [
        {
          t: "Force the move",
          e: { club: -14, coach: -8, fame: 5, hype: 15, wagePct: 60 },
          msg: "You tell the club you want out. The superclub pays. The fans burn your shirt outside the stadium.",
        },
        {
          t: "Sign the new deal",
          e: { club: 10, coach: 6, money: 150000, wagePct: 25 },
          msg: "You sign. The clause goes up, the wage goes up, and the fans sing your name again.",
        },
        {
          t: "Let the season finish first",
          e: { club: 6, coach: 4, hap: 3, hype: 6 },
          msg: "You tell both sides to wait. It keeps everyone nervous, including you.",
        },
      ],
    },
    {
      id: "boots",
      w: 5,
      min: 17,
      tier: "any",
      title: "Boot deal",
      text: () =>
        "A sportswear giant wants you to wear their boots. The money is decent, the boots are bright orange, and your current pair is broken in perfectly.",
      choices: [
        {
          t: "Sign and wear them",
          e: { money: 90000, fame: 5, fit: -2, skill: -1 },
          msg: "You wear the orange boots. They blister your heel for a month. The cheque clears.",
        },
        {
          t: "Negotiate a custom pair",
          e: { money: 50000, fame: 3, skill: 1 },
          msg: "They make a custom pair in your old colourway. Best of both worlds.",
        },
        {
          t: "Stay loyal to your old brand",
          e: { club: 3, hap: 3, money: 0, fame: -1 },
          msg: "You keep the boots that got you here. The old brand sends you a lifetime supply.",
        },
      ],
    },
    {
      id: "hotel",
      w: 3,
      min: 18,
      tier: "pro",
      title: "Haunted hotel",
      text: () =>
        "The team hotel is a converted nineteenth-century prison. At 3am the corridor lights turn on by themselves and someone is dragging furniture upstairs.",
      choices: [
        {
          t: "Investigate",
          e: { hap: -6, fame: 4, fit: -4, courage: 1 },
          msg: "You find a night porter moving chairs. He says the hotel is haunted and he is not paid enough to care.",
        },
        {
          t: "Switch rooms",
          e: { fit: 3, hap: 1, fame: -1 },
          msg: "You sleep in the team doctor's room. He snores, but nothing drags furniture.",
        },
        {
          t: "Film it for content",
          e: { fame: 7, fit: -4, hap: 3, club: -2 },
          msg: "The video gets two million views. The manager bans phones after midnight for the rest of the season.",
        },
      ],
    },
    {
      id: "refbribe",
      w: 3,
      min: 19,
      tier: "pro",
      title: "A word with the referee",
      text: () =>
        "A fixer says he knows the referee for Sunday's match. He only needs a 'thank you' delivered after the final whistle.",
      choices: [
        {
          t: "Report him",
          e: { club: 10, coach: 6, fame: 3, hap: 4 },
          msg: "You report the approach. The federation investigates and quietly thanks you.",
        },
        {
          t: "Ignore him",
          e: { hap: -2 },
          msg: "You walk away. Sunday's referee has a very strange game, but nothing can be proven.",
        },
        {
          t: "Play along to gather evidence",
          e: { fame: 4, hap: -4, club: 4 },
          msg: "You string him along and hand the recordings to the authorities. It works, but you sleep badly.",
          risk: 0.35,
          riskE: { ban: 6, fame: -10, club: -10 },
          riskMsg: "The recording is incomplete. You are investigated for six months before being cleared.",
        },
      ],
    },
    {
      id: "proposal",
      w: 3,
      min: 18,
      tier: "any",
      title: "Marry me",
      text: () =>
        "A fan has brought a banner to every away game for two years. Today it says 'MARRY ME' and she is holding a ring.",
      choices: [
        {
          t: "Say yes as a joke",
          e: { fame: 8, hap: 6, club: -2 },
          msg: "You point at her and nod. The clip explodes. Her boyfriend is not amused.",
        },
        {
          t: "Invite her to the training ground",
          e: { fame: 4, club: 3, hap: 4 },
          msg: "You sign a shirt and take a photo. She is delighted. The club social team gets a great post.",
        },
        {
          t: "Ignore the banner",
          e: { fame: -1, hap: -1, club: 1 },
          msg: "You keep your eyes on the match. Professional. Slightly cold.",
        },
      ],
    },
    {
      id: "crypto",
      w: 4,
      min: 20,
      tier: "pro",
      title: "Crypto endorsement",
      text: () =>
        "A crypto exchange offers six figures to post their logo. Their offices are a beach house and their CEO's name is 'Braden'.",
      choices: [
        {
          t: "Take the deal",
          e: { money: 180000, fame: 4, hap: 3 },
          msg: "You post the logo. Six weeks later the exchange freezes withdrawals.",
          risk: 0.45,
          riskE: { fame: -12, money: -50000, hap: -6 },
          riskMsg: "The exchange collapses. Fans who invested because of you are furious, and one of them is a lawyer.",
        },
        {
          t: "Ask for payment upfront",
          e: { money: 120000, fame: 2 },
          msg: "You take the money upfront and delete the post after a month. Cynical, but profitable.",
        },
        {
          t: "Turn it down",
          e: { club: 4, hap: 3, fame: -1 },
          msg: "You pass. The club's commercial director sighs with relief.",
        },
      ],
    },
    {
      id: "crash",
      w: 3,
      min: 18,
      tier: "pro",
      title: "Car crash",
      text: () =>
        "You fall asleep at the wheel after an away game and clip a barrier. You are fine. The car is not. Neither is the club's insurance mood.",
      choices: [
        {
          t: "Tell the club",
          e: { club: 3, coach: 2, money: -30000, fit: -4, hap: -5 },
          msg: "You report it immediately. The club is annoyed but appreciates the honesty.",
        },
        {
          t: "Fix it quietly",
          e: { money: -60000, hap: -3, club: -2 },
          msg: "You pay a garage to fix it before anyone notices. The mechanic posts a photo of your car.",
          risk: 0.35,
          riskE: { club: -8, coach: -4, fame: -4 },
          riskMsg: "The photo reaches a journalist. The club fines you for hiding it.",
        },
        {
          t: "Blame the other driver",
          e: { fame: 2, club: -2, hap: 2 },
          msg: "You give a statement blaming the other driver. The dashcam eventually says otherwise.",
          risk: 0.5,
          riskE: { club: -8, fame: -8, money: -40000 },
          riskMsg: "The dashcam footage leaks. You look like a liar, and the insurer refuses to pay.",
        },
      ],
    },
    {
      id: "brother",
      w: 4,
      min: 18,
      tier: "pro",
      title: "Your brother wants in",
      text: () =>
        "Your brother has decided he is your agent now. He has business cards, a website, and absolutely no experience.",
      choices: [
        {
          t: "Hire him",
          e: { hap: 7, money: -20000, hype: 4 },
          msg: "He gets you one good deal and one terrible one. Family dinner is complicated now.",
        },
        {
          t: "Give him a smaller role",
          e: { hap: 4, club: 2, money: -5000 },
          msg: "He handles your social media instead. Nobody is hurt and he feels included.",
        },
        {
          t: "Tell him no",
          e: { hap: -5, fame: 1, money: 0 },
          msg: "He takes it badly and stops coming to matches for a year. You miss him more than you expected.",
        },
      ],
    },
    {
      id: "pundit",
      w: 5,
      min: 18,
      tier: "pro",
      title: "Pundit feud",
      text: () =>
        "A retired pundit calls you 'the most overrated player in the league' on national television, then smiles at the camera.",
      choices: [
        {
          t: "Invite him to the training ground",
          e: { fame: 5, hap: 6, coach: 2 },
          msg: "He turns up, watches a session, and admits on air that he was wrong. Everybody wins.",
        },
        {
          t: "Reply with a celebration",
          e: { fame: 6, coach: -2, hap: 4 },
          msg: "You score and do his signature gesture. The clip runs for weeks.",
        },
        {
          t: "Take the criticism seriously",
          e: { skill: 2, coach: 4, hap: -3 },
          msg: "You watch the clip ten times, find the truth in it, and fix it on the training pitch.",
        },
      ],
    },
  ];

  // Extra youth-only flavour: first-team debut nerves, exam week, etc.
  EV.push(
    {
      id: "exams",
      w: 6,
      min: 14,
      max: 18,
      tier: "any",
      title: "Exam week",
      text: () =>
        "You have three exams and a cup semi-final in the same week. Your mother has already told you which one matters more.",
      choices: [
        {
          t: "Study every night",
          e: { skill: -2, coach: -4, hap: 3 },
          msg: "You pass everything. The coach notices you missed two sessions and starts someone else.",
        },
        {
          t: "Train and wing the exams",
          e: { skill: 3, coach: 5, hap: -4 },
          msg: "You play the semi-final and pass two of three exams. Your mother is not impressed by the maths.",
        },
        {
          t: "Ask the club for help",
          e: { club: 5, coach: 3, hap: 2 },
          msg: "The club sends a tutor. You pass everything and play the semi-final. Turns out asking works.",
        },
      ],
    },
    {
      id: "firstteam",
      w: 6,
      min: 16,
      max: 20,
      tier: "youth",
      title: "First-team training",
      text: () =>
        "The manager calls you up to train with the first team for a week. The senior pros test every young player who walks through that door.",
      choices: [
        {
          t: "Try to impress every second",
          e: { skill: 3, fit: -4, coach: 4, fame: 1 },
          msg: "You go full speed for a week. You are exhausted, but the manager remembers your name.",
        },
        {
          t: "Keep it simple",
          e: { coach: 6, club: 4, skill: 1 },
          msg: "You do the basics perfectly. The captain tells the manager you are ready.",
        },
        {
          t: "Ask the senior pros for advice",
          e: { skill: 2, club: 6, hap: 4 },
          msg: "You ask questions all week. By Friday the senior striker is calling you his project.",
        },
      ],
    },
    {
      id: "homesick",
      w: 4,
      min: 15,
      max: 21,
      tier: "any",
      title: "Homesick",
      text: () =>
        "The academy dorm is quiet, the food is bad, and everyone back home is posting photos you are not in.",
      choices: [
        {
          t: "Call home every night",
          e: { hap: 5, fit: 2, skill: -1 },
          msg: "Your family keeps you sane. You lose a little focus, but you sleep better.",
        },
        {
          t: "Throw yourself into training",
          e: { skill: 3, fit: 2, hap: -5 },
          msg: "You train until you are too tired to be sad. The coach notices. So does your mother, on the phone.",
        },
        {
          t: "Ask the club for a mentor",
          e: { club: 6, hap: 6, coach: 3 },
          msg: "An older player takes you under his wing. He has been exactly where you are.",
        },
      ],
    },
    {
      id: "agentkid",
      w: 3,
      min: 14,
      max: 18,
      tier: "any",
      title: "A stranger with a contract",
      text: () =>
        "A man outside the training ground says he can make you a star. He has a contract, a laminated badge and a rented car.",
      choices: [
        {
          t: "Sign it",
          e: { fame: 2, money: -2000, hap: 2, hype: 6 },
          msg: "Your parents find out and go nuclear. The contract turns out to be worthless.",
          risk: 0.5,
          riskE: { money: -10000, hap: -6, club: -2 },
          riskMsg: "He takes a 'registration fee' and stops answering his phone.",
        },
        {
          t: "Show your parents",
          e: { club: 4, hap: 5, coach: 2 },
          msg: "Your parents read every line and find three clauses that should not exist. You learn something.",
        },
        {
          t: "Walk away",
          e: { hap: 2, club: 2 },
          msg: "You keep walking. He shouts something about 'a lack of ambition' from the car park.",
        },
      ],
    },
  );

  window.FL_FUTBOL_EVENTS = EV;
})();
