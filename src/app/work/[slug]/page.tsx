"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProjectPreview } from "@/components/ProjectPreview";
import { useProjects } from "@/context/ProjectsContext";

export default function CaseStudyPage() {
  const params = useParams<{ slug: string }>();
  const { projects } = useProjects();

  const currentIndex = projects.findIndex(
    (p) => p.slug === params?.slug || p.id === params?.slug
  );
  const project =
    currentIndex !== -1 ? projects[currentIndex] : projects[1] || projects[0];
  const nextProject =
    projects.length > 1
      ? projects[(currentIndex + 1 + projects.length) % projects.length]
      : project;

  if (!project) {
    return null;
  }

  const modules = project.modules || [];
  const outcomes = project.outcomes || [];

  return (
    <div className="relative min-h-screen bg-white text-neutral-950 overflow-x-hidden">
      <Navbar />

      <main className="relative z-10">
        <section className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 pt-10 sm:pt-14 pb-16">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-[12.5px] font-mono uppercase tracking-[0.16em] text-neutral-400 hover:text-neutral-900 transition-colors mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>ALL WORK</span>
          </Link>

          <div className="text-[12px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-3">
            CASE STUDY · {project.number} / {project.category}
          </div>

          <h1 className="text-[42px] sm:text-[60px] lg:text-[68px] font-extrabold leading-[1.02] tracking-[-0.04em] text-neutral-950">
            {project.heroHeading || project.title}
            <br />
            <span className="relative inline-block z-10">
              {project.heroHighlight || project.subtitle}
              <span
                aria-hidden="true"
                className="absolute left-[-4px] right-[-6px] bottom-[4px] sm:bottom-[6px] h-[36%] bg-[#D4FF00] -z-10"
              />
            </span>
          </h1>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <p className="max-w-[540px] text-[16.5px] sm:text-[17.5px] leading-[1.65] text-neutral-600">
              {project.summary || project.subtitle}
            </p>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-5 py-2.5 text-[12.5px] font-semibold text-neutral-900 hover:bg-neutral-50 transition-colors"
              >
                <span>Visit live system</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-5 border-y border-neutral-200/90 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200/90">
            <div className="py-5 sm:pr-6">
              <div className="text-[12px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-1.5">
                CLIENT
              </div>
              <div className="text-[16.5px] font-bold text-neutral-950">
                {project.client || project.title}
              </div>
            </div>

            <div className="py-5 sm:px-6">
              <div className="text-[12px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-1.5">
                INDUSTRY
              </div>
              <div className="text-[16.5px] font-bold text-neutral-950">
                {project.industry || project.subtitle}
              </div>
            </div>

            <div className="py-5 sm:px-6">
              <div className="text-[12px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-1.5">
                SCOPE
              </div>
              <div className="text-[16.5px] font-bold text-neutral-950">
                {project.scope || "Web platform"}
              </div>
            </div>

            <div className="py-5 sm:px-6">
              <div className="text-[12px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-1.5">
                STACK
              </div>
              <div className="text-[16.5px] font-bold text-neutral-950">
                {project.stack || "Next.js · PostgreSQL"}
              </div>
            </div>

            <div className="py-5 sm:pl-6 col-span-2 sm:col-span-1">
              <div className="text-[12px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-1.5">
                YEAR
              </div>
              <div className="text-[16.5px] font-bold text-neutral-950">
                {project.year || "2025"}
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-neutral-200/90 bg-[#F4F4F2] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-neutral-200/80 bg-[#F7F7F5]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]/80" />
              <span className="ml-2 text-[12.5px] font-mono text-neutral-400">
                {project.slug} ·{" "}
                {project.category === "ERP"
                  ? "staff sign-in"
                  : "production preview"}
              </span>
            </div>

            <ProjectPreview
              project={project}
              className="h-[320px] sm:h-[460px] lg:h-[520px]"
            />
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-[#F6F6F4] border border-neutral-200/80 p-7 sm:p-9">
              <div className="text-[12.5px] font-mono text-neutral-400 mb-2">
                $ code diagnose
              </div>
              <h2 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight text-neutral-950">
                The bottleneck
              </h2>
              <p className="mt-3.5 text-[17.5px] leading-[1.65] text-neutral-600">
                {project.bottleneck}
              </p>
            </div>

            <div className="rounded-2xl bg-[#D4FF00] p-7 sm:p-9">
              <div className="text-[12.5px] font-mono text-neutral-800/80 mb-2">
                $ code build --fix
              </div>
              <h2 className="text-[26px] sm:text-[30px] font-extrabold tracking-tight text-neutral-950">
                The fix
              </h2>
              <p className="mt-3.5 text-[17.5px] leading-[1.65] text-neutral-900">
                {project.theFix}
              </p>
            </div>
          </div>
        </section>

        {modules.length > 0 && (
          <section className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 py-14 lg:py-20">
            <div className="flex items-end justify-between pb-5 border-b border-neutral-200/80 mb-8">
              <h2 className="text-[32px] sm:text-[38px] font-extrabold tracking-[-0.03em] text-neutral-950 leading-none">
                What we built
              </h2>
              <span className="text-[12.5px] font-mono uppercase tracking-[0.16em] text-neutral-400">
                {String(modules.length).padStart(2, "0")} MODULES
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {modules.map((mod) => (
                <div
                  key={mod.number + mod.title}
                  className="rounded-2xl border border-neutral-200/90 bg-white p-6"
                >
                  <div className="text-[12px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-4">
                    {mod.number} / {mod.tag}
                  </div>
                  <h3 className="text-[18px] font-extrabold leading-snug text-neutral-950">
                    {mod.title}
                  </h3>
                  <p className="mt-3 text-[17.5px] leading-relaxed text-neutral-600">
                    {mod.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {outcomes.length > 0 && (
          <section className="w-full bg-[#F6F6F4] py-20 lg:py-24">
            <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
              <div className="text-[12px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-8">
                OUTCOMES
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {outcomes.map((outcome, i) => (
                  <div key={i} className="pt-6 border-t-2 border-neutral-900">
                    <div className="text-[44px] sm:text-[54px] font-extrabold leading-none tracking-[-0.04em] text-neutral-950">
                      {outcome.metric}
                    </div>
                    <div className="mt-2.5 text-[17.5px] text-neutral-600">
                      {outcome.label}
                    </div>
                  </div>
                ))}
              </div>

              {project.quoteText && (
                <div className="mt-16 max-w-[680px]">
                  <blockquote className="text-[22px] sm:text-[26px] font-extrabold leading-[1.3] tracking-tight text-neutral-950">
                    &ldquo;{project.quoteText}&rdquo;
                  </blockquote>
                  {project.quoteAuthor && (
                    <div className="mt-3 text-[12.5px] font-mono text-neutral-500">
                      — {project.quoteAuthor}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {nextProject && (
          <section className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 py-20 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6">
                <div className="text-[12px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-3">
                  NEXT PROJECT
                </div>
                <h2 className="text-[38px] sm:text-[48px] font-extrabold tracking-[-0.035em] text-neutral-950 leading-tight">
                  {nextProject.title}
                </h2>
                <div className="mt-3">
                  <Link
                    href={`/work/${nextProject.slug}`}
                    className="inline-block text-[16.5px] font-bold text-neutral-950 border-b-[3px] border-[#D4FF00] pb-0.5 hover:opacity-80"
                  >
                    {nextProject.subtitle} ·{" "}
                    {nextProject.category === "ERP"
                      ? "ERP system"
                      : "Web platform"}
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6">
                <Link
                  href={`/work/${nextProject.slug}`}
                  className="block rounded-2xl overflow-hidden border border-neutral-200 shadow-lg transition-transform duration-300 hover:-translate-y-1"
                >
                  <ProjectPreview
                    project={nextProject}
                    className="h-[240px] sm:h-[270px]"
                  />
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

