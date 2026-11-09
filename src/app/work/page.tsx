"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProjectCard } from "@/components/ProjectCard";
import { useProjects } from "@/context/ProjectsContext";

type FilterType = "ALL" | "WEB" | "ERP";

export default function WorkPage() {
  const { projects } = useProjects();
  const [filter, setFilter] = useState<FilterType>("ALL");

  const webCount = projects.filter((p) => p.category === "WEB").length;
  const erpCount = projects.filter((p) => p.category === "ERP").length;

  const filteredProjects = projects.filter((p) => {
    if (filter === "ALL") return true;
    return p.category === filter;
  });

  return (
    <div className="relative min-h-screen bg-white text-neutral-950 overflow-x-hidden">
      <Navbar />

      <main className="relative z-10">
        <section className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 pt-12 sm:pt-16 lg:pt-20 pb-10">
          <div className="text-[12px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-4">
            WORK · 2024 — 2026
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <h1 className="text-[44px] sm:text-[62px] lg:text-[72px] font-extrabold leading-[0.98] tracking-[-0.04em] text-neutral-950">
                {projects.length} projects.
                <br />
                <span className="relative inline-block z-10">
                  All in production.
                  <span
                    aria-hidden="true"
                    className="absolute left-[-4px] right-[-6px] bottom-[4px] sm:bottom-[6px] h-[36%] bg-[#D4FF00] -z-10"
                  />
                </span>
              </h1>
            </div>

            <div className="lg:col-span-4 pb-1">
              <p className="text-[17.5px] sm:text-[16.5px] leading-[1.65] text-neutral-600">
                Web platforms and business systems for clients in Sri Lanka, the
                UK and Dubai. Every one is live. Click through and use it.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setFilter("ALL")}
                className={`rounded-full px-4 py-2 text-[17.5px] font-mono transition-all cursor-pointer ${
                  filter === "ALL"
                    ? "bg-neutral-950 text-white font-semibold"
                    : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                }`}
              >
                All projects · {projects.length}
              </button>

              <button
                type="button"
                onClick={() => setFilter("WEB")}
                className={`rounded-full px-4 py-2 text-[17.5px] font-mono transition-all cursor-pointer ${
                  filter === "WEB"
                    ? "bg-neutral-950 text-white font-semibold"
                    : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                }`}
              >
                Web platforms · {webCount}
              </button>

              <button
                type="button"
                onClick={() => setFilter("ERP")}
                className={`rounded-full px-4 py-2 text-[17.5px] font-mono transition-all cursor-pointer ${
                  filter === "ERP"
                    ? "bg-neutral-950 text-white font-semibold"
                    : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                }`}
              >
                ERP and systems · {erpCount}
              </button>
            </div>

            <div className="text-[17.5px] font-mono text-neutral-400">
              Showing {filteredProjects.length} of {projects.length}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 pb-20 lg:pb-28">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                variant="work"
                displayIndex={
                  filter === "ALL"
                    ? String(index + 1).padStart(2, "0")
                    : project.number
                }
              />
            ))}
          </div>
        </section>

        <section className="w-full bg-[#D4FF00] py-20 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <h2 className="text-[40px] sm:text-[52px] lg:text-[58px] font-extrabold leading-[1.02] tracking-[-0.04em] text-neutral-950">
              Your project
              <br />
              could be next.
            </h2>

            <Link
              href="/#contact"
              className="group inline-flex items-center gap-3.5 rounded-full bg-neutral-950 pl-6 pr-2 py-2.5 text-[15.5px] font-semibold text-white transition-all hover:bg-neutral-800"
            >
              <span>Let&apos;s build the fix</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4FF00] text-neutral-950 transition-transform duration-200 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
              </span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

