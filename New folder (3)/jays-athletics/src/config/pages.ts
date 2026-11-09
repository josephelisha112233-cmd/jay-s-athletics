import { BRAND_NAME, PHONE, EMAIL, ADDRESS } from "./brand";
export const PAGES: Record<string, { title: string; body: string[] }> = {
  about: { title: "About us", body: [`${BRAND_NAME} is based in ${ADDRESS}. We sell football cleats, sports shoes, kits and sportswear to athletes across Nigeria.`, "Every pair is checked before it leaves our hands, and we are always one WhatsApp message away."] },
  faqs: { title: "FAQs", body: ["How do I order? Add items to your cart and pay with Paystack, or send your order on WhatsApp.", `How do I reach you? Call ${PHONE} or email ${EMAIL}.`, "Can I exchange an item? Yes, within 7 days if it is unworn and in its original packaging."] },
  "delivery-returns": { title: "Delivery & returns", body: ["Jos: 1-2 working days. Nationwide: 3-5 working days.", "Free delivery on orders above the free-delivery threshold shown in the site banner.", "Exchanges within 7 days for unworn items in original packaging."] },
  "size-guide": { title: "Size guide", body: ["Footwear is sold in EU sizes 36-47. Measure your foot from heel to longest toe in cm: 24.5cm is about EU 39, 26cm about EU 41, 27.5cm about EU 44.", "Clothing runs S to XXL. If you are between sizes, choose the larger size."] },
  privacy: { title: "Privacy policy", body: [`${BRAND_NAME} collects only the details needed to process your order (name, contact and delivery address). We never sell your data. Contact ${EMAIL} to request deletion.`] },
  terms: { title: "Terms of service", body: ["Prices are in Naira and may change without notice.", "Orders are confirmed once payment is received.", `Questions? Contact ${EMAIL}.`] },
};
