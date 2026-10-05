import { EMOTION_META, EMOTION_ORDER } from "@/lib/emotions";
import type { EmotionResult, EmotionLabel } from "@/server/emotion.functions";
import { Sparkles } from "lucide-react";

export function EmotionResults({ result }: { result: EmotionResult }) {
  const dominant = EMOTION_META[result.dominant];
  const sorted = [...EMOTION_ORDER].sort(
    (a, b) => result.scores[b] - result.scores[a],
  );

  return (
    <div className="space-y-6">
      {/* Dominant emotion */}
      <div
        className="glass shadow-soft rounded-3xl p-6 sm:p-8 flex items-center gap-5"
        style={{
          backgroundImage: `linear-gradient(135deg, color-mix(in oklab, ${dominant.tokenVar} 18%, white) 0%, oklch(1 0 0 / 0.6) 100%)`,
        }}
      >
        <div
          className="text-5xl sm:text-6xl animate-float shrink-0"
          aria-hidden
        >
          {dominant.emoji}
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Dominant emotion
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold mt-1"
            style={{ color: dominant.tokenVar }}
          >
            {dominant.label}
          </h2>
          {result.summary && (
            <p className="text-sm sm:text-base text-foreground/80 mt-2 leading-relaxed">
              {result.summary}
            </p>
          )}
        </div>
      </div>

      {/* Mixed emotions chips */}
      {result.mixed.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Mixed with:
          </span>
          {result.mixed.map((m) => (
            <span
              key={m}
              className="px-3 py-1 rounded-full text-sm font-medium border"
              style={{
                backgroundColor: `color-mix(in oklab, ${EMOTION_META[m].tokenVar} 15%, white)`,
                borderColor: `color-mix(in oklab, ${EMOTION_META[m].tokenVar} 35%, transparent)`,
                color: EMOTION_META[m].tokenVar,
              }}
            >
              {EMOTION_META[m].emoji} {EMOTION_META[m].label}
            </span>
          ))}
        </div>
      )}

      {/* All scores */}
      <div className="glass shadow-soft rounded-3xl p-6 sm:p-8">
        <h3 className="text-lg font-semibold mb-5">All emotion probabilities</h3>
        <ul className="space-y-4">
          {sorted.map((key) => (
            <ScoreRow key={key} emotion={key} value={result.scores[key]} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function ScoreRow({ emotion, value }: { emotion: EmotionLabel; value: number }) {
  const meta = EMOTION_META[emotion];
  const pct = Math.round(value * 100);
  return (
    <li>
      <div className="flex items-center justify-between mb-1.5">
        <span className="flex items-center gap-2 text-sm font-medium">
          <span aria-hidden>{meta.emoji}</span>
          <span>{meta.label}</span>
        </span>
        <span
          className="text-sm font-semibold tabular-nums"
          style={{ color: meta.tokenVar }}
        >
          {pct}%
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden bg-muted">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            backgroundColor: meta.tokenVar,
            boxShadow: `0 0 12px color-mix(in oklab, ${meta.tokenVar} 50%, transparent)`,
          }}
        />
      </div>
    </li>
  );
}
