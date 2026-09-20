import React from 'react';
import {
  ShieldAlert,
  ArrowRight,
  Satellite,
  Waves,
  Ship,
  Radar,
  FileCheck,
  CheckCircle2,
  Lock,
  Compass,
  Cpu,
  Globe2,
  ExternalLink,
  Layers
} from 'lucide-react';

interface LandingViewProps {
  onLaunchDashboard: () => void;
  onNavigatePage: (page: any) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onLaunchDashboard,
  onNavigatePage
}) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-8 px-4 max-w-6xl mx-auto text-center space-y-6">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[280px] bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-mono font-medium">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>MARITIME SURVEILLANCE & ATTRIBUTION PROTOTYPE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          AI-Powered Satellite Oil Spill Detection & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400">Vessel Attribution</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          From Sentinel-1 Synthetic Aperture Radar (SAR) backscatter to OpenDrift oceanographic trajectory reconstruction and historical AIS matching — in minutes instead of days.
        </p>

        {/* Primary Call to Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            id="hero-launch-dashboard-btn"
            onClick={onLaunchDashboard}
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-sm shadow-xl shadow-cyan-500/25 active:scale-95 transition-all"
          >
            <span>Launch Tactical Command Center</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigatePage('settings')}
            className="flex items-center gap-2 px-5 py-3.5 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 rounded-xl text-sm font-semibold transition-colors"
          >
            <span>Configure Parameters</span>
          </button>
        </div>

        {/* Realism Notice */}
        <div className="pt-2 text-xs text-slate-500 font-mono flex items-center justify-center gap-4 flex-wrap">
          <span>&bull; Powered by YOLOv8-seg (86.4% mAP50)</span>
          <span>&bull; Lagrangian Particle Advection</span>
          <span>&bull; MARPOL 73/78 Compliant</span>
        </div>
      </section>

      {/* 7-Step Workflow Architecture Pipeline */}
      <section className="px-4 max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            End-to-End Operational Pipeline
          </span>
          <h2 className="text-2xl font-bold text-white">
            From Spaceborne Radar to Legal Evidence Dossier
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="h-9 w-9 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
              <Satellite className="w-5 h-5" />
            </div>
            <div className="font-mono text-xs text-slate-400 font-bold">STAGE 01</div>
            <h3 className="text-sm font-bold text-white">SAR Satellite Ingestion</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sentinel-1 C-band Synthetic Aperture Radar captures sea surface damping independent of cloud cover or sunlight.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="h-9 w-9 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="font-mono text-xs text-slate-400 font-bold">STAGE 02</div>
            <h3 className="text-sm font-bold text-white">AI Spill Segmentation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              YOLOv8-seg model segments slicks, calculates area and centerline, and classifies morphology (Linear Slick vs Platform).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Waves className="w-5 h-5" />
            </div>
            <div className="font-mono text-xs text-slate-400 font-bold">STAGE 03</div>
            <h3 className="text-sm font-bold text-white">Lagrangian Drift Inversion</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Particles advected backward using NOAA wind leeway and Copernicus currents to pinpoint discharge origin coordinates and timing.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Ship className="w-5 h-5" />
            </div>
            <div className="font-mono text-xs text-slate-400 font-bold">STAGE 04</div>
            <h3 className="text-sm font-bold text-white">AIS Vessel Trajectory Matching</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Historical AIS voyages cross-referenced via Hausdorff distance and behavioral anomaly checks to rank suspect vessels.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights Bento Grid */}
      <section className="px-4 max-w-6xl mx-auto space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 md:col-span-2">
            <div className="h-8 w-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
              <Radar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Uncooperative "Dark Vessel" Detection
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Polluting vessels frequently deactivate Class-A AIS transponders prior to illegal bilge or slop discharges. OilWatch flags CFAR radar targets that appear on high-resolution SAR imagery but lack transponder transmissions, calculating transponder gap durations to alert maritime patrol authorities.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">
              Chain-of-Custody Evidentiary Export
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Export complete structured evidence packages in JSON and CSV formats, formatted with legal disclaimers for non-prejudicial Port State Control inspection.
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Legal Compliance Statement */}
      <section className="px-4 max-w-4xl mx-auto">
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
          <div className="inline-flex p-2 rounded-full bg-emerald-500/10 text-emerald-400 mb-1">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            Ethical Maritime AI & Data Minimization Notice
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl mx-auto">
            OilWatch operates strictly on open public remote sensing data (Copernicus Sentinel) and public maritime radio broadcasts (ITU AIS). The system does not collect personal identity data, track private recreational crafts without public AIS, or use unauthorized tracking cookies. All attribution scores represent investigative leads under international maritime law (UNCLOS Art. 217).
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigatePage('legal')}
              className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold underline underline-offset-4"
            >
              Read full GDPR Privacy Policy & Legal Terms
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
