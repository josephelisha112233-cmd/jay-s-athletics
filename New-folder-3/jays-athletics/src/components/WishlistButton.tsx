"use client";
import { useEffect, useState } from "react";

export default function WishlistButton({ slug }: { slug: string }) {
  const [on, setOn] = useState(false);
  const read = (): string[] => { try { return JSON.parse(localStorage.getItem("wishlist") ?? "[]"); } catch { return []; } };
  useEffect(() => setOn(read().includes(slug)), [slug]);
  const toggle = () => {
    const l = read(), n = l.includes(slug) ? l.filter((x) => x !== slug) : [...l, slug];
    try { localStorage.setItem("wishlist", JSON.stringify(n)); } catch {}
    setOn(n.includes(slug));
  };
  return <button onClick={toggle} aria-pressed={on} className="btn-outline mt-4">{on ? "♥ Saved to wishlist" : "♡ Add to wishlist"}</button>;
}
