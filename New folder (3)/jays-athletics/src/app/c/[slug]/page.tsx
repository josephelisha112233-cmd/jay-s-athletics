import Link from "next/link";
import { getProducts } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

const SORTS = [["newest", "Newest"], ["price-asc", "Price: low to high"], ["price-desc", "Price: high to low"]];

export default async function Category({ params, searchParams }: { params: { slug: string }; searchParams: { sort?: string } }) {
  const sort = searchParams.sort ?? "newest";
  const products = await getProducts(params.slug, sort);
  const title = params.slug.replace(/-/g, " ");
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold uppercase">{title}</h1>
        <nav className="flex gap-2 text-sm" aria-label="Sort">
          {SORTS.map(([v, l]) => (
            <Link key={v} href={`?sort=${v}`} className={`rounded-full border px-3 py-1 ${sort === v ? "border-gold-deep bg-gold-light" : "border-gold-light bg-white"}`}>{l}</Link>
          ))}
        </nav>
      </div>
      {products.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{products.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      ) : <p>No products here yet.</p>}
    </div>
  );
}
