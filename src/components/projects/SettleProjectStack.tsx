"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Brain,
  Gamepad2,
  Smartphone,
  Sparkles,
  ArrowUpRight,
  RotateCcw,
  Layers,
  Sparkle
} from "lucide-react";
import { projects } from "../../data/portfolioData";
import { Project } from "../../types";
import { ProjectModal } from "./ProjectModal";
import { scrollTo } from "../../utils/smoothScroll";

/* ────────────────────────────────────────────────────────────────────────
   SettleProjectStack — Pinned Scroll-Driven 3D Card Deck for Panth's Projects.
   Zero auto-rotation: purely driven by scroll progress p ∈ [0, 1].
   The sticky stage stays firmly pinned at top: 0 while scrolling the track:
     • [0 .. 0.18]  deck enters view while headline lifts away
     • [0.28 .. 0.48] cover card flips (rotateY 0→180) and Gul stack flips in
     • [0.48 .. 0.54] stack settles into ordered physical tilts
     • [0.54 .. 1.0]  each card dismisses upward one by one with a growing tilt
   Clicking any card at any time elaborates full specs & code in ProjectModal.
   ──────────────────────────────────────────────────────────────────────── */

type StackCard = {
  project: Project;
  title: string;
  kicker: string;
  body: string;
  flipTilt: number;
  dismissTilt: number;
  bg: string;
  fg: string;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const mapRange = (a: number, b: number, x: number) => clamp01((x - a) / (b - a));
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutBack = (t: number) => {
  const c = 1.7;
  const u = t - 1;
  return 1 + (c + 1) * u * u * u + c * u * u;
};

const FLIP_START = 0.28;
const FLIP_END = 0.48;
const DISMISS_START = 0.54;

export const SettleProjectStack: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Map to Panth's flagship projects styled in Blue & White (Sky, Baby, Navy, Royal) palettes
  const geminiProject = projects.find((p) => p.id === "gemini-llm-studio") || projects[4];
  const trollProject = projects.find((p) => p.id === "troll-adventure-game") || projects[1];
  const vehicleProject = projects.find((p) => p.id === "smart-vehicle-reminder") || projects[0];
  const ferrofluidProject = projects.find((p) => p.id === "ferrofluid-webgl") || projects[3];

  const STACK_CARDS: StackCard[] = [
    {
      project: geminiProject,
      title: "Google Gemini AI & LLM Studio",
      kicker: "AI & Neural Logic",
      body: "Generative AI workflows, prompt-engineered pipelines, and multi-agent reasoning modules built with Google Gemini Labs.",
      flipTilt: -10,
      dismissTilt: -52,
      bg: "linear-gradient(145deg, #0A192F 0%, #172554 45%, #1E3A8A 100%)", // Navy Blue & Royal Blue
      fg: "#FFFFFF",
      icon: Brain,
      tags: ["Gemini 1.5", "Prompt Eng", "AI Agents"],
    },
    {
      project: trollProject,
      title: "Troll Adventure (2D Game Engine)",
      kicker: "Custom Vanilla JS Engine",
      body: "Multi-level 2D browser platformer built from scratch in HTML5 Canvas with custom AABB hitbox collision physics and enemy AI.",
      flipTilt: -20,
      dismissTilt: -62,
      bg: "linear-gradient(145deg, #1D4ED8 0%, #2563EB 50%, #0284C7 100%)", // Royal Blue & Electric Azure
      fg: "#FFFFFF",
      icon: Gamepad2,
      tags: ["Vanilla JS", "Canvas 2D", "Hitbox Math"],
    },
    {
      project: vehicleProject,
      title: "Smart Vehicle Service Reminder",
      kicker: "Native Android & Firebase",
      body: "Native Android mobile app with automated mileage schedules, cloud push notifications, and real-time maintenance expense logs.",
      flipTilt: -5,
      dismissTilt: -46,
      bg: "linear-gradient(145deg, #0284C7 0%, #0369A1 50%, #1E3A8A 100%)", // Sky Blue & Deep Azure
      fg: "#FFFFFF",
      icon: Smartphone,
      tags: ["Java Android", "Firebase DB", "Push Alerts"],
    },
    {
      project: ferrofluidProject,
      title: "Kexsio Ferrofluid WebGL Lab",
      kicker: "GPU Shaders & 120 FPS",
      body: "Hardware-accelerated GLSL fluid simulation calculating magnetic spikes, surface tension, and interactive cursor ripple physics.",
      flipTilt: 10,
      dismissTilt: 50,
      bg: "linear-gradient(145deg, #FFFFFF 0%, #E0F2FE 45%, #BAE6FD 100%)", // Baby Blue & Pure White Glass
      fg: "#0A192F",
      icon: Sparkles,
      tags: ["WebGL", "GLSL Shaders", "Physics Math"],
    },
  ];

  const count = STACK_CARDS.length;

  // Direct DOM hardware transform application driven purely by scroll progress p
  const applyTransform = useCallback((p: number) => {
    // 1 — Deck rises in, headline lifts away
    const enter = mapRange(0, 0.18, p);
    const deckY = lerp(46, -6, enter);

    if (headlineRef.current) {
      headlineRef.current.style.transform = `translateY(${lerp(0, -120, enter)}%)`;
      headlineRef.current.style.opacity = `${1 - enter}`;
    }

    // 2 — The 3D Flip (cover turns away 0 -> 180, stack turns in -180 -> 0)
    const flip = easeOutBack(mapRange(FLIP_START, FLIP_END, p));
    if (frontRef.current) {
      frontRef.current.style.transform =
        `translate(-50%,calc(-50% + ${deckY}%)) rotateY(${lerp(0, 180, flip)}deg)`;
    }

    // 3 — Per-card dismiss, reverse order (last revealed leaves first)
    const windowSpan = (1 - DISMISS_START) / count;
    STACK_CARDS.forEach((c, i) => {
      const el = backRefs.current[i];
      if (!el) return;
      const order = count - 1 - i;
      const dStart = DISMISS_START + order * windowSpan;
      const dismiss = smooth(mapRange(dStart, dStart + windowSpan, p));
      const ry = lerp(-180, 0, flip);
      const y = deckY + lerp(0, -240, dismiss);
      const rz = lerp(c.flipTilt * clamp01(flip), c.dismissTilt, dismiss);

      el.style.transform =
        `translate(-50%,calc(-50% + ${y}%)) rotateY(${ry}deg) rotateZ(${rz}deg)`;
      el.style.opacity = `${1 - dismiss * dismiss}`;
    });
  }, [count, STACK_CARDS]);

  // Event-driven scroll progress updates (passive scroll & resize)
  // ZERO continuous idle RAF: completely eliminates main thread layout thrashing
  useEffect(() => {
    let ticking = false;
    let lastP = -1;

    const update = () => {
      const pin = trackRef.current;
      if (!pin) return;

      const rect = pin.getBoundingClientRect();
      const span = pin.offsetHeight - window.innerHeight;
      const p = clamp01(span > 0 ? -rect.top / span : 0);

      if (Math.abs(p - lastP) > 0.0005) {
        lastP = p;
        applyTransform(p);

        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${(p * 100).toFixed(1)}%`;
        }
        if (progressTextRef.current) {
          progressTextRef.current.textContent = `${Math.round(p * 100)}%`;
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

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [applyTransform]);

  // Smooth scroll jumps for convenient navigation
  const handleSettleScroll = () => {
    const pin = trackRef.current;
    if (!pin) return;
    const rect = pin.getBoundingClientRect();
    const currentScroll = window.scrollY;
    const trackTop = currentScroll + rect.top;
    const span = pin.offsetHeight - window.innerHeight;
    const targetScroll = trackTop + span * 0.50; // exact settle position
    scrollTo(targetScroll);
  };

  const handleResetScroll = () => {
    const pin = trackRef.current;
    if (!pin) return;
    const rect = pin.getBoundingClientRect();
    const currentScroll = window.scrollY;
    const trackTop = currentScroll + rect.top;
    scrollTo(trackTop);
  };

  return (
    <div className="relative w-full">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* Tall Scroll Track (450vh)                                     */}
      {/* Provides physical scrolling distance while stage stays pinned */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div ref={trackRef} className="relative w-full h-[450vh]">
        {/* ──────────────────────────────────────────────────────────── */}
        {/* Sticky Pinned 100vh Stage ("it should not go down")          */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between select-none bg-transparent">
          {/* Top Progress Line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 z-40 pointer-events-none">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 transition-[width] duration-75 ease-out"
              style={{ width: "0%" }}
            />
          </div>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* Chrome Top Header Bar                                        */}
          {/* ──────────────────────────────────────────────────────────── */}
          <header className="relative z-30 w-full px-4 sm:px-8 lg:px-12 pt-4 sm:pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-none">
            <div className="flex items-center gap-3 pointer-events-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-sky-300 text-blue-950 text-xs font-mono uppercase tracking-widest backdrop-blur-md shadow-xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span className="font-bold">02 // 3D SETTLE DECK · FEATURED SUITE</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto flex-wrap justify-center">
              {/* Quick Project Selectors (Click to elaborate directly) */}
              <div className="hidden md:flex items-center gap-1.5 bg-white/85 p-1 rounded-full border border-sky-200 backdrop-blur-md shadow-xs">
                <span className="text-[10px] font-mono text-slate-500 uppercase px-2 font-bold">
                  Elaborate:
                </span>
                {STACK_CARDS.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedProject(c.project)}
                    className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white hover:bg-sky-50 text-slate-700 hover:text-blue-700 border border-sky-200 hover:border-blue-400 transition-all cursor-pointer font-medium flex items-center gap-1"
                  >
                    <span>{c.project.title.split(" (")[0]}</span>
                    <ArrowUpRight className="w-2.5 h-2.5 text-sky-600" />
                  </button>
                ))}
              </div>

              {/* Settle to 50% jump */}
              <button
                onClick={handleSettleScroll}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 text-white text-xs font-mono font-bold shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-sky-700 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="Scroll to settled deck pose"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Settle Deck ✦</span>
              </button>

              {/* Reset to start jump */}
              <button
                onClick={handleResetScroll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 border border-sky-300 text-blue-700 text-xs font-mono font-semibold shadow-xs hover:bg-sky-50 transition-all cursor-pointer"
                title="Scroll to start of deck"
              >
                <RotateCcw className="w-3 h-3 text-blue-600" />
                <span>Reset ⟲</span>
              </button>
            </div>
          </header>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* Main 3D Card Stage (Perspective 1400px)                      */}
          {/* ──────────────────────────────────────────────────────────── */}
          <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
            {/* Subtle Ambient Blueprint Grid */}
            <div
              className="absolute inset-0 opacity-25 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(rgba(37, 99, 235, 0.25) 1.2px, transparent 1.2px)",
                backgroundSize: "36px 36px",
              }}
            />

            {/* Stage Headline (Lifts away during enter: p = 0 .. 0.18) */}
            <div
              ref={headlineRef}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4 select-none"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-100/90 text-blue-900 border border-sky-200 text-[11px] font-mono uppercase tracking-widest font-bold mb-3 shadow-xs">
                Scroll To Control 3D Deck
              </div>
              <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-slate-900 uppercase tracking-tight max-w-2xl leading-[1.05]">
                Scroll to settle &amp; peel the deck
              </h1>
              <p className="mt-3 text-xs sm:text-sm md:text-base text-slate-600 font-normal max-w-md">
                Scroll down to unfold the 3D stack. Click any card to elaborate full architecture.
              </p>
            </div>

            {/* 3D Deck Canvas (Perspective 1400px) */}
            <div
              className="absolute inset-0 z-20 pointer-events-none"
              style={{ perspective: "1400px", transformStyle: "preserve-3d" }}
            >
              {/* COVER CARD (st-front) — Royal Blue & Deep Navy with Sky Blue accents */}
              <div
                ref={frontRef}
                onClick={() => setSelectedProject(geminiProject)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[290px] sm:w-[350px] aspect-[4/5] rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-center text-center shadow-2xl shadow-blue-950/40 cursor-pointer pointer-events-auto border border-sky-300/40 select-none group"
                style={{
                  background: "linear-gradient(145deg, #1E3A8A 0%, #172554 50%, #0F172A 100%)",
                  color: "#FFFFFF",
                  backfaceVisibility: "hidden",
                  willChange: "transform, opacity",
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[11px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-white/15 border border-white/25 backdrop-blur-md text-white">
                    ✦ First Frame
                  </span>
                  <span className="text-[10px] font-mono text-sky-300">2026</span>
                </div>

                <div className="my-auto space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-white/15 border border-white/25 backdrop-blur-md flex items-center justify-center text-sky-200 shadow-inner group-hover:scale-110 transition-transform">
                    <Sparkle className="w-8 h-8 text-sky-300" />
                  </div>
                  <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-white leading-tight">
                    Architectural Repertoire
                  </h3>
                  <p className="text-xs sm:text-sm text-sky-100/90 font-normal leading-relaxed">
                    Scroll down to flip and peel the stack of flagship projects.
                  </p>
                </div>

                <div className="w-full pt-4 border-t border-sky-400/20 flex items-center justify-between text-xs font-mono text-sky-200">
                  <span>Panth Mistry</span>
                  <span className="font-bold underline flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-white">
                    <span>Scroll to Settle</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* REVEALED STACK CARDS (st-back) — Themed in Sky, Baby, Navy, and Royal Blue */}
              {STACK_CARDS.map((c, i) => {
                const Icon = c.icon;
                const isLight = c.fg === "#0A192F";
                return (
                  <div
                    key={c.project.id}
                    ref={(el) => {
                      backRefs.current[i] = el;
                    }}
                    onClick={() => setSelectedProject(c.project)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[290px] sm:w-[350px] aspect-[4/5] rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-center text-center shadow-2xl shadow-blue-950/35 cursor-pointer pointer-events-auto border border-white/30 select-none group hover:scale-[1.02] hover:shadow-blue-600/30 transition-shadow duration-300"
                    style={{
                      background: c.bg,
                      color: c.fg,
                      zIndex: 10 + i,
                      transform: "translate(-50%,-50%) rotateY(-180deg)",
                      backfaceVisibility: "hidden",
                      willChange: "transform, opacity",
                    }}
                    title={`Click to elaborate: ${c.project.title}`}
                  >
                    {/* Card Top Pill */}
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur-md ${
                          isLight
                            ? "bg-blue-950/10 border border-blue-950/20 text-blue-950"
                            : "bg-white/20 border border-white/30 text-white"
                        }`}
                      >
                        {c.kicker}
                      </span>
                      <div
                        className={`flex items-center gap-1 text-[11px] font-mono transition-colors ${
                          isLight
                            ? "text-blue-950/80 group-hover:text-blue-950"
                            : "text-white/90 group-hover:text-white"
                        }`}
                      >
                        <span className="font-bold underline">Elaborate</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>

                    {/* Card Middle: Icon & Title */}
                    <div className="my-auto space-y-3">
                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl backdrop-blur-md flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform ${
                          isLight
                            ? "bg-blue-950/10 border border-blue-950/20 text-blue-950"
                            : "bg-white/20 border border-white/30 text-white"
                        }`}
                      >
                        <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                      </div>

                      <h3
                        className={`font-display font-black text-xl sm:text-2xl tracking-tight leading-tight ${
                          isLight ? "text-blue-950" : "text-white"
                        }`}
                      >
                        {c.title}
                      </h3>

                      <p
                        className={`text-xs sm:text-sm font-normal leading-relaxed line-clamp-3 ${
                          isLight ? "text-blue-950/85" : "text-white/90"
                        }`}
                      >
                        {c.body}
                      </p>
                    </div>

                    {/* Card Bottom: Tech Pills & Callout */}
                    <div
                      className={`w-full pt-3 sm:pt-4 space-y-2 border-t ${
                        isLight ? "border-blue-950/15" : "border-white/20"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-center gap-1.5">
                        {c.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                              isLight
                                ? "bg-blue-950/10 text-blue-950 border-blue-950/20"
                                : "bg-white/20 text-white border-white/30"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div
                        className={`text-[11px] font-mono font-semibold ${
                          isLight
                            ? "text-blue-950/80 group-hover:text-blue-950"
                            : "text-white/80 group-hover:text-white"
                        }`}
                      >
                        ✦ Tap to inspect full specs &amp; code ↗
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* Chrome Bottom Footer Bar                                     */}
          {/* ──────────────────────────────────────────────────────────── */}
          <footer className="relative z-30 w-full px-4 sm:px-8 lg:px-12 py-4 sm:py-5 flex items-center justify-between text-xs font-mono text-slate-600 pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto bg-white/85 px-3.5 py-1.5 rounded-full border border-sky-200 backdrop-blur-md shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="font-semibold uppercase tracking-wider hidden sm:inline">
                Scroll to peel stack
              </span>
              <span className="text-slate-400 hidden sm:inline">·</span>
              <span ref={progressTextRef} className="text-blue-700 font-bold">
                0%
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 pointer-events-auto bg-white/85 px-3.5 py-1.5 rounded-full border border-sky-200 backdrop-blur-md shadow-xs">
              <span className="hidden sm:inline">04 System Cards ·</span>
              <span className="text-blue-700 font-semibold">Click card to elaborate ↗</span>
            </div>
          </footer>
        </section>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* Interactive Elaboration Modal Component                       */}
      {/* ──────────────────────────────────────────────────────────── */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};

export default SettleProjectStack;
