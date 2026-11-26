/* [mod] Motor de ajedrez para el mod Chess Career (NaBlooLife). Original, sin dependencias.
 * Tablero 0x88 (a8 = 0, h1 = 119), generación de movidas legales, reglas completas
 * (enroque, al paso, promoción, mate, ahogado, material insuficiente, 50 movidas, triple repetición),
 * SAN, FEN, y un bot negamax + alpha-beta + quiescencia con fuerza ajustable por Elo.
 * Funciona en el navegador (window.FL_ENGINE) y en Node (module.exports) para tests y generar puzzles.
 */
(function (root) {
  "use strict";

  const P = 1, N = 2, B = 3, R = 4, Q = 5, K = 6, BLACK = 8;
  const F_CAP = 1, F_EP = 2, F_BIG = 4, F_KC = 8, F_QC = 16, F_PROMO = 32;
  const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const N_OFF = [-33, -31, -18, -14, 14, 18, 31, 33];
  const B_OFF = [-17, -15, 15, 17];
  const R_OFF = [-16, -1, 1, 16];
  const K_OFF = [-17, -16, -15, -1, 1, 15, 16, 17];
  const CHARS = " pnbrqk";
  const VAL = [0, 100, 320, 330, 500, 900, 0];

  const sqName = (s) => "abcdefgh"[s & 7] + (8 - (s >> 4));
  const sqIdx = (n) => (8 - +n[1]) * 16 + "abcdefgh".indexOf(n[0]);
  const type = (p) => p & 7;
  const col = (p) => p & 8;

  class Game {
    constructor(fen = START) {
      this.load(fen);
    }

    load(fen) {
      const [pos, turn, cas, ep, half, full] = fen.trim().split(/\s+/);
      this.b = new Array(128).fill(0);
      this.kings = [-1, -1];
      let s = 0;
      for (const ch of pos) {
        if (ch === "/") s += 8;
        else if (/\d/.test(ch)) s += +ch;
        else {
          const lo = ch.toLowerCase();
          const p = CHARS.indexOf(lo) | (ch === lo ? BLACK : 0);
          this.b[s] = p;
          if (type(p) === K) this.kings[col(p) ? 1 : 0] = s;
          s++;
        }
      }
      this.turn = turn === "b" ? BLACK : 0;
      this.castle = (cas.includes("K") ? 1 : 0) | (cas.includes("Q") ? 2 : 0) | (cas.includes("k") ? 4 : 0) | (cas.includes("q") ? 8 : 0);
      this.ep = ep && ep !== "-" ? sqIdx(ep) : -1;
      this.half = +half || 0;
      this.full = +full || 1;
      this.hist = [];
      this.keys = [this.key()];
      return this;
    }

    fen() {
      let out = "";
      for (let r = 0; r < 8; r++) {
        let empty = 0;
        for (let f = 0; f < 8; f++) {
          const p = this.b[r * 16 + f];
          if (!p) {
            empty++;
            continue;
          }
          if (empty) (out += empty), (empty = 0);
          const c = CHARS[type(p)];
          out += col(p) ? c : c.toUpperCase();
        }
        if (empty) out += empty;
        if (r < 7) out += "/";
      }
      const cas = (this.castle & 1 ? "K" : "") + (this.castle & 2 ? "Q" : "") + (this.castle & 4 ? "k" : "") + (this.castle & 8 ? "q" : "") || "-";
      return `${out} ${this.turn ? "b" : "w"} ${cas} ${this.ep >= 0 ? sqName(this.ep) : "-"} ${this.half} ${this.full}`;
    }

    key() {
      // posición para la triple repetición (sin relojes de movidas)
      let k = "";
      for (let s = 0; s < 120; s++) if (!(s & 0x88)) k += CHARS[type(this.b[s])] + (col(this.b[s]) ? "1" : "0");
      return k + this.turn + "." + this.castle + "." + this.ep;
    }

    attacked(sq, by) {
      const b = this.b;
      // peones
      if (by === 0) {
        for (const d of [15, 17]) {
          const s = sq + d;
          if (!(s & 0x88) && b[s] === P) return true;
        }
      } else {
        for (const d of [-15, -17]) {
          const s = sq + d;
          if (!(s & 0x88) && b[s] === (P | BLACK)) return true;
        }
      }
      for (const d of N_OFF) {
        const s = sq + d;
        if (!(s & 0x88) && b[s] === (N | by)) return true;
      }
      for (const d of K_OFF) {
        const s = sq + d;
        if (!(s & 0x88) && b[s] === (K | by)) return true;
      }
      for (const d of B_OFF) {
        let s = sq + d;
        while (!(s & 0x88)) {
          const p = b[s];
          if (p) {
            if (col(p) === by && (type(p) === B || type(p) === Q)) return true;
            break;
          }
          s += d;
        }
      }
      for (const d of R_OFF) {
        let s = sq + d;
        while (!(s & 0x88)) {
          const p = b[s];
          if (p) {
            if (col(p) === by && (type(p) === R || type(p) === Q)) return true;
            break;
          }
          s += d;
        }
      }
      return false;
    }

    inCheck(side = this.turn) {
      return this.attacked(this.kings[side ? 1 : 0], side ^ BLACK);
    }

    pseudo(capturesOnly = false) {
      const b = this.b, us = this.turn, them = us ^ BLACK, out = [];
      const add = (from, to, flags, promo) => {
        const piece = b[from];
        if (type(piece) === P && (to >> 4 === 0 || to >> 4 === 7)) {
          for (const pr of [Q, R, B, N]) out.push({ from, to, piece, cap: b[to], flags: flags | F_PROMO, promo: pr | us });
        } else out.push({ from, to, piece, cap: flags & F_EP ? P | them : b[to], flags, promo: 0 });
      };
      for (let s = 0; s < 120; s++) {
        if (s & 0x88) {
          s += 7;
          continue;
        }
        const p = b[s];
        if (!p || col(p) !== us) continue;
        const t = type(p);
        if (t === P) {
          const dir = us ? 16 : -16;
          const one = s + dir;
          if (!capturesOnly && !(one & 0x88) && !b[one]) {
            add(s, one, 0);
            const startRank = us ? 1 : 6;
            const two = one + dir;
            if (s >> 4 === startRank && !b[two]) add(s, two, F_BIG);
          } else if (capturesOnly && !(one & 0x88) && !b[one] && (one >> 4 === 0 || one >> 4 === 7)) {
            add(s, one, 0); // promociones cuentan como "tácticas" en quiescencia
          }
          for (const d of [dir - 1, dir + 1]) {
            const c = s + d;
            if (c & 0x88) continue;
            if (b[c] && col(b[c]) === them) add(s, c, F_CAP);
            else if (c === this.ep) add(s, c, F_CAP | F_EP);
          }
        } else if (t === N || t === K) {
          for (const d of t === N ? N_OFF : K_OFF) {
            const c = s + d;
            if (c & 0x88) continue;
            if (!b[c]) capturesOnly || add(s, c, 0);
            else if (col(b[c]) === them) add(s, c, F_CAP);
          }
        } else {
          const dirs = t === B ? B_OFF : t === R ? R_OFF : K_OFF;
          for (const d of dirs) {
            let c = s + d;
            while (!(c & 0x88)) {
              if (!b[c]) capturesOnly || add(s, c, 0);
              else {
                if (col(b[c]) === them) add(s, c, F_CAP);
                break;
              }
              c += d;
            }
          }
        }
      }
      // enroque
      if (!capturesOnly) {
        const ks = this.kings[us ? 1 : 0];
        if (us === 0 && ks === 116 && !this.attacked(116, them)) {
          if (this.castle & 1 && !b[117] && !b[118] && b[119] === R && !this.attacked(117, them) && !this.attacked(118, them))
            out.push({ from: 116, to: 118, piece: K, cap: 0, flags: F_KC, promo: 0 });
          if (this.castle & 2 && !b[115] && !b[114] && !b[113] && b[112] === R && !this.attacked(115, them) && !this.attacked(114, them))
            out.push({ from: 116, to: 114, piece: K, cap: 0, flags: F_QC, promo: 0 });
        }
        if (us === BLACK && ks === 4 && !this.attacked(4, them)) {
          if (this.castle & 4 && !b[5] && !b[6] && b[7] === (R | BLACK) && !this.attacked(5, them) && !this.attacked(6, them))
            out.push({ from: 4, to: 6, piece: K | BLACK, cap: 0, flags: F_KC, promo: 0 });
          if (this.castle & 8 && !b[3] && !b[2] && !b[1] && b[0] === (R | BLACK) && !this.attacked(3, them) && !this.attacked(2, them))
            out.push({ from: 4, to: 2, piece: K | BLACK, cap: 0, flags: F_QC, promo: 0 });
        }
      }
      return out;
    }

    moves(capturesOnly = false) {
      const us = this.turn, out = [];
      for (const m of this.pseudo(capturesOnly)) {
        this.make(m, false);
        if (!this.attacked(this.kings[us ? 1 : 0], us ^ BLACK)) out.push(m);
        this.unmake();
      }
      return out;
    }

    // track=false: movida de búsqueda/prueba; no guarda la clave de posición (es lo caro)
    make(m, track = true) {
      const b = this.b, us = this.turn;
      this.hist.push({ m, castle: this.castle, ep: this.ep, half: this.half, full: this.full, track });
      b[m.to] = m.promo || m.piece;
      b[m.from] = 0;
      if (m.flags & F_EP) b[m.to + (us ? -16 : 16)] = 0;
      if (m.flags & F_KC) (b[m.to - 1] = b[m.to + 1]), (b[m.to + 1] = 0);
      if (m.flags & F_QC) (b[m.to + 1] = b[m.to - 2]), (b[m.to - 2] = 0);
      if (type(m.piece) === K) {
        this.kings[us ? 1 : 0] = m.to;
        this.castle &= us ? ~12 : ~3;
      }
      for (const s of [m.from, m.to]) {
        if (s === 119) this.castle &= ~1;
        else if (s === 112) this.castle &= ~2;
        else if (s === 7) this.castle &= ~4;
        else if (s === 0) this.castle &= ~8;
      }
      this.ep = m.flags & F_BIG ? m.from + (us ? 16 : -16) : -1;
      this.half = type(m.piece) === P || m.flags & F_CAP ? 0 : this.half + 1;
      if (us) this.full++;
      this.turn = us ^ BLACK;
      if (track) this.keys.push(this.key());
    }

    unmake() {
      const h = this.hist.pop();
      if (!h) return null;
      const { m } = h, b = this.b;
      this.turn ^= BLACK;
      const us = this.turn;
      b[m.from] = m.piece;
      b[m.to] = m.flags & F_EP ? 0 : m.cap;
      if (m.flags & F_EP) b[m.to + (us ? -16 : 16)] = m.cap;
      if (m.flags & F_KC) (b[m.to + 1] = b[m.to - 1]), (b[m.to - 1] = 0);
      if (m.flags & F_QC) (b[m.to - 2] = b[m.to + 1]), (b[m.to + 1] = 0);
      if (type(m.piece) === K) this.kings[us ? 1 : 0] = m.from;
      this.castle = h.castle;
      this.ep = h.ep;
      this.half = h.half;
      this.full = h.full;
      if (h.track) this.keys.pop();
      return m;
    }

    // ------------------------------------------------ estado de la partida
    repetitions() {
      const k = this.keys[this.keys.length - 1];
      let n = 0;
      for (const x of this.keys) if (x === k) n++;
      return n;
    }

    insufficient() {
      const minors = [], others = [];
      for (let s = 0; s < 120; s++) {
        if (s & 0x88) {
          s += 7;
          continue;
        }
        const p = this.b[s];
        if (!p || type(p) === K) continue;
        if (type(p) === N || type(p) === B) minors.push({ p, s });
        else others.push(p);
      }
      if (others.length) return false;
      if (minors.length <= 1) return true;
      // alfiles del mismo color de casilla y nada más
      if (minors.every((m) => type(m.p) === B)) {
        const shade = (s) => ((s >> 4) + (s & 7)) & 1;
        return minors.every((m) => shade(m.s) === shade(minors[0].s));
      }
      return false;
    }

    status() {
      const legal = this.moves();
      if (!legal.length) return this.inCheck() ? { over: true, result: this.turn ? "1-0" : "0-1", reason: "checkmate" } : { over: true, result: "1/2-1/2", reason: "stalemate" };
      if (this.insufficient()) return { over: true, result: "1/2-1/2", reason: "insufficient material" };
      if (this.half >= 100) return { over: true, result: "1/2-1/2", reason: "50-move rule" };
      if (this.repetitions() >= 3) return { over: true, result: "1/2-1/2", reason: "threefold repetition" };
      return { over: false, legal };
    }

    // ------------------------------------------------ notación
    uci(m) {
      return sqName(m.from) + sqName(m.to) + (m.promo ? CHARS[type(m.promo)] : "");
    }

    san(m, legal = this.moves()) {
      let s;
      if (m.flags & F_KC) s = "O-O";
      else if (m.flags & F_QC) s = "O-O-O";
      else {
        const t = type(m.piece);
        const cap = m.flags & F_CAP;
        if (t === P) s = (cap ? sqName(m.from)[0] + "x" : "") + sqName(m.to) + (m.promo ? "=" + CHARS[type(m.promo)].toUpperCase() : "");
        else {
          const twins = legal.filter((o) => o.piece === m.piece && o.to === m.to && o.from !== m.from);
          let dis = "";
          if (twins.length) {
            const f = sqName(m.from)[0], r = sqName(m.from)[1];
            dis = twins.every((o) => sqName(o.from)[0] !== f) ? f : twins.every((o) => sqName(o.from)[1] !== r) ? r : f + r;
          }
          s = CHARS[t].toUpperCase() + dis + (cap ? "x" : "") + sqName(m.to);
        }
      }
      this.make(m, false);
      const check = this.inCheck();
      const mate = check && !this.moves().length;
      this.unmake();
      return s + (mate ? "#" : check ? "+" : "");
    }

    find(uci) {
      return this.moves().find((m) => this.uci(m) === uci) || null;
    }

    play(uci) {
      const m = typeof uci === "string" ? this.find(uci) : uci;
      if (!m) return null;
      m.san = this.san(m);
      this.make(m);
      return m;
    }
  }

  // ------------------------------------------------ evaluación (tablas pieza-casilla simplificadas)
  // Índice 0 = a8 desde el punto de vista de las blancas; las negras se espejan.
  const PST = {
    [P]: [0,0,0,0,0,0,0,0, 50,50,50,50,50,50,50,50, 10,10,20,30,30,20,10,10, 5,5,10,25,25,10,5,5, 0,0,0,20,20,0,0,0, 5,-5,-10,0,0,-10,-5,5, 5,10,10,-20,-20,10,10,5, 0,0,0,0,0,0,0,0],
    [N]: [-50,-40,-30,-30,-30,-30,-40,-50, -40,-20,0,0,0,0,-20,-40, -30,0,10,15,15,10,0,-30, -30,5,15,20,20,15,5,-30, -30,0,15,20,20,15,0,-30, -30,5,10,15,15,10,5,-30, -40,-20,0,5,5,0,-20,-40, -50,-40,-30,-30,-30,-30,-40,-50],
    [B]: [-20,-10,-10,-10,-10,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,10,10,5,0,-10, -10,5,5,10,10,5,5,-10, -10,0,10,10,10,10,0,-10, -10,10,10,10,10,10,10,-10, -10,5,0,0,0,0,5,-10, -20,-10,-10,-10,-10,-10,-10,-20],
    [R]: [0,0,0,0,0,0,0,0, 5,10,10,10,10,10,10,5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, 0,0,0,5,5,0,0,0],
    [Q]: [-20,-10,-10,-5,-5,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,5,5,5,0,-10, -5,0,5,5,5,5,0,-5, 0,0,5,5,5,5,0,-5, -10,5,5,5,5,5,0,-10, -10,0,5,0,0,0,0,-10, -20,-10,-10,-5,-5,-10,-10,-20],
    [K]: [-30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -20,-30,-30,-40,-40,-30,-30,-20, -10,-20,-20,-20,-20,-20,-20,-10, 20,20,0,0,0,0,20,20, 20,30,10,0,0,10,30,20],
  };
  const K_END = [-50,-40,-30,-20,-20,-30,-40,-50, -30,-20,-10,0,0,-10,-20,-30, -30,-10,20,30,30,20,-10,-30, -30,-10,30,40,40,30,-10,-30, -30,-10,30,40,40,30,-10,-30, -30,-10,20,30,30,20,-10,-30, -30,-30,0,0,0,0,-30,-30, -50,-30,-30,-30,-30,-30,-30,-50];

  // evaluación desde el punto de vista del bando que mueve (centipeones)
  function evaluate(g) {
    let score = 0, nonPawn = 0;
    const b = g.b;
    for (let s = 0; s < 120; s++) {
      if (s & 0x88) {
        s += 7;
        continue;
      }
      const p = b[s];
      if (p && type(p) !== P && type(p) !== K) nonPawn += VAL[type(p)];
    }
    const endgame = nonPawn <= 1300;
    for (let s = 0; s < 120; s++) {
      if (s & 0x88) {
        s += 7;
        continue;
      }
      const p = b[s];
      if (!p) continue;
      const t = type(p), r = s >> 4, f = s & 7;
      const idx = col(p) ? (7 - r) * 8 + f : r * 8 + f;
      const v = VAL[t] + (t === K && endgame ? K_END[idx] : PST[t][idx]);
      score += col(p) ? -v : v;
    }
    return g.turn ? -score : score;
  }

  // ------------------------------------------------ búsqueda
  const MATE = 100000;
  const INF = 1e9;

  class Searcher {
    constructor(g, nodeLimit = 120000) {
      this.g = g;
      this.limit = nodeLimit;
      this.nodes = 0;
      this.aborted = false;
    }

    order(moves) {
      for (const m of moves) m._o = (m.cap ? 10 * VAL[type(m.cap)] - VAL[type(m.piece)] + 10000 : 0) + (m.promo ? 9000 : 0);
      return moves.sort((a, b) => b._o - a._o);
    }

    qs(alpha, beta, depth) {
      if (++this.nodes > this.limit) {
        this.aborted = true;
        return 0;
      }
      const stand = evaluate(this.g);
      if (stand >= beta) return beta;
      if (stand > alpha) alpha = stand;
      if (depth <= 0) return alpha;
      for (const m of this.order(this.g.moves(true))) {
        this.g.make(m, false);
        const s = -this.qs(-beta, -alpha, depth - 1);
        this.g.unmake();
        if (this.aborted) return 0;
        if (s >= beta) return beta;
        if (s > alpha) alpha = s;
      }
      return alpha;
    }

    search(depth, alpha, beta, ply) {
      if (++this.nodes > this.limit) {
        this.aborted = true;
        return 0;
      }
      const g = this.g;
      if (ply > 0 && g.half >= 100) return 0;
      const moves = g.moves();
      if (!moves.length) return g.inCheck() ? -MATE + ply : 0;
      if (depth <= 0) return this.qs(alpha, beta, 6);
      for (const m of this.order(moves)) {
        g.make(m, false);
        const s = -this.search(depth - 1, -beta, -alpha, ply + 1);
        g.unmake();
        if (this.aborted) return 0;
        if (s >= beta) return beta;
        if (s > alpha) alpha = s;
      }
      return alpha;
    }

    // puntúa todas las movidas de la raíz (las que quedan muy por debajo de la mejor salen como cota)
    rootScores(depth, margin = 400) {
      const g = this.g;
      const moves = this.order(g.moves());
      const out = [];
      let best = -INF;
      for (const m of moves) {
        g.make(m, false);
        const lower = best === -INF ? -INF : best - margin;
        const s = -this.search(depth - 1, -INF, -lower, 1);
        g.unmake();
        if (this.aborted) return null;
        out.push({ m, s });
        if (s > best) best = s;
      }
      return out.sort((a, b) => b.s - a.s);
    }
  }

  // Analiza con profundización iterativa dentro del presupuesto de nodos.
  function analyze(g, maxDepth, nodeLimit) {
    let last = null;
    for (let d = 1; d <= maxDepth; d++) {
      const se = new Searcher(g, nodeLimit);
      const r = se.rootScores(d);
      if (!r) break;
      last = { depth: d, scores: r };
      if (Math.abs(r[0].s) > MATE - 100) break; // mate encontrado
    }
    return last;
  }

  // Nivel del bot por Elo: profundidad, "temperatura" (cuánto se equivoca) y presupuesto
  function level(elo) {
    if (elo < 900) return { depth: 1, T: 160, blunder: 0.12, nodes: 30000 };
    if (elo < 1300) return { depth: 2, T: 90, blunder: 0.05, nodes: 50000 };
    if (elo < 1700) return { depth: 2, T: 45, blunder: 0.02, nodes: 70000 };
    if (elo < 2100) return { depth: 3, T: 22, blunder: 0, nodes: 110000 };
    if (elo < 2500) return { depth: 3, T: 10, blunder: 0, nodes: 150000 };
    return { depth: 3, T: 4, blunder: 0, nodes: 150000 }; // profundidad 4 tarda ~4s por jugada: no vale en un teléfono
  }

  function botMove(g, elo, rnd = Math.random) {
    const lv = level(elo);
    const legal = g.moves();
    if (!legal.length) return null;
    if (lv.blunder && rnd() < lv.blunder) return legal[Math.floor(rnd() * legal.length)];
    const a = analyze(g, lv.depth, lv.nodes);
    if (!a) return legal[Math.floor(rnd() * legal.length)];
    const best = a.scores[0].s;
    if (best > MATE - 100) return a.scores[0].m; // nunca deja pasar un mate propio
    const cands = a.scores.filter((x) => best - x.s <= lv.T * 4);
    const w = cands.map((x) => Math.exp(-(best - x.s) / lv.T));
    let r = rnd() * w.reduce((s, v) => s + v, 0);
    for (let i = 0; i < cands.length; i++) if ((r -= w[i]) <= 0) return cands[i].m;
    return cands[0].m;
  }

  function perft(g, depth) {
    if (!depth) return 1;
    let n = 0;
    for (const m of g.moves()) {
      g.make(m, false);
      n += perft(g, depth - 1);
      g.unmake();
    }
    return n;
  }

  const API = { Game, START, evaluate, analyze, botMove, level, perft, sqName, sqIdx, MATE, type, col, BLACK, PIECES: { P, N, B, R, Q, K } };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else root.FL_ENGINE = API;

  // Modo Web Worker: el bot piensa fuera del hilo de la UI (el reloj y los toques siguen andando).
  if (typeof window === "undefined" && typeof importScripts === "function" && typeof postMessage === "function") {
    root.onmessage = (e) => {
      const { id, fen, keys, elo } = e.data || {};
      try {
        const g = new Game(fen);
        if (Array.isArray(keys)) g.keys = keys.slice();
        const m = botMove(g, elo);
        postMessage({ id, uci: m ? g.uci(m) : null });
      } catch (err) {
        postMessage({ id, error: String(err) });
      }
    };
  }
})(typeof window !== "undefined" ? window : globalThis);
