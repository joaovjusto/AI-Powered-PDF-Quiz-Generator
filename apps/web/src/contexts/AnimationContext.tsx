'use client'

import { createContext, useContext, useState } from 'react'
import { useBreakpointValue } from '@chakra-ui/react'

type AnimationStage = 'logo' | 'divider' | 'checklist'

interface AnimationContextType {
  currentStage: AnimationStage
  opacity: number
  setCurrentStage: (stage: AnimationStage) => void
  setOpacity: (opacity: number) => void
  isMobile: boolean
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined)

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [currentStage, setCurrentStage] = useState<AnimationStage>('logo')
  const [opacity, setOpacity] = useState(1)
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? false

  return (
    <AnimationContext.Provider value={{ 
      currentStage, 
      setCurrentStage,
      opacity,
      setOpacity,
      isMobile
    }}>
      {children}
    </AnimationContext.Provider>
  )
}

export function useAnimation() {
  const context = useContext(AnimationContext)
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider')
  }
  return context
}