"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GlitchText } from "@/components/glitch-text"
import { Progress } from "@/components/ui/progress"
import type { ThreatData } from "@/lib/types"
import { fetchSystemStatus } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

interface StatusPanelProps {
  threatData: ThreatData[]
  isLoading: boolean
}

export function StatusPanel({ threatData, isLoading }: StatusPanelProps) {
  const [systemStatus, setSystemStatus] = useState({
    modelAccuracy: 94.7,
    threatLevel: 68,
    apiStatus: "Operational",
    lastUpdate: new Date().toISOString(),
    dataSourcesOnline: 7,
    totalDataSources: 11,
    logs: [
      {
        timestamp: new Date(Date.now() - 1000 * 30).toISOString(),
        message: "ML model prediction updated",
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        message: "New threat data ingested from CISA KEV",
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        message: "APT attribution model recalibrated",
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        message: "System health check completed",
      },
    ],
  })

  useEffect(() => {
    const loadSystemStatus = async () => {
      try {
        const status = await fetchSystemStatus()
        setSystemStatus(status)
      } catch (error) {
        console.error("Failed to fetch system status:", error)
      }
    }

    if (!isLoading) {
      loadSystemStatus()
    }

    // Update system status every 30 seconds
    const interval = setInterval(() => {
      if (!isLoading) {
        loadSystemStatus()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [isLoading])

  const getThreatLevelColor = (level: number) => {
    if (level < 30) return "bg-green-500"
    if (level < 60) return "bg-yellow-500"
    if (level < 80) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <Card className="bg-black/50 border-green-500/20 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-green-400">
          <GlitchText>SYSTEM STATUS</GlitchText>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full bg-green-950/20" />
            <Skeleton className="h-8 w-full bg-green-950/20" />
            <Skeleton className="h-24 w-full bg-green-950/20" />
            <Skeleton className="h-24 w-full bg-green-950/20" />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-500/70">Global Threat Level</span>
                <span className="text-green-400">{systemStatus.threatLevel}%</span>
              </div>
              <Progress
                value={systemStatus.threatLevel}
                className="h-2 bg-green-950"
                indicatorclassname={getThreatLevelColor(systemStatus.threatLevel)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-500/70">ML Model Accuracy</span>
                <span className="text-green-400">{systemStatus.modelAccuracy.toFixed(1)}%</span>
              </div>
              <Progress
                value={systemStatus.modelAccuracy}
                className="h-2 bg-green-950"
                indicatorclassname="bg-green-500"
              />
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div className="text-green-500/70">API Status:</div>
                <div className="text-green-400 flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  {systemStatus.apiStatus}
                </div>

                <div className="text-green-500/70">Data Sources:</div>
                <div className="text-green-400">
                  {systemStatus.dataSourcesOnline}/{systemStatus.totalDataSources} Online
                </div>

                <div className="text-green-500/70">Last Update:</div>
                <div className="text-green-400 font-mono">{new Date(systemStatus.lastUpdate).toLocaleTimeString()}</div>
              </div>
            </div>

            <div className="border border-green-500/20 rounded-md p-3 bg-black/30">
              <div className="text-green-500/70 text-sm mb-2">System Log</div>
              <div className="font-mono text-xs space-y-1 text-green-400/80 max-h-[100px] overflow-y-auto">
                {systemStatus.logs.map((log, index) => (
                  <div key={index}>
                    [{new Date(log.timestamp).toLocaleTimeString()}] {log.message}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
