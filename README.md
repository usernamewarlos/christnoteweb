# Christ Note — Marketing Site

Astro + Vercel. Phase 1 waitlist landing for the Christ Note iPhone app.

## Stack

- **Astro 5** (server output, prerendered marketing page)
- **Vercel** adapter (`@astrojs/vercel`) — deploys page as static, `/api/waitlist` as a serverless function
- **Vanilla CSS** with tokens from `src/styles/tokens.css` (mirrors the iOS Lectionary system)
- **Cormorant Garamond + Inter** from Google Fonts
- **Custom Christ Note icon set** inlined as an SVG sprite — no Lucide / Heroicons / Feather

## Local dev

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
npm run preview  # serves the built site
```

## Environment variables

Copy `.env.example` to `.env`. The waitlist endpoint gracefully degrades:

| Var | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | optional | If set, sends a signup notification via Resend. If unset, logs the email to stdout and returns success. |
| `WAITLIST_TO_EMAIL` | recommended | Inbox that receives signup notifications. Defaults to `hello@christnote.app`. |
| `WAITLIST_FROM_EMAIL` | recommended | From address (must be a Resend-verified domain). Defaults to `waitlist@christnote.app`. |

Set these on Vercel via **Project → Settings → Environment Variables**.

## Deployment (Vercel)

1. Push this repo to GitHub
2. Import to Vercel → it autodetects Astro
3. Add env vars (see above)
4. Deploy

The Vercel adapter handles routing automatically — the page is prerendered, the API route runs as a serverless function.

## Component map

```
src/
├── layouts/Layout.astro          # HTML shell, fonts, OG meta, icon sprite
├── components/
│   ├── Nav.astro                 # Sticky 3-zone nav (brand · centered links · CTA)
│   ├── Hero.astro                # Centered hero + email pill + hero phone
│   ├── PhoneFrame.astro          # Generic iPhone bezel
│   ├── WaitlistForm.astro        # Email pill + client-side fetch to /api/waitlist
│   ├── FeatureColumn.astro       # Brass icon circle + title + body
│   ├── FAQ.astro                 # 5 accordion items
│   ├── FAQItem.astro             # Single <details> item
│   ├── Footer.astro              # Espresso ink-900 footer with brass cross
│   ├── DevotionalRule.astro      # 60px brass line · diamond · 60px line
│   └── Icon.astro                # Inline SVG <use> reference
├── pages/
│   ├── index.astro               # Single-page landing
│   └── api/waitlist.ts           # POST endpoint
└── styles/
    ├── tokens.css                # Color, type, spacing, radius, shadow
    └── global.css                # Base + .btn + .email-row + .container
```

## Design context

Full handoff lives in the parent directory: `../Website Build Handoff.md`.
The chosen direction (Concept 02 — Centered Devotional) is documented in `../docs/designkit/briefs/2026-05-05-christnote-waitlist-landing.md`.
