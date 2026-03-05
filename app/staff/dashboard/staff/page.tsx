"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollReveal } from "@/components/scroll-reveal"

const demoStaff = [
  { name: "Dentist", role: "Dentist" },
  { name: "Mary Wanjiku", role: "Receptionist" },
  { name: "Admin User", role: "Admin" },
]

export default function StaffListPage() {
  return (
    <DashboardLayout title="Staff" subtitle="Manage team members">
      <div className="space-y-6">
        <ScrollReveal>
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoStaff.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.role}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">Manage</div>
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
