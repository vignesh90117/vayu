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
  const { setActiveTab, sensors, reports, hotspots, simulatedWearable } = useApp();
  const [selectedRole, setSelectedRole] = useState<'citizen' | 'analyst' | 'authority'>('citizen');

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
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-sky-500/20 via-teal-500/15 to-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-sky-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/25 backdrop-blur-md">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-300">
                  Wearable IoT + Geospatial Intelligence
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-heading">
                Clean Air. <br />
                <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                  Everywhere You Go.
                </span>
              </h1>

              <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                <strong className="text-white font-semibold">VAYU</strong> is an end-to-end pollution intelligence platform. By synthesizing continuous real-world telemetry from <strong className="text-sky-300 font-medium">VAYU wearable sensors</strong>, fixed ambient stations, and verified citizen reports, we transform invisible environmental toxicity into rapid community and municipal action.
              </p>

              {/* Primary Call to Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <button
                  onClick={() => setActiveTab('map')}
                  className="flex items-center gap-3 px-7 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-bold text-sm shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Map className="w-4 h-4" />
                  <span>Explore Live Heatmap</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={() => setActiveTab('report')}
                  className="flex items-center gap-3 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700/80 shadow-lg hover:border-emerald-500/40 transition-all active:scale-95"
                >
                  <AlertTriangle className="w-4 h-4 text-emerald-400" />
                  <span>Report Pollution Incident</span>
                </button>
              </div>

              {/* Quick Trust / Hardware specs */}
              <div className="flex items-center gap-6 pt-4 text-xs text-slate-400 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Wearable PM2.5 & VOC Ingestion</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  <span>Privacy-Preserving GPS</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Authority Action Protocol</span>
                </div>
              </div>

            </div>

            {/* Right Column: Live Telemetry Snapshot Card */}
            <div className="lg:col-span-5">
              <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-800/90 shadow-2xl relative group hover:border-sky-500/30 transition-all">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                      <Cpu className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Live VAYU Telemetry Node</h3>
                      <p className="text-[11px] text-slate-400">Active Mobile Wearer stream</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE
                  </span>
                </div>

                {/* Live AQI Big Badge */}
                <div className="my-6 p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                      Hyperlocal AQI
                    </span>
                    <div className="text-4xl font-extrabold text-white mt-1">
                      {simulatedWearable.aqi}
                    </div>
                    <span className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-md ${avgAqiInfo.bgColor} ${avgAqiInfo.textColor}`}>
                      {getAqiCategory(simulatedWearable.aqi).label}
                    </span>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="text-xs text-slate-400">
                      PM2.5: <strong className="text-white">{simulatedWearable.pm25} µg/m³</strong>
                    </div>
                    <div className="text-xs text-slate-400">
                      VOC Index: <strong className="text-cyan-300">{simulatedWearable.voc} ppb</strong>
                    </div>
                    <div className="text-xs text-slate-400">
                      Confidence: <strong className="text-emerald-400">{simulatedWearable.confidence}%</strong>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Lat: {simulatedWearable.lat.toFixed(4)}, Lng: {simulatedWearable.lng.toFixed(4)}
                    </div>
                  </div>
                </div>

                {/* Sub-metrics Grid */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Sensors</div>
                    <div className="text-lg font-bold text-white mt-0.5">{activeSensorsCount} Nodes</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Hotspot Clusters</div>
                    <div className="text-lg font-bold text-rose-400 mt-0.5">{criticalHotspots} Critical</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Interventions</div>
                    <div className="text-lg font-bold text-emerald-400 mt-0.5">{resolvedReports} Resolved</div>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-sky-400" />
                    Updated 2 seconds ago
                  </span>
                  <button
                    onClick={() => setActiveTab('simulator')}
                    className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
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

      {/* Persona Role Explorer (Citizen / Analyst / Authority) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Tailored Experiences
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-1 font-heading">
            Built for Three Critical Roles
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Switch views to explore how different stakeholders interact with the VAYU ecosystem.
          </p>
        </div>

        {/* Role Tabs */}
        <div className="flex justify-center mb-8">
          <div className="p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex gap-2">
            <button
              onClick={() => setSelectedRole('citizen')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                selectedRole === 'citizen'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Citizens & Commuters</span>
            </button>

            <button
              onClick={() => setSelectedRole('analyst')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                selectedRole === 'analyst'
                  ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Researchers & Analysts</span>
            </button>

            <button
              onClick={() => setSelectedRole('authority')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                selectedRole === 'authority'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Municipal Authorities</span>
            </button>
          </div>
        </div>

        {/* Selected Role Content */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800">
          {selectedRole === 'citizen' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="p-3 w-fit rounded-xl bg-sky-500/10 text-sky-400 mb-4">
                  <Wind className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Hyperlocal Exposure</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time air quality where you walk, cycle, or wait for the bus — not an average from a station 8 miles away.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 mb-4">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">1-Click Incident Pin</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Drop a pin on open waste burning, construction dust clouds, or toxic effluent with immediate photo upload and GPS verification.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="p-3 w-fit rounded-xl bg-purple-500/10 text-purple-400 mb-4">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Health Advisories</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tailored recommendations: Safe jogging windows, N95 mask necessity, and asthma trigger warnings.
                </p>
              </div>
            </div>
          )}

          {selectedRole === 'analyst' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="p-3 w-fit rounded-xl bg-teal-500/10 text-teal-400 mb-4">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Multi-Pollutant Layers</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Toggle between PM2.5, PM10, VOC/Benzene, NO2, Industrial Water BOD, and Illegal Soil dumps.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="p-3 w-fit rounded-xl bg-sky-500/10 text-sky-400 mb-4">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Diurnal Trend Analysis</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Inspect 24-hour diurnal cycling, thermal inversion patterns, and heavy vehicle transit windows.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="p-3 w-fit rounded-xl bg-amber-500/10 text-amber-400 mb-4">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Sensor Calibration</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sensor confidence scoring comparing low-cost wearable sensors with reference grade CPCB / EPA monitors.
                </p>
              </div>
            </div>
          )}

          {selectedRole === 'authority' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="p-3 w-fit rounded-xl bg-rose-500/10 text-rose-400 mb-4">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Automated Hotspot Clusters</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Instant alerts when 3+ sensors in a 500m radius detect PM2.5 above 250 µg/m³ for over 20 minutes.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="p-3 w-fit rounded-xl bg-purple-500/10 text-purple-400 mb-4">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Triage & Dispatch Workflow</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Assign inspection teams, track intervention statuses, and log regulatory penalties with geo-audit trails.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Resolution Verification</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Measure post-intervention sensor readings to confirm that the pollution source was truly extinguished.
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
