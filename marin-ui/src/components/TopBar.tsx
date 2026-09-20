import React, { useState, useEffect } from 'react';
import { NavigationPage, ActiveCase } from '../types';
import {
  ShieldAlert,
  Bell,
  Play,
  RotateCw,
  Clock,
  Compass,
  FileCheck,
  Settings,
  ChevronDown,
  Info,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface TopBarProps {
  currentPage: NavigationPage;
  onNavigatePage: (page: NavigationPage) => void;
  activeCase?: ActiveCase;
  cases: ActiveCase[];
  selectedCaseId?: string;
  onSelectCase: (caseId: string) => void;
  onRunAnalysis?: () => void;
  onOpenAnalysisModal?: () => void;
  isAnalyzing?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentPage,
  onNavigatePage,
  activeCase,
  cases = [],
  selectedCaseId,
  onSelectCase,
  onRunAnalysis,
  onOpenAnalysisModal,
  isAnalyzing = false
}) => {
  const currentCase = activeCase || cases.find((c) => c.id === selectedCaseId) || cases[0];
  const handleTriggerAnalysis = onRunAnalysis || onOpenAnalysisModal || (() => {});
  const [currentTime, setCurrentTime] = useState('');
  const [showCaseDropdown, setShowCaseDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-[#080d1a] border-b border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 select-none">
      {/* Brand & Case Info */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigatePage('dashboard')}
          className="flex items-center gap-2.5 focus:outline-none group text-left"
          aria-label="MARIN-TRACE Home"
        >
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-white font-mono">
                MARIN<span className="text-cyan-400">-TRACE</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/80 uppercase">
                LIVE AI SAR
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wide font-sans">
              Maritime Spill Intelligence & Attribution
            </p>
          </div>
        </button>

        {/* Case ID Selector Dropdown */}
        <div className="relative">
          <button
            id="case-selector-btn"
            onClick={() => setShowCaseDropdown(!showCaseDropdown)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-slate-900/90 border border-slate-700/80 text-xs text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition-colors"
            aria-expanded={showCaseDropdown}
            aria-haspopup="true"
          >
            <span className="text-slate-400">Case:</span>
            <span className="font-mono font-bold text-cyan-300">{currentCase?.id || 'NO-CASE'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showCaseDropdown && (
            <div className="absolute left-0 mt-1.5 w-72 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-1.5 z-50 text-xs">
              <div className="text-[10px] uppercase font-semibold text-slate-400 px-2 py-1">
                Select Active Incident Case
              </div>
              {cases.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectCase(c.id);
                    setShowCaseDropdown(false);
                  }}
                  className={`w-full text-left p-2 rounded-md transition-colors flex items-center justify-between ${
                    c.id === currentCase?.id ? 'bg-cyan-950/70 text-cyan-200 border border-cyan-800/60' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="font-mono font-bold">{c.id}</div>
                    <div className="text-[11px] text-slate-400 truncate">{c.name}</div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {c.status}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900/60 border border-slate-800 text-xs">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isAnalyzing ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isAnalyzing ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
          </span>
          <span className="text-slate-400">Status:</span>
          <span className="font-medium text-slate-200">
            {isAnalyzing ? 'Running ML Pipeline...' : activeCase.status}
          </span>
        </div>

        {/* LIVE FASTAPI TELEMETRY Notice */}
        <div className="hidden xl:flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-400" title="Live FastAPI data connection established">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-bold tracking-wide">LIVE FASTAPI TELEMETRY</span>
        </div>
      </div>

      {/* Navigation Links & Action Controls */}
      <div className="flex items-center gap-3">
        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            id="nav-dashboard-btn"
            onClick={() => onNavigatePage('dashboard')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              currentPage === 'dashboard'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Command Center
          </button>
          <button
            id="nav-landing-btn"
            onClick={() => onNavigatePage('landing')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              currentPage === 'landing'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            System Overview
          </button>
          <button
            id="nav-settings-btn"
            onClick={() => onNavigatePage('settings')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              currentPage === 'settings'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
          <button
            id="nav-legal-btn"
            onClick={() => onNavigatePage('legal')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              currentPage === 'legal'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Legal & GDPR</span>
          </button>
        </nav>

        {/* Live UTC Clock */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{currentTime || 'Syncing...'}</span>
        </div>

        {/* Notifications Icon & Popover */}
        <div className="relative">
          <button
            id="notifications-toggle-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) setUnreadNotifications(0);
            }}
            className="relative p-2 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Tactical Notifications"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-rose-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                {unreadNotifications}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-cyan-400" />
                  Tactical Alerts & Ingest
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                <div className="p-2 rounded bg-rose-950/50 border border-rose-900/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-300 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Dark Vessel Correlation Flag</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    SAR target SAR-TGT-0982-14 detected with 4.8h AIS transponder gap near spill centroid.
                  </p>
                  <span className="text-[10px] text-rose-400/80 font-mono">12 mins ago</span>
                </div>

                <div className="p-2 rounded bg-slate-800/80 border border-slate-700 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Tidal Vector Shift</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Copernicus ocean currents shifted to 0.48 m/s @ 62°. Drift dispersal simulation updated.
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono">34 mins ago</span>
                </div>

                <div className="p-2 rounded bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Sentinel-1 SAR GRD Ingested</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Scene S1A_IW_GRDH_1SDV calibrated. YOLOv8-seg confidence: 91.4%.
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono">1 hour ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RUN ANALYSIS BUTTON */}
        <button
          id="run-analysis-btn"
          onClick={handleTriggerAnalysis}
          disabled={isAnalyzing}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg ${
            isAnalyzing
              ? 'bg-amber-600/80 text-white cursor-wait animate-pulse'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/20 active:scale-95'
          }`}
          aria-label="Run full analysis pipeline"
        >
          {isAnalyzing ? (
            <>
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Analysis</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};