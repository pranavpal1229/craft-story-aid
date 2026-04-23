import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { AppShell } from "../components/AppShell";

export const Route = createFileRoute("/persona")({
  head: () => ({ meta: [{ title: "Applicant Profile — Bellcurve" }] }),
  component: () => <AppShell />,
});

const QUESTIONS = [
  { q: "What first drew you to investment banking?", placeholder: "e.g., I built a small e-commerce store in high school and got hooked on how capital flows shape what gets built…" },
  { q: "Describe a moment you were genuinely proud of an outcome you drove.", placeholder: "Walk through what you did and why it mattered." },
  { q: "What kind of work energizes you — modeling, client interaction, deal strategy, or process management?", placeholder: "Be specific about the texture of the work." },
  { q: "Which sector or product area secretly fascinates you?", placeholder: "Healthcare, tech, restructuring, levfin, M&A — and why." },
  { q: "What's a weakness you've actively worked on?", placeholder: "Frame it honestly with the work you've done to address it." },
  { q: "If you got an offer tomorrow, what would the first 30 days look like for you?", placeholder: "Show how you think about ramping up and adding value." },
];

export const componentRoute = Route;

function PersonaView() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(QUESTIONS.length).fill(""));
  const [done, setDone] = useState(false);

  const total = QUESTIONS.length;
  const progress = ((step + (done ? 1 : 0)) / (total + 1)) * 100;

  if (done) return <PersonaReport answers={answers} />;

  return (
    <div className="mx-auto max-w-3xl px-8 py-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-gold">Persona intake</p>
          <h1 className="mt-2 font-display text-3xl font-semibold">Learn about Applicant</h1>
        </div>
        <span className="text-sm text-muted-foreground">{step + 1} / {total}</span>
      </div>

      <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-gradient-gold transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="mt-10 rounded-2xl border border-border bg-card p-8 shadow-card"
        >
          <Sparkles className="h-5 w-5 text-gold" />
          <h2 className="mt-4 font-display text-2xl font-semibold leading-snug">{QUESTIONS[step].q}</h2>
          <textarea
            value={answers[step]}
            onChange={(e) => {
              const next = [...answers];
              next[step] = e.target.value;
              setAnswers(next);
            }}
            placeholder={QUESTIONS[step].placeholder}
            rows={6}
            className="mt-6 w-full resize-none rounded-lg border border-input bg-background p-4 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
          />
          <div className="mt-6 flex items-center justify-between">
            <button
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
              className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              disabled={!answers[step].trim()}
              onClick={() => (step === total - 1 ? setDone(true) : setStep((s) => s + 1))}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-elegant hover:opacity-90 disabled:opacity-40 transition"
            >
              {step === total - 1 ? "Generate report" : "Next"} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function PersonaReport({ answers }: { answers: string[] }) {
  const wordCount = answers.join(" ").trim().split(/\s+/).length;
  return (
    <div className="mx-auto max-w-4xl px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
          <CheckCircle2 className="h-3.5 w-3.5" /> Profile generated
        </div>
        <h1 className="mt-4 font-display text-4xl font-semibold">Your Bellcurve Persona</h1>
        <p className="mt-2 text-muted-foreground">A working draft of the narrative we'll thread through every part of your application.</p>
      </motion.div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {[
          { l: "Archetype", v: "The Builder-Operator", d: "Hands-on, outcomes-driven, gravitates toward growth-stage M&A." },
          { l: "Core strength", v: "Synthesis under pressure", d: "Reduces messy ambiguity into clean, decision-ready recommendations." },
          { l: "Risk to manage", v: "Over-customization", d: "Tendency to dive deep before pressure-testing direction with stakeholders." },
        ].map((c) => (
          <div key={c.l} className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <p className="text-xs uppercase tracking-widest text-gold">{c.l}</p>
            <p className="mt-3 font-display text-xl font-semibold">{c.v}</p>
            <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-card">
        <h2 className="font-display text-xl font-semibold">Your one-line narrative</h2>
        <p className="mt-4 font-display text-2xl italic leading-relaxed text-foreground/90">
          "An operator who learned to build before learning to model — now drawn to advising the
          founders and management teams I once tried to be."
        </p>
        <div className="mt-6 grid gap-4 text-sm md:grid-cols-2">
          <div className="rounded-lg bg-muted/40 p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Use in interviews</p>
            <p className="mt-2">Anchor your "Why banking?" around builder→advisor evolution.</p>
          </div>
          <div className="rounded-lg bg-muted/40 p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Use in outreach</p>
            <p className="mt-2">Lead cold emails with a specific deal that resonates with this lens.</p>
          </div>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">Generated from {wordCount} words across {answers.length} responses.</p>
      </div>

      <div className="mt-8 flex justify-end">
        <Link
          to="/resume"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-elegant hover:opacity-90 transition"
        >
          Continue to resume <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export const Index = () => null;
Route.options.component = () => <AppShell />;
