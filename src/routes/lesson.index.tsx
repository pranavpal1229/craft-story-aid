import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  GripVertical,
  Sparkles,
  Trophy,
  RotateCcw,
  Lightbulb,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/lesson/")({
  component: LessonFlow,
});

// ============= QUIZ DATA =============
const QUIZ: { q: string; options: string[]; answer: number; explain: string }[] = [
  {
    q: "What does DCF stand for in valuation?",
    options: ["Discounted Cash Flow", "Direct Capital Funding", "Diluted Common Float", "Deferred Corporate Finance"],
    answer: 0,
    explain: "DCF = Discounted Cash Flow. It values a business by projecting future cash flows and discounting them back to present value.",
  },
  {
    q: "Which discount rate is used to value the entire firm (debt + equity)?",
    options: ["Cost of Equity (Ke)", "WACC", "Risk-free rate", "Beta × ERP"],
    answer: 1,
    explain: "WACC (Weighted Average Cost of Capital) blends the cost of debt and equity weighted by capital structure. It's used for unlevered free cash flows.",
  },
  {
    q: "Terminal value typically represents what % of total enterprise value in a DCF?",
    options: ["10–20%", "30–40%", "60–80%", "Always 50%"],
    answer: 2,
    explain: "Terminal value usually accounts for 60–80% of total EV — making the perpetuity growth rate and exit multiple assumptions extremely sensitive.",
  },
  {
    q: "All else equal, an increase in WACC will:",
    options: ["Increase implied equity value", "Decrease implied equity value", "Have no effect", "Only affect terminal value"],
    answer: 1,
    explain: "Higher WACC → lower present value of future cash flows → lower implied enterprise and equity value.",
  },
  {
    q: "Unlevered Free Cash Flow starts from which line item?",
    options: ["Net Income", "EBIT (or EBITDA)", "Revenue", "Operating Cash Flow"],
    answer: 1,
    explain: "UFCF starts from EBIT: EBIT × (1 – tax) + D&A – CapEx – ΔWC. It's pre-financing and represents cash to all capital providers.",
  },
];

// ============= MAIN FLOW =============
type Phase = "intro" | "preQuiz" | "preResult" | "lesson" | "postQuiz" | "postResult";

function LessonFlow() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [preAnswers, setPreAnswers] = useState<number[]>(Array(QUIZ.length).fill(-1));
  const [postAnswers, setPostAnswers] = useState<number[]>(Array(QUIZ.length).fill(-1));

  const preScore = preAnswers.filter((a, i) => a === QUIZ[i].answer).length;
  const postScore = postAnswers.filter((a, i) => a === QUIZ[i].answer).length;

  return (
    <div className="mx-auto max-w-5xl px-8 py-12">
      {phase === "intro" && <Intro onStart={() => setPhase("preQuiz")} />}
      {phase === "preQuiz" && (
        <Quiz
          title="Diagnostic Quiz"
          subtitle="Let's see what you already know about DCF valuation. Don't worry — you'll retake this after the lesson."
          answers={preAnswers}
          setAnswers={setPreAnswers}
          onDone={() => setPhase("preResult")}
        />
      )}
      {phase === "preResult" && (
        <QuizResult
          score={preScore}
          isPre
          onNext={() => setPhase("lesson")}
        />
      )}
      {phase === "lesson" && <Lesson onDone={() => setPhase("postQuiz")} />}
      {phase === "postQuiz" && (
        <Quiz
          title="Post-Lesson Quiz"
          subtitle="Same questions. Let's measure how much you've learned."
          answers={postAnswers}
          setAnswers={setPostAnswers}
          onDone={() => setPhase("postResult")}
        />
      )}
      {phase === "postResult" && (
        <Comparison preScore={preScore} postScore={postScore} answers={postAnswers} />
      )}
    </div>
  );
}

