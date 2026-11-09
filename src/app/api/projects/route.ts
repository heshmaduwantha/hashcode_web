import { NextRequest, NextResponse } from "next/server";
import { getProjects, saveProjects } from "@/lib/projects";
import { Project } from "@/types/project";

export const dynamic = "force-dynamic";

export async function GET() {
  const projects = getProjects();
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const projects = getProjects();

    const title = (body.title || "Untitled Project").trim();
    const baseSlug = (body.slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const uniqueSlug = projects.some((p) => p.slug === baseSlug)
      ? `${baseSlug}-${Date.now().toString().slice(-4)}`
      : baseSlug;

    const nextNumber = String(projects.length + 1).padStart(2, "0");

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      slug: uniqueSlug,
      number: nextNumber,
      category: body.category === "ERP" ? "ERP" : "WEB",
      title,
      subtitle: body.subtitle || "Web platform",
      location: body.location || "Sri Lanka",
      featuredOnHome: Boolean(body.featuredOnHome ?? true),
      homeOrder:
        body.homeOrder ?? projects.filter((p) => p.featuredOnHome).length + 1,
      liveUrl: body.liveUrl || "",
      image: body.image || "",
      previewTheme: body.previewTheme || "custom",
      heroHeading: body.heroHeading || title,
      heroHighlight: body.heroHighlight || body.subtitle || "In Production",
      summary:
        body.summary ||
        "Engineered for sub-second speed, clean architecture and real-world reliability.",
      client: body.client || title,
      industry: body.industry || body.subtitle || "Technology",
      scope:
        body.scope ||
        (body.category === "ERP" ? "Custom ERP and POS" : "Web platform"),
      stack: body.stack || "Next.js · TypeScript · PostgreSQL",
      year: body.year || new Date().getFullYear().toString(),
      bottleneck:
        body.bottleneck ||
        "Manual workflows and disconnected tools slowed down daily operations and customer response times.",
      theFix:
        body.theFix ||
        "A unified, high-performance platform tailored to the business workflow from day one.",
      modules:
        Array.isArray(body.modules) && body.modules.length > 0
          ? body.modules
          : [
              {
                number: "01",
                tag: "ARCHITECTURE",
                title: "Clean system foundation",
                description:
                  "Structured data model and modern stack built for reliability.",
              },
              {
                number: "02",
                tag: "PERFORMANCE",
                title: "Sub-second speed",
                description:
                  "Optimized frontend and backend responses across all devices.",
              },
              {
                number: "03",
                tag: "WORKFLOW",
                title: "Automated operations",
                description:
                  "Eliminating repetitive manual tracking and hand-offs.",
              },
              {
                number: "04",
                tag: "ACCESS",
                title: "Secure role management",
                description:
                  "Granular permissions and reliable production monitoring.",
              },
            ],
      outcomes:
        Array.isArray(body.outcomes) && body.outcomes.length > 0
          ? body.outcomes
          : [
              { metric: "99.9%", label: "production uptime" },
              { metric: "<0.7s", label: "average page load" },
              { metric: "10+ hrs", label: "manual work saved each week" },
            ],
      quoteText:
        body.quoteText ||
        "Delivered on scope with clean engineering and measurable impact from day one.",
      quoteAuthor: body.quoteAuthor || `Team at ${title}`,
      createdAt: new Date().toISOString(),
    };

    const updated = [...projects, newProject];
    saveProjects(updated);

    return NextResponse.json(
      { project: newProject, projects: getProjects() },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error adding project:", err);
    return NextResponse.json(
      { error: "Failed to add project" },
      { status: 500 }
    );
  }
}
