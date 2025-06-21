import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ScreenAI - AI-Powered Candidate Screening",
  description: "Screen candidates smarter and hire faster with AI-powered resume verification, online presence analysis, and job fit scoring.",
  keywords: ["AI", "recruitment", "candidate screening", "resume verification", "hiring"],
  authors: [{ name: "ScreenAI Team" }],
  creator: "ScreenAI",
  publisher: "ScreenAI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://screenai.app",
    siteName: "ScreenAI",
    title: "ScreenAI - AI-Powered Candidate Screening",
    description: "Screen candidates smarter and hire faster with AI-powered resume verification, online presence analysis, and job fit scoring.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScreenAI - AI-Powered Candidate Screening",
    description: "Screen candidates smarter and hire faster with AI-powered resume verification, online presence analysis, and job fit scoring.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background font-sans antialiased")}>
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  )
} 