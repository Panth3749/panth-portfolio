import React from 'react';
import { Award, ShieldCheck, Trophy } from 'lucide-react';
import { certifications, competitions } from '../../data/portfolioData';

export const CertificationsSection: React.FC = () => {
  return (
    <section id="certifications" className="py-24 sm:py-32 relative">
      {/* Background Soft Sky Blue & Royal Blue Glows */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-300/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-blue-800 text-xs font-mono mb-4 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="font-semibold">05 // CERTIFICATIONS &amp; COMPETITIONS</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight leading-tight">
            Accreditations &amp; <span className="text-gradient-mono">Verified Skills</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Documented achievements across Data Analytics, Large Language Models, Game Development, and UI/UX Competitions.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, idx) => (
            <div
              key={idx}
              className="glass-panel glass-panel-hover p-6 rounded-3xl border border-sky-200/80 flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-blue-600 shadow-xs">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-sky-100 text-blue-900 border border-sky-200 font-semibold">
                    {cert.year}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-base text-slate-900">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-blue-700 mt-1 font-mono font-medium">
                    {cert.category}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-sky-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  {cert.issuer}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-blue-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Verified</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Competitions Banner */}
        <div className="mt-12 glass-panel p-6 sm:p-8 rounded-3xl border border-sky-200/80 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-900 font-bold">
              Official Hackathons &amp; Designathon Participations
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {competitions.map((comp, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-1 text-center sm:text-left shadow-xs"
              >
                <div className="text-xs font-bold text-slate-900">{comp.name}</div>
                <div className="text-[11px] font-mono text-blue-700 font-medium">{comp.role}</div>
                <div className="text-[10px] font-mono text-slate-500">{comp.year}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
