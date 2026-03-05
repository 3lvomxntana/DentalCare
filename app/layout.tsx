import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { AppwritePinger } from "@/components/appwrite-pinger"
import { AppwriteHealth } from "@/components/appwrite-health"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })

export const metadata: Metadata = {
  title: "dentalcare - Modern Dental Care",
  description: "Experience modern dentistry with a gentle touch. Comprehensive dental care for your whole family.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* Added suppressHydrationWarning to fix the hydration mismatch error */}
      <body className="font-sans antialiased" suppressHydrationWarning>
        <AuthProvider>
          <AppwritePinger />
          {children}
          <AppwriteHealth />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}