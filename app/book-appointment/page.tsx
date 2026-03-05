"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, User, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { account } from "@/lib/appwrite"
import { ScrollReveal } from "@/components/scroll-reveal"

const services = [
  "Regular Checkup",
  "Teeth Cleaning",
  "Teeth Whitening",
  "Dental Filling",
  "Root Canal",
  "Tooth Extraction",
  "Dental Implants",
  "Orthodontics",
  "Emergency Care",
]

const doctors = [
  { name: "Dentist", specialty: "Cosmetic Dentistry" },
  { name: "Dr. James Ochieng", specialty: "Oral Surgery" },
  { name: "Dr. Amina Hassan", specialty: "Pediatric Dentistry" },
  { name: "Dr. David Mwangi", specialty: "Orthodontics" },
]

const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
]

type Step = 1 | 2 | 3 | 4

export default function BookAppointmentPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isAutoRedirecting, setIsAutoRedirecting] = useState(false)
  const redirectTimeoutRef = useRef<number | null>(null)
  const redirectIntervalRef = useRef<number | null>(null)
  const [countdown, setCountdown] = useState<number>(0)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    doctor: "",
    date: "",
    time: "",
    notes: "",
  })

  const serviceDoctorMap: Record<string, string[]> = {
    "Regular Checkup": doctors.map((d) => d.name),
    "Teeth Cleaning": ["Dentist", "Dr. Amina Hassan", "Dr. David Mwangi"],
    "Teeth Whitening": ["Dentist", "Dr. James Ochieng", "Dr. David Mwangi"],
    "Dental Filling": ["Dentist", "Dr. James Ochieng", "Dr. Amina Hassan"],
    "Root Canal": ["Dr. James Ochieng", "Dr. Amina Hassan", "Dr. David Mwangi"],
    "Tooth Extraction": ["Dr. James Ochieng", "Dr. David Mwangi", "Dentist"],
    "Dental Implants": ["Dr. James Ochieng", "Dr. David Mwangi", "Dentist"],
    "Orthodontics": ["Dr. David Mwangi", "Dentist", "Dr. Amina Hassan"],
    "Emergency Care": [...doctors.map((d) => d.name), "Any"],
  }

  // Compute available doctors for the currently selected service
  const availableDoctors = formData.service ? serviceDoctorMap[formData.service] || doctors.map((d) => d.name) : doctors.map((d) => d.name)

  // If selected doctor is not available for the chosen service, clear it
  useEffect(() => {
    if (!formData.service) return
    if (formData.doctor && !availableDoctors.includes(formData.doctor)) {
      setFormData((prev) => ({ ...prev, doctor: "" }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.service])

  const searchParams = useSearchParams()

  // If user is logged in AND the navigation included ?from=dashboard,
  // prefill personal info and skip step 1. Otherwise start at step 1.
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        // Only prefill/skip when explicitly navigated from the patient dashboard
        if (searchParams?.get("from") !== "dashboard") return

        const user = await account.get()
        if (user && mounted) {
          setFormData((prev) => ({
            ...prev,
            name: user.name || prev.name,
            email: user.email || prev.email,
            phone: (user.phone || (user.prefs && user.prefs.phone)) || prev.phone,
          }))
          // Skip personal info step when logged in and coming from dashboard
          setStep(2)
        }
      } catch (e) {
        // Not logged in or account.get failed — leave at step 1
      }
    })()
    return () => {
      mounted = false
      // cleanup any redirect timers when component unmounts
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current)
        redirectTimeoutRef.current = null
      }
      if (redirectIntervalRef.current) {
        clearInterval(redirectIntervalRef.current)
        redirectIntervalRef.current = null
      }
    }
  }, [searchParams])

  const handleNext = () => {
    if (step < 4) setStep((step + 1) as Step)
  }

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as Step)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // If the user is logged in, include their Appwrite user id so server can set owner perms
      let headers: Record<string, string> = { "Content-Type": "application/json" }
      try {
        const user = await account.get()
        if (user && user.$id) headers["x-appwrite-user-id"] = user.$id
      } catch (e) {
        // Not logged in, proceed as anonymous
      }

      const resp = await fetch(`/api/appointments`, {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
      })

      if (!resp.ok) throw new Error("Failed to create appointment")

      setStep(4)
      // Only start auto-redirect when this booking was initiated from the patient dashboard
      const fromDashboard = searchParams?.get("from") === "dashboard"
      if (fromDashboard) {
        setIsAutoRedirecting(true)
        setCountdown(60)
        // final redirect after 60s
        const id = window.setTimeout(() => {
          try {
            router.push("/patient/dashboard")
          } catch (e) {
            /* ignore */
          }
        }, 60000)
        redirectTimeoutRef.current = id
        // start a 1s interval to update countdown
        redirectIntervalRef.current = window.setInterval(() => {
          setCountdown((c) => {
            if (c <= 1) {
              // clear interval when reaching zero
              if (redirectIntervalRef.current) {
                clearInterval(redirectIntervalRef.current)
                redirectIntervalRef.current = null
              }
              return 0
            }
            return c - 1
          })
        }, 1000)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const isStepValid = (currentStep: Step): boolean => {
    switch (currentStep) {
      case 1:
        return !!(formData.name && formData.email && formData.phone)
      case 2:
        return !!(formData.service && formData.doctor)
      case 3:
        return !!(formData.date && formData.time)
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <ScrollReveal>
          <div className="text-center mb-12">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">D</span>
              </div>
              <span className="font-serif text-xl font-semibold">
                Dental<span className="text-primary">Care</span>
              </span>
            </Link>
            <h1 className="text-3xl font-serif font-semibold text-foreground">Book Your Appointment</h1>
            <p className="mt-2 text-muted-foreground">Schedule your visit in just a few steps</p>
          </div>
        </ScrollReveal>

        {/* Progress Steps */}
        <ScrollReveal delay={100}>
          <div className="flex items-center justify-center gap-4 mb-12">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-300",
                    step >= s ? "bg-primary text-primary-foreground scale-110" : "bg-muted text-muted-foreground",
                    step === s && "ring-4 ring-primary/20",
                  )}
                >
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={cn(
                      "w-12 h-1 mx-2 rounded-full transition-colors duration-300",
                      step > s ? "bg-primary" : "bg-muted",
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Form Steps */}
        <ScrollReveal delay={200}>
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-xl">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Personal Information</h2>
                  <p className="text-muted-foreground mt-1">Tell us about yourself</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-12"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+254 700 000 000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Select Service & Doctor</h2>
                  <p className="text-muted-foreground mt-1">Choose your treatment and preferred doctor</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Service Type</Label>
                    <Select value={formData.service} onValueChange={(v) => setFormData({ ...formData, service: v })}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Doctor</Label>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {availableDoctors.map((doctorName) => {
                        const docMeta = doctors.find((d) => d.name === doctorName)
                        return (
                          <button
                            key={doctorName}
                            type="button"
                            onClick={() => setFormData({ ...formData, doctor: doctorName })}
                            className={cn(
                              "p-4 rounded-xl border text-left transition-all duration-300 hover:border-primary/50",
                              formData.doctor === doctorName ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border",
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{doctorName}</p>
                                <p className="text-sm text-muted-foreground">{docMeta?.specialty || "Clinic Doctor"}</p>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Choose Date & Time</h2>
                  <p className="text-muted-foreground mt-1">Select your preferred appointment slot</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Appointment Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="h-12 pl-12"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Available Time Slots</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setFormData({ ...formData, time })}
                          className={cn(
                            "p-3 rounded-lg border text-sm font-medium transition-all duration-300 hover:border-primary/50",
                            formData.time === time
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border text-foreground",
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any specific concerns or information we should know..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center py-8">
                {/* Auto-redirect toast/banner */}
                {isAutoRedirecting && (
                  <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-card border border-border rounded-xl shadow-lg p-4 flex items-center justify-between gap-4">
                    <div className="text-sm text-foreground">Redirecting to your dashboard{countdown > 0 ? ` in ${countdown}s` : "..."}</div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          // Immediately navigate now
                          if (redirectTimeoutRef.current) {
                            clearTimeout(redirectTimeoutRef.current)
                            redirectTimeoutRef.current = null
                          }
                          // clear interval too
                          if (redirectIntervalRef.current) {
                            clearInterval(redirectIntervalRef.current)
                            redirectIntervalRef.current = null
                          }
                          setIsAutoRedirecting(false)
                          router.push("/patient/dashboard")
                        }}
                      >
                        Go now
                      </Button>
                    </div>
                  </div>
                )}
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">Appointment Confirmed!</h2>
                <p className="text-muted-foreground mb-8">We&apos;ve sent a confirmation email to {formData.email}</p>

                <div className="bg-secondary/50 rounded-2xl p-6 text-left max-w-md mx-auto mb-8">
                  <h3 className="font-semibold text-foreground mb-4">Appointment Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service</span>
                      <span className="font-medium">{formData.service}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Doctor</span>
                      <span className="font-medium">{formData.doctor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">
                        {formData.date &&
                          new Date(formData.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time</span>
                      <span className="font-medium">{formData.time}</span>
                    </div>
                  </div>
                </div>

                {/* Show Back to Home for non-dashboard bookings; dashboard bookings use toast/auto-redirect */}
                {searchParams?.get("from") !== "dashboard" && (
                  <div className="flex justify-center">
                    <Link href="/">
                      <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                        Back to Home
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            {step < 4 && (
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 1}
                  className="gap-2 bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>

                {step < 3 ? (
                  <Button onClick={handleNext} disabled={!isStepValid(step)} className="gap-2">
                    Continue
                    <Clock className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={!isStepValid(step) || isLoading} className="gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        Confirm Booking
                        <CheckCircle className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
        </ScrollReveal>
      </main>
    </div>
  )
}
