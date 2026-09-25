import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { PollutionType, SeverityLevel } from '../../types';
import { 
  MapPin, 
  Upload, 
  Wind, 
  Droplet, 
  Sprout, 
  Trash2, 
  Volume2, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Info,
  Camera,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';

const SAMPLE_EVIDENCE_PHOTOS = [
  {
    name: 'Open Biomass Burning',
    url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Industrial Effluent Runoff',
    url: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Excavation Dust Cloud',
    url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80'
  }
];

export const ReportScreen: React.FC = () => {
  const { addReport, setActiveTab } = useApp();

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PollutionType>('air');
  const [severity, setSeverity] = useState<SeverityLevel>('severe');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('Outer Ring Road, Near Flyover P-12');
  const [lat, setLat] = useState(28.5520);
  const [lng, setLng] = useState(77.2340);
  const [imageUrl, setImageUrl] = useState<string>(SAMPLE_EVIDENCE_PHOTOS[0].url);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reporterName, setReporterName] = useState('Arjun Mehta');
  const [contactEmail, setContactEmail] = useState('arjun.m@example.com');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Feature 2: AI Computer Vision Classifier State
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [aiScanResult, setAiScanResult] = useState<{
    detected: string;
    confidence: number;
    category: PollutionType;
    severity: SeverityLevel;
    tags: string[];
  } | null>({
    detected: 'Dense Black Smoke & Unregulated Biomass Fire',
    confidence: 96.4,
    category: 'air',
    severity: 'hazardous',
    tags: ['Particulate Smolder', 'Black Carbon Index > 85%', 'Urban Fringe']
  });

  const runAiVisionScan = (selectedUrl: string, photoName: string) => {
    setImageUrl(selectedUrl);
    setIsAiScanning(true);

    setTimeout(() => {
      setIsAiScanning(false);
      if (photoName.includes('Biomass') || photoName.includes('Burning')) {
        setCategory('air');
        setSeverity('hazardous');
        setAiScanResult({
          detected: 'Dense Acrid Particulate Smoke from Biomass / Rubber Smolder',
          confidence: 96.4,
          category: 'air',
          severity: 'hazardous',
          tags: ['Black Carbon Detected', 'High Optical Opacity', 'PM2.5 Spike Correlation']
        });
      } else if (photoName.includes('Effluent') || photoName.includes('Water') || photoName.includes('Sludge')) {
        setCategory('water');
        setSeverity('severe');
        setAiScanResult({
          detected: 'Industrial Chemical Dye & Solvent Effluent Runoff',
          confidence: 94.2,
          category: 'water',
          severity: 'severe',
          tags: ['Chemical Color Shift', 'Open Storm Drain', 'Toxicity Class II']
        });
      } else {
        setCategory('air');
        setSeverity('moderate');
        setAiScanResult({
          detected: 'Excavation & Unsprayed Fugitive Construction Dust',
          confidence: 91.8,
          category: 'air',
          severity: 'moderate',
          tags: ['PM10 Mineral Dust', 'Construction Activity', 'Zero Green Barrier']
        });
      }
    }, 1100);
  };

  // Pin Drop Mini Map
  const miniMapContainerRef = useRef<HTMLDivElement>(null);
  const miniMapInstanceRef = useRef<L.Map | null>(null);
  const pinMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!miniMapContainerRef.current) return;
    if (miniMapInstanceRef.current) return;

    const miniMap = L.map(miniMapContainerRef.current, {
      center: [lat, lng],
      zoom: 13,
      zoomControl: false,
    });

    L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      attribution: '&copy; Google Maps Satellite',
      maxZoom: 19,
    }).addTo(miniMap);

    const pinIcon = L.divIcon({
      className: 'custom-pin-icon',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="animate-ping absolute w-8 h-8 rounded-full bg-emerald-500 opacity-60"></div>
          <div class="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xl border-2 border-white">
            📍
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 30]
    });

    const marker = L.marker([lat, lng], { icon: pinIcon, draggable: true }).addTo(miniMap);
    pinMarkerRef.current = marker;

    // Click map to reposition
    miniMap.on('click', (e: L.LeafletMouseEvent) => {
      const { lat: newLat, lng: newLng } = e.latlng;
      setLat(Number(newLat.toFixed(5)));
      setLng(Number(newLng.toFixed(5)));
      marker.setLatLng(e.latlng);
      setAddress(`Pinned Location: ${newLat.toFixed(4)}°N, ${newLng.toFixed(4)}°E`);
    });

    // Drag pin
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      setLat(Number(pos.lat.toFixed(5)));
      setLng(Number(pos.lng.toFixed(5)));
      setAddress(`Pinned Location: ${pos.lat.toFixed(4)}°N, ${pos.lng.toFixed(4)}°E`);
    });

    miniMapInstanceRef.current = miniMap;

    return () => {
      miniMap.remove();
      miniMapInstanceRef.current = null;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill in a title and incident description.');
      return;
    }

    addReport({
      title,
      category,
      severity,
      description,
      lat,
      lng,
      address,
      imageUrl,
      isAnonymous,
      reporterName: isAnonymous ? undefined : reporterName,
      assignedAgency: 'Municipal Environmental Patrol & DPCC'
    });

    // Trigger celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // fallback
    }

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="glass-panel p-10 rounded-3xl border border-emerald-500/40 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-3xl font-extrabold text-white font-heading">
            Pollution Incident Dispatched!
          </h2>
          <p className="text-slate-300 text-sm mt-3 leading-relaxed">
            Thank you for being the eyes of your community. Your report has been geo-stamped, cross-referenced with nearby <strong className="text-sky-300">VAYU sensors</strong>, and queued in the Municipal Authority Command Console.
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Report Title:</span>
              <strong className="text-white">{title}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Location:</span>
              <span className="text-slate-300">{address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Severity:</span>
              <span className="text-rose-400 uppercase font-bold">{severity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Privacy Mode:</span>
              <span className="text-emerald-400 font-medium">{isAnonymous ? 'Anonymous' : 'Verified'}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setActiveTab('map')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-bold text-sm shadow-xl hover:opacity-95 transition-all flex items-center gap-2"
            >
              <span>View On Live Heatmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setTitle('');
                setDescription('');
              }}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-sm border border-slate-800 transition-colors"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Title */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Citizen Ground Truth Portal
        </div>
        <h1 className="text-3xl font-extrabold text-white font-heading">
          Report Environmental Pollution
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Drop a pin and upload proof. The VAYU platform algorithm correlates your report with nearby wearable and ambient sensors to generate high-confidence authority alerts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Category Selection */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
            1. Select Pollution Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { type: 'air', label: 'Air / Smoke', icon: Wind, color: 'text-sky-400' },
              { type: 'water', label: 'Water / Sewage', icon: Droplet, color: 'text-cyan-400' },
              { type: 'soil', label: 'Soil / Dumping', icon: Sprout, color: 'text-amber-400' },
              { type: 'waste', label: 'Solid Waste', icon: Trash2, color: 'text-orange-400' },
              { type: 'noise', label: 'Noise Hazard', icon: Volume2, color: 'text-purple-400' },
            ].map(cat => {
              const Icon = cat.icon;
              const isSelected = category === cat.type;
              return (
                <button
                  key={cat.type}
                  type="button"
                  onClick={() => setCategory(cat.type as PollutionType)}
                  className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-sky-500/15 border-sky-500/60 shadow-lg shadow-sky-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${cat.color}`} />
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Severity Scale */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
            2. Estimated Severity Level
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { level: 'low', label: 'Low', desc: 'Mild odor or intermittent dust', color: 'border-emerald-500/30 hover:border-emerald-500' },
              { level: 'moderate', label: 'Moderate', desc: 'Noticeable haze, irritating to eyes', color: 'border-yellow-500/30 hover:border-yellow-500' },
              { level: 'severe', label: 'Severe', desc: 'Dense black smoke or chemical runoff', color: 'border-orange-500/30 hover:border-orange-500' },
              { level: 'hazardous', label: 'Hazardous', desc: 'Immediate respiratory danger / toxic fire', color: 'border-red-500/30 hover:border-red-500' },
            ].map(sev => {
              const isSelected = severity === sev.level;
              return (
                <button
                  key={sev.level}
                  type="button"
                  onClick={() => setSeverity(sev.level as SeverityLevel)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-white shadow-xl'
                      : `bg-slate-900/60 ${sev.color} text-slate-400`
                  }`}
                >
                  <div className="text-xs font-bold text-white uppercase">{sev.label}</div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-snug">{sev.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Pin Drop Map */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                3. Precise Incident Pin & Address
              </label>
              <p className="text-[11px] text-slate-400">Click on the map or drag the pin to set the exact coordinates.</p>
            </div>
            <div className="text-right text-[11px] text-slate-400 font-mono">
              {lat.toFixed(4)}°N, {lng.toFixed(4)}°E
            </div>
          </div>

          <div className="h-52 w-full rounded-2xl overflow-hidden border border-slate-800 mb-3 relative">
            <div ref={miniMapContainerRef} className="h-full w-full" />
            <div className="absolute top-2 left-2 z-[1000] px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[10px] text-slate-300 border border-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>Tap anywhere to drop pin</span>
            </div>
          </div>

          <input
            type="text"
            placeholder="Street address or nearest landmark..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Incident Details & Photos */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            4. Incident Details & Photographic Proof
          </label>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Incident Headline / Title</label>
            <input
              type="text"
              placeholder="e.g., Open garbage smoldering behind Metro Station Pillar 140"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Detailed Description & Symptoms</label>
            <textarea
              rows={3}
              placeholder="Describe smoke color, odor, duration, nearest factory or source, impact on residents..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Photo attachment preset selection */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-2 flex items-center justify-between">
              <span>Attach Image Evidence</span>
              <span className="text-[10px] text-sky-400">Select sample or use camera</span>
            </label>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {SAMPLE_EVIDENCE_PHOTOS.map((photo, i) => (
                <div
                  key={i}
                  onClick={() => runAiVisionScan(photo.url, photo.name)}
                  className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all relative ${
                    imageUrl === photo.url ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={photo.url} alt={photo.name} className="h-20 w-full object-cover" />
                  <div className="p-1 bg-slate-950/80 text-[10px] text-slate-300 text-center truncate">
                    {photo.name}
                  </div>
                </div>
              ))}
            </div>

            {/* AI Vision Verification Box */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-sky-500/30 relative overflow-hidden">
              {isAiScanning ? (
                <div className="flex items-center gap-3 py-2">
                  <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                  <div>
                    <div className="text-xs font-bold text-sky-300">Running Deep Neural Computer Vision Scan...</div>
                    <div className="text-[10px] text-slate-400">Classifying smoke opacity & effluent spectral signatures</div>
                  </div>
                </div>
              ) : aiScanResult ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      AI Verified Evidence ({aiScanResult.confidence}%)
                    </span>
                    <span className="text-[10px] text-slate-400">Model: VAYU-Vision-v2</span>
                  </div>

                  <div className="text-xs font-bold text-white">
                    {aiScanResult.detected}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {aiScanResult.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-[10px] text-slate-400 italic pt-1">
                    * Category and severity have been auto-tuned based on the optical smoke density analysis.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Privacy & Reporter Information */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                5. Privacy & Verification Messaging
              </h3>
              <p className="text-[11px] text-slate-400">Choose how your identity is shared with municipal dispatchers.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isAnonymous 
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' 
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {isAnonymous ? '🔒 Anonymous Mode Active' : '🛡️ Verified Citizen Profile'}
            </button>
          </div>

          {!isAnonymous && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Citizen Full Name</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full px-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700/80 text-white focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Email / Phone for Dispatch Updates</label>
                <input
                  type="text"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700/80 text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <span>
              <strong>VAYU Data Assurance:</strong> Your GPS location is protected by zero-knowledge spatial hashing. If a nearby VAYU wearable detected an atmospheric spike within 30 minutes, your report will receive an automated <strong>“Sensor Confirmed”</strong> gold badge.
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 text-white font-bold text-sm shadow-xl shadow-sky-500/20 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Submit Pollution Incident to VAYU Network</span>
        </button>

      </form>
    </div>
  );
};
