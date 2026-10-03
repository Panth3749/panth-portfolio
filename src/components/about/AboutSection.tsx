import React, { useRef, useEffect, useState } from 'react';
import {
  Brain,
  Code2,
  Compass,
  Smartphone,
  Layers,
  ArrowRight,
  Maximize2,
  Sparkles,
  ArrowLeft,
  ArrowUpRight,
  FileText
} from 'lucide-react';
import { LensReveal } from './LensReveal';
import { personalProfile } from '../../data/portfolioData';
import { subscribeScroll, scrollTo } from '../../utils/smoothScroll';
import './AboutSection.css';

interface AboutSectionProps {
  onOpenProfile?: () => void;
}

interface AboutCardData {
  icon: string;
  title: string;
  description: string;
  footer: string;
  type: string;
  target?: boolean;
}

const cards: AboutCardData[] = [
  {
    icon: "</>",
    title: "Foundations from Scratch",
    description:
      "I believe software engineering starts with fundamental understanding. Instead of relying on third-party frameworks, I build systems from the ground up.",
    footer: "Vanilla JS · Canvas 2D · Collision Math",
    type: "code",
  },
  {
    icon: "◉",
    title: "Applied Mobile & Systems",
    description:
      "Engineered native Android systems in Java with cloud-synced databases and automated pipelines for practical real-world problems.",
    footer: "Native Android · Java · Firebase DB",
    type: "mobile",
  },
  {
    icon: "⦿",
    title: "AI & Neural Architectures",
    description:
      "Exploring modern AI systems, reasoning agents, Gemini technologies, and intelligent pipelines for next-generation machine intelligence.",
    footer: "B.Tech in AI Bound · Gemini Labs · GLSL",
    type: "ai",
    target: true,
  },
];

function Particles() {
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, index) => ({
      id: index,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: `${6 + Math.random() * 8}s`,
      delay: `${Math.random() * 5}s`,
      size: `${2 + Math.random() * 3}px`,
    }))
  );

  return (
    <div className="particles">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="particle"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            animationDuration: particle.duration,
            animationDelay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}

interface AboutCardProps {
  card: AboutCardData;
  index: number;
}

