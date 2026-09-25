import { X, Sparkles, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from '../icons/SocialIcons';
import { Project } from '../../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-sky-200 shadow-2xl overflow-hidden z-10 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-sky-50">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 border border-sky-200 transition-all backdrop-blur-md shadow-md cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Info */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-blue-900 text-xs font-mono mb-2 border border-sky-200 shadow-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{project.category}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-black text-slate-900">
              {project.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 font-medium">
              {project.tagline}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Key Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            {project.stats.map((stat, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-sky-50/70 border border-sky-200 text-center"
              >
                <div className="text-[11px] font-mono text-slate-500 font-semibold">{stat.label}</div>
                <div className="text-xs sm:text-sm font-bold text-blue-800 mt-0.5 truncate">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold mb-2">
              Overview &amp; Objectives
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              {project.description}
            </p>
          </div>

          {/* Key Architectural Highlights / Details */}
          {project.details && project.details.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold mb-3">
                Key Technical Highlights &amp; Implementation
              </h4>
              <ul className="space-y-2.5">
                {project.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold mb-2">
              Technologies &amp; Frameworks
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-mono bg-sky-50 border border-sky-200 text-blue-800 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-slate-50 border-t border-sky-100 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-600 font-medium">
            {project.metrics}
          </span>
          <div className="flex items-center gap-3">
            <a
              href={project.githubUrl || 'https://github.com/Panth3749'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>Explore Code on GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
