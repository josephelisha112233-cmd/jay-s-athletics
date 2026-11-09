"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Wishlist() {
  const [l, setL] = useState<string[]>([]);
  useEffect(() => { try { setL(JSON.parse(localStorage.getItem("wishlist") ?? "[]")); } catch {} }, []);
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold uppercase">Wishlist</h1>
      <ul className="mt-6 space-y-2">{l.map((s) => <li key={s}><Link className="text-gold-deep underline" href={`/p/${s}`}>{s.replace(/-/g, " ")}</Link></li>)}</ul>
      {!l.length && <p className="mt-6">Nothing saved yet.</p>}
    </div>
  );
}
