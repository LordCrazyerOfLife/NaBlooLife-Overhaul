/* [mod] Mobile fixes for NaBlooLife (local mod).
 *
 *  1. Modals fit: popups, cards and notices never get taller than the screen (they scroll inside instead of
 *     running off the edge), and the whole game uses the *visible* viewport height (100dvh), so the bottom is
 *     never hidden under the browser bar on a small phone.
 *  2. No hover needed: elements that only explain themselves with a `title` tooltip show it as a small toast
 *     when tapped (touch screens have no hover).
 *  3. Swipe: swipe right to go back / close the open screen, swipe down on a popup (when it is scrolled to the
 *     top) to dismiss it, instead of hunting for the little arrow. Never fires on inputs, canvases or sliders.
 *  4. Don't lose the game when switching apps: the life is saved every few taps and every time the page is hidden,
 *     frozen or closed, and pull-to-refresh (which reloads the page on Android) is switched off.
 *  5. Readable text: the life log and the list rows get bigger type on small phones.
 */
(() => {
  "use strict";
  if (window.FL_MOBILE) return;

  // ------------------------------------------------------------------ 1 + 5: css
  const css = `
/* [mobile-fix] visible viewport, never the full height that hides behind the browser bar */
.phone{height:100vh;height:100dvh}
html.pc .phone{height:calc(100vh / var(--pcz,1));height:calc(100dvh / var(--pcz,1))}
html,body{overscroll-behavior-y:contain}
.log,#sList,.ev,.jm,.notice{overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
/* popups scroll inside themselves instead of running off the screen */
.ev-wrap,.jm-wrap{box-sizing:border-box;padding-left:12px;padding-right:12px}
.ev{max-height:calc(100% - 14px);overflow-y:auto}
.jm{box-sizing:border-box}
.notice-wrap{padding-left:14px;padding-right:14px;box-sizing:border-box}
.notice{max-height:calc(100% - 28px);overflow-y:auto;box-sizing:border-box}
.jcw{max-width:100%;box-sizing:border-box}
.jcw img,.ev img,.jm img{max-width:100%}
/* the Find Heirloom darkness ring is 230% of the scene on purpose: capping it at 100% made the dark patch slide with the flashlight */
.jm .hl-scene img{max-width:none}
@media (max-height:700px){
  .jcw .lead{font-size:14.5px;line-height:1.3}
  .jcw h4{font-size:20px}
  .notice{padding:22px 18px 24px}
  .notice p{font-size:16px}
}
/* readable text on small phones */
@media (max-width:480px){
  .year p{font-size:15px;line-height:20px}
  .year h3{font-size:15px;line-height:20px}
  #sList .row .t span{font-size:13.5px}
  .mm-foot{font-size:13.5px}
}
@media (max-width:360px){
  .year p{font-size:14.5px;line-height:19px}
}
/* the "tap to show title" toast */
#flTip{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);max-width:86vw;background:rgba(20,22,28,.94);color:#fff;
  padding:9px 14px;border-radius:12px;font:800 14px/1.3 "Avenir Next","Mulish","Nunito",system-ui,sans-serif;z-index:2147483000;pointer-events:none;text-align:center}
`;
  const style = document.createElement("style");
  style.id = "flMobileCss";
  style.textContent = css;
  document.head.appendChild(style);

  // ------------------------------------------------------------------ 1b: shrink popups that do not fit
  // The close "X" sits outside the card, so these cards cannot just scroll (it would be clipped): scale them down
  // a little first, and only past 60% let them scroll.
  const fit = (wrap) => {
    try {
      if (!wrap || !wrap.classList.contains("open")) return;
      const box = wrap.firstElementChild;
      if (!box) return;
      box.style.zoom = "";
      const avail = wrap.clientHeight - 16;
      const need = box.scrollHeight + 18;
      if (need > avail && avail > 120) {
        const z = Math.max(0.6, avail / need);
        box.style.zoom = z.toFixed(3);
        if (avail / need < 0.6) {
          box.style.maxHeight = avail / z + "px";
          box.style.overflowY = "auto";
        }
      }
    } catch {}
  };
  const watch = () => {
    for (const id of ["evWrap", "jmWrap"]) {
      const w = document.getElementById(id);
      if (!w || w._flFit) continue;
      w._flFit = true;
      let raf = 0;
      const run = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => fit(w));
      };
      new MutationObserver(run).observe(w, { attributes: true, attributeFilter: ["class"], childList: true, subtree: true });
      window.addEventListener("resize", run);
    }
  };
  watch();
  document.addEventListener("DOMContentLoaded", watch);
  setTimeout(watch, 800);

  // ------------------------------------------------------------------ 2: title tooltips on tap
  let tipTimer = 0;
  const showTip = (txt) => {
    let t = document.getElementById("flTip");
    if (!t) {
      t = document.createElement("div");
      t.id = "flTip";
      document.body.appendChild(t);
    }
    t.textContent = txt;
    t.style.display = "block";
    clearTimeout(tipTimer);
    tipTimer = setTimeout(() => (t.style.display = "none"), 2600);
  };
  const touch = typeof matchMedia === "function" && matchMedia("(hover: none)").matches;
  if (touch)
    document.addEventListener(
      "click",
      (e) => {
        try {
          const el = e.target.closest && e.target.closest("[title]");
          if (!el) return;
          const title = (el.getAttribute("title") || "").trim();
          if (!title || (el.textContent || "").includes(title)) return;
          showTip(title);
        } catch {}
      },
      true,
    );

  // ------------------------------------------------------------------ 3: swipe to go back / dismiss
  const SKIP = "input,textarea,select,canvas,[contenteditable],.ft-svg,input[type=range],.no-swipe,.bj-table";
  let sx = 0,
    sy = 0,
    st = 0,
    track = false,
    target = null;
  const openModal = () => {
    for (const id of ["jmWrap", "evWrap", "hlWrap"]) {
      const w = document.getElementById(id) || (id === "evWrap" && window.evWrap) || null;
      if (w && w.classList.contains("open")) return w;
    }
    return null;
  };
  const closeBtn = (w) => w && w.querySelector(".jm-x, #jmX, #jcX, .ev .jm-x, [data-close]");
  const topNotice = () => document.querySelector(".notice-wrap");
  const screenOpen = () => {
    const s = document.querySelector(".screen.open");
    return s && s.querySelector("#sBack, .circ") ? s : null;
  };
  const goBack = () => {
    const n = topNotice();
    if (n) return n.click(), true;
    const m = openModal();
    const cb = closeBtn(m);
    if (m && cb) return cb.click(), true;
    if (m) return false; // a decision popup: do not dismiss by accident
    const s = document.querySelector(".screen.open");
    const b = document.getElementById("sBack");
    if (s && b && getComputedStyle(b).display !== "none") return b.click(), true;
    return false;
  };
  document.addEventListener(
    "touchstart",
    (e) => {
      track = false;
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      target = e.target;
      if (target.closest && target.closest(SKIP)) return;
      sx = t.clientX;
      sy = t.clientY;
      st = Date.now();
      track = true;
    },
    { passive: true },
  );
  document.addEventListener(
    "touchend",
    (e) => {
      if (!track) return;
      track = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - sx;
      const dy = t.clientY - sy;
      const dt = Date.now() - st;
      if (dt > 700) return;
      // swipe right: back (long enough, mostly horizontal)
      if (dx > 80 && Math.abs(dy) < 55 && dx > Math.abs(dy) * 2) {
        // do not hijack horizontal scrollers
        let el = target;
        while (el && el !== document.body) {
          if (el.scrollWidth > el.clientWidth + 8 && /(auto|scroll)/.test(getComputedStyle(el).overflowX)) return;
          el = el.parentElement;
        }
        goBack();
        return;
      }
      // swipe down on a closable popup that is scrolled to the top
      if (dy > 110 && Math.abs(dx) < 60 && dy > Math.abs(dx) * 2) {
        const m = openModal();
        const cb = closeBtn(m);
        if (m && cb) {
          const sc = (target.closest && target.closest(".ev, .jm")) || null;
          if (!sc || sc.scrollTop <= 2) cb.click();
        } else if (topNotice()) topNotice().click();
      }
    },
    { passive: true },
  );

  // ------------------------------------------------------------------ 4: keep the game when the app is switched
  let lastSave = 0;
  const save = (force) => {
    try {
      const now = Date.now();
      if (!force && now - lastSave < 5000) return;
      if (typeof window.blSaveLife !== "function") return;
      lastSave = now;
      window.blSaveLife();
    } catch {}
  };
  document.addEventListener("visibilitychange", () => document.hidden && save(true));
  window.addEventListener("pagehide", () => save(true));
  document.addEventListener("freeze", () => save(true));
  window.addEventListener("blur", () => save(true));
  let debounce = 0;
  document.addEventListener(
    "pointerup",
    () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => save(false), 1600);
    },
    true,
  );
  // coming back after the browser killed the page: nothing to do, the game resumes the saved life by itself;
  // but make sure we save again the moment we are back so the next kill loses nothing
  window.addEventListener("pageshow", () => setTimeout(() => save(true), 1500));

  window.FL_MOBILE = { save, goBack, tip: showTip };
  console.log("[mobile-fix] loaded");
})();
