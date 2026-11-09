import { getProducts } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export const metadata = { title: "Search" };
const F = "rounded-lg border border-gold-light bg-white px-3 py-2";

export default async function Search({ searchParams: sp }: { searchParams: { q?: string; min?: string; max?: string; size?: string } }) {
  const q = (sp.q ?? "").toLowerCase(), min = Number(sp.min) || 0, max = Number(sp.max) || Infinity;
  const list = (await getProducts("all")).filter((p) => {
    const price = p.salePrice ?? p.price;
    return p.name.toLowerCase().includes(q) && price >= min && price <= max && (!sp.size || p.sizes.includes(sp.size));
  });
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold uppercase">Search & filter</h1>
      <form className="my-6 flex flex-wrap gap-2">
        <input name="q" defaultValue={sp.q} placeholder="Search products" className={F} />
        <input name="size" defaultValue={sp.size} placeholder="Size (e.g. 42)" className={`${F} w-32`} />
        <input name="min" defaultValue={sp.min} placeholder="Min ₦" className={`${F} w-28`} />
        <input name="max" defaultValue={sp.max} placeholder="Max ₦" className={`${F} w-28`} />
        <button className="btn-gold">Apply</button>
      </form>
      {list.length ? <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div> : <p>No matching products.</p>}
    </div>
  );
}
