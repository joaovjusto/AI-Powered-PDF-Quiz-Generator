'use client'

import { FileUpload } from '@/components/FileUpload'
import { Logo } from '@/components/Logo'
import { useQuizStore } from '@/store/quiz'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { loadCachedQuiz } = useQuizStore()
  const router = useRouter()

  useEffect(() => {
    const checkCache = async () => {
      const hasCachedQuiz = await loadCachedQuiz()
      if (hasCachedQuiz) {
        router.push('/edit')
      }
    }

    checkCache()
  }, [loadCachedQuiz, router])

  return (
    <div className="flex flex-col items-center justify-center w-full px-4">
      <Logo />
      <p 
        className="mt-4 sm:mt-4 text-center max-w-xl text-[16px] sm:text-[20px] px-2" 
        style={{ color: '#15112B80' }}
      >
        Generate quizzes from your course materials or textbooks to
        help you study faster and smarter.
      </p>
      <FileUpload />
    </div>
  )
}