import React, { useState } from 'react';
import { ActiveCase } from '../types';
import { downloadJson, downloadCsv } from '../services/mockData';
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Ship,
  Radar,
  Waves,
  Scan,
  Compass,
  Building2,
  Calendar,
  Lock
} from 'lucide-react';

interface InvestigationReportViewProps {
  activeCase: ActiveCase;
}

export const InvestigationReportView: React.FC<InvestigationReportViewProps> = ({ activeCase }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGeneratedTime, setReportGeneratedTime] = useState('2024-09-08 08:30:00 UTC');
  const [showPrintModal, setShowPrintModal] = useState(false);

  const spill = activeCase.spill;
  const drift = activeCase.drift;
  const primaryVessel = activeCase.vessels[0];
  const darkTarget = activeCase.darkVessels[0];

  // Download JSON
  const handleDownloadJson = () => {
    const reportData = {
      caseId: activeCase.id,
      caseName: activeCase.name,
      region: activeCase.region,
      status: activeCase.status,
      generatedAt: new Date().toISOString(),
      sarDetection: {
        satellite: spill.satellite,
        acquisitionTime: spill.acquisitionTime,
        confidence: spill.confidence,
        classification: spill.spillTypeLabel,
        geometry: {
          areaKm2: spill.areaKm2,
          lengthKm: spill.lengthKm,
          widthKm: spill.widthKm,
          estimatedAgeHours: spill.estimatedAgeHours,
          centroid: spill.centroid
        }
      },
      driftReconstruction: {
        probableSource: drift.probableSource,
        environmentalForcing: activeCase.environment
      },
      candidateVessels: activeCase.vessels,
      darkVessels: activeCase.darkVessels,
      legalDisclaimer:
        'All vessel rankings are computed candidates for formal maritime investigation under UNCLOS Art. 217 and MARPOL 73/78. This dossier constitutes non-prejudicial technical intelligence.'
    };
    downloadJson(reportData, `OilWatch_Case_${activeCase.id}_Dossier.json`);
  };

  // Download CSV
  const handleDownloadCsv = () => {
    const headers = [
      'Rank',
      'Vessel Name',
      'IMO',
      'MMSI',
      'Vessel Type',
      'Flag',
      'Distance to Source (km)',
      'Hausdorff Distance (km)',
      'Proximity Score (%)',
      'Behavioral Score (%)',
      'Final Risk Score (%)',
      'Status'
    ];
    const rows = activeCase.vessels.map((v) => [
      v.rank,
      v.name,
      v.imo,
      v.mmsi,
      v.vesselType,
      v.flag,
      v.distanceToSourceKm,
      v.hausdorffDistanceKm,
      v.proximityScore,
      v.behavioralScore,
      v.finalRiskScore,
      v.status
    ]);
    downloadCsv(headers, rows, `OilWatch_Vessel_Attribution_${activeCase.id}.csv`);
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setReportGeneratedTime(new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC');
      alert(`Investigation Report #${activeCase.id} freshly recompiled and digitally signed with SHA-256 chain of custody.`);
    }, 900);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 p-4 max-w-5xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-mono text-xs font-bold border border-cyan-800">
              MODULE 06
            </span>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Maritime Investigation Dossier & Evidential Summary
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Compiled intelligence report for Port State Control, Coast Guard, & Environmental Enforcement
          </p>
        </div>

        {/* The 3 required buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="report-download-json-btn"
            onClick={handleDownloadJson}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Download JSON</span>
          </button>

          <button
            id="report-download-csv-btn"
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download CSV</span>
          </button>

          <button
            id="report-generate-btn"
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Compiling Dossier...' : 'Generate Report'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg border border-slate-700 transition-colors"
            title="Print Report"
            aria-label="Print Report"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Official Formatted Evidence Dossier (Paper Style in Dark Theme) */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl text-slate-200">
        {/* Dossier Letterhead */}
        <div className="border-b border-slate-700 pb-5 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-white shadow-lg">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xl font-black font-mono tracking-tight text-white">
                OILWATCH MARITIME INTELLIGENCE
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Remote Sensing & Trajectory Attribution Report
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Document Ref: OW-ATTRIB-{activeCase.id}-REV1
              </p>
            </div>
          </div>

          <div className="text-right sm:text-right font-mono text-xs text-slate-400 space-y-0.5">
            <div>
              <strong>Case ID:</strong> <span className="text-cyan-400 font-bold">{activeCase.id}</span>
            </div>
            <div>
              <strong>Status:</strong> <span className="text-emerald-400 font-bold">{activeCase.status}</span>
            </div>
            <div>
              <strong>Compiled:</strong> {reportGeneratedTime}
            </div>
            <div>
              <strong>Classification:</strong> RESTRICTED / MARITIME ENFORCEMENT
            </div>
          </div>
        </div>

        {/* Section 1: Executive Case Information */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1 flex items-center gap-2">
            <span>1. Executive Case Information</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <div>
              <span className="text-slate-400 text-[10px] uppercase">Incident Name</span>
              <div className="font-semibold text-white mt-0.5">{activeCase.name}</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase">Maritime Zone / Region</span>
              <div className="font-semibold text-slate-200 mt-0.5">{activeCase.region}</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase">Observation Timestamp</span>
              <div className="font-mono text-slate-200 mt-0.5">{spill.acquisitionTime}</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase">Lead Suspect Vessel</span>
              <div className="font-bold text-red-400 mt-0.5">
                {primaryVessel ? `${primaryVessel.name} (IMO ${primaryVessel.imo})` : 'Under Investigation'}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: SAR Detection & Sensor Characteristics */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1 flex items-center gap-2">
            <span>2. Satellite Synthetic Aperture Radar (SAR) Detection</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <div>
              <span className="text-slate-400 text-[10px] uppercase">Satellite Sensor</span>
              <div className="font-semibold text-slate-200 mt-0.5">{spill.satellite}</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase">Polarization & Mode</span>
              <div className="font-mono text-cyan-300 mt-0.5">{spill.polarization} Interferometric Wide</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase">AI Confidence Score</span>
              <div className="font-mono text-emerald-400 font-bold mt-0.5">{spill.confidence}% (YOLOv8-seg)</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase">Spatial Resolution</span>
              <div className="font-mono text-slate-200 mt-0.5">{spill.resolutionMeters}m GRD Pixel Spacing</div>
            </div>
          </div>
        </div>

        {/* Section 3: Spill Geometry Characteristics */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
            <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <span>3. Spill Morphology & Physical Characterization</span>
            </h2>
            <span className="text-[10px] text-amber-400 font-mono">SIMULATED GEOMETRY: MOCK</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <div>
              <span className="text-slate-400 text-[10px] uppercase">Morphological Type</span>
              <div className="font-bold text-rose-400 mt-0.5">Linear Slick (LS)</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase">Estimated Surface Area</span>
              <div className="font-mono font-bold text-white mt-0.5">{spill.areaKm2} km²</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase">Length / Width</span>
              <div className="font-mono text-slate-200 mt-0.5">{spill.lengthKm} km × {spill.widthKm} km</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase">Elongation Ratio</span>
              <div className="font-mono text-slate-200 mt-0.5">{spill.elongationRatio} (High)</div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase">Estimated Slick Age</span>
              <div className="font-mono text-purple-300 font-bold mt-0.5">~{spill.estimatedAgeHours} hours</div>
            </div>
          </div>
        </div>

        {/* Section 4: Reconstructed Discharge Origin */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1 flex items-center gap-2">
            <span>4. Reconstructed Source Region & Oceanographic Forcing</span>
          </h2>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Reconstructed Origin</span>
                <span className="font-bold text-amber-400">
                  {drift.probableSource.lat.toFixed(4)}°N, {drift.probableSource.lng.toFixed(4)}°E
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Uncertainty Radius</span>
                <span className="text-cyan-300 font-bold">± {drift.probableSource.uncertaintyRadiusKm} km (95% CI)</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Estimated Discharge Window</span>
                <span className="text-slate-200">
                  {drift.probableSource.estimatedDischargeTime.slice(11, 16)} UTC (T-6.5h)
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 leading-relaxed">
              Drift solution calculated via Lagrangian particle advection using Copernicus Marine 1/12° currents (0.48 m/s @ 62°) and NOAA HRRR wind leeway (16.4 kts @ 245°).
            </p>
          </div>
        </div>

        {/* Section 5: Vessel Attribution Findings */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
            <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <span>5. Ranked Vessel Candidates (AIS Attribution)</span>
            </h2>
            <span className="text-[10px] text-amber-400 font-mono">HISTORICAL AIS: MOCK</span>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 text-[10px] text-slate-400 font-mono uppercase border-b border-slate-800">
                  <th className="p-2 pl-3">Rank</th>
                  <th className="p-2">Vessel Name</th>
                  <th className="p-2">IMO / MMSI</th>
                  <th className="p-2">Vessel Type</th>
                  <th className="p-2">Hausdorff Dist</th>
                  <th className="p-2">Risk Score</th>
                  <th className="p-2 pr-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {activeCase.vessels.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/40">
                    <td className="p-2 pl-3 font-bold text-slate-300">#{v.rank}</td>
                    <td className="p-2 font-bold text-white font-sans">{v.name}</td>
                    <td className="p-2 text-slate-400">{v.imo} / {v.mmsi}</td>
                    <td className="p-2 text-slate-300 font-sans">{v.vesselType}</td>
                    <td className="p-2 text-cyan-300">{v.hausdorffDistanceKm} km</td>
                    <td className="p-2 font-bold text-red-400">{v.finalRiskScore}%</td>
                    <td className="p-2 pr-3 text-amber-300 font-sans text-[10px]">{v.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {primaryVessel && (
            <div className="p-3 bg-red-950/20 border border-red-900/60 rounded-xl space-y-1 text-xs">
              <div className="font-bold text-red-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Primary Lead Suspect: {primaryVessel.name} (IMO {primaryVessel.imo})</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Vessel trajectory intercepted reconstructed discharge zone at 06:45 UTC with a 3.3 knot deceleration. One-way Hausdorff distance of 1.12 km between smoothed trajectory and slick centerline demonstrates high spatial congruence.
              </p>
            </div>
          )}
        </div>

        {/* Section 6: Dark Vessel Findings */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1 flex items-center gap-2">
            <span>6. Uncooperative & Dark Vessel Findings</span>
          </h2>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
            {darkTarget ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 font-mono">
                    Target {darkTarget.targetId} ({darkTarget.status})
                  </span>
                  <span className="text-[10px] text-red-400 font-bold bg-red-950 px-2 py-0.5 rounded border border-red-800">
                    CRITICAL WARNING
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {darkTarget.notes} Estimated radar cross-section {darkTarget.radarCrossSectionDb} dB indicates an uncooperative steel-hulled vessel in proximity to the discharge point.
                </p>
              </div>
            ) : (
              <p className="text-slate-400 text-xs">No uncooperative radar contacts identified in current scene.</p>
            )}
          </div>
        </div>

        {/* Section 7: Legal & Regulatory Sign-Off Block */}
        <div className="pt-4 border-t border-slate-700 space-y-3">
          <div className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">Legal Evidential Notice (MARPOL 73/78 & UNCLOS Art. 217):</strong> This report provides circumstantial spatiotemporal intelligence based on satellite radar backscatter, numerical oceanographic advection, and public AIS broadcasts. It is intended to guide Port State Control (PSC) inspectors to board candidate vessels for oil record book examination, oily-water separator (OWS) seal verification, and tank sampling.
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 text-xs font-mono border-t border-slate-800">
            <div>
              <span className="text-slate-500 text-[10px] block">SYSTEM OPERATOR</span>
              <span className="text-slate-200">AI Intelligence Core (OilWatch v1.2)</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">VERIFICATION HASH</span>
              <span className="text-cyan-400 font-bold">SHA256: 8f4e2...a19c</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">STATUS</span>
              <span className="text-emerald-400 font-bold">EVIDENCE PACKET SEALED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
