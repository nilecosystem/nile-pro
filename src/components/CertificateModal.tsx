import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, ShieldCheck, Download, Award, CheckCircle, FileText, ExternalLink } from 'lucide-react';
import { OFFICIAL_CONTACT_INFO } from '../data/initialData.ts';

export const CertificateModal: React.FC = () => {
  const { 
    certificateModalOpen, 
    setCertificateModalOpen, 
    selectedCertificate, 
    setSelectedCertificate 
  } = useApp();

  if (!certificateModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#0B132B] border border-[#E5B842]/40 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#070D1B]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#E5B842]/10 text-[#E5B842]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Institutional Verification Documents
              </h3>
              <p className="text-xs text-slate-400">
                Official Regulatory & Compliance Credentials for NILE INVESTMENT LTD
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCertificate('incorporation')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedCertificate === 'incorporation' 
                  ? 'bg-[#E5B842] text-[#070D1B]' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Incorporation
            </button>
            <button
              onClick={() => setSelectedCertificate('compliance')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedCertificate === 'compliance' 
                  ? 'bg-[#E5B842] text-[#070D1B]' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Compliance
            </button>
            <button 
              onClick={() => setCertificateModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-2"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Canvas */}
        <div className="p-6 md:p-8 overflow-y-auto max-h-[75vh]">
          {selectedCertificate === 'incorporation' ? (
            /* Certificate of Incorporation */
            <div className="relative p-8 md:p-12 rounded-xl bg-[#FFFDF5] text-slate-900 border-8 border-double border-[#1E3A8A] shadow-inner font-serif">
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 text-xs text-[#1E3A8A] font-sans font-bold">★ ★ ★</div>
              <div className="absolute top-2 right-2 text-xs text-[#1E3A8A] font-sans font-bold">★ ★ ★</div>
              <div className="absolute bottom-2 left-2 text-xs text-[#1E3A8A] font-sans font-bold">★ ★ ★</div>
              <div className="absolute bottom-2 right-2 text-xs text-[#1E3A8A] font-sans font-bold">★ ★ ★</div>

              {/* Royal Arms Crest Emblem */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 mb-2 text-[#1E3A8A] flex items-center justify-center">
                  <Award className="w-14 h-14" />
                </div>
                <h2 className="text-xl md:text-2xl font-black tracking-widest text-[#0F172A] uppercase">
                  CERTIFICATE OF INCORPORATION
                </h2>
                <div className="text-xs md:text-sm tracking-wide text-slate-600 mt-1 uppercase">
                  OF A PRIVATE LIMITED COMPANY
                </div>
                <div className="mt-3 px-3 py-1 bg-amber-50 border border-amber-300 rounded text-xs font-mono font-bold text-amber-900">
                  Company Number: 08253865
                </div>
              </div>

              {/* Body Statement */}
              <div className="text-center my-6 space-y-4 text-sm md:text-base leading-relaxed text-slate-800">
                <p className="italic text-slate-600">I hereby certify that</p>
                <p className="text-xl md:text-2xl font-bold tracking-wider text-[#0F172A] uppercase">
                  NILE INVESTMENT LTD
                </p>
                <p className="max-w-xl mx-auto text-xs md:text-sm">
                  is this day incorporated under the Companies Act 2006 as a private limited company, and that the company is limited by shares.
                </p>
                <p className="text-xs md:text-sm pt-2">
                  Given at Companies House, Cardiff, the 11th day of October 2026.
                </p>
              </div>

              {/* Seal & Signature Section */}
              <div className="mt-10 pt-6 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Gold Seal */}
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 p-0.5 shadow-md flex items-center justify-center text-center">
                    <div className="w-14 h-14 rounded-full border-2 border-dashed border-amber-900 flex flex-col items-center justify-center">
                      <span className="text-[8px] font-black tracking-tighter text-amber-950 uppercase leading-none">SEAL OF</span>
                      <span className="text-[9px] font-bold text-amber-900 uppercase leading-none">REGISTRAR</span>
                      <span className="text-[7px] text-amber-950">CARDIFF</span>
                    </div>
                  </div>
                  <div className="text-left font-sans text-xs">
                    <div className="font-bold text-slate-900">Official Seal Affixed</div>
                    <div className="text-slate-500">Companies House Verified</div>
                  </div>
                </div>

                {/* Registrar Signature */}
                <div className="text-center sm:text-right font-sans">
                  <div className="italic text-sm font-semibold text-slate-800 font-serif border-b border-slate-400 pb-1">
                    Keith Gaston
                  </div>
                  <div className="text-xs font-bold text-slate-700 mt-1">Registrar of Companies</div>
                  <div className="text-[10px] text-slate-500">United Kingdom Commercial Registry</div>
                </div>
              </div>
            </div>
          ) : (
            /* Certificate of Compliance */
            <div className="relative p-8 md:p-12 rounded-xl bg-gradient-to-b from-[#0B1528] to-[#060B14] text-white border-4 border-[#E5B842] shadow-2xl font-sans">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-14 h-14 mb-3 rounded-full bg-[#E5B842]/20 border border-[#E5B842] flex items-center justify-center text-[#E5B842]">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h2 className="text-xl md:text-2xl font-black tracking-widest text-[#E5B842] uppercase">
                  CERTIFICATE OF COMPLIANCE
                </h2>
                <div className="text-xs md:text-sm tracking-widest text-slate-300 mt-0.5 uppercase">
                  & CORPORATE TRANSPARENCY
                </div>
                <div className="text-[11px] text-slate-400 italic mt-2">
                  This is to certify that
                </div>
                <div className="text-2xl md:text-3xl font-extrabold text-white mt-1 tracking-wider">
                  NILE INVESTMENT LTD
                </div>
              </div>

              <div className="max-w-xl mx-auto text-center text-xs md:text-sm text-slate-300 leading-relaxed my-6 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                has been officially verified and is hereby recognized for its adherence to regulatory standards, financial transparency, and institutional compliance.
              </div>

              {/* Compliance Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
                <div className="p-3 rounded-lg bg-slate-900/80 border border-[#E5B842]/30 text-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <div className="text-[10px] font-bold text-white uppercase">AML / KYC Tier 3</div>
                  <div className="text-[9px] text-slate-400">Institutional Protocol</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-[#E5B842]/30 text-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <div className="text-[10px] font-bold text-white uppercase">Capital Adequacy</div>
                  <div className="text-[9px] text-slate-400">Audited Reserves</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-[#E5B842]/30 text-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <div className="text-[10px] font-bold text-white uppercase">Data Privacy</div>
                  <div className="text-[9px] text-slate-400">GDPR & ISO Standard</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-[#E5B842]/30 text-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <div className="text-[10px] font-bold text-white uppercase">Smart Contract</div>
                  <div className="text-[9px] text-slate-400">Formal Verification</div>
                </div>
              </div>

              {/* Signoff */}
              <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-slate-500">Authorized Officer:</span>
                  <div className="font-bold text-white">Chief Compliance & Risk Directorate</div>
                  <div className="text-[10px] text-slate-500">Date of Inspection: {OFFICIAL_CONTACT_INFO.complianceCertDate}</div>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-bold">
                  Status: CURRENT & VERIFIED
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-[#070D1B] border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#E5B842]" />
            <span>Registration: Companies House Cardiff #08253865</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF Specimen
            </button>
            <button
              onClick={() => setCertificateModalOpen(false)}
              className="px-4 py-1.5 rounded-lg bg-[#E5B842] text-[#070D1B] font-bold hover:bg-[#F3BA2F] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
