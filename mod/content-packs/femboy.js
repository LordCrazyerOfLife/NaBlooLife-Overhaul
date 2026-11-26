/* [mod] Femboy Journey para NaBlooLife / NaBlooLife.
 *
 * Un amigo hombre adulto puede explorar su lado femenino contigo: ropa, nombre,
 * salir del armario, transición, citas y un par de intentos de seducción.
 * Son 12 eventos secuenciales y 4 finales según lo que elijas.
 *
 * Es consensuado: él propone, duda y puede decir que no. No hay contenido explícito.
 * Solo aparece en amigos hombres mayores de 18 años (y si tú también lo eres).
 *
 * Se engancha desde openFriend (game.html) con window.FL_FEMBOY.decorate().
 */
(() => {
  "use strict";

  if (window.FL_FEMBOY || window.__FL_FEMBOY_LOADING) return;
  window.__FL_FEMBOY_LOADING = true;

  const ICON = "emoji/1f485.png";
  const NAME_ICON = "emoji/1f4dd.png";
  const TOTAL = 12;
  const FEM_NAMES = ["Mia", "Luna", "Ella", "Sophie", "Nina", "Chloe", "Iris", "Rose", "Vera", "Jade"];
  const UNI_NAMES = ["Alex", "Sam", "Rowan", "Noa", "Kai", "Riley", "Quinn", "Ari"];

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const ageOf = (f) => Math.max(0, state.age + (Number(f.ageOffset) || 0));
  const adult = (f) => state.age >= 18 && ageOf(f) >= 18;
  const nameOf = (f) => `${f.first || ""} ${f.last || ""}`.trim();
  const pronoun = (s) => (s && s.trans ? "she" : "he");
  const possessive = (s) => (s && s.trans ? "her" : "his");

  function story(f) {
    if (!f.femboy || typeof f.femboy !== "object") {
      f.femboy = {
        started: false,
        introSeen: false,
        stage: 0,
        affection: 0,
        trans: false,
        hrt: false,
        legal: false,
        romance: false,
        kissed: false,
        public: false,
        support: false,
        doubt: false,
        feminine: false,
        name: "",
        originalFirst: f.first,
        ending: null,
        history: [],
      };
    }
    return f.femboy;
  }

  function start(f) {
    const s = story(f);
    if (!s.started) {
      s.started = true;
      s.originalFirst = s.originalFirst || f.first;
    }
    return s;
  }

  function rename(f, raw) {
    const next = String(raw || "").trim().slice(0, 24);
    if (!next) return false;
    const s = story(f);
    s.originalFirst = s.originalFirst || f.first;
    s.name = next;
    f.first = next;
    return true;
  }

  function spend(n) {
    const cash = Number(state.cash) || 0;
    const bank = Number(state.money) || 0;
    if (cash + bank < n) return false;
    const fromCash = Math.min(cash, n);
    state.cash = cash - fromCash;
    state.money = bank - (n - fromCash);
    if (typeof renderStats === "function") renderStats();
    return true;
  }

  function apply(f, e = {}) {
    const s = story(f);
    if (e.affection) s.affection = clamp(s.affection + e.affection, -10, 20);
    if (e.rel) f.rel = clamp((Number(f.rel) || 0) + e.rel, 0, 100);
    if (e.trans !== undefined) s.trans = !!e.trans;
    if (e.hrt !== undefined) s.hrt = !!e.hrt;
    if (e.legal !== undefined) s.legal = !!e.legal;
    if (e.romance !== undefined) s.romance = !!e.romance;
    if (e.kissed) s.kissed = true;
    if (e.public) s.public = true;
    if (e.support) s.support = true;
    if (e.doubt) s.doubt = true;
    if (e.feminine) s.feminine = true;
    if (e.name) rename(f, e.name);
    if (e.g && f.g !== e.g) f.g = e.g;
    if (e.happiness) {
      state.stats.Happiness = clamp((Number(state.stats.Happiness) || 50) + e.happiness, 0, 100);
      if (typeof renderStats === "function") renderStats();
    }
    return s;
  }

  function personFor(f) {
    if (!f.look) return undefined;
    return { name: nameOf(f), look: f.look, g: f.g, age: ageOf(f), mood: "happy" };
  }

  function status(f) {
    const s = f.femboy;
    if (!s || !s.started) return "Help him explore a softer side";
    if (s.ending) return `Complete · ${ENDING_TITLE[s.ending] || s.ending}`;
    const ev = EVENTS[Math.min(s.stage, TOTAL - 1)];
    return ev ? ev.title : "Continue";
  }

  function trust(f) {
    const s = story(f);
    return Math.max(3, Math.min(100, 55 + s.affection * 4));
  }

  function rowsFor(f) {
    const s = story(f);
    return [
      ["His name", `${f.first} ${f.last}`.trim()],
      ...(s.trans ? [["Identity", s.hrt ? "Transitioning" : "Exploring"]] : []),
    ];
  }

  function barsFor(f) {
    return [["Trust", trust(f), "#d96a9a"]];
  }

  function cardClose(reopen) {
    return typeof reopen === "function" ? () => reopen() : undefined;
  }

  function resultCard(f, index, reopen, text) {
    const s = story(f);
    if (typeof say === "function") say(text);
    jCard({
      tag: "Femboy Journey",
      iconSrc: ICON,
      title: "Afterward",
      lead: text,
      rows: rowsFor(f),
      bars: barsFor(f),
      close: cardClose(reopen),
      choices: [["Continue", () => open(f, index, reopen)]],
    });
  }

  function endingFor(s) {
    if (s.affection >= 8 && s.romance) return "partner";
    if (s.affection >= 3) return "bestfriends";
    return "drift";
  }

  const ENDING_TITLE = {
    partner: "Moving In",
    bestfriends: "The Person Who Knows",
    almost: "Not Yet",
    slow: "No Label",
    drift: "Another City",
  };

  function endingText(f, s, ending) {
    const n = f.first;
    if (ending === "partner")
      return `${n} moves in. The spare room becomes a closet, then a studio. ${n} keeps the name you helped ${pronoun(s) === "she" ? "her" : "him"} choose, and you keep the first skirt ${pronoun(s) === "she" ? "she" : "he"} ever bought.`;
    if (ending === "bestfriends")
      return `${n} keeps a key to your place. Not as a partner — as the person who knows everything, including the name ${pronoun(s) === "she" ? "she" : "he"} almost didn't say out loud.`;
    if (ending === "almost")
      return `${n} says ${pronoun(s) === "she" ? "she" : "he"} isn't ready to move in. ${n} asks if you'll still be there. You say yes. For now, that's enough.`;
    if (ending === "slow")
      return `You don't put a label on it. ${n} stays over more nights than not, and the two of you keep figuring it out one conversation at a time.`;
    return `${n} moves to another city. A year later, a photo arrives: a sunrise, a new apartment, and the name you helped ${pronoun(s) === "she" ? "her" : "him"} choose.`;
  }

  function finalCard(f, index, reopen, lead) {
    const s = story(f);
    const ending = s.ending || endingFor(s);
    s.ending = ending;
    const text = `${lead ? `${lead}<br><br>` : ""}${endingText(f, s, ending)}`;
    if (typeof say === "function" && !lead) say(endingText(f, s, ending));
    jCard({
      tag: "Femboy Journey",
      iconSrc: ICON,
      title: ENDING_TITLE[ending] || "Where This Goes",
      lead: text,
      rows: [
        ["Name", `${f.first} ${f.last}`.trim()],
        ["Trust", String(s.affection)],
        ["Identity", s.trans ? (s.hrt ? "Transitioning" : "Exploring") : "Still figuring it out"],
      ],
      bars: barsFor(f),
      close: cardClose(reopen),
      choices: [["Back to " + f.first, () => reopen()]],
    });
  }

  function finish(f, index, reopen, text, effects, ending) {
    const s = story(f);
    apply(f, effects);
    if (ending) s.ending = ending;
    s.stage = Math.min(TOTAL, s.stage + 1);
    s.history.push(EVENTS[Math.min(s.stage - 1, TOTAL - 1)]?.id || "event");
    if (s.stage >= TOTAL || s.ending) return finalCard(f, index, reopen, text);
    resultCard(f, index, reopen, text);
  }

  function nameCard(f, index, reopen, poolKind, after) {
    const s = story(f);
    const pool = poolKind === "unisex" ? UNI_NAMES : FEM_NAMES;
    const current = s.name || f.first;
    const chips = pool
      .map(
        (n) =>
          `<button class="jm-apply ev-btn gy" data-n="${esc(n)}" style="width:auto;margin:4px 4px 0 0;padding:6px 10px;font-size:14px">${esc(n)}</button>`,
      )
      .join("");
    ev.innerHTML =
      `<div class="jcw"><div class="jm-tag" style="margin-top:12px">Femboy Journey</div>` +
      `<h4><img src="${NAME_ICON}" alt=""><span>A Name of His Own</span></h4>` +
      `<div class="lead">He wants to try a new name. Type one, or pick a suggestion. He can always change it again.</div>` +
      `<label class="hr-lab">Name:</label>` +
      `<div class="hr-sel"><input id="flFemName" maxlength="24" autocomplete="off" spellcheck="false" value="${esc(current)}" style="width:100%;padding:9px 11px;border-radius:10px;border:1px solid #c8d1dc;font:inherit;color:#24313f"></div>` +
      `<div style="margin:6px 0 10px">${chips}</div>` +
      `<button class="jm-apply ev-btn" id="flFemNameGo">Use this name</button>` +
      `<button class="jm-apply ev-btn gy" id="flFemNameKeep">Keep ${esc(current)}</button></div>`;
    ev.classList.remove("death18");
    ev.style.overflow = "visible";
    evWrap.classList.add("open");
    const input = document.getElementById("flFemName");
    const close = () => {
      evWrap.classList.remove("open");
      ev.style.overflow = "";
      if (typeof play === "function") play("choice");
    };
    const submit = () => {
      const value = String(input.value || "").trim().slice(0, 24);
      if (!value) return input.focus();
      rename(f, value);
      close();
      after(value, false);
    };
    document.getElementById("flFemNameGo").onclick = submit;
    document.getElementById("flFemNameKeep").onclick = () => {
      close();
      after(current, true);
    };
    ev.querySelectorAll("[data-n]").forEach((b) => {
      b.onclick = () => {
        input.value = b.dataset.n;
        input.focus();
      };
    });
    input.onkeydown = (e) => {
      if (e.key === "Enter") submit();
    };
    setTimeout(() => input.focus(), 100);
  }

  function introCard(f, index, reopen) {
    const s = story(f);
    s.introSeen = true;
    const n = f.first;
    jCard({
      tag: "Femboy Journey",
      iconSrc: ICON,
      title: "A Softer Side",
      lead: `${n} has been your friend for a while. Tonight ${pronoun(s)} asks a question ${pronoun(s)} has clearly rehearsed: "What if I tried dressing more... feminine?" ${n} watches you, half-smiling, half-terrified.`,
      person: personFor(f),
      close: cardClose(reopen),
      choices: [
        [
          "Tell him you're in",
          () => {
            apply(f, { affection: 1 });
            if (typeof say === "function") say(`I told ${n} I was in.`);
            open(f, index, reopen);
          },
        ],
        [
          "Ask what he has in mind",
          () => {
            apply(f, { affection: 1, support: true });
            if (typeof say === "function") say(`I asked ${n} what he had in mind.`);
            open(f, index, reopen);
          },
        ],
        [
          "Tell him you need to think",
          () => {
            apply(f, { affection: -1 });
            if (typeof say === "function") say(`I told ${n} I needed to think about it.`);
            open(f, index, reopen);
          },
        ],
      ],
    });
  }

  function open(f, index, reopen) {
    if (!f || f.dead) return;
    const s = start(f);
    if (s.ending || s.stage >= TOTAL) return finalCard(f, index, reopen);
    if (!s.introSeen) return introCard(f, index, reopen);
    const ev = EVENTS[s.stage];
    if (!ev) return finalCard(f, index, reopen);
    const choices = ev
      .choices(f, s, index, reopen)
      .filter(Boolean)
      .map(([label, fn]) => [
        label,
        () => {
          if (typeof play === "function") play("choice");
          fn();
        },
      ]);
    jCard({
      tag: "Femboy Journey",
      iconSrc: ICON,
      title: ev.title,
      lead: ev.lead(f, s),
      rows: rowsFor(f),
      bars: barsFor(f),
      person: personFor(f),
      close: cardClose(reopen),
      choices,
    });
  }

  const EVENTS = [
    {
      id: "skirt",
      title: "The Thrift Store Skirt",
      lead: (f) =>
        `${f.first} sends you a photo of a thrift store skirt and asks if ${pronoun(story(f))} should try it on. ${pronoun(story(f))} says it's probably a joke. It doesn't sound like a joke.`,
      choices: (f, s, index, reopen) => [
        [
          "Tell him to try it on",
          () =>
            finish(f, index, reopen, `${f.first} tries it on and sends a mirror selfie, grinning so wide the phone shakes. "Okay," ${pronoun(s)} says. "This is happening."`, {
              affection: 2,
              happiness: 2,
              feminine: true,
              rel: 3,
            }),
        ],
        [
          "Offer to go shopping with him",
          () =>
            finish(f, index, reopen, `You go with ${f.first}. ${pronoun(s)} spends twenty minutes in the fitting room, then comes out in the skirt and a borrowed top. The two of you laugh at the price tag and buy it anyway.`, {
              affection: 3,
              happiness: 3,
              feminine: true,
              rel: 5,
            }),
        ],
        [
          "Ask if he's okay",
          () =>
            finish(f, index, reopen, `${f.first} admits ${pronoun(s)} has been thinking about this for months. You listen without making it weird, and ${pronoun(s)} looks lighter afterward.`, {
              affection: 2,
              support: true,
              rel: 3,
            }),
        ],
        [
          "Tell him it's just a skirt",
          () =>
            finish(f, index, reopen, `${f.first} laughs and says you're right. ${pronoun(s)} doesn't send another photo for a while.`, {
              affection: -1,
              doubt: true,
            }),
        ],
      ],
    },
    {
      id: "name",
      title: "A Name of His Own",
      lead: (f) =>
        `${f.first} has been signing messages with a different name lately. Tonight ${pronoun(story(f))} asks you to say it out loud.`,
      choices: (f, s, index, reopen) => [
        [
          "Help him pick a feminine name",
          () =>
            nameCard(f, index, reopen, "feminine", (name, kept) =>
              finish(
                f,
                index,
                reopen,
                kept
                  ? `${f.first} decides to keep ${possessive(s)} name for now. You tell ${pronoun(s)} the door stays open.`
                  : `${name} tries the name on like a new jacket. "Again," ${pronoun(s)} says, so you say it again.`,
                { affection: kept ? 1 : 2, happiness: kept ? 0 : 2, rel: 2 },
              ),
            ),
        ],
        [
          "Try a unisex name",
          () =>
            nameCard(f, index, reopen, "unisex", (name, kept) =>
              finish(
                f,
                index,
                reopen,
                kept
                  ? `${f.first} keeps ${possessive(s)} name for now. Nothing has to be decided tonight.`
                  : `${name} likes that it could belong to anyone. "I don't have to pick a whole new person," ${pronoun(s)} says. "I can just pick a better word for me."`,
                { affection: kept ? 1 : 2, support: true, rel: 2 },
              ),
            ),
        ],
        [
          "Tell him to keep his name",
          () =>
            finish(f, index, reopen, `${f.first} decides ${pronoun(s)} isn't ready to give up ${possessive(s)} name. You tell ${pronoun(s)} that's allowed too.`, {
              affection: 1,
              support: true,
            }),
        ],
        [
          "Ask why he wants a new name",
          () =>
            finish(f, index, reopen, `${f.first} talks for an hour. About mirrors, about being called something that feels like a costume, about wanting to hear a name that fits. You don't have answers, but you keep listening.`, {
              affection: 3,
              support: true,
              rel: 4,
            }),
        ],
      ],
    },
    {
      id: "mirror",
      title: "The Mirror",
      lead: (f) =>
        `You catch ${f.first} practicing in the mirror: eyeliner, a borrowed top, a look ${pronoun(story(f))} can't quite hold. ${pronoun(story(f))} freezes when ${pronoun(story(f))} sees you.`,
      choices: (f, s, index, reopen) => [
        [
          "Tell him he looks good",
          () =>
            finish(f, index, reopen, `${f.first} checks the mirror again, like ${pronoun(s)} is looking for the lie. There isn't one. "Yeah?" ${pronoun(s)} asks. "Yeah," you say.`, {
              affection: 3,
              happiness: 3,
              rel: 4,
            }),
        ],
        [
          "Fix his eyeliner",
          () =>
            finish(f, index, reopen, `You steady ${f.first}'s chin with one finger and fix the wing. ${pronoun(s)} forgets to breathe for a second. Neither of you mentions it.`, {
              affection: 2,
              romance: true,
              rel: 4,
            }),
        ],
        [
          "Give him privacy",
          () =>
            finish(f, index, reopen, `You step out and close the door. Ten minutes later ${f.first} comes out in the skirt, a little shy and a little proud.`, {
              affection: 1,
              support: true,
            }),
        ],
        [
          "Make a joke",
          () =>
            finish(f, index, reopen, `You make a joke about the eyeliner. ${f.first} laughs, but ${pronoun(s)} doesn't put it on again that night.`, {
              affection: -2,
              doubt: true,
            }),
        ],
      ],
    },
    {
      id: "roommate",
      title: "The Roommate",
      lead: (f) =>
        `His roommate comes home early and finds the two of you surrounded by clothes. "So this is what's been going on," he says. ${f.first} goes very still.`,
      choices: (f, s, index, reopen) => [
        [
          "Stand up for him",
          () =>
            finish(f, index, reopen, `You tell the roommate exactly what's happening and exactly how little it's his business. ${f.first} looks at you like you just won a fight ${pronoun(s)} didn't know ${pronoun(s)} was in.`, {
              affection: 3,
              public: true,
              support: true,
              rel: 5,
            }),
        ],
        [
          "Let him explain",
          () =>
            finish(f, index, reopen, `${f.first} does the talking. It comes out messy and honest. The roommate shrugs and asks if there's pizza. The night survives.`, {
              affection: 1,
              support: true,
            }),
        ],
        [
          "Make a joke to defuse it",
          () =>
            finish(f, index, reopen, `You say the clothes are for a very specific themed party. The roommate buys it. ${f.first} mouths "thank you" behind his back.`, {
              affection: 2,
              rel: 2,
            }),
        ],
        [
          "Leave",
          () =>
            finish(f, index, reopen, `You grab your jacket and go. ${f.first} texts you later: "It's fine. I handled it." You're not sure either of you believes that.`, {
              affection: -2,
              doubt: true,
            }),
        ],
      ],
    },
    {
      id: "groupchat",
      title: "The Group Chat",
      lead: (f) =>
        `A photo of ${f.first} in a skirt makes it to the group chat. The messages start coming in fast. ${pronoun(story(f))} sends you a single question mark.`,
      choices: (f, s, index, reopen) => [
        [
          "Defend him",
          () =>
            finish(f, index, reopen, `You type one message and the chat goes quiet. ${f.first} screenshots it. "I'm keeping this," ${pronoun(s)} says.`, {
              affection: 3,
              public: true,
              support: true,
              rel: 5,
            }),
        ],
        [
          "Send a better photo",
          () =>
            finish(f, index, reopen, `You post the photo where ${f.first} is actually smiling. The chat changes tone. ${pronoun(s)} calls you a menace, but ${pronoun(s)} is laughing.`, {
              affection: 2,
              public: true,
              rel: 3,
            }),
        ],
        [
          "Stay quiet",
          () =>
            finish(f, index, reopen, `You don't reply. ${f.first} handles it alone. ${pronoun(s)} says ${pronoun(s)} doesn't mind. The silence between you says otherwise.`, {
              affection: -1,
            }),
        ],
        [
          "Tell him to delete it",
          () =>
            finish(f, index, reopen, `You tell ${f.first} to take the photo down. ${pronoun(s)} does. "I thought you'd have my back," ${pronoun(s)} says, and the words sit there.`, {
              affection: -2,
              doubt: true,
            }),
        ],
      ],
    },
    {
      id: "close",
      title: "A Little Too Close",
      lead: (f) =>
        `${f.first} leans in while showing you something on ${possessive(story(f))} phone. ${possessive(story(f))} shoulder stays against yours a little too long. "You're not subtle, you know," ${pronoun(story(f))} says.`,
      choices: (f, s, index, reopen) => [
        [
          "Kiss him",
          () =>
            finish(f, index, reopen, `You kiss ${f.first}. ${pronoun(s)} makes a surprised sound, then kisses you back like ${pronoun(s)} has been waiting for permission. When you pull apart, ${pronoun(s)} is smiling too much to be cool about it.`, {
              affection: 3,
              romance: true,
              kissed: true,
              happiness: 3,
              rel: 6,
            }),
        ],
        [
          "Tell him to use his words",
          () =>
            finish(f, index, reopen, `"Use your words," you say. ${f.first} opens ${possessive(s)} mouth, closes it, and finally says, "I like you. Obviously. I've been trying to be obvious."`, {
              affection: 2,
              romance: true,
              rel: 4,
            }),
        ],
        [
          "Lean away",
          () =>
            finish(f, index, reopen, `You lean back. ${f.first} gets the message and gives you space, but ${pronoun(s)} looks a little embarrassed for the rest of the night.`, {
              affection: -1,
            }),
        ],
        [
          "Pretend you didn't notice",
          () =>
            finish(f, index, reopen, `You keep talking about the phone screen like nothing happened. ${f.first} lets you. The moment passes, but not cleanly.`, {
              affection: 0,
            }),
        ],
      ],
    },
    {
      id: "comingout",
      title: "Coming Out",
      lead: (f) =>
        `${f.first} is quiet for a long time. Then: "I think I might be trans." ${pronoun(story(f))} watches your face like the next word could break something.`,
      choices: (f, s, index, reopen) => [
        [
          "Tell him you're with him",
          () =>
            finish(f, index, reopen, `You tell ${f.first} you're with ${pronoun(s)}. ${pronoun(s)} lets out a breath ${pronoun(s)} has been holding for years. "Okay," ${pronoun(s)} says. "Okay."`, {
              affection: 3,
              trans: true,
              support: true,
              rel: 6,
              happiness: 4,
            }),
        ],
        [
          "Ask what he wants to do next",
          () =>
            finish(f, index, reopen, `You ask what ${f.first} wants. Not what ${pronoun(s)} should do, not what's safe, just what ${pronoun(s)} wants. ${pronoun(s)} has to think about it. It's the first time anyone has asked.`, {
              affection: 3,
              trans: true,
              support: true,
              rel: 5,
            }),
        ],
        [
          "Say it doesn't change anything",
          () =>
            finish(f, index, reopen, `You tell ${f.first} that this doesn't change how you see ${pronoun(s)}. ${pronoun(s)} nods, and something in ${possessive(s)} shoulders loosens.`, {
              affection: 2,
              trans: true,
              support: true,
              rel: 3,
            }),
        ],
        [
          "Tell him to be sure first",
          () =>
            finish(f, index, reopen, `${f.first} says ${pronoun(s)} understands. ${pronoun(s)} doesn't bring it up again for a long time.`, {
              affection: -3,
              trans: false,
              doubt: true,
            }),
        ],
      ],
    },
    {
      id: "appointment",
      title: "The Appointment",
      lead: (f) => {
        const s = story(f);
        return s.trans
          ? `${f.first} has a consult booked. ${pronoun(s)} asks if you'll wait outside. ${pronoun(s)} keeps checking the time.`
          : `${f.first} asks what you'd do if ${pronoun(s)} wanted to start hormones. The question hangs there.`;
      },
      choices: (f, s, index, reopen) => [
        [
          "Go with him",
          () =>
            finish(f, index, reopen, `You sit in the waiting room with ${f.first}. ${pronoun(s)} fills out the forms twice because ${possessive(s)} hands are shaking. You stay until ${pronoun(s)} is called back.`, {
              affection: 3,
              hrt: true,
              support: true,
              rel: 5,
            }),
        ],
        [
          "Offer to drive",
          () =>
            finish(f, index, reopen, `You drive ${f.first} to the appointment and back. ${pronoun(s)} talks the whole way home about everything except the appointment, then says "thank you" at the door.`, {
              affection: 2,
              hrt: true,
              support: true,
              rel: 4,
            }),
        ],
        [
          "Tell him to take his time",
          () =>
            finish(f, index, reopen, `You tell ${f.first} there's no rush. ${pronoun(s)} looks relieved, then a little disappointed. "Yeah," ${pronoun(s)} says. "Time."`, {
              affection: 1,
              hrt: false,
            }),
        ],
        [
          "Say it's too fast",
          () =>
            finish(f, index, reopen, `You tell ${f.first} this is moving too fast. ${pronoun(s)} cancels the consult. ${pronoun(s)} says it's fine. It doesn't sound fine.`, {
              affection: -3,
              hrt: false,
              doubt: true,
            }),
        ],
      ],
    },
    {
      id: "family",
      title: "Family Dinner",
      lead: (f) =>
        `His parents invited you both to dinner. ${f.first} is wearing the name ${pronoun(story(f))} chose. ${possessive(story(f))} mother keeps using the old one.`,
      choices: (f, s, index, reopen) => [
        [
          "Correct her gently",
          () =>
            finish(f, index, reopen, `You correct her once, quietly, and keep your voice friendly. The table goes still. ${f.first} puts ${possessive(s)} hand on your knee under the table.`, {
              affection: 3,
              public: true,
              support: true,
              rel: 5,
            }),
        ],
        [
          "Let him handle it",
          () =>
            finish(f, index, reopen, `${f.first} corrects her herself. It takes three tries. By dessert, she gets it right once. ${pronoun(s)} looks exhausted and proud.`, {
              affection: 1,
              support: true,
            }),
        ],
        [
          "Change the subject",
          () =>
            finish(f, index, reopen, `You steer the conversation to the weather. ${f.first} follows your lead. The old name keeps coming back anyway.`, {
              affection: 0,
            }),
        ],
        [
          "Leave with him",
          () =>
            finish(f, index, reopen, `You make an excuse and leave with ${f.first}. In the car, ${pronoun(s)} laughs once, sharp and surprised. "I can't believe you did that," ${pronoun(s)} says. "Thank you."`, {
              affection: 4,
              public: true,
              support: true,
              rel: 6,
            }),
        ],
      ],
    },
    {
      id: "candles",
      title: "Candles and a Short Skirt",
      lead: (f) =>
        `${f.first} opens the door in a short skirt, candles already lit. "I had a whole speech," ${pronoun(story(f))} says. "It was mostly about how much I want you."`,
      choices: (f, s, index, reopen) => [
        [
          "Pull him close",
          () =>
            finish(f, index, reopen, `You pull ${f.first} close and the speech dies right there. The candles burn down while the two of you forget the rest of the world.`, {
              affection: 4,
              romance: true,
              happiness: 4,
              rel: 7,
            }),
        ],
        [
          "Tell him the speech can wait",
          () =>
            finish(f, index, reopen, `"The speech can wait," you say. ${f.first} grins. "Good," ${pronoun(s)} says, "because I was going to forget half of it anyway."`, {
              affection: 3,
              romance: true,
              rel: 5,
            }),
        ],
        [
          "Ask if he's sure",
          () =>
            finish(f, index, reopen, `You ask if ${f.first} is sure. ${pronoun(s)} takes a breath and says yes. The two of you take it slower after that, which turns out to be its own kind of answer.`, {
              affection: 3,
              romance: true,
              support: true,
              rel: 5,
            }),
        ],
        [
          "Tell him this is too much",
          () =>
            finish(f, index, reopen, `You tell ${f.first} this is too much. ${pronoun(s)} blows out the candles and says ${pronoun(s)} understands. The apartment smells like smoke for the rest of the night.`, {
              affection: -3,
              doubt: true,
            }),
        ],
      ],
    },
    {
      id: "namechange",
      title: "The Name Change Form",
      lead: (f) => {
        const s = story(f);
        return s.name
          ? `A legal name-change form sits on the table. ${f.first} has filled in everything except the signature. "It feels real now," ${pronoun(s)} says.`
          : `A legal name-change form sits on the table. ${f.first} hasn't picked a name yet. "Maybe I should just leave it blank," ${pronoun(s)} says.`;
      },
      choices: (f, s, index, reopen) => {
        const legal = (text, affection) =>
          finish(f, index, reopen, text, {
            affection,
            legal: true,
            g: s.trans ? "f" : undefined,
          });
        if (!s.name) {
          return [
            [
              "Help him choose a name now",
              () =>
                nameCard(f, index, reopen, "feminine", (name, kept) =>
                  legal(
                    kept
                      ? `${f.first} signs the form under ${possessive(s)} current name. It's not the name ${pronoun(s)} wanted, but it's a start.`
                      : `${name} signs the form. ${pronoun(s)} stares at ${possessive(s)} own handwriting for a long time, then laughs.`,
                    kept ? 2 : 3,
                  ),
                ),
            ],
            [
              "Tell him he can wait",
              () =>
                finish(f, index, reopen, `${f.first} puts the form in a drawer. "Not yet," ${pronoun(s)} says. "But soon."`, {
                  affection: 1,
                  support: true,
                }),
            ],
            [
              "Say the old name is fine",
              () =>
                finish(f, index, reopen, `You tell ${f.first} the old name is fine. ${pronoun(s)} folds the form in half and doesn't look at you.`, {
                  affection: -2,
                  doubt: true,
                }),
            ],
          ];
        }
        return [
          [
            "Help him pay the fee",
            () => {
              const paid = spend(150);
              legal(
                paid
                  ? `You cover the fee. ${f.first} signs the form and kisses your cheek before you can react.`
                  : `You can't cover the fee, so you help ${f.first} with the paperwork instead. ${pronoun(s)} signs it and hugs you tight.`,
                paid ? 4 : 3,
              );
            },
          ],
          [
            "Take him to the courthouse",
            () =>
              legal(`You go with ${f.first} to the courthouse. ${pronoun(s)} signs the form, and the clerk says the new name out loud. ${pronoun(s)} squeezes your hand.`, 3),
          ],
          [
            "Tell him to wait",
            () =>
              finish(f, index, reopen, `${f.first} leaves the form unsigned. "You're right," ${pronoun(s)} says. "One thing at a time."`, {
                affection: 1,
                support: true,
              }),
          ],
          [
            "Say the old name was fine",
            () =>
              finish(f, index, reopen, `${f.first} puts the pen down. "Right," ${pronoun(s)} says. "The old name was fine." ${pronoun(s)} doesn't sound like ${pronoun(s)} believes it.`, {
              affection: -3,
              doubt: true,
            }),
          ],
        ];
      },
    },
    {
      id: "question",
      title: "The Question",
      lead: (f) =>
        `${f.first} asks the question you've both been circling: "What are we?" The candles are low, and ${pronoun(story(f))} isn't joking.`,
      choices: (f, s, index, reopen) => [
        [
          "Ask him to move in",
          () => {
            const ending = s.affection >= 6 && s.romance ? "partner" : "almost";
            finish(
              f,
              index,
              reopen,
              ending === "partner"
                ? `You ask ${f.first} to move in. ${pronoun(s)} says yes before you finish the sentence.`
                : `You ask ${f.first} to move in. ${pronoun(s)} hesitates, then says ${pronoun(s)} needs a little more time.`,
              { affection: 2, rel: 4 },
              ending,
            );
          },
        ],
        [
          "Say you're best friends",
          () =>
            finish(f, index, reopen, `You tell ${f.first} ${pronoun(s)} is your best friend. ${pronoun(s)} smiles, a little sad and a little relieved. "Yeah," ${pronoun(s)} says. "I can do that."`, {
              affection: 1,
            }, "bestfriends"),
        ],
        [
          "Tell him you need space",
          () =>
            finish(f, index, reopen, `You tell ${f.first} you need space. ${pronoun(s)} nods and starts packing a bag. "I'll call you when I'm settled," ${pronoun(s)} says.`, {
              affection: -2,
            }, "drift"),
        ],
        [
          "Say you don't know yet",
          () =>
            finish(f, index, reopen, `You tell ${f.first} you don't know what this is. ${pronoun(s)} takes your hand. "Okay," ${pronoun(s)} says. "We can not know together."`, {
              affection: 1,
              support: true,
            }, "slow"),
        ],
      ],
    },
  ];

  function decorate(f, index, reopen) {
    const old = document.getElementById("flFemboyRow");
    if (old) old.remove();
    const oldName = document.getElementById("flFemboyNameRow");
    if (oldName) oldName.remove();
    if (!f || f.dead) return;
    const s = f.femboy;
    if (!s && !(f.g === "m" && adult(f))) return;
    if (s && s.started && s.ending) {
      // sigue disponible para ver el final
    } else if (s && s.started && !adult(f)) {
      return;
    }
    const row = document.createElement("div");
    row.className = "row sm";
    row.id = "flFemboyRow";
    row.innerHTML = `<img src="${ICON}" alt=""><div class="t"><b>Femboy Journey</b><span>${esc(status(f))}</span></div>${typeof CHEV !== "undefined" ? CHEV : ""}`;
    row.onclick = () => {
      if (typeof play === "function") play("choice");
      open(f, index, reopen);
    };
    sList.appendChild(row);
    if (s && s.started && !s.ending) {
      const nr = document.createElement("div");
      nr.className = "row sm";
      nr.id = "flFemboyNameRow";
      nr.innerHTML = `<img src="${NAME_ICON}" alt=""><div class="t"><b>Change ${s.trans ? "Her" : "His"} Name</b><span>Currently goes by ${esc(f.first)}</span></div>${typeof CHEV !== "undefined" ? CHEV : ""}`;
      nr.onclick = () => {
        if (typeof play === "function") play("choice");
        nameCard(f, index, reopen, "feminine", (name, kept) => {
          if (typeof notice === "function")
            notice(kept ? "Same Name" : "A New Name", kept ? `${f.first} is keeping ${possessive(s)} name for now.` : `He'll go by ${f.first} now.`, null, true);
          reopen();
        });
      };
      sList.appendChild(nr);
    }
  }

  function boot() {
    if (
      typeof state === "undefined" ||
      typeof sList === "undefined" ||
      typeof ev === "undefined" ||
      typeof evWrap === "undefined" ||
      typeof jCard !== "function" ||
      typeof renderStats !== "function"
    )
      return setTimeout(boot, 80);
    window.FL_FEMBOY = {
      decorate,
      open,
      state: story,
      events: EVENTS,
      total: TOTAL,
    };
    window.__FL_FEMBOY_LOADING = false;
  }

  boot();
})();
