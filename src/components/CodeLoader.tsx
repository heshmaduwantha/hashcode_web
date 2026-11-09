import React from "react";

const CODE_LOADER_SCRIPT = `
/* =========================================================================
   #code — High-Tech Studio Page Loader Controller (Light Mood). Zero dependencies.
   Mounted synchronously before first paint to prevent flashes.
   ========================================================================= */
(function () {
  var root = document.documentElement;
  var el = document.getElementById('code-loader');
  if (!el) return;

  var MIN_MS = Number(el.getAttribute('data-cl-min')) || 1000;
  var MAX_MS = Number(el.getAttribute('data-cl-max')) || 4000;
  var ONCE = el.getAttribute('data-cl-once') === 'true';
  var KEY = 'code-loader-seen';

  function removeNode() {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  // Skip entirely if user requested reduced motion, or if once is enabled and already seen
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var seen = false;
  if (ONCE) {
    try { seen = sessionStorage.getItem(KEY) === '1'; } catch (e) {}
  }
  if (reduce || seen) {
    removeNode();
    root.classList.add('cl-done', 'cl-skip');
    return;
  }

  root.classList.add('cl-lock');

  var pctEl = el.querySelector('[data-cl-pct]');
  var barEl = el.querySelector('[data-cl-bar]');
  var flareEl = el.querySelector('[data-cl-flare]');
  var logEl = el.querySelector('[data-cl-log]');
  var statusEl = el.querySelector('[data-cl-status]');

  var start = performance.now();
  var ready = false;
  var shown = 0;
  var leaving = false;

  var loaded = new Promise(function (resolve) {
    if (document.readyState === 'complete') resolve();
    else window.addEventListener('load', resolve, { once: true });
  });
  var fonts = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  Promise.all([loaded, fonts]).then(function () { ready = true; }, function () { ready = true; });

  var logs = [
    { at: 0, text: '$ code build --site', status: 'INITIALIZING' },
    { at: 18, text: '$ code init core --runtime=fast', status: 'COMPILING' },
    { at: 42, text: '+ postgres schemas & api mounted', status: 'SYNCING' },
    { at: 68, text: '+ responsive 60fps design active', status: 'OPTIMIZING' },
    { at: 88, text: '+ security & performance: 100/100', status: 'VERIFIED' },
    { at: 100, text: '> site ready: launching #code', status: 'ONLINE' }
  ];

  var lastLogIdx = -1;
  function updateTelemetry(val) {
    var curIdx = 0;
    for (var i = 0; i < logs.length; i++) {
      if (val >= logs[i].at) curIdx = i;
    }
    if (curIdx !== lastLogIdx) {
      lastLogIdx = curIdx;
      if (logEl) logEl.textContent = logs[curIdx].text;
      if (statusEl) statusEl.textContent = logs[curIdx].status;
    }
  }

  function frame(now) {
    var t = now - start;
    var p = Math.min(t / MIN_MS, 1);
    // Smooth progress that scales directly and smoothly to 100
    var target = 100 * (1 - Math.pow(1 - p, 2.2));
    if ((ready && t >= MIN_MS) || t >= MAX_MS) target = 100;

    shown += (target - shown) * 0.24;
    if (target === 100 && shown > 98.8) shown = 100;

    var roundVal = Math.min(100, Math.round(shown));
    if (pctEl) pctEl.textContent = roundVal + '%';
    if (barEl) barEl.style.transform = 'scaleX(' + (roundVal / 100).toFixed(3) + ')';
    if (flareEl) flareEl.style.left = roundVal + '%';

    updateTelemetry(roundVal);

    if (shown === 100) {
      // Ensure 100% full bar is displayed
      if (pctEl) pctEl.textContent = '100%';
      if (barEl) barEl.style.transform = 'scaleX(1)';
      if (flareEl) flareEl.style.left = '100%';
      updateTelemetry(100);

      // Brief hold on 100% so the user clearly sees the filled bar before exit
      setTimeout(leave, 220);
      return;
    }
    requestAnimationFrame(frame);
  }

  function leave() {
    if (leaving) return;
    leaving = true;
    el.classList.add('is-leaving');
    root.classList.remove('cl-lock');
    root.classList.add('cl-done');
    if (ONCE) {
      try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    }
    setTimeout(removeNode, 600);
  }

  requestAnimationFrame(frame);
})();
`;

