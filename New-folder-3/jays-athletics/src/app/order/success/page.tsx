"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function Success() {
  useEffect(() => { try { localStorage.removeItem("cart"); } catch {} }, []);
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-display text-3xl font-bold uppercase text-gold-deep">Thank you!</h1>
      <p className="mt-4">Your payment is being confirmed. We will contact you shortly about delivery.</p>
      <Link href="/" className="btn-gold mt-8">Continue shopping</Link>
    </div>
  );
}
