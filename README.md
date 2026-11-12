[README.md](https://github.com/user-attachments/files/34745631/README.md)
# Jay's Athletics

Next.js + Supabase + Vercel storefront (white & gold theme).

## What's in this starter
Brand config, Tailwind white/gold tokens, header (announcement bar + logo badge), footer, home page, Supabase schema with RLS, starter seed, and a signature-verified Paystack webhook.

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
