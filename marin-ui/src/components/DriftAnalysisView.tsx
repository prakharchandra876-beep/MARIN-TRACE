import React, { useState } from 'react';
import { ActiveCase } from '../types';
import { MapView } from './MapView';
import {
  Waves,
  Wind,
  Compass,
  Clock,
  Sliders,
  Play,
  RotateCcw,
  Layers,
  Thermometer,
  CloudRain,
  Info,
  ShieldCheck
} from 'lucide-react';

interface DriftAnalysisViewProps {
  activeCase: ActiveCase;
}

export const DriftAnalysisView: React.FC<DriftAnalysisViewProps> = ({ activeCase }) => {
  const env = activeCase.environment;
  const drift = activeCase.drift;

  const [simDuration, setSimDuration] = useState(drift.simulationDurationHours);
  const [particleCount, setParticleCount] = useState(drift.particleCount);
  const [timeStep, setTimeStep] = useState(drift.timeStepMinutes);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleRerunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="space-y-4 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-mono text-xs font-bold border border-cyan-800">
              MODULE 02
            </span>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Lagrangian Drift & Dispersion Reconstruction
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Coupled oceanographic particle modeling: OpenDrift advection under wind leeway & CMEMS surface currents
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-amber-300 font-mono font-bold bg-amber-950/80 border border-amber-800 px-2.5 py-1 rounded">
            SIMULATION PARAMETERS: MOCK
          </span>
        </div>
      </div>

      {/* Environmental Values Cards (Required by Prompt) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Wind Speed */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Wind Speed</span>
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="my-1 text-cyan-300 font-bold text-xl font-mono">
            {env.windSpeedKnots} <span className="text-xs text-slate-400 font-normal">kts</span>
          </div>
          <span className="text-[9px] text-slate-500">~{((env.windSpeedKnots * 1.852) / 3.6).toFixed(1)} m/s (Bft 3)</span>
        </div>

        {/* Wind Direction */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Wind Direction</span>
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="my-1 text-white font-bold text-xl font-mono flex items-center gap-1.5">
            <span>{env.windDirectionDeg}°</span>
            <span className="text-xs text-cyan-400 font-sans font-semibold">WSW</span>
          </div>
          <span className="text-[9px] text-slate-500">Blowing towards ENE</span>
        </div>

        {/* Ocean Current Speed */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Ocean Current</span>
            <Waves className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="my-1 text-emerald-400 font-bold text-xl font-mono">
            {env.oceanCurrentSpeedMs} <span className="text-xs text-slate-400 font-normal">m/s</span>
          </div>
          <span className="text-[9px] text-slate-500">Surface layer (0-5m)</span>
        </div>

        {/* Current Direction */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Current Dir</span>
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="my-1 text-white font-bold text-xl font-mono flex items-center gap-1.5">
            <span>{env.oceanCurrentDirectionDeg}°</span>
            <span className="text-xs text-emerald-400 font-sans font-semibold">ENE</span>
          </div>
          <span className="text-[9px] text-slate-500">Tidal flood vector</span>
        </div>

        {/* Simulation Duration */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Sim Duration</span>
            <Clock className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="my-1 text-purple-300 font-bold text-xl font-mono">
            {simDuration} <span className="text-xs text-slate-400 font-normal">hours</span>
          </div>
          <span className="text-[9px] text-slate-500">Lookback & Forecast</span>
        </div>

        {/* Simulation Particles */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">Particle Count</span>
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="my-1 text-cyan-300 font-bold text-xl font-mono">
            {particleCount} <span className="text-xs text-slate-400 font-normal">pts</span>
          </div>
          <span className="text-[9px] text-slate-500">Monte Carlo dispersal</span>
        </div>
      </div>

      {/* Main Interactive Map for Drift */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Lagrangian Particle Trajectories & Probable Source Region
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Use the Map Layers button to toggle forward/backward trajectories
          </span>
        </div>

        <MapView activeCase={activeCase} heightClassName="h-[520px]" />
      </div>

      {/* Simulation Controls & Origin Reconstruction Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Origin Reconstruction Result */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Backward Drift Inversion Solution</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                SOURCE INTERCEPT
              </span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Residual Error: &lt; 0.45 km
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Estimated Origin Coordinates</div>
              <div className="text-sm font-bold font-mono text-amber-400 mt-1">
                {drift.probableSource.lat.toFixed(4)}° N, {drift.probableSource.lng.toFixed(4)}° E
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Off Dutch Traffic Separation Scheme</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Uncertainty Radius (95% CI)</div>
              <div className="text-sm font-bold font-mono text-cyan-300 mt-1">
                ± {drift.probableSource.uncertaintyRadiusKm} km
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Driven by wind gust variance</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Calculated Discharge Time</div>
              <div className="text-sm font-bold font-mono text-purple-300 mt-1">
                {drift.probableSource.estimatedDischargeTime.slice(0, 10)} {drift.probableSource.estimatedDischargeTime.slice(11, 19)} UTC
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">T-6.5 hours prior to SAR pass</div>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed pt-1">
            The backward advection model traces the observed slick centerline back against the vector sum of tidal currents and 3% wind leeway factor. The convergence of particle endpoints defines a high-confidence release box of 3.4 km radius. This provides the spatial search boundary for cross-referencing candidate AIS tracks.
          </p>
        </div>

        {/* Dynamic Parameter Tuning Controls */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white">Model Parameters</h3>
            <button
              onClick={() => {
                setSimDuration(12);
                setParticleCount(250);
                setTimeStep(15);
              }}
              className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex items-center justify-between text-slate-300 mb-1">
                <span>Simulation Horizon:</span>
                <span className="font-mono text-cyan-400 font-bold">{simDuration} hours</span>
              </div>
              <input
                type="range"
                min="4"
                max="48"
                step="4"
                value={simDuration}
                onChange={(e) => setSimDuration(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-slate-300 mb-1">
                <span>Particles Advected:</span>
                <span className="font-mono text-cyan-400 font-bold">{particleCount}</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="25"
                value={particleCount}
                onChange={(e) => setParticleCount(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-slate-300 mb-1">
                <span>Integration Timestep:</span>
                <span className="font-mono text-cyan-400 font-bold">{timeStep} min</span>
              </div>
              <select
                value={timeStep}
                onChange={(e) => setTimeStep(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono text-xs focus:border-cyan-500 focus:outline-none"
              >
                <option value={5}>5 minutes (High Fidelity / High Compute)</option>
                <option value={10}>10 minutes (Operational Standard)</option>
                <option value={15}>15 minutes (Balanced Default)</option>
                <option value={30}>30 minutes (Fast Scan)</option>
              </select>
            </div>

            <button
              onClick={handleRerunSimulation}
              disabled={isSimulating}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors mt-2"
            >
              {isSimulating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Recomputing OpenDrift...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Update Drift Trajectory</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
