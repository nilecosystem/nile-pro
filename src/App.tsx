import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { CertificateModal } from './components/CertificateModal.tsx';
import { LiveSupportWidget } from './components/LiveSupportWidget.tsx';
import { UserDashboardModal } from './components/UserDashboardModal.tsx';
import { Web3WalletModal } from './components/Web3WalletModal.tsx';
import { KycVerificationModal } from './components/KycVerificationModal.tsx';
import { WhitepaperModal } from './components/WhitepaperModal.tsx';
import { SecurityPolicyModal } from './components/SecurityPolicyModal.tsx';
import { ClientDelegatedPanelModal } from './components/ClientDelegatedPanelModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { NileBankPage } from './pages/NileBankPage.tsx';
import { NileInvestmentPage } from './pages/NileInvestmentPage.tsx';
import { NileMarketplacePage } from './pages/NileMarketplacePage.tsx';
import { NileDexPage } from './pages/NileDexPage.tsx';
import { NileTokenPage } from './pages/NileTokenPage.tsx';
import { NilePresalePage } from './pages/NilePresalePage.tsx';
import { CardsPage } from './pages/CardsPage.tsx';
import { KycVerificationPage } from './pages/KycVerificationPage.tsx';
import { UserProfilePage } from './pages/UserProfilePage.tsx';
import { ReferralsPage } from './pages/ReferralsPage.tsx';
import { EducationPage } from './pages/EducationPage.tsx';
import { AdminPortalPage } from './pages/AdminPortalPage.tsx';

const AppContent: React.FC = () => {
  const { activeTab, toast } = useApp();

  // Global Modals State
  const [dashboardModalOpen, setDashboardModalOpen] = useState(false);
  const [dashboardDefaultTab, setDashboardDefaultTab] = useState<'overview' | 'history' | 'deposit' | 'withdraw' | 'swap'>('overview');
  const [web3ModalOpen, setWeb3ModalOpen] = useState(false);
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [whitepaperModalOpen, setWhitepaperModalOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);

  // Global custom event listeners for modal triggers
  useEffect(() => {
    const handleOpenDashboard = (e?: any) => {
      if (e?.detail?.tab) {
        setDashboardDefaultTab(e.detail.tab);
      }
      setDashboardModalOpen(true);
    };
    const handleOpenWeb3 = () => setWeb3ModalOpen(true);
    const handleOpenKyc = () => setKycModalOpen(true);
    const handleOpenWhitepaper = () => setWhitepaperModalOpen(true);
    const handleOpenSecurity = () => setSecurityModalOpen(true);

    window.addEventListener('open-dashboard-modal', handleOpenDashboard);
    window.addEventListener('open-web3-modal', handleOpenWeb3);
    window.addEventListener('open-kyc-modal', handleOpenKyc);
    window.addEventListener('open-whitepaper-modal', handleOpenWhitepaper);
    window.addEventListener('open-security-modal', handleOpenSecurity);

    return () => {
      window.removeEventListener('open-dashboard-modal', handleOpenDashboard);
      window.removeEventListener('open-web3-modal', handleOpenWeb3);
      window.removeEventListener('open-kyc-modal', handleOpenKyc);
      window.removeEventListener('open-whitepaper-modal', handleOpenWhitepaper);
      window.removeEventListener('open-security-modal', handleOpenSecurity);
    };
  }, []);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'bank':
        return <NileBankPage />;
      case 'investment':
        return <NileInvestmentPage />;
      case 'marketplace':
        return <NileMarketplacePage />;
      case 'dex':
        return <NileDexPage />;
      case 'token':
        return <NileTokenPage />;
      case 'presale':
        return <NilePresalePage />;
      case 'cards':
        return <CardsPage />;
      case 'profile':
        return <UserProfilePage />;
      case 'kyc':
        return <KycVerificationPage />;
      case 'referrals':
        return <ReferralsPage />;
      case 'education':
        return <EducationPage />;
      case 'admin':
        return <AdminPortalPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-[#030611] text-slate-100 font-sans selection:bg-[#E5B842]/30 selection:text-white">
      {/* 1. Fixed Background Artwork Layer with Dark Luxury Vignette Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Artwork Image with 75% dark vignette overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity filter contrast-125"
          style={{ backgroundImage: `url('/assets/branding/1000095277.jpg')` }}
        />
        {/* Dark Luxury Vignette Gradient Overlay (68% to 85% opacity) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030611]/80 via-[#030611]/72 to-[#030611]/90" />
        
        {/* Ambient floating radial glow orbs: Emerald Cyan (#00E599) & Nile Gold (#F59E0B) */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#00E599]/10 blur-[130px]" />
        <div className="absolute top-1/3 -right-40 w-[650px] h-[650px] rounded-full bg-[#F59E0B]/10 blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[700px] h-[700px] rounded-full bg-[#00E599]/08 blur-[150px]" />

        {/* Micro Cyber-Grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      {/* 2. Toast Notification Alert */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-2 ${
            toast.type === 'success' 
              ? 'bg-[#09152C] border-emerald-500/60 text-emerald-300 shadow-emerald-950/50' 
              : toast.type === 'error'
                ? 'bg-[#1C0D15] border-red-500/60 text-red-300 shadow-red-950/50'
                : 'bg-[#09152C] border-[#E5B842]/60 text-amber-200 shadow-amber-950/50'
          }`}>
            <span className="w-2 h-2 rounded-full bg-current animate-ping" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* 3. Main Navigation Header */}
      <div className="relative z-40">
        <Header />
      </div>

      {/* 4. Main Page Viewport */}
      <main className="flex-1 relative z-10">
        {renderActivePage()}
      </main>

      {/* 5. Enterprise Institutional Modals & Live Support Widget */}
      <div className="relative z-50">
        <CertificateModal />
        <LiveSupportWidget />
        <UserDashboardModal 
          isOpen={dashboardModalOpen} 
          onClose={() => setDashboardModalOpen(false)} 
          defaultTab={dashboardDefaultTab}
        />
        <KycVerificationModal isOpen={kycModalOpen} onClose={() => setKycModalOpen(false)} />
        <WhitepaperModal isOpen={whitepaperModalOpen} onClose={() => setWhitepaperModalOpen(false)} />
        <SecurityPolicyModal isOpen={securityModalOpen} onClose={() => setSecurityModalOpen(false)} />
        <ClientDelegatedPanelModal />
        <AuthModal />
      </div>

      {/* 6. Main Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
