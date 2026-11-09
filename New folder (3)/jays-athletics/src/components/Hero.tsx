"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const SLIDES = [
  { h: "Play Gold Standard", p: "Premium football cleats, delivered nationwide.", href: "/c/football-cleats", cta: "Shop Cleats" },
  { h: "Run. Train. Win.", p: "Sports shoes built for every session.", href: "/c/sports-shoes", cta: "Shop Shoes" },
  { h: "Match Day Ready", p: "Club and national team kits.", href: "/c/kits-jerseys", cta: "Shop Kits" },
];

export default function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 5000); return () => clearInterval(t); }, []);
  const s = SLIDES[i];
  return (
    <section className="bg-gradient-to-b from-white-ivory to-white-pearl" aria-roledescription="carousel">
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="font-display text-4xl font-bold uppercase md:text-6xl">{s.h}</h1>
        <p className="mx-auto mt-4 max-w-xl">{s.p}</p>
        <Link href={s.href} className="btn-gold mt-8">{s.cta}</Link>
        <div className="mt-8 flex justify-center gap-2">
          {SLIDES.map((_, n) => <button key={n} aria-label={`Slide ${n + 1}`} onClick={() => setI(n)} className={`h-2.5 w-2.5 rounded-full ${n === i ? "bg-gold-deep" : "bg-gold-light"}`} />)}
        </div>
      </div>
    </section>
  );
}
