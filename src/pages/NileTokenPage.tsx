import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { TOTAL_TOKEN_SUPPLY } from '../data/initialData.ts';
import { 
  Coins, 
  PieChart, 
  Calendar, 
  Flame, 
  ShieldCheck, 
  FileText, 
  CheckCircle, 
  Download, 
  Layers, 
  ArrowRight,
  ExternalLink,
  Lock,
  Unlock,
  TrendingUp,
  AlertTriangle,
  Clock,
  Sparkles,
  Info,
  DollarSign,
  Award,
  Cpu,
  GitCommit,
  Check,
  Zap
} from 'lucide-react';
import { NileStakingPool, NileUserStake } from '../types/index.ts';
import { NileTokenCoin } from '../components/NileTokenCoin.tsx';

export const NileTokenPage: React.FC = () => {
  const { 
    setActiveTab, 
    showToast,
    balances,
    tokenomicsAllocations,
    vestingEvents,
    stakingPools,
    userStakes,
    stakeTokens,
    unstakeTokens,
    claimStakingRewards,
    calculateAccruedReward,
    user
  } = useApp();

  const [activeSection, setActiveSection] = useState<'tokenomics' | 'workflow' | 'roadmap' | 'vesting' | 'staking' | 'utilities'>('tokenomics');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(0);
  const [vestingFilter, setVestingFilter] = useState<string>('All');

  // Staking form state
  const [selectedPoolId, setSelectedPoolId] = useState<string>(stakingPools[0]?.id || 'pool-30d');
  const [stakeAmountInput, setStakeAmountInput] = useState<string>('5000');
  const [stakeModalOpen, setStakeModalOpen] = useState<boolean>(false);
  const [unstakeConfirmId, setUnstakeConfirmId] = useState<string | null>(null);

  const selectedPool = stakingPools.find(p => p.id === selectedPoolId) || stakingPools[0];
  const stakeAmountNumber = parseFloat(stakeAmountInput) || 0;

  // Staking projection calculations
  const projectedApr = selectedPool ? selectedPool.baseAprPercent * selectedPool.multiplier : 0;
  const projectedMaturityReward = selectedPool 
    ? Math.floor((stakeAmountNumber * (projectedApr / 100) * (selectedPool.lockDays / 365)))
    : 0;
  const projectedDailyReward = (stakeAmountNumber * (projectedApr / 100)) / 365;

  const totalStakedByUser = userStakes
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + s.stakedAmountNile, 0);

  const totalAccruedRewards = userStakes
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + calculateAccruedReward(s), 0);

  // Dynamic SVG Donut calculations from tokenomicsAllocations
  const totalPercentage = tokenomicsAllocations.reduce((sum, a) => sum + a.percentage, 0);
  let cumulativePercent = 0;
  const donutSegments = tokenomicsAllocations.map((alloc) => {
    const strokeDasharray = `${alloc.percentage} ${100 - alloc.percentage}`;
    const strokeDashoffset = -cumulativePercent;
    cumulativePercent += alloc.percentage;
    return {
      ...alloc,
      strokeDasharray,
      strokeDashoffset
    };
  });

  const downloadWhitepaperSpecimen = () => {
    const content = `NILE ECOSYSTEM WHITEPAPER V2.0
==================================================
The Unified Digital Finance Ecosystem
Issuer: NILE INVESTMENT LTD (Cardiff, UK #08253865)

TOTAL SUPPLY: ${TOTAL_TOKEN_SUPPLY.toLocaleString()} NILE
==================================================
1. TOKEN ALLOCATIONS:
${tokenomicsAllocations.map(a => `- ${a.category}: ${a.percentage}% (${a.amount.toLocaleString()} NILE) — ${a.lockPeriod}`).join('\n')}

2. VESTING UNLOCK SCHEDULE:
${vestingEvents.map(e => `- [${e.date}] ${e.title}: ${e.allocationTokens.toLocaleString()} NILE (${e.category})`).join('\n')}

3. STAKING VAULTS & INCENTIVES:
${stakingPools.map(p => `- ${p.title}: Lock ${p.lockDays}d | Base APR ${p.baseAprPercent}% | Multiplier ${p.multiplier}x | Min ${p.minStakeNile} NILE`).join('\n')}

4. AUTONOMOUS AI OPERATIONS & REGULATIONS:
- 100% of operations managed by autonomous AI agents (real-time risk modeling & AML)
- Statutory registration: UK Companies House (CRN: 08253865, VAT: GB 853 3471 65)
- European Union / Vienna Commercial Court: FN 674459 m | UID: ATU-69250650
- UAE Federal Tax Authority (Dubai): TRN 100820028255333
- Bitcoin On-Chain Treasury Proof: TXID 900d114ebb2cd6f9daae5f4474a0f7dce9292d51c5478810fa21939c19fb885f

5. NILE TOKEN OPERATIONAL WORKFLOW:
- Genesis hard cap of 500,000,000 NILE (keys renounced)
- 15% TGE unlock with 85% stream-released across 9 months
- Permanent DEX liquidity seeding on BNB Chain & Ethereum
- 1,000,000 NILE staking multiplier activates up to 50,000% yields
- 20% net banking commission buyback and burn engine

6. NILE TOKEN STRATEGIC ROADMAP:
- Epoch I (Q1-Q2 2026): Seed Pioneer Round ($0.05), Smart Contract Audit, DEX Seeding
- Epoch II (Q3-Q4 2026): Tier-1 CEX Listings, Diamond Staking Vaults, 1M Booster Activation
- Epoch III (2027): Cross-Chain Bridges (Solana/TRON/Arbitrum), Black Metal Card Spend
- Epoch IV (2028+): Sovereign Nile L1 Mainnet Migration, Sovereign Gas Utility

Verified at Companies House, Cardiff, United Kingdom.`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'NILE-Ecosystem-Whitepaper-v2.txt';
    a.click();
    showToast('Downloaded official NILE Whitepaper overview.', 'info');
  };

  const handleExecuteStake = (e: React.FormEvent) => {
    e.preventDefault();
    if (stakeAmountNumber <= 0) {
      showToast('Please enter a valid stake amount.', 'error');
      return;
    }
    const success = stakeTokens(selectedPoolId, stakeAmountNumber);
    if (success) {
      setStakeModalOpen(false);
      setStakeAmountInput('');
    }
  };

  const handleConfirmUnstake = (stakeId: string) => {
    const success = unstakeTokens(stakeId);
    if (success) {
      setUnstakeConfirmId(null);
    }
  };

  const filteredVestingEvents = vestingFilter === 'All'
    ? vestingEvents
    : vestingEvents.filter(e => e.category.toLowerCase().includes(vestingFilter.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4 flex flex-col items-center">
        <div className="p-2 rounded-full bg-gradient-to-tr from-[#E5B842]/30 via-transparent to-cyan-400/20 shadow-2xl">
          <NileTokenCoin size="lg" animate={true} />
        </div>

        <div className="text-xs font-bold uppercase tracking-widest text-[#E5B842] font-mono">
          Ecosystem Native Asset
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          NILE Tokenomics & Staking
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          The sovereign utility, settlement, and yield-bearing asset powering Nile Crypto Bank, Nile DEX liquidity pools, investment vaults, and marketplace commerce.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setActiveSection('staking')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeSection === 'staking'
                ? 'bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] shadow-lg scale-105'
                : 'bg-slate-900 border border-slate-700 hover:border-slate-500 text-white'
            }`}
          >
            <Coins className="w-4 h-4 text-[#E5B842]" />
            <span>Open Staking Module</span>
          </button>

          <button
            onClick={() => setActiveTab('presale')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            <Flame className="w-4 h-4 fill-[#070D1B]" />
            <span>Join Token Presale</span>
          </button>

          <button
            onClick={downloadWhitepaperSpecimen}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-200 font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-[#E5B842]" />
            <span>Whitepaper V2.0</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#091124] border border-slate-800 text-center">
          <div className="text-xs text-slate-400">Total Fixed Supply</div>
          <div className="text-2xl font-black text-white font-mono mt-1">500,000,000</div>
          <div className="text-[10px] text-[#E5B842] mt-0.5 font-semibold">100% Fixed & Audited</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#091124] border border-slate-800 text-center">
          <div className="text-xs text-slate-400">Presale Seed Price</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">$0.05 USD</div>
          <div className="text-[10px] text-emerald-500 mt-0.5">Phase 1 Pioneer Round</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#091124] border border-slate-800 text-center">
          <div className="text-xs text-slate-400">Your Verified NILE Balance</div>
          <div className="text-2xl font-black text-[#E5B842] font-mono mt-1">
            {balances.NILE.toLocaleString()} NILE
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Available for Staking</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#091124] border border-slate-800 text-center">
          <div className="text-xs text-slate-400">Max Staking APY</div>
          <div className="text-2xl font-black text-cyan-400 font-mono mt-1">32.0% APR</div>
          <div className="text-[10px] text-cyan-500 mt-0.5">365-Day Diamond Multiplier</div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800 text-xs">
        {[
          { id: 'tokenomics', label: 'Interactive Tokenomics Allocation', icon: PieChart },
          { id: 'workflow', label: 'Token Operational Workflow', icon: Cpu, highlight: true },
          { id: 'roadmap', label: 'NILE Token Dedicated Roadmap', icon: TrendingUp, highlight: true },
          { id: 'vesting', label: 'Vesting & Unlock Schedule', icon: Calendar },
          { id: 'staking', label: 'NILE Staking Module & Rewards', icon: Coins },
          { id: 'utilities', label: 'Ecosystem Utilities & Perks', icon: Layers }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeSection === tab.id
                ? 'bg-[#E5B842] text-[#070D1B] shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {tab.highlight && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1" />}
          </button>
        ))}
      </div>

      {/* SECTION 1: INTERACTIVE TOKENOMICS ALLOCATION */}
      {activeSection === 'tokenomics' && (
        <div className="p-8 sm:p-10 rounded-3xl bg-[#091124] border border-[#E5B842]/40 shadow-2xl space-y-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-[#E5B842]" />
                <span>Interactive Tokenomics Visualization</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Data directly configured via institutional backend. Dynamic allocation across 5 strategic categories.
              </p>
            </div>
            <div className="text-xs text-slate-400 font-mono bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              Total Supply: <strong className="text-white">500,000,000 NILE ({totalPercentage}%)</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* SVG Donut Chart with Interactive Slices */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {donutSegments.map((segment, idx) => (
                    <circle
                      key={segment.category}
                      cx="50"
                      cy="50"
                      r="35"
                      fill="transparent"
                      stroke={segment.color}
                      strokeWidth={selectedCategory === idx ? "17" : "13"}
                      strokeDasharray={segment.strokeDasharray}
                      strokeDashoffset={segment.strokeDashoffset}
                      className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                      onClick={() => setSelectedCategory(idx)}
                    />
                  ))}
                </svg>

                {/* Center Donut Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  {selectedCategory !== null && tokenomicsAllocations[selectedCategory] ? (
                    <>
                      <span className="text-2xl font-black text-white font-mono">
                        {tokenomicsAllocations[selectedCategory].percentage}%
                      </span>
                      <span className="text-[10px] text-[#E5B842] font-bold uppercase tracking-wider max-w-[130px] truncate">
                        {tokenomicsAllocations[selectedCategory].category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {(tokenomicsAllocations[selectedCategory].amount / 1000000).toFixed(0)}M NILE
                      </span>
                    </>
                  ) : (
                    <>
                      <NileTokenCoin size="xs" />
                      <span className="text-2xl font-black text-white font-mono">500M</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">NILE TOKENS</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-[11px] text-slate-400 mt-4 text-center">
                Click any donut segment or card below to review lock-in periods and emission terms.
              </div>
            </div>

            {/* Allocation Cards */}
            <div className="lg:col-span-7 space-y-3">
              {tokenomicsAllocations.map((alloc, idx) => (
                <div 
                  key={alloc.category}
                  onClick={() => setSelectedCategory(idx)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedCategory === idx 
                      ? 'bg-slate-800/90 border-[#E5B842] shadow-lg scale-[1.01]' 
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span 
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow" 
                        style={{ backgroundColor: alloc.color }} 
                      />
                      <span className="font-bold text-white text-sm">{alloc.category}</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-white font-bold text-sm">{alloc.percentage}%</span>
                      <span className="text-slate-400 ml-2">({(alloc.amount / 1000000).toFixed(1)}M NILE)</span>
                    </div>
                  </div>

                  {/* Progress bar visual */}
                  <div className="w-full bg-slate-950 h-1.5 rounded-full mt-2.5 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${alloc.percentage}%`, backgroundColor: alloc.color }}
                    />
                  </div>

                  <div className="text-[11px] text-slate-400 mt-2 pl-6 flex items-center justify-between">
                    <div>
                      <strong className="text-slate-300">Vesting Terms:</strong> {alloc.lockPeriod}
                    </div>
                    {selectedCategory === idx && (
                      <span className="text-[10px] font-bold text-[#E5B842] uppercase tracking-wider">
                        Active Selection
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION: DEDICATED TOKEN OPERATIONAL WORKFLOW */}
      {activeSection === 'workflow' && (
        <div className="p-8 sm:p-10 rounded-3xl bg-[#091124] border border-[#E5B842]/40 shadow-2xl space-y-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#E5B842]/20 border border-[#E5B842]/40 text-[#E5B842] font-mono text-[11px] font-bold uppercase tracking-wider">
                  Dedicated Token Architecture
                </span>
                <span className="text-xs text-slate-400">· 500M Hard Cap</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#E5B842]" />
                <span>NILE Token Lifecycle & Operational Workflow</span>
              </h3>
              <p className="text-xs text-slate-400">
                End-to-end algorithmic token dynamics governing minting, linear vesting, DEX liquidity, institutional yield boosts, and programmatic deflationary burns.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('presale')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 fill-[#070D1B]" />
                <span>Presale Active ($0.05)</span>
              </button>
            </div>
          </div>

          {/* Visual Step-by-Step Architecture Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                step: '01',
                title: 'Smart Contract Genesis & Hard Cap',
                badge: 'Immutability',
                desc: 'Strictly 500,000,000 NILE tokens minted at genesis. Mint function, balance alteration, and blacklist backdoors are permanently renounced.',
                accent: 'border-amber-500/30 bg-amber-500/5 text-amber-400'
              },
              {
                step: '02',
                title: 'Multi-Round Presale Allocation',
                badge: 'Capital Formation',
                desc: 'Seed Pioneer ($0.05), Strategic ($0.08), and Public ($0.12) rounds accept multi-chain deposits with instant verifiable allocation records.',
                accent: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400'
              },
              {
                step: '03',
                title: 'Automated 15% TGE & Linear Vesting',
                badge: 'Zero-Dump Protection',
                desc: '15% instant claim at Token Generation Event (TGE). The remaining 85% unlocks on-chain in equal daily tranches across 9 months to stabilize price floors.',
                accent: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400'
              },
              {
                step: '04',
                title: 'Nile DEX AMM Liquidity Pools',
                badge: 'Decentralized Depth',
                desc: '10% of total supply permanently seeded into non-custodial liquidity pools (NILE/USDT, NILE/BTC, NILE/ETH) with Recharts real-time visual price telemetry.',
                accent: 'border-blue-500/30 bg-blue-500/5 text-blue-400'
              },
              {
                step: '05',
                title: '1,000,000 NILE Staking Multiplier',
                badge: 'Institutional Yield',
                desc: 'Holding and staking 1M NILE tokens unlocks a 1.5× yield multiplier on Plan 4 ULTIMATE (up to 50,000%) and 2× to 5× boosts across all other tiers.',
                accent: 'border-[#E5B842]/40 bg-[#E5B842]/10 text-[#E5B842]'
              },
              {
                step: '06',
                title: 'Programmatic Buyback & Deflationary Burn',
                badge: 'Value Accrual',
                desc: '20% of net platform banking wire and card transaction fees automatically purchase NILE on open markets and send tokens to the 0x000...dead burn address.',
                accent: 'border-rose-500/30 bg-rose-500/5 text-rose-400'
              }
            ].map((wf) => (
              <div key={wf.step} className={`p-5 rounded-2xl border ${wf.accent} space-y-3 flex flex-col justify-between`}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs font-black text-white flex items-center justify-center">
                      {wf.step}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-bold uppercase">
                      {wf.badge}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm leading-tight">{wf.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{wf.desc}</p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Smart Contract Enforced</span>
                  <NileTokenCoin size="xs" />
                </div>
              </div>
            ))}
          </div>

          {/* Token Utility Pillars Row */}
          <div className="p-6 rounded-2xl bg-[#070D1B] border border-slate-800 space-y-3">
            <h4 className="text-xs font-mono font-bold text-[#E5B842] uppercase tracking-wider">
              Real-World Token Settlement Matrix
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-bold text-white">Marketplace 20% Discount</span>
                <p className="text-[11px] text-slate-400">All physical bullion, Casascius Bitcoins, and reserve packages receive a 20% discount when settling with NILE.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-bold text-white">Banking Fee Reductions</span>
                <p className="text-[11px] text-slate-400">Holding NILE waives international wire commissions and reduces foreign exchange conversion spreads to 0.00%.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-bold text-white">5% Instant Card Cashback</span>
                <p className="text-[11px] text-slate-400">Card swipes across 180+ countries credit up to 5% instant cashback in NILE token directly to your active card ledger.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION: DEDICATED TOKEN STRATEGIC ROADMAP */}
      {activeSection === 'roadmap' && (
        <div className="p-8 sm:p-10 rounded-3xl bg-[#091124] border border-[#E5B842]/40 shadow-2xl space-y-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-wider">
                  Targeted Token Milestones
                </span>
                <span className="text-xs text-slate-400">· 2026 to 2028+</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#E5B842]" />
                <span>NILE Token Multi-Year Strategic Roadmap</span>
              </h3>
              <p className="text-xs text-slate-400">
                A dedicated, milestone-driven execution plan tracking public presale rounds, Tier-1 exchange listings, cross-chain bridge expansions, and sovereign gas migration.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveSection('staking')}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-[#E5B842] text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Coins className="w-3.5 h-3.5 text-[#E5B842]" />
                <span>View Staking Vaults</span>
              </button>
            </div>
          </div>

          {/* Timeline Cards Container */}
          <div className="space-y-4">
            {[
              {
                epoch: 'Epoch I: Token Genesis & Seed Pioneer Round',
                timeframe: 'Q1 – Q2 2026',
                status: 'CURRENTLY ACTIVE',
                statusColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
                points: [
                  'Deployment of the audited NILE token smart contract with immutable 500M fixed supply',
                  'Launch of Seed Pioneer Presale Round at $0.05 / NILE with automated 15% TGE unlock guarantee',
                  'Deployment of the 3D Glowing Gold Horus Coin visual assets across all ecosystem interfaces',
                  'Initial DEX liquidity provisioning on PancakeSwap (BEP-20) and Uniswap (ERC-20)'
                ]
              },
              {
                epoch: 'Epoch II: Tier-1 Centralized Exchange Listings & Staking Vaults',
                timeframe: 'Q3 – Q4 2026',
                status: 'IN PIPELINE',
                statusColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                points: [
                  'Targeted CEX listing applications and market maker liquidity seeding on Bitget, MEXC, and Gate.io',
                  'Activation of the 30-day, 90-day, 180-day, and 365-day Diamond Staking Pools with up to 32% APR',
                  'Integration of the 1,000,000 NILE Multiplier across all institutional investment plans',
                  'Rollout of 20% discount on all crypto reserve marketplace packages settled with native NILE token'
                ]
              },
              {
                epoch: 'Epoch III: Cross-Chain Bridges & Programmatic Buyback Burns',
                timeframe: '2027',
                status: 'SCHEDULED',
                statusColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
                points: [
                  'Deployment of trustless cross-chain bridges connecting BNB Chain, Ethereum, Solana, and TRON',
                  'Integration of NILE Token into physical Black Metal cards for direct POS merchant payments globally',
                  'Execution of first programmatic quarterly buyback and token burn utilizing 20% of net banking revenue',
                  'Institutional liquidity underwriting alliances with regulated European private banks'
                ]
              },
              {
                epoch: 'Epoch IV: Sovereign Nile Layer-1 Blockchain Gas Asset Migration',
                timeframe: '2028+',
                status: 'VISIONARY DYNASTY',
                statusColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
                points: [
                  'Mainnet genesis of the dedicated high-performance Nile Layer-1 Blockchain',
                  '1:1 migration of NILE tokens to sovereign native gas coin powering decentralized bank clearing',
                  'Activation of validator node staking rewards and sovereign governance DAO voting rights',
                  'Permanent 500M supply preservation with irreversible cryptographic scarcity guarantees'
                ]
              }
            ].map((ep) => (
              <div key={ep.epoch} className="p-5 rounded-2xl bg-[#070D1B] border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <NileTokenCoin size="xs" />
                    <h4 className="font-extrabold text-white text-sm">{ep.epoch}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#E5B842]">{ep.timeframe}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold uppercase tracking-wider ${ep.statusColor}`}>
                      {ep.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {ep.points.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-[#E5B842] shrink-0 mt-0.5" />
                      <span className="leading-snug">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: VESTING SCHEDULE & UNLOCK TIMELINE */}
      {activeSection === 'vesting' && (
        <div className="p-8 sm:p-10 rounded-3xl bg-[#091124] border border-slate-800 space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <span>Vesting Schedule & Unlock Calendar</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Deterministic unlock timeline enforcing long-term alignment and preventing systemic market dilution.
              </p>
            </div>
            
            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {['All', 'Liquidity', 'Community', 'Ecosystem', 'Marketplace', 'Team'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setVestingFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                    vestingFilter === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVestingEvents.map(event => (
              <div key={event.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-[#E5B842] font-mono font-bold">
                    {event.date}
                  </span>
                  <span className="text-cyan-400 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                    {event.category}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white leading-snug">{event.title}</h4>
                  <div className="text-base font-mono font-black text-emerald-400 mt-1.5 flex items-center gap-1.5">
                    <Unlock className="w-4 h-4 text-emerald-400" />
                    <span>{(event.allocationTokens / 1000000).toFixed(2)}M NILE</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {((event.allocationTokens / TOTAL_TOKEN_SUPPLY) * 100).toFixed(2)}% of total supply
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Smart Contract Lock</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              All vesting contracts are deployed under multi-signature custodial controls with 14-day timelocks on administrative modifications.
            </span>
          </div>
        </div>
      )}

      {/* SECTION 3: NILE STAKING MODULE */}
      {activeSection === 'staking' && (
        <div className="space-y-8 animate-fade-in">
          {/* Staking Overview Header */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#091124] border border-[#E5B842]/40 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5B842]/10 border border-[#E5B842]/30 text-[#E5B842] text-xs font-semibold mb-2">
                  <Award className="w-4 h-4" />
                  <span>Sovereign Proof-of-Hold Engine</span>
                </div>
                <h3 className="text-2xl font-black text-white">NILE Token Staking Module</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Stake verified NILE tokens into high-yield algorithmic liquidity vaults. Earn daily interest calculated transparently and claimable anytime.
                </p>
              </div>

              <button
                onClick={() => setStakeModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-black text-xs shadow-xl hover:scale-105 transition-all flex items-center gap-2 shrink-0"
              >
                <Coins className="w-4 h-4" />
                <span>Stake NILE Tokens</span>
              </button>
            </div>

            {/* Staking Summary Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400">Your Currently Staked Amount</div>
                <div className="text-2xl font-black text-white font-mono mt-1">
                  {totalStakedByUser.toLocaleString()} <span className="text-xs text-slate-400 font-normal">NILE</span>
                </div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Active across {userStakes.filter(s => s.status === 'active').length} vaults</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400">Total Accrued Yield</div>
                <div className="text-2xl font-black text-[#E5B842] font-mono mt-1">
                  {totalAccruedRewards.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-xs text-slate-400 font-normal">NILE</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Accumulating in real-time</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400">Available in Wallet</div>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                  {balances.NILE.toLocaleString()} <span className="text-xs text-slate-400 font-normal">NILE</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Eligible for immediate vault entry</div>
              </div>
            </div>
          </div>

          {/* Staking Pools Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#E5B842]" />
                <span>Active Staking Vaults</span>
              </h4>
              <span className="text-xs text-slate-400 font-mono">
                {stakingPools.length} Pools Configured
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stakingPools.map(pool => {
                const totalApr = pool.baseAprPercent * pool.multiplier;
                return (
                  <div 
                    key={pool.id}
                    className="p-5 rounded-3xl bg-[#091124] border border-slate-800 hover:border-[#E5B842]/60 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[#E5B842] font-bold font-mono">
                          {pool.lockDays} Days Lock
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          pool.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {pool.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <NileTokenCoin size="xs" />
                        <h5 className="text-base font-black text-white group-hover:text-[#E5B842] transition-colors">
                          {pool.title}
                        </h5>
                      </div>

                      <div className="mt-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-1">
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-slate-400">Effective APY:</span>
                          <span className="text-xl font-black text-emerald-400 font-mono">
                            {totalApr.toFixed(1)}%
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center justify-between">
                          <span>Multiplier: <strong>{pool.multiplier}x</strong></span>
                          <span>Min: <strong>{pool.minStakeNile.toLocaleString()} NILE</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="text-[11px] text-slate-400 space-y-1">
                        <div className="flex justify-between">
                          <span>Total Staked in Vault:</span>
                          <span className="text-white font-mono font-semibold">
                            {(pool.totalStakedInPool / 1000000).toFixed(2)}M NILE
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Early Unstake Penalty:</span>
                          <span className="text-amber-400 font-mono font-semibold">
                            {pool.earlyUnstakePenaltyPercent}%
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedPoolId(pool.id);
                          setStakeModalOpen(true);
                        }}
                        className="w-full py-2.5 rounded-xl bg-[#E5B842] hover:bg-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Stake in this Vault</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User's Active Stakes Table */}
          <div className="p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <span>My Active Staked Positions</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time reward accrual and unlock mechanisms.
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {userStakes.length} Record(s) Found
              </span>
            </div>

            {userStakes.length === 0 ? (
              <div className="text-center py-10 space-y-3 text-slate-400">
                <Coins className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs">You have no active staked positions currently.</p>
                <button
                  onClick={() => setStakeModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#E5B842] text-[#070D1B] font-bold text-xs inline-flex items-center gap-1.5"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>Stake Now</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3 font-semibold">Vault</th>
                      <th className="pb-3 font-semibold font-mono">Staked Amount</th>
                      <th className="pb-3 font-semibold">Staked Date</th>
                      <th className="pb-3 font-semibold">Unlock Date</th>
                      <th className="pb-3 font-semibold font-mono">Accrued Yield</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {userStakes.map(stake => {
                      const pool = stakingPools.find(p => p.id === stake.poolId);
                      const accrued = calculateAccruedReward(stake);
                      const isMatured = new Date() >= new Date(stake.unlockDate);

                      return (
                        <tr key={stake.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-4 font-bold text-white">
                            {pool?.title || stake.poolId}
                          </td>
                          <td className="py-4 font-mono font-bold text-white">
                            {stake.stakedAmountNile.toLocaleString()} NILE
                          </td>
                          <td className="py-4 text-slate-400 font-mono">
                            {stake.stakedAt}
                          </td>
                          <td className="py-4 text-slate-400 font-mono">
                            {stake.unlockDate}
                          </td>
                          <td className="py-4 font-mono font-bold text-emerald-400">
                            +{accrued.toLocaleString(undefined, { maximumFractionDigits: 2 })} NILE
                          </td>
                          <td className="py-4">
                            {stake.status === 'unstaked' ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-400">
                                Unstaked
                              </span>
                            ) : isMatured ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400">
                                Matured
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-400">
                                Locked
                              </span>
                            )}
                          </td>
                          <td className="py-4 text-right space-x-2">
                            {stake.status === 'active' && (
                              <>
                                <button
                                  onClick={() => claimStakingRewards(stake.id)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-[11px] transition-colors"
                                  title="Claim accrued yield to wallet"
                                >
                                  Claim
                                </button>
                                <button
                                  onClick={() => setUnstakeConfirmId(stake.id)}
                                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] transition-colors"
                                >
                                  Unstake
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Staking Risks & Regulatory Disclosures */}
          <div className="p-6 rounded-3xl bg-[#091124] border border-amber-500/30 space-y-3 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Institutional Staking Risk Disclosures & Reward Variability</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] leading-relaxed text-slate-400">
              <p>
                <strong>Reward Calculation:</strong> Staking rewards are calculated continuously based on verified on-chain token balance and time elapsed within each vault tranche. Rates are non-guaranteed and fluctuate algorithmically with global pool saturation.
              </p>
              <p>
                <strong>Early Unstake Penalties:</strong> Premature capital redemption prior to the scheduled maturity date will incur an automated early withdrawal penalty (up to 10%) to preserve liquidity pool stability. Matured positions are exempt from penalties.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: ECOSYSTEM UTILITIES */}
      {activeSection === 'utilities' && (
        <div className="p-8 sm:p-10 rounded-3xl bg-[#091124] border border-slate-800 space-y-6 animate-fade-in">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#E5B842]" />
              <span>Comprehensive Utility Throughout Nile Products</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Multi-tiered financial benefits unlocked automatically by holding and staking NILE tokens.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="font-bold text-white text-sm">Nile Crypto Bank</div>
              <p className="text-slate-400 leading-relaxed">
                50% discount on wire transfers and internal settlement fees when holding 10,000+ NILE tokens.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="font-bold text-white text-sm">Nile Investment</div>
              <p className="text-slate-400 leading-relaxed">
                Access to exclusive Plan 4 Staking Diamond Multipliers granting elevated APR yields across all portfolios.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="font-bold text-white text-sm">Nile Marketplace</div>
              <p className="text-slate-400 leading-relaxed">
                Direct checkout currency for software licenses, Casascius Bitcoins, and zero-fee eSIM activations.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="font-bold text-white text-sm">Nile Cards</div>
              <p className="text-slate-400 leading-relaxed">
                Elevated cashback up to 5% paid automatically in NILE tokens directly to your active card ledger.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STAKE MODAL */}
      {stakeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#091124] border border-[#E5B842]/50 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-[#E5B842]" />
                <h3 className="text-lg font-bold text-white">Stake NILE Tokens</h3>
              </div>
              <button
                onClick={() => setStakeModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteStake} className="space-y-5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Select Staking Vault & Lock Duration
                </label>
                <select
                  value={selectedPoolId}
                  onChange={(e) => setSelectedPoolId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold focus:outline-none focus:border-[#E5B842]"
                >
                  {stakingPools.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title} — {p.lockDays} Days ({(p.baseAprPercent * p.multiplier).toFixed(1)}% APY)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-slate-300 font-semibold">Stake Amount (NILE)</label>
                  <span className="text-slate-400 text-[11px]">
                    Available: <strong className="text-emerald-400 font-mono">{balances.NILE.toLocaleString()} NILE</strong>
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min={selectedPool?.minStakeNile || 500}
                    step="100"
                    value={stakeAmountInput}
                    onChange={(e) => setStakeAmountInput(e.target.value)}
                    required
                    className="w-full pl-3 pr-20 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-base font-bold focus:outline-none focus:border-[#E5B842]"
                  />
                  <button
                    type="button"
                    onClick={() => setStakeAmountInput(balances.NILE.toString())}
                    className="absolute right-2 top-2 px-2.5 py-1.5 rounded-lg bg-[#E5B842]/20 hover:bg-[#E5B842]/30 text-[#E5B842] font-black text-[10px] uppercase"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Reward Projection Capsule */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Vault APR:</span>
                  <span className="text-emerald-400 font-mono font-bold">{projectedApr.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Projected Return at Maturity:</span>
                  <span className="text-[#E5B842] font-mono font-bold">+{projectedMaturityReward.toLocaleString()} NILE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Daily Accrual:</span>
                  <span className="text-white font-mono">+{projectedDailyReward.toFixed(2)} NILE / day</span>
                </div>
                <div className="flex justify-between text-[11px] text-amber-400 pt-1 border-t border-slate-800">
                  <span>Early Unstake Fee:</span>
                  <span>{selectedPool?.earlyUnstakePenaltyPercent}% if withdrawn before lock end</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStakeModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold shadow-lg hover:scale-[1.02] transition-all"
                >
                  Confirm & Lock Tokens
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UNSTAKE CONFIRMATION MODAL */}
      {unstakeConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#091124] border border-red-500/40 p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-white">Confirm Token Unstake</h3>
            </div>

            {(() => {
              const stake = userStakes.find(s => s.id === unstakeConfirmId);
              const pool = stakingPools.find(p => p.id === stake?.poolId);
              const isMatured = stake ? new Date() >= new Date(stake.unlockDate) : false;
              const penalty = isMatured ? 0 : pool?.earlyUnstakePenaltyPercent || 0;

              return (
                <div className="space-y-4 text-xs text-slate-300">
                  <p>
                    Are you sure you want to unstake from <strong>{pool?.title}</strong>?
                  </p>
                  
                  {!isMatured ? (
                    <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Early Unstake Warning</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        This stake is locked until {stake?.unlockDate}. Withdrawing now incurs a <strong>{penalty}% early penalty</strong>.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 font-semibold">
                      ✓ Position has matured! Full principal and rewards will be returned with zero penalty.
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => setUnstakeConfirmId(null)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
                    >
                      Keep Staked
                    </button>
                    <button
                      onClick={() => handleConfirmUnstake(unstakeConfirmId)}
                      className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold shadow"
                    >
                      Confirm Unstake
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
