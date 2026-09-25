import {
  PersonalProfile,
  Project,
  SkillCategory,
  ExperienceItem,
  Certification,
  Competition,
  Testimonial,
  FerrofluidPreset
} from '../types';

export const personalProfile: PersonalProfile = {
  name: "Panth Mistry",
  tagline: "Aspiring AI Developer & Computer Science Engineer",
  status: "Open for AI & Software Internships / Roles",
  location: "Vadodara, Gujarat, India",
  email: "panthmistry3749@gmail.com",
  phone: "+91 6353860725",
  github: "https://github.com/Panth3749",
  linkedin: "https://www.linkedin.com/in/panth-mistry-1003283ab/",
  resumeUrl: "/Panth_Mistry_Resume.pdf",
  resumeFilename: "Panth_Mistry_Resume.pdf",
  careerObjective:
    "To pursue a B.Tech in Artificial Intelligence and build a successful career as a Full Time AI Developer by leveraging technical skills, creativity, and passion for solving real-world problems.",
  strengths: [
    "Quick Learner",
    "Problem Solving",
    "Team Collaboration",
    "Creativity",
    "Time Management",
    "Continuous Learning"
  ],
  languages: [
    { language: "English", proficiency: "Professional Working" },
    { language: "Hindi", proficiency: "Fluent" },
    { language: "Gujarati", proficiency: "Native" }
  ]
};

export const ferrofluidPresets: FerrofluidPreset[] = [
  {
    id: "azure-horizon",
    name: "Azure Horizon",
    description: "Living ripples of sky blue, light blue, warm white, and royal dark blue",
    colors: ["#FFFFFF", "#FAF8F5", "#BAE6FD", "#38BDF8", "#2563EB", "#1D4ED8", "#1E3A8A", "#172554"],
    speed: 0.45,
    scale: 1.5,
    turbulence: 0.95,
    fluidity: 0.12,
    sharpness: 2.8,
    shimmer: 1.6,
    glow: 2.2,
    flowDirection: "down"
  },
  {
    id: "ivory-cerulean",
    name: "Ivory & Cerulean",
    description: "Warm ivory silk flowing into deep cerulean and royal dark blue ribbons",
    colors: ["#FFFFFF", "#FFFDF8", "#BAE6FD", "#38BDF8", "#0284C7", "#1D4ED8", "#1E3A8A", "#0F2347"],
    speed: 0.4,
    scale: 1.6,
    turbulence: 1.05,
    fluidity: 0.1,
    sharpness: 3.0,
    shimmer: 1.8,
    glow: 2.4,
    flowDirection: "down"
  },
  {
    id: "sky-ripple",
    name: "Sky Ripple",
    description: "Bright sky blue waves with luminous pure white crests and royal dark blue",
    colors: ["#FFFFFF", "#F8F5EE", "#BAE6FD", "#7DD3FC", "#38BDF8", "#2563EB", "#1D4ED8", "#1E3A8A"],
    speed: 0.48,
    scale: 1.55,
    turbulence: 0.9,
    fluidity: 0.14,
    sharpness: 2.6,
    shimmer: 1.5,
    glow: 2.0,
    flowDirection: "up"
  },
  {
    id: "beige-silk",
    name: "Beige Silk & Royal Flow",
    description: "Soft warm beige and milk white streams blended with electric and royal dark blue",
    colors: ["#FFFFFF", "#FAF7EE", "#E0F2FE", "#93C5FD", "#38BDF8", "#2563EB", "#1E3A8A", "#172554"],
    speed: 0.52,
    scale: 1.65,
    turbulence: 1.15,
    fluidity: 0.11,
    sharpness: 2.9,
    shimmer: 2.0,
    glow: 2.5,
    flowDirection: "right"
  }
];

