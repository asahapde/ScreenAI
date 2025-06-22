'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { writeFile, mkdir, readFile } from 'fs/promises'
import path from 'path'
import { ResumeParser } from '@/lib/services/resume-parser'
import { WebScraper } from '@/lib/services/scraper'
import { AIAnalyzer } from '@/lib/services/ai-analyzer'
import { generateId } from '@/lib/utils'
import { CandidateData, JobDescription, AnalysisResult, ParsedResume } from '@/types'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// Parse Resume Server Action
export async function parseResumeAction(formData: FormData) {
  try {
    const file = formData.get('file') as File
    
    if (!file) {
      return { error: 'No file provided', success: false }
    }

    console.log(`Processing file: ${file.name} (${file.size} bytes)`)

    // Convert File to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Parse the resume with enhanced functionality
    const parser = new ResumeParser()
    const parsedResume = await parser.parseFile(buffer, file.name)
    
    console.log('Parsing completed:', {
      name: parsedResume.name || 'Not found',
      email: parsedResume.email || 'Not found',
      socialLinksFound: Object.keys(parsedResume.socialLinks || {}).length,
      skillsFound: parsedResume.skills?.length || 0,
      experienceFound: parsedResume.experience?.length || 0
    })
    
    return { data: parsedResume, success: true }
  } catch (error) {
    console.error('Resume parsing error:', error)
    return { error: 'Failed to parse resume', success: false }
  }
}

