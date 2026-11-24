import { useEffect, useRef, useState } from "react";
import "./Cursor.css";

/*
  CustomCursor
  ─────────────
  Two layers:
    • dot   — 6px solid circle, sticks exactly to the pointer (no lag)
    • ring  — 36px hollow circle, lerps toward the pointer each frame

  States (driven by what's under the cursor):
    • default  — dot + ring at normal size
    • hover    — ring grows, blends with element, dot fades
    • click    — ring squishes briefly

  Spark trail:
    On mousemove a tiny canvas particle is spawned at the cursor
    position and fades out over ~600ms.
*/

interface Particle {
  x: number;
  y: number;
  born: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

const SPARK_COLORS = ["#58a6ff", "#a371f7", "#79c0ff", "#d2a8ff"];
const LERP_FACTOR  = 0.12;   /* ring lag — lower = more lag  */
const SPARK_LIFE   = 600;    /* ms until a spark is gone     */
const SPARK_RATE   = 3;      /* px moved before new spark    */

export default function CustomCursor() {
  /* Dot position — set directly on the element, no React state */
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  /* Ring lerp target */
  const target  = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });

  /* Spark canvas */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const lastSpawn = useRef({ x: -999, y: -999 });

  const [hoverState, setHoverState] = useState(false);
  const [clickState, setClickState] = useState(false);

  useEffect(() => {
    /* ── Resize canvas to full viewport ── */
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    /* ── Mouse move: update dot + ring target + maybe spawn spark ── */
    const onMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      target.current = { x, y };

      /* Dot follows immediately */
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }

      /* Spawn a spark if we've moved enough pixels */
      const dx = x - lastSpawn.current.x;
      const dy = y - lastSpawn.current.y;
      if (Math.sqrt(dx * dx + dy * dy) > SPARK_RATE) {
        lastSpawn.current = { x, y };
        spawnSpark(x, y);
      }
    };

    /* ── Hover detection: any link, button, or interactive element ── */
    const HOVER_SEL = "a, button, [data-cursor-hover], .repo-card, .stack-pill, .btn-primary, .btn-secondary";

    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest(HOVER_SEL)) {
        setHoverState(true);
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest(HOVER_SEL)) {
        setHoverState(false);
      }
    };

    /* ── Click burst ── */
    const onDown = () => {
      setClickState(true);
      /* Spawn a small burst of sparks on click */
      const { x, y } = target.current;
      for (let i = 0; i < 8; i++) spawnSpark(x, y, true);
    };
    const onUp = () => setClickState(false);

    document.addEventListener("mousemove",  onMove);
    document.addEventListener("mouseover",  onOver);
    document.addEventListener("mouseout",   onOut);
    document.addEventListener("mousedown",  onDown);
    document.addEventListener("mouseup",    onUp);

    /* ── rAF loop: lerp ring + draw sparks ── */
    let rafId: number;
    const ctx = canvas.getContext("2d");

    const tick = (now: number) => {
      /* Lerp ring toward target */
      current.current.x += (target.current.x - current.current.x) * LERP_FACTOR;
      current.current.y += (target.current.y - current.current.y) * LERP_FACTOR;

      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${current.current.x}px, ${current.current.y}px)`;
      }

      /* Draw sparks */
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.current = particles.current.filter(p => now - p.born < SPARK_LIFE);

        particles.current.forEach(p => {
          const age     = now - p.born;
          const lifeRat = age / SPARK_LIFE;          /* 0 → 1 */
          const alpha   = (1 - lifeRat) * 0.85;
          const radius  = p.size * (1 - lifeRat * 0.5);

          /* Move particle */
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.94;
          p.vy *= 0.94;

          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color
            .replace(")", `, ${alpha})`)
            .replace("rgb", "rgba");
          /* color is already hex — convert alpha differently */
          ctx.globalAlpha = alpha;
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.globalAlpha = 1;
        });
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize",    resize);
      document.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mouseover",  onOver);
      document.removeEventListener("mouseout",   onOut);
      document.removeEventListener("mousedown",  onDown);
      document.removeEventListener("mouseup",    onUp);
    };
  }, []);

  /* ── Spawn one spark particle ── */
  function spawnSpark(x: number, y: number, burst = false) {
    const angle  = Math.random() * Math.PI * 2;
    const speed  = burst
      ? Math.random() * 3 + 1.5
      : Math.random() * 1.2 + 0.3;
    particles.current.push({
      x,
      y,
      born:  performance.now(),
      vx:    Math.cos(angle) * speed,
      vy:    Math.sin(angle) * speed,
      size:  burst ? Math.random() * 3 + 1.5 : Math.random() * 2 + 0.8,
      color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
    });
  }

  return (
    <>
      {/* Full-viewport canvas for spark particles */}
      <canvas ref={canvasRef} className="cursor-canvas" />

      {/* Sharp dot — exact cursor position */}
      <div
        ref={dotRef}
        className={[
          "cursor-dot",
          hoverState ? "cursor-dot--hover" : "",
          clickState ? "cursor-dot--click" : "",
        ].join(" ")}
      />

      {/* Lagging ring */}
      <div
        ref={ringRef}
        className={[
          "cursor-ring",
          hoverState ? "cursor-ring--hover" : "",
          clickState ? "cursor-ring--click" : "",
        ].join(" ")}
      />
    </>
  );
}
