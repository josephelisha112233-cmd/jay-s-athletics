import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get("x-paystack-signature") ?? "";
  const hash = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!).update(raw).digest("hex");
  if (hash.length !== sig.length || !crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(sig)))
    return new Response("Invalid signature", { status: 401 });

  const event = JSON.parse(raw);
  if (event.event === "charge.success") {
    const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    // Idempotent: only moves pending -> paid. TODO: decrement stock + send emails.
    await db.from("orders").update({ status: "paid" }).eq("payment_ref", event.data.reference).eq("status", "pending");
  }
  return new Response("ok");
}
