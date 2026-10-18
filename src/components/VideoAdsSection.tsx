import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { NileTokenCoin } from './NileTokenCoin.tsx';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  CheckCircle, 
  ExternalLink, 
  Award, 
  Building2, 
  TrendingUp, 
  Flame, 
  Layers, 
  ArrowRight,
  Clock,
  Radio,
  Share2
} from 'lucide-react';
import { OFFICIAL_SUPPORT_CHANNELS } from '../data/paymentConfig.ts';

interface VideoAdItem {
  id: string;
  title: string;
  badge: string;
  duration: string;
  views: string;
  category: string;
  summary: string;
  keyPoints: string[];
  gradient: string;
  glowColor: string;
}

const VIDEO_PLAYLIST: VideoAdItem[] = [
  {
    id: 'intro-bank',
    title: 'The First Genuine Nile Crypto Bank: Vision & Public Trust',
    badge: 'Flagship Presentation',
    duration: '02:48',
    views: '48.2K Views',
    category: 'Institutional Spotlight',
    summary: 'Presenting the Nile Ecosystem as the world’s first genuine crypto bank engineered to foster complete public trust. Discover how autonomous artificial intelligence powers 100% of platform operations under strict international regulatory compliance.',
    keyPoints: [
      'Engineered specifically to establish unshakeable public and institutional trust',
      '100% of banking, portfolio routing, and liquidity managed by autonomous AI',
      'Fully incorporated under English & Welsh law (Companies House Cardiff CRN: 08253865)',
      'Multi-jurisdiction statutory approvals in Vienna Commercial Court (Austria) and Dubai FTA (UAE)'
    ],
    gradient: 'from-[#0B152B] via-[#081022] to-[#040813]',
    glowColor: '#E5B842'
  },
  {
    id: 'ai-operations',
    title: 'Autonomous Artificial Intelligence in Modern Banking',
    badge: 'Deep Tech Architecture',
    duration: '03:15',
    views: '34.9K Views',
    category: 'AI Operational Engine',
    summary: 'A deep-dive analysis of how the Nile AI Engine eliminates human error, predicts market slippage, automates zero-latency cross-border settlements, and operates continuous 24/7 autonomous fraud neutralization.',
    keyPoints: [
      'Neural risk assessment scans all internal and blockchain settlements in < 80ms',
      'Algorithmic AMM vault rebalancing with dynamic zero-loss slippage prevention',
      'Predictive cyber-threat neutralization and automated cold-storage containment',
      'Zero human counterparty risk across all deposit and yield disbursements'
    ],
    gradient: 'from-[#0A1A2F] via-[#071224] to-[#030814]',
    glowColor: '#00E599'
  },
  {
    id: 'global-compliance',
    title: 'Global Regulatory Compliance & Statutory Proof of Reserve',
    badge: 'Audited Transparency',
    duration: '02:30',
    views: '29.4K Views',
    category: 'Regulatory Standards',
    summary: 'Comprehensive legal dossier examining Nile Investment Ltd’s statutory compliance across the United Kingdom, European Union (Austria), and United Arab Emirates, backed by immutable on-chain Bitcoin treasury proofs.',
    keyPoints: [
      'UK Companies House registered with active corporate VAT ID: GB 853 3471 65',
      'Commercial Court Vienna registration (FN 674459 m) & Austrian VAT (ATU-69250650)',
      'UAE Federal Tax Authority registered (TRN 100820028255333) for Gulf operations',
      'Immutable on-chain Bitcoin blockchain treasury proof: TXID 900d114e...885f'
    ],
    gradient: 'from-[#120F2A] via-[#0A091A] to-[#03030A]',
    glowColor: '#8B5CF6'
  },
  {
    id: 'nile-tokenomics',
    title: 'NILE Token: Utility, Staking Vaults & 50,000% Yield Engine',
    badge: 'Tokenomics & Staking',
    duration: '03:45',
    views: '56.1K Views',
    category: 'Native Sovereign Asset',
    summary: 'Explore the native utility token powering Nile Crypto Bank. Learn how 500,000,000 fixed tokens, 15% TGE unlock, programmatic buyback burns, and holding 1,000,000 NILE unlock 5× yield multipliers and the 50,000% ULTIMATE plan.',
    keyPoints: [
      'Strict 500,000,000 fixed supply with zero mint capabilities post-deployment',
      '1,000,000 NILE staking multiplier boosts returns across all 5 investment plans',
      'Plan 4 ULTIMATE yields up to 50,000% with strict 100-investor / $1M caps',
      'Direct card fee waivers, VIP concierge perks, and 20% discount on marketplace packages'
    ],
    gradient: 'from-[#1E1706] via-[#120E04] to-[#050401]',
    glowColor: '#F59E0B'
  }
];

