"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget); const email = String(f.get("email")), password = String(f.get("password"));
    const { error } = mode === "in" ? await supabase().auth.signInWithPassword({ email, password }) : await supabase().auth.signUp({ email, password });
    if (error) setMsg(error.message); else if (mode === "in") location.href = "/account"; else setMsg("Check your email to confirm your account.");
  }
  const google = () => supabase().auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/account` } });
  const F = "w-full rounded-lg border border-gold-light bg-white px-3 py-2";
  return (
    <form onSubmit={submit} className="mx-auto max-w-sm space-y-3 px-4 py-14">
      <h1 className="font-display text-3xl font-bold uppercase">{mode === "in" ? "Log in" : "Create account"}</h1>
      <input name="email" type="email" required placeholder="Email" className={F} />
      <input name="password" type="password" required minLength={6} placeholder="Password" className={F} />
      {msg && <p role="status" className="text-sm">{msg}</p>}
      <button className="btn-gold w-full">{mode === "in" ? "Log in" : "Sign up"}</button>
      <button type="button" onClick={google} className="btn-outline w-full">Continue with Google</button>
      <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="text-sm underline">{mode === "in" ? "New here? Create an account" : "Have an account? Log in"}</button>
    </form>
  );
}
