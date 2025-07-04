import * as cheerio from 'cheerio'
import { OnlinePresence, GitHubProfile, LinkedInProfile, PortfolioData, Repository, Project } from '@/types'

export class WebScraper {
  private userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'

  async scrapeOnlinePresence(urls: {
    github?: string
    linkedin?: string
    portfolio?: string
  }): Promise<OnlinePresence> {
    const presence: OnlinePresence = {}

    const promises = []

    if (urls.github) {
      promises.push(
        this.scrapeGitHub(urls.github)
          .then(data => { presence.github = data })
          .catch(error => console.error('GitHub scraping error:', error))
      )
    }

    if (urls.linkedin) {
      promises.push(
        this.scrapeLinkedIn(urls.linkedin)
          .then(data => { presence.linkedin = data })
          .catch(error => console.error('LinkedIn scraping error:', error))
      )
    }

    if (urls.portfolio) {
      promises.push(
        this.scrapePortfolio(urls.portfolio)
          .then(data => { presence.portfolio = data })
          .catch(error => console.error('Portfolio scraping error:', error))
      )
    }

    await Promise.all(promises)
    return presence
  }

  private async scrapeGitHub(url: string): Promise<GitHubProfile> {
    try {
      const username = this.extractGitHubUsername(url)
      if (!username) {
        throw new Error('Invalid GitHub URL')
      }

      // Check if this should use basic demo profile
      if (url.includes('alexjohnson') || username === 'alexjohnson') {
        return this.getBasicGitHubProfile()
      }

      // Check if this should use red flag demo profile
      if (url.includes('noorahamed') || username === 'noorahamed') {
        return this.getRedFlagGitHubProfile()
      }

      // Default to enhanced GitHub profile for demo purposes
      return this.getEnhancedGitHubProfile()
    } catch (error) {
      console.error('GitHub scraping error:', error)
      throw error
    }
  }

  private async scrapeLinkedIn(url: string): Promise<LinkedInProfile> {
    // Check if this should use basic demo profile
    if (url.includes('alex-johnson-dev')) {
      return this.getBasicLinkedInProfile()
    }

    // Check if this should use red flag demo profile
    if (url.includes('noor-ahamed-sadique')) {
      return this.getRedFlagLinkedInProfile()
    }

    // Default to enhanced LinkedIn profile for demo purposes
    return this.getEnhancedLinkedInProfile()
  }

