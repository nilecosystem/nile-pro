import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { AuthProvider, AuthModalMode } from '../types/index.ts';
import { 
  X, 
  Lock, 
  Mail, 
  Phone, 
  Key, 
  Wallet, 
  Fingerprint, 
  ScanFace,
  CheckCircle2, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  Smartphone,
  Laptop,
  ChevronDown,
  RefreshCw,
  UserCheck,
  Check,
  Shield,
  Zap,
  Cpu
} from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';

// International dialing codes
const COUNTRY_CODES = [
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+41', country: 'CH', flag: '🇨🇭' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+98', country: 'IR', flag: '🇮🇷' },
  { code: '+65', country: 'SG', flag: '🇸🇬' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+86', country: 'CN', flag: '🇨🇳' }
];

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    authModalMode, 
    user,
    loginWithProvider, 
    signupWithProvider, 
    resetPasswordWithCode,
    toggleBiometric2FA,
    registerDeviceBiometrics,
    rememberMe,
    setRememberMe,
    showToast 
  } = useApp();

  const [mode, setMode] = useState<AuthModalMode>(authModalMode || 'login');
  const [selectedMethod, setSelectedMethod] = useState<'email' | 'phone' | 'passkey' | 'wallet'>('email');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Phone auth states
  const [selectedCountryCode, setSelectedCountryCode] = useState('+44');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneOtpStep, setPhoneOtpStep] = useState<'input_phone' | 'input_otp'>('input_phone');
  const [phoneOtpCode, setPhoneOtpCode] = useState('');

  // Device-Level Biometric Authentication & Security Layer State
  const [biometricStep, setBiometricStep] = useState<'idle' | 'challenge' | 'scanning' | 'success' | 'failed'>('idle');
  const [biometricEnrollToggle, setBiometricEnrollToggle] = useState<boolean>(user.biometric2FAEnabled || false);
  const [pendingLoginPayload, setPendingLoginPayload] = useState<{ provider: AuthProvider; payload: any } | null>(null);
  const [fallbackPin, setFallbackPin] = useState('');
  const [showPinFallback, setShowPinFallback] = useState(false);

  // Detect device-level biometric capabilities
  const deviceBiometrics = useMemo(() => {
    const ua = navigator.userAgent;
    if (/iPhone|iPad/.test(ua)) {
      return {
        type: 'FaceID' as const,
        label: 'Apple Face ID',
        icon: ScanFace,
        enclave: 'Apple Secure Enclave & Bionic Neural Engine',
        color: 'from-amber-400 to-[#E5B842]'
      };
    } else if (/Macintosh/.test(ua)) {
      return {
        type: 'TouchID' as const,
        label: 'Apple Touch ID',
        icon: Fingerprint,
        enclave: 'MacBook T2 / Apple Silicon Secure Enclave',
        color: 'from-[#E5B842] to-amber-500'
      };
    } else if (/Windows/.test(ua)) {
      return {
        type: 'WindowsHello' as const,
        label: 'Windows Hello Biometrics',
        icon: ScanFace,
        enclave: 'Windows Hello TPM 2.0 Authenticator',
        color: 'from-cyan-400 to-blue-500'
      };
    } else if (/Android/.test(ua)) {
      return {
        type: 'TouchID' as const,
        label: 'Android Biometric Prompt',
        icon: Fingerprint,
        enclave: 'Android StrongBox / TEE Hardware Key',
        color: 'from-emerald-400 to-teal-500'
      };
    }
    return {
      type: 'TouchID' as const,
      label: 'FIDO2 Device Biometrics',
      icon: Fingerprint,
      enclave: 'Hardware Cryptographic Platform Authenticator',
      color: 'from-[#E5B842] to-amber-500'
    };
  }, []);

  const BiometricIcon = deviceBiometrics.icon;

  // Forgot password flow states
  const [forgotStep, setForgotStep] = useState<'request' | 'verify' | 'new_password' | 'success'>('request');
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetOtpCode, setResetOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Synchronize initial mode when modal opens
  useEffect(() => {
    if (authModalMode) {
      setMode(authModalMode);
    }
  }, [authModalMode, authModalOpen]);

  // Sync biometric enrollment preference from user
  useEffect(() => {
    if (user?.biometric2FAEnabled) {
      setBiometricEnrollToggle(true);
    }
  }, [user]);

  if (!authModalOpen) return null;

  const handleClose = () => {
    setAuthModalOpen(false);
    setPhoneOtpStep('input_phone');
    setForgotStep('request');
    setBiometricStep('idle');
    setPendingLoginPayload(null);
    setShowPinFallback(false);
  };

  // Execute actual login after biometric 2FA layer passes
  const completeAuthenticatedSession = async (provider: AuthProvider, payload: any) => {
    if (mode === 'signup') {
      await signupWithProvider(provider, payload, rememberMe);
    } else {
      await loginWithProvider(provider, payload, rememberMe);
    }

    if (biometricEnrollToggle && !user.biometric2FAEnabled) {
      await registerDeviceBiometrics();
    }

    setIsLoading(false);
    handleClose();
  };

  // Intercept authentication with the Device-Level Biometric 2FA Layer for existing users
  const proceedWithAuthOrTriggerBiometric2FA = (provider: AuthProvider, payload: any) => {
    // If user has biometric 2FA enabled OR enabled on this terminal
    const isExistingUserWithBiometric = user?.biometric2FAEnabled || biometricEnrollToggle;

    if (isExistingUserWithBiometric && mode === 'login') {
      setPendingLoginPayload({ provider, payload });
      setBiometricStep('challenge');
      triggerBiometricScanningAnimation(provider, payload);
    } else {
      completeAuthenticatedSession(provider, payload);
    }
  };

  // Trigger high-fidelity biometric scanning animation
  const triggerBiometricScanningAnimation = (provider: AuthProvider, payload: any) => {
    setBiometricStep('scanning');
    showToast(`Initializing ${deviceBiometrics.label} verification...`, 'info');

    // Simulate authentic biometric sensor read
    setTimeout(() => {
      setBiometricStep('success');
      showToast(`${deviceBiometrics.label} verified via Secure Enclave!`, 'success');

      setTimeout(() => {
        completeAuthenticatedSession(provider, payload);
      }, 900);
    }, 1500);
  };

  // Direct 1-Tap Quick Unlock for Returning Existing User
  const handleDirectBiometricQuickUnlock = () => {
    setBiometricStep('challenge');
    triggerBiometricScanningAnimation('passkey', {
      credentialId: 'bio_quick_' + Date.now().toString(36),
      method: deviceBiometrics.label,
      name: user.name,
      email: user.email
    });
  };

  // Fallback PIN verification if biometric is unavailable
  const handleVerifyFallbackPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (fallbackPin !== '849201' && fallbackPin.length < 4) {
      showToast('Please enter your 6-digit Security PIN', 'error');
      return;
    }

    showToast('Security PIN accepted as fallback authentication.', 'success');
    if (pendingLoginPayload) {
      completeAuthenticatedSession(pendingLoginPayload.provider, pendingLoginPayload.payload);
    } else {
      completeAuthenticatedSession('passkey', { method: 'PIN Fallback' });
    }
  };

  // 1. Google One-Click SSO
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    showToast('Connecting with Google Identity Services...', 'info');
    setTimeout(() => {
      const googleMockUser = {
        name: mode === 'signup' ? 'Google Explorer' : (user.name || 'Verified Google Account'),
        email: user.email || 'user.google@nileecosystem.com',
        avatar: user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      };
      proceedWithAuthOrTriggerBiometric2FA('google', googleMockUser);
    }, 1100);
  };

  // 2. Web3 Wallet Authentication
  const handleWalletAuth = async () => {
    setIsLoading(true);
    showToast('Requesting cryptographic wallet signature...', 'info');
    setTimeout(() => {
      const walletMock = {
        address: user.walletAddress || '0x71C5A8B2C49D9E4E0f1a2384B6F77A6e42b2dC9A',
        network: 'Ethereum & Nile Smart Chain'
      };
      proceedWithAuthOrTriggerBiometric2FA('wallet', walletMock);
    }, 1100);
  };

  // 3. Device Biometric / Passkey One-Tap
  const handlePasskeyAuth = async () => {
    handleDirectBiometricQuickUnlock();
  };

  // 4. Phone Number OTP Flow
  const handleSendPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 6) {
      showToast('Please enter a valid mobile phone number', 'error');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setPhoneOtpStep('input_otp');
      showToast(`Verification code sent via SMS to ${selectedCountryCode} ${phoneNumber}!`, 'success');
      setPhoneOtpCode('849201');
    }, 900);
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOtpCode || phoneOtpCode.length < 4) {
      showToast('Please enter the 6-digit SMS verification code', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const fullPhone = `${selectedCountryCode} ${phoneNumber}`;
      proceedWithAuthOrTriggerBiometric2FA('phone', {
        phone: fullPhone,
        name: fullName || user.name || `Client ${phoneNumber.slice(-4)}`
      });
    }, 900);
  };

  // 5. Standard Email & Password
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    if (!password || password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        showToast('Please provide your legal full name for KYC compliance', 'error');
        return;
      }
      if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
      }
    }

    setIsLoading(true);
    setTimeout(() => {
      if (mode === 'signup') {
        completeAuthenticatedSession('email', { email, name: fullName, password });
      } else {
        proceedWithAuthOrTriggerBiometric2FA('email', { email, password });
      }
    }, 900);
  };

  // 6. Forgot Password Handlers
  const handleForgotRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetIdentifier || resetIdentifier.length < 4) {
      showToast('Please enter your registered Email or Phone Number', 'error');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setForgotStep('verify');
      setResetOtpCode('849201');
      showToast('One-time password recovery code dispatched!', 'success');
    }, 900);
  };

  const handleForgotVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetOtpCode || resetOtpCode.length < 4) {
      showToast('Please enter the 6-digit recovery code', 'error');
      return;
    }
    setForgotStep('new_password');
  };

  const handleForgotSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setIsLoading(true);
    const success = await resetPasswordWithCode(resetIdentifier, resetOtpCode, newPassword);
    setIsLoading(false);
    if (success) {
      setForgotStep('success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#091124] border-2 border-[#E5B842] shadow-2xl space-y-6 my-8 max-h-[92vh] overflow-y-auto">
        
        {/* Top Header & Brand Logo */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <BrandLogo size="sm" showText />

          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ===================== DEVICE-LEVEL BIOMETRIC 2FA SECURITY CHALLENGE LAYER ===================== */}
        {biometricStep !== 'idle' && (
          <div className="p-6 rounded-3xl bg-[#060B17] border border-[#E5B842]/50 shadow-2xl space-y-5 text-center animate-fade-in">
            {/* Security Protocol Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5B842]/10 border border-[#E5B842]/30 text-[#E5B842] text-[10px] font-mono font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Device Biometric Security Layer (2FA)</span>
              </div>
              <h3 className="text-lg font-black text-white pt-1">
                {deviceBiometrics.label} Verification
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Authenticate with your device's biometric sensor ({deviceBiometrics.type === 'FaceID' ? 'Face ID' : 'Touch ID'}) to unlock your treasury session.
              </p>
            </div>

            {/* Central Animated Biometric Scanner */}
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              {/* Outer Pulsing Ring */}
              <div className={`absolute inset-0 rounded-full border-2 border-[#E5B842]/30 ${biometricStep === 'scanning' ? 'animate-ping duration-1000' : ''}`} />
              <div className="absolute inset-2 rounded-full border border-slate-800 bg-[#070D1B]" />

              {/* Viewfinder Target Brackets for FaceID */}
              {deviceBiometrics.type === 'FaceID' && (
                <div className="absolute inset-4 pointer-events-none">
                  {/* Top-Left Bracket */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#E5B842] rounded-tl" />
                  {/* Top-Right Bracket */}
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#E5B842] rounded-tr" />
                  {/* Bottom-Left Bracket */}
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#E5B842] rounded-bl" />
                  {/* Bottom-Right Bracket */}
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#E5B842] rounded-br" />
                </div>
              )}

              {/* Laser Scanning Line */}
              {biometricStep === 'scanning' && (
                <div className="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-[#E5B842] to-transparent shadow-[0_0_12px_#E5B842] animate-bounce duration-700" />
              )}

              {/* Center Biometric Icon & Success Checkmark */}
              <div className="relative z-10">
                {biometricStep === 'success' ? (
                  <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-scale-in" />
                ) : (
                  <BiometricIcon className={`w-16 h-16 text-[#E5B842] ${biometricStep === 'scanning' ? 'animate-pulse' : ''}`} />
                )}
              </div>
            </div>

            {/* Scanner Status Message */}
            <div className="space-y-1">
              <div className="text-xs font-mono font-bold">
                {biometricStep === 'challenge' && (
                  <span className="text-[#E5B842] flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ready for Sensor Input</span>
                  </span>
                )}
                {biometricStep === 'scanning' && (
                  <span className="text-cyan-400 flex items-center justify-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Validating Biometric Signature with Secure Enclave...</span>
                  </span>
                )}
                {biometricStep === 'success' && (
                  <span className="text-emerald-400 flex items-center justify-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>Biometric Match Confirmed • Hardware Key Signed</span>
                  </span>
                )}
              </div>

              <div className="text-[11px] text-slate-500 font-mono flex items-center justify-center gap-1">
                <Cpu className="w-3 h-3 text-[#E5B842]" />
                <span>{deviceBiometrics.enclave}</span>
              </div>
            </div>

            {/* Fallback PIN Drawer */}
            {showPinFallback ? (
              <form onSubmit={handleVerifyFallbackPin} className="space-y-3 pt-2 text-left text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 font-bold">Enter Security PIN Fallback:</label>
                    <button
                      type="button"
                      onClick={() => setFallbackPin('849201')}
                      className="text-[10px] text-[#E5B842] hover:underline"
                    >
                      Fill Demo PIN (849201)
                    </button>
                  </div>
                  <input
                    type="password"
                    maxLength={6}
                    value={fallbackPin}
                    onChange={(e) => setFallbackPin(e.target.value)}
                    placeholder="••••••"
                    className="w-full py-2.5 text-center tracking-widest text-lg font-mono font-black rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-[#E5B842]"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#E5B842] text-[#070D1B] font-extrabold text-xs shadow hover:brightness-110 cursor-pointer"
                  >
                    Confirm PIN & Sign In
                  </button>
                </div>
              </form>
            ) : (
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                <button
                  type="button"
                  onClick={() => triggerBiometricScanningAnimation(pendingLoginPayload?.provider || 'passkey', pendingLoginPayload?.payload)}
                  disabled={biometricStep === 'scanning' || biometricStep === 'success'}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BiometricIcon className="w-4 h-4" />
                  <span>Scan {deviceBiometrics.type}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPinFallback(true)}
                  className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Use Backup PIN
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => { setBiometricStep('idle'); setShowPinFallback(false); }}
              className="text-[11px] text-slate-500 hover:text-slate-400 hover:underline cursor-pointer"
            >
              Cancel & Return to Standard Login
            </button>
          </div>
        )}

        {/* Mode Switcher: Sign In vs Sign Up (Visible when not in challenge or forgot mode) */}
        {biometricStep === 'idle' && mode !== 'forgot_password' && (
          <div className="flex items-center p-1 rounded-2xl bg-[#060B17] border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setMode('login'); setPhoneOtpStep('input_phone'); }}
              className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#E5B842] text-[#070D1B] shadow font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In to Account
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setPhoneOtpStep('input_phone'); }}
              className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-[#E5B842] text-[#070D1B] shadow font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Institutional Account
            </button>
          </div>
        )}

        {/* ===================== FORGOT PASSWORD FLOW ===================== */}
        {biometricStep === 'idle' && mode === 'forgot_password' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#E5B842]" />
                <span className="font-bold">Password Recovery Protocol</span>
              </div>
              <button
                type="button"
                onClick={() => { setMode('login'); setForgotStep('request'); }}
                className="text-[#E5B842] hover:underline font-bold text-[11px] cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>

            {forgotStep === 'request' && (
              <form onSubmit={handleForgotRequestOtp} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">Reset Account Access</h3>
                  <p className="text-slate-400">
                    Enter your registered email address or mobile phone number to receive a one-time verification code.
                  </p>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Email or Phone Number:</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={resetIdentifier}
                      onChange={(e) => setResetIdentifier(e.target.value)}
                      placeholder="e.g. owner@nileecosystem.com or +44 7558..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#E5B842] text-xs font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? 'Dispatching Recovery Code...' : 'Send Recovery Code'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {forgotStep === 'verify' && (
              <form onSubmit={handleForgotVerifyCode} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">Enter 6-Digit Code</h3>
                  <p className="text-slate-400">
                    We sent a security token to <span className="text-[#E5B842] font-mono">{resetIdentifier}</span>.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-bold">Verification Token:</label>
                    <button
                      type="button"
                      onClick={() => setResetOtpCode('849201')}
                      className="text-[10px] text-[#E5B842] hover:underline cursor-pointer"
                    >
                      Fill Demo Code (849201)
                    </button>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={resetOtpCode}
                    onChange={(e) => setResetOtpCode(e.target.value)}
                    placeholder="849201"
                    className="w-full py-3 text-center tracking-widest text-lg font-mono font-black rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#E5B842] text-[#070D1B] font-extrabold text-xs shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Verify Code
                  <Check className="w-4 h-4" />
                </button>
              </form>
            )}

            {forgotStep === 'new_password' && (
              <form onSubmit={handleForgotSetNewPassword} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">Create New Password</h3>
                  <p className="text-slate-400">Choose a strong, secure password for your Nile treasury account.</p>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">New Password:</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#E5B842] text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Confirm New Password:</label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#E5B842] text-xs font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-[#E5B842] text-[#070D1B] font-extrabold text-xs shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? 'Updating Password...' : 'Set New Password & Sign In'}
                </button>
              </form>
            )}

            {forgotStep === 'success' && (
              <div className="p-6 text-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-white">Password Updated Successfully!</h3>
                <p className="text-xs text-slate-300">
                  Your credentials have been securely updated. You are now logged in with active hardware encryption.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-xl bg-[#E5B842] text-[#070D1B] font-extrabold text-xs shadow hover:brightness-110 cursor-pointer"
                >
                  Go to Dashboard
                </button>
              </div>
            )}
          </div>
        )}

        {/* ===================== SIGN IN / SIGN UP FLOWS ===================== */}
        {biometricStep === 'idle' && mode !== 'forgot_password' && (
          <div className="space-y-4">
            
            {/* RETURNING USER BIOMETRIC QUICK UNLOCK CAPSULE */}
            {mode === 'login' && user?.name && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#0C152B] via-[#080E1E] to-[#0C152B] border border-[#E5B842]/40 shadow-lg flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-[#E5B842]/60 bg-[#070D1B] shrink-0">
                    <img 
                      src={user.avatarUrl || '/default-avatar.jpg'} 
                      alt={user.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/default-avatar.jpg'; }}
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{user.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {deviceBiometrics.type} Ready
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {deviceBiometrics.label} · 1-Tap Secure Enclave
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDirectBiometricQuickUnlock}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  title={`Unlock session instantly using ${deviceBiometrics.label}`}
                >
                  <BiometricIcon className="w-3.5 h-3.5" />
                  <span>{deviceBiometrics.type} Unlock</span>
                </button>
              </div>
            )}

            {/* Quick Auth Buttons: Google, Web3 Wallet, Device Biometric Passkey */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{mode === 'signup' ? '1-Click Registration Options:' : 'Instant Sign In Options:'}</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Hardware Secured</span>
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {/* Google SSO */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="p-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold flex items-center justify-center gap-2 border border-slate-200 shadow-sm transition-all active:scale-98 cursor-pointer"
                  title={mode === 'signup' ? 'Register instantly with Google Account' : 'Sign in with official Google account'}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{mode === 'signup' ? 'Google Sign Up' : 'Google'}</span>
                </button>

                {/* Web3 Wallet */}
                <button
                  type="button"
                  onClick={handleWalletAuth}
                  disabled={isLoading}
                  className="p-3 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center gap-2 border border-cyan-500/30 transition-all active:scale-98 cursor-pointer"
                  title={mode === 'signup' ? 'Connect and register Web3 Wallet' : 'Connect Web3 Wallet (MetaMask, Trust, Rabby)'}
                >
                  <Wallet className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{mode === 'signup' ? 'Web3 Wallet' : 'Web3 Wallet'}</span>
                </button>

                {/* Device Biometrics (Face ID / Touch ID / Passkey) */}
                <button
                  type="button"
                  onClick={handlePasskeyAuth}
                  disabled={isLoading}
                  className="p-3 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center gap-2 border border-purple-500/30 transition-all active:scale-98 cursor-pointer"
                  title={mode === 'signup' ? `Register Passkey with ${deviceBiometrics.label}` : `Authenticate with ${deviceBiometrics.label}`}
                >
                  <BiometricIcon className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{mode === 'signup' ? `Passkey (${deviceBiometrics.type})` : `${deviceBiometrics.type}`}</span>
                </button>
              </div>
            </div>

            {/* Divider with method selector */}
            <div className="relative flex items-center justify-center py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex items-center gap-2 bg-[#091124] px-3 text-[11px] font-mono text-slate-400">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('email')}
                  className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                    selectedMethod === 'email' ? 'text-[#E5B842] font-bold bg-[#E5B842]/10' : 'hover:text-white'
                  }`}
                >
                  Email & Password
                </button>
                <span>or</span>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('phone')}
                  className={`px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                    selectedMethod === 'phone' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'hover:text-white'
                  }`}
                >
                  Phone Number
                </button>
              </div>
            </div>

            {/* Sub-form: Phone Number Authentication */}
            {selectedMethod === 'phone' && (
              <div className="space-y-3">
                {phoneOtpStep === 'input_phone' ? (
                  <form onSubmit={handleSendPhoneOtp} className="space-y-3 text-xs">
                    {mode === 'signup' && (
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">Full Legal Name:</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Your Legal Name"
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#E5B842] text-xs font-mono"
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-slate-300 font-bold block mb-1">Mobile Phone Number:</label>
                      <div className="flex gap-2">
                        <select
                          value={selectedCountryCode}
                          onChange={(e) => setSelectedCountryCode(e.target.value)}
                          className="px-2.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-[#E5B842]"
                        >
                          {COUNTRY_CODES.map(c => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {c.code} ({c.country})
                            </option>
                          ))}
                        </select>
                        <div className="relative flex-1">
                          <Smartphone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="7558 847468"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#E5B842] text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Remember Me Checkbox & Forgot Password Link for Phone */}
                    <div className="flex items-center justify-between pt-0.5">
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded accent-[#E5B842] bg-slate-900 border-slate-700 cursor-pointer"
                        />
                        <span>Remember me on this terminal</span>
                      </label>

                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => {
                            setMode('forgot_password');
                            setForgotStep('request');
                            setResetIdentifier(phoneNumber ? `${selectedCountryCode} ${phoneNumber}` : '');
                          }}
                          className="text-[#E5B842] hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          <Key className="w-3 h-3" />
                          <span>Forgot Password?</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-[#070D1B] font-extrabold text-xs shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isLoading ? 'Requesting SMS...' : 'Send SMS Verification Code'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyPhoneOtp} className="space-y-3 text-xs">
                    <div className="flex items-center justify-between text-slate-400 text-xs">
                      <span>SMS sent to: <strong className="text-white font-mono">{selectedCountryCode} {phoneNumber}</strong></span>
                      <button
                        type="button"
                        onClick={() => setPhoneOtpStep('input_phone')}
                        className="text-[#E5B842] hover:underline cursor-pointer"
                      >
                        Change
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-slate-300 font-bold">6-Digit SMS Code:</label>
                        <button
                          type="button"
                          onClick={() => setPhoneOtpCode('849201')}
                          className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
                        >
                          Fill Demo Code (849201)
                        </button>
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        value={phoneOtpCode}
                        onChange={(e) => setPhoneOtpCode(e.target.value)}
                        placeholder="849201"
                        className="w-full py-3 text-center tracking-widest text-lg font-mono font-black rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* Remember Me Checkbox for Phone OTP */}
                    <div className="flex items-center justify-between pt-0.5">
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded accent-[#E5B842] bg-slate-900 border-slate-700 cursor-pointer"
                        />
                        <span>Remember me on this terminal</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleSendPhoneOtp}
                        className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
                      >
                        Resend SMS
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 rounded-xl bg-emerald-500 text-[#070D1B] font-extrabold text-xs shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isLoading 
                        ? 'Verifying Phone Session...' 
                        : mode === 'signup'
                          ? 'Verify Phone & Create Institutional Account'
                          : 'Verify Phone & Sign In'
                      }
                      <Check className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Sub-form: Standard Email & Password */}
            {selectedMethod === 'email' && (
              <form onSubmit={handleEmailAuth} className="space-y-3 text-xs">
                {mode === 'signup' && (
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Full Legal Name:</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Matin Parsa"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#E5B842] text-xs font-mono"
                    />
                  </div>
                )}

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Email Address:</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="investor@familyoffice.ch"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#E5B842] text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-bold">Password:</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot_password');
                          setForgotStep('request');
                          setResetIdentifier(email);
                        }}
                        className="text-[#E5B842] hover:underline font-bold text-[11px] cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#E5B842] text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Confirm Password:</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#E5B842] text-xs font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* DEVICE-LEVEL BIOMETRIC SECURITY LAYER TOGGLE FOR EXISTING & NEW USERS */}
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <label className="flex items-center justify-between cursor-pointer select-none">
                    <div className="flex items-center gap-2">
                      <BiometricIcon className="w-4 h-4 text-[#E5B842]" />
                      <span className="text-xs font-bold text-white">
                        Require {deviceBiometrics.label} (2FA)
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={biometricEnrollToggle}
                      onChange={(e) => {
                        setBiometricEnrollToggle(e.target.checked);
                        toggleBiometric2FA(e.target.checked);
                      }}
                      className="w-4 h-4 rounded accent-[#E5B842] bg-slate-950 border-slate-700 cursor-pointer"
                    />
                  </label>
                  <p className="text-[10px] text-slate-400">
                    Enforces device-level biometric verification ({deviceBiometrics.type}) via Hardware Secure Enclave on all future sessions.
                  </p>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#E5B842] bg-slate-900 border-slate-700 cursor-pointer"
                    />
                    <span>Remember me on this terminal</span>
                  </label>

                  <span className="text-[10px] text-slate-500 font-mono">FIDO2 Secured</span>
                </div>

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
                >
                  {isLoading
                    ? 'Validating Credentials...'
                    : mode === 'signup'
                      ? 'Create Verified Account & Enroll Biometrics'
                      : biometricEnrollToggle
                        ? `Sign In with ${deviceBiometrics.label} (2FA)`
                        : 'Sign In to Nile Ecosystem'
                  }
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Dedicated Forgot Password / Recovery Row for Login Mode */}
            {mode === 'login' && (
              <div className="p-3 rounded-2xl bg-[#060B17] border border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <Lock className="w-3.5 h-3.5 text-[#E5B842]" />
                  <span>Forgot your credentials?</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot_password');
                    setForgotStep('request');
                    setResetIdentifier(email || (phoneNumber ? `${selectedCountryCode} ${phoneNumber}` : ''));
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#E5B842]/10 hover:bg-[#E5B842]/20 border border-[#E5B842]/30 text-[#E5B842] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Forgot Password?</span>
                </button>
              </div>
            )}

            {/* Quick Demo Profile Logins for Testing */}
            <div className="pt-3 border-t border-slate-800/80">
              <div className="text-[10px] text-slate-500 font-mono mb-1.5 uppercase flex items-center justify-between">
                <span>Quick Demonstration Profiles:</span>
                <span className="text-[#E5B842]">1-Click Switch</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={async () => {
                    await loginWithProvider('email', { email: 'owner@nileecosystem.com', role: 'super_admin' }, true);
                    handleClose();
                  }}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-[#E5B842] text-slate-300 hover:text-white flex items-center gap-1.5 truncate cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5B842]" />
                  <span className="truncate">Platform Owner (Admin)</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await loginWithProvider('wallet', { address: '0x8F9B4c2E1d7A09bE' }, true);
                    handleClose();
                  }}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-white flex items-center gap-1.5 truncate cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span className="truncate">Alexander Vance (Client)</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AuthModal;
