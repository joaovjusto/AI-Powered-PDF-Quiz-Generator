'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { useQuizStore } from '@/store/quiz'
import { useQuiz } from '@/hooks/useQuiz'

export function FileUpload() {
  const { generateQuiz } = useQuiz()
  const isProcessing = useQuizStore((state) => state.isProcessing)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type === 'application/pdf') {
      generateQuiz(file)
    }
  }, [generateQuiz])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: isProcessing
  })

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 sm:mt-8 bg-white rounded-2xl p-3 shadow-sm">
      <div
        {...getRootProps()}
        className={`
          w-full p-4 sm:p-8
          rounded-lg
          transition-colors duration-200 ease-in-out
          ${isDragActive ? 'border-purple-500 bg-purple-50' : ''}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-purple-500'}
        `}
        style={{
          border: 'none',
          borderRadius: '8px',
          background: `
            repeating-linear-gradient(to right, ${isDragActive ? '#6D56FA' : '#4141411F'} 0, ${isDragActive ? '#6D56FA' : '#4141411F'} 8px, transparent 8px 14px) top / 100% 2px,
            repeating-linear-gradient(to right, ${isDragActive ? '#6D56FA' : '#4141411F'} 0, ${isDragActive ? '#6D56FA' : '#4141411F'} 8px, transparent 8px 14px) bottom / 100% 2px,
            repeating-linear-gradient(to bottom, ${isDragActive ? '#6D56FA' : '#4141411F'} 0, ${isDragActive ? '#6D56FA' : '#4141411F'} 8px, transparent 8px 14px) left / 2px 100%,
            repeating-linear-gradient(to bottom, ${isDragActive ? '#6D56FA' : '#4141411F'} 0, ${isDragActive ? '#6D56FA' : '#4141411F'} 8px, transparent 8px 14px) right / 2px 100%
          `,
          backgroundRepeat: 'no-repeat'
        }}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="p-2 sm:p-4 pb-0">
            <Image
              src="/upload-image.svg"
              alt="Upload PDF"
              width={48}
              height={48}
              className="w-12 h-12 sm:w-16 sm:h-16"
            />
          </div>
          <div className="space-y-2">
            <p className="text-[20px] font-sans">
              <span className="font-bold" style={{ color: '#6D56FA' }}>Click to upload</span> <span style={{ color: '#15112B80' }}>or drag and drop</span>
            </p>
            <p className="text-[16px] font-sans" style={{ color: '#15112B80' }}>
              Upload your materials and start generating - for <span className="font-bold">FREE</span>
            </p>
          </div>
        </div>
      </div>
      {isProcessing && (
        <div className="mt-6 text-center">
          <p className="text-[16px] font-medium" style={{ color: '#6D56FA' }}>
            Processing your document...
          </p>
          <p className="text-[14px] mt-2" style={{ color: '#15112B80' }}>
            This may take a few seconds
          </p>
        </div>
      )}
    </div>
  )
}