/* [mod] Carrera política ("Political Career") para NaBlooLife (mod local).
 * Se activa con el código 17760704 (mods.js). Aparece en Ocupación → Special Careers.
 * No toca game.html: envuelve openSpecialCareers y openJobScreen, y se engancha a #ageBtn.
 * Estado: state.politics (JSON puro, por vida).
 * Textos: T("english", "español", "português"); add_chess_i18n.py los pasa al ui.tsv.
 * REGLA: los textos de T() van entre comillas dobles, sin template literals.
 *
 * La escalera sigue la política estadounidense: junta escolar → concejo municipal →
 * alcalde → Cámara estatal → Senado estatal → gobernador → Cámara federal →
 * Senado federal → presidente. Cada cargo tiene su término, salario y poderes.
 */
(() => {
  "use strict";

  // Puede cargarse desde mods.js (código) o desde modloader.js (por defecto).
  // El guard evita que se enganche dos veces y duplique elecciones o acciones.
  if (window.FL_POLITICS || window.__FL_POLITICIAN_LOADING) return;
  window.__FL_POLITICIAN_LOADING = true;

  const T = (en, es, pt) => en;
  const CAREER = T("Political Career", "Carrera Política", "Carreira Política");
  const ICON = "special/politician.png";
  const E = (code) => `emoji/${code}.png`;
  const rnd = Math.random;
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const clampN = (v, a, b) => Math.max(a, Math.min(b, v));
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const money = (n) => (typeof usd === "function" ? usd(n) : "$" + Math.round(n).toLocaleString("en-US"));
  const year = () => state.birthYear + state.age;
  const MAX_ACTS = 4;
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const pickN = (arr, n) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a.slice(0, n);
  };

  // Partidos ficticios: evita meter nombres de partidos reales en el mod.
  const PARTIES = [
    { name: T("Unity Party", "Partido Unidad", "Partido Unidade"), icon: E("1f5f3-fe0f") },
    { name: T("Liberty Party", "Partido Libertad", "Partido Liberdade"), icon: E("1f5f3-fe0f") },
    { name: T("Independent", "Independiente", "Independente"), icon: E("1f4a5") },
  ];

  // Temas de campaña. Cada acción pide elegir uno; el tema cambia el resultado.
  const TOPICS = [
    { id: "environment", icon: E("1f30d"), t: T("Environment", "Medio Ambiente", "Meio Ambiente"), appeal: 1, risk: 1 },
    { id: "crime", icon: E("1f6a8"), t: T("Crime", "Crimen", "Crime"), appeal: 2, risk: 0 },
    { id: "corruption", icon: E("1f4b0"), t: T("Corruption", "Corrupción", "Corrupção"), appeal: 2, risk: 2 },
    { id: "economy", icon: E("1f4c8"), t: T("Economy", "Economía", "Economia"), appeal: 2, risk: 0 },
    { id: "education", icon: E("1f3eb"), t: T("Education", "Educación", "Educação"), appeal: 1, risk: 0 },
    { id: "healthcare", icon: E("1f3e5"), t: T("Healthcare", "Sanidad", "Saúde"), appeal: 1, risk: 0 },
    { id: "immigration", icon: E("1f6c2"), t: T("Immigration", "Inmigración", "Imigração"), appeal: 1, risk: 2 },
    { id: "infrastructure", icon: E("1f309"), t: T("Infrastructure", "Infraestructura", "Infraestrutura"), appeal: 1, risk: 0 },
    { id: "taxes", icon: E("1f4b8"), t: T("Taxes", "Impuestos", "Impostos"), appeal: 0, risk: 1 },
    { id: "housing", icon: E("1f3e0"), t: T("Housing", "Vivienda", "Moradia"), appeal: 1, risk: 1 },
    { id: "jobs", icon: E("1f4bc"), t: T("Employment", "Empleo", "Emprego"), appeal: 2, risk: 0 },
    { id: "rights", icon: E("2696-fe0f"), t: T("Civil Rights", "Derechos Civiles", "Direitos Civis"), appeal: 1, risk: 1 },
  ];
  const topicRows = (topic) => (topic ? [[T("Topic", "Tema", "Tema"), topic.t]] : []);
  const appealOf = (topic) => (topic ? topic.appeal || 0 : 0);
  const riskOf = (topic) => (topic ? topic.risk || 0 : 0);
  const campaignLabel = (p) => {
    const name = String(p.campaignName || "").trim();
    if (name) return name;
    const full = `${state.first || ""} ${typeof SURNAME !== "undefined" ? SURNAME : ""}`.trim();
    return full || T("My Campaign", "Mi campaña", "Minha campanha");
  };

  // ---------------------------------------------------------------- la escalera
  // pay = salario anual de referencia (se ajusta con wage() del juego).
  const OFFICES = [
    {
      t: T("School Board Member", "Miembro de la Junta Escolar", "Membro do Conselho Escolar"),
      icon: E("1f3eb"),
      pay: 18000,
      term: 4,
      age: 18,
      edu: "hs",
      branch: "leg",
      difficulty: 0,
      fundBase: 5000,
      campaignCost: 1200,
      minApproval: 40,
      emp: T("School District", "Distrito Escolar", "Distrito Escolar"),
      powers: [
        T("Set school policy", "Fijar la política escolar", "Definir a política escolar"),
        T("Approve the curriculum", "Aprobar el currículo", "Aprovar o currículo"),
        T("Hire the superintendent", "Contratar al superintendente", "Contratar o superintendente"),
      ],
      about: T(
        "The first rung. You run the local schools: policy, curriculum, budgets and the superintendent.",
        "El primer escalón. Manejas las escuelas locales: política, currículo, presupuesto y el superintendente.",
        "O primeiro degrau. Você comanda as escolas locais: política, currículo, orçamento e o superintendente.",
      ),
    },
    {
      t: T("City Councilor", "Concejal Municipal", "Vereador"),
      icon: E("1f3db-fe0f"),
      pay: 45000,
      term: 4,
      age: 21,
      edu: "hs",
      branch: "leg",
      difficulty: 2,
      fundBase: 15000,
      campaignCost: 3500,
      minApproval: 42,
      emp: T("City Hall", "Ayuntamiento", "Prefeitura"),
      powers: [
        T("Pass city ordinances", "Aprobar ordenanzas municipales", "Aprovar ordenanças municipais"),
        T("Approve the city budget", "Aprobar el presupuesto municipal", "Aprovar o orçamento municipal"),
        T("Decide zoning", "Decidir la zonificación", "Decidir o zoneamento"),
      ],
      about: T(
        "You legislate for the city: ordinances, the budget, zoning and oversight of city agencies.",
        "Legislas para la ciudad: ordenanzas, presupuesto, zonificación y vigilancia de las agencias municipales.",
        "Você legisla para a cidade: ordenanças, orçamento, zoneamento e fiscalização das agências municipais.",
      ),
    },
    {
      t: T("Mayor", "Alcalde", "Prefeito"),
      icon: E("1f3db-fe0f"),
      pay: 90000,
      term: 4,
      age: 25,
      edu: "uni",
      branch: "exec",
      difficulty: 5,
      fundBase: 40000,
      campaignCost: 10000,
      minApproval: 45,
      emp: T("City Hall", "Ayuntamiento", "Prefeitura"),
      powers: [
        T("Veto ordinances", "Vetar ordenanzas", "Vetar ordenanças"),
        T("Issue executive orders", "Emitir órdenes ejecutivas", "Emitir ordens executivas"),
        T("Appoint city officials", "Nombrar funcionarios municipales", "Nomear funcionários municipais"),
        T("Run the city budget", "Manejar el presupuesto municipal", "Comandar o orçamento municipal"),
      ],
      about: T(
        "The city's chief executive. You veto laws, issue orders, appoint officials and run the budget.",
        "El jefe ejecutivo de la ciudad. Vetas leyes, emites órdenes, nombras funcionarios y manejas el presupuesto.",
        "O chefe executivo da cidade. Você veta leis, emite ordens, nomeia funcionários e comanda o orçamento.",
      ),
    },
    {
      t: T("State Representative", "Representante Estatal", "Deputado Estadual"),
      icon: E("1f4dc"),
      pay: 70000,
      term: 2,
      age: 21,
      edu: "hs",
      branch: "leg",
      difficulty: 3,
      fundBase: 25000,
      campaignCost: 6000,
      minApproval: 44,
      emp: T("State Assembly", "Asamblea Estatal", "Assembleia Estadual"),
      powers: [
        T("File state bills", "Presentar proyectos estatales", "Apresentar projetos estaduais"),
        T("Vote on state laws", "Votar las leyes estatales", "Votar as leis estaduais"),
        T("Serve on committees", "Trabajar en comisiones", "Atuar em comissões"),
      ],
      about: T(
        "A state legislator. You file bills, vote on laws and use committees to shape the state budget.",
        "Legislador estatal. Presentas proyectos, votas leyes y usas las comisiones para moldear el presupuesto estatal.",
        "Legislador estadual. Você apresenta projetos, vota leis e usa comissões para moldar o orçamento estadual.",
      ),
    },
    {
      t: T("State Senator", "Senador Estatal", "Senador Estadual"),
      icon: E("1f4dc"),
      pay: 95000,
      term: 4,
      age: 25,
      edu: "uni",
      branch: "leg",
      difficulty: 6,
      fundBase: 50000,
      campaignCost: 15000,
      minApproval: 46,
      emp: T("State Senate", "Senado Estatal", "Senado Estadual"),
      powers: [
        T("File state bills", "Presentar proyectos estatales", "Apresentar projetos estaduais"),
        T("Vote on state laws", "Votar las leyes estatales", "Votar as leis estaduais"),
        T("Confirm appointments", "Confirmar nombramientos", "Confirmar nomeações"),
        T("Filibuster", "Hacer filibusterismo", "Fazer obstrução"),
      ],
      about: T(
        "The upper chamber of the state. You write laws, confirm appointments and can filibuster.",
        "La cámara alta del estado. Escribes leyes, confirmas nombramientos y puedes hacer filibusterismo.",
        "A câmara alta do estado. Você escreve leis, confirma nomeações e pode fazer obstrução.",
      ),
    },
    {
      t: T("Governor", "Gobernador", "Governador"),
      icon: E("1f3db-fe0f"),
      pay: 160000,
      term: 4,
      age: 30,
      edu: "uni",
      branch: "exec",
      difficulty: 9,
      fundBase: 120000,
      campaignCost: 40000,
      minApproval: 48,
      emp: T("State Capitol", "Capitolio Estatal", "Capitólio Estadual"),
      powers: [
        T("Veto state bills", "Vetar proyectos estatales", "Vetar projetos estaduais"),
        T("Issue executive orders", "Emitir órdenes ejecutivas", "Emitir ordens executivas"),
        T("Pardon convicts", "Indultar convictos", "Indultar condenados"),
        T("Appoint judges", "Nombrar jueces", "Nomear juízes"),
      ],
      about: T(
        "You run the state: veto bills, issue orders, command the budget, pardon convicts and appoint judges.",
        "Manejas el estado: vetas proyectos, emites órdenes, comandos el presupuesto, indultas convictos y nombras jueces.",
        "Você comanda o estado: veta projetos, emite ordens, comanda o orçamento, indulta condenados e nomeia juízes.",
      ),
    },
    {
      t: T("U.S. Representative", "Representante Federal", "Deputado Federal"),
      icon: E("1f5f3-fe0f"),
      pay: 174000,
      term: 2,
      age: 25,
      edu: "uni",
      branch: "leg",
      difficulty: 7,
      fundBase: 90000,
      campaignCost: 25000,
      minApproval: 46,
      emp: T("U.S. House", "Cámara de Representantes", "Câmara dos Deputados"),
      powers: [
        T("File federal bills", "Presentar proyectos federales", "Apresentar projetos federais"),
        T("Vote on federal laws", "Votar las leyes federales", "Votar as leis federais"),
        T("Serve on committees", "Trabajar en comisiones", "Atuar em comissões"),
        T("Vote on impeachment", "Votar el impeachment", "Votar o impeachment"),
      ],
      about: T(
        "A seat in the federal House. You write federal laws, control the budget and can impeach officials.",
        "Un escaño en la Cámara federal. Escribes leyes federales, controlas el presupuesto y puedes destituir funcionarios.",
        "Uma cadeira na Câmara federal. Você escreve leis federais, controla o orçamento e pode impugnar autoridades.",
      ),
    },
    {
      t: T("U.S. Senator", "Senador Federal", "Senador Federal"),
      icon: E("1f5f3-fe0f"),
      pay: 174000,
      term: 6,
      age: 30,
      edu: "uni",
      branch: "leg",
      difficulty: 11,
      fundBase: 200000,
      campaignCost: 60000,
      minApproval: 48,
      emp: T("U.S. Senate", "Senado Federal", "Senado Federal"),
      powers: [
        T("File federal bills", "Presentar proyectos federales", "Apresentar projetos federais"),
        T("Vote on federal laws", "Votar las leyes federales", "Votar as leis federais"),
        T("Confirm judges and cabinet picks", "Confirmar jueces y ministros", "Confirmar juízes e ministros"),
        T("Filibuster", "Hacer filibusterismo", "Fazer obstrução"),
      ],
      about: T(
        "The upper chamber of Congress. You confirm judges, ratify treaties, write laws and can filibuster.",
        "La cámara alta del Congreso. Confirmas jueces, ratificas tratados, escribes leyes y puedes hacer filibusterismo.",
        "A câmara alta do Congresso. Você confirma juízes, ratifica tratados, escreve leis e pode fazer obstrução.",
      ),
    },
    {
      t: T("President", "Presidente", "Presidente"),
      icon: E("1f454"),
      pay: 400000,
      term: 4,
      age: 35,
      edu: "uni",
      branch: "exec",
      difficulty: 14,
      fundBase: 500000,
      campaignCost: 150000,
      minApproval: 50,
      emp: T("The White House", "La Casa Blanca", "A Casa Branca"),
      powers: [
        T("Veto federal bills", "Vetar proyectos federales", "Vetar projetos federais"),
        T("Issue executive orders", "Emitir órdenes ejecutivas", "Emitir ordens executivas"),
        T("Pardon convicts", "Indultar convictos", "Indultar condenados"),
        T("Appoint Supreme Court justices", "Nombrar jueces de la Corte Suprema", "Nomear juízes da Suprema Corte"),
        T("Give the State of the Union", "Dar el Estado de la Unión", "Fazer o Discurso do Estado da União"),
      ],
      about: T(
        "The highest office. You sign or veto laws, issue orders, pardon convicts, appoint justices and command the armed forces.",
        "El cargo más alto. Firmas o vetas leyes, emites órdenes, indultas convictos, nombras jueces y comandos las fuerzas armadas.",
        "O cargo mais alto. Você assina ou veta leis, emite ordens, indulta condenados, nomeia juízes e comanda as forças armadas.",
      ),
    },
  ];

  // ---------------------------------------------------------------- estado
  function freshState() {
    return {
      v: 1,
      active: false,
      candidate: null,
      rank: 0,
      party: 0,
      approval: 50,
      funds: 0,
      termStart: null,
      termEnd: null,
      terms: 0,
      bills: 0,
      laws: 0,
      seek: null,
      yrs: 0,
      committee: 0,
      sotuYear: null,
      lastResult: null,
      majority: rnd() < 0.5 ? 0 : 1,
      campaignName: "",
      history: [],
      eventYear: null,
      eventPending: false,
      eventLog: [],
      yr: null,
    };
  }

  function P() {
    const p = (state.politics ||= {});
    if (!p.v) Object.assign(p, freshState());
    if (p.majority == null) p.majority = rnd() < 0.5 ? 0 : 1;
    if (typeof p.campaignName !== "string") p.campaignName = "";
    if (!Array.isArray(p.history)) p.history = [];
    if (!Array.isArray(p.eventLog)) p.eventLog = [];
    if (p.eventPending == null) p.eventPending = false;
    if (!p.yr || p.yr.age !== state.age) p.yr = { age: state.age, acts: 0 };
    return p;
  }

  const currentOffice = (p) => OFFICES[p.active ? p.rank : p.candidate ? p.candidate.rank : 0];
  const officeSalary = (o) => Math.round(typeof wage === "function" ? wage(o.pay) : o.pay);
  const isElectionSeason = (p) => (p.candidate ? true : p.active && p.termEnd != null && year() >= p.termEnd - 1);

  // ---------------------------------------------------------------- efectos
  function recordHistory(p, kind, title, detail) {
    if (!p || !title) return;
    if (!Array.isArray(p.history)) p.history = [];
    p.history.push({ year: year(), kind, title, detail: detail || "" });
    if (p.history.length > 80) p.history.splice(0, p.history.length - 80);
  }

  function fx(p, f) {
    const rows = [];
    const sign = (n) => (n > 0 ? "+" : "") + Math.round(n);
    if (f.money) {
      const m = Math.round(f.money);
      state.money += m;
      if (m > 0 && typeof chaChing === "function") chaChing();
      rows.push([T("Money", "Dinero", "Dinheiro"), `${m > 0 ? "+" : "-"}${money(Math.abs(m))}`]);
    }
    if (f.funds) {
      const before = p.funds || 0;
      p.funds = Math.max(0, before + f.funds);
      const d = p.funds - before;
      if (d) rows.push([T("Campaign funds", "Fondos de campaña", "Fundos de campanha"), `${d > 0 ? "+" : "-"}${money(Math.abs(d))}`]);
    }
    if (f.approval) {
      const before = p.approval;
      p.approval = clampN(p.approval + f.approval, 0, 100);
      if (p.approval !== before) rows.push([T("Approval", "Aprobación", "Aprovação"), `${sign(p.approval - before)}%`]);
    }
    if (f.happiness) {
      const before = state.stats.Happiness ?? 50;
      state.stats.Happiness = clampN(before + f.happiness, 0, 100);
      if (state.stats.Happiness !== before) rows.push([T("Happiness", "Felicidad", "Felicidade"), sign(state.stats.Happiness - before)]);
      if (typeof renderStats === "function") renderStats();
    }
    if (f.laws) {
      p.laws = (p.laws || 0) + f.laws;
      rows.push([T("Laws passed", "Leyes aprobadas", "Leis aprovadas"), p.laws]);
      if (f.lawTitle) recordHistory(p, "law", f.lawTitle, f.lawDetail);
    }
    if (f.bills) {
      p.bills = (p.bills || 0) + f.bills;
      rows.push([T("Bills filed", "Proyectos presentados", "Projetos apresentados"), p.bills]);
    }
    return rows;
  }

  function card(title, lead, rows, after) {
    jCard({
      tag: CAREER,
      iconSrc: ICON,
      title,
      lead,
      rows,
      choices: [[T("OK", "Listo", "Certo"), after || openPolitics]],
    });
  }

  // ---------------------------------------------------------------- temas y campaña
  function chooseTopic(a, p, o) {
    const topics = pickN(TOPICS, 3);
    jCard({
      tag: CAREER,
      iconSrc: a.icon,
      title: T("Choose a Topic", "Elige un tema", "Escolha um tema"),
      lead: a.ask || T("What will you focus on?", "¿En qué te vas a enfocar?", "Em que você vai se concentrar?"),
      rows: [[T("Action", "Acción", "Ação"), a.t]],
      choices: topics.map((topic) => [
        topic.t,
        () => {
          if (!a.free) p.yr.acts++;
          if (typeof play === "function") play("choice");
          a.run(p, o, topic);
        },
      ]),
    });
  }

  function campaignNameCard(p, next) {
    const current = campaignLabel(p);
    ev.innerHTML =
      `<div class="jm-tag" style="margin-top:12px">${CAREER}</div>` +
      `<h4><img src="${ICON}" alt=""><span>${T("Name Your Campaign", "Ponle nombre a tu campaña", "Dê um nome à sua campanha")}</span></h4>` +
      `<div class="lead">${T("This is the name voters will see on the ballot and in the news.", "Este es el nombre que los votantes verán en la papeleta y en las noticias.", "Este é o nome que os eleitores verão na cédula e nas notícias.")}</div>` +
      `<label class="hr-lab">${T("Campaign name:", "Nombre de la campaña:", "Nome da campanha:")}</label>` +
      `<div class="hr-sel"><input id="pCampName" maxlength="32" autocomplete="off" spellcheck="false" style="width:100%;padding:9px 11px;border-radius:10px;border:1px solid #c8d1dc;font:inherit;color:#24313f"></div>` +
      `<button class="jm-apply ev-btn" id="pCampGo">${T("Use this name", "Usar este nombre", "Usar este nome")}</button>`;
    ev.style.overflow = "visible";
    evWrap.classList.add("open");
    const input = document.getElementById("pCampName");
    input.value = current;
    const go = () => {
      const v = input.value.trim().slice(0, 32);
      p.campaignName = v || current;
      evWrap.classList.remove("open");
      ev.style.overflow = "";
      if (typeof play === "function") play("choice");
      next();
    };
    document.getElementById("pCampGo").onclick = go;
    input.onkeydown = (e) => {
      if (e.key === "Enter") go();
    };
    setTimeout(() => {
      try {
        input.focus();
        input.select();
      } catch {}
    }, 60);
  }

  function selfFundCard(p) {
    const max = Math.max(0, Math.floor(state.money || 0));
    if (max <= 0) return notice(CAREER, T("You don't have any personal money to put into the campaign.", "No tienes dinero personal para poner en la campaña.", "Você não tem dinheiro pessoal para colocar na campanha."), null, true);
    const amounts = [500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000].filter((n) => n < max);
    amounts.push(max);
    const opts = [...new Set(amounts)].sort((a, b) => a - b);
    socSelCard({
      tag: CAREER,
      icon: ICON,
      title: T("Add Personal Funds", "Añadir fondos personales", "Adicionar fundos pessoais"),
      lead: `${T("Personal money", "Dinero personal", "Dinheiro pessoal")}: ${money(max)}`,
      label: T("Amount to transfer:", "Cantidad a transferir:", "Valor a transferir:"),
      opts: opts.map((n) => money(n)),
      btn: T("Transfer to campaign", "Transferir a la campaña", "Transferir para a campanha"),
      onGo: (i) => {
        const amount = opts[i] || 0;
        if (amount <= 0 || amount > (state.money || 0)) return notice(CAREER, T("You don't have that much personal money.", "No tienes tanto dinero personal.", "Você não tem tanto dinheiro pessoal."), null, true);
        const rows = fx(p, { money: -amount, funds: amount });
        card(T("Campaign Funded", "Campaña financiada", "Campanha financiada"), T("You moved your own money into the campaign.", "Moviste tu propio dinero a la campaña.", "Você moveu seu próprio dinheiro para a campanha."), rows);
      },
    });
  }

  // ---------------------------------------------------------------- elecciones
  function opponent(p) {
    const first = ["Alan", "Barbara", "Curtis", "Diana", "Edward", "Gloria", "Harold", "Irene", "James", "Karen", "Louis", "Martha", "Norman", "Olivia", "Peter", "Rosa", "Samuel", "Teresa", "Victor", "Wendy"];
    const last = ["Bennett", "Caldwell", "Dalton", "Everett", "Foster", "Gaines", "Holloway", "Ingram", "Jennings", "Keller", "Lawson", "Mercer", "Norris", "Osborne", "Pruitt", "Quintero", "Reeves", "Sutton", "Thornton", "Vargas"];
    const party = p.party === 0 ? 1 : p.party === 1 ? 0 : pick([0, 1]);
    return { name: `${pick(first)} ${pick(last)}`, party: PARTIES[party].name };
  }

  function electionShare(rank, incumbent, p) {
    const o = OFFICES[rank];
    const approval = (p.approval - 50) * 0.6;
    const funds = Math.min(14, Math.sqrt(Math.max(0, p.funds || 0) / o.fundBase) * 4);
    const charisma = (((state.stats.Looks ?? 50) + (state.stats.Smarts ?? 50)) / 2 - 50) * 0.2;
    const party = p.party === 2 ? 1 : p.party === p.majority ? 1 : 0;
    const inc = incumbent ? 4 : 0;
    const noise = ri(-9, 9);
    return clampN(Math.round(50 + approval + funds + charisma + party + inc + noise - o.difficulty), 15, 88);
  }

  function takeOffice(p, rank) {
    const o = OFFICES[rank];
    const same = p.active && p.rank === rank;
    p.active = true;
    p.candidate = null;
    p.rank = rank;
    p.termStart = year();
    p.termEnd = year() + o.term;
    p.terms = same ? (p.terms || 0) + 1 : 1;
    p.seek = null;
    p.committee = 0;
    p.sotuYear = null;
    p.approval = clampN(p.approval + 5, 0, 100);
    p.yrs = 0;
    state.job = {
      t: o.t,
      c: "Government",
      emp: o.emp,
      pay: officeSalary(o),
      icon: o.icon,
      politician: true,
      perf: p.approval,
      yrs: 0,
    };
    if (typeof renderStats === "function") renderStats();
  }

  function leaveOffice(p, reason) {
    p.active = false;
    p.candidate = null;
    p.seek = null;
    p.termEnd = null;
    p.lastResult = reason;
    if (state.job && state.job.politician) state.job = null;
  }

  function resolveElection(rank) {
    const p = P();
    const o = OFFICES[rank];
    const incumbent = p.active && p.rank === rank;
    const share = electionShare(rank, incumbent, p);
    const opp = opponent(p);
    const win = share >= 50;
    const rows = [
      [T("Political office", "Cargo político", "Cargo político"), o.t],
      [T("Campaign", "Campaña", "Campanha"), esc(campaignLabel(p))],
      [T("Your share", "Tu porcentaje", "Sua porcentagem"), `${share}%`],
      [T("Opponent", "Rival", "Rival"), `${opp.name} (${opp.party})`],
      [T("Opponent share", "Porcentaje del rival", "Porcentagem do rival"), `${100 - share}%`],
    ];
    if (win) {
      takeOffice(p, rank);
      rows.push([T("Result", "Resultado", "Resultado"), T("You won!", "¡Ganaste!", "Você venceu!")]);
      say(`${T("I won the election for", "Gané la elección para", "Venci a eleição para")} ${o.t}.`);
    } else {
      leaveOffice(p, "lost");
      p.approval = clampN(p.approval - 6, 0, 100);
      rows.push([T("Result", "Resultado", "Resultado"), T("You lost.", "Perdiste.", "Você perdeu.")]);
      say(`${T("I lost the election for", "Perdí la elección para", "Perdi a eleição para")} ${o.t}.`);
    }
    return { o, share, opp, win, rows };
  }

  function showElection(res) {
    jCard({
      tag: CAREER,
      iconSrc: E("1f5f3-fe0f"),
      title: T("Election Night", "Noche de Elecciones", "Noite de Eleições"),
      lead: res.win
        ? T("The results are in. You won.", "Ya salieron los resultados. Ganaste.", "Os resultados saíram. Você venceu.")
        : T("The results are in. You lost.", "Ya salieron los resultados. Perdiste.", "Os resultados saíram. Você perdeu."),
      rows: res.rows,
      choices: [[T("OK", "Listo", "Certo"), openPolitics]],
    });
  }

  // ---------------------------------------------------------------- acciones
  const ACTIONS = [
    {
      id: "speech",
      icon: E("1f3a4"),
      t: T("Give a Speech", "Dar un discurso", "Fazer um discurso"),
      s: T("Win over the crowd", "Ganarte al público", "Conquistar o público"),
      ask: T("What will your speech be about?", "¿Sobre qué va a ser tu discurso?", "Sobre o que será seu discurso?"),
      run(p, o, topic) {
        const bad = rnd() < 0.1 + riskOf(topic) * 0.02;
        if (bad) {
          const rows = [...topicRows(topic), ...fx(p, { approval: -ri(3, 7) })];
          card(T("A Bad Speech", "Un mal discurso", "Um discurso ruim"), T("You stumbled over your words and the clip went viral for the wrong reason.", "Te trabaste y el clip se hizo viral por la razón equivocada.", "Você tropeçou nas palavras e o clipe viralizou pelo motivo errado."), rows);
        } else {
          const rows = [...topicRows(topic), ...fx(p, { approval: ri(2, 6) + appealOf(topic), happiness: 1 })];
          card(T("Give a Speech", "Dar un discurso", "Fazer um discurso"), T("You gave a strong speech and the room applauded.", "Diste un discurso fuerte y la sala aplaudió.", "Você fez um discurso forte e a sala aplaudiu."), rows);
        }
      },
    },
    {
      id: "townhall",
      icon: E("1f91d"),
      t: T("Town Hall", "Audiencia pública", "Assembleia pública"),
      s: T("Meet your constituents", "Conoce a tus votantes", "Encontre seus eleitores"),
      ask: T("What will you hear from constituents about?", "¿Sobre qué te van a hablar tus votantes?", "Sobre o que seus eleitores vão falar?"),
      run(p, o, topic) {
        const rows = [...topicRows(topic), ...fx(p, { approval: ri(1, 4) + appealOf(topic), happiness: 2 })];
        card(T("Town Hall", "Audiencia pública", "Assembleia pública"), T("You listened to complaints about potholes, schools and taxes. People felt heard.", "Escuchaste quejas sobre baches, escuelas e impuestos. La gente se sintió escuchada.", "Você ouviu reclamações sobre buracos, escolas e impostos. As pessoas se sentiram ouvidas."), rows);
      },
    },
    {
      id: "fundraise",
      icon: E("1f4b0"),
      t: T("Fundraiser", "Recaudar fondos", "Arrecadar fundos"),
      s: T("Fill the campaign war chest", "Llenar la caja de campaña", "Encher o caixa de campanha"),
      ask: T("What will you pitch to donors?", "¿Qué les vas a vender a los donantes?", "O que você vai apresentar aos doadores?"),
      run(p, o, topic) {
        const raised = Math.round(o.fundBase * (0.7 + rnd() * 0.6 + appealOf(topic) * 0.05));
        const rows = [...topicRows(topic), ...fx(p, { funds: raised, approval: -ri(0, 2) })];
        card(T("Fundraiser", "Recaudar fondos", "Arrecadar fundos"), T("Donors wrote checks. Some of them will expect favors later.", "Los donantes firmaron cheques. Algunos van a esperar favores después.", "Os doadores assinaram cheques. Alguns vão esperar favores depois."), rows);
      },
    },
    {
      id: "press",
      icon: E("1f4e3"),
      t: T("Press Interview", "Entrevista de prensa", "Entrevista à imprensa"),
      s: T("Face the media", "Enfrenta a los medios", "Enfrente a mídia"),
      ask: T("What will you talk about in the interview?", "¿De qué vas a hablar en la entrevista?", "Sobre o que você vai falar na entrevista?"),
      run(p, o, topic) {
        const good = rnd() < 0.55 + appealOf(topic) * 0.03 - riskOf(topic) * 0.03;
        if (good) {
          const rows = [...topicRows(topic), ...fx(p, { approval: ri(2, 6) + appealOf(topic) })];
          card(T("Press Interview", "Entrevista de prensa", "Entrevista à imprensa"), T("You handled the questions well and the headline was friendly.", "Manejaste las preguntas bien y el titular fue amistoso.", "Você lidou bem com as perguntas e a manchete foi amigável."), rows);
        } else {
          const rows = [...topicRows(topic), ...fx(p, { approval: -ri(2, 7) })];
          card(T("Press Interview", "Entrevista de prensa", "Entrevista à imprensa"), T("You got defensive and the interviewer kept pressing. It looked bad.", "Te pusiste a la defensiva y el entrevistador siguió presionando. Se vio mal.", "Você ficou na defensiva e o entrevistador continuou pressionando. Ficou feio."), rows);
        }
      },
    },
    {
      id: "rally",
      icon: E("1f4e2"),
      t: T("Campaign Rally", "Mitin de campaña", "Comício de campanha"),
      s: T("Spend campaign funds to fire up voters", "Gasta fondos para encender a los votantes", "Gaste fundos para animar os eleitores"),
      ask: T("What will your rally focus on?", "¿En qué se va a enfocar tu mitin?", "Em que seu comício vai se concentrar?"),
      run(p, o, topic) {
        const cost = o.campaignCost;
        if ((p.funds || 0) < cost) {
          const rows = [...topicRows(topic), ...fx(p, { approval: 1 })];
          return card(T("Campaign Rally", "Mitin de campaña", "Comício de campanha"), T("You couldn't afford a real rally. A few volunteers still showed up.", "No te alcanzó para un mitin de verdad. Igual llegaron unos voluntarios.", "Você não tinha dinheiro para um comício de verdade. Alguns voluntários apareceram."), rows);
        }
        const rows = [...topicRows(topic), ...fx(p, { funds: -cost, approval: ri(4, 9) + appealOf(topic), happiness: 1 })];
        card(T("Campaign Rally", "Mitin de campaña", "Comício de campanha"), T("The rally was packed. Your name is on everyone's lips.", "El mitin se llenó. Tu nombre está en boca de todos.", "O comício lotou. Seu nome está na boca de todos."), rows);
      },
    },
    {
      id: "debate",
      icon: E("1f3a4"),
      t: T("Debate Your Opponent", "Debatir con tu rival", "Debater com seu rival"),
      s: T("High risk, high reward", "Mucho riesgo, mucha recompensa", "Muito risco, muita recompensa"),
      topic: false,
      when: (p) => isElectionSeason(p),
      run(p) {
        startDebate(p);
      },
    },
    {
      id: "poll",
      icon: E("1f4ca"),
      free: true,
      topic: false,
      t: T("Check the Polls", "Ver las encuestas", "Ver as pesquisas"),
      s: T("See where you stand", "Mira cómo vas", "Veja como você está"),
      run(p) {
        const target = p.active ? (p.seek != null ? p.seek : p.rank) : p.candidate.rank;
        const share = electionShare(target, p.active && p.rank === target, p);
        const rows = [
          [T("Political office", "Cargo político", "Cargo político"), OFFICES[target].t],
          [T("Projected share", "Porcentaje proyectado", "Porcentagem projetada"), `${share}%`],
          [T("Approval", "Aprobación", "Aprovação"), `${p.approval}%`],
          [T("Campaign funds", "Fondos de campaña", "Fundos de campanha"), money(p.funds || 0)],
        ];
        card(T("The Polls", "Las encuestas", "As pesquisas"), T("Polls are a snapshot, not a prophecy. Campaigning still matters.", "Las encuestas son una foto, no una profecía. La campaña todavía importa.", "As pesquisas são uma foto, não uma profecia. A campanha ainda importa."), rows);
      },
    },
    {
      id: "bill",
      icon: E("1f4dc"),
      branch: "leg",
      t: T("File a Bill", "Presentar un proyecto", "Apresentar um projeto"),
      s: T("Write a law and fight for it", "Escribe una ley y pelea por ella", "Escreva uma lei e lute por ela"),
      ask: T("What should your bill focus on?", "¿En qué se debe enfocar tu proyecto?", "Em que seu projeto deve se concentrar?"),
      run(p, o, topic) {
        const rows = [...topicRows(topic), ...fx(p, { bills: 1 })];
        const bonus = p.committee ? 0.15 : 0;
        p.committee = 0;
        const pass = 0.35 + p.approval / 250 + (p.party === 2 ? 0 : p.party === p.majority ? 0.1 : -0.05) + bonus + appealOf(topic) * 0.02 - riskOf(topic) * 0.02;
        if (rnd() < pass) {
          rows.push(...fx(p, { laws: 1, approval: ri(2, 6), lawTitle: T("Bill", "Proyecto", "Projeto"), lawDetail: topic ? topic.t : "" }));
          card(T("Bill Passed", "Proyecto aprobado", "Projeto aprovado"), T("Your bill made it through. Your name is on a real law now.", "Tu proyecto pasó. Tu nombre está en una ley de verdad.", "Seu projeto passou. Seu nome está numa lei de verdade."), rows);
        } else {
          rows.push(...fx(p, { approval: -ri(0, 3) }));
          card(T("Bill Failed", "Proyecto rechazado", "Projeto rejeitado"), T("The bill died in committee. You'll need more support next time.", "El proyecto murió en comisión. Vas a necesitar más apoyo la próxima vez.", "O projeto morreu na comissão. Você vai precisar de mais apoio na próxima vez."), rows);
        }
      },
    },
    {
      id: "vote",
      icon: E("1f5f3-fe0f"),
      branch: "leg",
      t: T("Vote on a Bill", "Votar un proyecto", "Votar um projeto"),
      s: T("Take a side on the floor", "Toma partido en el pleno", "Tome partido no plenário"),
      ask: T("What is the bill about?", "¿De qué trata el proyecto?", "Sobre o que é o projeto?"),
      run(p, o, topic) {
        jCard({
          tag: CAREER,
          iconSrc: ICON,
          title: T("Vote on a Bill", "Votar un proyecto", "Votar um projeto"),
          lead: T("A controversial bill is on the floor. Your vote will be remembered.", "Hay un proyecto controvertido en el pleno. Tu voto se va a recordar.", "Há um projeto polêmico no plenário. Seu voto será lembrado."),
          rows: [...topicRows(topic), [T("Bill", "Proyecto", "Projeto"), T("Omnibus Reform Act", "Ley de Reforma Ómnibus", "Lei de Reforma Abrangente")]],
          choices: [
            [T("Vote Yes", "Votar sí", "Votar sim"), () => {
              const rows = [...topicRows(topic), ...fx(p, { approval: ri(1, 5) + Math.round(appealOf(topic) / 2), laws: 1, lawTitle: T("Omnibus Reform Act", "Ley de Reforma Ómnibus", "Lei de Reforma Abrangente"), lawDetail: topic ? topic.t : "" })];
              card(T("Vote on a Bill", "Votar un proyecto", "Votar um projeto"), T("You voted yes. Your allies are happy, your opponents are not.", "Votaste sí. Tus aliados están contentos, tus opositores no.", "Você votou sim. Seus aliados estão felizes, seus opositores não."), rows);
            }],
            [T("Vote No", "Votar no", "Votar não"), () => {
              const rows = [...topicRows(topic), ...fx(p, { approval: -ri(1, 4), happiness: 1 })];
              card(T("Vote on a Bill", "Votar un proyecto", "Votar um projeto"), T("You voted no. Some people call it principle, others call it obstruction.", "Votaste no. Unos lo llaman principio, otros lo llaman obstrucción.", "Você votou não. Alguns chamam de princípio, outros de obstrução."), rows);
            }],
          ],
        });
      },
    },
    {
      id: "committee",
      icon: E("1f3db-fe0f"),
      branch: "leg",
      t: T("Committee Hearing", "Audiencia en comisión", "Audiência na comissão"),
      s: T("Build support for your next bill", "Construye apoyo para tu próximo proyecto", "Construa apoio para seu próximo projeto"),
      ask: T("What will the hearing focus on?", "¿En qué se va a enfocar la audiencia?", "Em que a audiência vai se concentrar?"),
      run(p, o, topic) {
        p.committee = 1;
        const rows = [...topicRows(topic), ...fx(p, { approval: ri(0, 3) + appealOf(topic) })];
        card(T("Committee Hearing", "Audiencia en comisión", "Audiência na comissão"), T("You questioned witnesses and made your case. Your next bill has a better shot.", "Interrogaste testigos y defendiste tu caso. Tu próximo proyecto tiene mejor chance.", "Você questionou testemunhas e defendeu seu caso. Seu próximo projeto tem mais chance."), rows);
      },
    },
    {
      id: "filibuster",
      icon: E("1f4e2"),
      branch: "leg",
      when: (p) => p.rank === 4 || p.rank === 7,
      t: T("Filibuster", "Filibusterismo", "Obstrução"),
      s: T("Block a bill with your voice", "Bloquea un proyecto con tu voz", "Bloqueie um projeto com sua voz"),
      ask: T("What will you speak about?", "¿Sobre qué vas a hablar?", "Sobre o que você vai falar?"),
      run(p, o, topic) {
        const rows = [...topicRows(topic), ...fx(p, { approval: -ri(1, 4), happiness: -1 })];
        card(T("Filibuster", "Filibusterismo", "Obstrução"), T("You held the floor for hours. The bill is stalled, and the cameras loved it.", "Te quedaste con la palabra por horas. El proyecto quedó estancado, y las cámaras lo amaron.", "Você segurou o plenário por horas. O projeto parou, e as câmeras adoraram."), rows);
      },
    },
    {
      id: "veto",
      icon: E("1f6e1-fe0f"),
      branch: "exec",
      when: (p) => p.rank >= 2,
      t: T("Veto a Bill", "Vetar un proyecto", "Vetar um projeto"),
      s: T("Kill a law you oppose", "Mata una ley que te opones", "Mate uma lei que você se opõe"),
      ask: T("What is the bill about?", "¿De qué trata el proyecto?", "Sobre o que é o projeto?"),
      run(p, o, topic) {
        jCard({
          tag: CAREER,
          iconSrc: ICON,
          title: T("Veto a Bill", "Vetar un proyecto", "Vetar um projeto"),
          lead: T("The legislature passed a bill you don't like. You can veto it or sign it.", "La legislatura aprobó un proyecto que no te gusta. Puedes vetarlo o firmarlo.", "A legislatura aprovou um projeto que você não gosta. Você pode vetar ou assinar."),
          rows: topicRows(topic),
          choices: [
            [T("Veto it", "Vetarlo", "Vetar"), () => {
              const rows = [...topicRows(topic), ...fx(p, { approval: -ri(1, 4), happiness: 1 })];
              card(T("Vetoed", "Vetado", "Vetado"), T("You vetoed the bill. Your base cheered; the other side called you a tyrant.", "Vetaste el proyecto. Tu base celebró; el otro lado te llamó tirano.", "Você vetou o projeto. Sua base comemorou; o outro lado chamou você de tirano."), rows);
            }],
            [T("Sign it", "Firmarlo", "Assinar"), () => {
              const rows = [...topicRows(topic), ...fx(p, { approval: ri(1, 4), laws: 1, lawTitle: T("Omnibus Reform Act", "Ley de Reforma Ómnibus", "Lei de Reforma Abrangente"), lawDetail: topic ? topic.t : "" })];
              card(T("Signed", "Firmado", "Assinado"), T("You signed the bill into law. Compromise is rarely popular with everyone.", "Firmaste el proyecto como ley. El compromiso rara vez es popular con todos.", "Você assinou o projeto como lei. O compromisso raramente agrada a todos."), rows);
            }],
          ],
        });
      },
    },
    {
      id: "order",
      icon: E("1f4dc"),
      branch: "exec",
      when: (p) => p.rank >= 2,
      t: T("Executive Order", "Orden ejecutiva", "Ordem executiva"),
      s: T("Act without the legislature", "Actúa sin la legislatura", "Aja sem a legislatura"),
      ask: T("What will your order do?", "¿Qué va a hacer tu orden?", "O que sua ordem vai fazer?"),
      run(p, o, topic) {
        if (rnd() < 0.65 + appealOf(topic) * 0.02 - riskOf(topic) * 0.02) {
          const rows = [...topicRows(topic), ...fx(p, { laws: 1, approval: ri(1, 4), lawTitle: T("Executive Order", "Orden ejecutiva", "Ordem executiva"), lawDetail: topic ? topic.t : "" })];
          card(T("Executive Order", "Orden ejecutiva", "Ordem executiva"), T("You signed an order and it took effect immediately. Your supporters loved the speed.", "Firmaste una orden y entró en vigor de inmediato. Tus seguidores amaron la rapidez.", "Você assinou uma ordem e ela entrou em vigor imediatamente. Seus apoiadores adoraram a rapidez."), rows);
        } else {
          const rows = [...topicRows(topic), ...fx(p, { approval: -ri(2, 6) })];
          card(T("Executive Order", "Orden ejecutiva", "Ordem executiva"), T("Critics called it an abuse of power. The courts may get involved.", "Los críticos lo llamaron abuso de poder. Los tribunales podrían meterse.", "Os críticos chamaram de abuso de poder. Os tribunais podem se envolver."), rows);
        }
      },
    },
    {
      id: "appoint",
      icon: E("1f91d"),
      branch: "exec",
      when: (p) => p.rank >= 2,
      t: T("Appoint an Official", "Nombrar un funcionario", "Nomear um funcionário"),
      s: T("Put your people in power", "Pon a tu gente en el poder", "Coloque sua gente no poder"),
      ask: T("What policy area will your appointee handle?", "¿Qué área política va a manejar tu nombrado?", "Qual área política seu nomeado vai cuidar?"),
      run(p, o, topic) {
        const cost = Math.round(o.campaignCost * 0.25);
        if (state.money < cost) {
          return notice(CAREER, T("You don't have enough money for the appointments and favors this requires.", "No tienes suficiente dinero para los nombramientos y favores que esto requiere.", "Você não tem dinheiro suficiente para as nomeações e favores que isso exige."), null, true);
        }
        const rows = [...topicRows(topic), ...fx(p, { money: -cost, approval: ri(1, 4) + Math.round(appealOf(topic) / 2) })];
        card(T("Appoint an Official", "Nombrar un funcionario", "Nomear um funcionário"), T("You appointed a loyal ally. They'll remember who gave them the job.", "Nombraste a un aliado leal. Van a recordar quién les dio el puesto.", "Você nomeou um aliado leal. Eles vão lembrar quem lhes deu o cargo."), rows);
      },
    },
    {
      id: "pardon",
      icon: E("2696-fe0f"),
      branch: "exec",
      when: (p) => p.rank >= 5,
      t: T("Pardon a Convict", "Indultar a un convicto", "Indultar um condenado"),
      s: T("Use your clemency power", "Usa tu poder de clemencia", "Use seu poder de clemência"),
      ask: T("What is the clemency case about?", "¿De qué trata el caso de clemencia?", "Sobre o que é o caso de clemência?"),
      run(p, o, topic) {
        if (rnd() < 0.12) {
          const rows = [...topicRows(topic), ...fx(p, { approval: -ri(6, 12) })];
          card(T("Pardon Scandal", "Escándalo de indulto", "Escândalo de indulto"), T("The person you pardoned was connected to a donor. The press is digging.", "La persona que indultaste estaba conectada a un donante. La prensa está investigando.", "A pessoa que você indultou estava ligada a um doador. A imprensa está investigando."), rows);
        } else {
          const rows = [...topicRows(topic), ...fx(p, { approval: -ri(1, 4), happiness: 2 })];
          card(T("Pardon a Convict", "Indultar a un convicto", "Indultar um condenado"), T("You granted clemency. Someone got a second chance, and someone else is angry.", "Concediste clemencia. Alguien tuvo una segunda oportunidad, y alguien más está enojado.", "Você concedeu clemência. Alguém ganhou uma segunda chance, e outra pessoa está furiosa."), rows);
        }
      },
    },
    {
      id: "budget",
      icon: E("1f4b8"),
      branch: "exec",
      when: (p) => p.rank >= 2,
      t: T("Present a Budget", "Presentar un presupuesto", "Apresentar um orçamento"),
      s: T("Put your priorities in the numbers", "Pon tus prioridades en los números", "Coloque suas prioridades nos números"),
      ask: T("What will your budget prioritize?", "¿Qué va a priorizar tu presupuesto?", "O que seu orçamento vai priorizar?"),
      run(p, o, topic) {
        const rows = [...topicRows(topic), ...fx(p, { approval: ri(1, 5) + appealOf(topic), happiness: 1 })];
        card(T("Budget", "Presupuesto", "Orçamento"), T("Your budget passed. Every number is a political choice, and everyone noticed.", "Tu presupuesto pasó. Cada número es una decisión política, y todos lo notaron.", "Seu orçamento passou. Cada número é uma escolha política, e todos notaram."), rows);
      },
    },
    {
      id: "sotu",
      icon: E("1f3a4"),
      branch: "exec",
      when: (p) => p.rank === 8 && p.sotuYear !== year(),
      t: T("State of the Union", "Estado de la Unión", "Estado da União"),
      s: T("Address the nation once a year", "Habla al país una vez al año", "Fale à nação uma vez por ano"),
      ask: T("What will be the centerpiece of your speech?", "¿Cuál será el tema central de tu discurso?", "Qual será o tema central do seu discurso?"),
      run(p, o, topic) {
        p.sotuYear = year();
        const rows = [...topicRows(topic), ...fx(p, { approval: ri(3, 8) + appealOf(topic), happiness: 2 })];
        card(T("State of the Union", "Estado de la Unión", "Estado da União"), T("You stood before Congress and the country. The speech will be replayed for years.", "Te paraste frente al Congreso y al país. El discurso se va a repetir por años.", "Você ficou diante do Congresso e do país. O discurso será reprisado por anos."), rows);
      },
    },
  ];

  // ---------------------------------------------------------------- eventos anuales y debate
  function eventResult(p, title, lead, effects) {
    const rows = fx(p, effects || {});
    card(title, lead, rows);
  }

  const evChoice = (label, title, lead, effects) => ({
    t: label,
    run(p) {
      eventResult(p, title, lead, effects);
    },
  });

  const DEBATE_QUESTIONS = [
    {
      t: T("Jobs and the Economy", "Empleo y Economía", "Emprego e Economia"),
      q: T("What is your plan to create good-paying jobs?", "¿Cuál es tu plan para crear empleos bien pagados?", "Qual é seu plano para criar empregos bem remunerados?"),
      a: [
        { t: T("Invest in small businesses and job training.", "Invertir en pequeñas empresas y capacitación laboral.", "Investir em pequenas empresas e capacitação profissional."), s: 3 },
        { t: T("Cut taxes for the wealthy and wait for it to trickle down.", "Bajar impuestos a los ricos y esperar que gotee.", "Cortar impostos dos ricos e esperar que escorram."), s: 1 },
        { t: T("Jobs are a state issue, not my problem.", "El empleo es un tema estatal, no mi problema.", "Emprego é uma questão estadual, não meu problema."), s: 0 },
      ],
    },
    {
      t: T("Environment", "Medio Ambiente", "Meio Ambiente"),
      q: T("How will you address climate change?", "¿Cómo vas a enfrentar el cambio climático?", "Como você vai enfrentar as mudanças climáticas?"),
      a: [
        { t: T("Clean energy investments and stricter pollution rules.", "Inversión en energía limpia y reglas de contaminación más estrictas.", "Investimento em energia limpa e regras de poluição mais rígidas."), s: 3 },
        { t: T("Climate rules kill jobs, so I will weaken them.", "Las reglas climáticas matan empleos, así que las voy a debilitar.", "Regras climáticas matam empregos, então vou enfraquecê-las."), s: 1 },
        { t: T("I don't believe the science.", "No creo en la ciencia.", "Não acredito na ciência."), s: 0 },
      ],
    },
    {
      t: T("Crime", "Crimen", "Crime"),
      q: T("What will you do about violent crime?", "¿Qué vas a hacer con el crimen violento?", "O que você vai fazer com o crime violento?"),
      a: [
        { t: T("Fund police and prevention programs together.", "Financiar a la policía y los programas de prevención juntos.", "Financiar a polícia e programas de prevenção juntos."), s: 3 },
        { t: T("Build more prisons and cut everything else.", "Construir más prisiones y recortar todo lo demás.", "Construir mais prisões e cortar todo o resto."), s: 1 },
        { t: T("Blame the other party.", "Culpar al otro partido.", "Culpar o outro partido."), s: 0 },
      ],
    },
    {
      t: T("Corruption", "Corrupción", "Corrupção"),
      q: T("A donor is under investigation. What will you do?", "Un donante está bajo investigación. ¿Qué vas a hacer?", "Um doador está sob investigação. O que você vai fazer?"),
      a: [
        { t: T("Return the money and cooperate fully.", "Devolver el dinero y cooperar totalmente.", "Devolver o dinheiro e cooperar plenamente."), s: 3 },
        { t: T("Deny everything and attack the press.", "Negarlo todo y atacar a la prensa.", "Negar tudo e atacar a imprensa."), s: 0 },
        { t: T("Say the investigation is a partisan witch hunt.", "Decir que la investigación es una cacería política.", "Dizer que a investigação é uma caça às bruxas partidária."), s: 1 },
      ],
    },
    {
      t: T("Healthcare", "Sanidad", "Saúde"),
      q: T("How will you fix rising healthcare costs?", "¿Cómo vas a arreglar el aumento de los costos de salud?", "Como você vai resolver o aumento dos custos de saúde?"),
      a: [
        { t: T("Negotiate drug prices and expand coverage.", "Negociar precios de medicamentos y ampliar la cobertura.", "Negociar preços de medicamentos e ampliar a cobertura."), s: 3 },
        { t: T("Let the market decide everything.", "Dejar que el mercado decida todo.", "Deixar o mercado decidir tudo."), s: 1 },
        { t: T("Repeal coverage and call it freedom.", "Derogar la cobertura y llamarlo libertad.", "Revogar a cobertura e chamar de liberdade."), s: 0 },
      ],
    },
    {
      t: T("Education", "Educación", "Educação"),
      q: T("Are public schools getting enough funding?", "¿Las escuelas públicas reciben suficiente financiamiento?", "As escolas públicas recebem financiamento suficiente?"),
      a: [
        { t: T("Raise teacher pay and fund classrooms.", "Subir el salario docente y financiar las aulas.", "Aumentar o salário dos professores e financiar as salas."), s: 3 },
        { t: T("Cut taxes and hope schools figure it out.", "Bajar impuestos y esperar que las escuelas se arreglen.", "Cortar impostos e esperar que as escolas se resolvam."), s: 1 },
        { t: T("Parents should pay for public school.", "Los padres deberían pagar la escuela pública.", "Os pais deveriam pagar pela escola pública."), s: 0 },
      ],
    },
    {
      t: T("Housing", "Vivienda", "Moradia"),
      q: T("Rents are out of control. What is your plan?", "Los alquileres están por las nubes. ¿Cuál es tu plan?", "Os aluguéis estão fora de controle. Qual é seu plano?"),
      a: [
        { t: T("Build more housing and protect renters.", "Construir más vivienda y proteger a los inquilinos.", "Construir mais moradias e proteger os inquilinos."), s: 3 },
        { t: T("Deregulate everything and hope prices fall.", "Desregular todo y esperar que bajen los precios.", "Desregulamentar tudo e esperar que os preços caiam."), s: 1 },
        { t: T("It is not my problem.", "No es mi problema.", "Não é meu problema."), s: 0 },
      ],
    },
    {
      t: T("Infrastructure", "Infraestructura", "Infraestrutura"),
      q: T("How will you fix roads and bridges?", "¿Cómo vas a arreglar las carreteras y los puentes?", "Como você vai consertar estradas e pontes?"),
      a: [
        { t: T("A funded infrastructure plan with local workers.", "Un plan de infraestructura financiado con trabajadores locales.", "Um plano de infraestrutura financiado com trabalhadores locais."), s: 3 },
        { t: T("Wait for the federal government to pay.", "Esperar que pague el gobierno federal.", "Esperar que o governo federal pague."), s: 1 },
        { t: T("Tax cuts will fix the roads somehow.", "Los recortes de impuestos arreglarán las carreteras de alguna forma.", "Cortes de impostos vão consertar as estradas de alguma forma."), s: 0 },
      ],
    },
  ];

  const ANNUAL_EVENTS = [
    {
      id: "river",
      icon: E("1f3ed"),
      title: T("Factory Dumping", "Vertido de la fábrica", "Despejo da fábrica"),
      lead: T("A factory has been dumping waste into the river. The cameras are waiting for your response.", "Una fábrica ha estado vertiendo residuos al río. Las cámaras esperan tu respuesta.", "Uma fábrica vem despejando resíduos no rio. As câmeras esperam sua resposta."),
      choices: [
        evChoice(T("Fund a cleanup", "Financiar una limpieza", "Financiar uma limpeza"), T("Cleanup Announced", "Limpieza anunciada", "Limpeza anunciada"), T("You sent crews to the river. Families can fish there again, and the photos are good.", "Enviaste cuadrillas al río. Las familias pueden pescar otra vez, y las fotos son buenas.", "Você enviou equipes ao rio. As famílias podem pescar de novo, e as fotos são boas."), { money: -12000, approval: 5, happiness: 2 }),
        evChoice(T("Make the factory pay", "Hacer que la fábrica pague", "Fazer a fábrica pagar"), T("Factory Pays", "La fábrica paga", "A fábrica paga"), T("You forced the company to fund the cleanup. It wrote a check, and its lawyers are watching you.", "Obligaste a la empresa a financiar la limpieza. Firmó un cheque, y sus abogados te están vigilando.", "Você forçou a empresa a financiar a limpeza. Ela assinou um cheque, e seus advogados estão de olho em você."), { funds: 8000, approval: 2 }),
        evChoice(T("Ignore the report", "Ignorar el informe", "Ignorar o relatório"), T("River Still Toxic", "El río sigue tóxico", "O rio continua tóxico"), T("The story grew for weeks. Voters noticed the silence.", "La historia creció durante semanas. Los votantes notaron el silencio.", "A história cresceu por semanas. Os eleitores notaram o silêncio."), { approval: -6, happiness: -2 }),
      ],
    },
    {
      id: "donor",
      icon: E("1f4b0"),
      title: T("Donor Investigation", "Investigación a un donante", "Investigação de um doador"),
      lead: T("A major donor is under investigation. Reporters want to know what you knew.", "Un gran donante está bajo investigación. Los periodistas quieren saber qué sabías.", "Um grande doador está sob investigação. Os repórteres querem saber o que você sabia."),
      choices: [
        evChoice(T("Cooperate fully", "Cooperar totalmente", "Cooperar plenamente"), T("Full Cooperation", "Cooperación total", "Cooperação total"), T("You released the records and answered every question. It cost you a donor, not your credibility.", "Publicaste los registros y respondiste todo. Te costó un donante, no tu credibilidad.", "Você divulgou os registros e respondeu tudo. Custou um doador, não sua credibilidade."), { approval: 6, funds: -10000 }),
        evChoice(T("Deny everything", "Negarlo todo", "Negar tudo"), T("Denials Everywhere", "Negaciones por todas partes", "Negações por toda parte"), T("Your denials held for a day. Then a second document surfaced.", "Tus negaciones duraron un día. Luego apareció un segundo documento.", "Suas negações duraram um dia. Depois surgiu um segundo documento."), { approval: -5, funds: 5000 }),
        evChoice(T("Return the donation", "Devolver la donación", "Devolver a doação"), T("Money Returned", "Dinero devuelto", "Dinheiro devolvido"), T("You returned the money and called for transparency. The story lost steam.", "Devolviste el dinero y pediste transparencia. La historia perdió fuerza.", "Você devolveu o dinheiro e pediu transparência. A história perdeu força."), { approval: 8, funds: -15000 }),
      ],
    },
    {
      id: "crimewave",
      icon: E("1f6a8"),
      title: T("Crime Wave", "Ola de crimen", "Onda de crime"),
      lead: T("Violent crime is up and the evening news leads with it every night.", "El crimen violento aumentó y las noticias de la noche lo ponen primero cada día.", "O crime violento aumentou e o noticiário da noite abre com isso toda noite."),
      choices: [
        evChoice(T("Hire more police", "Contratar más policías", "Contratar mais policiais"), T("More Officers", "Más agentes", "Mais agentes"), T("You funded new patrols. The police union is grateful, and so are nervous voters.", "Financiaste nuevas patrullas. El sindicato policial está agradecido, y los votantes nerviosos también.", "Você financiou novas patrulhas. O sindicato da polícia agradece, e os eleitores nervosos também."), { money: -15000, approval: 5, happiness: -1 }),
        evChoice(T("Fund prevention programs", "Financiar programas de prevención", "Financiar programas de prevenção"), T("Prevention First", "Prevención primero", "Prevenção em primeiro lugar"), T("You invested in youth centers and job programs. It will take years, but families feel heard.", "Invertiste en centros juveniles y programas de empleo. Tardará años, pero las familias se sienten escuchadas.", "Você investiu em centros juvenis e programas de emprego. Vai levar anos, mas as famílias se sentem ouvidas."), { money: -10000, approval: 4, happiness: 2 }),
        evChoice(T("Blame your opponent", "Culpar a tu rival", "Culpar seu rival"), T("Attack Mode", "Modo ataque", "Modo ataque"), T("The attack played well on partisan media and badly everywhere else.", "El ataque funcionó en medios partidistas y mal en todo lo demás.", "O ataque funcionou na mídia partidária e mal em todo o resto."), { approval: -3, happiness: -1 }),
      ],
    },
    {
      id: "teachers",
      icon: E("1f3eb"),
      title: T("Teachers' Strike", "Huelga de maestros", "Greve dos professores"),
      lead: T("Teachers walked out over pay. Schools are closed and parents are furious.", "Los maestros se fueron a la huelga por el salario. Las escuelas están cerradas y los padres están furiosos.", "Os professores entraram em greve por salário. As escolas estão fechadas e os pais estão furiosos."),
      choices: [
        evChoice(T("Raise teacher pay", "Subir el salario docente", "Aumentar o salário dos professores"), T("Deal Reached", "Acuerdo alcanzado", "Acordo alcançado"), T("You funded a raise and the strike ended. Parents are relieved.", "Financiaste un aumento y la huelga terminó. Los padres están aliviados.", "Você financiou um aumento e a greve acabou. Os pais estão aliviados."), { money: -18000, approval: 6, happiness: 1 }),
        evChoice(T("Replace the teachers", "Reemplazar a los maestros", "Substituir os professores"), T("Classrooms Empty", "Aulas vacías", "Salas vazias"), T("Substitutes could not cover the gap. The photos of empty classrooms hurt you.", "Los sustitutos no cubrieron el hueco. Las fotos de aulas vacías te hicieron daño.", "Os substitutos não cobriram a lacuna. As fotos de salas vazias te machucaram."), { money: -5000, approval: -7, happiness: -2 }),
        evChoice(T("Wait them out", "Esperar a que se rindan", "Esperar que desistam"), T("Strike Drags On", "La huelga se alarga", "A greve se arrasta"), T("The strike lasted three weeks. Everyone blamed you.", "La huelga duró tres semanas. Todos te culparon.", "A greve durou três semanas. Todos culparam você."), { approval: -4, happiness: -2 }),
      ],
    },
    {
      id: "hospital",
      icon: E("1f3e5"),
      title: T("Hospital Closure", "Cierre de hospital", "Fechamento de hospital"),
      lead: T("The only hospital in a poor neighborhood is closing. Thousands will lose care.", "El único hospital de un barrio pobre está cerrando. Miles perderán atención.", "O único hospital de um bairro pobre está fechando. Milhares perderão atendimento."),
      choices: [
        evChoice(T("Bail out the hospital", "Rescatar el hospital", "Salvar o hospital"), T("Hospital Saved", "Hospital salvado", "Hospital salvo"), T("You found the money. Nurses cheered and patients wrote thank-you notes.", "Encontraste el dinero. Las enfermeras celebraron y los pacientes escribieron notas de agradecimiento.", "Você encontrou o dinheiro. As enfermeiras comemoraram e os pacientes escreveram cartas de agradecimento."), { money: -20000, approval: 7, happiness: 2 }),
        evChoice(T("Sell it to a private buyer", "Venderlo a un comprador privado", "Vender a um comprador privado"), T("Private Buyer", "Comprador privado", "Comprador privado"), T("The hospital reopened with fewer beds and higher bills. The new owner donated to your campaign.", "El hospital reabrió con menos camas y facturas más altas. El nuevo dueño donó a tu campaña.", "O hospital reabriu com menos leitos e contas mais altas. O novo dono doou para sua campanha."), { funds: 12000, approval: -5, happiness: -2 }),
        evChoice(T("Visit for a photo op", "Visitar para una foto", "Visitar para uma foto"), T("Photo Op", "Foto para la prensa", "Foto para a imprensa"), T("You toured the ward and left. Nothing changed.", "Recorriste la sala y te fuiste. Nada cambió.", "Você visitou a ala e foi embora. Nada mudou."), { approval: 1, happiness: -1 }),
      ],
    },
    {
      id: "storm",
      icon: E("1f32a-fe0f"),
      title: T("Hurricane Relief", "Ayuda por el huracán", "Ajuda pelo furacão"),
      lead: T("A hurricane flattened entire neighborhoods. The state is asking what you will do.", "Un huracán arrasó barrios enteros. El estado pregunta qué vas a hacer.", "Um furacão arrasou bairros inteiros. O estado pergunta o que você vai fazer."),
      choices: [
        evChoice(T("Release emergency funds", "Liberar fondos de emergencia", "Liberar fundos de emergência"), T("Relief Arrives", "Llega la ayuda", "A ajuda chega"), T("You moved fast and people noticed. Shelters opened within hours.", "Actuaste rápido y la gente lo notó. Los refugios abrieron en horas.", "Você agiu rápido e as pessoas notaram. Os abrigos abriram em horas."), { money: -25000, approval: 8, happiness: 3 }),
        evChoice(T("Visit the damage", "Visitar los daños", "Visitar os danos"), T("On the Ground", "En el terreno", "No local"), T("You spent the day with victims. It was symbolic, but it mattered.", "Pasaste el día con las víctimas. Fue simbólico, pero importó.", "Você passou o dia com as vítimas. Foi simbólico, mas importou."), { approval: 3, happiness: 1 }),
        evChoice(T("Blame the federal government", "Culpar al gobierno federal", "Culpar o governo federal"), T("Washington Blame", "Culpa a Washington", "Culpa a Washington"), T("Your base liked it. The victims did not.", "A tu base le gustó. A las víctimas no.", "Sua base gostou. As vítimas não."), { approval: -2, happiness: -1 }),
      ],
    },
    {
      id: "border",
      icon: E("1f6c2"),
      title: T("Border Surge", "Aumento en la frontera", "Aumento na fronteira"),
      lead: T("A surge at the border is dominating the news. Both sides want a clear answer.", "Un aumento en la frontera domina las noticias. Ambos lados quieren una respuesta clara.", "Um aumento na fronteira domina as notícias. Os dois lados querem uma resposta clara."),
      choices: [
        evChoice(T("Pass a border security bill", "Aprobar una ley de seguridad fronteriza", "Aprovar uma lei de segurança na fronteira"), T("Security Bill", "Ley de seguridad", "Lei de segurança"), T("You passed a tough bill. It satisfied some voters and angered others.", "Aprobaste una ley dura. Satisfizo a algunos votantes y enojó a otros.", "Você aprovou uma lei dura. Satisfez alguns eleitores e irritou outros."), { approval: 4, happiness: -1, laws: 1, lawTitle: T("Border Security Act", "Ley de Seguridad Fronteriza", "Lei de Segurança da Fronteira") }),
        evChoice(T("Fund humanitarian aid", "Financiar ayuda humanitaria", "Financiar ajuda humanitária"), T("Aid Approved", "Ayuda aprobada", "Ajuda aprovada"), T("You sent aid to shelters and processing centers. Advocates praised you.", "Enviaste ayuda a refugios y centros de procesamiento. Los defensores te elogiaron.", "Você enviou ajuda a abrigos e centros de processamento. Os defensores elogiaram você."), { money: -12000, approval: 5, happiness: 2 }),
        evChoice(T("Avoid the issue", "Evitar el tema", "Evitar o assunto"), T("No Comment", "Sin comentarios", "Sem comentários"), T("The silence became the story.", "El silencio se convirtió en la historia.", "O silêncio virou a história."), { approval: -5, happiness: -1 }),
      ],
    },
    {
      id: "housing",
      icon: E("1f3e0"),
      title: T("Housing Crisis", "Crisis de vivienda", "Crise de moradia"),
      lead: T("Rents are rising faster than wages. Families are being priced out.", "Los alquileres suben más rápido que los salarios. Las familias no pueden pagar.", "Os aluguéis sobem mais rápido que os salários. As famílias estão sendo expulsas."),
      choices: [
        evChoice(T("Cap rents", "Limitar los alquileres", "Limitar os aluguéis"), T("Rent Cap Passed", "Tope de alquiler aprobado", "Teto de aluguel aprovado"), T("Tenants celebrated. Developers warned of fewer projects.", "Los inquilinos celebraron. Los desarrolladores advirtieron menos proyectos.", "Os inquilinos comemoraram. Os incorporadores avisaram sobre menos projetos."), { approval: 6, funds: -8000, happiness: 1 }),
        evChoice(T("Give developers incentives", "Dar incentivos a los desarrolladores", "Dar incentivos aos incorporadores"), T("Building Boom", "Auge de construcción", "Boom de construção"), T("New towers broke ground. The developers remembered your help.", "Nuevas torres empezaron a construirse. Los desarrolladores recordaron tu ayuda.", "Novas torres começaram a ser construídas. Os incorporadores lembraram da sua ajuda."), { funds: 15000, approval: -4, happiness: -1 }),
        evChoice(T("Create a task force", "Crear un grupo de trabajo", "Criar uma força-tarefa"), T("Task Force", "Grupo de trabajo", "Força-tarefa"), T("The task force will report next year. Nobody is holding their breath.", "El grupo de trabajo presentará su informe el próximo año. Nadie se aguanta la respiración.", "A força-tarefa vai relatar no próximo ano. Ninguém está ansioso."), { money: -3000, approval: 1 }),
      ],
    },
    {
      id: "transit",
      icon: E("1f68c"),
      title: T("Transit Strike", "Huelga de transporte", "Greve do transporte"),
      lead: T("Bus and train workers are on strike. The city is crawling.", "Los trabajadores de autobuses y trenes están en huelga. La ciudad avanza a paso de tortuga.", "Os trabalhadores de ônibus e trens estão em greve. A cidade está engatinhando."),
      choices: [
        evChoice(T("Fund the transit authority", "Financiar la autoridad de transporte", "Financiar a autoridade de transporte"), T("Buses Roll Again", "Los autobuses vuelven", "Os ônibus voltam"), T("You brokered a deal and service resumed. Commuters are grateful.", "Negociaste un acuerdo y el servicio volvió. Los pasajeros están agradecidos.", "Você intermediou um acordo e o serviço voltou. Os passageiros agradecem."), { money: -14000, approval: 5, happiness: 2 }),
        evChoice(T("Promote rideshare", "Promocionar el transporte compartido", "Promover o transporte compartilhado"), T("Rideshare Push", "Empuje al transporte compartido", "Impulso ao transporte compartilhado"), T("The app discounts helped some commuters and annoyed the union.", "Los descuentos de la app ayudaron a algunos pasajeros y molestaron al sindicato.", "Os descontos do app ajudaram alguns passageiros e irritaram o sindicato."), { approval: -2, happiness: 1 }),
        evChoice(T("Let them strike", "Dejar que sigan en huelga", "Deixar que continuem em greve"), T("City Gridlock", "Ciudad bloqueada", "Cidade parada"), T("Traffic was a nightmare for weeks. Voters remembered.", "El tráfico fue una pesadilla durante semanas. Los votantes lo recordaron.", "O trânsito foi um pesadelo por semanas. Os eleitores lembraram."), { approval: -5, happiness: -3 }),
      ],
    },
    {
      id: "protest",
      icon: E("270a"),
      title: T("Police Protest", "Protesta policial", "Protesto policial"),
      lead: T("A controversial police shooting has sparked nightly protests.", "Un tiroteo policial controvertido ha provocado protestas nocturnas.", "Um tiroteio policial controverso provocou protestos noturnos."),
      choices: [
        evChoice(T("Order an independent review", "Ordenar una revisión independiente", "Ordenar uma revisão independente"), T("Independent Review", "Revisión independiente", "Revisão independente"), T("You called for a transparent investigation. Both sides are watching.", "Pediste una investigación transparente. Ambos lados están mirando.", "Você pediu uma investigação transparente. Os dois lados estão observando."), { approval: 3, happiness: 2, funds: -5000 }),
        evChoice(T("Back the police", "Apoyar a la policía", "Apoiar a polícia"), T("Backing the Blue", "Apoyo a la policía", "Apoio à polícia"), T("The police union endorsed you. Protesters promised to remember.", "El sindicato policial te respaldó. Los manifestantes prometieron recordarlo.", "O sindicato da polícia apoiou você. Os manifestantes prometeram lembrar."), { approval: 2, happiness: -2 }),
        evChoice(T("Impose a curfew", "Imponer un toque de queda", "Impor um toque de recolher"), T("Curfew", "Toque de queda", "Toque de recolher"), T("The curfew stopped some marches and inflamed others.", "El toque de queda detuvo algunas marchas e inflamó otras.", "O toque de recolher parou algumas marchas e inflamou outras."), { approval: -4, happiness: -3 }),
      ],
    },
    {
      id: "wildfire",
      icon: E("1f525"),
      title: T("Wildfire Season", "Temporada de incendios", "Temporada de incêndios"),
      lead: T("Wildfires are spreading across the state. The air is hazardous.", "Los incendios se extienden por el estado. El aire es peligroso.", "Os incêndios estão se espalhando pelo estado. O ar é perigoso."),
      choices: [
        evChoice(T("Pass a climate bill", "Aprobar una ley climática", "Aprovar uma lei climática"), T("Climate Bill", "Ley climática", "Lei climática"), T("You tied recovery to long-term climate action. Activists cheered.", "Vinculaste la recuperación a la acción climática a largo plazo. Los activistas celebraron.", "Você vinculou a recuperação à ação climática de longo prazo. Os ativistas comemoraram."), { approval: 6, funds: -7000, laws: 1, lawTitle: T("Climate Resilience Act", "Ley de Resiliencia Climática", "Lei de Resiliência Climática") }),
        evChoice(T("Open logging jobs", "Abrir empleos forestales", "Abrir empregos florestais"), T("Logging Jobs", "Empleos forestales", "Empregos florestais"), T("The timber industry praised you. Environmental groups did not.", "La industria maderera te elogió. Los grupos ambientalistas no.", "A indústria madeireira elogiou você. Os grupos ambientalistas não."), { money: 8000, approval: -4, happiness: -1 }),
        evChoice(T("Request federal aid", "Pedir ayuda federal", "Pedir ajuda federal"), T("Federal Aid", "Ayuda federal", "Ajuda federal"), T("Washington sent help. You shared the credit.", "Washington envió ayuda. Compartiste el crédito.", "Washington enviou ajuda. Você compartilhou o crédito."), { money: 5000, approval: 4 }),
      ],
    },
    {
      id: "tech",
      icon: E("1f4bb"),
      title: T("Tech Tax Break", "Exención fiscal tecnológica", "Isenção fiscal tecnológica"),
      lead: T("A tech giant wants a tax break in exchange for building a campus.", "Un gigante tecnológico quiere una exención fiscal a cambio de construir un campus.", "Uma gigante da tecnologia quer uma isenção fiscal em troca de construir um campus."),
      choices: [
        evChoice(T("Give the break", "Dar la exención", "Dar a isenção"), T("Deal Signed", "Acuerdo firmado", "Acordo assinado"), T("The campus is coming. So is a large donation to your campaign.", "El campus viene. También una gran donación a tu campaña.", "O campus está vindo. Também uma grande doação para sua campanha."), { funds: 20000, approval: -5 }),
        evChoice(T("Refuse the deal", "Rechazar el acuerdo", "Recusar o acordo"), T("No Special Deal", "Sin acuerdo especial", "Sem acordo especial"), T("You said no. Small businesses applauded.", "Dijiste no. Las pequeñas empresas aplaudieron.", "Você disse não. As pequenas empresas aplaudiram."), { approval: 4, funds: -5000 }),
        evChoice(T("Negotiate terms", "Negociar condiciones", "Negociar termos"), T("Negotiated Deal", "Acuerdo negociado", "Acordo negociado"), T("You traded the break for local hiring and a smaller subsidy.", "Cambiaste la exención por contratación local y un subsidio menor.", "Você trocou a isenção por contratação local e um subsídio menor."), { funds: 10000, approval: 1 }),
      ],
    },
    {
      id: "books",
      icon: E("1f4da"),
      title: T("School Book Fight", "Pelea por un libro escolar", "Briga por um livro escolar"),
      lead: T("A parent group wants a book removed from school libraries.", "Un grupo de padres quiere retirar un libro de las bibliotecas escolares.", "Um grupo de pais quer remover um livro das bibliotecas escolares."),
      choices: [
        evChoice(T("Ban the book", "Prohibir el libro", "Proibir o livro"), T("Book Banned", "Libro prohibido", "Livro proibido"), T("The group celebrated. Students and teachers protested.", "El grupo celebró. Estudiantes y maestros protestaron.", "O grupo comemorou. Estudantes e professores protestaram."), { approval: 3, happiness: -2 }),
        evChoice(T("Defend the library", "Defender la biblioteca", "Defender a biblioteca"), T("Library Defended", "Biblioteca defendida", "Biblioteca defendida"), T("You stood with librarians and free speech groups.", "Te pusiste del lado de bibliotecarios y grupos de libertad de expresión.", "Você ficou ao lado de bibliotecários e grupos de liberdade de expressão."), { approval: 2, happiness: 2, funds: -3000 }),
        evChoice(T("Let the school decide", "Dejar que decida la escuela", "Deixar a escola decidir"), T("Local Control", "Control local", "Controle local"), T("You left it to the school board. Most people accepted the answer.", "Lo dejaste en manos de la junta escolar. La mayoría aceptó la respuesta.", "Você deixou para o conselho escolar. A maioria aceitou a resposta."), { approval: 1 }),
      ],
    },
    {
      id: "opioid",
      icon: E("1f48a"),
      title: T("Opioid Epidemic", "Epidemia de opioides", "Epidemia de opioides"),
      lead: T("Overdose deaths are rising. The county is asking for help.", "Las muertes por sobredosis aumentan. El condado pide ayuda.", "As mortes por overdose estão aumentando. O condado pede ajuda."),
      choices: [
        evChoice(T("Fund treatment centers", "Financiar centros de tratamiento", "Financiar centros de tratamento"), T("Treatment Funded", "Tratamiento financiado", "Tratamento financiado"), T("You expanded treatment and naloxone access. Health workers praised you.", "Ampliaste el tratamiento y el acceso a naloxona. Los trabajadores de salud te elogiaron.", "Você ampliou o tratamento e o acesso à naloxona. Os profissionais de saúde elogiaram você."), { money: -16000, approval: 7, happiness: 2 }),
        evChoice(T("Arrest the dealers", "Arrestar a los traficantes", "Prender os traficantes"), T("Crackdown", "Operativo", "Operação"), T("Police made arrests. Families said you ignored the root cause.", "La policía hizo arrestos. Las familias dijeron que ignoraste la causa de fondo.", "A polícia fez prisões. As famílias disseram que você ignorou a causa raiz."), { approval: 4, happiness: -1 }),
        evChoice(T("Ignore the report", "Ignorar el informe", "Ignorar o relatório"), T("Overdoses Rise", "Aumentan las sobredosis", "Overdoses aumentam"), T("The death toll kept climbing and the story followed you.", "El número de muertes siguió subiendo y la historia te persiguió.", "O número de mortes continuou subindo e a história te seguiu."), { approval: -6, happiness: -2 }),
      ],
    },
    {
      id: "union",
      icon: E("1f91d"),
      title: T("Union Endorsement", "Respaldo sindical", "Apoio sindical"),
      lead: T("The largest union in the state is deciding whether to endorse you.", "El sindicato más grande del estado decide si te va a respaldar.", "O maior sindicato do estado está decidindo se vai apoiar você."),
      choices: [
        evChoice(T("Accept the endorsement", "Aceptar el respaldo", "Aceitar o apoio"), T("Union Endorsement", "Respaldo sindical", "Apoio sindical"), T("You accepted the endorsement and promised to protect workers.", "Aceptaste el respaldo y prometiste proteger a los trabajadores.", "Você aceitou o apoio e prometeu proteger os trabalhadores."), { funds: 10000, approval: 4, happiness: 1 }),
        evChoice(T("Reject it", "Rechazarlo", "Recusar"), T("No Endorsement", "Sin respaldo", "Sem apoio"), T("You said you would not be owned by anyone. Business groups liked that.", "Dijiste que no serías propiedad de nadie. A los grupos empresariales les gustó.", "Você disse que não seria propriedade de ninguém. Os grupos empresariais gostaram."), { approval: -2, funds: -2000 }),
        evChoice(T("Stay neutral", "Mantenerte neutral", "Manter-se neutro"), T("Neutral Ground", "Terreno neutral", "Terreno neutro"), T("You thanked the union but stayed quiet. Nobody got a headline.", "Agradeciste al sindicato pero te quedaste callado. Nadie tuvo titular.", "Você agradeceu ao sindicato mas ficou quieto. Ninguém teve manchete."), { approval: 0 }),
      ],
    },
    {
      id: "paper",
      icon: E("1f4f0"),
      title: T("Newspaper Endorsement", "Respaldo del periódico", "Apoio do jornal"),
      lead: T("The city's biggest newspaper is endorsing you. The editorial board wants a meeting.", "El periódico más grande de la ciudad te va a respaldar. La junta editorial quiere una reunión.", "O maior jornal da cidade está apoiando você. O conselho editorial quer uma reunião."),
      choices: [
        evChoice(T("Accept the endorsement", "Aceptar el respaldo", "Aceitar o apoio"), T("Endorsed", "Respaldado", "Apoiado"), T("The front page called you the serious choice.", "La primera plana te llamó la opción seria.", "A primeira página chamou você de escolha séria."), { approval: 5 }),
        evChoice(T("Demand a retraction", "Exigir una retractación", "Exigir uma retratação"), T("War With the Press", "Guerra con la prensa", "Guerra com a imprensa"), T("The paper published the demand and made you look thin-skinned.", "El periódico publicó la exigencia y te hizo ver susceptible.", "O jornal publicou a exigência e fez você parecer suscetível."), { approval: -3, happiness: -1 }),
        evChoice(T("Ignore it", "Ignorarlo", "Ignorar"), T("No Comment", "Sin comentarios", "Sem comentários"), T("The endorsement ran without your comment. It still helped.", "El respaldo salió sin tu comentario. Igual ayudó.", "O apoio saiu sem seu comentário. Ainda ajudou."), { approval: 1 }),
      ],
    },
    {
      id: "attackad",
      icon: E("1f4fa"),
      title: T("Attack Ad", "Anuncio de ataque", "Anúncio de ataque"),
      lead: T("Your opponent released an ad questioning your honesty.", "Tu rival lanzó un anuncio cuestionando tu honestidad.", "Seu rival lançou um anúncio questionando sua honestidade."),
      choices: [
        evChoice(T("Answer with your own ad", "Responder con tu propio anuncio", "Responder com seu próprio anúncio"), T("Counter Ad", "Contraanuncio", "Contra-anúncio"), T("Your ad hit back with receipts. The race tightened.", "Tu anuncio respondió con pruebas. La carrera se apretó.", "Seu anúncio respondeu com provas. A corrida apertou."), { funds: -8000, approval: 4 }),
        evChoice(T("Ignore it", "Ignorarlo", "Ignorar"), T("No Response", "Sin respuesta", "Sem resposta"), T("The ad ran unanswered for a week.", "El anuncio estuvo una semana sin respuesta.", "O anúncio ficou uma semana sem resposta."), { approval: -3 }),
        evChoice(T("Counterattack", "Contraatacar", "Contra-atacar"), T("Attack Politics", "Política de ataque", "Política de ataque"), T("You went personal. Some voters loved it; others were disgusted.", "Te fuiste a lo personal. A algunos votantes les encantó; a otros les dio asco.", "Você partiu para o pessoal. Alguns eleitores adoraram; outros ficaram enojados."), { funds: -5000, approval: -1, happiness: -1 }),
      ],
    },
    {
      id: "leak",
      icon: E("1f3a7"),
      title: T("Leaked Audio", "Audio filtrado", "Áudio vazado"),
      lead: T("A recording of you complaining about voters just surfaced.", "Acaba de aparecer una grabación en la que te quejas de los votantes.", "Acabou de surgir uma gravação em que você reclama dos eleitores."),
      choices: [
        evChoice(T("Apologize", "Disculparte", "Pedir desculpas"), T("Apology Accepted", "Disculpa aceptada", "Desculpas aceitas"), T("You apologized and took questions. The story faded faster than expected.", "Te disculpaste y aceptaste preguntas. La historia se apagó más rápido de lo esperado.", "Você pediu desculpas e aceitou perguntas. A história sumiu mais rápido do que o esperado."), { approval: 1, happiness: -1 }),
        evChoice(T("Deny it", "Negarlo", "Negar"), T("Denial", "Negación", "Negação"), T("The audio was clear. Your denial made it worse.", "El audio era claro. Tu negación lo empeoró.", "O áudio era claro. Sua negação piorou tudo."), { approval: -5 }),
        evChoice(T("Blame editing", "Culpar a la edición", "Culpar a edição"), T("Edited Clip", "Clip editado", "Clipe editado"), T("Your supporters believed you. Everyone else did not.", "Tus seguidores te creyeron. Todos los demás no.", "Seus apoiadores acreditaram em você. Todos os outros não."), { approval: -3, happiness: -1 }),
      ],
    },
    {
      id: "drought",
      icon: E("1f33e"),
      title: T("Farm Drought", "Sequía agrícola", "Seca agrícola"),
      lead: T("A drought is destroying crops. Farmers are asking for emergency aid.", "Una sequía está destruyendo las cosechas. Los agricultores piden ayuda de emergencia.", "Uma seca está destruindo as colheitas. Os agricultores pedem ajuda de emergência."),
      choices: [
        evChoice(T("Aid the farmers", "Ayudar a los agricultores", "Ajudar os agricultores"), T("Farm Aid", "Ayuda agrícola", "Ajuda agrícola"), T("You approved relief and visited the fields. Rural voters noticed.", "Aprobaste ayuda y visitaste los campos. Los votantes rurales lo notaron.", "Você aprovou ajuda e visitou os campos. Os eleitores rurais notaram."), { money: -12000, approval: 5, happiness: 2 }),
        evChoice(T("Order water restrictions", "Ordenar restricciones de agua", "Ordenar restrições de água"), T("Water Restrictions", "Restricciones de agua", "Restrições de água"), T("The restrictions helped the reservoir and angered suburban voters.", "Las restricciones ayudaron al embalse y enojaron a los votantes suburbanos.", "As restrições ajudaram o reservatório e irritaram os eleitores suburbanos."), { approval: -3, happiness: -1 }),
        evChoice(T("Pray for rain", "Rezar por lluvia", "Rezar por chuva"), T("Prayers for Rain", "Oraciones por lluvia", "Orações por chuva"), T("You held a prayer service. It rained a week later.", "Hiciste un servicio de oración. Llovió una semana después.", "Você fez um culto de oração. Choveu uma semana depois."), { approval: 1, happiness: 1 }),
      ],
    },
    {
      id: "cyber",
      icon: E("1f4bb"),
      title: T("Cyberattack", "Ciberataque", "Ciberataque"),
      lead: T("Hackers breached city computers and stole residents' data.", "Los hackers entraron a las computadoras de la ciudad y robaron datos de los residentes.", "Hackers invadiram os computadores da cidade e roubaram dados dos moradores."),
      choices: [
        evChoice(T("Invest in cybersecurity", "Invertir en ciberseguridad", "Investir em cibersegurança"), T("Security Upgraded", "Seguridad mejorada", "Segurança melhorada"), T("You funded a rebuild and notified every victim.", "Financiaste una reconstrucción y avisaste a cada víctima.", "Você financiou uma reconstrução e avisou cada vítima."), { money: -10000, approval: 5 }),
        evChoice(T("Cover it up", "Encubrirlo", "Acobertar"), T("Cover-Up", "Encubrimiento", "Acobertamento"), T("The breach leaked anyway. The cover-up became the bigger scandal.", "La brecha se filtró igual. El encubrimiento se volvió el escándalo más grande.", "A invasão vazou de qualquer forma. O encobrimento virou o escândalo maior."), { approval: -7 }),
        evChoice(T("Blame the hackers", "Culpar a los hackers", "Culpar os hackers"), T("Hackers Blamed", "Culpa a los hackers", "Culpa aos hackers"), T("You blamed foreign hackers. It played well for a day.", "Culpaste a hackers extranjeros. Funcionó bien por un día.", "Você culpou hackers estrangeiros. Funcionou bem por um dia."), { approval: 1 }),
      ],
    },
    {
      id: "homeless",
      icon: E("26fa"),
      title: T("Homeless Camp", "Campamento de personas sin hogar", "Acampamento de moradores de rua"),
      lead: T("A large homeless camp has appeared downtown. Businesses want it gone.", "Un gran campamento de personas sin hogar apareció en el centro. Los comercios quieren que se vaya.", "Um grande acampamento de moradores de rua apareceu no centro. As empresas querem que ele suma."),
      choices: [
        evChoice(T("Open a shelter", "Abrir un refugio", "Abrir um abrigo"), T("Shelter Opens", "Abre el refugio", "O abrigo abre"), T("You funded a shelter with services. Advocates called it humane.", "Financiaste un refugio con servicios. Los defensores lo llamaron humano.", "Você financiou um abrigo com serviços. Os defensores chamaram de humano."), { money: -9000, approval: 5, happiness: 2 }),
        evChoice(T("Clear the camp", "Despejar el campamento", "Limpar o acampamento"), T("Camp Cleared", "Campamento despejado", "Acampamento limpo"), T("Police cleared the camp. The people did not disappear.", "La policía despejó el campamento. Las personas no desaparecieron.", "A polícia limpou o acampamento. As pessoas não desapareceram."), { approval: -4, happiness: -2 }),
        evChoice(T("Create a task force", "Crear un grupo de trabajo", "Criar uma força-tarefa"), T("Task Force", "Grupo de trabajo", "Força-tarefa"), T("The task force will study the problem for months.", "El grupo de trabajo estudiará el problema durante meses.", "A força-tarefa vai estudar o problema por meses."), { money: -2000, approval: 1 }),
      ],
    },
    {
      id: "wage",
      icon: E("1f4b5"),
      title: T("Minimum Wage Protest", "Protesta por el salario mínimo", "Protesto pelo salário mínimo"),
      lead: T("Workers are marching for a higher minimum wage.", "Los trabajadores marchan por un salario mínimo más alto.", "Os trabalhadores estão marchando por um salário mínimo mais alto."),
      choices: [
        evChoice(T("Raise the minimum wage", "Subir el salario mínimo", "Aumentar o salário mínimo"), T("Wage Raised", "Salario aumentado", "Salário aumentado"), T("You signed the increase. Workers cheered and business groups warned of costs.", "Firmaste el aumento. Los trabajadores celebraron y los grupos empresariales advirtieron sobre costos.", "Você assinou o aumento. Os trabalhadores comemoraram e os grupos empresariais alertaram sobre custos."), { approval: 6, funds: -6000, happiness: 2 }),
        evChoice(T("Oppose the raise", "Oponerte al aumento", "Opor-se ao aumento"), T("Wage Frozen", "Salario congelado", "Salário congelado"), T("You argued the economy could not absorb it. The marchers booed.", "Argumentaste que la economía no podía absorberlo. Los manifestantes te abuchearon.", "Você argumentou que a economia não podia absorver. Os manifestantes vaiaram."), { approval: -5, funds: 8000, happiness: -1 }),
        evChoice(T("Commission a study", "Encargar un estudio", "Encomendar um estudo"), T("Study Ordered", "Estudio encargado", "Estudo encomendado"), T("You bought time. Both sides called it a dodge.", "Compraste tiempo. Ambos lados lo llamaron evasión.", "Você comprou tempo. Os dois lados chamaram de fuga."), { approval: 1 }),
      ],
    },
  ];

  function chooseAnnualEvent(p) {
    const log = p.eventLog || (p.eventLog = []);
    let pool = ANNUAL_EVENTS.filter((e) => !log.includes(e.id));
    if (!pool.length) {
      log.length = 0;
      pool = ANNUAL_EVENTS.slice();
    }
    const ev = pick(pool);
    log.push(ev.id);
    if (log.length > 10) log.shift();
    return ev;
  }

  function annualEventCard(p, ev) {
    if (!p.active && !p.candidate) {
      p.eventPending = false;
      return;
    }
    p.eventPending = false;
    const office = p.active ? OFFICES[p.rank].t : `${T("Candidate for", "Candidato a", "Candidato a")} ${OFFICES[p.candidate.rank].t}`;
    jCard({
      tag: CAREER,
      iconSrc: ev.icon,
      title: ev.title,
      lead: ev.lead,
      rows: [
        [T("Year", "Año", "Ano"), String(year())],
        [T("Office", "Cargo", "Cargo"), office],
      ],
      choices: ev.choices.map((c) => [
        c.t,
        () => {
          if (typeof play === "function") play("choice");
          recordHistory(p, "event", ev.title, c.t);
          c.run(p);
        },
      ]),
    });
  }

  function startDebate(p) {
    const opp = opponent(p);
    debateRound({ p, opp, qs: pickN(DEBATE_QUESTIONS, 3), i: 0, you: 0, them: 0 });
  }

  function debateRound(d) {
    if (d.i >= d.qs.length) return debateResult(d);
    const q = d.qs[d.i];
    const answers = pickN(q.a, q.a.length);
    const rows = [
      [T("Round", "Ronda", "Rodada"), `${d.i + 1}/${d.qs.length}`],
      [T("Topic", "Tema", "Tema"), q.t],
      [T("Opponent", "Rival", "Rival"), d.opp.name],
    ];
    if (d.i) rows.push([T("Score", "Marcador", "Placar"), `${d.you}–${d.them}`]);
    jCard({
      tag: CAREER,
      iconSrc: E("1f3a4"),
      title: `${T("Debate", "Debate", "Debate")} · ${d.i + 1}/${d.qs.length}`,
      lead: q.q,
      rows,
      choices: answers.map((ans) => [
        ans.t,
        () => {
          if (typeof play === "function") play("choice");
          const smart = (state.stats.Smarts ?? 50) >= 65 ? 1 : 0;
          const mine = clampN(ans.s + smart + (rnd() < 0.12 ? -1 : 0), 0, 3);
          const theirs = ri(0, 3);
          d.you += mine;
          d.them += theirs;
          d.i++;
          debateRound(d);
        },
      ]),
    });
  }

  function debateResult(d) {
    const win = d.you > d.them;
    const tie = d.you === d.them;
    const rows = [
      [T("Final score", "Marcador final", "Placar final"), `${d.you}–${d.them}`],
      [T("Opponent", "Rival", "Rival"), d.opp.name],
      [T("Result", "Resultado", "Resultado"), win ? T("You won the debate", "Ganaste el debate", "Você venceu o debate") : tie ? T("The debate was a draw", "El debate fue un empate", "O debate foi um empate") : T("You lost the debate", "Perdiste el debate", "Você perdeu o debate")],
    ];
    const effects = win ? { approval: ri(5, 10) } : tie ? { approval: ri(1, 3) } : { approval: -ri(3, 8) };
    rows.push(...fx(d.p, effects));
    card(
      T("Debate Result", "Resultado del debate", "Resultado do debate"),
      win ? T("You controlled the room and landed the closing line.", "Controlaste la sala y diste el golpe final.", "Você controlou a sala e deu o golpe final.") : tie ? T("Neither side landed a decisive blow.", "Ningún lado dio un golpe decisivo.", "Nenhum lado deu um golpe decisivo.") : T("Your opponent was sharper on the night.", "Tu rival estuvo más afilado esa noche.", "Seu rival foi mais afiado naquela noite."),
      rows,
    );
  }

  // ---------------------------------------------------------------- pantallas
  function row(id, icon, title, sub, dis, tail) {
    return `<div class="row${dis ? " dis" : ""}"${id ? ` id="${id}"` : ""}><img src="${icon}"><div class="t"><b>${title}</b><span>${sub}</span></div>${dis ? "" : tail || (typeof DOTS !== "undefined" ? DOTS : "")}</div>`;
  }

  function introScreen(p) {
    const last = p.lastResult
      ? `<div class="sec">${T("Last Election", "Última elección", "Última eleição")}</div>` +
        row("", E("1f4c9"), T("Last Result", "Último resultado", "Último resultado"), p.lastResult === "resigned" ? T("You resigned from office.", "Renunciaste al cargo.", "Você renunciou ao cargo.") : p.lastResult === "otherjob" ? T("You left politics for another job.", "Dejaste la política por otro trabajo.", "Você deixou a política por outro trabalho.") : T("You lost your last election.", "Perdiste tu última elección.", "Você perdeu sua última eleição."), true)
      : "";
    sList.innerHTML =
      `<div class="sec">${T("Politics", "Política", "Política")}</div>` +
      row("pStart", ICON, T("Start a Political Career", "Empezar una carrera política", "Começar uma carreira política"), T("Run for School Board and climb the ladder", "Postúlate a la junta escolar y sube la escalera", "Candidate-se ao conselho escolar e suba a escada")) +
      row("pLadder", E("1f4dc"), T("The Political Ladder", "La escalera política", "A escada política"), T("Ranks, powers, terms and salaries", "Rangos, poderes, términos y salarios", "Cargos, poderes, mandatos e salários")) +
      row("pHistory", E("1f4d6"), T("Career History", "Historial de la carrera", "Histórico da carreira"), T("Events and laws from your political career", "Eventos y leyes de tu carrera política", "Eventos e leis da sua carreira política")) +
      last;
    document.getElementById("pStart").onclick = () => (typeof play === "function" && play("choice"), startCareer());
    document.getElementById("pLadder").onclick = () => (typeof play === "function" && play("choice"), ladderCard());
    document.getElementById("pHistory").onclick = () => (typeof play === "function" && play("choice"), historyCard(p));
    sList.scrollTop = 0;
  }

  function startCareer() {
    if (window.FL_CAREERS && !window.FL_CAREERS.canStart("Politician")) return;
    if (state.prison) return notice(CAREER, T("You can't run for office from prison.", "No puedes postularte desde la cárcel.", "Você não pode se candidatar da prisão."), null, true);
    if (state.age < 18) return notice(CAREER, T("You must be at least 18 to run for office.", "Tienes que tener al menos 18 años para postularte.", "Você precisa ter pelo menos 18 anos para se candidatar."), null, true);
    const p = P();
    socSelCard({
      tag: CAREER,
      icon: ICON,
      title: T("Run for Office", "Postúlate a un cargo", "Candidate-se a um cargo"),
      lead: T("Every political career starts somewhere. Pick a party and announce your first run for the School Board.", "Toda carrera política empieza en algún lugar. Elige un partido y anuncia tu primera candidatura a la junta escolar.", "Toda carreira política começa em algum lugar. Escolha um partido e anuncie sua primeira candidatura ao conselho escolar."),
      label: T("Political party:", "Partido político:", "Partido político:"),
      opts: PARTIES.map((x) => x.name),
      btn: T("Announce my candidacy", "Anunciar mi candidatura", "Anunciar minha candidatura"),
      onGo: (i) => {
        const q = P();
        q.party = i;
        q.approval = 50;
        q.funds = 0;
        q.lastResult = null;
        campaignNameCard(q, () => announce(0, q));
      },
    });
  }

  function announce(rank, forced) {
    const p = forced || P();
    const o = OFFICES[rank];
    if (state.age < o.age) return notice(CAREER, `${T("You must be at least", "Tienes que tener al menos", "Você precisa ter pelo menos")} ${o.age} ${T("to run for this office.", "para postularte a este cargo.", "para se candidatar a este cargo.")}`, null, true);
    if (o.edu === "uni" && !(typeof hasUni === "function" && hasUni())) return notice(CAREER, T("You need a university degree to run for this office.", "Necesitas un título universitario para postularte a este cargo.", "Você precisa de um diploma universitário para se candidatar a este cargo."), null, true);
    p.candidate = { rank, year: year() + 1 };
    p.seek = rank;
    p.approval = clampN(p.approval ?? 50, 0, 100);
    say(`${T("I announced my candidacy for", "Anuncié mi candidatura para", "Anunciei minha candidatura para")} ${o.t}.`);
    jCard({
      tag: CAREER,
      iconSrc: o.icon,
      title: T("Announcement", "Anuncio", "Anúncio"),
      lead: T("You announced your candidacy. You have one year to campaign before Election Night.", "Anunciaste tu candidatura. Tienes un año para hacer campaña antes de la Noche de Elecciones.", "Você anunciou sua candidatura. Tem um ano para fazer campanha antes da Noite de Eleições."),
      rows: [
        [T("Political office", "Cargo político", "Cargo político"), o.t],
        [T("Campaign", "Campaña", "Campanha"), esc(campaignLabel(p))],
        [T("Political party", "Partido político", "Partido político"), PARTIES[p.party].name],
        [T("Election", "Elección", "Eleição"), String(year() + 1)],
        [T("Approval", "Aprobación", "Aprovação"), `${p.approval}%`],
      ],
      choices: [[T("Start campaigning", "Empezar la campaña", "Começar a campanha"), openPolitics]],
    });
  }

  function ladderCard() {
    jCard({
      tag: CAREER,
      iconSrc: ICON,
      title: T("The Political Ladder", "La escalera política", "A escada política"),
      lead: T("From local school boards to the White House. Each office has its own term, salary and powers.", "De las juntas escolares locales a la Casa Blanca. Cada cargo tiene su término, salario y poderes.", "Dos conselhos escolares locais à Casa Branca. Cada cargo tem seu mandato, salário e poderes."),
      rows: OFFICES.map((o) => [
        o.t,
        `<span>${T("Term in office", "Mandato", "Mandato")}</span> <span>${o.term}</span> <span>${T("years", "años", "anos")}</span> · <span>${money(o.pay)}/${T("year", "año", "ano")}</span> · ${o.powers.map((x) => `<span>${x}</span>`).join(" · ")}`,
      ]),
      choices: [[T("OK", "Listo", "Certo"), openPolitics]],
    });
  }

  function powersCard(p, o) {
    jCard({
      tag: CAREER,
      iconSrc: o.icon,
      title: o.t,
      lead: o.about,
      rows: [
        [T("Term in office", "Mandato", "Mandato"), `${o.term} ${T("years", "años", "anos")}`],
        [T("Salary", "Salario", "Salário"), `${money(o.pay)}/${T("year", "año", "ano")}`],
        [T("Powers", "Poderes", "Poderes"), o.powers.map((x) => `<span>${x}</span>`).join(" · ")],
        [T("Next election", "Próxima elección", "Próxima eleição"), p.termEnd != null ? String(p.termEnd) : T("Not in office", "No estás en el cargo", "Você não está no cargo")],
      ],
      choices: [[T("OK", "Listo", "Certo"), openPolitics]],
    });
  }

  function historyCard(p) {
    const history = (p.history || []).slice(-40).reverse();
    const rows = history.length
      ? history.map((h) => {
          const kind = h.kind === "law" ? T("Law", "Ley", "Lei") : T("Event", "Evento", "Evento");
          const label = `<span>${h.year}</span> · <span>${kind}</span>`;
          const value = `<span>${esc(h.title)}</span>${h.detail ? ` · <span>${esc(h.detail)}</span>` : ""}`;
          return [label, value];
        })
      : [[T("No history yet", "Todavía no hay historial", "Ainda não há histórico"), T("Events and laws will appear here.", "Los eventos y las leyes van a aparecer aquí.", "Os eventos e as leis vão aparecer aqui.")]];
    jCard({
      tag: CAREER,
      iconSrc: E("1f4d6"),
      title: T("Career History", "Historial de la carrera", "Histórico da carreira"),
      lead: T("Your annual events and the laws you passed, newest first.", "Tus eventos anuales y las leyes que aprobaste, primero lo más reciente.", "Seus eventos anuais e as leis que você aprovou, primeiro o mais recente."),
      rows,
      choices: [[T("OK", "Listo", "Certo"), openPolitics]],
    });
  }

  function candidateScreen(p) {
    const o = OFFICES[p.candidate.rank];
    const left = MAX_ACTS - p.yr.acts;
    const inYears = Math.max(0, p.candidate.year - year());
    const actions = ACTIONS.filter((a) => !a.branch && (!a.when || a.when(p, o)));
    sList.innerHTML =
      `<div class="sec">${T("My Campaign", "Mi campaña", "Minha campanha")}</div>` +
      row("pCand", o.icon, `${T("Candidate for", "Candidato a", "Candidato a")} ${o.t}`, `${PARTIES[p.party].name} · ${T("Approval", "Aprobación", "Aprovação")} ${p.approval}%`, false, " ") +
      row("pName", E("1f3f7-fe0f"), T("Campaign Name", "Nombre de la campaña", "Nome da campanha"), esc(campaignLabel(p)), false, typeof CHEV !== "undefined" ? CHEV : "") +
      row("pFunds", E("1f4b0"), T("Campaign Funds", "Fondos de campaña", "Fundos de campanha"), money(p.funds || 0), false, " ") +
      row("pSelfFund", E("1f4b5"), T("Add Personal Funds", "Añadir fondos personales", "Adicionar fundos pessoais"), T("Put your own money into the campaign", "Pon tu propio dinero en la campaña", "Coloque seu próprio dinheiro na campanha"), false, typeof CHEV !== "undefined" ? CHEV : "") +
      row("pElection", E("1f4c5"), T("Election", "Elección", "Eleição"), inYears ? `${T("Election in", "Elección en", "Eleição em")} ${inYears} ${inYears === 1 ? T("year", "año", "ano") : T("years", "años", "anos")}` : T("Election this year", "Elección este año", "Eleição este ano"), false, " ") +
      row("pHistory", E("1f4d6"), T("Career History", "Historial de la carrera", "Histórico da carreira"), T("Events and laws from your political career", "Eventos y leyes de tu carrera política", "Eventos e leis da sua carreira política"), false, typeof CHEV !== "undefined" ? CHEV : "") +
      `<div class="sec">${T("Campaign Actions", "Acciones de campaña", "Ações de campanha")} (${left} ${T("left", "restantes", "restantes")})</div>` +
      actions.map((a) => row(`pA_${a.id}`, a.icon, a.t, a.free || left > 0 ? a.s : T("No actions left this year", "No te quedan acciones este año", "Não restam ações este ano"), !a.free && left <= 0)).join("") +
      `<div class="sec">${T("Get Out", "Salir", "Sair")}</div>` +
      row("pWithdraw", E("1f6aa"), T("Withdraw Candidacy", "Retirar la candidatura", "Retirar a candidatura"), T("End your campaign", "Termina tu campaña", "Encerre sua campanha"));
    for (const a of actions) {
      const el = document.getElementById(`pA_${a.id}`);
      if (el && !el.classList.contains("dis")) el.onclick = () => doAction(a);
    }
    const nameEl = document.getElementById("pName");
    if (nameEl) nameEl.onclick = () => (typeof play === "function" && play("choice"), campaignNameCard(p, openPolitics));
    const selfEl = document.getElementById("pSelfFund");
    if (selfEl) selfEl.onclick = () => (typeof play === "function" && play("choice"), selfFundCard(p));
    const historyEl = document.getElementById("pHistory");
    if (historyEl) historyEl.onclick = () => (typeof play === "function" && play("choice"), historyCard(p));
    document.getElementById("pWithdraw").onclick = () => {
      if (typeof play === "function") play("choice");
      iosConfirm(T("Withdraw", "Retirarte", "Desistir"), T("Withdrawing ends your campaign. You can run again next year.", "Si te retiras, termina tu campaña. Puedes postularte otra vez el próximo año.", "Se desistir, sua campanha termina. Você pode se candidatar de novo no próximo ano."), () => {
        p.candidate = null;
        p.seek = null;
        card(T("Campaign Over", "Campaña terminada", "Campanha encerrada"), T("You withdrew from the race.", "Te retiraste de la contienda.", "Você desistiu da disputa."), []);
      });
    };
    sList.scrollTop = 0;
  }

  function nextOfficeReason(p) {
    const next = OFFICES[p.rank + 1];
    if (!next) return T("You already hold the highest office.", "Ya tienes el cargo más alto.", "Você já tem o cargo mais alto.");
    if (state.age < next.age) return `${T("You must be at least", "Tienes que tener al menos", "Você precisa ter pelo menos")} ${next.age}.`;
    if (next.edu === "uni" && !(typeof hasUni === "function" && hasUni())) return T("You need a university degree.", "Necesitas un título universitario.", "Você precisa de um diploma universitário.");
    if (p.approval < (next.minApproval || 45)) return `${T("You need at least", "Necesitas al menos", "Você precisa de pelo menos")} ${next.minApproval || 45}% ${T("approval.", "de aprobación.", "de aprovação.")}`;
    return "";
  }

  function officeScreen(p) {
    const o = OFFICES[p.rank];
    if (!o) return introScreen(p);
    const left = MAX_ACTS - p.yr.acts;
    const next = OFFICES[p.rank + 1];
    const electionIn = p.termEnd != null ? Math.max(0, p.termEnd - year()) : 0;
    const actions = ACTIONS.filter((a) => (!a.branch || a.branch === o.branch) && (a.min || 0) <= p.rank && (!a.when || a.when(p, o)));
    const powerPreview = o.powers.slice(0, 2).map((x) => `<em style="font-style:normal">${x}</em>`).join(" · ");
    const electionRows = (() => {
      if (p.seek != null && p.seek !== p.rank) {
        return row("pSeek", E("1f4c8"), `${T("Running for", "Postulado a", "Candidato a")} ${OFFICES[p.seek].t}`, `${T("Election in", "Elección en", "Eleição em")} ${Math.max(0, p.termEnd - year())} ${T("years", "años", "anos")} · ${T("Tap to switch back to re-election", "Toca para volver a la reelección", "Toque para voltar à reeleição")}`, false, typeof CHEV !== "undefined" ? CHEV : "");
      }
      if (isElectionSeason(p)) {
        const reason = next ? nextOfficeReason(p) : "";
        return row("pReelect", E("1f5f3-fe0f"), T("Run for Re-election", "Postúlate a la reelección", "Candidate-se à reeleição"), T("Ask the voters for another term", "Pídele a los votantes otro término", "Peça aos eleitores outro mandato")) +
          (next ? row("pNext", E("1f4c8"), `${T("Run for", "Postúlate a", "Candidate-se a")} ${next.t}`, reason || T("Risk your seat for a higher office", "Arriesga tu escaño por un cargo más alto", "Arrisque seu assento por um cargo mais alto"), !!reason) : "");
      }
      return row("", E("1f4c5"), T("Next Election", "Próxima elección", "Próxima eleição"), `${p.termEnd != null ? `${p.termEnd} · ` : ""}${electionIn} ${electionIn === 1 ? T("year", "año", "ano") : T("years", "años", "anos")}`, true);
    })();
    sList.innerHTML =
      `<div class="sec">${T("My Office", "Mi cargo", "Meu cargo")}</div>` +
      row("pOffice", o.icon, o.t, `${PARTIES[p.party].name} · ${T("Approval", "Aprobación", "Aprovação")} ${p.approval}%`, false, " ") +
      row("pName", E("1f3f7-fe0f"), T("Campaign Name", "Nombre de la campaña", "Nome da campanha"), esc(campaignLabel(p)), false, typeof CHEV !== "undefined" ? CHEV : "") +
      row("pFunds", E("1f4b0"), T("Campaign Funds", "Fondos de campaña", "Fundos de campanha"), money(p.funds || 0), false, " ") +
      row("pSelfFund", E("1f4b5"), T("Add Personal Funds", "Añadir fondos personales", "Adicionar fundos pessoais"), T("Put your own money into the campaign", "Pon tu propio dinero en la campaña", "Coloque seu próprio dinheiro na campanha"), false, typeof CHEV !== "undefined" ? CHEV : "") +
      row("pTerm", E("1f4c5"), T("Term in office", "Mandato", "Mandato"), `${p.termStart || "?"}–${p.termEnd || "?"} · ${electionIn ? `${T("Election in", "Elección en", "Eleição em")} ${electionIn} ${electionIn === 1 ? T("year", "año", "ano") : T("years", "años", "anos")}` : T("Election this year", "Elección este año", "Eleição este ano")}`, false, " ") +
      row("pPowers", E("1f4dc"), T("Powers of the Office", "Poderes del cargo", "Poderes do cargo"), powerPreview, false, typeof CHEV !== "undefined" ? CHEV : "") +
      row("pHistory", E("1f4d6"), T("Career History", "Historial de la carrera", "Histórico da carreira"), T("Events and laws from your political career", "Eventos y leyes de tu carrera política", "Eventos e leis da sua carreira política"), false, typeof CHEV !== "undefined" ? CHEV : "") +
      `<div class="sec">${T("Actions", "Acciones", "Ações")} (${left} ${T("left", "restantes", "restantes")})</div>` +
      actions.map((a) => row(`pA_${a.id}`, a.icon, a.t, a.free || left > 0 ? a.s : T("No actions left this year", "No te quedan acciones este año", "Não restam ações este ano"), !a.free && left <= 0)).join("") +
      `<div class="sec">${T("Election", "Elección", "Eleição")}</div>` + electionRows +
      `<div class="sec">${T("Leave Office", "Salir del cargo", "Sair do cargo")}</div>` +
      row("pResign", E("1f6aa"), T("Resign", "Renunciar", "Renunciar"), T("End your political career", "Termina tu carrera política", "Encerre sua carreira política"));
    for (const a of actions) {
      const el = document.getElementById(`pA_${a.id}`);
      if (el && !el.classList.contains("dis")) el.onclick = () => doAction(a);
    }
    const nameEl = document.getElementById("pName");
    if (nameEl) nameEl.onclick = () => (typeof play === "function" && play("choice"), campaignNameCard(p, openPolitics));
    const selfEl = document.getElementById("pSelfFund");
    if (selfEl) selfEl.onclick = () => (typeof play === "function" && play("choice"), selfFundCard(p));
    const powers = document.getElementById("pPowers");
    if (powers) powers.onclick = () => (typeof play === "function" && play("choice"), powersCard(p, o));
    const historyEl = document.getElementById("pHistory");
    if (historyEl) historyEl.onclick = () => (typeof play === "function" && play("choice"), historyCard(p));
    const reelect = document.getElementById("pReelect");
    if (reelect) reelect.onclick = () => {
      if (typeof play === "function") play("choice");
      p.seek = p.rank;
      card(T("Re-election", "Reelección", "Reeleição"), T("You will run for re-election when your term ends.", "Vas a ir a la reelección cuando termine tu término.", "Você vai disputar a reeleição quando seu mandato terminar."), [[T("Political office", "Cargo político", "Cargo político"), o.t], [T("Election", "Elección", "Eleição"), String(p.termEnd)]]);
    };
    const seekEl = document.getElementById("pSeek");
    if (seekEl) seekEl.onclick = () => {
      if (typeof play === "function") play("choice");
      p.seek = p.rank;
      card(T("Re-election", "Reelección", "Reeleição"), T("You switched back to running for re-election.", "Volviste a postularte a la reelección.", "Você voltou a disputar a reeleição."), [[T("Political office", "Cargo político", "Cargo político"), o.t]]);
    };
    const nextEl = document.getElementById("pNext");
    if (nextEl && next) nextEl.onclick = () => {
      if (typeof play === "function") play("choice");
      if (nextOfficeReason(p)) return notice(CAREER, nextOfficeReason(p), null, true);
      p.seek = p.rank + 1;
      card(T("Higher Office", "Cargo más alto", "Cargo mais alto"), T("You will run for the higher office when your term ends. If you lose, you lose your current seat too.", "Vas a postularte al cargo más alto cuando termine tu término. Si pierdes, también pierdes tu escaño actual.", "Você vai disputar o cargo mais alto quando seu mandato terminar. Se perder, também perde sua cadeira atual."), [[T("Political office", "Cargo político", "Cargo político"), next.t], [T("Election", "Elección", "Eleição"), String(p.termEnd)]]);
    };
    document.getElementById("pResign").onclick = () => {
      if (typeof play === "function") play("choice");
      iosConfirm(T("Resign", "Renunciar", "Renunciar"), T("Resigning ends your political career. Are you sure?", "Si renuncias, termina tu carrera política. ¿Estás seguro?", "Se renunciar, sua carreira política termina. Tem certeza?"), () => {
        const old = o.t;
        leaveOffice(p, "resigned");
        say(`${T("I resigned as", "Renuncié como", "Renunciei como")} ${old}.`);
        card(T("Resigned", "Renunciaste", "Renunciou"), T("You resigned from office.", "Renunciaste al cargo.", "Você renunciou ao cargo."), [], () => (typeof openOccupation === "function" ? openOccupation() : null));
      });
    };
    sList.scrollTop = 0;
  }

  function openPolitics() {
    const p = P();
    if (state.prison) return notice(CAREER, T("You can't run a political career from prison.", "No puedes manejar una carrera política desde la cárcel.", "Você não pode tocar uma carreira política da prisão."), null, true);
    screen.classList.add("open");
    sTitle.textContent = T("POLITICS", "POLÍTICA", "POLÍTICA");
    sSub.style.display = "none";
    sBack.innerHTML = typeof BACK_ICON !== "undefined" ? BACK_ICON : "‹";
    sBack.onclick = () => (typeof openOccupation === "function" ? openOccupation() : screen.classList.remove("open"));
    if (p.active) return officeScreen(p);
    if (p.candidate) return candidateScreen(p);
    return introScreen(p);
  }

  // ---------------------------------------------------------------- motor anual
  function doAction(a) {
    const p = P();
    if (!p.active && !p.candidate) return openPolitics();
    if (!a.free && p.yr.acts >= MAX_ACTS) return notice(CAREER, T("You have no actions left this year.", "No te quedan acciones este año.", "Não restam ações este ano."), null, true);
    if (a.topic === false) {
      if (!a.free) p.yr.acts++;
      if (typeof play === "function") play("choice");
      return a.run(p, currentOffice(p));
    }
    chooseTopic(a, p, currentOffice(p));
  }

  function yearTick() {
    const p = state.politics;
    if (!p || !p.v || state.dead) return;
    if (p.active && !state.prison && (!state.job || !state.job.politician)) {
      leaveOffice(p, "otherjob");
      say(T("I left politics to take another job.", "Dejé la política por otro trabajo.", "Deixei a política por outro trabalho."));
    }
    if (state.prison) {
      p.yr = { age: state.age, acts: 0 };
      return;
    }
    if (p.active) {
      p.yrs = (p.yrs || 0) + 1;
      if (state.job && state.job.politician) {
        state.job.yrs = (state.job.yrs || 0) + 1;
        state.job.perf = p.approval;
        state.job.pay = officeSalary(OFFICES[p.rank]);
      }
    }
    let due = null;
    if (p.candidate && year() >= p.candidate.year) due = p.candidate.rank;
    else if (p.active && p.termEnd != null && year() >= p.termEnd) due = p.seek != null ? p.seek : p.rank;
    if (due != null) {
      if (p.candidate) p.candidate = null;
      const res = resolveElection(due);
      const q = (fn) => (typeof queuePopup === "function" ? queuePopup(fn) : setTimeout(fn, 600));
      q(() => showElection(res));
    } else {
      let drift = p.yr && p.yr.acts ? 0 : -2;
      if (p.approval < 40) drift += 1;
      if (p.approval > 60) drift -= 1;
      p.approval = clampN(p.approval + drift, 0, 100);
      if (p.active && state.job && state.job.politician) state.job.perf = p.approval;
    }
    p.yr = { age: state.age, acts: 0 };
    if ((p.active || p.candidate) && !p.eventPending && p.eventYear !== year()) {
      p.eventYear = year();
      p.eventPending = true;
      const ev = chooseAnnualEvent(p);
      const q = (fn) => (typeof queuePopup === "function" ? queuePopup(fn) : setTimeout(fn, 600));
      q(() => annualEventCard(p, ev));
    }
    if (typeof renderStats === "function") renderStats();
  }

  // ---------------------------------------------------------------- enganches
  function boot() {
    if (typeof openSpecialCareers !== "function" || typeof openJobScreen !== "function" || !document.getElementById("ageBtn") || typeof sList === "undefined") return setTimeout(boot, 60);
    const origSpecial = window.openSpecialCareers;
    window.openSpecialCareers = function () {
      const result = origSpecial.apply(this, arguments);
      try {
        const p = state.politics;
        const sub = p && p.active
          ? `${OFFICES[p.rank].t} · ${T("Approval", "Aprobación", "Aprovação")} ${p.approval}%`
          : p && p.candidate
            ? `${T("Candidate for", "Candidato a", "Candidato a")} ${OFFICES[p.candidate.rank].t}`
            : T("Run for office and climb the political ladder", "Postúlate y sube la escalera política", "Candidate-se e suba a escada política");
        // Si el juego ya trae la fila "Politician" en Special Careers, la reutilizamos:
        // así el jugador no tiene que buscar una fila nueva y el pack deja de dar el error.
        const base = sList.querySelector('[data-pack="politician"]');
        if (base) {
          base.classList.remove("dis");
          const span = base.querySelector(".t span");
          if (span) span.innerHTML = sub;
          if (typeof CHEV !== "undefined" && !base.querySelector(".chev")) base.insertAdjacentHTML("beforeend", CHEV);
          base.onclick = () => (typeof play === "function" && play("choice"), openPolitics());
        } else {
          const html = `<div class="row sp-pack" id="spPolitician"><img src="${ICON}" alt=""><div class="t"><b>${CAREER}</b><span>${sub}</span></div>${typeof CHEV !== "undefined" ? CHEV : ""}</div>`;
          const first = sList.querySelector(".sp-pack");
          first ? first.insertAdjacentHTML("beforebegin", html) : sList.insertAdjacentHTML("beforeend", html);
          document.getElementById("spPolitician").onclick = () => (typeof play === "function" && play("choice"), openPolitics());
        }
      } catch (err) {
        console.warn("[politician] menu", err);
      }
      return result;
    };
    const origJob = window.openJobScreen;
    window.openJobScreen = function () {
      if (state.job && state.job.politician) return openPolitics();
      return origJob.apply(this, arguments);
    };
    document.getElementById("ageBtn").addEventListener("click", () =>
      setTimeout(() => {
        try {
          yearTick();
        } catch (err) {
          console.warn("[politician] tick", err);
        }
      }, 0),
    );
    window.FL_POLITICS = {
      open: openPolitics,
      state: () => state.politics,
      tick: yearTick,
      election: (rank) => showElection(resolveElection(rank)),
      offices: OFFICES,
      actions: ACTIONS,
      act: doAction,
      start: startCareer,
      announce,
      events: ANNUAL_EVENTS,
      topics: TOPICS,
      debate: startDebate,
      selfFund: selfFundCard,
      rename: campaignNameCard,
      history: historyCard,
    };
  }

  boot();
})();
