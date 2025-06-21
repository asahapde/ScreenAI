import Groq from 'groq-sdk'
import { 
  AnalysisResult, 
  CandidateData, 
  OnlinePresence, 
  JobDescription, 
  AnalysisPoint, 
  RedFlag, 
  SkillVerification,
  Evidence
} from '@/types'
import { generateId } from '@/lib/utils'

export class AIAnalyzer {
  private groq: Groq

  constructor() {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY environment variable is required')
    }
    
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    })
  }

  async analyzeCandidate(
    candidateData: CandidateData,
    onlinePresence: OnlinePresence,
    jobDescription: JobDescription,
    onProgress?: (step: string) => void
  ): Promise<AnalysisResult> {
    try {
      onProgress?.('Starting AI analysis...')

      // Use Llama 3.3 70B for comprehensive analysis
      const comprehensiveAnalysis = await this.performComprehensiveAnalysis(
        candidateData, 
        onlinePresence, 
        jobDescription
      )
      
      onProgress?.('Analyzing skill matches...')
      
      // Use Llama 3.1 8B for faster skill verification
      const skillVerification = await this.verifySkills(
        candidateData, 
        onlinePresence, 
        jobDescription
      )
      
      onProgress?.('Identifying potential concerns...')
      
      // Use Llama 3.3 70B for red flag detection
      const redFlags = await this.detectRedFlags(
        candidateData, 
        onlinePresence
      )
      
      onProgress?.('Finalizing analysis...')

      return {
        id: generateId(),
        candidateId: candidateData.id,
        fitScore: comprehensiveAnalysis.fitScore,
        overallConfidence: comprehensiveAnalysis.confidence,
        strengths: comprehensiveAnalysis.strengths,
        gaps: comprehensiveAnalysis.gaps,
        redFlags,
        highlights: comprehensiveAnalysis.highlights || [],
        onlinePresenceScore: comprehensiveAnalysis.onlinePresenceScore || 75,
        skillVerification,
        recommendation: comprehensiveAnalysis.recommendation || 'good_match',
        summary: comprehensiveAnalysis.overallAssessment,
        createdAt: new Date()
      }
    } catch (error) {
      console.error('AI Analysis failed:', error)
      
      // Return fallback analysis with lower confidence
      return this.generateFallbackAnalysis(candidateData, onlinePresence, jobDescription)
    }
  }

  private async performComprehensiveAnalysis(
    candidateData: CandidateData,
    onlinePresence: OnlinePresence,
    jobDescription: JobDescription
  ) {
    const prompt = `
You are an expert HR analyst evaluating a candidate's fit for a specific role. Provide a comprehensive analysis.

CANDIDATE PROFILE:
Name: ${candidateData.resume?.parsed?.name || 'Not specified'}
Email: ${candidateData.resume?.parsed?.email || 'Not specified'}
Experience: ${candidateData.resume?.parsed?.experience?.map(exp => `${exp.position} at ${exp.company} (${exp.duration})`).join('; ') || 'Not specified'}
Education: ${candidateData.resume?.parsed?.education?.map(edu => `${edu.degree} from ${edu.institution}`).join('; ') || 'Not specified'}
Skills: ${candidateData.resume?.parsed?.skills?.join(', ') || 'Not specified'}

ONLINE PRESENCE:
GitHub: ${onlinePresence.github?.profile || 'Not found'}
- Repositories: ${onlinePresence.github?.repositories?.length || 0}
- Languages: ${onlinePresence.github?.languages?.join(', ') || 'None'}

LinkedIn: ${onlinePresence.linkedin?.profile || 'Not found'}
Portfolio: ${onlinePresence.portfolio?.url || 'Not found'}

JOB REQUIREMENTS:
Title: ${jobDescription.title}
Department: ${jobDescription.department}
Level: ${jobDescription.level}
Required Skills: ${jobDescription.requiredSkills?.join(', ') || 'Not specified'}
Preferred Skills: ${jobDescription.preferredSkills?.join(', ') || 'Not specified'}
Experience Required: ${jobDescription.experienceRequired}
Description: ${jobDescription.description}

ANALYSIS REQUIREMENTS:
1. Calculate a fit score (0-100) based on skills match, experience alignment, and role suitability
2. Identify 3-5 key strengths that make this candidate suitable
3. Identify 2-4 potential gaps or areas of concern
4. Provide 2-3 actionable recommendations
5. Assess confidence level (1-5) in your analysis
6. Provide reasoning for the fit score

Respond in JSON format:
{
  "fitScore": number,
  "overallAssessment": "string",
  "strengths": ["string"],
  "gaps": ["string"],
  "recommendations": ["string"],
  "confidence": number,
  "reasoning": "string"
}
`

    const completion = await this.groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert HR analyst with 15+ years of experience in talent assessment and recruitment. Provide detailed, professional analysis."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from Groq API')
    }

    try {
      return JSON.parse(content)
    } catch (parseError) {
      console.error('Failed to parse Groq response:', content)
      throw new Error('Invalid JSON response from AI analysis')
    }
  }

  private async verifySkills(
    candidateData: CandidateData,
    onlinePresence: OnlinePresence,
    jobDescription: JobDescription
  ): Promise<SkillVerification[]> {
    const prompt = `
Analyze the candidate's skills and verify them against job requirements and online evidence.

CANDIDATE SKILLS: ${candidateData.resume?.parsed?.skills?.join(', ') || 'None listed'}
REQUIRED SKILLS: ${jobDescription.requiredSkills?.join(', ') || 'None specified'}
PREFERRED SKILLS: ${jobDescription.preferredSkills?.join(', ') || 'None specified'}

EVIDENCE FROM ONLINE PRESENCE:
- GitHub Languages: ${onlinePresence.github?.languages?.join(', ') || 'None'}
- GitHub Repositories: ${onlinePresence.github?.repositories?.length || 0} repos
- Portfolio Technologies: ${onlinePresence.technologies?.join(', ') || 'None'}

For each skill mentioned in the job requirements, assess:
1. Whether the candidate has demonstrated this skill
2. Level of evidence (1-5 scale)
3. Specific evidence found
4. Verification status (verified/partial/unverified)

Respond in JSON format as an array:
[
  {
    "skill": "string",
    "claimed": boolean,
    "verified": boolean,
    "evidence": ["string"],
    "confidenceLevel": number,
    "notes": "string"
  }
]
`

    const completion = await this.groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a technical recruiter expert at verifying candidate skills through their online presence and stated experience."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return []
    }

    try {
      const response = JSON.parse(content)
      return Array.isArray(response) ? response : response.skills || []
    } catch (parseError) {
      console.error('Failed to parse skill verification response:', content)
      return []
    }
  }

  private async detectRedFlags(
    candidateData: CandidateData,
    onlinePresence: OnlinePresence
  ): Promise<RedFlag[]> {
    const prompt = `
Analyze the candidate profile for potential red flags or concerns that recruiters should be aware of.

CANDIDATE DATA:
- Experience: ${candidateData.resume?.parsed?.experience?.map(exp => `${exp.position} at ${exp.company}`).join('; ') || 'None'}
- Skills: ${candidateData.resume?.parsed?.skills?.join(', ') || 'None'}
- Education: ${candidateData.resume?.parsed?.education?.map(edu => `${edu.degree} from ${edu.institution}`).join('; ') || 'None'}

ONLINE PRESENCE:
- GitHub Activity: ${onlinePresence.github?.repositories?.length || 0} repositories
- Profile Completeness: ${onlinePresence.linkedin?.profile ? 'LinkedIn found' : 'No LinkedIn'}, ${onlinePresence.portfolio?.url ? 'Portfolio found' : 'No portfolio'}

Look for these types of concerns:
1. Inconsistencies between claimed skills and evidence
2. Gaps in employment or education timeline
3. Lack of online presence for technical roles
4. Over-qualification or under-qualification red flags
5. Professional presentation issues

Only flag genuine concerns, not minor issues. Be professional and constructive.

Respond in JSON format as an array:
[
  {
    "type": "string",
    "severity": "low|medium|high",
    "description": "string",
    "evidence": ["string"],
    "recommendations": ["string"]
  }
]
`

    const completion = await this.groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an experienced HR professional focused on identifying genuine concerns while being fair and constructive. Only flag significant issues."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return []
    }

    try {
      const response = JSON.parse(content)
      return Array.isArray(response) ? response : response.redFlags || []
    } catch (parseError) {
      console.error('Failed to parse red flags response:', content)
      return []
    }
  }

  private generateFallbackAnalysis(
    candidateData: CandidateData,
    onlinePresence: OnlinePresence,
    jobDescription: JobDescription
  ): AnalysisResult {
    // Basic skill matching algorithm
    const candidateSkills = candidateData.resume?.parsed?.skills || []
    const requiredSkills = jobDescription.requiredSkills || []
    const preferredSkills = jobDescription.preferredSkills || []
    
    const skillMatches = requiredSkills.filter((skill: string) => 
      candidateSkills.some((candidateSkill: string) => 
        candidateSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(candidateSkill.toLowerCase())
      )
    ).length
    
    const totalRequired = requiredSkills.length || 1
    const baseScore = Math.round((skillMatches / totalRequired) * 100)
    
    // Adjust score based on online presence
    let adjustedScore = baseScore
    if (onlinePresence.github?.repositories && onlinePresence.github.repositories.length > 0) {
      adjustedScore += 10
    }
    if (onlinePresence.linkedin?.profile) {
      adjustedScore += 5
    }
    if (onlinePresence.portfolio?.url) {
      adjustedScore += 10
    }
    
    const fitScore = Math.min(adjustedScore, 100)

    const strengths: AnalysisPoint[] = [
      {
        category: 'Skills',
        description: `Demonstrates ${skillMatches} out of ${totalRequired} required skills`,
        evidence: candidateSkills.slice(0, 3),
        confidence: 70
      },
      {
        category: 'Online Presence',
        description: onlinePresence.github?.repositories?.length ? `Active GitHub presence with ${onlinePresence.github.repositories.length} repositories` : 'Has technical background',
        evidence: onlinePresence.github?.repositories ? [`${onlinePresence.github.repositories.length} repositories`] : [],
        confidence: 60
      }
    ]

    const gaps: AnalysisPoint[] = []
    if (requiredSkills.length - skillMatches > 0) {
      gaps.push({
        category: 'Skills',
        description: `Missing ${requiredSkills.length - skillMatches} required skills`,
        evidence: requiredSkills.filter(skill => !candidateSkills.some(cs => cs.toLowerCase().includes(skill.toLowerCase()))),
        confidence: 80
      })
    }

    return {
      id: generateId(),
      candidateId: candidateData.id,
      fitScore,
      overallConfidence: 70,
      strengths,
      gaps,
      redFlags: [],
      highlights: [
        'Basic skill matching analysis',
        'Limited online presence verification',
        'Automated screening results'
      ],
      onlinePresenceScore: onlinePresence.github?.repositories?.length ? 75 : 50,
      skillVerification: requiredSkills.map((skill: string) => ({
        skill,
        claimed: candidateSkills.some((cs: string) => cs.toLowerCase().includes(skill.toLowerCase())),
        verified: false,
        confidence: 50,
        evidence: []
      })),
      recommendation: fitScore >= 80 ? 'strong_match' : fitScore >= 60 ? 'good_match' : fitScore >= 40 ? 'weak_match' : 'poor_match',
      summary: fitScore >= 80 ? 'Excellent fit - strong alignment with role requirements' :
                        fitScore >= 60 ? 'Good fit - meets most requirements with some development potential' :
                        fitScore >= 40 ? 'Moderate fit - some relevant experience but significant gaps' :
                        'Limited fit - substantial gaps in required qualifications',
      createdAt: new Date()
    }
  }
} 