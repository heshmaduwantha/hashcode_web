"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Plus,
  Minus,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectPreview } from "@/components/ProjectPreview";
import { ScrollProgressLine } from "@/components/ScrollProgressLine";
import { TypewriterHeading } from "@/components/TypewriterHeading";
import { useProjects } from "@/context/ProjectsContext";

interface ServicePillar {
  id: string;
  num: string;
  tabLabel: string;
  tagLabel: string;
  heading: string;
  description: string;
  bullets: string[];
  ctaText: string;
  terminalPath: string;
  terminalLines: { num: string; text: string; type: "cmd" | "add" | "out" }[];
}

const SERVICE_PILLARS: ServicePillar[] = [
  {
    id: "web",
    num: "01",
    tabLabel: "01 WEB PLATFORMS",
    tagLabel: "01 / 05 · WEB PLATFORMS",
    heading: "Websites that load\nfast and win trust.",
    description:
      "Mobile-first, SEO-ready business websites and e-commerce portals, built for sub-second page loads and turning visitors into enquiries.",
    bullets: [
      "Responsive, SEO-ready builds",
      "Online payment gateway integration",
      "Maintenance and performance tuning",
    ],
    ctaText: "Plan a website",
    terminalPath: "web / new-website",
    terminalLines: [
      {
        num: "01",
        text: "$ code new website --seo --mobile-first",
        type: "cmd",
      },
      { num: "02", text: "+ sub-second page loads", type: "add" },
      { num: "03", text: "+ online payments integrated", type: "add" },
      { num: "04", text: "+ SEO-ready from day one", type: "add" },
      { num: "05", text: "> quote after a short call", type: "out" },
    ],
  },
  {
    id: "erp",
    num: "02",
    tabLabel: "02 ERP, CRM & POS",
    tagLabel: "02 / 05 · ERP, CRM & POS",
    heading: "One system for stock,\nsales and operations.",
    description:
      "Custom ERP, inventory, clinic and point-of-sale systems tailored to how your team actually works—replacing fragile spreadsheets and manual hand-offs.",
    bullets: [
      "Live stock, batch and expiry tracking",
      "Multi-branch POS and counter billing",
      "Role-based staff accounts and audit logs",
    ],
    ctaText: "Scope your ERP",
    terminalPath: "erp / operations-core",
    terminalLines: [
      { num: "01", text: "$ code init erp --branches=all --pos", type: "cmd" },
      { num: "02", text: "+ live stock synced across branches", type: "add" },
      { num: "03", text: "+ automated batch & expiry alerts", type: "add" },
      { num: "04", text: "+ zero end-of-day discrepancy", type: "add" },
      { num: "05", text: "> deployed to production", type: "out" },
    ],
  },
  {
    id: "automation",
    num: "03",
    tabLabel: "03 AUTOMATION",
    tagLabel: "03 / 05 · AUTOMATION",
    heading: "Eliminate repetitive\nhand-built reports.",
    description:
      "Workflow automation that connects your billing, inventory, email, WhatsApp notifications and accounting so your team stops copying data by hand.",
    bullets: [
      "Automated daily & monthly reporting",
      "WhatsApp, SMS and email triggers",
      "Third-party API and accounting sync",
    ],
    ctaText: "Automate a workflow",
    terminalPath: "ops / workflow-sync",
    terminalLines: [
      { num: "01", text: "$ code automate --eliminate-manual-work", type: "cmd" },
      { num: "02", text: "+ nightly reconciliation automated", type: "add" },
      { num: "03", text: "+ instant customer invoice dispatch", type: "add" },
      { num: "04", text: "+ 14+ hrs saved every week", type: "add" },
      { num: "05", text: "> zero human copy-paste errors", type: "out" },
    ],
  },
  {
    id: "backend",
    num: "04",
    tabLabel: "04 BACKEND & DATABASE",
    tagLabel: "04 / 05 · BACKEND & DATABASE",
    heading: "Clean APIs and\nrock-solid databases.",
    description:
      "High-concurrency REST APIs, PostgreSQL schema design, query optimization and cloud infrastructure engineered for security and 99.9% uptime.",
    bullets: [
      "PostgreSQL architecture & query tuning",
      "Secure REST APIs & authentication",
      "Cloud deployment, backups & monitoring",
    ],
    ctaText: "Discuss architecture",
    terminalPath: "api / db-cluster",
    terminalLines: [
      { num: "01", text: "$ code deploy api --db=postgres --ha", type: "cmd" },
      { num: "02", text: "+ indexed queries under 12ms", type: "add" },
      { num: "03", text: "+ automated encrypted daily backups", type: "add" },
      { num: "04", text: "+ role-based JWT security", type: "add" },
      { num: "05", text: "> 99.9% uptime SLA active", type: "out" },
    ],
  },
  {
    id: "consulting",
    num: "05",
    tabLabel: "05 CONSULTING & MENTORING",
    tagLabel: "05 / 05 · CONSULTING & MENTORING",
    heading: "Code audits, rescue\nand 1-on-1 mentoring.",
    description:
      "Whether your existing business system is slow or your final-year IT project is stuck before the viva, our engineers step in to debug and ship.",
    bullets: [
      "Existing codebase & database refactoring",
      "Technical architecture roadmapping",
      "Final-year IT project & viva preparation",
    ],
    ctaText: "Book a session",
    terminalPath: "studio / advisory",
    terminalLines: [
      { num: "01", text: "$ code review --audit --unblock", type: "cmd" },
      { num: "02", text: "+ bottleneck identified in 1 session", type: "add" },
      { num: "03", text: "+ clean architecture & refactoring", type: "add" },
      { num: "04", text: "+ full system clarity for your team", type: "add" },
      { num: "05", text: "> ready to ship with confidence", type: "out" },
    ],
  },
];

