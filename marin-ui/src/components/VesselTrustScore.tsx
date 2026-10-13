import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  AlertOctagon, 
  Anchor, 
  FileWarning, 
  TrendingDown,
  Download,
  BellRing
} from 'lucide-react';

interface TrustProfileProps {
  vesselName: string;
  imo: string;
  flag: string;
  trustScore: number; 
  metrics: {
    aisReliability: number;
    spillProximityHistory: number;
    flagStateRisk: number;
    portDetentions: number;
  };
  history: Array<{ date: string; event: string; severity: 'high' | 'medium' | 'low' }>;
}

export const VesselTrustScore: React.FC<TrustProfileProps> = ({
  vesselName = "MT PACIFIC OBSERVER",
  imo = "IMO 9234567",
  flag = "Panama",
  trustScore = 34,
  metrics = {
    aisReliability: 42,
    spillProximityHistory: 20,
    flagStateRisk: 65,
    portDetentions: 30
  },
  history = [
    { date: "12 Oct 2026", event: "SAR Anomaly: Oil Slick Correlation (Current)", severity: "high" },
    { date: "04 Aug 2026", event: "AIS Transponder Gap (4.2 hours) in Marine Reserve", severity: "high" },
    { date: "15 May 2026", event: "Tokyo MOU Port Detention (MARPOL Violation)", severity: "medium" },
    { date: "22 Jan 2025", event: "Routine Port State Control Inspection - Passed", severity: "low" }
  ]
}) => {
  const isHighRisk = trustScore < 50;
  const scoreColor = isHighRisk ? 'text-rose-500' : trustScore < 75 ? 'text-amber-400' : 'text-emerald-400';
  const bgScoreColor = isHighRisk ? 'bg-rose-500/10 border-rose-500/20' : trustScore < 75 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20';

  return (
    <div className="bg-[#0b111e] border border-slate-800 rounded-2xl p-5 shadow-2xl w-[600px] text-slate-200 font-sans select-none">
      
      {/* Header section */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Anchor className="w-5 h-5 text-slate-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">{vesselName}</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
              {flag}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono tracking-wide">{imo}</p>
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium transition-colors">
            <BellRing className="w-3.5 h-3.5 text-amber-400" />
            Set Webhook Alert
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-400 rounded-lg text-xs font-medium transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export API
          </button>
        </div>
      </div>

      {/* Score & Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        
        {/* Main Trust Score Circular Gauge */}
        <div className={`col-span-1 flex flex-col items-center justify-center p-4 rounded-xl border ${bgScoreColor}`}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 text-center">
            Dynamic Trust Score
          </div>
          <div className="relative flex items-center justify-center mb-2">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle cx="56" cy="56" r="48" className="stroke-slate-800" strokeWidth="8" fill="none" />
              <circle cx="56" cy="56" r="48" className={`stroke-current ${scoreColor}`} strokeWidth="8" fill="none" strokeDasharray="301.59" strokeDashoffset={301.59 - (301.59 * trustScore) / 100} strokeLinecap="round" />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-4xl font-black font-mono ${scoreColor}`}>{trustScore}</span>
              <span className="text-[10px] text-slate-400">/ 100</span>
            </div>
          </div>
          <div className={`text-xs font-bold px-2 py-1 rounded-md ${isHighRisk ? 'bg-rose-950 text-rose-400' : 'bg-emerald-950 text-emerald-400'}`}>
            {isHighRisk ? 'HIGH RISK VESSEL' : 'COMPLIANT'}
          </div>
        </div>

        {/* Component Metrics Bars */}
        <div className="col-span-2 space-y-4 flex flex-col justify-center">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-cyan-400" />
            Algorithmic Breakdown
          </h3>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Historical AIS Reliability</span>
                <span className="font-mono text-amber-400">{metrics.aisReliability}/100</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${metrics.aisReliability}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Proximity to Past Spills (5yr)</span>
                <span className="font-mono text-rose-500">{metrics.spillProximityHistory}/100</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${metrics.spillProximityHistory}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-400">Flag State Compliance (Paris/Tokyo MOU)</span>
                <span className="font-mono text-emerald-400">{metrics.flagStateRisk}/100</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${metrics.flagStateRisk}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Incident Timeline */}
      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/80">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <FileWarning className="w-4 h-4 text-slate-400" />
          Offense & Detention Timeline
        </h3>
        <div className="space-y-3">
          {history.map((item, idx) => (
            <div key={idx} className="flex gap-3 text-sm">
              <div className="flex flex-col items-center">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${item.severity === 'high' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : item.severity === 'medium' ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>
                {idx !== history.length - 1 && <div className="w-px h-full bg-slate-700 my-1"></div>}
              </div>
              <div className="pb-2">
                <div className="text-[10px] font-mono text-slate-500">{item.date}</div>
                <div className={`text-xs ${item.severity === 'high' ? 'text-rose-200 font-medium' : 'text-slate-300'}`}>
                  {item.event}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automated Recommendation Action */}
      <div className="mt-4 p-3 rounded-lg bg-rose-950/30 border border-rose-900/50 flex items-start gap-3">
        <AlertOctagon className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
        <div>
          <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-0.5">SaaS System Recommendation</div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Vessel trust score is critically low. Recommended action: <strong className="text-white">Deny port entry</strong> or mandate physical Coast Guard inspection. If insurer, recommend <strong className="text-white">+150% premium increase</strong> due to MARPOL liability risk.
          </p>
        </div>
      </div>

    </div>
  );
};