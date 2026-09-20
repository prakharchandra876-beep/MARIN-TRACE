import React, { useEffect, useState } from 'react';
import { CheckCircle2, RotateCw, Sparkles, ShieldAlert, Waves, Ship, Radar, FileCheck } from 'lucide-react';

interface AnalysisProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface PipelineStep {
  id: string;
  name: string;
  desc: string;
  icon: React.ElementType;
}

export const AnalysisProgressModal: React.FC<AnalysisProgressModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const steps: PipelineStep[] = [
    {
      id: 'detection',
      name: 'SAR Image Detection & Masking',
      desc: 'Running YOLOv8-seg inference on Sentinel-1 C-band backscatter...',
      icon: ShieldAlert
    },
    {
      id: 'drift',
      name: 'Lagrangian Drift Simulation',
      desc: 'Advecting 250 particles forward and backward with NOAA HRRR & CMEMS...',
      icon: Waves
    },
    {
      id: 'ais',
      name: 'AIS Spatiotemporal Attribution',
      desc: 'Filtering 24h vessel trajectories & computing Hausdorff distance scores...',
      icon: Ship
    },
    {
      id: 'dark',
      name: 'Dark Vessel Radar Correlation',
      desc: 'Cross-referencing SAR CFAR targets against AIS transponder gaps...',
      icon: Radar
    },
    {
      id: 'complete',
      name: 'Investigation Report Assembly',
      desc: 'Synthesizing evidence dossier and updating tactical command center.',
      icon: FileCheck
    }
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setProgressPercent(0);
      setLogs([]);
      setIsFinished(false);
      return;
    }

    setLogs(['[06:14:22 UTC] Initializing OilWatch automated pipeline...', '[06:14:23 UTC] Sentinel-1A Level-1 GRD SAR scene loaded.']);

    const interval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsFinished(true);
          onComplete();
          return 100;
        }
        const next = prev + 5;

        // Step transitions based on percentage
        if (next >= 25 && next < 50) {
          setCurrentStepIndex(1);
          setLogs((l) => l.includes('[06:14:24] Oil slick detected. Confidence: 91.4%. Classified: Linear Slick.') ? l : [...l, '[06:14:24] Oil slick detected. Confidence: 91.4%. Classified: Linear Slick.', '[06:14:25] Extracting morphological centerline skeleton.']);
        } else if (next >= 50 && next < 75) {
          setCurrentStepIndex(2);
          setLogs((l) => l.includes('[06:14:26] OpenDrift Lagrangian model solved backward to 53.56N 4.11E.') ? l : [...l, '[06:14:26] OpenDrift Lagrangian model solved backward to 53.56N 4.11E.', '[06:14:27] Pre-screening 4 candidate vessels within 15km corridor.']);
        } else if (next >= 75 && next < 95) {
          setCurrentStepIndex(3);
          setLogs((l) => l.includes('[06:14:28] Ranked Candidate #1: GREEN PIONEER (IMO 9418743), Hausdorff: 1.12 km.') ? l : [...l, '[06:14:28] Ranked Candidate #1: GREEN PIONEER (IMO 9418743), Hausdorff: 1.12 km.', '[06:14:29] Dark vessel radar contact detected: SAR-TGT-0982-14 (4.8h AIS gap).']);
        } else if (next >= 95) {
          setCurrentStepIndex(4);
          setLogs((l) => l.includes('[06:14:30] Evidence dossier compiled. Risk matrix validated.') ? l : [...l, '[06:14:30] Evidence dossier compiled. Risk matrix validated.']);
        }

        return next;
      });
    }, 180);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              {isFinished ? <Sparkles className="w-5 h-5 text-emerald-400" /> : <RotateCw className="w-5 h-5 animate-spin text-cyan-400" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>OilWatch Automated Pipeline Execution</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  MOCK RUN
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                End-to-end processing: Detection → Drift → Attribution → Report
              </p>
            </div>
          </div>
          {isFinished && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700"
            >
              Close
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">
              {steps[currentStepIndex]?.name}
            </span>
            <span className="font-mono text-cyan-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step Items */}
        <div className="space-y-2">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentStepIndex || (idx === steps.length - 1 && isFinished);
            const isCurrent = idx === currentStepIndex && !isFinished;

            return (
              <div
                key={step.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                  isCurrent
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200'
                    : isCompleted
                    ? 'bg-slate-850/60 border-slate-800 text-slate-300'
                    : 'bg-slate-900/40 border-slate-800/40 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : isCurrent
                        ? 'bg-cyan-500/20 text-cyan-400 animate-pulse'
                        : 'bg-slate-800 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold">{step.name}</div>
                    <div className="text-[10px] text-slate-400">{step.desc}</div>
                  </div>
                </div>

                <div>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <RotateCw className="w-4 h-4 text-cyan-400 animate-spin" />
                  ) : (
                    <span className="text-[10px] font-mono text-slate-600">PENDING</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Console Log Preview */}
        <div className="bg-black/50 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 h-28 overflow-y-auto space-y-1">
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">
            Execution Console Stream
          </div>
          {logs.map((log, i) => (
            <div key={i} className="text-slate-400 flex items-start gap-1">
              <span className="text-cyan-500 select-none">&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {isFinished ? (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold rounded-lg text-xs hover:opacity-95 shadow-lg shadow-emerald-500/20 transition-all"
            >
              View Analysis in Dashboard
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-slate-400 hover:text-white text-xs"
            >
              Run in Background
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
