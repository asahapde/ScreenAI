"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BookOpen, 
  ExternalLink, 
  Calendar,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Eye,
  Award,
  Sparkles
} from "lucide-react"

interface BlogPost {
  title: string
  url: string
  platform: string
  publishedDate: string
  readTime: number
  views: number
  likes: number
  comments: number
  topics: string[]
  relevanceScore: number
  qualityScore: number
  summary: string
}

interface BlogAnalysisProps {
  data: {
    overallScore: number
    thoughtLeadershipScore: number
    technicalWritingScore: number
    consistencyScore: number
    totalPosts: number
    totalViews: number
    totalEngagement: number
    platforms: string[]
    topTopics: Array<{ topic: string; count: number }>
    posts: BlogPost[]
    writingAnalysis: {
      averageReadTime: number
      averageQuality: number
      averageRelevance: number
      writingStyle: string
      technicalDepth: string
    }
    careerImpact: {
      thoughtLeadership: number
      industryRecognition: number
      knowledgeSharing: number
      communityEngagement: number
    }
  }
}

export function BlogAnalysis({ data }: BlogAnalysisProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="space-y-6">
      {/* Overall Blog Analysis */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-blue-500" />
              <CardTitle>Blog & Content Analysis</CardTitle>
            </div>
            <div className={`text-3xl font-bold ${getScoreColor(data.overallScore)}`}>
              {data.overallScore}%
            </div>
          </div>
          <CardDescription>
            Analysis of technical writing, thought leadership, and content quality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{data.totalPosts}</div>
              <div className="text-sm text-gray-500">Total Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{data.totalViews.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{data.totalEngagement}</div>
              <div className="text-sm text-gray-500">Total Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{data.platforms.length}</div>
              <div className="text-sm text-gray-500">Platforms</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-3 rounded-lg ${getScoreBg(data.thoughtLeadershipScore)}`}>
              <div className="flex items-center space-x-2 mb-1">
                <Award className="h-4 w-4" />
                <span className="font-medium">Thought Leadership</span>
              </div>
              <div className="text-2xl font-bold">{data.thoughtLeadershipScore}%</div>
            </div>
            <div className={`p-3 rounded-lg ${getScoreBg(data.technicalWritingScore)}`}>
              <div className="flex items-center space-x-2 mb-1">
                <Sparkles className="h-4 w-4" />
                <span className="font-medium">Technical Writing</span>
              </div>
              <div className="text-2xl font-bold">{data.technicalWritingScore}%</div>
            </div>
            <div className={`p-3 rounded-lg ${getScoreBg(data.consistencyScore)}`}>
              <div className="flex items-center space-x-2 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">Consistency</span>
              </div>
              <div className="text-2xl font-bold">{data.consistencyScore}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Writing Analysis */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle>Writing Analysis</CardTitle>
          <CardDescription>
            Deep dive into writing style, quality, and technical depth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Average Quality Score</span>
                  <span className="text-sm text-gray-600">{data.writingAnalysis.averageQuality}%</span>
                </div>
                <Progress value={data.writingAnalysis.averageQuality} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Content Relevance</span>
                  <span className="text-sm text-gray-600">{data.writingAnalysis.averageRelevance}%</span>
                </div>
                <Progress value={data.writingAnalysis.averageRelevance} className="h-2" />
              </div>
              <div className="pt-2 border-t">
                <div className="space-y-2 text-sm">
                  <div><strong>Average Read Time:</strong> {data.writingAnalysis.averageReadTime} minutes</div>
                  <div><strong>Writing Style:</strong> {data.writingAnalysis.writingStyle}</div>
                  <div><strong>Technical Depth:</strong> {data.writingAnalysis.technicalDepth}</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Top Topics</h4>
              <div className="space-y-2">
                {data.topTopics.map((topic, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <Badge variant="outline">{topic.topic}</Badge>
                    <span className="text-sm text-gray-600">{topic.count} posts</span>
                  </div>
                ))}
              </div>
              
              <h4 className="font-medium mb-2 mt-4">Platforms</h4>
              <div className="flex flex-wrap gap-2">
                {data.platforms.map((platform) => (
                  <Badge key={platform} variant="secondary">{platform}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Career Impact Analysis */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle>Career Impact Assessment</CardTitle>
          <CardDescription>
            How content creation impacts professional growth and industry recognition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <Award className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{data.careerImpact.thoughtLeadership}%</div>
              <div className="text-sm text-gray-500">Thought Leadership</div>
              <Progress value={data.careerImpact.thoughtLeadership} className="h-2 mt-2" />
            </div>
            <div className="text-center">
              <Eye className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{data.careerImpact.industryRecognition}%</div>
              <div className="text-sm text-gray-500">Industry Recognition</div>
              <Progress value={data.careerImpact.industryRecognition} className="h-2 mt-2" />
            </div>
            <div className="text-center">
              <Share2 className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{data.careerImpact.knowledgeSharing}%</div>
              <div className="text-sm text-gray-500">Knowledge Sharing</div>
              <Progress value={data.careerImpact.knowledgeSharing} className="h-2 mt-2" />
            </div>
            <div className="text-center">
              <MessageCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{data.careerImpact.communityEngagement}%</div>
              <div className="text-sm text-gray-500">Community Engagement</div>
              <Progress value={data.careerImpact.communityEngagement} className="h-2 mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Blog Posts */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle>Recent Blog Posts</CardTitle>
          <CardDescription>
            Latest technical writing and thought leadership content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.posts.slice(0, 5).map((post, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50/50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">{post.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{post.publishedDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-3 w-3" />
                        <span>{post.readTime} min read</span>
                      </div>
                      <Badge variant="outline" className="text-xs">{post.platform}</Badge>
                    </div>
                  </div>
                  <a 
                    href={post.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                <p className="text-gray-600 text-sm mb-3">{post.summary}</p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3 text-blue-500" />
                      <span>{post.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3 text-red-500" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-3 w-3 text-green-500" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={`text-xs ${getScoreBg(post.qualityScore)}`}>
                      Quality: {post.qualityScore}%
                    </Badge>
                    <Badge className={`text-xs ${getScoreBg(post.relevanceScore)}`}>
                      Relevance: {post.relevanceScore}%
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {post.topics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
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