export default function robots() {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/account", "/checkout", "/api"] }, sitemap: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/sitemap.xml` };
}
