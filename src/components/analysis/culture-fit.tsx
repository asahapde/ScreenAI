"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  Heart, 
  Target, 
  TrendingUp,
  Clock,
  MessageCircle,
  Building2,
  Coffee,
  Zap,
  Globe,
  BookOpen
} from "lucide-react"

interface CultureValue {
  name: string
  candidateScore: number
  companyScore: number
  match: number
  description: string
}

interface CultureFitProps {
  company: string
  role: string
  data: {
    overallFitScore: number
    values: CultureValue[]
    teamDynamics: {
      leadershipStyle: string
      collaborationScore: number
      independenceScore: number
      mentorshipInterest: number
    }
    growthMindset: {
      learningAgility: number
      adaptability: number
      innovationDrive: number
    }
    companyAlignment: {
      missionAlignment: number
      industryPassion: number
    }
  }
}

export function CultureFitAnalysis({ company, role, data }: CultureFitProps) {
  const getFitColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    if (score >= 50) return 'text-orange-600'
    return 'text-red-600'
  }

  const getFitBgColor = (score: number) => {
    if (score >= 85) return 'bg-green-100'
    if (score >= 70) return 'bg-yellow-100'
    if (score >= 50) return 'bg-orange-100'
    return 'bg-red-100'
  }

  return (
    <div className="space-y-6">
      {/* Overall Culture Fit Score */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-pink-500" />
              <CardTitle>Culture Fit Analysis</CardTitle>
            </div>
            <div className={`text-3xl font-bold ${getFitColor(data.overallFitScore)}`}>
              {data.overallFitScore}%
            </div>
          </div>
          <CardDescription>
            Compatibility analysis with {company} culture and {role} role expectations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Progress value={data.overallFitScore} className="h-3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-3 rounded-lg ${getFitBgColor(data.companyAlignment.missionAlignment)}`}>
              <div className="flex items-center space-x-2 mb-1">
                <Target className="h-4 w-4" />
                <span className="font-medium">Mission Alignment</span>
              </div>
              <div className="text-2xl font-bold">{data.companyAlignment.missionAlignment}%</div>
            </div>
            <div className={`p-3 rounded-lg ${getFitBgColor(data.teamDynamics.collaborationScore)}`}>
              <div className="flex items-center space-x-2 mb-1">
                <Users className="h-4 w-4" />
                <span className="font-medium">Team Collaboration</span>
              </div>
              <div className="text-2xl font-bold">{data.teamDynamics.collaborationScore}%</div>
            </div>
            <div className={`p-3 rounded-lg ${getFitBgColor(data.companyAlignment.industryPassion)}`}>
              <div className="flex items-center space-x-2 mb-1">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Industry Passion</span>
              </div>
              <div className="text-2xl font-bold">{data.companyAlignment.industryPassion}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Values Alignment */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Values Alignment Matrix</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.values.map((value, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{value.name}</span>
                  <Badge className={getFitColor(value.match) + ' bg-transparent border'}>
                    {value.match}% match
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Candidate:</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={value.candidateScore} className="h-2 flex-1" />
                      <span className="w-8">{value.candidateScore}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Company:</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={value.companyScore} className="h-2 flex-1" />
                      <span className="w-8">{value.companyScore}%</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Growth Mindset */}
      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Growth Mindset Assessment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{data.growthMindset.learningAgility}%</div>
              <div className="text-sm text-gray-500">Learning Agility</div>
              <Progress value={data.growthMindset.learningAgility} className="h-2 mt-2" />
            </div>
            <div className="text-center">
              <Globe className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{data.growthMindset.adaptability}%</div>
              <div className="text-sm text-gray-500">Adaptability</div>
              <Progress value={data.growthMindset.adaptability} className="h-2 mt-2" />
            </div>
            <div className="text-center">
              <Zap className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{data.growthMindset.innovationDrive}%</div>
              <div className="text-sm text-gray-500">Innovation Drive</div>
              <Progress value={data.growthMindset.innovationDrive} className="h-2 mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 