import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { TrendingUp, Sparkles, BarChart2, ShieldCheck, ArrowUpRight, Zap, Layers } from 'lucide-react';

export interface RoiGrowthChartProps {
  principal: number;
  durationKey: string; // 'daily' | '30d' | '3m' | '6m' | '1y' | '50d' | '100d' etc.
  ratePercent: number; // effective rate percentage for duration (e.g. 50% or 50000%)
  planType?: 'ultimate' | 'surprise' | 'plan1' | 'plan2' | 'plan3' | 'custom';
  planName?: string;
  asset?: string;
  boosterActive?: boolean;
  benchmarkRateApr?: number; // default 5.2% traditional treasury rate
  height?: number;
  compact?: boolean;
}

export const RoiGrowthChart: React.FC<RoiGrowthChartProps> = ({
  principal,
  durationKey,
  ratePercent,
  planType = 'ultimate',
  planName = 'NILE Investment Plan',
  asset = 'USDT',
  boosterActive = false,
  benchmarkRateApr = 5.2,
  height = 240,
  compact = false
}) => {
  // Chart visual toggles
  const [activeTimeframe, setActiveTimeframe] = useState<string>(durationKey || '30d');
  const [isCompounded, setIsCompounded] = useState<boolean>(true);
  const [showBenchmark, setShowBenchmark] = useState<boolean>(true);

  // Sync activeTimeframe if durationKey prop changes from parent
  React.useEffect(() => {
    if (durationKey) {
      setActiveTimeframe(durationKey);
    }
  }, [durationKey]);

  // Determine total days from selected timeframe
  const totalDays = useMemo(() => {
    switch (activeTimeframe) {
      case 'daily':
      case '1d':
        return 1;
      case '7d':
      case 'weekly':
        return 7;
      case '30d':
      case 'monthly':
        return 30;
      case '50d':
        return 50;
      case '3m':
      case '90d':
        return 90;
      case '100d':
        return 100;
      case '6m':
      case '180d':
        return 180;
      case '1y':
      case '365d':
        return 365;
      default:
        return 30;
    }
  }, [activeTimeframe]);

  // Generate dynamic data points for Recharts
  const chartData = useMemo(() => {
    const validPrincipal = Math.max(10, principal || 1000);
    const boosterMultiplier = boosterActive ? 1.5 : 1.0;
    const effectiveTotalRate = (ratePercent || 15) * boosterMultiplier;

    // Determine number of steps (12 to 24 data points for smooth line rendering)
    const steps = totalDays === 1 ? 12 : Math.min(24, Math.max(10, totalDays));
    const stepSize = totalDays / (steps - 1);

    const points = [];
    const dailyRate = Math.pow(1 + effectiveTotalRate / 100, 1 / totalDays) - 1;

    for (let i = 0; i < steps; i++) {
      const currentDay = Math.min(totalDays, Math.round(i * stepSize * 10) / 10);
      let balance = validPrincipal;
      let netProfit = 0;

      if (isCompounded) {
        // Daily compounding curve
        balance = validPrincipal * Math.pow(1 + dailyRate, currentDay);
        netProfit = balance - validPrincipal;
      } else {
        // Linear payout progression
        const progressFraction = currentDay / totalDays;
        netProfit = validPrincipal * (effectiveTotalRate / 100) * progressFraction;
        balance = validPrincipal + netProfit;
      }

      // Traditional 5.2% US Treasury / Bank baseline
      const benchmarkYield = validPrincipal * ((benchmarkRateApr / 100) * (currentDay / 365));
      const benchmarkBalance = validPrincipal + benchmarkYield;

      let label = `Day ${currentDay}`;
      if (totalDays === 1) {
        label = `${Math.round(currentDay * 24)}h`;
      } else if (totalDays >= 180) {
        label = `M${Math.round((currentDay / 30) * 10) / 10}`;
      }

      points.push({
        step: i,
        day: currentDay,
        label,
        balance: Math.round(balance * 100) / 100,
        netProfit: Math.round(netProfit * 100) / 100,
        benchmark: Math.round(benchmarkBalance * 100) / 100,
        principal: validPrincipal,
        gainPercent: Math.round(((balance - validPrincipal) / validPrincipal) * 10000) / 100
      });
    }

    return points;
  }, [principal, totalDays, ratePercent, boosterActive, isCompounded, benchmarkRateApr]);

  const finalPoint = chartData[chartData.length - 1] || { balance: principal, netProfit: 0, gainPercent: 0 };
  const alphaVsBenchmark = finalPoint.benchmark > 0
    ? Math.round(((finalPoint.balance - finalPoint.benchmark) / finalPoint.principal) * 100)
    : 0;

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 rounded-2xl bg-[#091124]/95 backdrop-blur-md border border-[#E5B842]/50 shadow-2xl space-y-1.5 text-left text-xs min-w-[210px] z-50">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[10px] text-slate-400">
            <span className="font-mono font-bold text-white uppercase">{data.label} Projection</span>
            <span className="text-[#E5B842] font-semibold">{totalDays}d Horizon</span>
          </div>
          
          <div className="space-y-1 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Portfolio Value:</span>
              <span className="font-mono font-black text-white text-xs">
                ${data.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {asset}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Net Accrued Yield:</span>
              <span className="font-mono font-bold text-emerald-400">
                +${data.netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Cumulative Return:</span>
              <span className="font-mono font-bold text-[#E5B842]">
                +{data.gainPercent.toLocaleString()}%
              </span>
            </div>

            {showBenchmark && (
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
                <span>TradFi 5.2% Benchmark:</span>
                <span className="font-mono text-slate-300">
                  ${data.benchmark.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-[#060B17] border border-slate-800/90 shadow-xl space-y-3.5">
      {/* Chart Top Header & Quick Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black text-white flex items-center gap-1.5">
              <span>Projected Growth Trajectory</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#E5B842]/20 text-[#E5B842] border border-[#E5B842]/40">
                Recharts Live
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              Interactive dynamic line projection based on current yield parameters
            </div>
          </div>
        </div>

        {/* Timeframe Selector Pills */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-start sm:self-auto text-[10px] font-mono">
          {[
            { key: '7d', label: '7D' },
            { key: '30d', label: '30D' },
            { key: '90d', label: '90D' },
            { key: '180d', label: '180D' },
            { key: '365d', label: '1Y' }
          ].map(tf => (
            <button
              key={tf.key}
              type="button"
              onClick={() => setActiveTimeframe(tf.key)}
              className={`px-2 py-1 rounded-lg transition-all ${
                activeTimeframe === tf.key
                  ? 'bg-[#E5B842] text-[#070D1B] font-extrabold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Key Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="text-[10px] text-slate-400 uppercase font-mono">Initial Principal</div>
          <div className="text-xs sm:text-sm font-black text-white font-mono mt-0.5">
            ${principal.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">{asset}</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="text-[10px] text-slate-400 uppercase font-mono">Est. Net Profit</div>
          <div className="text-xs sm:text-sm font-black text-emerald-400 font-mono mt-0.5">
            +${finalPoint.netProfit.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="text-[10px] text-slate-400 uppercase font-mono">Target Maturity</div>
          <div className="text-xs sm:text-sm font-black text-[#E5B842] font-mono mt-0.5">
            ${finalPoint.balance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="text-[10px] text-slate-400 uppercase font-mono">TradFi Outperformance</div>
          <div className="text-xs sm:text-sm font-black text-purple-400 font-mono mt-0.5 flex items-center justify-center gap-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{alphaVsBenchmark}%</span>
          </div>
        </div>
      </div>

      {/* Recharts Dynamic Area / Line Chart */}
      <div className="w-full relative" style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              {/* Gradient for Total Growth Line */}
              <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E5B842" stopOpacity={0.4} />
                <stop offset="70%" stopColor="#10B981" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#091124" stopOpacity={0.0} />
              </linearGradient>
              {/* Gradient for Net Profit Area */}
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} vertical={false} />

            <XAxis
              dataKey="label"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(v) => {
                if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
                if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`;
                return `$${v}`;
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Principal Baseline */}
            <ReferenceLine
              y={principal}
              stroke="#475569"
              strokeDasharray="4 4"
              label={{
                value: 'Deposit Baseline',
                position: 'insideBottomRight',
                fill: '#64748b',
                fontSize: 9
              }}
            />

            {/* Benchmark Traditional Yield Line */}
            {showBenchmark && (
              <Line
                type="monotone"
                dataKey="benchmark"
                stroke="#64748B"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                dot={false}
                name="TradFi 5.2% APR"
              />
            )}

            {/* Primary Projected Portfolio Balance Growth */}
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#E5B842"
              strokeWidth={2.5}
              fill="url(#growthGradient)"
              activeDot={{ r: 6, fill: '#E5B842', stroke: '#FFFFFF', strokeWidth: 2 }}
              name="Projected Total Balance"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Controls & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={isCompounded}
              onChange={(e) => setIsCompounded(e.target.checked)}
              className="accent-[#E5B842] rounded"
            />
            <span>Daily Compounding</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
            <input
              type="checkbox"
              checked={showBenchmark}
              onChange={(e) => setShowBenchmark(e.target.checked)}
              className="accent-slate-500 rounded"
            />
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-slate-500 inline-block border-b border-dashed" />
              <span>TradFi 5.2% Baseline</span>
            </span>
          </label>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-[#E5B842]" />
          <span>NILE Projected Growth Curve</span>
        </div>
      </div>
    </div>
  );
};
export default RoiGrowthChart;
