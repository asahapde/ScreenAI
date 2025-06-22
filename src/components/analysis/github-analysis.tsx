"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Github, 
  Star, 
  GitFork, 
  Code, 
  Calendar,
  TrendingUp,
  Award,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  ExternalLink
} from "lucide-react"

interface GitHubCommit {
  date: string
  message: string
  additions: number
  deletions: number
  sha: string
  url: string
}

interface GitHubProject {
  name: string
  description: string
  language: string
  stars: number
  forks: number
  commits: number
  lastUpdated: string
  technologies: string[]
  codeQuality: number
  resumeClaim?: string
  verification: 'verified' | 'partial' | 'disputed'
  url: string
}

interface GitHubAnalysisProps {
  username: string
  data: {
    profile: {
      name: string
      bio: string
      company: string
      location: string
      followers: number
      following: number
      publicRepos: number
      totalStars: number
      totalForks: number
      contributions: number
    }
    projects: GitHubProject[]
    commits: GitHubCommit[]
    languageStats: { [key: string]: number }
    activityPattern: {
      weeklyCommits: number[]
      hourlyPattern: number[]
      streakDays: number
      mostActiveMonth: string
    }
    codeVerification: {
      resumeSkills: string[]
      verifiedSkills: string[]
      disputedClaims: Array<{
        claim: string
        reality: string
        confidence: number
      }>
    }
  }
}

export function GitHubAnalysis({ username, data }: GitHubAnalysisProps) {
  const getVerificationColor = (verification: string) => {
    switch (verification) {
      case 'verified': return 'bg-green-100 text-green-800'
      case 'partial': return 'bg-yellow-100 text-yellow-800'
      case 'disputed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* GitHub Profile Overview */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Github className="h-6 w-6" />
              <CardTitle>GitHub Profile Analysis</CardTitle>
            </div>
            <Badge variant="outline">@{username}</Badge>
          </div>
          <CardDescription>
            Comprehensive analysis of GitHub activity and code contributions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{data.profile.followers}</div>
              <div className="text-sm text-gray-500">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{data.profile.publicRepos}</div>
              <div className="text-sm text-gray-500">Repositories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{data.profile.totalStars}</div>
              <div className="text-sm text-gray-500">Total Stars</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{data.profile.contributions}</div>
              <div className="text-sm text-gray-500">Contributions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Verification vs Resume Claims */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Resume Claims Verification</span>
          </CardTitle>
          <CardDescription>
            Comparing resume claims with actual GitHub code contributions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Verified Skills from Code Analysis</h4>
              <div className="flex flex-wrap gap-2">
                {data.codeVerification.verifiedSkills.map((skill) => (
                  <Badge key={skill} className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            {data.codeVerification.disputedClaims.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 text-red-600">Disputed Claims</h4>
                <div className="space-y-2">
                  {data.codeVerification.disputedClaims.map((dispute, index) => (
                    <div key={index} className="bg-red-50 p-3 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Claim: "{dispute.claim}"</p>
                          <p className="text-sm text-gray-600">Reality: {dispute.reality}</p>
                          <p className="text-xs text-gray-500">Confidence: {dispute.confidence}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Project Analysis with Resume Verification */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle>Project Portfolio Analysis</CardTitle>
          <CardDescription>
            Detailed analysis of GitHub projects with resume claim verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.projects.map((project, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-lg">{project.name}</h4>
                      <Badge variant="outline">{project.language}</Badge>
                      <Badge className={getVerificationColor(project.verification)}>
                        {project.verification}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{project.description}</p>
                    {project.resumeClaim && (
                      <div className="bg-blue-50 p-2 rounded text-sm mb-2">
                        <strong>Resume Claim:</strong> "{project.resumeClaim}"
                      </div>
                    )}
                  </div>
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">{project.stars}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <GitFork className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{project.forks}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Code className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">{project.commits} commits</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{project.lastUpdated}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Code Quality Score</span>
                    <span className={`text-sm font-medium ${getQualityColor(project.codeQuality)}`}>
                      {project.codeQuality}%
                    </span>
                  </div>
                  <Progress value={project.codeQuality} className="h-2" />
                </div>

                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Commit Activity & Patterns */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Commit Patterns & Activity</span>
          </CardTitle>
          <CardDescription>
            Analysis of coding patterns and contribution consistency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Activity Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Current Streak</span>
                  <span className="font-medium">{data.activityPattern.streakDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Most Active Month</span>
                  <span className="font-medium">{data.activityPattern.mostActiveMonth}</span>
                </div>
                <div>
                  <span className="text-sm">Weekly Activity Pattern</span>
                  <div className="flex space-x-1 mt-1">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <div key={day} className="flex flex-col items-center">
                        <div 
                          className="w-6 h-12 bg-gray-200 rounded relative overflow-hidden"
                        >
                          <div 
                            className="absolute bottom-0 w-full bg-indigo-500 transition-all"
                            style={{ height: `${(data.activityPattern.weeklyCommits[index] / Math.max(...data.activityPattern.weeklyCommits)) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs mt-1">{day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Recent Commits</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {data.commits.slice(0, 8).map((commit, index) => (
                  <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                    <p className="font-medium truncate">{commit.message}</p>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{commit.date}</span>
                      <span className="text-green-600">+{commit.additions} <span className="text-red-600">-{commit.deletions}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Distribution */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle>Programming Languages</CardTitle>
          <CardDescription>
            Distribution of programming languages used across repositories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(data.languageStats)
              .sort(([,a], [,b]) => b - a)
              .map(([language, percentage]) => (
                <div key={language}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{language}</span>
                    <span className="text-sm text-gray-500">{percentage}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 