"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, Clock, User, LogOut, Phone, Mail, AlertCircle, FileText, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { ScrollReveal } from "@/components/scroll-reveal"
import { databases } from "@/lib/appwrite"

// Type definitions
type Appointment = { 
  $id?: string; 
  name?: string; 
  email?: string; 
  phone?: string; 
  service?: string; 
  doctor?: string; 
  date?: string; 
  time?: string; 
  status?: string 
}

const demoPatient = {
  name: "John Kamau",
  email: "patient@example.com",
  phone: "+254 700 123 456",
  allergies: ["Penicillin"],
}

export default function PatientDashboard() {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [patientData, setPatientData] = useState(demoPatient)

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "patient") {
      router.push("/patient/login")
      return
    }

    async function loadAppointments() {
      try {
        const headers: Record<string, string> = {}
        if (user?.id) headers["x-appwrite-user-id"] = user.id
        if (user?.email) headers["x-appwrite-user-email"] = user.email

        const resp = await fetch(`/api/appointments`, { headers })
        if (!resp.ok) throw new Error("Failed to load appointments")
        const json = await resp.json()
        setAppointments((json.appointments || []).map((d: any) => ({ ...d })))
      } catch (err) {
        console.error("Failed to load appointments:", err)
      }
    }

    if (user && user.type === "patient") {
      setPatientData((prev) => ({ ...prev, name: user.name, email: user.email }))
    }

    loadAppointments()
  }, [isAuthenticated, user, router])

  const handleLogout = async () => {
    logout()
    router.push("/")
  }

  // Formatting helper to fix the error you saw in logs
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return isNaN(date.getTime()) 
      ? dateString 
      : date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">D</span>
            </div>
            <span className="font-serif text-xl font-semibold">Dental<span className="text-primary">Care</span></span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">Welcome, {user?.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <ScrollReveal>
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-semibold text-foreground">Patient Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your appointments and health records</p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Col: Personal Info */}
          <div className="space-y-6">
            <ScrollReveal delay={100}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-primary" />Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{patientData.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm">{patientData.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm">{patientData.phone}</p>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Allergies: {patientData.allergies?.join(", ")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          {/* Right Col: Appointments & History */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Upcoming Appointments */}
            <ScrollReveal delay={150}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" />Upcoming Appointments</CardTitle>
                      <CardDescription>Your scheduled visits</CardDescription>
                    </div>
                    <div>
                      <Link href="/book-appointment?from=dashboard">
                        <Button size="sm" className="ml-2">Book Appointment</Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointments.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No upcoming appointments scheduled.
                      </div>
                    ) : (
                      appointments.map((apt, idx) => (
                        <div key={(apt as any).$id || idx} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Clock className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{apt.service || "General Consultation"}</p>
                              <p className="text-sm text-muted-foreground">{apt.doctor || "Dr. Assigned"}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(apt.date)} at {apt.time}
                              </p>
                            </div>
                          </div>
                          <div className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {apt.status || "pending"}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Treatment History (Placeholder for now) */}
            <ScrollReveal delay={250}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-primary" />Treatment History</CardTitle>
                  <CardDescription>Your past treatments and procedures</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Initial Consultation</p>
                        <p className="text-sm text-muted-foreground">System Record</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Account created
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

          </div>
        </div>
      </main>
    </div>
  )
}