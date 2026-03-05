"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollReveal } from "@/components/scroll-reveal"

const demoInventory = [
  { name: "Dental Gloves (L)", current: 50, min: 100 },
  { name: "Anesthetic Cartridges", current: 25, min: 50 },
]

export default function StaffInventoryPage() {
  return (
    <DashboardLayout title="Inventory" subtitle="Track supplies and stock levels">
      <div className="space-y-6">
        <ScrollReveal>
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoInventory.map((i, index) => (
                  <div key={index} className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{i.name}</div>
                      <div className="text-sm text-muted-foreground">{i.current}/{i.min}</div>
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
