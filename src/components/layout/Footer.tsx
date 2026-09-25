import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="border-t border-slate-900 bg-slate-950/90 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/vayu-logo.jpg" 
                alt="VAYU Logo" 
                className="w-9 h-9 object-contain rounded-lg border border-sky-500/30"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent font-heading">
                VAYU
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Real-Time Pollution Intelligence Platform bridging personal wearable sensors, community IoT nodes, and municipal enforcement.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sensors Operating Continuously</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 font-heading">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('map')} className="hover:text-sky-400 transition-colors">
                  Geospatial Heatmap (Air/Water/Soil)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('report')} className="hover:text-sky-400 transition-colors">
                  Citizen Incident Reporting
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('authority')} className="hover:text-sky-400 transition-colors">
                  Municipal Authority Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('simulator')} className="hover:text-sky-400 transition-colors">
                  VAYU Wearable IoT Stream
                </button>
              </li>
            </ul>
          </div>

          {/* VAYU Wearable Spec */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 font-heading">
              Vayu Hardware Specs
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• Laser Scattering PM2.5 / PM10 Sensor</li>
              <li>• MOX VOC & Formaldehyde Detection</li>
              <li>• Sub-meter GPS & Diurnal Altimeter</li>
              <li>• BLE 5.2 Nordic Microcontroller</li>
              <li>• AES-256 Anonymous Spatial Tokenization</li>
            </ul>
          </div>

          {/* Project & Startup Context */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 font-heading">
              Startup & Academic Origin
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Designed as the software intelligence backbone for the <strong className="text-slate-300">VAYU Wearable</strong> ecosystem, submitted as an Advanced Software Engineering capstone project.
            </p>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} VAYU Technologies. Clean Air. Everywhere You Go.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Preserving Aggregation</span>
            <span>EPA / CPCB AQI Standard Compliant</span>
            <span>Civic Tech & IoT Integration</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
