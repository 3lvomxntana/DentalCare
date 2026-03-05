"use client"

import { useState } from "react"
import { DashboardLayout } from "./dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Calendar, Clock, UserPlus, Phone, CheckCircle, XCircle, Search, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const todayAppointments = [
  {
    id: 1,
    patient: "Grace Wanjiku",
    doctor: "Dentist",
    time: "9:00 AM",
    type: "Checkup",
    status: "confirmed",
  },
  {
    id: 2,
    patient: "Peter Njoroge",
    doctor: "Dr. James Ochieng",
    time: "10:30 AM",
    type: "Filling",
    status: "pending",
  },
  { id: 3, patient: "Fatima Ali", doctor: "Dr. Amina Hassan", time: "11:30 AM", type: "Cleaning", status: "confirmed" },
  {
    id: 4,
    patient: "John Kamau",
    doctor: "Dr. David Mwangi",
    time: "2:00 PM",
    type: "Consultation",
    status: "pending",
  },
  {
    id: 5,
    patient: "Mary Akinyi",
    doctor: "Dentist",
    time: "3:00 PM",
    type: "Follow-up",
    status: "confirmed",
  },
]

const recentPatients = [
  { name: "Grace Wanjiku", phone: "+254 700 111 222", lastVisit: "Today" },
  { name: "Peter Njoroge", phone: "+254 700 333 444", lastVisit: "Today" },
  { name: "David Omondi", phone: "+254 700 555 666", lastVisit: "Yesterday" },
  { name: "Sarah Muthoni", phone: "+254 700 777 888", lastVisit: "2 days ago" },
]

