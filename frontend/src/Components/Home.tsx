import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import type { ReactNode, CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import useGithubRepos from "./useGithubRepos";
import profileImage from "/favicon.svg";
import "./Home.css";

/* ── Language → colour map ───────────────────────────────── */
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

const STACK = ["Python", "TypeScript", "Django", "React", "PostgreSQL", "Docker"];

/* Typewriter cycles through these */
const ROLES = [
  "Backend Engineer",
  "Python Developer",
  "API Architect",
  "Open-source tinkerer",
];

/* ── Particle canvas ─────────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    /* Create particles */
    const COUNT = 80;
    const particles = Array.from({ length: COUNT }, () => ({
      x:   Math.random() * canvas.width,
      y:   Math.random() * canvas.height,
      r:   Math.random() * 1.5 + 0.4,
      dx:  (Math.random() - 0.5) * 0.35,
      dy:  (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* Draw connecting lines between nearby particles */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(88,166,255,${0.07 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      /* Draw each particle */
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(88,166,255,${p.alpha})`;
        ctx.fill();

        /* Move */
        p.x += p.dx;
        p.y += p.dy;

        /* Wrap edges */
        if (p.x < 0)             p.x = canvas.width;
        if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0)             p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
}

/* ── Typewriter hook ─────────────────────────────────────── */
function useTypewriter(words: string[], speed = 80, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx]  = useState(0);
  const [charIdx, setCharIdx]  = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx <= current.length) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIdx));
        setCharIdx(c => c + 1);
      }, speed);
    } else if (!deleting && charIdx > current.length) {
      /* Finished typing — pause, then start deleting */
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx >= 0) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIdx));
        setCharIdx(c => c - 1);
      }, speed / 2);
    } else {
      /* Finished deleting — move to next word, reset char index to 0 */
      setDeleting(false);
      setCharIdx(0);
      setWordIdx(w => (w + 1) % words.length);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

/* ── Spotlight card: mouse-tracking gradient glow ───────── */
function SpotlightCard({ children, delay }: { children: ReactNode; delay: number }) {
  const cardRef = useRef<HTMLLIElement>(null);

  const handleMouseMove = (e: ReactMouseEvent<HTMLLIElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--mx", `-999px`);
    card.style.setProperty("--my", `-999px`);
  };

  return (
    <li
      ref={cardRef}
      className="repo-card"
      style={{ animationDelay: `${delay}s` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </li>
  );
}

/* ── Scroll reveal wrapper ───────────────────────────────── */
function ScrollReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`scroll-reveal ${className}`}>
      {children}
    </div>
  );
}

/* ── Main component ──────────────────────────────────────── */
export default function Home() {
  const [repos, repoStatus] = useGithubRepos();
  const role = useTypewriter(ROLES);

  return (
    <div className="home-wrapper">
      <ParticleCanvas />

      {/* Ambient orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* ── HERO ───────────────────────────────────── */}
      <section className="hero">
        <div className="hero-text">

          <div className="hero-greeting">
            <span className="hero-greeting-dot" />
            Hi, I'm
          </div>

          <h1 className="hero-name">Sathvik</h1>

          {/* Typewriter role */}
          <p className="hero-role">
            {role}
            <span className="cursor">|</span>
          </p>

          <p className="hero-bio">
            Python-first developer who enjoys building clean APIs, scalable
            backends, and the occasional side project that actually ships.
            Currently open to new opportunities.
          </p>

          <div className="hero-cta">
            <Link to="/projects" className="btn-primary">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3H7.5L6.316 1.586A1.75 1.75 0 005.077 1H1.75z"/>
              </svg>
              View Projects
            </Link>

            <Link to="/about" className="btn-secondary">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm0 1a5 5 0 00-5 5h10a5 5 0 00-5-5z"/>
              </svg>
              About me
            </Link>
          </div>

          <div className="hero-stack">
            {STACK.map(tech => (
              <span key={tech} className="stack-pill">{tech}</span>
            ))}
          </div>

        </div>

        {/* Avatar */}
        <div className="hero-avatar-wrap">
          <div className="hero-avatar-ring" />
          <img src={profileImage} alt="Sathvik" className="hero-avatar-img" />
        </div>
      </section>

      {/* ── GITHUB REPOS ───────────────────────────── */}
      <ScrollReveal className="github-section">
        <div className="section-header">
          <h2 className="section-title">GitHub</h2>
          <span className="section-line" />
        </div>

        {repoStatus === "loading" && (
          <div className="skeleton-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        )}

        {repoStatus === "error" && (
          <p className="status-msg">Could not fetch repositories.</p>
        )}

        {repoStatus === "success" && (
          <ul className="repo-grid">
            {repos.map((r, i) => (
              <SpotlightCard key={r.id} delay={i * 0.06}>
                <div className="repo-card-top">
                  <a
                    href={r.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="repo-name"
                  >
                    {r.name}
                  </a>
                  <svg className="repo-external-icon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M6.22 8.72a.75.75 0 001.06 1.06l5.22-5.22v1.69a.75.75 0 001.5 0V3a.75.75 0 00-.75-.75H9.97a.75.75 0 000 1.5h1.69L6.22 8.72zM3.5 3.75a.75.75 0 00-.75.75v8c0 .414.336.75.75.75h8a.75.75 0 00.75-.75V9.5a.75.75 0 00-1.5 0v2.5H4.25V5.25H6.5a.75.75 0 000-1.5H3.5z"/>
                  </svg>
                </div>

                <p className="repo-desc">
                  {r.description ?? "No description provided."}
                </p>

                <div className="repo-card-footer">
                  {r.language && (
                    <span className="repo-lang">
                      <span
                        className="lang-dot"
                        style={{ "--lang-color": LANG_COLORS[r.language] ?? "var(--accent)" } as CSSProperties}
                      />
                      {r.language}
                    </span>
                  )}
                  <span className="repo-stars">
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                    </svg>
                    {r.stargazers_count}
                  </span>
                </div>

                {/* Spotlight overlay — follows cursor via CSS vars */}
                <div className="card-spotlight" />
              </SpotlightCard>
            ))}
          </ul>
        )}
      </ScrollReveal>
    </div>
  );
}
