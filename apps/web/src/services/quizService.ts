const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

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

interface CachedQuizData {
  questions: Question[]
  metadata: QuizMetadata
}

export const generateQuiz = async (file: File): Promise<{
  questions: Question[]
  metadata: QuizMetadata
}> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/generate-quiz`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.detail || 'Failed to generate quiz')
  }

  return response.json()
}

export const getQuizCache = async (sessionId: string): Promise<CachedQuizData | null> => {
  console.log('Getting cache for sessionId:', sessionId)
  
  const response = await fetch(`${API_BASE_URL}/api/cache?session_id=${sessionId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (response.status === 404) {
    console.log('No cache found for sessionId:', sessionId)
    return null
  }

  if (!response.ok) {
    const errorData = await response.json()
    console.error('Error fetching quiz cache:', errorData)
    throw new Error(errorData.detail || 'Failed to fetch quiz cache')
  }

  const data = await response.json()
  console.log('Cache found:', data)
  return data
}

export const saveQuizCache = async (sessionId: string, data: CachedQuizData): Promise<void> => {
  console.log('Saving cache with sessionId:', sessionId)
  console.log('Original cache data:', data)

  // Transformar os dados para o formato esperado pelo backend
  const transformedQuestions = data.questions.map(q => ({
    question: q.question,
    options: q.options,
    correct_index: q.correct_index
  }))

  const payload = {
    session_id: sessionId,
    questions: transformedQuestions,
    metadata: {
      totalPages: data.metadata.pdf_info?.total_pages || 0,
      original_text_length: data.metadata.original_text_length || 0,
      was_summarized: data.metadata.was_summarized || false,
      num_questions: data.metadata.num_questions || 0,
      topic: data.metadata.topic || undefined
    }
  }

  console.log('Sending transformed payload:', payload)

  const response = await fetch(`${API_BASE_URL}/api/cache`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error('Error saving quiz cache:', errorData)
    throw new Error(errorData.detail || 'Failed to save quiz cache')
  }

  console.log('Cache saved successfully')
}

export const deleteQuizCache = async (sessionId: string): Promise<void> => {
  console.log('Deleting cache for sessionId:', sessionId)
  
  const response = await fetch(`${API_BASE_URL}/api/cache?session_id=${sessionId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error('Error deleting quiz cache:', errorData)
    throw new Error(errorData.detail || 'Failed to delete quiz cache')
  }

  console.log('Cache deleted successfully')
}