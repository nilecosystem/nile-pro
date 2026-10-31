import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { 
  Cpu, 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  Zap, 
  Terminal, 
  RefreshCw, 
  Lock, 
  Radio, 
  ExternalLink, 
  CheckCircle, 
  Sliders, 
  Save, 
  Server 
} from 'lucide-react';
import { AiOperationsAdminConfig } from '../../types/index.ts';

export const AdminAiOperationsTab: React.FC = () => {
  const { 
    aiOperationsConfig, 
    adminUpdateAiOperationsConfig, 
    adminTriggerAiSimulation,
    showToast 
  } = useApp();

  const [form, setForm] = useState<AiOperationsAdminConfig>(aiOperationsConfig);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    adminUpdateAiOperationsConfig(form);
  };

  const handleRunRebalance = () => {
    adminTriggerAiSimulation('Neural AMM Liquidity Rebalance across Arbitrum, BNB Chain & Ethereum. Zero slippage enforced.');
  };

  const handleSimulateCrossBorder = () => {
    adminTriggerAiSimulation('Cross-border ISO 20022 packet processed in 64ms across London and Vienna clearing nodes.');
  };

  const handleSimulateAttackTest = () => {
    adminTriggerAiSimulation('Simulated Sybil DDoS payload isolated in 42ms. Neural quarantine locked target IP.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#091124] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[#00E599] flex items-center gap-1.5">
            <Cpu className="w-4 h-4" />
            <span>Autonomous AI Management Core</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Artificial Intelligence Bank Operations Engine
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            100% of Nile Crypto Bank operations are governed by autonomous neural networks ensuring zero human error, sub-80ms settlements, and strict regulatory compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>AI Operations 100% Operational</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Module 1: Autonomous AMM Liquidity Rebalancer */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#00E599]" />
                <span>Autonomous AMM Liquidity Rebalancer</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Dynamic automated liquidity routing with real-time zero-loss slippage prevention.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRunRebalance}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Force Immediate Rebalance</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Operational Mode</label>
              <select
                value={form.ammLiquidityRebalancer.status}
                onChange={(e) => setForm({
                  ...form,
                  ammLiquidityRebalancer: { ...form.ammLiquidityRebalancer, status: e.target.value as any }
                })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-semibold focus:outline-none focus:border-[#E5B842]"
              >
                <option value="autonomous">Autonomous (100% AI Governed)</option>
                <option value="manual">Manual Supervised</option>
                <option value="paused">Paused</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Max Slippage Tolerance (%)</label>
              <input
                type="number"
                step="0.01"
                value={form.ammLiquidityRebalancer.slippageTolerancePercent}
                onChange={(e) => setForm({
                  ...form,
                  ammLiquidityRebalancer: { ...form.ammLiquidityRebalancer, slippageTolerancePercent: parseFloat(e.target.value) || 0 }
                })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Rebalancing Frequency (sec)</label>
              <input
                type="number"
                value={form.ammLiquidityRebalancer.rebalanceFrequencySeconds}
                onChange={(e) => setForm({
                  ...form,
                  ammLiquidityRebalancer: { ...form.ammLiquidityRebalancer, rebalanceFrequencySeconds: parseInt(e.target.value) || 12 }
                })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Prevented Slippage (USD Total)</label>
              <input
                type="number"
                value={form.ammLiquidityRebalancer.preventedSlippageUsd}
                onChange={(e) => setForm({
                  ...form,
                  ammLiquidityRebalancer: { ...form.ammLiquidityRebalancer, preventedSlippageUsd: parseFloat(e.target.value) || 0 }
                })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
              />
            </div>
          </div>
        </div>

        {/* Module 2: AI Cross-Border Settlement Engine */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-cyan-400" />
                <span>AI Cross-Border Multi-Currency Settlement Engine</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Sub-80 millisecond liquidity routing across SWIFT, SEPA, Faster Payments, Fedwire, and CIPS.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSimulateCrossBorder}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Simulate Clearing Node</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#060B17] border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Average AI Execution Latency</span>
              <div className="text-2xl font-black text-cyan-400 font-mono mt-1">
                {form.crossBorderSettlementEngine.averageLatencyMs} ms
              </div>
              <span className="text-[10px] text-emerald-400 mt-0.5 block">Sub-second atomic settlement</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#060B17] border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Zero-Latency Success Rate</span>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                {form.crossBorderSettlementEngine.zeroLatencySettlementRate}%
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Zero human counterparty risk</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#060B17] border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Active Clearing Channels</span>
              <div className="text-xs font-mono font-bold text-white mt-1 space-y-0.5">
                {form.crossBorderSettlementEngine.activeRoutingGateways.map((g, idx) => (
                  <div key={idx} className="truncate">✓ {g}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Module 3: Neural Cyber-Threat & Fraud Sanitizer */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <span>Neural Cyber-Threat &amp; Fraud Sanitizer</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Predictive exploit neutralization, automated cold storage quarantine, and continuous AML anomaly scoring.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSimulateAttackTest}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-purple-400 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-purple-400" />
              <span>Simulate Red-Team Test</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Blocked Malicious Incursions</label>
              <input
                type="number"
                value={form.neuralFraudSanitizer.blockedMaliciousPayloads}
                onChange={(e) => setForm({
                  ...form,
                  neuralFraudSanitizer: { ...form.neuralFraudSanitizer, blockedMaliciousPayloads: parseInt(e.target.value) || 0 }
                })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Cold Storage Containment Status</label>
              <input
                type="text"
                disabled
                value="Zero Triggers · Vaults Secure"
                className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-emerald-400 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">AML Risk Alert Threshold Score</label>
              <input
                type="number"
                value={form.neuralFraudSanitizer.amlRiskThresholdScore}
                onChange={(e) => setForm({
                  ...form,
                  neuralFraudSanitizer: { ...form.neuralFraudSanitizer, amlRiskThresholdScore: parseInt(e.target.value) || 85 }
                })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono font-bold focus:outline-none focus:border-[#E5B842]"
              />
            </div>
          </div>
        </div>

        {/* Module 4: Regulatory Compliance AI & Proof-of-Reserve */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#091124] border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#E5B842]" />
            <span>International Regulatory Compliance AI &amp; Proof of Reserve</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#060B17] border border-slate-800 space-y-2">
              <span className="font-bold text-white uppercase text-[11px] block font-mono">Verified Jurisdictions:</span>
              <ul className="space-y-1 text-slate-300 font-mono text-[11px]">
                {form.regulatoryComplianceAi.verifiedJurisdictions.map((j, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{j}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-[#060B17] border border-slate-800 space-y-2">
              <span className="font-bold text-white uppercase text-[11px] block font-mono">Bitcoin Proof-of-Reserve TXID:</span>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 font-mono text-[10px] break-all">
                {form.regulatoryComplianceAi.onChainProofTxid}
              </div>
              <span className="text-[10px] text-slate-400 block">
                Audited &amp; verifiable directly on the Bitcoin mainnet ledger.
              </span>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[#00E599] hover:bg-[#00c985] text-[#070D1B] font-extrabold text-xs shadow-lg transition-transform active:scale-98 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save AI Operations Configuration Live</span>
          </button>
        </div>
      </form>
    </div>
  );
};
