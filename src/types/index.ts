export interface CandidateData {
  id: string
  resume: ResumeData | null
  socialLinks: SocialLinks
  extraContext?: string
  analysisId?: string
  createdAt: Date
}

export interface ResumeData {
  filename: string
  content: string
  parsed: ParsedResume
}

export interface ParsedResume {
  name?: string
  email?: string
  phone?: string
  summary?: string
  experience: WorkExperience[]
  education: Education[]
  skills: string[]
  certifications?: string[]
  socialLinks?: SocialLinks
}

export interface WorkExperience {
  company: string
  position: string
  duration: string
  description: string
  technologies?: string[]
}

export interface Education {
  institution: string
  degree: string
  duration: string
  gpa?: string
}

export interface SocialLinks {
  linkedin?: string
  github?: string
  portfolio?: string
  twitter?: string
  stackOverflow?: string
  medium?: string
}

export interface OnlinePresence {
  github?: GitHubProfile
  linkedin?: LinkedInProfile
  portfolio?: PortfolioData
  technologies?: string[]
  social?: SocialProfile[]
}

export interface GitHubProfile {
  username: string
  profile?: string
  repositories: Repository[]
  contributions: number
  followers: number
  following: number
  languages: string[]
  totalCommits: number
  accountAge: number
  languageStats?: {
    languages: string[]
    distribution: { [key: string]: number }
    primaryLanguage: string | null
    diversityScore: number
  }
  commitPatterns?: {
    recentActivity: number
    commitFrequency: string
    activeHours: number[]
    activeDays: string[]
    consistencyScore: number
  }
  repoQuality?: {
    averageStars: number
    totalStars: number
    documentedRepos: number
    activeRepos: number
    qualityScore: number
    topProjects: Repository[]
  }
  contributionMetrics?: {
    totalContributions: number
    totalCommits: number
    ownRepoCommits: number
    forkedRepoCommits: number
    issuesOpened: number
    pullRequestsCreated: number
  }
  publicRepos?: number
  publicGists?: number
  location?: string | null
  company?: string | null
  blog?: string | null
  hireable?: boolean
  lastActive?: string | null
  topRepositories?: Repository[]
  collaborationScore?: number
}

export interface Repository {
  name: string
  description?: string
  language?: string
  stars: number
  forks: number
  updated: string
  topics: string[]
  size?: number
  isForked?: boolean
  hasIssues?: boolean
  openIssues?: number
  license?: string | null
  defaultBranch?: string
  pushedAt?: string
  homepage?: string | null
}

export interface LinkedInProfile {
  name: string
  profile?: string
  headline: string
  experience: LinkedInExperience[]
  education: LinkedInEducation[]
  skills: LinkedInSkill[]
  connections?: number
}

export interface LinkedInExperience {
  company: string
  position: string
  duration: string
  description?: string
}

export interface LinkedInEducation {
  school: string
  degree: string
  field: string
  years: string
}

export interface LinkedInSkill {
  name: string
  endorsements: number
}

export interface PortfolioData {
  url: string
  projects: Project[]
  technologies: string[]
  blogPosts?: BlogPost[]
}

export interface Project {
  title: string
  description: string
  technologies: string[]
  url?: string
  github?: string
}

export interface BlogPost {
  title: string
  url: string
  publishedAt: string
  tags: string[]
}

export interface SocialProfile {
  platform: string
  username: string
  url: string
  activity: ActivityMetric[]
}

export interface ActivityMetric {
  type: string
  count: number
  description: string
}

export interface JobDescription {
  id: string
  title: string
  company: string
  department?: string
  level?: string
  requirements: JobRequirement[]
  responsibilities: string[]
  requiredSkills: string[]
  preferredSkills: string[]
  experienceRequired: string
  description: string
  content: string
}

export interface JobRequirement {
  category: 'technical' | 'soft' | 'experience' | 'education'
  skill: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  required: boolean
}

export interface AnalysisResult {
  id: string
  candidateId: string
  fitScore: number
  overallConfidence: number
  strengths: AnalysisPoint[]
  gaps: AnalysisPoint[]
  redFlags: RedFlag[]
  highlights: string[]
  onlinePresenceScore: number
  skillVerification: SkillVerification[]
  recommendation: 'strong_match' | 'good_match' | 'weak_match' | 'poor_match'
  summary: string
  createdAt: Date
}

export interface AnalysisPoint {
  category: string
  description: string
  evidence: string[]
  confidence: number
}

export interface RedFlag {
  type: 'inconsistency' | 'misrepresentation' | 'gap' | 'concern'
  description: string
  severity: 'low' | 'medium' | 'high'
  evidence: string[]
}

export interface SkillVerification {
  skill: string
  claimed: boolean
  verified: boolean
  confidence: number
  evidence: Evidence[]
}

export interface Evidence {
  source: 'resume' | 'github' | 'linkedin' | 'portfolio' | 'social'
  type: 'project' | 'experience' | 'endorsement' | 'certification' | 'contribution'
  description: string
  url?: string
  relevance: number
}

export interface ProgressUpdate {
  step: 'parsing' | 'scraping' | 'analyzing' | 'generating'
  progress: number
  message: string
  error?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface FileUpload {
  file: File
  id: string
  progress: number
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error'
  error?: string
}

export interface Job {
  id: string
  title: string
  description: string
  company: string
  location?: string
  salary?: string
  requirements: string[]
  benefits?: string[]
  createdAt: Date
  status: 'active' | 'paused' | 'closed'
  applicantCount: number
}

export interface Resume {
  id: string
  candidateName: string
  email: string
  phone?: string
  uploadedAt: Date
  fileName: string
  parsedData: ParsedResume
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected'
  jobId?: string
  aiScore?: number
  notes?: string
  jobRecommendations?: Array<{jobId: string, score: number}>
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface JobCreationChat {
  messages: ChatMessage[]
  isLoading: boolean
  currentJob?: Partial<Job>
} 