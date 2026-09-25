import React, { createContext, useContext, useState, useEffect } from 'react';
import { SensorReading, CitizenReport, HotspotCluster, WaterSoilSpot, ReportStatus } from '../types';
import { INITIAL_SENSORS, INITIAL_REPORTS, INITIAL_HOTSPOTS, INITIAL_WATER_SOIL } from '../data/mockData';
import { ALL_INDIA_SENSORS } from '../data/indiaCities';

interface AppContextType {
  activeTab: 'home' | 'map' | 'report' | 'authority' | 'simulator';
  setActiveTab: (tab: 'home' | 'map' | 'report' | 'authority' | 'simulator') => void;
  sensors: SensorReading[];
  reports: CitizenReport[];
  hotspots: HotspotCluster[];
  waterSoilSpots: WaterSoilSpot[];
  selectedSensor: SensorReading | null;
  setSelectedSensor: (sensor: SensorReading | null) => void;
  selectedReport: CitizenReport | null;
  setSelectedReport: (report: CitizenReport | null) => void;
  selectedHotspot: HotspotCluster | null;
  setSelectedHotspot: (hotspot: HotspotCluster | null) => void;
  addReport: (report: Omit<CitizenReport, 'id' | 'timestamp' | 'status' | 'upvotes'>) => void;
  upvoteReport: (reportId: string) => void;
  updateReportStatus: (reportId: string, status: ReportStatus, notes?: string, agency?: string) => void;
  // Theme mode: 'figma-light' (matches Figma UX Design System) | 'dark' (cyberpunk)
  theme: 'figma-light' | 'dark';
  setTheme: (theme: 'figma-light' | 'dark') => void;
  toggleTheme: () => void;
  // Simulator state & controls
  isSimulating: boolean;
  setIsSimulating: (sim: boolean) => void;
  simulatedWearable: SensorReading;
  updateSimulatedWearable: (updates: Partial<SensorReading>) => void;
}

