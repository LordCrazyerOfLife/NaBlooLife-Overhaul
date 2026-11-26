/* [mod] UI bars + font for NaBlooLife (local mod).
 *
 * One place for how the mods draw bars and text, so everything looks like the game:
 *  - FL_BARS.html(label, value, color, hint): a stat bar in the game's own style (dark track, colored fill, the
 *    percentage on the right, bold cyan label in Mulish), like Happiness / Health on the main screen.
 *    `color` can be a hex used by older call sites ("#b3261e" red, "#f5841f" orange, "#2fa03b" green,
 *    "#6b2f8f" purple) or a game fill class ("crit", "low", "fame", "insane", "").
 *  - FL_BARS.cls(value): the fill class for a "higher is better" value (crit < 13, low < 31, otherwise green).
 *  - A font stack and CSS for the mods' own text (ticker, messages, toasts) that matches the game (Mulish).
 * Falls back to nothing if the game's statBar() is missing; the mods keep their old bars in that case.
 */
(() => {
  "use strict";
  if (window.FL_BARS) return;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const FONT = '"Avenir Next","Mulish","Nunito",system-ui,sans-serif';
  const clsOf = (v) => (v < 13 ? "crit" : v < 31 ? "low" : "");
  const MAP = { "#b3261e": "crit", "#f5841f": "low", "#2fa03b": "", "#2d7dd2": "", "#3d7ea6": "", "#6b2f8f": "insane" };

  function html(label, value, color, hint) {
    const v = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
    let cls = color == null ? clsOf(v) : MAP[String(color).toLowerCase()] ?? (/^(crit|low|fame|insane|)$/.test(String(color)) ? String(color) : clsOf(v));
    if (cls === "insane" && /fame/i.test(label)) cls = "fame";
    const bar = typeof statBar === "function" ? statBar(v, cls) : `<div class="bar"><div class="bi"><div class="fill ${cls}" style="width:${v}%"></div></div><span class="pct">${v}%</span></div>`;
    return `<div class="fl-brow"><div class="fl-bt"><span class="fl-bl">${esc(label)}</span>${hint ? `<span class="fl-bh">${esc(hint)}</span>` : ""}</div>${bar}</div>`;
  }

  const css = `
.fl-brow{display:block;margin:6px 0;font-family:${FONT}}
.fl-bt{display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin:0 0 2px}
.fl-bl{color:var(--link);font-weight:900;font-size:12.5px;line-height:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fl-bh{font:800 11px/18px ${FONT};white-space:nowrap}
.fl-brow .bar{width:100%}
/* the mods' own text uses the game's font */
#flTicker,#flMsg,#flTip,.fl-font{font-family:${FONT}}
#flTicker{font-weight:800}
.fl-sub{opacity:.8}
.phone.dark .fl-bl{color:#27c3d1}
.fl-bh,.fl-sub{color:#6b7280}
.phone.dark .fl-bh,.phone.dark .fl-sub{color:#9aa3b2}
/* small grey notes written by the mods stay readable on the dark theme */
.phone.dark #sList [style*="opacity:.75"],.phone.dark #sList [style*="opacity:.7"],.phone.dark #sList [style*="opacity:.8"],.phone.dark #sList [style*="opacity:.65"]{color:#9aa3b2 !important;opacity:1 !important}
`;
  const st = document.createElement("style");
  st.id = "flBarsCss";
  st.textContent = css;
  document.head.appendChild(st);
  window.FL_BARS = { html, cls: clsOf, font: FONT };
  console.log("[ui-bars] loaded");
})();
