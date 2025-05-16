"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { TimelineEvent } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

interface ThreatTimelineProps {
  events: TimelineEvent[]
}

export function ThreatTimeline({ events = [] }: ThreatTimelineProps) {
  // Ensure events is always an array
  const timelineEvents = Array.isArray(events) ? events : []

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "border-blue-500/30 bg-blue-500/10"
      case "medium":
        return "border-yellow-500/30 bg-yellow-500/10"
      case "high":
        return "border-orange-500/30 bg-orange-500/10"
      case "critical":
        return "border-red-500/30 bg-red-500/10"
      default:
        return "border-green-500/30 bg-green-500/10"
    }
  }

  const getTextColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "text-blue-400"
      case "medium":
        return "text-yellow-400"
      case "high":
        return "text-orange-400"
      case "critical":
        return "text-red-400"
      default:
        return "text-green-400"
    }
  }

  if (timelineEvents.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((_, index) => (
          <Skeleton key={index} className="h-16 w-full bg-green-950/20" />
        ))}
      </div>
    )
  }

  return (
    <Card className="bg-black/50 border-green-500/20">
      <CardContent className="pt-6">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-green-500/20" />

          <div className="space-y-6">
            {timelineEvents.map((event) => (
              <div key={event.id} className="relative pl-10">
                {/* Timeline dot */}
                <div
                  className={`absolute left-0 top-1.5 h-7 w-7 rounded-full border-2 ${getSeverityColor(event.severity)} flex items-center justify-center`}
                >
                  <div className={`h-3 w-3 rounded-full ${getTextColor(event.severity)}`} />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-bold ${getTextColor(event.severity)}`}>{event.event}</h4>
                    <span className="text-green-500/70 text-xs font-mono">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-green-400/80 text-sm">{event.details}</p>

                  {(event.apt_group || event.cve_id || event.mitre_technique) && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {event.apt_group && (
                        <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded text-xs">
                          {event.apt_group}
                        </span>
                      )}
                      {event.cve_id && (
                        <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-xs font-mono">
                          {event.cve_id}
                        </span>
                      )}
                      {event.mitre_technique && (
                        <span className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded text-xs">
                          {event.mitre_technique}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
