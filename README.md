# Panth Mistry — AI Developer & Systems Architect Portfolio

High-performance, interactive personal portfolio website showcasing artificial intelligence projects, WebGL shaders, systems engineering, and interactive 3D simulations.

## 🚀 Tech Stack

- **Framework**: React 18 + Vite 6 + TypeScript
- **Styling**: Tailwind CSS + Custom Design System
- **Graphics & 3D**: Three.js + WebGL GLSL Shaders + OGL
- **Smooth Scrolling**: Lenis (60–120 FPS synchronized glide)
- **Icons & Animation**: Lucide React + Framer Motion + Canvas Confetti

---

## 🛠️ Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build locally**:
   ```bash
   npm run preview
   ```

---

## 🌐 Deploy to Render (Recommended: Static Site)

This project is pre-configured with `render.yaml` for zero-configuration deployment on Render.

### Option 1: Automatic Blueprint Deployment (Easiest)

1. Push this project to your GitHub or GitLab account:
   ```bash
   git add .
   git commit -m "feat: prepare portfolio for Render deployment"
   git remote add origin https://github.com/YOUR_USERNAME/panth-portfolio.git
   git branch -M main
   git push -u origin main
   ```
2. Log into [Render Dashboard](https://dashboard.render.com).
3. Click **New +** $\rightarrow$ **Blueprint**.
4. Connect your repository. Render will automatically read `render.yaml` and configure:
   - **Service Type**: Static Site (Free tier, global CDN, instant loading, no cold starts)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `./dist`
   - **SPA Route Rewrite**: `/*` $\rightarrow$ `/index.html` (prevents 404 on page refresh)
5. Click **Apply**. Your portfolio will be live in 1–2 minutes with automatic HTTPS!

---

### Option 2: Manual Static Site Setup on Render

If you prefer setting it up manually without Blueprints:

1. In [Render Dashboard](https://dashboard.render.com), click **New +** $\rightarrow$ **Static Site**.
2. Connect your Git repository.
3. Configure the following settings:
   - **Name**: `panth-portfolio` (or your preferred name)
   - **Branch**: `main`
   - **Root Directory**: *(leave blank)*
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Advanced** / **Redirects & Rewrites**:
   - Add a rewrite rule:
     - **Type**: `Rewrite`
     - **Source**: `/*`
     - **Destination**: `/index.html`
5. Click **Create Static Site**.

---

## 📄 License
MIT © Panth Mistry
