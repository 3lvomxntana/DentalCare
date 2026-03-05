"use client"

import { useEffect } from "react"
import { ping } from "@/lib/appwrite"

export function AppwritePinger() {
  useEffect(() => {
    // ping Appwrite on first load to verify connectivity
    ping().then((result) => {
      // store quick status on window for debugging in browser console
      ;(window as any).__APPWRITE_PING = result
    })
  }, [])

  return null
}
