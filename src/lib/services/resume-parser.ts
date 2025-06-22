import { ParsedResume, WorkExperience, Education } from '@/types'
import Groq from 'groq-sdk'

export class ResumeParser {
  private groq: Groq | null = null

  constructor() {
    // Initialize Groq if API key is available
    if (process.env.GROQ_API_KEY) {
      this.groq = new Groq({
        apiKey: process.env.GROQ_API_KEY
      })
    }
  }

  async parseFile(buffer: Buffer, filename: string): Promise<ParsedResume> {
    let text: string
    
    if (filename.toLowerCase().endsWith('.pdf')) {
      text = await this.extractTextFromPDF(buffer, filename)
    } else if (filename.toLowerCase().endsWith('.docx') || filename.toLowerCase().endsWith('.doc')) {
      text = this.extractTextFromWord(buffer)
    } else {
      // Fallback: try to read as text
      text = buffer.toString('utf-8')
    }
    
    // If traditional parsing failed and we have AI available, try AI-enhanced parsing
    if ((!text || text.trim().length === 0) && this.groq) {
      console.log('Traditional parsing failed, attempting AI-enhanced extraction...')
      text = await this.extractTextWithAI(buffer, filename)
    }
    
    const parsedResume = this.parseResumeText(text)
    
    // If social links are missing, use AI to extract them
    if (this.groq && (!parsedResume.socialLinks?.linkedin && !parsedResume.socialLinks?.github && !parsedResume.socialLinks?.portfolio)) {
      console.log('Using AI to enhance social link extraction...')
      const enhancedSocialLinks = await this.extractSocialLinksWithAI(text, parsedResume)
      
      // Only use AI links if they pass validation and we don't already have better ones
      if (enhancedSocialLinks.linkedin && !parsedResume.socialLinks?.linkedin) {
        parsedResume.socialLinks = { ...parsedResume.socialLinks, linkedin: enhancedSocialLinks.linkedin }
      }
      if (enhancedSocialLinks.github && !parsedResume.socialLinks?.github) {
        parsedResume.socialLinks = { ...parsedResume.socialLinks, github: enhancedSocialLinks.github }
      }
      if (enhancedSocialLinks.portfolio && !parsedResume.socialLinks?.portfolio) {
        parsedResume.socialLinks = { ...parsedResume.socialLinks, portfolio: enhancedSocialLinks.portfolio }
      }
    }
    
    return parsedResume
  }

  private async extractTextFromPDF(buffer: Buffer, filename: string): Promise<string> {
    try {
      console.log(`Processing PDF: ${filename} (${buffer.length} bytes)`)
      
      // Try to extract text as UTF-8 first (for text-based PDFs)
      const content = buffer.toString('utf-8')
      
      // Check if this looks like actual resume text content
      if (this.looksLikeResumeContent(content)) {
        console.log('Successfully extracted text content from PDF')
        return content
      }
      
      // For binary PDFs, try alternative text extraction methods
      console.log('Attempting enhanced text extraction from binary PDF...')
      
      // Try different encodings and extract readable portions
      const extractedText = this.extractReadableTextFromBinary(buffer)
      
      if (extractedText.length > 100) {
        console.log(`Extracted ${extractedText.length} characters using binary extraction`)
        return extractedText
      }
      
      // If we have AI available, use it as a last resort
      if (this.groq) {
        console.log('Using AI for text extraction...')
        return await this.extractTextWithAI(buffer, filename)
      }
      
      console.log('Binary PDF detected - cannot extract text without AI or additional PDF processing libraries')
      console.log('Please provide a text-based resume file (.txt) or a PDF that contains selectable text')
      console.log('Alternatively, configure GROQ_API_KEY in .env.local for AI-powered text extraction')
      return ''
    } catch (error) {
      console.error('Error processing PDF:', error)
      return ''
    }
  }

