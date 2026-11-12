import Link from "next/link";
import { NAV } from "@/components/Header";

export default function Home() {
  return (
    <>
      <section className="bg-gradient-to-b from-white-ivory to-white-pearl">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="font-display text-4xl font-bold uppercase md:text-6xl">Play <span className="text-gold-deep">Gold</span> Standard</h1>
          <p className="mx-auto mt-4 max-w-xl">Premium football cleats and sports shoes, delivered nationwide.</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/c/football-cleats" className="btn-gold">Shop Cleats</Link>
            <Link href="/c/sports-shoes" className="btn-outline">Shop Shoes</Link>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {NAV.map(([label, href]) => (
          <Link key={href} href={href} className="rounded-2xl border border-gold-light bg-white p-8 text-center shadow-soft transition hover:border-gold">
            <span className="font-display text-xl uppercase">{label}</span>
          </Link>
        ))}
      </section>
    </>
  );
}
