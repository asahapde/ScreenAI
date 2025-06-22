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
  Users,
  MessageSquare,
  Heart,
  XCircle,
  Bot,
  HelpCircle,
  Ban,
  Lightbulb
} from "lucide-react"
import { Resume, Job } from "@/types"
import { GitHubAnalysis } from "@/components/analysis/github-analysis"
import { CultureFitAnalysis } from "@/components/analysis/culture-fit"
import { OAAssessment } from "@/components/analysis/oa-assessment"
import { BlogAnalysis } from "@/components/analysis/blog-analysis"
import { StackOverflowAnalysis } from "@/components/analysis/stackoverflow-analysis"

// Mock data with enhanced analysis
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
          description: 'Led development of AI-powered recruitment platform serving 10,000+ users.',
          technologies: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'Redis', 'Machine Learning']
        },
        {
          company: 'StartupLaunch Inc.',
          position: 'Full Stack Developer',
          duration: '2020-2022',
          description: 'Built end-to-end web applications for multiple client projects.',
          technologies: ['React', 'TypeScript', 'Express.js', 'MongoDB', 'GraphQL', 'Jest', 'GitHub Actions']
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
      skills: [
        'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Django', 'Flask',
        'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'Redis',
        'GraphQL', 'REST APIs', 'Machine Learning', 'TensorFlow', 'PyTorch',
        'Git', 'Linux', 'CI/CD', 'Jest', 'Cypress', 'Agile', 'Microservices'
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
  },
  {
    id: 'john-fake',
    candidateName: 'John Thompson',
    email: 'john.thompson@email.com',
    phone: '+1 (555) 987-6543',
    uploadedAt: new Date('2024-01-18'),
    fileName: 'john_thompson_resume.pdf',
    parsedData: {
      name: 'John Thompson',
      email: 'john.thompson@email.com',
      phone: '+1 (555) 987-6543',
      summary: 'Senior Full-Stack Engineer with 8+ years of experience building scalable applications at Fortune 500 companies. Expert in React, Node.js, and cloud architecture.',
      experience: [
        {
          company: 'Google',
          position: 'Senior Software Engineer',
          duration: '2020-2024',
          description: 'Led development of critical infrastructure serving 2 billion users. Built and maintained microservices architecture.',
          technologies: ['React', 'Node.js', 'Kubernetes', 'Go', 'Python', 'GCP']
        },
        {
          company: 'Facebook',
          position: 'Software Engineer',
          duration: '2018-2020',
          description: 'Developed user-facing features for Facebook Marketplace. Optimized performance for millions of daily users.',
          technologies: ['React', 'PHP', 'Hack', 'GraphQL', 'MySQL']
        },
        {
          company: 'Amazon',
          position: 'Software Developer',
          duration: '2016-2018',
          description: 'Built AWS Lambda functions and managed cloud infrastructure. Implemented CI/CD pipelines.',
          technologies: ['Java', 'AWS', 'Lambda', 'DynamoDB', 'CloudFormation']
        }
      ],
      education: [
        {
          institution: 'Stanford University',
          degree: 'Master of Science in Computer Science',
          duration: '2014-2016',
          gpa: '3.9'
        },
        {
          institution: 'MIT',
          degree: 'Bachelor of Science in Computer Science',
          duration: '2010-2014',
          gpa: '3.8'
        }
      ],
      skills: [
        'React', 'Node.js', 'Python', 'Go', 'Java', 'Kubernetes', 'Docker',
        'AWS', 'GCP', 'GraphQL', 'REST APIs', 'MongoDB', 'PostgreSQL',
        'Redis', 'Machine Learning', 'TensorFlow', 'DevOps', 'CI/CD'
      ],
      socialLinks: {
        linkedin: 'https://linkedin.com/in/john-thompson-dev',
        github: 'https://github.com/johnthompson',
        portfolio: 'https://johnthompson.dev'
      }
    },
    status: 'pending',
    jobId: '1',
    aiScore: 23,
    notes: 'MAJOR RED FLAGS - Multiple inconsistencies detected. Do not proceed with hiring.'
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
  }
]

