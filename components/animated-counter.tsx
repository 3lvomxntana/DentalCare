"use client"

import { useCounterAnimation } from "@/hooks/use-counter-animation"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"

interface AnimatedCounterProps {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
  delay?: number
  className?: string
  label: string
}

export function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 2000,
  delay = 0,
  className,
  label,
}: AnimatedCounterProps) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({ threshold: 0.3 })
  const count = useCounterAnimation({ end, duration, delay, isVisible })

  return (
    <div ref={ref} className={cn("text-center lg:text-left group cursor-default", className)}>
      <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground transition-all duration-500 group-hover:text-primary group-hover:scale-105">
        {prefix}
        {count}
        {suffix}
      </div>
      <div className="text-sm text-muted-foreground mt-2 uppercase tracking-wider">{label}</div>
    </div>
  )
}