export const projects: Project[] = [
  {
    id: "smart-vehicle-reminder",
    title: "Smart Vehicle Service Reminder App",
    tagline: "Android maintenance assistant with automated alerts & history tracking",
    description:
      "A comprehensive Android application engineered to help vehicle owners maintain their vehicles proactively. Features automated mileage & date-based service schedules, real-time push alerts, expense logs, and service history tracking backed by Firebase.",
    category: "Mobile Apps",
    tags: ["Java", "Android XML", "Firebase", "Mobile Dev", "Push Notifications"],
    metrics: "Automated Reminders & History Tracking",
    featured: true,
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { label: "Platform", value: "Android / Java" },
      { label: "Database", value: "Firebase Realtime" },
      { label: "Alerts", value: "Push Notifications" }
    ],
    githubUrl: "https://github.com/Panth3749",
    details: [
      "Engineered automated reminder calculations based on odometer reading and elapsed service intervals.",
      "Integrated Firebase Cloud Messaging for persistent notification scheduling even when the app is in the background.",
      "Designed clean XML user interfaces adhering to Android Material Design guidelines.",
      "Implemented local offline cache with cloud synchronization for vehicle service receipts and history."
    ]
  },
  {
    id: "troll-adventure-game",
    title: "Troll Adventure (2D Platformer Game)",
    tagline: "Multi-level browser platformer with custom enemy AI & physics",
    description:
      "A fun and highly engaging 2D platformer game built entirely from scratch without game engines, utilizing vanilla JavaScript and HTML5 Canvas. Features custom physics, responsive enemy pathfinding, obstacle hitboxes, and progressive difficulty levels.",
    category: "Game Dev & Web",
    tags: ["JavaScript", "HTML5 Canvas", "CSS3", "Game Physics", "Enemy AI"],
    metrics: "Custom Vanilla JS Physics & AI Engine",
    featured: true,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { label: "Engine", value: "Vanilla JavaScript" },
      { label: "Mechanics", value: "Dynamic Enemy AI" },
      { label: "Genre", value: "2D Platformer" }
    ],
    githubUrl: "https://github.com/Panth3749",
    details: [
      "Built custom 2D collision detection and gravity acceleration physics from scratch.",
      "Designed intelligent enemy patrol and chase logic based on player proximity and line of sight.",
      "Created multi-stage level architecture with checkpointing and score systems.",
      "Optimized 60 FPS Canvas rendering loop with requestAnimationFrame and sprite animation sheets."
    ]
  },
  {
    id: "castle-warrior-game",
    title: "Castle Warrior (Action Game)",
    tagline: "Action-packed combat and mission game built during college Game Jam",
    description:
      "An action-packed browser game where the warrior battles oncoming enemy hordes, gathers vital equipment, defends castle gates, and completes tactical missions. Built and presented live during the university Game Jam competition.",
    category: "Game Dev & Web",
    tags: ["JavaScript", "HTML5", "CSS3", "Game Jam", "Combat Engine"],
    metrics: "College Game Jam Project",
    featured: true,
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { label: "Originated", value: "College Game Jam" },
      { label: "Genre", value: "Action / Adventure" },
      { label: "Missions", value: "Wave Defense & Quests" }
    ],
    githubUrl: "https://github.com/Panth3749",
    details: [
      "Engineered during the fast-paced college Game Jam countdown under tight time constraints.",
      "Implemented wave-based enemy spawn algorithms with escalating health and attack attributes.",
      "Crafted player combat mechanics including melee swing arcs, shield blocks, and health restoration.",
      "Received praise from faculty and peers for rapid game logic execution and fluid controls."
    ]
  },
  {
    id: "ferrofluid-shader-lab",
    title: "Kexsio Ferrofluid WebGL Lab",
    tagline: "Mathematical magnetic liquid simulation with interactive shaders",
    description:
      "Hardware-accelerated mathematical fluid shader simulating magnetic ferrofluid dynamics in high definition. Features real-time pointer interaction, multi-octave Value & Derivative procedural noise, dynamic palette interpolation, and specular rim lighting.",
    category: "Creative Tech",
    tags: ["WebGL", "GLSL", "OGL", "React", "TypeScript", "Procedural Math"],
    metrics: "60 FPS Hardware-Accelerated",
    featured: true,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { label: "Shader", value: "GLSL Procedural" },
      { label: "Performance", value: "60 FPS 4K" },
      { label: "Interaction", value: "Pointer Distortion" }
    ],
    githubUrl: "https://github.com/Panth3749",
    details: [
      "Written in custom GLSL fragment shader utilizing Value Noise (`vn`) and Derivative Band Noise (`dbn`).",
      "Calculates smooth-minimum (`smin`) mathematical blending between competing fluid turbulence wavefields.",
      "Integrates pointer interaction with smooth exponential dampening for reactive fluid splashing.",
      "Supports dynamic color palette uniform arrays for real-time theme and contrast customization."
    ]
  },
  {
    id: "gemini-labs-ai",
    title: "Google Gemini Labs & LLM Studio",
    tagline: "Explorations in Large Language Models & Prompt Engineering",
    description:
      "A suite of generative AI workflows, prompt-engineered pipelines, and multimodal experiment modules developed during Google Gemini Labs sessions. Explores chain-of-thought problem solving, automated code analysis, and assistive AI agents.",
    category: "AI & Data",
    tags: ["Google Gemini", "Python", "LLMs", "Prompt Engineering", "AI Labs"],
    metrics: "Google Gemini Labs Certified",
    featured: false,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { label: "Core AI", value: "Google Gemini" },
      { label: "Certificate", value: "LLM Learning" },
      { label: "Focus", value: "AI Workflows & Agents" }
    ],
    githubUrl: "https://github.com/Panth3749",
    details: [
      "Experimented with zero-shot, few-shot, and structured output formatting in Gemini API.",
      "Explored prompt tuning for automated code debugging and algorithmic verification.",
      "Built interactive proof-of-concept AI tools bridging natural language prompts to structured logic.",
      "Awarded official certificate for LLM learning and generative AI competency."
    ]
  },
  {
    id: "data-analytics-modeling",
    title: "Data Analytics & Insights Dashboard",
    tagline: "Statistical analysis, trend prediction & data visualization",
    description:
      "Analytical dashboards and statistical data modeling developed using Python (Pandas, Matplotlib) and advanced Microsoft Excel. Formulates descriptive statistics, trend forecasting, variance analysis, and visual representations of multi-dimensional business datasets.",
    category: "AI & Data",
    tags: ["Python", "Microsoft Excel", "Data Analysis", "Visualization", "Statistics"],
    metrics: "Data Analytics Certified 2026",
    featured: false,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    stats: [
      { label: "Tools", value: "Python + Excel" },
      { label: "Certified", value: "Year 2026" },
      { label: "Outcome", value: "Visual Reports & Trends" }
    ],
    githubUrl: "https://github.com/Panth3749",
    details: [
      "Extracted, cleansed, and normalized complex tabular records using Python scripts.",
      "Implemented statistical regression and moving average forecasts for time-series data.",
      "Engineered automated Excel dashboards featuring dynamic pivot tables, VLOOKUP/XLOOKUP, and conditional heatmaps.",
      "Completed official Data Analytics certification validating data handling and presentation mastery."
    ]
  }
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Programming Languages",
    description: "Core languages utilized for software development, game logic, and algorithms.",
    icon: "Terminal",
    skills: [
      { name: "Python", level: 92, highlight: true },
      { name: "C++", level: 88, highlight: true },
      { name: "JavaScript", level: 85, highlight: true },
      { name: "HTML5", level: 95 },
      { name: "CSS3", level: 90 }
    ]
  },
  {
    title: "Tools & Platforms",
    description: "Modern development environments, design platforms, and AI tooling.",
    icon: "Layers",
    skills: [
      { name: "Figma (UI/UX App Design)", level: 88, highlight: true },
      { name: "VS Code & Dev Environment", level: 95 },
      { name: "Git & GitHub", level: 86, highlight: true },
      { name: "Google Gemini & AI Tools", level: 90, highlight: true },
      { name: "Microsoft Excel (Data Analysis)", level: 84 }
    ]
  },
  {
    title: "Computer Science Fundamentals",
    description: "Rigorous engineering foundations from Diploma curriculum at ITM SLS Baroda University.",
    icon: "Server",
    skills: [
      { name: "Data Structures & Algorithms (DSA)", level: 88, highlight: true },
      { name: "Object-Oriented Programming (OOPs)", level: 90, highlight: true },
      { name: "Database Management Systems (DBMS)", level: 85 },
      { name: "Operating Systems (OS)", level: 84 },
      { name: "Artificial Intelligence Fundamentals", level: 89, highlight: true }
    ]
  },
  {
    title: "Game Development & Creative Tech",
    description: "Interactive game mechanics, enemy behaviors, and shader simulations.",
    icon: "Sparkles",
    skills: [
      { name: "Vanilla JS Game Engines", level: 88, highlight: true },
      { name: "Enemy AI & Path Logic", level: 85, highlight: true },
      { name: "Collision & Physics Systems", level: 86 },
      { name: "WebGL & GLSL Shaders", level: 84 },
      { name: "Game Jam Rapid Prototyping", level: 92, highlight: true }
    ]
  }
];

