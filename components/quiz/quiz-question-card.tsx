'use client'

import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { QuizQuestion } from '@/lib/quiz-schema'

const LETTERS = ['A', 'B', 'C', 'D']

type Props = {
  topic: string
  difficulty: string
  question: QuizQuestion
  index: number
  total: number
  selected: number | null
  onSelect: (optionIndex: number) => void
  onNext: () => void
  onBack: () => void
}

export function QuizQuestionCard({
  topic,
  difficulty,
  question,
  index,
  total,
  selected,
  onSelect,
  onNext,
  onBack,
}: Props) {
  const isLast = index === total - 1
  const progress = ((index + 1) / total) * 100

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4 text-sm">
          <p className="truncate font-medium text-muted-foreground">{topic}</p>
          <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
            {difficulty}
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={index + 1}
          aria-label={`Question ${index + 1} of ${total}`}
          className="h-2 overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <fieldset className="flex flex-col gap-5 rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
        <legend className="sr-only">{`Question ${index + 1}`}</legend>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-primary">
            Question {index + 1} of {total}
          </p>
          <h2 className="text-pretty text-xl font-bold leading-snug sm:text-2xl">
            {question.question}
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {question.options.map((option, i) => {
            const checked = selected === i
            return (
              <label
                key={i}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition has-focus-visible:ring-3 has-focus-visible:ring-ring/40',
                  checked
                    ? 'border-primary bg-secondary'
                    : 'border-border hover:border-primary/40 hover:bg-muted/60',
                )}
              >
                <input
                  type="radio"
                  name={`question-${index}`}
                  checked={checked}
                  onChange={() => onSelect(i)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-lg text-sm font-bold',
                    checked ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                  )}
                >
                  {checked ? <Check className="size-4" /> : LETTERS[i]}
                </span>
                <span className="pt-0.5 leading-relaxed">{option}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={index === 0}
          className="h-11 rounded-xl px-4"
        >
          <ArrowLeft aria-hidden="true" />
          Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={selected === null}
          className="h-11 rounded-xl px-5"
        >
          {isLast ? 'Finish quiz' : 'Next question'}
          {isLast ? <Check aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
        </Button>
      </div>
    </div>
  )
}
