"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollReveal } from "@/components/scroll-reveal"

const demoPatients = [
  { id: "P001", name: "Grace Wanjiku", phone: "+254 700 111 222", lastVisit: "2025-11-01" },
  { id: "P002", name: "Peter Njoroge", phone: "+254 700 333 444", lastVisit: "2025-10-12" },
  { id: "P003", name: "Fatima Ali", phone: "+254 700 555 666", lastVisit: "2025-10-30" },
]

export default function StaffPatientsPage() {
  return (
    <DashboardLayout title="Patients" subtitle="Patient directory and quick actions">
      <div className="space-y-6">
        <ScrollReveal>
          <Card>
            <CardHeader>
              <CardTitle>Patient List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoPatients.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.id} • {p.phone}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">Last Visit: {p.lastVisit}</div>
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
