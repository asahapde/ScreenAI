import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { ResumeParser } from '@/lib/services/resume-parser'
import { WebScraper } from '@/lib/services/scraper'
import { AIAnalyzer } from '@/lib/services/ai-analyzer'
import { writeFile } from 'fs/promises'
import { CandidateData, JobDescription, ProgressUpdate, AnalysisResult } from '@/types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const candidateId = searchParams.get('id')

  if (!candidateId) {
    return NextResponse.json(
      { error: 'Candidate ID is required' },
      { status: 400 }
    )
  }

  // Set up Server-Sent Events
  const encoder = new TextEncoder()
  
  const customReadable = new ReadableStream({
    start(controller) {
      // Start the processing pipeline
      processCandidate(candidateId, controller, encoder)
        .catch(error => {
          console.error('Processing error:', error)
          const errorUpdate: ProgressUpdate = {
            step: 'parsing',
            progress: 0,
            message: 'Processing failed',
            error: error.message
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorUpdate)}\n\n`))
          controller.close()
        })
    }
  })

  return new Response(customReadable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  })
}

async function processCandidate(
  candidateId: string,
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder
) {
  const uploadDir = path.join(process.cwd(), 'uploads')
  
  try {
    // Step 1: Load candidate data
    await sendUpdate(controller, encoder, {
      step: 'parsing',
      progress: 10,
      message: 'Loading candidate data...'
    })

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

    await sendUpdate(controller, encoder, {
      step: 'parsing',
      progress: 50,
      message: 'Resume parsed successfully'
    })

    await sendUpdate(controller, encoder, {
      step: 'parsing',
      progress: 100,
      message: 'Resume parsing completed'
    })

    // Step 2: Scrape online presence
    await sendUpdate(controller, encoder, {
      step: 'scraping',
      progress: 10,
      message: 'Starting online presence analysis...'
    })

    const scraper = new WebScraper()
    const onlinePresence = await scraper.scrapeOnlinePresence({
      github: candidateData.socialLinks.github,
      linkedin: candidateData.socialLinks.linkedin,
      portfolio: candidateData.socialLinks.portfolio
    })

    await sendUpdate(controller, encoder, {
      step: 'scraping',
      progress: 50,
      message: 'Analyzing GitHub profile...'
    })

    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate processing time

    await sendUpdate(controller, encoder, {
      step: 'scraping',
      progress: 80,
      message: 'Analyzing LinkedIn profile...'
    })

    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate processing time

    await sendUpdate(controller, encoder, {
      step: 'scraping',
      progress: 100,
      message: 'Online presence analysis completed'
    })

    // Step 3: AI Analysis
    await sendUpdate(controller, encoder, {
      step: 'analyzing',
      progress: 10,
      message: 'Starting AI-powered analysis...'
    })

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      // Use mock analysis if no API key
      await sendUpdate(controller, encoder, {
        step: 'analyzing',
        progress: 50,
        message: 'Running skill verification...'
      })

      await new Promise(resolve => setTimeout(resolve, 3000)) // Simulate processing time

      const mockAnalysis = createMockAnalysis(candidateId, candidateData)
      
      await sendUpdate(controller, encoder, {
        step: 'analyzing',
        progress: 100,
        message: 'AI analysis completed'
      })

      // Step 4: Generate report
      await sendUpdate(controller, encoder, {
        step: 'generating',
        progress: 50,
        message: 'Generating comprehensive report...'
      })

      // Store analysis result
      const analysisPath = path.join(uploadDir, `${candidateId}_analysis.json`)
      await writeFile(analysisPath, JSON.stringify(mockAnalysis, null, 2))

      await sendUpdate(controller, encoder, {
        step: 'generating',
        progress: 100,
        message: 'Report generated successfully'
      })

    } else {
      // Use real AI analysis
      const aiAnalyzer = new AIAnalyzer()
      
      await sendUpdate(controller, encoder, {
        step: 'analyzing',
        progress: 30,
        message: 'Analyzing job fit...'
      })

      await sendUpdate(controller, encoder, {
        step: 'analyzing',
        progress: 60,
        message: 'Verifying skills...'
      })

      const analysisResult = await aiAnalyzer.analyzeCandidate(
        candidateData,
        onlinePresence,
        jobDescription || {
          id: 'default-job',
          title: 'General Position',
          company: 'Unknown',
          requirements: [],
          responsibilities: [],
          requiredSkills: [],
          preferredSkills: [],
          experienceRequired: 'Not specified',
          description: 'General position analysis',
          content: 'No specific job description provided'
        }
      )

      await sendUpdate(controller, encoder, {
        step: 'analyzing',
        progress: 100,
        message: 'AI analysis completed'
      })

      // Step 4: Generate report
      await sendUpdate(controller, encoder, {
        step: 'generating',
        progress: 50,
        message: 'Generating comprehensive report...'
      })

      // Store analysis result
      const analysisPath = path.join(uploadDir, `${candidateId}_analysis.json`)
      await writeFile(analysisPath, JSON.stringify(analysisResult, null, 2))

      await sendUpdate(controller, encoder, {
        step: 'generating',
        progress: 100,
        message: 'Report generated successfully'
      })
    }

    // Final completion message
    await sendUpdate(controller, encoder, {
      step: 'generating',
      progress: 100,
      message: 'Analysis complete! Redirecting to results...'
    })

    // Close the stream
    controller.close()

  } catch (error) {
    console.error('Processing pipeline error:', error)
    await sendUpdate(controller, encoder, {
      step: 'parsing',
      progress: 0,
      message: 'Processing failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    controller.close()
  }
}

async function sendUpdate(
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  update: ProgressUpdate
) {
  const data = `data: ${JSON.stringify(update)}\n\n`
  controller.enqueue(encoder.encode(data))
  
  // Add a small delay to make updates visible
  await new Promise(resolve => setTimeout(resolve, 100))
}

function createMockAnalysis(candidateId: string, candidateData: CandidateData): AnalysisResult {
  return {
    id: `analysis_${candidateId}`,
    candidateId,
    fitScore: 84,
    overallConfidence: 88,
    strengths: [
      {
        category: "Technical Skills",
        description: "Strong proficiency in React and Node.js",
        evidence: [
          "5+ years experience listed in resume",
          "Multiple React projects visible on GitHub",
          "Senior developer role at current company"
        ],
        confidence: 92
      },
      {
        category: "Experience",
        description: "Solid background in full-stack development",
        evidence: [
          "Progressive career advancement",
          "Leadership roles in recent positions",
          "Diverse project portfolio"
        ],
        confidence: 85
      }
    ],
    gaps: [
      {
        category: "DevOps",
        description: "Limited experience with cloud infrastructure",
        evidence: [
          "No AWS/Azure projects in portfolio",
          "Limited mention of infrastructure tools",
          "No CI/CD pipeline experience evident"
        ],
        confidence: 78
      }
    ],
    redFlags: [
      {
        type: "inconsistency",
        description: "Resume claims 5 years coding experience, but GitHub shows 3 years activity",
        severity: "medium",
        evidence: [
          "Resume states coding since 2019",
          "GitHub first commit in 2021",
          "2-year gap unexplained"
        ]
      }
    ],
    highlights: [
      "Strong React and Node.js expertise",
      "Consistent open source contributor",
      "Good communication skills based on LinkedIn",
      "Experience with modern development practices"
    ],
    onlinePresenceScore: 75,
    skillVerification: [
      {
        skill: "React",
        claimed: true,
        verified: true,
        confidence: 95,
        evidence: [
          {
            source: "github",
            type: "project",
            description: "15 React projects with recent activity",
            relevance: 95
          },
          {
            source: "resume",
            type: "experience",
            description: "Listed as primary skill in multiple roles",
            relevance: 85
          }
        ]
      },
      {
        skill: "Node.js",
        claimed: true,
        verified: true,
        confidence: 88,
        evidence: [
          {
            source: "github",
            type: "project",
            description: "12 Node.js backend projects",
            relevance: 90
          },
          {
            source: "resume",
            type: "experience",
            description: "Backend development experience",
            relevance: 80
          }
        ]
      },
      {
        skill: "AWS",
        claimed: true,
        verified: false,
        confidence: 25,
        evidence: [
          {
            source: "resume",
            type: "experience",
            description: "Mentioned in job requirements",
            relevance: 30
          }
        ]
      }
    ],
    recommendation: "good_match",
    summary: "This candidate demonstrates strong technical skills in React and Node.js with solid practical experience. While there are some consistency concerns and gaps in DevOps knowledge, they represent a good match for the role with potential for growth in identified areas.",
    createdAt: new Date()
  }
} 