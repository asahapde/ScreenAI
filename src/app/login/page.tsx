'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Brain, Mail, Lock, ArrowRight, Sparkles } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate loading for UI purposes
    setTimeout(() => {
      // For testing purposes, always redirect to dashboard
      router.push('/dashboard')
    }, 1000)
  }

  const handleTestLogin = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative">
              <Brain className="h-10 w-10 text-indigo-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ScreenAI
              </h1>
              <p className="text-xs text-gray-500 -mt-1">AI-Powered Recruitment</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your ScreenAI account</p>
        </div>

        {/* Login Form */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Remember me
                </label>
                <Link href="#" className="text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Sign In
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </div>
                )}
              </Button>
            </form>

            {/* Test Login Button */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                onClick={handleTestLogin}
                variant="outline"
                className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Skip Login (Testing)
              </Button>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <Link href="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>&copy; 2024 ScreenAI. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
} 