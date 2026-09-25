import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingScreen } from './components/screens/LandingScreen';
import { MapScreen } from './components/screens/MapScreen';
import { ReportScreen } from './components/screens/ReportScreen';
import { AuthorityScreen } from './components/screens/AuthorityScreen';
import { SimulatorScreen } from './components/screens/SimulatorScreen';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      
      <main className="flex-1">
        {activeTab === 'home' && <LandingScreen />}
        {activeTab === 'map' && <MapScreen />}
        {activeTab === 'report' && <ReportScreen />}
        {activeTab === 'authority' && <AuthorityScreen />}
        {activeTab === 'simulator' && <SimulatorScreen />}
      </main>

      {/* Show footer on standard content screens, keep map view full-height */}
      {activeTab !== 'map' && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
