"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GlitchText } from "@/components/glitch-text"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { ThreatData } from "@/lib/types"
import { fetchPredictions } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

interface PredictionPanelProps {
  threatData: ThreatData[]
  isLoading: boolean
}

export function PredictionPanel({ threatData, isLoading }: PredictionPanelProps) {
  const router = useRouter()
  const [predictions, setPredictions] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPredictions = async () => {
      try {
        if (!isLoading) {
          const predictionData = await fetchPredictions()
          setPredictions(predictionData)
          setLoading(false)
        }
      } catch (error) {
        console.error("Failed to fetch predictions:", error)
        setLoading(false)
      }
    }

    loadPredictions()
  }, [isLoading])

  // Rotate through predictions
  useEffect(() => {
    if (predictions.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % predictions.length)
    }, 15000)

    return () => clearInterval(interval)
  }, [predictions.length])

  const currentPrediction = predictions[currentIndex]

  return (
    <Card className="bg-black/50 border-green-500/20 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-green-400">
          <GlitchText>ML PREDICTIONS</GlitchText>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading || isLoading ? (
          <Skeleton className="h-64 w-full bg-green-950/20" />
        ) : predictions.length > 0 ? (
          <div className="border border-green-500/20 rounded-md p-4 bg-black/30">
            <div className="flex justify-between items-start mb-3">
              <div className="text-green-400 font-bold text-lg">{currentPrediction.apt_group}</div>
              <div className="text-green-400 font-mono bg-green-500/10 px-2 py-1 rounded text-sm">
                {currentPrediction.confidence}% confidence
              </div>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="grid grid-cols-2 gap-x-4">
                <div className="text-green-500/70">Target:</div>
                <div className="text-green-400">{currentPrediction.target_sectors[0].name}</div>

                <div className="text-green-500/70">Vector:</div>
                <div className="text-green-400">{currentPrediction.attack_vectors[0].name}</div>

                <div className="text-green-500/70">Timeframe:</div>
                <div className="text-green-400">{currentPrediction.timeframe}</div>

                {currentPrediction.cve_ids && currentPrediction.cve_ids.length > 0 && (
                  <>
                    <div className="text-green-500/70">CVEs:</div>
                    <div className="text-green-400 font-mono">{currentPrediction.cve_ids[0]}</div>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-1">
                {predictions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-6 rounded-full ${i === currentIndex ? "bg-green-500" : "bg-green-500/30"}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="text-xs border-green-500/30 text-green-400 hover:bg-green-500/10"
                onClick={() => router.push("/intel")}
              >
                DETAILS
              </Button>
            </div>
          </div>
        ) : (
          <div className="border border-green-500/20 rounded-md p-4 bg-black/30 text-center py-8">
            <div className="text-green-500/70">No predictions available</div>
          </div>
        )}

        <div className="text-xs text-green-500/50 font-mono">
          Predictions based on real-time threat intelligence and machine learning analysis of APT behavior patterns.
        </div>
      </CardContent>
    </Card>
  )
}
