'use client'

import { useState } from 'react'
import type { Difficulty, Quiz, QuestionCount } from '@/lib/quiz-schema'
import { QuizSetupForm } from './quiz-setup-form'
import { QuizLoading } from './quiz-loading'
import { QuizQuestionCard } from './quiz-question-card'
import { QuizResults } from './quiz-results'

type Phase = 'setup' | 'loading' | 'quiz' | 'results'

export function QuizApp() {
  const [phase, setPhase] = useState<Phase>('setup')
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium')
  const [numQuestions, setNumQuestions] = useState<QuestionCount>(5)
  const [error, setError] = useState<string | null>(null)

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])

  async function generateQuiz() {
    setError(null)
    setPhase('loading')
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), difficulty, numQuestions }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.quiz) {
        throw new Error(
          data?.error ?? 'Something went wrong while generating your quiz. Please try again.',
        )
      }
      startQuiz(data.quiz as Quiz)
    } catch (err) {
      setError(
        err instanceof Error && err.message !== 'Failed to fetch'
          ? err.message
          : 'We could not reach the quiz service. Check your connection and try again.',
      )
      setPhase('setup')
    }
  }

  function startQuiz(nextQuiz: Quiz) {
    setQuiz(nextQuiz)
    setAnswers(Array(nextQuiz.questions.length).fill(null))
    setCurrentIndex(0)
    setPhase('quiz')
  }

  function selectAnswer(optionIndex: number) {
    setAnswers((prev) => prev.map((value, i) => (i === currentIndex ? optionIndex : value)))
  }

  function goNext() {
    if (!quiz) return
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((i) => i + 1)
    } else {
      setPhase('results')
    }
  }

  function goBack() {
    setCurrentIndex((i) => Math.max(0, i - 1))
  }

  function newTopic() {
    setQuiz(null)
    setAnswers([])
    setCurrentIndex(0)
    setTopic('')
    setError(null)
    setPhase('setup')
  }

  if (phase === 'loading') {
    return <QuizLoading topic={topic} numQuestions={numQuestions} />
  }

  if (phase === 'quiz' && quiz) {
    return (
      <QuizQuestionCard
        key={currentIndex}
        topic={quiz.topic}
        difficulty={difficulty}
        question={quiz.questions[currentIndex]}
        index={currentIndex}
        total={quiz.questions.length}
        selected={answers[currentIndex]}
        onSelect={selectAnswer}
        onNext={goNext}
        onBack={goBack}
      />
    )
  }

  if (phase === 'results' && quiz) {
    return (
      <QuizResults
        quiz={quiz}
        answers={answers}
        onRetake={() => startQuiz(quiz)}
        onNewTopic={newTopic}
      />
    )
  }

  return (
    <QuizSetupForm
      topic={topic}
      difficulty={difficulty}
      numQuestions={numQuestions}
      error={error}
      onTopicChange={setTopic}
      onDifficultyChange={setDifficulty}
      onNumQuestionsChange={setNumQuestions}
      onDismissError={() => setError(null)}
      onSubmit={generateQuiz}
    />
  )
}
