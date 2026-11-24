import { useEffect, useRef } from "react";
import type { ReactNode, CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import { Link } from "react-router-dom";
import useGithubRepos from "./useGithubRepos";
import "./ProjectList.css";

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

/* Spotlight card — same mouse-tracking glow as the home page */
function SpotlightCard({
  children,
  delay,
  to,
}: {
  children: ReactNode;
  delay: number;
  to: string;
}) {
  const cardRef = useRef<HTMLLIElement>(null);

  const handleMouseMove = (e: ReactMouseEvent<HTMLLIElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--mx", "-999px");
    card.style.setProperty("--my", "-999px");
  };

  return (
    <li
      ref={cardRef}
      className="pl-card"
      style={{ animationDelay: `${delay}s` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={to} className="pl-card-link">
        {children}
        <div className="pl-card-spotlight" />
      </Link>
    </li>
  );
}

/* Scroll reveal — same IntersectionObserver pattern as home */
function ScrollReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("revealed"); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="scroll-reveal">{children}</div>;
}

export default function ProjectList() {
  const [repos, repoStatus] = useGithubRepos();

  return (
    <div className="pl-wrapper">

      {/* Page header */}
      <div className="pl-header">
        <p className="pl-label">Open source</p>
        <h1 className="pl-title">Projects</h1>
        <p className="pl-subtitle">
          A collection of things I've built, broken, and rebuilt. Each one
          taught me something.
        </p>
      </div>

      {/* Grid */}
      <ScrollReveal>
        <div className="pl-section-header">
          <h2 className="pl-section-title">All repositories</h2>
          <span className="pl-section-line" />
          {repoStatus === "success" && (
            <span className="pl-count">{repos.length}</span>
          )}
        </div>

        {repoStatus === "loading" && (
          <div className="pl-skeleton-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="pl-skeleton-card" />
            ))}
          </div>
        )}

        {repoStatus === "error" && (
          <p className="pl-status-msg">Could not fetch repositories.</p>
        )}

        {repoStatus === "success" && (
          <ul className="pl-grid">
            {repos.map((r, i) => (
              <SpotlightCard key={r.id} delay={i * 0.06} to={`/projects/${r.name}/`}>
                {/* Card top: name + arrow */}
                <div className="pl-card-top">
                  <div className="pl-card-icon">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8z"/>
                    </svg>
                  </div>
                  <svg className="pl-card-arrow" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M6.22 8.72a.75.75 0 001.06 1.06l5.22-5.22v1.69a.75.75 0 001.5 0V3a.75.75 0 00-.75-.75H9.97a.75.75 0 000 1.5h1.69L6.22 8.72zM3.5 3.75a.75.75 0 00-.75.75v8c0 .414.336.75.75.75h8a.75.75 0 00.75-.75V9.5a.75.75 0 00-1.5 0v2.5H4.25V5.25H6.5a.75.75 0 000-1.5H3.5z"/>
                  </svg>
                </div>

                {/* Name */}
                <p className="pl-card-name">{r.name}</p>

                {/* Description */}
                <p className="pl-card-desc">
                  {r.description ?? "No description provided."}
                </p>

                {/* Footer */}
                <div className="pl-card-footer">
                  {r.language && (
                    <span className="pl-card-lang">
                      <span
                        className="pl-lang-dot"
                        style={{ "--lang-color": LANG_COLORS[r.language] ?? "var(--accent)" } as CSSProperties}
                      />
                      {r.language}
                    </span>
                  )}
                  <span className="pl-card-stars">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                    </svg>
                    {r.stargazers_count}
                  </span>
                </div>
              </SpotlightCard>
            ))}
          </ul>
        )}
      </ScrollReveal>
    </div>
  );
}
