# Jay's Athletics: Complete Build Prompt

Paste everything inside the code block at the bottom into Claude Code (run from your project folder). Do the setup steps first.

---

## Setup before you paste the prompt

1. Create an empty GitHub repo named `jays-athletics`.
2. In your terminal:

```bash
mkdir jays-athletics && cd jays-athletics
git init
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/jays-athletics.git
mkdir -p public/images
# copy logo.png (the file provided with this prompt) into public/images/logo.png
git add public/images/logo.png
git commit -m "chore: add brand logo"
```

3. In Supabase: copy Project URL, anon key and service role key (Project Settings → API).
4. In Vercel: Add New → Project → import the GitHub repo (after the first push).
5. Create a Paystack account and get test keys (Settings → API Keys).

---

## The prompt

```
You are a senior full-stack engineer. Build a complete, production-ready e-commerce website for "Jay's Athletics" in this Git repository. Use https://www.kitbag.com only as a reference for layout, structure and user flow (mega-menu navigation, promo banner, hero carousel, category tiles, product grids with filters, product detail pages, cart and checkout). Do NOT copy its logo, images, text or branding. Write original copy and use placeholder product images that I can replace later.

# 1. Tech stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase: Postgres, Auth (email/password + Google), Storage (product images), Row Level Security
- Vercel: deployment target (GitHub auto-deploys from main, preview deploys for PRs)
- GitHub: small, meaningful commits using conventional commit messages
- Payments: Paystack, with Naira (₦) as the default currency
- Email: Resend (transactional order emails). Make the provider easy to swap.
- Secrets only in .env.local and Vercel settings. Commit .env.example only.

# 2. Brand, logo and contact details
Create /src/config/brand.ts exporting:
- BRAND_NAME = "Jay's Athletics"
- PHONE = "08034784901" (also export international form +2348034784901 for tel: and wa.me links)
- EMAIL = "josephelisha112233@gmail.com"
- ADDRESS = "Jos, Plateau State, Nigeria"
Every place that shows the brand name or contact details (header, footer, contact page, checkout, emails, metadata, structured data) MUST import from this file. These replace all contact details from the reference site.

Logo:
- The brand logo is the existing file /public/images/logo.png (silver metallic lettering reading "JAX ATHLETICS" on a solid black square). Use this exact file. Do not redraw, recolor or replace it with text.
- Header: logo (about 56px tall desktop, 44px mobile) inside a black (#000000) rounded badge with a 1px gold (#D4AF37) border, on the white header. It links to the homepage; alt text comes from BRAND_NAME.
- Footer: a black/charcoal band with the logo and gold link accents.
- Generate favicon.ico, apple-touch-icon, and 192px/512px icons from the logo and set them in Next.js metadata.
- Open Graph image: logo centered on black at 1200x630.
- Use next/image with priority on the header logo and explicit width/height.
- Auth pages, checkout, emails and the admin dashboard show the logo in the same black badge style.
- The black and silver appear only where the logo appears. Everything else is white and gold.

# 3. Design system
- Theme: white and gold ONLY, with several shades of white: pure white #FFFFFF, ivory #FFFFF0, off-white #FAF9F6, pearl #F5F3EE, light grey-white #EDEBE6.
- Gold: primary #D4AF37, deep gold #B8860B, light gold #F1E5AC. Body text charcoal #1F1F1F.
- Define all colors as Tailwind theme tokens and CSS variables. No blue, red or other brand colors (only accessible error/success states).
- Buttons: gold with white or charcoal text, whichever passes WCAG AA contrast (use deep gold where needed). Subtle gold borders, soft shadows, rounded corners.
- Typography via next/font: elegant sans-serif for body, bold display font for headings.
- Mobile first, fully responsive, WCAG AA accessible, fast (next/image, lazy loading, good Lighthouse scores).

# 4. Product catalog
Top-level categories:
1. Football Cleats (firm ground, soft ground, artificial grass, turf, indoor, kids' cleats)
2. Sports Shoes (running, training, basketball, lifestyle sneakers, slides)
3. Football Kits and Jerseys (club, national team, retro, training wear)
4. Sportswear (shorts, tracksuits, hoodies, socks)
5. Accessories (balls, shin guards, gloves, bags, caps)
6. Kids
7. Sale

Filters: brand, size (EU 36-47 for footwear, S-XXL for clothing), price range, color, category, availability.
Sorting: newest, price low-high, price high-low, popularity.

# 5. Pages and features
- Home: announcement bar (free delivery threshold, WhatsApp contact), header (logo, search, account, wishlist, cart), mega-menu, hero carousel, featured category tiles (Football Cleats and Sports Shoes highlighted), new arrivals, best sellers, shop by brand, newsletter signup, footer with links and contact details.
- Category/listing pages with filters, sorting, pagination.
- Product detail page: image gallery, size selector, stock status, quantity, add to cart, wishlist, description, delivery and returns info, related products, reviews.
- Search with instant suggestions.
- Cart (drawer + full page), persistent for guests (local storage) and logged-in users (database), merged on login.
- Checkout: shipping address form, delivery options, Paystack payment, order confirmation page, confirmation email.
- Auth: sign up, login, logout, password reset, profile, order history, saved addresses. Google login.
- Wishlist.
- Static pages: About, Contact (form saves to Supabase and shows phone, email and address), FAQs, Delivery and Returns, Size Guide, Privacy, Terms.
- Admin dashboard (role-restricted): manage products, variants/sizes/stock, categories, brands, orders (update status), upload images to Supabase Storage, view customers, view contact messages.
- SEO: metadata, Open Graph, sitemap.xml, robots.txt, JSON-LD structured data (Product, Organization, BreadcrumbList) using BRAND_NAME and contact details.
- Custom 404 and error pages, loading skeletons, toast notifications.

# 6. Supabase
Create SQL migrations in /supabase/migrations for:
- profiles (linked to auth.users; role: customer | admin; auto-created by a trigger on signup)
- categories (with parent_id for subcategories), brands, products, product_variants (size, color, stock, price), product_images
- carts, cart_items, wishlists, orders, order_items, addresses, reviews, contact_messages, newsletter_subscribers
- Row Level Security on EVERY table: public read for catalog; users read/write only their own cart, wishlist, addresses, orders and reviews; admin-only write for catalog and order management; contact_messages and newsletter_subscribers insert-only for the public.
- A SQL helper function is_admin() used in policies.
- Storage bucket "product-images" (public read, admin write).
- /supabase/seed.sql with at least 24 sample products (10 football cleats, 8 sports shoes, 6 other items) with realistic Naira prices, variants and placeholder images.
- Generate TypeScript types for the database.

# 7. Payments and orders
- Server-side order creation: validate prices and stock on the server, never trust client totals.
- Initialize Paystack transactions from a server route; verify on return.
- Webhook route handler at /api/paystack/webhook with HMAC SHA512 signature verification (x-paystack-signature); idempotent order updates; decrement stock on successful payment.
- Order statuses: pending, paid, processing, shipped, delivered, cancelled, refunded.
- Send an order confirmation email to the customer and a notification email to EMAIL from brand.ts.
- Delivery options: Jos local delivery, nationwide delivery, store pickup (editable in config; sensible default fees in Naira).

# 8. Environment variables (.env.example)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
PAYSTACK_SECRET_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=

# 9. Vercel
- Add vercel.json only if needed.
- `npm run build` must pass with no type or lint errors.
- Document all environment variables and the Paystack webhook URL (https://YOUR_DOMAIN/api/paystack/webhook) in the README.

# 10. Quality and security
- Validate all input with Zod on client and server.
- Never expose the service role key or Paystack secret key to the client.
- Rate-limit contact, newsletter and auth-sensitive endpoints.
- Add a few tests for price/total calculation and webhook signature verification.

# 11. Deliverables and process
1. Complete project code with a clear folder structure.
2. README.md covering: local setup, Supabase migration steps, how to make myself an admin (SQL snippet to set role = 'admin'), Vercel deployment steps, how to set up Google OAuth, and how to replace placeholder images and products.
3. Work in phases, committing after each:
   (1) scaffold + design system + brand config + logo
   (2) database + auth
   (3) catalog pages
   (4) cart + checkout + payments + emails
   (5) admin dashboard
   (6) SEO + polish + tests
4. At the end, list everything I must configure manually (API keys, webhook URL, Google OAuth, email provider, domain).

Ask me a question only if something blocks you; otherwise make sensible decisions and keep going.
```

---

## After the build finishes

```bash
git push -u origin main
```

Then in Vercel add the environment variables (Project → Settings → Environment Variables), redeploy, and add the Paystack webhook URL in the Paystack dashboard.

## Notes

- **Name mismatch:** the logo reads "JAX Athletics" but the brand name is set to "Jay's Athletics". If the business is JAX Athletics, change `BRAND_NAME` in the prompt before running it.
- **Payments:** Paystack is used because you are in Nigeria. Swap for Flutterwave if you prefer.
- **Images:** real product photos must be uploaded later through the admin dashboard; kitbag.com's images are copyrighted and are not used.
- **Secrets:** never paste your Supabase service role key or Paystack secret key into a chat or commit them to GitHub.
