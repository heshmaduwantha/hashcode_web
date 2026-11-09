import React from "react";

const CODE_LOADER_SCRIPT = `
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
        data-cl-min="2600"
        data-cl-max="8000"
        data-cl-once="true"
        suppressHydrationWarning
      >
        <svg
          className="cl-line cl-line--d"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <path
            pathLength={1}
            d="M1180 0 C1180 300 240 360 240 600 S1100 820 900 900"
          />
        </svg>
        <svg
          className="cl-line cl-line--m"
          viewBox="0 0 390 844"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <path
            pathLength={1}
            d="M330 0 C330 260 60 320 60 520 S330 760 200 844"
          />
        </svg>

        <div className="cl-stage">
          <div className="cl-halo" />
          <div className="cl-lens">
            <div className="cl-layer cl-rim cl-smear">
              <div className="cl-track">
                <span className="cl-word">
                  <span className="cl-hash">#</span>code
                </span>
                <span className="cl-tag">ENGINEERING SCALABLE SOLUTIONS</span>
              </div>
            </div>
            <div className="cl-layer cl-rim cl-fa">
              <div className="cl-track">
                <span className="cl-word">
                  <span className="cl-hash">#</span>code
                </span>
                <span className="cl-tag">ENGINEERING SCALABLE SOLUTIONS</span>
              </div>
            </div>
            <div className="cl-layer cl-rim cl-fb">
              <div className="cl-track">
                <span className="cl-word">
                  <span className="cl-hash">#</span>code
                </span>
                <span className="cl-tag">ENGINEERING SCALABLE SOLUTIONS</span>
              </div>
            </div>
            <div className="cl-layer cl-core">
              <div className="cl-track">
                <span className="cl-word">
                  <span className="cl-hash">#</span>code
                </span>
                <span className="cl-tag">ENGINEERING SCALABLE SOLUTIONS</span>
              </div>
            </div>
            <span className="cl-caustic" />
            <span className="cl-sweep" />
            <span className="cl-glare" />
          </div>
        </div>

        <div className="cl-status">
          <div className="cl-row">
            <span>
              $ code build --site
              <i className="cl-caret" />
            </span>
            <span className="cl-pct" data-cl-pct suppressHydrationWarning>
              0%
            </span>
          </div>
          <div className="cl-bar">
            <span data-cl-bar suppressHydrationWarning />
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
