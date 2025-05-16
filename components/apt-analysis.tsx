"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { AptGroup } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

interface AptAnalysisProps {
  aptGroups: AptGroup[]
}

export function AptAnalysis({ aptGroups = [] }: AptAnalysisProps) {
  // Ensure aptGroups is always an array
  const groups = Array.isArray(aptGroups) ? aptGroups : []

  if (groups.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full bg-green-950/20" />
        <Skeleton className="h-64 w-full bg-green-950/20" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue={groups[0].id}>
        <TabsList className="bg-black border border-green-500/20 w-full grid grid-cols-3">
          {groups.slice(0, 3).map((group) => (
            <TabsTrigger
              key={group.id}
              value={group.id}
              className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              {group.name.split(" ")[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        {groups.slice(0, 3).map((group) => (
          <TabsContent key={group.id} value={group.id} className="mt-4">
            <Card className="bg-black/50 border-green-500/20">
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h3 className="text-green-400 text-xl font-bold mb-2">{group.name}</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="text-green-500/70">Attribution:</div>
                    <div className="text-green-400">{group.attribution}</div>

                    <div className="text-green-500/70">Active Since:</div>
                    <div className="text-green-400">{group.active_since}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-green-400 font-bold">Target Sectors</h4>
                  <div className="flex flex-wrap gap-2">
                    {group.targets &&
                      group.targets.map((target) => (
                        <span key={target} className="bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs">
                          {target}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-green-400 font-bold">Known Techniques</h4>
                  <div className="flex flex-wrap gap-2">
                    {group.techniques &&
                      group.techniques.map((technique) => (
                        <span key={technique} className="bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs">
                          {technique}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-green-400 font-bold">Tools & Malware</h4>
                  <div className="flex flex-wrap gap-2">
                    {group.tools &&
                      group.tools.map((tool) => (
                        <span key={tool} className="bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs">
                          {tool}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-green-400 font-bold">Recent Campaigns</h4>
                  <ul className="list-disc pl-5 text-sm text-green-400 space-y-1">
                    {group.recent_campaigns &&
                      group.recent_campaigns.map((campaign) => <li key={campaign}>{campaign}</li>)}
                  </ul>
                </div>

                <div className="border border-green-500/20 rounded-md p-4 bg-black/30">
                  <h4 className="text-green-400 font-bold mb-2">Current Prediction</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="text-green-500/70">Confidence:</div>
                    <div className="text-green-400">{group.prediction?.confidence || 0}%</div>

                    <div className="text-green-500/70">Target:</div>
                    <div className="text-green-400">{group.prediction?.target_sector || "Unknown"}</div>

                    <div className="text-green-500/70">Vector:</div>
                    <div className="text-green-400">{group.prediction?.attack_vector || "Unknown"}</div>

                    <div className="text-green-500/70">Timeframe:</div>
                    <div className="text-green-400">{group.prediction?.timeframe || "Unknown"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
