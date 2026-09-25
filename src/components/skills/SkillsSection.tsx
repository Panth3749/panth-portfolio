import React, { useState } from 'react';
import { Terminal, Layers, Server, Sparkles, CheckCircle2, Code2 } from 'lucide-react';
import { skillCategories } from '../../data/portfolioData';

export const SkillsSection: React.FC = () => {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);

  const getCategoryIcon = (icon: string) => {
    switch (icon) {
      case 'Terminal':
        return Terminal;
      case 'Layers':
        return Layers;
      case 'Server':
        return Server;
      case 'Sparkles':
        return Sparkles;
      default:
        return Code2;
    }
  };

  const activeCategory = skillCategories[selectedCategoryIndex];
  const ActiveIcon = getCategoryIcon(activeCategory.icon);

  return (
    <section id="skills" className="py-24 sm:py-32 relative">
      {/* Background Soft Sky Blue & Royal Blue Glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-300/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-blue-800 text-xs font-mono mb-4 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="font-semibold">03 // TECHNICAL SKILLS &amp; PROFICIENCY</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight leading-tight">
            Programming, Tools &amp; <span className="text-gradient-mono">Core Disciplines</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Theoretical knowledge forged into practical projects — spanning foundational languages, 
            AI tooling, UI/UX prototyping, and low-level game mechanics.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {skillCategories.map((cat, idx) => {
            const Icon = getCategoryIcon(cat.icon);
            const isActive = selectedCategoryIndex === idx;
            return (
              <button
                key={cat.title}
                onClick={() => setSelectedCategoryIndex(idx)}
                className={`p-5 rounded-2xl text-left transition-all border flex flex-col justify-between cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-[1.02]'
                    : 'bg-white hover:bg-sky-50 text-slate-800 border-sky-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className={`p-2.5 rounded-xl ${
                      isActive ? 'bg-white/20 text-white' : 'bg-sky-50 text-blue-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-mono font-medium ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                    {cat.skills.length} Skills
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className={`font-display font-bold text-sm ${isActive ? 'text-white' : 'text-slate-900'}`}>
                    {cat.title}
                  </h3>
                  <p className={`text-[11px] line-clamp-2 mt-1 font-normal ${isActive ? 'text-blue-100' : 'text-slate-600'}`}>
                    {cat.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Skills Display */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Active Category Skill Bars */}
          <div className="lg:col-span-8 glass-panel p-6 sm:p-8 rounded-3xl border border-sky-200/80 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-sky-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-100 text-blue-700 shadow-xs">
                  <ActiveIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900">
                    {activeCategory.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-normal">
                    {activeCategory.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 pt-2">
              {activeCategory.skills.map((skill) => (
                <div key={skill.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-900 font-medium flex items-center gap-2">
                      <span>{skill.name}</span>
                      {skill.highlight && (
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-sky-100 text-blue-800 border border-sky-200 font-semibold">
                          Core
                        </span>
                      )}
                    </span>
                    <span className="text-blue-700 font-bold">{skill.level}%</span>
                  </div>

                  <div className="h-2 w-full bg-sky-100 rounded-full overflow-hidden p-[1px] border border-sky-200">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-blue-700 rounded-full transition-all duration-1000 ease-out shadow-sm shadow-blue-500/30"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick CS Competencies Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-panel p-6 rounded-3xl border border-sky-200/80 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-900">
                  Engineering Stack Highlights
                </span>
                <span className="text-[10px] font-mono text-blue-700 font-medium">Curriculum &amp; Applied</span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200 space-y-1">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>DSA &amp; Problem Solving</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-normal">
                    Arrays, Trees, Graphs, Sorting algorithms, Big-O analysis in C++ &amp; Python.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200 space-y-1">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>AI &amp; LLM Workflows</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-normal">
                    Google Gemini API, Zero/Few-shot prompt architecture, synthetic data.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200 space-y-1">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Custom Physics &amp; Game Math</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-normal">
                    Vector math, velocity damping, collision resolution in JavaScript Canvas.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200 space-y-1">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>UI/UX &amp; Mobile Dev</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-normal">
                    Figma mobile prototypes, Android Java XML layouts, Firebase synchronization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
