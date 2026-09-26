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

interface AboutSectionProps {
  onOpenProfile?: () => void;
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
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const statusTextRef = useRef<HTMLSpanElement>(null);
  const stageCardRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

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
      {/* Part 1: More About Me Storytelling Grid                      */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="about" className="pt-20 sm:pt-28 pb-12 sm:pb-16 relative overflow-hidden">
        {/* Ambient Blue & White Gradient Light Orbs & Grid Mesh */}
        <div className="absolute top-0 right-1/4 w-[650px] h-[650px] bg-gradient-to-br from-blue-400/20 via-sky-300/25 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/15 via-sky-400/20 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Blueprint Dot Matrix Pattern */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(37, 99, 235, 0.18) 1.2px, transparent 1.2px)",
            backgroundSize: "32px 32px",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 200px)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 200px)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 sm:space-y-14">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-sky-200/70 pb-8">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-sky-300 text-blue-950 text-xs font-mono uppercase tracking-widest backdrop-blur-md shadow-xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span className="font-bold">01 // ABOUT PANTH MISTRY · THE STORY &amp; CRAFT</span>
              </div>

              <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.08]">
                Driven by Logic,{" "}
                <span className="bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
                  Engineered with Rigor.
                </span>
              </h2>
            </div>

            {onOpenProfile && (
              <button
                onClick={onOpenProfile}
                className="self-start lg:self-end inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-semibold shadow-md shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>View Full Architect Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Storytelling Narrative Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Origins & Foundations */}
            <div className="p-7 rounded-3xl bg-white/90 border border-sky-200/80 shadow-lg shadow-blue-950/5 backdrop-blur-xl flex flex-col justify-between hover:shadow-xl hover:border-sky-300 transition-all">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
                  <Code2 className="w-5 h-5" />
                </div>

                <h3 className="font-display font-bold text-xl text-slate-900">
                  Foundations from Scratch
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  I believe software engineering starts with fundamental understanding. Instead of relying on third-party frameworks, I built 2D game loops with custom AABB collision mathematics and enemy AI state machines from scratch in Vanilla JavaScript.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-sky-100 flex items-center gap-2 text-xs font-mono text-blue-700 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>Vanilla JS &bull; Canvas 2D &bull; Collision Math</span>
              </div>
            </div>

            {/* Card 2: Systems & Applied Production */}
            <div className="p-7 rounded-3xl bg-white/90 border border-sky-200/80 shadow-lg shadow-blue-950/5 backdrop-blur-xl flex flex-col justify-between hover:shadow-xl hover:border-sky-300 transition-all">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white flex items-center justify-center shadow-md shadow-sky-500/25">
                  <Smartphone className="w-5 h-5" />
                </div>

                <h3 className="font-display font-bold text-xl text-slate-900">
                  Applied Mobile &amp; Systems
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Engineered native Android systems in Java and cloud-synced databases with Firebase. Designed automated push pipelines and vehicle service maintenance logs to solve tangible, real-world utility problems with zero bloat.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-sky-100 flex items-center gap-2 text-xs font-mono text-blue-700 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                <span>Native Android &bull; Java &bull; Firebase DB</span>
              </div>
            </div>

            {/* Card 3: The Next Horizon (AI & Shaders) */}
            <div className="p-7 rounded-3xl bg-gradient-to-br from-white/95 via-sky-50/70 to-blue-50/50 border-2 border-sky-300/80 shadow-xl shadow-blue-500/10 backdrop-blur-xl flex flex-col justify-between hover:shadow-2xl hover:border-sky-400 transition-all">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-600/25">
                  <Brain className="w-5 h-5" />
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-xl text-slate-900">
                    AI &amp; Neural Architectures
                  </h3>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold tracking-wider">
                    Target
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Currently exploring Google Gemini Labs, automated prompt reasoning agents, and WebGL shader pipelines. Preparing for a B.Tech in Artificial Intelligence to build next-generation machine intelligence platforms.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-sky-200/80 flex items-center gap-2 text-xs font-mono text-blue-800 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                <span>B.Tech in AI Bound &bull; Gemini Labs &bull; GLSL</span>
              </div>
            </div>
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
