"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Project } from "@/types/project";
import initialProjectsData from "@/data/projects.json";

interface ProjectsContextValue {
  projects: Project[];
  featuredProjects: Project[];
  isLoading: boolean;
  refreshProjects: () => Promise<void>;
  addProject: (data: Partial<Project>) => Promise<Project | null>;
  updateProject: (id: string, data: Partial<Project>) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<boolean>;
}

const ProjectsContext = createContext<ProjectsContextValue | undefined>(
  undefined
);

const CHANNEL_NAME = "hashtag_code_projects_sync";

export function ProjectsProvider({
  children,
  initialProjects = initialProjectsData as Project[],
}: {
  children: React.ReactNode;
  initialProjects?: Project[];
}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/projects", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.projects)) {
          setProjects(data.projects);
        }
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProjects();

    let channel: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (event.data?.type === "PROJECTS_UPDATED") {
          if (Array.isArray(event.data.projects)) {
            setProjects(event.data.projects);
          } else {
            refreshProjects();
          }
        }
      };
    }

    const handleFocus = () => {
      refreshProjects();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
      if (channel) channel.close();
    };
  }, [refreshProjects]);

  const notifyOtherTabs = (updatedProjects: Project[]) => {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const ch = new BroadcastChannel(CHANNEL_NAME);
      ch.postMessage({ type: "PROJECTS_UPDATED", projects: updatedProjects });
      ch.close();
    }
  };

  const addProject = async (data: Partial<Project>): Promise<Project | null> => {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    const result = await res.json();
    if (Array.isArray(result.projects)) {
      setProjects(result.projects);
      notifyOtherTabs(result.projects);
    }
    return result.project || null;
  };

  const updateProject = async (
    id: string,
    data: Partial<Project>
  ): Promise<Project | null> => {
    const res = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    const result = await res.json();
    if (Array.isArray(result.projects)) {
      setProjects(result.projects);
      notifyOtherTabs(result.projects);
    }
    return result.project || null;
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    const res = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) return false;
    const result = await res.json();
    if (Array.isArray(result.projects)) {
      setProjects(result.projects);
      notifyOtherTabs(result.projects);
    }
    return true;
  };

  const featuredProjects = React.useMemo(() => {
    const featured = projects.filter((p) => p.featuredOnHome);
    return featured.sort((a, b) => (a.homeOrder ?? 99) - (b.homeOrder ?? 99));
  }, [projects]);

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        featuredProjects,
        isLoading,
        refreshProjects,
        addProject,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return ctx;
}
