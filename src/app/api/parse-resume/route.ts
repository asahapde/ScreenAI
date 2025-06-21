import { NextRequest, NextResponse } from 'next/server'
import { ResumeParser } from '@/lib/services/resume-parser'
import { ParsedResume } from '@/types'

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

    console.log(`Processing file: ${file.name} (${file.size} bytes)`)

    // Convert File to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Parse the resume with AI enhancement
    const parser = new ResumeParser()
    const parsedResume = await parser.parseFile(buffer, file.name)
    
    console.log('Parsing completed:', {
      name: parsedResume.name || 'Not found',
      email: parsedResume.email || 'Not found',
      socialLinksFound: Object.keys(parsedResume.socialLinks || {}).length,
      skillsFound: parsedResume.skills?.length || 0,
      experienceFound: parsedResume.experience?.length || 0
    })
    
    return NextResponse.json(parsedResume)
  } catch (error) {
    console.error('Resume parsing error:', error)
    return NextResponse.json(
      { error: 'Failed to parse resume' },
      { status: 500 }
    )
  }
} 