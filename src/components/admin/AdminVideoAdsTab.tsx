import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { 
  PlaySquare, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  Sparkles, 
  Video, 
  ShieldCheck, 
  Clock, 
  Radio 
} from 'lucide-react';
import { VideoAdAdminItem } from '../../types/index.ts';

export const AdminVideoAdsTab: React.FC = () => {
  const { 
    videoAdsConfig, 
    adminUpdateVideoAd, 
    adminAddVideoAd, 
    showToast 
  } = useApp();

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [badge, setBadge] = useState('Institutional Spotlight');
  const [duration, setDuration] = useState('02:45');
  const [views, setViews] = useState('15.4K Views');
  const [category, setCategory] = useState('Compliance & Trust');
  const [summary, setSummary] = useState('');
  const [tagsInput, setTagsInput] = useState('Companies House #08253865, Autonomous AI, On-Chain Reserve Proof');

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    adminAddVideoAd({
      title,
      badge,
      duration,
      views,
      category,
      summary: summary || `${title} - Official broadcast video highlighting Nile Crypto Bank operations and regulatory trust.`,
      status: 'active',
      complianceTags: tagsInput.split(',').map(t => t.trim()).filter(Boolean)
    });

    setShowAddModal(false);
    setTitle('');
    setSummary('');
  };

  const handleToggleStatus = (id: string, currentStatus: VideoAdAdminItem['status']) => {
    const nextStatus: VideoAdAdminItem['status'] = 
      currentStatus === 'featured' ? 'active' : currentStatus === 'active' ? 'unlisted' : 'featured';
    adminUpdateVideoAd(id, { status: nextStatus });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#091124] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[#E5B842] flex items-center gap-1.5">
            <PlaySquare className="w-4 h-4" />
            <span>Media Broadcasts &amp; Public Trust Desk</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Homepage Video Advertisements Manager
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Control the featured video commercials and presentations that introduce Nile Ecosystem as the world’s first genuine Nile Crypto Bank governed by artificial intelligence and international regulations.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-lg hover:scale-105 transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Video Broadcast</span>
        </button>
      </div>

      {/* Video Presentations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videoAdsConfig.map((vid) => (
          <div 
            key={vid.id}
            className="p-6 rounded-3xl bg-[#091124] border border-slate-800 hover:border-[#E5B842]/40 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-800 text-[#E5B842] border border-slate-700">
                  {vid.badge}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">{vid.duration}</span>
                  <button
                    onClick={() => handleToggleStatus(vid.id, vid.status)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                      vid.status === 'featured'
                        ? 'bg-[#E5B842]/20 text-[#E5B842] border border-[#E5B842]/40'
                        : vid.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    ★ {vid.status}
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">
                {vid.title}
              </h3>

              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                {vid.summary}
              </p>

              <div className="flex items-center gap-3 text-xs font-mono text-slate-400 pt-1">
                <span>{vid.views}</span>
                <span>·</span>
                <span className="text-cyan-400">{vid.category}</span>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-800">
                <div className="text-[10px] uppercase font-mono text-slate-400 font-bold">Regulatory &amp; AI Compliance Tags:</div>
                <div className="flex flex-wrap gap-1.5">
                  {vid.complianceTags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300">
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">ID: {vid.id}</span>
              <button
                onClick={() => {
                  const newViews = prompt('Update public view count (e.g. 52.4K Views):', vid.views);
                  if (newViews) {
                    adminUpdateVideoAd(vid.id, { views: newViews });
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-[#E5B842] text-white font-bold text-xs"
              >
                Edit Views Count
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: ADD VIDEO */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#091124] border border-[#E5B842]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-[#E5B842]" />
                <span>Publish New Video Campaign</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVideo} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Presentation Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Nile Sovereign Reserve Audit & AI Vault Security"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-semibold focus:outline-none focus:border-[#E5B842]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Badge</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:outline-none focus:border-[#E5B842]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Views Display</label>
                  <input
                    type="text"
                    value={views}
                    onChange={(e) => setViews(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono focus:outline-none focus:border-[#E5B842]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Compliance &amp; Trust Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-[11px] focus:outline-none focus:border-[#E5B842]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Summary Dossier</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={3}
                  placeholder="Outline key messaging on autonomous AI management, regulatory statutory compliance, and public trust..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-[#E5B842]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-extrabold text-xs shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Publish to Homepage Video Showcase</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
