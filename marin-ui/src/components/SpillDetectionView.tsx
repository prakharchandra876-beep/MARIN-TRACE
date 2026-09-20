import React, { useState } from 'react';
import { ActiveCase } from '../types';
import {
  Scan,
  Layers,
  Sparkles,
  Sliders,
  CheckCircle2,
  Info,
  Maximize2,
  Cpu,
  Satellite,
  Clock,
  Ruler,
  Maximize,
  Compass
} from 'lucide-react';

interface SpillDetectionViewProps {
  activeCase: ActiveCase;
}

export const SpillDetectionView: React.FC<SpillDetectionViewProps> = ({ activeCase }) => {
  const spill = activeCase.spill;
  const [viewMode, setViewMode] = useState<'side-by-side' | 'slider' | 'overlay'>('side-by-side');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [overlayOpacity, setOverlayOpacity] = useState(75);
  const [selectedBand, setSelectedBand] = useState<'VV' | 'VH' | 'Dual'>('Dual');

  return (
    <div className="space-y-4 p-4 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-mono text-xs font-bold border border-cyan-800">
              MODULE 01
            </span>
            <h1 className="text-lg font-bold text-white tracking-tight">
              SAR Oil Spill Detection & Characterization
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Synthetic Aperture Radar (SAR) dark formation extraction & YOLOv8-seg morphological classification
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              viewMode === 'side-by-side' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setViewMode('slider')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              viewMode === 'slider' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Split Slider
          </button>
          <button
            onClick={() => setViewMode('overlay')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              viewMode === 'overlay' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Alpha Blend
          </button>
        </div>
      </div>

      {/* Primary Visual Comparison Canvas */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden p-4 space-y-3">
        <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Satellite className="w-4 h-4 text-cyan-400" />
              {spill.satellite}
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 font-mono text-[11px]">
              Acquired: {spill.acquisitionTime}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-slate-400">Polarization:</span>
              <span className="text-cyan-300 font-mono font-bold bg-slate-800 px-1.5 py-0.5 rounded">
                {spill.polarization}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-slate-400">Resolution:</span>
              <span className="text-slate-200 font-mono">{spill.resolutionMeters}m GRD</span>
            </div>
          </div>
        </div>

        {/* Dynamic Display based on viewMode */}
        {viewMode === 'side-by-side' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Raw SAR Scene */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Scan className="w-3.5 h-3.5 text-slate-400" />
                  Raw Calibrated SAR Backscatter (VV+VH)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Normalized Sigma0 (dB)</span>
              </div>
              <div className="relative h-80 rounded-xl overflow-hidden border border-slate-800 bg-[#050811] flex items-center justify-center group">
                {/* Realistic Synthetic SAR Radar Visualization */}
                <svg className="w-full h-full" viewBox="0 0 600 350" preserveAspectRatio="none">
                  <defs>
                    <radialGradient id="sarSea" cx="50%" cy="50%" r="70%">
                      <stop offset="0%" stopColor="#1e293b" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </radialGradient>
                    <filter id="sarSpeckle">
                      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" result="noise" />
                      <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0.15 0" />
                      <feComposite in2="SourceGraphic" in="glitch" operator="in" />
                    </filter>
                  </defs>

                  {/* Sea Surface with Bragg Scattering */}
                  <rect width="600" height="350" fill="url(#sarSea)" />
                  <rect width="600" height="350" fill="#334155" opacity="0.12" filter="url(#sarSpeckle)" />

                  {/* Wind Rows / Ocean swell lines */}
                  <g stroke="#334155" strokeWidth="0.8" opacity="0.35" strokeDasharray="30, 20">
                    <line x1="-50" y1="50" x2="650" y2="120" />
                    <line x1="-50" y1="110" x2="650" y2="180" />
                    <line x1="-50" y1="170" x2="650" y2="240" />
                    <line x1="-50" y1="230" x2="650" y2="300" />
                    <line x1="-50" y1="290" x2="650" y2="360" />
                  </g>

                  {/* Dark Oil Slick damping signature (Capillary Wave Damping) */}
                  <path
                    d="M 120 70 Q 230 130 330 190 T 490 260 Q 510 270 500 278 Q 440 270 320 205 T 105 78 Z"
                    fill="#040711"
                    stroke="#0b1120"
                    strokeWidth="3"
                  />

                  {/* Centerline Sinuous Ribbon */}
                  <path
                    d="M 112 74 Q 225 132 325 197 T 495 268"
                    stroke="#02040a"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.8"
                  />

                  {/* Bright SAR Ship Point-Target Flare */}
                  <circle cx="510" cy="275" r="4.5" fill="#f8fafc" />
                  <line x1="510" y1="265" x2="510" y2="285" stroke="#f8fafc" strokeWidth="1.5" opacity="0.75" />
                  <line x1="500" y1="275" x2="520" y2="275" stroke="#f8fafc" strokeWidth="1.5" opacity="0.75" />
                </svg>

                <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[10px] text-slate-300 font-mono border border-slate-800">
                  Target Point Reflector (Vessel Point Source)
                </div>
                <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded text-[10px] text-slate-400 font-mono">
                  Damping: -8.4 dB
                </div>
              </div>
            </div>

            {/* AI Segmented Mask Overlay */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  AI Instance Segmentation Mask (YOLOv8-seg)
                </span>
                <span className="text-[10px] font-bold text-emerald-400 font-mono bg-emerald-950/80 border border-emerald-800 px-1.5 py-0.2 rounded">
                  Conf: 91.4%
                </span>
              </div>
              <div className="relative h-80 rounded-xl overflow-hidden border border-cyan-500/30 bg-[#050811] flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 600 350" preserveAspectRatio="none">
                  <defs>
                    <radialGradient id="aiSea" cx="50%" cy="50%" r="70%">
                      <stop offset="0%" stopColor="#091322" />
                      <stop offset="100%" stopColor="#040813" />
                    </radialGradient>
                  </defs>
                  <rect width="600" height="350" fill="url(#aiSea)" />

                  {/* Grid Lines for Segmentation Matrix */}
                  <g stroke="#1e293b" strokeWidth="0.5" opacity="0.4">
                    <line x1="150" y1="0" x2="150" y2="350" />
                    <line x1="300" y1="0" x2="300" y2="350" />
                    <line x1="450" y1="0" x2="450" y2="350" />
                    <line x1="0" y1="120" x2="600" y2="120" />
                    <line x1="0" y1="240" x2="600" y2="240" />
                  </g>

                  {/* Detected Mask Polygon (Rose/Red Glowing) */}
                  <path
                    d="M 120 70 Q 230 130 330 190 T 490 260 Q 510 270 500 278 Q 440 270 320 205 T 105 78 Z"
                    fill="#e11d48"
                    fillOpacity="0.45"
                    stroke="#fb7185"
                    strokeWidth="2.5"
                    strokeDasharray="4, 2"
                  />

                  {/* Centerline Skeleton (Yellow/Gold) */}
                  <path
                    d="M 112 74 Q 225 132 325 197 T 495 268"
                    stroke="#facc15"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="6, 3"
                  />

                  {/* Skeleton Extraction Points */}
                  <circle cx="112" cy="74" r="4" fill="#38bdf8" />
                  <circle cx="225" cy="132" r="4" fill="#38bdf8" />
                  <circle cx="325" cy="197" r="4" fill="#38bdf8" />
                  <circle cx="420" cy="235" r="4" fill="#38bdf8" />
                  <circle cx="495" cy="268" r="4" fill="#38bdf8" />

                  {/* Bounding Box Box Annotation */}
                  <rect
                    x="90"
                    y="55"
                    width="430"
                    height="240"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    strokeDasharray="4, 4"
                    opacity="0.7"
                  />
                  <rect x="90" y="36" width="165" height="19" fill="#06b6d4" rx="2" />
                  <text x="96" y="50" fill="#020617" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    LINEAR SLICK: 91.4%
                  </text>
                </svg>

                <div className="absolute bottom-2 right-2 flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-2.5 py-1 rounded-md text-[10px]">
                  <span className="flex items-center gap-1 text-yellow-300">
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span> Centerline
                  </span>
                  <span className="flex items-center gap-1 text-cyan-300">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Skeleton Nodes
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'slider' && (
          <div className="space-y-2">
            <div className="relative h-96 rounded-xl overflow-hidden border border-slate-800 bg-[#050811] select-none">
              {/* Underneath: Mask */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 600 350" preserveAspectRatio="none">
                  <rect width="600" height="350" fill="#040813" />
                  <path
                    d="M 120 70 Q 230 130 330 190 T 490 260 Q 510 270 500 278 Q 440 270 320 205 T 105 78 Z"
                    fill="#e11d48"
                    fillOpacity="0.6"
                    stroke="#fb7185"
                    strokeWidth="3"
                  />
                  <path
                    d="M 112 74 Q 225 132 325 197 T 495 268"
                    stroke="#facc15"
                    strokeWidth="3.5"
                    fill="none"
                  />
                </svg>
              </div>

              {/* On top: Clipped Raw SAR */}
              <div
                className="absolute inset-0 overflow-hidden border-r-2 border-cyan-400"
                style={{ width: `${sliderPosition}%` }}
              >
                <div className="w-[1000px] h-full" style={{ width: '100%' }}>
                  <svg className="w-full h-full" viewBox="0 0 600 350" preserveAspectRatio="none">
                    <rect width="600" height="350" fill="#0f172a" />
                    <path
                      d="M 120 70 Q 230 130 330 190 T 490 260 Q 510 270 500 278 Q 440 270 320 205 T 105 78 Z"
                      fill="#020409"
                      stroke="#0b1120"
                      strokeWidth="3"
                    />
                    <circle cx="510" cy="275" r="5" fill="#ffffff" />
                  </svg>
                </div>
              </div>

              {/* Split Slider Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-lg cursor-ew-resize flex items-center justify-center pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="h-7 w-7 rounded-full bg-cyan-500 border-2 border-white shadow-xl flex items-center justify-center text-slate-950 font-bold text-xs">
                  ⟷
                </div>
              </div>

              {/* Labels */}
              <div className="absolute top-3 left-3 bg-black/80 px-2 py-1 rounded text-xs font-mono text-slate-300">
                RAW SAR ({sliderPosition}%)
              </div>
              <div className="absolute top-3 right-3 bg-black/80 px-2 py-1 rounded text-xs font-mono text-cyan-300">
                AI SEGMENTATION ({100 - sliderPosition}%)
              </div>
            </div>

            <div className="flex items-center gap-3 px-2">
              <span className="text-xs text-slate-400">Slider Position:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <span className="text-xs font-mono text-cyan-400 w-12 text-right">{sliderPosition}%</span>
            </div>
          </div>
        )}

        {viewMode === 'overlay' && (
          <div className="space-y-2">
            <div className="relative h-80 rounded-xl overflow-hidden border border-slate-800 bg-[#050811]">
              <svg className="w-full h-full" viewBox="0 0 600 350" preserveAspectRatio="none">
                <rect width="600" height="350" fill="#0f172a" />
                <path
                  d="M 120 70 Q 230 130 330 190 T 490 260 Q 510 270 500 278 Q 440 270 320 205 T 105 78 Z"
                  fill="#020409"
                />
                <circle cx="510" cy="275" r="5" fill="#ffffff" />

                {/* Blended Mask */}
                <path
                  d="M 120 70 Q 230 130 330 190 T 490 260 Q 510 270 500 278 Q 440 270 320 205 T 105 78 Z"
                  fill="#e11d48"
                  fillOpacity={overlayOpacity / 100}
                  stroke="#fb7185"
                  strokeWidth="2.5"
                />
              </svg>
            </div>

            <div className="flex items-center gap-3 px-2">
              <span className="text-xs text-slate-400">Mask Blend Opacity:</span>
              <input
                type="range"
                min="10"
                max="100"
                value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <span className="text-xs font-mono text-cyan-400 w-12 text-right">{overlayOpacity}%</span>
            </div>
          </div>
        )}
      </div>

      {/* CORE SPECIFICATION TABLE: The required fields from prompt */}
      {/* "Show: Oil Detected: YES, Confidence: 91.4%, Spill Type: Linear Slick, Area, Length, Width, Estimated Age. Clearly label geometry values as MOCK when simulated." */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Extracted Morphological & Geometry Metrics
            </h2>
          </div>
          <span className="text-[11px] text-amber-300 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded font-mono font-bold">
            GEOMETRY VALUES LABELED MOCK
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* 1. Oil Detected */}
          <div className="p-3 rounded-lg bg-slate-950/80 border border-emerald-900/60 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Oil Detected</span>
            <div className="my-1 flex items-center gap-1.5 text-emerald-400 font-bold text-lg font-mono">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>YES</span>
            </div>
            <span className="text-[9px] text-emerald-500/80 font-mono">CONFIRMED</span>
          </div>

          {/* 2. Confidence */}
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Confidence</span>
            <div className="my-1 text-emerald-400 font-bold text-lg font-mono">
              {spill.confidence}%
            </div>
            <span className="text-[9px] text-slate-500 font-mono">YOLOv8-seg mAP50</span>
          </div>

          {/* 3. Spill Type */}
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col justify-between col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Spill Type</span>
            <div className="my-1 text-rose-400 font-bold text-sm font-mono leading-tight">
              Linear Slick (LS)
            </div>
            <span className="text-[9px] text-slate-500">Discharge in transit</span>
          </div>

          {/* 4. Area */}
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400">Area</span>
              <span className="text-[9px] text-amber-400 font-mono font-bold">MOCK</span>
            </div>
            <div className="my-1 text-cyan-300 font-bold text-lg font-mono">
              {spill.areaKm2} <span className="text-xs font-normal text-slate-400">km²</span>
            </div>
            <span className="text-[9px] text-slate-500 font-mono">~3,670 acres</span>
          </div>

          {/* 5. Length */}
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400">Length</span>
              <span className="text-[9px] text-amber-400 font-mono font-bold">MOCK</span>
            </div>
            <div className="my-1 text-cyan-300 font-bold text-lg font-mono">
              {spill.lengthKm} <span className="text-xs font-normal text-slate-400">km</span>
            </div>
            <span className="text-[9px] text-slate-500 font-mono">15.3 nautical mi</span>
          </div>

          {/* 6. Width */}
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400">Width</span>
              <span className="text-[9px] text-amber-400 font-mono font-bold">MOCK</span>
            </div>
            <div className="my-1 text-cyan-300 font-bold text-lg font-mono">
              {spill.widthKm} <span className="text-xs font-normal text-slate-400">km</span>
            </div>
            <span className="text-[9px] text-slate-500 font-mono">650 meters avg</span>
          </div>

          {/* 7. Estimated Age */}
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400">Est. Age</span>
              <span className="text-[9px] text-amber-400 font-mono font-bold">MOCK</span>
            </div>
            <div className="my-1 text-purple-300 font-bold text-lg font-mono">
              {spill.estimatedAgeHours} <span className="text-xs font-normal text-slate-400">hrs</span>
            </div>
            <span className="text-[9px] text-slate-500 font-mono">Decay heuristic</span>
          </div>
        </div>

        {/* Methodology & Science Context Note */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Algorithm Characterization Pipeline</span>
          </div>
          <p className="leading-relaxed">
            The detection architecture uses an upgraded YOLOv8-seg model equipped with Large Selective Kernel (LSK) attention and Dynamic Sample (DySample) upsamplers to resolve faint linear contrast boundaries against sea clutter. Elongation ratio of <strong className="text-slate-200">{spill.elongationRatio}</strong> qualifies the slick as a vessel discharge in transit (Linear Slick) rather than a fixed platform seep (Ongoing).
          </p>
        </div>
      </div>
    </div>
  );
};
