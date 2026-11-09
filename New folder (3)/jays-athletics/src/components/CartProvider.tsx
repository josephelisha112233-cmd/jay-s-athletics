"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type Item = { key: string; slug: string; name: string; price: number; size: string; qty: number };
type Ctx = { items: Item[]; add: (i: Omit<Item, "key" | "qty">) => void; remove: (key: string) => void; total: number; count: number };
const C = createContext<Ctx>({ items: [], add: () => {}, remove: () => {}, total: 0, count: 0 });
export const useCart = () => useContext(C);

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem("cart") ?? "[]")); } catch {} }, []);
  const save = (n: Item[]) => { setItems(n); try { localStorage.setItem("cart", JSON.stringify(n)); } catch {} };
  const add: Ctx["add"] = (i) => {
    const key = `${i.slug}-${i.size}`;
    save(items.some((x) => x.key === key) ? items.map((x) => (x.key === key ? { ...x, qty: x.qty + 1 } : x)) : [...items, { ...i, key, qty: 1 }]);
  };
  const remove = (key: string) => save(items.filter((x) => x.key !== key));
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  return <C.Provider value={{ items, add, remove, total, count }}>{children}</C.Provider>;
}
