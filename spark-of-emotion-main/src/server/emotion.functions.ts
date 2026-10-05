import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  text: z.string().min(1).max(5000),
});

export type EmotionLabel =
  | "joy"
  | "sadness"
  | "anger"
  | "fear"
  | "surprise"
  | "disgust"
  | "neutral";

export type EmotionResult = {
  scores: Record<EmotionLabel, number>;
  dominant: EmotionLabel;
  mixed: EmotionLabel[];
  summary: string;
  error?: string;
};

const SYSTEM_PROMPT = `You are an emotion detection model trained with NLP and LSTM-based sequential analysis.
Analyze the user's text and return probability scores (0..1) for these 7 emotions:
joy, sadness, anger, fear, surprise, disgust, neutral.
Detect mixed emotions when present. Scores should sum to roughly 1.0.
Provide a brief 1-sentence summary of the emotional tone. Be precise and grounded in the text.`;

export const detectEmotion = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<EmotionResult> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return {
        scores: emptyScores(),
        dominant: "neutral",
        mixed: [],
        summary: "",
        error: "AI service not configured.",
      };
    }

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: data.text },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "report_emotions",
                description: "Report detected emotion scores and summary.",
                parameters: {
                  type: "object",
                  properties: {
                    joy: { type: "number" },
                    sadness: { type: "number" },
                    anger: { type: "number" },
                    fear: { type: "number" },
                    surprise: { type: "number" },
                    disgust: { type: "number" },
                    neutral: { type: "number" },
                    summary: { type: "string" },
                  },
                  required: [
                    "joy",
                    "sadness",
                    "anger",
                    "fear",
                    "surprise",
                    "disgust",
                    "neutral",
                    "summary",
                  ],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "report_emotions" } },
        }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          return {
            scores: emptyScores(),
            dominant: "neutral",
            mixed: [],
            summary: "",
            error: "Rate limit reached. Please wait a moment and try again.",
          };
        }
        if (res.status === 402) {
          return {
            scores: emptyScores(),
            dominant: "neutral",
            mixed: [],
            summary: "",
            error: "AI credits exhausted. Please add credits in workspace settings.",
          };
        }
        const t = await res.text();
        console.error("AI gateway error:", res.status, t);
        return {
          scores: emptyScores(),
          dominant: "neutral",
          mixed: [],
          summary: "",
          error: `AI service error (${res.status}).`,
        };
      }

      const json = await res.json();
      const toolCall = json.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall?.function?.arguments) {
        return {
          scores: emptyScores(),
          dominant: "neutral",
          mixed: [],
          summary: "",
          error: "Could not parse emotion analysis.",
        };
      }

      const args = JSON.parse(toolCall.function.arguments);
      const scores: Record<EmotionLabel, number> = {
        joy: clamp(args.joy),
        sadness: clamp(args.sadness),
        anger: clamp(args.anger),
        fear: clamp(args.fear),
        surprise: clamp(args.surprise),
        disgust: clamp(args.disgust),
        neutral: clamp(args.neutral),
      };

      const sorted = (Object.entries(scores) as [EmotionLabel, number][]).sort(
        (a, b) => b[1] - a[1],
      );
      const dominant = sorted[0][0];
      const top = sorted[0][1];
      const mixed = sorted
        .filter(([k, v]) => k !== dominant && v >= 0.18 && v >= top * 0.4)
        .map(([k]) => k);

      return {
        scores,
        dominant,
        mixed,
        summary: typeof args.summary === "string" ? args.summary : "",
      };
    } catch (e) {
      console.error("detectEmotion failed:", e);
      return {
        scores: emptyScores(),
        dominant: "neutral",
        mixed: [],
        summary: "",
        error: "Unexpected error during analysis.",
      };
    }
  });

function clamp(v: unknown): number {
  const n = typeof v === "number" ? v : 0;
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function emptyScores(): Record<EmotionLabel, number> {
  return {
    joy: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    surprise: 0,
    disgust: 0,
    neutral: 0,
  };
}
