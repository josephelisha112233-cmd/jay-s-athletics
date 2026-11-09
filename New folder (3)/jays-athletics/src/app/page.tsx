import Link from "next/link";
import { NAV } from "@/components/Header";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/data";

export default async function Home() {
  const latest = (await getProducts("all")).slice(0, 4);
  return (
    <>
      <Hero />
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {NAV.map(([label, href]) => (
          <Link key={href} href={href} className="rounded-2xl border border-gold-light bg-white p-8 text-center shadow-soft transition hover:border-gold">
            <span className="font-display text-xl uppercase">{label}</span>
          </Link>
        ))}
      </section>
      <section className="mx-auto max-w-7xl px-4">
        <h2 className="mb-4 font-display text-2xl uppercase">New arrivals</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{latest.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </section>
    </>
  );
}
