import React from 'react';
import { ActiveCase, VesselAttributionData, DarkVesselData } from '../types';
import { MapView } from './MapView';
import {
  ShieldAlert,
  Percent,
  Ship,
  AlertTriangle,
  Radar,
  Play,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  Radio,
  FileText
} from 'lucide-react';

interface OverviewViewProps {
  activeCase: ActiveCase;
  onSelectVessel?: (vessel: VesselAttributionData) => void;
  onSelectDarkVessel?: (target: DarkVesselData) => void;
  onNavigateTab?: (tab: any) => void;
  onSelectTab?: (tab: any) => void;
  onRunAnalysis?: () => void;
  isAnalyzing?: boolean;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  activeCase,
  onSelectVessel,
  onSelectDarkVessel,
  onNavigateTab,
  onSelectTab,
  onRunAnalysis,
  isAnalyzing = false
}) => {
  const handleNav = onNavigateTab || onSelectTab || (() => {});
  const handleRun = onRunAnalysis || (() => {});
  const spill = activeCase.spill;
  const highRiskCount = activeCase.vessels.filter((v) => v.finalRiskScore >= 75).length;
  const darkVesselCount = activeCase.darkVessels.filter((d) => d.status !== 'AIS Matched').length;

  return (
    <div className="space-y-4 p-4 max-w-7xl mx-auto">
      {/* Overview Header & Run Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
              {activeCase.id}
            </span>
            <h1 className="text-lg font-bold text-white tracking-tight">
              {activeCase.name}
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Region: <span className="text-slate-300 font-medium">{activeCase.region}</span> &bull; Detected at: <span className="font-mono text-slate-300">{activeCase.detectionTime}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleNav('investigation-report')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>View Case Report</span>
          </button>
          <button
            onClick={handleRun}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isAnalyzing ? 'Simulating...' : 'Re-Run Pipeline'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row (5 Core KPIs as requested) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Card 1: Spills Detected */}
        <div
          onClick={() => handleNav('spill-detection')}
          className="bg-slate-900/90 border border-slate-800 hover:border-rose-500/40 p-3.5 rounded-xl cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Spills Detected</span>
            <div className="p-1 rounded bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-white">1</span>
            <span className="text-[10px] text-rose-400 font-semibold bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-900/60">
              LINEAR SLICK
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Area: {spill.areaKm2} km²</span>
            <span className="text-[9px] text-slate-500 font-mono">MOCK</span>
          </div>
        </div>

        {/* Card 2: Detection Confidence */}
        <div
          onClick={() => handleNav('spill-detection')}
          className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 p-3.5 rounded-xl cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Detection Conf.</span>
            <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-emerald-400">
              {spill.confidence}%
            </span>
            <span className="text-[10px] text-emerald-300 font-semibold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-900/60">
              HIGH
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Sentinel-1 SAR C-band</span>
            <span className="text-[9px] text-slate-500 font-mono">YOLOv8</span>
          </div>
        </div>

        {/* Card 3: AIS Candidates */}
        <div
          onClick={() => handleNav('vessel-attribution')}
          className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 p-3.5 rounded-xl cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">AIS Candidates</span>
            <div className="p-1 rounded bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20">
              <Ship className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-white">
              {activeCase.vessels.length}
            </span>
            <span className="text-[10px] text-cyan-300 font-semibold bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-900/60">
              24H WINDOW
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
            <span>±15 km Corridor</span>
            <span className="text-[9px] text-slate-500 font-mono">MOCK AIS</span>
          </div>
        </div>

        {/* Card 4: High-Risk Vessels */}
        <div
          onClick={() => handleNav('vessel-attribution')}
          className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 p-3.5 rounded-xl cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">High-Risk Vessels</span>
            <div className="p-1 rounded bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-amber-400">
              {highRiskCount}
            </span>
            <span className="text-[10px] text-amber-300 font-semibold bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-900/60">
              REQUIRES INVEST.
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
            <span className="truncate">Top: {activeCase.vessels[0]?.name || 'None'}</span>
            <span className="text-[9px] text-slate-500 font-mono">MOCK</span>
          </div>
        </div>

        {/* Card 5: Dark Vessels */}
        <div
          onClick={() => handleNav('dark-vessels')}
          className="bg-slate-900/90 border border-slate-800 hover:border-red-500/40 p-3.5 rounded-xl cursor-pointer transition-all group col-span-2 md:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Dark Vessels</span>
            <div className="p-1 rounded bg-red-500/10 text-red-400 group-hover:bg-red-500/20">
              <Radar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-red-400">
              {darkVesselCount}
            </span>
            <span className="text-[10px] text-red-300 font-semibold bg-red-950/60 px-1.5 py-0.5 rounded border border-red-900/60">
              SAR ANOMALY
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
            <span>1 Gap / 1 No-AIS</span>
            <span className="text-[9px] text-slate-500 font-mono">MOCK</span>
          </div>
        </div>
      </div>

      {/* Large Interactive Tactical Map Component */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Tactical Maritime Operational Picture
            </h2>
            <span className="text-[10px] bg-slate-800 text-cyan-300 px-2 py-0.5 rounded font-mono">
              Sentinel-1 + AIS Trajectories
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Click any vessel marker or polygon for full telemetry
          </span>
        </div>

        <MapView
          activeCase={activeCase}
          onSelectVessel={onSelectVessel}
          onSelectDarkVessel={onSelectDarkVessel}
          heightClassName="h-[520px]"
        />
      </div>

      {/* Bottom Quick Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Suspect Vessel Spotlight */}
        {activeCase.vessels[0] && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center font-mono font-bold text-xs">
                  #1
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{activeCase.vessels[0].name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-normal">
                      Candidate / Requires Investigation
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    IMO: {activeCase.vessels[0].imo} &bull; MMSI: {activeCase.vessels[0].mmsi} &bull; Flag: {activeCase.vessels[0].flag}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (onSelectVessel) onSelectVessel(activeCase.vessels[0]);
                  handleNav('vessel-attribution');
                }}
                className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1 font-medium"
              >
                <span>Full Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <div className="text-[10px] text-slate-400">Risk Score</div>
                <div className="text-base font-bold text-red-400">
                  {activeCase.vessels[0].finalRiskScore}%
                </div>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <div className="text-[10px] text-slate-400">Dist to Source</div>
                <div className="text-base font-bold text-cyan-300">
                  {activeCase.vessels[0].distanceToSourceKm} km
                </div>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <div className="text-[10px] text-slate-400">Hausdorff Dist</div>
                <div className="text-base font-bold text-amber-400">
                  {activeCase.vessels[0].hausdorffDistanceKm} km
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[11px] font-semibold text-slate-300">Behavioral Flags:</div>
              {activeCase.vessels[0].anomaliesDetected.map((anomaly, idx) => (
                <div key={idx} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{anomaly}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Environmental & Reconstructed Drift Summary */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <h3 className="text-sm font-bold text-white">Reconstructed Origin & Drift Physics</h3>
              <p className="text-[11px] text-slate-400">
                OpenDrift backward trajectory & oceanographic forcing
              </p>
            </div>
            <button
              onClick={() => handleNav('drift-analysis')}
              className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1 font-medium"
            >
              <span>Drift Modeling</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Probable Origin (Lat/Lon)</div>
              <div className="text-xs font-bold text-amber-400">
                {activeCase.drift.probableSource.lat.toFixed(2)}°N, {activeCase.drift.probableSource.lng.toFixed(2)}°E
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Uncertainty: ±{activeCase.drift.probableSource.uncertaintyRadiusKm} km
              </div>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Discharge Window</div>
              <div className="text-xs font-bold text-slate-200">
                {activeCase.drift.probableSource.estimatedDischargeTime.slice(11, 16)} UTC (T-6.5h)
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Wind: {activeCase.environment.windSpeedKnots} kts @ {activeCase.environment.windDirectionDeg}°
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center justify-between text-slate-300 font-medium">
              <span>Forward Dispersal Risk (T+24h):</span>
              <span className="text-rose-400 font-bold">Medium Coastal Proximity</span>
            </div>
            <p>
              Currents advecting slick ENE towards Texel / Dutch barrier islands at 0.48 m/s. Dispersion cone expands to ±6.8 km radius by T+24h.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
