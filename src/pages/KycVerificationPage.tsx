import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  ShieldCheck, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Lock, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  Award,
  Terminal,
  Code,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Camera,
  CheckCircle2,
  XCircle,
  Eye
} from 'lucide-react';
import { KycDocument } from '../types/index.ts';

export const KycVerificationPage: React.FC = () => {
  const { 
    user, 
    submitKyc, 
    kycPermissions, 
    kycSession, 
    initiateKycSession, 
    submitProviderVerification,
    simulateProviderWebhook,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'workflow' | 'api_docs' | 'provider_session'>('workflow');

  // Form State
  const [fullName, setFullName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '+44 7558 847468');
  const [address, setAddress] = useState('10 Downing Street, Westminster, London');
  const [country, setCountry] = useState('United Kingdom');
  const [docType, setDocType] = useState<'passport' | 'id_card' | 'drivers_license'>('passport');
  
  // Interactive simulated SDK modal
  const [showSdkModal, setShowSdkModal] = useState<boolean>(false);
  const [sdkStep, setSdkStep] = useState<'intro' | 'doc_capture' | 'selfie_liveness' | 'aml_screening' | 'complete'>('intro');
  const [isProcessingScreening, setIsProcessingScreening] = useState<boolean>(false);

  // Copied code snippet tracking
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);

  const copyCode = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeKey(key);
    showToast('API snippet copied to clipboard.', 'success');
    setTimeout(() => setCopiedCodeKey(null), 2000);
  };

  const [uploadedFiles, setUploadedFiles] = useState<KycDocument[]>([
    {
      type: 'passport',
      fileName: 'UK-Passport-Matin-Parsa.pdf',
      uploadedAt: '2026-01-15'
    },
    {
      type: 'proof_of_address',
      fileName: 'Barclays-Bank-ProofOfAddress.pdf',
      uploadedAt: '2026-01-15'
    }
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'passport' | 'id_card' | 'drivers_license' | 'proof_of_address') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newDoc: KycDocument = {
        type,
        fileName: file.name,
        uploadedAt: new Date().toISOString().substring(0, 10)
      };
      setUploadedFiles(prev => [...prev, newDoc]);
      showToast(`Uploaded ${file.name} successfully.`, 'info');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitKyc(uploadedFiles, {
      name: fullName,
      phone,
      address,
      country
    });
  };

  const startProviderVerificationFlow = async () => {
    await initiateKycSession('Sumsub');
    setSdkStep('intro');
    setShowSdkModal(true);
  };

  const handleCompleteSdkSim = async () => {
    setIsProcessingScreening(true);
    setSdkStep('aml_screening');
    await submitProviderVerification({
      applicantId: kycSession.applicantId,
      documentType: docType,
      livenessPassed: true,
      pepSanctionCheckPassed: true
    });
    setTimeout(() => {
      setIsProcessingScreening(false);
      setSdkStep('complete');
    }, 1600);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5B842]/10 border border-[#E5B842]/30 text-[#E5B842] text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>AML / CTF & Institutional Compliance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Identity & KYC/AML Verification
        </h1>
        <p className="text-xs text-slate-400">
          Required to unlock high-limit crypto cards (up to $100k), physical bullion ordering, and fiat withdrawals.
        </p>
      </div>

      {/* KYC Status Badge Banner with Feature Gate Indicators */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#091124] border border-[#E5B842]/40 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              user.kycStatus === 'verified'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : user.kycStatus === 'pending'
                  ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                  : 'bg-slate-800 text-slate-400'
            }`}>
              {user.kycStatus === 'verified' ? <CheckCircle className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white">Verification Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                  user.kycStatus === 'verified'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : user.kycStatus === 'pending'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-slate-800 text-slate-400'
                }`}>
                  {user.kycStatus === 'verified' ? `Tier ${user.kycTier} Institutional Verified` : user.kycStatus.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Account: <strong className="text-white font-mono">{user.accountNumber}</strong> · Risk Tier: <strong className="text-emerald-400 font-mono">LOW (AML-PASSED)</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={startProviderVerificationFlow}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-bold text-xs flex items-center gap-2 transition-all shadow-md"
            >
              <Camera className="w-4 h-4" />
              <span>Launch Provider SDK</span>
            </button>
          </div>
        </div>

        {/* Conditionally Enabled Feature Permissions Strip */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
            Conditionally Enabled Ecosystem Features & Permissions
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className={`p-3 rounded-2xl border ${
              kycPermissions.canWithdrawFiat 
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Fiat Withdrawals</span>
                {kycPermissions.canWithdrawFiat ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-slate-500" />}
              </div>
              <div className="text-[10px] mt-1 font-mono">
                {kycPermissions.canWithdrawFiat ? 'Unlocked (Tier 1+)' : 'Locked (Requires KYC)'}
              </div>
            </div>

            <div className={`p-3 rounded-2xl border ${
              kycPermissions.canOrderHighLimitCard 
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Cards up to $100k</span>
                {kycPermissions.canOrderHighLimitCard ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-slate-500" />}
              </div>
              <div className="text-[10px] mt-1 font-mono">
                {kycPermissions.canOrderHighLimitCard ? 'Unlocked (Tier 2+)' : 'Locked (Requires Tier 2)'}
              </div>
            </div>

            <div className={`p-3 rounded-2xl border ${
              kycPermissions.canInvestHighTier 
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold">High-Tier Vaults</span>
                {kycPermissions.canInvestHighTier ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-slate-500" />}
              </div>
              <div className="text-[10px] mt-1 font-mono">
                {kycPermissions.canInvestHighTier ? 'Unlocked (Institutional)' : 'Locked (> $10k USD)'}
              </div>
            </div>

            <div className="p-3 rounded-2xl border bg-slate-900 border-slate-800 text-slate-300">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Daily Withdrawal Limit</span>
                <span className="text-emerald-400 font-bold font-mono">Active</span>
              </div>
              <div className="text-[10px] mt-1 font-mono text-emerald-400">
                ${kycPermissions.maxDailyWithdrawalUsd.toLocaleString()} USD
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('workflow')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'workflow' ? 'bg-[#E5B842] text-[#070D1B]' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Identity Submission Workflow
        </button>

        <button
          onClick={() => setActiveTab('api_docs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
            activeTab === 'api_docs' ? 'bg-[#E5B842] text-[#070D1B]' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>API Documentation & Integration Points</span>
        </button>

        <button
          onClick={() => setActiveTab('provider_session')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
            activeTab === 'provider_session' ? 'bg-[#E5B842] text-[#070D1B]' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Provider Webhook Log ({kycSession.webhookLog.length})</span>
        </button>
      </div>

      {/* TAB 1: WORKFLOW FORM */}
      {activeTab === 'workflow' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Personal Details Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-[#E5B842]" />
              <span>Profile & Legal Identification Details</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Legal Name (as on Passport)</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Country of Tax Residence</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Residential Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                />
              </div>

              {/* Document Upload Area */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <label className="block text-slate-300 font-semibold">
                  Upload Identification Document (Passport, National ID or Driver's License)
                </label>

                <div className="flex gap-2">
                  {(['passport', 'id_card', 'drivers_license'] as const).map(d => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => setDocType(d)}
                      className={`py-2 px-3 rounded-xl capitalize font-semibold transition-colors ${
                        docType === d ? 'bg-[#E5B842] text-[#070D1B]' : 'bg-slate-900 text-slate-300'
                      }`}
                    >
                      {d.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                <div className="p-6 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/60 hover:bg-slate-900 flex flex-col items-center justify-center text-center cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload(e, docType)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="font-semibold text-slate-200">Click to upload document file or drag here</span>
                  <span className="text-[10px] text-slate-500 mt-1">Supports PDF, PNG, JPG up to 25MB</span>
                </div>
              </div>

              {/* Proof of Address Upload Area */}
              <div className="space-y-2 pt-2">
                <label className="block text-slate-300 font-semibold">
                  Proof of Address (Utility Bill or Bank Statement within 3 months)
                </label>
                <div className="p-4 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/60 hover:bg-slate-900 flex flex-col items-center justify-center text-center cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload(e, 'proof_of_address')}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <FileText className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs text-slate-300 font-semibold">Upload Utility Bill or Bank Statement</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#E5B842] hover:bg-[#F3BA2F] text-[#070D1B] font-bold transition-all shadow"
            >
              Submit KYC Documents for Review
            </button>
          </form>

          {/* Right: Uploaded Files & Audit Trail */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 space-y-4 text-xs">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#E5B842]" />
                <span>Submitted Documents ({uploadedFiles.length})</span>
              </h4>

              <div className="space-y-2">
                {uploadedFiles.map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{doc.fileName}</div>
                      <div className="text-[10px] text-slate-400 uppercase mt-0.5">{doc.type.replace('_', ' ')} · {doc.uploadedAt}</div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">VERIFIED</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 text-xs text-slate-400 space-y-2">
              <div className="font-bold text-slate-200">Data Protection & Privacy Safeguards</div>
              <p className="text-[11px] leading-relaxed">
                Identity documents are processed under strict UK GDPR & Data Protection Act 2018 guidelines, stored with AES-256 military-grade encryption, and never sold or shared with commercial marketing entities.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: API DOCUMENTATION & INTEGRATION SPECIFICATION */}
      {activeTab === 'api_docs' && (
        <div className="p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-8 text-xs">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-[#E5B842]" />
              <span>KYC & AML Verification Provider Integration Points</span>
            </h3>
            <p className="text-slate-400 mt-1">
              Complete specification for integrating external KYC providers (Sumsub, Onfido, Jumio) with the Nile Ecosystem.
            </p>
          </div>

          {/* Endpoint 1: Initiate Verification */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">POST</span>
                <span className="font-mono text-white font-bold">/api/v1/kyc/initiate</span>
              </div>
              <button
                onClick={() => copyCode('initiate', `curl -X POST https://api.nileecosystem.com/api/v1/kyc/initiate \\
  -H "Authorization: Bearer NILE_INSTITUTIONAL_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"applicantId": "usr-nile-001", "levelName": "tier3_institutional"}'`)}
                className="text-slate-400 hover:text-white flex items-center gap-1 font-mono text-[11px]"
              >
                {copiedCodeKey === 'initiate' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCodeKey === 'initiate' ? 'Copied' : 'Copy cURL'}</span>
              </button>
            </div>
            <p className="text-slate-400 text-[11px]">
              Initializes an identity verification session with the provider and returns an ephemeral SDK access token.
            </p>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] overflow-x-auto">
{`// 200 OK Response Payload
{
  "status": "success",
  "sessionId": "ses_sumsub_849204812a",
  "applicantId": "appl_nile_usr_001",
  "sdkToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "provider": "Sumsub",
  "requiredSteps": ["ID_DOCUMENT", "BIOMETRIC_SELFIE_LIVENESS", "AML_WATCHLIST_SCREENING"],
  "expiresInSeconds": 1800
}`}
            </pre>
          </div>

          {/* Endpoint 2: Inbound Webhook */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-mono font-bold">POST</span>
                <span className="font-mono text-white font-bold">/api/v1/kyc/webhook</span>
              </div>
              <span className="text-[10px] text-amber-400 font-mono">HMAC-SHA256 Signed</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Receives automated screening results from the KYC provider. Verifies incoming signatures against the shared secret header <code className="text-[#E5B842]">X-Payload-Digest</code>.
            </p>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] overflow-x-auto">
{`// Inbound Webhook Payload Format
{
  "eventId": "evt_wh_948194",
  "event": "applicantReviewed",
  "applicantId": "appl_nile_usr_001",
  "reviewResult": {
    "reviewAnswer": "GREEN",
    "reviewRejectType": null
  },
  "riskScore": "LOW",
  "pepSanctionsResult": {
    "isPep": false,
    "isSanctioned": false,
    "databasesScanned": ["OFAC", "EU_CONSOLIDATED", "UK_HMT", "INTERPOL_RED"]
  },
  "timestamp": "2026-10-13T19:42:00Z"
}`}
            </pre>
          </div>

          {/* Endpoint 3: Verification Status Query */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono font-bold">GET</span>
                <span className="font-mono text-white font-bold">/api/v1/kyc/status/:applicantId</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Read-Only</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Returns verified KYC status, current active tier (0-3), and feature gate permissions for withdrawals and card limits.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: PROVIDER SESSION & LOGS */}
      {activeTab === 'provider_session' && (
        <div className="p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6 text-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Active KYC Provider Session & Telemetry</h3>
              <p className="text-slate-400 mt-0.5">Live session token and cryptographic webhook event logs.</p>
            </div>
            <button
              onClick={() => startProviderVerificationFlow()}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Re-Initialize Session
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-slate-500 text-[10px] uppercase font-sans">Provider</div>
              <div className="font-bold text-white mt-1">{kycSession.provider}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-slate-500 text-[10px] uppercase font-sans">Applicant ID</div>
              <div className="font-bold text-white mt-1 truncate">{kycSession.applicantId}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-slate-500 text-[10px] uppercase font-sans">Screening Status</div>
              <div className="font-bold text-emerald-400 mt-1 uppercase">{kycSession.status}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-slate-500 text-[10px] uppercase font-sans">Risk Score</div>
              <div className="font-bold text-cyan-400 mt-1">{kycSession.riskScore}</div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Logged Inbound Webhook Payloads ({kycSession.webhookLog.length})
            </h4>

            <div className="space-y-2">
              {kycSession.webhookLog.map(wh => (
                <div key={wh.eventId} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#E5B842] font-bold">{wh.event}</span>
                    <span className="text-slate-500 text-[11px]">{wh.timestamp}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] break-all">{wh.payloadSummary}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Simulated KYC Provider SDK Modal */}
      {showSdkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="max-w-lg w-full bg-[#091124] border border-[#E5B842]/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-white text-sm">Sumsub Identity & AML Verification SDK</span>
              </div>
              <button onClick={() => setShowSdkModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {sdkStep === 'intro' && (
              <div className="space-y-4 text-xs">
                <p className="text-slate-300 leading-relaxed">
                  You are connecting to the verified institutional verification workflow for <strong className="text-white">NILE INVESTMENT LTD</strong> (Cardiff UK #08253865).
                </p>
                <div className="space-y-2 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Government Issued Passport or National ID</span>
                  </div>
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Live 3D Biometric Facial Scan</span>
                  </div>
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Instant Global Sanctions & PEP Check</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSdkStep('doc_capture')}
                  className="w-full py-3 rounded-2xl bg-[#E5B842] text-[#070D1B] font-bold text-xs uppercase tracking-wider"
                >
                  Continue to Document Scan
                </button>
              </div>
            )}

            {sdkStep === 'doc_capture' && (
              <div className="space-y-4 text-xs text-center">
                <div className="w-full h-44 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-2 relative overflow-hidden">
                  <div className="w-48 h-32 border-2 border-dashed border-[#E5B842]/60 rounded-xl flex items-center justify-center">
                    <span className="text-[11px] text-slate-400">Position Passport or ID Here</span>
                  </div>
                  <div className="absolute top-2 right-2 text-[10px] text-emerald-400 font-mono">Camera: Ready</div>
                </div>

                <p className="text-slate-400">
                  Ensure all 4 corners of your ID are visible and text is sharp without glare.
                </p>

                <button
                  type="button"
                  onClick={() => setSdkStep('selfie_liveness')}
                  className="w-full py-3 rounded-2xl bg-[#E5B842] text-[#070D1B] font-bold text-xs"
                >
                  Capture & Proceed to Selfie Liveness
                </button>
              </div>
            )}

            {sdkStep === 'selfie_liveness' && (
              <div className="space-y-4 text-xs text-center">
                <div className="w-36 h-36 mx-auto rounded-full bg-slate-950 border-2 border-[#E5B842] flex items-center justify-center relative overflow-hidden">
                  <User className="w-16 h-16 text-slate-600" />
                  <div className="absolute inset-0 border-4 border-emerald-400/30 rounded-full animate-ping" />
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">Look Straight into the Camera</h4>
                  <p className="text-slate-400 mt-1">Slowly turn your head in a circle to verify biometric 3D liveness.</p>
                </div>

                <button
                  type="button"
                  onClick={handleCompleteSdkSim}
                  disabled={isProcessingScreening}
                  className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#070D1B] font-bold text-xs flex items-center justify-center gap-2"
                >
                  {isProcessingScreening ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>{isProcessingScreening ? 'Screening AML Watchlists...' : 'Complete Liveness & Scan AML'}</span>
                </button>
              </div>
            )}

            {sdkStep === 'aml_screening' && (
              <div className="py-8 text-center space-y-4 text-xs">
                <RefreshCw className="w-10 h-10 text-[#E5B842] animate-spin mx-auto" />
                <h4 className="font-bold text-white text-sm">Automated AML & PEP Screening in Progress</h4>
                <p className="text-slate-400 max-w-sm mx-auto">
                  Cross-referencing global sanctions lists, Interpol databases, and biometric facial matches...
                </p>
              </div>
            )}

            {sdkStep === 'complete' && (
              <div className="py-4 text-center space-y-4 text-xs">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Verification Approved (Green)</h4>
                  <p className="text-emerald-400 font-mono text-xs mt-1">Risk Score: LOW · Zero Sanction Matches</p>
                  <p className="text-slate-400 text-xs mt-2">
                    Tier 3 full ecosystem limits, fiat withdrawals, and $100k crypto cards are now unlocked on your account.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSdkModal(false)}
                  className="w-full py-3 rounded-2xl bg-[#E5B842] text-[#070D1B] font-bold text-xs"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
