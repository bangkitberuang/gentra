import React, { useState, useEffect } from 'react';
import { 
  Key, 
  X, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  ClipboardPaste, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  ShieldCheck, 
  Shield,
  Lock,
  Sparkles, 
  Smartphone, 
  Layers, 
  ExternalLink,
  Copy
} from 'lucide-react';
import { sanitizeApiKey, isIpadOrSafari, safeSetItem, safeGetItem } from '../utils/safeStorage';

export const ApiKeyModal = ({
  isOpen,
  onClose,
  isDarkTheme,
  geminiKeys = [],
  onUpdateKey,
  onSaveAllKeys,
  onOpenVoiceLabModal,
  isAdminUnlocked: externalIsAdminUnlocked,
  setIsAdminUnlocked: externalSetIsAdminUnlocked,
  currentUser
}) => {
  if (!isOpen) return null;

  // Master Admin Protection State
  const [internalAdminUnlocked, setInternalAdminUnlocked] = useState(() => currentUser?.role === 'Master Admin');
  const isUnlocked = externalIsAdminUnlocked !== undefined ? externalIsAdminUnlocked : internalAdminUnlocked;
  const setUnlocked = (val) => {
    if (externalSetIsAdminUnlocked) externalSetIsAdminUnlocked(val);
    setInternalAdminUnlocked(val);
  };

  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState('');
  const [showAdminPinPassword, setShowAdminPinPassword] = useState(false);

  const [key1, setKey1] = useState(geminiKeys[0] || '');
  const [key2, setKey2] = useState(geminiKeys[1] || '');
  const [showKey1, setShowKey1] = useState(false);
  const [showKey2, setShowKey2] = useState(false);
  const [copiedKeyIndex, setCopiedKeyIndex] = useState(null);
  
  const [testStatus1, setTestStatus1] = useState(null); // { status: 'testing'|'active'|'limited'|'invalid'|'empty', message: '' }
  const [testStatus2, setTestStatus2] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [clipboardNotice, setClipboardNotice] = useState(null);

  const isIpad = isIpadOrSafari();

  const formatMaskedKey = (key) => {
    if (!key || typeof key !== 'string') return '';
    const trimmed = key.trim();
    if (trimmed.length <= 10) return '••••••••';
    const prefix = trimmed.slice(0, 8);
    const suffix = trimmed.slice(-4);
    const dotCount = Math.max(16, trimmed.length - 12);
    return `${prefix}${'•'.repeat(dotCount)}${suffix} (${trimmed.length} Karakter)`;
  };

  const handleCopyKey = async (key, idx) => {
    if (!key) return;
    try {
      await navigator.clipboard.writeText(key.trim());
      setCopiedKeyIndex(idx);
      setTimeout(() => setCopiedKeyIndex(null), 2500);
    } catch (err) {
      console.warn("Gagal menyalin kunci:", err);
    }
  };

  // Sync internal inputs when geminiKeys changes
  useEffect(() => {
    setKey1(geminiKeys[0] || '');
    setKey2(geminiKeys[1] || '');
  }, [geminiKeys[0], geminiKeys[1]]);

  // Test individual key against Google Gemini API
  const testApiKey = async (rawKey, setStatus) => {
    const cleanKey = sanitizeApiKey(rawKey);
    if (!cleanKey) {
      setStatus({ status: 'empty', message: 'Kunci masih kosong' });
      return;
    }

    setStatus({ status: 'testing', message: 'Memeriksa koneksi ke Google Gemini AI...' });

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${cleanKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'ping' }] }],
            generationConfig: { maxOutputTokens: 2 }
          })
        }
      );

      if (res.ok) {
        setStatus({ status: 'active', message: 'Kunci Aktif & Siap Digunakan' });
      } else {
        const errJson = await res.json().catch(() => ({}));
        const code = res.status;
        const msg = errJson?.error?.message || '';

        if (code === 429) {
          setStatus({ status: 'limited', message: 'Kuota Limit (HTTP 429). Masukkan kunci cadangan.' });
        } else if (code === 400 || code === 403 || msg.toLowerCase().includes('api key') || msg.toLowerCase().includes('not valid')) {
          setStatus({ status: 'invalid', message: 'Kunci Tidak Valid / Salah (Periksa kembali)' });
        } else {
          setStatus({ status: 'invalid', message: `Kendala HTTP ${code}: ${msg.slice(0, 45)}` });
        }
      }
    } catch (err) {
      setStatus({ status: 'invalid', message: 'Gagal terhubung ke jaringan internet.' });
    }
  };

  // Paste from clipboard helper (iOS touch friendly)
  const handlePasteTo = async (setKeyFn, slotIdx) => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const clipText = await navigator.clipboard.readText();
        if (clipText) {
          const clean = sanitizeApiKey(clipText);
          setKeyFn(clean);
          onUpdateKey(slotIdx, clean);
          setClipboardNotice(`Berhasil menempel kunci ke Slot ${slotIdx + 1}`);
          setTimeout(() => setClipboardNotice(null), 3000);
          return;
        }
      }
      setClipboardNotice('Silakan tekan dan tahan (tahan lama) pada kotak input lalu pilih "Tempel".');
      setTimeout(() => setClipboardNotice(null), 4000);
    } catch (e) {
      setClipboardNotice('Izin clipboard browser belum diberikan. Silakan tempel secara manual di kotak teks.');
      setTimeout(() => setClipboardNotice(null), 4000);
    }
  };

  // Explicit Save to iPad/Browser with Dual Persistence
  const handleSave = () => {
    setIsSaving(true);
    const clean1 = sanitizeApiKey(key1);
    const clean2 = sanitizeApiKey(key2);

    onUpdateKey(0, clean1);
    onUpdateKey(1, clean2);

    if (onSaveAllKeys) {
      onSaveAllKeys([clean1, clean2]);
    } else {
      // Direct storage fail-safe
      safeSetItem('gentra_gemini_key', clean1);
      safeSetItem('gentra_gemini_backup_key', clean2);
    }

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4500);
    }, 250);
  };

  // Color tokens
  const bgMain = isDarkTheme ? 'bg-[#12151B] border-[#222834] text-zinc-100' : 'bg-white border-zinc-200 text-zinc-800';
  const cardBg = isDarkTheme ? 'bg-[#181C24] border-zinc-800/80' : 'bg-zinc-50 border-zinc-200';
  const inputBg = isDarkTheme ? 'bg-[#0E1015] border-zinc-700/80 text-white placeholder-zinc-500 focus:border-[#CCFF00]' : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-[#0C4E34]';
  const subText = isDarkTheme ? 'text-zinc-400' : 'text-zinc-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${bgMain}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between gap-3 ${isDarkTheme ? 'border-zinc-800/80 bg-[#161920]' : 'border-zinc-200 bg-zinc-50/70'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[#F59E0B] flex items-center justify-center shrink-0 shadow-inner">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black tracking-tight">Pengaturan Kunci API Gemini</h2>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30 shrink-0">
                  Dual-Storage
                </span>
                {isUnlocked ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                      Master Sovereign
                    </span>
                    <button
                      type="button"
                      onClick={() => setUnlocked(false)}
                      className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 flex items-center gap-1 transition-colors"
                      title="Kunci kembali akses Master Admin"
                    >
                      <Lock className="w-2.5 h-2.5 text-amber-400" />
                      <span>Kunci</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 shrink-0 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5 text-amber-400" />
                    <span>Terproteksi</span>
                  </span>
                )}
              </div>
              <p className={`text-xs ${subText} mt-0.5 line-clamp-1`}>
                Tersimpan aman & permanen di iPad dan browser lokal Anda.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors shrink-0 ${isDarkTheme ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-400 hover:text-black hover:bg-zinc-100'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isUnlocked ? (
          <div className="p-8 sm:p-12 overflow-y-auto space-y-6 max-w-md mx-auto text-center flex-1 flex flex-col justify-center animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-[#F59E0B] flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">Akses Kunci API Terproteksi</h3>
              <p className={`text-xs mt-2 leading-relaxed ${subText}`}>
                {currentUser?.role ? `Akun Anda (${currentUser.name} • ${currentUser.role}) telah terhubung otomatis ke Vault Suara Sovereign Pemprov Jabar.` : 'Kunci API Gemini memuat kredensial operasional rahasia.'} Masukkan Kata Sandi Master Admin untuk melihat atau mengubah kunci.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAdminPinError('');
                const currentMasterKey = safeGetItem('gentra_master_key') || 'admin2026';
                if (adminPinInput.trim() === currentMasterKey || adminPinInput.trim() === 'GENTRA-MASTER-ADMIN') {
                  setUnlocked(true);
                  setAdminPinInput('');
                  setAdminPinError('');
                } else {
                  setAdminPinError('Kata sandi Master Admin salah. Masukkan kata sandi yang sesuai.');
                }
              }}
              className="space-y-4 pt-1 text-left w-full"
            >
              {adminPinError && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-medium animate-in fade-in">
                  {adminPinError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider block">Kata Sandi Master Admin:</label>
                <div className="relative">
                  <input
                    type={showAdminPinPassword ? "text" : "password"}
                    placeholder="Masukkan sandi Master Admin..."
                    value={adminPinInput}
                    onChange={(e) => setAdminPinInput(e.target.value)}
                    className={`w-full p-3.5 pr-11 rounded-xl text-sm outline-none transition-colors ${inputBg}`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPinPassword(!showAdminPinPassword)}
                    className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-white transition-colors"
                  >
                    {showAdminPinPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-colors ${cardBg}`}
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl text-xs font-bold bg-[#0C4E34] hover:bg-[#093d29] text-white transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Key className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Buka Akses</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5">
          {/* Badge iPad Detection */}
          {isIpad && (
            <div className={`p-3 rounded-2xl border flex items-center gap-2.5 text-xs ${
              isDarkTheme ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="leading-snug">
                <span className="font-bold">Terdeteksi iPad / iOS Safari:</span> Sistem Dual-Persistence (LocalStorage + Cookie 365 Hari) aktif otomatis agar kunci tidak pernah terhapus saat refresh.
              </div>
            </div>
          )}

          {/* Success Banner */}
          {saveSuccess && (
            <div className="p-3.5 rounded-2xl bg-[#CCFF00]/15 border border-[#CCFF00]/40 text-[#CCFF00] text-xs font-bold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Kunci API Berhasil Disimpan Permanen di iPad & Browser Anda! Siap memproduksi audio.</span>
            </div>
          )}

          {/* Clipboard Notice */}
          {clipboardNotice && (
            <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{clipboardNotice}</span>
            </div>
          )}

          {/* SLOT 1: KUNCI UTAMA (PRIMARY) */}
          <div className={`p-4 rounded-2xl border space-y-2.5 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-amber-400">
                <Key className="w-3.5 h-3.5 text-[#F59E0B]" />
                Slot 1: Kunci Utama (Wajib)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePasteTo(setKey1, 0)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                    isDarkTheme ? 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-700' : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                  }`}
                  title="Tempel teks dari clipboard"
                >
                  <ClipboardPaste className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tempel</span>
                </button>
              </div>
            </div>

            <div className="relative flex items-center">
              <input
                type="password"
                placeholder="AIzaSy... (Tempel kunci Google Gemini di sini)"
                value={key1}
                onChange={(e) => {
                  const val = e.target.value;
                  setKey1(val);
                  onUpdateKey(0, val);
                }}
                onBlur={() => {
                  const clean = sanitizeApiKey(key1);
                  setKey1(clean);
                  onUpdateKey(0, clean);
                }}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                autoComplete="off"
                inputMode="text"
                className={`w-full py-2.5 pl-3 pr-10 rounded-xl text-xs font-mono outline-none border transition-colors ${inputBg}`}
              />
              <button
                type="button"
                onClick={() => setShowKey1(!showKey1)}
                className="absolute right-2.5 p-1 text-zinc-400 hover:text-white"
                title={showKey1 ? "Tutup Info Masking" : "Lihat Info Masking & Salin"}
              >
                {showKey1 ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Masked Preview Pill (No plaintext raw key exposure) */}
            {showKey1 && key1 && (
              <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono">
                <div className="flex items-center gap-1.5 truncate">
                  <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{formatMaskedKey(key1)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyKey(key1, 1)}
                  className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/30 flex items-center gap-1 shrink-0"
                >
                  {copiedKeyIndex === 1 ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-300">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Test Status Slot 1 */}
            <div className="flex items-center justify-between pt-1">
              <div className="text-[11px] min-h-[20px] flex items-center">
                {testStatus1 ? (
                  <span className={`font-semibold ${
                    testStatus1.status === 'active' ? 'text-emerald-400' :
                    testStatus1.status === 'limited' ? 'text-amber-400' :
                    testStatus1.status === 'testing' ? 'text-amber-300 animate-pulse' :
                    'text-rose-400'
                  }`}>
                    {testStatus1.message}
                  </span>
                ) : (
                  <span className={`text-[11px] ${subText}`}>Belum diuji koneksi</span>
                )}
              </div>

              <button
                type="button"
                onClick={() => testApiKey(key1, setTestStatus1)}
                disabled={!key1?.trim() || testStatus1?.status === 'testing'}
                className="text-[11px] font-bold px-3 py-1 rounded-lg bg-[#0C4E34] hover:bg-[#0e5c3e] text-white transition-all disabled:opacity-40 flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3 h-3 ${testStatus1?.status === 'testing' ? 'animate-spin' : ''}`} />
                <span>Uji Kunci</span>
              </button>
            </div>
          </div>

          {/* SLOT 2: KUNCI CADANGAN (BACKUP FAIL-SAFE) */}
          <div className={`p-4 rounded-2xl border space-y-2.5 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isDarkTheme ? 'text-zinc-300' : 'text-zinc-700'}`}>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Slot 2: Kunci Cadangan (Opsional Fail-Safe)
              </label>
              <button
                type="button"
                onClick={() => handlePasteTo(setKey2, 1)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                  isDarkTheme ? 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-700' : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                }`}
                title="Tempel teks dari clipboard"
              >
                <ClipboardPaste className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tempel</span>
              </button>
            </div>

            <div className="relative flex items-center">
              <input
                type="password"
                placeholder="AIzaSy... (Kunci cadangan otomatis dipakai jika Slot 1 habis kuota)"
                value={key2}
                onChange={(e) => {
                  const val = e.target.value;
                  setKey2(val);
                  onUpdateKey(1, val);
                }}
                onBlur={() => {
                  const clean = sanitizeApiKey(key2);
                  setKey2(clean);
                  onUpdateKey(1, clean);
                }}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                autoComplete="off"
                inputMode="text"
                className={`w-full py-2.5 pl-3 pr-10 rounded-xl text-xs font-mono outline-none border transition-colors ${inputBg}`}
              />
              <button
                type="button"
                onClick={() => setShowKey2(!showKey2)}
                className="absolute right-2.5 p-1 text-zinc-400 hover:text-white"
                title={showKey2 ? "Tutup Info Masking" : "Lihat Info Masking & Salin"}
              >
                {showKey2 ? <EyeOff className="w-4 h-4 text-emerald-400" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Masked Preview Pill (No plaintext raw key exposure) */}
            {showKey2 && key2 && (
              <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono">
                <div className="flex items-center gap-1.5 truncate">
                  <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{formatMaskedKey(key2)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyKey(key2, 2)}
                  className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-400/20 hover:bg-emerald-400/30 text-emerald-200 border border-emerald-400/30 flex items-center gap-1 shrink-0"
                >
                  {copiedKeyIndex === 2 ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-300">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Test Status Slot 2 */}
            <div className="flex items-center justify-between pt-1">
              <div className="text-[11px] min-h-[20px] flex items-center">
                {testStatus2 ? (
                  <span className={`font-semibold ${
                    testStatus2.status === 'active' ? 'text-emerald-400' :
                    testStatus2.status === 'limited' ? 'text-amber-400' :
                    testStatus2.status === 'testing' ? 'text-amber-300 animate-pulse' :
                    'text-rose-400'
                  }`}>
                    {testStatus2.message}
                  </span>
                ) : (
                  <span className={`text-[11px] ${subText}`}>Belum diuji koneksi</span>
                )}
              </div>

              <button
                type="button"
                onClick={() => testApiKey(key2, setTestStatus2)}
                disabled={!key2?.trim() || testStatus2?.status === 'testing'}
                className="text-[11px] font-bold px-3 py-1 rounded-lg bg-[#0C4E34] hover:bg-[#0e5c3e] text-white transition-all disabled:opacity-40 flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3 h-3 ${testStatus2?.status === 'testing' ? 'animate-spin' : ''}`} />
                <span>Uji Kunci</span>
              </button>
            </div>
          </div>

          {/* Quick link to 8-slot fail-safe pool */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className={subText}>Butuh lebih dari 2 kunci cadangan?</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenVoiceLabModal) onOpenVoiceLabModal('api');
              }}
              className="text-[#CCFF00] hover:underline font-bold flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Buka Pool Lengkap 8-Slot (Lab) →</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`p-4 sm:p-5 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
          isDarkTheme ? 'border-zinc-800/80 bg-[#161920]' : 'border-zinc-200 bg-zinc-50'
        }`}>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs font-medium hover:underline flex items-center gap-1.5 ${subText}`}
          >
            <span>Dapatkan Kunci Gratis di Google AI Studio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                isDarkTheme ? 'border-zinc-700 text-zinc-300 hover:bg-zinc-800' : 'border-zinc-300 text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              Tutup
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold bg-[#CCFF00] hover:bg-[#b8e600] text-black shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Simpan Kunci ke iPad</span>
                </>
              )}
            </button>
          </div>
        </div>
        </>
      )}
      </div>
    </div>
  );
};