// Upload Resume Server Action
export async function uploadResumeAction(formData: FormData) {
  try {
    const file = formData.get('resume') as File
    const candidateDataString = formData.get('candidateData') as string

    if (!file) {
      return { error: 'No resume file provided', success: false }
    }

    if (!candidateDataString) {
      return { error: 'No candidate data provided', success: false }
    }

    // Parse candidate data
    let candidateData: any
    try {
      candidateData = JSON.parse(candidateDataString)
    } catch (error) {
      return { error: 'Invalid candidate data format', success: false }
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (!allowedTypes.includes(file.type)) {
      return { error: 'Invalid file type. Please upload a PDF or Word document.', success: false }
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return { error: 'File size too large. Maximum size is 10MB.', success: false }
    }

    // Create candidate ID
    const candidateId = generateId()
    
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
      // Parse resume with enhanced extraction
      const resumeParser = new ResumeParser()
      const parsedResume = await resumeParser.parseFile(buffer, file.name)

      // Create complete candidate data
      const completeCandidate: CandidateData = {
        id: candidateId,
        resume: {
          filename: file.name,
          content: buffer.toString('base64'),
          parsed: parsedResume
        },
        socialLinks: candidateData.socialLinks || {},
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

      return { 
        success: true, 
        candidateId, 
        message: 'Resume uploaded and parsed successfully',
        parsedData: parsedResume
      }

    } catch (parseError) {
      console.error('Resume parsing error:', parseError)
      return { error: 'Failed to parse resume. Please ensure the file is not corrupted.', success: false }
    }

  } catch (error) {
    console.error('Upload error:', error)
    return { error: 'Internal server error', success: false }
  }
}

// Process Candidate Server Action
export async function processCandidateAction(candidateId: string) {
  const uploadDir = path.join(process.cwd(), 'uploads')
  
  try {
    // Load candidate data
    const candidateDataPath = path.join(uploadDir, `${candidateId}_data.json`)
    const candidateDataJson = await readFile(candidateDataPath, 'utf-8')
    const candidateData: CandidateData = JSON.parse(candidateDataJson)

    // Load job description if exists
    let jobDescription: JobDescription | undefined
    try {
      const jobDataPath = path.join(uploadDir, `${candidateId}_job.json`)
      const jobDataJson = await readFile(jobDataPath, 'utf-8')
      jobDescription = JSON.parse(jobDataJson)
    } catch (error) {
      // Job description is optional
    }

    // Scrape online presence
    const scraper = new WebScraper()
    const onlinePresence = await scraper.scrapeOnlinePresence({
      github: candidateData.socialLinks.github,
      linkedin: candidateData.socialLinks.linkedin,
      portfolio: candidateData.socialLinks.portfolio
    })

    // AI Analysis
    let analysisResult: AnalysisResult

    if (process.env.GROQ_API_KEY) {
      const aiAnalyzer = new AIAnalyzer()
      
      // Convert candidateData to ParsedResume format for the new analyzer
      const resumeData = {
        name: candidateData.resume?.parsed?.name,
        email: candidateData.resume?.parsed?.email,
        phone: candidateData.resume?.parsed?.phone,
        summary: candidateData.resume?.parsed?.summary,
        skills: candidateData.resume?.parsed?.skills || [],
        experience: candidateData.resume?.parsed?.experience || [],
        education: candidateData.resume?.parsed?.education || [],
        socialLinks: candidateData.socialLinks
      }
      
      analysisResult = await aiAnalyzer.analyzeCandidate(resumeData)
    } else {
      // Create mock analysis
      analysisResult = {
        id: generateId(),
        candidateId,
        fitScore: 85,
        overallConfidence: 4,
        strengths: [
          {
            category: 'Technical Skills',
            description: 'Strong technical background',
            evidence: candidateData.resume?.parsed?.skills || [],
            confidence: 4
          }
        ],
        gaps: [
          {
            category: 'Experience',
            description: 'Limited relevant experience',
            evidence: [],
            confidence: 3
          }
        ],
        redFlags: [],
        highlights: ['Strong technical skills', 'Good educational background'],
        onlinePresenceScore: 75,
        skillVerification: [],
        recommendation: 'good_match',
        summary: 'Candidate shows promising technical skills and educational background.',
        createdAt: new Date()
      }
    }

    // Store analysis result
    const analysisPath = path.join(uploadDir, `${candidateId}_analysis.json`)
    await writeFile(analysisPath, JSON.stringify(analysisResult, null, 2))

    return { success: true, data: analysisResult }

  } catch (error) {
    console.error('Processing error:', error)
    return { error: 'Failed to process candidate', success: false }
  }
}

// Get Analysis Results Server Action
export async function getAnalysisResultsAction(candidateId: string) {
  try {
    const uploadDir = path.join(process.cwd(), 'uploads')
    const analysisPath = path.join(uploadDir, `${candidateId}_analysis.json`)

    const analysisJson = await readFile(analysisPath, 'utf-8')
    const analysisResult: AnalysisResult = JSON.parse(analysisJson)

    return { success: true, data: analysisResult }
  } catch (error) {
    console.error('Results retrieval error:', error)
    return { error: 'Analysis results not found. Please ensure the analysis has been completed.', success: false }
  }
}

// Create Job Server Action
export async function createJobChatAction(message: string, conversationHistory: any[] = []) {
  try {
    if (!message) {
      return { error: 'Message is required', success: false }
    }

    if (!process.env.GROQ_API_KEY) {
      return { error: 'GROQ API key not configured', success: false }
    }

    // Build conversation context
    const messages = [
      {
        role: 'system' as const,
        content: `You are a professional HR assistant helping to create job postings. You should:
1. Ask clarifying questions to gather all necessary information
2. Create comprehensive, professional job descriptions
3. Suggest appropriate requirements, benefits, and salary ranges
4. Maintain a conversational, helpful tone
5. When you have enough information, provide a complete job posting in JSON format

Always respond conversationally first, then if ready to create the job, end with:
CREATE_JOB: {json object with title, description, company, location, salary, requirements, benefits}`
      },
      ...conversationHistory,
      {
        role: 'user' as const,
        content: message
      }
    ]

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    })

    const response = completion.choices[0]?.message?.content || ''

    // Check if the AI is ready to create a job
    let jobData = null
    if (response.includes('CREATE_JOB:')) {
      try {
        const jsonStart = response.indexOf('CREATE_JOB:') + 11
        const jsonStr = response.substring(jsonStart).trim()
        jobData = JSON.parse(jsonStr)
        
        // Add generated fields
        jobData.id = `job_${Date.now()}`
        jobData.createdAt = new Date()
        jobData.status = 'active'
        jobData.applicantCount = 0
      } catch (error) {
        console.error('Failed to parse job data:', error)
      }
    }

    return {
      success: true,
      response: response.replace(/CREATE_JOB:[\s\S]*$/, '').trim(),
      jobData,
      timestamp: new Date()
    }

  } catch (error) {
    console.error('Job creation error:', error)
    return { error: 'Failed to process job creation request', success: false }
  }
} 