function AboutCard({ card, index }: AboutCardProps) {
  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const cardElement = e.currentTarget;
    const rect = cardElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y / rect.height) - 0.5) * -6;
    const rotateY = ((x / rect.width) - 0.5) * 6;

    cardElement.style.transform = `
      translateY(-12px)
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.015)
    `;
  };

  const handleLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = "";
  };

  return (
    <article
      className={`about-card card-${index + 1}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="card-glow" />

      {/* Icon */}
      <div className="card-icon">{card.icon}</div>

      {card.target && <div className="target-badge">TARGET</div>}

      <h2>{card.title}</h2>

      <p>{card.description}</p>

      <div className="card-footer">
        <span className="footer-dot" />
        {card.footer}
      </div>
    </article>
  );
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const pillars = [
  {
    icon: Brain,
    title: "Artificial Intelligence & LLMs",
    badge: "Primary Ambition",
    desc: "Machine learning, automated reasoning & prompt engineering with Google Gemini Labs.",
    caps: ["Gemini 1.5 API", "Prompt Tuning", "Neural Logic", "Autonomous Agents"],
    accent: "from-sky-400 to-cyan-300 text-slate-950 shadow-md shadow-sky-400/25",
  },
  {
    icon: Code2,
    title: "Game Engineering & Physics",
    badge: "Game Jam Proven",
    desc: "Custom 2D collision mathematics, AABB hitboxes, and enemy AI state machines from scratch.",
    caps: ["Custom 2D Loops", "AABB Hitboxes", "Enemy AI", "Vanilla JS"],
    accent: "from-sky-300 to-cyan-400 text-slate-950 shadow-md shadow-sky-400/25",
  },
  {
    icon: Smartphone,
    title: "Mobile & Full-Stack Systems",
    badge: "Applied Engineering",
    desc: "Native Android applications in Java with real-time Firebase sync and automated push alerts.",
    caps: ["Android SDK (Java)", "Firebase Realtime", "Push Pipelines", "REST APIs"],
    accent: "from-sky-400 to-blue-400 text-slate-950 shadow-md shadow-sky-400/25",
  },
  {
    icon: Sparkles,
    title: "Creative Tech & Shader Lab",
    badge: "GPU Shaders & Math",
    desc: "Hardware-accelerated WebGL / GLSL shaders, procedural noise math, and 120 FPS engines.",
    caps: ["WebGL / GLSL", "Procedural Math", "Interactive UI", "120 FPS Physics"],
    accent: "from-cyan-300 to-sky-400 text-slate-950 shadow-md shadow-sky-400/25",
  }
];

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenProfile }) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const ribbonRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const lightRef = useRef<HTMLDivElement | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const statusTextRef = useRef<HTMLSpanElement>(null);
  const stageCardRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Mouse tracking parallax for background grid, ribbon, and cursor light
  useEffect(() => {
    const section = sectionRef.current;
    const ribbon = ribbonRef.current;
    const grid = gridRef.current;
    const light = lightRef.current;
    if (!section || !ribbon || !grid || !light) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normalizedX = x / rect.width - 0.5;
      const normalizedY = y / rect.height - 0.5;

      light.style.left = `${x}px`;
      light.style.top = `${y}px`;

      ribbon.style.transform = `
        translate3d(
          ${normalizedX * 18}px,
          ${normalizedY * 12}px,
          0
        )
      `;

      grid.style.transform = `
        translate3d(
          ${normalizedX * 6}px,
          ${normalizedY * 6}px,
          0
        )
      `;
    };

    section.addEventListener("mousemove", handleMouseMove);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Passive event-driven scroll progress updates for the pinned lens track
  useEffect(() => {
    let ticking = false;
    let lastP = -1;

    const update = () => {
      const pin = trackRef.current;
      if (!pin) return;

      const rect = pin.getBoundingClientRect();
      const span = pin.offsetHeight - window.innerHeight;
      const p = clamp01(span > 0 ? -rect.top / span : 0);

      if (Math.abs(p - lastP) > 0.001) {
        lastP = p;
        setScrollProgress(p);

        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${(p * 100).toFixed(1)}%`;
        }
        if (progressTextRef.current) {
          progressTextRef.current.textContent = `${Math.round(p * 100)}%`;
        }
        if (statusTextRef.current) {
          if (p < 0.20) {
            statusTextRef.current.textContent = "Scroll to inspect · Continue scrolling to expand";
          } else if (p < 0.60) {
            statusTextRef.current.textContent = `Lens expanding (${Math.round(p * 100)}%) · Scroll to reveal profile`;
          } else {
            statusTextRef.current.textContent = "Architect Profile unveiled · Scroll up to retract ↑";
          }
        }
        if (stageCardRef.current) {
          // Dynamic dimensional scaling during scroll expansion
          if (p < 0.20) {
            stageCardRef.current.style.transform = `scale(1)`;
          } else {
            const exp = Math.min(1, (p - 0.20) / 0.45);
            const easeExp = exp * exp * (3 - 2 * exp);
            const scale = 1.0 + easeExp * 0.07;
            stageCardRef.current.style.transform = `scale(${scale})`;
          }
        }
      }
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
      }
    };

    const unsubscribe = subscribeScroll(onScrollOrResize);
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    
    update();

    return () => {
      unsubscribe();
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  return (
    <div className="relative w-full text-slate-800">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* Part 1: More About Me Storytelling Grid with 3D Ribbon & Mesh */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="about" className="about-section" ref={sectionRef}>
        {/* Background */}
        <div className="about-grid" ref={gridRef} />

        <div className="about-glow about-glow-one" />
        <div className="about-glow about-glow-two" />

        {/* Cursor glow */}
        <div className="about-mouse-light" ref={lightRef} />

        {/* Animated ribbon */}
        <div className="about-ribbon" ref={ribbonRef}>
          <svg viewBox="0 0 1600 900" preserveAspectRatio="none">
            <defs>
              <linearGradient
                id="ribbonGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#006dff" />
                <stop offset="35%" stopColor="#12cfff" />
                <stop offset="65%" stopColor="#4f7cff" />
                <stop offset="100%" stopColor="#2445d8" />
              </linearGradient>

              <filter id="ribbonBlur">
                <feGaussianBlur stdDeviation="12" />
              </filter>
            </defs>

            {/* Soft ribbon shadow */}
            <path
              className="ribbon-path ribbon-soft"
              d="
                M -150 720
                C 220 420,
                  430 850,
                  700 590
                S 1050 180,
                  1350 390
                S 1580 560,
                  1800 180
              "
            />

            {/* Main ribbon */}
            <path
              className="ribbon-path ribbon-main"
              d="
                M -150 720
                C 220 420,
                  430 850,
                  700 590
                S 1050 180,
                  1350 390
                S 1580 560,
                  1800 180
              "
            />

            {/* Ribbon highlight */}
            <path
              className="ribbon-path ribbon-highlight"
              d="
                M -150 720
                C 220 420,
                  430 850,
                  700 590
                S 1050 180,
                  1350 390
                S 1580 560,
                  1800 180
              "
            />
          </svg>
        </div>

        {/* Particles */}
        <Particles />

        {/* Main content */}
        <div className="about-container">
          {/* Label */}
          <div className="about-label">
            <span className="label-dot" />
            <span>01 // ABOUT PANTH MISTRY · THE STORY &amp; CRAFT</span>
          </div>

          {/* Header */}
          <div className="about-header">
            <div className="about-heading-wrapper">
              <h1 className="about-heading">
                Driven by Logic,
                <span>Engineered with Rigor.</span>
              </h1>

              <p className="about-description">
                Turning ideas into real-world solutions through code, systems,
                and intelligent design.
              </p>
            </div>

            <button
              type="button"
              className="profile-button"
              onClick={onOpenProfile}
            >
              <span>View Full Architect Profile</span>
              <span className="button-arrow">&rarr;</span>
            </button>
          </div>

          {/* Cards */}
          <div className="about-cards">
            {cards.map((card, index) => (
              <AboutCard key={card.title} card={card} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* Part 2: Pinned Sticky Lens Stage ("stop website when scroll") */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div ref={trackRef} className="relative w-full h-[360vh]">
        {/* Sticky Pinned 100vh Viewport */}
        <section className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between select-none bg-transparent">
          {/* Top Progress Line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 z-40 pointer-events-none">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 transition-[width] duration-75 ease-out"
              style={{ width: "0%" }}
            />
          </div>

          {/* Header Controls */}
          <header className="relative z-30 w-full px-4 sm:px-8 lg:px-12 pt-4 sm:pt-6 flex items-center justify-between pointer-events-none">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-sky-300 text-blue-950 text-xs font-mono uppercase tracking-widest backdrop-blur-md shadow-xs pointer-events-auto">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <span className="font-bold">01 // OPTICAL REFRACTION LENS · PINNED STAGE</span>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              {scrollProgress > 0.40 ? (
                <button
                  onClick={() => scrollTo('#about', -60)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/90 hover:bg-white text-blue-900 border border-sky-300 font-mono text-xs font-semibold shadow-md shadow-blue-500/10 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-sky-600" />
                  <span>Retract to Page 1 ↑</span>
                </button>
              ) : onOpenProfile ? (
                <button
                  onClick={onOpenProfile}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-xs font-bold shadow-md shadow-sky-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Expand to Full Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : null}
            </div>
          </header>

          {/* Central Pinned Lens Stage Container */}
          <div className="relative flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-center">
            <div
              ref={stageCardRef}
              className="relative w-full h-[62vh] sm:h-[72vh] max-h-[660px] rounded-3xl overflow-hidden shadow-2xl shadow-sky-500/15 border-2 border-sky-300/80 transition-transform duration-75 ease-out will-change-transform bg-gradient-to-br from-sky-100/90 via-sky-50/90 to-blue-100/90"
            >
              <LensReveal
                onEnterFullProfile={onOpenProfile}
                scrollProgress={scrollProgress}
              />

              {/* Unveiled Architect Profile Overlay (fades in as lens expands to 100%) */}
              {scrollProgress > 0.32 && (
                <div
                  className="absolute inset-0 z-30 overflow-y-auto px-4 sm:px-8 py-5 sm:py-7 flex flex-col justify-between text-slate-800 transition-opacity duration-200"
                  style={{
                    opacity: Math.min(1, Math.max(0, (scrollProgress - 0.32) / 0.24)),
                    pointerEvents: scrollProgress > 0.55 ? "auto" : "none",
                    background: `radial-gradient(ellipse at 50% 15%, rgba(240, 249, 255, ${0.96 + Math.min(0.04, scrollProgress * 0.04)}), rgba(224, 242, 254, ${0.94 + Math.min(0.04, scrollProgress * 0.04)}), rgba(186, 230, 253, ${0.90 + Math.min(0.05, scrollProgress * 0.05)}))`,
                  }}
                >
                  {/* Top Header inside Expanded Dossier */}
                  <div className="flex items-center justify-between border-b border-sky-300/60 pb-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-sky-300 text-[11px] font-mono font-bold text-blue-950 backdrop-blur-md shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                      <span>01 // ARCHITECT PROFILE &amp; ASPIRATIONS · EXPANDED VIEW</span>
                    </div>

                    <button
                      onClick={() => scrollTo('#about', -60)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white border border-sky-300 text-[11px] font-mono text-blue-900 font-semibold transition-all cursor-pointer shadow-xs hover:scale-105 active:scale-95"
                      title="Scroll back to surface"
                    >
                      <ArrowLeft className="w-3 h-3 text-sky-600" />
                      <span>Retract to Surface ↑</span>
                    </button>
                  </div>

                  {/* Title & Vision */}
                  <div className="my-3 max-w-3xl">
                    <h3 className="font-display font-black text-2xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
                      Engineering the Future with{" "}
                      <span className="bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-500 bg-clip-text text-transparent">
                        Code &amp; Intelligence
                      </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 font-normal mt-1 leading-relaxed">
                      Computer Science &amp; Engineering scholar at <strong className="text-blue-700 font-bold">ITM SLS Baroda University</strong> · Dedicated to advancing into a B.Tech in Artificial Intelligence.
                    </p>
                  </div>

                  {/* 4 Pillars Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-2">
                    {pillars.map((p, idx) => {
                      const Icon = p.icon;
                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-white/95 border border-sky-200/90 hover:border-sky-400 transition-all backdrop-blur-xl flex flex-col justify-between shadow-md shadow-sky-950/5 hover:shadow-xl hover:shadow-sky-500/15 group"
                        >
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${p.accent} flex items-center justify-center shadow-md shadow-sky-400/25`}>
                                <Icon className="w-4 h-4 text-slate-950" />
                              </div>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-100 text-blue-800 border border-sky-300/80 font-bold">
                                {p.badge}
                              </span>
                            </div>

                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-700 transition-colors">
                              {p.title}
                            </h4>

                            <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                              {p.desc}
                            </p>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-sky-100 flex flex-wrap gap-1">
                            {p.caps.map((c, ci) => (
                              <span key={ci} className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-sky-50 text-blue-900 border border-sky-200 font-medium">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Controls */}
                  <div className="pt-3 border-t border-sky-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex items-center gap-2 text-blue-900 font-semibold text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
                      <span>Scroll up anytime to retract back to page 1 ↑</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={personalProfile.resumeUrl}
                        download={personalProfile.resumeFilename}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-blue-900 font-mono text-xs font-semibold border border-sky-300 shadow-xs transition-all hover:scale-105 active:scale-95"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>Resume (PDF)</span>
                      </a>

                      {onOpenProfile && (
                        <button
                          onClick={onOpenProfile}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-xs font-bold shadow-md shadow-sky-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Explore Full Dossier</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Footer Info */}
          <footer className="relative z-30 w-full px-4 sm:px-8 lg:px-12 pb-4 sm:pb-6 flex items-center justify-between text-xs font-mono text-slate-600 pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto bg-white/90 px-3.5 py-1.5 rounded-full border border-sky-200 backdrop-blur-md shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span ref={statusTextRef} className="font-semibold uppercase tracking-wider hidden sm:inline text-slate-700">
                Scroll to inspect · Continue scrolling to expand
              </span>
              <span className="text-slate-400 hidden sm:inline">·</span>
              <span ref={progressTextRef} className="text-blue-700 font-bold">
                0%
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-600 pointer-events-auto bg-white/90 px-3.5 py-1.5 rounded-full border border-sky-200 backdrop-blur-md shadow-xs">
              <span>{scrollProgress < 0.35 ? "Scroll expansion enabled ↓" : "Scroll up to retract ↑"}</span>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
};

export default AboutSection;
