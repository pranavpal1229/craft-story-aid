import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Target, BarChart3, Users, FileText, Brain, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/")({ component: Landing });

const FIRMS = ["Goldman Sachs", "Morgan Stanley", "JPMorgan", "Evercore", "Lazard", "Centerview", "PJT Partners", "Moelis", "Bank of America", "Citi", "McKinsey", "BCG", "Bain"];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Ticker />
      <Features />
      <HowItWorks />
      <Stats />
      <CTA />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-primary text-primary-foreground">
            <span className="font-display text-lg font-bold">B</span>
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">Bellcurve</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground transition">Platform</a>
          <a href="#how" className="hover:text-foreground transition">How it works</a>
          <a href="#stats" className="hover:text-foreground transition">Outcomes</a>
        </nav>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-elegant hover:opacity-90 transition"
        >
          Log in <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24">
      <div className="absolute inset-0 bg-gradient-hero opacity-[0.04]" />
      <div className="absolute left-1/2 top-20 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Trusted by recruits at top-tier firms
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl"
        >
          The recruiting edge for
          <br />
          <span className="italic text-gold">investment banking</span> &amp; consulting.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          Bellcurve turns fragmented prep into a single, intelligent workflow — persona-driven AI
          coaching, firm-specific resume review, and a live hiring-signal tracker built for the
          recruiting cycle.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            to="/login"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-elegant hover:scale-[1.02] transition"
          >
            Start your prep
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
          <a href="#how" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-sm font-medium hover:bg-accent transition">
            See the platform
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="relative mx-auto mt-20 max-w-4xl"
        >
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elegant">
            <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive/40" />
                <div className="h-2.5 w-2.5 rounded-full bg-gold/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-success/50" />
              </div>
              <span className="ml-3 text-xs text-muted-foreground">bellcurve.app/dashboard</span>
            </div>
            <div className="grid grid-cols-3 gap-4 p-6">
              {[
                { icon: Brain, label: "Readiness", value: "82%", trend: "+14" },
                { icon: TrendingUp, label: "Mock interviews", value: "23", trend: "+5" },
                { icon: Target, label: "Firms tracked", value: "12", trend: "live" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-background p-4 text-left">
                  <s.icon className="h-4 w-4 text-gold" />
                  <div className="mt-3 font-display text-3xl font-semibold">{s.value}</div>
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="text-success">{s.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Ticker() {
  return (
    <div className="border-y border-border bg-muted/20 py-6">
      <p className="mb-4 text-center text-xs uppercase tracking-widest text-muted-foreground">Coverage across target firms</p>
      <div className="ticker-mask overflow-hidden">
        <div className="animate-ticker flex w-max gap-12 whitespace-nowrap font-display text-lg text-muted-foreground">
          {[...FIRMS, ...FIRMS].map((f, i) => (
            <span key={i} className="opacity-60">{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

const FEATURES = [
  { icon: Sparkles, title: "Persona engine", desc: "Define a clear narrative that threads through every resume bullet, story, and outreach message." },
  { icon: FileText, title: "Resume review", desc: "Firm-specific, real-time feedback on formatting, content, and positioning." },
  { icon: Brain, title: "Mock interview AI", desc: "Behavioral, technical, and HireVue-style prompts drawn from a proprietary question bank." },
  { icon: TrendingUp, title: "Hiring-signal tracker", desc: "Monitor postings, application windows, and recruiting timelines in real time." },
  { icon: Users, title: "Networking CRM", desc: "Alumni matching, outreach templates, and follow-up scheduling — all in one place." },
  { icon: BarChart3, title: "Readiness analytics", desc: "Score yourself on technical, behavioral, and fit — benchmarked against peer cohorts." },
];

function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-32">
      <div className="mb-16 max-w-2xl">
        <p className="text-xs uppercase tracking-widest text-gold">The platform</p>
        <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Everything you need. One workflow.</h2>
        <p className="mt-4 text-lg text-muted-foreground">No more cobbling together WSO threads, prep books, and outdated coaches.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
          >
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold/5 blur-2xl transition group-hover:bg-gold/10" />
            <f.icon className="h-6 w-6 text-gold" />
            <h3 className="mt-5 font-display text-xl font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Discover your persona", d: "AI-led intake surfaces your interests, strengths, and authentic narrative." },
    { n: "02", t: "Tailor your resume", d: "Bullet-by-bullet rewrites aligned to your story and target firms." },
    { n: "03", t: "Train with realistic reps", d: "Behavioral, technical, and HireVue mocks with structured feedback." },
    { n: "04", t: "Track signals & convert", d: "Live hiring data + networking CRM keep you ahead of the cycle." },
  ];
  return (
    <section id="how" className="border-y border-border bg-muted/20 py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-gold">How it works</p>
          <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">A structured path from prep to offer.</h2>
        </div>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="bg-background p-8">
              <div className="font-display text-sm text-gold">{s.n}</div>
              <h3 className="mt-6 font-display text-xl font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { v: "3.2x", l: "Higher first-round conversion vs. self-prep" },
    { v: "47%", l: "Average improvement on technical readiness" },
    { v: "12 wks", l: "Median time from intake to first offer" },
  ];
  return (
    <section id="stats" className="mx-auto max-w-7xl px-6 py-32">
      <div className="grid gap-8 md:grid-cols-3">
        {stats.map((s) => (
          <div key={s.l} className="rounded-2xl border border-border bg-card p-10">
            <div className="font-display text-6xl font-semibold tracking-tight text-gold">{s.v}</div>
            <p className="mt-4 text-sm text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 pb-32">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-primary px-10 py-20 text-center text-primary-foreground shadow-elegant">
        <div className="absolute inset-0 bg-noise opacity-[0.03]" />
        <div className="absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl font-display text-4xl font-semibold md:text-5xl">
            The bell curve is the market. <span className="italic text-gold">Be the outlier.</span>
          </h2>
          <Link
            to="/login"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-medium text-gold-foreground shadow-glow hover:scale-[1.02] transition"
          >
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2">
          <div className="grid h-6 w-6 place-items-center rounded bg-gradient-primary text-primary-foreground">
            <span className="font-display text-xs font-bold">B</span>
          </div>
          <span>© {new Date().getFullYear()} Bellcurve</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Contact</a>
        </div>
      </div>
    </footer>
  );
}
