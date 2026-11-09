import Link from "next/link";
import { Product, naira } from "@/lib/data";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link href={`/p/${p.slug}`} className="group rounded-2xl border border-gold-light bg-white p-3 shadow-soft transition hover:border-gold">
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-white-pearl to-white-mist">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {p.image ? <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" /> : <span className="font-display text-gold-deep">NO IMAGE</span>}
      </div>
      <h3 className="mt-3 font-medium group-hover:text-gold-deep">{p.name}</h3>
      <p className="text-sm">
        {p.salePrice ? <><span className="font-bold text-gold-deep">{naira(p.salePrice)}</span> <s className="opacity-60">{naira(p.price)}</s></> : <span className="font-bold">{naira(p.price)}</span>}
      </p>
    </Link>
  );
}