export const VideoAdsSection: React.FC = () => {
  const { setActiveTab } = useApp();
  const [activeVideoId, setActiveVideoId] = useState<string>('intro-bank');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [playbackSeconds, setPlaybackSeconds] = useState<number>(34);
  const [totalSeconds] = useState<number>(168); // 2:48
  const [activeTabSub, setActiveTabSub] = useState<'overview' | 'compliance' | 'ai-specs'>('overview');

  const activeVideo = VIDEO_PLAYLIST.find(v => v.id === activeVideoId) || VIDEO_PLAYLIST[0];

  // Playback timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackSeconds(prev => (prev >= totalSeconds ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalSeconds]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((playbackSeconds / totalSeconds) * 100).toFixed(1);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="video-broadcast">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/80 pb-6">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5B842]/10 border border-[#E5B842]/40 text-[#E5B842] text-xs font-mono font-bold tracking-widest uppercase">
            <Radio className="w-3.5 h-3.5 text-[#E5B842] animate-pulse" />
            <span>Official Video Broadcast Desk</span>
            <span className="text-slate-600">·</span>
            <span className="text-emerald-400">4K Ultra-HD Institutional Stream</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            The First Genuine <span className="bg-gradient-to-r from-[#FFF2A3] via-[#E5B842] to-[#00E599] bg-clip-text text-transparent">Nile Crypto Bank</span>
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Engineered from the ground up to establish unshakeable public trust. Discover how all platform operations are autonomous, managed 100% by artificial intelligence, and strictly compliant with international statutory regulations.
          </p>
        </div>

        {/* YouTube Channel Quick Link */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={OFFICIAL_SUPPORT_CHANNELS.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-600/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Official YouTube Channel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-whitepaper-modal'))}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-[#E5B842] text-white font-bold text-xs flex items-center gap-2 hover:bg-slate-800 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#E5B842]" />
            <span>Audit & Whitepaper</span>
          </button>
        </div>
      </div>

      {/* Main Video Cinema Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Cinema Player (7 cols on lg) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative rounded-3xl overflow-hidden border-2 border-slate-800 bg-[#030611] shadow-2xl shadow-black/80 group">
            {/* Ambient Top Glow Bar */}
            <div 
              className="absolute top-0 inset-x-0 h-1 transition-all duration-700"
              style={{ backgroundColor: activeVideo.glowColor }}
            />

            {/* Video Visual Screen / Simulated Canvas */}
            <div className={`relative aspect-video w-full bg-gradient-to-br ${activeVideo.gradient} flex flex-col justify-between p-6 sm:p-8 select-none overflow-hidden`}>
              {/* Background Cyber Lattice & HUD Grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#E5B842_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030611] via-transparent to-black/40 pointer-events-none" />

              {/* Floating Dynamic AI Telemetry Watermark & Regulation Seal */}
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-slate-700/80 text-xs text-white">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-mono font-bold text-emerald-400">AI CORE: ONLINE</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-300 font-mono text-[11px]">UK REG #08253865</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                    {activeVideo.badge}
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-slate-900/80 text-slate-400 font-mono text-[10px]">
                    4K 60FPS HDR
                  </span>
                </div>
              </div>

              {/* Center Playhead & 3D Brand Medallion Visual */}
              <div className="relative z-10 flex flex-col items-center justify-center my-auto space-y-4 text-center">
                <div className="relative flex items-center justify-center group/btn cursor-pointer" onClick={() => setIsPlaying(!isPlaying)}>
                  {/* Glowing Pulse Rings */}
                  <div className="absolute w-24 h-24 rounded-full bg-[#E5B842]/20 animate-ping pointer-events-none" />
                  <div className="absolute w-28 h-28 rounded-full bg-cyan-400/10 pointer-events-none" />

                  {/* Play Button Orb */}
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#E5B842] via-[#F3DF79] to-[#D4AF37] p-1 shadow-2xl shadow-[#E5B842]/40 flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                    <div className="w-full h-full rounded-full bg-[#070D1B] flex items-center justify-center text-[#E5B842]">
                      {isPlaying ? (
                        <Pause className="w-8 h-8 fill-[#E5B842]" />
                      ) : (
                        <Play className="w-8 h-8 fill-[#E5B842] translate-x-0.5" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="max-w-lg space-y-1">
                  <div className="text-xs font-mono font-bold text-[#E5B842] uppercase tracking-widest flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Nile Ecosystem Official Broadcast</span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-white drop-shadow-md">
                    {activeVideo.title}
                  </h3>
                  <p className="text-xs text-slate-300/90 hidden sm:block">
                    Autonomous AI Risk Protocol · Multi-Jurisdiction Statutory Governance · Public Trust Standard
                  </p>
                </div>
              </div>

              {/* Bottom Screen Overlay: AI Operational Metrics Live Ticker */}
              <div className="relative z-10 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Autonomous AI Governance: Active</span>
                  </span>
                  <span className="hidden sm:inline text-slate-600">·</span>
                  <span className="hidden sm:inline text-slate-300">Statutory Proof: Vienna FN 674459m</span>
                </div>
                <div className="text-slate-400 font-bold">
                  {activeVideo.views}
                </div>
              </div>
            </div>

            {/* Cinematic Control Bar */}
            <div className="p-4 bg-[#070D1B] border-t border-slate-800 space-y-3">
              {/* Scrub Progress Bar */}
              <div 
                className="w-full h-2 rounded-full bg-slate-800 cursor-pointer relative overflow-hidden group/bar"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                  setPlaybackSeconds(Math.floor(ratio * totalSeconds));
                }}
              >
                <div 
                  className="h-full rounded-full transition-all duration-300"
                  style={{ 
                    width: `${progressPercent}%`,
                    backgroundColor: activeVideo.glowColor 
                  }}
                />
              </div>

              {/* Controls & Timestamp */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 rounded-lg text-white hover:bg-slate-800 transition cursor-pointer"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-5 h-5 text-[#E5B842]" /> : <Play className="w-5 h-5 text-[#E5B842]" />}
                  </button>

                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-[#E5B842]" />}
                  </button>

                  <div className="font-mono text-slate-300 font-medium">
                    <span className="text-white font-bold">{formatTime(playbackSeconds)}</span>
                    <span className="text-slate-600"> / </span>
                    <span>{formatTime(totalSeconds)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded font-bold uppercase">
                    AI Auto-Sync 100%
                  </span>
                  <a
                    href={OFFICIAL_SUPPORT_CHANNELS.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white transition flex items-center gap-1"
                    title="Watch on official YouTube"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-[11px] hidden sm:inline">Watch on YouTube</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Video Overview & Deep Disclosure Accordion */}
          <div className="p-6 rounded-3xl bg-[#091124] border border-slate-800 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3 text-xs">
              <button
                onClick={() => setActiveTabSub('overview')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  activeTabSub === 'overview'
                    ? 'bg-[#E5B842] text-[#070D1B]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Broadcast Summary
              </button>
              <button
                onClick={() => setActiveTabSub('compliance')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  activeTabSub === 'compliance'
                    ? 'bg-[#E5B842] text-[#070D1B]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                International Regulations
              </button>
              <button
                onClick={() => setActiveTabSub('ai-specs')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  activeTabSub === 'ai-specs'
                    ? 'bg-[#E5B842] text-[#070D1B]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                AI Autonomous Architecture
              </button>
            </div>

            {activeTabSub === 'overview' && (
              <div className="space-y-3 text-xs sm:text-sm">
                <p className="text-slate-300 leading-relaxed">
                  {activeVideo.summary}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {activeVideo.keyPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <CheckCircle className="w-4 h-4 text-[#E5B842] shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-300 leading-snug">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTabSub === 'compliance' && (
              <div className="space-y-3 text-xs text-slate-300">
                <p className="leading-relaxed">
                  Nile Ecosystem is structured to deliver legal authority and fiduciary peace of mind. All financial operations adhere to multi-jurisdiction standards:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">United Kingdom</div>
                    <div className="font-bold text-white text-xs">Companies House, Cardiff</div>
                    <div className="font-mono text-[#E5B842] text-xs">CRN: 08253865</div>
                    <div className="text-[10px] text-slate-400 font-mono">VAT: GB 853 3471 65</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">European Union</div>
                    <div className="font-bold text-white text-xs">Vienna Commercial Court</div>
                    <div className="font-mono text-emerald-400 text-xs">FN 674459 m</div>
                    <div className="text-[10px] text-slate-400 font-mono">VAT: ATU-69250650</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">United Arab Emirates</div>
                    <div className="font-bold text-white text-xs">Federal Tax Authority (Dubai)</div>
                    <div className="font-mono text-purple-400 text-xs">TRN 100820028255333</div>
                    <div className="text-[10px] text-slate-400 font-mono">Tax Registered Fiduciary</div>
                  </div>
                </div>
              </div>
            )}

            {activeTabSub === 'ai-specs' && (
              <div className="space-y-3 text-xs text-slate-300">
                <p className="leading-relaxed">
                  Unlike traditional manual banking desks susceptible to delay, bias, and counterparty failure, Nile Crypto Bank operations are governed by autonomous, audited algorithmic agents:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Algorithmic Yield Optimization</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Machine learning routing dynamically allocates institutional reserves across verified liquidity pools and multi-chain vaults for peak yield stability.
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Autonomous Fraud & AML Scanner</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Sub-second screening against international sanctions watchlists and suspicious transaction velocities to maintain strict regulatory compliance.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Playlist Video Selector (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-[#091124] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-[#E5B842]" />
                <span>Featured Broadcasts ({VIDEO_PLAYLIST.length})</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Verified Stream
              </span>
            </div>

            {/* Video List */}
            <div className="space-y-2.5">
              {VIDEO_PLAYLIST.map((video) => {
                const isSelected = video.id === activeVideoId;
                return (
                  <div
                    key={video.id}
                    onClick={() => {
                      setActiveVideoId(video.id);
                      setPlaybackSeconds(0);
                      setIsPlaying(true);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-slate-900/90 border-[#E5B842] shadow-lg shadow-[#E5B842]/10 scale-[1.02]'
                        : 'bg-[#060B17] border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        isSelected ? 'bg-[#E5B842] text-[#070D1B]' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {video.badge}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {video.duration}
                      </span>
                    </div>

                    <h4 className={`text-xs font-bold leading-snug line-clamp-2 ${
                      isSelected ? 'text-white' : 'text-slate-300'
                    }`}>
                      {video.title}
                    </h4>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                      <span>{video.category}</span>
                      <span className="text-emerald-400 font-semibold">{video.views}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Direct CTA Buttons inside Sidebar */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => setActiveTab('bank')}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Building2 className="w-4 h-4" />
                <span>Open Nile Crypto Bank Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveTab('presale')}
                className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-[#E5B842] text-white font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4 text-[#E5B842]" />
                <span>Join NILE Token Presale</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
