"use client"

import { DashboardLayout } from "./dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedCounter } from "@/components/animated-counter"
import { Users, Calendar, DollarSign, TrendingUp, Package, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const stats = [
  { label: "Total Patients", value: 1250, icon: Users, change: "+12%", trend: "up" },
  { label: "Appointments Today", value: 24, icon: Calendar, change: "+4", trend: "up" },
  { label: "Revenue (Month)", value: 45000, icon: DollarSign, prefix: "$", change: "+8%", trend: "up" },
  { label: "Staff Members", value: 12, icon: TrendingUp, change: "0", trend: "neutral" },
]

const recentAppointments = [
  { patient: "Grace Wanjiku", doctor: "Dentist", time: "9:00 AM", status: "completed" },
  { patient: "Peter Njoroge", doctor: "Dr. James Ochieng", time: "10:30 AM", status: "in-progress" },
  { patient: "Fatima Ali", doctor: "Dr. Amina Hassan", time: "11:00 AM", status: "waiting" },
  { patient: "John Kamau", doctor: "Dr. David Mwangi", time: "2:00 PM", status: "scheduled" },
]

const lowStockItems = [
  { name: "Dental Gloves (L)", current: 50, min: 100 },
  { name: "Anesthetic Cartridges", current: 25, min: 50 },
  { name: "Composite Resin", current: 10, min: 20 },
]

export function AdminDashboard() {
  const [staff, setStaff] = useState<any[]>([])
  const [staffName, setStaffName] = useState("")
  const [staffEmail, setStaffEmail] = useState("")
  const [staffPassword, setStaffPassword] = useState("")
  const [staffRole, setStaffRole] = useState("staff")
  const [creating, setCreating] = useState(false)
  const [probeStatus, setProbeStatus] = useState<string | null>(null)

  useEffect(() => {
    async function loadStaff() {
      try {
        const res = await fetch('/api/staff')
        const json = await res.json()
        if (res.ok) {
          setStaff(json.staff || [])
        } else {
          console.warn('Failed to load staff:', json.message)
          setProbeStatus(json.message || 'Staff collection unavailable')
        }
      } catch (err) {
        console.error(err)
      }
    }
    loadStaff()
  }, [])

  const handleProbe = async () => {
    setProbeStatus('Checking...')
    try {
      const res = await fetch('/api/appwrite/probe')
      const json = await res.json()
      if (res.ok) {
        setProbeStatus(`OK — staff docs visible: ${json.count}`)
      } else {
        setProbeStatus(json.message || 'Probe failed')
      }
    } catch (err) {
      console.error(err)
      setProbeStatus('Probe error')
    }
  }
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-500" />
      case "waiting":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Welcome back! Here's what's happening today.">
      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <ScrollReveal key={stat.label} delay={index * 100}>
            <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      stat.trend === "up" ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <div className="text-3xl font-bold text-foreground">
                  {stat.prefix}
                  <AnimatedCounter end={stat.value} suffix="" label="" className="inline" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          </ScrollReveal>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <ScrollReveal delay={400}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Today&apos;s Appointments
              </CardTitle>
              <CardDescription>Overview of scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAppointments.map((apt, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold">{apt.patient.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{apt.patient}</p>
                        <p className="text-sm text-muted-foreground">{apt.doctor}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{apt.time}</span>
                      {getStatusIcon(apt.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Staff Management */}
        <ScrollReveal delay={450}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Staff Management
              </CardTitle>
              <CardDescription>Create and list staff members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={staffName} onChange={(e) => setStaffName((e.target as HTMLInputElement).value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={staffEmail} onChange={(e) => setStaffEmail((e.target as HTMLInputElement).value)} />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" value={staffPassword} onChange={(e) => setStaffPassword((e.target as HTMLInputElement).value)} />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <select className="w-full rounded-md border px-3 py-2" value={staffRole} onChange={(e) => setStaffRole((e.target as HTMLSelectElement).value)}>
                    <option value="receptionist">Receptionist</option>
                    <option value="doctor">Doctor</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Button
                  onClick={async () => {
                    setCreating(true)
                    try {
                      const res = await fetch('/api/staff', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: staffName, email: staffEmail, password: staffPassword, role: staffRole }),
                      })
                      const json = await res.json()
                      if (res.ok) {
                        setStaff((s) => [...s, { name: staffName, email: staffEmail, role: staffRole }])
                        setStaffName('')
                        setStaffEmail('')
                        setStaffPassword('')
                      } else {
                        console.error('Create staff failed', json)
                      }
                    } catch (err) {
                      console.error(err)
                    } finally {
                      setCreating(false)
                    }
                  }}
                >
                  {creating ? 'Creating…' : 'Add Staff'}
                </Button>
                <Button variant="ghost" onClick={handleProbe}>Test Appwrite</Button>
                {probeStatus && <span className="text-sm text-muted-foreground">{probeStatus}</span>}
              </div>

              <div className="mt-6 space-y-3">
                {staff.map((s, i) => (
                  <div key={i} className="p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{s.name}</p>
                        <p className="text-sm text-muted-foreground">{s.email} • {s.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Inventory Alerts */}
        <ScrollReveal delay={500}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Inventory Alerts
              </CardTitle>
              <CardDescription>Items running low on stock</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockItems.map((item, index) => (
                  <div key={index} className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{item.name}</span>
                      <AlertCircle className="w-4 h-4 text-destructive" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-destructive rounded-full"
                          style={{ width: `${(item.current / item.min) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {item.current}/{item.min}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </DashboardLayout>
  )
}
