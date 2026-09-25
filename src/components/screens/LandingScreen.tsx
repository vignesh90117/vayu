import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Map, 
  AlertTriangle, 
  Shield, 
  Wind, 
  Droplet, 
  Sprout, 
  Cpu, 
  Users, 
  ChevronRight, 
  Activity, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  Radio,
  FileCheck2,
  Sliders,
  Layers,
  Sparkles
} from 'lucide-react';
import { getAqiCategory } from '../../data/mockData';

export const LandingScreen: React.FC = () => {
  const { setActiveTab, sensors, reports, hotspots, simulatedWearable, theme } = useApp();
  const [selectedRole, setSelectedRole] = useState<'citizen' | 'analyst' | 'authority'>('citizen');

  const isLight = theme === 'figma-light';
  const activeSensorsCount = sensors.length;
  const criticalHotspots = hotspots.filter(h => h.riskLevel === 'critical').length;
  const resolvedReports = reports.filter(r => r.status === 'resolved' || r.status === 'action_taken').length;
  const avgAqi = Math.round(sensors.reduce((acc, s) => acc + s.aqi, 0) / (sensors.length || 1));
  const avgAqiInfo = getAqiCategory(avgAqi);

  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 overflow-hidden">
        {/* Ambient gradient backdrops */}
        {!isLight && (
          <>
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-sky-500/20 via-teal-500/15 to-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-10 right-10 w-72 h-72 bg-sky-600/10 blur-[100px] rounded-full pointer-events-none" />
          </>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge */}
              <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border backdrop-blur-md ${
                isLight ? 'bg-blue-50/90 border-blue-200 text-blue-700' : 'bg-sky-500/10 border-sky-500/25 text-sky-300'
              }`}>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Real-Time Environmental Intelligence
                </span>
              </div>

              {/* Main Headline - Matches Figma Artboard 2 */}
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] font-heading ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                See pollution.<br />
                Understand the hotspot.<br />
                <span className={isLight ? 'text-blue-600' : 'bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent'}>
                  Take action.
                </span>
              </h1>

              <p className={`text-lg max-w-2xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                <strong className={isLight ? 'text-slate-900 font-semibold' : 'text-white font-semibold'}>VAYU</strong> is an end-to-end pollution intelligence platform. By synthesizing continuous real-world telemetry from <strong className={isLight ? 'text-blue-600 font-medium' : 'text-sky-300 font-medium'}>VAYU wearable sensors</strong>, fixed ambient stations, and verified citizen reports, we transform invisible environmental toxicity into rapid community and municipal action.
              </p>

              {/* Primary Call to Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <button
                  onClick={() => setActiveTab('map')}
                  className={`flex items-center gap-3 px-7 py-3.5 rounded-xl font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all ${
                    isLight 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25' 
                      : 'bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-sky-500/25 hover:shadow-sky-500/40'
                  }`}
                >
                  <Map className="w-4 h-4" />
                  <span>Explore Live Map</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={() => setActiveTab('report')}
                  className={`flex items-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-sm border shadow-md transition-all active:scale-95 ${
                    isLight 
                      ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-sm' 
                      : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-emerald-500/40'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-emerald-500" />
                  <span>Report Pollution</span>
                </button>
              </div>

              {/* Quick Trust / Hardware specs */}
              <div className={`flex items-center gap-6 pt-4 text-xs border-t ${
                isLight ? 'text-slate-500 border-slate-200' : 'text-slate-400 border-slate-800/80'
              }`}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Wearable PM2.5 & VOC Ingestion</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${isLight ? 'text-blue-500' : 'text-sky-400'}`} />
                  <span>Privacy-Preserving GPS</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${isLight ? 'text-purple-600' : 'text-purple-400'}`} />
                  <span>Authority Action Protocol</span>
                </div>
              </div>

            </div>

            {/* Right Column: Live Telemetry Snapshot Card */}
            <div className="lg:col-span-5">
              <div className={`p-6 sm:p-7 rounded-3xl border shadow-2xl relative group transition-all ${
                isLight 
                  ? 'bg-white border-slate-200/90 shadow-slate-200/70 hover:border-blue-400' 
                  : 'glass-panel border-slate-800/90 hover:border-sky-500/30'
              }`}>
                
                {/* Header */}
                <div className={`flex items-center justify-between pb-5 border-b ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border ${
                      isLight ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-sky-500/10 border-sky-500/20 text-sky-400'
                    }`}>
                      <Cpu className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Live VAYU Telemetry Node</h3>
                      <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Active Mobile Wearer stream</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border flex items-center gap-1.5 ${
                    isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    LIVE
                  </span>
                </div>

                {/* Live AQI Big Badge */}
                <div className={`my-6 p-5 rounded-2xl border flex items-center justify-between ${
                  isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-900/80 border-slate-800/80'
                }`}>
                  <div>
                    <span className={`text-xs uppercase font-bold tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Hyperlocal AQI
                    </span>
                    <div className={`text-4xl font-extrabold mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {simulatedWearable.aqi}
                    </div>
                    <span className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-md ${avgAqiInfo.bgColor} ${avgAqiInfo.textColor}`}>
                      {getAqiCategory(simulatedWearable.aqi).label}
                    </span>
                  </div>

                  <div className="text-right space-y-1">
                    <div className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      PM2.5: <strong className={isLight ? 'text-slate-900' : 'text-white'}>{simulatedWearable.pm25} µg/m³</strong>
                    </div>
                    <div className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      VOC Index: <strong className={isLight ? 'text-blue-700' : 'text-cyan-300'}>{simulatedWearable.voc} ppb</strong>
                    </div>
                    <div className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      Confidence: <strong className="text-emerald-600">{simulatedWearable.confidence}%</strong>
                    </div>
                    <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      Lat: {simulatedWearable.lat.toFixed(4)}, Lng: {simulatedWearable.lng.toFixed(4)}
                    </div>
                  </div>
                </div>

                {/* Sub-metrics Grid */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'}`}>
                    <div className={`text-[10px] uppercase font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Active Sensors</div>
                    <div className={`text-lg font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>{activeSensorsCount} Nodes</div>
                  </div>
                  <div className={`p-3 rounded-xl border ${isLight ? 'bg-rose-50/60 border-rose-200' : 'bg-slate-900/50 border-slate-800'}`}>
                    <div className={`text-[10px] uppercase font-semibold ${isLight ? 'text-rose-600' : 'text-slate-400'}`}>Hotspots</div>
                    <div className="text-lg font-bold text-rose-600 mt-0.5">{criticalHotspots} Critical</div>
                  </div>
                  <div className={`p-3 rounded-xl border ${isLight ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-900/50 border-slate-800'}`}>
                    <div className={`text-[10px] uppercase font-semibold ${isLight ? 'text-emerald-700' : 'text-slate-400'}`}>Interventions</div>
                    <div className="text-lg font-bold text-emerald-600 mt-0.5">{resolvedReports} Resolved</div>
                  </div>
                </div>

                {/* Action CTA */}
                <div className={`mt-5 pt-4 border-t flex items-center justify-between ${isLight ? 'border-slate-100' : 'border-slate-800/80'}`}>
                  <span className={`text-xs flex items-center gap-1.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    <Activity className={`w-3.5 h-3.5 ${isLight ? 'text-blue-600' : 'text-sky-400'}`} />
                    Updated 2 seconds ago
                  </span>
                  <button
                    onClick={() => setActiveTab('simulator')}
                    className={`text-xs font-semibold flex items-center gap-1 transition-colors ${
                      isLight ? 'text-blue-600 hover:text-blue-700' : 'text-sky-400 hover:text-sky-300'
                    }`}
                  >
                    <span>Test Hardware Controls</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Problem vs. Solution Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
            College Project & Startup Positioning
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-heading">
            Why Traditional Monitoring Fails & How VAYU Solves It
          </h2>
          <p className="text-slate-400 mt-3 text-sm">
            Bridging the gap between isolated official towers, wearable citizen telemetry, and municipal response.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional Way */}
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-rose-500/20 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold mb-4 border border-rose-500/20">
              Traditional Monitoring (The Problem)
            </div>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="text-rose-400 text-lg font-bold">✕</span>
                <div>
                  <strong className="text-white block font-medium">Sparse Fixed Stations</strong>
                  Government CAAQMS towers are placed miles apart, completely blind to street-level microclimates and hyper-local spikes.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-400 text-lg font-bold">✕</span>
                <div>
                  <strong className="text-white block font-medium">Delayed & Fragmented Information</strong>
                  Air, water, and soil reports live in separate departmental silos with hours of data latency.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-400 text-lg font-bold">✕</span>
                <div>
                  <strong className="text-white block font-medium">Unverified Citizen Complaints</strong>
                  Residents submit reports on Twitter or hotlines with zero real-time sensor proof, leading to inaction.
                </div>
              </li>
            </ul>
          </div>

          {/* VAYU Solution */}
          <div className="p-8 rounded-3xl glass-panel border border-emerald-500/30 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-4 border border-emerald-500/20">
              VAYU Intelligence Engine (The Solution)
            </div>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 text-lg font-bold">✓</span>
                <div>
                  <strong className="text-white block font-medium">Crowdsourced Wearable Sensor Swarm</strong>
                  Every VAYU wearable acts as a mobile environmental node, capturing breathing-zone PM2.5, VOC, and GPS wherever users go.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 text-lg font-bold">✓</span>
                <div>
                  <strong className="text-white block font-medium">Unified Real-Time Geospatial Layer</strong>
                  Air, water runoff, and illegal soil dumps visualized together with automated spatial cluster detection.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 text-lg font-bold">✓</span>
                <div>
                  <strong className="text-white block font-medium">Sensor-Backed Municipal Action</strong>
                  Citizen complaints are automatically cross-correlated against sensor readings to trigger high-confidence authority dispatch.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* The VAYU Ecosystem Pipeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Hardware-to-Software Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-heading">
              The VAYU Data Ecosystem Pipeline
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              From personal wearable micro-sensors to municipal environmental enforcement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-white mb-2">VAYU Wearable</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Measures PM2.5, VOC, ambient temp, humidity, and location continuously with sub-minute resolution.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-white mb-2">Edge Telemetry</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                BLE 5.2 streams encrypted sensor packets to smartphone client; anonymizes personal identifiers.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-white mb-2">Intelligence Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Applies spatial kriging, sensor confidence weighting, and correlation with weather and official towers.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm mb-4">
                04
              </div>
              <h3 className="text-base font-bold text-white mb-2">Citizen Reports</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Citizens submit photo & pin-drop reports. Algorithm correlates spikes to validate ground truth.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm mb-4">
                05
              </div>
              <h3 className="text-base font-bold text-white mb-2">Authority Action</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                City environmental teams inspect flagged clusters, enforce fines, and log interventions publicly.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Persona Role Explorer (Citizen / Analyst / Authority) - Matches Figma Artboard 2 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-blue-600' : 'text-emerald-400'}`}>
            Stakeholder Ecosystem
          </span>
          <h2 className={`text-3xl font-extrabold mt-1 font-heading ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Built for these actors.
          </h2>
          <p className={`text-sm mt-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Tailored environmental intelligence workflows designed specifically for citizens, researchers, and enforcement authorities.
          </p>
        </div>

        {/* Role Tabs */}
        <div className="flex justify-center mb-8">
          <div className={`p-1.5 rounded-2xl border flex gap-2 ${
            isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-slate-900/90 border-slate-800'
          }`}>
            <button
              onClick={() => setSelectedRole('citizen')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                selectedRole === 'citizen'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Citizens</span>
            </button>

            <button
              onClick={() => setSelectedRole('analyst')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                selectedRole === 'analyst'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-500/25'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Analysts</span>
            </button>

            <button
              onClick={() => setSelectedRole('authority')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                selectedRole === 'authority'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Authorities</span>
            </button>
          </div>
        </div>

        {/* Selected Role Content */}
        <div className={`p-8 rounded-3xl border transition-all ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'glass-panel border-slate-800'
        }`}>
          {selectedRole === 'citizen' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-6 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
                <div className={`p-3 w-fit rounded-xl mb-4 ${isLight ? 'bg-blue-100/80 text-blue-700' : 'bg-sky-500/10 text-sky-400'}`}>
                  <Wind className="w-6 h-6" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>Hyperlocal Exposure</h3>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Real-time air quality where you walk, cycle, or commute — including clean route navigation that minimizes lung load.
                </p>
              </div>

              <div className={`p-6 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
                <div className={`p-3 w-fit rounded-xl mb-4 ${isLight ? 'bg-emerald-100/80 text-emerald-700' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>1-Click Incident Pin</h3>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Drop a pin on open waste burning, industrial smoke, or toxic runoff with AI Computer Vision proof validation.
                </p>
              </div>

              <div className={`p-6 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
                <div className={`p-3 w-fit rounded-xl mb-4 ${isLight ? 'bg-purple-100/80 text-purple-700' : 'bg-purple-500/10 text-purple-400'}`}>
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>Personal Lung Load Meter</h3>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Continuous particulate dosimeter tracking microgram PM2.5 intake against daily WHO safe breathing standards.
                </p>
              </div>
            </div>
          )}

          {selectedRole === 'analyst' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-6 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
                <div className={`p-3 w-fit rounded-xl mb-4 ${isLight ? 'bg-teal-100/80 text-teal-700' : 'bg-teal-500/10 text-teal-400'}`}>
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>Multi-Pollutant Layers</h3>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Toggle between PM2.5, PM10, VOC/Benzene, NO2, Industrial Water BOD, and Illegal Soil dumps on Google Satellite & Hybrid maps.
                </p>
              </div>

              <div className={`p-6 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
                <div className={`p-3 w-fit rounded-xl mb-4 ${isLight ? 'bg-blue-100/80 text-blue-700' : 'bg-sky-500/10 text-sky-400'}`}>
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>Gaussian Plume Dispersion</h3>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Atmospheric wind vector simulation modeling 6-hour downwind drift patterns from confirmed industrial hotspots.
                </p>
              </div>

              <div className={`p-6 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
                <div className={`p-3 w-fit rounded-xl mb-4 ${isLight ? 'bg-amber-100/80 text-amber-700' : 'bg-amber-500/10 text-amber-400'}`}>
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>Sensor Cross-Calibration</h3>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Dynamic confidence scoring comparing low-cost wearable sensors with reference grade CPCB / EPA monitors.
                </p>
              </div>
            </div>
          )}

          {selectedRole === 'authority' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-6 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
                <div className={`p-3 w-fit rounded-xl mb-4 ${isLight ? 'bg-rose-100/80 text-rose-700' : 'bg-rose-500/10 text-rose-400'}`}>
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>Autonomous Drone Missions</h3>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Generate 8-waypoint grid survey flight paths (.geojson) around active hotspots for aerial DJI/PX4 drone inspection.
                </p>
              </div>

              <div className={`p-6 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
                <div className={`p-3 w-fit rounded-xl mb-4 ${isLight ? 'bg-purple-100/80 text-purple-700' : 'bg-purple-500/10 text-purple-400'}`}>
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>Triage & Patrol Dispatch</h3>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Assign municipal inspection units, track 4-stage enforcement workflows, and trigger geofenced public siren alerts.
                </p>
              </div>

              <div className={`p-6 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
                <div className={`p-3 w-fit rounded-xl mb-4 ${isLight ? 'bg-emerald-100/80 text-emerald-700' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>Compliance Audit Trails</h3>
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Export time-stamped incident audit logs to CSV with sensor proof for regulatory penalties and public accountability.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Live Geospatial & Community Teaser CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-r from-sky-900/50 via-slate-900 to-emerald-950/40 border border-sky-500/30 shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Ready to explore the live network?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-heading">
              Map-First Environmental Intelligence at Your Fingertips
            </h2>
            <p className="text-slate-300 text-sm mt-3 leading-relaxed">
              Open the interactive heatmap to toggle air, water, and soil pollution layers, view individual VAYU wearable streams, or submit an incident in your neighborhood.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <button
                onClick={() => setActiveTab('map')}
                className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all"
              >
                Launch Heatmap
              </button>
              <button
                onClick={() => setActiveTab('authority')}
                className="px-6 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
              >
                Open Authority Console
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
