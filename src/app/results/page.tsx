"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft, 
  Brain, 
  Download, 
  Share2, 
  Star, 
  AlertTriangle, 
  CheckCircle, 
  Github, 
  Linkedin, 
  Globe,
  FileText,
  TrendingUp,
  TrendingDown,
  Shield,
  Award,
  Clock
} from "lucide-react"
import { AnalysisResult } from "@/types"

// Mock data for demonstration
const mockAnalysisResult: AnalysisResult = {
  id: "analysis-123",
  candidateId: "candidate-123",
  fitScore: 84,
  overallConfidence: 88,
  strengths: [
    {
      category: "Technical Skills",
      description: "Strong proficiency in React and Node.js",
      evidence: ["5+ years experience in resume", "20+ React projects on GitHub", "Senior role at tech company"],
      confidence: 92
    }
  ],
  gaps: [
    {
      category: "DevOps",
      description: "Limited experience with cloud infrastructure",
      evidence: ["No AWS/Azure projects visible", "No infrastructure-as-code experience"],
      confidence: 78
    }
  ],
  redFlags: [
    {
      type: "inconsistency",
      description: "Resume claims 5 years of coding experience, but GitHub shows 3 years of activity",
      severity: "medium",
      evidence: ["Resume: Started coding in 2019", "GitHub: First commit in 2021"]
    }
  ],
  highlights: [
    "Strong React and Node.js expertise",
    "Consistent contributor to open source",
    "Good communication skills based on LinkedIn"
  ],
  onlinePresenceScore: 75,
  skillVerification: [
    {
      skill: "React",
      claimed: true,
      verified: true,
      confidence: 95,
      evidence: [
        { source: "github", type: "project", description: "15 React projects", relevance: 95 }
      ]
    }
  ],
  recommendation: "good_match",
  summary: "This candidate shows strong technical skills in React and Node.js with good practical experience.",
  createdAt: new Date()
}

function ResultsContent() {
  const searchParams = useSearchParams()
  const candidateId = searchParams.get("id")
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setAnalysisResult(mockAnalysisResult)
      setLoading(false)
    }, 1000)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-indigo-600 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Loading analysis results...</p>
        </div>
      </div>
    )
  }

  if (!analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="max-w-md w-full bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Results Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Link href="/upload">Start New Analysis</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors">
                <FileText className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Brain className="h-8 w-8 text-indigo-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">ScreenAI</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" size="sm" className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Candidate Analysis Report</h1>
            <p className="text-xl text-gray-600">
              Comprehensive AI-powered screening results
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className={`text-3xl font-bold mb-2 ${getScoreColor(analysisResult.fitScore)}`}>
                  {analysisResult.fitScore}%
                </div>
                <p className="text-sm text-gray-600">Job Fit Score</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className={`text-3xl font-bold mb-2 ${getScoreColor(analysisResult.overallConfidence)}`}>
                  {analysisResult.overallConfidence}%
                </div>
                <p className="text-sm text-gray-600">Confidence Level</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className={`text-3xl font-bold mb-2 ${getScoreColor(analysisResult.onlinePresenceScore)}`}>
                  {analysisResult.onlinePresenceScore}%
                </div>
                <p className="text-sm text-gray-600">Online Presence</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-lg font-bold mb-2 text-blue-600">
                  Good Match
                </div>
                <p className="text-sm text-gray-600">Recommendation</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="fit-score">Fit Score</TabsTrigger>
              <TabsTrigger value="online-presence">Online Presence</TabsTrigger>
              <TabsTrigger value="red-flags">Red Flags</TabsTrigger>
              <TabsTrigger value="share">Share</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Executive Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {analysisResult.summary}
                    </p>
                  </CardContent>
                </Card>

                {/* Key Highlights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Key Highlights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysisResult.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Other tabs would go here */}
            <TabsContent value="fit-score">
              <Card>
                <CardHeader>
                  <CardTitle>Skill Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Skill verification details would be displayed here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="online-presence">
              <Card>
                <CardHeader>
                  <CardTitle>Online Presence Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Online presence analysis would be displayed here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="red-flags">
              <Card>
                <CardHeader>
                  <CardTitle>Red Flags</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Red flags analysis would be displayed here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="share">
              <Card>
                <CardHeader>
                  <CardTitle>Share Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF Report
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Share2 className="h-4 w-4 mr-2" />
                      Generate Share Link
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Loading analysis results...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}