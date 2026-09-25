import { SensorReading, CitizenReport, HotspotCluster, WaterSoilSpot, SeverityLevel } from '../types';

export const INITIAL_SENSORS: SensorReading[] = [
  {
    id: 'vayu-wearable-101',
    name: 'Vayu Wearable #101 (Cyclist - South Link)',
    sourceType: 'vayu_wearable',
    lat: 28.5355,
    lng: 77.2410,
    locationName: 'Nehru Place Outer Ring Road',
    aqi: 248,
    pm25: 198,
    pm10: 285,
    voc: 680,
    no2: 64,
    co: 2.8,
    temp: 29.4,
    humidity: 58,
    confidence: 96,
    battery: 84,
    userTag: 'Commuter Wearable (BLE Sync)',
    lastUpdated: '1 min ago',
    hourlyTrend: [
      { time: '12:00', aqi: 180, pm25: 130, voc: 420 },
      { time: '14:00', aqi: 195, pm25: 145, voc: 480 },
      { time: '16:00', aqi: 215, pm25: 165, voc: 540 },
      { time: '18:00', aqi: 256, pm25: 210, voc: 720 },
      { time: '20:00', aqi: 260, pm25: 215, voc: 740 },
      { time: '21:00', aqi: 248, pm25: 198, voc: 680 }
    ]
  },
  {
    id: 'vayu-wearable-104',
    name: 'Vayu Wearable #104 (Pedestrian - Metro Line)',
    sourceType: 'vayu_wearable',
    lat: 28.5672,
    lng: 77.2100,
    locationName: 'AIIMS Ring Road Flyover',
    aqi: 312,
    pm25: 262,
    pm10: 360,
    voc: 890,
    no2: 82,
    co: 3.6,
    temp: 30.1,
    humidity: 54,
    confidence: 98,
    battery: 62,
    userTag: 'Field Volunteer #14',
    lastUpdated: 'Just now',
    hourlyTrend: [
      { time: '12:00', aqi: 210, pm25: 160, voc: 510 },
      { time: '14:00', aqi: 240, pm25: 190, voc: 630 },
      { time: '16:00', aqi: 275, pm25: 220, voc: 720 },
      { time: '18:00', aqi: 330, pm25: 280, voc: 940 },
      { time: '20:00', aqi: 325, pm25: 275, voc: 910 },
      { time: '21:00', aqi: 312, pm25: 262, voc: 890 }
    ]
  },
  {
    id: 'vayu-wearable-112',
    name: 'Vayu Wearable #112 (Delivery Rider Fleet)',
    sourceType: 'vayu_wearable',
    lat: 28.6328,
    lng: 77.2197,
    locationName: 'Connaught Place Outer Circle',
    aqi: 164,
    pm25: 84,
    pm10: 140,
    voc: 320,
    no2: 42,
    co: 1.4,
    temp: 28.5,
    humidity: 61,
    confidence: 94,
    battery: 48,
    userTag: 'Delivery Fleet Partner',
    lastUpdated: '3 mins ago',
    hourlyTrend: [
      { time: '12:00', aqi: 140, pm25: 68, voc: 280 },
      { time: '14:00', aqi: 155, pm25: 75, voc: 300 },
      { time: '16:00', aqi: 168, pm25: 88, voc: 340 },
      { time: '18:00', aqi: 182, pm25: 98, voc: 370 },
      { time: '20:00', aqi: 170, pm25: 90, voc: 335 },
      { time: '21:00', aqi: 164, pm25: 84, voc: 320 }
    ]
  },
  {
    id: 'station-caaqms-01',
    name: 'National Ambient Station (Govt Ref)',
    sourceType: 'fixed_station',
    lat: 28.6139,
    lng: 77.2090,
    locationName: 'India Gate Central Observational Site',
    aqi: 188,
    pm25: 110,
    pm10: 195,
    voc: 260,
    no2: 38,
    co: 1.2,
    temp: 27.8,
    humidity: 62,
    confidence: 99,
    lastUpdated: '10 mins ago',
    hourlyTrend: [
      { time: '12:00', aqi: 160, pm25: 88, voc: 220 },
      { time: '14:00', aqi: 172, pm25: 96, voc: 240 },
      { time: '16:00', aqi: 180, pm25: 104, voc: 250 },
      { time: '18:00', aqi: 198, pm25: 122, voc: 275 },
      { time: '20:00', aqi: 192, pm25: 115, voc: 268 },
      { time: '21:00', aqi: 188, pm25: 110, voc: 260 }
    ]
  },
  {
    id: 'station-industrial-04',
    name: 'Industrial Zone CAAQMS Station',
    sourceType: 'fixed_station',
    lat: 28.6850,
    lng: 77.1250,
    locationName: 'Mayapuri & Naraina Industrial Belt',
    aqi: 385,
    pm25: 335,
    pm10: 440,
    voc: 1250,
    no2: 115,
    co: 4.8,
    temp: 31.2,
    humidity: 49,
    confidence: 99,
    lastUpdated: '5 mins ago',
    hourlyTrend: [
      { time: '12:00', aqi: 290, pm25: 240, voc: 850 },
      { time: '14:00', aqi: 315, pm25: 270, voc: 980 },
      { time: '16:00', aqi: 360, pm25: 310, voc: 1120 },
      { time: '18:00', aqi: 410, pm25: 365, voc: 1340 },
      { time: '20:00', aqi: 395, pm25: 345, voc: 1290 },
      { time: '21:00', aqi: 385, pm25: 335, voc: 1250 }
    ]
  },
  {
    id: 'community-node-203',
    name: 'Vayu Community Mesh Node #203',
    sourceType: 'community_node',
    lat: 28.5700,
    lng: 77.3200,
    locationName: 'Sector 18 Commercial Hub',
    aqi: 220,
    pm25: 165,
    pm10: 240,
    voc: 490,
    no2: 52,
    co: 2.1,
    temp: 29.0,
    humidity: 56,
    confidence: 91,
    lastUpdated: '4 mins ago',
    hourlyTrend: [
      { time: '12:00', aqi: 175, pm25: 120, voc: 380 },
      { time: '14:00', aqi: 190, pm25: 135, voc: 410 },
      { time: '16:00', aqi: 210, pm25: 155, voc: 460 },
      { time: '18:00', aqi: 235, pm25: 180, voc: 520 },
      { time: '20:00', aqi: 228, pm25: 172, voc: 505 },
      { time: '21:00', aqi: 220, pm25: 165, voc: 490 }
    ]
  }
];

