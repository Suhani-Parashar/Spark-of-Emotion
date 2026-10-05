# Spark of Emotion

> **AI-powered emotion analysis application that combines a modern React/TypeScript interface with server-side AI inference and structured emotion scoring.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![TanStack Start](https://img.shields.io/badge/TanStack%20Start-1.x-FF4154)](https://tanstack.com/start)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20Integration-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Zod](https://img.shields.io/badge/Validation-Zod-3B82F6)](https://zod.dev/)

---

# 1. Project Overview

**Spark of Emotion** is a web-based AI emotion analysis application designed to interpret the emotional tone of user-provided text.

The application accepts a sentence, paragraph, or short description and produces a structured emotion analysis across seven categories:

- Joy
- Sadness
- Anger
- Fear
- Surprise
- Disgust
- Neutral

Rather than presenting emotion detection as a simple text-generation interface, the application uses a structured server-side analysis flow that returns:

```text
Emotion Scores
      +
Dominant Emotion
      +
Mixed Emotions
      +
Human-readable Summary
```

The application is designed around a simple product principle:

> **Turn unstructured language into an interpretable emotional profile.**

---

# 2. Problem Statement

Human communication contains emotional information that is often difficult to quantify directly.

A conventional text interface can tell a user *what* a sentence says, but it does not necessarily expose:

- the dominant emotional signal;
- the presence of multiple competing emotions;
- relative confidence across emotion categories;
- a concise interpretation of the overall emotional tone.

Spark of Emotion addresses this by transforming text into a structured result.

```text
Raw Text
   │
   ▼
Input Validation
   │
   ▼
Server-side Emotion Analysis
   │
   ▼
Seven Emotion Scores
   │
   ├── Dominant Emotion
   ├── Mixed Emotions
   └── Summary
   │
   ▼
Visual Result Presentation
```

---

# 3. Key Features

## Emotion Detection

The application analyzes user-entered text against seven predefined emotion categories:

```text
JOY
SADNESS
ANGER
FEAR
SURPRISE
DISGUST
NEUTRAL
```

Each category receives a normalized score between `0` and `1`.

---

## Dominant Emotion

The application identifies the highest-scoring emotion as the dominant emotional state.

Conceptually:

```text
Emotion Scores
      │
      ▼
Sort by Score
      │
      ▼
Highest Score
      │
      ▼
Dominant Emotion
```

---

## Mixed-Emotion Detection

Human emotional states are not always singular.

The application therefore identifies secondary emotions when their scores are sufficiently significant relative to the dominant emotion.

Example:

```text
Joy        0.56
Surprise   0.27
Neutral    0.08
Sadness    0.05
...
```

Result:

```text
Dominant → Joy
Mixed    → Surprise
```

This makes the application more expressive than a simple single-label classifier.

---

## Structured AI Output

The server-side analysis is designed to produce a structured response:

```ts
type EmotionResult = {
  scores: Record<EmotionLabel, number>;
  dominant: EmotionLabel;
  mixed: EmotionLabel[];
  summary: string;
  error?: string;
};
```

This gives the frontend predictable data rather than requiring it to interpret free-form AI text.

---

## Input Validation

User input is validated server-side using Zod.

Current constraints include:

```text
Minimum length → 1 character
Maximum length → 5000 characters
```

This prevents uncontrolled requests from reaching the inference layer.

---

## Error Handling

The application explicitly handles several AI service failure scenarios.

Examples include:

```text
Missing API configuration
Rate limiting
AI credit exhaustion
Invalid AI response
Unexpected server error
```

The frontend presents user-readable error messages rather than exposing raw backend implementation details.

---

# 4. Architecture

Although the repository is currently contained inside a **single top-level folder**, the implementation is logically separated into application layers.

Current repository shape:

```text
Spark-of-Emotion/
└── spark-of-emotion-main/
    │
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── wrangler.jsonc
    │
    ├── src/
    │   │
    │   ├── components/
    │   │   ├── EmotionResults.tsx
    │   │   └── ui/
    │   │
    │   ├── hooks/
    │   │
    │   ├── integrations/
    │   │   └── supabase/
    │   │
    │   ├── lib/
    │   │   ├── emotions.ts
    │   │   └── utils.ts
    │   │
    │   ├── routes/
    │   │   ├── __root.tsx
    │   │   └── index.tsx
    │   │
    │   ├── server/
    │   │   └── emotion.functions.ts
    │   │
    │   ├── router.tsx
    │   ├── routeTree.gen.ts
    │   └── styles.css
    │
    └── supabase/
```

---

# 5. Logical System Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│                                                         │
│  React UI                                               │
│  Emotion Input                                          │
│  Loading / Error States                                 │
│  Emotion Results                                        │
│  Responsive UI                                          │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                    ROUTING LAYER                         │
│                                                         │
│  TanStack Router                                        │
│  File-based Route                                       │
│  Application Root                                       │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                 SERVER FUNCTION LAYER                   │
│                                                         │
│  detectEmotion()                                        │
│  Zod Input Validation                                   │
│  Server-side API Call                                   │
│  Structured Result Parsing                              │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                    AI INFERENCE LAYER                    │
│                                                         │
│  AI Gateway                                             │
│  Gemini-based model                                     │
│  Structured function/tool response                      │
│  Emotion score generation                               │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  APPLICATION LOGIC                       │
│                                                         │
│  Score clamping                                         │
│  Dominant emotion selection                             │
│  Mixed-emotion selection                                │
│  Summary extraction                                     │
└─────────────────────────────────────────────────────────┘

Supporting Infrastructure
        │
        ├── Supabase integration
        ├── TypeScript types
        ├── Environment configuration
        └── Cloudflare/Vite deployment configuration
```

---

# 6. Runtime Request Flow

A complete user request follows this sequence:

```text
User enters text
       │
       ▼
React state update
       │
       ▼
"Detect emotions"
       │
       ▼
useServerFn(detectEmotion)
       │
       ▼
Zod validation
       │
       ▼
Server Function
       │
       ▼
AI Gateway request
       │
       ▼
Structured function call response
       │
       ▼
Parse AI response
       │
       ▼
Clamp scores to [0,1]
       │
       ▼
Sort emotion scores
       │
       ├──────────────► Dominant Emotion
       │
       └──────────────► Mixed Emotion Detection
       │
       ▼
EmotionResult
       │
       ▼
EmotionResults.tsx
       │
       ▼
User-facing visualization
```

This separation is important because the API credential is accessed server-side rather than directly from the browser component.

---

# 7. Technology Stack

## Frontend

| Technology | Role |
|---|---|
| React 19 | Component-based UI |
| TypeScript | Static typing |
| TanStack Router | Application routing |
| TanStack Start | Full-stack React application framework |
| Tailwind CSS | Utility-first styling |
| Radix UI | Accessible UI primitives |
| Lucide React | Icons |
| Recharts | Data visualization support |
| React Hook Form | Form handling |
| Zod | Schema validation |
| Sonner | User notifications |

---

## Backend / Server Runtime

The application uses TanStack Start server functions for server-side execution.

Primary server-side entry point:

```text
src/server/emotion.functions.ts
```

---

## AI Layer

The emotion-analysis function sends structured requests to the configured AI gateway.

The current implementation uses a Gemini-family model through the configured gateway and requests a structured function/tool response containing emotion scores and a summary.

---

## Authentication / Backend Services

The repository also includes Supabase integration infrastructure:

```text
src/integrations/supabase/
```

The integration contains:

- client initialization;
- server-side client support;
- authentication middleware;
- generated database typing.

---

## Build / Tooling

- Vite
- Bun lockfile
- npm lockfile
- ESLint
- Prettier
- TypeScript
- Cloudflare Vite plugin
- Wrangler configuration

---

# 8. Core Application Components

## `src/routes/index.tsx`

Acts as the primary application screen.

Responsibilities include:

- text input;
- character count;
- example prompts;
- loading state;
- server function invocation;
- error notification;
- emotion result rendering.

---

## `src/server/emotion.functions.ts`

Acts as the core server-side inference boundary.

Responsibilities include:

- validating input;
- accessing server-side environment configuration;
- calling the AI gateway;
- enforcing structured output;
- normalizing scores;
- determining dominant emotion;
- determining mixed emotions;
- returning a typed result.

This is the most important backend file in the application.

---

## `src/components/EmotionResults.tsx`

Responsible for presenting the structured emotion analysis to the user.

It consumes:

```ts
EmotionResult
```

rather than directly interacting with the AI provider.

This keeps the presentation layer decoupled from model/provider details.

---

## `src/lib/emotions.ts`

Centralizes emotion metadata.

Each emotion includes:

```text
Label
Emoji
Color Token
Description
```

This prevents emotion-specific UI metadata from being scattered throughout the application.

---

# 9. Emotion Processing Logic

The seven supported labels are:

```ts
type EmotionLabel =
  | "joy"
  | "sadness"
  | "anger"
  | "fear"
  | "surprise"
  | "disgust"
  | "neutral";
```

After receiving the model response:

### Step 1 — Clamp Scores

Every score is constrained to:

```text
0 ≤ score ≤ 1
```

This protects the application from malformed numerical output.

### Step 2 — Sort Scores

The system orders emotions from highest score to lowest score.

### Step 3 — Determine Dominant Emotion

The first entry becomes the dominant emotion.

### Step 4 — Determine Mixed Emotions

Secondary emotions are included when they meet the application's relative-score threshold.

### Step 5 — Return Structured Result

The final object contains:

```text
scores
dominant
mixed
summary
```

---

# 10. UI / UX Design

The application uses a deliberately emotion-oriented visual system.

Key design characteristics include:

- glass-style cards;
- soft gradients;
- emotion-specific visual tokens;
- responsive layout;
- clear visual hierarchy;
- example text prompts;
- animated loading states;
- inline validation feedback;
- accessible semantic labeling.

The main experience is designed around a simple interaction:

```text
WRITE
  ↓
ANALYZE
  ↓
UNDERSTAND
```

---

# 11. Example User Journey

### Input

```text
"I'm exhausted and lonely tonight, but a small part of me is grateful for the quiet."
```

### Processing

```text
User Input
   ↓
Validation
   ↓
AI Analysis
   ↓
Emotion Scores
```

### Output

Conceptually:

```text
Dominant Emotion
→ Sadness

Mixed Emotions
→ Neutral
→ Joy

Summary
→ Emotional tone reflects loneliness alongside gratitude and calm.
```

The exact output is generated dynamically.

---

# 12. Getting Started

## Prerequisites

Recommended environment:

```text
Node.js
npm or Bun
Git
```

---

## Clone Repository

```bash
git clone https://github.com/Suhani-Parashar/Spark-of-Emotion.git
cd Spark-of-Emotion/spark-of-emotion-main
```

---

## Install Dependencies

Using npm:

```bash
npm install
```

Or using Bun:

```bash
bun install
```

---

# 13. Environment Configuration

The application requires server-side AI configuration.

Create:

```text
.env
```

and configure the required variables used by the application.

At minimum, the emotion server function expects:

```text
LOVABLE_API_KEY
```

Supabase-backed functionality can additionally require:

```text
SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Do not commit private API keys to GitHub.

---

# 14. Run Development Server

Using npm:

```bash
npm run dev
```

Using Bun:

```bash
bun run dev
```

Vite will provide the local development URL in the terminal.

---

# 15. Production Build

Build the application:

```bash
npm run build
```

Preview the generated build:

```bash
npm run preview
```

---

# 16. Code Quality

The project includes linting and formatting scripts.

Run linting:

```bash
npm run lint
```

Format source files:

```bash
npm run format
```

These tools help maintain:

- consistent code style;
- TypeScript quality;
- React hook conventions;
- readable source organization.

---

# 17. Project Structure Explained

```text
src/
│
├── components/
│   ├── EmotionResults.tsx
│   └── ui/
│       └── reusable UI primitives
│
├── hooks/
│   └── use-mobile.tsx
│
├── integrations/
│   └── supabase/
│       ├── client.ts
│       ├── client.server.ts
│       ├── auth-middleware.ts
│       └── types.ts
│
├── lib/
│   ├── emotions.ts
│   └── utils.ts
│
├── routes/
│   ├── __root.tsx
│   └── index.tsx
│
├── server/
│   └── emotion.functions.ts
│
├── router.tsx
├── routeTree.gen.ts
└── styles.css
```

The important architectural distinction is:

```text
components/
    Presentation

routes/
    Navigation + Page Composition

server/
    Server-side Application Logic

lib/
    Shared Domain Metadata / Utilities

integrations/
    External Services

styles/
    Visual System
```

---

# 18. Engineering Principles

## Server-side AI Boundary

The browser does not directly receive the private AI gateway credential.

Instead:

```text
Browser
   ↓
Server Function
   ↓
AI Provider
```

This is a cleaner security boundary than embedding provider credentials into frontend code.

---

## Schema Validation

Input is validated before AI processing.

```text
Request
 ↓
Zod Schema
 ↓
Valid?
 ├── No → Error
 └── Yes
        ↓
      AI Call
```

---

## Typed Result Contract

The frontend expects a well-defined result contract.

This reduces dependence on loosely formatted model-generated text.

---

## Provider Decoupling

The UI does not need to understand the underlying AI provider's raw response structure.

Provider-specific handling occurs inside:

```text
src/server/emotion.functions.ts
```

The rest of the application works with:

```text
EmotionResult
```

---

# 19. Error Handling Model

The server function explicitly distinguishes between different failure classes.

```text
Configuration Error
        ↓
"AI service not configured."

Rate Limit
        ↓
"Rate limit reached..."

Billing / Credit Error
        ↓
"AI credits exhausted..."

Invalid Model Response
        ↓
"Could not parse emotion analysis."

Unexpected Failure
        ↓
"Unexpected error during analysis."
```

This provides a more predictable user experience than allowing raw provider errors to propagate into the UI.

---

# 20. Important Scope Note

The application describes its model as **NLP + LSTM-style sequential analysis**, but the current repository implementation delegates inference to a Gemini-family model through the configured AI gateway.

Therefore, this project should be described accurately as:

> **An AI-powered NLP emotion-analysis application with structured emotion scoring and a server-side inference layer.**

It should not be represented as a conventionally trained standalone LSTM model unless a separately trained LSTM model is added to the implementation.

This distinction is important for technical interviews and code-review credibility.

---

# 21. Current Limitations

The current version has several boundaries.

### Model Training

The repository does not contain a separately trained emotion-classification LSTM model or visible model-training pipeline.

### Dataset

A dedicated training dataset and training notebook/pipeline are not part of the current application repository.

### Persistent Emotion History

The current primary workflow is analysis of submitted text rather than a full long-term emotion analytics/history platform.

### Production Observability

The repository contains application-level error handling, but a complete enterprise observability stack—distributed tracing, centralized logs, metrics, alerting—is outside the current scope.

---

# 22. Future Roadmap

Potential future engineering improvements include:

```text
Custom trained emotion classifier
        ↓
Domain-specific dataset
        ↓
Model evaluation pipeline
        ↓
Precision / Recall / F1 dashboard
        ↓
Emotion history
        ↓
Trend analytics
        ↓
User profiles
        ↓
Conversation-level emotion tracking
        ↓
Multilingual emotion detection
        ↓
Voice / speech emotion analysis
        ↓
Production observability
```

These are planned extensions, not current implementation claims.

---

# 23. Why This Project Matters Technically

The project demonstrates more than an AI API call.

It combines:

```text
React
   +
TypeScript
   +
Routing
   +
Server Functions
   +
Schema Validation
   +
AI Integration
   +
Structured Outputs
   +
Domain Modeling
   +
External Service Integration
   +
Responsive UI
```

The important engineering decision is the separation between:

```text
AI Provider
        ≠
Application Logic
        ≠
Presentation Layer
```

That separation allows the application to evolve without making the UI dependent on provider-specific implementation details.

---

# 24. Hiring / Portfolio Signal

From a hiring-review perspective, this project demonstrates exposure to:

### Frontend Engineering

- React component architecture
- TypeScript
- responsive UI
- reusable components
- state management
- asynchronous UX
- routing
- accessibility-aware interfaces

### AI Application Engineering

- LLM integration
- structured AI outputs
- server-side inference
- prompt design
- result normalization
- AI error handling
- confidence-style score presentation

### Backend / Full-Stack Engineering

- server functions
- input validation
- API integration
- environment configuration
- authentication infrastructure
- external service integration

### Software Engineering

- modular architecture
- typed contracts
- separation of concerns
- reusable utilities
- linting
- formatting
- maintainable source organization

---

# 25. Repository

GitHub:

https://github.com/Suhani-Parashar/Spark-of-Emotion

---

# 26. Author

**Suhani Parashar**

Computer Science Engineering Student

Project focus:

```text
AI Applications
React
TypeScript
Full-Stack Development
Natural Language Processing
UI/UX
Cloud-integrated Applications
```

---

# 27. Recommended Technical Walkthrough

For a technical interview, review the project in this order:

```text
1. src/routes/index.tsx
        ↓
2. src/server/emotion.functions.ts
        ↓
3. src/components/EmotionResults.tsx
        ↓
4. src/lib/emotions.ts
        ↓
5. src/integrations/supabase/
        ↓
6. package.json
```

This order quickly demonstrates the entire request lifecycle:

```text
UI
 ↓
Server Function
 ↓
AI
 ↓
Structured Result
 ↓
Visualization
 ↓
Supporting Infrastructure
```

---

# 28. Final Architecture Summary

```text
                         ┌─────────────────────┐
                         │       USER          │
                         │  Text Input         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     REACT UI        │
                         │ index.tsx           │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ TANSTACK START      │
                         │ SERVER FUNCTION     │
                         └──────────┬──────────┘
                                    │
                              Zod Validation
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   AI GATEWAY        │
                         │ Gemini-family Model │
                         └──────────┬──────────┘
                                    │
                         Structured Tool Output
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ APPLICATION LOGIC   │
                         │ Score Normalization │
                         │ Dominant Detection  │
                         │ Mixed Detection     │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ EmotionResult       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ EmotionResults.tsx  │
                         │ Visual Presentation │
                         └─────────────────────┘


Supporting Services
──────────────────────────────────────────────────
Supabase Integration
Environment Configuration
Cloudflare / Vite Configuration
TypeScript
ESLint
Prettier
```

---

## Project Positioning

**Spark of Emotion** is best understood as a **full-stack AI application project** focused on converting natural-language input into structured emotional information.

Its strongest portfolio signal is the combination of:

**React + TypeScript + server-side AI inference + schema validation + structured outputs + clean separation of application layers.**
