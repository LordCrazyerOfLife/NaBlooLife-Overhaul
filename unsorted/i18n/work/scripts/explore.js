// Walks the main screens of the local Free Life copy and collects visible English UI text.
const seen = new Map();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const vis = (el) => el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden";
const grab = (tag) => {
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    const el = n.parentElement;
    if (!el || el.closest("script,style") || !vis(el)) continue;
    const s = n.textContent.replace(/\s+/g, " ").trim();
    if (/[A-Za-z]{2}/.test(s) && s.length < 300 && !seen.has(s)) seen.set(s, tag);
  }
};
const byText = (sel, re) => [...document.querySelectorAll(sel)].find((e) => vis(e) && re.test(e.textContent.trim()));
// close any popup by pressing its first visible button
async function settle(tag) {
  for (let i = 0; i < 6; i++) {
    const pop = [...document.querySelectorAll("#evWrap,#jmWrap,#hlWrap,#toast,.notice,.ev-wrap,.jm-wrap")].find(
      (e) => vis(e) && e.getBoundingClientRect().height > 40 && getComputedStyle(e).display !== "none",
    );
    grab(tag);
    if (!pop) return;
    const b =
      [...pop.querySelectorAll("button,.ev-btn,.jm-apply,.row,[role=button]")].find(vis) ||
      pop.querySelector("#jmX,.jm-x");
    if (!b) return;
    b.click();
    await sleep(350);
  }
}

const male = byText("div,button,span", /^♂?\s*Male$/);
if (male) male.click(), await sleep(1500);
await settle("start");

for (let y = 0; y < 8; y++) {
  document.getElementById("ageBtn")?.click();
  await sleep(700);
  await settle("age");
}

for (const tab of ["Occupation", "Assets", "Relationships", "Activities"]) {
  document.querySelector(`.tab[data-tab="${tab}"]`)?.click();
  await sleep(700);
  grab(tab);
  const rows = [...document.querySelectorAll("#sList .row")].filter(vis).slice(0, 40);
  for (let i = 0; i < rows.length; i++) {
    const r = [...document.querySelectorAll("#sList .row")].filter(vis)[i];
    if (!r || r.classList.contains("dis")) continue;
    const title = sTitle.textContent;
    r.click();
    await sleep(500);
    await settle(tab + ">" + i);
    if (sTitle.textContent !== title && document.getElementById("sBack")) {
      grab(tab + ">" + i);
      document.getElementById("sBack").click();
      await sleep(400);
    }
    if (!document.getElementById("screen").classList.contains("open")) {
      document.querySelector(`.tab[data-tab="${tab}"]`)?.click();
      await sleep(500);
    }
  }
  document.getElementById("sBack")?.click();
  await sleep(400);
}

document.querySelector(".menu-btn")?.click();
await sleep(700);
grab("menu");
document.querySelector('[data-mm="settings"]')?.click();
await sleep(600);
grab("settings");
document.getElementById("sBack")?.click();
await sleep(400);
document.getElementById("sBack")?.click();

return [...seen.entries()];
