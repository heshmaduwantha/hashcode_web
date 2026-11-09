import type { Metadata } from "next";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/700.css";
import "./globals.css";
import "./code-loader.css";
import { CodeLoader } from "@/components/CodeLoader";
import { ProjectsProvider } from "@/context/ProjectsContext";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "#code",
  description:
    "An engineering-first software studio in Colombo. Web platforms, custom ERP and POS, automation and backends for growing businesses.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialProjects = getProjects();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased selection:bg-[#D4FF00] selection:text-neutral-950"
        suppressHydrationWarning
      >
        <CodeLoader />
        <ProjectsProvider initialProjects={initialProjects}>
          {children}
        </ProjectsProvider>
      </body>
    </html>
  );
}
