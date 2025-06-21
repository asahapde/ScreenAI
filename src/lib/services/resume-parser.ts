import { ParsedResume, WorkExperience, Education } from '@/types'

export class ResumeParser {
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
    
    return this.parseResumeText(text)
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
      
      // For binary PDFs, we cannot easily extract text in a server environment
      // without complex dependencies. Return empty string so the user knows
      // they need to provide a text-based resume or convert their PDF
      console.log('Binary PDF detected - cannot extract text without additional PDF processing libraries')
      console.log('Please provide a text-based resume file (.txt) or a PDF that contains selectable text')
      return ''
    } catch (error) {
      console.error('Error processing PDF:', error)
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
    
    // Extract LinkedIn - look for "LinkedIn: URL" format
    const linkedinPattern = /linkedin\s*:?\s*(https?:\/\/[^\s]+)/gi
    const linkedinMatch = text.match(linkedinPattern)
    
    if (linkedinMatch) {
      // Extract just the URL part after "LinkedIn:"
      const urlMatch = linkedinMatch[0].match(/https?:\/\/[^\s]+/)
      if (urlMatch) {
        socialLinks.linkedin = urlMatch[0]
      }
    }
    
    // Extract GitHub - look for "GitHub: URL" format
    const githubPattern = /github\s*:?\s*(https?:\/\/[^\s]+)/gi
    const githubMatch = text.match(githubPattern)
    
    if (githubMatch) {
      // Extract just the URL part after "GitHub:"
      const urlMatch = githubMatch[0].match(/https?:\/\/[^\s]+/)
      if (urlMatch) {
        socialLinks.github = urlMatch[0]
      }
    }
    
    // Extract Portfolio - look for "Portfolio: URL" format
    const portfolioPattern = /portfolio\s*:?\s*(https?:\/\/[^\s]+)/gi
    const portfolioMatch = text.match(portfolioPattern)
    
    if (portfolioMatch) {
      // Extract just the URL part after "Portfolio:"
      const urlMatch = portfolioMatch[0].match(/https?:\/\/[^\s]+/)
      if (urlMatch) {
        socialLinks.portfolio = urlMatch[0]
      }
    }
    
    // Also look for standalone URLs in the text
    if (!socialLinks.linkedin) {
      const standaloneLinkedin = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_]+\/?/gi)
      if (standaloneLinkedin) {
        socialLinks.linkedin = standaloneLinkedin[0]
      }
    }
    
    if (!socialLinks.github) {
      const standaloneGithub = text.match(/https?:\/\/(?:www\.)?github\.com\/[a-zA-Z0-9-_]+\/?/gi)
      if (standaloneGithub) {
        socialLinks.github = standaloneGithub[0]
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


} 