export const experienceItems: ExperienceItem[] = [
  {
    id: "exp-edu-1",
    role: "Diploma in Computer Science & Engineering (3rd Year, 5th Sem)",
    company: "ITM SLS Baroda University, Gujarat, India",
    period: "2024 – 2027 (Expected)",
    location: "Vadodara, Gujarat",
    type: "Education",
    description:
      "Pursuing a comprehensive Diploma curriculum in Computer Science and Engineering. Dedicated to mastering foundational and advanced computing disciplines, problem-solving, and preparing for B.Tech in Artificial Intelligence.",
    achievements: [
      "Core coursework: Data Structures, Algorithms, OOPs (C++/Java), DBMS, OS, and AI Fundamentals",
      "Consistently developing practical software solutions, games, and analytical models",
      "Active participant in university Game Jams, Hackathons, and Design competitions"
    ],
    techStack: ["Python", "C++", "JavaScript", "HTML/CSS", "DSA", "DBMS", "OS"]
  },
  {
    id: "exp-comp-2",
    role: "Game Jam 2026 & Designathon 2026 Competitor",
    company: "Hackathons & Competitions",
    period: "2026",
    location: "Vadodara, India",
    type: "Game Jam & Competition",
    description:
      "Participated in intense university and regional hackathons/game jams creating playable games and prototype designs under strict countdown constraints.",
    achievements: [
      "Engineered game mechanics, interactive physics, and enemy AI logic within competition timeframes",
      "Competed in Figma App Designing Competition, creating user-centric mobile UI concepts",
      "Earned Designathon 2026 and Data Analytics 2026 recognition"
    ],
    techStack: ["JavaScript", "Figma", "Game AI", "HTML5 Canvas", "UI/UX"]
  },
  {
    id: "exp-comp-3",
    role: "Game Jam 2025 Developer & Google Gemini Labs Participant",
    company: "Game Jam & AI Labs",
    period: "2025",
    location: "India",
    type: "Game Jam & Competition",
    description:
      "Built Castle Warrior action game for college Game Jam and engaged in Google Gemini Labs to explore generative AI applications.",
    achievements: [
      'Developed "Castle Warrior" action game featuring custom combat and mission progression',
      "Explored Large Language Models, prompt tuning, and generative AI during Google Gemini Labs",
      "Completed LLM Learning certification and practical AI challenges"
    ],
    techStack: ["JavaScript", "HTML/CSS", "Google Gemini", "Prompt Engineering", "LLMs"]
  },
  {
    id: "exp-cert-4",
    role: "Computer Coding Foundation & Data Analytics",
    company: "Technical Certifications",
    period: "2024 – 2026",
    location: "India",
    type: "Certification",
    description:
      "Completed comprehensive coding certifications and hands-on data analytics coursework.",
    achievements: [
      "Completed Computer Coding Course (2024) establishing strong programming principles",
      "Achieved Data Analytics Certificate (2026) mastering Python and Excel statistical analysis",
      "Built Smart Vehicle Service Reminder Android application using Java, XML, and Firebase"
    ],
    techStack: ["Java", "Firebase", "Python", "Excel", "Data Analysis"]
  }
];

