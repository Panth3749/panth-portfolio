"use client";

import React, { useState } from 'react';
import {
  GraduationCap,
  Trophy,
  Award,
  Calendar,
  MapPin,
  CheckCircle2,
  Layers,
  Sparkles
} from 'lucide-react';
import { experienceItems } from '../../data/portfolioData';
import { ScrollRevealCards } from './ScrollRevealCards';

export const ExperienceSection: React.FC = () => {
  const [viewMode, setViewMode] = useState<'deck' | 'timeline'>('deck');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Education':
        return GraduationCap;
      case 'Game Jam & Competition':
        return Trophy;
      default:
        return Award;
    }
  };

  return (
    <section id="journey" className="relative w-full">
      {viewMode === 'deck' ? (
        <ScrollRevealCards onToggleTimeline={() => setViewMode('timeline')} />
      ) : (
        <div className="py-20 sm:py-28 relative overflow-hidden">
          {/* Background Soft Sky Blue & Royal Blue Glows */}
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-sky-300/25 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-sky-300 text-blue-900 text-xs font-mono uppercase tracking-widest backdrop-blur-md shadow-xs mb-4">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <span className="font-bold">04 // EDUCATION, JOURNEY &amp; COMPETITIONS</span>
                </div>

                <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.1]">
                  Academic Growth &amp; <span className="text-gradient-mono">Competitive Milestones</span>
                </h2>

                <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
                  From rigorous engineering disciplines at ITM SLS Baroda University to intense Game Jams,
                  Designathons, and Google Gemini Labs AI explorer challenges.
                </p>
              </div>

              {/* View Mode Toggle Switch */}
              <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/90 border border-sky-200 shadow-sm backdrop-blur-md self-start md:self-end">
                <button
                  onClick={() => setViewMode('deck')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-blue-600 text-white shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>✦ Scroll Reveal Deck</span>
                </button>
              </div>
            </div>

            {/* Chronological Timeline List */}
            <div className="relative before:absolute before:inset-0 before:left-5 sm:before:left-1/2 before:w-0.5 before:-translate-x-1/2 before:bg-gradient-to-b before:from-blue-400 before:via-sky-200 before:to-transparent space-y-12 animate-in fade-in duration-300">
              {experienceItems.map((item, idx) => {
                const Icon = getTypeIcon(item.type);
                const isEven = idx % 2 === 0;

                return (
                  <div
                    key={item.id}
                    className={`relative flex flex-col sm:flex-row items-start ${
                      isEven ? 'sm:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Center Node Icon */}
                    <div className="absolute left-5 sm:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center text-blue-600 z-10 shadow-md shadow-blue-500/20">
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Content Box */}
                    <div className="w-full sm:w-[calc(50%-2.5rem)] ml-12 sm:ml-0">
                      <div className="glass-panel glass-panel-hover p-6 sm:p-8 rounded-3xl border border-sky-200/80 space-y-4 shadow-sm">
                        {/* Meta Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-100 pb-3">
                          <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-sky-100 text-blue-900 border border-sky-200 font-semibold">
                            {item.type}
                          </span>
                          <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-blue-600" />
                              <span>{item.period}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-blue-600" />
                              <span>{item.location}</span>
                            </span>
                          </div>
                        </div>

                        {/* Role & Company */}
                        <div>
                          <h3 className="font-display font-bold text-lg text-slate-900">
                            {item.role}
                          </h3>
                          <h4 className="text-xs font-mono text-blue-700 mt-1 font-medium">
                            {item.company}
                          </h4>
                        </div>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                          {item.description}
                        </p>

                        {/* Achievements */}
                        <div className="space-y-2 pt-1">
                          {item.achievements.map((ach, aIdx) => (
                            <div key={aIdx} className="flex items-start gap-2 text-xs text-slate-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                              <span>{ach}</span>
                            </div>
                          ))}
                        </div>

                        {/* Tech Stack Tags */}
                        <div className="pt-2 flex flex-wrap gap-1.5 border-t border-sky-100">
                          {item.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-sky-50 border border-sky-200 text-blue-800 font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ExperienceSection;
