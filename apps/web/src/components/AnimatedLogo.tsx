'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useAnimation } from '@/contexts/AnimationContext'

export function AnimatedLogo() {
  const [gradientPosition, setGradientPosition] = useState(-20)
  const { currentStage, setCurrentStage } = useAnimation()
  const isActive = currentStage === 'logo'

  // Reset position when stage changes to logo
  useEffect(() => {
    if (currentStage === 'logo') {
      setGradientPosition(-20)
    }
  }, [currentStage])

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setGradientPosition((prev) => {
        if (prev >= 120) {
          setTimeout(() => setCurrentStage('divider'), 0)
          return 120
        }
        return prev + 1
      })
    }, 20)

    return () => clearInterval(interval)
  }, [isActive, setCurrentStage])

  return (
    <div
      style={{
        position: 'relative',
        width: '130px',
        height: '135px',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          top: 'calc(50% - 40px)',
          left: 0,
          width: '100%',
          height: '100%',
          background: `linear-gradient(90deg, 
            #d4d4d4 ${Math.max(0, gradientPosition - 20)}%,
            rgba(109, 86, 250, 0.3) ${Math.max(0, gradientPosition - 10)}%,
            rgba(109, 86, 250, 0.7) ${gradientPosition - 5}%,
            #6D56FA ${gradientPosition}%,
            #6D56FA 100%
          )`,
          transition: 'background 0.2s ease-in-out',
          WebkitMaskImage: 'url(/animated-icon.svg)',
          maskImage: 'url(/animated-icon.svg)',
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
        }}
      />
    </div>
  )
}