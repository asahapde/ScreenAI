"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Brain, FileText, Search, Bot, BarChart3, CheckCircle, AlertCircle, User, Mail, Phone, Calendar, Building2, MapPin, DollarSign, Star, Linkedin, Github, Globe, Sparkles } from "lucide-react"
import { ProgressUpdate, Resume, Job } from "@/types"

// Mock data - in real app this would come from API
  const mockResumes: Resume[] = [
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
      summary: 'Experienced Software Engineer with 5+ years of expertise in full-stack development, AI/ML integration, and scalable system architecture.',
      experience: [
        {
          company: 'TechFlow Solutions',
          position: 'Senior Software Engineer',
          duration: '2022-2024',
          description: 'Led development of AI-powered recruitment platform serving 10,000+ users.'
        }
      ],
      education: [
        {
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science in Computer Science',
          duration: '2015-2019',
          gpa: '3.8'
        }
      ],
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'Machine Learning'],
              socialLinks: {
          linkedin: 'https://linkedin.com/in/abdullah-sahapdeen',
          github: 'https://github.com/asahapde',
          portfolio: 'https://asahap.com'
        }
    },
    status: 'pending',
    jobId: '1',
    aiScore: 96
  },
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
      summary: 'Experienced frontend developer with 6 years of React experience',
      experience: [
        {
          company: 'Google',
          position: 'Senior Frontend Developer',
          duration: '2020-2024',
          description: 'Led frontend development for Google Cloud Console'
        }
      ],
      education: [
        {
          institution: 'Stanford University',
          degree: 'BS Computer Science',
          duration: '2014-2018'
        }
      ],
      skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'Node.js'],
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

const PROCESSING_STEPS = [
  {
    id: "parsing",
    title: "Parsing Resume",
    description: "Extracting text and structured data from resume",
    icon: FileText,
    estimatedTime: "10-15 seconds"
  },
  {
    id: "analyzing",
    title: "AI Analysis",
    description: "Analyzing skills, experience, and job compatibility",
    icon: Bot,
    estimatedTime: "20-30 seconds"
  },
  {
    id: "matching",
    title: "Job Matching",
    description: "Calculating compatibility score with job requirements",
    icon: Search,
    estimatedTime: "15-20 seconds"
  },
  {
    id: "generating",
    title: "Generating Report",
    description: "Creating comprehensive analysis report",
    icon: BarChart3,
    estimatedTime: "5-10 seconds"
  }
]

function ProcessingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const candidateId = searchParams.get("id")
  const fromDashboard = searchParams.get("from") === "dashboard"
  
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState("")
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([])

  // Get candidate and job data
  const candidate = mockResumes.find(r => r.id === candidateId)
  const job = candidate ? mockJobs.find(j => j.id === candidate.jobId) : null

  const startProcessing = useCallback(async () => {
    try {
      // Simulate processing steps
      const steps = [
        { step: "parsing" as const, message: "Extracting text from resume..." },
        { step: "parsing" as const, message: "Identifying contact information..." },
        { step: "parsing" as const, message: "Processing work experience..." },
        { step: "analyzing" as const, message: "Analyzing technical skills..." },
        { step: "analyzing" as const, message: "Evaluating experience relevance..." },
        { step: "analyzing" as const, message: "Assessing cultural fit..." },
        { step: "analyzing" as const, message: "Comparing with job requirements..." },
        { step: "analyzing" as const, message: "Calculating compatibility score..." },
        { step: "generating" as const, message: "Compiling analysis report..." },
        { step: "generating" as const, message: "Finalizing recommendations..." }
      ]

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))
        
        const stepData = steps[i]
        const stepIndex = PROCESSING_STEPS.findIndex(s => s.id === stepData.step)
        const stepProgress = ((i + 1) / steps.length) * 100

        setCurrentStep(stepIndex)
        setProgress(stepProgress)
        setProgressUpdates(prev => [...prev, {
          step: stepData.step,
          message: stepData.message,
          progress: stepProgress
        }])

        if (i === steps.length - 1) {
          setIsComplete(true)
          // Auto-redirect to results after a short delay
          setTimeout(() => {
            const redirectUrl = fromDashboard 
              ? `/results?id=${candidateId}&from=dashboard`
              : `/results?id=${candidateId}`
            router.push(redirectUrl)
          }, 2000)
        }
      }
    } catch (err) {
      setError("Failed to process resume")
    }
  }, [candidateId, router, fromDashboard])

  useEffect(() => {
    if (!candidateId || !candidate) {
      router.push("/dashboard")
      return
    }

    // Start processing
    startProcessing()
  }, [candidateId, candidate, router, startProcessing])

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return "completed"
    if (stepIndex === currentStep) return "active"
    return "pending"
  }

  const getStepIcon = (step: typeof PROCESSING_STEPS[0], status: string) => {
    const IconComponent = step.icon
    
    if (status === "completed") {
      return <CheckCircle className="h-6 w-6 text-green-500" />
    }
    
    if (status === "active") {
      return <IconComponent className="h-6 w-6 text-primary animate-pulse" />
    }
    
    return <IconComponent className="h-6 w-6 text-gray-400" />
  }

  if (!candidate || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="max-w-md w-full bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Candidate Not Found</CardTitle>
            <CardDescription>The candidate you're looking for could not be found.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="max-w-md w-full bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Processing Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <Button asChild className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <Link href="/dashboard">Try Again</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
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
                className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>{fromDashboard ? "Back to Dashboard" : "Back to Home"}</span>
              </Link>
              {!fromDashboard && (
                <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors">
                  <BarChart3 className="h-4 w-4" />
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
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Candidate Info Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Candidate Profile */}
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{candidate.candidateName}</CardTitle>
                      <CardDescription>Candidate Profile</CardDescription>
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

                  {/* Skills Preview */}
                  {candidate.parsedData?.skills && (
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium mb-2">Key Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {candidate.parsedData.skills.slice(0, 6).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.parsedData.skills.length > 6 && (
                          <Badge variant="outline" className="text-xs">
                            +{candidate.parsedData.skills.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Job Context */}
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Job Position</CardTitle>
                      <CardDescription>Analyzing fit for this role</CardDescription>
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

                  {/* Key Requirements */}
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Key Requirements</p>
                    <div className="flex flex-wrap gap-1">
                      {job.requirements.slice(0, 4).map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                      {job.requirements.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{job.requirements.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Processing Area */}
            <div className="lg:col-span-2 space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">
                  {isComplete ? "Analysis Complete!" : `Analyzing ${candidate.candidateName}`}
                </h1>
                <p className="text-xl text-gray-600">
                  {isComplete 
                    ? "Comprehensive candidate analysis is ready for review" 
                    : `Evaluating fit for ${job.title} position`
                  }
                </p>
              </div>

              {/* Overall Progress */}
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    <span>AI Analysis Progress</span>
                  </CardTitle>
                  <CardDescription>
                    {isComplete 
                      ? "Analysis completed successfully" 
                      : `Step ${currentStep + 1} of ${PROCESSING_STEPS.length}`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress 
                      value={isComplete ? 100 : ((currentStep / PROCESSING_STEPS.length) * 100) + (progress / PROCESSING_STEPS.length)} 
                      className="h-3"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Started</span>
                      <span>{isComplete ? "Completed" : "In Progress..."}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Processing Steps */}
              <div className="space-y-4">
                {PROCESSING_STEPS.map((step, index) => {
                  const status = getStepStatus(index)
                  
                  return (
                    <Card key={step.id} className={`transition-all duration-300 bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 ${
                      status === "active" ? "ring-2 ring-primary shadow-lg" : ""
                    }`}>
                      <CardContent className="flex items-center space-x-4 p-6">
                        <div className="flex-shrink-0">
                          {getStepIcon(step, status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className={`text-lg font-semibold ${
                              status === "completed" ? "text-green-600" : 
                              status === "active" ? "text-primary" : "text-gray-400"
                            }`}>
                              {step.title}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {step.estimatedTime}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{step.description}</p>
                          
                          {status === "active" && (
                            <div className="space-y-2">
                              <Progress value={progress} className="h-2" />
                              <p className="text-sm text-gray-500">
                                {Math.round(progress)}% complete
                              </p>
                            </div>
                          )}
                          
                          {status === "completed" && (
                            <div className="flex items-center space-x-2 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm font-medium">Completed</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Live Updates */}
              {progressUpdates.length > 0 && (
                <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bot className="h-5 w-5 text-indigo-600" />
                      <span>Live Processing Updates</span>
                    </CardTitle>
                    <CardDescription>
                      Real-time analysis status for {candidate.candidateName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                                         <div className="space-y-3 max-h-48 overflow-y-auto">
                       {progressUpdates.slice(-8).map((update, index) => (
                         <div key={index} className="flex items-start space-x-3 text-sm">
                           <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                           <div className="flex-1">
                             <span className="text-gray-700">{update.message}</span>
                             <div className="text-xs text-gray-500 mt-1">
                               Step {update.step} - {Math.round(update.progress)}% complete
                             </div>
                           </div>
                         </div>
                       ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Completion Actions */}
              {isComplete && (
                <div className="text-center">
                  <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                    <CardContent className="pt-8 pb-8">
                      <div className="flex items-center justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">
                        Analysis Complete for {candidate.candidateName}!
                      </h3>
                      <p className="text-gray-700 mb-6 max-w-md mx-auto">
                        We've analyzed {candidate.candidateName}'s resume against the {job.title} position requirements. 
                        Your comprehensive compatibility report is ready for review.
                      </p>
                      <div className="flex justify-center space-x-4">
                        <Button asChild size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                          <Link href={fromDashboard ? `/results?id=${candidateId}&from=dashboard` : `/results?id=${candidateId}`}>
                            <Star className="h-4 w-4 mr-2" />
                            View Analysis Report
                          </Link>
                        </Button>
                        <Button variant="outline" asChild size="lg">
                          <Link href="/dashboard">
                            Back to Dashboard
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProcessingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="max-w-md w-full bg-white/60 backdrop-blur-sm border-white/20">
          <CardContent className="pt-6 text-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p>Loading candidate analysis...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <ProcessingContent />
    </Suspense>
  )
}