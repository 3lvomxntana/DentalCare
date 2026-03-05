"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface ParallaxSectionProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export function ParallaxSection({ children, speed = 0.5, className }: ParallaxSectionProps) {
  const [offset, setOffset] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const scrolled = window.innerHeight - rect.top
      setOffset(scrolled * speed * 0.1)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <div style={{ transform: `translateY(${offset}px)` }} className="transition-transform duration-100 ease-linear">
        {children}
      </div>
    </div>
  )
}
