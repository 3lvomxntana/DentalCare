"use client"

import { DashboardLayout } from "./dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/scroll-reveal"
import { useAuth } from "@/lib/auth-context"
import { Calendar, Clock, User, FileText, AlertCircle, CheckCircle, ChevronRight, Phone, Mail } from "lucide-react"

const todayAppointments = [
  {
    id: 1,
    patient: "Grace Wanjiku",
    time: "9:00 AM",
    type: "Regular Checkup",
    status: "completed",
    phone: "+254 700 111 222",
  },
  {
    id: 2,
    patient: "Peter Njoroge",
    time: "10:30 AM",
    type: "Dental Filling",
    status: "in-progress",
    phone: "+254 700 333 444",
  },
  {
    id: 3,
    patient: "Fatima Ali",
    time: "11:30 AM",
    type: "Root Canal",
    status: "waiting",
    phone: "+254 700 555 666",
  },
  {
    id: 4,
    patient: "John Kamau",
    time: "2:00 PM",
    type: "Teeth Cleaning",
    status: "scheduled",
    phone: "+254 700 777 888",
  },
]

const upcomingAppointments = [
  { patient: "Mary Akinyi", date: "Tomorrow", time: "9:30 AM", type: "Consultation" },
  { patient: "David Omondi", date: "Jan 22", time: "11:00 AM", type: "Follow-up" },
  { patient: "Sarah Muthoni", date: "Jan 23", time: "10:00 AM", type: "Extraction" },
]

const patientDetails = {
  name: "Peter Njoroge",
  age: 45,
  phone: "+254 700 333 444",
  email: "peter@example.com",
  allergies: ["Penicillin", "Latex"],
  medicalHistory: ["Hypertension", "Diabetes Type 2"],
  lastVisit: "2024-11-15",
  treatments: [
    { date: "2024-11-15", treatment: "Dental Cleaning" },
    { date: "2024-08-20", treatment: "Cavity Filling" },
    { date: "2024-05-10", treatment: "X-Ray Examination" },
  ],
}

export function DentistDashboard() {
  const { user } = useAuth()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500"
      case "in-progress":
        return "bg-blue-500/10 text-blue-500"
      case "waiting":
        return "bg-yellow-500/10 text-yellow-500"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <DashboardLayout title="Doctor Dashboard" subtitle={`Good morning, ${user?.name || "Doctor"}!`}>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="lg:col-span-2 space-y-6">
          <ScrollReveal>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Today&apos;s Schedule
                </CardTitle>
                <CardDescription>Your appointments for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[60px]">
                          <Clock className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                          <span className="text-sm font-medium">{apt.time}</span>
                        </div>
                        <div className="w-px h-12 bg-border" />
                        <div>
                          <p className="font-medium text-foreground">{apt.patient}</p>
                          <p className="text-sm text-muted-foreground">{apt.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${getStatusColor(apt.status)}`}
                        >
                          {apt.status}
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Patient Details - Current Patient */}
          <ScrollReveal delay={200}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Current Patient Details
                </CardTitle>
                <CardDescription>Peter Njoroge - Dental Filling</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{patientDetails.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{patientDetails.email}</span>
                      </div>
                    </div>

                    {/* Allergies */}
                    <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-destructive" />
                        <span className="font-medium text-destructive">Allergies</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {patientDetails.allergies.map((allergy) => (
                          <span
                            key={allergy}
                            className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive"
                          >
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Medical History */}
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Medical History</h4>
                      <div className="flex flex-wrap gap-2">
                        {patientDetails.medicalHistory.map((condition) => (
                          <span
                            key={condition}
                            className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                          >
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Treatment History */}
                  <div>
                    <h4 className="font-medium text-foreground mb-4">Past Treatments</h4>
                    <div className="space-y-3">
                      {patientDetails.treatments.map((treatment, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <CheckCircle className="w-4 h-4 text-primary" />
                          <div>
                            <p className="text-sm font-medium">{treatment.treatment}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(treatment.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <Button className="gap-2">
                    <FileText className="w-4 h-4" />
                    Add Clinical Notes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <ScrollReveal delay={100}>
            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10">
                    <span className="text-sm">Completed</span>
                    <span className="font-semibold text-green-500">1</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10">
                    <span className="text-sm">In Progress</span>
                    <span className="font-semibold text-blue-500">1</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10">
                    <span className="text-sm">Waiting</span>
                    <span className="font-semibold text-yellow-500">1</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <span className="text-sm">Scheduled</span>
                    <span className="font-semibold">1</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Upcoming */}
          <ScrollReveal delay={200}>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingAppointments.map((apt, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    >
                      <p className="font-medium text-sm">{apt.patient}</p>
                      <p className="text-xs text-muted-foreground">
                        {apt.date} at {apt.time}
                      </p>
                      <p className="text-xs text-primary">{apt.type}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </DashboardLayout>
  )
}
