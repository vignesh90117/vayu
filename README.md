# VAYU — Real-Time Pollution Intelligence Platform

> **Clean Air. Everywhere You Go.**  
> An end-to-end geospatial environmental intelligence platform combining continuous telemetry from **VAYU Wearable Sensors**, fixed CAAQMS stations, and crowdsourced citizen incident reports with municipal enforcement workflows.

[![Figma Design](https://img.shields.io/badge/Figma-UX%20Blueprint-blue?logo=figma)](https://www.figma.com/design/mN7RHx7dpyHamoa1KzPGXD?utm_source=chatgpt.com)
[![Postman Collection](https://img.shields.io/badge/Postman-Collection%20v2.1-orange?logo=postman)](postman/VAYU_API_Collection.json)
[![Docker](https://img.shields.io/badge/Docker-Compose%20Ready-2496ed?logo=docker)](docker-compose.yml)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com)

---

## 🌍 Overview

Traditional pollution monitoring is often fragmented, delayed, and disconnected from street-level human exposure. Government CAAQMS towers are placed miles apart, unable to capture hyper-local hotspots like crop burning, diesel idling corridors, or illegal chemical dumping.

**VAYU** bridges this gap:
1. **Wearable IoT Telemetry**: Continuous PM2.5, VOC, ambient temperature, humidity, and location readings captured by mobile citizen wearables.
2. **Geospatial Core**: Multi-pollutant heatmaps (Air AQI, Water Quality, Soil Contamination) with Google Satellite and Hybrid overlays.
3. **Citizen Ground Truth**: 1-click incident reporting with pin dropping, severity rating, and photo evidence.
4. **Authority Command Console**: Algorithmic cluster detection correlating multiple wearable sensors with citizen alerts for municipal patrol dispatch and enforcement audit logs.
5. **IoT Stream Simulator**: Interactive developer testbed to simulate live wearable streaming (sliders, presets, and MQTT/BLE packet logs).

---

## 🏗️ Microservices Architecture

The VAYU backend is structured as a decoupled microservices mesh coordinated by an API Gateway:

```
                    ┌────────────────────────────┐
                    │     VAYU API Gateway       │
                    │      Port 5000 (HTTP)      │
                    └──────────────┬─────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ▼                         ▼                         ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│Telemetry Service │     │Clustering Service│     │ Reports Service  │
│    Port 5001     │     │    Port 5002     │     │    Port 5003     │
│• Wearable Packets│     │• Spatial Cluster │     │• Incident CRUD   │
│• PM2.5 & VOC Cal │     │• Hotspot Engine  │     │• Photo Proof     │
└──────────────────┘     └──────────────────┘     └──────────────────┘
                                   │
                                   ▼
                         ┌──────────────────┐
                         │Authority Service │
                         │    Port 5004     │
                         │• Municipal Queue │
                         │• Audit CSV Export│
                         └──────────────────┘
```

| Microservice | Port | Key Endpoints | Description |
|---|---|---|---|
| **API Gateway** | `5000` | `GET /`, `GET /health` | Central entry point, reverse proxy, routing directory |
| **Telemetry Ingestion** | `5001` | `GET /api/v1/telemetry/nodes`, `POST /api/v1/telemetry/ingest` | Sensor telemetry ingestion, calibration confidence |
| **Hotspot Clustering** | `5002` | `GET /api/v1/hotspots`, `POST /api/v1/hotspots/detect` | Spatial clustering correlating wearable spikes |
| **Citizen Reports** | `5003` | `GET /api/v1/reports`, `POST /api/v1/reports`, `POST /:id/upvote` | Geotagged incident submission, photo evidence |
| **Authority & Enforcement** | `5004` | `GET /api/v1/authority/triage`, `POST /dispatch`, `GET /audit/export` | Triage progression, municipal unit dispatch, CSV audit |

---

## 📮 Postman Collection Suite

The complete Postman test suite is provided in the [`postman/`](postman/) directory:
- **Collection File**: [`postman/VAYU_API_Collection.json`](postman/VAYU_API_Collection.json) (v2.1.0 standard schema)
- **Environment File**: [`postman/VAYU_Environment.json`](postman/VAYU_Environment.json) (preconfigured with `{{base_url}} = http://localhost:5000`)

### How to Import into Postman:
1. Open Postman.
2. Click **Import** (top left).
3. Drag & drop `postman/VAYU_API_Collection.json` and `postman/VAYU_Environment.json`.
4. Select the **VAYU Local Microservices Mesh** environment in Postman.
5. Execute requests across any of the 5 folders with pre-written tests and bodies.

---

## 📱 Core Frontend Modules

- **Public Landing Page**: Value proposition, problem vs. solution, 5-stage data ecosystem pipeline, and persona role switcher (*Citizen*, *Analyst*, *Authority*).
- **Live Geospatial Heatmap**: Leaflet map supporting **Google Satellite / Hybrid**, **Google Streets**, and **Terrain** with layer toggles (Air, Water, Soil, Hotspots) and slide-over inspector drawer.
- **Citizen Report Portal**: Drag-and-drop incident pin, category selection, 4-stage severity indicator, photo gallery presets, and zero-knowledge privacy mode.
- **Municipal Authority Console**: Hotspot cluster triage, enforcement workflow stepper (`Pending` $\rightarrow$ `Investigating` $\rightarrow$ `Action Taken` $\rightarrow$ `Resolved`), and CSV audit export.
- **VAYU Hardware Simulator**: Real-time telemetry sliders (PM2.5, VOC, battery, confidence), pedestrian walk route simulation, and live MQTT stream.

---

## 🚀 Quickstart & Execution

### 1. Clone & Install
```bash
git clone https://github.com/vignesh90117/vayu.git
cd vayu
npm install
```

### 2. Start Backend Microservices Mesh
In one terminal:
```bash
npm run backend
```
> Spins up all 4 microservices + the API Gateway concurrently on ports `5000-5004`.

### 3. Start Frontend Web Application
In a second terminal:
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 4. Run via Docker Compose
To run all microservices in isolated Docker containers:
```bash
docker-compose up --build
```

---

## 📄 License & Credits
Developed as an Advanced Software Engineering (ASE) capstone project and the software intelligence backbone for the **VAYU Wearable** startup ecosystem.  
Figma Design Blueprint: [VAYU Pollution Platform on Figma](https://www.figma.com/design/mN7RHx7dpyHamoa1KzPGXD?utm_source=chatgpt.com)
