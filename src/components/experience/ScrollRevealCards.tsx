"use client";

import React, { CSSProperties, useEffect, useRef, useState } from "react";
import {
  GraduationCap,
  Trophy,
  Brain,
  Rocket,
  CheckCircle2,
  Calendar,
  MapPin,
  ArrowUpRight,
  Sparkles,
  Layers,
  ChevronDown
} from "lucide-react";
import { scrollTo } from "../../utils/smoothScroll";

type MilestoneCard = {
  number: string;
  kicker: string;
  title: string;
  subtitle: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  tags: string[];
  bg: string;
  text: string;
  muted: string;
  numberColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
};

type CardStyle = CSSProperties & {
  "--card-bg": string;
  "--card-text": string;
  "--card-muted": string;
  "--card-number": string;
  "--card-border": string;
};

// 4 Flagship Milestones in White & Blue Theme (Deep Royal Navy, Electric Azure, Luminous White, Vibrant Sapphire)
const MILESTONE_CARDS: MilestoneCard[] = [
  {
    number: "01",
    kicker: "01 — Academic Foundation · CSE Scholar",
    title: "Diploma in Computer Science",
    subtitle: "ITM SLS Baroda University, Gujarat, India",
    period: "2024 – 2027 (Expected)",
    location: "Vadodara, Gujarat",
    description:
      "Rigorous foundations in Data Structures & Algorithms, Object-Oriented Programming (C++/Java), Relational DBMS, and Operating Systems. Active research and pre-engineering preparation for B.Tech in Artificial Intelligence.",
    highlights: [
      "Core coursework: Advanced DSA, OOPs, Relational DBMS, OS & AI Fundamentals",
      "Consistently building high-performance 2D game loops, web apps, and data systems",
      "Pathway to advanced Artificial Intelligence specialization"
    ],
    tags: ["Data Structures", "Algorithms", "C++", "Java", "DBMS", "Operating Systems"],
    bg: "linear-gradient(135deg, #091322 0%, #0F2347 48%, #1E3A8A 100%)", // Deep Royal Navy Blue
    text: "#FFFFFF",
    muted: "rgba(224, 242, 254, 0.88)",
    numberColor: "rgba(186, 230, 253, 0.16)",
    borderColor: "rgba(125, 211, 252, 0.40)",
    icon: GraduationCap,
  },
  {
    number: "02",
    kicker: "02 — Hackathons & Competitions · Rapid Dev",
    title: "Game Jam & Designathon 2026",
    subtitle: "Live Game Jams & Figma UI/UX App Design Competition",
    period: "2026",
    location: "Vadodara, India",
    description:
      "Engineered custom 2D collision physics, AABB hitbox mathematics, and dynamic enemy AI state machines from scratch in Vanilla JavaScript under strict competition countdown constraints. Competed in Figma UI/UX app design creating mobile concepts.",
    highlights: [
      "Custom 2D HTML5 Canvas physics engine with responsive hitboxes & gravity",
      "Patrol and chase enemy AI logic with proximity-based state transitions",
      "Figma UI/UX Mobile App Designathon 2026 verified recognition"
    ],
    tags: ["Vanilla JS Physics", "Canvas 2D", "Enemy AI Logic", "Figma UI/UX", "Game Jam"],
    bg: "linear-gradient(135deg, #0284C7 0%, #0369A1 50%, #1D4ED8 100%)", // Electric Azure & Sky Blue
    text: "#FFFFFF",
    muted: "rgba(240, 249, 255, 0.92)",
    numberColor: "rgba(255, 255, 255, 0.22)",
    borderColor: "rgba(255, 255, 255, 0.45)",
    icon: Trophy,
  },
  {
    number: "03",
    kicker: "03 — Generative AI Labs · LLM Engineering",
    title: "Gemini Labs & Game Jam 2025",
    subtitle: "Google Gemini Labs Participant & Castle Warrior Combat Engine",
    period: "2025",
    location: "India",
    description:
      "Engineered 'Castle Warrior' browser combat game featuring multi-stage mission progression. Actively engaged in Google Gemini Labs exploring prompt engineering, multi-turn reasoning workflows, and LLM-powered autonomous architectures.",
    highlights: [
      "Developed Castle Warrior combat game presented live during college Game Jam",
      "Explored Google Gemini 1.5 prompt tuning, automated reasoning, and neural agents",
      "Completed LLM Learning certification and practical AI challenges"
    ],
    tags: ["Google Gemini 1.5", "Prompt Engineering", "LLM Reasoning", "Combat Engine", "Game State"],
    bg: "linear-gradient(135deg, #FFFFFF 0%, #F0F9FF 50%, #E0F2FE 100%)", // Luminous White & Ice Blue Glass
    text: "#0B192C", // Ultra-Deep Navy Blue text
    muted: "rgba(15, 23, 42, 0.78)",
    numberColor: "rgba(2, 132, 199, 0.18)",
    borderColor: "rgba(56, 189, 248, 0.60)",
    icon: Brain,
  },
  {
    number: "04",
    kicker: "04 — Production Systems & Future Ambition",
    title: "Smart Systems & AI Horizon",
    subtitle: "Mobile App Architect · B.Tech AI Trajectory",
    period: "2024 – 2026",
    location: "India",
    description:
      "Architected Smart Vehicle Service Reminder native Android application with real-time Firebase cloud synchronization and push notification pipelines. Certified in Data Analytics (2026) and driving toward B.Tech in Artificial Intelligence.",
    highlights: [
      "Native Android application in Java with clean XML Material Design layouts",
      "Automated mileage & interval calculation with Firebase Cloud Messaging alerts",
      "Data Analytics Certified (2026) with Python statistical modeling",
      "Focused on B.Tech in Artificial Intelligence for next-generation intelligent agents"
    ],
    tags: ["Android SDK (Java)", "Firebase Cloud", "Push Notifications", "Data Analytics 2026", "B.Tech in AI"],
    bg: "linear-gradient(135deg, #1D4ED8 0%, #2563EB 50%, #0284C7 100%)", // Vibrant Royal Blue & Sapphire
    text: "#FFFFFF",
    muted: "rgba(255, 255, 255, 0.90)",
    numberColor: "rgba(255, 255, 255, 0.25)",
    borderColor: "rgba(186, 230, 253, 0.45)",
    icon: Rocket,
  },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const lerp = (start: number, end: number, amount: number) =>
  start + (end - start) * amount;

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

interface ScrollRevealCardsProps {
  onToggleTimeline?: () => void;
}

export const ScrollRevealCards: React.FC<ScrollRevealCardsProps> = ({ onToggleTimeline }) => {
  const sceneRef = useRef<HTMLElement | null>(null);
  const heroTitleRef = useRef<HTMLHeadingElement | null>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const progressTextRef = useRef<HTMLSpanElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);

  const currentProgress = useRef(0);
  const targetProgress = useRef(0);
  const frameRef = useRef<number | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  useEffect(() => {
    let isIntersecting = false;

    const updateTargetProgress = () => {
      const scene = sceneRef.current;
      if (!scene) return;

      const rect = scene.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;

      targetProgress.current = clamp(
        -rect.top / Math.max(scrollable, 1),
        0,
        1
      );
    };

    const render = () => {
      // Silky smooth exponential lerp
      currentProgress.current = lerp(
        currentProgress.current,
        targetProgress.current,
        0.085
      );

      const progress = currentProgress.current;

      // Update progress bar
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${(progress * 100).toFixed(1)}%`;
      }
      if (progressTextRef.current) {
        progressTextRef.current.textContent = `${Math.round(progress * 100)}%`;
      }

      // Hero content lifts away
      if (heroTitleRef.current) {
        const heroLift = clamp(progress / 0.24, 0, 1);
        heroTitleRef.current.style.transform = `translate3d(0, ${lerp(0, -110, heroLift)}px, 0)`;
        heroTitleRef.current.style.opacity = `${lerp(1, 0.4, heroLift)}`;
      }

      if (heroSubtitleRef.current) {
        const subtitleFade = clamp(progress / 0.16, 0, 1);
        heroSubtitleRef.current.style.transform = `translate3d(0, ${lerp(0, -45, subtitleFade)}px, 0)`;
        heroSubtitleRef.current.style.opacity = `${lerp(1, 0, subtitleFade)}`;
      }

      let currentTopCard = 0;

      // Card Peel & Rise Sequence
      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        const start = 0.08 + index * 0.215;
        const end = start + 0.22;

        const raw = clamp((progress - start) / (end - start), 0, 1);
        const eased = easeOutCubic(raw);
        const settle = easeInOutCubic(raw);

        if (raw > 0.5) {
          currentTopCard = index;
        }

        const y = lerp(112, 0, eased);
        const x = lerp(10, 0, eased);
        const rotate = lerp(-7.5, 0, settle);
        const scale = lerp(1.05, 1, eased);

        const opacity = raw <= 0 ? 0 : lerp(0.4, 1, eased);
        const blur = lerp(3, 0, eased);

        card.style.transform = `translate3d(${x}vw, ${y}vh, 0) rotate(${rotate}deg) scale(${scale})`;
        card.style.opacity = `${opacity}`;
        card.style.filter = `blur(${blur}px)`;
        card.style.zIndex = `${20 + index}`;
        card.style.pointerEvents = raw >= 0.85 ? "auto" : "none";
      });

      setActiveCardIndex(currentTopCard);

      frameRef.current = requestAnimationFrame(render);
    };

    updateTargetProgress();

    window.addEventListener("scroll", updateTargetProgress, { passive: true });
    window.addEventListener("resize", updateTargetProgress);

    const scene = sceneRef.current;
    let observer: IntersectionObserver | null = null;
    if (scene) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting && !frameRef.current) {
            frameRef.current = requestAnimationFrame(render);
          }
        },
        { rootMargin: "150px" }
      );
      observer.observe(scene);
    }

    frameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("scroll", updateTargetProgress);
      window.removeEventListener("resize", updateTargetProgress);
      if (observer) observer.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const jumpToCard = (cardIndex: number) => {
    const scene = sceneRef.current;
    if (!scene) return;
    const rect = scene.getBoundingClientRect();
    const currentScroll = window.scrollY;
    const trackTop = currentScroll + rect.top;
    const scrollable = scene.offsetHeight - window.innerHeight;
    const cardStart = 0.08 + cardIndex * 0.215;
    const targetScroll = trackTop + scrollable * (cardStart + 0.16);
    scrollTo(targetScroll);
  };

  return (
    <div className="relative w-full text-white font-sans select-none">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* Tall Scroll Track (560vh)                                     */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section ref={sceneRef} className="relative w-full h-[560vh]">
        {/* ──────────────────────────────────────────────────────────── */}
        {/* Pinned 100vh Sticky Stage                                     */}
        {/* ──────────────────────────────────────────────────────────── */}
        <div className="sticky top-0 w-full h-screen overflow-hidden bg-gradient-to-br from-[#070F1E] via-[#0D1F3C] to-[#132E5E]">
          {/* Subtle Ambient Blueprint Dots */}
          <div
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(rgba(56, 189, 248, 0.3) 1.2px, transparent 1.2px)",
              backgroundSize: "36px 36px",
            }}
          />

          {/* Ambient Sky Blue & Royal Blue Glow Orbs */}
          <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Progress Line */}
          <div className="absolute top-0 left-0 right-0 h-1 z-40 bg-sky-950/40">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-sky-300 transition-[width] duration-75 ease-out"
              style={{ width: "0%" }}
            />
          </div>

          {/* Chrome Top Control Bar */}
          <header className="absolute top-0 left-0 right-0 z-30 px-4 sm:px-8 lg:px-12 pt-4 sm:pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-none">
            <div className="flex items-center gap-3 pointer-events-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-sky-400/40 text-sky-200 text-xs font-mono uppercase tracking-widest backdrop-blur-md shadow-sm">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                <span className="font-bold">04 // ACADEMIC &amp; COMPETITIVE ODYSSEY</span>
              </div>

              {/* Progress counter */}
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-950/60 border border-sky-800/80 text-sky-300 text-xs font-mono backdrop-blur-md">
                <span>Progress:</span>
                <span ref={progressTextRef} className="font-bold text-white">0%</span>
              </div>
            </div>

            {/* Quick Card Jump Navigation & Timeline Switcher */}
            <div className="flex items-center gap-2 pointer-events-auto">
              <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-slate-900/70 border border-sky-500/30 backdrop-blur-md">
                {MILESTONE_CARDS.map((c, i) => (
                  <button
                    key={c.number}
                    onClick={() => jumpToCard(i)}
                    className={`px-3 py-1 rounded-full text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                      activeCardIndex === i
                        ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30 scale-105"
                        : "text-slate-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span>{c.number}</span>
                  </button>
                ))}
              </div>

              {onToggleTimeline && (
                <button
                  onClick={onToggleTimeline}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-sky-300/40 text-white text-xs font-mono font-medium backdrop-blur-md transition-all cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-sky-300" />
                  <span>Timeline List</span>
                </button>
              )}
            </div>
          </header>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* Base Hero Content (Lifts Away as scroll progresses)          */}
          {/* ──────────────────────────────────────────────────────────── */}
          <div className="absolute inset-0 z-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16 pointer-events-none">
            <div className="my-auto max-w-5xl space-y-4 pt-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 text-xs font-mono uppercase tracking-widest backdrop-blur-md">
                <Sparkles className="w-3 h-3 text-sky-300 animate-spin" style={{ animationDuration: "6s" }} />
                <span>Scroll-Driven Academic Deck</span>
              </div>

              <h1
                ref={heroTitleRef}
                className="font-display font-black text-5xl sm:text-7xl lg:text-[8rem] text-white tracking-tight leading-[0.88] uppercase drop-shadow-md will-change-transform"
              >
                ENGINEER
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-400 to-indigo-300">
                  WITHOUT
                </span>
                <br />
                LIMITS
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4">
              <p
                ref={heroSubtitleRef}
                className="max-w-2xl text-sm sm:text-base lg:text-lg text-sky-100/90 font-normal leading-relaxed will-change-transform"
              >
                Scroll down to peel through engineering foundations at ITM SLS Baroda University,
                high-intensity Game Jams, Google Gemini Labs, and autonomous AI architectures.
              </p>

              <div className="inline-flex items-center gap-2 text-xs font-mono text-sky-300 animate-bounce">
                <span>Scroll to reveal cards</span>
                <ChevronDown className="w-4 h-4 text-sky-400" />
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* Layer of 4 Revealing Cards                                   */}
          {/* ──────────────────────────────────────────────────────────── */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {MILESTONE_CARDS.map((card, index) => {
              const Icon = card.icon;
              const style: CardStyle = {
                "--card-bg": card.bg,
                "--card-text": card.text,
                "--card-muted": card.muted,
                "--card-number": card.numberColor,
                "--card-border": card.borderColor,
              };

              const isLightCard = card.number === "03"; // Luminous white card

              return (
                <article
                  key={card.number}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className="absolute inset-0 w-full h-screen overflow-hidden select-none will-change-transform"
                  style={{
                    ...style,
                    background: card.bg,
                    color: card.text,
                    transformOrigin: "14% 0%",
                  }}
                >
                  {/* Subtle Texture & Sheen */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-40"
                    style={{
                      background: `
                        radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.18), transparent 34%),
                        radial-gradient(circle at 88% 78%, rgba(255, 255, 255, 0.10), transparent 38%)
                      `,
                    }}
                  />

                  {/* Gradient Overlay for Depth */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: isLightCard
                        ? "linear-gradient(180deg, rgba(255,255,255,0.8) 0%, transparent 20%, transparent 80%, rgba(224,242,254,0.4) 100%)"
                        : "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 20%, transparent 70%, rgba(0,0,0,0.3) 100%)",
                    }}
                  />

                  {/* Card Border Rim */}
                  <div
                    className="absolute inset-3 sm:inset-6 rounded-3xl sm:rounded-[2.5rem] border pointer-events-none"
                    style={{ borderColor: card.borderColor }}
                  />

                  {/* Card Inner Content */}
                  <div className="relative z-10 w-full h-full p-6 sm:p-12 lg:p-16 flex flex-col justify-between">
                    {/* Top Row: Kicker & Giant Number */}
                    <div className="flex items-start justify-between gap-4 pt-12 sm:pt-8">
                      <div className="space-y-1.5">
                        <div
                          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-md shadow-xs border"
                          style={{
                            background: isLightCard ? "rgba(14, 165, 233, 0.12)" : "rgba(255, 255, 255, 0.18)",
                            color: isLightCard ? "#0284C7" : "#FFFFFF",
                            borderColor: isLightCard ? "rgba(14, 165, 233, 0.3)" : "rgba(255, 255, 255, 0.3)",
                          }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{card.kicker}</span>
                        </div>

                        <div
                          className="text-xs sm:text-sm font-mono font-medium flex flex-wrap items-center gap-2 pt-1"
                          style={{ color: card.muted }}
                        >
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{card.period}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{card.location}</span>
                          </span>
                        </div>
                      </div>

                      {/* Giant Card Watermark Number */}
                      <div
                        className="font-display font-black text-6xl sm:text-8xl lg:text-[9.5rem] leading-none tracking-tight select-none"
                        style={{ color: card.numberColor }}
                      >
                        {card.number}
                      </div>
                    </div>

                    {/* Middle Section: Giant Display Title & Subtitle */}
                    <div className="my-auto max-w-4xl space-y-3">
                      <h2 className="font-display font-black text-3xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05] uppercase">
                        {card.title}
                      </h2>

                      <p
                        className="text-base sm:text-xl font-semibold"
                        style={{ color: isLightCard ? "#0369A1" : "#7DD3FC" }}
                      >
                        {card.subtitle}
                      </p>

                      <p
                        className="text-xs sm:text-sm lg:text-base leading-relaxed max-w-3xl pt-1"
                        style={{ color: card.muted }}
                      >
                        {card.description}
                      </p>
                    </div>

                    {/* Bottom Section: Highlights & Tech Pills */}
                    <div className="space-y-4 pt-2 border-t" style={{ borderColor: isLightCard ? "rgba(15, 23, 42, 0.1)" : "rgba(255, 255, 255, 0.15)" }}>
                      {/* Highlights */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-4xl">
                        {card.highlights.map((h, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-xs sm:text-sm font-medium"
                            style={{ color: isLightCard ? "#1E293B" : "#F0F9FF" }}
                          >
                            <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>

                      {/* Tech Stack Badge Pills */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1">
                        {card.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold border backdrop-blur-md"
                            style={{
                              background: isLightCard ? "rgba(14, 165, 233, 0.1)" : "rgba(255, 255, 255, 0.16)",
                              color: isLightCard ? "#0369A1" : "#FFFFFF",
                              borderColor: isLightCard ? "rgba(14, 165, 233, 0.25)" : "rgba(255, 255, 255, 0.25)",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollRevealCards;
