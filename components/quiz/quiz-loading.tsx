import { Loader2 } from 'lucide-react'

type Props = { topic: string; numQuestions: number }

export function QuizLoading({ topic, numQuestions }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-6 rounded-2xl border bg-card px-6 py-14 text-center shadow-sm"
    >
      <div className="flex size-16 items-center justify-center rounded-2xl bg-secondary">
        <Loader2 className="size-8 animate-spin text-primary" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">Generating your quiz…</h2>
        <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
          Writing {numQuestions} questions on{' '}
          <span className="font-semibold text-foreground">{`"${topic.trim()}"`}</span>. This
          usually takes 10–20 seconds.
        </p>
      </div>
      <div className="flex w-full max-w-sm flex-col gap-3" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-10 animate-pulse rounded-lg bg-muted"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
