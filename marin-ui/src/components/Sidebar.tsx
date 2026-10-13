import React from 'react';
import { DashboardTab, ActiveCase } from '../types';
import {
  LayoutDashboard,
  ScanEye,
  Waves,
  Ship,
  Radar,
  History,
  FileSpreadsheet,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  isAnalyzing?: boolean;
  currentStep?: string;
  activeCase?: ActiveCase;
}

interface NavItem {
  id: DashboardTab;
  label: string;
  stepNumber: string;
  icon: React.ElementType;
  badge?: string;
  description: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isAnalyzing,
  currentStep
}) => {
  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      stepNumber: '00',
      icon: LayoutDashboard,
      description: 'KPIs & Composite Maritime Map'
    },
    {
      id: 'spill-detection',
      label: 'Spill Detection',
      stepNumber: '01',
      icon: ScanEye,
      badge: '91.4%',
      description: 'SAR Image & AI Segmentation'
    },
    {
      id: 'drift-analysis',
      label: 'Drift Analysis',
      stepNumber: '02',
      icon: Waves,
      description: 'Forward & Backward Trajectories'
    },
    {
      id: 'vessel-attribution',
      label: 'Vessel Attribution',
      stepNumber: '03',
      badge: 'Top 4',
      icon: Ship,
      description: 'AIS Trajectory & Hausdorff Matching'
    },
    {
      id: 'dark-vessels',
      label: 'Dark Vessels',
      stepNumber: '04',
      badge: 'Alert',
      icon: Radar,
      description: 'SAR Radar vs AIS Transponder Gaps'
    },
    {
      id: 'historical-incidents',
      label: 'Historical Incidents',
      stepNumber: '05',
      icon: History,
      description: 'Regional Spill Incident Database'
    },
    {
      id: 'investigation-report',
      label: 'Investigation Report',
      stepNumber: '06',
      icon: FileSpreadsheet,
      description: 'Evidence Dossier & File Export'
    }
  ];

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-[#090e1b] border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      <div className="p-3 space-y-3">
        <div className="px-3 py-1 flex items-center justify-between text-slate-400">
          <span className="text-xs font-bold uppercase tracking-wider font-mono">
            Pipeline Workflow
          </span>
          <span className="text-xs bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
            7 Modules
          </span>
        </div>

        {/* Workflow Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isProcessingThisStep = isAnalyzing && currentStep === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-${item.id}-btn`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/40 text-cyan-200 border border-cyan-500/40 shadow-md shadow-cyan-950/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/60 hover:bg-slate-900/60'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-900 text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500 font-bold">
                        {item.stepNumber}
                      </span>
                      <span className="text-xs font-semibold text-slate-100 group-hover:text-white">
                        {item.label}
                      </span>
                    </div>
                   <p className="text-xs text-slate-400 max-w-[160px] whitespace-normal leading-tight mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                        item.badge === 'Alert'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-cyan-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isProcessingThisStep ? (
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
                  ) : (
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        isActive ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'
                      }`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Maritime Regulatory Compliance Notice */}
      <div className="p-3 m-3 rounded-xl bg-slate-900/90 border border-slate-800/90 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>MARPOL 73/78 Compliance</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Attribution algorithms use physics-based Lagrangian drift modeling and Hausdorff distance metrics.
          All designations are designated as <strong className="text-slate-300">"Candidate / Requires Investigation"</strong> for non-prejudicial evidential handling.
        </p>
        <div className="pt-1 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800">
          <span>NTRO / SIH 2024</span>
          <span className="font-mono text-cyan-400">UNCLOS Art. 217</span>
        </div>
      </div>
    </aside>
  );
};