"use client";

import React, {
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowDown,
  FileText,
  Mail,
  Terminal,
  Play,
  Image as ImageIcon,
  Droplets,
} from "lucide-react";
import Ferrofluid from "./Ferrofluid";
import { HeroInkMask } from "./HeroInkMask";
import { FerrofluidControls } from "./FerrofluidControls";
import { personalProfile, ferrofluidPresets } from "../../data/portfolioData";
import { FerrofluidPreset } from "../../types";
import { GithubIcon, LinkedinIcon } from "../icons/SocialIcons";
import { subscribeScroll, scrollTo } from "../../utils/smoothScroll";
import { Lightfall } from "../background/Lightfall";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export type MediaType = "ferrofluid" | "video" | "image";

interface ScrollExpandHeroProps {
  onContactClick: () => void;
  children?: ReactNode;
}

export const ScrollExpandHero: React.FC<ScrollExpandHeroProps> = ({
  onContactClick,
  children,
}) => {
  const [mediaType, setMediaType] = useState<MediaType>("ferrofluid");
  const [isMobile, setIsMobile] = useState(false);

  // Ferrofluid Preset State
  const defaultPreset = ferrofluidPresets[0];
  const [currentPreset, setCurrentPreset] = useState<FerrofluidPreset>(defaultPreset);
  const [speed, setSpeed] = useState(defaultPreset.speed);
  const [scale, setScale] = useState(defaultPreset.scale);
  const [turbulence, setTurbulence] = useState(defaultPreset.turbulence);
  const [mouseInteraction, setMouseInteraction] = useState(true);

  const handleSelectPreset = (preset: FerrofluidPreset) => {
    setCurrentPreset(preset);
    setSpeed(preset.speed);
    setScale(preset.scale);
    setTurbulence(preset.turbulence);
  };

  const handleResetPreset = () => {
    setCurrentPreset(defaultPreset);
    setSpeed(defaultPreset.speed);
    setScale(defaultPreset.scale);
    setTurbulence(defaultPreset.turbulence);
    setMouseInteraction(true);
  };

  // Direct DOM references for 120 FPS hardware acceleration
  const sectionRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const postHeroRef = useRef<HTMLDivElement | null>(null);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [isPostHeroVisible, setIsPostHeroVisible] = useState(false);

  useEffect(() => {
    const heroEl = sectionRef.current;
    const postHeroEl = postHeroRef.current;
    if (!heroEl || !postHeroEl) return;

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      { rootMargin: "120px" }
    );
    heroObserver.observe(heroEl);

    const postHeroObserver = new IntersectionObserver(
      ([entry]) => {
        setIsPostHeroVisible(entry.isIntersecting);
      },
      { rootMargin: "120px" }
    );
    postHeroObserver.observe(postHeroEl);

    return () => {
      heroObserver.disconnect();
      postHeroObserver.disconnect();
    };
  }, []);

  const [scrollProgress, setScrollProgress] = useState(0);
  const lastReportedProgressRef = useRef(0);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const titleLeftRef = useRef<HTMLHeadingElement | null>(null);
  const titleRightRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const bgOverlayRef = useRef<HTMLDivElement | null>(null);
  const expandedInfoRef = useRef<HTMLDivElement | null>(null);

  // Target and current progress references for exponential physics lerp
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const expandedRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);

  // Viewport dimensions
  const viewportWidthRef = useRef(1440);
  const viewportHeightRef = useRef(900);

  useEffect(() => {
    const updateDims = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      viewportWidthRef.current = w;
      viewportHeightRef.current = h;
      setIsMobile(w < 768);
    };

    updateDims();
    window.addEventListener("resize", updateDims, { passive: true });
    return () => window.removeEventListener("resize", updateDims);
  }, []);

  // Continuous 120 FPS Direct DOM Lerp Loop
  useEffect(() => {
    let rafId: number;

    const tick = () => {
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.0001) {
        // Silky exponential lerp (9.5% per frame)
        currentProgressRef.current += diff * 0.095;
        const p = currentProgressRef.current;

        const mobile = viewportWidthRef.current < 768;
        const vh = viewportHeightRef.current;

        // 1. Frame dimensions
        const mediaWidth = 320 + p * (mobile ? 650 : 1250);
        const mediaHeight = 420 + p * (mobile ? 220 : 420);

        if (frameRef.current) {
          frameRef.current.style.width = `${mediaWidth}px`;
          frameRef.current.style.height = `${mediaHeight}px`;
        }

        // 2. Kinetic Split Typography (UI <-> ARCHITECT)
        const textTranslateX = p * (mobile ? 180 : 150);
        if (titleLeftRef.current) {
          titleLeftRef.current.style.transform = `translateX(-${textTranslateX}vw)`;
        }
        if (titleRightRef.current) {
          titleRightRef.current.style.transform = `translateX(${textTranslateX}vw)`;
        }

        // 3. Subtitle fade
        if (subtitleRef.current) {
          const subOp = Math.max(0, 1 - p * 2.5);
          subtitleRef.current.style.opacity = `${subOp}`;
          subtitleRef.current.style.transform = `translateY(${p * -20}px)`;
        }

        // 4. Scroll indicator fade
        if (indicatorRef.current) {
          const displayedH = Math.min(mediaHeight, vh * 0.85);
          const topPos = vh / 2 + displayedH / 2 + 28;
          indicatorRef.current.style.top = `${topPos}px`;
          indicatorRef.current.style.opacity = p < 0.16 ? "1" : "0";
          indicatorRef.current.style.transform = `translateX(-50%) translateY(${p < 0.16 ? 0 : 14}px)`;
        }

        // 5. Background Overlay
        if (bgOverlayRef.current) {
          bgOverlayRef.current.style.opacity = `${1 - p * 0.85}`;
          bgOverlayRef.current.style.transform = `scale(${1 + p * 0.05})`;
        }

        // 6. 2nd Image Info Overlay (fades in directly on top of the Ferrofluid!)
        if (expandedInfoRef.current) {
          const infoOp = Math.max(0, Math.min(1, (p - 0.4) / 0.5));
          expandedInfoRef.current.style.opacity = `${infoOp}`;
          expandedInfoRef.current.style.transform = `translateY(${(1 - infoOp) * 20}px)`;
          expandedInfoRef.current.style.pointerEvents = infoOp > 0.75 ? "auto" : "none";
        }

        // 7. Transition into unlocked page scroll
        if (p >= 0.99 && target >= 0.99) {
          currentProgressRef.current = 1;
          targetProgressRef.current = 1;
          expandedRef.current = true;
        } else if (p < 0.98) {
          expandedRef.current = false;
        }

        // Sync scrollProgress with HeroInkMask
        if (Math.abs(p - lastReportedProgressRef.current) > 0.015) {
          lastReportedProgressRef.current = p;
          setScrollProgress(p);
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Listen for instant expand trigger (from Navbar or button clicks)
  useEffect(() => {
    const handleExpandHero = () => {
      targetProgressRef.current = 1;
      currentProgressRef.current = 1;
      expandedRef.current = true;

      const heroEl = sectionRef.current;
      if (heroEl) {
        const span = heroEl.offsetHeight - window.innerHeight;
        scrollTo(span + 20, 0);
      }
    };

    window.addEventListener("expand-hero", handleExpandHero);
    return () => window.removeEventListener("expand-hero", handleExpandHero);
  }, []);

  // Continuous, responsive scroll progress tracking for the hero sticky expansion track
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const heroEl = sectionRef.current;
          if (heroEl) {
            const rect = heroEl.getBoundingClientRect();
            const span = heroEl.offsetHeight - window.innerHeight;
            const p = clamp01(span > 0 ? -rect.top / span : 0);
            targetProgressRef.current = p;
          }
          ticking = false;
        });
      }
    };

    const unsubscribe = subscribeScroll(onScroll);
    onScroll();

    return () => {
      unsubscribe();
    };
  }, []);

  const titleWords = "UI ARCHITECT".split(" ");
  const firstWord = titleWords[0];
  const remainingTitle = titleWords.slice(1).join(" ");

  const sampleVideoSrc = "https://www.pexels.com/download/video/17828727/";
  const sampleImageSrc =
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1800&q=85";
  const bgImageSrc =
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=90";

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#F0F7FF] via-[#E2EFFF] to-[#D5E8FD]">
      {/* Main Expansion Hero Stage (Pinned Sticky Scroll Track) */}
      <section id="scroll-expand-hero" ref={sectionRef} className="relative w-full h-[220vh]">
        <div ref={stickyRef} className="sticky top-0 relative w-full h-screen overflow-hidden">
        {/* Ambient Soft Warm & Sky Blue Glows */}
        <div
          ref={bgOverlayRef}
          className="absolute inset-0 z-0 pointer-events-none transition-transform duration-100 ease-out"
          style={{ willChange: "opacity, transform" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2] via-[#F5EFE6] to-[#EDF4FB]" />
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-sky-200/40 rounded-full blur-3xl" />
          <div className="absolute -top-20 -right-40 w-[600px] h-[600px] bg-amber-100/50 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl" />
        </div>

        {/* Central Stage */}
        <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1800px] flex-col items-center">
          <div className="relative flex min-h-[100dvh] w-full items-center justify-center">
            {/* The Expanding Media Frame containing the living Ferrofluid */}
            <div
              ref={frameRef}
              className="absolute left-1/2 top-1/2 overflow-hidden rounded-3xl border-2 border-sky-200/80"
              style={{
                width: "320px",
                height: "420px",
                maxWidth: "96vw",
                maxHeight: "88vh",
                transform: "translate(-50%, -50%)",
                boxShadow: "0 25px 80px -10px rgba(37, 99, 235, 0.16), 0 10px 40px -5px rgba(220, 195, 160, 0.28)",
                willChange: "width, height",
                backgroundColor: "#FAF7F2",
              }}
            >
              {mediaType === "ferrofluid" ? (
                <div className="relative h-full w-full overflow-hidden rounded-3xl">
                  {/* Living Black & White Ferrofluid with fixed buffer clipping */}
                  <Ferrofluid
                    className="w-full h-full"
                    paused={!isHeroVisible}
                    colors={currentPreset.colors}
                    speed={speed}
                    scale={scale}
                    turbulence={turbulence}
                    fluidity={currentPreset.fluidity}
                    rimWidth={0.22}
                    sharpness={currentPreset.sharpness}
                    shimmer={currentPreset.shimmer}
                    glow={currentPreset.glow}
                    flowDirection={currentPreset.flowDirection}
                    opacity={0.95}
                    mouseInteraction={mouseInteraction}
                    mouseStrength={1.2}
                    mouseRadius={0.35}
                    mouseDampening={0.12}
                    fixedViewport={true}
                  />

                  {/* Contrast Soft Vignette Gradient to ensure 100% text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/45 to-transparent pointer-events-none" />


                  {/* ──────────────────────────────────────────────────────────── */}
                  {/* 2ND IMAGE INFO: RENDERED DIRECTLY OVER THE FERROFLUID!       */}
                  {/* ──────────────────────────────────────────────────────────── */}
                  <div
                    ref={expandedInfoRef}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 text-center overflow-y-auto"
                    style={{
                      opacity: 0,
                      transform: "translateY(20px)",
                      pointerEvents: "none",
                    }}
                  >
                    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 my-auto">
                      {/* Badge: >_ ASPIRING AI DEVELOPER & COMPUTER SCIENCE ENGINEER */}
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-sky-200 text-blue-800 text-xs font-mono uppercase tracking-widest backdrop-blur-md shadow-md">
                        <span className="text-sky-500 font-bold">&gt;_</span>
                        <span className="font-semibold">ASPIRING AI DEVELOPER &amp; COMPUTER SCIENCE ENGINEER</span>
                      </div>

                      {/* Giant Display Name: PANTH MISTRY */}
                      <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight drop-shadow-sm">
                        <span className="text-blue-600">PANTH</span> <span className="text-gradient-mono">MISTRY</span>
                      </h2>

                      {/* Tagline Paragraph */}
                      <p className="text-xs sm:text-sm md:text-base text-slate-700 max-w-2xl mx-auto font-normal leading-relaxed">
                        Crafting intelligent AI systems, custom 2D browser game engines, and full-stack software.
                        Diploma in Computer Science &amp; Engineering at ITM SLS Baroda University, preparing for B.Tech in Artificial Intelligence.
                      </p>

                      {/* Action Buttons Row */}
                      <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                        <button
                          onClick={() => scrollTo('#projects', -60)}
                          className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-xl shadow-blue-500/25 hover:scale-105 active:scale-95 flex items-center gap-2 group cursor-pointer"
                        >
                          <span>EXPLORE PROJECTS</span>
                          <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                        </button>

                        <a
                          href={personalProfile.resumeUrl}
                          download={personalProfile.resumeFilename}
                          className="px-6 py-3 rounded-full bg-white/95 hover:bg-white text-blue-800 font-semibold text-xs font-mono border border-sky-200 shadow-sm hover:border-sky-400 transition-all flex items-center gap-2 group backdrop-blur-md"
                        >
                          <FileText className="w-4 h-4 text-blue-600 group-hover:text-blue-800 transition-colors" />
                          <span>Resume (PDF)</span>
                        </a>

                        <button
                          onClick={onContactClick}
                          className="px-6 py-3 rounded-full bg-sky-100 hover:bg-sky-200 text-blue-900 font-semibold text-xs font-mono border border-sky-300 shadow-sm transition-all flex items-center gap-2 group backdrop-blur-md cursor-pointer"
                        >
                          <Mail className="w-4 h-4 text-blue-700 group-hover:text-blue-900 transition-colors" />
                          <span>Contact Me</span>
                        </button>
                      </div>

                      {/* Socials & Location */}
                      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                        <a
                          href={personalProfile.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-full bg-white/90 hover:bg-sky-50 text-blue-700 hover:text-blue-900 border border-sky-200 shadow-sm transition-all backdrop-blur-md"
                          title="GitHub Profile"
                        >
                          <GithubIcon className="w-4 h-4" />
                        </a>
                        <a
                          href={personalProfile.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-full bg-white/90 hover:bg-sky-50 text-blue-700 hover:text-blue-900 border border-sky-200 shadow-sm transition-all backdrop-blur-md"
                          title="LinkedIn Profile"
                        >
                          <LinkedinIcon className="w-4 h-4" />
                        </a>
                        <span className="text-xs font-mono text-slate-700 font-medium">
                          Vadodara, Gujarat, India • ITM SLS Baroda University
                        </span>
                      </div>

                      {/* Bottom 4 Stat Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        <div className="p-3.5 rounded-2xl bg-white/90 border border-sky-200 text-center backdrop-blur-md shadow-md">
                          <div className="text-lg sm:text-xl font-bold font-mono text-blue-700">3+ Years</div>
                          <div className="text-[10px] font-mono text-slate-600 mt-0.5 uppercase tracking-wider font-semibold">
                            FOUNDATIONS
                          </div>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-white/90 border border-sky-200 text-center backdrop-blur-md shadow-md">
                          <div className="text-lg sm:text-xl font-bold font-mono text-blue-700">6+ Major</div>
                          <div className="text-[10px] font-mono text-slate-600 mt-0.5 uppercase tracking-wider font-semibold">
                            PROJECTS &amp; GAMES
                          </div>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-white/90 border border-sky-200 text-center backdrop-blur-md shadow-md">
                          <div className="text-lg sm:text-xl font-bold font-mono text-blue-700">4+ Jams</div>
                          <div className="text-[10px] font-mono text-slate-600 mt-0.5 uppercase tracking-wider font-semibold">
                            HACKATHONS
                          </div>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-white/90 border border-sky-200 text-center backdrop-blur-md shadow-md">
                          <div className="text-lg sm:text-xl font-bold font-mono text-blue-700">Gemini Labs</div>
                          <div className="text-[10px] font-mono text-slate-600 mt-0.5 uppercase tracking-wider font-semibold">
                            AI EXPLORER
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : mediaType === "video" ? (
                <div className="relative h-full w-full overflow-hidden rounded-3xl">
                  <video
                    src={sampleVideoSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    controls={false}
                    className="pointer-events-none h-full w-full object-cover filter grayscale contrast-125"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-sky-900/10" />

                  {/* 2nd image info over Video */}
                  <div
                    ref={expandedInfoRef}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 text-center overflow-y-auto"
                    style={{ opacity: 0, transform: "translateY(20px)", pointerEvents: "none" }}
                  >
                    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 my-auto">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-sky-200 text-blue-800 text-xs font-mono uppercase tracking-widest backdrop-blur-md shadow-md">
                        <span className="text-sky-500 font-bold">&gt;_</span>
                        <span className="font-semibold">ASPIRING AI DEVELOPER &amp; COMPUTER SCIENCE ENGINEER</span>
                      </div>
                      <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight drop-shadow-sm">
                        <span className="text-blue-600">PANTH</span> <span className="text-gradient-mono">MISTRY</span>
                      </h2>
                      <p className="text-xs sm:text-sm md:text-base text-slate-700 max-w-2xl mx-auto font-normal leading-relaxed">
                        Crafting intelligent AI systems, custom 2D browser game engines, and full-stack software.
                        Diploma in Computer Science &amp; Engineering at ITM SLS Baroda University, preparing for B.Tech in Artificial Intelligence.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                        <button
                          onClick={() => scrollTo('#projects', -60)}
                          className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-xl shadow-blue-500/25 hover:scale-105 active:scale-95 flex items-center gap-2 group cursor-pointer"
                        >
                          <span>EXPLORE PROJECTS</span>
                          <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                        </button>
                        <a
                          href={personalProfile.resumeUrl}
                          download={personalProfile.resumeFilename}
                          className="px-6 py-3 rounded-full bg-white/95 hover:bg-white text-blue-800 font-semibold text-xs font-mono border border-sky-200 shadow-sm hover:border-sky-400 transition-all flex items-center gap-2 group backdrop-blur-md"
                        >
                          <FileText className="w-4 h-4 text-blue-600 group-hover:text-blue-800 transition-colors" />
                          <span>Resume (PDF)</span>
                        </a>
                        <button
                          onClick={onContactClick}
                          className="px-6 py-3 rounded-full bg-sky-100 hover:bg-sky-200 text-blue-900 font-semibold text-xs font-mono border border-sky-300 shadow-sm transition-all flex items-center gap-2 group backdrop-blur-md cursor-pointer"
                        >
                          <Mail className="w-4 h-4 text-blue-700 group-hover:text-blue-900 transition-colors" />
                          <span>Contact Me</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative h-full w-full overflow-hidden rounded-3xl">
                  <img
                    src={sampleImageSrc}
                    alt="Featured visual"
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-sky-900/10" />

                  {/* 2nd image info over Image */}
                  <div
                    ref={expandedInfoRef}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 text-center overflow-y-auto"
                    style={{ opacity: 0, transform: "translateY(20px)", pointerEvents: "none" }}
                  >
                    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 my-auto">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-sky-200 text-blue-800 text-xs font-mono uppercase tracking-widest backdrop-blur-md shadow-md">
                        <span className="text-sky-500 font-bold">&gt;_</span>
                        <span className="font-semibold">ASPIRING AI DEVELOPER &amp; COMPUTER SCIENCE ENGINEER</span>
                      </div>
                      <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight drop-shadow-sm">
                        <span className="text-blue-600">PANTH</span> <span className="text-gradient-mono">MISTRY</span>
                      </h2>
                      <p className="text-xs sm:text-sm md:text-base text-slate-700 max-w-2xl mx-auto font-normal leading-relaxed">
                        Crafting intelligent AI systems, custom 2D browser game engines, and full-stack software.
                        Diploma in Computer Science &amp; Engineering at ITM SLS Baroda University, preparing for B.Tech in Artificial Intelligence.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                        <button
                          onClick={() => scrollTo('#projects', -60)}
                          className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-xl shadow-blue-500/25 hover:scale-105 active:scale-95 flex items-center gap-2 group cursor-pointer"
                        >
                          <span>EXPLORE PROJECTS</span>
                          <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                        </button>
                        <a
                          href={personalProfile.resumeUrl}
                          download={personalProfile.resumeFilename}
                          className="px-6 py-3 rounded-full bg-white/95 hover:bg-white text-blue-800 font-semibold text-xs font-mono border border-sky-200 shadow-sm hover:border-sky-400 transition-all flex items-center gap-2 group backdrop-blur-md"
                        >
                          <FileText className="w-4 h-4 text-blue-600 group-hover:text-blue-800 transition-colors" />
                          <span>Resume (PDF)</span>
                        </a>
                        <button
                          onClick={onContactClick}
                          className="px-6 py-3 rounded-full bg-sky-100 hover:bg-sky-200 text-blue-900 font-semibold text-xs font-mono border border-sky-300 shadow-sm transition-all flex items-center gap-2 group backdrop-blur-md cursor-pointer"
                        >
                          <Mail className="w-4 h-4 text-blue-700 group-hover:text-blue-900 transition-colors" />
                          <span>Contact Me</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Kinetic Split Title Typography (UI <-> ARCHITECT) */}
            <div className="pointer-events-none relative z-20 flex w-full flex-col items-center justify-center gap-1 sm:gap-2 px-4 text-center select-none">
              <h1
                ref={titleLeftRef}
                className="text-[clamp(2.8rem,8vw,7.5rem)] font-display font-black leading-[0.88] tracking-[-0.05em] text-blue-950 drop-shadow-sm"
                style={{ willChange: "transform" }}
              >
                {firstWord}
              </h1>

              <h1
                ref={titleRightRef}
                className="text-[clamp(2.8rem,8vw,7.5rem)] font-display font-black leading-[0.88] tracking-[-0.05em] text-blue-950 drop-shadow-sm"
                style={{ willChange: "transform" }}
              >
                {remainingTitle}
              </h1>

              {/* Sub-label */}
              <div
                ref={subtitleRef}
                className="mt-4 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-sky-200 text-blue-900 text-xs font-mono uppercase tracking-widest transition-opacity duration-150 shadow-sm backdrop-blur-md"
              >
                <span className="font-semibold">AI Developer &amp; Computer Science Engineer</span>
              </div>
            </div>

            {/* Pulsing Scroll Indicator */}
            <div
              ref={indicatorRef}
              className="pointer-events-none absolute left-1/2 z-30 transition-[opacity,transform] duration-200"
              style={{
                top: "70%",
                transform: "translateX(-50%)",
                opacity: 1,
              }}
            >
              <div className="flex flex-col items-center justify-center gap-2.5 text-blue-900">
                <span className="text-center text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-slate-600">
                  Scroll To Expand
                </span>

                <div className="flex h-10 w-6 justify-center rounded-full border-2 border-blue-400 bg-white/80 p-1.5 backdrop-blur-sm shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shadow-sm shadow-blue-400 animate-bounce" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Soft bottom feather gradient blending hero stage into the transition bridge */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48 sm:h-64 pointer-events-none z-10 bg-gradient-to-b from-transparent via-[#EDF4FB]/50 to-[#EDF4FB]"
          aria-hidden="true"
        />

        {/* Interactive Ink Reveal Mask Layer (Paints away cover to reveal live Ferrofluid hero) */}
        <HeroInkMask containerRef={stickyRef} scrollProgress={scrollProgress} />
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* Post-Ferrofluid Animated Lightfall Background               */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div ref={postHeroRef} className="relative z-20">
        {/* Seamless atmospheric gradient bridge from Hero into Lightfall */}
        <div
          className="absolute -top-1 left-0 right-0 h-80 sm:h-96 pointer-events-none z-10 bg-gradient-to-b from-[#EDF4FB] via-[#EDF4FB]/75 to-transparent"
          aria-hidden="true"
        />

        {/* Soft luminous ambient glow bridging the two sections */}
        <div
          className="absolute -top-36 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-sky-300/30 via-blue-500/15 to-transparent rounded-full blur-3xl pointer-events-none z-10"
          aria-hidden="true"
        />

        {/* Persistent static glowing aura backdrop behind the Lightfall canvas */}
        <div
          className="sticky top-0 w-full h-screen pointer-events-none -mb-[100vh] z-0 overflow-hidden flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="w-[1100px] h-[700px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.20)_0%,rgba(37,99,235,0.08)_45%,transparent_75%)] blur-3xl" />
        </div>

        {/* Sticky Lightfall WebGL Canvas: stays locked in viewport with smooth top fade mask */}
        <div
          className="sticky top-0 w-full h-screen pointer-events-none -mb-[100vh] z-0 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.02) 60px, rgba(0,0,0,0.2) 160px, rgba(0,0,0,0.7) 320px, black 500px)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.02) 60px, rgba(0,0,0,0.2) 160px, rgba(0,0,0,0.7) 320px, black 500px)",
          }}
        >
          <Lightfall
            className="w-full h-full"
            paused={!isPostHeroVisible}
            theme="light"
            speed={0.45}
            streakCount={5}
            streakWidth={1.8}
            streakLength={2.2}
            glow={1.25}
            staticGlow={0.9}
            density={0.65}
            backgroundGlow={0.35}
            mouseInteraction={true}
          />
        </div>

        {/* Content of all sections on top */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ScrollExpandHero;
