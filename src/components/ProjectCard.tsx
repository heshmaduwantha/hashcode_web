"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Project } from "@/types/project";
import { ProjectPreview } from "@/components/ProjectPreview";

interface ProjectCardProps {
  project: Project;
  variant?: "home" | "work";
  displayIndex?: string;
}

export function ProjectCard({
  project,
  variant = "home",
  displayIndex,
}: ProjectCardProps) {
  const num = displayIndex || project.number;

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group flex flex-col rounded-2xl border border-neutral-200/90 bg-white p-3 sm:p-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)] hover:border-neutral-300"
    >
      <div className="relative w-full overflow-hidden rounded-xl border border-neutral-100">
        <ProjectPreview
          project={{ ...project, number: num }}
          showBadge={variant === "work"}
          className="h-[205px] sm:h-[220px]"
        />
      </div>

      <div className="pt-4 pb-1 px-1.5 flex items-end justify-between gap-3">
        <div>
          {variant === "home" && (
            <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-neutral-400 mb-1">
              {num} / {project.category}
            </div>
          )}
          <h3 className="text-[17px] font-bold tracking-tight text-neutral-950 group-hover:text-black">
            {project.title}
          </h3>
          <p className="text-[12.5px] text-neutral-500 mt-0.5">
            {project.subtitle}
          </p>
        </div>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D4FF00] text-neutral-950 transition-transform duration-200 group-hover:scale-105 group-hover:rotate-45">
          <ArrowUpRight className="h-4 w-4 stroke-[2.2]" />
        </span>
      </div>
    </Link>
  );
}

