import { NextRequest, NextResponse } from "next/server";
import { getProjects, saveProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const projects = getProjects();
    const idx = projects.findIndex((p) => p.id === id || p.slug === id);

    if (idx === -1) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const updatedProject = {
      ...projects[idx],
      ...body,
      id: projects[idx].id,
    };

    projects[idx] = updatedProject;
    saveProjects(projects);

    return NextResponse.json({
      project: updatedProject,
      projects: getProjects(),
    });
  } catch (err) {
    console.error("Failed to update project:", err);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const projects = getProjects();
    const filtered = projects.filter((p) => p.id !== id && p.slug !== id);

    if (filtered.length === projects.length) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    saveProjects(filtered);
    return NextResponse.json({ projects: getProjects() });
  } catch (err) {
    console.error("Failed to delete project:", err);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
