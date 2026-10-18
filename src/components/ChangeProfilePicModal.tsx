import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  Camera, 
  Upload, 
  X, 
  Check, 
  Trash2, 
  Sparkles, 
  Image as ImageIcon,
  User,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface ChangeProfilePicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  {
    id: 'executive_founder',
    title: 'Executive Founder',
    url: '/default-avatar.jpg',
    description: 'Sharp bespoke navy blazer & gold emblem'
  },
  {
    id: 'nile_gold_coin',
    title: 'Nile 3D Gold Horus Coin',
    url: '/nile-token-coin.png',
    description: 'Official 3D gold Horus & pyramid bullion medallion'
  },
  {
    id: 'nile_official_logo',
    title: 'Official Nile Mascot & Emblem',
    url: '/assets/branding/nile-official-logo.png',
    description: 'Official Nile crocodile mascot with Bitcoin medallion & royal crown'
  }
];

export const ChangeProfilePicModal: React.FC<ChangeProfilePicModalProps> = ({
  isOpen,
  onClose
}) => {
  const { user, updateUser, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedImage, setSelectedImage] = useState<string>(user.avatarUrl || '/default-avatar.jpg');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  // Process file and scale to optimized 512x512 data URL to save safely in localStorage
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP).', 'error');
      return;
    }

    // Limit original file size to 15MB
    if (file.size > 15 * 1024 * 1024) {
      showToast('Image file size must be under 15MB.', 'error');
      return;
    }

    setProcessing(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const maxDim = 512;
          let width = img.width;
          let height = img.height;

          // Crop or scale to square
          const minDim = Math.min(width, height);
          const startX = (width - minDim) / 2;
          const startY = (height - minDim) / 2;

          canvas.width = maxDim;
          canvas.height = maxDim;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, maxDim, maxDim);
            const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
            setSelectedImage(optimizedDataUrl);
            setProcessing(false);
          } else {
            setSelectedImage(e.target?.result as string);
            setProcessing(false);
          }
        } catch (err) {
          setSelectedImage(e.target?.result as string);
          setProcessing(false);
        }
      };
      img.onerror = () => {
        setProcessing(false);
        showToast('Failed to load image file.', 'error');
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setProcessing(false);
      showToast('Error reading image file.', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleSave = () => {
    updateUser({ avatarUrl: selectedImage });
    showToast('Profile photo updated successfully!', 'success');
    onClose();
  };

  const handleRemovePhoto = () => {
    updateUser({ avatarUrl: '' });
    setSelectedImage('');
    showToast('Custom photo removed. Initial avatar restored.', 'info');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-[#091124] border border-[#E5B842]/50 p-6 sm:p-8 shadow-2xl relative text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#E5B842]/10 border border-[#E5B842]/30 flex items-center justify-center text-[#E5B842]">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              Change Profile Photo
              <Sparkles className="w-4 h-4 text-[#E5B842]" />
            </h2>
            <p className="text-xs text-slate-400">Upload your own picture or choose an executive avatar</p>
          </div>
        </div>

        {/* Live Photo Preview */}
        <div className="flex flex-col items-center justify-center py-4 bg-slate-900/60 rounded-2xl border border-slate-800/80 mb-6">
          <div className="relative group">
            <div className="w-28 h-28 rounded-3xl overflow-hidden border-2 border-[#E5B842] shadow-xl shadow-[#E5B842]/15 bg-[#070D1B] flex items-center justify-center">
              {selectedImage ? (
                <img 
                  src={selectedImage} 
                  alt="Avatar preview" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-black text-3xl flex items-center justify-center">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-[#E5B842] text-[#070D1B] shadow-lg hover:scale-105 active:scale-95 transition"
              title="Select image from device"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 text-center">
            <div className="text-sm font-bold text-white">{user.name}</div>
            <div className="text-[11px] text-emerald-400 font-semibold">{user.rank} Rank · KYC Tier {user.kycTier}</div>
            {fileName && (
              <div className="text-[10px] text-slate-400 mt-1 font-mono">Selected: {fileName}</div>
            )}
          </div>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div className="space-y-4 mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif"
            onChange={handleFileChange}
            className="hidden"
          />

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-[#E5B842] bg-[#E5B842]/10'
                : 'border-slate-700 hover:border-[#E5B842]/60 bg-slate-900/40 hover:bg-slate-900/80'
            }`}
          >
            <Upload className="w-6 h-6 text-[#E5B842] mx-auto mb-2 animate-bounce" />
            <div className="text-xs font-bold text-white">
              Click to choose your picture or drag & drop here
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Supports JPG, PNG, WebP up to 15MB. Automatically cropped to square profile avatar.
            </div>
          </div>
        </div>

        {/* Preset Gallery */}
        <div className="space-y-2 mb-6">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Or Choose from Nile VIP Avatars
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {PRESET_AVATARS.map((preset) => {
              const isChosen = selectedImage === preset.url;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedImage(preset.url);
                    setFileName(preset.title);
                  }}
                  className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col items-center text-center relative group ${
                    isChosen
                      ? 'border-[#E5B842] bg-[#E5B842]/10 ring-1 ring-[#E5B842]'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#E5B842]/30 mb-2 bg-[#070D1B]">
                    <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] font-bold text-white truncate max-w-full">
                    {preset.title}
                  </span>
                  {isChosen && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#E5B842] text-[#070D1B] flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={processing}
            className="w-full sm:flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#E5B842] to-[#F3BA2F] text-[#070D1B] font-black text-xs flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-[#E5B842]/20 transition"
          >
            {processing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>Save Profile Photo</span>
          </button>

          {user.avatarUrl && (
            <button
              onClick={handleRemovePhoto}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              title="Remove custom photo and reset to initials"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
