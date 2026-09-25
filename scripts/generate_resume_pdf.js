import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const resumeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Panth Mistry - Resume</title>
  <style>
    @page {
      size: A4;
      margin: 11mm 13mm 11mm 13mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.40;
      font-size: 9.6pt;
      -webkit-font-smoothing: antialiased;
    }

    /* ── HEADER ── */
    .header {
      text-align: center;
      padding-bottom: 9px;
      border-bottom: 2px solid #1e3a8a;
      margin-bottom: 11px;
    }
    .name {
      font-size: 24pt;
      font-weight: 800;
      letter-spacing: -0.025em;
      color: #0f172a;
      text-transform: uppercase;
      line-height: 1.08;
    }
    .headline {
      font-size: 10.2pt;
      font-weight: 600;
      color: #1e3a8a;
      margin-top: 4px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .contact-bar {
      margin-top: 6px;
      display: flex;
      justify-content: center;
      flex-wrap: nowrap;
      align-items: center;
      gap: 10px;
      font-size: 8.3pt;
      color: #475569;
    }
    .contact-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: #334155;
      text-decoration: none;
    }
    .contact-item svg {
      width: 12px;
      height: 12px;
      color: #1e3a8a;
      flex-shrink: 0;
    }
    .contact-item a {
      color: #1e3a8a;
      text-decoration: none;
      font-weight: 500;
    }
    .contact-sep {
      color: #cbd5e1;
      font-size: 8pt;
    }

    /* ── SECTIONS ── */
    .section {
      margin-bottom: 10px;
    }
    .section-title {
      font-size: 9.8pt;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      border-bottom: 1.5px solid #1e3a8a;
      padding-bottom: 2px;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
    }

    /* ── SUMMARY ── */
    .summary-text {
      font-size: 9.1pt;
      color: #334155;
      line-height: 1.42;
      text-align: justify;
    }

    /* ── ENTRY BLOCKS ── */
    .entry {
      margin-bottom: 7px;
    }
    .entry:last-child {
      margin-bottom: 0;
    }
    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 9.6pt;
    }
    .entry-title {
      font-weight: 700;
      color: #0f172a;
    }
    .entry-title .role-accent {
      color: #1e3a8a;
      font-weight: 600;
    }
    .entry-date {
      font-size: 8.6pt;
      font-weight: 600;
      color: #64748b;
      white-space: nowrap;
    }
    .entry-subtitle {
      font-size: 8.7pt;
      color: #475569;
      display: flex;
      justify-content: space-between;
      margin-top: 1px;
    }
    .entry-tech {
      font-size: 8.2pt;
      font-weight: 600;
      color: #1d4ed8;
      white-space: nowrap;
    }

    /* ── BULLET LISTS ── */
    .bullets {
      list-style-type: none;
      margin-top: 2px;
      padding-left: 0;
    }
    .bullets li {
      position: relative;
      padding-left: 12px;
      font-size: 8.8pt;
      color: #334155;
      line-height: 1.35;
      margin-bottom: 2px;
    }
    .bullets li::before {
      content: "•";
      position: absolute;
      left: 2px;
      color: #1e3a8a;
      font-weight: bold;
      font-size: 10pt;
      line-height: 1;
      top: -1px;
    }

    /* ── SKILLS TABLE ── */
    .skills-grid {
      display: grid;
      grid-template-columns: 155px 1fr;
      row-gap: 3.5px;
      column-gap: 8px;
      font-size: 8.8pt;
    }
    .skill-cat {
      font-weight: 700;
      color: #0f172a;
    }
    .skill-items {
      color: #334155;
    }

    /* ── TWO-COLUMN GRID FOR CERTIFICATIONS & PARTICIPATION ── */
    .split-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 18px;
    }

    /* ── CERTIFICATIONS & ACHIEVEMENTS LIST ── */
    .compact-list {
      list-style-type: none;
      padding-left: 0;
    }
    .compact-list li {
      position: relative;
      padding-left: 11px;
      font-size: 8.6pt;
      color: #334155;
      line-height: 1.36;
      margin-bottom: 2.5px;
    }
    .compact-list li::before {
      content: "▪";
      position: absolute;
      left: 1px;
      color: #1e3a8a;
      font-size: 7.5pt;
      top: 1px;
    }
    .compact-list .year-tag {
      font-size: 8.2pt;
      font-weight: 600;
      color: #64748b;
      margin-left: 4px;
    }

    /* ── BOTTOM INFO ── */
    .additional-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 18px;
      font-size: 8.8pt;
      margin-top: 1px;
    }
    .additional-col {
      color: #334155;
    }
    .additional-col strong {
      color: #0f172a;
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <header class="header">
    <h1 class="name">PANTH MISTRY</h1>
    <div class="headline">Computer Science &amp; Engineering &bull; Aspiring AI Developer</div>
    <div class="contact-bar">
      <!-- Email -->
      <a class="contact-item" href="mailto:panthmistry3749@gmail.com">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        <span>panthmistry3749@gmail.com</span>
      </a>
      <span class="contact-sep">&bull;</span>

      <!-- Phone -->
      <a class="contact-item" href="tel:+916353860725">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        <span>+91 6353860725</span>
      </a>
      <span class="contact-sep">&bull;</span>

      <!-- Location -->
      <span class="contact-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        <span>Vadodara, Gujarat, India</span>
      </span>
      <span class="contact-sep">&bull;</span>

      <!-- LinkedIn -->
      <a class="contact-item" href="https://linkedin.com/in/panth-mistry-1003283ab/" target="_blank">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
        <span>linkedin.com/in/panth-mistry</span>
      </a>
      <span class="contact-sep">&bull;</span>

      <!-- GitHub -->
      <a class="contact-item" href="https://github.com/Panth3749" target="_blank">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
        <span>github.com/Panth3749</span>
      </a>
    </div>
  </header>

  <!-- PROFESSIONAL SUMMARY -->
  <section class="section">
    <div class="section-title">Professional Summary</div>
    <p class="summary-text">
      Driven Computer Science &amp; Engineering student at ITM SLS Baroda University with rigorous foundations in algorithmic problem solving, object-oriented design, and systems development. Passionate about Artificial Intelligence, large language models, and high-performance graphics engines. Experienced in building native Android applications with Firebase, custom browser game physics engines from scratch in Vanilla JavaScript, and procedural WebGL/GLSL shader pipelines. Actively targeting a B.Tech in Artificial Intelligence to engineer intelligent, production-ready software platforms.
    </p>
  </section>

  <!-- EDUCATION -->
  <section class="section">
    <div class="section-title">Education</div>
    <div class="entry">
      <div class="entry-header">
        <span class="entry-title">ITM SLS Baroda University</span>
        <span class="entry-date">2024 &ndash; 2027 (Expected)</span>
      </div>
      <div class="entry-subtitle">
        <span><strong>Diploma in Computer Science &amp; Engineering</strong> &bull; 3rd Year (5th Semester)</span>
        <span>Vadodara, Gujarat, India</span>
      </div>
      <ul class="bullets">
        <li><strong>Core Coursework:</strong> Data Structures &amp; Algorithms (DSA), Object-Oriented Programming (OOPs in C++/Java), Database Management Systems (DBMS), Operating Systems (OS), and Artificial Intelligence Fundamentals.</li>
        <li><strong>Academic Trajectory:</strong> Preparing for B.Tech in Artificial Intelligence with a dedication to machine learning, neural architectures, and intelligent systems.</li>
      </ul>
    </div>
  </section>

  <!-- TECHNICAL SKILLS -->
  <section class="section">
    <div class="section-title">Technical Skills</div>
    <div class="skills-grid">
      <div class="skill-cat">Programming Languages:</div>
      <div class="skill-items">Python, C++, JavaScript (ES6+), Java, SQL, HTML5, CSS3</div>

      <div class="skill-cat">AI &amp; Data Analysis:</div>
      <div class="skill-items">Google Gemini API, Prompt Engineering, Large Language Models (LLMs), Pandas, Statistical Data Modeling, Advanced Microsoft Excel</div>

      <div class="skill-cat">Tools &amp; Frameworks:</div>
      <div class="skill-items">Git, GitHub, VS Code, Android Studio, Firebase (Realtime DB &amp; FCM), Figma (UI/UX App Design)</div>

      <div class="skill-cat">Core Engineering:</div>
      <div class="skill-items">Data Structures &amp; Algorithms (DSA), Object-Oriented Design (OOPs), WebGL &amp; GLSL Shaders, 2D Collision Physics, Event-Driven Architecture</div>
    </div>
  </section>

  <!-- FEATURED PROJECTS -->
  <section class="section">
    <div class="section-title">Featured Projects</div>

    <!-- Project 1 -->
    <div class="entry">
      <div class="entry-header">
        <span class="entry-title">Smart Vehicle Service Reminder App <span class="role-accent">| Android System</span></span>
        <span class="entry-tech">Java &bull; Android XML &bull; Firebase Realtime DB &bull; FCM</span>
      </div>
      <ul class="bullets">
        <li>Engineered a proactive Android vehicle maintenance system with dynamic service interval calculations based on live odometer logs and elapsed dates.</li>
        <li>Integrated Firebase Cloud Messaging (FCM) for background automated push notifications and persistent maintenance reminders.</li>
        <li>Architected local offline storage caching with cloud synchronization for maintenance receipts and expense history.</li>
      </ul>
    </div>

    <!-- Project 2 -->
    <div class="entry">
      <div class="entry-header">
        <span class="entry-title">Troll Adventure &bull; 2D Platformer Game <span class="role-accent">| Custom Physics Engine</span></span>
        <span class="entry-tech">Vanilla JavaScript &bull; HTML5 Canvas &bull; Custom Physics</span>
      </div>
      <ul class="bullets">
        <li>Built a custom 2D browser platformer game from scratch without external game frameworks, implementing AABB collision detection and gravity acceleration.</li>
        <li>Designed enemy AI state machines with line-of-sight detection and progressive player pursuit routines.</li>
        <li>Optimized 60 FPS Canvas rendering using <span style="font-family: monospace; font-size: 8.2pt;">requestAnimationFrame</span> and animated sprite sheets.</li>
      </ul>
    </div>

    <!-- Project 3 -->
    <div class="entry">
      <div class="entry-header">
        <span class="entry-title">Castle Warrior &bull; Action Wave Defense <span class="role-accent">| College Game Jam</span></span>
        <span class="entry-tech">JavaScript &bull; HTML5 Canvas &bull; Wave AI Logic</span>
      </div>
      <ul class="bullets">
        <li>Developed an action-packed defense combat game within competition time limits during the university Game Jam.</li>
        <li>Implemented procedural wave spawn algorithms with escalating difficulty curves, melee hitboxes, and inventory mechanics.</li>
      </ul>
    </div>

    <!-- Project 4 -->
    <div class="entry">
      <div class="entry-header">
        <span class="entry-title">Ferrofluid Mathematical Shader Simulation <span class="role-accent">| Creative Tech</span></span>
        <span class="entry-tech">WebGL &bull; GLSL &bull; TypeScript &bull; Value &amp; Derivative Noise</span>
      </div>
      <ul class="bullets">
        <li>Authored hardware-accelerated GLSL fragment shaders simulating magnetic fluid turbulence and smooth-minimum wavefield blending.</li>
        <li>Maintained 60 FPS hardware acceleration with dynamic pointer interactions and specular rim lighting.</li>
      </ul>
    </div>
  </section>

  <!-- SPLIT: CERTIFICATIONS & COMPETITIONS -->
  <section class="section">
    <div class="split-row">
      <!-- Certifications -->
      <div>
        <div class="section-title">Certifications</div>
        <ul class="compact-list">
          <li><strong>Data Analytics Certificate</strong> &ndash; Statistical modeling, variance analysis &amp; regression <span class="year-tag">(2026)</span></li>
          <li><strong>LLM Learning Certificate</strong> &ndash; Google Gemini Labs prompt engineering &amp; reasoning <span class="year-tag">(2025/2026)</span></li>
          <li><strong>Computer Coding Course</strong> &ndash; Comprehensive programming foundations &amp; algorithms <span class="year-tag">(2024)</span></li>
          <li><strong>Designathon Recognition</strong> &ndash; UI/UX prototype evaluation <span class="year-tag">(2026)</span></li>
        </ul>
      </div>

      <!-- Competitions & Workshops -->
      <div>
        <div class="section-title">Workshops &amp; Honors</div>
        <ul class="compact-list">
          <li><strong>Google Gemini Labs</strong> &ndash; Hands-on prompt workflows, chain-of-thought &amp; agents</li>
          <li><strong>University Game Jam 2026</strong> &ndash; Built rapid game prototypes under strict deadlines</li>
          <li><strong>College Game Jam 2025</strong> &ndash; Developed Castle Warrior combat engine</li>
          <li><strong>Figma App Designing Competition</strong> &ndash; Mobile UI/UX architecture &amp; interaction</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- ADDITIONAL INFORMATION -->
  <section class="section" style="margin-bottom: 0;">
    <div class="section-title">Additional Information</div>
    <div class="additional-grid">
      <div class="additional-col">
        <strong>Professional Strengths:</strong> Analytical Problem Solving, Fast Learner, Systems Thinking, Team Collaboration, Disciplined Execution.
      </div>
      <div class="additional-col">
        <strong>Languages:</strong> English (Professional Working), Hindi (Fluent), Gujarati (Native).
      </div>
    </div>
  </section>

</body>
</html>
`;

async function main() {
  const tempHtmlPath = path.resolve(rootDir, 'temp_resume.html');
  const publicPdfPath = path.resolve(rootDir, 'public', 'Panth_Mistry_Resume.pdf');
  const rootPdfPath = path.resolve(rootDir, 'Panth_Mistry Resume.pdf');
  const distPdfPath = path.resolve(rootDir, 'dist', 'Panth_Mistry_Resume.pdf');

  fs.writeFileSync(tempHtmlPath, resumeHtml, 'utf8');
  console.log('Written temporary HTML to:', tempHtmlPath);

  // Look for Chrome or Edge
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  ];

  let browserPath = null;
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      browserPath = c;
      break;
    }
  }

  if (!browserPath) {
    throw new Error('Neither Chrome nor Edge was found on system.');
  }

  console.log('Using browser:', browserPath);

  const fileUrl = 'file:///' + tempHtmlPath.replace(/\\/g, '/');

  execFileSync(browserPath, [
    '--headless',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${publicPdfPath}`,
    fileUrl
  ]);

  console.log('Generated PDF at:', publicPdfPath);

  // Copy to root and dist
  fs.copyFileSync(publicPdfPath, rootPdfPath);
  console.log('Copied to:', rootPdfPath);

  if (fs.existsSync(path.resolve(rootDir, 'dist'))) {
    fs.copyFileSync(publicPdfPath, distPdfPath);
    console.log('Copied to:', distPdfPath);
  }

  // Also capture a high-res preview screenshot for inspection
  const artifactDir = 'C:\\Users\\panth\\.gemini\\antigravity\\brain\\0a9152ce-bd39-4fd7-91e6-f82b506afdae';
  const previewPngPath = path.resolve(artifactDir, 'resume_preview.png');
  try {
    execFileSync(browserPath, [
      '--headless',
      '--disable-gpu',
      '--window-size=860,1220',
      `--screenshot=${previewPngPath}`,
      fileUrl
    ]);
    console.log('Saved visual preview screenshot to:', previewPngPath);
  } catch (e) {
    console.warn('Screenshot generation skipped:', e.message);
  }

  // Clean up temp html
  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }

  console.log('Resume PDF generation successfully completed!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
