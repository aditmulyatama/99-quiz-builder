'use client'

import { CheckCircle2, Lightbulb, RotateCcw, Sparkles, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Quiz } from '@/lib/quiz-schema'

const LETTERS = ['A', 'B', 'C', 'D']

type Props = {
  quiz: Quiz
  answers: (number | null)[]
  onRetake: () => void
  onNewTopic: () => void
}

function getVerdict(percent: number) {
  if (percent >= 90) return 'Outstanding — you really know this topic.'
  if (percent >= 70) return 'Great work — a solid grasp of the essentials.'
  if (percent >= 50) return 'Good effort — review the explanations below to level up.'
  return 'A great learning opportunity — the explanations below will help.'
}

export function QuizResults({ quiz, answers, onRetake, onNewTopic }: Props) {
  const total = quiz.questions.length
  const score = quiz.questions.filter((q, i) => answers[i] === q.correctAnswerIndex).length
  const percent = Math.round((score / total) * 100)

  return (
    <div className="flex flex-col gap-6">
      <section
        aria-labelledby="score-heading"
        className="flex flex-col items-center gap-4 rounded-2xl bg-primary px-6 py-10 text-center text-primary-foreground shadow-sm"
      >
        <p className="text-sm font-medium opacity-80">{quiz.topic}</p>
        <h1 id="score-heading" className="flex flex-col gap-1">
          <span className="text-6xl font-bold tracking-tight">
            {score}
            <span className="text-3xl opacity-70">/{total}</span>
          </span>
          <span className="sr-only">{`You scored ${score} out of ${total}.`}</span>
        </h1>
        <p className="text-pretty text-lg font-medium">{getVerdict(percent)}</p>
        <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row">
          <Button
            type="button"
            onClick={onRetake}
            className="h-11 rounded-xl bg-primary-foreground px-5 text-primary hover:bg-primary-foreground/90"
          >
            <RotateCcw aria-hidden="true" />
            Retake
          </Button>
          <Button
            type="button"
            onClick={onNewTopic}
            className="h-11 rounded-xl border-primary-foreground/40 bg-transparent px-5 text-primary-foreground hover:bg-primary-foreground/10"
            variant="outline"
          >
            <Sparkles aria-hidden="true" />
            New Topic
          </Button>
        </div>
      </section>

      <section aria-labelledby="review-heading" className="flex flex-col gap-4">
        <h2 id="review-heading" className="text-lg font-bold">
          Review your answers
        </h2>
        <ol className="flex flex-col gap-4">
          {quiz.questions.map((q, i) => {
            const userAnswer = answers[i]
            const correct = userAnswer === q.correctAnswerIndex
            return (
              <li key={i} className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  {correct ? (
                    <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-success" aria-hidden="true" />
                  ) : (
                    <XCircle className="mt-0.5 size-6 shrink-0 text-destructive" aria-hidden="true" />
                  )}
                  <div className="flex flex-col gap-1">
                    <p
                      className={cn(
                        'text-xs font-bold uppercase tracking-wide',
                        correct ? 'text-success' : 'text-destructive',
                      )}
                    >
                      {`Question ${i + 1} · ${correct ? 'Correct' : 'Incorrect'}`}
                    </p>
                    <h3 className="text-pretty font-semibold leading-snug">{q.question}</h3>
                  </div>
                </div>

                <ul className="flex flex-col gap-2">
                  {q.options.map((option, optIndex) => {
                    const isCorrect = optIndex === q.correctAnswerIndex
                    const isChosen = optIndex === userAnswer
                    return (
                      <li
                        key={optIndex}
                        className={cn(
                          'flex items-start gap-3 rounded-lg border px-3 py-2.5 text-sm',
                          isCorrect && 'border-success/40 bg-success/10',
                          isChosen && !isCorrect && 'border-destructive/40 bg-destructive/5',
                          !isCorrect && !isChosen && 'border-transparent text-muted-foreground',
                        )}
                      >
                        <span className="font-bold">{LETTERS[optIndex]}.</span>
                        <span className="flex-1 leading-relaxed">{option}</span>
                        {isCorrect && (
                          <span className="shrink-0 text-xs font-semibold text-success">
                            Correct answer
                          </span>
                        )}
                        {isChosen && !isCorrect && (
                          <span className="shrink-0 text-xs font-semibold text-destructive">
                            Your answer
                          </span>
                        )}
                      </li>
                    )
                  })}
                </ul>

                <div className="flex items-start gap-2.5 rounded-lg bg-secondary p-3 text-sm">
                  <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <p className="leading-relaxed text-secondary-foreground">{q.explanation}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}
