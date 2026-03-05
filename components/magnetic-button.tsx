"use client"

import type React from "react"
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  onClick?: () => void
}

export function MagneticButton({ children, className, strength = 0.3, onClick }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * strength
    const y = (e.clientY - rect.top - rect.height / 2) * strength
    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <div
      ref={ref}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("transition-transform duration-200 ease-out", className)}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      {children}
    </div>
  )
}
