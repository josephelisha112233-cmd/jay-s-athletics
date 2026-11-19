"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { naira } from "@/lib/data";

type Order = { id: string; email: string; status: string; total: number };
type Cat = { id: number; name: string };
const STATUS = ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"];
const F = "rounded-lg border border-gold-light bg-white px-3 py-2";

export default function Admin() {
  const [ok, setOk] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [msg, setMsg] = useState("");
  const load = async () => {
    const s = supabase();
    setOrders(((await s.from("orders").select("id,email,status,total").order("created_at", { ascending: false })).data as Order[]) ?? []);
    setCats(((await s.from("categories").select("id,name")).data as Cat[]) ?? []);
  };
  useEffect(() => {
    const s = supabase();
    s.auth.getUser().then(async ({ data }) => {
      const role = data.user ? (await s.from("profiles").select("role").eq("id", data.user.id).single()).data?.role : null;
      setOk(role === "admin"); if (role === "admin") load();
    });
  }, []);

  async function addProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = e.currentTarget; const f = new FormData(form); const s = supabase(); setMsg("Saving...");
    const { data: p, error } = await s.from("products").insert({ name: f.get("name"), slug: f.get("slug"), description: f.get("description"), category_id: Number(f.get("cat")), base_price: Number(f.get("price")), sale_price: Number(f.get("sale")) || null }).select("id").single();
    if (error || !p) return setMsg(error?.message ?? "Failed");
    const sizes = String(f.get("sizes")).split(",").map((x) => x.trim()).filter(Boolean);
    await s.from("product_variants").insert(sizes.map((size) => ({ product_id: p.id, size, color: "Default", stock: Number(f.get("stock")) || 10 })));
    const img = f.get("image") as File;
    if (img?.size) {
      const path = `${p.id}/${Date.now()}-${img.name}`;
      const up = await s.storage.from("product-images").upload(path, img);
      if (!up.error) await s.from("product_images").insert({ product_id: p.id, url: s.storage.from("product-images").getPublicUrl(path).data.publicUrl });
    }
    form.reset(); setMsg("Product added.");
  }
  async function setStatus(id: string, status: string) { await supabase().from("orders").update({ status }).eq("id", id); load(); }

  if (ok === null) return <p className="p-10">Loading...</p>;
  if (!ok) return <p className="p-10">Admins only. Log in with an admin account.</p>;
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-10">
      <h1 className="font-display text-3xl font-bold uppercase">Admin</h1>
      <form onSubmit={addProduct} className="grid gap-3 rounded-2xl border border-gold-light bg-white p-5 sm:grid-cols-2">
        <h2 className="font-display text-xl uppercase sm:col-span-2">Add product</h2>
        <input name="name" required placeholder="Name" className={F} /><input name="slug" required placeholder="slug-like-this" className={F} />
        <input name="price" type="number" required placeholder="Price ₦" className={F} /><input name="sale" type="number" placeholder="Sale price ₦ (optional)" className={F} />
        <select name="cat" className={F}>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <input name="sizes" required placeholder="Sizes: 40,41,42" className={F} /><input name="stock" type="number" placeholder="Stock per size" className={F} />
        <input name="image" type="file" accept="image/*" className={F} />
        <textarea name="description" placeholder="Description" className={`${F} sm:col-span-2`} />
        <button className="btn-gold sm:col-span-2">Save product</button>{msg && <p role="status">{msg}</p>}
      </form>
      <section>
        <h2 className="font-display text-xl uppercase">Orders</h2>
        <ul className="mt-3 divide-y divide-gold-light rounded-2xl border border-gold-light bg-white">
          {orders.map((o) => (
            <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 p-4">
              <span>{o.email} · <b>{naira(o.total)}</b></span>
              <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value)} className={F}>{STATUS.map((x) => <option key={x}>{x}</option>)}</select>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
