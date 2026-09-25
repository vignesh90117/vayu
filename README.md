# VAYU — Real-Time Pollution Intelligence Platform

> **Clean Air. Everywhere You Go.**  
> A geospatial environmental intelligence platform combining continuous telemetry from **VAYU Wearable Sensors**, fixed CAAQMS stations, and crowdsourced citizen incident reports with municipal enforcement workflows.

[![Figma Design](https://img.shields.io/badge/Figma-UX%20Blueprint-blue?logo=figma)](https://www.figma.com/design/mN7RHx7dpyHamoa1KzPGXD?utm_source=chatgpt.com)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet)](https://leafletjs.com)

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

## 📱 Core UX Modules

- **Public Landing Page**: Value proposition, problem vs. solution, 5-stage data ecosystem pipeline, and persona role switcher (*Citizen*, *Analyst*, *Authority*).
- **Live Geospatial Heatmap**: Leaflet map supporting **Google Satellite / Hybrid**, **Google Streets**, and **Terrain** with layer toggles (Air, Water, Soil, Hotspots) and slide-over inspector drawer.
- **Citizen Report Portal**: Drag-and-drop incident pin, category selection, 4-stage severity indicator, photo gallery presets, and zero-knowledge privacy mode.
- **Municipal Authority Console**: Hotspot cluster triage, enforcement workflow stepper (`Pending` $\rightarrow$ `Investigating` $\rightarrow$ `Action Taken` $\rightarrow$ `Resolved`), and CSV audit export.
- **VAYU Hardware Simulator**: Real-time telemetry sliders (PM2.5, VOC, battery, confidence), pedestrian walk route simulation, and live MQTT stream.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom VAYU Navy (`#0b192c`) and Leaf Emerald (`#16a34a`) tokens
- **Mapping**: Leaflet + React-Leaflet with Google Maps Hybrid / Satellite tile endpoints
- **Data Visualizations**: Recharts (24-hour diurnal trend area charts)
- **Icons**: Lucide React

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/vignesh90117/vayu.git
cd vayu
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 📄 License & Credits
Developed as an Advanced Software Engineering (ASE) capstone project and the software intelligence backbone for the **VAYU Wearable** startup ecosystem.  
Figma Design Blueprint: [VAYU Pollution Platform on Figma](https://www.figma.com/design/mN7RHx7dpyHamoa1KzPGXD?utm_source=chatgpt.com)
