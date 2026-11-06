'use client'

import { AlertCircle, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  DIFFICULTIES,
  QUESTION_COUNTS,
  type Difficulty,
  type QuestionCount,
} from '@/lib/quiz-schema'
import { SegmentedControl } from './segmented-control'

const EXAMPLE_TOPICS = [
  'Top skills of a property agent in 2025',
  'KPR (home mortgage) basics for first-time buyers',
  'SHM vs HGB property certificates in Indonesia',
]

const DIFFICULTY_HINTS: Record<Difficulty, string> = {
  Easy: 'Basic concepts',
  Medium: 'Applying concepts',
  Hard: 'Scenarios & judgment',
}

type Props = {
  topic: string
  difficulty: Difficulty
  numQuestions: QuestionCount
  error: string | null
  onTopicChange: (value: string) => void
  onDifficultyChange: (value: Difficulty) => void
  onNumQuestionsChange: (value: QuestionCount) => void
  onDismissError: () => void
  onSubmit: () => void
}

export function QuizSetupForm({
  topic,
  difficulty,
  numQuestions,
  error,
  onTopicChange,
  onDifficultyChange,
  onNumQuestionsChange,
  onDismissError,
  onSubmit,
}: Props) {
  const canSubmit = topic.trim().length >= 3

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 text-center">
        <span className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
          <Sparkles className="size-3.5" aria-hidden="true" />
          AI-powered training
        </span>
        <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          Build a property knowledge quiz in seconds
        </h1>
        <p className="mx-auto max-w-xl text-pretty leading-relaxed text-muted-foreground">
          Pick a topic relevant to your work at Rumah123 or 99.co, choose a difficulty, and test
          what you know.
        </p>
      </div>

      <form
        className="flex flex-col gap-6 rounded-2xl border bg-card p-5 shadow-sm sm:p-7"
        onSubmit={(e) => {
          e.preventDefault()
          if (canSubmit) onSubmit()
        }}
      >
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm"
          >
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
            <div className="flex-1">
              <p className="font-semibold text-destructive">Quiz generation failed</p>
              <p className="mt-0.5 leading-relaxed text-foreground/80">{error}</p>
            </div>
            <button
              type="button"
              onClick={onDismissError}
              className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-foreground"
            >
              <X className="size-4" aria-hidden="true" />
              <span className="sr-only">Dismiss error</span>
            </button>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="topic" className="text-sm font-semibold">
            Quiz topic
          </label>
          <input
            id="topic"
            name="topic"
            type="text"
            value={topic}
            maxLength={200}
            autoComplete="off"
            placeholder="e.g. Top skills of a property agent in 2025"
            onChange={(e) => onTopicChange(e.target.value)}
            className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          />
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-xs font-medium text-muted-foreground">Try an example:</span>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_TOPICS.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => onTopicChange(example)}
                  aria-pressed={topic === example}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-left text-sm transition',
                    topic === example
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-secondary/60 text-secondary-foreground hover:border-primary/40 hover:bg-secondary',
                  )}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-[1.6fr_1fr]">
          <SegmentedControl
            label="Difficulty"
            value={difficulty}
            options={DIFFICULTIES.map((d) => ({ value: d, label: d, hint: DIFFICULTY_HINTS[d] }))}
            onChange={onDifficultyChange}
          />
          <SegmentedControl
            label="Questions"
            value={numQuestions}
            options={QUESTION_COUNTS.map((n) => ({ value: n, label: String(n) }))}
            onChange={onNumQuestionsChange}
          />
        </div>

        <Button type="submit" disabled={!canSubmit} className="h-12 w-full rounded-xl text-base">
          <Sparkles aria-hidden="true" />
          Generate Quiz
        </Button>
      </form>
    </div>
  )
}
