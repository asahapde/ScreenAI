# ScreenAI - AI-Powered Candidate Screening Platform

**Screen Smarter. Hire Faster.**

ScreenAI is a comprehensive AI-powered candidate screening platform that verifies candidate claims across their resume, GitHub, LinkedIn, and more. It provides recruiters with intelligent insights, fit scoring, and red flag detection to make better hiring decisions.

## 🚀 Features

### Core Features
- **Resume Upload + Enrichment**: Upload PDF/DOC resumes with automatic text extraction and parsing
- **Automated Online Presence Scraper**: Analyze GitHub, LinkedIn, and portfolio websites
- **AI Verification Engine**: Groq-powered analysis with Llama models for skills and experience
- **Job Context Input**: Compare candidates against specific job requirements
- **Candidate-to-Job Fit Scoring**: Get precise 0-100 fit scores with detailed explanations
- **Results Dashboard**: Comprehensive analysis with tabbed interface
- **Red Flag Detection**: Identify inconsistencies and potential concerns

### Technical Features
- **Real-time Processing**: Server-Sent Events for live progress updates
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Modular Architecture**: Separated services for parsing, scraping, and AI analysis
- **File Handling**: Secure file upload with validation and storage

## 🛠 Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Radix UI** components
- **Lucide React** icons

### Backend
- **Next.js API Routes** for serverless functions
- **Server-Sent Events** for real-time updates
- **Groq API** with Llama models for AI analysis
- **PDF Parse** for resume parsing
- **Cheerio** for web scraping

### Services
- **Resume Parser**: Extract structured data from PDF/DOC files
- **Web Scraper**: Analyze GitHub, LinkedIn, and portfolio sites
- **AI Analyzer**: Groq-powered candidate assessment with Llama 3.3 70B and Llama 3.1 8B models

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Groq API key (required for AI analysis, will use mock data if not provided)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ScreenAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Groq API Configuration (required for AI analysis)
   # Get your free API key from: https://console.groq.com/keys
   GROQ_API_KEY=your_groq_api_key_here
   
   # Optional: For development/debugging
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### For Recruiters

1. **Upload a Resume**
   - Go to the upload page
   - Drag & drop or select a PDF/DOC resume
   - Optionally add candidate's social media profiles
   - Provide job description for better analysis

2. **Monitor Processing**
   - Watch real-time progress updates
   - See each step: parsing, scraping, analyzing, reporting

3. **Review Results**
   - View comprehensive analysis dashboard
   - Check fit score and confidence levels
   - Review strengths, gaps, and red flags
   - Download or share reports

### Analysis Components

- **Overview**: Executive summary and key highlights
- **Fit Score**: Detailed skill verification and evidence
- **Online Presence**: GitHub, LinkedIn, and portfolio analysis
- **Red Flags**: Inconsistencies and concerns
- **Share**: Download PDF reports and generate share links

## 🏗 Architecture

### Directory Structure
```
ScreenAI/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── upload/        # File upload endpoint
│   │   │   ├── process/       # Processing with SSE
│   │   │   └── results/       # Results retrieval
│   │   ├── upload/           # Upload page
│   │   ├── processing/       # Processing page
│   │   ├── results/          # Results page
│   │   └── layout.tsx        # Root layout
│   ├── components/           # React components
│   │   └── ui/              # Reusable UI components
│   ├── lib/                 # Utilities and services
│   │   └── services/        # Business logic services
│   ├── types/               # TypeScript definitions
│   └── utils/               # Helper functions
├── uploads/                 # File storage (created automatically)
└── public/                  # Static assets
```

### Data Flow

1. **Upload**: User uploads resume and provides context
2. **Parse**: Extract text and structured data from resume
3. **Scrape**: Analyze online presence (GitHub, LinkedIn, portfolio)
4. **Analyze**: AI-powered assessment using OpenAI
5. **Report**: Generate comprehensive analysis results
6. **Present**: Display results in interactive dashboard

## 🔧 Configuration

### Groq Integration
To enable AI analysis, get a free API key from [Groq Console](https://console.groq.com/keys) and add it to `.env.local`:
```env
GROQ_API_KEY=your_groq_api_key_here
```

**Models Used:**
- **Llama 3.3 70B Versatile** - For comprehensive candidate analysis and red flag detection
- **Llama 3.1 8B Instant** - For faster skill verification tasks
- **Gemma 2 9B** - Alternative model for diverse analysis perspectives

**Benefits of Groq:**
- **Ultra-fast inference** - 5-15x faster than traditional providers
- **Cost-effective** - Competitive pricing with high performance
- **OpenAI-compatible** - Seamless integration with familiar API patterns
- **Production-ready** - Enterprise-grade reliability and speed

Without an API key, the application will use mock data for demonstration.

### File Upload Limits
- Maximum file size: 10MB
- Supported formats: PDF, DOC, DOCX
- Files are stored in the `uploads/` directory

### Web Scraping
- GitHub: Uses public API for reliable data
- LinkedIn: Limited due to anti-scraping measures
- Portfolio: Analyzes projects and technologies

## 🚧 Development

### Running in Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Adding New Features

1. **New Analysis Service**: Add to `src/lib/services/`
2. **API Endpoints**: Create in `src/app/api/`
3. **UI Components**: Add to `src/components/`
4. **Types**: Define in `src/types/index.ts`

### Testing
```bash
# Test resume upload
curl -X POST http://localhost:3000/api/upload \
  -F "resume=@test-resume.pdf" \
  -F "candidateData={\"socialLinks\":{},\"extraContext\":\"\"}"

# Test processing
curl http://localhost:3000/api/process?id=<candidate-id>

# Test results
curl http://localhost:3000/api/results?id=<candidate-id>
```

## 🔒 Security Considerations

- File upload validation (type, size)
- Input sanitization for all user data
- Secure file storage with unique identifiers
- Rate limiting on API endpoints (recommended for production)
- Environment variable protection

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production
```env
OPENAI_API_KEY=your_production_api_key
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_secure_secret
```

## 📈 Performance

- **Resume Parsing**: ~2-5 seconds for typical resumes
- **Web Scraping**: ~10-30 seconds depending on sites
- **AI Analysis**: ~20-60 seconds with OpenAI API
- **Total Processing**: ~1-2 minutes end-to-end

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙋‍♂️ Support

For questions or support:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the example implementations in `/examples`

---

**ScreenAI** - Making recruitment smarter with AI-powered candidate analysis. 