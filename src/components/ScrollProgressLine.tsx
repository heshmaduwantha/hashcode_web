"use client";

import React, { useEffect, useRef, useState } from "react";

const SVG_PATH =
  "M 1050 80 C 650 380, 120 750, 210 1350 C 300 1950, 1180 1850, 1060 2650 C 940 3450, 160 3650, 260 4450 C 360 5150, 1080 5350, 960 6100";

const VIEWBOX_W = 1440;
const VIEWBOX_H = 6200;

export function ScrollProgressLine() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const glowPathRef = useRef<SVGPathElement | null>(null);
  const headElRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const container = containerRef.current;
    const pathEl = pathRef.current;
    const glowEl = glowPathRef.current;
    const headEl = headElRef.current;
    if (!pathEl || !container) return;

    let totalLength = 7000;
    try {
      totalLength = pathEl.getTotalLength() || 7000;
    } catch {
      totalLength = 7000;
    }

    pathEl.style.strokeDasharray = `${totalLength}`;
    pathEl.style.strokeDashoffset = `${totalLength}`;
    if (glowEl) {
      glowEl.style.strokeDasharray = `${totalLength}`;
      glowEl.style.strokeDashoffset = `${totalLength}`;
    }

    let targetProgress = 0;
    let currentProgress = 0;
    let animId: number;

    let containerW = container.clientWidth || VIEWBOX_W;
    let containerH = container.clientHeight || VIEWBOX_H;

    const updateDimensions = () => {
      if (container) {
        containerW = container.clientWidth || VIEWBOX_W;
        containerH = container.clientHeight || VIEWBOX_H;
      }
      try {
        totalLength = pathEl.getTotalLength() || totalLength;
        pathEl.style.strokeDasharray = `${totalLength}`;
        if (glowEl) glowEl.style.strokeDasharray = `${totalLength}`;
      } catch {}
    };

    const calculateScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        targetProgress = 0;
        return;
      }
      targetProgress = Math.min(Math.max(scrollY / docHeight, 0), 1);
    };

    const tick = () => {
      // Responsive adaptive easing: tracks quickly during mouse drag / fast scroll, eases smoothly at rest
      const delta = targetProgress - currentProgress;
      const absDelta = Math.abs(delta);
      if (absDelta > 0.0001) {
        const factor = absDelta > 0.15 ? 0.55 : absDelta > 0.05 ? 0.38 : 0.22;
        currentProgress += delta * factor;
      } else {
        currentProgress = targetProgress;
      }

      const activeOffset = totalLength * (1 - currentProgress);
      if (pathEl) {
        pathEl.style.strokeDashoffset = `${activeOffset}`;
      }
      if (glowEl) {
        glowEl.style.strokeDashoffset = `${activeOffset}`;
      }

      if (headEl) {
        if (currentProgress > 0.003 && currentProgress < 0.999) {
          try {
            const point = pathEl.getPointAtLength(currentProgress * totalLength);
            const px = (point.x / VIEWBOX_W) * containerW;
            const py = (point.y / VIEWBOX_H) * containerH;
            headEl.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0)`;
            headEl.style.opacity = "1";
          } catch {
            // fallback
          }
        } else {
          headEl.style.opacity = "0";
        }
      }

      animId = requestAnimationFrame(tick);
    };

    const handleResize = () => {
      updateDimensions();
      calculateScroll();
    };

    window.addEventListener("scroll", calculateScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    updateDimensions();
    calculateScroll();
    currentProgress = targetProgress;
    animId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", calculateScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 w-full h-full z-0 overflow-hidden hidden md:block"
    >
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        preserveAspectRatio="none"
      >
        <defs>
          {/* Main neon glow filter */}
          <filter id="lime-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="2.5"
              floodColor="#D4FF00"
              floodOpacity="0.85"
            />
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="8"
              floodColor="#D4FF00"
              floodOpacity="0.45"
            />
          </filter>
        </defs>

        {/* 1. Underlying Base Roadmap Track (subtle dashed gray line) */}
        <path
          d={SVG_PATH}
          fill="none"
          stroke="#E5E5DE"
          strokeWidth="1.5"
          strokeDasharray="5 5"
          vectorEffect="non-scaling-stroke"
        />

        {/* 2. Soft Ambient Lime Glow Line (fills behind active path) */}
        <path
          ref={glowPathRef}
          d={SVG_PATH}
          fill="none"
          stroke="#D4FF00"
          strokeWidth="5.5"
          strokeOpacity="0.25"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{
            strokeDasharray: "7000",
            strokeDashoffset: isMounted ? undefined : "7000",
          }}
        />

        {/* 3. Active Crisp Lime Green Scroll Line */}
        <path
          ref={pathRef}
          d={SVG_PATH}
          fill="none"
          stroke="#D4FF00"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          filter="url(#lime-glow)"
          style={{
            strokeDasharray: "7000",
            strokeDashoffset: isMounted ? undefined : "7000",
          }}
        />
      </svg>

      {/* 4. Distortion-Free Leading Spark / Head Particle */}
      <div
        ref={headElRef}
        className="pointer-events-none absolute left-0 top-0 -ml-2.5 -mt-2.5 transition-opacity duration-200"
        style={{
          opacity: 0,
          willChange: "transform, opacity",
        }}
      >
        <div className="relative flex h-5 w-5 items-center justify-center">
          {/* Pulsing radar wave */}
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4FF00] opacity-40" />
          {/* Glowing lime ring */}
          <span className="absolute inline-flex h-3.5 w-3.5 rounded-full bg-[#D4FF00] shadow-[0_0_12px_#D4FF00]" />
          {/* High-contrast core dot */}
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-neutral-950" />
        </div>
      </div>
    </div>
  );
}
