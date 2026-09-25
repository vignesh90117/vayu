import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getAqiCategory } from '../../data/mockData';
import { 
  Cpu, 
  Battery, 
  MapPin, 
  Radio, 
  Zap, 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  Terminal, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Flame,
  Wind,
  Bluetooth,
  HeartPulse,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const SimulatorScreen: React.FC = () => {
  const { 
    simulatedWearable, 
    updateSimulatedWearable, 
    isSimulating, 
    setIsSimulating,
    setActiveTab 
  } = useApp();

  const [activePreset, setActivePreset] = useState<string>('commute');
  const [bleStatus, setBleStatus] = useState<string>('Ready for Pairing (GATT 0x181A Environmental Service)');
  const [isBleConnected, setIsBleConnected] = useState<boolean>(false);

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] BLE 5.2 link established with VAYU-HW-NODE-01`,
    `[${new Date().toLocaleTimeString()}] Handshake ACK received. AES-256 telemetry active.`,
    `[${new Date().toLocaleTimeString()}] Optical laser particulate fan calibrated: 0.3um - 10um`,
  ]);

  const aqiInfo = getAqiCategory(simulatedWearable.aqi);

  // Inhalation calculation based on 12 L/min minute ventilation = 0.72 m3/hour
  const hourlyInhalationUg = Math.round(simulatedWearable.pm25 * 0.72 * 10) / 10;
  const whoThresholdPct = Math.min(250, Math.round((simulatedWearable.pm25 / 15) * 100));

  const addLog = (msg: string) => {
    setTerminalLogs(prev => [
      `[${new Date().toLocaleTimeString()}] ${msg}`,
      ...prev.slice(0, 7)
    ]);
  };

  const handlePairBLE = async () => {
    if (typeof navigator !== 'undefined' && (navigator as any).bluetooth) {
      try {
        const device = await (navigator as any).bluetooth.requestDevice({
          filters: [{ namePrefix: 'VAYU' }, { namePrefix: 'ESP32' }],
          optionalServices: ['battery_service', 'environmental_sensing']
        });
        setIsBleConnected(true);
        setBleStatus(`Connected to ${device.name || 'VAYU BLE Hardware'}`);
        addLog(`Physical BLE Device Paired: ${device.name || device.id}`);
      } catch (err: any) {
        setIsBleConnected(true);
        setBleStatus('VAYU-ESP32-NODE-01 Paired via BLE 5.2 Emulation');
        addLog('BLE Handshake Confirmed: Service 0x181A (Environmental Sensing)');
      }
    } else {
      setIsBleConnected(true);
      setBleStatus('VAYU-HW-NODE-01 Paired via Web-BLE Emulation');
      addLog('BLE Handshake Confirmed: Service 0x181A (Environmental Sensing)');
    }
  };

  const handleApplyPreset = (
    presetKey: string,
    pm25: number,
    voc: number,
    temp: number,
    humidity: number,
    label: string
  ) => {
    setActivePreset(presetKey);
    const newAqi = Math.round(pm25 * 1.35);
    updateSimulatedWearable({
      pm25,
      aqi: newAqi,
      voc,
      temp,
      humidity,
      lastUpdated: 'Live right now'
    });
    addLog(`Environment Preset Loaded: "${label}" -> PM2.5: ${pm25} µg/m³, VOC: ${voc} ppb`);
  };

  const handleSimulateStep = () => {
    const latDelta = (Math.random() - 0.45) * 0.002;
    const lngDelta = (Math.random() - 0.45) * 0.002;
    const newLat = simulatedWearable.lat + latDelta;
    const newLng = simulatedWearable.lng + lngDelta;

    updateSimulatedWearable({
      lat: Number(newLat.toFixed(5)),
      lng: Number(newLng.toFixed(5)),
      lastUpdated: 'Live right now'
    });

    addLog(`GPS Waypoint Ingested: (${newLat.toFixed(4)}, ${newLng.toFixed(4)})`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Hardware Telemetry Testbed
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              BLE / MQTT Stream Active
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-heading">
            VAYU Wearable IoT Stream Simulator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulate live wearable sensor telemetry feeding the platform without requiring physical hardware connected.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Feature 5: Web Bluetooth API Pairing */}
          <button
            onClick={handlePairBLE}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              isBleConnected
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/20'
                : 'bg-sky-500/20 text-sky-300 border-sky-500/40 hover:bg-sky-500/30'
            }`}
          >
            <Bluetooth className={`w-3.5 h-3.5 ${isBleConnected ? 'text-emerald-400' : 'text-sky-400'}`} />
            <span>{isBleConnected ? 'BLE Connected' : 'Pair Physical Wearable (Web-BLE)'}</span>
          </button>

          <button
            onClick={() => {
              setIsSimulating(!isSimulating);
              addLog(isSimulating ? 'Autonomous telemetry drift paused.' : 'Autonomous telemetry drift resumed.');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              isSimulating
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isSimulating ? 'Pause Auto-Tick' : 'Resume Auto-Tick'}</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-xs font-bold shadow-lg shadow-sky-500/25 transition-all"
          >
            <span>Inspect on Live Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Two-Column Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Real-time Device Monitor & Presets (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Virtual Device Chassis Card */}
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-sky-500/30 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">VAYU-WEARABLE-SIM-01</h3>
                  <p className="text-[11px] text-slate-400">Firmware v2.1-BLE | Dual Particle + MOX</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <Battery className="w-4 h-4 text-emerald-400" />
                  {simulatedWearable.battery || 88}%
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-mono text-[10px]">
                  9600 Baud
                </span>
              </div>
            </div>

            {/* Live Readout Big Box */}
            <div className="my-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className={`p-4 rounded-2xl border ${aqiInfo.bgColor} ${aqiInfo.borderColor}`}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Calculated AQI
                </span>
                <div className="text-3xl font-black text-white mt-1">
                  {simulatedWearable.aqi}
                </div>
                <span className={`text-xs font-bold ${aqiInfo.textColor}`}>
                  {aqiInfo.label}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  PM2.5 Mass Conc.
                </span>
                <div className="text-3xl font-black text-sky-400 mt-1">
                  {simulatedWearable.pm25} <span className="text-xs font-normal text-slate-400">µg/m³</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  PM10: {simulatedWearable.pm10} µg/m³
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Total VOC Index
                </span>
                <div className="text-3xl font-black text-cyan-400 mt-1">
                  {simulatedWearable.voc} <span className="text-xs font-normal text-slate-400">ppb</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  Confidence: {simulatedWearable.confidence}%
                </span>
              </div>

            </div>

            {/* GPS & Environmental Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Temperature</span>
                <strong className="text-white text-sm">{simulatedWearable.temp}°C</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Rel. Humidity</span>
                <strong className="text-white text-sm">{simulatedWearable.humidity}%</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Latitude</span>
                <strong className="text-sky-300 font-mono text-xs">{simulatedWearable.lat.toFixed(4)}°N</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Longitude</span>
                <strong className="text-sky-300 font-mono text-xs">{simulatedWearable.lng.toFixed(4)}°E</strong>
              </div>
            </div>

            {/* GPS Walk Button */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Simulate pedestrian motion along Lodhi Corridor
              </span>
              <button
                type="button"
                onClick={handleSimulateStep}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Step Forward (Walk Route)</span>
              </button>
            </div>

          </div>

          {/* Feature 5: Personal Inhalation "Lung Load" Meter Card */}
          <div className="glass-panel p-6 rounded-3xl border border-rose-500/30 relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  <HeartPulse className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    Personal Cumulative Inhalation Exposure ("Lung Load")
                  </h4>
                  <p className="text-[11px] text-slate-400">Minute ventilation V_E = 12 L/min | Inhalation rate: 0.72 m³/h</p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                whoThresholdPct > 100
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {whoThresholdPct > 100 ? '⚠️ High Inhalation' : '✅ Within Normal Limit'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">1-Hour PM2.5 Inhaled</span>
                <strong className="text-xl font-bold text-white">{hourlyInhalationUg} µg</strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Inhaled VOC Volume</span>
                <strong className="text-xl font-bold text-cyan-300">{Math.round(simulatedWearable.voc * 0.45)} ppb-h</strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">WHO 24h Threshold</span>
                <strong className={whoThresholdPct > 100 ? 'text-xl font-bold text-rose-400' : 'text-xl font-bold text-emerald-400'}>
                  {whoThresholdPct}%
                </strong>
              </div>
            </div>

            {/* Inhalation Progress Bar */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Daily Particulate Inhalation Safety Buffer</span>
                <span className="font-bold text-white">{whoThresholdPct}% Capacity</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    whoThresholdPct > 100 ? 'bg-gradient-to-r from-orange-500 to-rose-600' : 'bg-gradient-to-r from-sky-400 to-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, whoThresholdPct)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-2">
                {whoThresholdPct > 100
                  ? '⚡ Health Warning: Particulate exposure exceeds WHO 24-hour safe limits. Wear an N95 respirator during outdoor transit.'
                  : '🌿 Clean Breathing: Safe for outdoor walking, cycling, and natural ventilation.'}
              </p>
            </div>
          </div>

          {/* Quick Environment Preset Buttons */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Quick Test Scenarios
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'park', label: 'Clean Park Walk', pm25: 18, voc: 90, temp: 24.2, hum: 62, icon: Wind, color: 'text-emerald-400' },
                { id: 'commute', label: 'Metro Commute', pm25: 76, voc: 290, temp: 28.8, hum: 59, icon: Activity, color: 'text-sky-400' },
                { id: 'traffic', label: 'Ring Road Jam', pm25: 215, voc: 780, temp: 31.4, hum: 51, icon: Radio, color: 'text-orange-400' },
                { id: 'fire', label: 'Biomass Burning', pm25: 380, voc: 1350, temp: 32.8, hum: 44, icon: Flame, color: 'text-rose-400' },
              ].map(preset => {
                const Icon = preset.icon;
                const isSelected = activePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset.id, preset.pm25, preset.voc, preset.temp, preset.hum, preset.label)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-sky-400 shadow-md'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-2 ${preset.color}`} />
                    <div className="text-xs font-bold text-white leading-snug">{preset.label}</div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      PM {preset.pm25} | VOC {preset.voc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Dynamic Sliders & MQTT Packet Log (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Sliders Box */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Sliders className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Live Sensor Telemetry Sliders
              </h3>
            </div>

            {/* PM2.5 Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Fine Particulate (PM2.5):</span>
                <span className="font-bold text-sky-400">{simulatedWearable.pm25} µg/m³</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="500" 
                value={simulatedWearable.pm25}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  updateSimulatedWearable({ pm25: val, aqi: Math.round(val * 1.35) });
                }}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0 (Pristine)</span>
                <span>250 (Severe)</span>
                <span>500 (Hazardous)</span>
              </div>
            </div>

            {/* VOC Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Volatile Organics (VOC):</span>
                <span className="font-bold text-cyan-400">{simulatedWearable.voc} ppb</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="1500" 
                value={simulatedWearable.voc}
                onChange={(e) => updateSimulatedWearable({ voc: Number(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>50 ppb (Clean)</span>
                <span>500 ppb (Pungent)</span>
                <span>1500 ppb (Toxic Solvents)</span>
              </div>
            </div>

            {/* Sensor Confidence Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Sensor Calibration Confidence:</span>
                <span className="font-bold text-emerald-400">{simulatedWearable.confidence}%</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="100" 
                value={simulatedWearable.confidence}
                onChange={(e) => updateSimulatedWearable({ confidence: Number(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>
          </div>

          {/* Real-Time MQTT / BLE Terminal Stream */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3 font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Raw MQTT Ingestion Stream
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">200 OK</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 text-[11px] text-slate-300 space-y-1.5 max-h-48 overflow-y-auto">
              <div className="text-emerald-400/90">
                {`> TOPIC: vayu/sensors/stream/${simulatedWearable.id}`}
              </div>
              <pre className="text-slate-400 text-[10px] overflow-x-auto p-1 bg-slate-900/50 rounded-lg">
{JSON.stringify({
  device_id: simulatedWearable.id,
  pm25: simulatedWearable.pm25,
  voc_ppb: simulatedWearable.voc,
  aqi_est: simulatedWearable.aqi,
  coords: [simulatedWearable.lat, simulatedWearable.lng],
  temp_c: simulatedWearable.temp,
  confidence: simulatedWearable.confidence,
  timestamp: Date.now()
}, null, 2)}
              </pre>
              {terminalLogs.map((log, index) => (
                <div key={index} className="text-slate-400 text-[10px] truncate">
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
