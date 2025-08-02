import { create } from 'zustand'

interface Question {
  question: string
  options: string[]
  correctAnswer: string
}

interface QuizMetadata {
  totalPages: number
  totalTokens: number
  processingTimeSeconds: number
  topic: string
}

interface QuizState {
  questions: Question[] | null
  metadata: QuizMetadata | null
  isProcessing: boolean
  error: string | null
  setQuestions: (questions: Question[]) => void
  setMetadata: (metadata: QuizMetadata) => void
  setIsProcessing: (isProcessing: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useQuizStore = create<QuizState>((set) => ({
  questions: null,
  metadata: null,
  isProcessing: true,
  error: null,
  setQuestions: (questions) => set({ questions }),
  setMetadata: (metadata) => set({ metadata }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setError: (error) => set({ error }),
  reset: () => set({ questions: null, metadata: null, isProcessing: false, error: null })
}))