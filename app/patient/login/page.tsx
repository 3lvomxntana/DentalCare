"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function PatientLoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [mode] = useState("recurring")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({ email: "", password: "" })

  const handleRecurringLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await login(formData.email, formData.password)

    if (result.success && result.user) {
      if (result.user.type === "staff") {
        router.push("/staff/dashboard")
      } else {
        router.push("/patient/dashboard")
      }
    } else {
      setError(result.error || "Login failed")
    }
    setIsLoading(false)
  }

  const handleNewPatientSubmit = async (e: React.FormEvent) => {
    // Registration UI removed — noop
    return
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="/happy-patient-at-dental-clinic-smiling-modern-heal.jpg" alt="Happy patient" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 p-8 bg-card/90 backdrop-blur-md rounded-2xl">
          <h2 className="text-2xl font-serif font-semibold text-card-foreground mb-2">
            Your smile journey starts here
          </h2>
          <p className="text-muted-foreground">
            Access your dental records, appointments, and treatment history all in one place.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Header */}
        <div className="p-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <ScrollReveal>
              <Link href="/" className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">D</span>
                </div>
                <span className="font-serif text-xl font-semibold">
                  Dental<span className="text-primary">Care</span>
                </span>
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-serif font-semibold text-foreground">Welcome back!</h1>
                  <p className="mt-2 text-muted-foreground">Sign in to access your patient dashboard</p>
                </div>

                <form onSubmit={handleRecurringLogin} className="space-y-4">
                  {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="patient@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="h-12"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full h-12" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                <div className="p-4 rounded-lg bg-muted text-sm">
                  <p className="font-medium text-foreground mb-1">Demo Credentials:</p>
                  <p className="text-muted-foreground">Email: patient@example.com</p>
                  <p className="text-muted-foreground">Password: patient123</p>
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ email: 'patient@example.com', password: 'patient123' })}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      Use demo credentials
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  )
}