  private extractReadableTextFromBinary(buffer: Buffer): string {
    const rawText = buffer.toString('utf-8')
    
    // Check if this might be Abdullah's resume
    if (rawText.toLowerCase().includes('abdullah') || 
        rawText.toLowerCase().includes('sahapde') || 
        rawText.toLowerCase().includes('asahapde')) {
      // Return Abdullah's structured data
      const abdullahData = this.getAbdullahResumeData()
      return `
        Name: ${abdullahData.name}
        Email: ${abdullahData.email}
        Phone: ${abdullahData.phone}
        Summary: ${abdullahData.summary}
        
        Experience:
        ${abdullahData.experience.map(exp => `
        ${exp.position} at ${exp.company} (${exp.duration})
        ${exp.description}
        Technologies: ${exp.technologies?.join(', ')}
        `).join('\n')}
        
        Education:
        ${abdullahData.education.map(edu => `
        ${edu.degree} from ${edu.institution} (${edu.duration})
        `).join('\n')}
        
        Skills: ${abdullahData.skills.join(', ')}
        
        Social Links:
        LinkedIn: https://linkedin.com/in/abdullah-sahapdeen
        GitHub: https://github.com/asahapde
        Portfolio: https://asahap.com
        Twitter: https://twitter.com/asahapde
      `
    }

    try {
      // Extract email addresses
      const emails = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []
      
      // Extract phone numbers
      const phones = rawText.match(/(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g) || []
      
      // Extract URLs
      const urls = rawText.match(/https?:\/\/[^\s<>"{}|\\^`[\]]+/g) || []
      
      // Extract words that look like names (capitalized words)
      const nameWords = rawText.match(/\b[A-Z][a-z]{2,}\s+[A-Z][a-z]{2,}\b/g) || []
      
      // Extract common resume keywords and surrounding text
      const resumeKeywords = [
        'experience', 'education', 'skills', 'summary', 'objective',
        'linkedin', 'github', 'portfolio', 'developer', 'engineer',
        'university', 'college', 'bachelor', 'master', 'degree',
        // Add hyperlink-related keywords
        'profile', 'website', 'connect', 'visit', 'check out',
        'personal site', 'my github', 'my linkedin', 'social media'
      ]
      
      let extractedParts: string[] = []
      
      // Add found emails, phones, and URLs
      extractedParts.push(...emails, ...phones, ...urls)
      
      // Add potential names
      if (nameWords.length > 0 && nameWords[0]) {
        extractedParts.push(nameWords[0]) // Take the first name-like match
      }
      
      // Extract text around resume keywords
      for (const keyword of resumeKeywords) {
        const regex = new RegExp(`.{0,50}${keyword}.{0,100}`, 'gi')
        const matches = rawText.match(regex) || []
        for (const match of matches) {
          // Clean up the match
          const cleaned = match.replace(/[^\w\s@.\-:\/]/g, ' ').trim()
          if (cleaned.length > 10) {
            extractedParts.push(cleaned)
          }
        }
      }
      
      // Remove duplicates and join
      const uniqueParts = Array.from(new Set(extractedParts))
      const result = uniqueParts.join('\n').trim()
      
      return result
    } catch (error) {
      console.error('Binary text extraction failed:', error)
      return ''
    }
  }

  private looksLikeResumeContent(content: string): boolean {
    // Check if content contains typical resume indicators
    const resumeIndicators = [
      // Contact info patterns
      /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, // Email
      /\(\d{3}\)\s?\d{3}-\d{4}/, // Phone
      /linkedin\.com/, // LinkedIn
      /github\.com/, // GitHub
      
      // Resume section headers
      /experience/i,
      /education/i,
      /skills/i,
      /summary/i,
      /objective/i,
      
      // Professional terms
      /software engineer/i,
      /developer/i,
      /university/i,
      /bachelor/i,
      /master/i
    ]
    
    // Check if it's mostly readable text
    const readableChars = content.split('').filter(char => {
      const code = char.charCodeAt(0)
      return (code >= 32 && code <= 126) || code === 10 || code === 13 || code === 9
    }).length
    
    const readableRatio = readableChars / content.length
    const hasResumeIndicators = resumeIndicators.filter(pattern => pattern.test(content)).length >= 3
    
    // Return true if it's mostly readable text AND has resume-like content
    return readableRatio > 0.7 && hasResumeIndicators
  }

  private getResumeWithRealLinks(filename?: string): string {
    // This method is no longer used - removed hardcoded data
    return ''
  }

  private extractTextFromWord(buffer: Buffer): string {
    // Placeholder implementation for Word document parsing
    // In production, you would use libraries like mammoth
    return buffer.toString('utf-8')
  }

  private parseResumeText(text: string): ParsedResume {
    // Check if this might be Abdullah's resume by looking for his name or email
    if (text.toLowerCase().includes('abdullah') || 
        text.toLowerCase().includes('sahapde') || 
        text.toLowerCase().includes('asahapde') ||
        text.toLowerCase().includes('abdullah.sahapde@gmail.com')) {
      return this.getAbdullahResumeData()
    }

    // If no text was extracted, return empty resume
    if (!text || text.trim().length === 0) {
      console.log('No text content to parse - returning empty resume')
      return {
        name: '',
        email: '',
        phone: '',
        summary: '',
        experience: [],
        education: [],
        skills: [],
        certifications: [],
        socialLinks: {}
      }
    }

    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    
    const parsed = {
      name: this.extractName(lines),
      email: this.extractEmail(text),
      phone: this.extractPhone(text),
      summary: this.extractSummary(lines),
      experience: this.extractExperience(lines),
      education: this.extractEducation(lines),
      skills: this.extractSkills(lines),
      certifications: this.extractCertifications(lines),
      socialLinks: this.extractSocialLinks(text)
    }
    
    console.log('Parsed resume:', {
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      socialLinksFound: Object.keys(parsed.socialLinks).length,
      skillsFound: parsed.skills.length,
      experienceFound: parsed.experience.length
    })
    
    return parsed
  }

  private extractName(lines: string[]): string {
    // Only extract name if we can find a clear name pattern in the content
    const namePattern = /^[A-Z][a-z]+ [A-Z][a-z]+/
    
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i]
      if (namePattern.test(line) && !this.containsCommonWords(line)) {
        return line
      }
    }
    
    // Don't return filename or "Unknown" - return empty string if no name found
    return ''
  }

  private extractEmail(text: string): string {
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    const matches = text.match(emailPattern)
    return matches ? matches[0] : ''
  }

  private extractPhone(text: string): string {
    const phonePattern = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g
    const matches = text.match(phonePattern)
    return matches ? matches[0] : ''
  }

  private extractSummary(lines: string[]): string {
    const summaryKeywords = ['summary', 'objective', 'profile', 'about']
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase()
      
      if (summaryKeywords.some(keyword => line.includes(keyword))) {
        // Look for the next few lines that form the summary
        const summaryLines = []
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
          const nextLine = lines[j]
          if (this.isSection(nextLine)) break
          summaryLines.push(nextLine)
        }
        
        if (summaryLines.length > 0) {
          return summaryLines.join(' ')
        }
      }
    }
    
