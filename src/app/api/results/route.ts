import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { AnalysisResult } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const candidateId = searchParams.get('id')

    if (!candidateId) {
      return NextResponse.json(
        { error: 'Candidate ID is required' },
        { status: 400 }
      )
    }

    const uploadDir = path.join(process.cwd(), 'uploads')
    const analysisPath = path.join(uploadDir, `${candidateId}_analysis.json`)

    try {
      const analysisJson = await readFile(analysisPath, 'utf-8')
      const analysisResult: AnalysisResult = JSON.parse(analysisJson)

      return NextResponse.json({
        success: true,
        data: analysisResult
      })
    } catch (fileError) {
      console.error('Analysis file not found:', fileError)
      return NextResponse.json(
        { error: 'Analysis results not found. Please ensure the analysis has been completed.' },
        { status: 404 }
      )
    }

  } catch (error) {
    console.error('Results API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle other HTTP methods
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
} 