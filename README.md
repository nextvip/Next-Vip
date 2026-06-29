# NextVIP — AI-Powered Content Automation SaaS

**Live:** [https://nextvip.app](https://nextvip.app)

NextVIP is a multi-tenant SaaS for **content creators, affiliate marketers, and small businesses**. The goal is to improve on tools like [Scaled Creator](https://www.scaledcreator.com/): upload or import a TikTok video once, distribute it across social platforms with AI-optimized copy, and convert comments into sales through automated DMs with affiliate links.

> **Product vision:** One upload → every platform → AI captions → 24/7 comment & DM automation → affiliate revenue.

---

## Table of contents

- [User case study](#-user-case-study)
- [Feature map](#-feature-map)
- [Subscription plans](#-subscription-plans)
- [Milestones & delivery](#-milestones--delivery)
- [Project ownership](#-project-ownership)
- [Tech stack](#-tech-stack)
- [Monorepo structure](#-monorepo-structure)
- [Quick start](#-quick-start)
- [API overview](#-api-overview)
- [Client setup guide](#-client-setup-guide)
- [Deployment](#-deployment)

---

## 👤 User case study

### Who is the user?

A creator or affiliate who posts on **TikTok**, wants reach on **Instagram, Facebook, and YouTube Shorts**, and monetizes via **Amazon** or **TikTok Shop** — without manually reposting and replying on every platform.

### Journey

| Step | What the user does | What NextVIP does |
|------|--------------------|-------------------|
| **1. Register** | Signs up at nextvip.app, picks a plan | Email verification, assigns free trial plan |
| **2. Connect accounts** | Links TikTok, Instagram, Facebook, YouTube (OAuth) | Stores connected accounts per user |
| **3. Add video** | Pastes TikTok URL **or** uploads a file | Imports/syncs video, stores in Supabase Storage |
| **4. AI optimize** | Reviews generated copy | OpenAI creates title, description, hashtags **per platform** |
| **5. Attach affiliate** | Adds Amazon / product link to video | Saves `{link}`, `{product}` for templates |
| **6. Set automations** | Defines keywords (e.g. `INFO`, `LINK`) + DM/reply templates | IF/THEN rules: comment → public reply + private DM |
| **7. Publish or schedule** | Picks platforms and time | Posts to Instagram, Facebook, YouTube (TikTok as source) |
| **8. Monitor** | Opens dashboard | Publishing history, DM/comment automation logs |

### Real-world example

1. User imports a TikTok video about an Amazon blender.
2. AI generates Instagram, Facebook, and YouTube captions.
3. Automation: if comment contains `INFO` → reply *"Check your DMs!"* → DM with `{link}`.
4. Video publishes to all selected platforms.
5. A viewer comments `INFO` on Instagram → system replies and sends affiliate link automatically.

### Without vs with NextVIP

| Without NextVIP | With NextVIP |
|-----------------|--------------|
| Manual post on 4 platforms | One upload → multi-platform |
| Write each caption manually | AI generates per platform |
| Miss comments, lose sales | Keyword triggers → auto-DM 24/7 |
| Manually share affiliate links | `{link}` injected in every DM |

---

## 🎯 Feature map

### 🎥 Video management

| Feature | Status |
|---------|--------|
| Upload video file | ✅ Done (M2) — Supabase Storage |
| Import via TikTok / URL link | ✅ Done (M2) — link record |
| Video library + thumbnails | ✅ Done (M2) |
| Publishing history | ✅ Done (M2) — publications module |
| TikTok sync every ~10 min (Scaled Creator style) | 🔜 Milestone 4 |

### 📱 Social media (official APIs only)

| Platform | Role | Status |
|----------|------|--------|
| **TikTok** | Source — import videos & product links | 🔜 M4 — OAuth + sync |
| **Instagram** | Auto-publish + comments/DMs | 🔜 M4 — Meta Graph API |
| **Facebook** | Auto-publish + comments/DMs | 🔜 M4 — Meta Graph API |
| **YouTube Shorts** | Auto-publish | 🔜 M4 — YouTube Data API |

Users connect **their own** accounts via OAuth from the dashboard. Platform approvals and rate limits apply (see [client setup guide](./docs/MILESTONE_3_CLIENT_SETUP_GUIDE.md)).

### 🤖 AI (Milestone 3)

| Feature | Status |
|---------|--------|
| Auto-generate titles, descriptions, hashtags | ✅ |
| Platform-specific adaptation (TikTok, IG, FB, YT) | ✅ |
| IF/THEN automation rule engine | ✅ |
| Keyword detection logic | ✅ |
| DM/public reply templates with variables | ✅ |
| Execution history + test trigger | ✅ (live send → M4) |

### 💬 Comment & DM automation (Milestone 4)

| Feature | Status |
|---------|--------|
| Detect comments on posts | 🔜 M4 |
| Auto-reply to comments | 🔜 M4 |
| Auto-send DM with template | 🔜 M4 (Meta 24h messaging window) |
| Editable DM, public reply, keywords | ✅ templates / M4 live send |
| Variables `{link}`, `{product}`, `{username}`, etc. | ✅ |

### 🛒 Affiliate system

| Feature | Status |
|---------|--------|
| Save Amazon / custom affiliate links | 🔜 M4 |
| Associate products with videos | 🔜 M4 (schema ready) |
| Auto-send links in DMs | 🔜 M4 |

### 📅 Scheduling

| Feature | Status |
|---------|--------|
| Pick date, time, platforms | 🔜 M4–M5 |
| Enable/disable automations per post | 🔜 M4 |

### 💳 Billing (Milestone 5)

| Feature | Status |
|---------|--------|
| Stripe checkout & webhooks | 🔜 M5 |
| Plan limits enforced in app | ✅ Partial — DB plans seeded |

### 🔐 Auth & dashboard (Milestone 2 — done)

| Feature | Status |
|---------|--------|
| Register / login / email verification (6-digit code) | ✅ |
| Password reset | ✅ |
| Dashboard (overview, videos, upload, publications, automation, settings) | ✅ |
| Landing page + pricing | ✅ |
| Responsive UI (desktop & mobile browser) | ✅ |

---

## 💳 Subscription plans

| Plan | Duration | Price | Videos / day | Platforms |
|------|----------|-------|--------------|-----------|
| **Free Trial** | 7 days | $0 | 10 | All |
| **Normal** | 15 days | $40 | 10 | All |
| **Popular** ⭐ | 30 days | $59 | 30 | All |

Stripe integration and paid checkout → **Milestone 5**.

---

## 📦 Milestones & delivery

| # | Milestone | Budget | Timeline | Status |
|---|-----------|--------|----------|--------|
| 1 | Setup & architecture — repo, Supabase schema, env, hosting | $60 | 3 days | ✅ Done |
| 2 | Auth, dashboard, video upload, publications, plans in DB | $75 | 4 days | ✅ Done |
| 3 | OpenAI captions + platform adaptation + IF/THEN rules | $115 | 7 days | ✅ Done |
| 4 | Social OAuth, auto-post, comments, DMs, affiliates | $175 | 10 days | ⏳ Planned |
| 5 | Stripe, testing, launch, handover docs | $75 | 4 days | ⏳ Planned |
| | **Total** | **$500** | **~4 weeks** | |

---

## 🔐 Project ownership

All primary assets remain under the **client’s** accounts:

- Domain (`nextvip.app`), hosting (Vercel), GitHub repo  
- Supabase (database, storage, auth-ready schema)  
- OpenAI, Stripe, TikTok, Meta, YouTube, Amazon API accounts  

The developer receives **access only**. Full source code and configuration are delivered after each milestone.

---

## ⚙️ Tech stack

| Layer | Technology |
|-------|------------|
| **Web** | React, Vite, Tailwind CSS, shadcn/ui, Redux |
| **API** | Node.js, Express |
| **Database** | Supabase (PostgreSQL) |
| **File storage** | Supabase Storage (`videos` bucket) |
| **Auth** | JWT + email verification (6-digit code) |
| **AI** | OpenAI API (Milestone 3) |
| **Payments** | Stripe (Milestone 5) |
| **Social** | TikTok, Meta Graph, YouTube Data API v3 (Milestone 4) |
| **Mobile** | React Native / Expo (future) |

> Architecture: **React client + Express API + Supabase**. Designed as a scalable multi-user SaaS with modular services and a clean schema for automations, affiliates, and AI generations.

---

## Monorepo structure

```
.
├── client/          # React dashboard + marketing site (Vite)
├── server/          # Express API + Supabase models
├── docs/            # Client-facing setup guides
└── mobile/          # Expo app (future)
```

---

## Quick start

### Prerequisites

- Node.js (LTS)
- npm
- Supabase project ([supabase.com](https://supabase.com))
- SMTP for transactional email

### Install

```bash
git clone <your-repo-url>
cd Next-Vip
cd server && npm install
cd ../client && npm install
```

### Server `.env` (example)

```bash
PROJECT_NAME="NextVIP"
NODE_ENV=development
PORT=5274

CLIENT_BASE_URL="http://localhost:5173"
API_BASE_URL="http://localhost:5274"

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_STORAGE_BUCKET=videos

SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_MAIL=your_email@example.com
SMTP_PASSWORD=your_password

ACCESS_TOKEN=your_access_token_secret
REFRESH_TOKEN=your_refresh_token_secret

# Milestone 3+
# OPENAI_API_KEY=

# Milestone 4+
# TIKTOK_CLIENT_KEY=
# TIKTOK_CLIENT_SECRET=
# META_APP_ID=
# META_APP_SECRET=
# YOUTUBE_CLIENT_ID=
# YOUTUBE_CLIENT_SECRET=

# Milestone 5+
# STRIPE_SECRET_KEY=
# STRIPE_WEBHOOK_SECRET=
```

### Client `.env`

```bash
VITE_REACT_APP_PROJECT_NAME="NextVIP"
VITE_REACT_APP_API_BASE_URL=http://localhost:5274
```

### Run locally

```bash
# Terminal 1 — API
cd server && npm run dev

# Terminal 2 — Web
cd client && npm run dev
```

- Web: http://localhost:5173  
- API: http://localhost:5274  
- Swagger: http://localhost:5274/api-docs  

### Database

Apply migrations in `server/supabase/migrations/` via Supabase SQL Editor, then:

```bash
cd server && node scripts/seedSubscriptionPlans.js
```

---

## API overview

### Available now (Milestone 2)

| Area | Endpoints |
|------|-----------|
| Auth | Register, login, activate, refresh, forgot/reset password |
| User | Profile, update info, change password, me + plan |
| Videos | List, upload (Supabase Storage), link import, update, delete |
| Publications | List, create manual publication records |
| Subscriptions | List plans, current user plan |

### Coming in Milestone 3+

| Area | Milestone |
|------|-----------|
| AI generate title / description / hashtags | M3 |
| Automation templates & IF/THEN rules | M3 |
| Social OAuth connect | M4 |
| Auto-publish & comment webhooks | M4 |
| Affiliate products | M4 |
| Stripe billing | M5 |

Details: [server/README.md](./server/README.md) · OpenAPI: `/api-docs`

---

## Client setup guide

For **OpenAI** (Milestone 3) and **social API applications** (Milestone 4 prep):

👉 **[docs/MILESTONE_3_CLIENT_SETUP_GUIDE.md](./docs/MILESTONE_3_CLIENT_SETUP_GUIDE.md)**

Covers TikTok Developers, Meta (Instagram + Facebook), YouTube / Google Cloud, Amazon Associates, and what credentials to share securely.

---

## Deployment

| Component | Recommended |
|-----------|-------------|
| Web + API | Vercel / VPS with `nextvip.app` |
| Database & storage | Supabase (client account) |
| Env secrets | Vercel / server env — never commit to Git |

Production checklist:

- Set `CLIENT_BASE_URL` and CORS for `https://nextvip.app`
- Run Supabase migrations + seed plans
- Create public `videos` storage bucket
- Configure OAuth redirect URLs when Milestone 4 ships
- Configure Stripe webhooks when Milestone 5 ships

---

## Comparison: Scaled Creator → NextVIP

| Scaled Creator | NextVIP |
|----------------|---------|
| TikTok sync → IG + Facebook | TikTok source → **IG + Facebook + YouTube Shorts** |
| Amazon affiliate links | Amazon + custom links + `{product}` variable |
| Comment → DM with link | IF/THEN rules + editable templates |
| Batch publish | Plan-based daily limits (10–30/day) |
| — | **AI captions per platform** |
| — | Full dashboard + publication history |

---

## License

Proprietary — owned by the client. Specify license terms as agreed in the project contract.
