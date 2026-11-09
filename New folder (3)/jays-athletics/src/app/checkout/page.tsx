"use client";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { supabase } from "@/lib/supabase";
import { naira } from "@/lib/data";
import { DELIVERY } from "@/config/delivery";
import { FREE_DELIVERY_THRESHOLD } from "@/config/brand";

const F = "w-full rounded-lg border border-gold-light bg-white px-3 py-2";

export default function Checkout() {
  const { items, total } = useCart();
  const [delivery, setDelivery] = useState<string>("jos");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const fee = total >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY.find((d) => d.id === delivery)!.fee;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setErr("");
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    let token = "";
    try { token = (await supabase().auth.getSession()).data.session?.access_token ?? ""; } catch {}
    const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) }, body: JSON.stringify({ ...f, delivery, items: items.map((i) => ({ slug: i.slug, size: i.size, qty: i.qty })) }) });
    const j = await res.json(); setBusy(false);
    if (j.url) location.href = j.url; else setErr(j.error ?? "Something went wrong.");
  }

  if (!items.length) return <p className="p-10">Your cart is empty.</p>;
  return (
    <form onSubmit={submit} className="mx-auto max-w-xl space-y-3 px-4 py-10">
      <h1 className="font-display text-3xl font-bold uppercase">Checkout</h1>
      {["name:Full name", "email:Email", "phone:Phone", "address:Delivery address", "city:City", "state:State"].map((s) => {
        const [n, l] = s.split(":");
        return <label key={n} className="block text-sm">{l}<input name={n} required type={n === "email" ? "email" : "text"} className={F} /></label>;
      })}
      <fieldset className="space-y-2"><legend className="text-sm font-medium">Delivery</legend>
        {DELIVERY.map((d) => <label key={d.id} className="flex gap-2 text-sm"><input type="radio" checked={delivery === d.id} onChange={() => setDelivery(d.id)} />{d.label} ({d.fee ? naira(d.fee) : "Free"})</label>)}
      </fieldset>
      <p className="text-right font-bold">Total: {naira(total + fee)}</p>
      {err && <p role="alert" className="text-sm font-medium text-red-700">{err}</p>}
      <button disabled={busy} className="btn-gold w-full disabled:opacity-50">{busy ? "Please wait..." : "Pay with Paystack"}</button>
    </form>
  );
}
