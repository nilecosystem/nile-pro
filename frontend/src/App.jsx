import React from 'react';
import LiveCryptoTicker from './components/LiveCryptoTicker';
import Navbar from './components/Navbar';
import AppInstallBanner from './components/AppInstallBanner';
import HeroSection from './components/HeroSection';
import LivePayoutStream from './components/LivePayoutStream';
import PresaleSection from './components/PresaleSection';
import ReservesProofSection from './components/ReservesProofSection';
import FeaturesSection from './components/FeaturesSection';
import InvestmentPlansSection from './components/InvestmentPlansSection';
import NileTokenSection from './components/NileTokenSection';
import MarketplaceSection from './components/MarketplaceSection';
import NileCryptoSoftwareSection from './components/NileCryptoSoftwareSection';
import SecurityTrustSection from './components/SecurityTrustSection';
import GlobalOfficesSection from './components/GlobalOfficesSection';
import LegalFooter from './components/LegalFooter';
import MobileBottomNav from './components/MobileBottomNav';
import LiveSupportWidget from './components/LiveSupportWidget';
import AuthModal from './components/AuthModal';
import UserDashboardModal from './components/UserDashboardModal';
import AdminPanelModal from './components/AdminPanelModal';

export default function App() {
  return (
    <div className="min-h-screen bg-nile-950 text-slate-100 flex flex-col selection:bg-nile-accent/30 selection:text-nile-accent pb-16 lg:pb-0">
      {/* Live Market Bar at Top */}
      <LiveCryptoTicker />
      
      {/* Navbar with Sticky Glass Effect */}
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />
        
        {/* Real-time Transparent Payouts Stream */}
        <div className="px-4">
          <LivePayoutStream />
        </div>

        {/* PWA / Native App Install Banner */}
        <div className="my-6">
          <AppInstallBanner />
        </div>

        <PresaleSection />
        <ReservesProofSection />
        <FeaturesSection />
        <InvestmentPlansSection />
        <NileTokenSection />
        <MarketplaceSection />
        <NileCryptoSoftwareSection />
        <SecurityTrustSection />
        <GlobalOfficesSection />
      </main>

      <LegalFooter />

      {/* Floating 24/7 Client Support Widget */}
      <LiveSupportWidget />

      {/* Native App-Style Bottom Navigation for Mobile */}
      <MobileBottomNav />

      {/* Interactive Global Modals */}
      <AuthModal />
      <UserDashboardModal />
      <AdminPanelModal />
    </div>
  );
}
