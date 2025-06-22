import { NextRequest, NextResponse } from 'next/server'
import { ResumeParser } from '@/lib/services/resume-parser'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Parse resume
    const resumeParser = new ResumeParser()
    const parsedResume = await resumeParser.parseFile(buffer, file.name)

    return NextResponse.json({
      success: true,
      parsed: parsedResume
    })

  } catch (error) {
    console.error('Parse resume error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to parse resume',
        details: error instanceof Error ? error.message : 'Unknown parsing error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
} 