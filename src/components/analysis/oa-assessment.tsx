"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  CheckCircle, 
  XCircle, 
  Code, 
  Brain,
  Award,
  AlertTriangle,
  TrendingUp,
  FileText,
  Clock,
  Target
} from "lucide-react"

interface OASkill {
  skill: string
  required: boolean
  githubEvidence: string[]
  proficiencyLevel: number
  oaRequired: boolean
  reasoning: string
}

interface OAAssessmentProps {
  data: {
    overallOARecommendation: 'skip' | 'partial' | 'full'
    confidenceScore: number
    skillsAssessment: OASkill[]
    algorithmicThinking: {
      score: number
      evidence: string[]
      oaNeeded: boolean
    }
    problemSolving: {
      score: number
      evidence: string[]
      oaNeeded: boolean
    }
    codeQuality: {
      score: number
      evidence: string[]
      oaNeeded: boolean
    }
    domainExpertise: {
      score: number
      evidence: string[]
      oaNeeded: boolean
    }
    summary: string
    recommendations: string[]
  }
}

export function OAAssessment({ data }: OAAssessmentProps) {
  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'skip': return 'text-green-600'
      case 'partial': return 'text-yellow-600'
      case 'full': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getRecommendationBg = (recommendation: string) => {
    switch (recommendation) {
      case 'skip': return 'bg-green-100'
      case 'partial': return 'bg-yellow-100'
      case 'full': return 'bg-red-100'
      default: return 'bg-gray-100'
    }
  }

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'skip': return <CheckCircle className="h-6 w-6 text-green-600" />
      case 'partial': return <AlertTriangle className="h-6 w-6 text-yellow-600" />
      case 'full': return <XCircle className="h-6 w-6 text-red-600" />
      default: return <FileText className="h-6 w-6 text-gray-600" />
    }
  }

  const getRecommendationText = (recommendation: string) => {
    switch (recommendation) {
      case 'skip': return 'Skip OA - Proven through GitHub'
      case 'partial': return 'Partial OA - Some areas need verification'
      case 'full': return 'Full OA Required'
      default: return 'Assessment Needed'
    }
  }

  return (
    <div className="space-y-6">
      {/* Overall OA Recommendation */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-purple-500" />
              <CardTitle>Online Assessment Recommendation</CardTitle>
            </div>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${getRecommendationBg(data.overallOARecommendation)}`}>
              {getRecommendationIcon(data.overallOARecommendation)}
              <span className={`font-semibold ${getRecommendationColor(data.overallOARecommendation)}`}>
                {getRecommendationText(data.overallOARecommendation)}
              </span>
            </div>
          </div>
          <CardDescription>
            AI-powered analysis of whether this candidate needs an Online Assessment based on GitHub portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Analysis Confidence</span>
                <span className="text-sm font-medium">{data.confidenceScore}%</span>
              </div>
              <Progress value={data.confidenceScore} className="h-3" />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Summary</h4>
              <p className="text-sm text-gray-700">{data.summary}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="space-y-1">
                {data.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                    <span className="text-indigo-500 mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Assessment Matrix */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Skills Verification Matrix</span>
          </CardTitle>
          <CardDescription>
            Detailed analysis of required skills vs GitHub evidence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.skillsAssessment.map((skill, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold">{skill.skill}</h4>
                    {skill.required && <Badge variant="outline">Required</Badge>}
                  </div>
                  <div className="flex items-center space-x-2">
                    {skill.oaRequired ? (
                      <Badge className="bg-red-100 text-red-800">
                        <XCircle className="h-3 w-3 mr-1" />
                        OA Needed
                      </Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Proficiency Level</span>
                    <span className="text-sm text-gray-600">{skill.proficiencyLevel}%</span>
                  </div>
                  <Progress value={skill.proficiencyLevel} className="h-2" />
                </div>

                <div className="mb-3">
                  <span className="text-sm font-medium">GitHub Evidence:</span>
                  <ul className="mt-1 space-y-1">
                    {skill.githubEvidence.map((evidence, evidenceIndex) => (
                      <li key={evidenceIndex} className="text-sm text-gray-600 flex items-start space-x-2">
                        <Code className="h-3 w-3 mt-1 text-blue-500 flex-shrink-0" />
                        <span>{evidence}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-2 rounded text-sm">
                  <strong>Analysis:</strong> {skill.reasoning}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Core Competencies Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>Algorithmic Thinking</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">GitHub Score</span>
                <span className="text-2xl font-bold text-indigo-600">{data.algorithmicThinking.score}%</span>
              </div>
              <Progress value={data.algorithmicThinking.score} className="h-3" />
              
              <div className="flex items-center space-x-2">
                {data.algorithmicThinking.oaNeeded ? (
                  <Badge className="bg-red-100 text-red-800">OA Required</Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-800">Sufficiently Demonstrated</Badge>
                )}
              </div>

              <div>
                <span className="text-sm font-medium">Evidence:</span>
                <ul className="mt-1 space-y-1">
                  {data.algorithmicThinking.evidence.map((evidence, index) => (
                    <li key={index} className="text-sm text-gray-600">• {evidence}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Problem Solving</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">GitHub Score</span>
                <span className="text-2xl font-bold text-green-600">{data.problemSolving.score}%</span>
              </div>
              <Progress value={data.problemSolving.score} className="h-3" />
              
              <div className="flex items-center space-x-2">
                {data.problemSolving.oaNeeded ? (
                  <Badge className="bg-red-100 text-red-800">OA Required</Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-800">Sufficiently Demonstrated</Badge>
                )}
              </div>

              <div>
                <span className="text-sm font-medium">Evidence:</span>
                <ul className="mt-1 space-y-1">
                  {data.problemSolving.evidence.map((evidence, index) => (
                    <li key={index} className="text-sm text-gray-600">• {evidence}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Code Quality</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">GitHub Score</span>
                <span className="text-2xl font-bold text-blue-600">{data.codeQuality.score}%</span>
              </div>
              <Progress value={data.codeQuality.score} className="h-3" />
              
              <div className="flex items-center space-x-2">
                {data.codeQuality.oaNeeded ? (
                  <Badge className="bg-red-100 text-red-800">OA Required</Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-800">Sufficiently Demonstrated</Badge>
                )}
              </div>

              <div>
                <span className="text-sm font-medium">Evidence:</span>
                <ul className="mt-1 space-y-1">
                  {data.codeQuality.evidence.map((evidence, index) => (
                    <li key={index} className="text-sm text-gray-600">• {evidence}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Domain Expertise</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">GitHub Score</span>
                <span className="text-2xl font-bold text-purple-600">{data.domainExpertise.score}%</span>
              </div>
              <Progress value={data.domainExpertise.score} className="h-3" />
              
              <div className="flex items-center space-x-2">
                {data.domainExpertise.oaNeeded ? (
                  <Badge className="bg-red-100 text-red-800">OA Required</Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-800">Sufficiently Demonstrated</Badge>
                )}
              </div>

              <div>
                <span className="text-sm font-medium">Evidence:</span>
                <ul className="mt-1 space-y-1">
                  {data.domainExpertise.evidence.map((evidence, index) => (
                    <li key={index} className="text-sm text-gray-600">• {evidence}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 