import { useRouter } from 'next/navigation'
import { useQuizStore } from '@/store/quiz'

export function useQuiz() {
  const router = useRouter()
  const { setQuestions, setMetadata, setIsProcessing, setError } = useQuizStore()

  const generateQuiz = async (file: File) => {
    try {
      setIsProcessing(true)
      setError(null)

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('http://localhost:8000/generate-quiz', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to generate quiz')
      }

      const data = await response.json()
      
      setQuestions(data.questions)
      setMetadata({
        totalPages: data.total_pages,
        totalTokens: data.total_tokens,
        processingTimeSeconds: data.processing_time_seconds
      })

      router.push('/edit')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  return { generateQuiz }
}