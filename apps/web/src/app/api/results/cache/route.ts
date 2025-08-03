import { NextRequest, NextResponse } from 'next/server'
import { deleteQuizCache } from '@/services/quizService'
import { config } from '@/config/env'

const API_URL = config.apiUrl

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, ...data } = body

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    // Save results to FastAPI cache
    const response = await fetch(`${API_URL}/cache/results/${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to save result cache')
    }

    // Delete quiz cache after saving results
    await deleteQuizCache(sessionId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save result cache:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    // Get results from FastAPI cache
    const response = await fetch(`${API_URL}/cache/results/${sessionId}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Cache not found' }, { status: 404 })
      }
      throw new Error('Failed to get result cache')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to get result cache:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    // Delete results from FastAPI cache
    const response = await fetch(`${API_URL}/cache/results/${sessionId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete result cache')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete result cache:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}