import { z } from 'zod'

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const
export const QUESTION_COUNTS = [5, 10] as const

export type Difficulty = (typeof DIFFICULTIES)[number]
export type QuestionCount = (typeof QUESTION_COUNTS)[number]

export const generateQuizRequestSchema = z.object({
  topic: z
    .string()
    .trim()
    .min(3, 'Please enter a topic of at least 3 characters.')
    .max(200, 'Please keep the topic under 200 characters.'),
  difficulty: z.enum(DIFFICULTIES),
  numQuestions: z.union([z.literal(5), z.literal(10)]),
})

export type GenerateQuizRequest = z.infer<typeof generateQuizRequestSchema>

/**
 * Loose shape sent to the model as a structured-output schema. Kept simple so
 * every provider can honour it; the strict rules live in `buildStrictQuizSchema`.
 */
export const llmQuizSchema = z.object({
  topic: z.string(),
  questions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()),
      correctAnswerIndex: z.number(),
      explanation: z.string(),
    }),
  ),
})

const questionSchema = z.object({
  question: z.string().trim().min(1, 'Question text is empty.'),
  options: z
    .array(z.string().trim().min(1, 'An option is empty.'))
    .length(4, 'Each question must have exactly 4 options.'),
  correctAnswerIndex: z
    .number()
    .int('correctAnswerIndex must be an integer.')
    .min(0, 'correctAnswerIndex must be between 0 and 3.')
    .max(3, 'correctAnswerIndex must be between 0 and 3.'),
  explanation: z.string().trim().min(1, 'Explanation is empty.'),
})

export function buildStrictQuizSchema(numQuestions: number) {
  return z.object({
    topic: z.string().trim().min(1),
    questions: z
      .array(questionSchema)
      .length(numQuestions, `The quiz must contain exactly ${numQuestions} questions.`),
  })
}

export type QuizQuestion = z.infer<typeof questionSchema>
export type Quiz = { topic: string; questions: QuizQuestion[] }
