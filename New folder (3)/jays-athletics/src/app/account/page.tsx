"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { naira } from "@/lib/data";

type O = { id: string; status: string; total: number; created_at: string };

export default function Account() {
  const [email, setEmail] = useState<string | null | undefined>(undefined);
  const [orders, setOrders] = useState<O[]>([]);
  useEffect(() => {
    const s = supabase();
    s.auth.getUser().then(async ({ data }) => {
      setEmail(data.user?.email ?? null);
      if (data.user) setOrders(((await s.from("orders").select("id,status,total,created_at").order("created_at", { ascending: false })).data as O[]) ?? []);
    });
  }, []);
  if (email === undefined) return <p className="p-10">Loading...</p>;
  if (!email) return <p className="p-10">Please <Link className="underline" href="/login">log in</Link> to see your account.</p>;
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold uppercase">My account</h1>
      <p className="mt-2">{email}</p>
      <button className="btn-outline mt-4" onClick={async () => { await supabase().auth.signOut(); location.href = "/"; }}>Log out</button>
      <h2 className="mt-8 font-display text-xl uppercase">Order history</h2>
      <ul className="mt-3 divide-y divide-gold-light rounded-2xl border border-gold-light bg-white">
        {orders.map((o) => <li key={o.id} className="flex justify-between p-4"><span>{new Date(o.created_at).toLocaleDateString()} · {o.status}</span><b>{naira(o.total)}</b></li>)}
        {!orders.length && <li className="p-4">No orders yet.</li>}
      </ul>
    </div>
  );
}
