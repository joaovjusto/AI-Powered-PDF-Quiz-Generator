import { getSessionId } from './sessionService'
import { config } from '@/config/env'

interface ResultCache {
  userName: string
  userAnswers: number[]
  questions: {
    question: string
    options: string[]
    correct_index: number
  }[]
  metadata: {
    topic?: string
    pdf_info: {
      total_pages: number
      pages_read: number
      was_truncated: boolean
    }
    original_text_length: number
    was_summarized: boolean
    num_questions: number
    processingTimeSeconds: number
  } | null
}

export async function saveResultCache(data: ResultCache): Promise<void> {
  const sessionId = getSessionId()
  if (!sessionId) {
    throw new Error('No session ID found')
  }

  try {
    const API_URL = config.apiUrl
    const response = await fetch(`${API_URL}/api/cache/results/${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        userName: data.userName,
        userAnswers: data.userAnswers,
        questions: data.questions,
        metadata: {
          topic: data.metadata?.topic,
          pdf_info: data.metadata?.pdf_info,
          original_text_length: data.metadata?.original_text_length,
          was_summarized: data.metadata?.was_summarized,
          num_questions: data.metadata?.num_questions,
          processingTimeSeconds: data.metadata?.processingTimeSeconds
        }
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to save result cache')
    }
  } catch (err) {
    console.error('Failed to save result cache:', err)
    throw err
  }
}

export async function getResultCache(): Promise<ResultCache | null> {
  const sessionId = getSessionId()
  if (!sessionId) {
    return null
  }

  try {
    const API_URL = config.apiUrl
    const response = await fetch(`${API_URL}/api/cache/results/${sessionId}`)
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Failed to get result cache')
    }

    return response.json()
  } catch (err) {
    console.error('Failed to get result cache:', err)
    return null
  }
}

export async function deleteResultCache(): Promise<void> {
  const sessionId = getSessionId()
  if (!sessionId) {
    return
  }

  try {
    const API_URL = config.apiUrl
    const response = await fetch(`${API_URL}/api/cache/results/${sessionId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete result cache')
    }
  } catch (err) {
    console.error('Failed to delete result cache:', err)
    throw err
  }
}