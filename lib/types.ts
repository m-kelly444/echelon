export interface ThreatData {
  id: string
  timestamp: string
  source: string
  type: string
  severity: "low" | "medium" | "high" | "critical"
  cve_id?: string
  summary: string
  details: string
  location: {
    latitude: number
    longitude: number
    country: string
  }
  confidence: number
  apt_group?: string
}

export interface AptGroup {
  id: string
  name: string
  attribution: string
  active_since: string
  targets: string[]
  techniques: string[]
  tools: string[]
  recent_campaigns: string[]
  prediction: {
    confidence: number
    target_sector: string
    attack_vector: string
    timeframe: string[]
  }
  mitre_techniques: string[]
}

export interface Prediction {
  id: string
  apt_group: string
  confidence: number
  target_sectors: { name: string; probability: number }[]
  attack_vectors: { name: string; probability: number }[]
  timeframe: string
  indicators: string[]
  model_factors: string[]
  mitre_techniques: string[]
  cve_ids: string[]
  last_updated: string
}

export interface TimelineEvent {
  id: string
  timestamp: string
  event: string
  details: string
  severity: string
  apt_group?: string
  cve_id?: string
  mitre_technique?: string
}

export interface SystemStatus {
  modelAccuracy: number
  threatLevel: number
  apiStatus: string
  lastUpdate: string
  dataSourcesOnline: number
  totalDataSources: number
  logs: { timestamp: string; message: string }[]
}
