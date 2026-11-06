import { generateText, Output } from 'ai'
import { buildQuizUserPrompt, QUIZ_SYSTEM_PROMPT } from '@/lib/quiz-prompt'
import {
  buildStrictQuizSchema,
  generateQuizRequestSchema,
  llmQuizSchema,
  type GenerateQuizRequest,
  type Quiz,
} from '@/lib/quiz-schema'

export const maxDuration = 60

const MODEL = process.env.QUIZ_MODEL ?? 'google/gemini-3-flash'
const MAX_ATTEMPTS = 2

type AttemptResult = { ok: true; quiz: Quiz } | { ok: false; reason: string }

async function attemptGeneration(
  input: GenerateQuizRequest,
  previousError?: string,
): Promise<AttemptResult> {
  try {
    const { output } = await generateText({
      model: MODEL,
      instructions: QUIZ_SYSTEM_PROMPT,
      prompt: buildQuizUserPrompt(input, previousError),
      output: Output.object({ schema: llmQuizSchema }),
    })

    const parsed = buildStrictQuizSchema(input.numQuestions).safeParse(output)
    if (!parsed.success) {
      return {
        ok: false,
        reason: parsed.error.issues
          .slice(0, 3)
          .map((issue) => `${issue.path.join('.') || 'quiz'}: ${issue.message}`)
          .join('; '),
      }
    }

    return { ok: true, quiz: parsed.data }
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.message : 'Unknown generation error',
    }
  }
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const input = generateQuizRequestSchema.safeParse(body)
  if (!input.success) {
    return Response.json(
      { error: input.error.issues[0]?.message ?? 'Invalid request.' },
      { status: 400 },
    )
  }

  let previousError: string | undefined
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const result = await attemptGeneration(input.data, previousError)
    if (result.ok) {
      return Response.json({ quiz: result.quiz })
    }
    console.error(`[generate-quiz] attempt ${attempt} failed:`, result.reason)
    previousError = result.reason
  }

  return Response.json(
    {
      error:
        "We couldn't build a valid quiz for that topic. Please try again or rephrase the topic.",
    },
    { status: 502 },
  )
}
