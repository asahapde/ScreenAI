"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
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
  Clock,
  User,
  Mail,
  Phone,
  Calendar,
  Building2,
  MapPin,
  DollarSign,
  Briefcase,
  GraduationCap,
  Code,
  Target,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Zap,
  BookOpen,
  Sparkles,
  Users
} from "lucide-react"
import { Resume, Job } from "@/types"

// Mock data - same as processing page for consistency
const mockResumes: Resume[] = [
  {
    id: '1',
    candidateName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    uploadedAt: new Date('2024-01-16'),
    fileName: 'sarah_johnson_resume.pdf',
    parsedData: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      summary: 'Experienced frontend developer with 6 years of React experience and strong leadership skills. Passionate about creating exceptional user experiences and mentoring junior developers.',
      experience: [
        {
          company: 'Google',
          position: 'Senior Frontend Developer',
          duration: '2020-2024',
          description: 'Led frontend development for Google Cloud Console, managing a team of 5 developers and implementing new React-based features used by millions of users daily.'
        },
        {
          company: 'Facebook',
          position: 'Frontend Developer',
          duration: '2018-2020',
          description: 'Developed user-facing features for Facebook main platform, focusing on performance optimization and accessibility improvements.'
        }
      ],
      education: [
        {
          institution: 'Stanford University',
          degree: 'BS Computer Science',
          duration: '2014-2018'
        }
      ],
      skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Node.js', 'GraphQL', 'Redux', 'Jest', 'AWS', 'Docker'],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        github: 'https://github.com/sarahjohnson'
      }
    },
    status: 'pending',
    jobId: '1',
    aiScore: 92,
    notes: 'Excellent candidate with strong React background'
  },
  {
    id: '2',
    candidateName: 'Michael Chen',
    email: 'michael.chen@email.com',
    uploadedAt: new Date('2024-01-14'),
    fileName: 'michael_chen_resume.pdf',
    parsedData: {
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      summary: 'Full-stack developer with expertise in Node.js and React',
      experience: [
        {
          company: 'Microsoft',
          position: 'Software Engineer',
          duration: '2019-2024',
          description: 'Built scalable web applications'
        }
      ],
      education: [
        {
          institution: 'UC Berkeley',
          degree: 'MS Computer Science',
          duration: '2017-2019'
        }
      ],
      skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
      socialLinks: {
        github: 'https://github.com/michaelchen'
      }
    },
    status: 'pending',
    jobId: '2',
    aiScore: 88
  },
  {
    id: '3',
    candidateName: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    uploadedAt: new Date('2024-01-12'),
    fileName: 'emily_rodriguez_resume.pdf',
    parsedData: {
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      summary: 'DevOps engineer with cloud infrastructure expertise',
      experience: [
        {
          company: 'Amazon',
          position: 'DevOps Engineer',
          duration: '2018-2024',
          description: 'Managed AWS infrastructure for e-commerce platform'
        }
      ],
      education: [
        {
          institution: 'MIT',
          degree: 'BS Computer Engineering',
          duration: '2014-2018'
        }
      ],
      skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Python'],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/emilyrodriguez'
      }
    },
    status: 'pending',
    jobId: '3',
    aiScore: 95
  },
  {
    id: 'abdullah',
    candidateName: 'Abdullah Sahapde',
    email: 'asahapde@gmail.com',
    phone: '+1 (555) 123-4567',
    uploadedAt: new Date('2024-01-20'),
    fileName: 'abdullah_sahapde_resume.pdf',
          parsedData: {
        name: 'Abdullah Sahapde',
        email: 'asahapde@gmail.com',
      phone: '+1 (555) 123-4567',
      summary: 'Experienced Software Engineer with 5+ years of expertise in full-stack development, AI/ML integration, and scalable system architecture. Proven track record in building high-performance applications using React, Node.js, Python, and cloud technologies. Strong background in startup environments with experience leading technical teams and delivering products from concept to production.',
      experience: [
        {
          company: 'TechFlow Solutions',
          position: 'Senior Software Engineer',
          duration: '2022-2024',
          description: 'Led development of AI-powered recruitment platform serving 10,000+ users. Built scalable microservices architecture using Node.js, React, and AWS. Implemented machine learning models for candidate screening, reducing manual review time by 70%. Mentored junior developers and established code review processes.',
          technologies: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'Redis', 'Machine Learning']
        },
        {
          company: 'StartupLaunch Inc.',
          position: 'Full Stack Developer',
          duration: '2020-2022',
          description: 'Built end-to-end web applications for multiple client projects. Developed responsive frontends using React and TypeScript, RESTful APIs with Express.js, and integrated third-party services. Collaborated with design teams to create seamless user experiences and implemented CI/CD pipelines.',
          technologies: ['React', 'TypeScript', 'Express.js', 'MongoDB', 'GraphQL', 'Jest', 'GitHub Actions']
        },
        {
          company: 'Digital Innovations',
          position: 'Software Developer',
          duration: '2019-2020',
          description: 'Developed and maintained client-facing web applications. Worked with legacy systems migration to modern tech stack. Participated in agile development processes and contributed to technical documentation. Gained experience in database optimization and API design.',
          technologies: ['JavaScript', 'React', 'Node.js', 'MySQL', 'Git', 'Linux']
        }
      ],
      education: [
        {
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science in Computer Science',
          duration: '2015-2019',
          gpa: '3.8'
        },
        {
          institution: 'Stanford Online',
          degree: 'Machine Learning Specialization',
          duration: '2021',
          gpa: 'Certificate'
        }
      ],
      skills: [
        'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Django', 'Flask',
        'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'Redis',
        'GraphQL', 'REST APIs', 'Machine Learning', 'TensorFlow', 'PyTorch',
        'Git', 'Linux', 'CI/CD', 'Jest', 'Cypress', 'Agile', 'Microservices'
      ],
      certifications: [
        'AWS Certified Solutions Architect',
        'Google Cloud Professional Developer',
        'Machine Learning Engineer Certification'
      ],
              socialLinks: {
          linkedin: 'https://linkedin.com/in/abdullah-sahapdeen',
          github: 'https://github.com/asahapde',
          portfolio: 'https://asahap.com',
          twitter: 'https://twitter.com/asahapde'
        }
    },
    status: 'pending',
    jobId: '1',
    aiScore: 96,
    notes: 'Outstanding candidate with exceptional GitHub portfolio and strong technical leadership experience'
  }
]

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    description: 'We are looking for an experienced Frontend Developer to join our team and help build amazing user experiences.',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: '$120,000 - $160,000',
    requirements: ['React', 'TypeScript', '5+ years experience', 'Team leadership'],
    benefits: ['Health insurance', 'Remote work', '401(k)', 'Stock options'],
    createdAt: new Date('2024-01-15'),
    status: 'active',
    applicantCount: 12
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    description: 'Join our engineering team to build scalable web applications using modern technologies.',
    company: 'StartupXYZ',
    location: 'Remote',
    salary: '$90,000 - $130,000',
    requirements: ['Node.js', 'React', 'MongoDB', '3+ years experience'],
    benefits: ['Flexible hours', 'Learning budget', 'Health insurance'],
    createdAt: new Date('2024-01-10'),
    status: 'active',
    applicantCount: 8
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    description: 'Help us scale our infrastructure and improve deployment processes.',
    company: 'CloudTech Solutions',
    location: 'Austin, TX',
    salary: '$110,000 - $150,000',
    requirements: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    benefits: ['Stock options', 'Gym membership', 'Conferences'],
    createdAt: new Date('2024-01-05'),
    status: 'active',
    applicantCount: 15
  }
]

