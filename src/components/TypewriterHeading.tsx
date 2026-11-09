"use client";

import React, { useEffect, useRef, useState } from "react";

interface WordItem {
  text: string;
  line: 1 | 2 | 3;
}

const WORDS: WordItem[] = [
  { text: "Engineering-first.", line: 1 },
  { text: "Built", line: 2 },
  { text: "by", line: 2 },
  { text: "hands-on", line: 2 },
  { text: "developers", line: 3 },
];

export function TypewriterHeading() {
  const containerRef = useRef<HTMLHeadingElement | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let index = 0;
    const interval = setInterval(() => {
      index++;
      setVisibleCount(index);
      if (index >= WORDS.length) {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [hasStarted]);

  // Words grouped by line
  const line1Words = WORDS.filter((w) => w.line === 1);
  const line2Words = WORDS.filter((w) => w.line === 2);
  const line3Words = WORDS.filter((w) => w.line === 3);

  const isWordVisible = (globalIndex: number) => {
    // If JS not yet hydrated, show all for SSR/SEO fallback
    if (!hasStarted && visibleCount === 0) return false;
    return visibleCount > globalIndex;
  };

  return (
    <h2
      ref={containerRef}
      suppressHydrationWarning
      className="mx-auto max-w-[760px] text-[40px] sm:text-[52px] lg:text-[60px] font-extrabold leading-[1.04] tracking-[-0.04em] min-h-[190px]"
    >
      {/* Line 1: Engineering-first. */}
      <span className="text-neutral-950 block">
        {line1Words.map((w, i) => (
          <span
            key={w.text}
            className={`transition-opacity duration-150 ${
              isWordVisible(i) ? "opacity-100" : "opacity-0"
            }`}
          >
            {w.text}
          </span>
        ))}
      </span>

      {/* Line 2: Built by hands-on */}
      <span className="text-neutral-500 block">
        {line2Words.map((w, i) => {
          const globalIdx = line1Words.length + i;
          return (
            <span
              key={w.text}
              className={`mr-2.5 inline-block transition-opacity duration-150 ${
                isWordVisible(globalIdx) ? "opacity-100" : "opacity-0"
              }`}
            >
              {w.text}
            </span>
          );
        })}
      </span>

      {/* Line 3: developers. (with perpetually blinking terminal dot) */}
      <span className="text-neutral-500 block">
        {line3Words.map((w, i) => {
          const globalIdx = line1Words.length + line2Words.length + i;
          return (
            <span
              key={w.text}
              className={`inline-block transition-opacity duration-150 ${
                isWordVisible(globalIdx) ? "opacity-100" : "opacity-0"
              }`}
            >
              {w.text}
            </span>
          );
        })}
        {/* Blinking Dot: Always blinks like a terminal cursor */}
        <span
          className="inline-block text-[#D4FF00] font-black ml-0.5 animate-terminal-dot"
          style={{
            textShadow: "0 0 12px rgba(212, 255, 0, 0.9)",
          }}
          aria-hidden="true"
        >
          .
        </span>
      </span>
    </h2>
  );
}

