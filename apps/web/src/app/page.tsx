'use client'
import { useEffect, useState } from 'react'
import { useRouter, redirect } from 'next/navigation'
import { useQuizStore } from '@/store/quiz'
import { FileUpload } from '@/components/FileUpload'
import { Logo } from '@/components/Logo'
import { getSessionId } from '@/services/sessionService'

// Componente de loading que será mostrado enquanto verifica o cache
function LoadingState() {
  return null;
}

// Componente principal que será mostrado apenas se não houver cache
function HomeContent() {
  return (
    <div className="flex flex-col items-center justify-center w-full px-4">
      <Logo />
      <p className="mt-4 sm:mt-4 text-center max-w-xl text-[16px] sm:text-[20px] px-2" style={{ color: '#15112B80' }}>
        Generate quizzes from your course materials or textbooks to
        help you study faster and smarter.
      </p>
      <FileUpload />
    </div>
  );
}

export default function Home() {
  const router = useRouter()
  const { loadCachedQuiz } = useQuizStore()
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    let isMounted = true;

    const checkCache = async () => {
      try {
        const sessionId = getSessionId()
        if (sessionId) {
          const loaded = await loadCachedQuiz()
          if (loaded && isMounted) {
            // Use replace em vez de push para evitar histórico indesejado
            router.replace('/edit')
            return;
          }
        }
        // Só seta shouldRender para true se não tiver cache
        if (isMounted) {
          setShouldRender(true)
        }
      } catch (error) {
        console.error('Error checking cache:', error)
        if (isMounted) {
          setShouldRender(true)
        }
      }
    }
    
    checkCache()

    return () => {
      isMounted = false;
    }
  }, [])

  // Renderiza o conteúdo apenas quando shouldRender for true
  if (!shouldRender) {
    return <LoadingState />;
  }

  return <HomeContent />;
}