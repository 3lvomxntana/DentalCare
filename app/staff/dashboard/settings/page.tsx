"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function StaffSettingsPage() {
  return (
    <DashboardLayout title="Settings" subtitle="Update clinic preferences and staff settings">
      <div className="space-y-6">
        <ScrollReveal>
          <Card>
            <CardHeader>
              <CardTitle>Clinic Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Configure clinic hours, notifications, and integrations here.</p>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </DashboardLayout>
  )
}
