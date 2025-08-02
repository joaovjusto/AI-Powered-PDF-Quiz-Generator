'use client'
import { useQuizStore } from '@/store/quiz'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function EditPage() {
  const { questions, metadata, isProcessing } = useQuizStore()
  const router = useRouter()

  useEffect(() => {
    // Se não houver questões E não estiver processando, volta para home
    if (!questions?.length && !isProcessing) {
      router.push('/')
    }
  }, [questions, isProcessing, router])

  // Não renderiza nada enquanto estiver processando
  if (isProcessing) {
    return null
  }

  // Não renderiza se não houver questões
  if (!questions?.length) {
    return null
  }

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-[#15112B]">Generated Quiz</h1>
        {metadata && (
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-[#15112B]">Processing Information</h2>
            <pre className="text-sm overflow-x-auto p-4 bg-gray-50 rounded text-[#15112B] whitespace-pre-wrap font-mono">
              {JSON.stringify(metadata, null, 2)}
            </pre>
          </div>
        )}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-[#15112B]">Questions</h2>
          <pre className="text-sm overflow-x-auto p-4 bg-gray-50 rounded text-[#15112B] whitespace-pre-wrap font-mono">
            {JSON.stringify(questions, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}