// Red flag candidate analysis data
const generateJohnFakeAnalysisData = () => {
  return {
    overallScore: 23,
    matchPercentage: 15,
    
    // GitHub Analysis Data - RED FLAGS
    githubData: {
      profile: {
        name: 'John Thompson',
        bio: 'Senior Full-Stack Engineer at Google',
        company: 'Google',
        location: 'Mountain View, CA',
        followers: 12,
        following: 234,
        publicRepos: 3,
        totalStars: 4,
        totalForks: 1,
        contributions: 23
      },
      projects: [
        {
          name: 'hello-world',
          description: 'My first repository',
          language: 'JavaScript',
          stars: 2,
          forks: 0,
          commits: 3,
          lastUpdated: '2 years ago',
          technologies: ['JavaScript'],
          codeQuality: 12,
          resumeClaim: 'Led development of critical infrastructure serving 2 billion users',
          verification: 'disputed' as const,
          url: 'https://github.com/johnthompson/hello-world'
        },
        {
          name: 'copied-tutorial',
          description: 'React tutorial copy',
          language: 'JavaScript',
          stars: 1,
          forks: 1,
          commits: 1,
          lastUpdated: '1 year ago',
          technologies: ['React'],
          codeQuality: 8,
          resumeClaim: 'Built and maintained microservices architecture',
          verification: 'disputed' as const,
          url: 'https://github.com/johnthompson/copied-tutorial'
        }
      ],
      commits: [
        {
          date: '2023-03-15',
          message: 'Initial commit',
          additions: 1200,
          deletions: 0,
          sha: 'xyz789',
          url: 'https://github.com/johnthompson/hello-world/commit/xyz789'
        }
      ],
      languageStats: {
        'JavaScript': 95,
        'HTML': 5
      },
      activityPattern: {
        weeklyCommits: [0, 0, 0, 1, 0, 0, 0],
        hourlyPattern: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 8, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        streakDays: 0,
        mostActiveMonth: 'March 2023'
      },
      codeVerification: {
        resumeSkills: ['React', 'Node.js', 'Kubernetes', 'Go', 'Python', 'GCP'],
        verifiedSkills: ['JavaScript'],
        disputedClaims: [
          {
            claim: 'Led development of critical infrastructure serving 2 billion users',
            reality: 'Only has 3 trivial repositories with minimal commits. No evidence of enterprise-level work.',
            confidence: 98
          },
          {
            claim: 'Expert in React, Node.js, and cloud architecture',
            reality: 'GitHub shows only basic JavaScript. No Node.js, cloud, or advanced React code found.',
            confidence: 96
          },
          {
            claim: 'Built and maintained microservices architecture',
            reality: 'No evidence of microservices, Docker, or Kubernetes usage in any repositories.',
            confidence: 99
          }
        ]
      },
      aiGeneratedCodeDetection: {
        overallAIScore: 87,
        analysisResults: [
          {
            file: 'hello-world/index.js',
            aiProbability: 94,
            indicators: ['Generic variable names', 'ChatGPT-style comments', 'Perfect formatting with no personal style'],
            vibeCheck: 'EXTREMELY_SUSPICIOUS'
          },
          {
            file: 'copied-tutorial/App.js',
            aiProbability: 89,
            indicators: ['Identical to React tutorial', 'No personal modifications', 'Copy-paste detection positive'],
            vibeCheck: 'COPY_PASTE'
          }
        ],
        codePattern: 'AI_GENERATED_WITH_MINIMAL_MODIFICATION'
      }
    },

    // Culture Fit Data - POOR FIT
    cultureFitData: {
      overallFitScore: 18,
      values: [
        {
          name: 'Honesty & Integrity',
          candidateScore: 5,
          companyScore: 95,
          match: 5,
          description: 'Major inconsistencies between resume claims and actual evidence'
        },
        {
          name: 'Technical Excellence',
          candidateScore: 15,
          companyScore: 90,
          match: 17,
          description: 'Minimal technical evidence despite grandiose claims'
        },
        {
          name: 'Growth Mindset',
          candidateScore: 25,
          companyScore: 85,
          match: 29,
          description: 'No evidence of continuous learning or skill development'
        }
      ],
      teamDynamics: {
        leadershipStyle: 'Unverified Claims',
        collaborationScore: 12,
        independenceScore: 20,
        mentorshipInterest: 5
      },
      growthMindset: {
        learningAgility: 15,
        adaptability: 18,
        innovationDrive: 12
      },
      companyAlignment: {
        missionAlignment: 22,
        industryPassion: 14
      }
    },

    // OA Assessment Data - FULL OA REQUIRED + CONCERNS
    oaData: {
      overallOARecommendation: 'full' as const,
      confidenceScore: 97,
      skillsAssessment: [
        {
          skill: 'Data Structures & Algorithms',
          required: true,
          githubEvidence: ['No algorithmic code found', 'Only basic hello-world scripts'],
          proficiencyLevel: 8,
          oaRequired: true,
          reasoning: 'No evidence of algorithmic thinking. Likely lacks fundamental CS knowledge.'
        },
        {
          skill: 'System Design',
          required: true,
          githubEvidence: ['No architecture evidence', 'No complex systems', 'Trivial single-file projects'],
          proficiencyLevel: 5,
          oaRequired: true,
          reasoning: 'Claims enterprise architecture experience but shows no supporting evidence.'
        }
      ],
      algorithmicThinking: {
        score: 8,
        evidence: ['No algorithmic code', 'Basic scripting only'],
        oaNeeded: true
      },
      problemSolving: {
        score: 12,
        evidence: ['No complex problem solving', 'Copy-paste solutions'],
        oaNeeded: true
      },
      codeQuality: {
        score: 15,
        evidence: ['Poor code structure', 'No testing', 'Minimal documentation'],
        oaNeeded: true
      },
      domainExpertise: {
        score: 6,
        evidence: ['Claims not supported by code', 'Fundamental mismatches'],
        oaNeeded: true
      },
      summary: 'RECOMMENDATION: DO NOT HIRE. This candidate shows severe misrepresentation of skills and experience. GitHub portfolio contradicts all major resume claims. High probability of fraudulent application.',
      recommendations: [
        'REJECT immediately - major red flags detected',
        'Do not proceed with any form of interview',
        'Consider flagging profile for potential fraud'
      ]
    },

    // Blog Analysis Data - MINIMAL/FAKE
    blogData: {
      overallScore: 8,
      thoughtLeadershipScore: 5,
      technicalWritingScore: 12,
      consistencyScore: 3,
      totalPosts: 2,
      totalViews: 45,
      totalEngagement: 3,
      platforms: ['Medium'],
      topTopics: [
        { topic: 'Hello World', count: 1 },
        { topic: 'Getting Started', count: 1 }
      ],
      posts: [
        {
          title: 'My Journey into Programming',
          url: 'https://medium.com/@johnthompson/my-journey',
          platform: 'Medium',
          publishedDate: '2023-02-15',
          readTime: 2,
          views: 23,
          likes: 2,
          comments: 0,
          topics: ['Beginner', 'Programming'],
          relevanceScore: 8,
          qualityScore: 12,
          summary: 'Basic introduction post with no technical depth'
        }
      ],
      writingAnalysis: {
        averageReadTime: 2,
        averageQuality: 12,
        averageRelevance: 8,
        writingStyle: 'Elementary',
        technicalDepth: 'Superficial'
      },
      careerImpact: {
        thoughtLeadership: 5,
        industryRecognition: 2,
        knowledgeSharing: 8,
        communityEngagement: 4
      }
    },

    // Stack Overflow Data - INACTIVE/POOR
    stackOverflowData: {
      profile: {
        reputation: 1,
        badgeCount: 0,
        goldBadges: 0,
        silverBadges: 0,
        bronzeBadges: 0,
        questionsAsked: 2,
        answersProvided: 0,
        memberSince: '2023',
        lastActive: '6 months ago'
      },
      expertise: {
        topTags: [],
        knowledgeAreas: [],
        expertiseLevel: 2,
        consistencyScore: 1
      },
      engagement: {
        helpfulnessScore: 0,
        communityContribution: 1,
        mentorshipIndicator: 0,
        problemSolvingScore: 3
      },
      recentActivity: [
        {
          id: 1,
          type: 'question' as const,
          title: 'How to print hello world in JavaScript?',
          tags: ['javascript', 'beginner'],
          score: -2,
          views: 12,
          answers: 3,
          accepted: false,
          createdDate: '2023-03-10',
          summary: 'Basic question showing fundamental lack of programming knowledge'
        }
      ],
      careerRelevance: {
        jobRelevantTags: [],
        domainExpertise: 1,
        technicalDepth: 2,
        practicalExperience: 3
      }
    }
  }
}

