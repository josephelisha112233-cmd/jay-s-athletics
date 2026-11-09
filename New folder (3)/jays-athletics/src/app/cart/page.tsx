"use client";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { naira } from "@/lib/data";
import { WHATSAPP_URL, FREE_DELIVERY_THRESHOLD } from "@/config/brand";

export default function Cart() {
  const { items, remove, total } = useCart();
  const msg = encodeURIComponent("Hello! I'd like to order:\n" + items.map((i) => `${i.qty} x ${i.name} (size ${i.size})`).join("\n") + `\nTotal: ${naira(total)}`);
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold uppercase">Your cart</h1>
      {!items.length ? <p className="mt-6">Your cart is empty. <Link className="underline" href="/c/football-cleats">Start shopping</Link></p> : (
        <>
          <ul className="mt-6 divide-y divide-gold-light rounded-2xl border border-gold-light bg-white">
            {items.map((i) => (
              <li key={i.key} className="flex items-center justify-between gap-4 p-4">
                <div><p className="font-medium">{i.name}</p><p className="text-sm">Size {i.size} · Qty {i.qty}</p></div>
                <div className="text-right"><p className="font-bold">{naira(i.price * i.qty)}</p><button onClick={() => remove(i.key)} className="text-sm text-gold-deep underline">Remove</button></div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-right text-xl font-bold">Total: {naira(total)}</p>
          {total < FREE_DELIVERY_THRESHOLD && <p className="text-right text-sm">Add {naira(FREE_DELIVERY_THRESHOLD - total)} more for free delivery.</p>}
          <div className="mt-6 text-right"><a href={`${WHATSAPP_URL}?text=${msg}`} className="btn-gold">Order via WhatsApp</a></div>
          <p className="mt-3 text-right"><Link href="/checkout" className="btn-outline">Pay online with Paystack</Link></p>
        </>
      )}
    </div>
  );
}
