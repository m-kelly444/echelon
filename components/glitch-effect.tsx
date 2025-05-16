"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface GlitchEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "low" | "medium" | "high"
}

export function GlitchEffect({ className, intensity = "medium", ...props }: GlitchEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to match parent
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Glitch effect parameters
    const intensityFactor = intensity === "low" ? 0.3 : intensity === "high" ? 1.5 : 1
    const lineCount = Math.floor(10 * intensityFactor)
    const glitchChance = 0.05 * intensityFactor
    const glitchAmount = 10 * intensityFactor

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw random horizontal lines
      ctx.lineWidth = 1

      for (let i = 0; i < lineCount; i++) {
        if (Math.random() < glitchChance) {
          const y = Math.random() * canvas.height
          const width = Math.random() * canvas.width
          const x = Math.random() * (canvas.width - width)

          const hue = Math.random() > 0.5 ? 140 : 340 // Green or red
          const alpha = Math.random() * 0.5 + 0.1

          ctx.strokeStyle = `hsla(${hue}, 100%, 50%, ${alpha})`
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(x + width, y)
          ctx.stroke()
        }
      }

      // Draw random blocks
      if (Math.random() < glitchChance * 0.5) {
        const blockWidth = Math.random() * canvas.width * 0.2 + 10
        const blockHeight = Math.random() * 20 + 2
        const x = Math.random() * (canvas.width - blockWidth)
        const y = Math.random() * (canvas.height - blockHeight)

        const hue = Math.random() > 0.5 ? 140 : 340 // Green or red
        const alpha = Math.random() * 0.3 + 0.1

        ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${alpha})`
        ctx.fillRect(x, y, blockWidth, blockHeight)
      }

      // Shift effect
      if (Math.random() < glitchChance * 0.3) {
        const shiftY = Math.random() * canvas.height
        const shiftHeight = Math.random() * 20 + 5
        const shiftX = Math.random() * glitchAmount - glitchAmount / 2

        ctx.drawImage(canvas, 0, shiftY, canvas.width, shiftHeight, shiftX, shiftY, canvas.width, shiftHeight)
      }

      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [intensity])

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)} {...props}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
