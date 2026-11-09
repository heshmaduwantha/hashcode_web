import fs from "fs";
import path from "path";
import { Project } from "@/types/project";
import initialProjects from "@/data/projects.json";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "projects.json");
const TMP_FILE_PATH = "/tmp/hashcode-projects.json";

export function getProjects(): Project[] {
  for (const filePath of [TMP_FILE_PATH, DATA_FILE_PATH]) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(raw) as Project[];
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // try next path
    }
  }
  return initialProjects as Project[];
}

export function saveProjects(projects: Project[]): void {
  const normalized = projects.map((proj, index) => ({
    ...proj,
    number: String(index + 1).padStart(2, "0"),
  }));
  const json = JSON.stringify(normalized, null, 2);
  try {
    fs.writeFileSync(TMP_FILE_PATH, json, "utf-8");
  } catch {
    // ignore tmp write failure
  }
  try {
    fs.writeFileSync(DATA_FILE_PATH, json, "utf-8");
  } catch {
    // read-only filesystem in serverless environments (e.g. Vercel)
  }
}

export function getProjectBySlug(slug: string): Project | undefined {
  const all = getProjects();
  return all.find((p) => p.slug === slug || p.id === slug);
}
