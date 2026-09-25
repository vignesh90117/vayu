// Shared Data Store for VAYU Microservices

export const store = {
  sensors: [
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
      lastUpdated: new Date().toISOString(),
      hourlyTrend: [
        { time: '17:00', aqi: 180, pm25: 130, voc: 420 },
        { time: '18:00', aqi: 215, pm25: 165, voc: 540 },
        { time: '19:00', aqi: 256, pm25: 210, voc: 720 },
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
      lastUpdated: new Date().toISOString(),
      hourlyTrend: [
        { time: '17:00', aqi: 240, pm25: 190, voc: 630 },
        { time: '18:00', aqi: 275, pm25: 220, voc: 720 },
        { time: '19:00', aqi: 330, pm25: 280, voc: 940 },
        { time: '20:00', aqi: 325, pm25: 275, voc: 910 },
        { time: '21:00', aqi: 312, pm25: 262, voc: 890 }
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
      lastUpdated: new Date().toISOString(),
      hourlyTrend: [
        { time: '17:00', aqi: 172, pm25: 96, voc: 240 },
        { time: '18:00', aqi: 180, pm25: 104, voc: 250 },
        { time: '19:00', aqi: 198, pm25: 122, voc: 275 },
        { time: '20:00', aqi: 192, pm25: 115, voc: 268 },
        { time: '21:00', aqi: 188, pm25: 110, voc: 260 }
      ]
    }
  ],

  reports: [
    {
      id: 'rep-001',
      title: 'Illegal Biomass & Tire Burning in Empty Plot',
      category: 'air',
      severity: 'hazardous',
      description: 'Thick black acrid smoke billowing across residential apartments since 8:30 PM. Strong smell of burnt rubber and plastic.',
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
      actionNotes: 'Field patrol dispatched with vehicle DL-1C-9902.',
      verifiedBySensors: true
    },
    {
      id: 'rep-002',
      title: 'Industrial Chemical Sludge Discharge in Storm Drain',
      category: 'water',
      severity: 'severe',
      description: 'Bright red, chemically pungent liquid flowing directly into open storm canal.',
      lat: 28.6810,
      lng: 77.1320,
      address: 'Mayapuri Phase II, Near Drain Bridge #4',
      imageUrl: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80',
      timestamp: '42 mins ago',
      isAnonymous: true,
      status: 'action_taken',
      upvotes: 68,
      assignedAgency: 'State Industrial Effluent Enforcement Unit',
      actionNotes: 'Drain gates temporarily blocked. Sample taken for chromatography.',
      verifiedBySensors: true
    }
  ],

  hotspots: [
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
    }
  ],

  auditLogs: [
    {
      id: 'log-001',
      incidentId: 'rep-001',
      agency: 'DPCC Rapid Unit',
      action: 'PATROL_DISPATCHED',
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      officer: 'Inspector V. Sharma',
      notes: 'Emergency vehicle DL-1C-9902 en route to Kalkaji Extension'
    },
    {
      id: 'log-002',
      incidentId: 'rep-002',
      agency: 'State Industrial Effluent Unit',
      action: 'DRAIN_GATE_SEALED',
      timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
      officer: 'Chief Officer K. Patel',
      notes: 'Industrial outfall valve isolated; fine of INR 2,50,000 served'
    }
  ]
};
