# Jay's Athletics

Next.js + Supabase + Vercel storefront (white & gold theme).

## What's in this starter
Brand config, Tailwind white/gold tokens, header (announcement bar + logo badge), footer, home page, Supabase schema with RLS, starter seed, and a signature-verified Paystack webhook.

## Progress
Phase 1: starter. Phase 2: catalog (/c/[slug]), product page (/p/[slug]), cart (localStorage, WhatsApp order), contact page. Works with demo data until Supabase is connected.
Phase 3: login/signup/Google, account + order history, server-priced Paystack checkout (/api/checkout), static pages, sitemap/robots.
Phase 4: admin dashboard (/admin: add products with image upload, update order status), search + price/size filters (/search), wishlist (device-based), hero carousel, mega-menu, stock decrement and Resend order emails in the webhook.
Not built: product reviews UI, database-synced wishlist, brand filter, saved addresses, JSON-LD structured data, automated tests.

## Run locally
```bash
npm install
cp .env.example .env.local   # fill in keys
npm run dev
```

## Supabase
Run `supabase/migrations/0001_init.sql`, then `supabase/seed.sql` in the Supabase SQL editor.
Make yourself admin: `update profiles set role='admin' where id = (select id from auth.users where email='josephelisha112233@gmail.com');`

## Deploy
Push to GitHub, import in Vercel, add the env vars, and set the Paystack webhook to `https://YOUR_DOMAIN/api/paystack/webhook`.

## Finish the build
Open this folder in Claude Code and paste the prompt in `docs/BUILD_PROMPT.md`. It will add catalog, cart, checkout, auth and admin on top of this starter.
Note: the logo reads "JAX Athletics"; the brand name is set in `src/config/brand.ts`.
