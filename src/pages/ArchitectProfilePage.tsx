import React, { useEffect } from 'react';
import {
  Brain,
  Gamepad2,
  Smartphone,
  Sparkles,
  CheckCircle2,
  Globe2,
  Compass,
  GraduationCap,
  Code2,
  Zap,
  Target,
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  Layers,
  Calendar,
  Cpu,
  Mail
} from 'lucide-react';
import { personalProfile } from '../data/portfolioData';
import { scrollTo } from '../utils/smoothScroll';

interface ArchitectProfilePageProps {
  onBack: () => void;
}

export const ArchitectProfilePage: React.FC<ArchitectProfilePageProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const pillars = [
    {
      icon: Brain,
      title: "Artificial Intelligence & LLMs",
      badge: "Primary Ambition",
      description:
        "Deeply passionate about machine learning architectures, automated reasoning, and prompt engineering. Actively exploring Google Gemini Labs, autonomous agents, and modern generative AI pipelines.",
      capabilities: ["Gemini 1.5 Flash/Pro", "Prompt Engineering", "Neural Logic", "AI Tools Lab"],
      status: "Active Research",
      accent: "from-blue-600 to-sky-500",
      borderGlow: "border-blue-400/60 shadow-blue-500/20"
    },
    {
      icon: Gamepad2,
      title: "Game Engineering & Physics",
      badge: "Game Jam Proven",
      description:
        "Crafts 2D game loops, custom hitbox collision detection, and enemy AI state machines from scratch in Vanilla JavaScript & HTML5 Canvas without relying on bulky third-party engines.",
      capabilities: ["Custom 2D Game Loop", "AABB Hitbox Physics", "State Machines", "Vanilla JS"],
      status: "100% Native Code",
      accent: "from-sky-500 to-cyan-400",
      borderGlow: "border-sky-300/60 shadow-sky-500/15"
    },
    {
      icon: Smartphone,
      title: "Mobile & Full-Stack Systems",
      badge: "Applied Engineering",
      description:
        "Develops robust native Android applications in Java with clean XML layouts and Firebase real-time synchronization, including automated vehicle maintenance reminders with push pipelines.",
      capabilities: ["Android SDK (Java)", "Firebase Realtime DB", "Push Pipelines", "REST APIs"],
      status: "Production Ready",
      accent: "from-blue-700 to-indigo-500",
      borderGlow: "border-blue-300/60 shadow-blue-500/15"
    },
    {
      icon: Sparkles,
      title: "Creative Tech & Shader Lab",
      badge: "GPU Shaders & Math",
      description:
        "Explores hardware-accelerated WebGL / GLSL shaders, procedural math, and interactive graphics to build fluid, kinetic visual experiences that run silky smooth at 120 FPS.",
      capabilities: ["WebGL / OGL Shaders", "Procedural Math", "Interactive UI", "120 FPS Physics"],
      status: "GPU Accelerated",
      accent: "from-indigo-600 to-sky-500",
      borderGlow: "border-indigo-300/60 shadow-indigo-500/15"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F7FF] via-[#E2EFFF] to-[#D5E8FD] text-slate-800 relative selection:bg-sky-200 selection:text-blue-900 pb-24">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* Ambient Blueprint Grid & Glow Lights                         */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 opacity-35 pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(rgba(37, 99, 235, 0.22) 1.2px, transparent 1.2px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div className="fixed top-20 right-10 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/20 via-sky-300/25 to-transparent rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-20 left-10 w-[550px] h-[550px] bg-gradient-to-tr from-sky-400/20 via-blue-600/15 to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      {/* ──────────────────────────────────────────────────────────── */}
      {/* Sticky Top Navigation Bar                                    */}
      {/* ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-3.5 bg-white/85 backdrop-blur-xl border-b border-sky-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-sky-50 text-blue-900 font-mono text-xs font-semibold border border-sky-300 shadow-xs hover:border-blue-500 transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Return to main portfolio"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
            <span>Back to Portfolio</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>/</span>
            <span className="font-semibold text-blue-950">Architect Profile &amp; Aspirations</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-sky-200 text-xs font-mono text-blue-900 font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="hidden md:inline">Status:</span>
            <span>B.Tech in AI Bound</span>
          </span>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* Page Content Container                                       */}
      {/* ──────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 relative z-10">
        {/* Section Header: Modern Architectural Title */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-sky-300 text-blue-950 text-xs font-mono uppercase tracking-widest backdrop-blur-md shadow-xs mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="font-bold">01 // ARCHITECT PROFILE &amp; ASPIRATIONS</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-slate-900 tracking-tight leading-[1.05]">
            Engineering the Future with{" "}
            <span className="bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
              Code &amp; Intelligence
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-700 font-normal leading-relaxed">
            Computer Science &amp; Engineering scholar at{" "}
            <strong className="text-blue-900 font-semibold">ITM SLS Baroda University</strong>. Dedicated to advancing
            into a B.Tech in Artificial Intelligence, architecting resilient software ecosystems, and pushing the boundaries
            of interactive computing.
          </p>
        </div>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* Quick Highlights / High-Impact Stat Strip                     */}
        {/* ──────────────────────────────────────────────────────────── */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white/90 border border-sky-200/90 shadow-sm backdrop-blur-md flex items-center gap-3.5 hover:border-sky-400 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-sm shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">3+ Years</div>
              <div className="text-[11px] font-mono text-slate-600 uppercase tracking-wider">CS Foundations</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 border border-sky-200/90 shadow-sm backdrop-blur-md flex items-center gap-3.5 hover:border-sky-400 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-sm shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">ITM SLS Baroda</div>
              <div className="text-[11px] font-mono text-slate-600 uppercase tracking-wider">CSE · 5th Semester</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 border border-sky-200/90 shadow-sm backdrop-blur-md flex items-center gap-3.5 hover:border-sky-400 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-sm shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">6+ Major Apps</div>
              <div className="text-[11px] font-mono text-slate-600 uppercase tracking-wider">Engines &amp; Systems</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/90 border border-sky-200/90 shadow-sm backdrop-blur-md flex items-center gap-3.5 hover:border-sky-400 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-sm shrink-0">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Gemini Labs</div>
              <div className="text-[11px] font-mono text-slate-600 uppercase tracking-wider">AI Explorer</div>
            </div>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* Master Bento Grid: Stylish Architecture                      */}
        {/* ──────────────────────────────────────────────────────────── */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Bento Card 1 (7 Columns): Vision & Academic Foundations */}
          <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white/92 border border-white/90 shadow-xl shadow-blue-900/5 backdrop-blur-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
            <div className="space-y-6">
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-sm shadow-blue-500/20">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    Career Objective &amp; Vision
                  </h3>
                </div>
                <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Target: AI Developer
                </span>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                {personalProfile.careerObjective}
              </p>

              {/* Education Highlight Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-50/90 via-blue-50/80 to-indigo-50/60 border border-sky-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                <div className="flex items-start gap-3.5">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-sky-600 text-white shrink-0 shadow-md shadow-blue-500/25">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      ITM SLS Baroda University
                    </h4>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      Diploma in Computer Science &amp; Engineering · 3rd Year (5th Sem)
                    </p>
                    <p className="text-[11px] font-mono text-blue-700 mt-1 font-semibold">
                      Vadodara, Gujarat, India · 2024 – 2027 (Expected)
                    </p>
                  </div>
                </div>

                <div className="shrink-0 px-3 py-1.5 rounded-full bg-white border border-sky-300 text-xs font-mono text-blue-800 font-bold shadow-xs">
                  B.Tech in AI Bound 🚀
                </div>
              </div>

              {/* Core Strengths */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-600 font-bold mb-3 flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-blue-600" />
                  <span>Core Engineering Competencies</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {personalProfile.strengths.map((str) => (
                    <span
                      key={str}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono bg-sky-50/80 border border-sky-200 text-slate-800 shadow-2xs hover:bg-white hover:border-blue-400 hover:text-blue-900 transition-all hover:scale-105"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-medium">{str}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Languages Spoken */}
            <div className="pt-6 mt-6 border-t border-sky-100/80">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-600 font-bold mb-3 flex items-center gap-2">
                <Globe2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Languages &amp; Global Fluency</span>
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {personalProfile.languages.map((lang) => (
                  <div
                    key={lang.language}
                    className="p-3 rounded-2xl bg-white border border-sky-200/90 text-center shadow-xs hover:border-sky-400 transition-colors"
                  >
                    <div className="text-xs sm:text-sm font-bold text-slate-900">{lang.language}</div>
                    <div className="text-[10px] sm:text-[11px] font-mono text-blue-700 font-semibold mt-0.5">
                      {lang.proficiency}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bento Card 2 (5 Columns): Artificial Intelligence & LLMs (Primary Ambition) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/95 via-sky-50/90 to-blue-50/80 border-2 border-sky-300/90 shadow-xl shadow-blue-500/10 backdrop-blur-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 relative overflow-hidden group">
            {/* Ambient Background Aura */}
            <div className="absolute -top-12 -right-12 w-44 h-44 bg-gradient-to-br from-blue-500/20 to-sky-400/20 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div className="space-y-5 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Brain className="w-7 h-7" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-mono font-bold tracking-wider uppercase shadow-sm shadow-blue-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-200 animate-ping" />
                  Primary Ambition
                </span>
              </div>

              <div>
                <h3 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
                  Artificial Intelligence &amp; LLMs
                </h3>
                <p className="mt-2.5 text-sm text-slate-700 leading-relaxed font-normal">
                  Deeply passionate about machine learning architectures, automated reasoning, and prompt engineering. 
                  Actively exploring Google Gemini Labs, autonomous agents, and modern generative AI pipelines.
                </p>
              </div>

              {/* Capability Matrix */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                  Core Focus Stack:
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Google Gemini Labs", "Prompt Architectures", "Neural Reasoning", "AI Agents"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-mono bg-white border border-sky-300 text-blue-900 font-semibold shadow-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-sky-200/80 flex items-center justify-between relative z-10">
              <span className="text-xs font-mono text-slate-600 font-medium">Research &amp; Engineering</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-700 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Focus
              </span>
            </div>
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* Row 2: The Three Supporting Engineering Pillars              */}
        {/* ──────────────────────────────────────────────────────────── */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.slice(1).map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-white/92 border border-white/80 shadow-lg shadow-blue-900/5 backdrop-blur-xl hover:shadow-2xl hover:shadow-blue-500/15 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.accent} text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-sky-50 text-blue-800 border border-sky-200 tracking-wider">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-slate-900 tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.description}
                  </p>

                  {/* Capability Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {item.capabilities.map((cap) => (
                      <span
                        key={cap}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-sky-50/80 border border-sky-200/90 text-blue-900 font-medium"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-sky-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500 font-medium">Domain Status</span>
                  <span className="text-[11px] font-mono text-blue-700 font-bold">
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* Bottom Navigation & Action Bar                               */}
        {/* ──────────────────────────────────────────────────────────── */}
        <div className="mt-16 p-8 rounded-3xl bg-white/90 border border-sky-200/80 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-lg text-slate-900">
                Ready to review the interactive codebase?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 font-normal">
                Explore the 3D flagship project deck, live shader engines, or connect directly.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-semibold shadow-md shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Portfolio</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArchitectProfilePage;
