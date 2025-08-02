'use client'

import { useQuizStore } from '@/store/quiz'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function EditPage() {
  const { questions, metadata } = useQuizStore()
  const router = useRouter()

  // Se não houver questões, redireciona para a página inicial
  useEffect(() => {
    if (!questions || questions.length === 0) {
      router.push('/')
    }
  }, [questions, router])

  if (!questions || questions.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F8F9' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Generated Quiz</h1>
        
        {/* PDF Metadata */}
        {metadata && (
          <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Processing Information</h2>
            <pre className="text-sm overflow-x-auto p-2 bg-gray-50 rounded">
              {JSON.stringify(metadata, null, 2)}
            </pre>
          </div>
        )}

        {/* Questions */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Questions</h2>
          <pre className="text-sm overflow-x-auto p-2 bg-gray-50 rounded">
            {JSON.stringify(questions, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}