export const certifications: Certification[] = [
  {
    title: "Data Analytics Certificate",
    year: "2026",
    category: "Data & Analytics",
    issuer: "Certified Technical Institute",
    verified: true
  },
  {
    title: "LLM Learning Certificate",
    year: "2025/2026",
    category: "Artificial Intelligence",
    issuer: "Google Gemini Labs / AI Education",
    verified: true
  },
  {
    title: "Game Jam 2026 Award",
    year: "2026",
    category: "Game Development",
    issuer: "University Game Jam Committee",
    verified: true
  },
  {
    title: "Designathon 2026 Recognition",
    year: "2026",
    category: "UI/UX Design",
    issuer: "Designathon Summit",
    verified: true
  },
  {
    title: "Game Jam 2025 Finalist",
    year: "2025",
    category: "Game Development",
    issuer: "College Tech Fest",
    verified: true
  },
  {
    title: "Computer Coding Course",
    year: "2024",
    category: "Programming Foundations",
    issuer: "Computer Science Academy",
    verified: true
  }
];

export const competitions: Competition[] = [
  {
    name: "Google Gemini Labs",
    year: "2025/2026",
    role: "Participant & Explorer"
  },
  {
    name: "Game Jam 2026",
    year: "2026",
    role: "Game Developer & Builder"
  },
  {
    name: "Game Jam 2025",
    year: "2025",
    role: "Game Developer"
  },
  {
    name: "Figma App Designing Competition",
    year: "2025/2026",
    role: "UI/UX Competitor"
  }
];

export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    quote:
      "Panth is an exceptionally motivated developer with a genuine curiosity for Artificial Intelligence and game mechanics. His ability to quickly learn new frameworks and build working games and Android apps in record time is remarkable.",
    author: "Faculty Mentor",
    role: "Department of Computer Science",
    company: "ITM SLS Baroda University",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "t-2",
    quote:
      "During Game Jam, Panth built Castle Warrior with impressive speed, enemy AI logic, and responsive controls. He is a fantastic team collaborator who solves tricky bugs with calm focus.",
    author: "Game Jam Peer & Collaborator",
    role: "College Game Jam Co-Participant",
    company: "Game Jam 2025/2026",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "t-3",
    quote:
      "Panth's commitment to continuous learning — from Google Gemini Labs to Data Analytics and Figma app design — shows the clear mindset and disciplined work ethic of a future AI leader.",
    author: "Designathon Coordinator",
    role: "Lead Evaluator",
    company: "Designathon & Tech Summit",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80"
  }
];
