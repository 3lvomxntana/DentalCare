"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollReveal } from "@/components/scroll-reveal"

const demoRecords = [
  { id: "R001", patient: "Grace Wanjiku", note: "Routine cleaning - no issues" },
  { id: "R002", patient: "Peter Njoroge", note: "Cavity filling on tooth #14" },
]

export default function StaffRecordsPage() {
  return (
    <DashboardLayout title="Clinical Records" subtitle="Access patient records and notes">
      <div className="space-y-6">
        <ScrollReveal>
          <Card>
            <CardHeader>
              <CardTitle>Recent Clinical Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoRecords.map((r) => (
                  <div key={r.id} className="p-3 rounded-lg bg-muted/50">
                    <div className="font-medium">{r.patient}</div>
                    <div className="text-sm text-muted-foreground">{r.note}</div>
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
