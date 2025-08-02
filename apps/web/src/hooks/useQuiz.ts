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
      
      // Primeiro setamos os dados
      setQuestions(data.questions)
      setMetadata({
        totalPages: data.metadata.pdf_info.total_pages,
        totalTokens: data.metadata.total_tokens,
        processingTimeSeconds: data.metadata.processing_time_seconds
      })

      // Pequena espera para garantir que os dados foram atualizados
      await new Promise(resolve => setTimeout(resolve, 100))

      // Depois navegamos para a próxima página
      router.push('/edit')

      // Só então, após um pequeno delay, removemos o loading
      setTimeout(() => {
        setIsProcessing(false)
      }, 500)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
      setIsProcessing(false)
    }
  }

  return { generateQuiz }
}