const STORAGE_KEYS = {
  REPORTS: 'vayu_citizen_reports_v1',
  SENSORS: 'vayu_sensors_v1',
  HOTSPOTS: 'vayu_hotspots_v1',
  THEME: 'vayu_theme_mode_v1'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'map' | 'report' | 'authority' | 'simulator'>('home');

  // Load from local storage or defaults
  const [reports, setReports] = useState<CitizenReport[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [sensors, setSensors] = useState<SensorReading[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SENSORS);
    if (!saved) return INITIAL_SENSORS;
    try {
      const parsed: SensorReading[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map(s => s.id));
      const missing = ALL_INDIA_SENSORS.filter(s => !existingIds.has(s.id));
      return [...parsed, ...missing];
    } catch {
      return INITIAL_SENSORS;
    }
  });

  const [hotspots, setHotspots] = useState<HotspotCluster[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HOTSPOTS);
    return saved ? JSON.parse(saved) : INITIAL_HOTSPOTS;
  });

  const [waterSoilSpots] = useState<WaterSoilSpot[]>(INITIAL_WATER_SOIL);

  const [theme, setThemeState] = useState<'figma-light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return (saved === 'dark' || saved === 'figma-light') ? saved : 'figma-light';
  });

  const setTheme = (t: 'figma-light' | 'dark') => {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEYS.THEME, t);
  };

  const toggleTheme = () => {
    const next = theme === 'figma-light' ? 'dark' : 'figma-light';
    setThemeState(next);
    localStorage.setItem(STORAGE_KEYS.THEME, next);
  };

  const [selectedSensor, setSelectedSensor] = useState<SensorReading | null>(null);
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotCluster | null>(null);

  // Wearable Simulator Live state
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simulatedWearable, setSimulatedWearable] = useState<SensorReading>({
    id: 'vayu-live-wearable-sim',
    name: 'VAYU Live Demo Sensor (Active Wearer)',
    sourceType: 'vayu_wearable',
    lat: 28.5800,
    lng: 77.2280,
    locationName: 'Lodhi Garden Environmental Corridor',
    aqi: 142,
    pm25: 76,
    pm10: 124,
    voc: 290,
    no2: 36,
    co: 1.1,
    temp: 28.8,
    humidity: 59,
    confidence: 97,
    battery: 92,
    userTag: 'Live Hardware Telemetry Feed',
    lastUpdated: 'Live right now',
    hourlyTrend: [
      { time: '17:00', aqi: 120, pm25: 60, voc: 240 },
      { time: '18:00', aqi: 135, pm25: 70, voc: 275 },
      { time: '19:00', aqi: 148, pm25: 82, voc: 310 },
      { time: '20:00', aqi: 140, pm25: 75, voc: 285 },
      { time: '21:00', aqi: 142, pm25: 76, voc: 290 }
    ]
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SENSORS, JSON.stringify(sensors));
  }, [sensors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HOTSPOTS, JSON.stringify(hotspots));
  }, [hotspots]);

  // Synchronize state with VAYU API Gateway (:5000) when online
  useEffect(() => {
    const syncWithBackend = async () => {
      try {
        const [sensRes, repRes, hotRes] = await Promise.all([
          fetch('http://localhost:5000/api/v1/telemetry/nodes', { signal: AbortSignal.timeout(1200) }),
          fetch('http://localhost:5000/api/v1/reports', { signal: AbortSignal.timeout(1200) }),
          fetch('http://localhost:5000/api/v1/hotspots', { signal: AbortSignal.timeout(1200) }),
        ]);

        if (sensRes.ok) {
          const json = await sensRes.json();
          if (json.data && json.data.length > 0) setSensors(json.data);
        }
        if (repRes.ok) {
          const json = await repRes.json();
          if (json.data && json.data.length > 0) setReports(json.data);
        }
        if (hotRes.ok) {
          const json = await hotRes.json();
          if (json.data && json.data.length > 0) setHotspots(json.data);
        }
      } catch (err) {
        // Backend mesh offline; smoothly using local state
      }
    };

    syncWithBackend();
  }, []);

  // Periodic subtle drift / live heartbeat for the simulated wearable when enabled
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setSimulatedWearable(prev => {
        // Small random fluctuations in PM2.5, VOC, and slight geographic step
        const deltaPm = (Math.random() - 0.48) * 3;
        const newPm = Math.max(15, Math.min(450, Math.round(prev.pm25 + deltaPm)));
        const newAqi = Math.round(newPm * 1.35);
        const deltaVoc = (Math.random() - 0.48) * 12;
        const newVoc = Math.max(80, Math.min(1500, Math.round(prev.voc + deltaVoc)));

        // Slight micro-walk simulation
        const latOffset = (Math.random() - 0.5) * 0.0003;
        const lngOffset = (Math.random() - 0.5) * 0.0003;

        return {
          ...prev,
          lat: prev.lat + latOffset,
          lng: prev.lng + lngOffset,
          pm25: newPm,
          aqi: newAqi,
          voc: newVoc,
          lastUpdated: 'Live right now'
        };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const addReport = (newReportData: Omit<CitizenReport, 'id' | 'timestamp' | 'status' | 'upvotes'>) => {
    const newReport: CitizenReport = {
      ...newReportData,
      id: `rep-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now',
      status: 'pending',
      upvotes: 1,
      verifiedBySensors: Math.random() > 0.4 // 60% chance of correlation with nearby sensor
    };

    setReports(prev => [newReport, ...prev]);

    // If report is high severity, check if it creates or augments a hotspot
    if (newReport.severity === 'hazardous' || newReport.severity === 'severe') {
      const newHotspot: HotspotCluster = {
        id: `cluster-auto-${Date.now().toString().slice(-3)}`,
        title: `Dynamic Hotspot: ${newReport.title.slice(0, 32)}...`,
        lat: newReport.lat,
        lng: newReport.lng,
        radiusMeters: 400,
        primaryPollutant: newReport.category === 'air' ? 'PM2.5 & Toxins' : 'Chemical/Waste Discharge',
        avgAqi: 310,
        sensorCount: 2,
        reportCount: 1,
        riskLevel: newReport.severity === 'hazardous' ? 'critical' : 'high',
        confidenceScore: 88,
        identifiedAt: 'Just now',
        recommendedAction: 'Rapid enforcement alert triggered via citizen geo-report.',
        status: 'active'
      };
      setHotspots(prev => [newHotspot, ...prev]);
    }

    // Fire-and-forget async sync to API Gateway
    fetch('http://localhost:5000/api/v1/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReportData)
    }).catch(() => {});
  };

  const upvoteReport = (reportId: string) => {
    setReports(prev =>
      prev.map(r => (r.id === reportId ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
    fetch(`http://localhost:5000/api/v1/reports/${reportId}/upvote`, { method: 'POST' }).catch(() => {});
  };

  const updateReportStatus = (
    reportId: string,
    status: ReportStatus,
    notes?: string,
    agency?: string
  ) => {
    setReports(prev =>
      prev.map(r => {
        if (r.id === reportId) {
          return {
            ...r,
            status,
            actionNotes: notes !== undefined ? notes : r.actionNotes,
            assignedAgency: agency !== undefined ? agency : r.assignedAgency
          };
        }
        return r;
      })
    );

    // Sync status change with Authority microservice
    fetch(`http://localhost:5000/api/v1/authority/reports/${reportId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, actionNotes: notes, assignedAgency: agency })
    }).catch(() => {});
  };

  const updateSimulatedWearable = (updates: Partial<SensorReading>) => {
    setSimulatedWearable(prev => ({ ...prev, ...updates }));
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        sensors: [...sensors, simulatedWearable],
        reports,
        hotspots,
        waterSoilSpots,
        selectedSensor,
        setSelectedSensor,
        selectedReport,
        setSelectedReport,
        selectedHotspot,
        setSelectedHotspot,
        addReport,
        upvoteReport,
        updateReportStatus,
        theme,
        setTheme,
        toggleTheme,
        isSimulating,
        setIsSimulating,
        simulatedWearable,
        updateSimulatedWearable
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