// Mock analysis data
const generateAnalysisData = (candidate: Resume, job: Job) => {
  // Check if this is Abdullah's profile
  if (candidate.candidateName === 'Abdullah Sahapde') {
    return generateAbdullahAnalysisData()
  }
  
  const candidateSkills = candidate.parsedData?.skills || []
  const jobRequirements = job.requirements
  
  const matchingSkills = candidateSkills.filter(skill => 
    jobRequirements.some(req => req.toLowerCase().includes(skill.toLowerCase()))
  )
  
  const matchPercentage = Math.round((matchingSkills.length / jobRequirements.length) * 100)
  
  return {
    overallScore: candidate.aiScore || 85,
    matchPercentage,
    matchingSkills,
    missingSkills: jobRequirements.filter(req => 
      !candidateSkills.some(skill => skill.toLowerCase().includes(req.toLowerCase()))
    ),
    strengths: [
      `Strong experience in ${matchingSkills.slice(0, 3).join(', ')}`,
      `${candidate.parsedData?.experience?.length || 0}+ years of relevant work experience`,
      'Excellent educational background',
      'Active online presence and portfolio'
    ],
    concerns: [
      `Limited experience in ${jobRequirements.filter(req => !matchingSkills.includes(req)).slice(0, 2).join(', ')}`,
      'May require additional training in specific technologies'
    ],
    recommendation: matchPercentage >= 80 ? 'Strong Match' : matchPercentage >= 60 ? 'Good Match' : 'Partial Match'
  }
}

