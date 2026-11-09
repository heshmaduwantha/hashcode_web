"use client";

import React from "react";
import { Project } from "@/types/project";

interface ProjectPreviewProps {
  project: Pick<
    Project,
    "title" | "subtitle" | "category" | "previewTheme" | "image" | "number"
  >;
  className?: string;
  showBadge?: boolean;
}

export function ProjectPreview({
  project,
  className = "",
  showBadge = false,
}: ProjectPreviewProps) {
  const badge = showBadge ? (
    <div className="absolute top-3 left-3 z-20 inline-flex items-center rounded-full bg-white/95 backdrop-blur-sm px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-800 shadow-sm border border-black/5">
      {project.number} / {project.category}
    </div>
  ) : null;

  if (project.image && project.image.trim() !== "") {
    return (
      <div
        className={`relative w-full overflow-hidden bg-neutral-100 ${className}`}
      >
        {badge}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 text-white p-5 flex flex-col justify-between select-none ${className}`}
    >
      {badge}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-[9px] font-mono text-white/80">
          <span className="bg-[#D4FF00] text-black px-1 font-bold">#</span>
          code
        </span>
        <span className="text-[8px] font-mono uppercase tracking-widest text-[#D4FF00]">
          {project.category}
        </span>
      </div>
      <div className="my-auto py-3">
        <div className="text-base font-bold tracking-tight text-white">
          {project.title}
        </div>
        <div className="text-xs text-neutral-400 mt-0.5">{project.subtitle}</div>
      </div>
      <div className="flex items-center gap-1.5 text-[9px] font-mono text-neutral-400">
        <span className="h-1.5 w-1.5 rounded-full bg-[#D4FF00]" />
        <span>LIVE IN PRODUCTION</span>
      </div>
    </div>
  );
}

