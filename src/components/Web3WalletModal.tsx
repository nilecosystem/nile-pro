import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Wallet, ShieldCheck, X, RefreshCw } from 'lucide-react';
import { TREASURY_CRYPTO_WALLETS } from '../data/paymentConfig.ts';
import { NileApi } from '../services/api.ts';

interface Web3WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

declare global {
  interface Window {
    ethereum?: any;
    tronWeb?: any;
  }
}

export const Web3WalletModal: React.FC<Web3WalletModalProps> = ({ isOpen, onClose }) => {
  const { showToast, addTransaction } = useApp();

  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<string>('0.0000 ETH');
  const [isConnecting, setIsConnecting] = useState(false);
  const [depositAmountEth, setDepositAmountEth] = useState<number>(0.1);
  const [isDepositing, setIsDepositing] = useState(false);

  const fetchRealBalance = async (address: string) => {
    if (window.ethereum) {
      const balanceHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });
      const ethBalance = parseInt(balanceHex, 16) / 1e18;
      setWalletBalance(`${ethBalance.toFixed(4)} ETH`);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum?.selectedAddress) {
      const addr = window.ethereum.selectedAddress;
      setConnectedAddress(addr);
      fetchRealBalance(addr);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConnect = async (walletName: string) => {
    setIsConnecting(true);
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error(`No Web3 provider detected. Please install ${walletName} extension or open in wallet browser.`);
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        throw new Error('No wallet accounts authorized.');
      }

      const address = accounts[0];
      const challengeMsg = `NILE Ecosystem Authentication\nWallet: ${address}\nTimestamp: ${Date.now()}`;
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [challengeMsg, address]
      });

      await NileApi.web3Login({
        address,
        signature,
        message: challengeMsg,
        network: 'EVM'
      });

      setConnectedAddress(address);
      await fetchRealBalance(address);
      showToast(`Authenticated with ${walletName}: ${address.slice(0, 6)}...${address.slice(-4)}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Wallet connection failed', 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDirectWeb3Transfer = async () => {
    if (!connectedAddress || !window.ethereum) {
      showToast('Please connect your Web3 wallet first.', 'error');
      return;
    }
    if (depositAmountEth <= 0) {
      showToast('Enter a valid deposit amount.', 'error');
      return;
    }

    setIsDepositing(true);
    try {
      const weiBigInt = BigInt(Math.round(depositAmountEth * 1e18));
      const valueHex = '0x' + weiBigInt.toString(16);

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: connectedAddress,
          to: TREASURY_CRYPTO_WALLETS.ETH_BNB,
          value: valueHex
        }]
      });

      showToast('Transaction broadcast! Verifying on-chain confirmation...', 'info');

      await NileApi.verifyOnChainDeposit({
        txid: txHash,
        network: 'ETH',
        expectedAsset: 'ETH',
        walletType: 'INTERNAL'
      });

      addTransaction({
        type: 'deposit',
        amount: depositAmountEth,
        currency: 'ETH',
        status: 'confirmed',
        recipientOrDetails: `Verified On-Chain Deposit to Treasury`,
        txHash
      });

      await fetchRealBalance(connectedAddress);
      showToast(`Deposit of ${depositAmountEth} ETH verified on-chain and credited!`, 'success');
    } catch (e: any) {
      showToast(e.message || 'Transaction failed or rejected', 'error');
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-[#091124] border-2 border-slate-800 shadow-2xl space-y-6 my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Live Web3 Wallet Gateway</h2>
              <p className="text-xs text-slate-400">Cryptographic EIP-1193 On-Chain Settlement</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-[#060B17] border border-emerald-500/30 space-y-1.5 text-xs">
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Direct On-Chain Verification</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            All deposits are verified directly against Ethereum, BNB Chain, and TRON mainnet nodes before crediting your ledger balance.
          </p>
        </div>

        {connectedAddress ? (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Connected Wallet</span>
                <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                  {connectedAddress.slice(0, 8)}...{connectedAddress.slice(-6)}
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-400 uppercase">On-Chain Balance</span>
                <div className="text-sm font-black text-white">{walletBalance}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
              <div className="font-bold text-white flex items-center justify-between">
                <span>Instant Web3 Deposit to Treasury:</span>
                <span className="text-[10px] text-cyan-400 font-mono">Mainnet Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={depositAmountEth}
                  onChange={(e) => setDepositAmountEth(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                  placeholder="ETH Amount"
                />
                <button
                  onClick={handleDirectWeb3Transfer}
                  disabled={isDepositing}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shrink-0"
                >
                  {isDepositing ? 'Verifying...' : 'Sign & Deposit'}
                </button>
              </div>
            </div>

            <button
              onClick={() => setConnectedAddress(null)}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[
              { name: 'MetaMask', icon: '🦊', desc: 'Ethereum & BSC' },
              { name: 'Trust Wallet', icon: '🛡️', desc: 'Multi-Chain Web3' },
              { name: 'Rabby Wallet', icon: '🐰', desc: 'Institutional DeFi' },
              { name: 'Coinbase Wallet', icon: '🔵', desc: 'EVM Self-Custody' }
            ].map(w => (
              <button
                key={w.name}
                onClick={() => handleConnect(w.name)}
                disabled={isConnecting}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-[#E5B842] transition-all text-left flex items-center gap-3"
              >
                <span className="text-2xl">{w.icon}</span>
                <div>
                  <div className="font-bold text-white">{w.name}</div>
                  <div className="text-[10px] text-slate-500">{w.desc}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Web3WalletModal;
