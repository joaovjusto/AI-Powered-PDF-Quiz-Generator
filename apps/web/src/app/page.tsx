'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuizStore } from '@/store/quiz'
import { FileUpload } from '@/components/FileUpload'
import { Logo } from '@/components/Logo'
import { useToast } from '@chakra-ui/react'
import { getSessionId } from '@/services/sessionService'

export default function Home() {
  const router = useRouter()
  const toast = useToast()
  const { loadCachedQuiz } = useQuizStore()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkCache = async () => {
      try {
        const sessionId = getSessionId()
        if (sessionId) {
          console.log('Found session ID, checking cache...')
          const loaded = await loadCachedQuiz()
          if (loaded) {
            console.log('Found cached quiz, redirecting to edit')
            toast({
              title: 'Previous Session Found',
              description: 'Restoring your last quiz session.',
              status: 'success',
              duration: 3000,
              isClosable: true,
              position: 'top-right',
            })
            await new Promise(resolve => setTimeout(resolve, 500))
            router.push('/edit')
            return
          }
        }
      } catch (error) {
        console.error('Error checking cache:', error)
      } finally {
        setIsChecking(false)
      }
    }
    checkCache()
  }, [loadCachedQuiz, router, toast])

  if (isChecking) {
    return null // ou um loading spinner se preferir
  }

  return (
    <div className="flex flex-col items-center justify-center w-full px-4">
      <Logo />
      <p className="mt-4 sm:mt-4 text-center max-w-xl text-[16px] sm:text-[20px] px-2" style={{ color: '#15112B80' }}>
        Generate quizzes from your course materials or textbooks to
        help you study faster and smarter.
      </p>
      <FileUpload />
    </div>
  )
}