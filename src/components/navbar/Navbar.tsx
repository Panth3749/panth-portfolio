import React, { useState, useEffect } from 'react';
import { Menu, X, FileText, ArrowUpRight } from 'lucide-react';
import { personalProfile } from '../../data/portfolioData';
import { scrollTo } from '../../utils/smoothScroll';

interface NavbarProps {
  onContactClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onContactClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Journey', href: '#journey' },
    { label: 'Certificates', href: '#certifications' },
    { label: 'Contact', href: '#contact' }
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    window.dispatchEvent(new CustomEvent('expand-hero'));
    setTimeout(() => {
      scrollTo(href, -70);
    }, 60);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollTo(0);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav py-3 shadow-2xl shadow-black/80' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={handleLogoClick}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-white p-[1px] shadow-lg group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-[#050507] rounded-xl flex items-center justify-center">
                <span className="font-kraton text-base tracking-wider text-white">
                  P&amp;P
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-kraton text-xl text-white group-hover:text-sky-300 transition-colors tracking-wide">
                  P&amp;P Studio
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30 font-semibold tracking-wider">
                  PANTH
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono -mt-0.5">
                AI Developer &bull; CSE Engineer
              </p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-inner">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-xs lg:text-sm font-medium text-zinc-300 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/10 transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={personalProfile.resumeUrl}
              download={personalProfile.resumeFilename}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full glass-panel text-xs font-mono text-zinc-200 hover:text-white border border-white/15 hover:border-white/40 transition-all"
              title="Download Resume PDF"
            >
              <FileText className="w-3.5 h-3.5 text-zinc-300" />
              <span>Resume PDF</span>
            </a>

            <button
              onClick={onContactClick}
              className="px-4 py-2 rounded-full bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all shadow-md hover:scale-105 active:scale-95"
            >
              Contact Me
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 mt-3 px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-base font-medium text-zinc-200 hover:text-white py-1.5 border-b border-white/5 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-500" />
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href={personalProfile.resumeUrl}
              download={personalProfile.resumeFilename}
              className="w-full py-2.5 px-4 rounded-xl glass-panel text-zinc-200 font-mono text-xs flex items-center justify-center gap-2 border border-white/20"
            >
              <FileText className="w-4 h-4 text-zinc-300" />
              <span>Download Resume PDF</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onContactClick();
              }}
              className="w-full py-3 px-5 rounded-xl bg-white text-black font-semibold text-sm flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Get in Touch</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