export const INITIAL_REPORTS: CitizenReport[] = [
  {
    id: 'rep-001',
    title: 'Illegal Biomass & Tire Burning in Empty Plot',
    category: 'air',
    severity: 'hazardous',
    description: 'Thick black acrid smoke billowing across residential apartments since 8:30 PM. Strong smell of burnt rubber and plastic causing breathing issues.',
    lat: 28.5390,
    lng: 77.2510,
    address: 'Near Kalkaji Extension DDA Flats, Block 4',
    imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=600&q=80',
    timestamp: '18 mins ago',
    isAnonymous: false,
    reporterName: 'Ananya S. (Verified Citizen)',
    status: 'investigating',
    upvotes: 42,
    assignedAgency: 'Delhi Pollution Control Committee (DPCC) Rapid Unit',
    actionNotes: 'Field patrol dispatched with vehicle DL-1C-9902. Drone verification initiated.',
    verifiedBySensors: true
  },
  {
    id: 'rep-002',
    title: 'Industrial Chemical Sludge Discharge in Storm Drain',
    category: 'water',
    severity: 'severe',
    description: 'Bright red, chemically pungent liquid flowing directly into open storm canal. Strong solvent odor causing headaches to passersby.',
    lat: 28.6810,
    lng: 77.1320,
    address: 'Mayapuri Phase II, Near Drain Bridge #4',
    imageUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80',
    timestamp: '42 mins ago',
    isAnonymous: true,
    status: 'action_taken',
    upvotes: 68,
    assignedAgency: 'State Industrial Effluent Enforcement Unit',
    actionNotes: 'Drain gates temporarily blocked. Sample taken for laboratory chromatography.',
    verifiedBySensors: true
  },
  {
    id: 'rep-003',
    title: 'Uncovered Construction Excavation Spreading Dust Clouds',
    category: 'air',
    severity: 'moderate',
    description: 'High rise construction site has no anti-smog water sprinklers or green curtains. Visible dust blanket moving into school zone.',
    lat: 28.5720,
    lng: 77.3290,
    address: 'Sector 25A Main Road, Opposite Modern Public School',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
    timestamp: '2 hours ago',
    isAnonymous: false,
    reporterName: 'Rohit Verma',
    status: 'pending',
    upvotes: 19,
    assignedAgency: 'Municipal Corporation Environmental Wing',
    verifiedBySensors: false
  },
  {
    id: 'rep-004',
    title: 'Hazardous Chemical Battery Smoldering & Dumping',
    category: 'soil',
    severity: 'hazardous',
    description: 'Unregulated acid lead battery dismantling on unpaved ground. Lead dust and acid residue seeping into soil bed.',
    lat: 28.6650,
    lng: 77.1080,
    address: 'Mundka Industrial Fringe, Plot 89-B',
    imageUrl: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80',
    timestamp: '4 hours ago',
    isAnonymous: true,
    status: 'investigating',
    upvotes: 35,
    assignedAgency: 'Hazardous Waste Monitoring Division',
    actionNotes: 'Inspection scheduled for 26-Sep morning shift with police escort.',
    verifiedBySensors: true
  }
];

