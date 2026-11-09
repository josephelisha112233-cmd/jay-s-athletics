import { PAGES } from "@/config/pages";
const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export default function sitemap() {
  const cats = ["football-cleats", "sports-shoes", "kits-jerseys", "sportswear", "accessories", "kids", "sale"].map((c) => `/c/${c}`);
  return ["/", "/contact", ...Object.keys(PAGES).map((p) => `/${p}`), ...cats].map((u) => ({ url: site + u }));
}
