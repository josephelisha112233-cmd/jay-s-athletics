import { BRAND_NAME, PHONE, PHONE_INTL, WHATSAPP_URL, EMAIL, ADDRESS } from "@/config/brand";

export const metadata = { title: "Contact" };

export default function Contact() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold uppercase">Contact {BRAND_NAME}</h1>
      <ul className="mt-6 space-y-3 rounded-2xl border border-gold-light bg-white p-6">
        <li>Phone: <a className="text-gold-deep underline" href={`tel:${PHONE_INTL}`}>{PHONE}</a></li>
        <li>WhatsApp: <a className="text-gold-deep underline" href={WHATSAPP_URL}>Chat with us</a></li>
        <li>Email: <a className="text-gold-deep underline" href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
        <li>Address: {ADDRESS}</li>
      </ul>
    </div>
  );
}
