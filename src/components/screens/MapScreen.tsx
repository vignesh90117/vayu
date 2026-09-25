import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { 
  SensorReading, 
  CitizenReport, 
  HotspotCluster, 
  WaterSoilSpot 
} from '../../types';
import { getAqiCategory, getSeverityBadge } from '../../data/mockData';
import { 
  Wind, 
  Droplet, 
  Sprout, 
  AlertTriangle, 
  Layers, 
  X, 
  Maximize2, 
  Radio, 
  Cpu, 
  Building2, 
  Users, 
  Flame, 
  TrendingUp, 
  Sparkles,
  Search,
  Filter,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Globe,
  Building,
  MapPin,
  Navigation,
  Compass,
  Clock,
  Check,
  ArrowRight,
  ShieldAlert,
  Footprints
} from 'lucide-react';
import { COMMUTE_PRESETS, CURRENT_WIND } from '../../data/navigationRoutes';
import { INDIA_CITIES, IndiaCity } from '../../data/indiaCities';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';

export const MapScreen: React.FC = () => {
  const { 
    sensors, 
    reports, 
    hotspots, 
    waterSoilSpots, 
    selectedSensor, 
    setSelectedSensor,
    selectedReport,
    setSelectedReport,
    selectedHotspot,
    setSelectedHotspot,
    setActiveTab,
    simulatedWearable
  } = useApp();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Active Map Filter Toggles
  const [activeLayers, setActiveLayers] = useState({
    air: true,
    water: true,
    soil: true,
    hotspots: true,
  });

  const [sourceFilter, setSourceFilter] = useState<'all' | 'wearables' | 'stations' | 'reports'>('all');
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected item union
  const [activeItem, setActiveItem] = useState<{
    type: 'sensor' | 'report' | 'hotspot' | 'water_soil';
    data: any;
  } | null>(() => {
    return { type: 'sensor', data: simulatedWearable };
  });

  // Google Maps Basemap Selection
  const [baseMap, setBaseMap] = useState<'googleHybrid' | 'googleStreets' | 'googleTerrain' | 'cartoVoyager'>('googleHybrid');
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);

  // Advanced Features: Clean Route Navigation & Plume Dispersion
  const [showNavigation, setShowNavigation] = useState(false);
  const [selectedRouteType, setSelectedRouteType] = useState<'cleanest' | 'fastest'>('cleanest');
  const [showPlumeDispersion, setShowPlumeDispersion] = useState(false);
  const [forecastHour, setForecastHour] = useState<number>(1);

  // Indian Cities Quick-Jump & Point Selection State
  const [citySearchOpen, setCitySearchOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState('');
  const [cityRegionFilter, setCityRegionFilter] = useState<'All' | 'North' | 'South' | 'East' | 'West' | 'Central' | 'Northeast' | 'Islands'>('All');
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

  const filteredCities = INDIA_CITIES.filter(city => {
    const matchesQuery = city.name.toLowerCase().includes(cityQuery.toLowerCase()) || 
                         city.state.toLowerCase().includes(cityQuery.toLowerCase());
    const matchesRegion = cityRegionFilter === 'All' || city.region === cityRegionFilter;
    return matchesQuery && matchesRegion;
  });

  const handleSelectCity = (city: IndiaCity) => {
    setSelectedCityId(city.id);
    setCitySearchOpen(false);

    // Smoothly fly map directly to this city coordinate
    mapInstanceRef.current?.flyTo([city.lat, city.lng], 12, { animate: true, duration: 1.5 });

    // Look for matching sensor node in active list
    const existing = sensors.find(s => s.id === `city-sensor-${city.id}` || s.locationName.includes(city.name));
    if (existing) {
      setActiveItem({ type: 'sensor', data: existing });
      setSelectedSensor(existing);
    } else {
      const citySensor = {
        id: `city-sensor-${city.id}`,
        name: `${city.name} Official Ambient Monitor`,
        sourceType: 'fixed_station' as const,
        lat: city.lat,
        lng: city.lng,
        locationName: `${city.name} (${city.state}) — ${city.stationName}`,
        aqi: city.aqi,
        pm25: city.pm25,
        pm10: city.pm10,
        voc: city.voc,
        no2: city.no2,
        co: city.co,
        temp: city.temp,
        humidity: city.humidity,
        confidence: city.confidence,
        battery: 100,
        userTag: `Regional Capital Monitor (${city.region} India)`,
        lastUpdated: 'Live Telemetry Feed',
        hourlyTrend: city.hourlyTrend
      };
      setActiveItem({ type: 'sensor', data: citySensor });
      setSelectedSensor(citySensor);
    }
    setInspectorOpen(true);
  };

  const handleZoomAllIndia = () => {
    setSelectedCityId(null);
    mapInstanceRef.current?.flyTo([22.5, 79.5], 5, { animate: true, duration: 1.5 });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Center on NCR / Delhi urban coordinate
    const map = L.map(mapContainerRef.current, {
      center: [28.6139, 77.2280],
      zoom: 12,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    layerGroupRef.current = layerGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Google Maps / Basemap Tile Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    const BASEMAPS: Record<string, { url: string; subdomains?: string[]; attr: string; maxZoom: number }> = {
      googleHybrid: {
        url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        attr: '&copy; Google Maps Hybrid / Satellite',
        maxZoom: 20
      },
      googleStreets: {
        url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
        attr: '&copy; Google Maps',
        maxZoom: 20
      },
      googleTerrain: {
        url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
        attr: '&copy; Google Maps Terrain',
        maxZoom: 20
      },
      cartoVoyager: {
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        subdomains: ['a', 'b', 'c', 'd'],
        attr: '&copy; CARTO & OpenStreetMap',
        maxZoom: 19
      }
    };

    const selected = BASEMAPS[baseMap] || BASEMAPS.googleHybrid;
    const tileLayer = L.tileLayer(selected.url, {
      attribution: selected.attr,
      subdomains: selected.subdomains || ['a', 'b', 'c', 'd'],
      maxZoom: selected.maxZoom
    }).addTo(map);

    tileLayer.bringToBack();
    currentTileLayerRef.current = tileLayer;
  }, [baseMap]);

  // Sync markers when data or filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const lg = layerGroupRef.current;
    if (!map || !lg) return;

    lg.clearLayers();

    // 1. Hotspot Clusters Layer
    if (activeLayers.hotspots && (sourceFilter === 'all' || sourceFilter === 'wearables' || sourceFilter === 'reports')) {
      hotspots.forEach(hotspot => {
        const circle = L.circle([hotspot.lat, hotspot.lng], {
          radius: hotspot.radiusMeters,
          color: hotspot.riskLevel === 'critical' ? '#ef4444' : '#f97316',
          fillColor: hotspot.riskLevel === 'critical' ? '#ef4444' : '#f97316',
          fillOpacity: 0.22,
          weight: 2,
          dashArray: '4, 8'
        });

        circle.on('click', () => {
          setActiveItem({ type: 'hotspot', data: hotspot });
          setSelectedHotspot(hotspot);
          setSelectedSensor(null);
          setSelectedReport(null);
          setInspectorOpen(true);
        });

        circle.addTo(lg);

        // Center cluster icon
        const clusterIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div class="relative flex items-center justify-center cursor-pointer group">
              <span class="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-rose-500 opacity-60"></span>
              <div class="relative px-2 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-black border border-rose-300 shadow-xl flex items-center gap-1">
                <span>🔥</span>
                <span>${hotspot.avgAqi}</span>
              </div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        const marker = L.marker([hotspot.lat, hotspot.lng], { icon: clusterIcon });
        marker.on('click', () => {
          setActiveItem({ type: 'hotspot', data: hotspot });
          setSelectedHotspot(hotspot);
          setSelectedSensor(null);
          setSelectedReport(null);
          setInspectorOpen(true);
        });
        marker.addTo(lg);
      });
    }

    // 2. Air Quality Sensors (Vayu Wearables, Indian Cities & Fixed Stations)
    if (activeLayers.air) {
      sensors.forEach(sensor => {
        if (sourceFilter === 'wearables' && sensor.sourceType !== 'vayu_wearable') return;
        if (sourceFilter === 'stations' && sensor.sourceType !== 'fixed_station') return;
        if (sourceFilter === 'reports') return;

        const aqiInfo = getAqiCategory(sensor.aqi);
        const isWearable = sensor.sourceType === 'vayu_wearable';
        const isCitySensor = sensor.id.startsWith('city-sensor-');
        const cityName = isCitySensor 
          ? sensor.name.replace(' Official Ambient Monitor', '')
          : (sensor.locationName.split(' (')[0] || sensor.name);
        const isSelected = (selectedSensor?.id === sensor.id) || Boolean(selectedCityId && sensor.id.includes(selectedCityId));

        let markerHtml = '';
        let iconWidth = 52;
        let iconHeight = 32;

        if (isCitySensor) {
          iconWidth = 120;
          iconHeight = 36;
          markerHtml = `
            <div class="relative flex items-center justify-center cursor-pointer group transition-transform hover:scale-115 z-20">
              ${isSelected ? '<span class="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-cyan-400 opacity-75"></span>' : ''}
              <div class="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[11px] font-black shadow-2xl border-2 transition-all ${
                isSelected ? 'ring-4 ring-cyan-400 scale-110 shadow-cyan-500/50' : ''
              }"
                   style="background-color: ${aqiInfo.color}; border-color: rgba(255,255,255,0.95); box-shadow: 0 4px 14px rgba(0,0,0,0.5);">
                <span class="truncate max-w-[68px] font-extrabold tracking-tight">${cityName}</span>
                <span class="px-1.5 py-0.5 bg-black/40 rounded-full text-[10px] font-black tracking-wider text-white shadow-inner">${sensor.aqi}</span>
              </div>
            </div>
          `;
        } else {
          markerHtml = `
            <div class="relative flex items-center justify-center cursor-pointer group">
              ${isWearable ? '<span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-sky-400 opacity-50"></span>' : ''}
              ${isSelected ? '<span class="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-cyan-400 opacity-75"></span>' : ''}
              <div class="relative flex items-center gap-1 px-2.5 py-1 rounded-full text-white text-xs font-bold border shadow-xl transition-transform group-hover:scale-110 ${
                isSelected ? 'ring-4 ring-cyan-400 scale-110' : ''
              }"
                   style="background-color: ${aqiInfo.color}; border-color: rgba(255,255,255,0.6);">
                <span>${isWearable ? '⌚' : '🏢'}</span>
                <span>${sensor.aqi}</span>
              </div>
            </div>
          `;
        }

        const icon = L.divIcon({
          className: 'custom-div-icon',
          html: markerHtml,
          iconSize: [iconWidth, iconHeight],
          iconAnchor: [iconWidth / 2, iconHeight / 2]
        });

        const marker = L.marker([sensor.lat, sensor.lng], { icon });
        marker.on('click', () => {
          setActiveItem({ type: 'sensor', data: sensor });
          setSelectedSensor(sensor);
          if (isCitySensor) {
            setSelectedCityId(sensor.id.replace('city-sensor-', ''));
          }
          setSelectedReport(null);
          setSelectedHotspot(null);
          setInspectorOpen(true);
        });
        marker.addTo(lg);
      });
    }

    // 3. Citizen Incident Reports
    if (sourceFilter === 'all' || sourceFilter === 'reports') {
      reports.forEach(report => {
        const iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="w-8 h-8 rounded-xl bg-slate-900 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
              <span class="text-xs">⚠️</span>
            </div>
            <span class="absolute -top-1 -right-1 flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
        `;

        const icon = L.divIcon({
          className: 'custom-div-icon',
          html: iconHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([report.lat, report.lng], { icon });
        marker.on('click', () => {
          setActiveItem({ type: 'report', data: report });
          setSelectedReport(report);
          setSelectedSensor(null);
          setSelectedHotspot(null);
          setInspectorOpen(true);
        });
        marker.addTo(lg);
      });
    }

    // 4. Water & Soil Environmental Layers
    if (activeLayers.water || activeLayers.soil) {
      waterSoilSpots.forEach(spot => {
        if (spot.category === 'water' && !activeLayers.water) return;
        if (spot.category === 'soil' && !activeLayers.soil) return;
        if (sourceFilter === 'wearables' || sourceFilter === 'stations') return;

        const isWater = spot.category === 'water';
        const color = isWater ? '#0284c7' : '#d97706';

        const iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="px-2 py-0.5 rounded-md text-white text-[10px] font-bold border shadow-lg flex items-center gap-1 transition-transform group-hover:scale-105"
                 style="background-color: ${color}; border-color: rgba(255,255,255,0.4);">
              <span>${isWater ? '💧' : '🌱'}</span>
              <span>${isWater ? 'WATER' : 'SOIL'}</span>
            </div>
          </div>
        `;

        const icon = L.divIcon({
          className: 'custom-div-icon',
          html: iconHtml,
          iconSize: [50, 26],
          iconAnchor: [25, 13]
        });

        const marker = L.marker([spot.lat, spot.lng], { icon });
        marker.on('click', () => {
          setActiveItem({ type: 'water_soil', data: spot });
          setSelectedSensor(null);
          setSelectedReport(null);
          setSelectedHotspot(null);
          setInspectorOpen(true);
        });
        marker.addTo(lg);
      });
    }

    // 5. Clean Air Navigation Polylines (when active)
    if (showNavigation) {
      const activePreset = COMMUTE_PRESETS[0];
      activePreset.routes.forEach(route => {
        const isClean = route.type === 'cleanest';
        const isSelected = selectedRouteType === route.type;
        const polyline = L.polyline(route.coordinates, {
          color: isClean ? '#10b981' : '#ef4444',
          weight: isSelected ? 6 : 3,
          opacity: isSelected ? 0.95 : 0.45,
          dashArray: isClean ? undefined : '6, 8'
        });

        polyline.bindTooltip(
          `<b>${route.name}</b><br/>⏱️ ${route.durationMin} min | 💨 AQI ${route.avgAqi} | 🫁 ${route.pm25ExposureUg}µg Inhaled`,
          { sticky: true, className: 'leaflet-popup-content-wrapper' }
        );

        polyline.on('click', () => setSelectedRouteType(route.type));
        polyline.addTo(lg);
      });

      // Start & End markers
      const startIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold border border-white shadow-xl flex items-center gap-1"><span>🟢</span><span>START</span></div>`,
        iconSize: [60, 24],
        iconAnchor: [30, 12]
      });
      L.marker(activePreset.originCoords, { icon: startIcon }).addTo(lg);

      const destIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold border border-white shadow-xl flex items-center gap-1"><span>🏁</span><span>END</span></div>`,
        iconSize: [60, 24],
        iconAnchor: [30, 12]
      });
      L.marker(activePreset.destCoords, { icon: destIcon }).addTo(lg);
    }

    // 6. Gaussian Plume Wind Dispersion Modeling (when active)
    if (showPlumeDispersion) {
      hotspots.forEach(hotspot => {
        if (hotspot.riskLevel !== 'critical') return;

        // Downwind calculation: Wind blowing from NW (315°) towards SE (135°)
        const driftDegrees = (CURRENT_WIND.speedKmh * forecastHour) / 350;
        const spreadDegrees = (0.012 * forecastHour) + 0.008;

        const conePoints: [number, number][] = [
          [hotspot.lat, hotspot.lng],
          [hotspot.lat - driftDegrees * 0.7 - spreadDegrees, hotspot.lng + driftDegrees * 0.7 - spreadDegrees],
          [hotspot.lat - driftDegrees * 0.7 + spreadDegrees, hotspot.lng + driftDegrees * 0.7 + spreadDegrees]
        ];

        const plume = L.polygon(conePoints, {
          color: '#f43f5e',
          fillColor: '#f43f5e',
          fillOpacity: 0.22,
          weight: 1,
          dashArray: '5, 5'
        });

        plume.bindTooltip(
          `<b>Atmospheric Smoke Plume (+${forecastHour}h Forecast)</b><br/>Wind: ${CURRENT_WIND.directionLabel} @ ${CURRENT_WIND.speedKmh} km/h<br/>Predicted dispersion radius: ${(forecastHour * 1.8).toFixed(1)} km`,
          { sticky: true }
        );

        plume.addTo(lg);
      });
    }

  }, [sensors, reports, hotspots, waterSoilSpots, activeLayers, sourceFilter, showNavigation, selectedRouteType, showPlumeDispersion, forecastHour, selectedCityId, selectedSensor]);

  // Handle Quick Search or jump
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapInstanceRef.current) return;

    // Find closest sensor or report matching name
    const query = searchQuery.toLowerCase();
    const foundSensor = sensors.find(s => s.locationName.toLowerCase().includes(query) || s.name.toLowerCase().includes(query));
    if (foundSensor) {
      mapInstanceRef.current.flyTo([foundSensor.lat, foundSensor.lng], 14, { duration: 1.2 });
      setActiveItem({ type: 'sensor', data: foundSensor });
      setSelectedSensor(foundSensor);
      setInspectorOpen(true);
      return;
    }

    const foundReport = reports.find(r => r.title.toLowerCase().includes(query) || r.address.toLowerCase().includes(query));
    if (foundReport) {
      mapInstanceRef.current.flyTo([foundReport.lat, foundReport.lng], 14, { duration: 1.2 });
      setActiveItem({ type: 'report', data: foundReport });
      setSelectedReport(foundReport);
      setInspectorOpen(true);
    }
  };

  return (
    <div className="relative h-[calc(100vh-80px)] w-full overflow-hidden flex flex-col">
      
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none flex flex-wrap items-center justify-between gap-3">
        
        {/* Layer Switches, City Selector & Search */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          
          {/* Indian Cities Quick-Jump Button */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCitySearchOpen(!citySearchOpen)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white text-xs font-black tracking-wide shadow-xl flex items-center gap-2 hover:opacity-95 active:scale-95 transition-all border border-white/20"
            >
              <span>🇮🇳</span>
              <span>{selectedCityId ? (INDIA_CITIES.find(c => c.id === selectedCityId)?.name || 'Select City') : 'Cities of India (35+)'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${citySearchOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Quick All-India Zoom Out Button */}
            <button
              type="button"
              onClick={handleZoomAllIndia}
              title="Zoom out to view all cities across India"
              className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-bold shadow-xl backdrop-blur-md flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">All India</span>
            </button>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearch} className="relative">
            <input 
              type="text"
              placeholder="Search corridor, sensor, area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-52 sm:w-60 pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900/90 text-white placeholder-slate-400 border border-slate-700/80 shadow-xl backdrop-blur-md focus:outline-none focus:border-sky-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          {/* Layer Toggles Group */}
          <div className="p-1 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md flex items-center gap-1">
            <button
              onClick={() => setActiveLayers(prev => ({ ...prev, air: !prev.air }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeLayers.air 
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Wind className="w-3.5 h-3.5 text-sky-400" />
              <span>Air AQI</span>
            </button>

            <button
              onClick={() => setActiveLayers(prev => ({ ...prev, water: !prev.water }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeLayers.water 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Droplet className="w-3.5 h-3.5 text-cyan-400" />
              <span>Water</span>
            </button>

            <button
              onClick={() => setActiveLayers(prev => ({ ...prev, soil: !prev.soil }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeLayers.soil 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Sprout className="w-3.5 h-3.5 text-amber-400" />
              <span>Soil</span>
            </button>

            <button
              onClick={() => setActiveLayers(prev => ({ ...prev, hotspots: !prev.hotspots }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeLayers.hotspots 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Hotspots</span>
            </button>
          </div>

          {/* Source Filter Dropdown */}
          <div className="p-1 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md flex items-center gap-1 text-xs">
            <span className="px-2 text-slate-400 font-medium">Source:</span>
            {(['all', 'wearables', 'stations', 'reports'] as const).map(source => (
              <button
                key={source}
                onClick={() => setSourceFilter(source)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                  sourceFilter === source
                    ? 'bg-white/10 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {source === 'wearables' ? '⌚ VAYU Wearable' : source}
              </button>
            ))}
          </div>

          {/* Google Maps Base Layer Switcher */}
          <div className="p-1 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md flex items-center gap-1 text-xs">
            <span className="px-2 text-slate-400 font-medium">Map View:</span>
            <button
              type="button"
              onClick={() => setBaseMap('googleHybrid')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-semibold ${
                baseMap === 'googleHybrid'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🛰️</span>
              <span>Google Satellite</span>
            </button>

            <button
              type="button"
              onClick={() => setBaseMap('googleStreets')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-semibold ${
                baseMap === 'googleStreets'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🗺️</span>
              <span>Google Streets</span>
            </button>

            <button
              type="button"
              onClick={() => setBaseMap('googleTerrain')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-semibold ${
                baseMap === 'googleTerrain'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>⛰️</span>
              <span>Terrain</span>
            </button>
          </div>

          {/* Feature 1: Clean Air Route Planner Toggle */}
          <button
            type="button"
            onClick={() => {
              setShowNavigation(!showNavigation);
              if (!showNavigation) setInspectorOpen(false);
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg ${
              showNavigation
                ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/25'
                : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-emerald-500/50'
            }`}
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-400" />
            <span>Clean Route</span>
          </button>

          {/* Feature 3: Plume Wind Dispersion Forecast Toggle */}
          <button
            type="button"
            onClick={() => setShowPlumeDispersion(!showPlumeDispersion)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg ${
              showPlumeDispersion
                ? 'bg-rose-600 text-white border-rose-400 shadow-rose-500/25'
                : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-rose-500/50'
            }`}
          >
            <Wind className="w-3.5 h-3.5 text-rose-400" />
            <span>Plume Forecast</span>
            <span className="text-[10px] opacity-80">14km/h NW</span>
          </button>

        </div>

        {/* Right CTA */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setActiveTab('report')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 hover:opacity-90 active:scale-95 transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Report at Location</span>
          </button>
        </div>

      </div>

      {/* Main Map Canvas */}
      <div ref={mapContainerRef} className="h-full w-full z-10" />

      {/* Indian Cities Quick Selection Modal */}
      {citySearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
          <div className="w-full max-w-2xl bg-slate-950/95 border border-slate-800 shadow-2xl rounded-3xl p-5 sm:p-6 space-y-4 max-h-[82vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🇮🇳</span>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Indian Cities Live AQI Explorer</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
                      {INDIA_CITIES.length} Cities
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">Select any city to fly directly to its coordinates and inspect the exact live point</p>
                </div>
              </div>
              <button 
                onClick={() => setCitySearchOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input inside modal */}
            <div className="relative">
              <input
                type="text"
                autoFocus
                placeholder="Search city, state or union territory (e.g. Mumbai, Bengaluru, Delhi, Kochi, Jaipur...)"
                value={cityQuery}
                onChange={e => setCityQuery(e.target.value)}
                className="w-full pl-10 pr-16 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {cityQuery && (
                <button 
                  onClick={() => setCityQuery('')} 
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Region Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 pb-1">
              <span className="text-xs text-slate-400 font-semibold mr-1">Region:</span>
              {(['All', 'North', 'South', 'East', 'West', 'Central', 'Northeast', 'Islands'] as const).map(reg => (
                <button
                  key={reg}
                  onClick={() => setCityRegionFilter(reg)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    cityRegionFilter === reg
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>

            {/* City Cards Grid */}
            <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredCities.map(city => {
                const aqi = getAqiCategory(city.aqi);
                const isSelected = selectedCityId === city.id;
                return (
                  <button
                    key={city.id}
                    onClick={() => handleSelectCity(city)}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all hover:scale-[1.01] active:scale-95 group ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/50'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">{city.name}</span>
                        <span className="text-[10px] text-slate-400">({city.region})</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate max-w-[190px]">{city.state}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[190px]">{city.stationName}</p>
                    </div>

                    <div className="text-right shrink-0 ml-2">
                      <div 
                        className="px-2.5 py-1 rounded-full text-xs font-black text-white shadow-md inline-block"
                        style={{ backgroundColor: aqi.color }}
                      >
                        AQI {city.aqi}
                      </div>
                      <span className={`block text-[10px] font-bold mt-0.5 ${aqi.textColor}`}>{aqi.label}</span>
                    </div>
                  </button>
                );
              })}

              {filteredCities.length === 0 && (
                <div className="col-span-2 text-center py-8 text-slate-400 text-sm">
                  No cities found matching "{cityQuery}". Try another name.
                </div>
              )}
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Tip: Click any city point on the map to inspect its real-time telemetry</span>
              <button
                onClick={() => {
                  handleZoomAllIndia();
                  setCitySearchOpen(false);
                }}
                className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Show Whole India Map</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature 1: Clean Air Navigation Drawer */}
      {showNavigation && (
        <div className="absolute top-20 left-4 sm:w-96 z-30 pointer-events-auto glass-panel rounded-3xl border border-emerald-500/40 shadow-2xl p-5 flex flex-col space-y-4 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Navigation className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Clean Air Navigation Engine
              </span>
            </div>
            <button
              onClick={() => setShowNavigation(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <strong className="text-white">From:</strong> AIIMS / South Extension
            </div>
            <div className="h-2 w-px bg-slate-700 ml-1.5" />
            <div className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <strong className="text-white">To:</strong> Connaught Place Central Hub
            </div>
          </div>

          {/* Route Options Comparison */}
          <div className="space-y-3">
            {COMMUTE_PRESETS[0].routes.map(route => {
              const isClean = route.type === 'cleanest';
              const isSelected = selectedRouteType === route.type;

              return (
                <div
                  key={route.id}
                  onClick={() => setSelectedRouteType(route.type)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? isClean
                        ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30'
                        : 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      isClean ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {isClean ? '⭐ Clean Corridor' : 'Fastest Highway'}
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      {route.durationMin} mins ({route.distanceKm} km)
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white mb-2">{route.name}</h4>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1 border-t border-slate-800/80">
                    <div className="p-1.5 rounded-lg bg-slate-900/80">
                      <span className="text-[10px] text-slate-400 block">Mean AQI</span>
                      <strong className={isClean ? 'text-emerald-400' : 'text-rose-400'}>{route.avgAqi}</strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-900/80">
                      <span className="text-[10px] text-slate-400 block">PM2.5 Lung Load</span>
                      <strong className={isClean ? 'text-emerald-400' : 'text-rose-400'}>{route.pm25ExposureUg} µg</strong>
                    </div>
                  </div>

                  {isClean && (
                    <div className="mt-2.5 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>Saves 58.2 µg of inhaled particulate toxins!</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Feature 3: Plume Wind Dispersion Scrubber Floating Bar */}
      {showPlumeDispersion && (
        <div className="absolute top-20 right-4 sm:w-80 z-30 pointer-events-auto glass-panel rounded-3xl border border-rose-500/40 shadow-2xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Wind className="w-4 h-4 animate-pulse" />
              <span>Gaussian Plume Dispersion</span>
            </span>
            <button onClick={() => setShowPlumeDispersion(false)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-slate-300">
            Simulating downwind atmospheric dispersion from active critical hotspots based on real-time wind vectors:
          </p>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs flex justify-between">
            <span className="text-slate-400">Wind Direction:</span>
            <strong className="text-sky-300">{CURRENT_WIND.directionLabel}</strong>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1.5">Forecast Time Window:</label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 3, 6].map(hours => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => setForecastHour(hours)}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    forecastHour === hours
                      ? 'bg-rose-600 text-white border-rose-400 shadow-md'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  +{hours} Hour{hours > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Slide-over Inspector Drawer (Left / Bottom on Mobile) */}
      {inspectorOpen && activeItem && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:top-20 sm:bottom-6 sm:w-96 z-30 pointer-events-auto max-h-[85vh] overflow-y-auto glass-panel rounded-3xl border border-slate-800/90 shadow-2xl p-5 flex flex-col">
          
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              {activeItem.type === 'sensor' && (
                <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  <Cpu className="w-4 h-4" />
                </div>
              )}
              {activeItem.type === 'report' && (
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              )}
              {activeItem.type === 'hotspot' && (
                <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <Flame className="w-4 h-4" />
                </div>
              )}
              {activeItem.type === 'water_soil' && (
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Droplet className="w-4 h-4" />
                </div>
              )}
              <span className="text-xs uppercase font-bold tracking-wider text-slate-300">
                {activeItem.type === 'sensor' ? 'Sensor Node Inspector' : 
                 activeItem.type === 'report' ? 'Citizen Incident Detail' : 
                 activeItem.type === 'hotspot' ? 'AI Hotspot Cluster' : 'Water/Soil Hazard'}
              </span>
            </div>

            <button
              onClick={() => setInspectorOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* SENSOR ITEM VIEW */}
          {activeItem.type === 'sensor' && (() => {
            const s: SensorReading = activeItem.data;
            const aqi = getAqiCategory(s.aqi);
            const isWearable = s.sourceType === 'vayu_wearable';

            return (
              <div className="space-y-4 pt-3">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white leading-snug">{s.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{s.locationName}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      {isWearable ? 'VAYU Wearable BLE' : s.sourceType === 'fixed_station' ? 'Govt CAAQMS Tower' : 'Mesh Node'}
                    </span>
                    <span className="text-[11px] text-slate-400">{s.lastUpdated}</span>
                  </div>
                </div>

                {/* AQI Badge Box */}
                <div className={`p-4 rounded-2xl border ${aqi.bgColor} ${aqi.borderColor} flex items-center justify-between`}>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300">
                      Air Quality Index (AQI)
                    </span>
                    <div className="text-3xl font-extrabold text-white mt-0.5">{s.aqi}</div>
                    <span className={`text-xs font-bold ${aqi.textColor}`}>{aqi.label}</span>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-300">PM2.5: <strong className="text-white">{s.pm25} µg/m³</strong></div>
                    <div className="text-xs text-slate-300">VOC: <strong className="text-cyan-300">{s.voc} ppb</strong></div>
                    <div className="text-xs text-slate-300">Confidence: <strong className="text-emerald-400">{s.confidence}%</strong></div>
                  </div>
                </div>

                {/* Health Warning Note */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white block font-medium mb-1">Health Recommendation:</strong>
                  {aqi.healthNote}
                </div>

                {/* Diurnal Trend Chart */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                      <span>24-Hour Diurnal Trend</span>
                    </span>
                    <span className="text-[10px] text-slate-400">AQI vs. Time</span>
                  </div>
                  <div className="h-28 w-full bg-slate-900/50 rounded-xl p-1 border border-slate-800/80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={s.hourlyTrend}>
                        <defs>
                          <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="time" stroke="#64748b" fontSize={9} />
                        <YAxis stroke="#64748b" fontSize={9} domain={['dataMin - 20', 'dataMax + 20']} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                        />
                        <Area type="monotone" dataKey="aqi" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#aqiGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Environmental Sub-parameters */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400">PM10</div>
                    <div className="font-bold text-white">{s.pm10}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400">NO2</div>
                    <div className="font-bold text-white">{s.no2} ppb</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Temp</div>
                    <div className="font-bold text-white">{s.temp}°C</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Humidity</div>
                    <div className="font-bold text-white">{s.humidity}%</div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab('report')}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Report Pollution Discrepancy Here</span>
                  </button>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700/80 transition-colors flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              </div>
            );
          })()}

          {/* REPORT ITEM VIEW */}
          {activeItem.type === 'report' && (() => {
            const r: CitizenReport = activeItem.data;
            const badge = getSeverityBadge(r.severity);

            return (
              <div className="space-y-4 pt-3">
                {r.imageUrl && (
                  <div className="h-36 w-full rounded-2xl overflow-hidden border border-slate-800">
                    <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover" />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${badge.badgeClass}`}>
                      {badge.label}
                    </span>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wide">
                      Category: {r.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">{r.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{r.address}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <p>{r.description}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Reported by: <strong className="text-slate-200">{r.isAnonymous ? 'Anonymous Citizen' : r.reporterName}</strong></span>
                  <span>{r.timestamp}</span>
                </div>

                {r.actionNotes && (
                  <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200">
                    <div className="font-bold flex items-center gap-1.5 text-purple-300 mb-1">
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      <span>Authority Status: {r.status.toUpperCase()}</span>
                    </div>
                    <p className="text-[11px] text-purple-300/90">{r.actionNotes}</p>
                  </div>
                )}

                <button
                  onClick={() => setActiveTab('authority')}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Open in Authority Dispatch Console</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })()}

          {/* HOTSPOT ITEM VIEW */}
          {activeItem.type === 'hotspot' && (() => {
            const h: HotspotCluster = activeItem.data;
            return (
              <div className="space-y-4 pt-3">
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> High Risk Environmental Cluster
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{h.title}</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Correlated Sensors</div>
                    <div className="text-xl font-bold text-sky-400 mt-0.5">{h.sensorCount} Nodes</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Citizen Complaints</div>
                    <div className="text-xl font-bold text-amber-400 mt-0.5">{h.reportCount} Reports</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Primary Toxicant:</span>
                    <strong className="text-white">{h.primaryPollutant}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Average AQI Spike:</span>
                    <strong className="text-rose-400 font-bold">{h.avgAqi} (Severe)</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Spatial Radius:</span>
                    <strong className="text-white">{h.radiusMeters} meters</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Algorithmic Confidence:</span>
                    <strong className="text-emerald-400 font-bold">{h.confidenceScore}%</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <span className="text-slate-400 block mb-1">Recommended Response:</span>
                  <p className="text-white font-medium">{h.recommendedAction}</p>
                </div>

                <button
                  onClick={() => setActiveTab('authority')}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:opacity-90 text-white text-xs font-bold transition-all shadow-lg"
                >
                  Initiate Municipal Enforcement Protocol
                </button>
              </div>
            );
          })()}

          {/* WATER / SOIL VIEW */}
          {activeItem.type === 'water_soil' && (() => {
            const w: WaterSoilSpot = activeItem.data;
            const isWater = w.category === 'water';
            return (
              <div className="space-y-4 pt-3">
                <div className={`p-3 rounded-xl border ${isWater ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isWater ? 'text-cyan-400' : 'text-amber-400'} flex items-center gap-1`}>
                    {isWater ? <Droplet className="w-3.5 h-3.5" /> : <Sprout className="w-3.5 h-3.5" />}
                    {isWater ? 'Water Quality Contamination' : 'Soil & Illegal Waste Hazard'}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{w.name}</h3>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Key Contaminant:</span>
                    <strong className="text-white">{w.contaminant}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Sample Metric:</span>
                    <strong className="text-rose-400 font-bold">{w.metricValue}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Current Status:</span>
                    <strong className="text-amber-300">{w.statusText}</strong>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('report')}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  Submit Updated Water/Soil Sample
                </button>
              </div>
            );
          })()}

        </div>
      )}

      {/* Floating Re-open Button if Inspector is Closed */}
      {!inspectorOpen && (
        <button
          onClick={() => setInspectorOpen(true)}
          className="absolute bottom-6 left-6 z-30 px-4 py-2.5 rounded-xl glass-panel text-white text-xs font-semibold border border-slate-700 shadow-2xl flex items-center gap-2 hover:border-sky-500 transition-colors"
        >
          <Layers className="w-4 h-4 text-sky-400" />
          <span>Show Inspector Details</span>
        </button>
      )}

      {/* Legend & AQI Scale Bar at Bottom */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden md:block">
        <div className="pointer-events-auto px-4 py-2 rounded-2xl bg-slate-950/85 border border-slate-800 shadow-xl backdrop-blur-md flex items-center gap-4 text-[11px]">
          <span className="font-bold text-slate-300">AQI Scale:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-400">0-50 Good</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-slate-400">51-100 Mod</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-slate-400">101-200 Poor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-slate-400">201-300 Severe</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-900" />
            <span className="text-slate-400">300+ Hazardous</span>
          </div>
        </div>
      </div>

    </div>
  );
};
