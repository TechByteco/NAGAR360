# Nagar360 — AI-Powered Civic Complaint & Social Platform

**Nagar360** ("Namma Nagar, Namma Poruppu" / "See It. Report It. Improve It.") is a complete Next.js 16 AI-powered civic social network and complaint platform for Indian cities covering all 38 districts of Tamil Nadu and nationwide.

---

## 🚀 Quick Deployment Guide

### Option 1: Deploy to Vercel (Recommended — 1-Click)
1. Push this project folder to your GitHub / GitLab repository:
   ```bash
   git init
   git add .
   git commit -m "Deploy Nagar360"
   git remote add origin https://github.com/YOUR_USERNAME/nagar360.git
   git push -u origin main
   ```
2. Go to [Vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your `nagar360` repository.
4. Click **"Deploy"**. Vercel will automatically detect Next.js and publish your live website URL (e.g. `https://nagar360.vercel.app`)!

### Option 2: Deploy to Netlify
1. Connect your repository on [Netlify.com](https://netlify.com).
2. Set Build Command to `npm run build` and Publish directory to `.next`.
3. Click **Deploy Site**.

### Option 3: Run Locally or on Any VPS (Ubuntu / Node.js)
```bash
# 1. Install dependencies
npm install

# 2. Build for production
npm run build

# 3. Start production server
npm run start
```
The server will run on `http://localhost:3000`.

---

## 📁 Key File & Directory Structure

- `app/` — Next.js 16 App Router Routes:
  - `page.tsx` — Landing Hero page
  - `feed/page.tsx` — Citizen social feed with support upvotes & filtering
  - `raise-problem/page.tsx` — AI multi-step complaint reporting flow
  - `map/page.tsx` — Statewide interactive map with 38 districts & tile layer switcher
  - `track/page.tsx` — Search ticket status by ID (`TN-CHN-2026-8901`)
  - `complaints/[id]/page.tsx` — Complaint detail page with Edit Complaint modal
  - `authority/login/page.tsx` — Dedicated Restricted Authority Sign-In Page
  - `admin/page.tsx` — Protected Municipal Executive Operations Dashboard
  - `login/page.tsx` — Citizen Sign-in with Google (Gmail) support
- `lib/` — Logic & Adapters:
  - `adapters/authAdapter.ts` — Authentication manager & official credentials (`admin` / `admin@123`)
  - `adapters/dbAdapter.ts` — Reactive storage adapter & complaint CRUD
  - `adapters/aiAdapter.ts` — AI vision inspector (severity & department auto-classifier)
  - `store.ts` — Seeded civic complaints & 38 Tamil Nadu districts dataset
- `components/` — UI Design System Components:
  - `ui/NagarLogo.tsx` — Official NAGAR360 emblem logo
  - `map/MapView.tsx` — Leaflet dynamic map renderer with tile switcher
  - `admin/ChangeCredentialsModal.tsx` — Authority User ID & password updater

---

## 🔐 Authority Default Credentials
- **Portal URL**: `/authority/login`
- **User ID**: `admin`
- **Password**: `admin@123`
