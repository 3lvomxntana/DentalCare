"use client"

import type React from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"

type AnimationDirection = "up" | "down" | "left" | "right" | "scale" | "fade"

interface ScrollRevealProps {
  children: React.ReactNode
  direction?: AnimationDirection
  delay?: number
  duration?: number
  className?: string
  once?: boolean
}

const directionClasses: Record<AnimationDirection, { hidden: string; visible: string }> = {
  up: { hidden: "translate-y-12 opacity-0", visible: "translate-y-0 opacity-100" },
  down: { hidden: "-translate-y-12 opacity-0", visible: "translate-y-0 opacity-100" },
  left: { hidden: "translate-x-12 opacity-0", visible: "translate-x-0 opacity-100" },
  right: { hidden: "-translate-x-12 opacity-0", visible: "translate-x-0 opacity-100" },
  scale: { hidden: "scale-90 opacity-0", visible: "scale-100 opacity-100" },
  fade: { hidden: "opacity-0", visible: "opacity-100" },
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 700,
  className,
  once = true,
}: ScrollRevealProps) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.1, once })
  const { hidden, visible } = directionClasses[direction]

  return (
    <div
      ref={ref}
      className={cn("transition-all ease-out", isVisible ? visible : hidden, className)}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
