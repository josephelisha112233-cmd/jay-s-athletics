import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { EMAIL, BRAND_NAME } from "@/config/brand";

async function mail(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) return;
  await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: `${BRAND_NAME} <onboarding@resend.dev>`, to, subject, html }) }).catch(() => {});
}

export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get("x-paystack-signature") ?? "";
  const hash = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!).update(raw).digest("hex");
  if (hash.length !== sig.length || !crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(sig))) return new Response("Invalid signature", { status: 401 });

  const event = JSON.parse(raw);
  if (event.event === "charge.success") {
    const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    // Idempotent: only the first webhook flips pending -> paid, so stock/emails run once.
    const { data: order } = await db.from("orders").update({ status: "paid" }).eq("payment_ref", event.data.reference).eq("status", "pending").select("id,email,total").maybeSingle();
    if (order) {
      const { data: items } = await db.from("order_items").select("name,size,qty").eq("order_id", order.id);
      for (const it of items ?? []) {
        const { data: prod } = await db.from("products").select("id").eq("name", it.name).maybeSingle();
        if (!prod) continue;
        const { data: v } = await db.from("product_variants").select("id,stock").eq("product_id", prod.id).eq("size", it.size).maybeSingle();
        if (v) await db.from("product_variants").update({ stock: Math.max(0, v.stock - it.qty) }).eq("id", v.id);
      }
      const list = (items ?? []).map((i) => `<li>${i.qty} x ${i.name} (size ${i.size})</li>`).join("");
      const html = `<h2>Thank you for your order!</h2><ul>${list}</ul><p>Total: ₦${Number(order.total).toLocaleString()}</p>`;
      await mail(order.email, `${BRAND_NAME} order confirmed`, html);
      await mail(EMAIL, "New paid order", html);
    }
  }
  return new Response("ok");
}
