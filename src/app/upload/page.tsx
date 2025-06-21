"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, FileText, Linkedin, Github, Globe, Briefcase, Brain, Loader2, CheckCircle, X } from "lucide-react"
import { formatFileSize, validateFileType, generateId } from "@/lib/utils"
import { CandidateData, SocialLinks, ParsedResume } from "@/types"

export default function UploadPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const lastParsedFileRef = useRef<string | null>(null)
  const [formData, setFormData] = useState({
    linkedin: "",
    github: "",
    portfolio: "",
    extraContext: "",
    jobDescription: "",
    jobTitle: "",
    company: ""
  })
  const [resume, setResume] = useState<File | null>(null)
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [parseComplete, setParseComplete] = useState(false)
  const [error, setError] = useState("")
  const [abortController, setAbortController] = useState<AbortController | null>(null)

  const allowedFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    // Additional MIME types that browsers might use
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
    setError("")
    
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
      
      const parsed = await response.json()
      setParsedResume(parsed)
      
      // Auto-fill online presence fields if found in resume
      if (parsed.socialLinks) {
        setFormData(prev => ({
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
        setFormData(prev => ({
          ...prev,
          extraContext: context.join("\n\n")
        }))
      }
      
      setParseComplete(true)
    } catch (err) {
      console.error("Resume parsing error:", err)
      setError("Failed to parse resume automatically. You can still proceed manually.")
    } finally {
      setIsParsing(false)
    }
  }

  const validateFile = (file: File): boolean => {
    // Check MIME type first
    if (allowedFileTypes.includes(file.type)) {
      return true
    }
    
    // Fallback to file extension check
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
    setError("")
    
    if (!validateFile(file)) {
      setError("Please upload a PDF or Word document")
      return
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError("File size must be less than 10MB")
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Auto-parse public URLs when pasted
    if ((field === 'linkedin' || field === 'github' || field === 'portfolio') && value) {
      parsePublicUrl(field, value)
    }
  }

  const parsePublicUrl = (field: string, url: string) => {
    try {
      const urlObj = new URL(url)
      
      if (field === 'linkedin' && !urlObj.hostname.includes('linkedin.com')) {
        setError(`LinkedIn URL should be from linkedin.com domain`)
        setTimeout(() => setError(""), 3000)
      } else if (field === 'github' && !urlObj.hostname.includes('github.com')) {
        setError(`GitHub URL should be from github.com domain`)
        setTimeout(() => setError(""), 3000)
      } else {
        // Clear any previous errors for valid URLs
        if (error.includes('URL should be from')) {
          setError("")
        }
      }
    } catch (e) {
      // Invalid URL format
      if (url.length > 10) { // Only show error for substantial input
        setError(`Please enter a valid ${field} URL`)
        setTimeout(() => setError(""), 3000)
      }
    }
  }

  const handleCancel = () => {
    if (abortController) {
      abortController.abort()
      setAbortController(null)
    }
    setIsUploading(false)
    setError("Upload cancelled")
    setTimeout(() => setError(""), 3000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!resume) {
      setError("Please upload a resume")
      return
    }
    
    setIsUploading(true)
    setError("")
    
    // Create abort controller for cancellation
    const controller = new AbortController()
    setAbortController(controller)
    
    try {
      // Create form data for file upload
      const uploadData = new FormData()
      uploadData.append("resume", resume)
      uploadData.append("candidateData", JSON.stringify({
        id: generateId(),
        parsedResume: parsedResume,
        socialLinks: {
          linkedin: formData.linkedin,
          github: formData.github,
          portfolio: formData.portfolio
        } as SocialLinks,
        extraContext: formData.extraContext,
        jobDescription: {
          content: formData.jobDescription,
          title: formData.jobTitle,
          company: formData.company
        },
        createdAt: new Date()
      }))
      
      // Upload and process with abort signal
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
        signal: controller.signal
      })
      
      if (!response.ok) {
        throw new Error("Failed to upload resume")
      }
      
      const result = await response.json()
      
      // Redirect to processing page
      router.push(`/processing?id=${result.candidateId}`)
      
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError("Upload cancelled")
        } else {
          setError(err.message)
        }
      } else {
        setError("An error occurred")
      }
    } finally {
      setIsUploading(false)
      setAbortController(null)
    }
  }

  const handleRemoveFile = () => {
    setResume(null)
    setParsedResume(null)
    setParseComplete(false)
    setIsParsing(false)
    setError("")
    lastParsedFileRef.current = null
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">ScreenAI</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Upload Candidate Resume</h1>
            <p className="text-xl text-gray-600">
              Upload a resume and provide additional context for AI-powered screening
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Resume Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Resume Upload
                </CardTitle>
                <CardDescription>
                  Upload the candidate&apos;s resume (PDF or Word document)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`upload-area ${dragActive ? "dragover" : ""}`}
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
                            <span className="text-sm text-blue-600">Parsing resume...</span>
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
                              {parsedResume.skills.length > 0 && <div>• Skills: {parsedResume.skills.slice(0, 3).join(", ")}{parsedResume.skills.length > 3 ? "..." : ""}</div>}
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
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Online Presence (Optional)
                </CardTitle>
                <CardDescription>
                  Provide social media and portfolio links for comprehensive analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {parseComplete && parsedResume?.socialLinks && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Auto-filled from resume</span>
                    </div>
                    <p className="text-xs text-blue-700">
                      Social media links were automatically detected and filled in below. You can edit them if needed.
                    </p>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <Linkedin className="h-5 w-5 text-blue-600" />
                  <div className="flex-1 relative">
                    <Input
                      placeholder="LinkedIn profile URL"
                      value={formData.linkedin}
                      onChange={(e) => handleInputChange("linkedin", e.target.value)}
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
                      value={formData.github}
                      onChange={(e) => handleInputChange("github", e.target.value)}
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
                      value={formData.portfolio}
                      onChange={(e) => handleInputChange("portfolio", e.target.value)}
                      className={parsedResume?.socialLinks?.portfolio ? "border-green-300 bg-green-50" : ""}
                    />
                    {parsedResume?.socialLinks?.portfolio && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-600" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Context */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Job Context
                </CardTitle>
                <CardDescription>
                  Provide job details to get accurate fit scoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Job Title"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                  />
                  <Input
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                  />
                </div>
                <Textarea
                  placeholder="Job description, requirements, and responsibilities..."
                  value={formData.jobDescription}
                  onChange={(e) => handleInputChange("jobDescription", e.target.value)}
                  rows={6}
                />
              </CardContent>
            </Card>

            {/* Extra Context */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Context</CardTitle>
                <CardDescription>
                  Any additional information about the candidate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="e.g., 'I&apos;ve been coding since 2018', 'Strong background in machine learning', etc."
                  value={formData.extraContext}
                  onChange={(e) => handleInputChange("extraContext", e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="text-center space-y-4">
              {!isUploading ? (
                <Button
                  type="submit"
                  size="lg"
                  disabled={!resume}
                  className="w-full md:w-auto"
                >
                  Verify & Analyze
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span>Processing resume...</span>
                  </div>
                  <Button
                    type="button"
                    size="lg"
                    variant="outline"
                    onClick={handleCancel}
                    className="w-full md:w-auto"
                  >
                    Cancel Upload
                  </Button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 