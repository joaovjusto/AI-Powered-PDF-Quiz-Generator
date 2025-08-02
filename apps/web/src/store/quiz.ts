import { create } from 'zustand'
import { quizService } from '@/services/quizService'
import { sessionService } from '@/services/sessionService'

export interface PdfInfo {
  total_pages: number
  pages_read: number
  was_truncated: boolean
}

export interface QuizMetadata {
  original_text_length: number
  was_summarized: boolean
  num_questions: number
  pdf_info: PdfInfo
  processingTimeSeconds: number
  topic?: string
}

export interface Question {
  question: string
  options: string[]
  correct_index: number
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
  loadCachedQuiz: () => Promise<boolean>
  cacheCurrentQuiz: () => Promise<boolean>
  clearCache: () => Promise<void>
}

export const useQuizStore = create<QuizState>((set, get) => ({
  questions: null,
  metadata: null,
  isProcessing: false,
  error: null,
  setQuestions: (questions) => set({ questions }),
  setMetadata: (metadata) => set({ metadata }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setError: (error) => set({ error }),
  reset: () => set({ questions: null, metadata: null, error: null }),
  loadCachedQuiz: async () => {
    try {
      const cachedQuiz = await quizService.getCachedQuiz()
      if (cachedQuiz) {
        set({ 
          questions: cachedQuiz.questions, 
          metadata: cachedQuiz.metadata,
          isProcessing: false,
          error: null
        })
        return true
      }
      return false
    } catch (error) {
      console.error('Error loading cached quiz:', error)
      return false
    }
  },
  cacheCurrentQuiz: async () => {
    const { questions, metadata } = get()
    if (!questions || !metadata) return false

    try {
      return await quizService.cacheQuiz(questions, metadata)
    } catch (error) {
      console.error('Error caching current quiz:', error)
      return false
    }
  },
  clearCache: async () => {
    try {
      await quizService.clearCache()
      sessionService.clearSession()
      set({ questions: null, metadata: null, error: null })
    } catch (error) {
      console.error('Error clearing cache:', error)
    }
  }
}))