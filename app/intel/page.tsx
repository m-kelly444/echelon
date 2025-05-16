"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GlitchText } from "@/components/glitch-text"
import { GlitchEffect } from "@/components/glitch-effect"
import { AptAnalysis } from "@/components/apt-analysis"
import { ThreatTimeline } from "@/components/threat-timeline"
import { PredictionDetails } from "@/components/prediction-details"
import { fetchAptData, fetchPredictions, fetchTimelineData } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import type { AptGroup, Prediction, TimelineEvent } from "@/lib/types"
import { Loader2 } from "lucide-react"

export default function IntelPage() {
  const { toast } = useToast()
  const [aptData, setAptData] = useState<AptGroup[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [timelineData, setTimelineData] = useState<TimelineEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load each data type separately to handle individual failures
        try {
          const aptGroups = await fetchAptData()
          setAptData(aptGroups)
        } catch (error) {
          console.error("Failed to fetch APT data:", error)
          setAptData([])
        }

        try {
          const predictionData = await fetchPredictions()
          setPredictions(predictionData)
        } catch (error) {
          console.error("Failed to fetch prediction data:", error)
          setPredictions([])
        }

        try {
          const timeline = await fetchTimelineData()
          setTimelineData(timeline)
        } catch (error) {
          console.error("Failed to fetch timeline data:", error)
          setTimelineData([])
        }
      } catch (error) {
        console.error("Failed to fetch intelligence data:", error)
        toast({
          title: "Data Fetch Error",
          description: "Failed to retrieve latest intelligence analysis",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()

    // Set up polling for new data every 5 minutes
    const interval = setInterval(async () => {
      try {
        const [aptGroups, predictionData, timeline] = await Promise.all([
          fetchAptData().catch(() => []),
          fetchPredictions().catch(() => []),
          fetchTimelineData().catch(() => []),
        ])

        if (aptGroups.length > 0) setAptData(aptGroups)
        if (predictionData.length > 0) setPredictions(predictionData)
        if (timeline.length > 0) setTimelineData(timeline)
      } catch (error) {
        console.error("Failed to update intelligence data:", error)
      }
    }, 300000)

    return () => clearInterval(interval)
  }, [toast])

  return (
    <div className="space-y-6 relative">
      <GlitchEffect className="absolute inset-0 pointer-events-none opacity-20" />

      <div className="flex items-center justify-between">
        <div>
          <GlitchText className="text-2xl font-bold">INTELLIGENCE ANALYSIS</GlitchText>
          <p className="text-green-500/70 text-sm">ML-powered threat prediction and analysis</p>
        </div>
        <div className="text-green-500/70 text-sm">Last updated: {new Date().toLocaleString()}</div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
          <span className="ml-2 text-green-500">Loading intelligence data...</span>
        </div>
      ) : (
        <Tabs defaultValue="predictions" className="w-full">
          <TabsList className="bg-black border border-green-500/20">
            <TabsTrigger
              value="predictions"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              PREDICTIONS
            </TabsTrigger>
            <TabsTrigger
              value="apt-groups"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              APT GROUPS
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              TIMELINE
            </TabsTrigger>
          </TabsList>

          <TabsContent value="predictions" className="mt-4">
            <PredictionDetails predictions={predictions} />
          </TabsContent>

          <TabsContent value="apt-groups" className="mt-4">
            <AptAnalysis aptGroups={aptData} />
          </TabsContent>

          <TabsContent value="timeline" className="mt-4">
            <ThreatTimeline events={timelineData} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
