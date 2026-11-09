"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Equal, X } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isWorkPage = pathname?.startsWith("/work");

  return (
    <header
      data-cl-reveal
      className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-neutral-200/80"
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 sm:px-8 lg:px-12 h-[72px]">
        <Link
          href="/"
          className="inline-flex items-center text-[20px] font-extrabold tracking-tight text-neutral-950"
        >
          <span className="inline-flex items-center justify-center bg-[#D4FF00] px-1 py-0.5 leading-none mr-0.5 rounded-[2px]">
            #
          </span>
          <span>code</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[13.5px] font-medium text-neutral-700">
          <Link
            href="/work"
            className={`transition-colors hover:text-neutral-950 ${
              isWorkPage
                ? "text-neutral-950 underline decoration-[#D4FF00] decoration-2 underline-offset-8 font-semibold"
                : ""
            }`}
          >
            Work
          </Link>
          <Link
            href="/#services"
            className="transition-colors hover:text-neutral-950"
          >
            Services
          </Link>
          <Link
            href="/#process"
            className="transition-colors hover:text-neutral-950"
          >
            Process
          </Link>
          <Link
            href="/#students"
            className="transition-colors hover:text-neutral-950"
          >
            Students
          </Link>
          <Link
            href="/#faq"
            className="transition-colors hover:text-neutral-950"
          >
            FAQ
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-3 rounded-full bg-neutral-950 pl-5 pr-1.5 py-1.5 text-[13px] font-semibold text-white transition-all hover:bg-neutral-800"
          >
            <span>Start a project</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D4FF00] text-neutral-950 transition-transform duration-200 group-hover:rotate-45">
              <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </span>
          </Link>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/#contact"
            aria-label="Start a project"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-950 text-white"
          >
            <ArrowUpRight className="h-4 w-4 stroke-[2.2]" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-900"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Equal className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-5 py-6 space-y-4 shadow-lg">
          <div className="flex flex-col space-y-3 text-base font-semibold text-neutral-900">
            <Link
              href="/work"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1"
            >
              Work
            </Link>
            <Link
              href="/#services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1"
            >
              Services
            </Link>
            <Link
              href="/#process"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1"
            >
              Process
            </Link>
            <Link
              href="/#students"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1"
            >
              Students
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1"
            >
              FAQ
            </Link>
          </div>
          <div className="pt-2">
            <Link
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex w-full items-center justify-between rounded-full bg-neutral-950 pl-5 pr-2 py-2 text-sm font-semibold text-white"
            >
              <span>Start a project</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4FF00] text-neutral-950">
                <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
