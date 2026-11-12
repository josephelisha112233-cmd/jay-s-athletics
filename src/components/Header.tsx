import Image from "next/image";
import Link from "next/link";
import { BRAND_NAME, PHONE, WHATSAPP_URL, FREE_DELIVERY_THRESHOLD } from "@/config/brand";

export const NAV = [
  ["Football Cleats", "/c/football-cleats"], ["Sports Shoes", "/c/sports-shoes"],
  ["Kits & Jerseys", "/c/kits-jerseys"], ["Sportswear", "/c/sportswear"],
  ["Accessories", "/c/accessories"], ["Kids", "/c/kids"], ["Sale", "/c/sale"],
] as const;

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gold-light bg-white">
      <div className="bg-gold-deep px-4 py-2 text-center text-sm text-white">
        Free delivery over ₦{FREE_DELIVERY_THRESHOLD.toLocaleString()} · Order on{" "}
        <a className="underline" href={WHATSAPP_URL}>WhatsApp {PHONE}</a>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" aria-label={BRAND_NAME} className="rounded-xl border border-gold bg-black p-1">
          <Image src="/images/logo.png" alt={BRAND_NAME} width={56} height={56} priority className="h-11 w-11 md:h-14 md:w-14" />
        </Link>
        <nav className="hidden gap-6 font-display text-sm uppercase tracking-wide lg:flex" aria-label="Main">
          {NAV.map(([label, href]) => <Link key={href} href={href} className="hover:text-gold-deep">{label}</Link>)}
        </nav>
        <div className="flex gap-4 text-sm font-medium">
          <Link href="/search">Search</Link><Link href="/account">Account</Link><Link href="/cart">Cart</Link>
        </div>
      </div>
    </header>
  );
}