// ============= INTRO =============
function Intro({ onStart }: { onStart: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <p className="text-xs uppercase tracking-widest text-gold">Lesson 01</p>
      <h1 className="mt-2 font-display text-5xl font-semibold">DCF Valuation</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
        The single most-asked technical topic in IB interviews. We'll diagnose, teach, and re-test —
        all in under 20 minutes.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          { n: "1", t: "Diagnostic quiz", d: "5 questions to baseline" },
          { n: "2", t: "Interactive lesson", d: "Drag-drop, sliders, games" },
          { n: "3", t: "Post-quiz + delta", d: "See your improvement" },
        ].map((s) => (
          <div key={s.n} className="rounded-2xl border border-border bg-card p-6">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-gold font-display text-sm font-semibold text-gold-foreground">
              {s.n}
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">{s.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="group mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-elegant hover:scale-[1.02] transition"
      >
        Start diagnostic <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </button>
    </motion.div>
  );
}

// ============= QUIZ =============
function Quiz({
  title,
  subtitle,
  answers,
  setAnswers,
  onDone,
}: {
  title: string;
  subtitle: string;
  answers: number[];
  setAnswers: (a: number[]) => void;
  onDone: () => void;
}) {
  const [i, setI] = useState(0);
  const q = QUIZ[i];
  const selected = answers[i];

  const choose = (idx: number) => {
    const next = [...answers];
    next[i] = idx;
    setAnswers(next);
  };

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-gold">{title}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold">Question {i + 1} of {QUIZ.length}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-gradient-gold transition-all" style={{ width: `${((i + 1) / QUIZ.length) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-card"
        >
          <h2 className="font-display text-2xl font-semibold leading-snug">{q.q}</h2>
          <div className="mt-6 space-y-3">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => choose(idx)}
                className={`flex w-full items-center gap-3 rounded-xl border px-5 py-4 text-left text-sm transition ${
                  selected === idx
                    ? "border-gold bg-gold/10 ring-2 ring-gold/30"
                    : "border-border bg-background hover:border-gold/40 hover:bg-accent"
                }`}
              >
                <span className={`grid h-6 w-6 flex-shrink-0 place-items-center rounded-full border text-xs font-semibold ${
                  selected === idx ? "border-gold bg-gold text-gold-foreground" : "border-border text-muted-foreground"
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{opt}</span>
              </button>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between">
            <button
              disabled={i === 0}
              onClick={() => setI(i - 1)}
              className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              disabled={selected === -1}
              onClick={() => (i === QUIZ.length - 1 ? onDone() : setI(i + 1))}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-elegant hover:opacity-90 disabled:opacity-40 transition"
            >
              {i === QUIZ.length - 1 ? "Submit" : "Next"} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function QuizResult({ score, isPre, onNext }: { score: number; isPre: boolean; onNext: () => void }) {
  const pct = Math.round((score / QUIZ.length) * 100);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-gold shadow-glow">
        <Sparkles className="h-9 w-9 text-gold-foreground" />
      </div>
      <h1 className="mt-6 font-display text-4xl font-semibold">
        {isPre ? "Baseline locked in" : "Lesson complete"}
      </h1>
      <p className="mt-2 text-muted-foreground">You scored</p>
      <div className="mt-2 font-display text-7xl font-semibold text-gold">{score}<span className="text-3xl text-muted-foreground"> / {QUIZ.length}</span></div>
      <p className="mt-1 text-sm text-muted-foreground">{pct}% accuracy</p>
      <p className="mx-auto mt-6 max-w-md text-sm text-muted-foreground">
        {isPre
          ? "Now let's actually learn this. The interactive lesson takes about 10 minutes."
          : "Compare your before-and-after on the next screen."}
      </p>
      <button onClick={onNext} className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-elegant hover:opacity-90 transition">
        {isPre ? "Start the lesson" : "See your growth"} <ArrowRight className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

// ============= LESSON =============
function Lesson({ onDone }: { onDone: () => void }) {
  const [section, setSection] = useState(0);
  const sections = [
    { title: "What is a DCF?", el: <SectionIntro /> },
    { title: "Order the DCF steps", el: <DragOrderGame /> },
    { title: "Build the WACC", el: <WACCMatchGame /> },
    { title: "Sensitivity playground", el: <SensitivitySlider /> },
    { title: "Spot the assumption", el: <SpotTheError /> },
  ];
  const cur = sections[section];

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-gold">Interactive lesson · {section + 1} of {sections.length}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold">{cur.title}</h1>
        </div>
        <div className="hidden gap-1 md:flex">
          {sections.map((_, i) => (
            <div key={i} className={`h-1.5 w-10 rounded-full transition ${i <= section ? "bg-gold" : "bg-muted"}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={section}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mt-6"
        >
          {cur.el}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between">
        <button
          disabled={section === 0}
          onClick={() => setSection(section - 1)}
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30"
        >
          <ArrowLeft className="h-4 w-4" /> Previous
        </button>
        <button
          onClick={() => (section === sections.length - 1 ? onDone() : setSection(section + 1))}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-elegant hover:opacity-90 transition"
        >
          {section === sections.length - 1 ? "Take the post-quiz" : "Continue"} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ----- Section 1: Concept intro -----
function SectionIntro() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
        <div className="flex items-start gap-4">
          <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg bg-gradient-gold text-gold-foreground">
            <Lightbulb className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold">The core idea</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              A business is worth the cash it will generate over its lifetime, discounted back to today.
              That's it. Everything else — WACC, terminal value, projections — is just plumbing to
              answer that one question:
            </p>
            <p className="mt-3 font-display text-lg italic text-foreground">"What is a dollar in year 5 worth today?"</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { t: "Project cash flows", d: "Forecast 5–10 years of unlevered FCF.", color: "bg-gold/10 text-gold" },
          { t: "Pick a discount rate", d: "WACC reflects the riskiness of those flows.", color: "bg-success/10 text-success" },
          { t: "Add terminal value", d: "Capture all cash flows after the explicit period.", color: "bg-primary/10 text-primary" },
        ].map((c) => (
          <div key={c.t} className="rounded-xl border border-border bg-card p-5">
            <span className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${c.color}`}>{c.t}</span>
            <p className="mt-3 text-sm text-muted-foreground">{c.d}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-gradient-primary p-8 text-primary-foreground">
        <p className="text-xs uppercase tracking-widest text-gold">The formula</p>
        <p className="mt-3 font-display text-2xl">
          Enterprise Value = Σ <span className="text-gold">FCF<sub>t</sub></span> / (1 + WACC)<sup>t</sup> + Terminal Value
        </p>
        <p className="mt-3 text-sm text-primary-foreground/80">
          Don't memorize this. Understand each piece — that's what you'll be tested on.
        </p>
      </div>
    </div>
  );
}

// ----- Section 2: Drag-and-drop ordering -----
const CORRECT_ORDER = [
  "Project unlevered free cash flows for 5–10 years",
  "Calculate WACC as the discount rate",
  "Discount each year's FCF to present value",
  "Calculate terminal value (Gordon Growth or Exit Multiple)",
  "Discount terminal value to present value",
  "Sum to get Enterprise Value, then bridge to Equity Value",
];

function DragOrderGame() {
  const [items, setItems] = useState(() => shuffle([...CORRECT_ORDER]));
  const [checked, setChecked] = useState(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const correct = items.every((it, i) => it === CORRECT_ORDER[i]);

  const onEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      setItems((arr) => {
        const oldI = arr.indexOf(active.id as string);
        const newI = arr.indexOf(over.id as string);
        return arrayMove(arr, oldI, newI);
      });
      setChecked(false);
    }
  };

  return (
    <div>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <p className="text-sm text-muted-foreground">
          Drag the steps into the correct order for building a DCF model.
        </p>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <ul className="mt-5 space-y-2">
              {items.map((it, idx) => (
                <SortableItem key={it} id={it} index={idx} correct={checked && it === CORRECT_ORDER[idx]} wrong={checked && it !== CORRECT_ORDER[idx]} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => { setItems(shuffle([...CORRECT_ORDER])); setChecked(false); }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reshuffle
          </button>
          <button
            onClick={() => setChecked(true)}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
          >
            Check my order
          </button>
        </div>

        {checked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-5 flex items-center gap-3 rounded-lg p-4 text-sm ${
              correct ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
            }`}
          >
            {correct ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            <span className="font-medium">
              {correct
                ? "Perfect. That's exactly how analysts build it on the desk."
                : "Not quite — items in red are out of place. Try again."}
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function SortableItem({ id, index, correct, wrong }: { id: string; index: number; correct: boolean; wrong: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : undefined };
  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex cursor-grab items-center gap-3 rounded-xl border bg-background px-4 py-3.5 text-sm shadow-sm transition active:cursor-grabbing ${
        correct
          ? "border-success bg-success/5"
          : wrong
            ? "border-destructive bg-destructive/5"
            : "border-border hover:border-gold/40"
      }`}
    >
      <GripVertical className="h-4 w-4 text-muted-foreground" />
      <span className="grid h-6 w-6 place-items-center rounded-full bg-muted text-xs font-semibold">{index + 1}</span>
      <span className="flex-1">{id}</span>
      {correct && <CheckCircle2 className="h-4 w-4 text-success" />}
      {wrong && <XCircle className="h-4 w-4 text-destructive" />}
    </li>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // ensure not already sorted
  if (a.every((v, i) => v === arr[i])) return shuffle(arr);
  return a;
}

// ----- Section 3: WACC matching game -----
const WACC_TERMS = [
  { term: "Risk-free rate (Rf)", def: "Yield on a 10-year US Treasury — the floor for any required return." },
  { term: "Equity risk premium", def: "Extra return investors demand for holding stocks vs. risk-free assets (~5–6%)." },
  { term: "Beta (β)", def: "How much a stock moves relative to the broader market." },
  { term: "Cost of debt (Kd)", def: "Yield to maturity on the company's outstanding debt, after-tax." },
  { term: "Tax shield", def: "(1 – tax rate) — interest is tax-deductible, lowering effective debt cost." },
];

function WACCMatchGame() {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [shuffled] = useState(() => shuffle(WACC_TERMS.map((t) => t.def)));
  const [checked, setChecked] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);

  const allMatched = Object.keys(matches).length === WACC_TERMS.length;
  const correctCount = WACC_TERMS.filter((t) => matches[t.term] === t.def).length;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <p className="text-sm text-muted-foreground">
        Drag each definition onto its term. Build intuition for what each WACC component means.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Term drop targets */}
        <div className="space-y-3">
          {WACC_TERMS.map((t) => {
            const matched = matches[t.term];
            const isCorrect = checked && matched === t.def;
            const isWrong = checked && matched && matched !== t.def;
            return (
              <div
                key={t.term}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragging) {
                    setMatches((m) => {
                      const next = { ...m };
                      // remove this def from any other term
                      Object.keys(next).forEach((k) => { if (next[k] === dragging) delete next[k]; });
                      next[t.term] = dragging;
                      return next;
                    });
                    setDragging(null);
                    setChecked(false);
                  }
                }}
                className={`rounded-xl border-2 border-dashed p-3 transition ${
                  isCorrect
                    ? "border-success bg-success/5"
                    : isWrong
                      ? "border-destructive bg-destructive/5"
                      : matched
                        ? "border-gold/40 bg-gold/5"
                        : "border-border bg-background"
                }`}
              >
                <p className="font-display text-sm font-semibold">{t.term}</p>
                {matched ? (
                  <p className="mt-2 text-xs text-foreground/80">{matched}</p>
                ) : (
                  <p className="mt-2 text-xs italic text-muted-foreground">Drop a definition here…</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Definitions to drag */}
        <div className="space-y-2">
          <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Definitions</p>
          {shuffled.map((def) => {
            const used = Object.values(matches).includes(def);
            return (
              <div
                key={def}
                draggable={!used}
                onDragStart={() => setDragging(def)}
                onDragEnd={() => setDragging(null)}
                className={`cursor-grab rounded-lg border bg-background p-3 text-xs transition active:cursor-grabbing ${
                  used ? "opacity-30" : "border-border hover:border-gold/40 hover:shadow-sm"
                }`}
              >
                {def}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => { setMatches({}); setChecked(false); }}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
        <button
          disabled={!allMatched}
          onClick={() => setChecked(true)}
          className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-40 transition"
        >
          Check matches
        </button>
      </div>

      {checked && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-5 rounded-lg p-4 text-sm ${
            correctCount === WACC_TERMS.length ? "bg-success/10 text-success" : "bg-gold/10 text-gold"
          }`}
        >
          <p className="font-semibold">
            {correctCount === WACC_TERMS.length
              ? `🎯 Flawless — ${correctCount}/${WACC_TERMS.length}. You'd nail this in a Goldman superday.`
              : `${correctCount} / ${WACC_TERMS.length} correct. Reset and try again — the wrong matches are highlighted.`}
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ----- Section 4: Sensitivity slider -----
function SensitivitySlider() {
  const [wacc, setWacc] = useState(9);
  const [growth, setGrowth] = useState(2.5);
  const [fcf, setFcf] = useState(100); // base year FCF

  const ev = useMemo(() => {
    // 5-year projection growing at 5%, then terminal value with Gordon Growth
    const w = wacc / 100;
    const g = growth / 100;
    let pv = 0;
    let cf = fcf;
    for (let t = 1; t <= 5; t++) {
      cf = cf * 1.05;
      pv += cf / Math.pow(1 + w, t);
    }
    if (w <= g) return Infinity;
    const tv = (cf * (1 + g)) / (w - g);
    pv += tv / Math.pow(1 + w, 5);
    return pv;
  }, [wacc, growth, fcf]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-start gap-3">
        <TrendingUp className="mt-1 h-5 w-5 text-gold" />
        <div>
          <h3 className="font-display text-lg font-semibold">Feel the sensitivity</h3>
          <p className="text-sm text-muted-foreground">
            Watch implied EV move as you change the three most-tested DCF assumptions.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <SliderInput label="Base year FCF ($M)" value={fcf} min={50} max={300} step={5} suffix="M" onChange={setFcf} />
        <SliderInput label="WACC" value={wacc} min={5} max={15} step={0.25} suffix="%" onChange={setWacc} />
        <SliderInput label="Terminal growth (g)" value={growth} min={0} max={5} step={0.25} suffix="%" onChange={setGrowth} />
      </div>

      <div className="mt-8 rounded-xl bg-gradient-primary p-8 text-center text-primary-foreground">
        <p className="text-xs uppercase tracking-widest text-gold">Implied Enterprise Value</p>
        <motion.p
          key={Math.round(ev)}
          initial={{ scale: 0.95, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-2 font-display text-6xl font-semibold"
        >
          {ev === Infinity ? "—" : `$${(ev / 1000).toFixed(2)}B`}
        </motion.p>
        <p className="mt-3 text-xs text-primary-foreground/70">
          {wacc <= growth
            ? "⚠️ WACC must exceed terminal growth, or the model breaks."
            : "Try lowering WACC by 1% — see how dramatically EV jumps."}
        </p>
      </div>

      <div className="mt-5 rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">Interview takeaway:</strong> small changes in WACC and g can swing
        valuation by 30%+. That's why bankers always present a sensitivity table — a single point estimate
        is misleading.
      </div>
    </div>
  );
}

function SliderInput({ label, value, min, max, step, suffix, onChange }: {
  label: string; value: number; min: number; max: number; step: number; suffix: string; onChange: (v: number) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-display text-lg font-semibold text-gold">{value}{suffix}</p>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-3 w-full accent-[oklch(0.74_0.13_75)]"
      />
    </div>
  );
}

// ----- Section 5: Spot the error -----
const STATEMENTS = [
  { text: "Use levered FCF when discounting at WACC.", correct: false, why: "WACC is for unlevered FCF (pre-financing). Levered FCF should be discounted at cost of equity." },
  { text: "Terminal growth rate should never exceed long-term GDP growth.", correct: true, why: "Right — typically 2–3%. Anything higher implies the company eventually overtakes the entire economy." },
  { text: "Higher beta increases the cost of equity.", correct: true, why: "Cost of Equity = Rf + β × ERP. Higher β = riskier stock = higher required return." },
  { text: "You should always use the company's book value of debt in WACC.", correct: false, why: "Use market values for both debt and equity weights — they reflect current capital costs." },
];

function SpotTheError() {
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [revealed, setRevealed] = useState(false);

  const score = STATEMENTS.filter((s, i) => answers[i] === s.correct).length;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <p className="text-sm text-muted-foreground">
        Mark each statement as <strong>True</strong> or <strong>False</strong>. These are exactly the kinds of
        traps interviewers set.
      </p>

      <div className="mt-5 space-y-3">
        {STATEMENTS.map((s, i) => {
          const ans = answers[i];
          const isRight = revealed && ans === s.correct;
          const isWrong = revealed && ans !== undefined && ans !== s.correct;
          return (
            <div
              key={i}
              className={`rounded-xl border p-4 transition ${
                isRight ? "border-success bg-success/5" : isWrong ? "border-destructive bg-destructive/5" : "border-border bg-background"
              }`}
            >
              <p className="text-sm">{s.text}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => !revealed && setAnswers({ ...answers, [i]: true })}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                    ans === true
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background text-muted-foreground hover:border-gold/40"
                  }`}
                >
                  True
                </button>
                <button
                  onClick={() => !revealed && setAnswers({ ...answers, [i]: false })}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                    ans === false
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background text-muted-foreground hover:border-gold/40"
                  }`}
                >
                  False
                </button>
              </div>
              {revealed && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 text-xs text-muted-foreground"
                >
                  <strong className={s.correct ? "text-success" : "text-destructive"}>
                    {s.correct ? "True." : "False."}
                  </strong>{" "}
                  {s.why}
                </motion.p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        {revealed ? (
          <span className="text-sm font-medium">Score: <span className="text-gold">{score} / {STATEMENTS.length}</span></span>
        ) : <span />}
        <button
          disabled={Object.keys(answers).length !== STATEMENTS.length}
          onClick={() => setRevealed(true)}
          className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-40 transition"
        >
          Reveal answers
        </button>
      </div>
    </div>
  );
}

// ============= COMPARISON =============
function Comparison({ preScore, postScore, answers }: { preScore: number; postScore: number; answers: number[] }) {
  const delta = postScore - preScore;
  const pctImprove = preScore === 0 ? (postScore > 0 ? 100 : 0) : Math.round(((postScore - preScore) / QUIZ.length) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-gold shadow-glow">
          <Trophy className="h-9 w-9 text-gold-foreground" />
        </div>
        <h1 className="mt-6 font-display text-4xl font-semibold">
          {delta > 0 ? "You leveled up." : delta === 0 ? "Solid baseline." : "Let's review."}
        </h1>
        <p className="mt-2 text-muted-foreground">Here's your before vs. after on DCF Valuation.</p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <ScoreCard label="Before lesson" score={preScore} subtle />
        <div className="rounded-2xl border-2 border-gold bg-gold/5 p-8 text-center">
          <p className="text-xs uppercase tracking-widest text-gold">Improvement</p>
          <p className="mt-3 font-display text-6xl font-semibold text-gold">
            {delta >= 0 ? "+" : ""}{delta}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{pctImprove >= 0 ? "+" : ""}{pctImprove}% accuracy</p>
        </div>
        <ScoreCard label="After lesson" score={postScore} highlight />
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-7">
        <h3 className="font-display text-xl font-semibold">Question-by-question</h3>
        <div className="mt-5 space-y-3">
          {QUIZ.map((q, i) => {
            const right = answers[i] === q.answer;
            return (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-background p-4">
                {right ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                ) : (
                  <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{q.q}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    <strong>Correct:</strong> {q.options[q.answer]}
                  </p>
                  {!right && <p className="mt-2 text-xs text-foreground/80">{q.explain}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-elegant hover:opacity-90 transition"
        >
          Back to dashboard <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="text-xs text-muted-foreground">More lessons coming soon — Comps, LBO, M&A accretion/dilution.</p>
      </div>
    </motion.div>
  );
}

function ScoreCard({ label, score, subtle, highlight }: { label: string; score: number; subtle?: boolean; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-8 text-center ${
      highlight ? "border-success/40 bg-success/5" : subtle ? "border-border bg-muted/30" : "border-border bg-card"
    }`}>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`mt-3 font-display text-6xl font-semibold ${highlight ? "text-success" : "text-foreground"}`}>
        {score}<span className="text-2xl text-muted-foreground"> / {QUIZ.length}</span>
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{Math.round((score / QUIZ.length) * 100)}% accuracy</p>
    </div>
  );
}
