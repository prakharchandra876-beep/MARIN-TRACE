import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X } from 'lucide-react';

interface CookieBannerProps {
  onOpenCookiePolicy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenCookiePolicy }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('oilwatch_cookie_consent');
    if (!consent) {
      setIsOpen(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('oilwatch_cookie_consent', 'accepted');
    setIsOpen(false);
  };

  const handleNecessaryOnly = () => {
    localStorage.setItem('oilwatch_cookie_consent', 'necessary_only');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      role="region"
      aria-label="Cookie and Data Privacy Consent"
      className="fixed bottom-3 left-3 right-3 sm:left-6 sm:right-auto sm:max-w-md z-[2000] bg-slate-900/95 border border-slate-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-md text-slate-200 text-xs space-y-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 font-bold text-white text-sm">
          <Cookie className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Privacy & Cookie Transparency</span>
        </div>
        <button
          onClick={handleNecessaryOnly}
          className="text-slate-400 hover:text-white p-1"
          aria-label="Close cookie banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-[11px] text-slate-300 leading-relaxed">
        OilWatch uses strictly necessary local browser storage to preserve your simulation parameters and layer toggles. We do <strong className="text-white">not</strong> deploy third-party advertising cookies or cross-site tracking pixels.
      </p>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          id="cookie-accept-all-btn"
          onClick={handleAcceptAll}
          className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs transition-colors"
        >
          Accept Necessary
        </button>

        <button
          id="cookie-policy-btn"
          onClick={() => {
            onOpenCookiePolicy();
            setIsOpen(false);
          }}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-slate-700 rounded-lg text-xs transition-colors"
        >
          Cookie Policy
        </button>
      </div>
    </div>
  );
};
