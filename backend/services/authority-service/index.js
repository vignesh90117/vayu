import express from 'express';
import cors from 'cors';
import { store } from '../../shared/store.js';

const app = express();
const PORT = process.env.PORT || 5004;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({
    service: 'VAYU Authority & Enforcement Microservice',
    status: 'UP',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Authority Dashboard & Triage Summary
app.get('/api/v1/authority/triage', (req, res) => {
  const pendingReports = store.reports.filter(r => r.status === 'pending');
  const criticalHotspots = store.hotspots.filter(h => h.riskLevel === 'critical');
  const resolvedCount = store.reports.filter(r => r.status === 'resolved' || r.status === 'action_taken').length;

  res.json({
    success: true,
    kpis: {
      activeHotspots: store.hotspots.filter(h => h.status === 'active').length,
      pendingCitizenReports: pendingReports.length,
      activeIoTSensors: store.sensors.length,
      resolvedInterventions: resolvedCount,
      meanAqi: Math.round(store.sensors.reduce((acc, s) => acc + s.aqi, 0) / (store.sensors.length || 1))
    },
    hotspotClusters: store.hotspots,
    pendingQueue: pendingReports,
    recentAuditLogs: store.auditLogs.slice(-5)
  });
});

// Update Incident Status & Log Intervention
app.patch('/api/v1/authority/reports/:id/status', (req, res) => {
  const { status, actionNotes, assignedAgency, officerName } = req.body;
  const report = store.reports.find(r => r.id === req.params.id);

  if (!report) {
    return res.status(404).json({ success: false, message: `Report '${req.params.id}' not found` });
  }

  if (!['pending', 'investigating', 'action_taken', 'resolved'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status value' });
  }

  report.status = status;
  if (actionNotes) report.actionNotes = actionNotes;
  if (assignedAgency) report.assignedAgency = assignedAgency;

  // Add entry to audit logs
  const logEntry = {
    id: `log-${Date.now().toString().slice(-4)}`,
    incidentId: report.id,
    agency: assignedAgency || report.assignedAgency || 'Municipal Rapid Patrol',
    action: `STATUS_CHANGED_TO_${status.toUpperCase()}`,
    timestamp: new Date().toISOString(),
    officer: officerName || 'Enforcement Supervisor',
    notes: actionNotes || 'Status progression updated via Authority Command Console'
  };
  store.auditLogs.unshift(logEntry);

  res.json({
    success: true,
    message: `Incident status updated to '${status}'`,
    data: report,
    auditLog: logEntry
  });
});

// Dispatch Rapid Enforcement Patrol Unit
app.post('/api/v1/authority/dispatch', (req, res) => {
  const { incidentId, agency, vehicleNumber, teamLead, priority } = req.body;

  if (!incidentId) {
    return res.status(400).json({ success: false, message: 'incidentId is required' });
  }

  const report = store.reports.find(r => r.id === incidentId);
  if (!report) {
    return res.status(404).json({ success: false, message: `Incident '${incidentId}' not found` });
  }

  report.status = 'investigating';
  report.assignedAgency = agency || 'DPCC Rapid Response Unit';
  report.actionNotes = `Dispatched vehicle ${vehicleNumber || 'DL-1C-9902'} under Officer ${teamLead || 'V. Sharma'}. Priority: ${priority || 'HIGH'}`;

  const logEntry = {
    id: `log-${Date.now().toString().slice(-4)}`,
    incidentId: report.id,
    agency: report.assignedAgency,
    action: 'UNIT_DISPATCHED',
    timestamp: new Date().toISOString(),
    officer: teamLead || 'Team Lead',
    notes: report.actionNotes
  };
  store.auditLogs.unshift(logEntry);

  res.json({
    success: true,
    message: 'Rapid enforcement unit successfully dispatched',
    data: report,
    dispatchDetails: {
      agency: report.assignedAgency,
      vehicle: vehicleNumber || 'DL-1C-9902',
      teamLead: teamLead || 'Inspector V. Sharma',
      dispatchedAt: logEntry.timestamp
    }
  });
});

// Export Enforcement Audit Logs (Supports JSON & CSV)
app.get('/api/v1/authority/audit/export', (req, res) => {
  const format = req.query.format || 'json';

  if (format === 'csv') {
    const headers = ['Log ID', 'Incident ID', 'Agency', 'Action', 'Officer', 'Timestamp', 'Notes'];
    const rows = store.auditLogs.map(l => [
      l.id,
      l.incidentId,
      `"${l.agency}"`,
      l.action,
      `"${l.officer}"`,
      l.timestamp,
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvData = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="VAYU_Audit_Export_${Date.now()}.csv"`);
    return res.send(csvData);
  }

  res.json({
    success: true,
    count: store.auditLogs.length,
    data: store.auditLogs
  });
});

app.listen(PORT, () => {
  console.log(`[Authority Service] Running on port ${PORT}`);
});
