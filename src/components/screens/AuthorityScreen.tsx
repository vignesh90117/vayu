import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ReportStatus, CitizenReport, HotspotCluster } from '../../types';
import { getSeverityBadge } from '../../data/mockData';
import { 
  Shield, 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Download, 
  ChevronRight, 
  Send, 
  FileText, 
  Radio, 
  Activity,
  Layers,
  MapPin,
  ExternalLink,
  Search,
  Check
} from 'lucide-react';

export const AuthorityScreen: React.FC = () => {
  const { 
    reports, 
    hotspots, 
    sensors, 
    updateReportStatus, 
    setActiveTab, 
    setSelectedReport, 
    setSelectedHotspot 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIncident, setSelectedIncident] = useState<CitizenReport | null>(reports[0] || null);
  const [interventionNotes, setInterventionNotes] = useState<string>('');
  const [dispatchAgency, setDispatchAgency] = useState<string>('Delhi Pollution Control Committee (DPCC) Rapid Patrol');
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string>('');

  // Metrics
  const totalReports = reports.length;
  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const activeHotspotCount = hotspots.filter(h => h.status === 'active').length;
  const resolvedCount = reports.filter(r => r.status === 'resolved' || r.status === 'action_taken').length;
  const sensorCount = sensors.length;

  // Filtered reports
  const filteredReports = reports.filter(r => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  const handleUpdateStatus = (newStatus: ReportStatus) => {
    if (!selectedIncident) return;
    updateReportStatus(selectedIncident.id, newStatus, interventionNotes || selectedIncident.actionNotes, dispatchAgency);
    
    // Update local selected state
    setSelectedIncident({
      ...selectedIncident,
      status: newStatus,
      actionNotes: interventionNotes || selectedIncident.actionNotes,
      assignedAgency: dispatchAgency
    });

    setSavedSuccessMsg(`Incident updated to: ${newStatus.toUpperCase()}`);
    setTimeout(() => setSavedSuccessMsg(''), 3000);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Category', 'Severity', 'Status', 'Address', 'Timestamp', 'Agency', 'Notes'];
    const rows = reports.map(r => [
      r.id,
      `"${r.title.replace(/"/g, '""')}"`,
      r.category,
      r.severity,
      r.status,
      `"${r.address.replace(/"/g, '""')}"`,
      r.timestamp,
      `"${(r.assignedAgency || '').replace(/"/g, '""')}"`,
      `"${(r.actionNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VAYU_Enforcement_Audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Console Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Municipal & Regional Authority Portal
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live GIS Dispatch Sync Active
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-heading">
            Environmental Authority Command Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Correlating citizen alerts with high-density VAYU wearable sensor telemetry for rapid enforcement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-semibold shadow-md transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Export Enforcement Audit (CSV)</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/25 transition-all"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>View Geospatial Mesh</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border border-rose-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Active AI Hotspots</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">{activeHotspotCount}</div>
          <span className="text-[11px] text-rose-400 font-medium">Requires immediate patrol</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-amber-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Pending Citizen Triage</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">{pendingCount}</div>
          <span className="text-[11px] text-amber-400 font-medium">Unassigned incidents</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-sky-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Active IoT Nodes</span>
            <Radio className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">{sensorCount}</div>
          <span className="text-[11px] text-sky-400 font-medium">Wearables + CAAQMS grid</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Resolved Interventions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2">{resolvedCount}</div>
          <span className="text-[11px] text-emerald-400 font-medium">Verified source cessation</span>
        </div>

      </div>

      {/* Algorithmic Hotspot Alert Clusters Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-rose-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-400 animate-pulse" />
            <h2 className="text-base font-bold text-white font-heading">
              Algorithmic Multi-Sensor Hotspot Clusters
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Synthesizing spatial proximity & simultaneous PM2.5/VOC spikes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hotspots.map(cluster => (
            <div 
              key={cluster.id}
              className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {cluster.riskLevel} Risk
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{cluster.identifiedAt}</span>
                </div>
                <h3 className="text-xs font-bold text-white leading-snug">{cluster.title}</h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{cluster.recommendedAction}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Avg AQI: <strong className="text-rose-400">{cluster.avgAqi}</strong>
                </span>
                <button
                  onClick={() => {
                    setSelectedHotspot(cluster);
                    setActiveTab('map');
                  }}
                  className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 text-[11px]"
                >
                  <span>Locate on Map</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Two-Column Workflow Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Filterable Reports Queue (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                Incident Triage Queue
              </h2>
              <p className="text-xs text-slate-400">Select an incident to dispatch action or change status.</p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 text-xs">
              {(['all', 'pending', 'investigating', 'action_taken', 'resolved'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2.5 py-1 rounded-lg capitalize text-[11px] font-semibold transition-all ${
                    statusFilter === status
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* List of Reports */}
          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {filteredReports.map(report => {
              const badge = getSeverityBadge(report.severity);
              const isSelected = selectedIncident?.id === report.id;

              return (
                <div
                  key={report.id}
                  onClick={() => setSelectedIncident(report)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-purple-500 ring-2 ring-purple-500/20'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.badgeClass}`}>
                        {badge.label}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {report.category}
                      </span>
                      {report.verifiedBySensors && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Sensor Confirmed
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">{report.timestamp}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">{report.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{report.description}</p>
                  
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[200px]">{report.address}</span>
                    </span>
                    <span className="capitalize font-semibold text-purple-400">
                      Status: {report.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Selected Incident Action & Enforcement Panel (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-5">
          {selectedIncident ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span className="text-xs uppercase font-bold tracking-wider text-white">
                    Action & Enforcement Console
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400">ID: {selectedIncident.id}</span>
              </div>

              {savedSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{savedSuccessMsg}</span>
                </div>
              )}

              {/* Photo preview if present */}
              {selectedIncident.imageUrl && (
                <div className="h-40 w-full rounded-2xl overflow-hidden border border-slate-800">
                  <img 
                    src={selectedIncident.imageUrl} 
                    alt={selectedIncident.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              )}

              <div>
                <h3 className="text-base font-bold text-white">{selectedIncident.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{selectedIncident.address}</p>
                <div className="mt-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {selectedIncident.description}
                </div>
              </div>

              {/* Status Stepper Progression */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Intervention Status Progression
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('pending')}
                    className={`p-2.5 rounded-xl text-xs font-bold text-center border transition-all ${
                      selectedIncident.status === 'pending'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    1. Pending Review
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('investigating')}
                    className={`p-2.5 rounded-xl text-xs font-bold text-center border transition-all ${
                      selectedIncident.status === 'investigating'
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    2. Investigating Patrol
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('action_taken')}
                    className={`p-2.5 rounded-xl text-xs font-bold text-center border transition-all ${
                      selectedIncident.status === 'action_taken'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    3. Action Enforced
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('resolved')}
                    className={`p-2.5 rounded-xl text-xs font-bold text-center border transition-all ${
                      selectedIncident.status === 'resolved'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    4. Verified Resolved
                  </button>
                </div>
              </div>

              {/* Agency Assignment & Enforcement Notes */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Assigned Municipal Unit</label>
                  <input
                    type="text"
                    value={dispatchAgency}
                    onChange={(e) => setDispatchAgency(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Enforcement / Audit Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Log fine issued, vehicle impounded, or water sprinkler deployment..."
                    value={interventionNotes || selectedIncident.actionNotes || ''}
                    onChange={(e) => setInterventionNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedIncident.status)}
                  className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Save Logged Intervention</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedReport(selectedIncident);
                    setActiveTab('map');
                  }}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold text-xs border border-slate-700 transition-colors"
                >
                  View on Map
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-slate-400 text-xs">
              Select an incident from the queue to view details and dispatch enforcement.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
