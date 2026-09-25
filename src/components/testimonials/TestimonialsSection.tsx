import React from 'react';
import { Quote } from 'lucide-react';
import { testimonials } from '../../data/portfolioData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 relative bg-gradient-to-b from-[#D5E8FD] via-[#E2EFFF] to-[#F0F7FF] border-t border-sky-200/80">
      {/* Background Soft Sky Blue & Royal Blue Glows */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-sky-300/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-blue-800 text-xs font-mono mb-4 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="font-semibold">06 // ENDORSEMENTS &amp; PEER FEEDBACK</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight leading-tight">
            Recommendations &amp; <span className="text-gradient-mono">Collaborator Feedback</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Observations from university faculty, game jam teammates, and hackathon evaluators.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="glass-panel glass-panel-hover p-6 sm:p-8 rounded-3xl border border-sky-200/80 flex flex-col justify-between space-y-6 shadow-sm"
            >
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-sky-400" />
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-sky-100 flex items-center gap-3.5">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-10 h-10 rounded-full object-cover border border-sky-200 shadow-xs"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-display">{t.author}</h4>
                  <p className="text-[11px] text-blue-700 font-mono font-medium">{t.role}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
