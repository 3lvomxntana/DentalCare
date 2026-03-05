"use client"

import type React from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { LayoutDashboard, Users, Calendar, FileText, Package, Settings, LogOut, Menu, Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useAuth, type StaffRole } from "@/lib/auth-context"
import { useState } from "react"

interface NavItem {
  icon: React.ElementType
  label: string
  href: string
  roles: StaffRole[]
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/staff/dashboard", roles: ["admin", "dentist", "receptionist"] },
  { icon: Users, label: "Patients", href: "/staff/dashboard/patients", roles: ["admin", "dentist", "receptionist"] },
  {
    icon: Calendar,
    label: "Appointments",
    href: "/staff/dashboard/appointments",
    roles: ["admin", "dentist", "receptionist"],
  },
  { icon: FileText, label: "Clinical Records", href: "/staff/dashboard/records", roles: ["admin", "dentist"] },
  { icon: Package, label: "Inventory", href: "/staff/dashboard/inventory", roles: ["admin"] },
  { icon: Users, label: "Staff", href: "/staff/dashboard/staff", roles: ["admin"] },
  { icon: Settings, label: "Settings", href: "/staff/dashboard/settings", roles: ["admin"] },
]

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  if (!user || user.type !== "staff") return null

  const role = user.role

  const filteredNavItems = navItems.filter((item) => item.roles.includes(role))

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getRoleBadgeColor = (role: StaffRole) => {
    switch (role) {
      case "admin":
        return "bg-primary/10 text-primary"
      case "dentist":
        return "bg-blue-500/10 text-blue-500"
      case "receptionist":
        return "bg-green-500/10 text-green-500"
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">D</span>
              </div>
              <span className="font-serif text-xl font-semibold">
                Dental<span className="text-primary">Care</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {filteredNavItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-border">
            <div className="p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">{user.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{user.name}</p>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full capitalize", getRoleBadgeColor(role))}>
                    {role}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">{title}</h1>
                {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-10 w-64" />
              </div>
              <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
