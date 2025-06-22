"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  MessageSquare, 
  Award, 
  TrendingUp,
  CheckCircle,
  Users,
  Calendar,
  Star,
  ThumbsUp,
  Eye,
  Trophy,
  Target
} from "lucide-react"

interface StackOverflowPost {
  id: number
  type: 'question' | 'answer'
  title: string
  tags: string[]
  score: number
  views: number
  answers: number
  accepted: boolean
  createdDate: string
  summary: string
}

interface StackOverflowAnalysisProps {
  username: string
  data: {
    profile: {
      reputation: number
      badgeCount: number
      goldBadges: number
      silverBadges: number
      bronzeBadges: number
      questionsAsked: number
      answersProvided: number
      memberSince: string
      lastActive: string
    }
    expertise: {
      topTags: Array<{ tag: string; score: number; posts: number }>
      knowledgeAreas: string[]
      expertiseLevel: number
      consistencyScore: number
    }
    engagement: {
      helpfulnessScore: number
      communityContribution: number
      mentorshipIndicator: number
      problemSolvingScore: number
    }
    recentActivity: StackOverflowPost[]
    careerRelevance: {
      jobRelevantTags: string[]
      domainExpertise: number
      technicalDepth: number
      practicalExperience: number
    }
  }
}

export function StackOverflowAnalysis({ username, data }: StackOverflowAnalysisProps) {
  const getReputationLevel = (reputation: number) => {
    if (reputation >= 10000) return { level: 'Expert', color: 'text-purple-600', bg: 'bg-purple-100' }
    if (reputation >= 3000) return { level: 'Experienced', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (reputation >= 1000) return { level: 'Contributor', color: 'text-green-600', bg: 'bg-green-100' }
    if (reputation >= 100) return { level: 'Beginner', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { level: 'New', color: 'text-gray-600', bg: 'bg-gray-100' }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const reputationLevel = getReputationLevel(data.profile.reputation)

  return (
    <div className="space-y-6">
      {/* Stack Overflow Profile Overview */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-6 w-6 text-orange-500" />
              <CardTitle>Stack Overflow Analysis</CardTitle>
            </div>
            <Badge className={`${reputationLevel.bg} ${reputationLevel.color}`}>
              {reputationLevel.level}
            </Badge>
          </div>
          <CardDescription>
            Community engagement and technical expertise demonstration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{data.profile.reputation.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Reputation</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{data.profile.answersProvided}</div>
              <div className="text-sm text-gray-500">Answers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{data.profile.questionsAsked}</div>
              <div className="text-sm text-gray-500">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{data.profile.badgeCount}</div>
              <div className="text-sm text-gray-500">Total Badges</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="font-semibold text-yellow-800">{data.profile.goldBadges} Gold</div>
                <div className="text-xs text-yellow-600">Badges</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <Award className="h-5 w-5 text-gray-600" />
              <div>
                <div className="font-semibold text-gray-800">{data.profile.silverBadges} Silver</div>
                <div className="text-xs text-gray-600">Badges</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-3 bg-orange-50 rounded-lg">
              <Star className="h-5 w-5 text-orange-600" />
              <div>
                <div className="font-semibold text-orange-800">{data.profile.bronzeBadges} Bronze</div>
                <div className="text-xs text-orange-600">Badges</div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <span>Member since {data.profile.memberSince}</span>
            <span>Last active: {data.profile.lastActive}</span>
          </div>
        </CardContent>
      </Card>

      {/* Expertise & Knowledge Areas */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Expertise Analysis</span>
          </CardTitle>
          <CardDescription>
            Technical knowledge areas and community recognition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Top Tags & Expertise</h4>
              <div className="space-y-3">
                {data.expertise.topTags.slice(0, 8).map((tag, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{tag.tag}</Badge>
                      <span className="text-sm text-gray-600">{tag.posts} posts</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20">
                        <Progress value={Math.min(tag.score, 100)} className="h-2" />
                      </div>
                      <span className="text-sm font-medium w-8">{tag.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Overall Expertise Level</span>
                  <span className={`text-lg font-bold ${getScoreColor(data.expertise.expertiseLevel)}`}>
                    {data.expertise.expertiseLevel}%
                  </span>
                </div>
                <Progress value={data.expertise.expertiseLevel} className="h-3" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Consistency Score</span>
                  <span className="text-lg font-bold text-blue-600">{data.expertise.consistencyScore}%</span>
                </div>
                <Progress value={data.expertise.consistencyScore} className="h-3" />
              </div>

              <div className="pt-2 border-t">
                <span className="font-medium">Knowledge Areas:</span>
                <div className="flex flex-wrap gap-1 mt-2">
                  {data.expertise.knowledgeAreas.map((area) => (
                    <Badge key={area} variant="secondary" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Community Engagement</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Helpfulness Score</span>
                  <span className="text-sm font-medium">{data.engagement.helpfulnessScore}%</span>
                </div>
                <Progress value={data.engagement.helpfulnessScore} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Community Contribution</span>
                  <span className="text-sm font-medium">{data.engagement.communityContribution}%</span>
                </div>
                <Progress value={data.engagement.communityContribution} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Mentorship Indicator</span>
                  <span className="text-sm font-medium">{data.engagement.mentorshipIndicator}%</span>
                </div>
                <Progress value={data.engagement.mentorshipIndicator} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Problem Solving Score</span>
                  <span className="text-sm font-medium">{data.engagement.problemSolvingScore}%</span>
                </div>
                <Progress value={data.engagement.problemSolvingScore} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Career Relevance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Domain Expertise</span>
                  <span className="text-sm font-medium">{data.careerRelevance.domainExpertise}%</span>
                </div>
                <Progress value={data.careerRelevance.domainExpertise} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Technical Depth</span>
                  <span className="text-sm font-medium">{data.careerRelevance.technicalDepth}%</span>
                </div>
                <Progress value={data.careerRelevance.technicalDepth} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Practical Experience</span>
                  <span className="text-sm font-medium">{data.careerRelevance.practicalExperience}%</span>
                </div>
                <Progress value={data.careerRelevance.practicalExperience} className="h-2" />
              </div>

              <div className="pt-2 border-t">
                <span className="text-sm font-medium">Job Relevant Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.careerRelevance.jobRelevantTags.map((tag) => (
                    <Badge key={tag} className="bg-green-100 text-green-800 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle>Recent Stack Overflow Activity</CardTitle>
          <CardDescription>
            Latest questions and answers demonstrating active community engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentActivity.slice(0, 6).map((post, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50/50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant={post.type === 'question' ? 'outline' : 'secondary'}>
                        {post.type}
                      </Badge>
                      {post.accepted && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Accepted
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-semibold text-lg mb-1">{post.title}</h4>
                    <p className="text-gray-600 text-sm mb-2">{post.summary}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-3 w-3 text-green-500" />
                      <span>{post.score}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3 text-blue-500" />
                      <span>{post.views.toLocaleString()}</span>
                    </div>
                    {post.type === 'question' && (
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-3 w-3 text-purple-500" />
                        <span>{post.answers} answers</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 text-gray-500" />
                      <span>{post.createdDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 