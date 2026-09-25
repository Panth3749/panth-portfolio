import React, { useState } from 'react';
import { Mail, Phone, MapPin, Copy, Check, Send, Sparkles, ArrowUpRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../icons/SocialIcons';
import confetti from 'canvas-confetti';
import { personalProfile } from '../../data/portfolioData';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roleOrProject: 'AI / Software Internship',
    message: ''
  });

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalProfile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(personalProfile.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Trigger celebratory theme-colored confetti (azure, sky blue, beige, white, royal blue)
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#38bdf8', '#bae6fd', '#f5efe6', '#ffffff']
        });
      } catch (err) {
        // graceful fallback if canvas-confetti is not rendered
      }
    }, 600);
  };

  return (
    <section id="contact" className="py-24 sm:py-32 relative">
      {/* Background Soft Sky Blue & Royal Blue Glows */}
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-blue-300/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 bg-sky-300/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-blue-800 text-xs font-mono mb-4 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="font-semibold">07 // CONTACT &amp; COLLABORATION</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight leading-tight">
            Let's Discuss Opportunities &amp; <span className="text-gradient-mono">Innovations</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Interested in hiring, collaborating on an AI / Game project, or discussing engineering challenges?
            Reach out directly or send a message below.
          </p>
        </div>

        {/* Two-Column Grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-sky-200/80 space-y-6 shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  Direct Coordinates
                </h3>
                <p className="text-xs text-slate-600 mt-1 font-normal">
                  Always open to tech conversations, internships, and forward-thinking collaborations.
                </p>
              </div>

              {/* Email Card with 1-click Copy */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-xs">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold">Email Address</div>
                    <a
                      href={`mailto:${personalProfile.email}`}
                      className="text-xs sm:text-sm font-mono text-blue-900 font-semibold hover:text-blue-700 transition-colors"
                    >
                      {personalProfile.email}
                    </a>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded-xl bg-white hover:bg-sky-100 text-blue-700 border border-sky-200 transition-all text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[10px] font-mono font-medium">{copiedEmail ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Phone Card with 1-click Copy */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-xs">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold">Phone &amp; WhatsApp</div>
                    <a
                      href={`tel:${personalProfile.phone.replace(/\s+/g, '')}`}
                      className="text-xs sm:text-sm font-mono text-blue-900 font-semibold hover:text-blue-700 transition-colors"
                    >
                      {personalProfile.phone}
                    </a>
                  </div>
                </div>

                <button
                  onClick={handleCopyPhone}
                  className="p-2 rounded-xl bg-white hover:bg-sky-100 text-blue-700 border border-sky-200 transition-all text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                  title="Copy phone number to clipboard"
                >
                  {copiedPhone ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[10px] font-mono font-medium">{copiedPhone ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Location Card */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 flex items-center gap-3 shadow-xs">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold">Current Location</div>
                  <div className="text-xs sm:text-sm font-mono text-slate-900 font-medium">
                    {personalProfile.location}
                  </div>
                </div>
              </div>

              {/* Social Profiles */}
              <div className="pt-2 border-t border-sky-100">
                <div className="text-xs font-mono uppercase text-slate-600 font-semibold mb-3">
                  Social &amp; Code Repositories
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={personalProfile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-2xl bg-white hover:bg-sky-50 border border-sky-200 text-slate-800 hover:text-blue-700 transition-all flex items-center justify-between shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <GithubIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-mono font-medium">GitHub</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                  </a>

                  <a
                    href={personalProfile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-2xl bg-white hover:bg-sky-50 border border-sky-200 text-slate-800 hover:text-blue-700 transition-all flex items-center justify-between shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <LinkedinIcon className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-mono font-medium">LinkedIn</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-sky-200/80 relative shadow-sm">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-slate-900">
                    Message Dispatched Successfully!
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto font-normal leading-relaxed">
                    Thank you for reaching out, <span className="font-bold text-slate-900">{formData.name}</span>. 
                    Panth will review your inquiry regarding <span className="font-mono text-xs text-blue-700 font-semibold">"{formData.roleOrProject}"</span> and respond promptly.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        roleOrProject: 'AI / Software Internship',
                        message: ''
                      });
                    }}
                    className="mt-4 px-6 py-2.5 rounded-full text-xs font-mono text-blue-700 font-semibold border border-sky-200 hover:bg-sky-50 transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="font-display font-bold text-xl text-slate-900">
                      Send Panth a Direct Message
                    </h3>
                    <p className="text-xs font-mono text-slate-600 mt-1">
                      Inquire about internships, technical roles, or project collaborations.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-700 font-medium">Your Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Hunter"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-white border border-sky-200 text-slate-900 text-xs font-mono placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-xs transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-700 font-medium">Your Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. alex@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl bg-white border border-sky-200 text-slate-900 text-xs font-mono placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-xs transition-colors"
                      />
                    </div>
                  </div>

                  {/* Topic Select */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-700 font-medium">Inquiry Purpose / Topic</label>
                    <select
                      value={formData.roleOrProject}
                      onChange={(e) => setFormData({ ...formData, roleOrProject: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-sky-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-blue-500 shadow-xs transition-colors cursor-pointer"
                    >
                      <option value="AI / Software Internship">AI / Software Internship Opportunity</option>
                      <option value="Full-Time / Junior Developer Role">Full-Time / Junior Developer Role</option>
                      <option value="Project Collaboration / Freelance">Project Collaboration / Freelance</option>
                      <option value="Game Development & Game Jam">Game Development / Game Jam Team</option>
                      <option value="Technical Networking & Advice">Technical Networking &amp; Advice</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-700 font-medium">Your Message</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Hi Panth, I saw your portfolio and would like to discuss..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-sky-200 text-slate-900 text-xs font-mono placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-xs transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 text-white font-semibold text-xs uppercase tracking-wider hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <span>Send Message to Panth</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
