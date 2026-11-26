/* [mod] Football Career: more events, and most of them are NOT about football.
 *
 * Adds 36 events to window.FL_FUTBOL_EVENTS (must load after futbol-events.js). Events with `life: true` are the
 * life outside the pitch (family, friends, love, money, neighbours, school, health, the internet); futbol.js
 * mixes them in so a season is no longer a string of dressing-room stories.
 * Same format as futbol-events.js: choices with `e` effects (skill, fit, fame, money, hap, coach, club, form, hype),
 * `msg`, and an optional `risk` / `riskE` / `riskMsg`.
 */
(() => {
  "use strict";
  const EV = window.FL_FUTBOL_EVENTS;
  if (!EV || window.__FL_FB_LIFE) return;
  window.__FL_FB_LIFE = true;

  const L = (o) => EV.push({ tier: "any", w: 4, life: true, ...o });

  // ------------------------------------------------------------------ family and friends
  L({
    id: "l_grandma", min: 14, title: "Grandma's kitchen", icon: "1f475",
    text: () => "Your grandmother calls: she made your favorite food and wants you at the table on Sunday. You have a match on Monday.",
    choices: [
      { t: "Go and eat everything", e: { hap: 7, fit: -2 }, msg: "Three plates later you are happy, heavy and loved. Your legs feel it on Monday." },
      { t: "Go, but eat light", e: { hap: 5, fit: 1 }, msg: "You sit with her for hours and eat what the nutritionist would allow. She pretends not to notice." },
      { t: "Skip it for rest", e: { fit: 3, hap: -4 }, msg: "You rest. She says she understands, and that is somehow worse." },
    ],
  });
  L({
    id: "l_friend_wedding", min: 20, title: "A best friend's wedding", icon: "1f492",
    text: () => "Your oldest friend is getting married on the same weekend as a big fixture. He wants you there, in the front row.",
    choices: [
      { t: "Go to the wedding", e: { hap: 8, coach: -3 }, msg: "You dance until two in the morning. The coach is not thrilled, but the speech you gave is talked about for years." },
      { t: "Ask the club for the weekend", e: { hap: 4, club: -2 }, msg: "The club grants it with a sigh. You make the ceremony and miss the party.", risk: 0.35, riskE: { hap: -3, club: -5 }, riskMsg: "The club says no. You send a video message and a very expensive gift." },
      { t: "Stay for the match", e: { form: 3, hap: -6 }, msg: "You play well and your friend says all the right things on the phone. It still stings." },
    ],
  });
  L({
    id: "l_friend_money", min: 18, title: "A friend asks for money", icon: "1f4b5",
    text: () => "An old friend from the neighborhood needs a loan. He swears he will pay it back by summer.",
    choices: [
      { t: "Lend him the money", e: { money: -3000, hap: 2 }, msg: "He pays back half and sends a very warm message for the rest.", risk: 0.5, riskE: { money: -3000, hap: -3 }, riskMsg: "He never mentions it again. Neither do you." },
      { t: "Give him a smaller gift", e: { money: -800, hap: 3 }, msg: "You tell him it is a gift, not a loan. It keeps the friendship clean." },
      { t: "Say no kindly", e: { hap: -2 }, msg: "He says he understands. The next time you see him, he is a little cold." },
    ],
  });
  L({
    id: "l_sibling_game", min: 14, max: 40, title: "Your little cousin wants to play", icon: "1f9d2",
    text: () => "Your young cousin has seen you on TV and wants you to teach him some tricks in the street.",
    choices: [
      { t: "Spend the afternoon with him", e: { hap: 6, fame: 1 }, msg: "He tries every trick on you and wins most of the duels. You leave with a sore ego and a full heart." },
      { t: "Invite him to training", e: { hap: 4, club: 3 }, msg: "The staff love the kid. He leaves with a signed ball and a new dream." },
      { t: "Promise next time", e: { hap: -2 }, msg: "He nods bravely. You both know what 'next time' means." },
    ],
  });
  L({
    id: "l_parent_visit", min: 15, max: 30, title: "Your parents want to move closer", icon: "1f3e0",
    text: () => "Your parents are tired of watching your matches on a screen. They think about moving to your city.",
    choices: [
      { t: "Help them move", e: { money: -6000, hap: 7 }, msg: "A family dinner on a Tuesday night changes everything. You did not know how lonely you were." },
      { t: "Visit when you can", e: { hap: 1 }, msg: "They say that is fine. They do not mean it, but they do not push." },
      { t: "Say it would be a distraction", e: { hap: -5, skill: 1 }, msg: "You win a lot of quiet evenings and lose some very important ones." },
    ],
  });
  L({
    id: "l_old_coach", min: 20, title: "Your first coach calls", icon: "1f9d1-200d-1f3eb",
    text: () => "The man who taught you to kick a ball in a dusty field is retiring. He asks if you will come to his farewell.",
    choices: [
      { t: "Go and give a speech", e: { hap: 7, fame: 2 }, msg: "You thank him in front of half the town. Half the town cries." },
      { t: "Go quietly", e: { hap: 5 }, msg: "You sit at the back, sign three shirts, and he finds you at the end to say you were always the one who would do it." },
      { t: "Send a gift", e: { money: -500, hap: 1 }, msg: "He calls to thank you. You can hear in his voice that he hoped you would be there." },
    ],
  });
  L({
    id: "l_reunion", min: 25, title: "School reunion", icon: "1f393",
    text: () => "Your old school is celebrating an anniversary and invites its 'famous alumnus'. Some of those faces you have not seen in a decade.",
    choices: [
      { t: "Go and sign autographs", e: { hap: 5, fame: 2 }, msg: "A teacher who gave you a bad grade asks for a signed shirt. It is the best moment of the night." },
      { t: "Go as just yourself", e: { hap: 6 }, msg: "You sit at a table with the people you grew up with and talk about nothing. It is perfect." },
      { t: "Skip it", e: { hap: -2 }, msg: "You have a good reason, and you know it." },
    ],
  });

  // ------------------------------------------------------------------ love and home
  L({
    id: "l_date", min: 17, title: "A first date", icon: "1f490",
    text: () => "Someone you met at a friend's party asks you out. They are funny, they do not seem to care that you play football, and that is new.",
    choices: [
      { t: "Dinner at a quiet place", e: { hap: 6 }, msg: "Four hours go by like ten minutes. You agree to do it again." },
      { t: "Invite them to a match", e: { hap: 4, fame: 1 }, msg: "They have never seen a live match. By the second half, they are on their feet.", risk: 0.3, riskE: { hap: -2 }, riskMsg: "They are bored by halftime. You say you will make it up to them." },
      { t: "Cancel, you are too busy", e: { hap: -3, skill: 1 }, msg: "You tell yourself you will find time later. You do not." },
    ],
  });
  L({
    id: "l_breakup", min: 19, title: "A hard conversation", icon: "1f494",
    text: () => "Your partner says they are tired of how little time you have. It is not an argument; it is a quiet kitchen table and a long silence.",
    choices: [
      { t: "Promise to change", e: { hap: 3, form: -2 }, msg: "You take a full weekend off. It helps, for a while.", risk: 0.4, riskE: { hap: -6, form: -3 }, riskMsg: "The weekend off does not fix it. It ends a month later, kindly." },
      { t: "Be honest about the career", e: { hap: -2, skill: 1 }, msg: "You explain what it takes. They listen, and you both end up respecting each other more." },
      { t: "Throw yourself into training", e: { skill: 2, hap: -6 }, msg: "You win the argument by not having it. You lose something else." },
    ],
  });
  L({
    id: "l_house", min: 21, title: "Buy a house?", icon: "1f3e1",
    text: () => "A real estate agent shows you a house with a garden big enough for a small pitch. It would also eat a big part of your savings.",
    choices: [
      { t: "Buy it", e: { money: -25000, hap: 8 }, msg: "You sign on a Monday and kick a ball in the garden on a Tuesday. It feels like a home." },
      { t: "Rent for now", e: { money: -1500, hap: 2 }, msg: "You keep your options open. Footballers move more often than they think." },
      { t: "Invest the money instead", e: { money: 2500, hap: 1 }, msg: "Your advisor smiles. The numbers look good on paper." },
    ],
  });
  L({
    id: "l_pet", min: 16, title: "A stray at the training ground", icon: "1f436",
    text: () => "A thin, scruffy dog has been following you around the training ground all week. The groundskeeper says nobody owns it.",
    choices: [
      { t: "Adopt him", e: { hap: 8, money: -300 }, msg: "He sleeps on your couch the very first night. The team makes him a mascot." },
      { t: "Find him a good home", e: { hap: 4, club: 2 }, msg: "A teammate's kids fall in love with him. He gets a better yard than yours." },
      { t: "Leave him to the groundskeeper", e: { hap: -1 }, msg: "He looks at you from the fence on your way out. You think about it for days." },
    ],
  });

  // ------------------------------------------------------------------ money, neighbors, daily life
  L({
    id: "l_traffic", min: 18, title: "Flashing lights in the mirror", icon: "1f6a8",
    text: () => "A police car pulls you over on the way home. You were a little over the limit, and the officer has just recognized you.",
    choices: [
      { t: "Take the ticket politely", e: { money: -400, hap: -1 }, msg: "He gives you the ticket and asks for a photo. Both happen in that order." },
      { t: "Try to talk your way out", e: { fame: 1 }, msg: "He lets you go with a warning and a smile. You will drive slower for a while.", risk: 0.45, riskE: { money: -900, fame: -2 }, riskMsg: "He does not appreciate the attempt. The fine is double, and someone posts it online." },
      { t: "Say nothing and shrink in the seat", e: { money: -400 }, msg: "A quiet ticket. A very quiet drive home." },
    ],
  });
  L({
    id: "l_neighbors", min: 19, title: "The neighbors complain", icon: "1f3d8-fe0f",
    text: () => "The neighbors say your friends are too loud on Friday nights. One of them leaves a very passive-aggressive note.",
    choices: [
      { t: "Apologize with a gift basket", e: { hap: 3, money: -100 }, msg: "They end up inviting you for dinner. You are friends now." },
      { t: "Tell your friends to keep it down", e: { hap: -1, fit: 1 }, msg: "The note disappears. So do some of your Friday plans." },
      { t: "Ignore it", e: { hap: -2 }, msg: "A formal complaint arrives in the mail. Now you are the neighbor everyone talks about." },
    ],
  });
  L({
    id: "l_burglar", min: 20, title: "Someone broke into your home", icon: "1f6aa",
    text: () => "You come back from an away game and the front door is open. A few things are missing, the rest is a mess.",
    choices: [
      { t: "Call the police and the insurer", e: { money: -300, hap: -2 }, msg: "A slow, boring process. They recover some of it." },
      { t: "Hire private security", e: { money: -4000, hap: 3 }, msg: "Cameras, a gate, a guard. You sleep a little better each night." },
      { t: "Shrug it off", e: { hap: -4 }, msg: "You tell everyone you do not care. For weeks you check the lock twice." },
    ],
  });
  L({
    id: "l_inheritance", min: 22, title: "A surprise in the mail", icon: "1f4e7",
    text: () => "A lawyer's letter: a distant relative you barely knew has left you something in their will.",
    choices: [
      { t: "Accept it", e: { money: 6000, hap: 3 }, msg: "It is not a fortune, but it is a lovely thought. You visit the grave on your next day off." },
      { t: "Give it to your parents", e: { hap: 7 }, msg: "Your mother cries on the phone. Your father pretends it is the line." },
      { t: "Donate it to a local club", e: { fame: 2, hap: 5, club: 2 }, msg: "The local kids' team gets new kits and goals. The mayor sends a letter." },
    ],
  });
  L({
    id: "l_charityrun", min: 16, title: "A charity run", icon: "1f3c3",
    text: () => "A local hospital organizes a 10 km run and asks if you will start the race with them.",
    choices: [
      { t: "Run the whole thing", e: { hap: 5, fit: 3, fame: 2 }, msg: "You finish ahead of the kids, behind the grandmother. The photos are lovely." },
      { t: "Start it and cheer", e: { hap: 3, fame: 1 }, msg: "You blow the whistle, sign a hundred shirts and leave happy." },
      { t: "Decline politely", e: { hap: -1 }, msg: "You send a signed ball. It sells for a lot." },
    ],
  });
  L({
    id: "l_vacation", min: 18, title: "A real vacation", icon: "1f3d6-fe0f",
    text: () => "You finally have two weeks with nothing on the calendar. A friend suggests an island; your mother suggests staying home.",
    choices: [
      { t: "Go to the island", e: { hap: 8, fit: 1, money: -3500 }, msg: "Sand, sun, and no one asking you about your last pass. You come back brown and calm." },
      { t: "Stay home with the family", e: { hap: 6, money: -200 }, msg: "Long meals, long walks. You remember what it is to be a kid." },
      { t: "Train a little each day", e: { fit: 3, hap: 1, skill: 1 }, msg: "A vacation, sort of. Your body appreciates it more than your head." },
    ],
  });
  L({
    id: "l_hobby", min: 15, title: "A new hobby", icon: "1f3a8",
    text: () => "You start doing something that has nothing to do with football. It could be music, painting, cooking, or video games.",
    choices: [
      { t: "Learn to cook", e: { hap: 5, fit: 2 }, msg: "Within a month you make a mean risotto. The nutritionist is delighted." },
      { t: "Pick up a guitar", e: { hap: 6, fame: 1 }, msg: "Three chords, one badly sung song. A teammate films it, and it does numbers." },
      { t: "Play video games all night", e: { hap: 4, fit: -3 }, msg: "It is fun until you realize it is four in the morning on a training day." },
    ],
  });

  // ------------------------------------------------------------------ the internet and the town
  L({
    id: "l_troll", min: 16, title: "A troll targets you", icon: "1f4f1",
    text: () => "An anonymous account has spent a week replying to everything you post. It is getting under your skin.",
    choices: [
      { t: "Block and move on", e: { hap: 2 }, msg: "Three clicks and the noise is gone. It is almost insulting how easy that was." },
      { t: "Answer with humor", e: { fame: 3, hap: 2 }, msg: "Your reply gets a hundred thousand likes. The troll vanishes.", risk: 0.3, riskE: { fame: -2, hap: -3 }, riskMsg: "It goes wrong. The reply is screenshotted and quote-tweeted by thousands." },
      { t: "Delete the app for a week", e: { hap: 3, fit: 1 }, msg: "A week of real life. You sleep better than you have in months." },
    ],
  });
  L({
    id: "l_fan_letter", min: 15, title: "A letter from a sick child", icon: "1f48c",
    text: () => "A club staff member hands you a letter from a child in the hospital. He has your poster above his bed.",
    choices: [
      { t: "Visit him", e: { hap: 8, fame: 3, club: 2 }, msg: "He is smaller than you imagined, and braver. You leave with wet eyes and his drawing." },
      { t: "Send a signed shirt and a video", e: { hap: 5, fame: 1 }, msg: "His mother writes back with a photo. He is wearing the shirt in bed." },
      { t: "Reply with a short note", e: { hap: 2 }, msg: "You write what you can. It never feels like enough." },
    ],
  });
  L({
    id: "l_mural", min: 20, title: "A mural of you", icon: "1f3a8",
    text: () => "An artist in your old neighborhood has painted a giant mural of your face on the side of a building, and the whole street is cheering.",
    choices: [
      { t: "Show up for the unveiling", e: { hap: 8, fame: 3 }, msg: "The street is full of flags. A grandmother kisses your hand." },
      { t: "Donate to the neighborhood", e: { money: -2500, hap: 6, fame: 2 }, msg: "The money goes to a new playground. They name the swings after you." },
      { t: "Keep it low-key", e: { hap: 3 }, msg: "You walk past it in a cap. You smile all day." },
    ],
  });
  L({
    id: "l_exam2", min: 15, max: 23, title: "An exam week", icon: "1f4da",
    text: () => "Your school wants you to sit exams at the same time as a big youth tournament. You have not studied.",
    choices: [
      { t: "Study every night", e: { hap: -2, form: -2 }, msg: "You pass, tired but proud. The coach notices the effort, even if the legs are heavy." },
      { t: "Ask for a special exam date", e: { hap: 1, club: 1 }, msg: "The school agrees, but only because your coach called the principal." },
      { t: "Focus on football and hope", e: { form: 3, hap: -4 }, msg: "You play the tournament of your life and then flunk two papers. Your mother is not thrilled.", risk: 0.5, riskE: { form: 1, hap: -6 }, riskMsg: "Your mother takes your phone for a week." },
    ],
  });
  L({
    id: "l_local_politics", min: 24, title: "The mayor's invitation", icon: "1f3db-fe0f",
    text: () => "The mayor invites you to open a new sports center and says the city would love an 'ambassador'.",
    choices: [
      { t: "Accept the ambassador role", e: { fame: 4, hap: 3, money: 1500 }, msg: "It comes with a banner, a handshake and a pile of photos." },
      { t: "Open it but stay out of politics", e: { fame: 2, hap: 3 }, msg: "A polite ribbon-cutting. Everyone goes home happy." },
      { t: "Decline", e: { hap: -1 }, msg: "He says he understands. His staff do not." },
    ],
  });
  L({
    id: "l_health", min: 18, title: "A strange pain", icon: "1fa7a",
    text: () => "You have had a headache every morning for a week. It has nothing to do with football, and it keeps getting worse.",
    choices: [
      { t: "See a doctor today", e: { hap: -1, fit: 2, money: -300 }, msg: "It is stress and bad sleep. You get a list and a lot of advice." },
      { t: "Try to sleep it off", e: { fit: -2 }, msg: "It goes away on the fifth night. You keep a quiet eye on it.", risk: 0.3, riskE: { fit: -6, hap: -3 }, riskMsg: "It comes back harder and puts you in bed for two days." },
      { t: "Tell the club physio", e: { club: 2, fit: 3 }, msg: "He catches it early. You learn that your body talks long before it screams." },
    ],
  });
  L({
    id: "l_mentor_kid", min: 21, title: "A teenager asks for advice", icon: "1f9d1",
    text: () => "A 16-year-old from your old academy messages you: he wants to quit football and asks if it is worth it.",
    choices: [
      { t: "Tell him the truth", e: { hap: 4, fame: 1 }, msg: "You do not sugarcoat it. He thanks you, and he stays." },
      { t: "Offer to meet in person", e: { hap: 6, fame: 2 }, msg: "Two hours and a long walk. He leaves with a plan." },
      { t: "Wish him luck", e: { hap: -1 }, msg: "He never replies. You hope he is okay." },
    ],
  });
  L({
    id: "l_wedding_invite", min: 22, title: "Your own wedding", icon: "1f48d", w: 2,
    text: () => "Your partner asks, in the middle of a Sunday morning, if you want to make it official.",
    choices: [
      { t: "Say yes right now", e: { hap: 9, money: -8000 }, msg: "A small ceremony and a big party. The team sends a very, very expensive blender." },
      { t: "Say yes, but wait for the offseason", e: { hap: 6, money: -5000 }, msg: "Everyone agrees it is the smartest plan." },
      { t: "Say not yet", e: { hap: -5 }, msg: "They nod and smile with just their mouth. It takes a while to feel normal again." },
    ],
  });
  L({
    id: "l_baby", min: 21, title: "A surprise at the clinic", icon: "1f476", w: 2,
    text: () => "You and your partner find out you are going to be parents. The football calendar suddenly looks very small.",
    choices: [
      { t: "Celebrate with the family", e: { hap: 9, money: -700 }, msg: "Everybody cries, somebody drops a plate, and you cannot stop smiling." },
      { t: "Plan the next five years", e: { hap: 4, skill: 1, money: 800 }, msg: "A notebook, a spreadsheet, a long evening. For once the future feels organized." },
      { t: "Panic quietly", e: { hap: -2, form: -2 }, msg: "You do not tell anyone. By the third day, you cannot stop telling everyone." },
    ],
  });

  // ------------------------------------------------------------------ football, but small and human
  EV.push(
    {
      id: "f_kit", w: 4, min: 16, tier: "pro", title: "The new kit launch",
      text: () => "The club presents next season's kit and asks you to model it for a photo shoot. It is your first one.",
      choices: [
        { t: "Pose with a big smile", e: { fame: 3, hap: 3, club: 2 }, msg: "You look good and everyone says so. The fans buy your shirt in record numbers." },
        { t: "Make a face on purpose", e: { fame: 4, hap: 2, club: -1 }, msg: "The photo goes viral. The marketing director is not sure how he feels about that." },
        { t: "Send a teammate instead", e: { hap: -1, club: -1 }, msg: "The photographer takes it fine. The sponsor, less so." },
      ],
    },
    {
      id: "f_tour", w: 4, min: 17, tier: "pro", title: "A pre-season tour",
      text: () => "The club plans a pre-season tour in a far-away country. Long flights, strange food, packed stadiums.",
      choices: [
        { t: "Embrace it", e: { hap: 5, fame: 2, fit: -2 }, msg: "You learn three phrases and a dozen street foods. You play your best friendly in years." },
        { t: "Stay in the hotel and rest", e: { fit: 3, hap: -2 }, msg: "You rest, play your minutes, and sleep in your own bed at the end." },
        { t: "Ask to skip it", e: { club: -3, fit: 4 }, msg: "The coach says it is your call. His face says something different." },
      ],
    },
    {
      id: "f_bench", w: 4, min: 17, tier: "pro", title: "On the bench again",
      text: () => "Four matches in a row, and you have not made the starting eleven. The coach has not said why.",
      choices: [
        { t: "Ask him directly", e: { coach: 4, hap: 1 }, msg: "He tells you the truth. It is not what you wanted, but you now know what to fix.", risk: 0.3, riskE: { coach: -3, hap: -3 }, riskMsg: "He takes it badly and hints that there are other options." },
        { t: "Prove it in training", e: { skill: 2, coach: 2, fit: -2 }, msg: "You hit every drill. By Friday, he has noticed." },
        { t: "Talk to your agent", e: { hype: 2, club: -2 }, msg: "Your agent makes some calls. Word gets around the club." },
      ],
    },
    {
      id: "f_derby_prep", w: 3, min: 17, tier: "pro", title: "Derby week",
      text: () => "The whole city is talking about it. Taxi drivers, bakers, even your mother. The derby is on Sunday.",
      choices: [
        { t: "Stay inside and focus", e: { form: 4, hap: -1 }, msg: "A quiet week. You play like you have been waiting for it for years." },
        { t: "Visit the fan zone", e: { fame: 3, hap: 3, club: 2 }, msg: "The fans sing your name. You are fired up on Sunday." },
        { t: "Do not let it get to you", e: { form: 2, hap: 1 }, msg: "A normal week. It works, mostly." },
      ],
    },
    {
      id: "f_presidentvisit", w: 3, min: 18, tier: "pro", title: "The president wants a coffee",
      text: () => "The club president invites you to his office. No one says why. Everyone says something.",
      choices: [
        { t: "Be humble and listen", e: { club: 5, hap: 2 }, msg: "He wants to know how you are settling in and what the club could do better. You leave with a plan." },
        { t: "Ask for a pay raise", e: { money: 1000, club: -2, hype: 1 }, msg: "He says he will think about it. You are not sure if that is a yes.", risk: 0.5, riskE: { club: -5, hap: -3 }, riskMsg: "He says the club does not negotiate with players who have not earned it yet." },
        { t: "Mention a better stadium", e: { club: 3, fame: 1 }, msg: "He laughs, writes it down, and says you are the first player who has ever said that." },
      ],
    },
    {
      id: "f_teammate_injured", w: 4, min: 16, tier: "any", title: "A teammate goes down",
      text: () => "A teammate is carried off with a bad injury. In the dressing room afterwards, nobody speaks for a long time.",
      choices: [
        { t: "Visit him in the hospital", e: { hap: 3, club: 3, coach: 1 }, msg: "He appreciates it more than he says. The team feels closer afterwards." },
        { t: "Dedicate the next goal to him", e: { form: 3, fame: 1, hap: 2 }, msg: "You do not score. You do dedicate a hell of an assist." },
        { t: "Keep your head down", e: { hap: -2, form: -1 }, msg: "You tell yourself you are focusing. It feels worse than that." },
      ],
    },
    {
      id: "f_fan_selfie", w: 4, min: 15, tier: "any", title: "The selfie queue",
      text: () => "After a match, forty fans wait outside the stadium for a photo. It is raining, and you have a long ride home.",
      choices: [
        { t: "Take every photo", e: { fame: 3, hap: 3, fit: -1 }, msg: "You are soaked. They are thrilled. A boy gives you his scarf." },
        { t: "Take a few and leave", e: { fame: 1, hap: 1 }, msg: "Fair enough. You wave from the bus." },
        { t: "Walk straight to the car", e: { fame: -2 }, msg: "Someone films it. 'Too big for the fans', says the caption." },
      ],
    },
    {
      id: "f_boot_sponsor2", w: 3, min: 18, tier: "pro", title: "Free boots, strange offer",
      text: () => "A small brand sends you a box of boots, free. They ask you to wear them on your next match.",
      choices: [
        { t: "Wear them", e: { money: 1200, hype: 1 }, msg: "They are surprisingly good. The brand sends a thank-you hamper.", risk: 0.3, riskE: { form: -3, hap: -2 }, riskMsg: "They give you blisters the size of coins. You switch back at halftime." },
        { t: "Stick with your own", e: { form: 1 }, msg: "Nobody notices. The brand is quiet." },
        { t: "Tell your main sponsor", e: { club: 1, money: 500 }, msg: "Your main sponsor is touched. They send a small bonus." },
      ],
    },
    {
      id: "f_youth_visit", w: 3, min: 20, tier: "pro", title: "Visit the academy",
      text: () => "The club asks you to visit the academy and talk to the kids. A few of them look at you like you are made of gold.",
      choices: [
        { t: "Play a game with them", e: { hap: 6, fame: 2, club: 2 }, msg: "A nine-year-old nutmegs you. You laugh until you cannot breathe." },
        { t: "Give a serious talk", e: { hap: 3, club: 3 }, msg: "You tell them it is a long road. A few of them take notes." },
        { t: "Keep it short", e: { hap: 0 }, msg: "A few photos and a wave. It is fine." },
      ],
    },
    {
      id: "f_new_stadium", w: 3, min: 18, tier: "pro", title: "The new stadium tour",
      text: () => "The club shows the players around the new stadium before anyone else. The grass is perfect, and it smells like fresh paint.",
      choices: [
        { t: "Kick a ball on the pitch", e: { hap: 5, club: 2 }, msg: "Your first goal in it is a toe-poke into an empty net. You celebrate like it was the final." },
        { t: "Stand in the stands and look", e: { hap: 4, form: 1 }, msg: "Eighty thousand empty seats. You imagine them full." },
        { t: "Ask where the parking is", e: { hap: 1 }, msg: "Everyone laughs. It is a fair question." },
      ],
    },
  );
})();
