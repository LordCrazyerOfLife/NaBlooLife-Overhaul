/*! Copyright (c) 2026 Free Life. All rights reserved. Unauthorized copying, re-hosting or redistribution of this code is prohibited. */
!(function (a) {
  const e = 1 / 0,
    t = {
      us: {
        name: "United States",
        deduction: 14600,
        childCredit: 2e3,
        hasStates: !0,
        healthPremium: 1200,
        brackets: [
          [11600, 0.1],
          [47150, 0.12],
          [100525, 0.22],
          [191950, 0.24],
          [243725, 0.32],
          [609350, 0.35],
          [e, 0.37],
        ],
        payroll: [
          { name: "Social Security", rate: 0.062, cap: 168600 },
          { name: "Medicare", rate: 0.0145 },
        ],
      },
      gb: {
        name: "United Kingdom",
        deduction: 0,
        childCredit: 0,
        brackets: [
          [12570, 0],
          [50270, 0.2],
          [125140, 0.4],
          [e, 0.45],
        ],
        payroll: [
          {
            name: "National Insurance",
            brackets: [
              [12570, 0],
              [50270, 0.08],
              [e, 0.02],
            ],
          },
        ],
      },
      ca: {
        name: "Canada",
        deduction: 15705,
        childCredit: 1500,
        brackets: [
          [55867, 0.15],
          [111733, 0.205],
          [173205, 0.26],
          [246752, 0.29],
          [e, 0.33],
        ],
        regional: {
          name: "Provincial tax",
          brackets: [
            [51446, 0.0505],
            [102894, 0.0915],
            [15e4, 0.1116],
            [22e4, 0.1216],
            [e, 0.1316],
          ],
        },
        payroll: [
          { name: "CPP", rate: 0.0595, cap: 68500 },
          { name: "EI", rate: 0.0166, cap: 63200 },
        ],
      },
      au: {
        name: "Australia",
        deduction: 0,
        childCredit: 0,
        brackets: [
          [18200, 0],
          [45e3, 0.19],
          [12e4, 0.325],
          [18e4, 0.37],
          [e, 0.45],
        ],
        payroll: [{ name: "Medicare levy", rate: 0.02 }],
      },
      de: {
        name: "Germany",
        deduction: 0,
        childCredit: 0,
        brackets: [
          [11604, 0],
          [17005, 0.14],
          [66760, 0.3],
          [277825, 0.42],
          [e, 0.45],
        ],
        payroll: [{ name: "Social insurance", rate: 0.2, cap: 90600 }],
      },
      ae: { name: "United Arab Emirates", deduction: 0, childCredit: 0, brackets: [[e, 0]], payroll: [] },
      sa: {
        name: "Saudi Arabia",
        deduction: 0,
        childCredit: 0,
        brackets: [[e, 0]],
        payroll: [{ name: "GOSI", rate: 0.0975, cap: 54e4 }],
      },
      mc: {
        name: "Monaco",
        deduction: 0,
        childCredit: 0,
        brackets: [[e, 0]],
        payroll: [{ name: "Social charges", rate: 0.13 }],
      },
      default: {
        name: "Standard",
        deduction: 0,
        childCredit: 0,
        brackets: [
          [1e4, 0],
          [4e4, 0.15],
          [1e5, 0.25],
          [e, 0.35],
        ],
        payroll: [{ name: "Payroll tax", rate: 0.07 }],
      },
    },
    n = ["AK", "FL", "NV", "TN", "TX", "WA", "SD", "WY", "NH"],
    o = {
      CA: [
        [10756, 0.01],
        [25499, 0.02],
        [40245, 0.04],
        [55866, 0.06],
        [70606, 0.08],
        [360659, 0.093],
        [432787, 0.103],
        [721314, 0.113],
        [e, 0.123],
      ],
      NY: [
        [8500, 0.04],
        [11700, 0.045],
        [13900, 0.0525],
        [80650, 0.055],
        [215400, 0.06],
        [1077550, 0.0685],
        [e, 0.103],
      ],
      HI: [
        [9600, 0.014],
        [24e3, 0.064],
        [48e3, 0.079],
        [15e4, 0.0825],
        [e, 0.11],
      ],
      OR: [
        [4300, 0.0475],
        [10750, 0.0675],
        [125e3, 0.0875],
        [e, 0.099],
      ],
      MN: [
        [31690, 0.0535],
        [104090, 0.068],
        [193240, 0.0785],
        [e, 0.0985],
      ],
      DC: [
        [1e4, 0.04],
        [4e4, 0.06],
        [6e4, 0.065],
        [25e4, 0.085],
        [e, 0.0975],
      ],
    },
    i = {
      IL: 0.0495,
      MA: 0.05,
      CO: 0.044,
      GA: 0.0549,
      MI: 0.0425,
      PA: 0.0307,
      NC: 0.045,
      AZ: 0.025,
      IN: 0.0305,
      KY: 0.04,
      MO: 0.048,
      LA: 0.0425,
      OK: 0.0475,
      NE: 0.0584,
      UT: 0.0465,
      MD: 0.0475,
      WI: 0.053,
      OH: 0.035,
      MS: 0.047,
    },
    r = {
      Anchorage: "AK",
      Atlanta: "GA",
      Austin: "TX",
      Baltimore: "MD",
      Biloxi: "MS",
      Boston: "MA",
      Brooklyn: "NY",
      Charlotte: "NC",
      Chicago: "IL",
      Cleveland: "OH",
      Dallas: "TX",
      Denver: "CO",
      Detroit: "MI",
      Honolulu: "HI",
      Houston: "TX",
      Indianapolis: "IN",
      Jacksonville: "FL",
      "Kansas City": "MO",
      "Las Vegas": "NV",
      "Los Angeles": "CA",
      Louisville: "KY",
      Memphis: "TN",
      Miami: "FL",
      Milwaukee: "WI",
      Minneapolis: "MN",
      Nashville: "TN",
      "New Orleans": "LA",
      "New York City": "NY",
      "Oklahoma City": "OK",
      Omaha: "NE",
      Orlando: "FL",
      Philadelphia: "PA",
      Phoenix: "AZ",
      Pittsburgh: "PA",
      Portland: "OR",
      "Salt Lake City": "UT",
      "San Antonio": "TX",
      "San Diego": "CA",
      "San Francisco": "CA",
      Seattle: "WA",
      "St. Louis": "MO",
      Tampa: "FL",
      "Washington, D.C.": "DC",
    },
    l = (a) => Math.round(a);
  function s(a, e) {
    let t = 0,
      n = 0;
    for (const [o, i] of e) {
      if (a <= n) break;
      (t += (Math.min(a, o) - n) * i), (n = o);
    }
    return t;
  }
  const c = (a) => r[a] || null;
  function d(a) {
    const e = Math.max(0, Math.min(12, a.months ?? 12)),
      t = ((a.annualSalary || 0) * e) / 12,
      n = (a.overtime || 0) + (a.tips || 0) + (a.commission || 0) + (a.bonus || 0);
    return { base: l(t), extras: l(n), total: l(t + n), payroll: "pension" !== a.payType };
  }
  function u0({ country: a = "us", usState: r = null, jobs: c = [], pretax: u = 0, kids: m = 0 } = {}) {
    const p = ((a) => t[a] || t.default)(a),
      h = c.filter((a) => !1 !== a.active).map((a) => ({ job: a, ...d(a) })),
      y = h.reduce((a, e) => a + e.total, 0),
      b = h.filter((a) => a.payroll).reduce((a, e) => a + e.total, 0),
      A = Math.min(y, Math.max(0, u)),
      T = Math.max(0, y - A - p.deduction),
      x = Math.min(p.childCredit * m, s(T, p.brackets)),
      S = Math.max(0, s(T, p.brackets) - x),
      M = p.hasStates
        ? (function (a, e) {
            return !a || n.includes(a) ? 0 : o[a] ? s(e, o[a]) : e * (i[a] || 0.05);
          })(r, Math.max(0, y - A))
        : p.regional
          ? s(T, p.regional.brackets)
          : 0,
      k = Math.max(0, b - A),
      C = (p.payroll || []).map((a) => ({
        name: a.name,
        amount: l(a.brackets ? s(k, a.brackets) : Math.min(k, a.cap ?? e) * a.rate),
      })),
      g = C.reduce((a, e) => a + e.amount, 0),
      f = l(S) + l(M) + g,
      N = y - A - f;
    return {
      country: p.name,
      usState: r,
      gross: y,
      pretax: A,
      taxable: l(T),
      credits: l(x),
      incomeTax: l(S),
      regionalTax: l(M),
      regionalName: p.hasStates ? "State income tax" : p.regional ? p.regional.name : null,
      payroll: g,
      payrollLines: C,
      totalTax: f,
      net: N,
      effective: y ? f / y : 0,
      jobs: h.map((a) => ({ title: a.job.title, base: a.base, extras: a.extras, total: a.total })),
    };
  }
  // [mod] brackets, deductions and credits are 2026 dollars: deflate the income, tax it, inflate the result,
  // so 3%/yr wage inflation does not push everybody into the top bracket.
  function u(opts = {}) {
    const k = typeof a.inflFx === "function" ? a.inflFx() : 1;
    if (!k || k === 1 || !isFinite(k)) return u0(opts);
    const dj = (j) => ({
      ...j,
      annualSalary: (j.annualSalary || 0) / k,
      overtime: (j.overtime || 0) / k,
      tips: (j.tips || 0) / k,
      commission: (j.commission || 0) / k,
      bonus: (j.bonus || 0) / k,
    });
    const r = u0({ ...opts, jobs: (opts.jobs || []).map(dj), pretax: (opts.pretax || 0) / k });
    const up = (x) => Math.round((x || 0) * k);
    return {
      ...r,
      gross: up(r.gross),
      pretax: up(r.pretax),
      taxable: up(r.taxable),
      credits: up(r.credits),
      incomeTax: up(r.incomeTax),
      regionalTax: up(r.regionalTax),
      payroll: up(r.payroll),
      payrollLines: r.payrollLines.map((l) => ({ ...l, amount: up(l.amount) })),
      totalTax: up(r.totalTax),
      net: up(r.net),
      jobs: r.jobs.map((j) => ({ ...j, base: up(j.base), extras: up(j.extras), total: up(j.total) })),
    };
  }
  const m = {
    PROFILES: t,
    US_STATES: o,
    FLAT_STATE: i,
    NO_STATE_TAX: n,
    CITY_STATE: r,
    bracketTax: s,
    stateFor: c,
    jobEarnings: d,
    calculate: u,
    settleAnnualJobPay: function (a, e, t = {}) {
      const n = (a.taxHistory ||= []);
      if (n.some((a) => a.year === e)) return { skipped: !0, reason: "already paid for this year" };
      const o = u({
        country: a.country,
        usState: a.usState ?? c(a.city),
        jobs: a.jobs || [],
        pretax: t.pretax || 0,
        kids: t.kids || 0,
      });
      return o.gross
        ? ("bankBalance" in a && !("money" in a) ? (a.bankBalance += o.net) : (a.money += o.net),
          n.push({
            year: e,
            age: a.age,
            gross: o.gross,
            tax: o.totalTax,
            net: o.net,
            incomeTax: o.incomeTax,
            regionalTax: o.regionalTax,
            payroll: o.payroll,
          }),
          n.length > 120 && n.shift(),
          o)
        : { skipped: !0, reason: "no income" };
    },
  };
  "undefined" != typeof module && module.exports && (module.exports = m), (a.BitLifeTaxEngine = m);
})("undefined" != typeof window ? window : globalThis);
