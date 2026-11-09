import crypto from "crypto";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { getProduct } from "@/lib/data";
import { DELIVERY } from "@/config/delivery";
import { FREE_DELIVERY_THRESHOLD } from "@/config/brand";

const Body = z.object({
  email: z.string().email(), name: z.string().min(2), phone: z.string().min(7), address: z.string().min(5), city: z.string().min(2), state: z.string().min(2),
  delivery: z.enum(["jos", "nationwide", "pickup"]),
  items: z.array(z.object({ slug: z.string(), size: z.string(), qty: z.number().int().min(1).max(10) })).min(1),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Please check your details." }, { status: 400 });
  const b = parsed.data;
  const { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: sk, PAYSTACK_SECRET_KEY: ps, NEXT_PUBLIC_SITE_URL: site } = process.env;
  if (!url || !sk || !ps) return Response.json({ error: "Checkout is not configured yet. Please order via WhatsApp." }, { status: 503 });

  // Prices come from the server, never from the browser.
  const lines = [];
  for (const i of b.items) {
    const p = await getProduct(i.slug);
    if (!p || !p.sizes.includes(i.size)) return Response.json({ error: `${i.slug} is unavailable in size ${i.size}.` }, { status: 400 });
    lines.push({ name: p.name, size: i.size, qty: i.qty, unit: p.salePrice ?? p.price });
  }
  const subtotal = lines.reduce((s, l) => s + l.unit * l.qty, 0);
  const base = DELIVERY.find((d) => d.id === b.delivery)!.fee;
  const fee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : base;
  const total = subtotal + fee;

  const db = createClient(url, sk);
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const userId = token ? (await db.auth.getUser(token)).data.user?.id ?? null : null;
  const ref = "JA-" + crypto.randomBytes(6).toString("hex");

  const { data: order, error } = await db.from("orders").insert({ user_id: userId, email: b.email, total, delivery_fee: fee, payment_ref: ref, shipping: { name: b.name, phone: b.phone, address: b.address, city: b.city, state: b.state, delivery: b.delivery } }).select("id").single();
  if (error || !order) return Response.json({ error: "Could not create order." }, { status: 500 });
  await db.from("order_items").insert(lines.map((l) => ({ order_id: order.id, name: l.name, size: l.size, qty: l.qty, unit_price: l.unit })));

  const r = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST", headers: { Authorization: `Bearer ${ps}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email: b.email, amount: total * 100, reference: ref, callback_url: `${site}/order/success?ref=${ref}` }),
  }).then((x) => x.json());
  if (!r.status) return Response.json({ error: "Payment could not start." }, { status: 502 });
  return Response.json({ url: r.data.authorization_url });
}
