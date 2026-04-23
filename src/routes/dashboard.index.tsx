import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, User, FileText, GraduationCap, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHomeView,
});

const STEPS = [
  { to: "/persona" as const, icon: User, title: "Learn about Applicant", desc: "Build your recruiting persona through guided AI questions.", cta: "Begin profile", status: "Start here" },
  { to: "/resume" as const, icon: FileText, title: "Resume Builder", desc: "Upload your resume — we tailor it to your persona and target firms.", cta: "Upload resume", status: "Step 2" },
  { to: "/lesson" as const, icon: GraduationCap, title: "Interactive Lessons", desc: "Pre-quiz, deep interactive lesson, then post-quiz to measure growth.", cta: "Start DCF lesson", status: "Step 3" },
];

function DashboardHomeView() {
  return (
    <div className="mx-auto max-w-6xl px-8 py-12">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-gold">Welcome back</p>
          <h1 className="mt-2 font-display text-4xl font-semibold">Your recruiting workspace</h1>
          <p className="mt-2 text-muted-foreground">A structured path from self-discovery to offer.</p>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm md:flex">
          <TrendingUp className="h-4 w-4 text-gold" />
          <span className="text-muted-foreground">Readiness:</span>
          <span className="font-semibold">42%</span>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {STEPS.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-card transition hover:-translate-y-1 hover:shadow-elegant"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/5 blur-2xl transition group-hover:bg-gold/10" />
            <div className="text-xs uppercase tracking-widest text-gold">{s.status}</div>
            <s.icon className="mt-4 h-6 w-6 text-foreground" />
            <h3 className="mt-4 font-display text-xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
              {s.cta}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-7">
          <h3 className="font-display text-lg font-semibold">Recruiting cycle</h3>
          <p className="mt-1 text-sm text-muted-foreground">Top firms tracked in real time</p>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              { f: "Goldman Sachs SA 2026", s: "Apps open in 18 days", c: "text-gold" },
              { f: "Evercore SA 2026", s: "Open now", c: "text-success" },
              { f: "Morgan Stanley SA 2026", s: "Open now", c: "text-success" },
              { f: "Centerview SA 2026", s: "Closed", c: "text-muted-foreground" },
            ].map((r) => (
              <li key={r.f} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                <span>{r.f}</span>
                <span className={`text-xs font-medium ${r.c}`}>{r.s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-7">
          <h3 className="font-display text-lg font-semibold">Suggested next action</h3>
          <p className="mt-1 text-sm text-muted-foreground">Highest-leverage thing to do today</p>
          <div className="mt-5 rounded-xl bg-gradient-primary p-6 text-primary-foreground">
            <p className="text-xs uppercase tracking-widest text-gold">Start with</p>
            <p className="mt-2 font-display text-xl">Build your applicant persona</p>
            <p className="mt-2 text-sm text-primary-foreground/80">
              Everything else — resume, mocks, outreach — flows from a clear narrative.
            </p>
            <Link to="/persona" className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2 text-sm font-medium text-gold-foreground">
              Begin <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
