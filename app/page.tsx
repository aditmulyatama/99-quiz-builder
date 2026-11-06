import { QuizApp } from '@/components/quiz/quiz-app'
import { SiteHeader } from '@/components/site-header'

export default function Page() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-12">
        <QuizApp />
      </main>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        AI-generated content may contain mistakes. Verify important facts with official sources.
      </footer>
    </div>
  )
}
