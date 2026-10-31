import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  User, 
  ShieldCheck, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Lock, 
  MapPin, 
  Phone, 
  Mail, 
  Award, 
  Copy, 
  Check, 
  CreditCard, 
  ArrowRight, 
  DollarSign, 
  Code2, 
  Play, 
  Zap,
  Globe,
  RefreshCw,
  Building2,
  TrendingUp,
  Shield,
  Layers,
  Camera,
  Sparkles,
  Trash2,
  Image as ImageIcon,
  Fingerprint
} from 'lucide-react';
import { KycDocument } from '../types/index.ts';
import { ChangeProfilePicModal } from '../components/ChangeProfilePicModal.tsx';

export const UserProfilePage: React.FC = () => {
  const { 
    user, 
    updateUser, 
    balances, 
    kycSession, 
    kycPermissions, 
    initiateKycSession, 
    submitProviderVerification, 
    simulateProviderWebhook, 
    badges, 
    claimBadge, 
    referralTiers, 
    submitKyc, 
    showToast,
    setActiveTab,
    toggleBiometric2FA,
    registerDeviceBiometrics
  } = useApp();

  const [activeTabLocal, setActiveTabLocal] = useState<'profile' | 'kyc' | 'aml_api' | 'badges' | 'permissions'>('profile');
  const [isPicModalOpen, setIsPicModalOpen] = useState(false);

  // Profile Edit State
  const [fullName, setFullName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '+44 7558 847468');
  const [email, setEmail] = useState(user.email);
  const [address, setAddress] = useState(user.address || '10 Downing Street, Westminster');
  const [city, setCity] = useState(user.city || 'London');
  const [postalCode, setPostalCode] = useState(user.postalCode || 'SW1A 2AA');
  const [country, setCountry] = useState(user.country || 'United Kingdom');
  const [twoFactor, setTwoFactor] = useState(user.twoFactorEnabled);

  // KYC Document Upload State
  const [uploadedDocs, setUploadedDocs] = useState<KycDocument[]>(user.kycDocuments || [
    { type: 'passport', fileName: 'UK-Passport-Matin-Parsa.pdf', uploadedAt: '2026-01-15' },
    { type: 'proof_of_address', fileName: 'Barclays-Bank-ProofOfAddress.pdf', uploadedAt: '2026-01-15' }
  ]);
  const [docUploadType, setDocUploadType] = useState<'passport' | 'id_card' | 'drivers_license' | 'proof_of_address'>('passport');

  // AML API Sandbox test state
  const [apiSimulating, setApiSimulating] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'Sumsub' | 'Onfido' | 'Jumio' | 'ShuftiPro'>('Sumsub');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: fullName,
      phone,
      email,
      address,
      city,
      postalCode,
      country,
      twoFactorEnabled: twoFactor
    });
    showToast('Personal profile and contact information updated successfully.', 'success');
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newDoc: KycDocument = {
        type: docUploadType,
        fileName: file.name,
        uploadedAt: new Date().toISOString().substring(0, 10)
      };
      const nextDocs = [...uploadedDocs, newDoc];
      setUploadedDocs(nextDocs);
      updateUser({ kycDocuments: nextDocs });
      showToast(`Uploaded ${file.name} for verification review.`, 'info');
    }
  };

  const handleSubmitKycWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    submitKyc(uploadedDocs, {
      name: fullName,
      phone,
      address: `${address}, ${city}, ${postalCode}`,
      country
    });
  };

  const handleInitiateProviderSession = async () => {
    setApiSimulating(true);
    await initiateKycSession(selectedProvider);
    setApiSimulating(false);
  };

  const handleRunMockLivenessAndAml = async () => {
    setApiSimulating(true);
    await submitProviderVerification({
      applicantId: kycSession.applicantId,
      documentType: 'PASSPORT_BIOMETRIC',
      livenessPassed: true,
      pepSanctionCheckPassed: true
    });
    setApiSimulating(false);
  };

  // Find user's tier config
  const currentTierConfig = referralTiers.find(t => t.rank === user.rank) || referralTiers[4];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* User Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#091124] border border-[#E5B842]/40 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* User Avatar with Edit Photo Action */}
            <div 
              onClick={() => setIsPicModalOpen(true)}
              className="relative w-20 h-20 rounded-3xl overflow-hidden border-2 border-[#E5B842] shadow-xl shadow-[#E5B842]/20 bg-[#070D1B] shrink-0 cursor-pointer group select-none"
              title="Click to Change Photo / Upload My Pic"
            >
              {user.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={user.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/default-avatar.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-black text-2xl flex items-center justify-center">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}

              {/* Hover overlay with camera icon */}
              <div className="absolute inset-0 bg-black/65 backdrop-blur-xs flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-[#E5B842]" />
                <span className="text-[9px] font-bold mt-0.5 text-[#E5B842]">Change Pic</span>
              </div>

              {/* Camera Badge icon */}
              <div className="absolute bottom-1 right-1 p-1 rounded-lg bg-[#E5B842] text-[#070D1B] shadow group-hover:opacity-0 transition-opacity">
                <Camera className="w-3 h-3" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-white">{user.name}</h1>
                <span 
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider shadow"
                  style={{ backgroundColor: `${currentTierConfig.color}25`, color: currentTierConfig.color, border: `1px solid ${currentTierConfig.color}50` }}
                >
                  {user.rank} Rank
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                  user.kycStatus === 'verified' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  KYC Tier {user.kycTier}: {user.kycStatus}
                </span>

                <button
                  type="button"
                  onClick={() => setIsPicModalOpen(true)}
                  className="px-3 py-1 rounded-xl bg-[#E5B842]/10 border border-[#E5B842]/40 text-[#E5B842] hover:bg-[#E5B842] hover:text-[#070D1B] font-bold text-xs flex items-center gap-1.5 transition ml-1 shadow-xs"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Change My Pic</span>
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                <span>Account: <strong className="text-white font-mono">{user.accountNumber}</strong></span>
                <span>·</span>
                <span>{user.email}</span>
                <span>·</span>
                <span>Member since: {user.registeredAt}</span>
              </p>
            </div>
          </div>

          {/* Quick Balance / Status Capsule */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-right">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Portfolio</div>
              <div className="text-lg font-black text-emerald-400 font-mono">
                ${balances.USD.toLocaleString()} USD
              </div>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-right">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">NILE Holdings</div>
              <div className="text-lg font-black text-[#E5B842] font-mono">
                {balances.NILE.toLocaleString()} NILE
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Section Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800 text-xs">
        {[
          { id: 'profile', label: 'Personal & Contact Info', icon: User },
          { id: 'kyc', label: 'KYC Verification & Document Vault', icon: ShieldCheck, badge: user.kycStatus },
          { id: 'aml_api', label: 'KYC/AML Integration & API Sandbox', icon: Code2, highlight: true },
          { id: 'badges', label: 'Ranks & Achievement Badges', icon: Award },
          { id: 'permissions', label: 'Feature Access & AML Limits', icon: Shield }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTabLocal(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTabLocal === tab.id
                ? 'bg-[#E5B842] text-[#070D1B] shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {tab.highlight && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping ml-1" />}
          </button>
        ))}
      </div>

      {/* TAB 1: PERSONAL & CONTACT INFORMATION */}
      {activeTabLocal === 'profile' && (
        <form onSubmit={handleSaveProfile} className="p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6 text-xs animate-fade-in">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-[#E5B842]" />
              <span>Personal & Contact Information</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Ensure contact details match your official identification documents for seamless banking settlements.
            </p>
          </div>

          {/* Profile Photo Manager Capsule */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-[#E5B842]/50 shadow bg-[#070D1B] shrink-0">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#E5B842] text-[#070D1B] font-bold text-lg flex items-center justify-center">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>
              <div>
                <div className="font-bold text-white text-sm flex items-center gap-1.5">
                  <span>Profile Photo & Avatar</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#E5B842]" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Upload your own picture or choose a Nile VIP avatar. Visible on your account capsule and referrals profile.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsPicModalOpen(true)}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-bold text-xs flex items-center justify-center gap-1.5 shadow hover:opacity-95 transition"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Upload / Change Photo</span>
              </button>
              {user.avatarUrl && (
                <button
                  type="button"
                  onClick={() => {
                    updateUser({ avatarUrl: '' });
                    showToast('Profile photo reset to default initials.', 'info');
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition"
                  title="Reset to default initials"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Legal Name (as on Passport)</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#E5B842]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Primary Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#E5B842]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Contact Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#E5B842]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Country of Tax Residence</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#E5B842]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Residential Street Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#E5B842]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">City / Municipality</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#E5B842]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Postal / ZIP Code</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-[#E5B842]"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-bold text-white">Two-Factor Authentication (2FA)</div>
              <div className="text-slate-400 text-[11px]">Hardware key and authenticator app enforcement for outgoing settlements.</div>
            </div>
            <button
              type="button"
              onClick={() => {
                setTwoFactor(!twoFactor);
                showToast(`2FA security ${!twoFactor ? 'enabled' : 'disabled'}.`, 'info');
              }}
              className={`px-4 py-2 rounded-xl font-bold transition-colors ${
                twoFactor ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {twoFactor ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Device-Level Biometric Authentication (FaceID / TouchID) */}
          <div className="p-4 rounded-2xl bg-[#060B17] border border-[#E5B842]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E5B842]/10 border border-[#E5B842]/30 flex items-center justify-center text-[#E5B842] shrink-0">
                <Fingerprint className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  <span>Device Biometrics (FaceID / TouchID)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Hardware Secure Enclave
                  </span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  {user.biometricDeviceName || 'Apple Secure Enclave / Windows Hello FIDO2'} · Enforces step-up biometric verification on sign-in and disbursements.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                toggleBiometric2FA(!user.biometric2FAEnabled);
              }}
              className={`px-4 py-2 rounded-xl font-bold transition-all text-xs cursor-pointer ${
                user.biometric2FAEnabled 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm' 
                  : 'bg-[#E5B842] text-[#070D1B] hover:brightness-110'
              }`}
            >
              {user.biometric2FAEnabled ? 'FaceID / TouchID Active' : 'Enroll FaceID / TouchID'}
            </button>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold shadow-lg hover:scale-[1.02] transition-all"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: KYC VERIFICATION & DOCUMENT VAULT */}
      {activeTabLocal === 'kyc' && (
        <div className="space-y-8 animate-fade-in">
          {/* Status Overview Card */}
          <div className="p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold ${
                  user.kycStatus === 'verified' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                }`}>
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">Identity Verification Status</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-500/20 text-emerald-400">
                      Tier {user.kycTier}: {user.kycStatus.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Compliance: United Kingdom Data Protection Act 2018 & AML/CTF Regulation Enforced.
                  </p>
                </div>
              </div>

              <div className="text-right text-xs">
                <div className="text-slate-400">Current Daily Withdrawal Limit:</div>
                <div className="text-xl font-black text-emerald-400 font-mono">
                  ${kycPermissions.maxDailyWithdrawalUsd.toLocaleString()} USD
                </div>
              </div>
            </div>

            {/* Verification Tiers Progress Track */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {[
                { tier: 0, title: 'Tier 0: Basic Account', desc: 'Email registration & browsing.', req: 'None' },
                { tier: 1, title: 'Tier 1: Identity Verified', desc: 'ID Card or Passport verification.', req: 'Passport / National ID' },
                { tier: 2, title: 'Tier 2: Address Certified', desc: 'Proof of residential address.', req: 'Utility Bill / Bank Stmt' },
                { tier: 3, title: 'Tier 3: Institutional VIP', desc: 'Full AML & Biometric clearance.', req: 'Full Compliance Dossier' }
              ].map(t => (
                <div 
                  key={t.tier} 
                  className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                    user.kycTier >= t.tier 
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' 
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{t.title}</span>
                    {user.kycTier >= t.tier && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-[11px] text-slate-300">{t.desc}</p>
                  <div className="text-[10px] text-slate-500 font-mono pt-1">Requirement: {t.req}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Upload Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-5 text-xs">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#E5B842]" />
                <span>Submit Identification Documents</span>
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Document Classification</label>
                  <select
                    value={docUploadType}
                    onChange={(e) => setDocUploadType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold focus:outline-none focus:border-[#E5B842]"
                  >
                    <option value="passport">International Passport (Photo & Signature Page)</option>
                    <option value="id_card">National Identity Card (Both Sides)</option>
                    <option value="drivers_license">Driver's License (Full Photocard)</option>
                    <option value="proof_of_address">Proof of Address (Utility Bill / Bank Statement &lt;90 days)</option>
                  </select>
                </div>

                <div className="border-2 border-dashed border-slate-700 hover:border-[#E5B842] rounded-2xl p-6 text-center transition-colors">
                  <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <div className="text-white font-semibold">Select or drag & drop document</div>
                  <div className="text-[11px] text-slate-400 mt-1">Accepted: PDF, JPG, PNG (Max 15MB)</div>
                  <input
                    type="file"
                    onChange={handleDocumentUpload}
                    className="mt-3 text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#E5B842] file:text-[#070D1B] cursor-pointer"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSubmitKycWorkflow}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold shadow-lg transition-all hover:scale-[1.01]"
                >
                  Submit Application for Compliance Review
                </button>
              </div>
            </div>

            {/* Uploaded Documents List */}
            <div className="lg:col-span-7 p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-4 text-xs">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Verified Document Vault ({uploadedDocs.length})</span>
              </h4>

              <div className="space-y-3">
                {uploadedDocs.map((doc, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-[#E5B842]">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">{doc.fileName}</div>
                        <div className="text-[11px] text-slate-400 capitalize">
                          Type: {doc.type.replace('_', ' ')} · Uploaded: {doc.uploadedAt}
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Encrypted Vault
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="font-bold text-slate-300">Data Security & Regulatory Guarantee:</div>
                <p>
                  Documents are stored using AES-256 military-grade encryption with access restricted strictly to certified MLRO officers. Never sold or shared with commercial 3rd parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KYC / AML INTEGRATION POINTS & HYPOTHETICAL PROVIDER SANDBOX */}
      {activeTabLocal === 'aml_api' && (
        <div className="space-y-8 animate-fade-in text-xs">
          {/* Architecture Overview */}
          <div className="p-8 rounded-3xl bg-[#091124] border border-[#E5B842]/40 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-semibold mb-2">
                  <Code2 className="w-4 h-4" />
                  <span>Integration Specifications</span>
                </div>
                <h3 className="text-xl font-black text-white">KYC & AML Verification Provider Integration</h3>
                <p className="text-slate-400 mt-1">
                  Architecture and live endpoints for initiating verification, receiving webhook callbacks, and synchronizing user access states.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Current Provider:</span>
                <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-[#E5B842] font-bold">
                  {kycSession.provider} Institutional SDK
                </span>
              </div>
            </div>

            {/* Live Session State Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[11px]">Session ID</div>
                <div className="text-white font-mono font-bold mt-1 truncate">{kycSession.sessionId}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[11px]">Applicant ID</div>
                <div className="text-cyan-400 font-mono font-bold mt-1 truncate">{kycSession.applicantId}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[11px]">Automated Risk Score</div>
                <div className={`font-mono font-bold mt-1 ${kycSession.riskScore === 'LOW' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {kycSession.riskScore} RISK
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[11px]">PEP & Sanctions Status</div>
                <div className="text-emerald-400 font-mono font-bold mt-1">
                  {kycSession.pepSanctionResult}
                </div>
              </div>
            </div>

            {/* Sandbox Simulation Triggers */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="font-bold text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-400" />
                <span>Interactive Webhook & Verification Simulator</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Trigger simulated asynchronous events from the hypothetical KYC provider to verify live UI state changes and feature permission unlocking.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  onClick={() => simulateProviderWebhook('applicantReviewed')}
                  disabled={apiSimulating}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow"
                >
                  Simulate Webhook: Approved (Green)
                </button>

                <button
                  onClick={() => simulateProviderWebhook('applicantPending')}
                  disabled={apiSimulating}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition-all shadow"
                >
                  Simulate Webhook: Review In Progress
                </button>

                <button
                  onClick={() => simulateProviderWebhook('applicantRejected')}
                  disabled={apiSimulating}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow"
                >
                  Simulate Webhook: Rejected (Red)
                </button>

                <button
                  onClick={() => simulateProviderWebhook('pepSanctionFlagged')}
                  disabled={apiSimulating}
                  className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold transition-all shadow"
                >
                  Simulate Webhook: AML Watchlist Match
                </button>
              </div>
            </div>
          </div>

          {/* API Documentation & Schemas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Endpoint 1: Initiate */}
            <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                  POST /api/v1/kyc/initiate
                </span>
                <span className="text-slate-500 text-[10px]">Client Webhook / App Handshake</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Initializes a secure session token with the institutional KYC provider and generates client Web SDK token.
              </p>
              <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-300 font-mono text-[11px] overflow-x-auto border border-slate-800">
{`{
  "userId": "${user.id}",
  "email": "${user.email}",
  "country": "GB",
  "levelName": "institutional-full-kyc",
  "externalUserId": "${user.accountNumber}"
}`}
              </pre>
            </div>

            {/* Endpoint 2: Webhook Handler */}
            <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold">
                  POST /api/v1/kyc/webhook
                </span>
                <span className="text-slate-500 text-[10px]">HMAC-SHA256 Signed Callback</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Processes real-time verification outcome, liveness check validation, and PEP/sanctions screening results.
              </p>
              <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-300 font-mono text-[11px] overflow-x-auto border border-slate-800">
{`{
  "applicantId": "${kycSession.applicantId}",
  "reviewStatus": "${kycSession.status.toUpperCase()}",
  "reviewResult": {
    "reviewAnswer": "${kycSession.status === 'approved' ? 'GREEN' : 'RED'}",
    "riskScore": "${kycSession.riskScore}"
  },
  "pepSanctionsResult": "${kycSession.pepSanctionResult}"
}`}
              </pre>
            </div>
          </div>

          {/* Webhook Activity Logs */}
          <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 space-y-4">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Real-Time Webhook Activity Log ({kycSession.webhookLog.length})</span>
            </h4>

            <div className="space-y-2">
              {kycSession.webhookLog.map((log, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#E5B842] font-mono font-bold">{log.event}</span>
                      <span className="text-slate-500 text-[10px] font-mono">{log.eventId}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 mt-0.5 truncate max-w-xl">{log.payloadSummary}</div>
                  </div>
                  <span className="text-slate-500 font-mono text-[10px] shrink-0">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RANKS & ACHIEVEMENT BADGES */}
      {activeTabLocal === 'badges' && (
        <div className="space-y-8 animate-fade-in text-xs">
          {/* User Rank Card */}
          <div className="p-8 rounded-3xl bg-[#091124] border border-[#E5B842]/40 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#E5B842]">
                  Affiliate & Community Leadership
                </div>
                <h3 className="text-2xl font-black text-white mt-1">
                  {user.rank} Rank Status
                </h3>
                <p className="text-slate-400 mt-1">
                  Unlocking tiered ecosystem fee rebates, high-limit metal cards, and dedicated concierge desk privileges.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('referrals')}
                className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-white font-bold flex items-center gap-2 transition-colors"
              >
                <span>View Full Referral Dashboard</span>
                <ArrowRight className="w-4 h-4 text-[#E5B842]" />
              </button>
            </div>

            {/* 5 Ranks Progression Showcase */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {referralTiers.map(tier => {
                const isCurrent = user.rank === tier.rank;
                return (
                  <div
                    key={tier.rank}
                    className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                      isCurrent
                        ? 'bg-slate-800/90 border-[#E5B842] shadow-lg scale-105'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div 
                      className="w-10 h-10 rounded-2xl mx-auto flex items-center justify-center font-black text-base shadow"
                      style={{ backgroundColor: `${tier.color}25`, color: tier.color, border: `1px solid ${tier.color}50` }}
                    >
                      {tier.rank[0]}
                    </div>
                    <div className="font-bold text-white text-sm">{tier.rank}</div>
                    <div className="text-[10px] text-slate-400 font-mono">≥ {tier.minReferrals} Referrals</div>
                    <div className="text-emerald-400 font-bold text-[11px]">{tier.tier1CommissionPercent}% Tier 1 Rebate</div>
                    {isCurrent && (
                      <span className="block text-[10px] font-black text-[#E5B842] uppercase tracking-wider">
                        ACTIVE RANK
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Achievement Badges Showcase */}
          <div className="p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#E5B842]" />
                  <span>Verified Achievement Badges</span>
                </h4>
                <p className="text-slate-400 text-xs mt-0.5">
                  Badges unlocked by driving referrals, completing marketplace trades, and maintaining vault liquidity.
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {user.badges.length} / {badges.length} Badges Claimed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map(badge => {
                const isClaimed = user.badges.includes(badge.id);

                return (
                  <div
                    key={badge.id}
                    className={`p-5 rounded-2xl border flex flex-col justify-between space-y-3 transition-colors ${
                      isClaimed
                        ? 'bg-slate-900 border-[#E5B842]/40 shadow'
                        : 'bg-slate-900/40 border-slate-800/80 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isClaimed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {isClaimed ? 'UNLOCKED' : 'LOCKED'}
                        </span>
                        <span className="text-slate-500 text-[10px] uppercase font-semibold">{badge.category}</span>
                      </div>

                      <h5 className="text-sm font-bold text-white mt-2 flex items-center gap-2">
                        <Award className={`w-4 h-4 ${isClaimed ? 'text-[#E5B842]' : 'text-slate-600'}`} />
                        <span>{badge.title}</span>
                      </h5>
                      <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                        {badge.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 space-y-2">
                      <div className="text-[10px] text-slate-500">
                        Criteria: <strong className="text-slate-300">{badge.criteria}</strong>
                      </div>
                      <div className="text-[11px] text-emerald-400 font-semibold">
                        Perk: {badge.rewardBonus}
                      </div>

                      {!isClaimed && (
                        <button
                          onClick={() => claimBadge(badge.id)}
                          className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-[#E5B842] hover:text-[#070D1B] text-slate-300 font-bold text-[10px] transition-colors"
                        >
                          Claim Badge
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FEATURE ACCESS & AML LIMITS */}
      {activeTabLocal === 'permissions' && (
        <div className="p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6 text-xs animate-fade-in">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span>Conditionally Enabled Platform Features</span>
            </h3>
            <p className="text-slate-400 mt-1">
              Features are conditionally activated based on your verified KYC tier and continuous AML sanctions clearance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Feature 1: Withdrawals */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-white text-sm">Fiat & Crypto Wire Withdrawals</div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  kycPermissions.canWithdrawFiat ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {kycPermissions.canWithdrawFiat ? 'ACTIVE' : 'LOCKED'}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Permits wire settlements to external IBAN accounts and crypto transfers up to ${kycPermissions.maxDailyWithdrawalUsd.toLocaleString()} USD daily.
              </p>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                Requirement: Minimum KYC Tier 1 (Passport or ID verification)
              </div>
            </div>

            {/* Feature 2: High Limit Cards */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-white text-sm">High-Limit Cards ($10,000 – $100,000)</div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  kycPermissions.canOrderHighLimitCard ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {kycPermissions.canOrderHighLimitCard ? 'ACTIVE' : 'LOCKED'}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Enables ordering of Gold and Black Elite Visa/Mastercards loaded with institutional limits and global ATM access.
              </p>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                Requirement: Minimum KYC Tier 2 (Certified proof of residential address)
              </div>
            </div>

            {/* Feature 3: Presale Purchases > $1,000 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-white text-sm">Presale Purchases &gt; $1,000 USD</div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  kycPermissions.canParticipatePresale ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {kycPermissions.canParticipatePresale ? 'ACTIVE' : 'LOCKED'}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Allows participation in seed, strategic, and launchpad presale phases with contributions up to $100,000 USD.
              </p>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                Requirement: Minimum KYC Tier 1 (ID Document & PEP clearance)
              </div>
            </div>

            {/* Feature 4: High-Tier Investment Vaults */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-white text-sm">Institutional & Diamond Yield Vaults</div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  kycPermissions.canInvestHighTier ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {kycPermissions.canInvestHighTier ? 'ACTIVE' : 'LOCKED'}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Grants enrollment eligibility for 180-Day and 365-Day Diamond Multiplier vaults paying up to 32% APR.
              </p>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                Requirement: Minimum KYC Tier 2 + Clean PEP/Sanctions record
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Profile Photo Modal */}
      <ChangeProfilePicModal
        isOpen={isPicModalOpen}
        onClose={() => setIsPicModalOpen(false)}
      />
    </div>
  );
};
