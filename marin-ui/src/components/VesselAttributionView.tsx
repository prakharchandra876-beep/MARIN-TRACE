import React, { useState } from 'react';
import { ActiveCase, VesselAttributionData } from '../types';
import { MapView } from './MapView';
import {
  Ship,
  Search,
  SlidersHorizontal,
  ChevronRight,
  AlertTriangle,
  ArrowUpDown,
  Compass,
  Navigation,
  CheckCircle2,
  FileText,
  Info,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface VesselAttributionViewProps {
  activeCase: ActiveCase;
  selectedVessel: VesselAttributionData | null;
  onSelectVessel: (vessel: VesselAttributionData) => void;
}

export const VesselAttributionView: React.FC<VesselAttributionViewProps> = ({
  activeCase,
  selectedVessel,
  onSelectVessel
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'All' | 'High' | 'Moderate' | 'Low'>('All');
  const [sortBy, setSortBy] = useState<'rank' | 'risk' | 'distance' | 'hausdorff'>('rank');
  const [sortAsc, setSortAsc] = useState(true);

  // Filter vessels
  const filteredVessels = activeCase.vessels
    .filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.imo.includes(searchTerm) ||
        v.mmsi.includes(searchTerm) ||
        v.vesselType.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;
      if (riskFilter === 'All') return true;
      if (riskFilter === 'High') return v.finalRiskScore >= 75;
      if (riskFilter === 'Moderate') return v.finalRiskScore >= 50 && v.finalRiskScore < 75;
      if (riskFilter === 'Low') return v.finalRiskScore < 50;
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'rank') comparison = a.rank - b.rank;
      else if (sortBy === 'risk') comparison = b.finalRiskScore - a.finalRiskScore;
      else if (sortBy === 'distance') comparison = a.distanceToSourceKm - b.distanceToSourceKm;
      else if (sortBy === 'hausdorff') comparison = a.hausdorffDistanceKm - b.hausdorffDistanceKm;
      return sortAsc ? comparison : -comparison;
    });

  const activeVessel = selectedVessel || activeCase.vessels[0];

  return (
    <div className="space-y-4 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-mono text-xs font-bold border border-cyan-800">
              MODULE 03
            </span>
            <h1 className="text-lg font-bold text-white tracking-tight">
              AIS Vessel Attribution & Trajectory Matching
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Spatiotemporal corridor pre-screening, Hausdorff distance comparison, and multi-criteria risk attribution
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-amber-300 font-mono font-bold bg-amber-950/80 border border-amber-800 px-2.5 py-1 rounded">
            HISTORICAL AIS VALUES: MOCK
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by vessel name, IMO (e.g. 9418743), MMSI, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Risk Filter:</span>
          {(['All', 'High', 'Moderate', 'Low'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setRiskFilter(lvl)}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                riskFilter === lvl
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Split Table & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Ranked Vessel Table (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-2">
              <Ship className="w-4 h-4 text-cyan-400" />
              Ranked Candidate Vessels ({filteredVessels.length})
            </span>
            <span className="text-[11px] text-slate-400">Click a row to inspect vessel</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] text-slate-400 font-mono uppercase">
                  <th
                    onClick={() => {
                      setSortBy('rank');
                      setSortAsc(!sortAsc);
                    }}
                    className="p-2.5 pl-3 cursor-pointer hover:text-cyan-400"
                  >
                    Rank
                  </th>
                  <th className="p-2.5">Vessel Name / IMO</th>
                  <th className="p-2.5">Type</th>
                  <th
                    onClick={() => {
                      setSortBy('distance');
                      setSortAsc(!sortAsc);
                    }}
                    className="p-2.5 cursor-pointer hover:text-cyan-400"
                  >
                    Dist. to Source
                  </th>
                  <th
                    onClick={() => {
                      setSortBy('risk');
                      setSortAsc(!sortAsc);
                    }}
                    className="p-2.5 cursor-pointer hover:text-cyan-400"
                  >
                    Risk Score
                  </th>
                  <th className="p-2.5 pr-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredVessels.map((vessel) => {
                  const isSelected = activeVessel?.id === vessel.id;
                  const isHighRisk = vessel.finalRiskScore >= 75;

                  return (
                    <tr
                      key={vessel.id}
                      onClick={() => onSelectVessel(vessel)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-cyan-950/50 border-l-4 border-l-cyan-400'
                          : 'hover:bg-slate-800/50'
                      }`}
                    >
                      {/* Rank */}
                      <td className="p-2.5 pl-3 font-mono font-bold">
                        <span
                          className={`h-6 w-6 rounded-md inline-flex items-center justify-center text-xs ${
                            vessel.rank === 1
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          #{vessel.rank}
                        </span>
                      </td>

                      {/* Vessel Name & IMO */}
                      <td className="p-2.5">
                        <div className="font-bold text-slate-100 flex items-center gap-1.5">
                          <span>{vessel.name}</span>
                          {vessel.isReferenceVessel && (
                            <span className="text-[9px] bg-cyan-950 text-cyan-300 px-1 rounded border border-cyan-800">
                              REF
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          IMO {vessel.imo} &bull; MMSI {vessel.mmsi}
                        </div>
                      </td>

                      {/* Vessel Type */}
                      <td className="p-2.5 text-slate-300 text-[11px] truncate max-w-[120px]">
                        {vessel.vesselType}
                      </td>

                      {/* Distance to Source */}
                      <td className="p-2.5 font-mono text-cyan-300 font-semibold">
                        {vessel.distanceToSourceKm} km
                      </td>

                      {/* Final Risk Score */}
                      <td className="p-2.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono font-bold ${
                              isHighRisk ? 'text-red-400' : 'text-amber-400'
                            }`}
                          >
                            {vessel.finalRiskScore}%
                          </span>
                          <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className={`h-full ${
                                isHighRisk ? 'bg-red-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${vessel.finalRiskScore}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-2.5 pr-3">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded whitespace-nowrap ${
                            isHighRisk
                              ? 'bg-red-950 text-red-300 border border-red-800/80'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {vessel.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-950/60 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Score formula: 0.6 × Proximity + 0.4 × Behavioral Anomaly Score</span>
            <span className="text-amber-400 font-mono">MOCK ATTRIBUTION DATA</span>
          </div>
        </div>

        {/* Right Column: Selected Vessel Detail Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {activeVessel ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4">
              {/* Profile Header */}
              <div className="border-b border-slate-800 pb-3 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                      CANDIDATE #{activeVessel.rank}
                    </span>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {activeVessel.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    IMO: {activeVessel.imo} | MMSI: {activeVessel.mmsi} | Flag: {activeVessel.flag} ({activeVessel.flagCode})
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Attribution Risk</div>
                  <div className="text-xl font-bold font-mono text-red-400">
                    {activeVessel.finalRiskScore}%
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              <div className="p-2.5 rounded-lg bg-amber-950/50 border border-amber-800/80 flex items-start gap-2 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-300">
                    Designation: Candidate / Requires Investigation
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Evidential lead generated via spatial trajectory overlap. Maritime regulations require physical verification and logbook inspection before formal liability determination.
                  </p>
                </div>
              </div>

              {/* Metric Breakdown Cards */}
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Hausdorff Dist</div>
                  <div className="text-sm font-bold text-cyan-300 mt-0.5">
                    {activeVessel.hausdorffDistanceKm} km
                  </div>
                  <div className="text-[9px] text-slate-500">Path similarity</div>
                </div>

                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Proximity Score</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">
                    {activeVessel.proximityScore}%
                  </div>
                  <div className="text-[9px] text-slate-500">Dist to origin</div>
                </div>

                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Behavioral Score</div>
                  <div className="text-sm font-bold text-purple-300 mt-0.5">
                    {activeVessel.behavioralScore}%
                  </div>
                  <div className="text-[9px] text-slate-500">Speed/Course flags</div>
                </div>
              </div>

              {/* Operational & Voyage Details */}
              <div className="space-y-2 text-xs">
                <div className="font-semibold text-slate-200">Voyage & Telemetry Details:</div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-slate-400">Destination:</span>{' '}
                    <span className="text-slate-200">{activeVessel.destination}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">ETA:</span>{' '}
                    <span className="text-slate-200">{activeVessel.eta}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">SOG (Speed):</span>{' '}
                    <span className="text-slate-200">{activeVessel.sogKnots} kts</span>
                  </div>
                  <div>
                    <span className="text-slate-400">COG (Course):</span>{' '}
                    <span className="text-slate-200">{activeVessel.cogDeg}°</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Length x Beam:</span>{' '}
                    <span className="text-slate-200">
                      {activeVessel.vesselDimensions.lengthM}m x {activeVessel.vesselDimensions.beamM}m
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Gross Tonnage:</span>{' '}
                    <span className="text-slate-200">
                      {activeVessel.vesselDimensions.grossTonnage.toLocaleString()} GT
                    </span>
                  </div>
                </div>
              </div>

              {/* Behavioral Anomalies */}
              <div className="space-y-1.5 text-xs">
                <div className="font-semibold text-slate-200">Attribution Anomaly Indicators:</div>
                {activeVessel.anomaliesDetected.length > 0 ? (
                  activeVessel.anomaliesDetected.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded bg-slate-950/60 border border-slate-800 text-slate-300 text-[11px] flex items-start gap-2"
                    >
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{item}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-500 text-[11px]">No anomalous patterns detected along track.</div>
                )}
              </div>

              {/* Trajectory Waypoints Table */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">AIS Track Points (24h Window)</span>
                  <span className="text-[10px] text-amber-400 font-mono">MOCK SATELLITE AIS</span>
                </div>
                <div className="max-h-36 overflow-y-auto space-y-1 pr-1 font-mono text-[10px]">
                  {activeVessel.trajectory.map((pt, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-1.5 rounded bg-slate-950/60 border border-slate-800/80 text-slate-400"
                    >
                      <span>{pt.time}</span>
                      <span className="text-slate-300">
                        {pt.lat.toFixed(2)}°N, {pt.lng.toFixed(2)}°E
                      </span>
                      <span className="text-cyan-400 font-bold">{pt.sog} kts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
              Select a vessel from the table to view its trajectory and attribution dossier.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
