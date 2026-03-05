"use client"

import { useEffect, useState } from "react"

interface UseCounterAnimationOptions {
  end: number
  duration?: number
  start?: number
  delay?: number
  isVisible?: boolean
}

export function useCounterAnimation({
  end,
  duration = 2000,
  start = 0,
  delay = 0,
  isVisible = true,
}: UseCounterAnimationOptions): number {
  const [count, setCount] = useState(start)

  useEffect(() => {
    if (!isVisible) return

    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime - delay

      if (elapsed < 0) {
        animationFrame = requestAnimationFrame(animate)
        return
      }

      const progress = Math.min(elapsed / duration, 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const current = Math.floor(start + (end - start) * easeOutQuart)

      setCount(current)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, start, delay, isVisible])

  return count
}
