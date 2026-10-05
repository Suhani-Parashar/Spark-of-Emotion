import type { EmotionLabel } from "@/server/emotion.functions";

export const EMOTION_META: Record<
  EmotionLabel,
  { label: string; emoji: string; tokenVar: string; description: string }
> = {
  joy: {
    label: "Happiness / Joy",
    emoji: "😊",
    tokenVar: "var(--emo-joy)",
    description: "Warmth, delight, contentment",
  },
  sadness: {
    label: "Sadness",
    emoji: "😢",
    tokenVar: "var(--emo-sadness)",
    description: "Sorrow, melancholy, loss",
  },
  anger: {
    label: "Anger",
    emoji: "😠",
    tokenVar: "var(--emo-anger)",
    description: "Frustration, irritation, rage",
  },
  fear: {
    label: "Fear",
    emoji: "😨",
    tokenVar: "var(--emo-fear)",
    description: "Worry, anxiety, dread",
  },
  surprise: {
    label: "Surprise",
    emoji: "😲",
    tokenVar: "var(--emo-surprise)",
    description: "Astonishment, wonder",
  },
  disgust: {
    label: "Disgust",
    emoji: "🤢",
    tokenVar: "var(--emo-disgust)",
    description: "Aversion, revulsion",
  },
  neutral: {
    label: "Neutral",
    emoji: "😐",
    tokenVar: "var(--emo-neutral)",
    description: "Calm, balanced, no strong emotion",
  },
};

export const EMOTION_ORDER: EmotionLabel[] = [
  "joy",
  "sadness",
  "anger",
  "fear",
  "surprise",
  "disgust",
  "neutral",
];
