import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
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

    return NextResponse.json({
      response: response.replace(/CREATE_JOB:[\s\S]*$/, '').trim(),
      jobData,
      timestamp: new Date()
    })

  } catch (error) {
    console.error('Job creation error:', error)
    return NextResponse.json(
      { error: 'Failed to process job creation request' },
      { status: 500 }
    )
  }
} 