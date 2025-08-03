import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getSessionId, setSessionId, removeSessionId } from '@/services/sessionService'
import { getQuizCache, saveQuizCache, deleteQuizCache } from '@/services/quizService'
import { saveResultCache, getResultCache, deleteResultCache } from '@/services/resultService'

interface Question {
  question: string
  options: string[]
  correct_index: number
}

interface PdfInfo {
  total_pages: number
  pages_read: number
  was_truncated: boolean
}

interface QuizMetadata {
  original_text_length: number
  was_summarized: boolean
  num_questions: number
  pdf_info: PdfInfo
  processingTimeSeconds: number
  topic?: string
}

interface QuizState {
  isProcessing: boolean
  questions: Question[]
  metadata: QuizMetadata | null
  error: string | null
  userName: string | null
  userAnswers: number[]
  setQuestions: (questions: Question[]) => void
  setMetadata: (metadata: QuizMetadata) => void
  setIsProcessing: (isProcessing: boolean) => void
  setError: (error: string | null) => void
  setUserName: (name: string) => void
  setUserAnswers: (answers: number[]) => void
  reset: () => void
  loadCachedQuiz: () => Promise<boolean>
  cacheCurrentQuiz: () => Promise<void>
  clearCache: () => Promise<void>
  saveResults: () => Promise<void>
  loadCachedResults: () => Promise<boolean>
  clearResultsCache: () => Promise<void>
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      isProcessing: false,
      questions: [],
      metadata: null,
      error: null,
      userName: null,
      userAnswers: [],
      setQuestions: (questions) => set({ questions }),
      setMetadata: (metadata) => set({ metadata }),
      setIsProcessing: (isProcessing) => set({ isProcessing }),
      setError: (error) => set({ error }),
      setUserName: (name) => set({ userName: name }),
      setUserAnswers: (answers) => set({ userAnswers: answers }),
      reset: () => set({ questions: [], metadata: null, error: null, isProcessing: false, userName: null, userAnswers: [] }),

      loadCachedQuiz: async () => {
        const sessionId = getSessionId()
        console.log('Checking cache with sessionId:', sessionId)
        
        if (!sessionId) {
          console.log('No session ID found')
          return false
        }

        try {
          const cachedData = await getQuizCache(sessionId)
          console.log('Cache response:', cachedData)
          
          if (cachedData) {
            set({ 
              questions: cachedData.questions, 
              metadata: cachedData.metadata,
              isProcessing: false,
              error: null
            })
            return true
          }
        } catch (err) {
          console.error('Failed to load cached quiz:', err)
        }
        return false
      },

      cacheCurrentQuiz: async () => {
        let sessionId = getSessionId()
        if (!sessionId) {
          sessionId = setSessionId()
        }
        const { questions, metadata } = get()
        if (questions.length > 0 && metadata) {
          try {
            await saveQuizCache(sessionId, { questions, metadata })
          } catch (err) {
            console.error('Failed to save quiz to cache:', err)
            set({ error: 'Failed to save quiz to cache.' })
            throw err
          }
        }
      },

      clearCache: async () => {
        const sessionId = getSessionId()
        if (sessionId) {
          try {
            await deleteQuizCache(sessionId)
          } catch (err) {
            console.error('Failed to delete quiz cache:', err)
            throw err
          }
        }
        removeSessionId()
        set({ questions: [], metadata: null, error: null, isProcessing: false })
      },

      saveResults: async () => {
        const { questions, metadata, userName, userAnswers } = get()
        if (questions.length > 0 && metadata && userName && userAnswers.length > 0) {
          try {
            await saveResultCache({
              questions,
              metadata,
              userName,
              userAnswers
            })
          } catch (err) {
            console.error('Failed to save results:', err)
            throw err
          }
        }
      },

      loadCachedResults: async () => {
        try {
          const cachedData = await getResultCache()
          if (cachedData) {
            set({
              questions: cachedData.questions,
              metadata: cachedData.metadata,
              userName: cachedData.userName,
              userAnswers: cachedData.userAnswers,
              isProcessing: false,
              error: null
            })
            return true
          }
        } catch (err) {
          console.error('Failed to load cached results:', err)
        }
        return false
      },

      clearResultsCache: async () => {
        try {
          await deleteResultCache()
          set({ questions: [], metadata: null, userName: null, userAnswers: [], error: null, isProcessing: false })
        } catch (err) {
          console.error('Failed to clear results cache:', err)
          throw err
        }
      },
    }),
    {
      name: 'quiz-storage',
      skipHydration: true, // Importante: Evita problemas de hidratação no SSR
      partialize: (state) => ({
        questions: state.questions,
        metadata: state.metadata,
      }),
    }
  )
)