import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVICES = [
  { name: 'Telemetry Microservice', path: 'services/telemetry-service/index.js', port: 5001, color: '\x1b[36m' },
  { name: 'Clustering Microservice', path: 'services/clustering-service/index.js', port: 5002, color: '\x1b[35m' },
  { name: 'Reports Microservice',    path: 'services/reports-service/index.js',    port: 5003, color: '\x1b[32m' },
  { name: 'Authority Microservice',  path: 'services/authority-service/index.js',  port: 5004, color: '\x1b[33m' },
  { name: 'API Gateway',             path: 'gateway/index.js',                     port: 5000, color: '\x1b[34m' },
];

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

console.log(`${BOLD}\x1b[32m========================================================${RESET}`);
console.log(`${BOLD}  Starting VAYU Real-Time Pollution Microservices Mesh  ${RESET}`);
console.log(`${BOLD}\x1b[32m========================================================${RESET}`);

const processes = [];

SERVICES.forEach(service => {
  const fullPath = path.join(__dirname, service.path);
  const child = spawn(process.execPath, [fullPath], {
    env: { ...process.env, PORT: service.port },
    stdio: ['inherit', 'pipe', 'pipe']
  });

  child.stdout.on('data', data => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      console.log(`${service.color}[${service.name}]${RESET} ${line}`);
    });
  });

  child.stderr.on('data', data => {
    console.error(`${service.color}[${service.name} ERR]${RESET} ${data.toString().trim()}`);
  });

  child.on('close', code => {
    console.log(`${service.color}[${service.name}]${RESET} Exited with code ${code}`);
  });

  processes.push(child);
});

// Handle termination signals
const cleanup = () => {
  console.log(`\n${BOLD}Shutting down all VAYU microservices...${RESET}`);
  processes.forEach(p => p.kill('SIGTERM'));
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
