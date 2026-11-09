import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const WORKSPACE_DIR = "/Users/heshanmaduwantha/Desktop/#Code/Site";
const TMP_DIR = "/tmp/hashcode-studio-deps";
const WORKSPACE_PROJECTS_PATH = path.join(WORKSPACE_DIR, "src", "data", "projects.json");
const TMP_PROJECTS_PATH = path.join(TMP_DIR, "src", "data", "projects.json");
const PUBLIC_DIR = path.join(TMP_DIR, "public");

function getProjects() {
  for (const p of [TMP_PROJECTS_PATH, WORKSPACE_PROJECTS_PATH]) {
    try {
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore and try next
    }
  }
  return [];
}

function saveProjects(projects) {
  const normalized = projects.map((proj, index) => ({
    ...proj,
    number: String(index + 1).padStart(2, "0"),
  }));
  const json = JSON.stringify(normalized, null, 2);
  try {
    fs.mkdirSync(path.dirname(TMP_PROJECTS_PATH), { recursive: true });
    fs.writeFileSync(TMP_PROJECTS_PATH, json, "utf-8");
  } catch (e) {
    console.error("Failed to write tmp projects.json:", e);
  }
  try {
    fs.mkdirSync(path.dirname(WORKSPACE_PROJECTS_PATH), { recursive: true });
    fs.writeFileSync(WORKSPACE_PROJECTS_PATH, json, "utf-8");
  } catch (e) {
    console.error("Failed to write workspace projects.json:", e);
  }
  return normalized;
}

const MIME_TYPES = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

