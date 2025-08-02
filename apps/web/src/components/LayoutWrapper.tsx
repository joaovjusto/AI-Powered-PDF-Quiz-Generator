'use client'

import { useQuizStore } from '@/store/quiz'
import { LoadingScreen } from './LoadingScreen'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const isProcessing = useQuizStore((state) => state.isProcessing)

  return (
    <>
      {isProcessing && <LoadingScreen />}
      {children}
    </>
  )
}