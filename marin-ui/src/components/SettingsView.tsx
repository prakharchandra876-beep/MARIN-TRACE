import React, { useState } from 'react';
import { SystemSettings, ActiveCase } from '../types';
import {
  Settings,
  Sliders,
  CheckCircle2,
  ArrowLeft,
  Save,
  RotateCcw,
  ShieldCheck,
  Cpu,
  Waves,
  Radar,
  Lock,
  Volume2,
  Bell
} from 'lucide-react';

interface SettingsViewProps {
  settings: SystemSettings;
  onUpdateSettings: (newSettings: SystemSettings) => void;
  onBackToDashboard: () => void;
  cases: ActiveCase[];
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onBackToDashboard,
  cases
}) => {
  const [localSettings, setLocalSettings] = useState<SystemSettings>(settings);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = () => {
    onUpdateSettings(localSettings);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 2500);
  };

  const handleResetDefaults = () => {
    const defaults: SystemSettings = {
      detectionThreshold: 0.5,
      driftParticleCount: 250,
      driftTimeStepMin: 15,
      darkVesselBufferKm: 15.0,
      useSyntheticFallback: true,
      enableAlertSounds: false,
      autoRefreshAis: false,
      analyticsOptOut: true,
      strictGdprCompliance: true,
      activeCaseId: 'OW-2024-0982'
    };
    setLocalSettings(defaults);
    onUpdateSettings(defaults);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      {/* Header & Back Action */}
      <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <button
            id="settings-back-btn"
            onClick={onBackToDashboard}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Back to Command Center"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>System Settings & Model Calibration</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                VIEW 3
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Configure detection thresholds, drift physics fidelity, and operational preferences
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            id="settings-save-btn"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {/* Saved Notification Toast */}
      {showSavedToast && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-xl flex items-center justify-between text-xs text-emerald-200 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>System calibration updated successfully. Active parameters synchronized with pipeline core.</span>
          </div>
          <button
            onClick={onBackToDashboard}
            className="text-xs font-bold text-emerald-300 underline underline-offset-2"
          >
            Return to Dashboard →
          </button>
        </div>
      )}

      {/* Form Sections */}
      <div className="space-y-4">
        {/* Section 1: ML Model & Detection Thresholds */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              YOLOv8-seg Detection Calibration
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-300 font-medium">Confidence Score Threshold:</span>
                <span className="font-mono text-cyan-400 font-bold">
                  {(localSettings.detectionThreshold * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.20"
                max="0.90"
                step="0.05"
                value={localSettings.detectionThreshold}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, detectionThreshold: parseFloat(e.target.value) })
                }
                className="w-full accent-cyan-400"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Lowering threshold captures faint linear sheens but increases false alarms on natural biogenic look-alikes.
              </p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div>
                <div className="text-slate-200 font-semibold">Active Case Preset:</div>
                <div className="text-[11px] text-slate-400">Select standard test scene for simulation</div>
              </div>
              <select
                value={localSettings.activeCaseId}
                onChange={(e) => setLocalSettings({ ...localSettings, activeCaseId: e.target.value })}
                className="bg-slate-900 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Drift Physics Modeling */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Waves className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              OpenDrift Lagrangian Parameters
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-300 font-medium block mb-1">
                Particle Monte Carlo Count:
              </span>
              <select
                value={localSettings.driftParticleCount}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, driftParticleCount: parseInt(e.target.value) })
                }
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2 rounded-lg font-mono focus:outline-none"
              >
                <option value={100}>100 Particles (Fast Preview)</option>
                <option value={250}>250 Particles (Standard Balanced)</option>
                <option value={500}>500 Particles (High Fidelity Investigation)</option>
              </select>
            </div>

            <div>
              <span className="text-slate-300 font-medium block mb-1">
                Advection Timestep:
              </span>
              <select
                value={localSettings.driftTimeStepMin}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, driftTimeStepMin: parseInt(e.target.value) })
                }
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2 rounded-lg font-mono focus:outline-none"
              >
                <option value={5}>5 minutes (High Temporal Accuracy)</option>
                <option value={15}>15 minutes (Standard)</option>
                <option value={30}>30 minutes (Coarse Scan)</option>
              </select>
            </div>
          </div>

          {/* Toggle: Synthetic Fallback */}
          <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
            <div>
              <div className="text-slate-200 font-semibold text-xs">
                Synthetic Oceanographic Fallback:
              </div>
              <div className="text-[11px] text-slate-400">
                Use climatological wind/current defaults when NOAA/Copernicus API limits are reached
              </div>
            </div>
            <input
              type="checkbox"
              checked={localSettings.useSyntheticFallback}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, useSyntheticFallback: e.target.checked })
              }
              className="h-4 w-4 accent-cyan-400 rounded"
            />
          </label>
        </div>

        {/* Section 3: Radar & Dark Vessel Thresholds */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Radar className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Dark Vessel Correlation Settings
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div>
                <div className="text-slate-200 font-semibold">AIS Correlation Buffer Distance:</div>
                <div className="text-[11px] text-slate-400">
                  Search radius around spill origin to evaluate dark target proximity
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={localSettings.darkVesselBufferKm}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, darkVesselBufferKm: parseFloat(e.target.value) })
                  }
                  className="w-20 bg-slate-900 border border-slate-700 text-slate-200 px-2 py-1 rounded text-right font-mono"
                />
                <span className="text-slate-400 font-mono">km</span>
              </div>
            </div>

            {/* Toggle: Alert Chime */}
            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-slate-400" />
                <div>
                  <div className="text-slate-200 font-semibold text-xs">Tactical Audio Alerts:</div>
                  <div className="text-[11px] text-slate-400">Chime on new dark vessel detection</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={localSettings.enableAlertSounds}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, enableAlertSounds: e.target.checked })
                }
                className="h-4 w-4 accent-cyan-400 rounded"
              />
            </label>
          </div>
        </div>

        {/* Section 4: Privacy, Telemetry, and GDPR */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Data Privacy & GDPR Controls
            </h2>
          </div>

          <div className="space-y-2 text-xs">
            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
              <div>
                <div className="text-slate-200 font-semibold text-xs">
                  Telemetry & Analytics Opt-Out:
                </div>
                <div className="text-[11px] text-slate-400">
                  Block all diagnostic logging and third-party script pings
                </div>
              </div>
              <input
                type="checkbox"
                checked={localSettings.analyticsOptOut}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, analyticsOptOut: e.target.checked })
                }
                className="h-4 w-4 accent-emerald-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800 cursor-pointer">
              <div>
                <div className="text-slate-200 font-semibold text-xs">
                  Strict GDPR Maritime Compliance Mode:
                </div>
                <div className="text-[11px] text-slate-400">
                  Enforce non-prejudicial candidate designation on all exported evidence files
                </div>
              </div>
              <input
                type="checkbox"
                checked={localSettings.strictGdprCompliance}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, strictGdprCompliance: e.target.checked })
                }
                className="h-4 w-4 accent-emerald-500 rounded"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBackToDashboard}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Command Center</span>
        </button>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs shadow-lg shadow-cyan-500/20 transition-all"
        >
          Save & Apply Configuration
        </button>
      </div>
    </div>
  );
};
