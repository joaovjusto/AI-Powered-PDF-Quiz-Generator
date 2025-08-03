import { useRouter } from 'next/navigation'
import { useQuizStore } from '@/store/quiz'
import { API_CONFIG } from '@/config/api'

export function useQuiz() {
  const router = useRouter()
  const { setQuestions, setMetadata, setIsProcessing, setError } = useQuizStore()

  const generateQuiz = async (file: File) => {
    try {
      setIsProcessing(true)
      setError(null)

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.generateQuiz}`, {
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
        original_text_length: data.metadata.original_text_length,
        was_summarized: data.metadata.was_summarized,
        num_questions: data.metadata.num_questions,
        pdf_info: data.metadata.pdf_info,
        processingTimeSeconds: data.metadata.processing_time_seconds || 0,
        topic: data.metadata.topic
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