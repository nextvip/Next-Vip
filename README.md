# NextVIP — AI-Powered Content Automation SaaS

**NextVIP** is a professional SaaS platform built for content creators, affiliate marketers, and businesses who want to automate the full lifecycle of content — from upload to monetization. Upload a video once and let the platform handle distribution, optimization, audience interaction, and affiliate sales automatically across all major social platforms.

## Monorepo structure

```
.
├─ client/        # React web dashboard (Vite)
├─ server/        # Node.js + Express API
└─ mobile/        # React Native app (Expo)
```

## Core features

### Video management

- Upload and organize videos in one central dashboard
- Maintain full publishing history
- Prepare and adapt content for different platform requirements

### Social media integration

Connects to official APIs of:

- **TikTok** — TikTok for Developers API
- **Instagram** — Meta Graph API
- **Facebook** — Meta Graph API / Pages API
- **YouTube** — YouTube Data API v3

Users connect their own accounts via OAuth directly from the dashboard. Each user manages their own connected accounts under their profile.

### AI content generation (OpenAI API)

- Auto-generate titles, descriptions, and hashtags
- Adapt copy per platform tone and format
- Suggest optimized content variations
- Assist with automated reply generation

### Comment & DM automation

- Detect trigger keywords in comments (e.g., user comments `"INFO"`)
- Automatically reply to the comment publicly
- Automatically send a private DM with personalized content
- Editable templates with dynamic variables:
  - `{link}` — affiliate or product link
  - `{product}` — product name

Users can customize private message content, public comment replies, trigger keywords, and links sent per automation.

### IF/THEN automation engine

Rule-based automation system:

- If someone comments a keyword → send DM
- If a video is uploaded → auto-publish to selected platforms
- If published on TikTok → adapt and repost to other networks

Rules are fully configurable per user from the dashboard.

### Affiliate system

- Save and manage affiliate links (e.g., Amazon, TikTok Shop)
- Associate specific products/links with specific videos
- Automatically include affiliate links in DMs and comment replies
- Convert comment interactions into sales automatically

### Content scheduling

- Schedule posts by date and time
- Select target platforms per post
- Enable/disable automations per scheduled post

### Subscription plans (Stripe)

| Plan       | Description                                              |
| ---------- | -------------------------------------------------------- |
| **Free**   | Basic access, limited automations                        |
| **Pro**    | Full automation, all platforms                           |
| **Business** | Advanced features, higher limits, priority support   |

Stripe handles all billing, plan upgrades, and payment processing.

## Tech stack

| Layer   | Stack                                      |
| ------- | ------------------------------------------ |
| Web     | React, Vite, Tailwind CSS, shadcn/ui       |
| API     | Node.js, Express, MongoDB, Mongoose        |
| Mobile  | React Native, Expo                         |
| Auth    | JWT, email verification, password reset  |
| Billing | Stripe                                     |
| AI      | OpenAI API                                 |

## Prerequisites

- Node.js (LTS recommended)
- npm (or yarn/pnpm)
- MongoDB (local or MongoDB Atlas)

Optional:

- Docker / Docker Compose
- Expo Go app (for mobile testing)
- Android Studio / Xcode (for native simulators)
- Stripe account (subscriptions)
- OpenAI API key (AI content generation)
- OAuth app credentials for TikTok, Meta, and YouTube

## Quick start

### 1) Clone and install dependencies

```bash
git clone <your-repo-url>
cd NextVip
```

Install dependencies per app:

```bash
cd server && npm install
cd ../client && npm install
cd ../mobile && npm install
```

### 2) Configure environment variables

Create env files (examples below). Do **not** commit real secrets.

#### `server/.env`

```bash
PROJECT_NAME="NextVIP"
NODE_ENV=development
PORT=5274

CLIENT_BASE_URL="http://localhost:5173"
API_BASE_URL="http://localhost:5274"

DB_CONNECTION="mongodb://localhost:27017/nextvip"
DB_NAME=nextvip

# Mail
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_MAIL=your_email@example.com
SMTP_PASSWORD=your_password

# JWT
ACCESS_TOKEN=your_access_token_secret
REFRESH_TOKEN=your_refresh_token_secret
ACCESS_TOKEN_EXPIRE=5
REFRESH_TOKEN_EXPIRE=30

# Integrations (add as features are enabled)
# OPENAI_API_KEY=
# STRIPE_SECRET_KEY=
# STRIPE_WEBHOOK_SECRET=
# TIKTOK_CLIENT_ID=
# META_APP_ID=
# YOUTUBE_CLIENT_ID=
```

#### `client/.env`

Vite uses `VITE_*`:

```bash
VITE_REACT_APP_PROJECT_NAME="NextVIP"
VITE_REACT_APP_PROJECT_TAGLINE="Automate your content from upload to monetization."
VITE_REACT_APP_API_BASE_URL=http://localhost:5274
```

#### `mobile/.env` (optional)

Expo uses `EXPO_PUBLIC_*`:

```bash
EXPO_PUBLIC_SERVER_BASE_URI="http://<YOUR_LAN_IP>:5274"
```

> On a physical device, `localhost` points to the device itself. Use your machine's LAN IP (e.g. `http://192.168.1.10:5274`) or a tunnel.

### 3) Run the apps

#### Server

```bash
cd server
npm run dev
```

API: `http://localhost:5274` · Swagger docs: `http://localhost:5274/api-docs`

#### Web client

```bash
cd client
npm run dev
```

Web app: `http://localhost:5173`

#### Mobile (Expo)

```bash
cd mobile
npm run start
```

Then press `i` (iOS), `a` (Android), or scan the QR code with Expo Go.

## API overview

- **Base URL**: `${API_BASE_URL}` (e.g. `http://localhost:5274`)
- **Documentation**: `GET /api-docs` (Swagger UI)

### Currently available

| Area                  | Endpoints                                      |
| --------------------- | ---------------------------------------------- |
| Authentication        | Register, login, email activation, token refresh |
| User management       | Profile, update info, change password          |
| Password management   | Forgot password, reset via email               |

### Planned modules

Video management, social OAuth connections, AI content generation, comment/DM automation, IF/THEN rules, affiliate links, content scheduling, and Stripe subscriptions.

See [server/README.md](./server/README.md) for endpoint details and [server/config/swagger.js](./server/config/swagger.js) for the OpenAPI specification.

## Database

MongoDB connection is configured via `DB_CONNECTION` and `DB_NAME` in `server/.env`.

## Deployment

- **Server**: Render, Fly.io, Railway, or similar + MongoDB Atlas
- **Web client**: Vercel, Netlify, or Cloudflare Pages
- **Mobile**: Expo Application Services (EAS) or native builds

When deploying:

- Set API URL env vars for client/mobile to your deployed server URL
- Configure CORS on the server for allowed origins
- Set up Stripe webhooks and OAuth redirect URLs for production domains

## Troubleshooting

- **Mobile can't reach API**: use your computer's LAN IP instead of `localhost`, or use an Expo tunnel
- **CORS errors in web**: set `CLIENT_BASE_URL` and configure CORS in the server
- **Mongo connection fails**: verify `DB_CONNECTION` and IP allowlist (Atlas)

## License

Specify a license (e.g. MIT) or remove this section.
