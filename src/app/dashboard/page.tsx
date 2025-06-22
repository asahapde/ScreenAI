'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { 
  Plus, 
  Briefcase, 
  Users, 
  MessageCircle, 
  Send, 
  Building2, 
  MapPin, 
  DollarSign,
  Calendar,
  FileText,
  Mail,
  Phone,
  Star,
  Eye,
  Filter,
  Search,
  Sparkles,
  Brain,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Pause,
  Upload,
  Home,
  ArrowLeft,
  X,
  Loader2,
  Linkedin,
  Github,
  Globe
} from "lucide-react"
import { Job, Resume, ChatMessage, ParsedResume } from '@/types'
import { formatFileSize, validateFileType, generateId } from "@/lib/utils"

// Mock data - will be replaced with real data later
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
    status: 'paused',
    applicantCount: 15
  }
]

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

export default function Dashboard() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const lastParsedFileRef = useRef<string | null>(null)
  
  const [activeTab, setActiveTab] = useState('jobs')
  const [jobs, setJobs] = useState<Job[]>(mockJobs)
  const [resumes, setResumes] = useState<Resume[]>(mockResumes)
  const [showJobCreator, setShowJobCreator] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showJobDetails, setShowJobDetails] = useState(false)
  const [showResumeDetails, setShowResumeDetails] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentMessage, setCurrentMessage] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Add new state for edit job and resume viewing
  const [showEditJob, setShowEditJob] = useState(false)
  const [showRawResume, setShowRawResume] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [editJobForm, setEditJobForm] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    salary: '',
    requirements: [] as string[],
    benefits: [] as string[],
    status: 'active' as 'active' | 'paused' | 'closed'
  })

  // Resume upload states
  const [resume, setResume] = useState<File | null>(null)
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [parseComplete, setParseComplete] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [uploadFormData, setUploadFormData] = useState({
    linkedin: "",
    github: "",
    portfolio: "",
    extraContext: "",
    selectedJobId: ""
  })

  const allowedFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/x-pdf",
    "application/acrobat",
    "applications/vnd.pdf",
    "text/pdf",
    "text/x-pdf"
  ]

  const allowedExtensions = [".pdf", ".doc", ".docx"]

  // Auto-parse resume when file is selected
  useEffect(() => {
    if (resume && !isParsing && lastParsedFileRef.current !== resume.name) {
      lastParsedFileRef.current = resume.name
      parseResumeFile(resume)
    }
  }, [resume])

  const parseResumeFile = async (file: File) => {
    setIsParsing(true)
    setParseComplete(false)
    setUploadError("")
    
    try {
      const formData = new FormData()
      formData.append("file", file)
      
      const response = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData
      })
      
      if (!response.ok) {
        throw new Error("Failed to parse resume")
      }
      
      const result = await response.json()
      const parsed = result.parsed || result
      setParsedResume(parsed)
      
      // Auto-fill online presence fields if found in resume
      if (parsed.socialLinks) {
        setUploadFormData(prev => ({
          ...prev,
          linkedin: parsed.socialLinks.linkedin || prev.linkedin,
          github: parsed.socialLinks.github || prev.github,
          portfolio: parsed.socialLinks.portfolio || prev.portfolio
        }))
      }
      
      // Auto-fill additional context with skills and summary
      if (parsed.skills || parsed.summary) {
        const context: string[] = []
        if (parsed.summary) context.push(`Summary: ${parsed.summary}`)
        if (parsed.skills && parsed.skills.length > 0) {
          context.push(`Skills: ${parsed.skills.join(", ")}`)
        }
        setUploadFormData(prev => ({
          ...prev,
          extraContext: context.join("\n\n")
        }))
      }
      
      setParseComplete(true)
    } catch (err) {
      console.error("Resume parsing error:", err)
      setUploadError("Failed to parse resume automatically. You can still proceed manually.")
    } finally {
      setIsParsing(false)
    }
  }

  const validateFile = (file: File): boolean => {
    if (allowedFileTypes.includes(file.type)) {
      return true
    }
    const fileName = file.name.toLowerCase()
    return allowedExtensions.some(ext => fileName.endsWith(ext))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    setUploadError("")
    
    if (!validateFile(file)) {
      setUploadError("Please upload a PDF or Word document")
      return
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size must be less than 10MB")
      return
    }
    
    setResume(file)
    setParsedResume(null)
    setParseComplete(false)
  }

  const handleUploadAreaClick = () => {
    if (!resume && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleUploadInputChange = (field: string, value: string) => {
    setUploadFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleRemoveFile = () => {
    setResume(null)
    setParsedResume(null)
    setParseComplete(false)
    setIsParsing(false)
    setUploadError("")
    lastParsedFileRef.current = null
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resume) return

    setIsUploading(true)
    setUploadError("")

    try {
      const formData = new FormData()
      formData.append("resume", resume)
      formData.append("candidateData", JSON.stringify({
        socialLinks: {
          linkedin: uploadFormData.linkedin || 'https://linkedin.com/in/abdullah-sahapdeen',
          github: uploadFormData.github || 'https://github.com/asahapde',
          portfolio: uploadFormData.portfolio || 'https://asahap.com'
        },
        extraContext: uploadFormData.extraContext || 'Experienced Software Engineer with 5+ years of expertise in full-stack development, AI/ML integration, and scalable system architecture.',
        jobDescription: uploadFormData.selectedJobId ? 
          jobs.find(job => job.id === uploadFormData.selectedJobId) : null
      }))

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Upload failed with status ${response.status}`)
      }

      const result = await response.json()
      
      // If this is Abdullah's resume, show processing flow then redirect
      if (result.isAbdullah) {
        // Show upload success briefly
        setUploadError("")
        
        // Show success message during processing
        const successMessage = "✅ Resume uploaded successfully! Analyzing candidate profile..."
        
        // Simulate processing time with status updates
        setTimeout(() => {
          setIsUploading(false)
          setShowUploadModal(false)
          
          // Reset form
          setResume(null)
          setParsedResume(null)
          setParseComplete(false)
          setUploadFormData({
            linkedin: "",
            github: "",
            portfolio: "",
            extraContext: "",
            selectedJobId: ""
          })
          
          // Redirect to processing page first, then to results
          router.push('/processing?id=abdullah&from=dashboard')
        }, 1500) // Show success for 1.5 seconds
        return
      }
      
      // Calculate job recommendations or use selected job
      let recommendedJobs: Array<{jobId: string, score: number}> = []
      let selectedJobId = uploadFormData.selectedJobId
      
      if (!selectedJobId) {
        // Test against all jobs and generate recommendations
        recommendedJobs = jobs.map(job => ({
          jobId: job.id,
          score: Math.floor(Math.random() * 40) + 60 // Mock scores 60-100
        })).sort((a, b) => b.score - a.score)
        
        // Use the best match as default
        selectedJobId = recommendedJobs[0]?.jobId || jobs[0]?.id || '1'
      } else {
        // Single job selected
        recommendedJobs = [{
          jobId: selectedJobId,
          score: Math.floor(Math.random() * 30) + 70
        }]
      }

      // Add new resume to the list
      const newResume: Resume = {
        id: generateId(),
        candidateName: parsedResume?.name || 'Unknown Candidate',
        email: parsedResume?.email || uploadFormData.linkedin,
        phone: parsedResume?.phone,
        uploadedAt: new Date(),
        fileName: resume.name,
        parsedData: parsedResume || {
          name: 'Unknown',
          email: '',
          skills: [],
          experience: [],
          education: [],
          socialLinks: {
            linkedin: uploadFormData.linkedin,
            github: uploadFormData.github,
            portfolio: uploadFormData.portfolio
          }
        },
        status: 'pending',
        jobId: selectedJobId,
        aiScore: recommendedJobs[0]?.score || Math.floor(Math.random() * 30) + 70,
        jobRecommendations: recommendedJobs.length > 1 ? recommendedJobs : undefined,
        notes: !uploadFormData.selectedJobId ? 
          `Tested against ${jobs.length} jobs. Top matches: ${recommendedJobs.slice(0, 3).map(r => {
            const job = jobs.find(j => j.id === r.jobId)
            return `${job?.title} (${r.score}%)`
          }).join(', ')}` : undefined
      }

      setResumes(prev => [newResume, ...prev])
      
      // Reset upload form
      setShowUploadModal(false)
      setResume(null)
      setParsedResume(null)
      setParseComplete(false)
      setUploadFormData({
        linkedin: "",
        github: "",
        portfolio: "",
        extraContext: "",
        selectedJobId: ""
      })
      
      // Switch to resumes tab to show the new upload
      setActiveTab('resumes')
      
    } catch (error) {
      console.error("Upload error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to upload resume. Please try again."
      setUploadError(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/create-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentMessage,
          conversationHistory: chatMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      })

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }

      setChatMessages(prev => [...prev, assistantMessage])

      if (data.jobData) {
        setJobs(prev => [data.jobData, ...prev])
        setShowJobCreator(false)
        setChatMessages([])
        setActiveTab('jobs')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'shortlisted': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'reviewed': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'paused': return <Pause className="h-4 w-4" />
      case 'closed': return <XCircle className="h-4 w-4" />
      case 'shortlisted': return <Star className="h-4 w-4" />
      case 'reviewed': return <Eye className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || job.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const filteredResumes = resumes.filter(resume => {
    const matchesSearch = resume.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resume.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || resume.status === filterStatus
    return matchesSearch && matchesFilter
  })

  // New handlers for edit job functionality
  const handleEditJob = (job: Job) => {
    setEditingJob(job)
    setEditJobForm({
      title: job.title,
      description: job.description,
      company: job.company,
      location: job.location || '',
      salary: job.salary || '',
      requirements: [...job.requirements],
      benefits: job.benefits ? [...job.benefits] : [],
      status: job.status
    })
    setShowEditJob(true)
  }

  const handleSaveJob = () => {
    if (!editingJob) return
    
    const updatedJob: Job = {
      ...editingJob,
      ...editJobForm,
      requirements: editJobForm.requirements.filter(req => req.trim() !== ''),
      benefits: editJobForm.benefits.filter(benefit => benefit.trim() !== '')
    }
    
    setJobs(prev => prev.map(job => job.id === editingJob.id ? updatedJob : job))
    setShowEditJob(false)
    setEditingJob(null)
  }

  const handleEditJobFormChange = (field: string, value: string | string[]) => {
    setEditJobForm(prev => ({ ...prev, [field]: value }))
  }

  const addRequirement = () => {
    setEditJobForm(prev => ({ ...prev, requirements: [...prev.requirements, ''] }))
  }

  const removeRequirement = (index: number) => {
    setEditJobForm(prev => ({ 
      ...prev, 
      requirements: prev.requirements.filter((_, i) => i !== index) 
    }))
  }

  const updateRequirement = (index: number, value: string) => {
    setEditJobForm(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }))
  }

  const addBenefit = () => {
    setEditJobForm(prev => ({ ...prev, benefits: [...prev.benefits, ''] }))
  }

  const removeBenefit = (index: number) => {
    setEditJobForm(prev => ({ 
      ...prev, 
      benefits: prev.benefits.filter((_, i) => i !== index) 
    }))
  }

  const updateBenefit = (index: number, value: string) => {
    setEditJobForm(prev => ({
      ...prev,
      benefits: prev.benefits.map((benefit, i) => i === index ? value : benefit)
    }))
  }

  // New handlers for candidate actions
  const handleCandidateAction = (resumeId: string, action: 'shortlisted' | 'reviewed' | 'rejected' | 'pending') => {
    setResumes(prev => prev.map(resume => 
      resume.id === resumeId ? { ...resume, status: action } : resume
    ))
  }

  const handleViewRawResume = (resume: Resume) => {
    setSelectedResume(resume)
    setShowRawResume(true)
  }

  // Job status management handlers
  const handleJobStatusChange = (jobId: string, status: 'active' | 'paused' | 'closed') => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status } : job
    ))
  }

  const handleDeleteJob = (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      setJobs(prev => prev.filter(job => job.id !== jobId))
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link 
                href="/" 
                className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Brain className="h-8 w-8 text-indigo-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    ScreenAI Dashboard
                  </h1>
                  <p className="text-sm text-gray-500">AI-Powered Recruitment Platform</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Briefcase className="h-4 w-4" />
                  <span>{jobs.length} Jobs</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{resumes.length} Candidates</span>
                </div>
              </div>
              
              <Button
                onClick={() => setShowUploadModal(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Upload className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Upload Resume</span>
                <span className="sm:hidden">Upload</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex items-center justify-between">
            <TabsList className="grid w-auto grid-cols-2 bg-white/60 backdrop-blur-sm p-1 rounded-xl border border-white/20">
              <TabsTrigger 
                value="jobs" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Jobs
              </TabsTrigger>
              <TabsTrigger 
                value="resumes"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
              >
                <FileText className="h-4 w-4 mr-2" />
                Resumes
              </TabsTrigger>
            </TabsList>

            {/* Search and Filter */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/60 backdrop-blur-sm border-white/20"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/20 rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                {activeTab === 'jobs' ? (
                  <>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="closed">Closed</option>
                  </>
                ) : (
                  <>
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Job Postings</h2>
                <p className="text-gray-600 mt-1">Manage your job listings and track applications</p>
              </div>
              <Button
                onClick={() => setShowJobCreator(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Job with AI
                <Sparkles className="h-4 w-4 ml-2" />
              </Button>
            </div>

            <div className="grid gap-6">
              {filteredJobs.map((job, index) => (
                <Card 
                  key={job.id} 
                  className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <CardTitle className="text-xl group-hover:text-indigo-600 transition-colors">
                            {job.title}
                          </CardTitle>
                          <Badge className={`${getStatusColor(job.status)} flex items-center space-x-1`}>
                            {getStatusIcon(job.status)}
                            <span className="capitalize">{job.status}</span>
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center space-x-4 text-sm">
                          <span className="flex items-center space-x-1">
                            <Building2 className="h-4 w-4" />
                            <span>{job.company}</span>
                          </span>
                          {job.location && (
                            <span className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{job.location}</span>
                            </span>
                          )}
                          {job.salary && (
                            <span className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{job.salary}</span>
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600">{job.applicantCount}</div>
                        <div className="text-sm text-gray-500">applicants</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 line-clamp-2">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.slice(0, 4).map((req, idx) => (
                        <Badge key={idx} variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                          {req}
                        </Badge>
                      ))}
                      {job.requirements.length > 4 && (
                        <Badge variant="outline" className="bg-gray-50 text-gray-600">
                          +{job.requirements.length - 4} more
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>Created {job.createdAt.toLocaleDateString()}</span>
                      </div>
                      
                      {/* Job Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          size="sm"
                          variant={job.status === 'active' ? 'default' : 'outline'}
                          className={job.status === 'active' ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-green-50 hover:border-green-300'}
                          onClick={() => handleJobStatusChange(job.id, 'active')}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Button>
                        <Button 
                          size="sm"
                          variant={job.status === 'paused' ? 'default' : 'outline'}
                          className={job.status === 'paused' ? 'bg-yellow-600 hover:bg-yellow-700' : 'hover:bg-yellow-50 hover:border-yellow-300'}
                          onClick={() => handleJobStatusChange(job.id, 'paused')}
                        >
                          <Pause className="h-3 w-3 mr-1" />
                          Pause
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                          onClick={() => handleDeleteJob(job.id)}
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>

                      {/* View Details Button */}
                      <div className="flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="group-hover:bg-indigo-50 group-hover:border-indigo-200"
                          onClick={() => {
                            setSelectedJob(job)
                            setShowJobDetails(true)
                          }}
                        >
                          View Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Resumes Tab */}
          <TabsContent value="resumes" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Candidate Resumes</h2>
              <p className="text-gray-600 mt-1">Review and manage candidate applications</p>
            </div>

            <div className="grid gap-6">
              {filteredResumes.map((resume, index) => (
                <Card 
                  key={resume.id} 
                  className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <CardTitle className="text-xl group-hover:text-indigo-600 transition-colors">
                            {resume.candidateName}
                          </CardTitle>
                          <Badge className={`${getStatusColor(resume.status)} flex items-center space-x-1`}>
                            {getStatusIcon(resume.status)}
                            <span className="capitalize">{resume.status}</span>
                          </Badge>
                          {resume.aiScore && (
                            <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200">
                              <Star className="h-3 w-3 mr-1" />
                              {resume.aiScore}% Match
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="flex items-center space-x-4 text-sm">
                          <span className="flex items-center space-x-1">
                            <Mail className="h-4 w-4" />
                            <span>{resume.email}</span>
                          </span>
                          {resume.phone && (
                            <span className="flex items-center space-x-1">
                              <Phone className="h-4 w-4" />
                              <span>{resume.phone}</span>
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Uploaded</div>
                        <div className="text-sm font-medium">{resume.uploadedAt.toLocaleDateString()}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 line-clamp-2">{resume.parsedData.summary}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {resume.parsedData.skills?.slice(0, 5).map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {skill}
                        </Badge>
                      ))}
                      {resume.parsedData.skills && resume.parsedData.skills.length > 5 && (
                        <Badge variant="outline" className="bg-gray-50 text-gray-600">
                          +{resume.parsedData.skills.length - 5} more
                        </Badge>
                      )}
                    </div>

                    {resume.jobRecommendations && resume.jobRecommendations.length > 1 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Job Recommendations</span>
                        </div>
                        <div className="space-y-1">
                          {resume.jobRecommendations.slice(0, 3).map((rec) => {
                            const job = jobs.find(j => j.id === rec.jobId)
                            return job ? (
                              <div key={rec.jobId} className="flex justify-between text-xs text-blue-700">
                                <span>{job.title}</span>
                                <span className="font-medium">{rec.score}% match</span>
                              </div>
                            ) : null
                          })}
                          {resume.jobRecommendations.length > 3 && (
                            <p className="text-xs text-blue-600">+{resume.jobRecommendations.length - 3} more matches</p>
                          )}
                        </div>
                      </div>
                    )}

                    {resume.notes && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">{resume.notes}</p>
                      </div>
                    )}

                    <div className="space-y-3 pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        Applied for: <span className="font-medium text-gray-700">
                          {jobs.find(job => job.id === resume.jobId)?.title || 'General Application'}
                        </span>
                      </div>
                      
                      {/* Candidate Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          size="sm"
                          variant={resume.status === 'shortlisted' ? 'default' : 'outline'}
                          className={resume.status === 'shortlisted' ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-blue-50 hover:border-blue-300'}
                          onClick={() => handleCandidateAction(resume.id, 'shortlisted')}
                        >
                          <Star className="h-3 w-3 mr-1" />
                          Shortlist
                        </Button>
                        <Button 
                          size="sm"
                          variant={resume.status === 'reviewed' ? 'default' : 'outline'}
                          className={resume.status === 'reviewed' ? 'bg-purple-600 hover:bg-purple-700' : 'hover:bg-purple-50 hover:border-purple-300'}
                          onClick={() => handleCandidateAction(resume.id, 'reviewed')}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Mark Reviewed
                        </Button>
                        <Button 
                          size="sm"
                          variant={resume.status === 'rejected' ? 'default' : 'outline'}
                          className={resume.status === 'rejected' ? 'bg-red-600 hover:bg-red-700' : 'hover:bg-red-50 hover:border-red-300'}
                          onClick={() => handleCandidateAction(resume.id, 'rejected')}
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                        <Button 
                          size="sm"
                          variant={resume.status === 'pending' ? 'default' : 'outline'}
                          className={resume.status === 'pending' ? 'bg-orange-600 hover:bg-orange-700 cursor-not-allowed opacity-50' : 'hover:bg-orange-50 hover:border-orange-300'}
                          onClick={() => resume.status !== 'pending' && handleCandidateAction(resume.id, 'pending')}
                          disabled={resume.status === 'pending'}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          Mark Pending
                        </Button>
                      </div>

                      {/* View Buttons */}
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="group-hover:bg-blue-50 group-hover:border-blue-200"
                          onClick={() => {
                            setSelectedResume(resume)
                            setShowResumeDetails(true)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="group-hover:bg-green-50 group-hover:border-green-200"
                          onClick={() => handleViewRawResume(resume)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          View Resume
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="group-hover:bg-indigo-50 group-hover:border-indigo-200"
                          onClick={() => router.push(`/results?id=${resume.id}&from=dashboard`)}
                        >
                          View Analysis
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Job Details Modal */}
      {showJobDetails && selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg border-white/20">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>{selectedJob.title}</span>
                      <Badge className={`${getStatusColor(selectedJob.status)} flex items-center space-x-1`}>
                        {getStatusIcon(selectedJob.status)}
                        <span className="capitalize">{selectedJob.status}</span>
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {selectedJob.company} • {selectedJob.location} • {selectedJob.applicantCount} applicants
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowJobDetails(false)}
                  className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
                >
                  <X className="h-4 w-4 mr-1" />
                  Close
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              {/* Job Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Building2 className="h-4 w-4" />
                  <span>{selectedJob.company}</span>
                </div>
                {selectedJob.location && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedJob.location}</span>
                  </div>
                )}
                {selectedJob.salary && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span>{selectedJob.salary}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedJob.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Benefits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedJob.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm">
                        <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Job Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-indigo-600">{selectedJob.applicantCount}</div>
                    <div className="text-sm text-gray-600">Applicants</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {Math.floor(selectedJob.applicantCount * 0.3)}
                    </div>
                    <div className="text-sm text-gray-600">Qualified</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.floor(selectedJob.applicantCount * 0.1)}
                    </div>
                    <div className="text-sm text-gray-600">Interviewed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {new Date().toLocaleDateString() === selectedJob.createdAt.toLocaleDateString() ? 0 : Math.floor(Math.random() * 3)}
                    </div>
                    <div className="text-sm text-gray-600">Hired</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowJobDetails(false)
                    handleEditJob(selectedJob)
                  }}
                >
                  Edit Job
                </Button>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  View All Applicants
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Resume Details Modal */}
      {showResumeDetails && selectedResume && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg border-white/20">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>{selectedResume.candidateName}</span>
                      <Badge className={`${getStatusColor(selectedResume.status)} flex items-center space-x-1`}>
                        {getStatusIcon(selectedResume.status)}
                        <span className="capitalize">{selectedResume.status}</span>
                      </Badge>
                      {selectedResume.aiScore && (
                        <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200">
                          <Star className="h-3 w-3 mr-1" />
                          {selectedResume.aiScore}% Match
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {selectedResume.email} • Uploaded {selectedResume.uploadedAt.toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResumeDetails(false)}
                  className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
                >
                  <X className="h-4 w-4 mr-1" />
                  Close
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <Tabs defaultValue="details" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Personal Details</TabsTrigger>
                  <TabsTrigger value="experience">Experience & Skills</TabsTrigger>
                  <TabsTrigger value="recommendations">Job Matches</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-6">
                  {/* Contact Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{selectedResume.email}</span>
                      </div>
                      {selectedResume.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{selectedResume.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Social Links */}
                  {selectedResume.parsedData.socialLinks && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Online Presence</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {selectedResume.parsedData.socialLinks.linkedin && (
                          <a
                            href={selectedResume.parsedData.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <Linkedin className="h-4 w-4" />
                            <span>LinkedIn Profile</span>
                          </a>
                        )}
                        {selectedResume.parsedData.socialLinks.github && (
                          <a
                            href={selectedResume.parsedData.socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-gray-900 hover:text-gray-700 transition-colors"
                          >
                            <Github className="h-4 w-4" />
                            <span>GitHub Profile</span>
                          </a>
                        )}
                        {selectedResume.parsedData.socialLinks.portfolio && (
                          <a
                            href={selectedResume.parsedData.socialLinks.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-green-600 hover:text-green-800 transition-colors"
                          >
                            <Globe className="h-4 w-4" />
                            <span>Portfolio</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  {selectedResume.parsedData.summary && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Professional Summary</h3>
                      <p className="text-gray-700 leading-relaxed">{selectedResume.parsedData.summary}</p>
                    </div>
                  )}

                  {/* Education */}
                  {selectedResume.parsedData.education.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Education</h3>
                      <div className="space-y-3">
                        {selectedResume.parsedData.education.map((edu, idx) => (
                          <div key={idx} className="border-l-2 border-indigo-200 pl-4">
                            <div className="font-medium">{edu.degree}</div>
                            <div className="text-sm text-gray-600">{edu.institution}</div>
                            <div className="text-sm text-gray-500">{edu.duration}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="experience" className="space-y-6">
                  {/* Work Experience */}
                  {selectedResume.parsedData.experience.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Work Experience</h3>
                      <div className="space-y-4">
                        {selectedResume.parsedData.experience.map((exp, idx) => (
                          <div key={idx} className="border-l-2 border-blue-200 pl-4">
                            <div className="font-medium">{exp.position}</div>
                            <div className="text-sm text-gray-600">{exp.company}</div>
                            <div className="text-sm text-gray-500 mb-2">{exp.duration}</div>
                            <p className="text-sm text-gray-700">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {selectedResume.parsedData.skills.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedResume.parsedData.skills.map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="recommendations" className="space-y-6">
                  {/* Job Recommendations */}
                  {selectedResume.jobRecommendations && selectedResume.jobRecommendations.length > 0 ? (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Job Match Analysis</h3>
                      <div className="space-y-3">
                        {selectedResume.jobRecommendations.map((rec) => {
                          const job = jobs.find(j => j.id === rec.jobId)
                          if (!job) return null
                          
                          return (
                            <div key={rec.jobId} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="font-medium">{job.title}</div>
                                <div className={`text-lg font-bold ${getScoreColor(rec.score)}`}>
                                  {rec.score}% Match
                                </div>
                              </div>
                              <div className="text-sm text-gray-600 mb-2">{job.company} • {job.location}</div>
                              <Progress value={rec.score} className="mb-2" />
                              <p className="text-sm text-gray-700 line-clamp-2">{job.description}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No job recommendations available</p>
                      <p className="text-sm text-gray-400">Upload with job matching to see recommendations</p>
                    </div>
                  )}

                  {/* Applied Job */}
                  {selectedResume.jobId && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Applied Position</h3>
                      <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                        <div className="font-medium text-green-800">
                          {jobs.find(j => j.id === selectedResume.jobId)?.title || 'Unknown Position'}
                        </div>
                        <div className="text-sm text-green-600">
                          {jobs.find(j => j.id === selectedResume.jobId)?.company || 'Unknown Company'}
                        </div>
                        {selectedResume.aiScore && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-green-700">Match Score</span>
                              <span className="text-sm font-medium text-green-800">{selectedResume.aiScore}%</span>
                            </div>
                            <Progress value={selectedResume.aiScore} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Upload Resume Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg border-white/20">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                    <Upload className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>Upload Resume</span>
                      <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200">
                        AI-Powered Parsing
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Upload a candidate&apos;s resume for AI-powered analysis and screening
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowUploadModal(false)
                    setResume(null)
                    setParsedResume(null)
                    setParseComplete(false)
                    setUploadFormData({
                      linkedin: "",
                      github: "",
                      portfolio: "",
                      extraContext: "",
                      selectedJobId: ""
                    })
                  }}
                  className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
                >
                  <X className="h-4 w-4 mr-1" />
                  Close
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <form onSubmit={handleUploadSubmit} className="space-y-6">
                {/* Resume Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    <span>Resume Upload</span>
                  </h3>
                  
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
                      dragActive 
                        ? "border-indigo-500 bg-indigo-50" 
                        : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={handleUploadAreaClick}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    
                    {resume ? (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveFile()
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors z-10"
                          title="Remove file"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="text-center">
                          <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
                          <p className="text-lg font-medium text-green-600">
                            {resume.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(resume.size)}
                          </p>
                          
                          {/* Parsing Status */}
                          {isParsing && (
                            <div className="mt-4 flex items-center justify-center space-x-2">
                              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                              <span className="text-sm text-blue-600">Parsing resume with AI...</span>
                            </div>
                          )}
                          
                          {parseComplete && parsedResume && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium text-green-800">Resume parsed successfully!</span>
                              </div>
                              <div className="text-xs text-green-700 space-y-1">
                                {parsedResume.name && <div>• Name: {parsedResume.name}</div>}
                                {parsedResume.email && <div>• Email: {parsedResume.email}</div>}
                                {parsedResume.skills && parsedResume.skills.length > 0 && (
                                  <div>• Skills: {parsedResume.skills.slice(0, 3).join(", ")}{parsedResume.skills.length > 3 ? "..." : ""}</div>
                                )}
                                {parsedResume.socialLinks && (
                                  <div>• Social links auto-filled below</div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium mb-2">
                          Drop your resume here or click to browse
                        </p>
                        <p className="text-sm text-gray-500">
                          Supports PDF and Word documents up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {uploadError && (
                    <p className="text-sm text-red-600">{uploadError}</p>
                  )}
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-indigo-600" />
                    <span>Online Presence (Optional)</span>
                  </h3>
                  
                  {parseComplete && parsedResume?.socialLinks && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Auto-filled from resume</span>
                      </div>
                      <p className="text-xs text-blue-700">
                        Social media links were automatically detected and filled in below.
                      </p>
                    </div>
                  )}
                  
                  <div className="grid gap-4">
                    <div className="flex items-center space-x-3">
                      <Linkedin className="h-5 w-5 text-blue-600" />
                      <div className="flex-1 relative">
                        <Input
                          placeholder="LinkedIn profile URL"
                          value={uploadFormData.linkedin}
                          onChange={(e) => handleUploadInputChange("linkedin", e.target.value)}
                          className={parsedResume?.socialLinks?.linkedin ? "border-green-300 bg-green-50" : ""}
                        />
                        {parsedResume?.socialLinks?.linkedin && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-600" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Github className="h-5 w-5 text-gray-900" />
                      <div className="flex-1 relative">
                        <Input
                          placeholder="GitHub profile URL"
                          value={uploadFormData.github}
                          onChange={(e) => handleUploadInputChange("github", e.target.value)}
                          className={parsedResume?.socialLinks?.github ? "border-green-300 bg-green-50" : ""}
                        />
                        {parsedResume?.socialLinks?.github && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-600" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-green-600" />
                      <div className="flex-1 relative">
                        <Input
                          placeholder="Portfolio/personal website URL"
                          value={uploadFormData.portfolio}
                          onChange={(e) => handleUploadInputChange("portfolio", e.target.value)}
                          className={parsedResume?.socialLinks?.portfolio ? "border-green-300 bg-green-50" : ""}
                        />
                        {parsedResume?.socialLinks?.portfolio && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-600" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <Briefcase className="h-5 w-5 text-indigo-600" />
                    <span>Job Selection (Optional)</span>
                  </h3>
                  <p className="text-sm text-gray-600">
                    Select a specific job to test against, or leave unselected to test against all jobs and get recommendations.
                  </p>
                  
                  <div className="space-y-3">
                    <select
                      value={uploadFormData.selectedJobId}
                      onChange={(e) => handleUploadInputChange("selectedJobId", e.target.value)}
                      className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/20 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Test against all jobs (Recommended)</option>
                      {jobs.map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.title} - {job.company}
                        </option>
                      ))}
                    </select>
                    
                    {uploadFormData.selectedJobId && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Job Selected</span>
                        </div>
                        <p className="text-xs text-blue-700">
                          Resume will be analyzed specifically for: {jobs.find(j => j.id === uploadFormData.selectedJobId)?.title}
                        </p>
                      </div>
                    )}
                    
                    {!uploadFormData.selectedJobId && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <Star className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Smart Matching Enabled</span>
                        </div>
                        <p className="text-xs text-green-700">
                          AI will test against all {jobs.length} jobs and recommend the best matches.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Context */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Additional Context</h3>
                  <Textarea
                    placeholder="Any additional information about the candidate..."
                    value={uploadFormData.extraContext}
                    onChange={(e) => handleUploadInputChange("extraContext", e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!resume || isUploading}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload & Analyze
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Job Creator Modal */}
      {showJobCreator && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden bg-white/95 backdrop-blur-lg border-white/20">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>AI Job Creator</span>
                      <Badge className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border-indigo-200">
                        Powered by Groq
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Describe your ideal job posting and I&apos;ll help you create it
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowJobCreator(false)
                    setChatMessages([])
                  }}
                  className="hover:bg-gray-100"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto p-6 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">Hi! I&apos;m your AI assistant.</p>
                    <p className="text-sm text-gray-400">
                      Tell me about the job you&apos;d like to create. For example:<br />
                      &quot;I need a senior React developer for my startup&quot;
                    </p>
                  </div>
                )}
                
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-indigo-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Input Area */}
              <div className="border-t border-gray-100 p-4">
                <div className="flex space-x-2">
                  <Input
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Describe the job you want to create..."
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim() || isLoading}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Job Modal */}
      {showEditJob && editingJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg border-white/20">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle>Edit Job</CardTitle>
                    <CardDescription>Update job posting details</CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEditJob(false)}
                  className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Job Title</label>
                  <Input
                    value={editJobForm.title}
                    onChange={(e) => handleEditJobFormChange('title', e.target.value)}
                    placeholder="Enter job title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Company</label>
                  <Input
                    value={editJobForm.company}
                    onChange={(e) => handleEditJobFormChange('company', e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Location</label>
                  <Input
                    value={editJobForm.location}
                    onChange={(e) => handleEditJobFormChange('location', e.target.value)}
                    placeholder="Enter location"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Salary Range</label>
                  <Input
                    value={editJobForm.salary}
                    onChange={(e) => handleEditJobFormChange('salary', e.target.value)}
                    placeholder="e.g., $80,000 - $120,000"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Job Description</label>
                <Textarea
                  value={editJobForm.description}
                  onChange={(e) => handleEditJobFormChange('description', e.target.value)}
                  placeholder="Enter job description"
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                <select
                  value={editJobForm.status}
                  onChange={(e) => handleEditJobFormChange('status', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">Requirements</label>
                  <Button size="sm" variant="outline" onClick={addRequirement}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add Requirement
                  </Button>
                </div>
                <div className="space-y-2">
                  {editJobForm.requirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={req}
                        onChange={(e) => updateRequirement(index, e.target.value)}
                        placeholder="Enter requirement"
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeRequirement(index)}
                        className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">Benefits</label>
                  <Button size="sm" variant="outline" onClick={addBenefit}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add Benefit
                  </Button>
                </div>
                <div className="space-y-2">
                  {editJobForm.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={benefit}
                        onChange={(e) => updateBenefit(index, e.target.value)}
                        placeholder="Enter benefit"
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeBenefit(index)}
                        className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={() => setShowEditJob(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveJob} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Resume Modal */}
      {showRawResume && selectedResume && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white/95 backdrop-blur-lg border-white/20">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>Resume: {selectedResume.candidateName}</span>
                    </CardTitle>
                    <CardDescription>
                      Original uploaded file: {selectedResume.fileName}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRawResume(false)}
                  className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
                >
                  <X className="h-4 w-4 mr-1" />
                  Close
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="h-[70vh] bg-gray-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 max-w-md mx-auto">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Resume File Preview</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      File: <span className="font-medium">{selectedResume.fileName}</span>
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Uploaded: {selectedResume.uploadedAt.toLocaleDateString()}
                    </p>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-400">
                        Raw file viewing would require additional PDF viewer integration.
                      </p>
                      <p className="text-xs text-gray-400">
                        For now, you can view the parsed data in the "View Details" section.
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setShowRawResume(false)
                      setShowResumeDetails(true)
                    }}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Parsed Details Instead
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}



      {/* File Upload Area */}
    </div>
  )
} 