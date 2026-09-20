import React, { useState } from 'react';
import { ActiveCase, DarkVesselData } from '../types';
import { MapView } from './MapView';
import {
  Radar,
  Radio,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  Search,
  Maximize2,
  Info,
  Clock,
  EyeOff
} from 'lucide-react';

interface DarkVesselsViewProps {
  activeCase: ActiveCase;
  selectedDarkVessel: DarkVesselData | null;
  onSelectDarkVessel: (target: DarkVesselData) => void;
}

export const DarkVesselsView: React.FC<DarkVesselsViewProps> = ({
  activeCase,
  selectedDarkVessel,
  onSelectDarkVessel
}) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AIS Matched' | 'AIS Gap' | 'No AIS'>('ALL');
  const darkVessels = activeCase.darkVessels;

  const filteredTargets = darkVessels.filter((t) => {
    if (statusFilter === 'ALL') return true;
    return t.status === statusFilter;
  });

  const activeTarget = selectedDarkVessel || darkVessels[0];

  const matchedCount = darkVessels.filter((d) => d.status === 'AIS Matched').length;
  const gapCount = darkVessels.filter((d) => d.status === 'AIS Gap').length;
  const noAisCount = darkVessels.filter((d) => d.status === 'No AIS').length;

  return (
    <div className="space-y-4 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-mono text-xs font-bold border border-cyan-800">
              MODULE 04
            </span>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Dark Vessel Detection & AIS Correlation
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-referencing SAR CFAR high-backscatter radar targets against terrestrial & satellite AIS transponder logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-amber-300 font-mono font-bold bg-amber-950/80 border border-amber-800 px-2.5 py-1 rounded">
            RADAR TARGETS: MOCK
          </span>
        </div>
      </div>

      {/* Warning Notice mandated by prompt */}
      <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-xl flex items-start gap-3 text-xs text-slate-300">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
            Evidential Caution & Non-Prejudicial Designation
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            SAR radar signatures without corresponding AIS signals indicate uncooperative traffic, equipment malfunction, or spoofing. Under maritime law, targets are designated as <strong className="text-amber-200">"Candidate / Requires Investigation"</strong>. The OilWatch system does not make definitive fault determinations without on-scene boarding or physical oily-waste sampling.
          </p>
        </div>
      </div>

      {/* KPI Cards: The 3 statuses (AIS Matched, AIS Gap, No AIS) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Status 1: AIS Matched */}
        <div
          onClick={() => setStatusFilter('AIS Matched')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'AIS Matched'
              ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              AIS Matched (Cooperative)
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-1 text-2xl font-bold font-mono text-emerald-400">
            {matchedCount} <span className="text-xs font-normal text-slate-400">targets</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Radar position aligns with active transponder transmission (&lt;150m offset)
          </p>
        </div>

        {/* Status 2: AIS Gap */}
        <div
          onClick={() => setStatusFilter('AIS Gap')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'AIS Gap'
              ? 'bg-amber-950/40 border-amber-500/60 text-amber-200'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              AIS Gap (Transponder Silent)
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-1 text-2xl font-bold font-mono text-amber-400">
            {gapCount} <span className="text-xs font-normal text-slate-400">targets</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Target matches prior known vessel, but transponder ceased broadcasting
          </p>
        </div>

        {/* Status 3: No AIS */}
        <div
          onClick={() => setStatusFilter('No AIS')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'No AIS'
              ? 'bg-red-950/40 border-red-500/60 text-red-200'
              : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              No AIS (Unregistered Target)
            </span>
            <EyeOff className="w-4 h-4 text-red-400" />
          </div>
          <div className="my-1 text-2xl font-bold font-mono text-red-400">
            {noAisCount} <span className="text-xs font-normal text-slate-400">targets</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Radar reflector with zero broadcast record in regional terrestrial/satellite receivers
          </p>
        </div>
      </div>

      {/* Targets Table and Detailed Target Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Table (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-2">
              <Radar className="w-4 h-4 text-cyan-400" />
              SAR CFAR Radar Contacts vs AIS Correlation
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400">Filter:</span>
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                  statusFilter === 'ALL' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                }`}
              >
                ALL
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] text-slate-400 font-mono uppercase">
                  <th className="p-2.5 pl-3">Target ID</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Estimated Size</th>
                  <th className="p-2.5">RCS</th>
                  <th className="p-2.5">Gap / Correlation</th>
                  <th className="p-2.5 pr-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTargets.map((target) => {
                  const isSelected = activeTarget?.id === target.id;
                  const isGap = target.status === 'AIS Gap';
                  const isNoAis = target.status === 'No AIS';

                  return (
                    <tr
                      key={target.id}
                      onClick={() => onSelectDarkVessel(target)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-cyan-950/50 border-l-4 border-l-cyan-400'
                          : 'hover:bg-slate-800/50'
                      }`}
                    >
                      <td className="p-2.5 pl-3 font-mono font-bold text-slate-200">
                        {target.targetId}
                      </td>

                      <td className="p-2.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap ${
                            target.status === 'AIS Matched'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : isGap
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-red-950 text-red-300 border border-red-800'
                          }`}
                        >
                          {target.status}
                        </span>
                      </td>

                      <td className="p-2.5 font-mono text-slate-300">
                        ~{target.estimatedLengthM}m × {target.estimatedBeamM}m
                      </td>

                      <td className="p-2.5 font-mono text-cyan-300">
                        {target.radarCrossSectionDb} dB
                      </td>

                      <td className="p-2.5 text-slate-300 text-[11px]">
                        {target.gapDurationHours ? (
                          <span className="text-amber-400 font-mono font-semibold">
                            {target.gapDurationHours}h silent
                          </span>
                        ) : target.matchedVesselName ? (
                          <span className="truncate max-w-[130px] block text-emerald-400">
                            {target.matchedVesselName}
                          </span>
                        ) : (
                          <span className="text-red-400">No transponder</span>
                        )}
                      </td>

                      <td className="p-2.5 pr-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDarkVessel(target);
                          }}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-750 text-cyan-300 text-[10px] font-mono"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-2.5 bg-slate-950/60 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>CFAR Algorithm: Two-Parameter Constant False Alarm Rate</span>
            <span className="text-amber-400 font-mono">MOCK RADAR TARGETS</span>
          </div>
        </div>

        {/* Selected Target Dossier (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {activeTarget ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-slate-800 px-2 py-0.5 rounded text-cyan-300">
                      TARGET DOSSIER
                    </span>
                    <h3 className="text-base font-bold text-white font-mono">
                      {activeTarget.targetId}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    SAR Time: <span className="font-mono text-slate-300">{activeTarget.sarDetectionTime}</span>
                  </p>
                </div>

                <span
                  className={`text-[11px] font-bold px-2 py-1 rounded ${
                    activeTarget.status === 'AIS Matched'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : activeTarget.status === 'AIS Gap'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-red-950 text-red-300 border border-red-800'
                  }`}
                >
                  {activeTarget.status}
                </span>
              </div>

              {/* Investigation Flag */}
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  Evidential Recommendation
                </div>
                <div className="text-xs font-bold text-amber-400">
                  Candidate / Requires Investigation
                </div>
                <p className="text-[11px] text-slate-300">{activeTarget.notes}</p>
              </div>

              {/* Target Characteristics */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Detection Location</div>
                  <div className="text-xs font-bold text-slate-200 mt-0.5">
                    {activeTarget.location[0].toFixed(3)}°N, {activeTarget.location[1].toFixed(3)}°E
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Radar Cross Section (RCS)</div>
                  <div className="text-xs font-bold text-cyan-300 mt-0.5">
                    {activeTarget.radarCrossSectionDb} dB
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Estimated Length</div>
                  <div className="text-xs font-bold text-slate-200 mt-0.5">
                    ~{activeTarget.estimatedLengthM} meters
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase">Estimated Beam</div>
                  <div className="text-xs font-bold text-slate-200 mt-0.5">
                    ~{activeTarget.estimatedBeamM} meters
                  </div>
                </div>
              </div>

              {/* Correlation History */}
              <div className="space-y-1.5 text-xs">
                <div className="font-semibold text-slate-200">Radar-to-AIS Cross Match:</div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <div>
                    <span className="text-slate-400">Matched Vessel:</span>{' '}
                    <span className="font-bold text-slate-100">
                      {activeTarget.matchedVesselName || 'NONE (Unmatched Reflector)'}
                    </span>
                  </div>
                  {activeTarget.matchedMmsi && (
                    <div>
                      <span className="text-slate-400">Associated MMSI:</span>{' '}
                      <span className="font-mono text-cyan-300">{activeTarget.matchedMmsi}</span>
                    </div>
                  )}
                  {activeTarget.gapDurationHours && (
                    <div>
                      <span className="text-slate-400">Transponder Inactivity:</span>{' '}
                      <span className="font-mono text-amber-400 font-bold">
                        {activeTarget.gapDurationHours} continuous hours
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
              Select a radar contact to inspect dark vessel correlation parameters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