// Enhanced analysis data generator for Abdullah
const generateAbdullahAnalysisData = () => {
  return {
    overallScore: 96,
    matchPercentage: 92,
    matchingSkills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'Machine Learning'],
    missingSkills: ['Team leadership experience (demonstrated through GitHub)'],
    strengths: [
      'Exceptional GitHub portfolio with 1,139 total stars across projects',
      '6 high-quality open source projects with detailed documentation',
      'Strong expertise in AI/ML with real-world implementations',
      'Proven track record of building scalable microservices architecture',
      'Active contributor with 2,847 GitHub contributions and consistent commit patterns',
      'Well-rounded skill set spanning frontend, backend, and DevOps',
      '500+ LinkedIn connections indicating strong professional network',
      'Multiple certifications from AWS, Google Cloud, and ML specializations'
    ],
    concerns: [
      'High performer - may have high salary expectations',
      'Very active on GitHub - ensure commitment to company projects'
    ],
    recommendation: 'Exceptional Match',
    githubAnalysis: {
      topProjects: [
        {
          name: 'ScreenAI',
          description: 'AI-powered candidate screening platform with automated resume analysis and social media verification',
          language: 'TypeScript',
          stars: 87,
          forks: 23,
          impact: 'Current project - highly relevant to recruitment domain',
          technologies: ['AI', 'React', 'Node.js', 'Machine Learning'],
          homepage: 'https://screenai-demo.vercel.app'
        },
        {
          name: 'microservices-ecommerce',
          description: 'Scalable e-commerce platform built with microservices architecture using Node.js, Docker, and Kubernetes',
          language: 'JavaScript',
          stars: 321,
          forks: 89,
          impact: 'Demonstrates expertise in scalable architecture design',
          technologies: ['Microservices', 'Node.js', 'Docker', 'Kubernetes']
        },
        {
          name: 'react-dashboard-kit',
          description: 'Modern React dashboard template with TypeScript, Tailwind CSS, and Chart.js integration',
          language: 'TypeScript',
          stars: 234,
          forks: 67,
          impact: 'Shows frontend expertise and open source contribution',
          technologies: ['React', 'TypeScript', 'Tailwind CSS'],
          homepage: 'https://react-dashboard-kit.vercel.app'
        },
        {
          name: 'ml-price-predictor',
          description: 'Machine learning model for real estate price prediction using Python, scikit-learn, and Flask API',
          language: 'Python',
          stars: 156,
          forks: 42,
          impact: 'Demonstrates ML/AI capabilities with practical application',
          technologies: ['Python', 'Machine Learning', 'Flask', 'scikit-learn']
        }
      ],
      metrics: {
        totalStars: 1139,
        totalForks: 334,
        contributions: 2847,
        publicRepos: 42,
        followers: 324,
        languageDiversity: 8.5,
        consistencyScore: 9.2,
        qualityScore: 9.1
      },
      languageDistribution: {
        'TypeScript': 35,
        'JavaScript': 28,
        'Python': 20,
        'Java': 8,
        'Go': 6,
        'Rust': 3
      },
      commitPattern: {
        frequency: 'Very Active',
        recentActivity: 245,
        activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        activeHours: '9-11, 14-16, 19-21'
      }
    },
    linkedinAnalysis: {
      profile: {
        headline: 'Senior Software Engineer | Full-Stack Developer | AI/ML Enthusiast | Building Scalable Solutions',
        connections: 500,
        experience: [
          {
            company: 'TechFlow Solutions',
            position: 'Senior Software Engineer',
            duration: '2022 - Present',
            keyAchievements: [
              'Led AI-powered recruitment platform development',
              'Served 10,000+ users with scalable architecture',
              'Reduced manual review time by 70% through ML implementation',
              'Mentored junior developers and established best practices'
            ]
          },
          {
            company: 'StartupLaunch Inc.',
            position: 'Full Stack Developer',
            duration: '2020 - 2022',
            keyAchievements: [
              'Delivered multiple client projects on time and budget',
              'Built responsive frontends and RESTful APIs',
              'Implemented CI/CD pipelines and automated testing'
            ]
          }
        ],
        topSkills: [
          { name: 'React', endorsements: 94 },
          { name: 'JavaScript', endorsements: 87 },
          { name: 'Node.js', endorsements: 82 },
          { name: 'TypeScript', endorsements: 76 },
          { name: 'AWS', endorsements: 71 },
          { name: 'Python', endorsements: 69 }
        ],
        education: [
          'UC Berkeley - BS Computer Science (3.8 GPA)',
          'Stanford Online - Machine Learning Specialization'
        ]
      }
    }
  }
}

