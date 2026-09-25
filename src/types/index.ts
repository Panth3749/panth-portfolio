export interface PersonalProfile {
  name: string;
  tagline: string;
  status: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
  resumeFilename: string;
  careerObjective: string;
  strengths: string[];
  languages: { language: string; proficiency: string }[];
}

export interface ProjectStat {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'All' | 'AI & Data' | 'Game Dev & Web' | 'Mobile Apps' | 'Creative Tech';
  tags: string[];
  metrics: string;
  featured: boolean;
  image: string;
  stats: ProjectStat[];
  githubUrl?: string;
  liveDemoUrl?: string;
  details?: string[];
}

export interface SkillItem {
  name: string;
  level: number;
  highlight?: boolean;
}

export interface SkillCategory {
  title: string;
  description: string;
  icon: 'Terminal' | 'Layers' | 'Server' | 'Sparkles';
  skills: SkillItem[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  type: 'Education' | 'Game Jam & Competition' | 'Certification' | 'Project Work';
  description: string;
  achievements: string[];
  techStack: string[];
}

export interface Certification {
  title: string;
  year: string;
  category: string;
  issuer?: string;
  verified?: boolean;
}

export interface Competition {
  name: string;
  year: string;
  role: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
}

export interface FerrofluidPreset {
  id: string;
  name: string;
  description: string;
  colors: string[];
  speed: number;
  scale: number;
  turbulence: number;
  fluidity: number;
  sharpness: number;
  shimmer: number;
  glow: number;
  flowDirection: 'up' | 'down' | 'left' | 'right';
}
