import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { DexToken } from '../types/index.ts';
import { NileTokenCoin } from './NileTokenCoin.tsx';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  BarChart2, 
  Layers, 
  Maximize2,
  Calendar,
  Activity,
  DollarSign
} from 'lucide-react';

export type TimeframeKey = '1D' | '1W' | '1M' | '1Y' | 'ALL';

interface PricePoint {
  time: string;
  price: number;
  volume: number;
  high: number;
  low: number;
}

interface DexPriceChartProps {
  selectedToken: DexToken;
  onSelectToken?: (token: DexToken) => void;
  availableTokens: DexToken[];
  className?: string;
}

// Deterministic pseudo-random generator with seed for stable curves
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const DexPriceChart: React.FC<DexPriceChartProps> = ({
  selectedToken,
  onSelectToken,
  availableTokens,
  className = ''
}) => {
  const [timeframe, setTimeframe] = useState<TimeframeKey>('1D');
  const [hoveredPoint, setHoveredPoint] = useState<PricePoint | null>(null);

  // Generate realistic historical dataset based on token & timeframe
  const chartData = useMemo(() => {
    const points: PricePoint[] = [];
    const basePrice = selectedToken.priceUsd;
    const isNile = selectedToken.symbol === 'NILE';

    // Different point counts and scales per timeframe
    if (timeframe === '1D') {
      const hours = 24;
      const changeRatio = (selectedToken.change24h || 2.5) / 100;
      const startPrice = basePrice / (1 + changeRatio);
      let runningPrice = startPrice;

      for (let i = 0; i < hours; i++) {
        const hourStr = `${i.toString().padStart(2, '0')}:00`;
        const progress = i / (hours - 1);
        // Trend upwards or downwards according to change24h with intraday volatility
        const seed = selectedToken.symbol.charCodeAt(0) * 100 + i;
        const noise = (seededRandom(seed) - 0.48) * 0.02 * basePrice;
        
        if (i === hours - 1) {
          runningPrice = basePrice;
        } else {
          runningPrice = startPrice + (basePrice - startPrice) * progress + noise;
        }

        const volNoise = seededRandom(seed * 2) * 0.4 + 0.8;
        const baseHourlyVol = isNile ? 195000 : basePrice > 1000 ? 5500000 : 850000;

        points.push({
          time: hourStr,
          price: Number(runningPrice.toFixed(basePrice < 1 ? 4 : 2)),
          volume: Math.round(baseHourlyVol * volNoise),
          high: Number((runningPrice * 1.006).toFixed(basePrice < 1 ? 4 : 2)),
          low: Number((runningPrice * 0.994).toFixed(basePrice < 1 ? 4 : 2))
        });
      }
    } else if (timeframe === '1W') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const weekMultiplier = isNile ? 1.22 : 1.05;
      const startPrice = basePrice / weekMultiplier;

      days.forEach((day, idx) => {
        // Two points per day (00:00 and 12:00)
        ['00:00', '12:00'].forEach((slot, sIdx) => {
          const stepIndex = idx * 2 + sIdx;
          const progress = stepIndex / (days.length * 2 - 1);
          const seed = selectedToken.symbol.charCodeAt(0) * 200 + stepIndex;
          const noise = (seededRandom(seed) - 0.45) * 0.035 * basePrice;
          
          let p = startPrice + (basePrice - startPrice) * progress + noise;
          if (stepIndex === days.length * 2 - 1) p = basePrice;

          const baseDayVol = isNile ? 680000 : basePrice > 1000 ? 18000000 : 2500000;
          const vol = Math.round(baseDayVol * (0.8 + seededRandom(seed * 3) * 0.5));

          points.push({
            time: `${day} ${slot === '00:00' ? 'AM' : 'PM'}`,
            price: Number(p.toFixed(basePrice < 1 ? 4 : 2)),
            volume: vol,
            high: Number((p * 1.01).toFixed(basePrice < 1 ? 4 : 2)),
            low: Number((p * 0.99).toFixed(basePrice < 1 ? 4 : 2))
          });
        });
      });
    } else if (timeframe === '1M') {
      const totalDays = 30;
      const monthMultiplier = isNile ? 1.45 : 1.08;
      const startPrice = basePrice / monthMultiplier;

      for (let d = 1; d <= totalDays; d++) {
        const progress = (d - 1) / (totalDays - 1);
        const seed = selectedToken.symbol.charCodeAt(0) * 300 + d;
        const noise = (seededRandom(seed) - 0.46) * 0.05 * basePrice;
        let p = startPrice + (basePrice - startPrice) * Math.pow(progress, 0.9) + noise;
        if (d === totalDays) p = basePrice;

        points.push({
          time: `Day ${d}`,
          price: Number(p.toFixed(basePrice < 1 ? 4 : 2)),
          volume: Math.round((isNile ? 1200000 : 15000000) * (0.7 + seededRandom(seed * 5) * 0.6)),
          high: Number((p * 1.015).toFixed(basePrice < 1 ? 4 : 2)),
          low: Number((p * 0.985).toFixed(basePrice < 1 ? 4 : 2))
        });
      }
    } else if (timeframe === '1Y') {
      const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
      const yearMultiplier = isNile ? 2.4 : 1.35;
      const startPrice = basePrice / yearMultiplier;

      months.forEach((m, idx) => {
        const progress = idx / (months.length - 1);
        const seed = selectedToken.symbol.charCodeAt(0) * 400 + idx;
        const dip = idx === 3 ? -0.08 * basePrice : idx === 7 ? 0.05 * basePrice : 0;
        let p = startPrice + (basePrice - startPrice) * progress + dip;
        if (idx === months.length - 1) p = basePrice;

        points.push({
          time: m,
          price: Number(p.toFixed(basePrice < 1 ? 4 : 2)),
          volume: Math.round((isNile ? 24000000 : 450000000) * (0.8 + seededRandom(seed) * 0.4)),
          high: Number((p * 1.025).toFixed(basePrice < 1 ? 4 : 2)),
          low: Number((p * 0.975).toFixed(basePrice < 1 ? 4 : 2))
        });
      });
    } else {
      // ALL Time
      if (isNile) {
        // Genesis Presale to Launch
        points.push({ time: 'Jan 26 (Seed)', price: 0.050, volume: 2500000, high: 0.052, low: 0.050 });
        points.push({ time: 'Feb 26 (Strategic)', price: 0.065, volume: 4200000, high: 0.068, low: 0.064 });
        points.push({ time: 'Mar 26 (Community)', price: 0.085, volume: 8900000, high: 0.090, low: 0.082 });
        points.push({ time: 'Apr 26 (Public)', price: 0.100, volume: 15400000, high: 0.105, low: 0.098 });
        points.push({ time: 'TGE Listing', price: 0.120, volume: 32000000, high: 0.126, low: 0.115 });
        points.push({ time: 'Target Q3', price: 0.250, volume: 55000000, high: 0.270, low: 0.240 });
        points.push({ time: 'Target Q4', price: 0.500, volume: 90000000, high: 0.540, low: 0.480 });
      } else {
        const milestones = ['2023 H1', '2023 H2', '2024 H1', '2024 H2', '2025 H1', '2025 H2', 'Current'];
        const startP = basePrice * 0.35;
        milestones.forEach((m, idx) => {
          const progress = idx / (milestones.length - 1);
          let p = startP + (basePrice - startP) * progress;
          if (idx === milestones.length - 1) p = basePrice;
          points.push({
            time: m,
            price: Number(p.toFixed(basePrice < 1 ? 4 : 2)),
            volume: 100000000,
            high: Number((p * 1.05).toFixed(basePrice < 1 ? 4 : 2)),
            low: Number((p * 0.95).toFixed(basePrice < 1 ? 4 : 2))
          });
        });
      }
    }

    return points;
  }, [selectedToken, timeframe]);

  // Derived financial summary
  const currentPrice = hoveredPoint ? hoveredPoint.price : selectedToken.priceUsd;
  const initialPointPrice = chartData[0]?.price || currentPrice;
  const priceDiff = currentPrice - initialPointPrice;
  const percentageChange = initialPointPrice > 0 ? (priceDiff / initialPointPrice) * 100 : 0;
  const isPositive = priceDiff >= 0;

  const minPrice = useMemo(() => {
    if (chartData.length === 0) return 0;
    const min = Math.min(...chartData.map(d => d.price));
    return Number((min * 0.99).toFixed(selectedToken.priceUsd < 1 ? 4 : 2));
  }, [chartData, selectedToken]);

  const maxPrice = useMemo(() => {
    if (chartData.length === 0) return 1;
    const max = Math.max(...chartData.map(d => d.price));
    return Number((max * 1.01).toFixed(selectedToken.priceUsd < 1 ? 4 : 2));
  }, [chartData, selectedToken]);

  const totalPeriodVolume = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.volume, 0);
  }, [chartData]);

  // Visual Theme mapping based on token
  const themeColors = useMemo(() => {
    if (selectedToken.symbol === 'NILE') {
      return {
        stroke: '#E5B842',
        gradientStart: '#E5B842',
        gradientStop: '#070D1B',
        accentBadge: 'bg-[#E5B842]/10 border-[#E5B842]/30 text-[#E5B842]',
        pillBg: 'from-[#E5B842] to-[#D99A1E]',
        glow: 'rgba(229, 184, 66, 0.4)'
      };
    }
    if (selectedToken.symbol === 'BTC') {
      return {
        stroke: '#F7931A',
        gradientStart: '#F7931A',
        gradientStop: '#070D1B',
        accentBadge: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        pillBg: 'from-amber-500 to-amber-600',
        glow: 'rgba(247, 147, 26, 0.4)'
      };
    }
    if (selectedToken.symbol === 'ETH') {
      return {
        stroke: '#627EEA',
        gradientStart: '#627EEA',
        gradientStop: '#070D1B',
        accentBadge: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
        pillBg: 'from-blue-500 to-indigo-600',
        glow: 'rgba(98, 126, 234, 0.4)'
      };
    }
    if (selectedToken.symbol === 'SOL') {
      return {
        stroke: '#9945FF',
        gradientStart: '#14F195',
        gradientStop: '#9945FF',
        accentBadge: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
        pillBg: 'from-purple-500 to-teal-400',
        glow: 'rgba(153, 69, 255, 0.4)'
      };
    }
    // Default green/cyan
    return {
      stroke: '#00F0FF',
      gradientStart: '#00F0FF',
      gradientStop: '#070D1B',
      accentBadge: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
      pillBg: 'from-cyan-500 to-blue-600',
      glow: 'rgba(0, 240, 255, 0.4)'
    };
  }, [selectedToken]);

  const formatPriceValue = (val: number) => {
    if (val < 1) {
      return `$${val.toFixed(4)}`;
    }
    return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatVolumeValue = (val: number) => {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(2)}M`;
    }
    if (val >= 1000) {
      return `$${(val / 1000).toFixed(1)}K`;
    }
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className={`p-5 sm:p-6 rounded-3xl bg-[#091124] border border-slate-800 shadow-2xl space-y-5 ${className}`}>
      {/* Top Header: Token Switcher Tabs & Live Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        {/* Token Pair Identity */}
        <div className="flex items-center gap-3">
          {selectedToken.symbol === 'NILE' ? (
            <NileTokenCoin size="sm" animate />
          ) : (
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-md"
              style={{ backgroundColor: selectedToken.iconBg || '#2563EB' }}
            >
              {selectedToken.symbol.slice(0, 3)}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-wide">
                {selectedToken.symbol} <span className="text-slate-400 font-semibold text-sm">/ USDT</span>
              </h2>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                AMM Live
              </span>
            </div>
            <div className="text-xs text-slate-400">
              {selectedToken.name} · Nile Native Automated Market Maker
            </div>
          </div>
        </div>

        {/* Available Token Switcher Quick Chips */}
        {availableTokens && availableTokens.length > 0 && onSelectToken && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {availableTokens.map((t) => {
              const active = t.symbol === selectedToken.symbol;
              return (
                <button
                  key={t.symbol}
                  onClick={() => onSelectToken(t)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    active
                      ? 'bg-gradient-to-r ' + themeColors.pillBg + ' text-[#070D1B] shadow-md font-extrabold'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <span>{t.symbol}</span>
                  <span className="text-[10px] opacity-75 font-mono">
                    {t.change24h ? `${t.change24h > 0 ? '+' : ''}${t.change24h}%` : ''}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Stats Row: Price, 24h Delta, High, Low, Volume */}
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        {/* Price & Current Change */}
        <div className="space-y-1">
          <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <span>{hoveredPoint ? `Price at ${hoveredPoint.time}` : 'Current Price'}</span>
            {hoveredPoint && (
              <span className="text-[10px] text-amber-400 font-mono">(Hovered Point)</span>
            )}
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl sm:text-4xl font-black text-white font-mono tracking-tight">
              {formatPriceValue(currentPrice)}
            </span>
            <div className={`flex items-center gap-1 text-sm font-bold font-mono ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{isPositive ? '+' : ''}{priceDiff >= 0 ? '+' : ''}{formatPriceValue(priceDiff)}</span>
              <span>({percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(2)}%)</span>
            </div>
          </div>
        </div>

        {/* Timeframe Selector Segmented Bar */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
          {(['1D', '1W', '1M', '1Y', 'ALL'] as TimeframeKey[]).map((tf) => (
            <button
              key={tf}
              onClick={() => {
                setTimeframe(tf);
                setHoveredPoint(null);
              }}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                timeframe === tf
                  ? 'bg-[#E5B842] text-[#070D1B] shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Key Market Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] text-slate-400">Period High</div>
          <div className="font-mono font-bold text-white mt-0.5">{formatPriceValue(maxPrice)}</div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] text-slate-400">Period Low</div>
          <div className="font-mono font-bold text-white mt-0.5">{formatPriceValue(minPrice)}</div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] text-slate-400">Period Volume</div>
          <div className="font-mono font-bold text-cyan-400 mt-0.5">{formatVolumeValue(totalPeriodVolume)}</div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] text-slate-400">Pool Liquidity</div>
          <div className="font-mono font-bold text-emerald-400 mt-0.5">
            {selectedToken.symbol === 'NILE' ? '$2,450,000' : '$12,800,000'}
          </div>
        </div>
      </div>

      {/* Recharts Area Chart Container */}
      <div className="relative w-full h-[280px] sm:h-[320px] rounded-2xl bg-[#060B17]/90 p-2 border border-slate-800/80 overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            onMouseMove={(state: any) => {
              if (state && state.activePayload && state.activePayload.length > 0) {
                setHoveredPoint(state.activePayload[0].payload as PricePoint);
              }
            }}
            onMouseLeave={() => setHoveredPoint(null)}
            margin={{ top: 15, right: 10, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="tokenPriceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={themeColors.stroke} stopOpacity={0.4} />
                <stop offset="60%" stopColor={themeColors.stroke} stopOpacity={0.08} />
                <stop offset="95%" stopColor={themeColors.stroke} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} vertical={false} />

            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              interval="preserveStartEnd"
              minTickGap={25}
            />

            <YAxis
              domain={[minPrice, maxPrice]}
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              orientation="right"
              tickFormatter={(v) => (v < 1 ? `$${v.toFixed(3)}` : `$${v.toLocaleString()}`)}
              width={65}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as PricePoint;
                  return (
                    <div className="p-3 rounded-xl bg-slate-900/95 border border-slate-700 shadow-xl backdrop-blur-md text-xs space-y-1 z-50">
                      <div className="text-slate-400 font-medium flex items-center justify-between gap-4">
                        <span>{data.time}</span>
                        <span className="font-mono text-cyan-400">{selectedToken.symbol}/USDT</span>
                      </div>
                      <div className="text-sm font-black text-white font-mono flex items-center gap-2">
                        <span>{formatPriceValue(data.price)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800 gap-4">
                        <span>24h Vol:</span>
                        <span className="font-mono text-slate-200">{formatVolumeValue(data.volume)}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="price"
              stroke={themeColors.stroke}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#tokenPriceGradient)"
              activeDot={{
                r: 6,
                fill: themeColors.stroke,
                stroke: '#070D1B',
                strokeWidth: 2,
                className: 'filter drop-shadow-[0_0_8px_rgba(229,184,66,0.8)]'
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Notice & Presale Milestone info if NILE */}
      {selectedToken.symbol === 'NILE' ? (
        <div className="p-3 rounded-2xl bg-[#0B152B] border border-[#E5B842]/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NILE Seed Floor: <strong>$0.050</strong> ➔ TGE DEX AMM Listing: <strong className="text-[#E5B842]">$0.120</strong></span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Audited Smart Contract Pool · Multi-Chain Verified
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Aggregated real-time depth from Nile AMM & Binance oracles</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Latency: 42ms</span>
        </div>
      )}
    </div>
  );
};