  private async scrapePortfolio(url: string): Promise<PortfolioData> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': this.userAgent
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch portfolio')
      }

      const html = await response.text()
      const $ = cheerio.load(html)

      // Extract projects
      const projects: Project[] = []
      
      // Look for common project patterns
      $('[class*="project"], [class*="portfolio"], .project-item, .portfolio-item').each((_, element) => {
        const $el = $(element)
        const title = $el.find('h1, h2, h3, h4, .title, .project-title').first().text().trim()
        const description = $el.find('p, .description, .project-description').first().text().trim()
        
        if (title) {
          projects.push({
            title,
            description: description || '',
            technologies: this.extractTechnologies($el.text()),
            url: $el.find('a').first().attr('href') || '',
            github: this.findGitHubLink($el)
          })
        }
      })

      // Extract technologies mentioned throughout the site
      const allText = $('body').text()
      const technologies = this.extractTechnologies(allText)

      // Look for blog posts
      const blogPosts = this.extractBlogPosts($)

      return {
        url,
        projects,
        technologies,
        blogPosts
      }
    } catch (error) {
      console.error('Portfolio scraping error:', error)
      throw error
    }
  }

  private extractGitHubUsername(url: string): string | null {
    const match = url.match(/github\.com\/([^\/]+)/)
    return match ? match[1] : null
  }

  private async getGitHubContributions(username: string): Promise<number> {
    try {
      // GitHub contributions can be scraped from the contributions graph
      const url = `https://github.com/${username}`
      const response = await fetch(url, {
        headers: { 'User-Agent': this.userAgent }
      })
      
      if (!response.ok) return 0
      
      const html = await response.text()
      const $ = cheerio.load(html)
      
      // Look for contributions count in the profile
      const contributionsText = $('[data-tab-item="overview"] .js-yearly-contributions h2').text()
      const match = contributionsText.match(/(\d+)\s+contributions/)
      
      return match ? parseInt(match[1], 10) : 0
    } catch (error) {
      console.error('Error getting GitHub contributions:', error)
      return 0
    }
  }

  private async getTotalCommits(username: string): Promise<number> {
    // This would require API calls to each repository to get commit counts
    // For now, return an estimated value
    return 0
  }

  private extractTechnologies(text: string): string[] {
    const techKeywords = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
      'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel',
      'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
      'HTML', 'CSS', 'SASS', 'Tailwind', 'Bootstrap', 'GraphQL', 'REST', 'API', 'Git', 'GitHub'
    ]

    const foundTech = new Set<string>()
    const lowerText = text.toLowerCase()

    techKeywords.forEach(tech => {
      if (lowerText.includes(tech.toLowerCase())) {
        foundTech.add(tech)
      }
    })

    return Array.from(foundTech)
  }

  private findGitHubLink(element: cheerio.Cheerio<any>): string | undefined {
    const links = element.find('a')
    for (let i = 0; i < links.length; i++) {
      const href = links.eq(i).attr('href')
      if (href && href.includes('github.com')) {
        return href
      }
    }
    return undefined
  }

  private extractBlogPosts($: cheerio.CheerioAPI) {
    const posts: any[] = []
    
    // Look for common blog post patterns
    $('[class*="post"], [class*="blog"], [class*="article"], .blog-post, .post-item').each((_, element) => {
      const $el = $(element)
      const title = $el.find('h1, h2, h3, .title, .post-title').first().text().trim()
      const url = $el.find('a').first().attr('href')
      
      if (title && url) {
        posts.push({
          title,
          url: url.startsWith('http') ? url : `${new URL($el.closest('html').find('base').attr('href') || '').origin}${url}`,
          publishedAt: new Date().toISOString(), // Would need to extract actual date
          tags: []
        })
      }
    })

    return posts
  }

  // Utility method to check if a URL is accessible
  async isUrlAccessible(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        headers: { 'User-Agent': this.userAgent }
      })
      return response.ok
    } catch (error) {
      return false
    }
  }

  // Method to extract social media links from a portfolio
  extractSocialLinks(html: string): { [platform: string]: string } {
    const $ = cheerio.load(html)
    const socialLinks: { [platform: string]: string } = {}

    $('a[href*="linkedin.com"]').each((_, el) => {
      socialLinks.linkedin = $(el).attr('href') || ''
    })

    $('a[href*="github.com"]').each((_, el) => {
      socialLinks.github = $(el).attr('href') || ''
    })

    $('a[href*="twitter.com"], a[href*="x.com"]').each((_, el) => {
      socialLinks.twitter = $(el).attr('href') || ''
    })

    return socialLinks
  }

  private async analyzeLanguageUsage(repositories: Repository[]): Promise<{
    languages: string[]
    distribution: { [key: string]: number }
    primaryLanguage: string | null
    diversityScore: number
  }> {
    const languageCount: { [key: string]: number } = {}
    const languageBytes: { [key: string]: number } = {}
    
    repositories.forEach(repo => {
      if (repo.language && !repo.isForked) {
        languageCount[repo.language] = (languageCount[repo.language] || 0) + 1
        languageBytes[repo.language] = (languageBytes[repo.language] || 0) + (repo.size || 0)
      }
    })

    const languages = Object.keys(languageCount)
    const totalRepos = Object.values(languageCount).reduce((a, b) => a + b, 0)
    const distribution: { [key: string]: number } = {}
    
    languages.forEach(lang => {
      distribution[lang] = Math.round((languageCount[lang] / totalRepos) * 100)
    })

    const primaryLanguage = languages.length > 0 
      ? languages.reduce((a, b) => languageCount[a] > languageCount[b] ? a : b)
      : null

    const diversityScore = Math.min(languages.length * 10, 100) // Max 100 for 10+ languages

    return {
      languages,
      distribution,
      primaryLanguage,
      diversityScore
    }
  }

  private analyzeCommitPatterns(events: any[]): {
    recentActivity: number
    commitFrequency: string
    activeHours: number[]
    activeDays: string[]
    consistencyScore: number
  } {
    if (!events || events.length === 0) {
      return {
        recentActivity: 0,
        commitFrequency: 'Unknown',
        activeHours: [],
        activeDays: [],
        consistencyScore: 0
      }
    }

    const pushEvents = events.filter(event => event.type === 'PushEvent')
    const recentActivity = pushEvents.length

    // Analyze commit timing
    const hours: { [key: number]: number } = {}
    const days: { [key: string]: number } = {}
    
    pushEvents.forEach(event => {
      const date = new Date(event.created_at)
      const hour = date.getHours()
      const day = date.toLocaleDateString('en-US', { weekday: 'long' })
      
      hours[hour] = (hours[hour] || 0) + 1
      days[day] = (days[day] || 0) + 1
    })

    const activeHours = Object.entries(hours)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour))

    const activeDays = Object.entries(days)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([day]) => day)

    // Calculate consistency (commits spread over time)
    const consistencyScore = Math.min(recentActivity * 2, 100)

    return {
      recentActivity,
      commitFrequency: recentActivity > 20 ? 'High' : recentActivity > 10 ? 'Medium' : 'Low',
      activeHours,
      activeDays,
      consistencyScore
    }
  }

  private analyzeRepositoryQuality(repositories: Repository[]): {
    averageStars: number
    totalStars: number
    documentedRepos: number
    activeRepos: number
    qualityScore: number
    topProjects: Repository[]
  } {
    const totalStars = repositories.reduce((sum, repo) => sum + repo.stars, 0)
    const averageStars = repositories.length > 0 ? Math.round(totalStars / repositories.length * 10) / 10 : 0
    
    const documentedRepos = repositories.filter(repo => 
      repo.description && repo.description.length > 10
    ).length
    
    const recentDate = new Date()
    recentDate.setMonth(recentDate.getMonth() - 6) // 6 months ago
    
    const activeRepos = repositories.filter(repo => 
      new Date(repo.updated) > recentDate
    ).length

    const topProjects = repositories
      .filter(repo => !repo.isForked)
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 5)

    // Quality score based on documentation, activity, and community engagement
    const qualityScore = Math.min(
      (documentedRepos * 10) + 
      (activeRepos * 5) + 
      (totalStars * 2) + 
      (topProjects.length * 5), 
      100
    )

    return {
      averageStars,
      totalStars,
      documentedRepos,
      activeRepos,
      qualityScore,
      topProjects
    }
  }

  private async getDetailedContributions(username: string, repositories: Repository[]): Promise<{
    totalContributions: number
    totalCommits: number
    ownRepoCommits: number
    forkedRepoCommits: number
    issuesOpened: number
    pullRequestsCreated: number
  }> {
    // This would require additional API calls for detailed contribution data
    // For now, we'll estimate based on available data
    const ownRepos = repositories.filter(repo => !repo.isForked)
    const forkedRepos = repositories.filter(repo => repo.isForked)
    
    // Estimate commits based on repository activity
    const estimatedOwnCommits = ownRepos.length * 15 // Rough estimate
    const estimatedForkedCommits = forkedRepos.length * 5 // Rough estimate
    
    return {
      totalContributions: await this.getGitHubContributions(username),
      totalCommits: estimatedOwnCommits + estimatedForkedCommits,
      ownRepoCommits: estimatedOwnCommits,
      forkedRepoCommits: estimatedForkedCommits,
      issuesOpened: repositories.reduce((sum, repo) => sum + (repo.openIssues || 0), 0),
      pullRequestsCreated: forkedRepos.length * 2 // Rough estimate
    }
  }

  private getLastActiveDate(events: any[]): string | null {
    if (!events || events.length === 0) return null
    
    const sortedEvents = events.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    
    return sortedEvents[0]?.created_at || null
  }

  private getTopRepositories(repositories: Repository[]): Repository[] {
    return repositories
      .filter(repo => !repo.isForked)
      .sort((a, b) => {
        // Sort by stars, then forks, then recent activity
        const aScore = a.stars * 10 + a.forks * 5 + (new Date(a.updated).getTime() / 1000000)
        const bScore = b.stars * 10 + b.forks * 5 + (new Date(b.updated).getTime() / 1000000)
        return bScore - aScore
      })
      .slice(0, 10)
  }

  private calculateCollaborationScore(repositories: Repository[], events: any[]): number {
    const forkedRepos = repositories.filter(repo => repo.isForked).length
    const starsReceived = repositories.reduce((sum, repo) => sum + repo.stars, 0)
    const forksReceived = repositories.reduce((sum, repo) => sum + repo.forks, 0)
    const recentActivity = events?.length || 0
    
    // Score based on community engagement
    return Math.min(
      (forkedRepos * 5) + 
      (starsReceived * 2) + 
      (forksReceived * 3) + 
      (recentActivity * 1),
      100
    )
  }

  private getEnhancedGitHubProfile(): GitHubProfile {
    return {
      username: 'asahapde',
      profile: 'Senior Software Engineer passionate about building scalable web applications and AI-powered solutions. Open source contributor with expertise in React, Node.js, and Python.',
      repositories: [
        {
          name: 'ScreenAI',
          description: 'AI-powered candidate screening platform with automated resume analysis and social media verification',
          language: 'TypeScript',
          stars: 87,
          forks: 23,
          updated: '2024-01-20',
          topics: ['ai', 'recruitment', 'nextjs', 'typescript', 'machine-learning'],
          size: 15420,
          isForked: false,
          hasIssues: true,
          openIssues: 3,
          license: 'MIT',
          defaultBranch: 'main',
          pushedAt: '2024-01-20',
          homepage: 'https://screenai-demo.vercel.app'
        },
        {
          name: 'react-dashboard-kit',
          description: 'Modern React dashboard template with TypeScript, Tailwind CSS, and Chart.js integration',
          language: 'TypeScript',
          stars: 234,
          forks: 67,
          updated: '2024-01-15',
          topics: ['react', 'dashboard', 'typescript', 'tailwindcss', 'chartjs'],
          size: 8930,
          isForked: false,
          hasIssues: true,
          openIssues: 8,
          license: 'MIT',
          defaultBranch: 'main',
          pushedAt: '2024-01-15',
          homepage: 'https://react-dashboard-kit.vercel.app'
        },
        {
          name: 'ml-price-predictor',
          description: 'Machine learning model for real estate price prediction using Python, scikit-learn, and Flask API',
          language: 'Python',
          stars: 156,
          forks: 42,
          updated: '2024-01-10',
          topics: ['machine-learning', 'python', 'flask', 'scikit-learn', 'real-estate'],
          size: 12340,
          isForked: false,
          hasIssues: true,
          openIssues: 5,
          license: 'Apache-2.0',
          defaultBranch: 'main',
          pushedAt: '2024-01-10',
          homepage: null
        },
        {
          name: 'microservices-ecommerce',
          description: 'Scalable e-commerce platform built with microservices architecture using Node.js, Docker, and Kubernetes',
          language: 'JavaScript',
          stars: 321,
          forks: 89,
          updated: '2024-01-08',
          topics: ['microservices', 'nodejs', 'docker', 'kubernetes', 'ecommerce'],
          size: 25670,
          isForked: false,
          hasIssues: true,
          openIssues: 12,
          license: 'MIT',
          defaultBranch: 'main',
          pushedAt: '2024-01-08',
          homepage: null
        },
        {
          name: 'api-gateway-express',
          description: 'High-performance API Gateway built with Express.js, Redis caching, and JWT authentication',
          language: 'JavaScript',
          stars: 198,
          forks: 54,
          updated: '2024-01-05',
          topics: ['api-gateway', 'express', 'redis', 'jwt', 'microservices'],
          size: 7890,
          isForked: false,
          hasIssues: true,
          openIssues: 7,
          license: 'MIT',
          defaultBranch: 'main',
          pushedAt: '2024-01-05',
          homepage: null
        },
        {
          name: 'graphql-social-api',
          description: 'Social media API built with GraphQL, Apollo Server, and MongoDB for real-time messaging',
          language: 'JavaScript',
          stars: 143,
          forks: 38,
          updated: '2023-12-28',
          topics: ['graphql', 'apollo', 'mongodb', 'social-media', 'real-time'],
          size: 11230,
          isForked: false,
          hasIssues: true,
          openIssues: 4,
          license: 'MIT',
          defaultBranch: 'main',
          pushedAt: '2023-12-28',
          homepage: null
        }
      ],
      contributions: 2847,
      followers: 324,
      following: 145,
      languages: ['TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'Rust'],
      totalCommits: 3421,
      accountAge: 6,
      languageStats: {
        languages: ['TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'Rust'],
        distribution: {
          'TypeScript': 35,
          'JavaScript': 28,
          'Python': 20,
          'Java': 8,
          'Go': 6,
          'Rust': 3
        },
        primaryLanguage: 'TypeScript',
        diversityScore: 8.5
      },
      commitPatterns: {
        recentActivity: 245,
        commitFrequency: 'Very Active',
        activeHours: [9, 10, 11, 14, 15, 16, 19, 20, 21],
        activeDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        consistencyScore: 9.2
      },
      repoQuality: {
        averageStars: 189.5,
        totalStars: 1139,
        documentedRepos: 6,
        activeRepos: 6,
        qualityScore: 9.1,
        topProjects: [
          {
            name: 'microservices-ecommerce',
            description: 'Scalable e-commerce platform built with microservices architecture using Node.js, Docker, and Kubernetes',
            language: 'JavaScript',
            stars: 321,
            forks: 89,
            updated: '2024-01-08',
            topics: ['microservices', 'nodejs', 'docker', 'kubernetes', 'ecommerce']
          },
          {
            name: 'react-dashboard-kit',
            description: 'Modern React dashboard template with TypeScript, Tailwind CSS, and Chart.js integration',
            language: 'TypeScript',
            stars: 234,
            forks: 67,
            updated: '2024-01-15',
            topics: ['react', 'dashboard', 'typescript', 'tailwindcss', 'chartjs']
          },
          {
            name: 'api-gateway-express',
            description: 'High-performance API Gateway built with Express.js, Redis caching, and JWT authentication',
            language: 'JavaScript',
            stars: 198,
            forks: 54,
            updated: '2024-01-05',
            topics: ['api-gateway', 'express', 'redis', 'jwt', 'microservices']
          }
        ]
      },
      contributionMetrics: {
        totalContributions: 2847,
        totalCommits: 3421,
        ownRepoCommits: 2934,
        forkedRepoCommits: 487,
        issuesOpened: 89,
        pullRequestsCreated: 156
      },
      publicRepos: 42,
      publicGists: 23,
      location: 'San Francisco, CA',
      company: 'TechFlow Solutions',
              blog: 'https://asahap.com/blog',
      hireable: true,
      lastActive: '2024-01-20',
      topRepositories: [
        {
          name: 'microservices-ecommerce',
          description: 'Scalable e-commerce platform built with microservices architecture using Node.js, Docker, and Kubernetes',
          language: 'JavaScript',
          stars: 321,
          forks: 89,
          updated: '2024-01-08',
          topics: ['microservices', 'nodejs', 'docker', 'kubernetes', 'ecommerce']
        },
        {
          name: 'react-dashboard-kit',
          description: 'Modern React dashboard template with TypeScript, Tailwind CSS, and Chart.js integration',
          language: 'TypeScript',
          stars: 234,
          forks: 67,
          updated: '2024-01-15',
          topics: ['react', 'dashboard', 'typescript', 'tailwindcss', 'chartjs']
        },
        {
          name: 'api-gateway-express',
          description: 'High-performance API Gateway built with Express.js, Redis caching, and JWT authentication',
          language: 'JavaScript',
          stars: 198,
          forks: 54,
          updated: '2024-01-05',
          topics: ['api-gateway', 'express', 'redis', 'jwt', 'microservices']
        }
      ],
      collaborationScore: 8.7
    }
  }

  private getEnhancedLinkedInProfile(): LinkedInProfile {
    return {
      name: 'Abdullah Sahapdeen',
      profile: 'Senior Software Engineer at TechFlow Solutions',
      headline: 'Senior Software Engineer | Full-Stack Developer | AI/ML Enthusiast | Building Scalable Solutions',
      experience: [
        {
          company: 'TechFlow Solutions',
          position: 'Senior Software Engineer',
          duration: '2022 - Present',
          description: 'Leading development of AI-powered recruitment platform. Built scalable microservices architecture serving 10,000+ users. Implemented machine learning models for automated candidate screening, reducing manual review time by 70%. Mentoring junior developers and establishing best practices for code quality and deployment processes.'
        },
        {
          company: 'StartupLaunch Inc.',
          position: 'Full Stack Developer',
          duration: '2020 - 2022',
          description: 'Developed end-to-end web applications for multiple client projects. Built responsive frontends using React and TypeScript, RESTful APIs with Express.js. Collaborated with cross-functional teams to deliver projects on time and within budget. Implemented CI/CD pipelines and automated testing strategies.'
        },
        {
          company: 'Digital Innovations',
          position: 'Software Developer',
          duration: '2019 - 2020',
          description: 'Developed and maintained client-facing web applications. Participated in legacy systems migration to modern tech stack. Worked in agile development environment and contributed to technical documentation. Gained expertise in database optimization and API design principles.'
        }
      ],
      education: [
        {
          school: 'University of California, Berkeley',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          years: '2015 - 2019'
        },
        {
          school: 'Stanford Online',
          degree: 'Machine Learning Specialization',
          field: 'Artificial Intelligence',
          years: '2021'
        }
      ],
      skills: [
        { name: 'JavaScript', endorsements: 87 },
        { name: 'TypeScript', endorsements: 76 },
        { name: 'React', endorsements: 94 },
        { name: 'Node.js', endorsements: 82 },
        { name: 'Python', endorsements: 69 },
        { name: 'AWS', endorsements: 71 },
        { name: 'Docker', endorsements: 58 },
        { name: 'Kubernetes', endorsements: 45 },
        { name: 'Machine Learning', endorsements: 52 },
        { name: 'PostgreSQL', endorsements: 48 },
        { name: 'MongoDB', endorsements: 41 },
        { name: 'GraphQL', endorsements: 38 },
        { name: 'Microservices', endorsements: 43 },
        { name: 'CI/CD', endorsements: 35 },
        { name: 'Agile Development', endorsements: 62 }
      ],
      connections: 500
    }
  }

  private getBasicGitHubProfile(): GitHubProfile {
    return {
      username: 'alexjohnson',
      profile: 'Software Engineer with 4+ years of experience in web development',
      repositories: [
        {
          name: 'portfolio-website',
          description: 'Personal portfolio website built with React and CSS',
          language: 'JavaScript',
          stars: 12,
          forks: 3,
          updated: '2024-01-10',
          topics: ['react', 'portfolio', 'css'],
          size: 2340,
          isForked: false,
          hasIssues: true,
          openIssues: 2,
          license: 'MIT',
          defaultBranch: 'main',
          pushedAt: '2024-01-10',
          homepage: 'https://alexjohnson.dev'
        },
        {
          name: 'todo-app-react',
          description: 'Simple todo application with React hooks and local storage',
          language: 'JavaScript',
          stars: 8,
          forks: 2,
          updated: '2023-12-15',
          topics: ['react', 'todo', 'hooks'],
          size: 1890,
          isForked: false,
          hasIssues: false,
          openIssues: 0,
          license: 'MIT',
          defaultBranch: 'main',
          pushedAt: '2023-12-15',
          homepage: null
        },
        {
          name: 'weather-api',
          description: 'Weather API service built with Node.js and Express',
          language: 'JavaScript',
          stars: 15,
          forks: 4,
          updated: '2023-11-20',
          topics: ['nodejs', 'express', 'api', 'weather'],
          size: 3120,
          isForked: false,
          hasIssues: true,
          openIssues: 1,
          license: 'MIT',
          defaultBranch: 'main',
          pushedAt: '2023-11-20',
          homepage: null
        }
      ],
      contributions: 456,
      followers: 23,
      following: 34,
      languages: ['JavaScript', 'HTML', 'CSS', 'Python'],
      totalCommits: 578,
      accountAge: 3,
      languageStats: {
        languages: ['JavaScript', 'HTML', 'CSS', 'Python'],
        distribution: {
          'JavaScript': 65,
          'HTML': 15,
          'CSS': 12,
          'Python': 8
        },
        primaryLanguage: 'JavaScript',
        diversityScore: 5.2
      },
      commitPatterns: {
        recentActivity: 34,
        commitFrequency: 'Moderate',
        activeHours: [19, 20, 21, 22],
        activeDays: ['Saturday', 'Sunday', 'Wednesday'],
        consistencyScore: 6.1
      },
      repoQuality: {
        averageStars: 11.7,
        totalStars: 35,
        documentedRepos: 2,
        activeRepos: 3,
        qualityScore: 6.8,
        topProjects: [
          {
            name: 'weather-api',
            description: 'Weather API service built with Node.js and Express',
            language: 'JavaScript',
            stars: 15,
            forks: 4,
            updated: '2023-11-20',
            topics: ['nodejs', 'express', 'api', 'weather']
          },
          {
            name: 'portfolio-website',
            description: 'Personal portfolio website built with React and CSS',
            language: 'JavaScript',
            stars: 12,
            forks: 3,
            updated: '2024-01-10',
            topics: ['react', 'portfolio', 'css']
          }
        ]
      },
      contributionMetrics: {
        totalContributions: 456,
        totalCommits: 578,
        ownRepoCommits: 523,
        forkedRepoCommits: 55,
        issuesOpened: 12,
        pullRequestsCreated: 8
      },
      publicRepos: 15,
      publicGists: 3,
      location: 'Austin, TX',
      company: 'CloudTech Solutions',
      blog: null,
      hireable: true,
      lastActive: '2024-01-10',
      topRepositories: [
        {
          name: 'weather-api',
          description: 'Weather API service built with Node.js and Express',
          language: 'JavaScript',
          stars: 15,
          forks: 4,
          updated: '2023-11-20',
          topics: ['nodejs', 'express', 'api', 'weather']
        },
        {
          name: 'portfolio-website',
          description: 'Personal portfolio website built with React and CSS',
          language: 'JavaScript',
          stars: 12,
          forks: 3,
          updated: '2024-01-10',
          topics: ['react', 'portfolio', 'css']
        }
      ],
      collaborationScore: 5.4
    }
  }

  private getBasicLinkedInProfile(): LinkedInProfile {
    return {
      name: 'Alex Johnson',
      profile: 'Software Engineer at CloudTech Solutions',
      headline: 'Software Engineer | Web Development | React & Node.js',
      experience: [
        {
          company: 'CloudTech Solutions',
          position: 'Software Engineer',
          duration: '2021 - Present',
          description: 'Developing web applications with React and Node.js. Working with team to deliver client projects and maintain existing systems. Participating in code reviews and agile development processes.'
        },
        {
          company: 'WebDev Studios',
          position: 'Junior Developer',
          duration: '2020 - 2021',
          description: 'Built responsive websites using HTML, CSS, and JavaScript. Learned modern frameworks and worked on small team projects. Gained experience in version control and basic deployment processes.'
        }
      ],
      education: [
        {
          school: 'State University',
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          years: '2016 - 2020'
        }
      ],
      skills: [
        { name: 'JavaScript', endorsements: 18 },
        { name: 'React', endorsements: 15 },
        { name: 'Node.js', endorsements: 12 },
        { name: 'HTML', endorsements: 22 },
        { name: 'CSS', endorsements: 19 },
        { name: 'Git', endorsements: 14 },
        { name: 'SQL', endorsements: 8 },
        { name: 'AWS', endorsements: 6 }
      ],
      connections: 89
    }
  }

  private getRedFlagGitHubProfile(): GitHubProfile {
    return {
      username: 'noorahamed',
      profile: 'Full-Stack Developer | AI/ML Expert | Blockchain Enthusiast',
      repositories: [
        {
          name: 'my-portfolio',
          description: 'Personal portfolio website',
          language: 'HTML',
          stars: 0,
          forks: 0,
          updated: '2024-01-10',
          topics: ['portfolio', 'html', 'css'],
          size: 230,
          isForked: false,
          hasIssues: false,
          openIssues: 0,
          license: null,
          defaultBranch: 'main',
          pushedAt: '2024-01-10',
          homepage: null
        },
        {
          name: 'calculator-app',
          description: 'Simple calculator built with JavaScript',
          language: 'JavaScript',
          stars: 1,
          forks: 0,
          updated: '2023-11-20',
          topics: ['calculator', 'javascript'],
          size: 180,
          isForked: false,
          hasIssues: false,
          openIssues: 0,
          license: null,
          defaultBranch: 'main',
          pushedAt: '2023-11-20',
          homepage: null
        },
        {
          name: 'wordpress-theme',
          description: 'Custom WordPress theme',
          language: 'PHP',
          stars: 0,
          forks: 0,
          updated: '2023-09-15',
          topics: ['wordpress', 'php', 'theme'],
          size: 340,
          isForked: false,
          hasIssues: false,
          openIssues: 0,
          license: null,
          defaultBranch: 'main',
          pushedAt: '2023-09-15',
          homepage: null
        }
      ],
      contributions: 23,
      followers: 2,
      following: 8,
      languages: ['HTML', 'JavaScript', 'PHP'],
      totalCommits: 31,
      accountAge: 2,
      languageStats: {
        languages: ['HTML', 'JavaScript', 'PHP'],
        distribution: {
          'HTML': 45,
          'JavaScript': 35,
          'PHP': 20
        },
        primaryLanguage: 'HTML',
        diversityScore: 3.2
      },
      commitPatterns: {
        recentActivity: 3,
        commitFrequency: 'Very Low',
        activeHours: [23],
        activeDays: ['Saturday'],
        consistencyScore: 1.2
      },
      repoQuality: {
        averageStars: 0.3,
        totalStars: 1,
        documentedRepos: 0,
        activeRepos: 1,
        qualityScore: 0.8,
        topProjects: [
          {
            name: 'calculator-app',
            description: 'Simple calculator built with JavaScript',
            language: 'JavaScript',
            stars: 1,
            forks: 0,
            updated: '2023-11-20',
            topics: ['calculator', 'javascript']
          }
        ]
      },
      contributionMetrics: {
        totalContributions: 23,
        totalCommits: 31,
        ownRepoCommits: 31,
        forkedRepoCommits: 0,
        issuesOpened: 0,
        pullRequestsCreated: 0
      },
      publicRepos: 3,
      publicGists: 0,
      location: null,
      company: null,
      blog: null,
      hireable: false,
      lastActive: '2024-01-10',
      topRepositories: [
        {
          name: 'calculator-app',
          description: 'Simple calculator built with JavaScript',
          language: 'JavaScript',
          stars: 1,
          forks: 0,
          updated: '2023-11-20',
          topics: ['calculator', 'javascript']
        }
      ],
      collaborationScore: 0.5
    }
  }

  private getRedFlagLinkedInProfile(): LinkedInProfile {
    return {
      name: 'Noor Ahamed Sadique',
      profile: 'Full-Stack Developer | AI/ML Expert | Blockchain Specialist',
      headline: 'Senior Software Engineer | Leading AI Innovation | 6+ Years Experience',
      experience: [
        {
          company: 'TechFlow Solutions',
          position: 'Full-Stack Developer',
          duration: '2022 - Present',
          description: 'Building modern web applications with React and Node.js. Working on client projects and maintaining systems.'
        },
        {
          company: 'WebDev Inc',
          position: 'Frontend Developer',
          duration: '2020 - 2022',
          description: 'Developed user interfaces using HTML, CSS, JavaScript. Worked with jQuery and Bootstrap frameworks.'
        },
        {
          company: 'Freelance',
          position: 'Web Developer',
          duration: '2019 - 2020',
          description: 'Created WordPress websites for small businesses. Basic HTML/CSS customization and maintenance.'
        }
      ],
      education: [
        {
          school: 'Community College of Tech',
          degree: 'Associate Degree in Web Development',
          field: 'Web Development',
          years: '2016 - 2018'
        }
      ],
      skills: [
        { name: 'HTML', endorsements: 12 },
        { name: 'CSS', endorsements: 9 },
        { name: 'JavaScript', endorsements: 7 },
        { name: 'WordPress', endorsements: 15 },
        { name: 'jQuery', endorsements: 6 },
        { name: 'React', endorsements: 3 },
        { name: 'Node.js', endorsements: 2 },
        { name: 'PHP', endorsements: 4 }
      ],
      connections: 34
    }
  }
} 