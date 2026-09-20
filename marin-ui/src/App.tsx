import React, { useState, useEffect } from 'react';
import {
  ActiveCase,
  DashboardTab,
  PageSection,
  SystemSettings,
  VesselAttributionData,
  DarkVesselData
} from './types';
import { ACTIVE_CASES } from './services/mockData';

// Top-level views
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { LandingView } from './components/LandingView';
import { OverviewView } from './components/OverviewView';
import { SpillDetectionView } from './components/SpillDetectionView';
import { DriftAnalysisView } from './components/DriftAnalysisView';
import { VesselAttributionView } from './components/VesselAttributionView';
import { DarkVesselsView } from './components/DarkVesselsView';
import { HistoricalIncidentsView } from './components/HistoricalIncidentsView';
import { InvestigationReportView } from './components/InvestigationReportView';
import { SettingsView } from './components/SettingsView';
import { LegalView } from './components/LegalView';
import { AnalysisProgressModal } from './components/AnalysisProgressModal';
import { CookieBanner } from './components/CookieBanner';

import { ShieldCheck, Lock, ExternalLink, Globe } from 'lucide-react';

export default function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<PageSection>('dashboard');
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [legalSection, setLegalSection] = useState<'privacy' | 'terms' | 'cookies' | 'refund' | 'business'>('privacy');

  // Active Case State
  const [cases, setCases] = useState<ActiveCase[]>(ACTIVE_CASES);
  
  // NEW INTEGRATION: Fetch live data from FastAPI
  useEffect(() => {
    const fetchLiveSpillData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/detect', {
          method: 'POST',
        });
        const liveData = await response.json();

        // Update the active case with the live GeoJSON polygon from FastAPI
        setCases(prevCases => {
          const updatedCases = [...prevCases];
          updatedCases[0].spill.polygon = liveData.geometry.coordinates[0];
          updatedCases[0].spill.confidence = liveData.properties.confidence;
          return updatedCases;
        });
        
        console.log("FastAPI Connection Successful!", liveData);
      } catch (error) {
        console.error("FastAPI Connection Failed. Is the backend running?", error);
      }
    };

    fetchLiveSpillData();
  }, []);
  
  const [selectedCaseId, setSelectedCaseId] = useState<string>(ACTIVE_CASES[0].id);

  // Selected Entities
  const [selectedVessel, setSelectedVessel] = useState<VesselAttributionData | null>(
    ACTIVE_CASES[0].vessels[0] || null
  );
  const [selectedDarkVessel, setSelectedDarkVessel] = useState<DarkVesselData | null>(
    ACTIVE_CASES[0].darkVessels[0] || null
  );

  // Analysis Pipeline Modal State
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

  // System Settings State
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('oilwatch_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      detectionThreshold: 0.5,
      driftParticleCount: 250,
      driftTimeStepMin: 15,
      darkVesselBufferKm: 15.0,
      useSyntheticFallback: true,
      enableAlertSounds: false,
      autoRefreshAis: false,
      analyticsOptOut: true,
      strictGdprCompliance: true,
      activeCaseId: ACTIVE_CASES[0].id
    };
  });

  const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  // Hash-based routing synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#home' || hash === '#landing') {
        setCurrentPage('landing');
      } else if (hash.startsWith('#dashboard')) {
        setCurrentPage('dashboard');
        if (hash.includes('spill')) setActiveTab('spill-detection');
        else if (hash.includes('drift')) setActiveTab('drift-analysis');
        else if (hash.includes('attribution')) setActiveTab('vessel-attribution');
        else if (hash.includes('dark-vessels')) setActiveTab('dark-vessels');
        else if (hash.includes('historical')) setActiveTab('historical-incidents');
        else if (hash.includes('report')) setActiveTab('investigation-report');
        else setActiveTab('overview');
      } else if (hash === '#settings') {
        setCurrentPage('settings');
      } else if (hash.startsWith('#legal')) {
        setCurrentPage('legal');
        if (hash.includes('terms')) setLegalSection('terms');
        else if (hash.includes('cookies')) setLegalSection('cookies');
        else if (hash.includes('refund')) setLegalSection('refund');
        else if (hash.includes('business')) setLegalSection('business');
        else setLegalSection('privacy');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    if (window.location.hash) {
      handleHashChange();
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToPage = (page: PageSection, tab?: DashboardTab) => {
    setCurrentPage(page);
    if (page === 'landing') {
      window.location.hash = '#home';
    } else if (page === 'dashboard') {
      const targetTab = tab || activeTab;
      setActiveTab(targetTab);
      window.location.hash = `#dashboard/${targetTab}`;
    } else if (page === 'settings') {
      window.location.hash = '#settings';
    } else if (page === 'legal') {
      window.location.hash = '#legal';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToTab = (tab: DashboardTab) => {
    setCurrentPage('dashboard');
    setActiveTab(tab);
    window.location.hash = `#dashboard/${tab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    const target = cases.find((c) => c.id === caseId);
    if (target) {
      setSelectedVessel(target.vessels[0] || null);
      setSelectedDarkVessel(target.darkVessels[0] || null);
    }
  };

  const handleUpdateSettings = (newSettings: SystemSettings) => {
    setSettings(newSettings);
    localStorage.setItem('oilwatch_settings', JSON.stringify(newSettings));
    if (newSettings.activeCaseId !== selectedCaseId) {
      handleSelectCase(newSettings.activeCaseId);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* 🚀 INJECTED MAP DARK MODE FOR HACKATHON 🚀 */}
      <style>{`
        .leaflet-layer,
        .leaflet-control-zoom-in,
        .leaflet-control-zoom-out,
        .leaflet-control-attribution {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
      `}</style>

      {/* Top Header Navigation */}
      <TopBar
        currentPage={currentPage}
        onNavigatePage={navigateToPage}
        activeCase={activeCase}
        cases={cases}
        selectedCaseId={selectedCaseId}
        onSelectCase={handleSelectCase}
        onRunAnalysis={() => setIsAnalysisModalOpen(true)}
        onOpenAnalysisModal={() => setIsAnalysisModalOpen(true)}
        isAnalyzing={isAnalysisModalOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {currentPage === 'landing' && (
          <LandingView
            onLaunchDashboard={() => navigateToPage('dashboard', 'overview')}
            onNavigatePage={navigateToPage}
          />
        )}

        {currentPage === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onBackToDashboard={() => navigateToPage('dashboard')}
            cases={cases}
          />
        )}

        {currentPage === 'legal' && (
          <LegalView
            onBackToDashboard={() => navigateToPage('dashboard')}
            defaultSection={legalSection}
          />
        )}

        {currentPage === 'dashboard' && (
          <div className="flex-1 flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <Sidebar
              activeTab={activeTab}
              onSelectTab={navigateToTab}
              activeCase={activeCase}
            />

            {/* Dashboard Sub-view Container */}
            <main className="flex-1 bg-slate-950 min-w-0">
              {activeTab === 'overview' && (
                <OverviewView
                  activeCase={activeCase}
                  onSelectTab={navigateToTab}
                  onNavigateTab={navigateToTab}
                  onSelectVessel={(v) => {
                    setSelectedVessel(v);
                    navigateToTab('vessel-attribution');
                  }}
                  onSelectDarkVessel={(d) => {
                    setSelectedDarkVessel(d);
                    navigateToTab('dark-vessels');
                  }}
                  onRunAnalysis={() => setIsAnalysisModalOpen(true)}
                  isAnalyzing={isAnalysisModalOpen}
                />
              )}

              {activeTab === 'spill-detection' && (
                <SpillDetectionView activeCase={activeCase} />
              )}

              {activeTab === 'drift-analysis' && (
                <DriftAnalysisView activeCase={activeCase} />
              )}

              {activeTab === 'vessel-attribution' && (
                <VesselAttributionView
                  activeCase={activeCase}
                  selectedVessel={selectedVessel}
                  onSelectVessel={(v) => setSelectedVessel(v)}
                />
              )}

              {activeTab === 'dark-vessels' && (
                <DarkVesselsView
                  activeCase={activeCase}
                  selectedDarkVessel={selectedDarkVessel}
                  onSelectDarkVessel={(d) => setSelectedDarkVessel(d)}
                />
              )}

              {activeTab === 'historical-incidents' && <HistoricalIncidentsView />}

              {activeTab === 'investigation-report' && (
                <InvestigationReportView activeCase={activeCase} />
              )}
            </main>
          </div>
        )}
      </div>

      {/* Analysis Pipeline Execution Modal */}
      <AnalysisProgressModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        activeCase={activeCase}
        onComplete={() => {
          navigateToTab('overview');
        }}
      />

      {/* Cookie & GDPR Banner */}
      <CookieBanner
        onOpenCookiePolicy={() => {
          setLegalSection('cookies');
          navigateToPage('legal');
        }}
      />

      {/* 🚀 MARIN-TRACE BRANDED FOOTER 🚀 */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold font-mono text-xs">
              MT
            </div>
            <div>
              <span className="font-bold text-slate-200">MARIN-TRACE</span>
              <span className="text-slate-400 ml-2">&bull; Version 1.0</span>
            </div>
          </div>

          {/* Direct Navigation Links for Legal, Terms, and Views */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-slate-400">
            <button onClick={() => navigateToPage('landing')} className="hover:text-cyan-400 transition-colors">Home</button>
            <button onClick={() => navigateToPage('dashboard', 'overview')} className="hover:text-cyan-400 transition-colors">Command Center</button>
            <button onClick={() => navigateToPage('settings')} className="hover:text-cyan-400 transition-colors">Settings</button>
            <button onClick={() => { setLegalSection('privacy'); navigateToPage('legal'); }} className="hover:text-cyan-400 transition-colors">Privacy Policy</button>
            <button onClick={() => { setLegalSection('terms'); navigateToPage('legal'); }} className="hover:text-cyan-400 transition-colors">Terms</button>
          </div>

          <div className="text-center md:text-right font-mono text-[11px] text-slate-400">
            &copy; {new Date().getFullYear()} MARIN-TRACE &bull; ISRO Hackathon Submission
          </div>
        </div>
      </footer>
    </div>
  );
}