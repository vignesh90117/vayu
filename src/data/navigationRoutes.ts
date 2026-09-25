export interface RouteOption {
  id: string;
  name: string;
  type: 'fastest' | 'cleanest';
  durationMin: number;
  distanceKm: number;
  avgAqi: number;
  pm25ExposureUg: number; // calculated inhalation load in micrograms
  riskLevel: 'hazardous' | 'moderate' | 'low';
  color: string;
  summary: string;
  coordinates: [number, number][];
  segments: {
    name: string;
    aqi: number;
    color: string;
  }[];
}

export const COMMUTE_PRESETS = [
  {
    id: 'commute-1',
    title: 'South Extension to Connaught Place',
    originName: 'AIIMS / South Extension',
    destName: 'Connaught Place Central Hub',
    originCoords: [28.5672, 77.2100] as [number, number],
    destCoords: [28.6328, 77.2197] as [number, number],
    routes: [
      {
        id: 'fastest-route',
        name: 'Fastest Highway (Ring Road & Barapullah)',
        type: 'fastest',
        durationMin: 18,
        distanceKm: 9.2,
        avgAqi: 318,
        pm25ExposureUg: 86.4,
        riskLevel: 'hazardous',
        color: '#ef4444',
        summary: 'Heavy diesel transit corridor with stop-and-go flyover congestion.',
        coordinates: [
          [28.5672, 77.2100],
          [28.5750, 77.2150],
          [28.5860, 77.2280],
          [28.6010, 77.2350],
          [28.6180, 77.2320],
          [28.6328, 77.2197]
        ],
        segments: [
          { name: 'AIIMS Ring Road Flyover', aqi: 340, color: '#ef4444' },
          { name: 'Barapullah Transit Link', aqi: 310, color: '#ef4444' },
          { name: 'Central Connaught Arterial', aqi: 285, color: '#f97316' }
        ]
      },
      {
        id: 'cleanest-route',
        name: 'VAYU Clean Corridor (Via Lodhi Green Belt)',
        type: 'cleanest',
        durationMin: 22,
        distanceKm: 10.1,
        avgAqi: 114,
        pm25ExposureUg: 28.2, // 67% less particulate absorption!
        riskLevel: 'moderate',
        color: '#10b981',
        summary: 'Low-emission urban green corridor flanked by mature tree canopy and pedestrian avenues.',
        coordinates: [
          [28.5672, 77.2100],
          [28.5780, 77.2180],
          [28.5890, 77.2210],
          [28.6040, 77.2190],
          [28.6210, 77.2150],
          [28.6328, 77.2197]
        ],
        segments: [
          { name: 'Lodhi Garden Green Avenue', aqi: 88, color: '#10b981' },
          { name: 'Max Mueller Canopy Road', aqi: 112, color: '#eab308' },
          { name: 'Janpath Filtered Boulevard', aqi: 142, color: '#f97316' }
        ]
      }
    ] as RouteOption[]
  }
];

export interface WindCondition {
  speedKmh: number;
  directionDeg: number;
  directionLabel: string;
  stabilityClass: string;
}

export const CURRENT_WIND: WindCondition = {
  speedKmh: 14,
  directionDeg: 315, // North-West blowing towards South-East
  directionLabel: 'NW (315°)',
  stabilityClass: 'Class D (Neutral Dispersion)'
};
