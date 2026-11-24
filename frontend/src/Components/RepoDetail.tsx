import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { config } from "../config";
import "./RepoDetail.css";

const LANG_COLORS: Record<string, string> = {
  Python:     "#3572A5",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Rust:       "#dea584",
  Go:         "#00ADD8",
  Java:       "#b07219",
  "C++":      "#f34b7d",
  C:          "#555555",
  HTML:       "#e34c26",
  CSS:        "#563d7c",
  Shell:      "#89e051",
};

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  size: number;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
  created_at: string;
  updated_at: string;
}

export default function RepoDetail() {
  const { name } = useParams();
  const [project, setProject] = useState<Repo | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    async function getData() {
      setStatus("loading");
      try {
        const headers: Record<string, string> = {
          Accept: "application/vnd.github+json",
        };
        if (config.githubToken) {
          headers["Authorization"] = `Bearer ${config.githubToken}`;
        }
        const response = await fetch(
          `https://api.github.com/repos/${config.githubUsername}/${encodeURIComponent(name ?? "")}`,
          { headers }
        );
        if (!response.ok) { setStatus("error"); return; }
        const data = await response.json();
        setProject(data);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    }
    getData();
  }, [name]);

  /* ── Loading ── */
  if (status === "loading") {
    return (
      <div className="rd-wrapper">
        <div className="rd-skeleton-back" />
        <div className="rd-skeleton-title" />
        <div className="rd-skeleton-body" />
      </div>
    );
  }

  /* ── Error ── */
  if (status === "error" || !project) {
    return (
      <div className="rd-wrapper">
        <Link to="/projects" className="rd-back">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M7.78 12.53a.75.75 0 01-1.06 0L2.47 8.28a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L4.81 7h7.44a.75.75 0 010 1.5H4.81l2.97 2.97a.75.75 0 010 1.06z"/>
          </svg>
          Back to projects
        </Link>
        <div className="rd-error">
          <p className="rd-error-title">Repository not found</p>
          <p className="rd-error-sub">Could not load <strong>{name}</strong>.</p>
        </div>
      </div>
    );
  }

  const updatedDate = new Date(project.updated_at).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });

  const langColor = project.language
    ? LANG_COLORS[project.language] ?? "var(--accent)"
    : "var(--accent)";

  return (
    <div className="rd-wrapper">

      {/* Back link */}
      <Link to="/projects" className="rd-back">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
          <path d="M7.78 12.53a.75.75 0 01-1.06 0L2.47 8.28a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L4.81 7h7.44a.75.75 0 010 1.5H4.81l2.97 2.97a.75.75 0 010 1.06z"/>
        </svg>
        Back to projects
      </Link>

      {/* Main card */}
      <div className="rd-card">

        {/* Card header */}
        <div className="rd-card-header">
          <div className="rd-card-icon">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/>
            </svg>
          </div>
          <h1 className="rd-name">{project.name}</h1>
        </div>

        {/* Description */}
        {project.description && (
          <p className="rd-desc">{project.description}</p>
        )}

        {/* Stats row */}
        <div className="rd-stats">
          {project.language && (
            <span className="rd-stat">
              <span className="rd-lang-dot" style={{ background: langColor }} />
              {project.language}
            </span>
          )}
          <span className="rd-stat">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
            </svg>
            {project.stargazers_count} stars
          </span>
          <span className="rd-stat">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
            </svg>
            {project.forks_count} forks
          </span>
          <span className="rd-stat">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/><path fillRule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"/>
            </svg>
            {project.open_issues_count} issues
          </span>
        </div>

        {/* Divider */}
        <div className="rd-divider" />

        {/* Meta grid */}
        <div className="rd-meta-grid">
          <div className="rd-meta-item">
            <p className="rd-meta-label">Default branch</p>
            <p className="rd-meta-value rd-branch">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"/>
              </svg>
              {project.default_branch}
            </p>
          </div>
          <div className="rd-meta-item">
            <p className="rd-meta-label">Size</p>
            <p className="rd-meta-value">{project.size > 1024 ? `${(project.size / 1024).toFixed(1)} MB` : `${project.size} KB`}</p>
          </div>
          <div className="rd-meta-item">
            <p className="rd-meta-label">Last updated</p>
            <p className="rd-meta-value">{updatedDate}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="rd-divider" />

        {/* CTA */}
        <div className="rd-actions">
          <a
            href={project.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rd-btn-primary"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            View on GitHub
          </a>
          <Link to="/projects" className="rd-btn-secondary">
            Browse all projects
          </Link>
        </div>

      </div>
    </div>
  );
}
