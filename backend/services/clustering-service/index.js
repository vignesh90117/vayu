import express from 'express';
import cors from 'cors';
import { store } from '../../shared/store.js';

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({
    service: 'VAYU Hotspot & Geospatial Clustering Microservice',
    status: 'UP',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// List all identified clusters
app.get('/api/v1/hotspots', (req, res) => {
  res.json({
    success: true,
    count: store.hotspots.length,
    data: store.hotspots
  });
});

// Run spatial correlation algorithm between sensors and reports
app.post('/api/v1/hotspots/detect', (req, res) => {
  const highSensors = store.sensors.filter(s => s.aqi >= 220);
  const severeReports = store.reports.filter(r => r.severity === 'severe' || r.severity === 'hazardous');

  // Check if a new hotspot needs to be spawned
  let newlyFormedClusters = [];

  if (highSensors.length > 0 && severeReports.length > 0) {
    const existingTitles = new Set(store.hotspots.map(h => h.title));
    const targetReport = severeReports[0];

    const clusterTitle = `Dynamic Hotspot: ${targetReport.title.slice(0, 36)}...`;

    if (!existingTitles.has(clusterTitle)) {
      const newCluster = {
        id: `cluster-auto-${Date.now().toString().slice(-4)}`,
        title: clusterTitle,
        lat: targetReport.lat,
        lng: targetReport.lng,
        radiusMeters: 450,
        primaryPollutant: targetReport.category === 'air' ? 'PM2.5 & Toxins' : 'Chemical Effluent',
        avgAqi: 320,
        sensorCount: highSensors.length,
        reportCount: severeReports.length,
        riskLevel: targetReport.severity === 'hazardous' ? 'critical' : 'high',
        confidenceScore: 92,
        identifiedAt: 'Just now',
        recommendedAction: 'Dispatch municipal rapid response patrol for source abatement.',
        status: 'active'
      };

      store.hotspots.unshift(newCluster);
      newlyFormedClusters.push(newCluster);
    }
  }

  res.json({
    success: true,
    message: 'Geospatial clustering analysis executed',
    evaluatedSensors: store.sensors.length,
    evaluatedReports: store.reports.length,
    newClustersDetected: newlyFormedClusters.length,
    activeClusters: store.hotspots
  });
});

// Update hotspot cluster status
app.patch('/api/v1/hotspots/:id/status', (req, res) => {
  const { status } = req.body;
  const cluster = store.hotspots.find(h => h.id === req.params.id);

  if (!cluster) {
    return res.status(404).json({ success: false, message: `Hotspot '${req.params.id}' not found` });
  }

  if (!['active', 'mitigating', 'resolved'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status. Must be active, mitigating, or resolved' });
  }

  cluster.status = status;
  res.json({
    success: true,
    message: `Hotspot '${req.params.id}' status updated to ${status}`,
    data: cluster
  });
});

app.listen(PORT, () => {
  console.log(`[Clustering Service] Running on port ${PORT}`);
});
