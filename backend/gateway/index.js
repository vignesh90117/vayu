import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Microservice Target URLs
const SERVICES = {
  telemetry: process.env.TELEMETRY_SERVICE_URL || 'http://localhost:5001',
  clustering: process.env.CLUSTERING_SERVICE_URL || 'http://localhost:5002',
  reports: process.env.REPORTS_SERVICE_URL || 'http://localhost:5003',
  authority: process.env.AUTHORITY_SERVICE_URL || 'http://localhost:5004',
};

// Gateway Root / API Catalog
app.get('/', (req, res) => {
  res.json({
    platform: 'VAYU — Real-Time Pollution Intelligence Platform',
    component: 'API Gateway',
    version: '2.4.0',
    gatewayPort: PORT,
    routes: {
      telemetry: {
        prefix: '/api/v1/telemetry',
        targetService: SERVICES.telemetry,
        docs: ['GET /nodes', 'GET /nodes/:id', 'POST /ingest']
      },
      clustering: {
        prefix: '/api/v1/hotspots',
        targetService: SERVICES.clustering,
        docs: ['GET /', 'POST /detect', 'PATCH /:id/status']
      },
      reports: {
        prefix: '/api/v1/reports',
        targetService: SERVICES.reports,
        docs: ['GET /', 'GET /:id', 'POST /', 'POST /:id/upvote']
      },
      authority: {
        prefix: '/api/v1/authority',
        targetService: SERVICES.authority,
        docs: ['GET /triage', 'PATCH /reports/:id/status', 'POST /dispatch', 'GET /audit/export']
      }
    },
    documentation: 'See postman/VAYU_API_Collection.json'
  });
});

// Gateway Aggregated Health Check
app.get('/health', async (req, res) => {
  const checkService = async (url) => {
    try {
      const response = await fetch(`${url}/health`, { signal: AbortSignal.timeout(1500) });
      return response.ok ? 'ONLINE' : 'DEGRADED';
    } catch (err) {
      return 'OFFLINE / UNREACHABLE';
    }
  };

  const status = {
    gateway: 'ONLINE',
    telemetryService: await checkService(SERVICES.telemetry),
    clusteringService: await checkService(SERVICES.clustering),
    reportsService: await checkService(SERVICES.reports),
    authorityService: await checkService(SERVICES.authority),
    timestamp: new Date().toISOString()
  };

  res.json(status);
});

// Setup Proxies preserving the full path
app.use(
  createProxyMiddleware({
    target: SERVICES.telemetry,
    changeOrigin: true,
    pathFilter: '/api/v1/telemetry',
  })
);

app.use(
  createProxyMiddleware({
    target: SERVICES.clustering,
    changeOrigin: true,
    pathFilter: '/api/v1/hotspots',
  })
);

app.use(
  createProxyMiddleware({
    target: SERVICES.reports,
    changeOrigin: true,
    pathFilter: '/api/v1/reports',
  })
);

app.use(
  createProxyMiddleware({
    target: SERVICES.authority,
    changeOrigin: true,
    pathFilter: '/api/v1/authority',
  })
);

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  VAYU API Gateway Live on http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
