import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, FileText, Search, Brain, BarChart3, Shield, Users, Clock, Sparkles, ArrowRight, Zap, Target } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Brain className="h-8 w-8 text-indigo-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">ScreenAI</span>
                <div className="text-xs text-gray-500 -mt-1">AI-Powered Recruitment</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" className="hover:bg-indigo-50 border-indigo-200">
                  Dashboard
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200">
                  Get Started
                  <Sparkles className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 mb-8">
              <Zap className="h-4 w-4 text-indigo-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">AI-Powered Candidate Screening</span>
              <div className="ml-2 px-2 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full text-xs font-semibold text-indigo-700">
                NEW
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                Screen Smarter.
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Hire Faster.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-gray-600 leading-relaxed">
              ScreenAI revolutionizes recruitment with AI-powered candidate verification across resumes, GitHub, LinkedIn, and more — delivering instant, accurate insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <Brain className="h-5 w-5 mr-2" />
                  Open Dashboard
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">70%</div>
                <div className="text-sm text-gray-600">Faster Screening</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
                <div className="text-sm text-gray-600">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600 mb-2">10k+</div>
                <div className="text-sm text-gray-600">Candidates Screened</div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Benefits Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                <Shield className="h-4 w-4 text-indigo-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Why Choose ScreenAI</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
                Transform Your Hiring Process
              </h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                    <Clock className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">Save Time</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Automate candidate screening and reduce time-to-hire by up to 70% with AI-powered analysis.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
                    <Shield className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">Reduce Risk</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Identify inconsistencies and red flags before making hiring decisions with comprehensive verification.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">Better Matches</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Find candidates who are truly qualified and fit your team culture with intelligent matching.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg">
                    <Zap className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">Instant Results</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Get comprehensive candidate analysis in minutes, not hours, with real-time processing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                <div className="relative">
                  <h3 className="text-2xl lg:text-3xl font-bold mb-6">Ready to Transform Your Hiring?</h3>
                  <p className="text-lg mb-8 opacity-90 leading-relaxed">
                    Join thousands of recruiters who are already using ScreenAI to make better, faster hiring decisions with AI-powered insights.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/dashboard">
                      <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                        <Brain className="h-5 w-5 mr-2" />
                        Open Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 py-16 bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <Brain className="h-7 w-7 text-indigo-400" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">ScreenAI</span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                AI-powered candidate screening platform for modern recruiters and hiring teams.
              </p>
              <div className="text-sm text-gray-400">
                <p>&copy; 2024 ScreenAI. All rights reserved.</p>
                <p className="mt-1">Powered by AI innovation.</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-white text-lg">Platform</h3>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="/dashboard" className="hover:text-indigo-400 transition-colors duration-200 flex items-center"><Brain className="h-4 w-4 mr-2" />Dashboard</Link></li>
                <li><Link href="/dashboard" className="hover:text-indigo-400 transition-colors duration-200 flex items-center"><FileText className="h-4 w-4 mr-2" />Upload Resume</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-white text-lg">Company</h3>
              <ul className="space-y-3 text-gray-300">
                <li><span className="text-gray-500">About Us</span></li>
                <li><span className="text-gray-500">Blog</span></li>
                <li><span className="text-gray-500">Careers</span></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-white text-lg">Support</h3>
              <ul className="space-y-3 text-gray-300">
                <li><span className="text-gray-500">Contact Support</span></li>
                <li><span className="text-gray-500">Help Center</span></li>
                <li><span className="text-gray-500">Privacy Policy</span></li>
                <li><span className="text-gray-500">Terms of Service</span></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-center items-center">
              <div className="text-gray-400 text-sm text-center">
                <p>ScreenAI - Transforming recruitment with artificial intelligence</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 