import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/providers'
import { LayoutWrapper } from '@/components/LayoutWrapper'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'PDF Quiz Generator',
  description: 'Generate quizzes from PDF documents using AI',
  icons: {
    icon: '/logo.svg'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body>
        <Providers>
          <main className="min-h-screen sm:flex sm:items-center pt-8 sm:pt-0" style={{ backgroundColor: '#F8F8F9' }}>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </main>
        </Providers>
      </body>
    </html>
  )
}