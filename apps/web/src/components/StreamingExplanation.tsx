'use client'

import { useEffect, useState } from 'react'

interface StreamingExplanationProps {
  correctAnswer: string
}

export function StreamingExplanation({
  correctAnswer,
}: StreamingExplanationProps) {
  const [explanation, setExplanation] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    setExplanation(`The correct answer is "${correctAnswer}". Please make sure to review the material carefully before answering.`)
    setIsLoading(false)
  }, [correctAnswer])

  return (
    <div className="mt-4">
      <div
        style={{
          backgroundColor: '#FF505014',
          border: '1px solid #FF5050',
          borderRadius: '16px',
          padding: '16px',
          width: '100%'
        }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="mr-2 animate-spin">⌛</div>
            <p
              style={{
                fontSize: '16px',
                color: '#FF5050',
                fontWeight: 500,
                fontFamily: 'var(--font-inter)'
              }}
            >
              Generating explanation...
            </p>
          </div>
        ) : (
          <p
            style={{
              fontSize: '16px',
              color: '#3E3C46',
              fontWeight: 500,
              fontFamily: 'var(--font-inter)',
              whiteSpace: 'pre-wrap'
            }}
          >
            {explanation}
          </p>
        )}
      </div>
    </div>
  )
}