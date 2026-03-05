"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth, type StaffRole } from "@/lib/auth-context"
import { AdminDashboard } from "@/components/admin-dashboard"
import { DentistDashboard } from "@/components/dentist-dashboard"
import { ReceptionistDashboard } from "@/components/receptionist-dashboard"

export default function StaffDashboard() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated || user?.type !== "staff") {
      router.push("/patient/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.type !== "staff") {
    return null
  }

  const role = user.role as StaffRole

  switch (role) {
    case "admin":
      return <AdminDashboard />
    case "dentist":
      return <DentistDashboard />
    case "receptionist":
      return <ReceptionistDashboard />
    default:
      return null
  }
}
