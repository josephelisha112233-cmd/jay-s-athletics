import { notFound } from "next/navigation";
import { getProduct, naira } from "@/lib/data";
import AddToCart from "@/components/AddToCart";
import WishlistButton from "@/components/WishlistButton";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await getProduct(params.slug);
  if (!p) notFound();
  const price = p.salePrice ?? p.price;
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-2">
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-gold-light bg-gradient-to-br from-white-pearl to-white-mist">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {p.image ? <img src={p.image} alt={p.name} className="h-full w-full object-cover" /> : <span className="font-display text-gold-deep">NO IMAGE</span>}
      </div>
      <div>
        <h1 className="font-display text-3xl font-bold uppercase">{p.name}</h1>
        <p className="mt-2 text-2xl font-bold text-gold-deep">{naira(price)}</p>
        <p className="mt-4">{p.description}</p>
        {p.sizes.length ? <AddToCart slug={p.slug} name={p.name} price={price} sizes={p.sizes} /> : <p className="mt-6 font-medium">Out of stock</p>}
        <WishlistButton slug={p.slug} />
        <p className="mt-8 rounded-lg bg-white-ivory p-4 text-sm">Delivery within Jos in 1-2 days, nationwide in 3-5 days. Easy exchanges within 7 days.</p>
      </div>
    </div>
  );
}
