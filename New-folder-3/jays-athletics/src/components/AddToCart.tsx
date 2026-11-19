"use client";
import { useState } from "react";
import { useCart } from "./CartProvider";

export default function AddToCart({ slug, name, price, sizes }: { slug: string; name: string; price: number; sizes: string[] }) {
  const [size, setSize] = useState("");
  const [done, setDone] = useState(false);
  const { add } = useCart();
  return (
    <div className="mt-6">
      <p className="mb-2 text-sm font-medium">Select size</p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => (
          <button key={s} onClick={() => { setSize(s); setDone(false); }} aria-pressed={size === s}
            className={`min-w-12 rounded-lg border px-3 py-2 ${size === s ? "border-gold-deep bg-gold-light" : "border-gold-light bg-white"}`}>{s}</button>
        ))}
      </div>
      <button disabled={!size} onClick={() => { add({ slug, name, price, size }); setDone(true); }} className="btn-gold mt-6 disabled:opacity-50">
        {size ? "Add to cart" : "Choose a size"}
      </button>
      {done && <p className="mt-3 text-sm text-gold-deep" role="status">Added to cart. <a className="underline" href="/cart">View cart</a></p>}
    </div>
  );
}
