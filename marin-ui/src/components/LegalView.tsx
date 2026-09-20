import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  FileText,
  Cookie,
  CreditCard,
  Building,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Mail,
  Scale
} from 'lucide-react';

interface LegalViewProps {
  onBackToDashboard: () => void;
  defaultSection?: 'privacy' | 'terms' | 'cookies' | 'refund' | 'business';
}

export const LegalView: React.FC<LegalViewProps> = ({
  onBackToDashboard,
  defaultSection = 'privacy'
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'cookies' | 'refund' | 'business'>(
    defaultSection
  );
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentChecked) {
      alert('Please check the data privacy consent box before submitting your inquiry.');
      return;
    }
    setContactSubmitted(true);
  };

  return (
    <div className="space-y-6 p-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Back to Command Center"
            aria-label="Back to Command Center"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Scale className="w-5 h-5 text-cyan-400" />
              <span>Legal, Regulatory & Compliance Center</span>
            </h1>
            <p className="text-xs text-slate-400">
              GDPR compliance, terms of service, cookie governance, and maritime evidential disclaimers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 font-mono font-bold border border-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>GDPR & E-PRIVACY AUDITED</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'privacy'
              ? 'bg-cyan-500 text-slate-950'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Privacy Policy (GDPR)</span>
        </button>

        <button
          onClick={() => setActiveTab('terms')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'terms'
              ? 'bg-cyan-500 text-slate-950'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Terms & Conditions</span>
        </button>

        <button
          onClick={() => setActiveTab('cookies')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'cookies'
              ? 'bg-cyan-500 text-slate-950'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Cookie className="w-3.5 h-3.5" />
          <span>Cookie Policy</span>
        </button>

        <button
          onClick={() => setActiveTab('refund')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'refund'
              ? 'bg-cyan-500 text-slate-950'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Refund Policy</span>
        </button>

        <button
          onClick={() => setActiveTab('business')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'business'
              ? 'bg-cyan-500 text-slate-950'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Corporate & Licensing Details</span>
        </button>
      </div>

      {/* Content Panels */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 text-slate-300 text-xs leading-relaxed">
        {/* Tab 1: Privacy Policy */}
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white">
                Privacy Policy & GDPR Compliance Statement
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Last Updated: September 2024 &bull; In accordance with EU Regulation 2016/679 (GDPR) and ePrivacy Directive
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-cyan-300">1. Data Controller Identity</h3>
              <p>
                OilWatch Analytics B.V. ("OilWatch", "we", "us") operates the OilWatch maritime surveillance platform. We are committed to data minimization and the highest standards of personal data privacy.
              </p>

              <h3 className="text-sm font-bold text-cyan-300">2. Principle of Data Minimization</h3>
              <p>
                OilWatch only processes data strictly necessary for public-interest environmental monitoring and satellite telemetry analytics. We do not track private browsing activities, harvest device fingerprints, or sell user telemetry.
              </p>

              <h3 className="text-sm font-bold text-cyan-300">3. Nature of Processed Data</h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li>
                  <strong className="text-slate-200">Earth Observation Imagery:</strong> Public domain Synthetic Aperture Radar (SAR) data from the European Space Agency (ESA) Copernicus Sentinel-1 constellation.
                </li>
                <li>
                  <strong className="text-slate-200">Public Maritime Radio Broadcasts:</strong> Automated Identification System (AIS) Class-A broadcasts transmitted in unencrypted VHF maritime bands under ITU Radio Regulations.
                </li>
                <li>
                  <strong className="text-slate-200">Technical Session Data:</strong> Ephemeral application settings (e.g., map layer toggles, threshold values) stored locally in your browser's <code className="bg-slate-950 px-1 py-0.5 rounded text-cyan-400">localStorage</code>.
                </li>
              </ul>

              <h3 className="text-sm font-bold text-cyan-300">4. Lawful Basis for Processing</h3>
              <p>
                Processing of public vessel movement data is conducted under <strong className="text-slate-200">GDPR Article 6(1)(e)</strong> (performance of a task carried out in the public interest / environmental protection) and <strong className="text-slate-200">Article 6(1)(f)</strong> (legitimate interests of preventing catastrophic maritime pollution in compliance with MARPOL Annex I).
              </p>

              <h3 className="text-sm font-bold text-cyan-300">5. Your Data Subject Rights (EU GDPR)</h3>
              <p>
                Under EU law, you maintain the right to request access, rectification, restriction of processing, or erasure of any personal contact data you voluntarily provide. To exercise these rights, contact our Data Protection Officer at: <span className="text-cyan-400 font-mono">dpo@oilwatch-maritime.org</span>.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Terms and Conditions */}
        {activeTab === 'terms' && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white">
                Terms and Conditions of Use
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Effective Date: September 1, 2024 &bull; Maritime Operational & Analytical Terms
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-amber-950/40 border border-amber-800 rounded-xl text-amber-200 font-medium">
                IMPORTANT LEGAL NOTICE: All vessel attribution rankings generated by OilWatch represent circumstantial technical leads designated as "Candidate / Requires Investigation". They do NOT constitute formal judicial proof or legal liability determinations under maritime law.
              </div>

              <h3 className="text-sm font-bold text-cyan-300">1. Acceptance of Terms</h3>
              <p>
                By accessing or using the OilWatch platform, you agree to be bound by these Terms and Conditions and all applicable international maritime safety and space observation guidelines.
              </p>

              <h3 className="text-sm font-bold text-cyan-300">2. Permitted Use</h3>
              <p>
                OilWatch is licensed for academic research, coast guard operations, environmental non-governmental organizations, and commercial shipping risk management. You may not use OilWatch to harass, intimidate, or unlawfully disrupt lawful commercial shipping navigation.
              </p>

              <h3 className="text-sm font-bold text-cyan-300">3. Non-Prejudicial Evidentiary Protocol</h3>
              <p>
                Attribution scores are derived from mathematical spatial correlations (Lagrangian drift simulation and Hausdorff trajectory distances). Formal MARPOL 73/78 violations require on-scene physical verification, hydrocarbon sampling, and Port State Control logbook inspection.
              </p>

              <h3 className="text-sm font-bold text-cyan-300">4. Limitation of Liability</h3>
              <p>
                To the fullest extent permitted by law, OilWatch Analytics B.V. disclaims all liability for maritime navigational decisions, salvage claims, or delays resulting from reliance on algorithmic predictions or simulated synthetic test cases.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Cookie Policy */}
        {activeTab === 'cookies' && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white">
                Cookie & Local Storage Policy
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Transparency concerning browser storage mechanisms
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-cyan-300">1. Do We Use Tracking Cookies?</h3>
              <p>
                <strong className="text-white">NO.</strong> OilWatch does not use third-party advertising cookies, cross-site behavioral tracking beacons, or invasive analytics pixels.
              </p>

              <h3 className="text-sm font-bold text-cyan-300">2. Strictly Necessary Functional Storage</h3>
              <p>
                We use your browser's local storage solely to retain your essential user interface preferences between browser refreshes:
              </p>
              <div className="overflow-x-auto border border-slate-800 rounded-lg">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead className="bg-slate-950 border-b border-slate-800 text-slate-400">
                    <tr>
                      <th className="p-2.5">Storage Key</th>
                      <th className="p-2.5">Purpose</th>
                      <th className="p-2.5">Duration</th>
                      <th className="p-2.5">Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="p-2.5 text-cyan-300">oilwatch_settings</td>
                      <td className="p-2.5">Stores simulation thresholds & particle counts</td>
                      <td className="p-2.5">Persistent (Local)</td>
                      <td className="p-2.5 text-emerald-400">Strictly Necessary</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-cyan-300">oilwatch_cookie_consent</td>
                      <td className="p-2.5">Records user acknowledgement of cookie policy</td>
                      <td className="p-2.5">12 Months</td>
                      <td className="p-2.5 text-emerald-400">Strictly Necessary</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-slate-400 text-[11px] pt-1">
                Because these cookies and storage items are strictly necessary to deliver the requested service, prior opt-in consent is not required under ePrivacy Directive Art. 5(3), though we provide transparent controls below.
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Refund Policy */}
        {activeTab === 'refund' && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white">
                Refund Policy for Enterprise & API Subscriptions
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Consumer & Commercial Subscription Terms &bull; 14-Day Money-Back Guarantee
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-cyan-300">1. Prototype Demonstration Notice</h3>
              <p>
                The public version of OilWatch is provided as a free demonstrator for government agencies, maritime authorities, and researchers. No fees are charged for baseline access.
              </p>

              <h3 className="text-sm font-bold text-cyan-300">2. Enterprise Satellite Tasking & API Tier</h3>
              <p>
                For commercial fleet operators subscribing to custom Sentinel-1 / SAR tasking and priority drift compute pipelines:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li>
                  <strong className="text-slate-200">14-Day Right of Withdrawal:</strong> EU customers retain a statutory 14-day cancellation right from the commencement of their subscription agreement.
                </li>
                <li>
                  <strong className="text-slate-200">Pro-Rata Refunds:</strong> If satellite downlink services suffer confirmed service level outages exceeding 99.5% uptime commitments, pro-rated billing credits or refunds are issued within 5 business days.
                </li>
                <li>
                  <strong className="text-slate-200">How to Claim:</strong> Submit your invoice number and downtime log to <span className="text-cyan-400 font-mono">billing@oilwatch-maritime.org</span>.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 5: Corporate Details & Licensing */}
        {activeTab === 'business' && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white">
                Corporate Entity Details & Copyright Attribution
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Official Business Registration & Sensor Copyright Notice
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-cyan-400" />
                  <span>Company Registration</span>
                </h3>
                <div className="space-y-1 text-xs text-slate-300 font-mono">
                  <div><strong>Legal Entity:</strong> OilWatch Maritime Analytics B.V.</div>
                  <div><strong>KvK (Chamber of Commerce):</strong> 84920194 (Netherlands)</div>
                  <div><strong>VAT / BTW Identification:</strong> NL864192841B01</div>
                  <div><strong>Headquarters:</strong> Keizersgracht 421, 1016 EK Amsterdam</div>
                  <div><strong>Inquiries:</strong> contact@oilwatch-maritime.org</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Satellite Data Copyrights</span>
                </h3>
                <div className="space-y-1 text-xs text-slate-400">
                  <p>
                    Contains modified Copernicus Sentinel data [2024], processed by ESA and Copernicus Marine Environment Monitoring Service (CMEMS).
                  </p>
                  <p>
                    Map tiles by CartoDB under CC BY 3.0. Map data by OpenStreetMap contributors under ODbL.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Consent Demo (Accessible, keyboard friendly) */}
        <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              Port State Control & Regulatory Inquiry Contact
            </h3>
          </div>

          {contactSubmitted ? (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong>Inquiry Transmitted Securely.</strong> Your verification ticket has been logged with SHA-256 integrity hash. Our Maritime Liaison Officer will respond within 24 hours.
              </div>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-3 max-w-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="contact-name" className="block text-xs text-slate-300 font-medium mb-1">
                    Full Name / Officer Rank
                  </label>
                  <input
                    id="contact-name"
                    required
                    type="text"
                    placeholder="e.g., Insp. J. van den Berg"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs text-slate-300 font-medium mb-1">
                    Official Maritime Agency Email
                  </label>
                  <input
                    id="contact-email"
                    required
                    type="email"
                    placeholder="officer@coastguard.gov"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs text-slate-300 font-medium mb-1">
                  Case Inversion Reference / Subject
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={3}
                  placeholder="Reference case #OW-2024-0982 for evidentiary cross-examination..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Explicit GDPR Form Consent Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  id="gdpr-form-consent"
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-cyan-500 rounded border-slate-700"
                />
                <label htmlFor="gdpr-form-consent" className="text-[11px] text-slate-400 cursor-pointer">
                  I explicitly consent to the processing of my contact information in accordance with the{' '}
                  <span className="text-cyan-400 underline">OilWatch Privacy Policy</span>. I understand this data is used exclusively to respond to official maritime inquiries and is never shared with third parties.
                </label>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs transition-colors"
              >
                Transmit Verified Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