// Enhanced mock data for comprehensive analysis
const generateEnhancedAnalysisData = (candidateId?: string) => {
  // Return red flag data for John Thompson
  if (candidateId === 'john-fake') {
    return generateJohnFakeAnalysisData()
  }
  
  return {
    overallScore: 96,
    matchPercentage: 92,
    
    // GitHub Analysis Data
    githubData: {
      profile: {
        name: 'Abdullah Sahapde',
        bio: 'Full-stack developer passionate about AI/ML and scalable systems',
        company: 'TechFlow Solutions',
        location: 'San Francisco, CA',
        followers: 324,
        following: 180,
        publicRepos: 42,
        totalStars: 1139,
        totalForks: 334,
        contributions: 2847
      },
      projects: [
        {
          name: 'ScreenAI',
          description: 'AI-powered candidate screening platform',
          language: 'TypeScript',
          stars: 87,
          forks: 23,
          commits: 156,
          lastUpdated: '2 days ago',
          technologies: ['React', 'Node.js', 'AI/ML', 'PostgreSQL'],
          codeQuality: 94,
          resumeClaim: 'Led development of AI-powered recruitment platform serving 10,000+ users',
          verification: 'verified' as const,
          url: 'https://github.com/asahapde/screenai'
        },
        {
          name: 'microservices-ecommerce',
          description: 'Scalable e-commerce platform with microservices architecture',
          language: 'JavaScript',
          stars: 321,
          forks: 89,
          commits: 234,
          lastUpdated: '1 week ago',
          technologies: ['Node.js', 'Docker', 'Kubernetes', 'MongoDB'],
          codeQuality: 91,
          resumeClaim: 'Built scalable microservices architecture',
          verification: 'verified' as const,
          url: 'https://github.com/asahapde/microservices-ecommerce'
        }
      ],
      commits: [
        {
          date: '2024-01-20',
          message: 'feat: Add advanced AI analysis for candidate screening',
          additions: 245,
          deletions: 32,
          sha: 'abc123',
          url: 'https://github.com/asahapde/screenai/commit/abc123'
        },
        {
          date: '2024-01-19',
          message: 'fix: Improve database query performance',
          additions: 67,
          deletions: 89,
          sha: 'def456',
          url: 'https://github.com/asahapde/screenai/commit/def456'
        }
      ],
      languageStats: {
        'TypeScript': 35,
        'JavaScript': 28,
        'Python': 20,
        'Java': 8,
        'Go': 6,
        'Rust': 3
      },
      activityPattern: {
        weeklyCommits: [45, 52, 38, 41, 48, 23, 15],
        hourlyPattern: [2, 1, 0, 0, 0, 0, 1, 5, 12, 18, 15, 14, 16, 18, 20, 22, 19, 15, 12, 8, 6, 4, 3, 2],
        streakDays: 47,
        mostActiveMonth: 'December 2023'
      },
      codeVerification: {
        resumeSkills: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'Machine Learning'],
        verifiedSkills: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'Machine Learning', 'TypeScript', 'PostgreSQL'],
        disputedClaims: [
          {
            claim: 'Expert in Kubernetes orchestration',
            reality: 'Some Docker usage found, but limited Kubernetes evidence in recent projects',
            confidence: 78
          }
        ]
      },
      aiGeneratedCodeDetection: {
        overallAIScore: 8,
        analysisResults: [
          {
            file: 'ScreenAI/src/components/Analysis.tsx',
            aiProbability: 12,
            indicators: ['Natural coding style', 'Personal variable naming', 'Consistent architecture patterns'],
            vibeCheck: 'AUTHENTIC'
          },
          {
            file: 'microservices-ecommerce/backend/auth.js',
            aiProbability: 5,
            indicators: ['Complex business logic', 'Personal code comments', 'Iterative development history'],
            vibeCheck: 'HUMAN_WRITTEN'
          }
        ],
        codePattern: 'HUMAN_WRITTEN'
      }
    },

    // Culture Fit Data
    cultureFitData: {
      overallFitScore: 88,
      values: [
        {
          name: 'Innovation',
          candidateScore: 92,
          companyScore: 85,
          match: 89,
          description: 'Strong evidence of innovative thinking through AI/ML projects'
        },
        {
          name: 'Collaboration',
          candidateScore: 78,
          companyScore: 90,
          match: 84,
          description: 'Good teamwork shown through open source contributions'
        },
        {
          name: 'Growth Mindset',
          candidateScore: 95,
          companyScore: 88,
          match: 92,
          description: 'Continuous learning evident from diverse technology stack'
        }
      ],
      teamDynamics: {
        leadershipStyle: 'Collaborative Technical Leader',
        collaborationScore: 84,
        independenceScore: 91,
        mentorshipInterest: 76
      },
      growthMindset: {
        learningAgility: 94,
        adaptability: 87,
        innovationDrive: 92
      },
      companyAlignment: {
        missionAlignment: 89,
        industryPassion: 85
      }
    },

    // OA Assessment Data
    oaData: {
      overallOARecommendation: 'skip' as const,
      confidenceScore: 91,
      skillsAssessment: [
        {
          skill: 'Data Structures & Algorithms',
          required: true,
          githubEvidence: [
            'Complex sorting algorithms in ScreenAI project',
            'Graph traversal implementation in microservices project',
            'Efficient data structure usage across multiple repositories'
          ],
          proficiencyLevel: 87,
          oaRequired: false,
          reasoning: 'Strong evidence of algorithmic thinking in production code'
        },
        {
          skill: 'System Design',
          required: true,
          githubEvidence: [
            'Microservices architecture implementation',
            'Scalable database design patterns',
            'Load balancing and caching strategies'
          ],
          proficiencyLevel: 92,
          oaRequired: false,
          reasoning: 'Excellent system design skills demonstrated through real projects'
        }
      ],
      algorithmicThinking: {
        score: 87,
        evidence: [
          'Implemented efficient sorting algorithms',
          'Complex data structure usage',
          'Optimization of database queries'
        ],
        oaNeeded: false
      },
      problemSolving: {
        score: 92,
        evidence: [
          'Solved complex architectural challenges',
          'Performance optimization implementations',
          'Creative solutions to technical problems'
        ],
        oaNeeded: false
      },
      codeQuality: {
        score: 94,
        evidence: [
          'Consistent code style and documentation',
          'Comprehensive test coverage',
          'Clean architecture patterns'
        ],
        oaNeeded: false
      },
      domainExpertise: {
        score: 89,
        evidence: [
          'AI/ML integration expertise',
          'Full-stack development proficiency',
          'Cloud architecture knowledge'
        ],
        oaNeeded: false
      },
      summary: 'This candidate demonstrates exceptional technical skills through their GitHub portfolio. Their code quality, system design abilities, and problem-solving approach are well above average. An OA would be redundant given the substantial evidence of their capabilities.',
      recommendations: [
        'Skip technical OA - GitHub portfolio provides sufficient evidence',
        'Consider behavioral interview to assess culture fit',
        'Discuss specific project experiences and challenges'
      ]
    },

    // Blog Analysis Data
    blogData: {
      overallScore: 82,
      thoughtLeadershipScore: 85,
      technicalWritingScore: 87,
      consistencyScore: 78,
      totalPosts: 23,
      totalViews: 45600,
      totalEngagement: 1240,
      platforms: ['Medium', 'Dev.to', 'Personal Blog'],
      topTopics: [
        { topic: 'Machine Learning', count: 8 },
        { topic: 'React', count: 6 },
        { topic: 'System Design', count: 5 },
        { topic: 'DevOps', count: 4 }
      ],
      posts: [
        {
          title: 'Building Scalable AI-Powered Applications with React and Node.js',
          url: 'https://medium.com/@asahapde/building-scalable-ai-apps',
          platform: 'Medium',
          publishedDate: '2024-01-15',
          readTime: 8,
          views: 2340,
          likes: 89,
          comments: 23,
          topics: ['AI', 'React', 'Node.js', 'Architecture'],
          relevanceScore: 94,
          qualityScore: 91,
          summary: 'Comprehensive guide on integrating AI capabilities into modern web applications'
        },
        {
          title: 'Microservices Architecture: Lessons from Production',
          url: 'https://dev.to/asahapde/microservices-production-lessons',
          platform: 'Dev.to',
          publishedDate: '2024-01-10',
          readTime: 12,
          views: 3200,
          likes: 145,
          comments: 34,
          topics: ['Microservices', 'Docker', 'Kubernetes', 'Architecture'],
          relevanceScore: 89,
          qualityScore: 93,
          summary: 'Real-world experiences and best practices for microservices deployment'
        }
      ],
      writingAnalysis: {
        averageReadTime: 9,
        averageQuality: 87,
        averageRelevance: 91,
        writingStyle: 'Technical and Engaging',
        technicalDepth: 'Deep and Comprehensive'
      },
      careerImpact: {
        thoughtLeadership: 85,
        industryRecognition: 78,
        knowledgeSharing: 92,
        communityEngagement: 81
      }
    },

    // Stack Overflow Data
    stackOverflowData: {
      profile: {
        reputation: 4250,
        badgeCount: 23,
        goldBadges: 1,
        silverBadges: 5,
        bronzeBadges: 17,
        questionsAsked: 12,
        answersProvided: 67,
        memberSince: '2019',
        lastActive: '3 days ago'
      },
      expertise: {
        topTags: [
          { tag: 'javascript', score: 156, posts: 23 },
          { tag: 'react', score: 134, posts: 19 },
          { tag: 'node.js', score: 98, posts: 15 },
          { tag: 'python', score: 87, posts: 12 },
          { tag: 'aws', score: 76, posts: 8 }
        ],
        knowledgeAreas: ['Frontend Development', 'Backend APIs', 'Cloud Architecture', 'Database Design'],
        expertiseLevel: 78,
        consistencyScore: 82
      },
      engagement: {
        helpfulnessScore: 85,
        communityContribution: 79,
        mentorshipIndicator: 71,
        problemSolvingScore: 88
      },
      recentActivity: [
        {
          id: 1,
          type: 'answer' as const,
          title: 'How to optimize React component re-renders?',
          tags: ['react', 'performance', 'optimization'],
          score: 23,
          views: 1240,
          answers: 0,
          accepted: true,
          createdDate: '2024-01-18',
          summary: 'Comprehensive answer about React optimization techniques'
        },
        {
          id: 2,
          type: 'question' as const,
          title: 'Best practices for Node.js microservices deployment',
          tags: ['node.js', 'microservices', 'docker'],
          score: 15,
          views: 890,
          answers: 4,
          accepted: false,
          createdDate: '2024-01-12',
          summary: 'Asking about deployment strategies for Node.js microservices'
        }
      ],
      careerRelevance: {
        jobRelevantTags: ['react', 'javascript', 'node.js', 'typescript'],
        domainExpertise: 84,
        technicalDepth: 81,
        practicalExperience: 87
      }
    }
  }
}

