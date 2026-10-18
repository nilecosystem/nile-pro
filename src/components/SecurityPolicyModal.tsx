import React from 'react';
import { NileTokenCoin } from './NileTokenCoin.tsx';
import { 
  ShieldCheck, 
  ExternalLink, 
  X, 
  CheckCircle, 
  Building, 
  Lock, 
  FileCheck,
  Scale
} from 'lucide-react';
import { OFFICIAL_SUPPORT_CHANNELS } from '../data/paymentConfig.ts';

interface SecurityPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityPolicyModal: React.FC<SecurityPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-[#091124] border-2 border-slate-800 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Statutory Governance & Security Proof</h2>
              <p className="text-xs text-slate-400">Verified Corporate Entities & On-Chain Ledger Proofs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* On-Chain Bitcoin Treasury Proof */}
        <div className="p-4 rounded-2xl bg-[#060B17] border border-amber-500/40 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <span>₿</span>
              <span>On-Chain Bitcoin Blockchain Treasury Proof</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Verified
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 break-all select-all">
            {OFFICIAL_SUPPORT_CHANNELS.onChainTreasuryBtcTxid}
          </div>
          <a
            href={`https://mempool.space/tx/${OFFICIAL_SUPPORT_CHANNELS.onChainTreasuryBtcTxid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E5B842] text-[11px] font-bold hover:underline flex items-center gap-1 pt-1"
          >
            <span>Verify on Bitcoin Public Mempool Explorer</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* 3 Statutory Corporate Registrations */}
        <div className="space-y-3 text-xs">
          <div className="font-bold text-white">Statutory Institutional Jurisdictions:</div>

          {/* UK */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between font-bold text-white">
              <span>1. United Kingdom (Companies House, Cardiff)</span>
              <span className="text-cyan-400 font-mono">Reg #08253865</span>
            </div>
            <div className="text-slate-400 text-[11px]">
              Entity: <strong>{OFFICIAL_SUPPORT_CHANNELS.registeredCompanyUK}</strong> · VAT: <strong>{OFFICIAL_SUPPORT_CHANNELS.vatUK}</strong>
            </div>
          </div>

          {/* Austria */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between font-bold text-white">
              <span>2. Austria Commercial Court Vienna (European Union)</span>
              <span className="text-emerald-400 font-mono">{OFFICIAL_SUPPORT_CHANNELS.commercialCourtVienna}</span>
            </div>
            <div className="text-slate-400 text-[11px]">
              EU VAT Registration: <strong>{OFFICIAL_SUPPORT_CHANNELS.vatAustria}</strong> · Schengen Compliant
            </div>
          </div>

          {/* Dubai */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between font-bold text-white">
              <span>3. United Arab Emirates (Dubai Federal Tax Authority)</span>
              <span className="text-amber-400 font-mono">{OFFICIAL_SUPPORT_CHANNELS.trnDubai}</span>
            </div>
            <div className="text-slate-400 text-[11px]">
              Jurisdiction: <strong>{OFFICIAL_SUPPORT_CHANNELS.taxAuthorityDubai}</strong>
            </div>
          </div>
        </div>

        {/* Zero Seed-Phrase Institutional Policy */}
        <div className="p-3.5 rounded-2xl bg-[#060B17] border border-slate-800 text-xs text-slate-300 space-y-1">
          <div className="font-bold text-white flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Non-Custodial Architecture & Zero Seed-Phrase Guarantee</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Client private keys remain 100% within your client-side Web3 provider. 
            All deposits execute through standard EIP-1193 RPC signatures.
          </p>
        </div>
      </div>
    </div>
  );
};
export default SecurityPolicyModal;
