/* [mod] Social NaN fix for NaBlooLife (local mod).
 *
 * Posting on social media could show "NaN views / NaN likes" (and "NaN followers" in the list). One bad number in an
 * account (subs, fake, momentum, views... missing or NaN) poisons every later post, because NaN + anything = NaN, so it
 * shows up for any post on any app. This repairs every account before a post, before buying followers and whenever the
 * Social Media lists open, so a damaged save heals itself and a new NaN cannot stick.
 *
 * Only numeric fields of state.social[*] are touched: bad or missing values become 0 (momentum is capped at 10).
 */
(() => {
  "use strict";
  if (window.FL_NANFIX) return;

  const FIELDS = ["subs", "fake", "posts", "views", "years", "momentum", "postsYear", "viewsYear", "buysYear", "appealAt"];

  function heal() {
    let fixed = 0;
    try {
      const soc = state && state.social;
      if (!soc || typeof soc !== "object") return 0;
      for (const k of Object.keys(soc)) {
        const a = soc[k];
        if (!a || typeof a !== "object") continue;
        for (const f of FIELDS) {
          if (typeof a[f] !== "number" || !Number.isFinite(a[f])) {
            a[f] = 0;
            fixed++;
          }
        }
        if (a.fake > a.subs) a.fake = a.subs;
        if (a.momentum > 10) a.momentum = 10;
        if (!Array.isArray(a.botYears)) a.botYears = [];
      }
    } catch (e) {
      console.warn("[social-nan-fix]", e);
    }
    if (fixed) console.warn("[social-nan-fix] repaired " + fixed + " bad social number(s)");
    return fixed;
  }

  const wrap = (name) => {
    const orig = window[name];
    if (typeof orig !== "function" || orig.__flNanFix) return false;
    const w = function () {
      heal();
      return orig.apply(this, arguments);
    };
    w.__flNanFix = true;
    window[name] = w;
    return true;
  };

  function boot() {
    if (typeof state === "undefined" || typeof socialPost !== "function" || typeof openSocial !== "function") return setTimeout(boot, 200);
    ["socialPost", "socialBuy", "openSocial", "openSocialAccount"].forEach(wrap);
    // after posting, clean again so a number that broke inside the post does not carry over
    const post = window.socialPost;
    window.socialPost = function () {
      const r = post.apply(this, arguments);
      heal();
      return r;
    };
    window.socialPost.__flNanFix = true;
    heal();
    console.log("[social-nan-fix] loaded");
  }
  window.FL_NANFIX = { heal };
  boot();
})();