export function CodeLoader() {
  return (
    <>
      <noscript
        dangerouslySetInnerHTML={{
          __html: "<style>#code-loader{display:none!important}</style>",
        }}
      />
      <div
        id="code-loader"
        className="cl"
        aria-hidden="true"
        data-cl-min="1000"
        data-cl-max="4000"
        data-cl-once="false"
        suppressHydrationWarning
      >
        {/* Background Subtle Blueprint Grid */}
        <div className="cl-grid" />
        <div className="cl-scanline" />
        <div className="cl-ambient-glow" />

        {/* Background Drawn Curved Line Motif */}
        <svg
          className="cl-bg-line"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <path
            pathLength={1}
            d="M1180 0 C1180 300 240 360 240 600 S1100 820 900 900"
          />
        </svg>

        {/* Top Telemetry Header */}
        <header className="cl-telemetry">
          <div className="cl-telemetry-left">
            <span className="cl-pulse-dot" />
            <span className="cl-telemetry-title">#CODE // STUDIO</span>
          </div>
          <div className="cl-telemetry-right">
            <span className="cl-telemetry-meta">
              COLOMBO [06°55&apos;N · 079°51&apos;E]
            </span>
            <span
              className="cl-status-badge"
              data-cl-status
              suppressHydrationWarning
            >
              INITIALIZING
            </span>
          </div>
        </header>

        {/* Center Stage: Animated #code Wordmark (Card & Big SVG Hash Removed) */}
        <div className="cl-stage">
          {/* Concentric Telemetry Orbit Reticle */}
          <div className="cl-reticle" />

          {/* Animated #code Brand Centerpiece */}
          <div className="cl-brand-hero">
            <div className="cl-brand-title">
              <span className="cl-brand-hash">#</span>
              <span className="cl-brand-text">code</span>
            </div>
            <div className="cl-brand-tag">ENGINEERING SCALABLE SOLUTIONS</div>
          </div>
        </div>

        {/* Bottom Diagnostic Console & Precision Progress */}
        <div className="cl-console">
          {/* Terminal Log Stream */}
          <div className="cl-terminal-box">
            <span className="cl-term-prompt">&gt;</span>
            <span
              className="cl-term-text"
              data-cl-log
              suppressHydrationWarning
            >
              $ code build --site
            </span>
            <span className="cl-term-caret" />
          </div>

          {/* Progress Row: Equalizer Visualizer & Percentage */}
          <div className="cl-meter-row">
            <div className="cl-visualizer" aria-hidden="true">
              <span className="cl-eq-bar b1" />
              <span className="cl-eq-bar b2" />
              <span className="cl-eq-bar b3" />
              <span className="cl-eq-bar b4" />
              <span className="cl-eq-bar b5" />
              <span className="cl-eq-bar b6" />
              <span className="cl-eq-bar b7" />
              <span className="cl-eq-bar b8" />
            </div>

            <div className="cl-pct-wrap">
              <span className="cl-pct" data-cl-pct suppressHydrationWarning>
                0%
              </span>
            </div>
          </div>

          {/* Laser Progress Bar Track */}
          <div className="cl-progress-track">
            <div
              className="cl-progress-fill"
              data-cl-bar
              suppressHydrationWarning
            />
            <span
              className="cl-progress-flare"
              data-cl-flare
              suppressHydrationWarning
            />
          </div>
        </div>
      </div>

      <script
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: CODE_LOADER_SCRIPT }}
      />
    </>
  );
}
