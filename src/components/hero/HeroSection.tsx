import React, { useState } from 'react';
import { ArrowDown, FileText, Mail, Sparkles, Terminal, Cpu, Award } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../icons/SocialIcons';
import Ferrofluid from './Ferrofluid';
import { FerrofluidControls } from './FerrofluidControls';
import { personalProfile, ferrofluidPresets } from '../../data/portfolioData';
import { FerrofluidPreset } from '../../types';

interface HeroSectionProps {
  onContactClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onContactClick }) => {
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

  const handleReset = () => {
    setCurrentPreset(defaultPreset);
    setSpeed(defaultPreset.speed);
    setScale(defaultPreset.scale);
    setTurbulence(defaultPreset.turbulence);
    setMouseInteraction(true);
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#050507]">
      {/* Background WebGL Black & White Ferrofluid */}
      <div className="absolute inset-0 z-0">
        <Ferrofluid
          className="w-full h-full"
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
          opacity={0.88}
          mouseInteraction={mouseInteraction}
          mouseStrength={1.2}
          mouseRadius={0.35}
          mouseDampening={0.12}
        />
        {/* Sleek radial and linear dark contrast gradients to ensure text readability */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050507]/40 to-[#050507] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050507]/80 via-transparent to-[#050507] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050507] to-transparent pointer-events-none" />
      </div>

      {/* Top Floating Controls Bar */}
      <div className="relative z-20 pt-24 sm:pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-xs font-mono text-zinc-300 border border-white/10 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{personalProfile.status}</span>
        </div>

        <FerrofluidControls
          currentPreset={currentPreset}
          onSelectPreset={handleSelectPreset}
          speed={speed}
          onSpeedChange={setSpeed}
          scale={scale}
          onScaleChange={setScale}
          turbulence={turbulence}
          onTurbulenceChange={setTurbulence}
          mouseInteraction={mouseInteraction}
          onToggleMouse={() => setMouseInteraction(!mouseInteraction)}
          onReset={handleReset}
        />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 my-auto px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center py-12">
        {/* Name and Title */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/15 text-zinc-300 text-xs font-mono tracking-widest uppercase">
            <Terminal className="w-3.5 h-3.5 text-white" />
            <span>AI Developer & Computer Science Engineer</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black tracking-tight text-white leading-none">
            <span className="text-blue-500">PANTH</span> <span className="text-gradient-mono">MISTRY</span>
          </h1>

          <p className="text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto font-light leading-relaxed">
            Crafting intelligent AI systems, custom 2D game engines, and full-stack software. 
            Diploma in Computer Science & Engineering at ITM SLS Baroda University, preparing for B.Tech in Artificial Intelligence.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <a
            href="#projects"
            className="px-6 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 group"
          >
            <span>Explore Projects</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </a>

          <a
            href={personalProfile.resumeUrl}
            download={personalProfile.resumeFilename}
            className="px-6 py-3.5 rounded-full glass-panel hover:bg-white/10 text-white font-medium text-sm border border-white/20 transition-all flex items-center gap-2 group hover:border-white/40"
          >
            <FileText className="w-4 h-4 text-zinc-300 group-hover:text-white transition-colors" />
            <span>Resume (PDF)</span>
          </a>

          <button
            onClick={onContactClick}
            className="px-6 py-3.5 rounded-full glass-panel hover:bg-white/10 text-white font-medium text-sm border border-white/20 transition-all flex items-center gap-2 group hover:border-white/40"
          >
            <Mail className="w-4 h-4 text-zinc-300 group-hover:text-white transition-colors" />
            <span>Get in Touch</span>
          </button>
        </div>

        {/* Social Icons & Status */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href={personalProfile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full glass-panel text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/30 transition-all"
            title="GitHub Profile (@Panth3749)"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <a
            href={personalProfile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full glass-panel text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/30 transition-all"
            title="LinkedIn Profile (Panth Mistry)"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>
          <span className="text-xs font-mono text-zinc-500">
            Vadodara, Gujarat, India • ITM SLS Baroda University
          </span>
        </div>

        {/* Quick Highlights Grid */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
          <div className="glass-panel p-4 rounded-2xl border border-white/10 text-center">
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">3+ Years</div>
            <div className="text-[11px] font-mono text-zinc-400 mt-1 uppercase tracking-wider">
              Computing Foundations
            </div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-white/10 text-center">
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">6+ Major</div>
            <div className="text-[11px] font-mono text-zinc-400 mt-1 uppercase tracking-wider">
              Projects & Games
            </div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-white/10 text-center">
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">4+ Jams</div>
            <div className="text-[11px] font-mono text-zinc-400 mt-1 uppercase tracking-wider">
              Hackathons & Contests
            </div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-white/10 text-center">
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">Gemini Labs</div>
            <div className="text-[11px] font-mono text-zinc-400 mt-1 uppercase tracking-wider">
              AI Certified Explorer
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="relative z-10 pb-8 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Sparkles className="w-3.5 h-3.5 text-zinc-300 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Move cursor across the screen to interact with the ferrofluid</span>
        </div>
      </div>
    </section>
  );
};