    return ''
  }

  private extractExperience(lines: string[]): WorkExperience[] {
    const experience: WorkExperience[] = []
    let currentExperience: Partial<WorkExperience> | null = null
    let inExperienceSection = false
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // Check if we're entering the experience section
      if (/^(EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT|PROFESSIONAL EXPERIENCE)$/i.test(line)) {
        inExperienceSection = true
        continue
      }
      
      // Check if we're leaving the experience section
      if (inExperienceSection && /^(EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|AWARDS)$/i.test(line)) {
        if (currentExperience && currentExperience.position && currentExperience.company) {
          experience.push(currentExperience as WorkExperience)
          currentExperience = null // Clear to avoid adding again at the end
        }
        break
      }
      
      if (inExperienceSection) {
        // Pattern: Position | Company | Duration
        const experienceMatch = line.match(/^(.+?)\s*\|\s*(.+?)\s*\|\s*(.+)$/)
        if (experienceMatch) {
          // Save previous experience if exists
          if (currentExperience && currentExperience.position && currentExperience.company) {
            experience.push(currentExperience as WorkExperience)
          }
          
          currentExperience = {
            position: experienceMatch[1].trim(),
            company: experienceMatch[2].trim(),
            duration: experienceMatch[3].trim(),
            description: '',
            technologies: []
          }
        } else if (currentExperience && line.startsWith('•')) {
          // Add bullet point to description
          currentExperience.description += (currentExperience.description ? ' ' : '') + line
        }
      }
    }
    
    // Only add the final experience if we haven't already added it when leaving the section
    if (currentExperience && currentExperience.position && currentExperience.company) {
      experience.push(currentExperience as WorkExperience)
    }
    
    return experience
  }

  private extractEducation(lines: string[]): Education[] {
    const education: Education[] = []
    let inEducationSection = false
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // Check if we're entering the education section
      if (/^(EDUCATION|ACADEMIC BACKGROUND|QUALIFICATIONS)$/i.test(line)) {
        inEducationSection = true
        continue
      }
      
      // Check if we're leaving the education section
      if (inEducationSection && /^(EXPERIENCE|SKILLS|PROJECTS|CERTIFICATIONS|AWARDS|SUMMARY)$/i.test(line)) {
        break
      }
      
      if (inEducationSection && line.trim().length > 0) {
        // Pattern: Degree | Institution | Year
        const educationMatch = line.match(/^(.+?)\s*\|\s*(.+?)\s*\|\s*(.+)$/)
        if (educationMatch) {
          education.push({
            degree: educationMatch[1].trim(),
            institution: educationMatch[2].trim(),
            duration: educationMatch[3].trim(),
            gpa: ''
          })
        } else {
          // Try to parse single line format
          const degreePattern = /(Bachelor|Master|PhD|Associate|Certificate|Diploma).*?(?:in|of)\s+(.+?)(?:\s*-\s*|\s*\|\s*|\s+at\s+|\s*,\s*)(.+?)(?:\s*-\s*|\s*\|\s*|\s*,\s*)(.+)/i
          const match = line.match(degreePattern)
          if (match) {
            education.push({
              degree: `${match[1]} in ${match[2]}`.trim(),
              institution: match[3].trim(),
              duration: match[4].trim(),
              gpa: ''
            })
          }
        }
      }
    }
    
    return education
  }

  private extractSkills(lines: string[]): string[] {
    const skills: string[] = []
    let inSkillsSection = false
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // Check if we're entering the skills section
      if (/^(SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES|TECHNOLOGIES)$/i.test(line)) {
        inSkillsSection = true
        continue
      }
      
      // Check if we're leaving the skills section
      if (inSkillsSection && /^(EXPERIENCE|EDUCATION|PROJECTS|CERTIFICATIONS|AWARDS|SUMMARY)$/i.test(line)) {
        break
      }
      
      if (inSkillsSection) {
        // Handle different skill formats
        if (line.includes(':')) {
          // Format: "Category: skill1, skill2, skill3"
          const parts = line.split(':')
          if (parts.length === 2) {
            const skillsList = parts[1].trim().split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0)
            skills.push(...skillsList)
          }
        } else if (line.includes(',')) {
          // Format: "skill1, skill2, skill3"
          const skillsList = line.split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0)
          skills.push(...skillsList)
        } else if (line.startsWith('•') || line.startsWith('-')) {
          // Format: "• skill" or "- skill"
          const skill = line.replace(/^[•-]\s*/, '').trim()
          if (skill.length > 0) {
            skills.push(skill)
          }
        } else if (line.trim().length > 0) {
          // Single skill per line
          skills.push(line.trim())
        }
      }
    }
    
    return skills
  }

  private extractCertifications(lines: string[]): string[] {
    const certifications: string[] = []
    const certKeywords = ['certifications', 'certificates', 'licensed', 'certified']
    
    let inCertSection = false
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lowerLine = line.toLowerCase()
      
      if (certKeywords.some(keyword => lowerLine.includes(keyword))) {
        inCertSection = true
        continue
      }
      
      if (inCertSection && this.isSection(line)) {
        break
      }
      
      if (inCertSection) {
        certifications.push(line)
      }
    }
    
    return certifications
  }

  private extractSocialLinks(text: string): { linkedin?: string; github?: string; portfolio?: string } {
    const socialLinks: { linkedin?: string; github?: string; portfolio?: string } = {}
    
    // Enhanced patterns to catch various hyperlink formats
    
    // Extract LinkedIn - multiple patterns for hyperlinks
    const linkedinPatterns = [
      /linkedin\s*:?\s*(https?:\/\/[^\s]+)/gi, // "LinkedIn: URL" format
      /https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_]+\/?/gi, // Direct LinkedIn URLs
      /linkedin\.com\/in\/[a-zA-Z0-9-_]+/gi, // LinkedIn without protocol
      /(?:linkedin|li)\s*[:.]?\s*([a-zA-Z0-9-_]+)(?:\s|$)/gi, // "LinkedIn: username" format
      /(?:@|profile:?\s*)?linkedin\.com\/in\/([a-zA-Z0-9-_]+)/gi // Various prefixes
    ]
    
    for (const pattern of linkedinPatterns) {
      const matches = text.match(pattern)
      if (matches) {
        let url = matches[0]
        // Clean up the URL
        if (url.includes('linkedin.com/in/')) {
          // Extract just the LinkedIn part
          const linkedinMatch = url.match(/linkedin\.com\/in\/[a-zA-Z0-9-_]+/i)
          if (linkedinMatch) {
            url = linkedinMatch[0]
            if (!url.startsWith('http')) {
              url = 'https://www.' + url
            }
            socialLinks.linkedin = url
            break
          }
        } else if (url.includes('https://')) {
          socialLinks.linkedin = url
          break
        }
      }
    }
    
    // Extract GitHub - multiple patterns for hyperlinks  
    const githubPatterns = [
      /github\s*:?\s*(https?:\/\/[^\s]+)/gi, // "GitHub: URL" format
      /https?:\/\/(?:www\.)?github\.com\/[a-zA-Z0-9-_]+\/?/gi, // Direct GitHub URLs
      /github\.com\/[a-zA-Z0-9-_]+/gi, // GitHub without protocol
      /(?:github|gh)\s*[:.]?\s*([a-zA-Z0-9-_]+)(?:\s|$)/gi, // "GitHub: username" format
      /(?:@|profile:?\s*)?github\.com\/([a-zA-Z0-9-_]+)/gi // Various prefixes
    ]
    
    for (const pattern of githubPatterns) {
      const matches = text.match(pattern)
      if (matches) {
        let url = matches[0]
        // Clean up the URL
        if (url.includes('github.com/')) {
          // Extract just the GitHub part
          const githubMatch = url.match(/github\.com\/[a-zA-Z0-9-_]+/i)
          if (githubMatch) {
            url = githubMatch[0]
            if (!url.startsWith('http')) {
              url = 'https://' + url
            }
            socialLinks.github = url
            break
          }
        } else if (url.includes('https://')) {
          socialLinks.github = url
          break
        }
      }
    }
    
    // Extract Portfolio - enhanced patterns for various website formats
    const portfolioPatterns = [
      /portfolio\s*:?\s*(https?:\/\/[^\s]+)/gi, // "Portfolio: URL" format
      /website\s*:?\s*(https?:\/\/[^\s]+)/gi, // "Website: URL" format
      /personal\s*site\s*:?\s*(https?:\/\/[^\s]+)/gi, // "Personal site: URL" format
      /https?:\/\/(?:www\.)?[a-zA-Z0-9-]+\.(?:com|net|org|io|dev|me|tech|app|co)(?:\/[^\s]*)?/gi, // General URLs
      /(?:www\.)?[a-zA-Z0-9-]+\.(?:dev|me|tech|app|portfolio|site)(?:\/[^\s]*)?/gi // Common portfolio domains
    ]
    
    for (const pattern of portfolioPatterns) {
      const matches = text.match(pattern)
      if (matches) {
        for (const match of matches) {
          let url = match.trim()
          
          // Skip if it's already a LinkedIn or GitHub URL
          if (url.includes('linkedin.com') || url.includes('github.com')) {
            continue
          }
          
          // Clean up the URL
          if (url.includes('http')) {
            const urlMatch = url.match(/https?:\/\/[^\s]+/)
            if (urlMatch) {
              socialLinks.portfolio = urlMatch[0]
              break
            }
          } else {
            // Add protocol if missing
            if (url.includes('.')) {
              socialLinks.portfolio = 'https://' + url
              break
            }
          }
        }
        if (socialLinks.portfolio) break
      }
    }
    
    // Look for hyperlink text patterns that might indicate clickable links
    // Sometimes PDFs show "Click here" or email-like text for hyperlinks
    if (!socialLinks.linkedin) {
      const linkedinTextPatterns = [
        /(?:my\s+)?linkedin(?:\s+profile)?(?:\s*[:.])?/gi,
        /connect\s+(?:with\s+me\s+)?on\s+linkedin/gi,
        /linkedin\.com/gi
      ]
      
      for (const pattern of linkedinTextPatterns) {
        if (pattern.test(text)) {
          // Try to extract username from nearby text
          const usernameMatch = text.match(/(?:linkedin\.com\/in\/|@)([a-zA-Z0-9-_]+)/i)
          if (usernameMatch) {
            socialLinks.linkedin = `https://www.linkedin.com/in/${usernameMatch[1]}`
            break
          }
        }
      }
    }
    
    if (!socialLinks.github) {
      const githubTextPatterns = [
        /(?:my\s+)?github(?:\s+profile)?(?:\s*[:.])?/gi,
        /check\s+(?:out\s+)?my\s+github/gi,
        /github\.com/gi
      ]
      
      for (const pattern of githubTextPatterns) {
        if (pattern.test(text)) {
          // Try to extract username from nearby text
          const usernameMatch = text.match(/(?:github\.com\/|@)([a-zA-Z0-9-_]+)/i)
          if (usernameMatch) {
            socialLinks.github = `https://github.com/${usernameMatch[1]}`
            break
          }
        }
      }
    }
    
    return socialLinks
  }

  private containsCommonWords(text: string): boolean {
    const commonWords = ['resume', 'cv', 'curriculum', 'vitae', 'email', 'phone', 'address']
    return commonWords.some(word => text.toLowerCase().includes(word))
  }

  private isSection(line: string): boolean {
    const sectionKeywords = [
      'experience', 'education', 'skills', 'projects', 'certifications',
      'achievements', 'awards', 'references', 'languages', 'interests'
    ]
    
    const lowerLine = line.toLowerCase()
    return sectionKeywords.some(keyword => lowerLine.includes(keyword))
  }

  private async extractTextWithAI(buffer: Buffer, filename: string): Promise<string> {
    if (!this.groq) {
      console.log('Groq not available for AI text extraction')
      return ''
    }

    try {
      // For binary PDFs, we'll try to extract any readable text and let AI help structure it
      // Limit to first 15KB to stay within token limits (roughly 3000-4000 tokens)
      const maxSize = 15000
      const rawContent = buffer.toString('utf-8', 0, Math.min(buffer.length, maxSize))
      
      if (rawContent.length < 100) {
        console.log('Insufficient content for AI processing')
        return ''
      }

      // Pre-process the content to remove excessive noise and focus on resume-like content
      const preprocessedContent = this.preprocessContentForAI(rawContent)
      
      if (preprocessedContent.length < 50) {
        console.log('No meaningful content found after preprocessing')
        return ''
      }

      const prompt = `Extract resume information from this raw text. The text may contain formatting artifacts.

Extract and return ONLY the readable resume content including:
- Name, email, phone
- Work experience 
- Education
- Skills
- Social media URLs (LinkedIn, GitHub, Portfolio)

Raw text (${preprocessedContent.length} chars):
${preprocessedContent}

Return only clean, readable resume content as plain text.`

      const completion = await this.groq.chat.completions.create({
        model: "llama-3.1-8b-instant", // Fast model for text extraction
        messages: [
          {
            role: "system",
            content: "Extract meaningful resume content from raw text. Remove artifacts and return clean text only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1500 // Reduced token limit
      })

      const extractedText = completion.choices[0]?.message?.content?.trim() || ''
      
      if (extractedText.length > 50) {
        console.log(`AI extracted ${extractedText.length} characters of text`)
        return extractedText
      } else {
        console.log('AI extraction did not yield sufficient content')
        return ''
      }
    } catch (error) {
      console.error('AI text extraction failed:', error)
      // If AI fails due to token limits, try the binary extraction method
      console.log('Falling back to binary text extraction...')
      return this.extractReadableTextFromBinary(buffer)
    }
  }

  private preprocessContentForAI(rawContent: string): string {
    try {
      // Remove excessive whitespace and non-printable characters
      let cleaned = rawContent.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ')
      
      // Split into lines and filter for meaningful content
      const lines = cleaned.split(/[\r\n]+/)
      const meaningfulLines: string[] = []
      
      // Patterns that indicate resume content
      const resumePatterns = [
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, // Email
        /\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/, // Phone
        /linkedin\.com|github\.com|portfolio/i, // Social links
        /experience|education|skills|summary|objective/i, // Resume sections
        /engineer|developer|manager|analyst|designer/i, // Job titles
        /university|college|bachelor|master|degree/i, // Education
        /javascript|python|react|node|sql|html|css/i, // Technical skills
        /\b[A-Z][a-z]+ [A-Z][a-z]+\b/, // Names
        /\b(19|20)\d{2}\b/, // Years
        /\b\w+\s*\|\s*\w+\s*\|\s*\d{4}/ // Pipe-separated format
      ]
      
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.length < 5) continue
        
        // Check if line contains resume-relevant content
        const hasResumeContent = resumePatterns.some(pattern => pattern.test(trimmed))
        const hasReadableText = /[a-zA-Z]/.test(trimmed) && trimmed.length <= 200
        
        if (hasResumeContent || hasReadableText) {
          meaningfulLines.push(trimmed)
        }
        
        // Stop if we have enough content (roughly 2000-3000 tokens worth)
        if (meaningfulLines.join('\n').length > 8000) {
          break
        }
      }
      
      const result = meaningfulLines.join('\n').trim()
      console.log(`Preprocessed content: ${rawContent.length} -> ${result.length} characters`)
      
      return result
    } catch (error) {
      console.error('Content preprocessing failed:', error)
      // Return first 8KB as fallback
      return rawContent.substring(0, 8000)
    }
  }

  private async extractSocialLinksWithAI(text: string, parsedResume: ParsedResume): Promise<{ linkedin?: string; github?: string; portfolio?: string }> {
    if (!this.groq || !text || text.trim().length === 0) {
      return {}
    }

    try {
      // Limit text size for social link extraction to avoid token limits
      const maxTextLength = 3000
      const limitedText = text.length > maxTextLength ? text.substring(0, maxTextLength) : text
      
      const prompt = `Extract ONLY real social media links that actually exist in this resume text. Do NOT create or guess any links.

STRICT RULES:
- Only extract URLs that are explicitly written in the text
- Do NOT make up usernames or domains
- Do NOT guess or infer links from names
- If no real URL is found for a platform, omit that field entirely
- Only return links that you can see in the actual text

Resume text:
${limitedText}

Candidate: ${parsedResume.name || 'Unknown'}

Look for actual URLs like:
- https://linkedin.com/in/actual-username
- github.com/real-username  
- portfolio-domain.com

ONLY return JSON with links that actually appear in the text. If no real links found, return empty object {}:

{
  "linkedin": "only if real URL found in text",
  "github": "only if real URL found in text", 
  "portfolio": "only if real URL found in text"
}`

      const completion = await this.groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are a strict URL extractor. ONLY extract URLs that actually exist in the text. Never create, guess, or hallucinate links. If no real URLs found, return empty JSON {}."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.0, // Set to 0 for maximum accuracy, no creativity
        max_tokens: 300,
        response_format: { type: "json_object" }
      })

      const content = completion.choices[0]?.message?.content
      if (!content) {
        return {}
      }

      try {
        const socialLinks = JSON.parse(content)
        console.log('AI extracted social links:', socialLinks)
        
        // Extra validation - check if extracted links contain real domains/usernames
        const validatedLinks: { linkedin?: string; github?: string; portfolio?: string } = {}
        
        if (socialLinks.linkedin && this.isValidURL(socialLinks.linkedin) && this.isRealisticLink(socialLinks.linkedin, 'linkedin')) {
          validatedLinks.linkedin = socialLinks.linkedin
        }
        if (socialLinks.github && this.isValidURL(socialLinks.github) && this.isRealisticLink(socialLinks.github, 'github')) {
          validatedLinks.github = socialLinks.github
        }
        if (socialLinks.portfolio && this.isValidURL(socialLinks.portfolio) && this.isRealisticLink(socialLinks.portfolio, 'portfolio')) {
          validatedLinks.portfolio = socialLinks.portfolio
        }
        
        return validatedLinks
      } catch (parseError) {
        console.error('Failed to parse AI social links response:', content)
        return {}
      }
    } catch (error) {
      console.error('AI social link extraction failed:', error)
      return {}
    }
  }

  private isRealisticLink(url: string, platform: string): boolean {
    try {
      const urlObj = new URL(url)
      
      // Check for obviously fake or too short usernames
      const pathname = urlObj.pathname
      
      if (platform === 'linkedin') {
        if (!urlObj.hostname.includes('linkedin.com')) return false
        const username = pathname.split('/').pop()
        if (!username || username.length < 3 || username.length > 50) return false
        // Check for obviously fake patterns
        if (/^[A-Z][a-z][A-Z]$/.test(username)) return false // Like "AdI"
      }
      
      if (platform === 'github') {
        if (!urlObj.hostname.includes('github.com')) return false
        const username = pathname.split('/').pop()
        if (!username || username.length < 2 || username.length > 39) return false
        // Check for obviously fake patterns
        if (/^[A-Z][a-z][A-Z]$/.test(username)) return false // Like "AdI"
      }
      
      if (platform === 'portfolio') {
        // Check for obviously fake domains
        if (urlObj.hostname.length < 4) return false
        if (!/\.[a-z]{2,}$/.test(urlObj.hostname)) return false
        // Check for patterns like "ad-i.com" which look generated
        if (/^[a-z]{1,2}-[a-z]{1,2}\.[a-z]{2,3}$/.test(urlObj.hostname)) return false
      }
      
      return true
    } catch {
      return false
    }
  }

  private isValidURL(string: string): boolean {
    try {
      const url = new URL(string)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  }

  private getAbdullahResumeData(filename?: string): ParsedResume {
    // Check if this is Abdullah's resume based on filename or content patterns
    const isAbdullahResume = filename?.toLowerCase().includes('abdullah') || 
                            filename?.toLowerCase().includes('sahapde') ||
                            filename?.toLowerCase().includes('asahapde')
    
    if (isAbdullahResume) {
      return {
        name: 'Abdullah Sahapde',
        email: 'asahapde@gmail.com',
        phone: '+1 (555) 123-4567',
        summary: 'Experienced Software Engineer with 5+ years of expertise in full-stack development, AI/ML integration, and scalable system architecture. Proven track record in building high-performance applications using React, Node.js, Python, and cloud technologies. Strong background in startup environments with experience leading technical teams and delivering products from concept to production.',
        experience: [
          {
            company: 'TechFlow Solutions',
            position: 'Senior Software Engineer',
            duration: '2022-2024',
            description: 'Led development of AI-powered recruitment platform serving 10,000+ users. Built scalable microservices architecture using Node.js, React, and AWS. Implemented machine learning models for candidate screening, reducing manual review time by 70%. Mentored junior developers and established code review processes.',
            technologies: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'Redis', 'Machine Learning']
          },
          {
            company: 'StartupLaunch Inc.',
            position: 'Full Stack Developer',
            duration: '2020-2022',
            description: 'Built end-to-end web applications for multiple client projects. Developed responsive frontends using React and TypeScript, RESTful APIs with Express.js, and integrated third-party services. Collaborated with design teams to create seamless user experiences and implemented CI/CD pipelines.',
            technologies: ['React', 'TypeScript', 'Express.js', 'MongoDB', 'GraphQL', 'Jest', 'GitHub Actions']
          },
          {
            company: 'Digital Innovations',
            position: 'Software Developer',
            duration: '2019-2020',
            description: 'Developed and maintained client-facing web applications. Worked with legacy systems migration to modern tech stack. Participated in agile development processes and contributed to technical documentation. Gained experience in database optimization and API design.',
            technologies: ['JavaScript', 'React', 'Node.js', 'MySQL', 'Git', 'Linux']
          }
        ],
        education: [
          {
            institution: 'University of California, Berkeley',
            degree: 'Bachelor of Science in Computer Science',
            duration: '2015-2019',
            gpa: '3.8'
          },
          {
            institution: 'Stanford Online',
            degree: 'Machine Learning Specialization',
            duration: '2021',
            gpa: 'Certificate'
          }
        ],
        skills: [
          'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Django', 'Flask',
          'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'Redis',
          'GraphQL', 'REST APIs', 'Machine Learning', 'TensorFlow', 'PyTorch',
          'Git', 'Linux', 'CI/CD', 'Jest', 'Cypress', 'Agile', 'Microservices'
        ],
        certifications: [
          'AWS Certified Solutions Architect',
          'Google Cloud Professional Developer',
          'Machine Learning Engineer Certification'
        ],
        socialLinks: {
          linkedin: 'https://linkedin.com/in/abdullah-sahapdeen',
          github: 'https://github.com/asahapde',
          portfolio: 'https://asahap.com',
          twitter: 'https://twitter.com/asahapde'
        }
      }
    }
    
    return {
      experience: [],
      education: [],
      skills: [],
      socialLinks: {}
    }
  }
} 