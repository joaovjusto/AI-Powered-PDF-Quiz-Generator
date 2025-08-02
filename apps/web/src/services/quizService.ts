import { sessionService } from './sessionService'
import { Question, QuizMetadata } from '@/store/quiz'

interface CacheQuizRequest {
  questions: Question[]
  metadata: QuizMetadata
  sessionToken: string
}

interface CacheQuizResponse {
  success: boolean
  error?: string
}

interface GetCachedQuizResponse {
  questions: Question[]
  metadata: QuizMetadata
  error?: string
}

export const quizService = {
  cacheQuiz: async (questions: Question[], metadata: QuizMetadata): Promise<boolean> => {
    try {
      const sessionToken = sessionService.getSessionToken()
      const response = await fetch('/api/quiz/cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questions,
          metadata,
          sessionToken
        } as CacheQuizRequest)
      })

      if (!response.ok) {
        const data = await response.json()
        console.error('Error caching quiz:', data.error)
        return false
      }

      const data = await response.json() as CacheQuizResponse
      return data.success
    } catch (error) {
      console.error('Error caching quiz:', error)
      return false
    }
  },

  getCachedQuiz: async (): Promise<GetCachedQuizResponse | null> => {
    try {
      const sessionToken = sessionService.getSessionToken()
      const response = await fetch(`/api/quiz/cache?sessionToken=${sessionToken}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 404) {
          // Cache não encontrado é um caso esperado
          return null
        }
        console.error('Error getting cached quiz:', data.error)
        return null
      }

      return data as GetCachedQuizResponse
    } catch (error) {
      console.error('Error getting cached quiz:', error)
      return null
    }
  },

  clearCache: async (): Promise<void> => {
    try {
      const sessionToken = sessionService.getSessionToken()
      await fetch(`/api/quiz/cache?sessionToken=${sessionToken}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })
    } catch (error) {
      console.error('Error clearing cache:', error)
    }
  }
}