import { NextRequest, NextResponse } from 'next/server'

// Simula um cache em memória (em produção, usar Redis ou similar)
const quizCache = new Map<string, {
  questions: any[],
  metadata: any,
  timestamp: number
}>()

const CACHE_EXPIRY = 2 * 60 * 60 * 1000 // 2 hours in milliseconds

function cleanExpiredCache() {
  const now = Date.now()
  Array.from(quizCache.entries()).forEach(([key, value]) => {
    if (now - value.timestamp > CACHE_EXPIRY) {
      quizCache.delete(key)
    }
  })
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const sessionToken = searchParams.get('sessionToken')

  if (!sessionToken) {
    return NextResponse.json({ error: 'Session token is required' }, { status: 400 })
  }

  cleanExpiredCache()

  const cachedData = quizCache.get(sessionToken)
  if (!cachedData) {
    return NextResponse.json({ error: 'No cached quiz found' }, { status: 404 })
  }

  return NextResponse.json({
    questions: cachedData.questions,
    metadata: cachedData.metadata
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { sessionToken, questions, metadata } = body

  if (!sessionToken || !questions || !metadata) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  cleanExpiredCache()

  quizCache.set(sessionToken, {
    questions,
    metadata,
    timestamp: Date.now()
  })

  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const sessionToken = searchParams.get('sessionToken')

  if (!sessionToken) {
    return NextResponse.json({ error: 'Session token is required' }, { status: 400 })
  }

  quizCache.delete(sessionToken)
  return NextResponse.json({ success: true })
}