export const INITIAL_HOTSPOTS: HotspotCluster[] = [
  {
    id: 'cluster-h1',
    title: 'Cluster #104: Severe VOC & PM2.5 Thermal Inversion',
    lat: 28.6850,
    lng: 77.1280,
    radiusMeters: 650,
    primaryPollutant: 'PM2.5 & Benzene / VOC',
    avgAqi: 388,
    sensorCount: 6,
    reportCount: 14,
    riskLevel: 'critical',
    confidenceScore: 97,
    identifiedAt: '35 mins ago',
    recommendedAction: 'Immediate stop-work order for metal treatment units & traffic reroute.',
    status: 'active'
  },
  {
    id: 'cluster-h2',
    title: 'Cluster #108: Evening Commute Diesel Corridor',
    lat: 28.5672,
    lng: 77.2150,
    radiusMeters: 450,
    primaryPollutant: 'NO2 & Ultrafine Particles (PM1.0/2.5)',
    avgAqi: 315,
    sensorCount: 9,
    reportCount: 8,
    riskLevel: 'critical',
    confidenceScore: 93,
    identifiedAt: '1 hour ago',
    recommendedAction: 'Deploy traffic mitigation squad; activate roadside mist cannons.',
    status: 'mitigating'
  },
  {
    id: 'cluster-h3',
    title: 'Cluster #112: Biomass Smoldering Pocket',
    lat: 28.5370,
    lng: 77.2450,
    radiusMeters: 380,
    primaryPollutant: 'PM2.5 & Carbon Monoxide (CO)',
    avgAqi: 252,
    sensorCount: 4,
    reportCount: 12,
    riskLevel: 'high',
    confidenceScore: 89,
    identifiedAt: '25 mins ago',
    recommendedAction: 'Dispatch municipal night patrol to extinguish unauthorized fires.',
    status: 'active'
  }
];

export const INITIAL_WATER_SOIL: WaterSoilSpot[] = [
  {
    id: 'water-1',
    name: 'Yamuna River Section 4 - Toxic Ammonia Foam',
    category: 'water',
    lat: 28.6180,
    lng: 77.2650,
    severity: 'hazardous',
    contaminant: 'Untreated Industrial Ammonia & Detergents',
    metricValue: 'Ammonia: 8.9 mg/L (Safe: < 0.5)',
    statusText: 'Severe Ecological Hazard',
    lastUpdated: '15 mins ago'
  },
  {
    id: 'water-2',
    name: 'Najafgarh Drain Confluence Point',
    category: 'water',
    lat: 28.7120,
    lng: 77.1650,
    severity: 'severe',
    contaminant: 'Heavy Metals (Chromium / Lead / Nickel)',
    metricValue: 'BOD: 94 mg/L (Critical High)',
    statusText: 'Under Enforcement Review',
    lastUpdated: '1 hour ago'
  },
  {
    id: 'soil-1',
    name: 'Bhalaswa Landfill Heavy Leachate Seepage',
    category: 'soil',
    lat: 28.7410,
    lng: 77.1550,
    severity: 'hazardous',
    contaminant: 'Toxic Organic Leachate & Methanogenesis',
    metricValue: 'Subsoil Mercury: 4.8x limit',
    statusText: 'Groundwater Contamination Risk',
    lastUpdated: '3 hours ago'
  },
  {
    id: 'soil-2',
    name: 'Ghazipur Unsegregated Plastic Smolder Zone',
    category: 'soil',
    lat: 28.6250,
    lng: 77.3320,
    severity: 'critical' as SeverityLevel,
    contaminant: 'Microplastics & Chlorinated Dioxins',
    metricValue: 'Soil pH: 4.2 (Highly Acidic)',
    statusText: 'Active Remediation Pending',
    lastUpdated: '45 mins ago'
  }
];

export function getAqiCategory(aqi: number): {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  healthNote: string;
} {
  if (aqi <= 50) {
    return {
      label: 'Good',
      color: '#10b981',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      healthNote: 'Air quality is satisfactory; air pollution poses little or no risk.'
    };
  }
  if (aqi <= 100) {
    return {
      label: 'Moderate',
      color: '#eab308',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400',
      healthNote: 'Acceptable; sensitive individuals should consider limiting heavy outdoor exertion.'
    };
  }
  if (aqi <= 200) {
    return {
      label: 'Unhealthy for Sensitive Groups',
      color: '#f97316',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400',
      healthNote: 'Members of sensitive groups may experience health effects. Wear a mask outdoors.'
    };
  }
  if (aqi <= 300) {
    return {
      label: 'Very Unhealthy / Severe',
      color: '#ef4444',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-400',
      healthNote: 'Health alert: Everyone may experience serious effects. Keep windows closed and avoid outdoor exercise.'
    };
  }
  return {
    label: 'Hazardous / Emergency',
    color: '#881337',
    bgColor: 'bg-rose-950/40',
    borderColor: 'border-rose-500/40',
    textColor: 'text-rose-400',
    healthNote: 'Emergency conditions! The entire population is likely to be affected. High particulate toxicity.'
  };
}

export function getSeverityBadge(severity: SeverityLevel) {
  switch (severity) {
    case 'low':
      return { label: 'Low', badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    case 'moderate':
      return { label: 'Moderate', badgeClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    case 'unhealthy':
      return { label: 'Unhealthy', badgeClass: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
    case 'severe':
      return { label: 'Severe', badgeClass: 'bg-red-500/20 text-red-400 border-red-500/30' };
    case 'hazardous':
      return { label: 'Hazardous / Emergency', badgeClass: 'bg-rose-900/40 text-rose-300 border-rose-500/40' };
  }
}