function ResultsContent() {
  const searchParams = useSearchParams()
  const candidateId = searchParams.get("id")
  const fromDashboard = searchParams.get("from") === "dashboard"
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  // Get candidate and job data
  const candidate = mockResumes.find(r => r.id === candidateId)
  const job = candidate ? mockJobs.find(j => j.id === candidate.jobId) : null
  const analysis = candidate && job ? generateEnhancedAnalysisData(candidateId || undefined) : null

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
          <p className="text-lg text-gray-600">Loading comprehensive analysis...</p>
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
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>{fromDashboard ? "Back to Dashboard" : "Back to Home"}</span>
              </Link>
              {!fromDashboard && (
                <Link href="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                  <FileText className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share Analysis
              </Button>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Brain className="h-8 w-8 text-indigo-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">ScreenAI</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-8xl mx-auto">
          {/* Header with Candidate Info */}
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                    </div>

                    {/* Social Links */}
                    {candidate.parsedData?.socialLinks && (
                      <div className="pt-4 border-t">
                        <p className="text-sm font-medium mb-2">Social Profiles</p>
                        <div className="flex flex-wrap gap-2">
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

              {/* Job Details */}
              <div className="lg:col-span-1">
                <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-5 w-5 text-indigo-600" />
                      <CardTitle className="text-lg">Position</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <p className="text-gray-600">{job.company}</p>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium mb-2">Key Requirements</p>
                      <div className="flex flex-wrap gap-1">
                        {job.requirements.slice(0, 4).map((req) => (
                          <Badge key={req} variant="secondary" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Overall Scores */}
              <div className="lg:col-span-2">
                <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Award className="h-5 w-5 text-purple-600" />
                      <CardTitle className="text-lg">Analysis Summary</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                          {analysis.overallScore}%
                        </div>
                        <div className="text-sm text-gray-500">Overall Score</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${getScoreColor(analysis.matchPercentage)}`}>
                          {analysis.matchPercentage}%
                        </div>
                        <div className="text-sm text-gray-500">Role Match</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${getScoreColor(analysis.cultureFitData.overallFitScore)}`}>
                          {analysis.cultureFitData.overallFitScore}%
                        </div>
                        <div className="text-sm text-gray-500">Culture Fit</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                          {analysis.oaData.overallOARecommendation === 'skip' ? 'SKIP' : 'REQUIRED'}
                        </div>
                        <div className="text-sm text-gray-500">OA Status</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Comprehensive Analysis Tabs */}
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b px-6 py-4">
                  <TabsList className="grid w-full grid-cols-6 bg-white/50">
                    <TabsTrigger value="overview" className="flex items-center space-x-2">
                      <Target className="h-4 w-4" />
                      <span>Overview</span>
                    </TabsTrigger>
                    <TabsTrigger value="github" className="flex items-center space-x-2">
                      <Github className="h-4 w-4" />
                      <span>GitHub</span>
                    </TabsTrigger>
                    <TabsTrigger value="culture" className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Culture Fit</span>
                    </TabsTrigger>
                    <TabsTrigger value="oa" className="flex items-center space-x-2">
                      <Brain className="h-4 w-4" />
                      <span>OA Analysis</span>
                    </TabsTrigger>
                    <TabsTrigger value="content" className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4" />
                      <span>Content</span>
                    </TabsTrigger>
                    <TabsTrigger value="community" className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>Community</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-6">
                  <TabsContent value="overview" className="mt-0">
                    <div className="space-y-6">
                      {/* Visual Score Dashboard */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-indigo-100 text-sm font-medium">Overall Score</p>
                                <p className="text-3xl font-bold">{analysis.overallScore}%</p>
                              </div>
                              <div className="p-2 bg-white/20 rounded-lg">
                                <TrendingUp className="h-6 w-6" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-green-100 text-sm font-medium">Role Match</p>
                                <p className="text-3xl font-bold">{analysis.matchPercentage}%</p>
                              </div>
                              <div className="p-2 bg-white/20 rounded-lg">
                                <Target className="h-6 w-6" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-blue-100 text-sm font-medium">Culture Fit</p>
                                <p className="text-3xl font-bold">{analysis.cultureFitData.overallFitScore}%</p>
                              </div>
                              <div className="p-2 bg-white/20 rounded-lg">
                                <Users className="h-6 w-6" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className={`border-0 text-white ${
                          analysis.overallScore >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                          analysis.overallScore >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
                          'bg-gradient-to-r from-red-500 to-pink-600'
                        }`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-white/80 text-sm font-medium">Status</p>
                                <p className="text-lg font-bold">
                                  {analysis.overallScore >= 80 ? 'HIRE' :
                                   analysis.overallScore >= 60 ? 'MAYBE' :
                                   'REJECT'}
                                </p>
                              </div>
                              <div className="p-2 bg-white/20 rounded-lg">
                                {analysis.overallScore >= 80 ? <CheckCircle className="h-6 w-6" /> :
                                 analysis.overallScore >= 60 ? <AlertCircle className="h-6 w-6" /> :
                                 <XCircle className="h-6 w-6" />}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* AI Detection Alert */}
                      {analysis.githubData?.aiGeneratedCodeDetection && (
                        <Card className={`${
                          analysis.githubData.aiGeneratedCodeDetection.overallAIScore > 50 
                            ? 'bg-red-50 border-red-200' 
                            : 'bg-green-50 border-green-200'
                        }`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${
                                  analysis.githubData.aiGeneratedCodeDetection.overallAIScore > 50 
                                    ? 'bg-red-100' 
                                    : 'bg-green-100'
                                }`}>
                                  <Bot className={`h-5 w-5 ${
                                    analysis.githubData.aiGeneratedCodeDetection.overallAIScore > 50 
                                      ? 'text-red-600' 
                                      : 'text-green-600'
                                  }`} />
                                </div>
                                <div>
                                  <h3 className={`font-semibold ${
                                    analysis.githubData.aiGeneratedCodeDetection.overallAIScore > 50 
                                      ? 'text-red-800' 
                                      : 'text-green-800'
                                  }`}>
                                    AI Code Detection
                                  </h3>
                                  <p className={`text-sm ${
                                    analysis.githubData.aiGeneratedCodeDetection.overallAIScore > 50 
                                      ? 'text-red-700' 
                                      : 'text-green-700'
                                  }`}>
                                    {analysis.githubData.aiGeneratedCodeDetection.overallAIScore > 50 
                                      ? `⚠️ High AI probability detected (${analysis.githubData.aiGeneratedCodeDetection.overallAIScore}%)`
                                      : `✅ Authentic human-written code (${100 - analysis.githubData.aiGeneratedCodeDetection.overallAIScore}% confidence)`}
                                  </p>
                                </div>
                              </div>
                              <Badge className={
                                analysis.githubData.aiGeneratedCodeDetection.overallAIScore > 50 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-green-100 text-green-800'
                              }>
                                {analysis.githubData.aiGeneratedCodeDetection.codePattern || 'HUMAN_WRITTEN'}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Key Insights - Dynamic based on score */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {analysis.overallScore >= 80 ? (
                          <>
                            <Card className="bg-green-50 border-green-200">
                              <CardHeader className="pb-3">
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                  <CardTitle className="text-lg text-green-800">✅ Verified Strengths</CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-2 text-sm">
                                  <li className="flex items-start space-x-2">
                                    <Star className="h-4 w-4 text-green-600 mt-0.5" />
                                    <span>Exceptional GitHub portfolio with {analysis.githubData?.profile.totalStars || 1139} stars</span>
                                  </li>
                                  <li className="flex items-start space-x-2">
                                    <Code className="h-4 w-4 text-green-600 mt-0.5" />
                                    <span>Strong AI/ML expertise with real implementations</span>
                                  </li>
                                  <li className="flex items-start space-x-2">
                                    <Building2 className="h-4 w-4 text-green-600 mt-0.5" />
                                    <span>Proven scalable architecture experience</span>
                                  </li>
                                  <li className="flex items-start space-x-2">
                                    <BookOpen className="h-4 w-4 text-green-600 mt-0.5" />
                                    <span>Active technical blogger and community member</span>
                                  </li>
                                </ul>
                              </CardContent>
                            </Card>

                            <Card className="bg-blue-50 border-blue-200">
                              <CardHeader className="pb-3">
                                <div className="flex items-center space-x-2">
                                  <Lightbulb className="h-5 w-5 text-blue-600" />
                                  <CardTitle className="text-lg text-blue-800">💡 Interview Focus</CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-2 text-sm">
                                  <li className="flex items-start space-x-2">
                                    <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                                    <span>Discuss specific project architectures</span>
                                  </li>
                                  <li className="flex items-start space-x-2">
                                    <Users className="h-4 w-4 text-blue-600 mt-0.5" />
                                    <span>Explore team leadership experience</span>
                                  </li>
                                  <li className="flex items-start space-x-2">
                                    <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                                    <span>Career growth motivations</span>
                                  </li>
                                </ul>
                              </CardContent>
                            </Card>

                            <Card className="bg-purple-50 border-purple-200">
                              <CardHeader className="pb-3">
                                <div className="flex items-center space-x-2">
                                  <Zap className="h-5 w-5 text-purple-600" />
                                  <CardTitle className="text-lg text-purple-800">🚀 Recommendations</CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-2 text-sm">
                                  <li className="flex items-start space-x-2">
                                    <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                                    <span>Skip technical OA - GitHub proves competency</span>
                                  </li>
                                  <li className="flex items-start space-x-2">
                                    <Calendar className="h-4 w-4 text-purple-600 mt-0.5" />
                                    <span>Fast-track to senior interview round</span>
                                  </li>
                                  <li className="flex items-start space-x-2">
                                    <DollarSign className="h-4 w-4 text-purple-600 mt-0.5" />
                                    <span>Prepare competitive offer package</span>
                                  </li>
                                </ul>
                              </CardContent>
                            </Card>
                          </>
                        ) : (
                          <>
                            <Card className="bg-red-50 border-red-200">
                              <CardHeader className="pb-3">
                                <div className="flex items-center space-x-2">
                                  <AlertTriangle className="h-5 w-5 text-red-600" />
                                  <CardTitle className="text-lg text-red-800">🚨 Major Red Flags</CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-2 text-sm">
                                  <li className="flex items-start space-x-2">
                                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                                    <span>Resume claims don't match GitHub evidence</span>
                                  </li>
                                  <li className="flex items-start space-x-2">
                                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                                    <span>Minimal technical contribution history</span>
                                  </li>
                                  <li className="flex items-start space-x-2">
                                    <Bot className="h-4 w-4 text-red-600 mt-0.5" />
                                    <span>Possible AI-generated code detected</span>
                                  </li>
                                  <li className="flex items-start space-x-2">
                                    <Shield className="h-4 w-4 text-red-600 mt-0.5" />
                                    <span>Fraudulent application suspected</span>
                                  </li>
                                </ul>
                              </CardContent>
                            </Card>

                            <Card className="bg-orange-50 border-orange-200">
                              <CardHeader className="pb-3">
                                <div className="flex items-center space-x-2">
                                  <MessageSquare className="h-5 w-5 text-orange-600" />
                                  <CardTitle className="text-lg text-orange-800">❓ Interview Questions</CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-2 text-sm">
                                  {analysis.githubData?.codeVerification?.disputedClaims?.slice(0,3).map((claim, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                      <HelpCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                                      <span>"Can you walk me through your {claim.claim.toLowerCase()}?"</span>
                                    </li>
                                  )) || (
                                    <>
                                      <li className="flex items-start space-x-2">
                                        <HelpCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                                        <span>"Explain your role in the enterprise projects mentioned"</span>
                                      </li>
                                      <li className="flex items-start space-x-2">
                                        <HelpCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                                        <span>"Walk us through your microservices architecture"</span>
                                      </li>
                                    </>
                                  )}
                                </ul>
                              </CardContent>
                            </Card>

                            <Card className="bg-gray-50 border-gray-200">
                              <CardHeader className="pb-3">
                                <div className="flex items-center space-x-2">
                                  <Ban className="h-5 w-5 text-gray-600" />
                                  <CardTitle className="text-lg text-gray-800">⛔ Actions</CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3">
                                  <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white">
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject Application
                                  </Button>
                                  <Button size="sm" variant="outline" className="w-full border-gray-400 text-gray-700">
                                    <Shield className="h-4 w-4 mr-2" />
                                    Flag for Fraud Review
                                  </Button>
                                  <Button size="sm" variant="outline" className="w-full border-gray-400 text-gray-700">
                                    <Ban className="h-4 w-4 mr-2" />
                                    Add to Blacklist
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </>
                        )}
                      </div>

                      {/* Skills Match */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Skills Analysis</CardTitle>
                          <CardDescription>Detailed breakdown of required vs demonstrated skills</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {job.requirements.map((requirement, index) => {
                              const isMatch = candidate.parsedData?.skills?.some(skill => 
                                skill.toLowerCase().includes(requirement.toLowerCase())
                              )
                              return (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    {isMatch ? (
                                      <CheckCircle className="h-5 w-5 text-green-500" />
                                    ) : (
                                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                                    )}
                                    <span className="font-medium">{requirement}</span>
                                  </div>
                                  <Badge variant={isMatch ? "default" : "secondary"}>
                                    {isMatch ? "Verified" : "To Assess"}
                                  </Badge>
                                </div>
                              )
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="github" className="mt-0">
                    <GitHubAnalysis username="asahapde" data={analysis.githubData} />
                  </TabsContent>

                  <TabsContent value="culture" className="mt-0">
                    <CultureFitAnalysis 
                      company={job.company}
                      role={job.title}
                      data={analysis.cultureFitData}
                    />
                  </TabsContent>

                  <TabsContent value="oa" className="mt-0">
                    <OAAssessment data={analysis.oaData} />
                  </TabsContent>

                  <TabsContent value="content" className="mt-0">
                    <BlogAnalysis data={analysis.blogData} />
                  </TabsContent>

                  <TabsContent value="community" className="mt-0">
                    <StackOverflowAnalysis username="asahapde" data={analysis.stackOverflowData} />
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
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
          <p className="text-lg text-gray-600">Loading analysis...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}