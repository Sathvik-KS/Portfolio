import "./About.css";

/* Skills are grouped by category.
   Add / remove / rename anything here — the UI adapts automatically. */
const SKILLS: { category: string; items: string[] }[] = [
  {
    category: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "C", "SQL"],
  },
  {
    category: "Backend",
    items: ["Django", "Django REST Framework", "FastAPI", "Node.js"],
  },
  {
    category: "Frontend",
    items: ["React", "HTML", "CSS"],
  },
  {
    category: "Tools & Infra",
    items: ["Git", "PostgreSQL", "Docker", "Linux", "REST APIs"],
  },
  {
    category: "Interests",
    items: ["Ethical Hacking", "DSA", "System Design", "Open Source"],
  },
];

/* Timeline items — most recent first */
const TIMELINE: { year: string; title: string; detail: string }[] = [
  {
    year: "Now",
    title: "Building in public",
    detail:
      "Shipping personal projects, contributing to open source, and deepening my backend knowledge one pull request at a time.",
  },
  {
    year: "2024",
    title: "Full-stack learning sprint",
    detail:
      "Went all-in on a structured self-study plan — React, Django, TypeScript, PostgreSQL, Docker. Built several projects end-to-end.",
  },
  {
    year: "2023",
    title: "Went deeper on Python",
    detail:
      "Moved past scripting and into real software: REST APIs, database design, authentication, and automated testing.",
  },
  {
    year: "2022",
    title: "Wrote my first line of code",
    detail:
      "Started with Python. Got hooked immediately — the feedback loop of writing something and watching it run never got old.",
  },
];

export default function About() {
  return (
    <div className="about-wrapper">

      {/* ── HEADER ───────────────────────────────────── */}
      <section className="about-header">
        <p className="about-label">About me</p>
        <h1 className="about-title">
          Developer by choice,<br />
          <span className="about-title-accent">backend by instinct</span>
        </h1>
      </section>

      {/* ── BIO ──────────────────────────────────────── */}
      <section className="about-bio-section">
        <div className="about-bio-text">
          <p>
            I'm Sathvik, a CS student who got into programming because Python
            made it feel less like learning syntax and more like teaching a
            computer to think. That feeling stuck.
          </p>
          <p>
            My natural home is the backend — designing APIs, thinking about
            data flow, making things fast and reliable. I find the invisible
            work satisfying: a well-structured endpoint, a clean database
            schema, a function that does exactly one thing and does it well.
          </p>
          <p>
            Lately I've been filling in the full-stack picture. React and
            TypeScript on the frontend, Django and PostgreSQL underneath, Docker
            tying it together. I'm also genuinely interested in ethical hacking
            — understanding how systems break is the best way to understand how
            they work.
          </p>
          <p>
            I'm currently looking for opportunities where I can contribute to
            real products, work alongside people who care about the craft, and
            keep learning at a high pace. If that sounds like your team,{" "}
            <a href="mailto:your@email.com" className="about-link">
              let's talk
            </a>
            .
          </p>
        </div>

        {/* Quick-facts card */}
        <div className="about-facts">
          <div className="fact-item">
            <span className="fact-icon">🎓</span>
            <div>
              <p className="fact-label">Currently</p>
              <p className="fact-value">CS Student</p>
            </div>
          </div>
          <div className="fact-item">
            <span className="fact-icon">🏠</span>
            <div>
              <p className="fact-label">Based in</p>
              <p className="fact-value">India</p>
            </div>
          </div>
          <div className="fact-item">
            <span className="fact-icon">💼</span>
            <div>
              <p className="fact-label">Looking for</p>
              <p className="fact-value">Internships / Entry roles</p>
            </div>
          </div>
          <div className="fact-item">
            <span className="fact-icon">⚡</span>
            <div>
              <p className="fact-label">Strength</p>
              <p className="fact-value">Backend & API design</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ───────────────────────────────────── */}
      <section className="about-skills-section">
        <div className="section-header">
          <h2 className="section-title">Skills</h2>
          <span className="section-line" />
        </div>

        <div className="skills-grid">
          {SKILLS.map(group => (
            <div key={group.category} className="skill-group">
              <p className="skill-category">{group.category}</p>
              <div className="skill-pills">
                {group.items.map(item => (
                  <span key={item} className="skill-pill">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TIMELINE ─────────────────────────────────── */}
      <section className="about-timeline-section">
        <div className="section-header">
          <h2 className="section-title">Journey</h2>
          <span className="section-line" />
        </div>

        <div className="timeline">
          {TIMELINE.map((item, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-left">
                <span className="timeline-year">{item.year}</span>
                <div className="timeline-dot" />
              </div>
              <div className="timeline-content">
                <p className="timeline-title">{item.title}</p>
                <p className="timeline-detail">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
