"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { account } from "@/lib/appwrite"
import { ID } from "appwrite"

// Demo credentials for staff
export const DEMO_CREDENTIALS = {
  admin: { email: "admin@dentalcare.com", password: "admin123", role: "admin" as const, name: "Admin User" },
  dentist: {
    email: "dentist@dentalcare.com",
    password: "dentist123",
    role: "dentist" as const,
    name: "Dentist",
  },
  receptionist: {
    email: "reception@dentalcare.com",
    password: "reception123",
    role: "receptionist" as const,
    name: "Mary Wanjiku",
  },
}

// Demo patient credentials
export const DEMO_PATIENTS = {
  patient1: { email: "patient@example.com", password: "patient123", name: "John Kamau", id: "P001" },
}

export type StaffRole = "admin" | "dentist" | "receptionist"

interface StaffUser {
  type: "staff"
  email: string
  role: StaffRole
  name: string
  id?: string
}

interface PatientUser {
  type: "patient"
  email: string
  name: string
  id: string
}

type User = StaffUser | PatientUser | null

interface AuthContextType {
  user: User
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  // Try to restore session via Appwrite Account
  useEffect(() => {
    async function restore() {
      try {
        const sessionUser = await account.get()
        if (sessionUser && sessionUser.email) {
          // Try to read authoritative role from the users collection via server API
          let roleFromProfile: string | undefined = undefined
          try {
            // Resolve role via server endpoint that can read the users collection
            const res = await fetch(`/api/auth/role?id=${sessionUser.$id}`)
            if (res.ok) {
              const json = await res.json()
              roleFromProfile = json?.role || json?.profile?.data?.role
            }
          } catch (e) {
            // ignore
          }

          const role = roleFromProfile || sessionUser?.prefs?.role
          const isStaffRole = role === "admin" || role === "dentist" || role === "receptionist"
          if (isStaffRole) {
            setUser({ type: "staff", email: sessionUser.email, role: role as StaffRole, name: sessionUser?.name || sessionUser.email, id: sessionUser.$id })
          } else {
            setUser({ type: "patient", email: sessionUser.email, name: sessionUser?.name || sessionUser.email, id: sessionUser.$id })
          }
        }
      } catch (err) {
        // no session
      }
    }
    restore()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      // Create email/password session using Appwrite
      // Note: use createEmailPasswordSession per installed SDK types
      try {
        await account.createEmailPasswordSession({ email, password })
      } catch (err: any) {
        // Appwrite may refuse to create a session when one is already active.
        // If so, delete the current session and retry once.
        const msg = String(err?.message || "")
        if (msg.includes("Creation of a session is prohibited when a session is active") || msg.includes("session is active")) {
          try {
            await account.deleteSession("current")
          } catch (e) {
            // ignore deletion errors
          }
          await account.createEmailPasswordSession({ email, password })
        } else {
          throw err
        }
      }
      const sessionUser = await account.get()

      if (sessionUser) {
        // Prefer authoritative role from users collection (server-side). Fall back to session prefs.
        let roleFromProfile: string | undefined = undefined
        try {
          const res = await fetch(`/api/auth/role?id=${sessionUser.$id}`)
          if (res.ok) {
            const json = await res.json()
            roleFromProfile = json?.role || json?.profile?.data?.role
          }
        } catch (e) {
          // ignore
        }

          // Fallback: try resolving by email if role not found
          if (!roleFromProfile && sessionUser?.email) {
            try {
              const res2 = await fetch(`/api/users/by-email?email=${encodeURIComponent(sessionUser.email)}`)
              if (res2.ok) {
                const j2 = await res2.json()
                roleFromProfile = j2?.profile?.data?.role
              }
            } catch (e) {
              // ignore
            }
          }

        // Fallback: try resolving by email if role not found
        if (!roleFromProfile && sessionUser?.email) {
          try {
            const res2 = await fetch(`/api/users/by-email?email=${encodeURIComponent(sessionUser.email)}`)
            if (res2.ok) {
              const j2 = await res2.json()
              roleFromProfile = j2?.profile?.data?.role
            }
          } catch (e) {
            // ignore
          }
        }

        const role = roleFromProfile || sessionUser?.prefs?.role
        const isStaffRole = role === "admin" || role === "dentist" || role === "receptionist"
        if (isStaffRole) {
          const out = { type: "staff", email: sessionUser.email, role: role as StaffRole, name: sessionUser?.name || sessionUser.email, id: sessionUser.$id }
          setUser(out)
          return { success: true, user: out }
        }

        // Default to patient
        const out = { type: "patient", email: sessionUser.email, name: sessionUser?.name || sessionUser.email, id: sessionUser.$id }
        setUser(out)
        return { success: true, user: out }
      }

      return { success: false, error: "Login failed" }
    } catch (err: any) {
      return { success: false, error: err?.message || "Login error" }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await account.deleteSession("current")
    } catch (err) {
      // ignore
    }
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
