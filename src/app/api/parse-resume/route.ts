import { NextRequest, NextResponse } from 'next/server'
import formidable from 'formidable'
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

    // Convert File to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Parse the resume
    const parser = new ResumeParser()
    const parsedResume = await parser.parseFile(buffer, file.name)
    
    // The parser already extracts social links, so we can return it directly
    // If social links are empty, we can try additional extraction as fallback
    if (!parsedResume.socialLinks?.linkedin && !parsedResume.socialLinks?.github && !parsedResume.socialLinks?.portfolio) {
      const enhancedResume = await enhanceWithSocialLinks(parsedResume)
      return NextResponse.json(enhancedResume)
    }
    
    return NextResponse.json(parsedResume)
  } catch (error) {
    console.error('Resume parsing error:', error)
    return NextResponse.json(
      { error: 'Failed to parse resume' },
      { status: 500 }
    )
  }
}

async function enhanceWithSocialLinks(parsedResume: ParsedResume): Promise<ParsedResume> {
  // Extract social media URLs from resume text
  const fullText = `${parsedResume.summary} ${parsedResume.experience.map(e => e.description).join(' ')} ${parsedResume.email}`
  
  const socialLinks = {
    linkedin: extractLinkedInUrl(fullText),
    github: extractGitHubUrl(fullText),
    portfolio: extractPortfolioUrl(fullText)
  }
  
  return {
    ...parsedResume,
    socialLinks
  }
}

function extractLinkedInUrl(text: string): string {
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?/gi
  const matches = text.match(linkedinRegex)
  return matches ? matches[0] : ''
}

function extractGitHubUrl(text: string): string {
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9-]+\/?/gi
  const matches = text.match(githubRegex)
  return matches ? matches[0] : ''
}

function extractPortfolioUrl(text: string): string {
  // Look for common portfolio patterns
  const portfolioRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.(?:com|net|org|io|dev|me|portfolio)(?:\/[^\s]*)?/gi
  const matches = text.match(portfolioRegex)
  
  if (matches) {
    // Filter out common non-portfolio domains
    const filtered = matches.filter(url => 
      !url.includes('linkedin.com') && 
      !url.includes('github.com') && 
      !url.includes('gmail.com') &&
      !url.includes('outlook.com') &&
      !url.includes('yahoo.com')
    )
    return filtered[0] || ''
  }
  
  return ''
} 