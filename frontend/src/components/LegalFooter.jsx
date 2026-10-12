import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LegalFooter() {
  const { t } = useAuth();
  const [activeLegalModal, setActiveLegalModal] = useState(null); // 'terms', 'privacy', 'risk'

  return (
    <footer className="border-t border-slate-800 bg-nile-950 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/5">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-nile-accent to-emerald-400 flex items-center justify-center text-xl">
                🐊
              </div>
              <span className="font-extrabold text-lg text-white tracking-wider">
                NILE <span className="text-nile-accent">INVESTMENT</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The premier Web3 financial protocol merging private banking rigor with decentralized algorithmic liquidity.
            </p>
            <div className="pt-2 space-y-1.5">
              <div>
                <span className="font-bold text-slate-200">European Commercial Registration (AT):</span>
                <div className="text-[11px] text-slate-400 font-mono">FN: <strong className="text-emerald-400">FN 674459 m</strong> • VAT ID: <strong className="text-cyan-400">ATU-69250650</strong></div>
              </div>
              <div>
                <span className="font-bold text-slate-200">Registered Office (UK):</span>
                <div className="text-[11px] text-slate-400">47 Academy Street, Berwick Bassett, SN4 7DZ, United Kingdom</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  CRN: <strong className="text-amber-400">08253865</strong> • VAT: <strong className="text-cyan-400">GB 853 3471 65</strong> • EORI: <strong className="text-emerald-400">GB 271 210 166 000</strong>
                </div>
              </div>
              <div>
                <span className="font-bold text-slate-200">MENA Office (UAE):</span>
                <div className="text-[11px] text-slate-400">Business Bay, Dubai, United Arab Emirates</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  TRN: <strong className="text-cyan-400">100820028255333</strong>
                </div>
              </div>
              <div>
                <span className="font-bold text-slate-200">US Corporate Tax ID (IRS):</span>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  EIN: <strong className="text-emerald-400">26-5082432</strong> • Ref: <strong className="text-slate-300">887181565</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-4">Ecosystem</h4>
            <ul className="space-y-2.5">
              <li><a href="#plans" className="hover:text-nile-accent transition-colors">Investment Plans</a></li>
              <li><a href="#token" className="hover:text-nile-accent transition-colors">NILE Token & 2× Booster</a></li>
              <li><a href="#token" className="hover:text-nile-accent transition-colors">Staking Pools (30/50/100d)</a></li>
              <li><a href="#marketplace" className="hover:text-nile-accent transition-colors">Web3 Marketplace</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-4">Governance & Trust</h4>
            <ul className="space-y-2.5">
              <li><a href="#security" className="hover:text-nile-accent transition-colors">Smart Contract Audits</a></li>
              <li><a href="#security" className="hover:text-nile-accent transition-colors">MPC Key Architecture</a></li>
              <li><a href="#offices" className="hover:text-nile-accent transition-colors">KYC Verification</a></li>
              <li><button onClick={() => setActiveLegalModal('risk')} className="hover:text-nile-accent text-left">Risk Disclosures</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-xs mb-4">Institutional Desk</h4>
            <ul className="space-y-2.5 text-[11px]">
              <li>Support Hotline: <a href="tel:+447552847468" className="text-slate-200 hover:text-nile-accent">+44 7552 847468</a></li>
              <li>Email: <a href="mailto:support@nileecosystem.com" className="text-slate-200 hover:text-nile-accent">support@nileecosystem.com</a></li>
              <li>Withdrawal Windows: 4 Cycles / Day</li>
              <li>Security Response: 24/7 Desk</li>
            </ul>
          </div>

        </div>

        {/* Regulatory Risk Warning Banner */}
        <div className="py-6 border-b border-white/5 space-y-2 text-[11px] text-slate-500 leading-relaxed">
          <p>
            <strong className="text-slate-400">Risk Disclosure & Volatility Notice:</strong> {t.footer.disclaimer} Digital asset investments are subject to market risks, including the potential loss of principal. Algorithmic rewards are calculated in accordance with platform plan rules and ledger validation.
          </p>
          <p>
            {t.footer.compliance}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 NILE Ecosystem Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setActiveLegalModal('terms')} className="hover:text-slate-300 transition-colors">
              {t.footer.terms}
            </button>
            <button onClick={() => setActiveLegalModal('privacy')} className="hover:text-slate-300 transition-colors">
              {t.footer.privacy}
            </button>
            <button onClick={() => setActiveLegalModal('risk')} className="hover:text-slate-300 transition-colors">
              {t.footer.trust}
            </button>
          </div>
        </div>

      </div>

      {/* Legal Information Modal */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-2xl p-7 rounded-3xl border border-white/20 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setActiveLegalModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white font-bold"
            >
              ✕
            </button>

            {activeLegalModal === 'terms' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Terms of Service — NILE Investment</h3>
                <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                  <p>1. <strong>Eligibility:</strong> Users must be of legal age in their jurisdiction and pass standard anti-money laundering (AML) and KYC checks where required.</p>
                  <p>2. <strong>Internal Ledger & Wallets:</strong> The platform maintains segregated Internal, Investment, Referral, and Shop wallets. Transactions are tracked on-chain via transaction hashes (TXIDs).</p>
                  <p>3. <strong>Withdrawal Protocol:</strong> To maintain institutional reserve liquidity and anti-fraud monitoring, withdrawal requests are executed across 4 dedicated 3-hour windows daily following manual compliance verification.</p>
                  <p>4. <strong>Referral Policy:</strong> Referral rewards must be reinvested into active platform plans prior to redemption or withdrawal.</p>
                </div>
              </div>
            )}

            {activeLegalModal === 'privacy' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Privacy Policy & Data Protection</h3>
                <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                  <p>1. <strong>Data Encryption:</strong> All personal credentials, passwords, and KYC documents are encrypted using bank-grade AES-256 and salted bcrypt hashing.</p>
                  <p>2. <strong>No Unauthorized Sharing:</strong> We do not sell or monetize personal investor information. Identity verifications are strictly used for compliance with international financial regulations.</p>
                  <p>3. <strong>Right to Data Erasure:</strong> Clients can request full account deactivation and data purging subject to legal recordkeeping obligations.</p>
                </div>
              </div>
            )}

            {activeLegalModal === 'risk' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Risk Disclosure & Regulatory Compliance</h3>
                <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                  <p>1. <strong>Market Volatility:</strong> Cryptocurrency prices fluctuate rapidly. Users must exercise due diligence before committing capital to time-locked or asset-based plans.</p>
                  <p>2. <strong>Smart Contract Security:</strong> While our smart contracts and MPC custody wallets undergo 100% formal auditing, decentralized technologies inherently carry protocol risks.</p>
                  <p>3. <strong>Independent Financial Advice:</strong> Content on this platform does not constitute financial, investment, or tax advice. Consult certified advisors prior to large capital deployments.</p>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-white/10 text-right">
              <button
                onClick={() => setActiveLegalModal(null)}
                className="px-5 py-2 rounded-xl bg-nile-accent text-nile-950 font-bold text-xs"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
