# 🚀 Render Deployment Guide — Panth Mistry Portfolio

This repository is pre-configured for zero-configuration, continuous static site deployment on **[Render.com](https://render.com/)**.

---

## ⚡ Quick Start: 1-Click Blueprint (Recommended)

1. Go to **[dashboard.render.com](https://dashboard.render.com)** and log in with GitHub (`Panth3749`).
2. Click **New +** $\rightarrow$ **Blueprint**.
3. Select this repository: **`Panth3749/panth-portfolio`**.
4. Render will detect [`render.yaml`](./render.yaml) and automatically configure:
   - **Service Type**: Static Site (Free tier, global CDN, 0 cold starts)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `./dist`
   - **SPA Routing Rewrite**: `/*` $\rightarrow$ `/index.html`
5. Click **Apply**. In ~60 seconds, your site is live!

---

## 🛠️ Alternative: Manual Dashboard Setup

1. In Render Dashboard, click **New +** $\rightarrow$ **Static Site**.
2. Connect `Panth3749/panth-portfolio`.
3. Set fields:
   - **Name**: `panth-portfolio`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Redirects/Rewrites**, add:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
5. Click **Create Static Site**.

---

## 🖥️ Alternative 2: Deploying as a Web Service on Render

If you selected **New +** $\rightarrow$ **Web Service** on Render:
1. Connect `Panth3749/panth-portfolio`.
2. Configure the fields:
   - **Name**: `panth-portfolio`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start` (or `node server.js`)
3. Click **Create Web Service**.
*(Our production `server.js` automatically binds to Render's dynamic `$PORT`, serves all assets, resumes, and handles SPA routing seamlessly!)*

---

## 🌐 Custom Domain Setup

1. In your Render service, go to **Settings** $\rightarrow$ **Custom Domains**.
2. Add your domain (e.g. `panthmistry.dev` or `panthmistry.com`).
3. Add the DNS records shown by Render in your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.):
   - `CNAME` for `www` pointing to `panth-portfolio.onrender.com`
   - `A` or `ANAME/ALIAS` for apex root `@` pointing to Render's IP (`216.24.57.1`)
4. Free SSL (Let's Encrypt) is issued automatically.

---

## 🔄 Making Future Updates

Every `git push` automatically redeploys your live site:
```bash
git add .
git commit -m "feat: description of change"
git push origin main
```
Render detects the push, builds the project, and deploys it live in ~60 seconds with zero downtime!
