'use client'

import { FileUpload } from '@/components/FileUpload'
import { Logo } from '@/components/Logo'

export default function Home() {
  return (
    <div className="w-full">
      <div className="max-w-[280px] sm:max-w-xl mx-auto px-4">
        <div className="flex flex-col items-center">
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
      </div>
    </div>
  )
}