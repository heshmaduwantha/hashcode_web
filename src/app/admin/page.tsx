"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Star,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  Upload,
  LayoutGrid,
} from "lucide-react";
import { useProjects } from "@/context/ProjectsContext";
import { ProjectCategory } from "@/types/project";
import { ProjectPreview } from "@/components/ProjectPreview";

export default function AdminDashboardPage() {
  const { projects, addProject, updateProject, deleteProject, isLoading } =
    useProjects();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState<ProjectCategory>("WEB");
  const [location, setLocation] = useState("Sri Lanka");
  const [liveUrl, setLiveUrl] = useState("");
  const [image, setImage] = useState("");
  const [featuredOnHome, setFeaturedOnHome] = useState(true);
  const [summary, setSummary] = useState("");
  const [stack, setStack] = useState("Next.js · TypeScript · PostgreSQL");
  const [bottleneck, setBottleneck] = useState("");
  const [theFix, setTheFix] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      const created = await addProject({
        title: title.trim(),
        subtitle:
          subtitle.trim() ||
          `${category === "ERP" ? "Custom ERP" : "Website"} · ${location}`,
        category,
        location,
        liveUrl: liveUrl.trim(),
        image: image.trim(),
        featuredOnHome,
        summary: summary.trim() || undefined,
        stack: stack.trim() || undefined,
        bottleneck: bottleneck.trim() || undefined,
        theFix: theFix.trim() || undefined,
      });

      if (created) {
        setTitle("");
        setSubtitle("");
        setLiveUrl("");
        setImage("");
        setSummary("");
        setBottleneck("");
        setTheFix("");
        showToast(
          `Project "${created.title}" added! Home & Work pages updated automatically.`
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    await updateProject(id, { featuredOnHome: !current });
    showToast(
      !current
        ? "Added to Home page Selected Work!"
        : "Removed from Home page Selected Work."
    );
  };

  const handleDelete = async (id: string, projTitle: string) => {
    const ok = await deleteProject(id);
    if (ok) {
      showToast(`Deleted "${projTitle}". Client pages updated.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F6F4] text-neutral-950">
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center text-[18px] font-extrabold tracking-tight text-neutral-950"
            >
              <span className="inline-flex items-center justify-center bg-[#D4FF00] px-1 py-0.5 leading-none mr-0.5 rounded-[2px]">
                #
              </span>
              <span>code</span>
            </Link>
            <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
              Admin Studio
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/work"
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>View Work ({projects.length})</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-4 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Live Site</span>
            </Link>
          </div>
        </div>
      </header>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-neutral-950 text-white px-4 py-3 text-xs font-medium shadow-xl border border-white/10">
          <CheckCircle2 className="h-4 w-4 text-[#D4FF00] shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <main className="mx-auto max-w-[1280px] px-5 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 rounded-2xl bg-white border border-neutral-200 p-6 sm:p-7 shadow-xs">
            <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-neutral-400 mb-1">
              AUTO-SYNC ENABLED
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950 mb-5">
              Add new project
            </h1>

            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Logistics ERP"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3.5 py-2 text-sm focus:border-neutral-950 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as ProjectCategory)
                    }
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-neutral-950 focus:outline-none"
                  >
                    <option value="WEB">WEB (Web Platform)</option>
                    <option value="ERP">ERP (ERP / POS / System)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Sri Lanka / UK / Dubai"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-neutral-950 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Card Subtitle *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Logistics management · Dubai"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3.5 py-2 text-sm focus:border-neutral-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Screenshot Image (Upload or URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Paste image URL or upload file ->"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-xs focus:border-neutral-950 focus:outline-none"
                  />
                  <label className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-800 cursor-pointer hover:bg-neutral-100">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Live URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3.5 py-2 text-sm focus:border-neutral-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Tech Stack
                </label>
                <input
                  type="text"
                  placeholder="Next.js · Node.js · PostgreSQL"
                  value={stack}
                  onChange={(e) => setStack(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3.5 py-2 text-sm focus:border-neutral-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Case Study Summary
                </label>
                <textarea
                  rows={2}
                  placeholder="Short description of what was built..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3.5 py-2 text-sm focus:border-neutral-950 focus:outline-none resize-none"
                />
              </div>

              <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={featuredOnHome}
                  onChange={(e) => setFeaturedOnHome(e.target.checked)}
                  className="h-4 w-4 accent-neutral-950 rounded-xs"
                />
                <span className="text-xs font-semibold text-neutral-800">
                  Show in &ldquo;Selected Work&rdquo; on Home Page
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 disabled:opacity-50 cursor-pointer"
              >
                <Plus className="h-4 w-4 text-[#D4FF00]" />
                <span>{submitting ? "Adding..." : "Publish Project"}</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-neutral-950">
                  Live Projects ({projects.length})
                </h2>
                <p className="text-xs text-neutral-500">
                  Changes immediately update the Home page and /work page.
                </p>
              </div>
              {isLoading && (
                <span className="text-xs font-mono text-neutral-400">
                  Syncing...
                </span>
              )}
            </div>

            <div className="space-y-3">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white border border-neutral-200 p-4 shadow-2xs"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-16 rounded-lg overflow-hidden border border-neutral-200 shrink-0">
                      <ProjectPreview
                        project={proj}
                        className="h-full w-full"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-xs bg-neutral-100 text-neutral-700 font-semibold">
                          {proj.number} / {proj.category}
                        </span>
                        {proj.featuredOnHome && (
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-xs bg-[#D4FF00] text-neutral-950 font-bold">
                            Featured on Home
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-neutral-950 mt-1">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-neutral-500">
                        {proj.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleFeatured(proj.id, proj.featuredOnHome)
                      }
                      title="Toggle Home Page Featured"
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors cursor-pointer ${
                        proj.featuredOnHome
                          ? "bg-[#D4FF00]/30 border-[#D4FF00] text-neutral-950"
                          : "bg-white border-neutral-200 text-neutral-500 hover:text-neutral-900"
                      }`}
                    >
                      <Star
                        className={`h-3.5 w-3.5 ${
                          proj.featuredOnHome ? "fill-neutral-950" : ""
                        }`}
                      />
                      <span>Home</span>
                    </button>

                    <Link
                      href={`/work/${proj.slug}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:text-neutral-950 hover:border-neutral-300"
                      title="View Case Study"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(proj.id, proj.title)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-red-600 hover:bg-red-50 hover:border-red-200 cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

