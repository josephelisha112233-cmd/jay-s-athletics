import { createClient } from "@supabase/supabase-js";

export type Product = { id: string; slug: string; name: string; description: string; price: number; salePrice: number | null; image: string | null; sizes: string[]; category: string };
export const naira = (n: number) => "₦" + n.toLocaleString("en-NG");

// Demo data so the site renders before Supabase is connected.
const DEMO: Product[] = [
  ["pro-fg-cleats", "Pro FG Football Cleats", 45000, "football-cleats"], ["turf-trainer-cleats", "Turf Trainer Cleats", 38000, "football-cleats"],
  ["soft-ground-cleats", "Soft Ground Cleats", 52000, "football-cleats"], ["road-runner-shoes", "Road Runner Shoes", 32000, "sports-shoes"],
  ["court-king-basketball", "Court King Basketball Shoes", 48000, "sports-shoes"], ["club-home-jersey", "Club Home Jersey", 18000, "kits-jerseys"],
].map(([slug, name, price, category]) => ({ id: slug as string, slug: slug as string, name: name as string, description: "Premium quality, built for match day. Replace this demo item from the admin or Supabase.", price: price as number, salePrice: null, image: null, sizes: category === "kits-jerseys" ? ["S", "M", "L", "XL"] : ["40", "41", "42", "43", "44", "45"], category: category as string }));

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? createClient(url, key) : null;
}

const SELECT = "id,slug,name,description,base_price,sale_price,categories(slug),product_images(url,position),product_variants(size,stock)";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const map = (r: any): Product => ({
  id: r.id, slug: r.slug, name: r.name, description: r.description ?? "", price: Number(r.base_price),
  salePrice: r.sale_price ? Number(r.sale_price) : null, category: r.categories?.slug ?? "",
  image: [...(r.product_images ?? [])].sort((a, b) => a.position - b.position)[0]?.url ?? null,
  sizes: (r.product_variants ?? []).filter((v: { stock: number }) => v.stock > 0).map((v: { size: string }) => v.size),
});

export async function getProducts(category: string, sort = "newest"): Promise<Product[]> {
  const c = db();
  let list: Product[];
  if (c) {
    const { data } = await c.from("products").select(SELECT).eq("is_active", true).order("created_at", { ascending: false });
    list = (data ?? []).map(map);
  } else list = DEMO;
  if (category === "sale") list = list.filter((p) => p.salePrice);
  else if (category !== "all") list = list.filter((p) => p.category === category);
  const eff = (p: Product) => p.salePrice ?? p.price;
  if (sort === "price-asc") list.sort((a, b) => eff(a) - eff(b));
  if (sort === "price-desc") list.sort((a, b) => eff(b) - eff(a));
  return list;
}

export async function getProduct(slug: string): Promise<Product | null> {
  return (await getProducts("all")).find((p) => p.slug === slug) ?? null;
}