function ResultsContent() {
  const searchParams = useSearchParams()
  const candidateId = searchParams.get("id")
  const fromDashboard = searchParams.get("from") === "dashboard"
  const [loading, setLoading] = useState(true)

  // Get candidate and job data
  const candidate = mockResumes.find(r => r.id === candidateId)
  const job = candidate ? mockJobs.find(j => j.id === candidate.jobId) : null
  const analysis = candidate && job ? generateAnalysisData(candidate, job) : null

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100"
    if (score >= 60) return "bg-yellow-100"
    return "bg-red-100"
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

  if (!candidate || !job || !analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="max-w-md w-full bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Analysis Not Found</CardTitle>
            <CardDescription>The analysis results could not be loaded.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="bg-gradient-to-r from-indigo-600 to-purple-600">
              <Link href="/dashboard">Back to Dashboard</Link>
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
              <Link 
                href={fromDashboard ? "/dashboard" : "/"} 
                className="flex items-center space-x-2 text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>{fromDashboard ? "Back to Dashboard" : "Back to Home"}</span>
              </Link>
              {!fromDashboard && (
                <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600">
                  <FileText className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Brain className="h-8 w-8 text-indigo-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">ScreenAI</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header with Candidate Info */}
          <div className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Candidate Profile */}
              <div className="lg:col-span-1">
                <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{candidate.candidateName}</CardTitle>
                        <CardDescription>Candidate Analysis</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{candidate.email}</span>
                      </div>
                      {candidate.phone && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{candidate.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>Applied {candidate.uploadedAt.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="truncate">{candidate.fileName}</span>
                      </div>
                    </div>

                    {/* Social Links */}
                    {candidate.parsedData?.socialLinks && (
                      <div className="pt-4 border-t">
                        <p className="text-sm font-medium mb-2">Social Profiles</p>
                        <div className="flex space-x-2">
                          {candidate.parsedData.socialLinks.linkedin && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={candidate.parsedData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                                <Linkedin className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          {candidate.parsedData.socialLinks.github && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={candidate.parsedData.socialLinks.github} target="_blank" rel="noopener noreferrer">
                                <Github className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          {candidate.parsedData.socialLinks.portfolio && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={candidate.parsedData.socialLinks.portfolio} target="_blank" rel="noopener noreferrer">
                                <Globe className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Job Context */}
              <div className="lg:col-span-1">
                <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <Briefcase className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Position</CardTitle>
                        <CardDescription>Job Requirements</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <div className="space-y-2 mt-3">
                        <div className="flex items-center space-x-2 text-sm">
                          <Building2 className="h-4 w-4 text-gray-500" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span>{job.salary}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Overall Score */}
              <div className="lg:col-span-1">
                <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getScoreBgColor(analysis.overallScore)}`}>
                        <Star className={`h-8 w-8 ${getScoreColor(analysis.overallScore)}`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Overall Score</CardTitle>
                        <CardDescription>AI Analysis Result</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className={`text-4xl font-bold mb-2 ${getScoreColor(analysis.overallScore)}`}>
                        {analysis.overallScore}%
                      </div>
                      <Badge variant={analysis.overallScore >= 80 ? "default" : analysis.overallScore >= 60 ? "secondary" : "destructive"}>
                        {analysis.recommendation}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Analysis Content */}
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className={`grid w-full ${candidate.candidateName === 'Abdullah Sahapde' ? 'grid-cols-7' : 'grid-cols-5'} bg-white/60 backdrop-blur-sm border-white/20`}>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="skills">Skills Match</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              {candidate.candidateName === 'Abdullah Sahapde' && (
                <>
                  <TabsTrigger value="github">GitHub Analysis</TabsTrigger>
                  <TabsTrigger value="linkedin">LinkedIn Analysis</TabsTrigger>
                </>
              )}
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>

            {/* GitHub Analysis Tab - Only for Abdullah */}
            {candidate.candidateName === 'Abdullah Sahapde' && (
              <TabsContent value="github" className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* GitHub Profile Overview */}
                  <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Github className="h-5 w-5 text-gray-900" />
                        <span>GitHub Profile Analysis</span>
                        <Badge variant="default" className="bg-green-600">Outstanding</Badge>
                      </CardTitle>
                      <CardDescription>
                        Comprehensive analysis of {candidate.candidateName}'s GitHub activity and projects
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* GitHub Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600 mb-1">1,139</div>
                          <p className="text-sm text-blue-700">Total Stars</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 mb-1">2,847</div>
                          <p className="text-sm text-green-700">Contributions</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600 mb-1">42</div>
                          <p className="text-sm text-purple-700">Public Repos</p>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600 mb-1">324</div>
                          <p className="text-sm text-orange-700">Followers</p>
                        </div>
                      </div>

                      {/* Language Distribution */}
                      <div>
                        <h4 className="font-semibold mb-3">Language Distribution</h4>
                        <div className="space-y-2">
                          {Object.entries(generateAbdullahAnalysisData().githubAnalysis.languageDistribution).map(([lang, percentage]) => (
                            <div key={lang} className="flex items-center justify-between">
                              <span className="text-sm font-medium">{lang}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-indigo-600 h-2 rounded-full" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-600 w-8">{percentage}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Commit Activity */}
                      <div>
                        <h4 className="font-semibold mb-3">Commit Activity Analysis</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-gray-600">Frequency</p>
                            <p className="text-lg font-bold text-green-600">Very Active</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-gray-600">Recent Activity</p>
                            <p className="text-lg font-bold text-blue-600">245 commits</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-gray-600">Consistency Score</p>
                            <p className="text-lg font-bold text-purple-600">9.2/10</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top GitHub Projects */}
                  <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span>Top GitHub Projects</span>
                      </CardTitle>
                      <CardDescription>
                        Most impactful repositories demonstrating technical expertise
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {generateAbdullahAnalysisData().githubAnalysis.topProjects.map((project, index) => (
                          <div key={index} className="border rounded-lg p-6 bg-gray-50/50">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h4 className="font-semibold text-lg">{project.name}</h4>
                                  {project.homepage && (
                                    <Button size="sm" variant="outline" asChild>
                                      <a href={project.homepage} target="_blank" rel="noopener noreferrer">
                                        <Globe className="h-3 w-3 mr-1" />
                                        Live Demo
                                      </a>
                                    </Button>
                                  )}
                                </div>
                                <p className="text-gray-700 mb-3">{project.description}</p>
                                <p className="text-sm text-indigo-600 font-medium mb-3">{project.impact}</p>
                              </div>
                              <div className="text-right ml-4">
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                                    {project.stars}
                                  </div>
                                  <div className="flex items-center">
                                    <Github className="h-4 w-4 mr-1" />
                                    {project.forks}
                                  </div>
                                </div>
                                <Badge variant="secondary" className="mt-2">{project.language}</Badge>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech, techIndex) => (
                                <Badge key={techIndex} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            )}

            {/* LinkedIn Analysis Tab - Only for Abdullah */}
            {candidate.candidateName === 'Abdullah Sahapde' && (
              <TabsContent value="linkedin" className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* LinkedIn Profile Overview */}
                  <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Linkedin className="h-5 w-5 text-blue-600" />
                        <span>LinkedIn Profile Analysis</span>
                        <Badge variant="default" className="bg-blue-600">Professional</Badge>
                      </CardTitle>
                      <CardDescription>
                        Professional networking profile and career progression analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Profile Summary */}
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h4 className="font-semibold mb-2">{generateAbdullahAnalysisData().linkedinAnalysis.profile.headline}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            500+ connections
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            San Francisco, CA
                          </div>
                        </div>
                      </div>

                      {/* Professional Experience Highlights */}
                      <div>
                        <h4 className="font-semibold mb-4">Professional Experience Highlights</h4>
                        <div className="space-y-4">
                          {generateAbdullahAnalysisData().linkedinAnalysis.profile.experience.map((exp, index) => (
                            <div key={index} className="border-l-4 border-blue-200 pl-4 pb-4">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h5 className="font-semibold">{exp.position}</h5>
                                  <p className="text-blue-600 font-medium">{exp.company}</p>
                                  <p className="text-sm text-gray-500">{exp.duration}</p>
                                </div>
                              </div>
                              <div className="mt-3">
                                <p className="text-sm font-medium mb-2">Key Achievements:</p>
                                <ul className="space-y-1">
                                  {exp.keyAchievements.map((achievement, achIndex) => (
                                    <li key={achIndex} className="flex items-start text-sm text-gray-700">
                                      <CheckCircle className="h-3 w-3 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                      {achievement}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Top Skills with Endorsements */}
                      <div>
                        <h4 className="font-semibold mb-4">Top Skills & Endorsements</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {generateAbdullahAnalysisData().linkedinAnalysis.profile.topSkills.map((skill, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="font-medium">{skill.name}</span>
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary">{skill.endorsements} endorsements</Badge>
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${Math.min(skill.endorsements, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Education */}
                      <div>
                        <h4 className="font-semibold mb-3">Education</h4>
                        <div className="space-y-2">
                          {generateAbdullahAnalysisData().linkedinAnalysis.profile.education.map((edu, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <GraduationCap className="h-4 w-4 text-indigo-600" />
                              <span className="text-sm">{edu}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            )}

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Skills Match */}
                <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-indigo-600" />
                      <span>Skills Match</span>
                    </CardTitle>
                    <CardDescription>
                      {analysis.matchingSkills.length} of {job.requirements.length} requirements met
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Match Percentage</span>
                      <span className={`text-lg font-bold ${getScoreColor(analysis.matchPercentage)}`}>
                        {analysis.matchPercentage}%
                      </span>
                    </div>
                    <Progress value={analysis.matchPercentage} className="h-3" />
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-green-600 mb-2 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Matching Skills
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {analysis.matchingSkills.map((skill, index) => (
                            <Badge key={index} variant="default" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {analysis.missingSkills.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-orange-600 mb-2 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Areas for Development
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {analysis.missingSkills.map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Key Strengths */}
                <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <ThumbsUp className="h-5 w-5 text-green-600" />
                      <span>Key Strengths</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysis.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Areas of Concern */}
                {analysis.concerns.length > 0 && (
                  <Card className="bg-white/60 backdrop-blur-sm border-white/20 lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        <span>Areas for Consideration</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {analysis.concerns.map((concern, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{concern}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-6">
              <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Code className="h-5 w-5 text-indigo-600" />
                    <span>Technical Skills Analysis</span>
                  </CardTitle>
                  <CardDescription>
                    Comprehensive breakdown of candidate's technical capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Zap className="h-4 w-4 mr-2 text-green-600" />
                        All Candidate Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {candidate.parsedData?.skills?.map((skill, index) => (
                          <Badge 
                            key={index} 
                            variant={analysis.matchingSkills.includes(skill) ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Target className="h-4 w-4 mr-2 text-blue-600" />
                        Job Requirements
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req, index) => (
                          <Badge 
                            key={index} 
                            variant={analysis.matchingSkills.some(skill => 
                              skill.toLowerCase().includes(req.toLowerCase())
                            ) ? "default" : "outline"}
                            className="text-xs"
                          >
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience" className="space-y-6">
              <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Briefcase className="h-5 w-5 text-indigo-600" />
                    <span>Work Experience</span>
                  </CardTitle>
                  <CardDescription>
                    Professional background and career progression
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {candidate.parsedData?.experience?.map((exp, index) => (
                      <div key={index} className="border-l-2 border-indigo-200 pl-4 pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{exp.position}</h4>
                            <p className="text-indigo-600 font-medium">{exp.company}</p>
                            <p className="text-sm text-gray-500 mb-2">{exp.duration}</p>
                            <p className="text-gray-700">{exp.description}</p>
                          </div>
                          <Badge variant="outline" className="ml-4">
                            {exp.duration.split('-').length > 1 ? 
                              `${exp.duration.split('-')[1]} - ${exp.duration.split('-')[0]}` : 
                              exp.duration
                            }
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education" className="space-y-6">
              <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <GraduationCap className="h-5 w-5 text-indigo-600" />
                    <span>Education Background</span>
                  </CardTitle>
                  <CardDescription>
                    Academic qualifications and achievements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {candidate.parsedData?.education?.map((edu, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-gray-50/50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{edu.degree}</h4>
                            <p className="text-indigo-600 font-medium">{edu.institution}</p>
                            <p className="text-sm text-gray-500">{edu.duration}</p>
                          </div>
                          <Badge variant="secondary">
                            {edu.duration}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Summary Tab */}
            <TabsContent value="summary" className="space-y-6">
              <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    <span>Executive Summary</span>
                  </CardTitle>
                  <CardDescription>
                    AI-powered analysis summary for {candidate.candidateName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
                    <p className="text-gray-800 leading-relaxed">
                      {candidate.parsedData?.summary || `${candidate.candidateName} is a qualified candidate with relevant experience in the technology sector. Based on our analysis, they demonstrate strong technical capabilities and professional background that align well with the ${job.title} position at ${job.company}.`}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {analysis.overallScore}%
                      </div>
                      <p className="text-sm text-green-700">Overall Match</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {analysis.matchingSkills.length}
                      </div>
                      <p className="text-sm text-blue-700">Skills Matched</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {candidate.parsedData?.experience?.length || 0}
                      </div>
                      <p className="text-sm text-purple-700">Years Experience</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h4 className="font-semibold mb-4">Recommendation</h4>
                    <div className={`p-4 rounded-lg ${
                      analysis.overallScore >= 80 ? 'bg-green-50 border border-green-200' :
                      analysis.overallScore >= 60 ? 'bg-yellow-50 border border-yellow-200' :
                      'bg-red-50 border border-red-200'
                    }`}>
                      <p className={`font-medium ${
                        analysis.overallScore >= 80 ? 'text-green-800' :
                        analysis.overallScore >= 60 ? 'text-yellow-800' :
                        'text-red-800'
                      }`}>
                        {analysis.recommendation}: {candidate.candidateName}
                      </p>
                      <p className={`text-sm mt-1 ${
                        analysis.overallScore >= 80 ? 'text-green-700' :
                        analysis.overallScore >= 60 ? 'text-yellow-700' :
                        'text-red-700'
                      }`}>
                        {analysis.overallScore >= 80 
                          ? 'This candidate demonstrates excellent alignment with the job requirements and should be prioritized for interview.'
                          : analysis.overallScore >= 60
                          ? 'This candidate shows good potential with some areas that may need development or training.'
                          : 'This candidate may require significant additional training or may not be the best fit for this specific role.'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4 pt-6">
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600">
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                    <Button variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Analysis
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-indigo-600 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Loading analysis results...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}