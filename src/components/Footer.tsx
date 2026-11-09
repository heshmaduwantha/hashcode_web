import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative w-full bg-white border-t border-neutral-200/80 pt-16 pb-10 overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div className="max-w-xs">
            <Link
              href="/"
              className="inline-flex items-center text-[20px] font-extrabold tracking-tight text-neutral-950"
            >
              <span className="inline-flex items-center justify-center bg-[#D4FF00] px-1 py-0.5 leading-none mr-0.5 rounded-[2px]">
                #
              </span>
              <span>code</span>
            </Link>
            <p className="mt-4 text-[13px] leading-relaxed text-neutral-600">
              Custom ERP, web applications and backend engineering for growing
              businesses.
            </p>
          </div>

          <div className="flex gap-16 sm:gap-24">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-3.5">
                STUDIO
              </div>
              <ul className="space-y-2.5 text-[13px] font-medium text-neutral-800">
                <li>
                  <Link
                    href="/work"
                    className="hover:text-neutral-950 transition-colors"
                  >
                    Work
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#services"
                    className="hover:text-neutral-950 transition-colors"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#process"
                    className="hover:text-neutral-950 transition-colors"
                  >
                    Process
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#students"
                    className="hover:text-neutral-950 transition-colors"
                  >
                    Students
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-3.5">
                ELSEWHERE
              </div>
              <ul className="space-y-2.5 text-[13px] font-medium text-neutral-800">
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-neutral-950 transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-neutral-950 transition-colors"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hasgtagcode.solutions@gmail.com"
                    className="hover:text-neutral-950 transition-colors"
                  >
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="my-10 sm:my-14 select-none pointer-events-none">
          <div
            aria-hidden="true"
            className="text-[96px] sm:text-[165px] md:text-[220px] lg:text-[260px] font-extrabold leading-[0.82] tracking-[-0.05em] text-[#EEFF8A]"
          >
            #code
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] font-mono text-neutral-500">
          <div>© 2026 #code · Colombo, Sri Lanka</div>
          <div>Engineering scalable solutions. Building the fix.</div>
        </div>
      </div>
    </footer>
  );
}

