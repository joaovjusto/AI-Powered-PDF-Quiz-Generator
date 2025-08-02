import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/providers'
import { LayoutWrapper } from '@/components/LayoutWrapper'
import { PageTransition } from '@/components/PageTransition'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Unstuck',
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
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
          <main style={{ backgroundColor: '#F8F8F9' }}>
            <LayoutWrapper>
              <PageTransition>
                {children}
              </PageTransition>
            </LayoutWrapper>
          </main>
        </Providers>
      </body>
    </html>
  )
}