"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Prediction } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

interface PredictionDetailsProps {
  predictions: Prediction[]
}

export function PredictionDetails({ predictions = [] }: PredictionDetailsProps) {
  // Ensure predictions is always an array, even if undefined is passed
  const predictionData = Array.isArray(predictions) ? predictions : []

  if (predictionData.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full bg-green-950/20" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {predictionData.slice(0, 3).map((prediction) => (
        <Card key={prediction.id} className="bg-black/50 border-green-500/20">
          <CardContent className="pt-6 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-green-400 text-xl font-bold">{prediction.apt_group}</h3>
                <p className="text-green-500/70 text-sm">Predicted to attack within {prediction.timeframe}</p>
              </div>
              <div className="text-green-400 font-mono bg-green-500/10 px-3 py-1 rounded">
                {prediction.confidence}% confidence
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-green-400 font-bold">Target Sector Probability</h4>
                {prediction.target_sectors &&
                  prediction.target_sectors.map((sector) => (
                    <div key={sector.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-400">{sector.name}</span>
                        <span className="text-green-500/70">{sector.probability}%</span>
                      </div>
                      <Progress
                        value={sector.probability}
                        className="h-2 bg-green-950"
                        indicatorclassname="bg-green-500"
                      />
                    </div>
                  ))}
              </div>

              <div className="space-y-4">
                <h4 className="text-green-400 font-bold">Attack Vector Probability</h4>
                {prediction.attack_vectors &&
                  prediction.attack_vectors.map((vector) => (
                    <div key={vector.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-400">{vector.name}</span>
                        <span className="text-green-500/70">{vector.probability}%</span>
                      </div>
                      <Progress
                        value={vector.probability}
                        className="h-2 bg-green-950"
                        indicatorclassname="bg-green-500"
                      />
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-green-400 font-bold">Threat Indicators</h4>
              <ul className="list-disc pl-5 text-sm text-green-400 space-y-1">
                {prediction.indicators && prediction.indicators.map((indicator, i) => <li key={i}>{indicator}</li>)}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-green-400 font-bold">Model Factors</h4>
              <ul className="list-disc pl-5 text-sm text-green-400 space-y-1">
                {prediction.model_factors && prediction.model_factors.map((factor, i) => <li key={i}>{factor}</li>)}
              </ul>
            </div>

            {prediction.mitre_techniques && prediction.mitre_techniques.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-green-400 font-bold">MITRE ATT&CK Techniques</h4>
                <div className="flex flex-wrap gap-2">
                  {prediction.mitre_techniques.map((technique, i) => (
                    <span key={i} className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded text-xs">
                      {technique}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {prediction.cve_ids && prediction.cve_ids.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-green-400 font-bold">Related CVEs</h4>
                <div className="flex flex-wrap gap-2">
                  {prediction.cve_ids.map((cve, i) => (
                    <span key={i} className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs font-mono">
                      {cve}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