function renderAppShell(initialProjects) {
  const safeJson = JSON.stringify(initialProjects).replace(/</g, "\\u003c");
  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>#code — Engineering Scalable Solutions | Colombo Software Studio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', '"Space Grotesk"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
          }
        }
      }
    }
  </script>
  <style>
    body {
      background-color: #ffffff;
      color: #0d0d0d;
      font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .font-mono {
      font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
    }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    ::selection { background-color: #D4FF00; color: #0d0d0d; }

/* =========================================================================
   #code — liquid-glass page loader
   Pure CSS + a ~60-line controller (code-loader.js). No dependencies.
   All classes are namespaced .cl-* ; the only globals are
   html.cl-lock, html.cl-done, html.cl-skip and [data-cl-reveal].
   ========================================================================= */

.cl {
  /* brand tokens (white theme) */
  --cl-ink: #0B0B0B;
  --cl-lime: #DFFF00;
  --cl-paper: #FFFFFF;
  --cl-paper-2: #F7F7F4;
  --cl-rule: #E5E5DE;
  --cl-muted: #6B6B73;
  --cl-body: #3A3A42;
  --cl-fringe-a: #B5D300;   /* lime dispersion fringe   */
  --cl-fringe-b: #8C7BFF;   /* violet dispersion fringe */
  --cl-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;

  /* geometry — desktop */
  --cl-halo-0: 270px;  --cl-halo-w: 560px; --cl-halo-h: 440px; --cl-halo-r: 124px;
  --cl-lens-0: 168px;  --cl-lens-w: 420px; --cl-lens-h: 300px; --cl-lens-r: 78px;
  --cl-word: 120px;    --cl-tag: 14px;     --cl-gap: 10px;
  --cl-slide: 300px;   --cl-fringe: 9px;   --cl-smear: 7px;
  --cl-center: 46%;    --cl-status-gap: 262px; --cl-status-w: 300px;

  /* timing — keep --cl-in equal to data-cl-min in the markup */
  --cl-in: 2.6s;

  position: fixed;
  inset: 0;
  z-index: 9999;
  background: radial-gradient(ellipse 70% 60% at 50% var(--cl-center), var(--cl-paper) 0%, var(--cl-paper-2) 100%);
  transition: opacity .45s ease .1s, visibility 0s linear .6s;
  /* failsafe: if the controller never runs, get out of the way after 10s */
  animation: cl-failsafe 0s linear 10s forwards;
}

@media (max-width: 640px) {
  .cl {
    --cl-halo-0: 160px;  --cl-halo-w: 300px; --cl-halo-h: 250px; --cl-halo-r: 76px;
    --cl-lens-0: 104px;  --cl-lens-w: 236px; --cl-lens-h: 180px; --cl-lens-r: 50px;
    --cl-word: 68px;     --cl-tag: 9px;      --cl-gap: 6px;
    --cl-slide: 170px;   --cl-fringe: 6px;   --cl-smear: 4px;
    --cl-center: 44%;    --cl-status-gap: 160px; --cl-status-w: 220px;
  }
}

html.cl-lock, html.cl-lock body { overflow: hidden; }
.cl.is-leaving { opacity: 0; visibility: hidden; pointer-events: none; }

/* the site's line motif, drawn during the intro */
.cl-line { position: absolute; inset: 0; width: 100%; height: 100%; }
.cl-line--m { display: none; }
@media (max-width: 640px) { .cl-line--d { display: none; } .cl-line--m { display: block; } }
.cl-line path {
  fill: none; stroke: var(--cl-ink); stroke-opacity: .9; stroke-width: 1.75;
  stroke-dasharray: 1; stroke-dashoffset: 1;
  animation: cl-draw var(--cl-in) cubic-bezier(.45, 0, .2, 1) forwards;
}

/* stage: halo + lens share one grid cell so they stay centred while resizing */
.cl-stage {
  position: absolute; left: 0; right: 0; top: 0;
  height: calc(var(--cl-center) * 2);
  display: grid; place-items: center;
}
.cl-halo, .cl-lens { grid-area: 1 / 1; box-sizing: border-box; }

.cl-halo {
  width: var(--cl-halo-w); height: var(--cl-halo-h); border-radius: var(--cl-halo-r);
  background: rgba(255, 255, 255, .6);
  border: 1px solid var(--cl-rule);
  box-shadow:
    inset 0 1px 0 #FFFFFF,
    inset 0 -18px 40px rgba(11, 11, 11, .035),
    0 40px 90px rgba(11, 11, 11, .08),
    0 2px 6px rgba(11, 11, 11, .04);
  -webkit-backdrop-filter: blur(18px);
  backdrop-filter: blur(18px);
  animation: cl-halo-in var(--cl-in) linear both;
}

.cl-lens {
  position: relative; overflow: hidden; isolation: isolate;
  width: var(--cl-lens-w); height: var(--cl-lens-h); border-radius: var(--cl-lens-r);
  background: linear-gradient(180deg, #FCFCFA 0%, #EEEEE8 100%);
  border: 1px solid rgba(255, 255, 255, .9);
  box-shadow:
    inset 0 2px 2px rgba(255, 255, 255, .95),
    inset 0 -14px 28px rgba(11, 11, 11, .07),
    inset 0 0 0 1px rgba(11, 11, 11, .05),
    0 22px 44px rgba(11, 11, 11, .12);
  animation: cl-lens-in var(--cl-in) linear both;
}

/* four stacked copies of the wordmark make the glass:
   smear (rim) + two colour fringes (rim) + crisp core (centre) */
.cl-layer { position: absolute; inset: 0; display: grid; place-items: center; }
.cl-rim {
  -webkit-mask-image: radial-gradient(closest-side, transparent 50%, #000 96%);
          mask-image: radial-gradient(closest-side, transparent 50%, #000 96%);
}
.cl-core {
  -webkit-mask-image: radial-gradient(closest-side, #000 70%, transparent 100%);
          mask-image: radial-gradient(closest-side, #000 70%, transparent 100%);
}
.cl-track {
  display: flex; flex-direction: column; align-items: center; gap: var(--cl-gap);
  white-space: nowrap; color: var(--cl-ink);
  animation: cl-slide var(--cl-in) linear both;
}
.cl-word {
  font-family: var(--cl-mono); font-weight: 700;
  font-size: var(--cl-word); line-height: 1; letter-spacing: -0.05em;
}
.cl-hash { background: var(--cl-lime); padding: 0 .06em; }
.cl-tag {
  font-family: var(--cl-mono); font-size: var(--cl-tag);
  letter-spacing: .28em; color: var(--cl-body);
}
.cl-smear .cl-track { scale: 1.22; filter: blur(var(--cl-smear)); opacity: .5; }
.cl-fa, .cl-fb { mix-blend-mode: multiply; }
.cl-fa .cl-track { color: var(--cl-fringe-a); margin-left: calc(var(--cl-fringe) * -1); }
.cl-fb .cl-track { color: var(--cl-fringe-b); margin-left: var(--cl-fringe); }
.cl-fa .cl-hash, .cl-fb .cl-hash, .cl-smear .cl-hash { background: none; }
.cl-fa .cl-tag, .cl-fb .cl-tag { color: inherit; }
.cl-core .cl-track {
  animation: cl-slide var(--cl-in) linear both, cl-focus var(--cl-in) ease-out both;
}

/* light on the glass */
.cl-glare {
  position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, .9) 0%, rgba(255, 255, 255, 0) 34%),
    radial-gradient(90% 60% at 50% 115%, rgba(11, 11, 11, .07), transparent 70%);
}
.cl-caustic {
  position: absolute; right: -10%; bottom: -18%; width: 55%; height: 56%; border-radius: 50%;
  background: radial-gradient(closest-side, rgba(223, 255, 0, .6), rgba(223, 255, 0, 0));
  filter: blur(8px); mix-blend-mode: multiply; pointer-events: none;
}
.cl-sweep {
  position: absolute; inset: -20% -60%; pointer-events: none;
  background: linear-gradient(105deg, transparent 42%, rgba(255, 255, 255, .85) 49%, rgba(223, 255, 0, .35) 52%, transparent 60%);
  translate: -70% 0;
  animation: cl-sweep .8s cubic-bezier(.4, 0, .2, 1) calc(var(--cl-in) - .25s) both;
}

/* build status under the glass */
.cl-status {
  position: absolute; left: 50%;
  top: calc(var(--cl-center) + var(--cl-status-gap));
  width: var(--cl-status-w); margin-left: calc(var(--cl-status-w) / -2);
  display: flex; flex-direction: column; gap: 10px;
  font-family: var(--cl-mono);
  animation: cl-status-in .5s ease .45s both;
}
.cl-row {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 12px; letter-spacing: .06em; color: var(--cl-muted);
}
.cl-pct { color: var(--cl-ink); font-weight: 500; font-variant-numeric: tabular-nums; }
.cl-bar { height: 3px; border-radius: 999px; background: var(--cl-rule); overflow: hidden; }
.cl-bar > span {
  display: block; height: 100%; background: var(--cl-ink);
  transform: scaleX(0); transform-origin: left center;
}
.cl-caret {
  display: inline-block; width: 7px; height: 13px; margin-left: 4px; vertical-align: -2px;
  background: var(--cl-ink); animation: cl-blink 1.1s steps(1) infinite;
}

/* exit (controller adds .is-leaving) */
.cl.is-leaving .cl-halo   { animation: cl-halo-out .6s cubic-bezier(.7, 0, .84, 0) forwards; }
.cl.is-leaving .cl-lens   { animation: cl-lens-out .55s cubic-bezier(.5, 0, .75, 0) forwards; }
.cl.is-leaving .cl-status { animation: cl-fade-out .2s ease forwards; }
.cl.is-leaving .cl-line   { opacity: 0; transition: opacity .4s ease .1s; }

/* page content rise-in after the loader (opt-in with data-cl-reveal) */
html.cl-lock [data-cl-reveal] { opacity: 0; translate: 0 28px; }
html.cl-done [data-cl-reveal] {
  animation: cl-reveal .8s cubic-bezier(.2, .7, .2, 1) calc(.15s + var(--cl-delay, 0ms)) both;
}
html.cl-skip [data-cl-reveal] { animation: none; }

/* ---------------------------------------------------------------- keyframes */
@keyframes cl-halo-in {
  0%   { width: var(--cl-halo-0); height: var(--cl-halo-0); border-radius: calc(var(--cl-halo-0) / 2); opacity: 0; scale: .82; }
  19%  { width: var(--cl-halo-0); height: var(--cl-halo-0); border-radius: calc(var(--cl-halo-0) / 2); opacity: 1; scale: 1;
         animation-timing-function: cubic-bezier(.65, 0, .2, 1); }
  90%, 100% { width: var(--cl-halo-w); height: var(--cl-halo-h); border-radius: var(--cl-halo-r); opacity: 1; scale: 1; }
}
@keyframes cl-lens-in {
  0%   { width: var(--cl-lens-0); height: var(--cl-lens-0); border-radius: calc(var(--cl-lens-0) / 2); opacity: 0; scale: .7; }
  19%  { width: var(--cl-lens-0); height: var(--cl-lens-0); border-radius: calc(var(--cl-lens-0) / 2); opacity: 1; scale: 1;
         animation-timing-function: cubic-bezier(.65, 0, .2, 1); }
  90%, 100% { width: var(--cl-lens-w); height: var(--cl-lens-h); border-radius: var(--cl-lens-r); opacity: 1; scale: 1; }
}
@keyframes cl-slide {
  0%, 19% { translate: var(--cl-slide) 0; animation-timing-function: cubic-bezier(.3, .1, .2, 1); }
  100%    { translate: 0 0; }
}
@keyframes cl-focus   { 0%, 13% { filter: blur(10px); } 65%, 100% { filter: blur(0); } }
@keyframes cl-draw    { to { stroke-dashoffset: 0; } }
@keyframes cl-sweep   { from { translate: -70% 0; } to { translate: 70% 0; } }
@keyframes cl-status-in { from { opacity: 0; translate: 0 10px; } to { opacity: 1; translate: 0 0; } }
@keyframes cl-blink   { 50% { opacity: 0; } }
@keyframes cl-halo-out { from { opacity: 1; scale: 1; } to { opacity: 0; scale: 1.3; } }
@keyframes cl-lens-out { 0% { opacity: 1; scale: 1; } 55% { opacity: .25; } 100% { opacity: 0; scale: 2.2; } }
@keyframes cl-fade-out { to { opacity: 0; } }
@keyframes cl-reveal  { from { opacity: 0; translate: 0 28px; } to { opacity: 1; translate: 0 0; } }
@keyframes cl-failsafe { to { opacity: 0; visibility: hidden; pointer-events: none; } }

@media (prefers-reduced-motion: reduce) {
  .cl { display: none !important; }
  html.cl-lock, html.cl-lock body { overflow: auto; }
  [data-cl-reveal] { opacity: 1 !important; translate: none !important; animation: none !important; }
}
  </style>
</head>
<body class="antialiased bg-white text-neutral-950">
<noscript><style>#code-loader{display:none!important}</style></noscript>
<div id="code-loader" class="cl" aria-hidden="true" data-cl-min="2600" data-cl-max="8000" data-cl-once="true">
  <svg class="cl-line cl-line--d" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path pathLength="1" d="M1180 0 C1180 300 240 360 240 600 S1100 820 900 900"></path>
  </svg>
  <svg class="cl-line cl-line--m" viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <path pathLength="1" d="M330 0 C330 260 60 320 60 520 S330 760 200 844"></path>
  </svg>

  <div class="cl-stage">
    <div class="cl-halo"></div>
    <div class="cl-lens">
      <div class="cl-layer cl-rim cl-smear"><div class="cl-track"><span class="cl-word"><span class="cl-hash">#</span>code</span><span class="cl-tag">ENGINEERING SCALABLE SOLUTIONS</span></div></div>
      <div class="cl-layer cl-rim cl-fa"><div class="cl-track"><span class="cl-word"><span class="cl-hash">#</span>code</span><span class="cl-tag">ENGINEERING SCALABLE SOLUTIONS</span></div></div>
      <div class="cl-layer cl-rim cl-fb"><div class="cl-track"><span class="cl-word"><span class="cl-hash">#</span>code</span><span class="cl-tag">ENGINEERING SCALABLE SOLUTIONS</span></div></div>
      <div class="cl-layer cl-core"><div class="cl-track"><span class="cl-word"><span class="cl-hash">#</span>code</span><span class="cl-tag">ENGINEERING SCALABLE SOLUTIONS</span></div></div>
      <span class="cl-caustic"></span>
      <span class="cl-sweep"></span>
      <span class="cl-glare"></span>
    </div>
  </div>

  <div class="cl-status">
    <div class="cl-row"><span>$ code build --site<i class="cl-caret"></i></span><span class="cl-pct" data-cl-pct>0%</span></div>
    <div class="cl-bar"><span data-cl-bar></span></div>
  </div>
</div>
<script>
/* =========================================================================
   #code — liquid-glass page loader controller. No dependencies.
   Place this script IMMEDIATELY after the #code-loader markup (not deferred),
   so the page is covered and scroll-locked before anything else paints.

   Options (attributes on #code-loader):
     data-cl-min="2600"   minimum time on screen in ms (keep = CSS --cl-in)
     data-cl-max="8000"   never block the page longer than this
     data-cl-once="true"  show once per browser session ("false" = every load)
   ========================================================================= */
(function () {
  var root = document.documentElement;
  var el = document.getElementById('code-loader');
  if (!el) return;

  var MIN_MS = Number(el.getAttribute('data-cl-min')) || 2600;
  var MAX_MS = Number(el.getAttribute('data-cl-max')) || 8000;
  var ONCE = el.getAttribute('data-cl-once') !== 'false';
  var KEY = 'code-loader-seen';

  function removeNode() {
    if (el.parentNode) el.parentNode.removeChild(el);
  }

  // Skip entirely: reduced motion, or already shown this session.
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var seen = false;
  if (ONCE) { try { seen = sessionStorage.getItem(KEY) === '1'; } catch (e) {} }
  if (reduce || seen) {
    removeNode();
    root.classList.add('cl-done', 'cl-skip');
    return;
  }

  root.classList.add('cl-lock');

  var pctEl = el.querySelector('[data-cl-pct]');
  var barEl = el.querySelector('[data-cl-bar]');
  var start = performance.now();
  var ready = false;
  var shown = 0;
  var leaving = false;

  // "Ready" = window load (images, CSS) + web fonts.
  var loaded = new Promise(function (resolve) {
    if (document.readyState === 'complete') resolve();
    else window.addEventListener('load', resolve, { once: true });
  });
  var fonts = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  Promise.all([loaded, fonts]).then(function () { ready = true; }, function () { ready = true; });

  function frame(now) {
    var t = now - start;
    var p = Math.min(t / MIN_MS, 1);
    var target = 90 * (1 - Math.pow(1 - p, 3));            // ease to 90% during the intro
    if ((ready && t >= MIN_MS) || t >= MAX_MS) target = 100; // finish once ready (or capped)

    shown += (target - shown) * 0.14;
    if (target === 100 && shown > 99.4) shown = 100;

    if (pctEl) pctEl.textContent = Math.round(shown) + '%';
    if (barEl) barEl.style.transform = 'scaleX(' + (shown / 100).toFixed(3) + ')';

    if (shown === 100) { leave(); return; }
    requestAnimationFrame(frame);
  }

  function leave() {
    if (leaving) return;
    leaving = true;
    el.classList.add('is-leaving');           // lens zoom + halo + overlay fade (CSS)
    root.classList.remove('cl-lock');
    root.classList.add('cl-done');            // [data-cl-reveal] elements rise in
    if (ONCE) { try { sessionStorage.setItem(KEY, '1'); } catch (e) {} }
    setTimeout(removeNode, 1200);
  }

  requestAnimationFrame(frame);
})();
</script>
  <div id="app"></div>
  <script>
    window.__INITIAL_PROJECTS__ = ${safeJson};
  </script>
  <script src="/app-client.js"></script>
</body>
</html>`;
}

const CLIENT_JS = `
(function () {
  let state = {
    projects: Array.isArray(window.__INITIAL_PROJECTS__) ? window.__INITIAL_PROJECTS__ : [],
    activeTab: 0,
    openFaq: 0,
    workFilter: "ALL",
    mobileMenuOpen: false,
    contactSubmitted: false,
    toast: null,
    adminSubmitting: false,
    adminImageBase64: ""
  };

  const SERVICE_PILLARS = [
    {
      id: "web",
      num: "01",
      tabLabel: "01 WEB PLATFORMS",
      mobileTitle: "Web platforms",
      tagLabel: "01 / 05 · WEB PLATFORMS",
      heading: "Websites that load\\nfast and win trust.",
      description: "Mobile-first, SEO-ready business websites and e-commerce portals, built for sub-second page loads and turning visitors into enquiries.",
      bullets: [
        "Responsive, SEO-ready builds",
        "Online payment gateway integration",
        "Maintenance and performance tuning"
      ],
      ctaText: "Plan a website",
      terminalPath: "web / new-website",
      terminalLines: [
        { num: "01", text: "$ code new website --seo --mobile-first", type: "cmd" },
        { num: "02", text: "+ sub-second page loads", type: "add" },
        { num: "03", text: "+ online payments integrated", type: "add" },
        { num: "04", text: "+ SEO-ready from day one", type: "add" },
        { num: "05", text: "> quote after a short call", type: "out" }
      ]
    },
    {
      id: "erp",
      num: "02",
      tabLabel: "02 ERP, CRM & POS",
      mobileTitle: "ERP, CRM and POS",
      tagLabel: "02 / 05 · ERP, CRM & POS",
      heading: "One system for stock,\\nsales and operations.",
      description: "Custom ERP, inventory, clinic and point-of-sale systems tailored to how your team actually works—replacing fragile spreadsheets and manual hand-offs.",
      bullets: [
        "Live stock, batch and expiry tracking",
        "Multi-branch POS and counter billing",
        "Role-based staff accounts and audit logs"
      ],
      ctaText: "Scope your ERP",
      terminalPath: "erp / operations-core",
      terminalLines: [
        { num: "01", text: "$ code init erp --branches=all --pos", type: "cmd" },
        { num: "02", text: "+ live stock synced across branches", type: "add" },
        { num: "03", text: "+ automated batch & expiry alerts", type: "add" },
        { num: "04", text: "+ zero end-of-day discrepancy", type: "add" },
        { num: "05", text: "> deployed to production", type: "out" }
      ]
    },
    {
      id: "automation",
      num: "03",
      tabLabel: "03 AUTOMATION",
      mobileTitle: "Automation",
      tagLabel: "03 / 05 · AUTOMATION",
      heading: "Eliminate repetitive\\nhand-built reports.",
      description: "Workflow automation that connects your billing, inventory, email, WhatsApp notifications and accounting so your team stops copying data by hand.",
      bullets: [
        "Automated daily & monthly reporting",
        "WhatsApp, SMS and email triggers",
        "Third-party API and accounting sync"
      ],
      ctaText: "Automate a workflow",
      terminalPath: "ops / workflow-sync",
      terminalLines: [
        { num: "01", text: "$ code automate --eliminate-manual-work", type: "cmd" },
        { num: "02", text: "+ nightly reconciliation automated", type: "add" },
        { num: "03", text: "+ instant customer invoice dispatch", type: "add" },
        { num: "04", text: "+ 14+ hrs saved every week", type: "add" },
        { num: "05", text: "> zero human copy-paste errors", type: "out" }
      ]
    },
    {
      id: "backend",
      num: "04",
      tabLabel: "04 BACKEND & DATABASE",
      mobileTitle: "Backend and database",
      tagLabel: "04 / 05 · BACKEND & DATABASE",
      heading: "Clean APIs and\\nrock-solid databases.",
      description: "High-concurrency REST APIs, PostgreSQL schema design, query optimization and cloud infrastructure engineered for security and 99.9% uptime.",
      bullets: [
        "PostgreSQL architecture & query tuning",
        "Secure REST APIs & authentication",
        "Cloud deployment, backups & monitoring"
      ],
      ctaText: "Discuss architecture",
      terminalPath: "api / db-cluster",
      terminalLines: [
        { num: "01", text: "$ code deploy api --db=postgres --ha", type: "cmd" },
        { num: "02", text: "+ indexed queries under 12ms", type: "add" },
        { num: "03", text: "+ automated encrypted daily backups", type: "add" },
        { num: "04", text: "+ role-based JWT security", type: "add" },
        { num: "05", text: "> 99.9% uptime SLA active", type: "out" }
      ]
    },
    {
      id: "consulting",
      num: "05",
      tabLabel: "05 CONSULTING & MENTORING",
      mobileTitle: "Consulting and mentoring",
      tagLabel: "05 / 05 · CONSULTING & MENTORING",
      heading: "Code audits, rescue\\nand 1-on-1 mentoring.",
      description: "Whether your existing business system is slow or your final-year IT project is stuck before the viva, our engineers step in to debug and ship.",
      bullets: [
        "Existing codebase & database refactoring",
        "Technical architecture roadmapping",
        "Final-year IT project & viva preparation"
      ],
      ctaText: "Book a session",
      terminalPath: "studio / advisory",
      terminalLines: [
        { num: "01", text: "$ code review --audit --unblock", type: "cmd" },
        { num: "02", text: "+ bottleneck identified in 1 session", type: "add" },
        { num: "03", text: "+ clean architecture & refactoring", type: "add" },
        { num: "04", text: "+ full system clarity for your team", type: "add" },
        { num: "05", text: "> ready to ship with confidence", type: "out" }
      ]
    }
  ];

  const FAQ_ITEMS = [
    {
      question: "What kind of projects do you take on?",
      answer: "Business websites and web apps, custom ERP, CRM and POS systems, workflow automation, REST APIs and database work, plus technical consulting and final-year IT project mentoring."
    },
    {
      question: "Do you work with clients outside Sri Lanka?",
      answer: "Yes. We are based in Colombo and work with local and international clients. Our portfolio includes businesses in the UK and Dubai."
    },
    {
      question: "Can you improve a system we already have?",
      answer: "Often that is the fastest fix. We review the existing code and database, then tune, refactor or extend it instead of starting over when that makes sense."
    },
    {
      question: "How is a project priced?",
      answer: "Every project is quoted after a short discovery call, once scope is clear. You get a fixed milestone breakdown with zero hidden fees."
    },
    {
      question: "Do you help university students?",
      answer: "Yes. Architecture guidance, 1-on-1 debugging and viva or defense preparation for Web, Mobile, AI/ML, Cloud and IoT projects."
    }
  ];

  const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("hashtag_code_projects_sync") : null;
  if (channel) {
    channel.onmessage = (ev) => {
      if (ev.data && Array.isArray(ev.data.projects)) {
        state.projects = ev.data.projects;
        render();
      }
    };
  }

  async function refreshProjects() {
    try {
      const res = await fetch("/api/projects", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.projects)) {
          state.projects = data.projects;
          render();
        }
      }
    } catch (e) {}
  }

  window.addEventListener("focus", refreshProjects);
  window.addEventListener("popstate", () => {
    window.scrollTo(0, 0);
    render();
  });

  window.navigateTo = function (url, ev) {
    if (ev) ev.preventDefault();
    state.mobileMenuOpen = false;
    if (url.startsWith("/#")) {
      const hash = url.slice(1);
      if (window.location.pathname !== "/") {
        history.pushState({}, "", "/");
        render();
      }
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 50);
      return;
    }
    history.pushState({}, "", url);
    window.scrollTo(0, 0);
    render();
  };

  function esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  const ARROW_UP_RIGHT = '<svg class="h-3.5 w-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M7 17L17 7M7 7h10v10" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function renderPreview(project, className, showBadge, numOverride) {
    const num = numOverride || project.number;
    const badge = showBadge
      ? '<div class="absolute top-3 left-3 z-20 inline-flex items-center rounded-full bg-white/95 backdrop-blur-sm px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-800 shadow-sm border border-black/5">' + esc(num) + ' / ' + esc(project.category) + '</div>'
      : '';

    if (project.image && project.image.trim() !== "") {
      return '<div class="relative w-full overflow-hidden bg-neutral-100 ' + className + '">' +
        badge +
        '<img src="' + esc(project.image) + '" alt="' + esc(project.title) + '" class="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />' +
      '</div>';
    }

    return '<div class="relative w-full overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 text-white p-5 flex flex-col justify-between select-none ' + className + '">' +
      badge +
      '<div class="flex items-center justify-between"><span class="inline-flex items-center gap-1 text-[9px] font-mono text-white/80"><span class="bg-[#D4FF00] text-black px-1 font-bold">#</span>code</span><span class="text-[8px] font-mono uppercase tracking-widest text-[#D4FF00]">' + esc(project.category) + '</span></div>' +
      '<div class="my-auto py-3"><div class="text-base font-bold tracking-tight text-white">' + esc(project.title) + '</div><div class="text-xs text-neutral-400 mt-0.5">' + esc(project.subtitle) + '</div></div>' +
      '<div class="flex items-center gap-1.5 text-[9px] font-mono text-neutral-400"><span class="h-1.5 w-1.5 rounded-full bg-[#D4FF00]"></span><span>LIVE IN PRODUCTION</span></div>' +
    '</div>';
  }

  function renderProjectCard(project, variant, displayIndex) {
    const num = displayIndex || project.number;
    return '<a href="/work/' + esc(project.slug) + '" onclick="navigateTo(\\'/work/' + esc(project.slug) + '\\', event)" class="group flex flex-col rounded-2xl border border-neutral-200/90 bg-white p-3 sm:p-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)] hover:border-neutral-300">' +
      '<div class="relative w-full overflow-hidden rounded-xl border border-neutral-100">' +
        renderPreview(project, "h-[205px] sm:h-[220px]", variant === "work", num) +
      '</div>' +
      '<div class="pt-4 pb-1 px-1.5 flex items-end justify-between gap-3">' +
        '<div>' +
          (variant === "home" ? '<div class="text-[10px] font-mono uppercase tracking-[0.14em] text-neutral-400 mb-1">' + esc(num) + ' / ' + esc(project.category) + '</div>' : '') +
          '<h3 class="text-[17px] font-bold tracking-tight text-neutral-950 group-hover:text-black">' + esc(project.title) + '</h3>' +
          '<p class="text-[12.5px] text-neutral-500 mt-0.5">' + esc(project.subtitle) + '</p>' +
        '</div>' +
        '<span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D4FF00] text-neutral-950 transition-transform duration-200 group-hover:scale-105 group-hover:rotate-45">' +
          ARROW_UP_RIGHT +
        '</span>' +
      '</div>' +
    '</a>';
  }

  function renderNavbar() {
    const pathname = window.location.pathname;
    const isWorkPage = pathname.startsWith("/work");
    return '<header data-cl-reveal class="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-neutral-200/80">' +
      '<div class="mx-auto flex max-w-[1280px] items-center justify-between px-5 sm:px-8 lg:px-12 h-[72px]">' +
        '<a href="/" onclick="navigateTo(\\'/\\', event)" class="inline-flex items-center text-[20px] font-extrabold tracking-tight text-neutral-950">' +
          '<span class="inline-flex items-center justify-center bg-[#D4FF00] px-1 py-0.5 leading-none mr-0.5 rounded-[2px]">#</span><span>code</span>' +
        '</a>' +
        '<nav class="hidden md:flex items-center gap-8 text-[13.5px] font-medium text-neutral-700">' +
          '<a href="/work" onclick="navigateTo(\\'/work\\', event)" class="transition-colors hover:text-neutral-950 ' + (isWorkPage ? 'text-neutral-950 underline decoration-[#D4FF00] decoration-2 underline-offset-8 font-semibold' : '') + '">Work</a>' +
          '<a href="/#services" onclick="navigateTo(\\'/#services\\', event)" class="transition-colors hover:text-neutral-950">Services</a>' +
          '<a href="/#process" onclick="navigateTo(\\'/#process\\', event)" class="transition-colors hover:text-neutral-950">Process</a>' +
          '<a href="/#students" onclick="navigateTo(\\'/#students\\', event)" class="transition-colors hover:text-neutral-950">Students</a>' +
          '<a href="/#faq" onclick="navigateTo(\\'/#faq\\', event)" class="transition-colors hover:text-neutral-950">FAQ</a>' +
        '</nav>' +
        '<div class="hidden md:flex items-center gap-3">' +
          '<a href="/#contact" onclick="navigateTo(\\'/#contact\\', event)" class="group inline-flex items-center gap-3 rounded-full bg-neutral-950 pl-5 pr-1.5 py-1.5 text-[13px] font-semibold text-white transition-all hover:bg-neutral-800">' +
            '<span>Start a project</span>' +
            '<span class="flex h-7 w-7 items-center justify-center rounded-full bg-[#D4FF00] text-neutral-950 transition-transform duration-200 group-hover:rotate-45">' + ARROW_UP_RIGHT + '</span>' +
          '</a>' +
        '</div>' +
        '<div class="flex md:hidden items-center gap-2">' +
          '<a href="/#contact" onclick="navigateTo(\\'/#contact\\', event)" class="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-950 text-white">' + ARROW_UP_RIGHT + '</a>' +
          '<button type="button" onclick="toggleMobileMenu()" class="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-900 font-mono text-lg">' + (state.mobileMenuOpen ? '✕' : '=') + '</button>' +
        '</div>' +
      '</div>' +
      (state.mobileMenuOpen ? (
        '<div class="md:hidden border-t border-neutral-200 bg-white px-5 py-6 space-y-4 shadow-lg">' +
          '<div class="flex flex-col space-y-3 text-base font-semibold text-neutral-900">' +
            '<a href="/work" onclick="navigateTo(\\'/work\\', event)" class="py-1">Work</a>' +
            '<a href="/#services" onclick="navigateTo(\\'/#services\\', event)" class="py-1">Services</a>' +
            '<a href="/#process" onclick="navigateTo(\\'/#process\\', event)" class="py-1">Process</a>' +
            '<a href="/#students" onclick="navigateTo(\\'/#students\\', event)" class="py-1">Students</a>' +
            '<a href="/#faq" onclick="navigateTo(\\'/#faq\\', event)" class="py-1">FAQ</a>' +
          '</div>' +
        '</div>'
      ) : '') +
    '</header>';
  }

  function renderFooter() {
    return '<footer class="relative w-full bg-white border-t border-neutral-200/80 pt-16 pb-10 overflow-hidden">' +
      '<div class="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">' +
        '<div class="flex flex-col md:flex-row justify-between gap-10">' +
          '<div class="max-w-xs">' +
            '<a href="/" onclick="navigateTo(\\'/\\', event)" class="inline-flex items-center text-[20px] font-extrabold tracking-tight text-neutral-950">' +
              '<span class="inline-flex items-center justify-center bg-[#D4FF00] px-1 py-0.5 leading-none mr-0.5 rounded-[2px]">#</span><span>code</span>' +
            '</a>' +
            '<p class="mt-4 text-[13px] leading-relaxed text-neutral-600">Custom ERP, web applications and backend engineering for growing businesses.</p>' +
          '</div>' +
          '<div class="flex gap-16 sm:gap-24">' +
            '<div>' +
              '<div class="text-[10px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-3.5">STUDIO</div>' +
              '<ul class="space-y-2.5 text-[13px] font-medium text-neutral-800">' +
                '<li><a href="/work" onclick="navigateTo(\\'/work\\', event)" class="hover:text-neutral-950">Work</a></li>' +
                '<li><a href="/#services" onclick="navigateTo(\\'/#services\\', event)" class="hover:text-neutral-950">Services</a></li>' +
                '<li><a href="/#process" onclick="navigateTo(\\'/#process\\', event)" class="hover:text-neutral-950">Process</a></li>' +
                '<li><a href="/#students" onclick="navigateTo(\\'/#students\\', event)" class="hover:text-neutral-950">Students</a></li>' +
              '</ul>' +
            '</div>' +
            '<div>' +
              '<div class="text-[10px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-3.5">ELSEWHERE</div>' +
              '<ul class="space-y-2.5 text-[13px] font-medium text-neutral-800">' +
                '<li><a href="https://linkedin.com" target="_blank" rel="noreferrer" class="hover:text-neutral-950">LinkedIn</a></li>' +
                '<li><a href="https://instagram.com" target="_blank" rel="noreferrer" class="hover:text-neutral-950">Instagram</a></li>' +
                '<li><a href="mailto:hasgtagcode.solutions@gmail.com" class="hover:text-neutral-950">Email</a></li>' +
                '<li><a href="/admin" onclick="navigateTo(\\'/admin\\', event)" class="text-neutral-400 hover:text-neutral-950 font-mono text-[11px]">Admin</a></li>' +
              '</ul>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="my-10 sm:my-14 select-none pointer-events-none">' +
          '<div aria-hidden="true" class="text-[96px] sm:text-[165px] md:text-[220px] lg:text-[260px] font-extrabold leading-[0.82] tracking-[-0.05em] text-[#EEFF8A]">#code</div>' +
        '</div>' +
        '<div class="pt-6 border-t border-neutral-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] font-mono text-neutral-500">' +
          '<div>© 2026 #code · Colombo, Sri Lanka</div>' +
          '<div>Engineering scalable solutions. Building the fix.</div>' +
        '</div>' +
      '</div>' +
    '</footer>';
  }

  function renderHomePage() {
    const projects = state.projects;
    const featured = projects.filter((p) => p.featuredOnHome).sort((a, b) => (a.homeOrder ?? 99) - (b.homeOrder ?? 99));
    const homeProjects = featured.length > 0 ? featured : projects.slice(0, 4);
    const countryLife = projects.find((p) => p.slug === "country-life-sl") || projects[0];
    const medisquare = projects.find((p) => p.slug === "medisquare") || projects[1] || projects[0];
    const currentService = SERVICE_PILLARS[state.activeTab] || SERVICE_PILLARS[0];

    return '<div class="relative min-h-screen bg-white text-neutral-950 overflow-x-hidden">' +
      '<svg aria-hidden="true" class="pointer-events-none absolute inset-0 w-full h-full z-0 hidden md:block" preserveAspectRatio="none">' +
        '<path d="M 1050 80 C 650 380, 120 750, 210 1350 C 300 1950, 1180 1850, 1060 2650 C 940 3450, 160 3650, 260 4450 C 360 5150, 1080 5350, 960 6100" fill="none" stroke="#E5E5E0" stroke-width="1.15" />' +
      '</svg>' +
      renderNavbar() +
      '<main class="relative z-10">' +
        // HERO
        '<section class="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 pt-10 sm:pt-16 lg:pt-20 pb-14 lg:pb-24">' +
          '<div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">' +
            '<div class="lg:col-span-6" data-cl-reveal style="--cl-delay:80ms">' +
              '<div class="text-[11px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-5">#CODE · ENGINEERING SCALABLE SOLUTIONS</div>' +
              '<h1 class="text-[46px] sm:text-[64px] lg:text-[72px] font-extrabold leading-[0.98] tracking-[-0.04em] text-neutral-950">' +
                'Have a<br/>problem?<br/>Let&rsquo;s build<br/>' +
                '<span class="relative inline-block z-10">the fix.<span aria-hidden="true" class="absolute left-[-4px] right-[-6px] bottom-[4px] sm:bottom-[6px] h-[36%] bg-[#D4FF00] -z-10"></span></span>' +
              '</h1>' +
              '<p class="mt-6 max-w-[460px] text-[15px] sm:text-[16.5px] leading-[1.6] text-neutral-600">An engineering-first software studio in Colombo. Web platforms, custom ERP and POS, automation and backends for growing businesses.</p>' +
              (countryLife ? '<div class="mt-6 block lg:hidden rounded-2xl overflow-hidden border border-neutral-200 shadow-md">' + renderPreview(countryLife, "h-[210px]", false) + '</div>' : '') +
              '<div class="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">' +
                '<a href="/#contact" onclick="navigateTo(\\'/#contact\\', event)" class="group inline-flex items-center justify-between sm:justify-start gap-4 rounded-full bg-neutral-950 pl-6 pr-2 py-2 text-[14px] font-semibold text-white transition-all hover:bg-neutral-800">' +
                  '<span>Start a project</span>' +
                  '<span class="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4FF00] text-neutral-950 transition-transform duration-200 group-hover:rotate-45">' + ARROW_UP_RIGHT + '</span>' +
                '</a>' +
                '<a href="/work" onclick="navigateTo(\\'/work\\', event)" class="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-7 py-3 text-[14px] font-semibold text-neutral-900 transition-colors hover:bg-neutral-50 hover:border-neutral-300">See our work</a>' +
              '</div>' +
            '</div>' +
            '<div class="hidden lg:block lg:col-span-6 relative" data-cl-reveal style="--cl-delay:200ms">' +
              '<div class="relative mx-auto max-w-[560px]">' +
                '<div class="relative h-[250px] flex items-center justify-center">' +
                  (countryLife ? (
                    '<a href="/work/' + esc(countryLife.slug) + '" onclick="navigateTo(\\'/work/' + esc(countryLife.slug) + '\\', event)" class="group absolute left-2 top-6 w-[290px] rounded-xl bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-neutral-200/80 -rotate-[4deg] transition-transform duration-300 hover:rotate-0 hover:z-30">' +
                      '<div class="rounded-lg overflow-hidden">' + renderPreview(countryLife, "h-[175px]", false) + '</div>' +
                      '<div class="pt-2 pb-0.5 px-1 text-[10px] font-mono text-neutral-500">Country Life SL · WEB</div>' +
                    '</a>'
                  ) : '') +
                  (medisquare ? (
                    '<a href="/work/' + esc(medisquare.slug) + '" onclick="navigateTo(\\'/work/' + esc(medisquare.slug) + '\\', event)" class="group absolute right-2 top-0 w-[300px] z-20 rounded-xl bg-white p-2 shadow-[0_24px_60px_rgba(0,0,0,0.14)] border border-neutral-200/90 rotate-[4deg] transition-transform duration-300 hover:rotate-0">' +
                      '<div class="rounded-lg overflow-hidden">' + renderPreview(medisquare, "h-[180px]", false) + '</div>' +
                      '<div class="pt-2 pb-0.5 px-1 text-[10px] font-mono text-neutral-500">Medisquare · ERP</div>' +
                    '</a>'
                  ) : '') +
                '</div>' +
                '<div class="relative z-30 mt-2 mx-auto w-[92%] rounded-xl bg-[#F9F9F8] border border-neutral-200/90 shadow-[0_16px_40px_rgba(0,0,0,0.06)] overflow-hidden">' +
                  '<div class="flex items-center gap-2 px-4 py-2.5 border-b border-neutral-200/70 bg-[#F3F3F1]">' +
                    '<span class="h-2.5 w-2.5 rounded-full bg-[#FF5F56]"></span><span class="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]"></span><span class="h-2.5 w-2.5 rounded-full bg-[#27C93F]"></span>' +
                    '<span class="ml-1 text-[11px] font-mono text-neutral-400">~/clients/your-business</span>' +
                  '</div>' +
                  '<div class="p-4 sm:p-5 font-mono text-[12px] leading-[1.7] text-neutral-700">' +
                    '<div><span class="text-neutral-400">$</span> <span class="font-semibold text-neutral-900">code diagnose --business</span></div>' +
                    '<div class="pl-3 text-neutral-500"><span class="text-red-500 font-semibold">x</span> stock tracked in 4 spreadsheets <span class="text-red-500 font-semibold ml-1">x</span> reports built by hand every night<span class="text-neutral-400">$</span> <span class="font-semibold text-neutral-900">code build --fix</span></div>' +
                    '<div class="pl-3 text-neutral-600"><span class="text-emerald-600 font-semibold">+</span> ERP and POS synced across branches <span class="text-emerald-600 font-semibold ml-1">+</span> fast, SEO-ready web platform<span class="text-neutral-400">$</span> <span class="inline-block h-3.5 w-1.5 bg-neutral-900 align-middle animate-pulse ml-0.5"></span></div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</section>' +

        // TICKER
        '<div class="w-full bg-[#F6F6F4] border-y border-neutral-200/80 py-3.5 overflow-x-auto no-scrollbar">' +
          '<div class="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 flex items-center justify-between gap-6 whitespace-nowrap text-[10.5px] font-mono uppercase tracking-[0.14em] text-neutral-600">' +
            '<span>99.9% UPTIME</span><span class="text-neutral-300">/</span><span>SUB-SECOND PAGE LOADS</span><span class="text-neutral-300">/</span><span>ZERO END-OF-DAY STOCK DISCREPANCY</span><span class="text-neutral-300">/</span><span>AUTOMATED EXPIRY TRACKING</span><span class="text-neutral-300">/</span><span>LESS MANUAL WORK</span>' +
          '</div>' +
        '</div>' +

        // MOBILE SINHALA SECTION
        '<section class="block md:hidden mx-auto max-w-[1280px] px-5 pt-12 pb-6">' +
          '<div class="text-[10px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-3">01 / WEB PRESENCE</div>' +
          '<h2 class="text-[28px] font-extrabold leading-[1.2] tracking-tight text-neutral-950">ඔබේ ව්‍යාපාරයටත්<br/>Modern Website එකක්<br/><span class="relative inline-block z-10">අදම හදාගන්න<span class="absolute left-[-2px] right-[-2px] bottom-[2px] h-[36%] bg-[#D4FF00] -z-10"></span></span></h2>' +
          '<p class="mt-3 text-[14px] leading-relaxed text-neutral-600">Social media වල විතරක් සීමා වෙන්න එපා. 24/7 විවෘත, customer trust එක build කරන website එකක්.</p>' +
        '</section>' +

        // WHO WE ARE
        '<section class="hidden md:block mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 py-24 lg:py-32 text-center">' +
          '<div class="text-[10.5px] font-mono uppercase tracking-[0.18em] text-neutral-400 mb-5">#CODE / WHO WE ARE</div>' +
          '<h2 class="mx-auto max-w-[760px] text-[40px] sm:text-[52px] lg:text-[60px] font-extrabold leading-[1.04] tracking-[-0.04em]">' +
            '<span class="text-neutral-950 block">Engineering-first.</span>' +
            '<span class="text-neutral-500 block">Built by hands-on</span>' +
            '<span class="text-neutral-500 block">developers.</span>' +
          '</h2>' +
          '<p class="mx-auto mt-6 max-w-[520px] text-[15px] sm:text-[16px] leading-[1.65] text-neutral-600">No account managers between you and the people writing your code. We architect, build and support every system ourselves.</p>' +
        '</section>' +

        // WHAT WE BUILD
        '<section id="services" class="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 pt-8 pb-20 lg:py-24">' +
          // Mobile list
          '<div class="block md:hidden">' +
            '<div class="text-[10px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-4">WHAT WE BUILD</div>' +
            '<div class="divide-y divide-neutral-200 border-y border-neutral-200">' +
              SERVICE_PILLARS.map((p, idx) => (
                '<div class="py-4">' +
                  '<button type="button" onclick="setServiceTab(' + idx + ')" class="w-full flex items-center justify-between text-left">' +
                    '<div class="flex items-center gap-3"><span class="text-[11px] font-mono text-neutral-400">' + p.num + '</span><span class="text-[17px] font-bold text-neutral-950">' + esc(p.mobileTitle) + '</span></div>' +
                    '<span class="text-sm font-mono">' + (state.activeTab === idx ? '↓' : '→') + '</span>' +
                  '</button>' +
                  (state.activeTab === idx ? (
                    '<div class="mt-3 pl-7 pr-2 space-y-2 text-[13.5px] text-neutral-600">' +
                      '<p>' + esc(p.description) + '</p>' +
                    '</div>'
                  ) : '') +
                '</div>'
              )).join('') +
            '</div>' +
          '</div>' +
          // Desktop tabs
          '<div class="hidden md:block">' +
            '<div class="flex items-end justify-between pb-5 border-b border-neutral-200/90">' +
              '<h2 class="text-[32px] lg:text-[38px] font-extrabold tracking-[-0.03em] text-neutral-950 leading-none">What we build</h2>' +
              '<span class="text-[11px] font-mono uppercase tracking-[0.16em] text-neutral-400">05 SERVICE PILLARS</span>' +
            '</div>' +
            '<div class="mt-5 grid grid-cols-5 gap-3">' +
              SERVICE_PILLARS.map((p, idx) => (
                '<button type="button" onclick="setServiceTab(' + idx + ')" class="rounded-lg px-4 py-3 text-left text-[11px] font-mono uppercase tracking-[0.12em] transition-all cursor-pointer ' +
                  (state.activeTab === idx ? 'bg-neutral-950 text-white font-semibold shadow-xs' : 'bg-[#F7F7F5] text-neutral-600 hover:bg-neutral-200/70 hover:text-neutral-950 border border-neutral-200/60') + '">' +
                  esc(p.tabLabel) +
                '</button>'
              )).join('') +
            '</div>' +
            '<div class="mt-8 h-[2px] w-full bg-neutral-200/80 relative">' +
              '<div class="h-[2.5px] bg-neutral-950 transition-all duration-300" style="width:20%;margin-left:' + (state.activeTab * 20) + '%"></div>' +
            '</div>' +
            '<div class="mt-12 grid grid-cols-12 gap-10 items-center">' +
              '<div class="col-span-6">' +
                '<div class="text-[10.5px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-3">' + esc(currentService.tagLabel) + '</div>' +
                '<h3 class="text-[36px] lg:text-[42px] font-extrabold leading-[1.06] tracking-[-0.035em] text-neutral-950 whitespace-pre-line">' + esc(currentService.heading) + '</h3>' +
                '<p class="mt-4 max-w-[470px] text-[15px] leading-[1.65] text-neutral-600">' + esc(currentService.description) + '</p>' +
                '<ul class="mt-6 space-y-2.5">' +
                  currentService.bullets.map((b) => (
                    '<li class="flex items-center gap-3 text-[13.5px] font-medium text-neutral-800">' +
                      '<span class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] bg-[#D4FF00] text-[11px] font-mono font-bold text-neutral-950">+</span>' +
                      '<span>' + esc(b) + '</span>' +
                    '</li>'
                  )).join('') +
                '</ul>' +
                '<div class="mt-8">' +
                  '<a href="/#contact" onclick="navigateTo(\\'/#contact\\', event)" class="inline-block text-[13.5px] font-bold text-neutral-950 border-b-[3px] border-[#D4FF00] pb-0.5 hover:opacity-80">' + esc(currentService.ctaText) + '</a>' +
                '</div>' +
              '</div>' +
              '<div class="col-span-6">' +
                '<div class="rounded-2xl bg-[#F4F4F2] border border-neutral-200/80 p-6 lg:p-8">' +
                  '<div class="flex items-center gap-2 pb-4 mb-4 border-b border-neutral-200/70">' +
                    '<span class="h-2.5 w-2.5 rounded-full bg-[#FF5F56]/70"></span><span class="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]/70"></span><span class="h-2.5 w-2.5 rounded-full bg-[#27C93F]/70"></span>' +
                    '<span class="ml-2 text-[11px] font-mono text-neutral-400">' + esc(currentService.terminalPath) + '</span>' +
                  '</div>' +
                  '<div class="space-y-2.5 font-mono text-[12.5px] leading-relaxed">' +
                    currentService.terminalLines.map((l) => (
                      '<div class="flex items-start gap-5"><span class="text-neutral-300 select-none">' + l.num + '</span><span class="' + (l.type === "cmd" ? "font-semibold text-neutral-900" : "text-neutral-700 pl-3") + '">' + esc(l.text) + '</span></div>'
                    )).join('') +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</section>' +

        // SELECTED WORK
        '<section class="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 py-16 lg:py-24">' +
          '<div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-12">' +
            '<div>' +
              '<div class="text-[10.5px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-3">SELECTED WORK</div>' +
              '<h2 class="text-[38px] sm:text-[50px] lg:text-[56px] font-extrabold leading-[1.02] tracking-[-0.04em] text-neutral-950">Shipped. Live.<br/><span class="relative inline-block z-10">In production.<span aria-hidden="true" class="absolute left-[-4px] right-[-4px] bottom-[3px] sm:bottom-[5px] h-[36%] bg-[#D4FF00] -z-10"></span></span></h2>' +
            '</div>' +
            '<a href="/work" onclick="navigateTo(\\'/work\\', event)" class="hidden sm:inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-[13px] font-semibold text-neutral-900 transition-colors hover:bg-neutral-50 hover:border-neutral-300">View all ' + projects.length + ' projects</a>' +
          '</div>' +
          '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">' +
            homeProjects.map((p) => renderProjectCard(p, "home", p.number)).join('') +
          '</div>' +
          '<div class="mt-6 sm:hidden">' +
            '<a href="/work" onclick="navigateTo(\\'/work\\', event)" class="flex w-full items-center justify-center rounded-full border border-neutral-200 bg-white py-3.5 text-[13px] font-mono font-medium text-neutral-900">View all ' + projects.length + ' projects →</a>' +
          '</div>' +
        '</section>' +

        // HOW WE WORK
        '<section id="process" class="w-full bg-[#F6F6F4] border-t border-neutral-200/60 py-20 lg:py-28">' +
          '<div class="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">' +
            '<div class="text-[10.5px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-3">HOW WE WORK</div>' +
            '<h2 class="text-[38px] sm:text-[50px] lg:text-[56px] font-extrabold leading-[1.03] tracking-[-0.04em] text-neutral-950">Four steps.<br/><span class="relative inline-block z-10">Zero guesswork.<span class="absolute left-[-4px] right-[-4px] bottom-[3px] sm:bottom-[5px] h-[36%] bg-[#D4FF00] -z-10"></span></span></h2>' +
            '<p class="mt-4 max-w-[540px] text-[14.5px] sm:text-[15.5px] text-neutral-600">From the first call to long after launch, you always know what is being built and why.</p>' +
            '<div class="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">' +
              [
                { step: "01 / DISCOVER", title: "Find the real\\nbottleneck.", desc: "We map how your business actually runs today: the spreadsheets, workarounds and hand-offs." },
                { step: "02 / ARCHITECT", title: "Design before we\\nbuild.", desc: "Data model, integrations and scope agreed up front, so the build has no surprises." },
                { step: "03 / BUILD", title: "Ship in visible\\nsteps.", desc: "Working software in short cycles you can click through, not a big reveal at the end." },
                { step: "04 / SUPPORT", title: "Stay fast after\\nlaunch.", desc: "Monitoring, maintenance and improvements as your business and data grow." }
              ].map((s) => (
                '<div class="rounded-2xl bg-white border border-neutral-200/80 p-6 sm:p-7 flex flex-col justify-between">' +
                  '<div><div class="text-[10px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-5">' + s.step + '</div>' +
                  '<h3 class="text-[20px] font-extrabold leading-[1.2] tracking-tight text-neutral-950 whitespace-pre-line">' + s.title + '</h3>' +
                  '<p class="mt-3.5 text-[13px] leading-[1.6] text-neutral-600">' + s.desc + '</p></div>' +
                '</div>'
              )).join('') +
            '</div>' +
            '<div class="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">' +
              '<span class="text-[15px] font-medium text-neutral-700">Have a business bottleneck?</span>' +
              '<a href="/#contact" onclick="navigateTo(\\'/#contact\\', event)" class="group inline-flex items-center gap-3.5 rounded-full bg-neutral-950 pl-6 pr-2 py-2 text-[13.5px] font-semibold text-white transition-all hover:bg-neutral-800">' +
                '<span>Book a discovery call</span>' +
                '<span class="flex h-7 w-7 items-center justify-center rounded-full bg-[#D4FF00] text-neutral-950 transition-transform duration-200 group-hover:rotate-45">' + ARROW_UP_RIGHT + '</span>' +
              '</a>' +
            '</div>' +
          '</div>' +
        '</section>' +

        // CAMPUS.DEBUG
        '<section id="students" class="w-full bg-[#D4FF00] py-20 lg:py-28">' +
          '<div class="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">' +
            '<div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">' +
              '<div class="lg:col-span-6">' +
                '<div class="text-[10.5px] font-mono uppercase tracking-[0.16em] text-neutral-800/80 mb-4">03 / CAMPUS.DEBUG</div>' +
                '<h2 class="text-[40px] sm:text-[52px] lg:text-[58px] font-extrabold leading-[1.02] tracking-[-0.04em] text-neutral-950">Final-year IT<br/>project stuck?<br/>We help you<br/>code and deliver.</h2>' +
                '<p class="mt-5 max-w-[440px] text-[15px] leading-[1.6] text-neutral-900/85">End-to-end guidance for Web, Mobile, AI/ML, Cloud and IoT projects, from architecture to the viva.</p>' +
                '<div class="mt-8">' +
                  '<a href="/#contact" onclick="navigateTo(\\'/#contact\\', event)" class="group inline-flex items-center gap-3.5 rounded-full bg-neutral-950 pl-6 pr-2 py-2 text-[13.5px] font-semibold text-white transition-all hover:bg-neutral-800">' +
                    '<span>Book a consultation</span>' +
                    '<span class="flex h-7 w-7 items-center justify-center rounded-full bg-[#D4FF00] text-neutral-950 transition-transform duration-200 group-hover:rotate-45">' + ARROW_UP_RIGHT + '</span>' +
                  '</a>' +
                '</div>' +
              '</div>' +
              '<div class="lg:col-span-6 space-y-4">' +
                '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">' +
                  '<div class="rounded-2xl bg-white p-6"><div class="text-[10px] font-mono text-neutral-400 mb-2">01</div><h3 class="text-[18px] font-extrabold tracking-tight text-neutral-950">Clean architecture</h3><p class="mt-2 text-[13px] leading-relaxed text-neutral-600">Industry-standard structure your supervisor will recognise.</p></div>' +
                  '<div class="rounded-2xl bg-white p-6"><div class="text-[10px] font-mono text-neutral-400 mb-2">02</div><h3 class="text-[18px] font-extrabold tracking-tight text-neutral-950">1-on-1 debugging</h3><p class="mt-2 text-[13px] leading-relaxed text-neutral-600">Live sessions to unblock the bugs that cost you weeks.</p></div>' +
                '</div>' +
                '<div class="rounded-2xl bg-neutral-950 text-white p-6 sm:p-7"><div class="text-[10px] font-mono text-[#D4FF00] mb-2">03</div><h3 class="text-[18px] font-extrabold tracking-tight text-white">Viva and defense preparation</h3><p class="mt-2 text-[13px] leading-relaxed text-neutral-300">Walk in knowing every design decision in your own system, and why you made it.</p></div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</section>' +

        // FAQ
        '<section id="faq" class="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 py-20 lg:py-28 border-b border-neutral-200/70">' +
          '<div class="grid grid-cols-1 lg:grid-cols-12 gap-12">' +
            '<div class="lg:col-span-5">' +
              '<div class="text-[10.5px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-3">FAQ</div>' +
              '<h2 class="text-[36px] sm:text-[44px] font-extrabold leading-[1.08] tracking-[-0.035em] text-neutral-950">A little more about<br/><span class="relative inline-block z-10">#code.<span class="absolute left-[-4px] right-[-4px] bottom-[3px] h-[36%] bg-[#D4FF00] -z-10"></span></span></h2>' +
            '</div>' +
            '<div class="lg:col-span-7 divide-y divide-neutral-200/90">' +
              FAQ_ITEMS.map((item, idx) => {
                const isOpen = state.openFaq === idx;
                return '<div class="py-5 first:pt-0">' +
                  '<button type="button" onclick="toggleFaq(' + idx + ')" class="w-full flex items-center justify-between gap-4 text-left cursor-pointer group">' +
                    '<span class="text-[16px] sm:text-[17px] font-bold text-neutral-950 group-hover:text-neutral-700">' + esc(item.question) + '</span>' +
                    '<span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 font-mono text-sm">' + (isOpen ? '−' : '+') + '</span>' +
                  '</button>' +
                  (isOpen ? '<p class="mt-3.5 pr-10 text-[14px] leading-[1.65] text-neutral-600">' + esc(item.answer) + '</p>' : '') +
                '</div>';
              }).join('') +
            '</div>' +
          '</div>' +
        '</section>' +

        // CONTACT
        '<section id="contact" class="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 py-20 lg:py-28">' +
          '<div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-start">' +
            '<div class="lg:col-span-6">' +
              '<div class="text-[10.5px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-3">04 / LET&apos;S COLLABORATE</div>' +
              '<h2 class="text-[42px] sm:text-[54px] lg:text-[60px] font-extrabold leading-[1.02] tracking-[-0.04em] text-neutral-950">Your next<br/>system starts<br/><span class="relative inline-block z-10">here.<span class="absolute left-[-4px] right-[-4px] bottom-[4px] h-[36%] bg-[#D4FF00] -z-10"></span></span></h2>' +
              '<p class="mt-5 max-w-[420px] text-[15px] leading-[1.6] text-neutral-600">Tell us what is slowing your business down. An engineer, not a salesperson, replies.</p>' +
              '<div class="mt-8 pt-7 border-t border-neutral-200/80 space-y-5 max-w-[420px]">' +
                '<div><div class="text-[10px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-1">EMAIL</div><a href="mailto:hasgtagcode.solutions@gmail.com" class="text-[16px] font-bold text-neutral-950 hover:underline decoration-[#D4FF00] decoration-2">hasgtagcode.solutions@gmail.com</a></div>' +
                '<div><div class="text-[10px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-1">STUDIO</div><div class="text-[16px] font-bold text-neutral-950">Colombo, Sri Lanka</div></div>' +
              '</div>' +
            '</div>' +
            '<div class="lg:col-span-6">' +
              '<div class="rounded-2xl bg-white border border-neutral-200/90 p-6 sm:p-9 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">' +
                '<h3 class="text-[20px] font-extrabold tracking-tight text-neutral-950 mb-6">Start a project</h3>' +
                (state.contactSubmitted ? (
                  '<div class="rounded-xl bg-[#F6F6F4] p-6 text-center space-y-3">' +
                    '<div class="text-lg font-bold text-neutral-950">Enquiry received!</div>' +
                    '<p class="text-sm text-neutral-600">One of our engineers will review your bottleneck and reply shortly.</p>' +
                    '<button type="button" onclick="resetContactForm()" class="mt-2 inline-block text-xs font-mono underline text-neutral-700">Send another message</button>' +
                  '</div>'
                ) : (
                  '<form onsubmit="submitContactForm(event)" class="space-y-4">' +
                    '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">' +
                      '<div><label class="block text-[11.5px] font-medium text-neutral-600 mb-1.5">Name</label><input type="text" required placeholder="Your name" class="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-[13.5px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none" /></div>' +
                      '<div><label class="block text-[11.5px] font-medium text-neutral-600 mb-1.5">Email</label><input type="email" required placeholder="you@company.com" class="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-[13.5px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none" /></div>' +
                    '</div>' +
                    '<div><label class="block text-[11.5px] font-medium text-neutral-600 mb-1.5">Company</label><input type="text" placeholder="Business name" class="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-[13.5px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none" /></div>' +
                    '<div><label class="block text-[11.5px] font-medium text-neutral-600 mb-1.5">What is the bottleneck?</label><textarea rows="4" required placeholder="e.g. Stock is tracked in Excel across three branches and never matches at day end." class="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-[13.5px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none resize-none"></textarea></div>' +
                    '<button type="submit" class="mt-2 w-full rounded-full bg-neutral-950 py-3.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-neutral-800 cursor-pointer">Let&apos;s build the fix</button>' +
                  '</form>'
                )) +
              '</div>' +
            '</div>' +
          '</div>' +
        '</section>' +
      '</main>' +
      renderFooter() +
    '</div>';
  }

  function renderWorkPage() {
    const projects = state.projects;
    const webCount = projects.filter((p) => p.category === "WEB").length;
    const erpCount = projects.filter((p) => p.category === "ERP").length;
    const filtered = projects.filter((p) => state.workFilter === "ALL" ? true : p.category === state.workFilter);

    return '<div class="relative min-h-screen bg-white text-neutral-950 overflow-x-hidden">' +
      renderNavbar() +
      '<main class="relative z-10">' +
        '<section class="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 pt-12 sm:pt-16 lg:pt-20 pb-10">' +
          '<div class="text-[10.5px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-4">WORK · 2024 — 2026</div>' +
          '<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">' +
            '<div class="lg:col-span-8">' +
              '<h1 class="text-[44px] sm:text-[62px] lg:text-[72px] font-extrabold leading-[0.98] tracking-[-0.04em] text-neutral-950">' +
                projects.length + ' projects.<br/>' +
                '<span class="relative inline-block z-10">All in production.<span class="absolute left-[-4px] right-[-6px] bottom-[4px] sm:bottom-[6px] h-[36%] bg-[#D4FF00] -z-10"></span></span>' +
              '</h1>' +
            '</div>' +
            '<div class="lg:col-span-4 pb-1"><p class="text-[14.5px] sm:text-[15px] leading-[1.65] text-neutral-600">Web platforms and business systems for clients in Sri Lanka, the UK and Dubai. Every one is live. Click through and use it.</p></div>' +
          '</div>' +
          '<div class="mt-12 pt-6 border-t border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">' +
            '<div class="flex flex-wrap items-center gap-2.5">' +
              '<button type="button" onclick="setWorkFilter(\\'ALL\\')" class="rounded-full px-4 py-2 text-[11.5px] font-mono transition-all cursor-pointer ' + (state.workFilter === "ALL" ? "bg-neutral-950 text-white font-semibold" : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300") + '">All projects · ' + projects.length + '</button>' +
              '<button type="button" onclick="setWorkFilter(\\'WEB\\')" class="rounded-full px-4 py-2 text-[11.5px] font-mono transition-all cursor-pointer ' + (state.workFilter === "WEB" ? "bg-neutral-950 text-white font-semibold" : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300") + '">Web platforms · ' + webCount + '</button>' +
              '<button type="button" onclick="setWorkFilter(\\'ERP\\')" class="rounded-full px-4 py-2 text-[11.5px] font-mono transition-all cursor-pointer ' + (state.workFilter === "ERP" ? "bg-neutral-950 text-white font-semibold" : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300") + '">ERP and systems · ' + erpCount + '</button>' +
            '</div>' +
            '<div class="text-[11.5px] font-mono text-neutral-400">Showing ' + filtered.length + ' of ' + projects.length + '</div>' +
          '</div>' +
        '</section>' +
        '<section class="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 pb-20 lg:pb-28">' +
          '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">' +
            filtered.map((p, idx) => renderProjectCard(p, "work", state.workFilter === "ALL" ? String(idx + 1).padStart(2, "0") : p.number)).join('') +
          '</div>' +
        '</section>' +
        '<section class="w-full bg-[#D4FF00] py-20 lg:py-24">' +
          '<div class="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">' +
            '<h2 class="text-[40px] sm:text-[52px] lg:text-[58px] font-extrabold leading-[1.02] tracking-[-0.04em] text-neutral-950">Your project<br/>could be next.</h2>' +
            '<a href="/#contact" onclick="navigateTo(\\'/#contact\\', event)" class="group inline-flex items-center gap-3.5 rounded-full bg-neutral-950 pl-6 pr-2 py-2.5 text-[14px] font-semibold text-white transition-all hover:bg-neutral-800">' +
              '<span>Let&apos;s build the fix</span>' +
              '<span class="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4FF00] text-neutral-950 transition-transform duration-200 group-hover:rotate-45">' + ARROW_UP_RIGHT + '</span>' +
            '</a>' +
          '</div>' +
        '</section>' +
      '</main>' +
      renderFooter() +
    '</div>';
  }

  function renderCaseStudyPage(slug) {
    const projects = state.projects;
    const idx = projects.findIndex((p) => p.slug === slug || p.id === slug);
    const project = idx !== -1 ? projects[idx] : projects[1] || projects[0];
    if (!project) return renderWorkPage();
    const nextProject = projects[(idx + 1 + projects.length) % projects.length] || project;
    const modules = project.modules || [];
    const outcomes = project.outcomes || [];

    return '<div class="relative min-h-screen bg-white text-neutral-950 overflow-x-hidden">' +
      renderNavbar() +
      '<main class="relative z-10">' +
        '<section class="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 pt-10 sm:pt-14 pb-16">' +
          '<a href="/work" onclick="navigateTo(\\'/work\\', event)" class="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.16em] text-neutral-400 hover:text-neutral-900 mb-8">← ALL WORK</a>' +
          '<div class="text-[10.5px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-3">CASE STUDY · ' + esc(project.number) + ' / ' + esc(project.category) + '</div>' +
          '<h1 class="text-[42px] sm:text-[60px] lg:text-[68px] font-extrabold leading-[1.02] tracking-[-0.04em] text-neutral-950">' +
            esc(project.heroHeading || project.title) + '<br/>' +
            '<span class="relative inline-block z-10">' + esc(project.heroHighlight || project.subtitle) + '<span class="absolute left-[-4px] right-[-6px] bottom-[4px] sm:bottom-[6px] h-[36%] bg-[#D4FF00] -z-10"></span></span>' +
          '</h1>' +
          '<div class="mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6">' +
            '<p class="max-w-[540px] text-[15px] sm:text-[16px] leading-[1.65] text-neutral-600">' + esc(project.summary || project.subtitle) + '</p>' +
            (project.liveUrl ? '<a href="' + esc(project.liveUrl) + '" target="_blank" rel="noreferrer" class="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-2.5 text-[12.5px] font-semibold text-neutral-900 hover:bg-neutral-50">Visit live system ↗</a>' : '') +
          '</div>' +
          '<div class="mt-12 grid grid-cols-2 sm:grid-cols-5 border-y border-neutral-200/90 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200/90">' +
            '<div class="py-5 sm:pr-6"><div class="text-[10px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-1.5">CLIENT</div><div class="text-[13.5px] font-bold text-neutral-950">' + esc(project.client || project.title) + '</div></div>' +
            '<div class="py-5 sm:px-6"><div class="text-[10px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-1.5">INDUSTRY</div><div class="text-[13.5px] font-bold text-neutral-950">' + esc(project.industry || project.subtitle) + '</div></div>' +
            '<div class="py-5 sm:px-6"><div class="text-[10px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-1.5">SCOPE</div><div class="text-[13.5px] font-bold text-neutral-950">' + esc(project.scope || "Web platform") + '</div></div>' +
            '<div class="py-5 sm:px-6"><div class="text-[10px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-1.5">STACK</div><div class="text-[13.5px] font-bold text-neutral-950">' + esc(project.stack || "Next.js · PostgreSQL") + '</div></div>' +
            '<div class="py-5 sm:pl-6 col-span-2 sm:col-span-1"><div class="text-[10px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-1.5">YEAR</div><div class="text-[13.5px] font-bold text-neutral-950">' + esc(project.year || "2025") + '</div></div>' +
          '</div>' +
          '<div class="mt-12 rounded-2xl border border-neutral-200/90 bg-[#F4F4F2] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.06)]">' +
            '<div class="flex items-center gap-2 px-5 py-3 border-b border-neutral-200/80 bg-[#F7F7F5]">' +
              '<span class="h-2.5 w-2.5 rounded-full bg-[#FF5F56]/80"></span><span class="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]/80"></span><span class="h-2.5 w-2.5 rounded-full bg-[#27C93F]/80"></span>' +
              '<span class="ml-2 text-[11px] font-mono text-neutral-400">' + esc(project.slug) + ' · ' + (project.category === "ERP" ? "staff sign-in" : "production preview") + '</span>' +
            '</div>' +
            renderPreview(project, "h-[320px] sm:h-[460px] lg:h-[520px]", false) +
          '</div>' +
        '</section>' +
        '<section class="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 py-12 lg:py-16">' +
          '<div class="grid grid-cols-1 md:grid-cols-2 gap-6">' +
            '<div class="rounded-2xl bg-[#F6F6F4] border border-neutral-200/80 p-7 sm:p-9"><div class="text-[11px] font-mono text-neutral-400 mb-2">$ code diagnose</div><h2 class="text-[26px] sm:text-[30px] font-extrabold tracking-tight text-neutral-950">The bottleneck</h2><p class="mt-3.5 text-[14.5px] leading-[1.65] text-neutral-600">' + esc(project.bottleneck) + '</p></div>' +
            '<div class="rounded-2xl bg-[#D4FF00] p-7 sm:p-9"><div class="text-[11px] font-mono text-neutral-800/80 mb-2">$ code build --fix</div><h2 class="text-[26px] sm:text-[30px] font-extrabold tracking-tight text-neutral-950">The fix</h2><p class="mt-3.5 text-[14.5px] leading-[1.65] text-neutral-900">' + esc(project.theFix) + '</p></div>' +
          '</div>' +
        '</section>' +
        (modules.length > 0 ? (
          '<section class="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 py-14 lg:py-20">' +
            '<div class="flex items-end justify-between pb-5 border-b border-neutral-200/80 mb-8"><h2 class="text-[32px] sm:text-[38px] font-extrabold tracking-[-0.03em] text-neutral-950 leading-none">What we built</h2><span class="text-[11px] font-mono uppercase tracking-[0.16em] text-neutral-400">' + String(modules.length).padStart(2, "0") + ' MODULES</span></div>' +
            '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">' +
              modules.map((m) => (
                '<div class="rounded-2xl border border-neutral-200/90 bg-white p-6"><div class="text-[10px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-4">' + esc(m.number) + ' / ' + esc(m.tag) + '</div><h3 class="text-[18px] font-extrabold leading-snug text-neutral-950">' + esc(m.title) + '</h3><p class="mt-3 text-[13px] leading-relaxed text-neutral-600">' + esc(m.description) + '</p></div>'
              )).join('') +
            '</div>' +
          '</section>'
        ) : '') +
        (outcomes.length > 0 ? (
          '<section class="w-full bg-[#F6F6F4] py-20 lg:py-24">' +
            '<div class="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">' +
              '<div class="text-[10.5px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-8">OUTCOMES</div>' +
              '<div class="grid grid-cols-1 sm:grid-cols-3 gap-8">' +
                outcomes.map((o) => '<div class="pt-6 border-t-2 border-neutral-900"><div class="text-[44px] sm:text-[54px] font-extrabold leading-none tracking-[-0.04em] text-neutral-950">' + esc(o.metric) + '</div><div class="mt-2.5 text-[13px] text-neutral-600">' + esc(o.label) + '</div></div>').join('') +
              '</div>' +
              (project.quoteText ? '<div class="mt-16 max-w-[680px]"><blockquote class="text-[22px] sm:text-[26px] font-extrabold leading-[1.3] tracking-tight text-neutral-950">&ldquo;' + esc(project.quoteText) + '&rdquo;</blockquote>' + (project.quoteAuthor ? '<div class="mt-3 text-[11px] font-mono text-neutral-500">— ' + esc(project.quoteAuthor) + '</div>' : '') + '</div>' : '') +
            '</div>' +
          '</section>'
        ) : '') +
        '<section class="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 py-20 lg:py-28">' +
          '<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">' +
            '<div class="lg:col-span-6"><div class="text-[10.5px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-3">NEXT PROJECT</div><h2 class="text-[38px] sm:text-[48px] font-extrabold tracking-[-0.035em] text-neutral-950 leading-tight">' + esc(nextProject.title) + '</h2><div class="mt-3"><a href="/work/' + esc(nextProject.slug) + '" onclick="navigateTo(\\'/work/' + esc(nextProject.slug) + '\\', event)" class="inline-block text-[13.5px] font-bold text-neutral-950 border-b-[3px] border-[#D4FF00] pb-0.5 hover:opacity-80">' + esc(nextProject.subtitle) + ' · ' + (nextProject.category === "ERP" ? "ERP system" : "Web platform") + '</a></div></div>' +
            '<div class="lg:col-span-6"><a href="/work/' + esc(nextProject.slug) + '" onclick="navigateTo(\\'/work/' + esc(nextProject.slug) + '\\', event)" class="block rounded-2xl overflow-hidden border border-neutral-200 shadow-lg transition-transform duration-300 hover:-translate-y-1">' + renderPreview(nextProject, "h-[240px] sm:h-[270px]", false) + '</a></div>' +
          '</div>' +
        '</section>' +
      '</main>' +
      renderFooter() +
    '</div>';
  }

  function renderAdminPage() {
    const projects = state.projects;
    return '<div class="min-h-screen bg-[#F6F6F4] text-neutral-950">' +
      '<header class="sticky top-0 z-40 bg-white border-b border-neutral-200">' +
        '<div class="mx-auto max-w-[1280px] px-5 sm:px-8 h-16 flex items-center justify-between">' +
          '<div class="flex items-center gap-4">' +
            '<a href="/" onclick="navigateTo(\\'/\\', event)" class="inline-flex items-center text-[18px] font-extrabold tracking-tight text-neutral-950"><span class="inline-flex items-center justify-center bg-[#D4FF00] px-1 py-0.5 leading-none mr-0.5 rounded-[2px]">#</span><span>code</span></a>' +
            '<span class="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">Admin Studio</span>' +
          '</div>' +
          '<div class="flex items-center gap-3">' +
            '<a href="/work" onclick="navigateTo(\\'/work\\', event)" class="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50">View Work (' + projects.length + ')</a>' +
            '<a href="/" onclick="navigateTo(\\'/\\', event)" class="inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-4 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800">← Back to Live Site</a>' +
          '</div>' +
        '</div>' +
      '</header>' +
      (state.toast ? '<div class="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-neutral-950 text-white px-4 py-3 text-xs font-medium shadow-xl"><span class="text-[#D4FF00] font-bold">✓</span><span>' + esc(state.toast) + '</span></div>' : '') +
      '<main class="mx-auto max-w-[1280px] px-5 sm:px-8 py-10">' +
        '<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">' +
          '<div class="lg:col-span-5 rounded-2xl bg-white border border-neutral-200 p-6 sm:p-7 shadow-xs">' +
            '<div class="text-[10px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-1">AUTO-SYNC ENABLED</div>' +
            '<h1 class="text-2xl font-extrabold tracking-tight text-neutral-950 mb-5">Add new project</h1>' +
            '<form onsubmit="submitAdminForm(event)" class="space-y-4">' +
              '<div><label class="block text-xs font-semibold text-neutral-700 mb-1">Project Title *</label><input id="adm-title" type="text" required placeholder="e.g. Apex Logistics ERP" class="w-full rounded-lg border border-neutral-200 px-3.5 py-2 text-sm focus:border-neutral-950 focus:outline-none" /></div>' +
              '<div class="grid grid-cols-2 gap-3">' +
                '<div><label class="block text-xs font-semibold text-neutral-700 mb-1">Category *</label><select id="adm-category" class="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm"><option value="WEB">WEB (Web Platform)</option><option value="ERP">ERP (ERP / POS / System)</option></select></div>' +
                '<div><label class="block text-xs font-semibold text-neutral-700 mb-1">Location</label><input id="adm-location" type="text" value="Sri Lanka" class="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm" /></div>' +
              '</div>' +
              '<div><label class="block text-xs font-semibold text-neutral-700 mb-1">Card Subtitle *</label><input id="adm-subtitle" type="text" required placeholder="e.g. Logistics management · Dubai" class="w-full rounded-lg border border-neutral-200 px-3.5 py-2 text-sm" /></div>' +
              '<div><label class="block text-xs font-semibold text-neutral-700 mb-1">Screenshot Image (URL or Upload)</label><div class="flex gap-2"><input id="adm-image" type="text" placeholder="Paste image URL or upload ->" class="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-xs" /><label class="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold cursor-pointer hover:bg-neutral-100"><span>Upload</span><input type="file" accept="image/*" onchange="handleAdminFile(event)" class="hidden" /></label></div></div>' +
              '<div><label class="block text-xs font-semibold text-neutral-700 mb-1">Live URL (Optional)</label><input id="adm-liveUrl" type="url" placeholder="https://example.com" class="w-full rounded-lg border border-neutral-200 px-3.5 py-2 text-sm" /></div>' +
              '<div><label class="block text-xs font-semibold text-neutral-700 mb-1">Case Study Summary</label><textarea id="adm-summary" rows="2" placeholder="Short description of what was built..." class="w-full rounded-lg border border-neutral-200 px-3.5 py-2 text-sm resize-none"></textarea></div>' +
              '<label class="flex items-center gap-2.5 pt-1 cursor-pointer select-none"><input id="adm-featured" type="checkbox" checked class="h-4 w-4 accent-neutral-950" /><span class="text-xs font-semibold text-neutral-800">Show in "Selected Work" on Home Page</span></label>' +
              '<button type="submit" class="w-full inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 cursor-pointer">+ Publish Project</button>' +
            '</form>' +
          '</div>' +
          '<div class="lg:col-span-7 space-y-4">' +
            '<div><h2 class="text-xl font-extrabold tracking-tight text-neutral-950">Live Projects (' + projects.length + ')</h2><p class="text-xs text-neutral-500">Changes immediately update the Home page and /work page.</p></div>' +
            '<div class="space-y-3">' +
              projects.map((p) => (
                '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white border border-neutral-200 p-4">' +
                  '<div class="flex items-center gap-4">' +
                    '<div class="w-24 h-16 rounded-lg overflow-hidden border border-neutral-200 shrink-0">' + renderPreview(p, "h-full w-full", false) + '</div>' +
                    '<div>' +
                      '<div class="flex items-center gap-2"><span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded-xs bg-neutral-100 text-neutral-700 font-semibold">' + esc(p.number) + ' / ' + esc(p.category) + '</span>' + (p.featuredOnHome ? '<span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded-xs bg-[#D4FF00] text-neutral-950 font-bold">Featured on Home</span>' : '') + '</div>' +
                      '<h3 class="text-base font-bold text-neutral-950 mt-1">' + esc(p.title) + '</h3>' +
                      '<p class="text-xs text-neutral-500">' + esc(p.subtitle) + '</p>' +
                    '</div>' +
                  '</div>' +
                  '<div class="flex items-center gap-2 self-end sm:self-center">' +
                    '<button type="button" onclick="toggleFeatured(\\'' + esc(p.id) + '\\', ' + Boolean(p.featuredOnHome) + ')" class="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold border cursor-pointer ' + (p.featuredOnHome ? 'bg-[#D4FF00]/30 border-[#D4FF00] text-neutral-950' : 'bg-white border-neutral-200 text-neutral-500 hover:text-neutral-900') + '">★ Home</button>' +
                    '<button type="button" onclick="deleteProj(\\'' + esc(p.id) + '\\')" class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-red-600 hover:bg-red-50 cursor-pointer" title="Delete">✕</button>' +
                  '</div>' +
                '</div>'
              )).join('') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</main>' +
    '</div>';
  }

  window.setServiceTab = function (idx) {
    document.documentElement.classList.add("cl-skip");
    state.activeTab = idx;
    render();
  };
  window.toggleFaq = function (idx) {
    document.documentElement.classList.add("cl-skip");
    state.openFaq = state.openFaq === idx ? null : idx;
    render();
  };
  window.setWorkFilter = function (f) {
    document.documentElement.classList.add("cl-skip");
    state.workFilter = f;
    render();
  };
  window.toggleMobileMenu = function () {
    document.documentElement.classList.add("cl-skip");
    state.mobileMenuOpen = !state.mobileMenuOpen;
    render();
  };
  window.submitContactForm = function (ev) {
    ev.preventDefault();
    document.documentElement.classList.add("cl-skip");
    state.contactSubmitted = true;
    render();
  };
  window.resetContactForm = function () {
    document.documentElement.classList.add("cl-skip");
    state.contactSubmitted = false;
    render();
  };
  window.handleAdminFile = function (ev) {
    const file = ev.target.files && ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const inp = document.getElementById("adm-image");
      if (inp && typeof reader.result === "string") inp.value = reader.result;
    };
    reader.readAsDataURL(file);
  };
  function showToast(msg) {
    state.toast = msg;
    render();
    setTimeout(() => {
      state.toast = null;
      render();
    }, 3200);
  }
  window.submitAdminForm = async function (ev) {
    ev.preventDefault();
    const title = document.getElementById("adm-title").value.trim();
    const category = document.getElementById("adm-category").value;
    const location = document.getElementById("adm-location").value.trim();
    const subtitle = document.getElementById("adm-subtitle").value.trim();
    const image = document.getElementById("adm-image").value.trim();
    const liveUrl = document.getElementById("adm-liveUrl").value.trim();
    const summary = document.getElementById("adm-summary").value.trim();
    const featuredOnHome = document.getElementById("adm-featured").checked;

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category, location, subtitle, image, liveUrl, summary, featuredOnHome })
    });
    if (res.ok) {
      const data = await res.json();
      state.projects = data.projects;
      if (channel) channel.postMessage({ projects: data.projects });
      showToast('Added "' + title + '"! Home & Work pages auto-updated.');
    }
  };
  window.toggleFeatured = async function (id, current) {
    const res = await fetch("/api/projects/" + encodeURIComponent(id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featuredOnHome: !current })
    });
    if (res.ok) {
      const data = await res.json();
      state.projects = data.projects;
      if (channel) channel.postMessage({ projects: data.projects });
      showToast(!current ? "Added to Home page Selected Work!" : "Removed from Home page Selected Work.");
    }
  };
  window.deleteProj = async function (id) {
    const res = await fetch("/api/projects/" + encodeURIComponent(id), { method: "DELETE" });
    if (res.ok) {
      const data = await res.json();
      state.projects = data.projects;
      if (channel) channel.postMessage({ projects: data.projects });
      showToast("Project deleted. Client pages auto-updated.");
    }
  };

  function render() {
    const path = window.location.pathname;
    const root = document.getElementById("app");
    if (!root) return;
    if (path === "/work" || path === "/work/") {
      root.innerHTML = renderWorkPage();
    } else if (path.startsWith("/work/")) {
      const slug = decodeURIComponent(path.slice("/work/".length).replace(/\\/$/, ""));
      root.innerHTML = renderCaseStudyPage(slug);
    } else if (path.startsWith("/admin")) {
      root.innerHTML = renderAdminPage();
    } else {
      root.innerHTML = renderHomePage();
    }
  }

  render();
})();
`;

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const urlObj = new URL(req.url || "/", "http://localhost:3000");
    const pathname = urlObj.pathname;

    // API Routes
    if (pathname === "/api/projects" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json", "Cache-Control": "no-store" });
      res.end(JSON.stringify({ projects: getProjects() }));
      return;
    }

    if (pathname === "/api/projects" && req.method === "POST") {
      const body = await parseBody(req);
      const projects = getProjects();
      const title = (body.title || "Untitled Project").trim();
      const baseSlug = (body.slug || title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const uniqueSlug = projects.some((p) => p.slug === baseSlug)
        ? `${baseSlug}-${Date.now().toString().slice(-4)}`
        : baseSlug;
      const nextNumber = String(projects.length + 1).padStart(2, "0");

      const newProject = {
        id: `proj-${Date.now()}`,
        slug: uniqueSlug,
        number: nextNumber,
        category: body.category === "ERP" ? "ERP" : "WEB",
        title,
        subtitle: body.subtitle || "Web platform",
        location: body.location || "Sri Lanka",
        featuredOnHome: Boolean(body.featuredOnHome ?? true),
        homeOrder: body.homeOrder ?? projects.filter((p) => p.featuredOnHome).length + 1,
        liveUrl: body.liveUrl || "",
        image: body.image || "",
        previewTheme: body.previewTheme || "custom",
        heroHeading: body.heroHeading || title,
        heroHighlight: body.heroHighlight || body.subtitle || "In Production",
        summary: body.summary || "Engineered for sub-second speed, clean architecture and real-world reliability.",
        client: body.client || title,
        industry: body.industry || body.subtitle || "Technology",
        scope: body.scope || (body.category === "ERP" ? "Custom ERP and POS" : "Web platform"),
        stack: body.stack || "Next.js · TypeScript · PostgreSQL",
        year: body.year || new Date().getFullYear().toString(),
        bottleneck: body.bottleneck || "Manual workflows and disconnected tools slowed down daily operations and customer response times.",
        theFix: body.theFix || "A unified, high-performance platform tailored to the business workflow from day one.",
        modules: [
          { number: "01", tag: "ARCHITECTURE", title: "Clean system foundation", description: "Structured data model and modern stack built for reliability." },
          { number: "02", tag: "PERFORMANCE", title: "Sub-second speed", description: "Optimized frontend and backend responses across all devices." },
          { number: "03", tag: "WORKFLOW", title: "Automated operations", description: "Eliminating repetitive manual tracking and hand-offs." },
          { number: "04", tag: "ACCESS", title: "Secure role management", description: "Granular permissions and reliable production monitoring." }
        ],
        outcomes: [
          { metric: "99.9%", label: "production uptime" },
          { metric: "<0.7s", label: "average page load" },
          { metric: "10+ hrs", label: "manual work saved each week" }
        ],
        quoteText: "Delivered on scope with clean engineering and measurable impact from day one.",
        quoteAuthor: `Team at ${title}`,
        createdAt: new Date().toISOString()
      };

      const saved = saveProjects([...projects, newProject]);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ project: newProject, projects: saved }));
      return;
    }

    if (pathname.startsWith("/api/projects/") && (req.method === "PUT" || req.method === "DELETE")) {
      const id = decodeURIComponent(pathname.slice("/api/projects/".length));
      const projects = getProjects();
      if (req.method === "PUT") {
        const body = await parseBody(req);
        const idx = projects.findIndex((p) => p.id === id || p.slug === id);
        if (idx === -1) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Not found" }));
          return;
        }
        projects[idx] = { ...projects[idx], ...body, id: projects[idx].id };
        const saved = saveProjects(projects);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ project: projects[idx], projects: saved }));
        return;
      } else {
        const filtered = projects.filter((p) => p.id !== id && p.slug !== id);
        const saved = saveProjects(filtered);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ projects: saved }));
        return;
      }
    }

    // Client JS bundle
    if (pathname === "/app-client.js") {
      res.writeHead(200, { "Content-Type": "application/javascript; charset=utf-8", "Cache-Control": "no-store" });
      res.end(CLIENT_JS);
      return;
    }

    // Static files from public
    const safeRel = path.normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, "");
    for (const basePub of [PUBLIC_DIR, path.join(WORKSPACE_DIR, "public")]) {
      const pubFile = path.join(basePub, safeRel);
      if (fs.existsSync(pubFile) && fs.statSync(pubFile).isFile()) {
        const ext = path.extname(pubFile).toLowerCase();
        res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
        fs.createReadStream(pubFile).pipe(res);
        return;
      }
    }

    // Render App HTML
    const html = renderAppShell(getProjects());
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
    res.end(html);
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
});

const PORT = Number(process.env.PORT || 3000);
server.listen(PORT, "127.0.0.1", () => {
  console.log(`▲ #code server ready on http://localhost:${PORT}`);
});

