import React from 'react';
import { useApp } from '../../context/AppContext';
import { Map, AlertTriangle, Shield, Cpu, Home, Activity, Radio } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, reports, hotspots, isSimulating } = useApp();

  const pendingReportsCount = reports.filter(r => r.status === 'pending').length;
  const criticalHotspotsCount = hotspots.filter(h => h.riskLevel === 'critical').length;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Platform Name */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="relative overflow-hidden rounded-xl border border-sky-500/30 p-1 bg-white/5 shadow-md shadow-sky-500/10 transition-transform group-hover:scale-105">
              <img 
                src="/vayu-logo.jpg" 
                alt="VAYU Logo" 
                className="w-10 h-10 object-contain rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent font-heading">
                  VAYU
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-sky-500/15 text-sky-400 border border-sky-500/30 rounded-full">
                  Platform v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-tight">
                Real-Time Pollution Intelligence
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'home'
                  ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all relative ${
                activeTab === 'map'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Live Heatmap</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'report'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-emerald-400" />
              <span>Report Incident</span>
            </button>

            <button
              onClick={() => setActiveTab('authority')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all relative ${
                activeTab === 'authority'
                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Authority Console</span>
              {pendingReportsCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-slate-950 rounded-full">
                  {pendingReportsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'simulator'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>IoT Simulator</span>
              {isSimulating && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </button>
          </nav>

          {/* Quick Status Pill / Mobile Menu button */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <div className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="text-slate-300 font-medium">Urban Node: NCR Grid</span>
              </div>
              <div className="h-3 w-px bg-slate-800" />
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Mean AQI:</span>
                <span className="font-bold text-orange-400">238</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab(activeTab === 'map' ? 'report' : 'map')}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white shadow-md shadow-sky-500/20 hover:opacity-95 transition-transform active:scale-95"
            >
              {activeTab === 'map' ? '+ Pin Report' : 'Open Heatmap'}
            </button>
          </div>

        </div>

        {/* Mobile Submenu */}
        <div className="md:hidden flex items-center justify-between pb-3 pt-1 border-t border-slate-900 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'home' ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'map' ? 'bg-sky-500 text-white' : 'text-slate-400'
            }`}
          >
            Heatmap
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'report' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'
            }`}
          >
            Report Incident
          </button>
          <button
            onClick={() => setActiveTab('authority')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'authority' ? 'bg-purple-500/20 text-purple-400' : 'text-slate-400'
            }`}
          >
            Authority Console
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap ${
              activeTab === 'simulator' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'
            }`}
          >
            IoT Hardware
          </button>
        </div>

      </div>
    </header>
  );
};
