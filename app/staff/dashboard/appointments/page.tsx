"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollReveal } from "@/components/scroll-reveal"

import { useEffect, useState } from "react"
import { databases, Query } from "@/lib/appwrite"

type Appointment = { id: string; patient: string; time: string; doctor: string }

const demoAppointments: Appointment[] = []

export default function StaffAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(demoAppointments)

  useEffect(() => {
    async function load() {
      const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
      const colId = process.env.NEXT_PUBLIC_APPWRITE_APPOINTMENTS_COLLECTION_ID
      if (!dbId || !colId) return

      try {
        const res = await databases.listDocuments(dbId, colId)
        // @ts-ignore
        const docs = res.documents || []
        setAppointments(docs.map((d: any) => ({ id: d.$id, patient: d.name, time: d.time, doctor: d.doctor })))
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [])
  return (
    <DashboardLayout title="Appointments" subtitle="Manage appointments and scheduling">
      <div className="space-y-6">
        <ScrollReveal>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointments.map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <div className="font-medium">{a.patient}</div>
                      <div className="text-xs text-muted-foreground">With {a.doctor}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{a.time}</div>
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
