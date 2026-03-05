"use client"

import { useEffect, useState } from "react"
import { ping } from "@/lib/appwrite"

export function AppwriteHealth() {
  const [status, setStatus] = useState<"unknown" | "online" | "offline">("unknown")
  const [message, setMessage] = useState<string | null>(null)
  const [lastChecked, setLastChecked] = useState<number | null>(null)

  useEffect(() => {
    let mounted = true

    async function check() {
      const res: any = await ping()
      if (!mounted) return
      if (res?.ok) {
        setStatus("online")
        setMessage(res.res?.message || "Pong!")
      } else {
        setStatus("offline")
        setMessage((res?.error && (res.error.message || String(res.error))) || "Failed to reach Appwrite")
      }
      setLastChecked(Date.now())
    }

    check()
    const id = setInterval(check, 30_000)
    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [])

  const color = status === "online" ? "bg-emerald-500" : status === "offline" ? "bg-rose-500" : "bg-slate-400"

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-3 py-2 rounded-full shadow-lg text-sm text-white ${color}`} title={message || "Checking..."}>
      <span className="w-3 h-3 rounded-full" />
      <div className="leading-tight text-xs text-white/90">
        <div className="font-medium">Appwrite: {status}</div>
        <div className="text-[10px] opacity-90">{lastChecked ? new Date(lastChecked).toLocaleTimeString() : "..."}</div>
      </div>
    </div>
  )
}
