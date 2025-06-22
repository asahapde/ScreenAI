import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { ResumeParser } from '@/lib/services/resume-parser'
import { generateId } from '@/lib/utils'
import { CandidateData, ResumeData, SocialLinks } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('resume') as File
    const candidateDataString = formData.get('candidateData') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No resume file provided' },
        { status: 400 }
      )
    }

    // Make candidateData optional for simple uploads
    let candidateData: any = {}
    if (candidateDataString) {
      try {
        candidateData = JSON.parse(candidateDataString)
      } catch (error) {
        console.error('Failed to parse candidate data:', error)
        // Continue with empty candidateData rather than failing
      }
    }

    // Enhanced file type validation - be more permissive for testing
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain', // Allow text files for testing
      'application/octet-stream' // Sometimes files come through as this
    ]

    // Also check file extension as backup
    const fileName = file.name.toLowerCase()
    const hasValidExtension = fileName.endsWith('.pdf') || 
                              fileName.endsWith('.doc') || 
                              fileName.endsWith('.docx') ||
                              fileName.endsWith('.txt')

    if (!allowedTypes.includes(file.type) && !hasValidExtension) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Please upload a PDF, Word document, or text file.` },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Create candidate ID - check if this is Abdullah's resume
    let candidateId = generateId()
    const isAbdullahResume = fileName.includes('abdullah') || 
                           fileName.includes('sahapde') || 
                           fileName.includes('asahapde')
    
    if (isAbdullahResume) {
      candidateId = 'abdullah' // Use consistent ID for Abdullah
    }
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'uploads')
    await mkdir(uploadDir, { recursive: true })

    // Save file
    const filename = `${candidateId}_${file.name}`
    const filepath = path.join(uploadDir, filename)
    await writeFile(filepath, buffer)

    try {
      // Parse resume
      const resumeParser = new ResumeParser()
      const parsedResume = await resumeParser.parseFile(buffer, file.name)

      // Create resume data
      const resumeData: ResumeData = {
        filename: file.name,
        content: buffer.toString('base64'), // Store as base64 for simplicity
        parsed: parsedResume
      }

      // Create complete candidate data
      const completeCandidate: CandidateData = {
        id: candidateId,
        resume: resumeData,
        socialLinks: candidateData.socialLinks || parsedResume.socialLinks || {},
        extraContext: candidateData.extraContext,
        createdAt: new Date()
      }

      // Store candidate data
      const candidateDataPath = path.join(uploadDir, `${candidateId}_data.json`)
      await writeFile(candidateDataPath, JSON.stringify(completeCandidate, null, 2))

      // Store job description if provided
      if (candidateData.jobDescription) {
        const jobDataPath = path.join(uploadDir, `${candidateId}_job.json`)
        await writeFile(jobDataPath, JSON.stringify(candidateData.jobDescription, null, 2))
      }

      return NextResponse.json({
        success: true,
        candidateId,
        message: 'Resume uploaded and parsed successfully',
        candidateName: parsedResume.name || 'Unknown Candidate',
        isAbdullah: isAbdullahResume
      })

    } catch (parseError) {
      console.error('Resume parsing error:', parseError)
      return NextResponse.json(
        { 
          error: 'Failed to parse resume. Please ensure the file is not corrupted.',
          details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handle other HTTP methods
export async function GET() {
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