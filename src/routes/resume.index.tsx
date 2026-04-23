import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/resume/")({
  component: Resume,
});

function Resume() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setAnalyzing(true);
    setTimeout(() => { setAnalyzing(false); setDone(true); }, 2200);
  };

  return (
    <div className="mx-auto max-w-5xl px-8 py-12">
      <p className="text-xs uppercase tracking-widest text-gold">Resume builder</p>
      <h1 className="mt-2 font-display text-4xl font-semibold">Tailor your resume to your story</h1>
      <p className="mt-2 text-muted-foreground">We align every bullet with your persona and your target firms.</p>

      {!file && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
          className="group mt-10 cursor-pointer rounded-2xl border-2 border-dashed border-border bg-card p-16 text-center transition hover:border-gold hover:bg-accent/40"
        >
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-gold text-gold-foreground shadow-glow">
            <Upload className="h-7 w-7" />
          </div>
          <h3 className="mt-6 font-display text-xl font-semibold">Drop your resume here</h3>
          <p className="mt-1 text-sm text-muted-foreground">PDF or DOCX, up to 5 MB</p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>
      )}

      {file && analyzing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 rounded-2xl border border-border bg-card p-12 text-center shadow-card">
          <Sparkles className="mx-auto h-8 w-8 animate-pulse text-gold" />
          <h3 className="mt-4 font-display text-xl font-semibold">Analyzing {file.name}…</h3>
          <p className="mt-2 text-sm text-muted-foreground">Reading bullets, scoring against your persona, benchmarking format.</p>
          <div className="mx-auto mt-8 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-muted">
            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2 }} className="h-full bg-gradient-gold" />
          </div>
        </motion.div>
      )}

      {done && file && <ResumeReport file={file} />}
    </div>
  );
}

function ResumeReport({ file }: { file: File }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-10 space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-muted">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">Analyzed · {(file.size / 1024).toFixed(0)} KB</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Overall score</span>
          <span className="rounded-full bg-gold/15 px-3 py-1 font-semibold text-gold">78 / 100</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: "Format", score: 92, color: "text-success", note: "Bulge-bracket compliant 1-pager" },
          { label: "Content", score: 71, color: "text-gold", note: "Strong action verbs; weak quantification" },
          { label: "Persona fit", score: 68, color: "text-gold", note: "Builder narrative under-leveraged" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
            <div className="mt-3 flex items-baseline gap-1">
              <span className={`font-display text-4xl font-semibold ${s.color}`}>{s.score}</span>
              <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{s.note}</p>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-gradient-gold" style={{ width: `${s.score}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-7">
        <h3 className="font-display text-xl font-semibold">Suggested rewrites</h3>
        <p className="text-sm text-muted-foreground">Aligned with your "Builder-Operator" persona.</p>
        <div className="mt-6 space-y-5">
          {[
            {
              before: "Helped grow user base by working on marketing campaigns.",
              after: "Owned 3-channel growth experiments that lifted weekly actives 42% (8K → 11.4K) over one semester.",
            },
            {
              before: "Built a financial model for a class project on Tesla.",
              after: "Constructed a 5-year DCF on TSLA with sensitivity to EV penetration; presented to a panel of 4 industry mentors.",
            },
            {
              before: "Worked with team on consulting case competition.",
              after: "Led 4-person team to top-3 finish (of 60) at Wharton case comp; owned market-sizing and synthesis slides.",
            },
          ].map((r, i) => (
            <div key={i} className="grid gap-4 rounded-xl bg-muted/30 p-5 md:grid-cols-2">
              <div>
                <div className="mb-2 inline-flex items-center gap-1.5 text-xs text-destructive">
                  <AlertCircle className="h-3.5 w-3.5" /> Before
                </div>
                <p className="text-sm text-muted-foreground">{r.before}</p>
              </div>
              <div>
                <div className="mb-2 inline-flex items-center gap-1.5 text-xs text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" /> After
                </div>
                <p className="text-sm font-medium">{r.after}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Link
          to="/lesson"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-elegant hover:opacity-90 transition"
        >
          Continue to lessons <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}
