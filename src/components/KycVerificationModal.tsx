import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  ShieldCheck, 
  Upload, 
  Camera, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Lock, 
  X,
  Clock,
  Sparkles
} from 'lucide-react';

interface KycVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KycVerificationModal: React.FC<KycVerificationModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUser, showToast } = useApp();

  const [activeTier, setActiveTier] = useState<1 | 2 | 3>(1);
  const [docType, setDocType] = useState<'passport' | 'id_card' | 'drivers_license'>('passport');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSimulatedUpload = () => {
    setUploadedFile('verified_document_scan_oct2026.pdf');
    showToast('Document uploaded successfully. Ready for compliance screening.', 'success');
  };

  const handleSubmitKyc = () => {
    if (!uploadedFile) {
      showToast('Please upload or capture the requested verification document', 'error');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      updateUser({ kycStatus: 'verified' });
      showToast(`Tier ${activeTier} verification submitted! Automated screening in progress.`, 'success');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-[#091124] border-2 border-slate-800 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Graduated 3-Tier KYC Framework</h2>
              <p className="text-xs text-slate-400">Compliance verified via Sumsub & UK Companies House standard.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Tier Pills */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { tier: 1 as const, title: 'Tier 1: Identity ID', desc: 'Unlocks Unlimited Deposits' },
            { tier: 2 as const, title: 'Tier 2: Selfie + ID', desc: 'Liquid Payouts up to $5k/day' },
            { tier: 3 as const, title: 'Tier 3: Proof Address', desc: 'Investment Disbursements' }
          ].map(t => (
            <button
              key={t.tier}
              onClick={() => { setActiveTier(t.tier); setUploadedFile(null); }}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                activeTier === t.tier
                  ? 'bg-slate-900 border-[#E5B842] shadow-md shadow-[#E5B842]/10'
                  : 'bg-[#070D1B] border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className={`font-bold text-xs ${activeTier === t.tier ? 'text-white' : 'text-slate-300'}`}>
                {t.title}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">{t.desc}</div>
            </button>
          ))}
        </div>

        {/* Tier Requirements Content */}
        <div className="p-5 rounded-2xl bg-[#060B17] border border-slate-800 space-y-4 text-xs">
          {activeTier === 1 && (
            <div className="space-y-3">
              <div className="font-bold text-white">Tier 1: Government Identity Document</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Upload a clear color scan of your valid Passport, National Identity Card, or Driver's License. 
                Grants instant permission for unrestricted cryptocurrency and card deposits.
              </p>
              <div>
                <label className="text-slate-400">Select Document Type:</label>
                <div className="flex gap-2 mt-1">
                  {['passport', 'id_card', 'drivers_license'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDocType(d as any)}
                      className={`px-3 py-1.5 rounded-xl capitalize font-mono text-[11px] border cursor-pointer ${
                        docType === d ? 'bg-[#E5B842] text-[#070D1B] font-bold border-[#E5B842]' : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      {d.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTier === 2 && (
            <div className="space-y-3">
              <div className="font-bold text-white">Tier 2: Live Selfie Holding Physical Document</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Hold your physical ID alongside a handwritten note with today's date and "NILE ECOSYSTEM". 
                Unlocks liquid wallet withdrawals up to $5,000 USD / day.
              </p>
            </div>
          )}

          {activeTier === 3 && (
            <div className="space-y-3">
              <div className="font-bold text-white">Tier 3: Certified Proof of Address (&lt;90 Days Old)</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Upload a certified utility bill (electricity, water, gas) or bank account statement issued within the last 90 days. 
                Mandatory legal requirement to unlock Investment Ledger disbursements (Principal & Yield) with unlimited institutional limits.
              </p>
            </div>
          )}

          {/* Upload Dropzone */}
          <div 
            onClick={handleSimulatedUpload}
            className="p-6 border-2 border-dashed border-slate-700 hover:border-[#E5B842] rounded-2xl text-center space-y-2 cursor-pointer transition-colors bg-slate-900/40"
          >
            <Upload className="w-6 h-6 text-[#E5B842] mx-auto" />
            <div className="font-bold text-white">
              {uploadedFile ? uploadedFile : 'Click to Upload Document (PDF, JPG, PNG up to 25MB)'}
            </div>
            <div className="text-[11px] text-slate-500">
              {uploadedFile ? 'Document attached. Click submit below.' : 'End-to-end encrypted 256-bit AES storage'}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-1/3 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitKyc}
            disabled={isSubmitting}
            className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? 'Transmitting to Compliance Node...' : `Submit Tier ${activeTier} for Review`}
          </button>
        </div>
      </div>
    </div>
  );
};
export default KycVerificationModal;
