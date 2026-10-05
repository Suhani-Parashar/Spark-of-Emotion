import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Brain, Loader2, Sparkles, Wand2 } from "lucide-react";
import { detectEmotion, type EmotionResult } from "@/server/emotion.functions";
import { EmotionResults } from "@/components/EmotionResults";
import { EMOTION_META, EMOTION_ORDER } from "@/lib/emotions";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "EmotionLens — AI Emotion Detection (NLP + LSTM)" },
      {
        name: "description",
        content:
          "Detect happiness, sadness, anger, fear, surprise, disgust and neutral emotions — including mixed emotions — from any sentence or description using NLP and LSTM-based analysis.",
      },
    ],
  }),
});

const EXAMPLES = [
  "I just got the promotion I've been working toward for years — I can hardly believe it!",
  "I'm exhausted and lonely tonight, but a small part of me is grateful for the quiet.",
  "How dare they cancel the trip without telling anyone? I'm furious and honestly a bit hurt.",
  "The room was silent. Something moved in the corner and my heart started racing.",
];

function Index() {
  const detect = useServerFn(detectEmotion);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmotionResult | null>(null);

  const onAnalyze = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      toast.error("Please enter some text to analyze.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const r = await detect({ data: { text: trimmed } });
      if (r.error) {
        toast.error(r.error);
      } else {
        setResult(r);
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Toaster richColors position="top-center" />

      {/* Decorative blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-32 -left-24 h-96 w-96 rounded-full opacity-40 blur-3xl"
          style={{ background: "var(--emo-sadness)" }}
        />
        <div
          className="absolute top-1/3 -right-24 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--emo-surprise)" }}
        />
        <div
          className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--emo-joy)" }}
        />
      </div>

      <div className="mx-auto max-w-4xl px-5 sm:px-8 py-10 sm:py-16">
        {/* Header */}
        <header className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass shadow-soft text-xs font-medium text-foreground/70 mb-5">
            <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} />
            NLP &middot; LSTM &middot; Mixed-emotion aware
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05]">
            Read the feeling
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              behind the words.
            </span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Paste a sentence, paragraph, or description. EmotionLens detects all
            seven core emotions — and surfaces the mix when feelings overlap.
          </p>
        </header>

        {/* Input card */}
        <section className="glass shadow-soft rounded-3xl p-5 sm:p-7">
          <label htmlFor="text" className="sr-only">
            Text to analyze
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste a sentence here…"
            rows={5}
            maxLength={5000}
            className="w-full resize-none bg-transparent outline-none text-base sm:text-lg leading-relaxed placeholder:text-muted-foreground/60"
          />
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground tabular-nums">
              {text.length}/5000
            </span>
            <button
              onClick={onAnalyze}
              disabled={loading}
              className="gradient-primary shadow-soft text-primary-foreground inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:scale-[1.02] hover:shadow-glow disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4" />
                  Detect emotions
                </>
              )}
            </button>
          </div>

          {/* Example chips */}
          <div className="mt-5 pt-5 border-t border-border/60">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2.5 flex items-center gap-1.5">
              <Wand2 className="h-3 w-3" />
              Try an example
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setText(ex)}
                  className="text-left text-xs sm:text-sm px-3 py-1.5 rounded-full bg-secondary/70 hover:bg-secondary text-secondary-foreground transition-colors max-w-full truncate"
                  title={ex}
                >
                  {ex.length > 60 ? ex.slice(0, 60) + "…" : ex}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="mt-8" aria-live="polite">
          {result ? (
            <EmotionResults result={result} />
          ) : !loading ? (
            <div className="glass shadow-soft rounded-3xl p-6 sm:p-8">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Detectable emotions
              </h3>
              <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {EMOTION_ORDER.map((k) => {
                  const m = EMOTION_META[k];
                  return (
                    <li
                      key={k}
                      className="flex flex-col items-center text-center p-3 rounded-2xl border border-border/60 bg-white/40"
                    >
                      <span className="text-2xl mb-1" aria-hidden>
                        {m.emoji}
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: m.tokenVar }}
                      >
                        {m.label}
                      </span>
                      <span className="text-[11px] text-muted-foreground mt-0.5">
                        {m.description}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </section>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          Powered by NLP + LSTM-style sequential analysis &middot; Detects mixed
          emotions
        </footer>
      </div>
    </main>
  );
}
