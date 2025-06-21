"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Brain, FileText, Search, Bot, BarChart3, CheckCircle, AlertCircle } from "lucide-react"
import { ProgressUpdate } from "@/types"

const PROCESSING_STEPS = [
  {
    id: "parsing",
    title: "Parsing Resume",
    description: "Extracting text and structured data from resume",
    icon: FileText,
    estimatedTime: "10-15 seconds"
  },
  {
    id: "scraping",
    title: "Scraping Online Presence",
    description: "Analyzing GitHub, LinkedIn, and portfolio data",
    icon: Search,
    estimatedTime: "30-45 seconds"
  },
  {
    id: "analyzing",
    title: "Analyzing Fit",
    description: "AI-powered analysis of skills and job compatibility",
    icon: Bot,
    estimatedTime: "20-30 seconds"
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
  
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState("")
  const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([])

  const startProcessing = useCallback(async () => {
    try {
      // Connect to Server-Sent Events for real-time updates
      const eventSource = new EventSource(`/api/process?id=${candidateId}`)
      
      eventSource.onmessage = (event) => {
        const update: ProgressUpdate = JSON.parse(event.data)
        
        setProgressUpdates(prev => [...prev, update])
        
        const stepIndex = PROCESSING_STEPS.findIndex(step => step.id === update.step)
        if (stepIndex !== -1) {
          setCurrentStep(stepIndex)
          setProgress(update.progress)
        }
        
        if (update.error) {
          setError(update.error)
          eventSource.close()
        }
        
        if (update.step === "generating" && update.progress === 100) {
          setIsComplete(true)
          eventSource.close()
          // Auto-redirect to results after a short delay
          setTimeout(() => {
            router.push(`/results?id=${candidateId}`)
          }, 2000)
        }
      }
      
      eventSource.onerror = () => {
        setError("Connection lost. Please try again.")
        eventSource.close()
      }
      
      return () => eventSource.close()
    } catch (err) {
      setError("Failed to start processing")
    }
  }, [candidateId, router])

  useEffect(() => {
    if (!candidateId) {
      router.push("/upload")
      return
    }

    // Start processing
    startProcessing()
  }, [candidateId, router, startProcessing])

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
                <Link href="/upload">Try Again</Link>
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
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors">
                <BarChart3 className="h-4 w-4" />
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
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              {isComplete ? "Analysis Complete!" : "Analyzing Candidate"}
            </h1>
            <p className="text-xl text-gray-600">
              {isComplete 
                ? "Your comprehensive candidate report is ready" 
                : "Please wait while we process the candidate data"
              }
            </p>
          </div>

          {/* Overall Progress */}
          <Card className="mb-8 bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
              <CardDescription>
                {isComplete 
                  ? "Processing completed successfully" 
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
          <div className="space-y-6">
            {PROCESSING_STEPS.map((step, index) => {
              const status = getStepStatus(index)
              
              return (
                <Card key={step.id} className={`transition-all duration-300 ${
                  status === "active" ? "ring-2 ring-primary" : ""
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
                            {progress}% complete
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
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Live Updates</CardTitle>
                <CardDescription>
                  Real-time processing status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {progressUpdates.slice(-5).map((update, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      <span className="text-gray-600">{update.message}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Completion Actions */}
          {isComplete && (
            <div className="mt-8 text-center">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Analysis Complete!
                  </h3>
                  <p className="text-green-700 mb-4">
                    Your comprehensive candidate report is ready for review.
                  </p>
                  <Button asChild size="lg">
                    <Link href={`/results?id=${candidateId}`}>
                      View Results
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProcessingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="loading-spinner mx-auto mb-4" />
            <p>Loading...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <ProcessingContent />
    </Suspense>
  )
}