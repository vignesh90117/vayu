import express from 'express';
import cors from 'cors';
import { store } from '../../shared/store.js';

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({
    service: 'VAYU Citizen Incident Report Microservice',
    status: 'UP',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// List all citizen reports (supports query params: ?category=air&status=pending)
app.get('/api/v1/reports', (req, res) => {
  let list = [...store.reports];

  if (req.query.category) {
    list = list.filter(r => r.category === req.query.category);
  }
  if (req.query.status) {
    list = list.filter(r => r.status === req.query.status);
  }
  if (req.query.severity) {
    list = list.filter(r => r.severity === req.query.severity);
  }

  res.json({
    success: true,
    count: list.length,
    data: list
  });
});

// Get single report
app.get('/api/v1/reports/:id', (req, res) => {
  const report = store.reports.find(r => r.id === req.params.id);
  if (!report) {
    return res.status(404).json({ success: false, message: `Report '${req.params.id}' not found` });
  }
  res.json({ success: true, data: report });
});

// Submit a new citizen pollution report
app.post('/api/v1/reports', (req, res) => {
  const { title, category, severity, description, lat, lng, address, imageUrl, isAnonymous, reporterName } = req.body;

  if (!title || !description || lat === undefined || lng === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Missing required report fields: title, description, lat, lng'
    });
  }

  // Cross check if nearby wearable sensor detected high AQI within ~1km
  const nearbyHighSensor = store.sensors.find(s => {
    const distLat = Math.abs(s.lat - lat);
    const distLng = Math.abs(s.lng - lng);
    return (distLat < 0.015 && distLng < 0.015 && s.aqi > 200);
  });

  const newReport = {
    id: `rep-${Date.now().toString().slice(-4)}`,
    title,
    category: category || 'air',
    severity: severity || 'moderate',
    description,
    lat: Number(lat),
    lng: Number(lng),
    address: address || `Pinned (${Number(lat).toFixed(4)}°N, ${Number(lng).toFixed(4)}°E)`,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=600&q=80',
    timestamp: 'Just now',
    isAnonymous: Boolean(isAnonymous),
    reporterName: isAnonymous ? undefined : (reporterName || 'Anonymous Citizen'),
    status: 'pending',
    upvotes: 1,
    verifiedBySensors: Boolean(nearbyHighSensor),
    assignedAgency: 'Municipal Environmental Wing'
  };

  store.reports.unshift(newReport);

  res.status(201).json({
    success: true,
    message: 'Citizen report successfully submitted and queued',
    data: newReport
  });
});

// Upvote an incident
app.post('/api/v1/reports/:id/upvote', (req, res) => {
  const report = store.reports.find(r => r.id === req.params.id);
  if (!report) {
    return res.status(404).json({ success: false, message: `Report '${req.params.id}' not found` });
  }

  report.upvotes += 1;
  res.json({
    success: true,
    message: 'Report upvoted',
    upvotes: report.upvotes
  });
});

app.listen(PORT, () => {
  console.log(`[Reports Service] Running on port ${PORT}`);
});
