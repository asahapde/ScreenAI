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

      // Use GitHub API instead of scraping HTML for better reliability
      const apiUrl = `https://api.github.com/users/${username}`
      const reposUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
      const eventsUrl = `https://api.github.com/users/${username}/events?per_page=100`

      const [userResponse, reposResponse, eventsResponse] = await Promise.all([
        fetch(apiUrl, {
          headers: {
            'User-Agent': this.userAgent,
            'Accept': 'application/vnd.github.v3+json'
          }
        }),
        fetch(reposUrl, {
          headers: {
            'User-Agent': this.userAgent,
            'Accept': 'application/vnd.github.v3+json'
          }
        }),
        fetch(eventsUrl, {
          headers: {
            'User-Agent': this.userAgent,
            'Accept': 'application/vnd.github.v3+json'
          }
        }).catch(() => null) // Events API might fail, make it optional
      ])

      if (!userResponse.ok || !reposResponse.ok) {
        throw new Error('Failed to fetch GitHub data')
      }

      const userData = await userResponse.json()
      const reposData = await reposResponse.json()
      const eventsData = eventsResponse?.ok ? await eventsResponse.json() : []

      const repositories: Repository[] = reposData.map((repo: any) => ({
        name: repo.name,
        description: repo.description || '',
        language: repo.language || '',
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        updated: repo.updated_at,
        topics: repo.topics || [],
        size: repo.size || 0,
        isForked: repo.fork || false,
        hasIssues: repo.has_issues || false,
        openIssues: repo.open_issues_count || 0,
        license: repo.license?.name || null,
        defaultBranch: repo.default_branch || 'main',
        pushedAt: repo.pushed_at,
        homepage: repo.homepage || null
      }))

      // Enhanced language analysis
      const languageStats = await this.analyzeLanguageUsage(repositories)
      const commitPatterns = this.analyzeCommitPatterns(eventsData)
      const repoQuality = this.analyzeRepositoryQuality(repositories)
      const contributionMetrics = await this.getDetailedContributions(username, repositories)

      // Calculate account age
      const createdDate = new Date(userData.created_at)
      const accountAge = Math.floor((Date.now() - createdDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))

      return {
        username,
        profile: userData.bio || userData.name || username,
        repositories,
        contributions: contributionMetrics.totalContributions,
        followers: userData.followers || 0,
        following: userData.following || 0,
        languages: languageStats.languages,
        totalCommits: contributionMetrics.totalCommits,
        accountAge,
        // Enhanced metrics
        languageStats,
        commitPatterns,
        repoQuality,
        contributionMetrics,
        publicRepos: userData.public_repos || 0,
        publicGists: userData.public_gists || 0,
        location: userData.location || null,
        company: userData.company || null,
        blog: userData.blog || null,
        hireable: userData.hireable || false,
        lastActive: this.getLastActiveDate(eventsData),
        topRepositories: this.getTopRepositories(repositories),
        collaborationScore: this.calculateCollaborationScore(repositories, eventsData)
      }
    } catch (error) {
      console.error('GitHub scraping error:', error)
      throw error
    }
  }

  private async scrapeLinkedIn(url: string): Promise<LinkedInProfile> {
    // Note: LinkedIn actively blocks automated scraping
    // In production, you would use LinkedIn API or alternative methods
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': this.userAgent
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch LinkedIn profile')
      }

      const html = await response.text()
      const $ = cheerio.load(html)

      // Extract basic information (this is simplified and may not work due to LinkedIn's anti-scraping measures)
      const name = $('h1').first().text().trim()
      const headline = $('.pv-text-details__left-panel h2').text().trim()

      return {
        name: name || 'Unknown',
        headline: headline || '',
        experience: [], // Would require more complex extraction
        education: [], // Would require more complex extraction
        skills: [], // Would require more complex extraction
        connections: undefined
      }
    } catch (error) {
      console.error('LinkedIn scraping error:', error)
      // Return fallback data
      return {
        name: 'LinkedIn Profile',
        headline: 'Unable to scrape LinkedIn profile',
        experience: [],
        education: [],
        skills: []
      }
    }
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
} 