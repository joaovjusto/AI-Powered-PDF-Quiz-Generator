'use client'

import { AnimatedChecklist } from './AnimatedChecklist'
import { AnimatedDivider } from './AnimatedDivider'
import { AnimatedLogo } from './AnimatedLogo'
import { AnimationProvider, useAnimation } from '@/contexts/AnimationContext'
import { useBreakpointValue } from '@chakra-ui/react'

function LoadingContent() {
  const { opacity } = useAnimation()
  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="flex flex-col items-center justify-center min-h-screen w-full px-4">
        {/* Cards Container */}
        {isMobile ? (
          // Mobile: Logo without card
          <div 
            className="-mb-8 -mt-20"
            style={{ opacity, transition: 'opacity 1s ease-in-out' }}
          >
            <AnimatedLogo />
          </div>
        ) : (
          // Desktop: Original layout with cards
          <div 
            className="flex items-center mb-8" 
            style={{ opacity, transition: 'opacity 1s ease-in-out' }}
          >
            {/* Loading Icon Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <AnimatedLogo />
            </div>

            {/* Divider Card */}
            <div className="bg-[#D2D1D6] shadow-sm flex items-center justify-center">
              <AnimatedDivider />
            </div>

            {/* Checklist Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <AnimatedChecklist />
            </div>
          </div>
        )}

        {/* Title */}
        <h2 
          className="text-[24px] md:text-[38px] font-semibold mb-2 text-center"
          style={{ color: '#15112B' }}
        >
          Generating Quiz Questions
        </h2>

        {/* Subtitle */}
        <p 
          className="text-[14px] md:text-[18px] font-normal text-center"
          style={{ color: 'rgba(21, 17, 43, 0.6)' }}
        >
          Reading your materials...
        </p>
      </div>
    </div>
  )
}

export function LoadingScreen() {
  return (
    <AnimationProvider>
      <LoadingContent />
    </AnimationProvider>
  )
}