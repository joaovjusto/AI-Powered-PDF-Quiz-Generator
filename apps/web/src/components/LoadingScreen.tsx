'use client'

import { AnimatedChecklist } from './AnimatedChecklist'
import { AnimatedDivider } from './AnimatedDivider'
import { AnimatedLogo } from './AnimatedLogo'
import { AnimationProvider, useAnimation } from '@/contexts/AnimationContext'

function LoadingContent() {
  const { opacity } = useAnimation()

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        {/* Cards Container */}
        <div className="flex items-center mb-8" style={{ opacity, transition: 'opacity 1s ease-in-out' }}>
          {/* Loading Icon Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <AnimatedLogo />
          </div>

          {/* Divider Card */}
          <div className="bg-[#D2D1D6] shadow-sm flex items-center justify-cente">
            <AnimatedDivider />
          </div>

          {/* Checklist Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <AnimatedChecklist />
          </div>
        </div>

        {/* Title */}
        <h2 
          className="text-[38px] font-semibold mb-2"
          style={{ color: '#15112B' }}
        >
          Generating Quiz Questions
        </h2>

        {/* Subtitle */}
        <p 
          className="text-[18px] font-normal"
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