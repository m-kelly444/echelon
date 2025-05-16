"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface GlitchTextProps extends React.HTMLAttributes<HTMLDivElement> {
  interval?: number
  duration?: number
  intensity?: "low" | "medium" | "high"
}

export function GlitchText({
  children,
  className,
  interval = 3000,
  duration = 200,
  intensity = "medium",
  ...props
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    // Initial glitch effect
    setIsGlitching(true)
    const initialTimeout = setTimeout(() => setIsGlitching(false), duration)

    // Set up interval for periodic glitching
    const glitchInterval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), duration)
    }, interval)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(glitchInterval)
    }
  }, [interval, duration])

  const getIntensityClass = () => {
    switch (intensity) {
      case "low":
        return "animate-glitch-text-low"
      case "high":
        return "animate-glitch-text-high"
      default:
        return "animate-glitch-text"
    }
  }

  return (
    <div className={cn("relative inline-block", isGlitching && getIntensityClass(), className)} {...props}>
      <span className="relative z-10">{children}</span>
      {isGlitching && (
        <>
          <span className="absolute left-[-2px] top-0 z-0 text-green-400 opacity-70">{children}</span>
          <span className="absolute left-[2px] top-0 z-0 text-red-400 opacity-70">{children}</span>
        </>
      )}
    </div>
  )
}
