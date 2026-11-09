export type ProjectCategory = "WEB" | "ERP";

export interface ProjectModule {
  number: string;
  tag: string;
  title: string;
  description: string;
}

export interface ProjectOutcome {
  metric: string;
  label: string;
}

export interface Project {
  id: string;
  slug: string;
  number: string;
  category: ProjectCategory;
  title: string;
  subtitle: string;
  location?: string;
  featuredOnHome: boolean;
  homeOrder?: number;
  liveUrl?: string;
  image?: string;
  previewTheme:
    | "country-life"
    | "medisquare"
    | "green-mile"
    | "resonate-cx"
    | "msk-property"
    | "merc-uk"
    | "indra-global"
    | "indra-immigration"
    | "taxi-studio"
    | "katg"
    | "laf-group"
    | "custom";
  heroHeading?: string;
  heroHighlight?: string;
  summary?: string;
  client?: string;
  industry?: string;
  scope?: string;
  stack?: string;
  year?: string;
  bottleneck?: string;
  theFix?: string;
  modules?: ProjectModule[];
  outcomes?: ProjectOutcome[];
  quoteText?: string;
  quoteAuthor?: string;
  createdAt?: string;
}
