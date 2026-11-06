# 99 Group Quiz Builder

An AI-powered quiz generator that helps 99 Group (Rumah123, 99.co) employees build practical property industry knowledge. Enter a topic, pick a difficulty and question count, and get a multiple-choice quiz with scoring and explanations.

## Features

- Topic input with 3 clickable example topics
- Difficulty (Easy / Medium / Hard) and question count (5 / 10)
- One question at a time, 4 options each, with Back / Next navigation
- Results screen: score, correct vs. chosen answer per question, and a short explanation
- **Retake** (same quiz) and **New Topic** actions
- Loading state while generating and friendly error messages on failure
- Mobile-friendly blue and white design

## Architecture

```
app/
  page.tsx                     Page shell (header, main, footer)
  layout.tsx                   Fonts, metadata, viewport
  api/generate-quiz/route.ts   POST endpoint: validates input, calls the LLM, validates output, retries once
components/
  site-header.tsx
  quiz/
    quiz-app.tsx               Client state machine: setup → loading → quiz → results
    quiz-setup-form.tsx        Topic, example chips, difficulty, question count, error banner
    segmented-control.tsx      Accessible radio-group toggle
    quiz-loading.tsx           Loading state
    quiz-question-card.tsx     Single question view with progress bar
    quiz-results.tsx           Score summary + per-question review
lib/
  quiz-schema.ts               Zod schemas (request, loose LLM schema, strict quiz schema)
  quiz-prompt.ts               System prompt and user prompt builder
```

### Request flow

1. The client `POST`s `{ topic, difficulty, numQuestions }` to `/api/generate-quiz`.
2. The route validates the request body with Zod (`generateQuizRequestSchema`).
3. It calls the model through the **Vercel AI SDK** (`generateText` + `Output.object`) via the Vercel AI Gateway, using the 99 Group training-designer system prompt.
4. The model output is validated against a **strict Zod schema** built for the requested size:
   - exactly `numQuestions` questions
   - exactly 4 non-empty options per question
   - `correctAnswerIndex` is an integer between 0 and 3
   - non-empty question and explanation
5. If generation or validation fails, the route **retries once**, feeding the validation error back to the model. If the second attempt also fails, it returns a `502` with a friendly error message that the UI displays.

Quiz state (answers, current question) lives only in the browser; nothing is persisted.

## Running locally

Requirements: Node.js 20+ and pnpm.

```bash
pnpm install
cp .env.example .env.local   # then fill in your key
pnpm dev
```

Open http://localhost:3000.

## Environment variables

| Variable             | Required          | Description                                                                                                                                                    |
| -------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AI_GATEWAY_API_KEY` | Yes (locally)     | Vercel AI Gateway API key. Create one in the Vercel dashboard under **AI Gateway → API Keys**. The AI SDK reads it automatically; it is never hardcoded. |
| `QUIZ_MODEL`         | No                | Override the model ID (format `provider/model`). Defaults to `openai/gpt-5-mini`.                                                                               |

When deployed on Vercel, the AI Gateway authenticates automatically with OIDC, so `AI_GATEWAY_API_KEY` is optional in production.

## Deploying

Push to GitHub and import the repository in Vercel, or use the **Publish** button in v0.