const FAQ_ITEMS = [
  {
    question: "What kind of projects do you take on?",
    answer:
      "Business websites and web apps, custom ERP, CRM and POS systems, workflow automation, REST APIs and database work, plus technical consulting and final-year IT project mentoring.",
  },
  {
    question: "Do you work with clients outside Sri Lanka?",
    answer:
      "Yes. We are based in Colombo and work with local and international clients. Our portfolio includes businesses in the UK and Dubai.",
  },
  {
    question: "Can you improve a system we already have?",
    answer:
      "Often that is the fastest fix. We review the existing code and database, then tune, refactor or extend it instead of starting over when that makes sense.",
  },
  {
    question: "How is a project priced?",
    answer:
      "Every project is quoted after a short discovery call, once scope is clear. You get a fixed milestone breakdown with zero hidden fees.",
  },
  {
    question: "Do you help university students?",
    answer:
      "Yes. Architecture guidance, 1-on-1 debugging and viva or defense preparation for Web, Mobile, AI/ML, Cloud and IoT projects.",
  },
];

export default function HomePage() {
  const { projects, featuredProjects } = useProjects();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    bottleneck: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const currentService = SERVICE_PILLARS[activeTab];

  const countryLifeProject =
    projects.find((p) => p.slug === "country-life-sl") || projects[0];
  const medisquareProject =
    projects.find((p) => p.slug === "medisquare") ||
    projects[1] ||
    projects[0];

  const homeProjectsToDisplay =
    featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 4);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormState({ name: "", email: "", company: "", bottleneck: "" });
    }, 300);
  };

  return (
    <div className="relative min-h-screen bg-white text-neutral-950 overflow-x-hidden">
      <ScrollProgressLine />

      <Navbar />

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 pt-10 sm:pt-16 lg:pt-20 pb-12 lg:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div
              className="lg:col-span-6"
              data-cl-reveal
              style={{ "--cl-delay": "80ms" } as React.CSSProperties}
            >
              <div className="text-[12.5px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-5">
                #CODE · ENGINEERING SCALABLE SOLUTIONS
              </div>

              <h1 className="text-[50px] sm:text-[70px] lg:text-[78px] font-extrabold leading-[0.98] tracking-[-0.04em] text-neutral-950">
                Have a
                <br />
                problem?
                <br />
                Let&rsquo;s build
                <br />
                <span className="relative inline-block z-10">
                  the fix.
                  <span
                    aria-hidden="true"
                    className="absolute left-[-4px] right-[-6px] bottom-[4px] sm:bottom-[6px] h-[36%] bg-[#D4FF00] -z-10"
                  />
                </span>
              </h1>

              <p className="mt-6 max-w-[460px] text-[18.5px] sm:text-[18.5px] leading-[1.6] text-neutral-600">
                An engineering-first software studio in Colombo. Web platforms,
                custom ERP and POS, automation and backends for growing
                businesses.
              </p>

              {countryLifeProject && (
                <div className="mt-6 block lg:hidden rounded-2xl overflow-hidden border border-neutral-200 shadow-md">
                  <ProjectPreview
                    project={countryLifeProject}
                    className="h-[210px]"
                  />
                </div>
              )}

              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link
                  href="#contact"
                  className="group inline-flex items-center justify-between sm:justify-start gap-4 rounded-full bg-neutral-950 pl-6 pr-2 py-2 text-[15.5px] font-semibold text-white transition-all hover:bg-neutral-800"
                >
                  <span>Start a project</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4FF00] text-neutral-950 transition-transform duration-200 group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                  </span>
                </Link>

                <Link
                  href="/work"
                  className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-7 py-3 text-[15.5px] font-semibold text-neutral-900 transition-colors hover:bg-neutral-50 hover:border-neutral-300"
                >
                  See our work
                </Link>
              </div>
            </div>

            <div
              className="hidden lg:block lg:col-span-6 relative"
              data-cl-reveal
              style={{ "--cl-delay": "200ms" } as React.CSSProperties}
            >
              {/* Studio Showcase Canvas Frame */}
              <div className="relative mx-auto max-w-[580px] rounded-3xl border border-neutral-200/90 bg-gradient-to-b from-[#F9F9F7] via-[#F4F4F0] to-[#EFEFEA] p-5 sm:p-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.07)] overflow-hidden">
                {/* Blueprint grid texture */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.45]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, rgba(0, 0, 0, 0.08) 1px, transparent 1px)",
                    backgroundSize: "22px 22px",
                  }}
                />

                {/* Ambient lime core spotlight behind the cards */}
                <div className="pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-[360px] h-[280px] rounded-full bg-[#D4FF00]/25 blur-[65px]" />

                {/* Technical frame header */}
                <div className="relative z-10 flex items-center justify-between border-b border-neutral-200/80 pb-3 mb-4 text-[12px] font-mono text-neutral-400">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4FF00] opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D4FF00]" />
                    </span>
                    <span className="font-semibold text-neutral-800 uppercase tracking-wider">
                      STUDIO.SYS // DEPLOYMENT PREVIEW
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-neutral-400">PROD · 60FPS</span>
                    <span className="text-neutral-300 font-bold">+</span>
                  </div>
                </div>

                <div className="relative h-[255px] flex items-center justify-center">
                  {countryLifeProject && (
                    <Link
                      href={`/work/${countryLifeProject.slug}`}
                      className="group absolute left-2 top-5 w-[290px] rounded-xl bg-white p-2 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-neutral-200/80 -rotate-[4deg] transition-transform duration-300 hover:rotate-0 hover:z-30"
                    >
                      <div className="rounded-lg overflow-hidden">
                        <ProjectPreview
                          project={countryLifeProject}
                          className="h-[175px]"
                        />
                      </div>
                      <div className="pt-2 pb-0.5 px-1 text-[12px] font-mono text-neutral-500">
                        Country Life SL · WEB
                      </div>
                    </Link>
                  )}

                  {medisquareProject && (
                    <Link
                      href={`/work/${medisquareProject.slug}`}
                      className="group absolute right-2 top-0 w-[300px] z-20 rounded-xl bg-white p-2 shadow-[0_24px_60px_rgba(0,0,0,0.14)] border border-neutral-200/90 rotate-[4deg] transition-transform duration-300 hover:rotate-0"
                    >
                      <div className="rounded-lg overflow-hidden">
                        <ProjectPreview
                          project={medisquareProject}
                          className="h-[180px]"
                        />
                      </div>
                      <div className="pt-2 pb-0.5 px-1 text-[12px] font-mono text-neutral-500">
                        Medisquare · ERP
                      </div>
                    </Link>
                  )}
                </div>

                <div className="relative z-30 mt-3 mx-auto w-full rounded-xl bg-[#FFFFFF] border border-neutral-200/90 shadow-[0_12px_32px_rgba(0,0,0,0.06)] overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-neutral-200/70 bg-[#F6F6F4]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
                    <span className="ml-1 text-[12.5px] font-mono text-neutral-400">
                      ~/clients/your-business
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 font-mono text-[12px] leading-[1.7] text-neutral-700">
                    <div>
                      <span className="text-neutral-400">$</span>{" "}
                      <span className="font-semibold text-neutral-900">
                        code diagnose --business
                      </span>
                    </div>
                    <div className="pl-3 text-neutral-500">
                      <span className="text-red-500 font-semibold">x</span>{" "}
                      stock tracked in 4 spreadsheets{" "}
                      <span className="text-red-500 font-semibold ml-1">x</span>{" "}
                      reports built by hand every night
                      <span className="text-neutral-400">$</span>{" "}
                      <span className="font-semibold text-neutral-900">
                        code build --fix
                      </span>
                    </div>
                    <div className="pl-3 text-neutral-600">
                      <span className="text-emerald-600 font-semibold">+</span>{" "}
                      ERP and POS synced across branches{" "}
                      <span className="text-emerald-600 font-semibold ml-1">
                        +
                      </span>{" "}
                      fast, SEO-ready web platform
                      <span className="text-neutral-400">$</span>{" "}
                      <span className="inline-block h-3.5 w-1.5 bg-neutral-900 align-middle animate-pulse ml-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TICKER BAR */}
        <div id="metrics" style={{ scrollMarginTop: "35vh" }}>
        <div aria-label="Studio metrics" role="region" tabIndex={0}
          className="metrics-strip w-full bg-[#F6F6F4] border-y border-neutral-200/80 py-3.5">
          <div className="metrics-track flex w-max whitespace-nowrap text-[12px] font-mono uppercase tracking-[0.14em] text-neutral-600">
            {[0, 1].map((copy) => (
              <div key={copy} aria-hidden={copy === 1} className="flex min-w-[100vw] shrink-0 items-center justify-around">
                {["99.9% uptime", "Sub-second page loads", "Zero end-of-day stock discrepancy", "Automated expiry tracking", "Less manual work"].map((metric) => (
                  <span key={metric} className="flex items-center gap-8 pl-8">
                    {metric}<span aria-hidden="true" className="text-neutral-300">/</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        </div>

        {/* MOBILE SINHALA SECTION */}
        <section className="block md:hidden mx-auto max-w-[1280px] px-5 pt-12 pb-6">
          <div className="text-[12px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-3">
            01 / WEB PRESENCE
          </div>
          <h2 className="text-[28px] font-extrabold leading-[1.2] tracking-tight text-neutral-950">
            ඔබේ ව්‍යාපාරයටත්
            <br />
            Modern Website එකක්
            <br />
            <span className="relative inline-block z-10">
              අදම හදාගන්න
              <span
                aria-hidden="true"
                className="absolute left-[-2px] right-[-2px] bottom-[2px] h-[36%] bg-[#D4FF00] -z-10"
              />
            </span>
          </h2>
          <p className="mt-3 text-[15.5px] leading-relaxed text-neutral-600">
            Social media වල විතරක් සීමා වෙන්න එපා. 24/7 විවෘත, customer trust එක
            build කරන website එකක්.
          </p>
        </section>

        {/* WHO WE ARE */}
        <section className="hidden md:block mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 pt-16 pb-16 lg:pt-20 text-center">
          <div className="text-[12px] font-mono uppercase tracking-[0.18em] text-neutral-400 mb-5">
            #CODE / WHO WE ARE
          </div>
          <TypewriterHeading />
          <p className="mx-auto mt-6 max-w-[520px] text-[16.5px] sm:text-[17.5px] leading-[1.65] text-neutral-600">
            No account managers between you and the people writing your code. We
            architect, build and support every system ourselves.
          </p>
        </section>

        {/* WHAT WE BUILD */}
        <section
          id="services"
          className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 pt-8 pb-8 lg:pt-16 lg:pb-12"
        >
          <div className="block md:hidden">
            <div className="text-[12px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-4">
              WHAT WE BUILD
            </div>
            <div className="divide-y divide-neutral-200 border-y border-neutral-200">
              {SERVICE_PILLARS.map((pillar, idx) => {
                const isOpen = activeTab === idx;
                return (
                  <div key={pillar.id} className="py-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab(idx)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[12.5px] font-mono text-neutral-400">
                          {pillar.num}
                        </span>
                        <span className="text-[18.5px] font-bold text-neutral-950">
                          {pillar.tabLabel
                            .replace(/^\d+\s+/, "")
                            .toLowerCase()
                            .replace(/\b\w/g, (c) => c.toUpperCase())
                            .replace("Erp, Crm & Pos", "ERP, CRM and POS")
                            .replace(
                              "Backend & Database",
                              "Backend and database"
                            )
                            .replace(
                              "Consulting & Mentoring",
                              "Consulting and mentoring"
                            )}
                        </span>
                      </div>
                      <ArrowRight
                        className={`h-4 w-4 text-neutral-700 transition-transform ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="mt-3 pl-7 pr-2 space-y-2 text-[16.5px] text-neutral-600">
                        <p>{pillar.description}</p>
                        <ul className="space-y-1 pt-1">
                          {pillar.bullets.map((b) => (
                            <li key={b} className="flex items-center gap-2">
                              <span className="inline-flex h-4 w-4 items-center justify-center rounded-xs bg-[#D4FF00] text-[12px] font-bold text-black">
                                +
                              </span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="hidden md:block">
            <div className="flex items-end justify-between pb-5 border-b border-neutral-200/90">
              <h2 className="text-[32px] lg:text-[38px] font-extrabold tracking-[-0.03em] text-neutral-950 leading-none">
                What we build
              </h2>
              <span className="text-[12.5px] font-mono uppercase tracking-[0.16em] text-neutral-400">
                05 SERVICE PILLARS
              </span>
            </div>

            <div className="mt-5 grid grid-cols-5 gap-3">
              {SERVICE_PILLARS.map((pillar, index) => {
                const isActive = activeTab === index;
                return (
                  <button
                    key={pillar.id}
                    type="button"
                    onClick={() => setActiveTab(index)}
                    className={`rounded-lg px-4 py-3 text-left text-[12.5px] font-mono uppercase tracking-[0.12em] transition-all cursor-pointer ${
                      isActive
                        ? "bg-neutral-950 text-white font-semibold shadow-xs"
                        : "bg-[#F7F7F5] text-neutral-600 hover:bg-neutral-200/70 hover:text-neutral-950 border border-neutral-200/60"
                    }`}
                  >
                    {pillar.tabLabel}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 h-[2px] w-full bg-neutral-200/80 relative">
              <div
                className="h-[2.5px] bg-neutral-950 transition-all duration-300"
                style={{
                  width: "20%",
                  marginLeft: `${activeTab * 20}%`,
                }}
              />
            </div>

            <div className="mt-12 grid grid-cols-12 gap-10 items-center">
              <div className="col-span-6">
                <div className="text-[12px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-3">
                  {currentService.tagLabel}
                </div>
                <h3 className="text-[36px] lg:text-[42px] font-extrabold leading-[1.06] tracking-[-0.035em] text-neutral-950 whitespace-pre-line">
                  {currentService.heading}
                </h3>
                <p className="mt-4 max-w-[470px] text-[16.5px] leading-[1.65] text-neutral-600">
                  {currentService.description}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {currentService.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-center gap-3 text-[16.5px] font-medium text-neutral-800"
                    >
                      <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] bg-[#D4FF00] text-[12.5px] font-mono font-bold text-neutral-950">
                        +
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link
                    href="#contact"
                    className="inline-block text-[16.5px] font-bold text-neutral-950 border-b-[3px] border-[#D4FF00] pb-0.5 hover:opacity-80 transition-opacity"
                  >
                    {currentService.ctaText}
                  </Link>
                </div>
              </div>

              <div className="col-span-6">
                <div className="rounded-2xl bg-[#F4F4F2] border border-neutral-200/80 p-6 lg:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                  <div className="flex items-center gap-2 pb-4 mb-4 border-b border-neutral-200/70">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]/70" />
                    <span className="ml-2 text-[12.5px] font-mono text-neutral-400">
                      {currentService.terminalPath}
                    </span>
                  </div>

                  <div className="space-y-2.5 font-mono text-[12.5px] leading-relaxed">
                    {currentService.terminalLines.map((line) => (
                      <div key={line.num} className="flex items-start gap-5">
                        <span className="text-neutral-300 select-none">
                          {line.num}
                        </span>
                        <span
                          className={
                            line.type === "cmd"
                              ? "font-semibold text-neutral-900"
                              : line.type === "out"
                              ? "text-neutral-700 font-medium pl-3"
                              : "text-neutral-700 pl-3"
                          }
                        >
                          {line.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SELECTED WORK */}
        <section className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 py-8 lg:py-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div>
              <div className="text-[12px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-3">
                SELECTED WORK
              </div>
              <h2 className="text-[38px] sm:text-[50px] lg:text-[56px] font-extrabold leading-[1.02] tracking-[-0.04em] text-neutral-950">
                Shipped. Live.
                <br />
                <span className="relative inline-block z-10">
                  In production.
                  <span
                    aria-hidden="true"
                    className="absolute left-[-4px] right-[-4px] bottom-[3px] sm:bottom-[5px] h-[36%] bg-[#D4FF00] -z-10"
                  />
                </span>
              </h2>
            </div>

            <Link
              href="/work"
              className="hidden sm:inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-[14.5px] font-semibold text-neutral-900 transition-colors hover:bg-neutral-50 hover:border-neutral-300"
            >
              View all {projects.length} projects
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeProjectsToDisplay.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                variant="home"
                displayIndex={project.number}
              />
            ))}
          </div>

          <div className="mt-6 sm:hidden">
            <Link
              href="/work"
              className="flex w-full items-center justify-center rounded-full border border-neutral-200 bg-white py-3.5 text-[14.5px] font-mono font-medium text-neutral-900"
            >
              View all {projects.length} projects →
            </Link>
          </div>
        </section>

        {/* HOW WE WORK */}
        <section
          id="process"
          className="w-full bg-[#F6F6F4] border-t border-neutral-200/60 py-10 lg:py-16"
        >
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
            <div className="text-[12px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-3">
              HOW WE WORK
            </div>
            <h2 className="text-[38px] sm:text-[50px] lg:text-[56px] font-extrabold leading-[1.03] tracking-[-0.04em] text-neutral-950">
              Four steps.
              <br />
              <span className="relative inline-block z-10">
                Zero guesswork.
                <span
                  aria-hidden="true"
                  className="absolute left-[-4px] right-[-4px] bottom-[3px] sm:bottom-[5px] h-[36%] bg-[#D4FF00] -z-10"
                />
              </span>
            </h2>
            <p className="mt-4 max-w-[540px] text-[14.5px] sm:text-[15.5px] text-neutral-600">
              From the first call to long after launch, you always know what is
              being built and why.
            </p>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  step: "01 / DISCOVER",
                  title: "Find the real\nbottleneck.",
                  desc: "We map how your business actually runs today: the spreadsheets, workarounds and hand-offs.",
                },
                {
                  step: "02 / ARCHITECT",
                  title: "Design before we\nbuild.",
                  desc: "Data model, integrations and scope agreed up front, so the build has no surprises.",
                },
                {
                  step: "03 / BUILD",
                  title: "Ship in visible\nsteps.",
                  desc: "Working software in short cycles you can click through, not a big reveal at the end.",
                },
                {
                  step: "04 / SUPPORT",
                  title: "Stay fast after\nlaunch.",
                  desc: "Monitoring, maintenance and improvements as your business and data grow.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl bg-white border border-neutral-200/80 p-6 sm:p-7 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
                >
                  <div>
                    <div className="text-[12px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-5">
                      {item.step}
                    </div>
                    <h3 className="text-[20px] font-extrabold leading-[1.2] tracking-tight text-neutral-950 whitespace-pre-line">
                      {item.title}
                    </h3>
                    <p className="mt-3.5 text-[14.5px] leading-[1.6] text-neutral-600">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
              <span className="text-[16.5px] font-medium text-neutral-700">
                Have a business bottleneck?
              </span>
              <Link
                href="#contact"
                className="group inline-flex items-center gap-3.5 rounded-full bg-neutral-950 pl-6 pr-2 py-2 text-[16.5px] font-semibold text-white transition-all hover:bg-neutral-800"
              >
                <span>Book a discovery call</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D4FF00] text-neutral-950 transition-transform duration-200 group-hover:rotate-45">
                  <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* CAMPUS.DEBUG */}
        <section id="students" className="w-full bg-[#D4FF00] py-10 lg:py-16">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              <div className="lg:col-span-6">
                <div className="text-[12px] font-mono uppercase tracking-[0.16em] text-neutral-800/80 mb-4">
                  03 / CAMPUS.DEBUG
                </div>
                <h2 className="text-[40px] sm:text-[52px] lg:text-[58px] font-extrabold leading-[1.02] tracking-[-0.04em] text-neutral-950">
                  Final-year IT
                  <br />
                  project stuck?
                  <br />
                  We help you
                  <br />
                  code and deliver.
                </h2>
                <p className="mt-5 max-w-[440px] text-[16.5px] leading-[1.6] text-neutral-900/85">
                  End-to-end guidance for Web, Mobile, AI/ML, Cloud and IoT
                  projects, from architecture to the viva.
                </p>

                <div className="mt-8">
                  <Link
                    href="#contact"
                    className="group inline-flex items-center gap-3.5 rounded-full bg-neutral-950 pl-6 pr-2 py-2 text-[16.5px] font-semibold text-white transition-all hover:bg-neutral-800"
                  >
                    <span>Book a consultation</span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D4FF00] text-neutral-950 transition-transform duration-200 group-hover:rotate-45">
                      <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
                    </span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white p-6 shadow-xs">
                    <div className="text-[12px] font-mono text-neutral-400 mb-2">
                      01
                    </div>
                    <h3 className="text-[20px] font-extrabold tracking-tight text-neutral-950">
                      Clean architecture
                    </h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-neutral-600">
                      Industry-standard structure your supervisor will
                      recognise.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white p-6 shadow-xs">
                    <div className="text-[12px] font-mono text-neutral-400 mb-2">
                      02
                    </div>
                    <h3 className="text-[20px] font-extrabold tracking-tight text-neutral-950">
                      1-on-1 debugging
                    </h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-neutral-600">
                      Live sessions to unblock the bugs that cost you weeks.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-neutral-950 text-white p-6 sm:p-7 shadow-xs">
                  <div className="text-[12px] font-mono text-[#D4FF00] mb-2">
                    03
                  </div>
                  <h3 className="text-[20px] font-extrabold tracking-tight text-white">
                    Viva and defense preparation
                  </h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-neutral-300">
                    Walk in knowing every design decision in your own system,
                    and why you made it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 pt-10 pb-10 lg:pt-16 lg:pb-16 border-b border-neutral-200/70"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <div className="text-[12px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-3">
                FAQ
              </div>
              <h2 className="text-[36px] sm:text-[44px] font-extrabold leading-[1.08] tracking-[-0.035em] text-neutral-950">
                A little more about
                <br />
                <span className="relative inline-block z-10">
                  #code.
                  <span
                    aria-hidden="true"
                    className="absolute left-[-4px] right-[-4px] bottom-[3px] h-[36%] bg-[#D4FF00] -z-10"
                  />
                </span>
              </h2>
            </div>

            <div className="lg:col-span-7 divide-y divide-neutral-200/90">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={item.question} className="py-5 first:pt-0">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between gap-4 text-left cursor-pointer group"
                    >
                      <span className="text-[17.5px] sm:text-[18.5px] font-bold text-neutral-950 group-hover:text-neutral-700 transition-colors">
                        {item.question}
                      </span>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 group-hover:border-neutral-400 transition-colors">
                        {isOpen ? (
                          <Minus className="h-3.5 w-3.5" />
                        ) : (
                          <Plus className="h-3.5 w-3.5" />
                        )}
                      </span>
                    </button>
                    {isOpen && (
                      <p className="mt-3.5 pr-10 text-[15.5px] leading-[1.65] text-neutral-600">
                        {item.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 py-10 lg:py-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-start">
            <div className="lg:col-span-6">
              <div className="text-[12px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-3">
                04 / LET&apos;S COLLABORATE
              </div>
              <h2 className="text-[42px] sm:text-[54px] lg:text-[60px] font-extrabold leading-[1.02] tracking-[-0.04em] text-neutral-950">
                Your next
                <br />
                system starts
                <br />
                <span className="relative inline-block z-10">
                  here.
                  <span
                    aria-hidden="true"
                    className="absolute left-[-4px] right-[-4px] bottom-[4px] h-[36%] bg-[#D4FF00] -z-10"
                  />
                </span>
              </h2>
              <p className="mt-5 max-w-[420px] text-[16.5px] leading-[1.6] text-neutral-600">
                Tell us what is slowing your business down. An engineer, not a
                salesperson, replies.
              </p>

              <div className="mt-8 pt-7 border-t border-neutral-200/80 space-y-5 max-w-[420px]">
                <div>
                  <div className="text-[12px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-1">
                    EMAIL
                  </div>
                  <a
                    href="mailto:hasgtagcode.solutions@gmail.com"
                    className="text-[17.5px] font-bold text-neutral-950 hover:underline decoration-[#D4FF00] decoration-2"
                  >
                    hasgtagcode.solutions@gmail.com
                  </a>
                </div>

                <div>
                  <div className="text-[12px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-1">
                    STUDIO
                  </div>
                  <div className="text-[17.5px] font-bold text-neutral-950">
                    Colombo, Sri Lanka
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl bg-white border border-neutral-200/90 p-6 sm:p-9 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
                <h3 className="text-[20px] font-extrabold tracking-tight text-neutral-950 mb-6">
                  Start a project
                </h3>

                {submitted ? (
                  <div className="rounded-xl bg-[#F6F6F4] p-6 text-center space-y-3">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                    <div className="text-lg font-bold text-neutral-950">
                      Enquiry received!
                    </div>
                    <p className="text-sm text-neutral-600">
                      One of our engineers will review your bottleneck and reply
                      shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-2 inline-block text-xs font-mono underline text-neutral-700"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[14.5px] font-medium text-neutral-600 mb-1.5">
                          Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Your name"
                          value={formState.name}
                          onChange={(e) =>
                            setFormState({ ...formState, name: e.target.value })
                          }
                          className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-[16.5px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[14.5px] font-medium text-neutral-600 mb-1.5">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="you@company.com"
                          value={formState.email}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              email: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-[16.5px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[14.5px] font-medium text-neutral-600 mb-1.5">
                        Company
                      </label>
                      <input
                        type="text"
                        placeholder="Business name"
                        value={formState.company}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            company: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-[16.5px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[14.5px] font-medium text-neutral-600 mb-1.5">
                        What is the bottleneck?
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="e.g. Stock is tracked in Excel across three branches and never matches at day end."
                        value={formState.bottleneck}
                        onChange={(e) =>
                          setFormState({
                            ...formState,
                            bottleneck: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-[16.5px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="mt-2 w-full rounded-full bg-neutral-950 py-3.5 text-[16.5px] font-semibold text-white transition-colors hover:bg-neutral-800 cursor-pointer"
                    >
                      Let&apos;s build the fix
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
