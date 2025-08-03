import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory cache using Map
const resultsCache = new Map<string, any>()

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params
    const data = await request.json()

    // Store the results in memory
    resultsCache.set(sessionId, data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving result cache:', error)
    return NextResponse.json(
      { error: 'Failed to save result cache' },
      { status: 500 }
    )
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params

    // Get the results from memory
    const data = resultsCache.get(sessionId)

    if (!data) {
      return NextResponse.json(null, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error getting result cache:', error)
    return NextResponse.json(
      { error: 'Failed to get result cache' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params

    // Delete the results from memory
    resultsCache.delete(sessionId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting result cache:', error)
    return NextResponse.json(
      { error: 'Failed to delete result cache' },
      { status: 500 }
    )
  }
}