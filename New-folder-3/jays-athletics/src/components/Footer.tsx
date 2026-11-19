import Image from "next/image";
import Link from "next/link";
import { BRAND_NAME, PHONE, PHONE_INTL, WHATSAPP_URL, EMAIL, ADDRESS } from "@/config/brand";

export default function Footer() {
  return (
    <footer className="mt-16 bg-black text-white-mist">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <Image src="/images/logo.png" alt={BRAND_NAME} width={96} height={96} className="rounded-xl border border-gold" />
          <p className="mt-4 text-sm">Football cleats, sports shoes and kits for every athlete.</p>
        </div>
        <div className="space-y-2 text-sm">
          <h3 className="font-display text-gold">Shop</h3>
          <Link className="block hover:text-gold" href="/c/football-cleats">Football Cleats</Link>
          <Link className="block hover:text-gold" href="/c/sports-shoes">Sports Shoes</Link>
          <Link className="block hover:text-gold" href="/c/sale">Sale</Link>
        </div>
        <div className="space-y-2 text-sm">
          <h3 className="font-display text-gold">Contact</h3>
          <a className="block hover:text-gold" href={`tel:${PHONE_INTL}`}>{PHONE}</a>
          <a className="block hover:text-gold" href={WHATSAPP_URL}>WhatsApp us</a>
          <a className="block hover:text-gold" href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <p>{ADDRESS}</p>
        </div>
      </div>
      <p className="border-t border-gold-deep/40 py-4 text-center text-xs">© {new Date().getFullYear()} {BRAND_NAME}</p>
    </footer>
  );
}
