import express from 'express';
import cors from 'cors';
import { store } from '../../shared/store.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Service Health Check
app.get('/health', (req, res) => {
  res.json({
    service: 'VAYU Telemetry & Ingestion Microservice',
    status: 'UP',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// List all active sensor nodes
app.get('/api/v1/telemetry/nodes', (req, res) => {
  res.json({
    success: true,
    count: store.sensors.length,
    data: store.sensors
  });
});

// Get detailed metrics for a specific sensor node
app.get('/api/v1/telemetry/nodes/:id', (req, res) => {
  const sensor = store.sensors.find(s => s.id === req.params.id);
  if (!sensor) {
    return res.status(404).json({ success: false, message: `Sensor node '${req.params.id}' not found` });
  }
  res.json({ success: true, data: sensor });
});

// Ingest real-time packet from VAYU wearable / IoT node
app.post('/api/v1/telemetry/ingest', (req, res) => {
  const { device_id, name, pm25, voc, lat, lng, temp, humidity, confidence, battery } = req.body;

  if (!device_id || pm25 === undefined || lat === undefined || lng === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Missing required telemetry fields: device_id, pm25, lat, lng'
    });
  }

  const calculatedAqi = Math.round(pm25 * 1.35);
  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let existing = store.sensors.find(s => s.id === device_id);

  if (existing) {
    existing.pm25 = Number(pm25);
    existing.aqi = calculatedAqi;
    if (voc !== undefined) existing.voc = Number(voc);
    existing.lat = Number(lat);
    existing.lng = Number(lng);
    if (temp !== undefined) existing.temp = Number(temp);
    if (humidity !== undefined) existing.humidity = Number(humidity);
    if (confidence !== undefined) existing.confidence = Number(confidence);
    if (battery !== undefined) existing.battery = Number(battery);
    existing.lastUpdated = 'Just now';

    // Append to trend
    existing.hourlyTrend = [
      ...existing.hourlyTrend.slice(-5),
      { time: nowTime, aqi: calculatedAqi, pm25: Number(pm25), voc: Number(voc || 250) }
    ];
  } else {
    existing = {
      id: device_id,
      name: name || `VAYU Node ${device_id}`,
      sourceType: 'vayu_wearable',
      lat: Number(lat),
      lng: Number(lng),
      locationName: 'Active Mobile Wearer',
      aqi: calculatedAqi,
      pm25: Number(pm25),
      pm10: Math.round(Number(pm25) * 1.4),
      voc: Number(voc || 300),
      no2: 45,
      co: 1.5,
      temp: Number(temp || 28),
      humidity: Number(humidity || 55),
      confidence: Number(confidence || 95),
      battery: Number(battery || 90),
      lastUpdated: 'Just now',
      hourlyTrend: [
        { time: nowTime, aqi: calculatedAqi, pm25: Number(pm25), voc: Number(voc || 300) }
      ]
    };
    store.sensors.push(existing);
  }

  res.status(201).json({
    success: true,
    message: 'Telemetry packet successfully ingested',
    data: existing
  });
});

app.listen(PORT, () => {
  console.log(`[Telemetry Service] Running on port ${PORT}`);
});
