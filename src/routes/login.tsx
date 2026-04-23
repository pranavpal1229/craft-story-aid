import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — Bellcurve" }] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-hero md:block">
        <div className="absolute inset-0 bg-noise opacity-[0.04]" />
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-gold text-gold-foreground">
              <span className="font-display text-lg font-bold">B</span>
            </div>
            <span className="font-display text-xl font-semibold">Bellcurve</span>
          </Link>
          <div>
            <p className="font-display text-3xl italic leading-snug text-gold">
              "Bellcurve gave me a narrative I actually believed in — and the reps to deliver it."
            </p>
            <p className="mt-4 text-sm text-primary-foreground/70">— Summer Analyst, Bulge-Bracket M&amp;A</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to your prep portal.</p>
          <form
            onSubmit={(e) => { e.preventDefault(); nav({ to: "/dashboard" }); }}
            className="mt-8 space-y-4"
          >
            <div>
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.edu"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
            </div>
            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
            >
              Continue <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
            <p className="text-center text-xs text-muted-foreground">
              Demo mode — any email works.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
