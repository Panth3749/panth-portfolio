import React from 'react';
import { ArrowUp, Mail, ArrowUpRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../icons/SocialIcons';
import { personalProfile } from '../../data/portfolioData';
import { scrollTo } from '../../utils/smoothScroll';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    scrollTo(0);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollTo(href, -70);
  };

  return (
    <footer className="relative py-14 sm:py-18 mt-12 text-slate-800 bg-white/92 backdrop-blur-2xl border-t border-sky-200/80 shadow-[0_-20px_50px_-15px_rgba(37,99,235,0.12)]">
      {/* Subtle Blueprint Dot Grid */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(37, 99, 235, 0.25) 1.2px, transparent 1.2px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start justify-between">
          {/* Brand info */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/25">
                <span className="font-kraton text-base tracking-wider text-white">
                  P&amp;P
                </span>
              </div>
              <div>
                <span className="font-kraton text-2xl text-slate-900 block leading-tight tracking-wide">
                  P&amp;P Studio
                </span>
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                  Panth Mistry &bull; Portfolio 2026
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 font-normal max-w-md leading-relaxed">
              Diploma in Computer Science &amp; Engineering student at ITM SLS Baroda University.
              Aspiring AI Developer building high-performance systems, custom browser games, and machine learning solutions.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-xs font-mono text-blue-900 font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>Vadodara, Gujarat, India • Open for Roles &amp; Internships</span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-slate-900 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span>Navigation</span>
            </div>
            <ul className="space-y-2 text-xs font-mono">
              {[
                { label: "About & Vision", href: "#about" },
                { label: "Featured Projects", href: "#projects" },
                { label: "Technical Stack", href: "#skills" },
                { label: "Journey & Education", href: "#journey" },
                { label: "Certifications & Jams", href: "#certifications" },
                { label: "Contact Panth", href: "#contact" },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="text-slate-700 hover:text-blue-700 font-medium transition-all hover:translate-x-1 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="text-blue-500 font-bold opacity-60">›</span>
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials & Resume */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-slate-900 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span>Connect &amp; Verify</span>
            </div>
            <div className="flex items-center gap-2.5">
              <a
                href={personalProfile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white hover:bg-sky-50 text-blue-700 hover:text-blue-900 border border-sky-300 shadow-xs hover:shadow-sm transition-all hover:scale-105 active:scale-95"
                title="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={personalProfile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white hover:bg-sky-50 text-blue-700 hover:text-blue-900 border border-sky-300 shadow-xs hover:shadow-sm transition-all hover:scale-105 active:scale-95"
                title="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${personalProfile.email}`}
                className="p-2.5 rounded-xl bg-white hover:bg-sky-50 text-blue-700 hover:text-blue-900 border border-sky-300 shadow-xs hover:shadow-sm transition-all hover:scale-105 active:scale-95"
                title="Send Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-2">
              <a
                href={personalProfile.resumeUrl}
                download={personalProfile.resumeFilename}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-xs font-mono text-blue-800 font-semibold border border-sky-200 shadow-xs transition-all hover:scale-105 active:scale-95"
              >
                <span>Download Resume (PDF)</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-sky-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-700">
          <div className="font-medium text-center sm:text-left">
            © {new Date().getFullYear()} Panth Mistry &bull; <span className="font-kraton text-sm font-semibold text-blue-900 tracking-wide">P&amp;P Studio</span>. All rights reserved.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-semibold shadow-md shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
