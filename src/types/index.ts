export type PollutionType = 'air' | 'water' | 'soil' | 'waste' | 'noise';

export type SeverityLevel = 'low' | 'moderate' | 'unhealthy' | 'severe' | 'hazardous';

export type ReportStatus = 'pending' | 'investigating' | 'action_taken' | 'resolved';

export interface HourlyReading {
  time: string;
  aqi: number;
  pm25: number;
  voc: number;
}

export interface SensorReading {
  id: string;
  name: string;
  sourceType: 'vayu_wearable' | 'fixed_station' | 'community_node';
  lat: number;
  lng: number;
  locationName: string;
  aqi: number;
  pm25: number; // in ug/m3
  pm10: number; // in ug/m3
  voc: number; // in ppb or ppm
  no2: number;
  co: number;
  temp: number;
  humidity: number;
  confidence: number; // 0 - 100%
  battery?: number;
  userTag?: string;
  lastUpdated: string;
  hourlyTrend: HourlyReading[];
}

export interface CitizenReport {
  id: string;
  title: string;
  category: PollutionType;
  severity: SeverityLevel;
  description: string;
  lat: number;
  lng: number;
  address: string;
  imageUrl?: string;
  timestamp: string;
  isAnonymous: boolean;
  reporterName?: string;
  status: ReportStatus;
  upvotes: number;
  assignedAgency?: string;
  actionNotes?: string;
  verifiedBySensors?: boolean;
}

export interface HotspotCluster {
  id: string;
  title: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  primaryPollutant: string;
  avgAqi: number;
  sensorCount: number;
  reportCount: number;
  riskLevel: 'moderate' | 'high' | 'critical';
  confidenceScore: number;
  identifiedAt: string;
  recommendedAction: string;
  status: 'active' | 'mitigating' | 'resolved';
}

export interface WaterSoilSpot {
  id: string;
  name: string;
  category: 'water' | 'soil';
  lat: number;
  lng: number;
  severity: SeverityLevel;
  contaminant: string; // e.g. "Industrial Heavy Metals", "High Turbidity & Phosphate", "Plastic & Chemical Sludge"
  metricValue: string;
  statusText: string;
  lastUpdated: string;
}