export function ReceptionistDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [appointments, setAppointments] = useState(todayAppointments)

  // Register patient form state
  const [regName, setRegName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPhone, setRegPhone] = useState("")
  const [regDob, setRegDob] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [registering, setRegistering] = useState(false)
  const [registerMessage, setRegisterMessage] = useState<string | null>(null)
  // Doctor registration state
  const [docName, setDocName] = useState("")
  const [docEmail, setDocEmail] = useState("")
  const [docPhone, setDocPhone] = useState("")
  const [docPassword, setDocPassword] = useState("")
  const [docRegistering, setDocRegistering] = useState(false)
  const [docRegisterMessage, setDocRegisterMessage] = useState<string | null>(null)

  const handleConfirm = (id: number) => {
    setAppointments(appointments.map((apt) => (apt.id === id ? { ...apt, status: "confirmed" } : apt)))
  }

  const handleCancel = (id: number) => {
    setAppointments(appointments.map((apt) => (apt.id === id ? { ...apt, status: "cancelled" } : apt)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-500"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500"
      case "cancelled":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <DashboardLayout title="Reception Dashboard" subtitle="Manage appointments and patient registrations">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <ScrollReveal>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <a href="/receptionist/patients/new" className="block">
                  <Button className="h-auto p-6 flex flex-col items-start gap-2 bg-transparent" variant="outline">
                    <UserPlus className="w-6 h-6 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Register Patient</p>
                      <p className="text-sm text-muted-foreground">Add new patient to system</p>
                    </div>
                  </Button>
                </a>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="h-auto p-6 flex flex-col items-start gap-2 bg-transparent" variant="outline">
                    <Plus className="w-6 h-6 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Schedule Appointment</p>
                      <p className="text-sm text-muted-foreground">Book a new appointment</p>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Schedule Appointment</DialogTitle>
                    <DialogDescription>Book a new appointment for a patient</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Patient</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {recentPatients.map((patient) => (
                            <SelectItem key={patient.name} value={patient.name}>
                              {patient.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Doctor</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dentist">Dentist</SelectItem>
                          <SelectItem value="dr-james">Dr. James Ochieng</SelectItem>
                          <SelectItem value="dr-amina">Dr. Amina Hassan</SelectItem>
                          <SelectItem value="dr-david">Dr. David Mwangi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label>Time</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="9:00">9:00 AM</SelectItem>
                            <SelectItem value="10:00">10:00 AM</SelectItem>
                            <SelectItem value="11:00">11:00 AM</SelectItem>
                            <SelectItem value="14:00">2:00 PM</SelectItem>
                            <SelectItem value="15:00">3:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button className="w-full">Schedule Appointment</Button>
                  </div>
                </DialogContent>
              </Dialog>
              {/* Register Doctor */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="h-auto p-6 flex flex-col items-start gap-2 bg-transparent" variant="outline">
                    <UserPlus className="w-6 h-6 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Register Doctor</p>
                      <p className="text-sm text-muted-foreground">Add new dentist to system</p>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Register New Doctor</DialogTitle>
                    <DialogDescription>Enter doctor details to create a new account</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input placeholder="Dr. Amina Hassan" value={docName} onChange={(e) => setDocName(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input type="email" placeholder="amina@example.com" value={docEmail} onChange={(e) => setDocEmail(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input type="tel" placeholder="+254 700 000 000" value={docPhone} onChange={(e) => setDocPhone(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input type="password" placeholder="(optional) set password" value={docPassword} onChange={(e) => setDocPassword(e.target.value)} />
                    </div>
                    {docRegisterMessage && <p className="text-sm text-muted-foreground">{docRegisterMessage}</p>}
                    <Button
                      className="w-full"
                      onClick={async () => {
                        setDocRegistering(true)
                        setDocRegisterMessage(null)
                        try {
                          const res = await fetch('/api/staff', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ name: docName, email: docEmail, phone: docPhone, password: docPassword, role: 'doctor' }),
                          })
                          const json = await res.json()
                          if (res.ok) {
                            setDocRegisterMessage('Doctor registered successfully')
                            setDocName('')
                            setDocEmail('')
                            setDocPhone('')
                            setDocPassword('')
                          } else {
                            setDocRegisterMessage(json?.message || 'Registration failed')
                          }
                        } catch (err) {
                          console.error(err)
                          setDocRegisterMessage('Server error')
                        } finally {
                          setDocRegistering(false)
                        }
                      }}
                    >
                      {docRegistering ? 'Registering…' : 'Register Doctor'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </ScrollReveal>

          {/* Today's Appointments */}
          <ScrollReveal delay={100}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Today&apos;s Appointments
                    </CardTitle>
                    <CardDescription>Manage and confirm appointments</CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      className="pl-10 w-48"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appointments
                    .filter(
                      (apt) =>
                        apt.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        apt.doctor.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((apt) => (
                      <div
                        key={apt.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-center min-w-[60px]">
                            <Clock className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                            <span className="text-sm font-medium">{apt.time}</span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{apt.patient}</p>
                            <p className="text-sm text-muted-foreground">{apt.doctor}</p>
                            <p className="text-xs text-primary">{apt.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${getStatusColor(apt.status)}`}
                          >
                            {apt.status}
                          </span>
                          {apt.status === "pending" && (
                            <div className="flex gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-green-500 hover:bg-green-500/10"
                                onClick={() => handleConfirm(apt.id)}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                onClick={() => handleCancel(apt.id)}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <ScrollReveal delay={150}>
            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
                    <span className="text-sm">Total Appointments</span>
                    <span className="font-semibold text-primary">{appointments.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10">
                    <span className="text-sm">Confirmed</span>
                    <span className="font-semibold text-green-500">
                      {appointments.filter((a) => a.status === "confirmed").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10">
                    <span className="text-sm">Pending</span>
                    <span className="font-semibold text-yellow-500">
                      {appointments.filter((a) => a.status === "pending").length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Recent Patients */}
          <ScrollReveal delay={200}>
            <Card>
              <CardHeader>
                <CardTitle>Recent Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentPatients.map((patient, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    >
                      <div>
                        <p className="font-medium text-sm">{patient.name}</p>
                        <p className="text-xs text-muted-foreground">{patient.lastVisit}</p>
                      </div>
                      <a href={`tel:${patient.phone}`} className="p-2 rounded-lg hover:bg-primary/10 transition-colors">
                        <Phone className="w-4 h-4 text-primary" />
                      </a>
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
