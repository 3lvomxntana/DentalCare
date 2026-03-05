"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Shield, Loader2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth, DEMO_CREDENTIALS } from "@/lib/auth-context"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function StaffLoginPage() {
  const router = useRouter()
  const { login } = useAuth()

  // Redirect staff login route to unified sign-in page
  useEffect(() => {
    router.replace("/patient/login")
  }, [router])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    // This page redirects to /patient/login; keep fallback behavior identical to unified flow
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await login(formData.email, formData.password)
    if (result.success && result.user) {
      if (result.user.type === "staff") router.push("/staff/dashboard")
      else router.push("/patient/dashboard")
    } else {
      setError(result.error || "Login failed")
    }
    setIsLoading(false)
  }

  const fillCredentials = (role: keyof typeof DEMO_CREDENTIALS) => {
    const cred = DEMO_CREDENTIALS[role]
    setFormData({ email: cred.email, password: cred.password })
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-foreground">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        <div className="relative z-10 flex flex-col justify-center px-12">
          <ScrollReveal>
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-8">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-4xl font-serif font-semibold text-background mb-4">Staff Portal</h2>
            <p className="text-background/70 text-lg max-w-md">
              Access the dental clinic management system. Manage appointments, patients, and clinical records securely.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="mt-12 p-6 bg-background/10 backdrop-blur-sm rounded-2xl">
              <h3 className="font-semibold text-background mb-4">System Features</h3>
              <ul className="space-y-2 text-background/70 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Patient management & records
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Appointment scheduling
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Clinical documentation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Inventory tracking
                </li>
              </ul>
            </div>
          </ScrollReveal>
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
                  <h1 className="text-3xl font-serif font-semibold text-foreground">Staff Login</h1>
                  <p className="mt-2 text-muted-foreground">Sign in to access the management system</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="staff@dentalcare.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="h-12 pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
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

                {/* Demo Credentials */}
                <div className="p-6 rounded-2xl bg-muted/50 border border-border">
                  <h3 className="font-semibold text-foreground mb-4">Demo Credentials</h3>
                  <p className="text-sm text-muted-foreground mb-4">Click on a role to auto-fill the credentials:</p>
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => fillCredentials("admin")}
                      className="w-full p-3 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                    >
                      <div className="font-medium text-sm text-foreground">Admin</div>
                      <div className="text-xs text-muted-foreground">
                        {DEMO_CREDENTIALS.admin.email} / {DEMO_CREDENTIALS.admin.password}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => fillCredentials("dentist")}
                      className="w-full p-3 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                    >
                      <div className="font-medium text-sm text-foreground">Dentist</div>
                      <div className="text-xs text-muted-foreground">
                        {DEMO_CREDENTIALS.dentist.email} / {DEMO_CREDENTIALS.dentist.password}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => fillCredentials("receptionist")}
                      className="w-full p-3 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                    >
                      <div className="font-medium text-sm text-foreground">Receptionist</div>
                      <div className="text-xs text-muted-foreground">
                        {DEMO_CREDENTIALS.receptionist.email} / {DEMO_CREDENTIALS.receptionist.password}
                      </div>
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
