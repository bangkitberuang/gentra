import React, { useState, useRef, useEffect } from 'react';
import {
  FlaskConical,
  Key,
  Shield,
  Eye,
  EyeOff,
  Play,
  Square,
  Check,
  CheckCircle,
  X,
  Lock,
  Unlock,
  Sparkles,
  RefreshCw,
  Activity,
  User,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  Volume2,
  Search,
  Filter,
  Download,
  AlertCircle,
  Zap,
  Sliders,
  FileJson,
  Upload,
  Coins,
  Receipt,
  TrendingUp,
  Wallet,
  Calendar,
  CreditCard,
  FileSpreadsheet,
  Copy
} from 'lucide-react';
import { sanitizeApiKey, safeSetItem, safeGetItem } from '../utils/safeStorage';
import { isMasterPassword } from '../utils/userManagement';

// 15 Base Prebuilt Voices Resmi Google Gemini TTS (v1beta)
export const GEMINI_BASE_VOICES = [
  { id: 'Aoede', name: 'Aoede', gender: 'Female', desc: 'Ramah, Ceria, Artikulasi Jelas' },
  { id: 'Puck', name: 'Puck', gender: 'Male', desc: 'Muda, Enerjik, Kasual Nyantai' },
  { id: 'Charon', name: 'Charon', gender: 'Male', desc: 'Deep, Maskulin, Naratif Berwibawa' },
  { id: 'Fenrir', name: 'Fenrir', gender: 'Male', desc: 'Berat, Otoritatif, Khidmat & Wibawa' },
  { id: 'Kore', name: 'Kore', gender: 'Female', desc: 'Tenang, Halus, Menenangkan' },
  { id: 'Leda', name: 'Leda', gender: 'Female', desc: 'Lembut, Santun, Bersahaja' },
  { id: 'Despina', name: 'Despina', gender: 'Female', desc: 'Ekspresif, Cepat, Lugas' },
  { id: 'Callirrhoe', name: 'Callirrhoe', gender: 'Female', desc: 'Profesional, Berita Formal' },
  { id: 'Autonoe', name: 'Autonoe', gender: 'Female', desc: 'Inspiratif, Hangat, Edukatif' },
  { id: 'Erinome', name: 'Erinome', gender: 'Female', desc: 'Halus, Welas Asih, Keibuan' },
  { id: 'Laomedeia', name: 'Laomedeia', gender: 'Female', desc: 'Tegas, Berani, Komando' },
  { id: 'Orus', name: 'Orus', gender: 'Male', desc: 'Santai, Sejuk, Komunikatif' },
  { id: 'Algenib', name: 'Algenib', gender: 'Male', desc: 'Ceria, Riang, Nada Tinggi' },
  { id: 'Iapetus', name: 'Iapetus', gender: 'Male', desc: 'Serius, Edukatif, Dokumenter' },
  { id: 'Achernar', name: 'Achernar', gender: 'Female', desc: 'Anggun, Elegan, Puitis' }
];

// Multi-Model TTS Backup Cascade untuk 24/7 Zero-Failure
export const LAB_TTS_MODELS = [
  "gemini-2.5-flash-preview-tts",
  "gemini-3.8-flash-tts",
  "gemini-3.1-flash-tts-preview",
  "gemini-2.5-pro-preview-tts",
  "gemini-3.8-flash-lite-tts"
];

// Audio Decoder Helper
const base64ToPCM16 = (base64String) => {
  let binaryString = atob(base64String);
  const c2paIndex = binaryString.indexOf('C2PA');
  const qdigIndex = binaryString.indexOf('qdigitalSourceType');
  const adobeIndex = binaryString.indexOf('http://ns.adobe.com');
  
  let cutIndex = binaryString.length;
  if (c2paIndex !== -1 && c2paIndex < cutIndex) cutIndex = c2paIndex;
  if (qdigIndex !== -1 && qdigIndex < cutIndex) cutIndex = qdigIndex;
  if (adobeIndex !== -1 && adobeIndex < cutIndex) cutIndex = adobeIndex;
  
  if (cutIndex % 2 !== 0) cutIndex -= 1;
  if (cutIndex <= 0) cutIndex = binaryString.length - (binaryString.length % 2);
  
  const sampleCount = Math.floor(cutIndex / 2);
  const pcm16 = new Int16Array(sampleCount);
  
  for (let i = 0; i < sampleCount; i++) {
    const byte1 = binaryString.charCodeAt(i * 2);
    const byte2 = binaryString.charCodeAt(i * 2 + 1);
    let sample = (byte2 << 8) | byte1;
    if (sample >= 0x8000) sample -= 0x10000;
    pcm16[i] = sample;
  }
  
  const fadeInSamples = Math.min(240, Math.floor(sampleCount * 0.1));
  for (let i = 0; i < fadeInSamples; i++) {
    pcm16[i] = Math.round(pcm16[i] * (i / fadeInSamples));
  }
  
  const fadeOutSamples = Math.min(360, Math.floor(sampleCount * 0.1));
  for (let i = 0; i < fadeOutSamples; i++) {
    const factor = (fadeOutSamples - i) / fadeOutSamples;
    const idx = sampleCount - 1 - i;
    pcm16[idx] = Math.round(pcm16[idx] * factor);
  }
  
  return pcm16;
};

const buildWavBlobFromPCM = (mergedPCM, sampleRate = 24000) => {
  const buffer = new ArrayBuffer(44 + mergedPCM.length * 2);
  const view = new DataView(buffer);
  
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + mergedPCM.length * 2, true);
  view.setUint32(8, 0x57415645, false); // "WAVE"
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM Format
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, mergedPCM.length * 2, true);

  for (let i = 0; i < mergedPCM.length; i++) {
    view.setInt16(44 + i * 2, mergedPCM[i], true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
};

// Formatter Rupiah IDR
export const formatIDR = (val) => {
  const num = Number(val) || 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(num);
};

export const VoiceLabModal = ({
  isOpen,
  onClose,
  isDarkTheme,
  voices = [],
  onUpdateVoices,
  activeKeyPool = [],
  geminiKeys = [],
  handleUpdateGeminiKey,
  handleTestKey,
  handleTestAllKeys,
  keyTestStatuses = [],
  isTestingAll = false,
  keyVisibility = [],
  setKeyVisibility,
  isAdminUnlocked,
  setIsAdminUnlocked,
  user,
  TTS_MODEL = 'gemini-2.5-flash-preview-tts',
  initialVoicesDefaults = [],
  initialTab = 'lab'
}) => {
  if (!isOpen) return null;

  // Active Tab: 'lab' | 'cost' | 'api' | 'benchmark' | 'security'
  const [activeTab, setActiveTab] = useState(initialTab);
  const [poolSaveSuccess, setPoolSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Search & Filters in Voice Lab
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // PIN Auth State
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState('');
  const [copiedPoolKeyIndex, setCopiedPoolKeyIndex] = useState(null);

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
      setCopiedPoolKeyIndex(idx);
      setTimeout(() => setCopiedPoolKeyIndex(null), 2500);
    } catch (err) {
      console.warn("Gagal menyalin kunci pool:", err);
    }
  };

  // Voice Playground State
  const [labText, setLabText] = useState('Sampurasun wargi Jawa Barat, ieu simulasi audio laboratorium vokal GENTRA.');
  const [selectedLabVoice, setSelectedLabVoice] = useState(() => voices[0] || null);
  const [isGeneratingLabAudio, setIsGeneratingLabAudio] = useState(false);
  const [labAudioUrl, setLabAudioUrl] = useState(null);
  const [labAudioLatency, setLabAudioLatency] = useState(null);
  const [labAudioError, setLabAudioError] = useState(null);
  const [isPlayingLabAudio, setIsPlayingLabAudio] = useState(false);
  const labAudioRef = useRef(null);

  // Edit Persona State (Ganti Nama & Metadata)
  const [editingVoice, setEditingVoice] = useState(null);
  const [promptEditingVoice, setPromptEditingVoice] = useState(null);
  const [promptInputText, setPromptInputText] = useState('');
  const [editForm, setEditForm] = useState({
    name: '',
    desc: '',
    accent: '',
    category: 'Nasional',
    gender: 'Female',
    personaPrompt: '',
    id: 'Aoede'
  });

  // Tambah Persona Baru State
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newVoiceForm, setNewVoiceForm] = useState({
    name: '',
    id: 'Puck',
    desc: '',
    accent: 'Nasional (Santai)',
    category: 'Nasional',
    gender: 'Male',
    personaPrompt: ''
  });

  // Benchmark State
  const [benchmarkPrompt, setBenchmarkPrompt] = useState('Pemerintah Provinsi Jawa Barat menghimbau wargi untuk tetap waspada dan tertib.');
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [benchmarkResults, setBenchmarkResults] = useState([]);

  // Master Admin Key Change
  const [newMasterKeyInput, setNewMasterKeyInput] = useState('');
  const [masterKeySuccess, setMasterKeySuccess] = useState('');



  // Styles helpers
  const bgCard = isDarkTheme ? 'bg-[#0f1713] border-emerald-950 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900';
  const subBg = isDarkTheme ? 'bg-[#15231c] border-emerald-900/60' : 'bg-zinc-50 border-zinc-200';
  const subText = isDarkTheme ? 'text-zinc-400' : 'text-zinc-600';
  const inputStyle = isDarkTheme 
    ? 'bg-[#09110d] border border-emerald-950 text-zinc-200 focus:border-emerald-500' 
    : 'bg-white border border-zinc-200 text-zinc-900 focus:border-emerald-500';

  // Stop audio on unmount or close
  useEffect(() => {
    return () => {
      if (labAudioRef.current) {
        labAudioRef.current.pause();
        labAudioRef.current = null;
      }
    };
  }, []);

  // Update selectedLabVoice if voices change
  useEffect(() => {
    if (!selectedLabVoice && voices.length > 0) {
      setSelectedLabVoice(voices[0]);
    }
  }, [voices, selectedLabVoice]);

  // --- Handlers: Hide / Unhide ---
  const handleToggleHideVoice = (voice) => {
    const updated = voices.map(v => {
      if (v.id === voice.id && v.name === voice.name) {
        return { ...v, isHidden: !v.isHidden };
      }
      return v;
    });
    onUpdateVoices(updated);
  };

  // --- Handlers: Start Edit Voice ---
  const handleStartEdit = (voice) => {
    setEditingVoice(voice);
    setEditForm({
      name: voice.name || '',
      desc: voice.desc || '',
      accent: voice.accent || '',
      category: voice.category || 'Nasional',
      gender: voice.gender || 'Female',
      personaPrompt: voice.personaPrompt || '',
      id: voice.id || 'Aoede'
    });
  };

  // --- Handlers: Save Edit Voice ---
  const handleSaveEdit = () => {
    if (!editingVoice || !editForm.name.trim()) {
      alert("Nama karakter tidak boleh kosong.");
      return;
    }

    const updated = voices.map(v => {
      if (v.id === editingVoice.id && v.name === editingVoice.name) {
        return {
          ...v,
          originalName: v.originalName || editingVoice.name,
          name: editForm.name.trim(),
          desc: editForm.desc.trim(),
          accent: editForm.accent.trim(),
          category: editForm.category,
          gender: editForm.gender,
          personaPrompt: editForm.personaPrompt.trim(),
          id: editForm.id || v.id
        };
      }
      return v;
    });

    onUpdateVoices(updated);
    setEditingVoice(null);
  };

  // --- Handlers: Reset Single Voice to Factory Name ---
  const handleResetSingleVoice = (voice) => {
    const originalRef = initialVoicesDefaults.find(iv => iv.id === voice.id && (iv.name === (voice.originalName || voice.name)));
    if (!originalRef) {
      const updated = voices.map(v => {
        if (v.id === voice.id && v.name === voice.name) {
          return { ...v, isHidden: false };
        }
        return v;
      });
      onUpdateVoices(updated);
      return;
    }

    const updated = voices.map(v => {
      if (v.id === voice.id && v.name === voice.name) {
        return {
          ...originalRef,
          originalName: originalRef.name,
          isHidden: false
        };
      }
      return v;
    });
    onUpdateVoices(updated);
  };

  // --- Handlers: Reset All to Defaults ---
  const handleResetAllToFactory = () => {
    if (window.confirm("PERINGATAN: Apakah Anda yakin ingin mereset SEMUA karakter suara ke nama asli dan membatalkan status sembunyi (unhide all)?")) {
      const reset = initialVoicesDefaults.map(iv => ({
        ...iv,
        originalName: iv.name,
        isHidden: false
      }));
      onUpdateVoices(reset);
      try {
        localStorage.removeItem('gentra_voices_v3');
      } catch (e) {}
      alert("Seluruh daftar suara berhasil dikembalikan ke standar pabrik GENTRA!");
    }
  };

  // --- Handlers: Add New Custom Persona ---
  const handleSaveNewPersona = () => {
    if (!newVoiceForm.name.trim()) {
      alert("Masukkan nama karakter suara baru.");
      return;
    }

    const newVoice = {
      id: newVoiceForm.id,
      originalId: newVoiceForm.id,
      name: newVoiceForm.name.trim(),
      originalName: newVoiceForm.name.trim(),
      desc: newVoiceForm.desc.trim() || `Karakter Baru ${newVoiceForm.name}`,
      gender: newVoiceForm.gender,
      category: newVoiceForm.category,
      accent: newVoiceForm.accent.trim() || 'Kustom',
      personaPrompt: newVoiceForm.personaPrompt.trim(),
      isCustom: true,
      isHidden: false
    };

    const updated = [newVoice, ...voices];
    onUpdateVoices(updated);
    setIsAddingNew(false);
    setNewVoiceForm({
      name: '',
      id: 'Puck',
      desc: '',
      accent: 'Nasional (Santai)',
      category: 'Nasional',
      gender: 'Male',
      personaPrompt: ''
    });
    setSelectedLabVoice(newVoice);
  };

  // --- Handlers: Delete Custom Voice ---
  const handleDeleteCustomVoice = (voice) => {
    if (!voice.isCustom && !voice.isCloned) {
      alert("Karakter bawaan sistem tidak dapat dihapus, namun dapat disembunyikan (Hide).");
      return;
    }
    if (window.confirm(`Hapus karakter kustom "${voice.name}" secara permanen?`)) {
      const filtered = voices.filter(v => !(v.id === voice.id && v.name === voice.name));
      onUpdateVoices(filtered);
    }
  };

  // --- Handlers: Voice Lab Live Audio Generation & Test ---
  const handleTestGenerateLabAudio = async (overrideVoice = null) => {
    const targetVoice = overrideVoice || selectedLabVoice;
    if (!targetVoice) return;
    if (!labText.trim()) {
      alert("Ketikkan teks simulasi terlebih dahulu.");
      return;
    }

    const key = activeKeyPool[0];
    if (!key) {
      setLabAudioError("Kunci API Gemini belum tersedia di Slot Pool. Masukkan API Key di tab Kredensial.");
      return;
    }

    setIsGeneratingLabAudio(true);
    setLabAudioError(null);
    setLabAudioLatency(null);

    const startTime = performance.now();

    try {
      const voiceDirective = `[Sebagai pengisi suara ${targetVoice.name}, persona Anda: ${targetVoice.personaPrompt || targetVoice.desc || 'natural'}. ATURAN WAJIB: Langsung bacakan naskah tanpa intro atau salam pembuka apa pun]:\n`;
      const payload = {
        contents: [{ parts: [{ text: `${voiceDirective}${labText.trim()}` }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: targetVoice.id || 'Puck'
              }
            }
          }
        }
      };

      let data = null;
      let lastErr = null;
      const modelsToTry = [TTS_MODEL, ...LAB_TTS_MODELS.filter(m => m !== TTS_MODEL)];

      for (const mName of modelsToTry) {
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${mName}:generateContent?key=${key}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            }
          );

          if (res.ok) {
            const resData = await res.json();
            const rawInline = resData?.candidates?.[0]?.content?.parts?.[0]?.inlineData;
            if (rawInline?.data) {
              data = resData;
              break;
            }
          } else {
            const errJson = await res.json().catch(() => ({}));
            lastErr = new Error(errJson?.error?.message || `HTTP ${res.status}: Gagal generate suara pada model ${mName}.`);
          }
        } catch (fetchErr) {
          lastErr = fetchErr;
        }
      }

      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);
      setLabAudioLatency(latency);

      const inlineData = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      if (!inlineData?.data) {
        throw new Error(lastErr?.message || "Respon audio kosong dari server Gemini setelah mencoba seluruh model cadangan.");
      }

      const pcm16 = base64ToPCM16(inlineData.data);
      const wavBlob = buildWavBlobFromPCM(pcm16, 24000);
      const url = URL.createObjectURL(wavBlob);

      setLabAudioUrl(url);

      // Play instantly
      if (labAudioRef.current) {
        labAudioRef.current.pause();
      }
      const audio = new Audio(url);
      labAudioRef.current = audio;
      audio.onplay = () => setIsPlayingLabAudio(true);
      audio.onended = () => setIsPlayingLabAudio(false);
      audio.onerror = () => setIsPlayingLabAudio(false);
      await audio.play();
    } catch (err) {
      setLabAudioError(err.message);
    } finally {
      setIsGeneratingLabAudio(false);
    }
  };

  // --- Handlers: Toggle Playback of Lab Audio ---
  const handleToggleLabPlay = () => {
    if (!labAudioRef.current && labAudioUrl) {
      const audio = new Audio(labAudioUrl);
      labAudioRef.current = audio;
      audio.onplay = () => setIsPlayingLabAudio(true);
      audio.onended = () => setIsPlayingLabAudio(false);
      audio.onerror = () => setIsPlayingLabAudio(false);
    }

    if (labAudioRef.current) {
      if (isPlayingLabAudio) {
        labAudioRef.current.pause();
        setIsPlayingLabAudio(false);
      } else {
        labAudioRef.current.play();
        setIsPlayingLabAudio(true);
      }
    }
  };

  // --- Handlers: Export Registry to JSON ---
  const handleExportRegistry = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(voices, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `gentra_voice_registry_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // --- Handlers: Import Registry from JSON ---
  const handleImportRegistry = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          onUpdateVoices(imported);
          alert(`Berhasil mengimpor ${imported.length} karakter suara ke registry!`);
        } else {
          alert("Format file JSON tidak valid.");
        }
      } catch (err) {
        alert("Gagal membaca file JSON: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  // --- Filtering Voices in Table/Grid ---
  const filteredVoices = voices.filter(v => {
    const matchesSearch = 
      (v.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.originalName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.desc || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.accent || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterCategory === 'all') return true;
    if (filterCategory === 'active') return !v.isHidden;
    if (filterCategory === 'hidden') return Boolean(v.isHidden);
    if (filterCategory === 'Nasional') return v.category === 'Nasional';
    if (filterCategory === 'Sunda') return v.category === 'Sunda';
    if (filterCategory === 'custom') return v.isCustom || v.isCloned;
    return true;
  });

  const totalVoices = voices.length;
  const activeVoicesCount = voices.filter(v => !v.isHidden).length;
  const hiddenVoicesCount = voices.filter(v => v.isHidden).length;
  const sundaVoicesCount = voices.filter(v => v.category === 'Sunda' && !v.isHidden).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`border w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden transition-all ${bgCard}`}>
        
        {/* HEADER MODAL */}
        <div className={`p-4 sm:p-6 border-b flex items-center justify-between gap-4 ${isDarkTheme ? 'border-emerald-950 bg-[#09110d]' : 'border-zinc-200 bg-white'}`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2.5 rounded-2xl shrink-0 ${
              isAdminUnlocked 
                ? 'bg-amber-500/20 text-[#F59E0B] border border-amber-500/30' 
                : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
            }`}>
              <FlaskConical className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black tracking-tight truncate">
                  Laboratorium Pengembangan Suara & Backend
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-400/30 font-bold shrink-0">
                  GENTRA Lab v2.6.4
                </span>
                {isAdminUnlocked ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                    Master Admin Terbuka
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 shrink-0">
                    Terkunci
                  </span>
                )}
              </div>
              <p className={`text-xs mt-0.5 truncate ${subText}`}>
                Pusat kurasi vokal: Uji suara langsung, filter visibilitas, ganti nama persona, dan manajemen pool kunci API.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors shrink-0 ${
              isDarkTheme ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-400 hover:text-black hover:bg-zinc-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TAB NAVIGATION BAR (Selalu dapat diakses agar tab API tidak terblokir di iPad) */}
        <div className={`px-4 sm:px-6 py-2 border-b flex items-center justify-between gap-2 overflow-x-auto ${isDarkTheme ? 'border-emerald-950/80 bg-[#0a120e]' : 'border-zinc-200 bg-zinc-50'}`}>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('lab')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'lab'
                  ? 'bg-[#0C4E34] text-white shadow-xs'
                  : isDarkTheme ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/60' : 'text-zinc-600 hover:text-black hover:bg-zinc-200/60'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Laboratorium Suara</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-mono">
                {totalVoices}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('api')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'api'
                  ? 'bg-[#0C4E34] text-white shadow-xs'
                  : isDarkTheme ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/60' : 'text-zinc-600 hover:text-black hover:bg-zinc-200/60'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Pool Kunci API (8 Slot)</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeKeyPool.length > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {activeKeyPool.length}/8
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('benchmark')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'benchmark'
                  ? 'bg-[#0C4E34] text-white shadow-xs'
                  : isDarkTheme ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/60' : 'text-zinc-600 hover:text-black hover:bg-zinc-200/60'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Arena Latensi</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'security'
                  ? 'bg-[#0C4E34] text-white shadow-xs'
                  : isDarkTheme ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/60' : 'text-zinc-600 hover:text-black hover:bg-zinc-200/60'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Keamanan Admin</span>
            </button>
          </div>

          {isAdminUnlocked ? (
            <button
              type="button"
              onClick={() => setIsAdminUnlocked(false)}
              className="text-[11px] font-bold text-rose-400 hover:text-rose-300 hover:underline px-2 py-1 shrink-0 flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              <span>Kunci Kembali</span>
            </button>
          ) : (
            <span className="text-[10px] font-bold text-zinc-400 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Terproteksi Master Admin</span>
            </span>
          )}
        </div>

        {/* KONDISI JIKA ADMIN BELUM DIBUKA */}
        {!isAdminUnlocked ? (
          <div className="p-8 sm:p-12 overflow-y-auto space-y-6 max-w-md mx-auto text-center">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-[#F59E0B] flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Akses Fitur Terproteksi Master Sovereign</h3>
              <p className={`text-xs mt-1.5 leading-relaxed ${subText}`}>
                Laboratorium Suara, Konfigurasi Engine, dan Pool Kunci API memuat kredensial backend sensitif. Masukkan Kata Sandi Master Admin untuk membuka akses.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAdminPinError('');
                if (isMasterPassword(adminPinInput)) {
                  setIsAdminUnlocked(true);
                  setAdminPinInput('');
                } else {
                  setAdminPinError('Kunci Master Admin salah. Masukkan sandi yang sesuai.');
                }
              }}
              className="space-y-3 pt-2 text-left"
            >
              {adminPinError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium">
                  {adminPinError}
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider block">Kata Sandi Master Admin:</label>
                <input
                  type="password"
                  placeholder="Masukkan sandi..."
                  value={adminPinInput}
                  onChange={(e) => setAdminPinInput(e.target.value)}
                  className={`w-full p-3.5 rounded-xl text-sm outline-none transition-colors ${inputStyle}`}
                  autoFocus
                />
              </div>

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className={`py-3 px-4 rounded-xl border text-xs font-bold transition-colors ${subBg}`}
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-[#0C4E34] hover:bg-[#0e5c3e] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Unlock className="w-4 h-4 text-[#F59E0B]" />
                  <span>Buka Akses Admin</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* KONDISI JIKA ADMIN SUDAH TERBUKA */
          <>
            {/* BODY MODAL CONTAINER */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

              {/* TAB 1: LABORATORIUM & MANAJEMEN SUARA */}
              {activeTab === 'lab' && (
                <div className="space-y-6 animate-in fade-in duration-150">

                  {/* QUICK STATS BAR */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className={`p-3.5 rounded-2xl border ${subBg}`}>
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${subText}`}>Total Karakter</span>
                      <div className="text-xl font-black mt-1 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-emerald-500" />
                        <span>{totalVoices}</span>
                      </div>
                    </div>
                    <div className={`p-3.5 rounded-2xl border ${isDarkTheme ? 'bg-emerald-950/40 border-emerald-900/60 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-[#0C4E34]'}`}>
                      <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">Aktif di Studio</span>
                      <div className="text-xl font-black mt-1 flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        <span>{activeVoicesCount} Karakter</span>
                      </div>
                    </div>
                    <div className={`p-3.5 rounded-2xl border ${isDarkTheme ? 'bg-rose-950/30 border-rose-900/50 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                      <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">Disembunyikan (Hide)</span>
                      <div className="text-xl font-black mt-1 flex items-center gap-1.5">
                        <EyeOff className="w-4 h-4" />
                        <span>{hiddenVoicesCount} Karakter</span>
                      </div>
                    </div>
                    <div className={`p-3.5 rounded-2xl border ${isDarkTheme ? 'bg-amber-950/30 border-amber-900/50 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                      <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">Pasundan Aktif</span>
                      <div className="text-xl font-black mt-1 flex items-center gap-1.5">
                        <span>{sundaVoicesCount} Persona</span>
                      </div>
                    </div>
                  </div>

                  {/* LABORATORIUM PLAYGROUND (LIVE VOICE TESTING BENCH) */}
                  <div className={`p-4 sm:p-5 rounded-3xl border shadow-sm space-y-4 ${
                    isDarkTheme ? 'bg-gradient-to-br from-[#0c1812] to-[#08100c] border-emerald-800/60' : 'bg-gradient-to-br from-emerald-50/70 via-white to-zinc-50 border-emerald-200'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-emerald-900/30">
                      <div className="flex items-center gap-2">
                        <FlaskConical className="w-5 h-5 text-[#F59E0B]" />
                        <h3 className="text-sm font-black uppercase tracking-wider">
                          Uji Coba Karakter di Laboratorium (Live Synthesis)
                        </h3>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/80 self-start sm:self-auto">
                        Model: {TTS_MODEL}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Left: Input Text & Preset */}
                      <div className="md:col-span-2 space-y-2">
                        <label className={`text-xs font-bold uppercase tracking-wider block ${subText}`}>
                          Teks Sampel Pengujian Laboratorium:
                        </label>
                        <textarea
                          rows={3}
                          value={labText}
                          onChange={(e) => setLabText(e.target.value)}
                          placeholder="Ketik teks simulasi pengujian vokal..."
                          className={`w-full p-3 rounded-2xl text-xs outline-none transition-colors resize-none ${inputStyle}`}
                        />
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          <span className={`text-[10px] font-bold ${subText} self-center mr-1`}>Preset:</span>
                          <button
                            type="button"
                            onClick={() => setLabText("Sampurasun wargi Jawa Barat, ieu simulasi audio laboratorium vokal GENTRA.")}
                            className={`text-[10px] px-2.5 py-1 rounded-xl border font-medium ${subBg}`}
                          >
                            Sampurasun Sunda
                          </button>
                          <button
                            type="button"
                            onClick={() => setLabText("Halo wargi Jawa Barat, ini adalah pengujian kualitas vokal laboratorium GENTRA.")}
                            className={`text-[10px] px-2.5 py-1 rounded-xl border font-medium ${subBg}`}
                          >
                            Nasional Formal
                          </button>
                          <button
                            type="button"
                            onClick={() => setLabText("Hadirin sekalian, selamat datang di siaran informasi kebijakan terpadu pemerintah.")}
                            className={`text-[10px] px-2.5 py-1 rounded-xl border font-medium ${subBg}`}
                          >
                            Siaran Berita
                          </button>
                        </div>
                      </div>

                      {/* Right: Select Voice & Generate */}
                      <div className="space-y-3 flex flex-col justify-between">
                        <div>
                          <label className={`text-xs font-bold uppercase tracking-wider block mb-1.5 ${subText}`}>
                            Pilih Karakter untuk Diuji:
                          </label>
                          <select
                            value={selectedLabVoice?.name || ''}
                            onChange={(e) => {
                              const found = voices.find(v => v.name === e.target.value);
                              if (found) setSelectedLabVoice(found);
                            }}
                            className={`w-full p-2.5 rounded-xl text-xs font-bold outline-none ${inputStyle}`}
                          >
                            {voices.map((v, idx) => (
                              <option key={idx} value={v.name}>
                                {v.isHidden ? '[Hide] ' : ''}{v.name} ({v.category} • Base: {v.id})
                              </option>
                            ))}
                          </select>
                          {selectedLabVoice && (
                            <p className={`text-[10px] mt-1.5 truncate ${subText}`}>
                              Base: <span className="font-mono font-bold text-amber-400">{selectedLabVoice.id}</span> | {selectedLabVoice.desc}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <button
                            type="button"
                            disabled={isGeneratingLabAudio}
                            onClick={() => handleTestGenerateLabAudio()}
                            className="w-full py-3 bg-[#0C4E34] hover:bg-[#0e5c3e] text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                          >
                            {isGeneratingLabAudio ? (
                              <>
                                <RefreshCw className="w-4 h-4 text-[#F59E0B] animate-spin" />
                                <span>Mensintesis Vokal di Lab...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                                <span>GENERATE & DENGARKAN DI LAB</span>
                              </>
                            )}
                          </button>

                          {/* Player Box if audio generated */}
                          {labAudioUrl && (
                            <div className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                              isDarkTheme ? 'bg-[#060c09] border-emerald-900/60' : 'bg-white border-zinc-200'
                            }`}>
                              <button
                                type="button"
                                onClick={handleToggleLabPlay}
                                className="p-2 rounded-lg bg-[#F59E0B] hover:bg-[#d97706] text-black font-bold flex items-center gap-1.5 text-xs transition-colors shrink-0"
                              >
                                {isPlayingLabAudio ? <Square className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-black" />}
                                <span>{isPlayingLabAudio ? 'Stop' : 'Putar Ulang'}</span>
                              </button>

                              <div className="text-[10px] font-mono text-zinc-400 truncate">
                                {labAudioLatency && (
                                  <span className="text-emerald-400 font-bold">{labAudioLatency} ms</span>
                                )} • 24 kHz WAV
                              </div>

                              <a
                                href={labAudioUrl}
                                download={`gentra_lab_${selectedLabVoice?.name || 'voice'}.wav`}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                                title="Unduh File WAV"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            </div>
                          )}

                          {labAudioError && (
                            <div className="p-2 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-[11px] font-medium flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                              <span className="truncate">{labAudioError}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TOOLBAR REGISTRY (SEARCH, CATEGORY FILTER & ACTION BUTTONS) */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-sm">
                      <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Cari karakter, nama asli, base model..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full py-2 pl-9 pr-3 rounded-xl text-xs outline-none transition-colors ${inputStyle}`}
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-white text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Filter Category Pills */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setFilterCategory('all')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                          filterCategory === 'all' 
                            ? 'bg-[#0C4E34] text-white border-[#0C4E34]' 
                            : isDarkTheme ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white' : 'bg-white border-zinc-200 text-zinc-600'
                        }`}
                      >
                        Semua ({totalVoices})
                      </button>
                      <button
                        type="button"
                        onClick={() => setFilterCategory('active')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                          filterCategory === 'active' 
                            ? 'bg-emerald-600 text-white border-emerald-600' 
                            : isDarkTheme ? 'bg-zinc-900 border-zinc-800 text-emerald-400 hover:text-white' : 'bg-white border-zinc-200 text-emerald-700'
                        }`}
                      >
                        Aktif ({activeVoicesCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setFilterCategory('hidden')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                          filterCategory === 'hidden' 
                            ? 'bg-rose-700 text-white border-rose-700' 
                            : isDarkTheme ? 'bg-zinc-900 border-zinc-800 text-rose-400 hover:text-white' : 'bg-white border-zinc-200 text-rose-700'
                        }`}
                      >
                        Hide ({hiddenVoicesCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => setFilterCategory('Sunda')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                          filterCategory === 'Sunda' 
                            ? 'bg-amber-600 text-white border-amber-600' 
                            : isDarkTheme ? 'bg-zinc-900 border-zinc-800 text-amber-400 hover:text-white' : 'bg-white border-zinc-200 text-amber-700'
                        }`}
                      >
                        Sunda
                      </button>
                      <button
                        type="button"
                        onClick={() => setFilterCategory('Nasional')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                          filterCategory === 'Nasional' 
                            ? (isDarkTheme ? 'bg-[#CCFF00] text-black border-[#CCFF00]' : 'bg-[#0C4E34] text-white border-[#0C4E34]') 
                            : isDarkTheme ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white' : 'bg-white border-zinc-200 text-zinc-700'
                        }`}
                      >
                        Nasional
                      </button>
                    </div>

                    {/* Action: Add Persona & Factory Reset */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingNew(!isAddingNew)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F59E0B] hover:bg-[#d97706] text-black flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Karakter</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleResetAllToFactory}
                        className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
                          isDarkTheme ? 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                        }`}
                        title="Reset Seluruh Suara ke Standar Pabrik"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* FORM TAMBAH KARAKTER BARU */}
                  {isAddingNew && (
                    <div className={`p-5 rounded-3xl border space-y-4 animate-in fade-in duration-200 ${
                      isDarkTheme ? 'bg-[#091510] border-amber-500/40' : 'bg-amber-50/60 border-amber-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                          <Plus className="w-4 h-4" />
                          <span>Buat Karakter Persona Vokal Baru</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsAddingNew(false)}
                          className="text-zinc-400 hover:text-white text-xs"
                        >
                          ✕ Batal
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold block uppercase">Nama Karakter Baru:</label>
                          <input
                            type="text"
                            placeholder="Contoh: Kang Dedi / Bu Sekda"
                            value={newVoiceForm.name}
                            onChange={(e) => setNewVoiceForm({ ...newVoiceForm, name: e.target.value })}
                            className={`w-full p-2.5 rounded-xl text-xs outline-none ${inputStyle}`}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold block uppercase">Base Model Neural TTS:</label>
                          <select
                            value={newVoiceForm.id}
                            onChange={(e) => {
                              const base = GEMINI_BASE_VOICES.find(b => b.id === e.target.value);
                              setNewVoiceForm({
                                ...newVoiceForm,
                                id: e.target.value,
                                gender: base ? base.gender : newVoiceForm.gender
                              });
                            }}
                            className={`w-full p-2.5 rounded-xl text-xs outline-none ${inputStyle}`}
                          >
                            {GEMINI_BASE_VOICES.map((base) => (
                              <option key={base.id} value={base.id}>
                                {base.name} ({base.gender === 'Male' ? 'Pria' : 'Wanita'} — {base.desc})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold block uppercase">Kategori Blok:</label>
                          <select
                            value={newVoiceForm.category}
                            onChange={(e) => setNewVoiceForm({ ...newVoiceForm, category: e.target.value })}
                            className={`w-full p-2.5 rounded-xl text-xs outline-none ${inputStyle}`}
                          >
                            <option value="Nasional">Blok 1 — NUSA VOICE (Nasional)</option>
                            <option value="Sunda">Blok 2 — PASUNDAN VOICE (Sunda)</option>
                            <option value="Kustom">Karakter Kustom Khusus</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold block uppercase">Deskripsi Ringkas:</label>
                          <input
                            type="text"
                            placeholder="Contoh: Wibawa, Lugas & Bersahabat"
                            value={newVoiceForm.desc}
                            onChange={(e) => setNewVoiceForm({ ...newVoiceForm, desc: e.target.value })}
                            className={`w-full p-2.5 rounded-xl text-xs outline-none ${inputStyle}`}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold block uppercase">Aksen / Gaya Bicara:</label>
                          <input
                            type="text"
                            placeholder="Contoh: Sunda Priangan / Formal"
                            value={newVoiceForm.accent}
                            onChange={(e) => setNewVoiceForm({ ...newVoiceForm, accent: e.target.value })}
                            className={`w-full p-2.5 rounded-xl text-xs outline-none ${inputStyle}`}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold block uppercase">Jenis Vokal:</label>
                          <select
                            value={newVoiceForm.gender}
                            onChange={(e) => setNewVoiceForm({ ...newVoiceForm, gender: e.target.value })}
                            className={`w-full p-2.5 rounded-xl text-xs outline-none ${inputStyle}`}
                          >
                            <option value="Male">Pria (Male)</option>
                            <option value="Female">Wanita (Female)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold block uppercase">Prompt Persona AI (Instruksi Vokal):</label>
                        <input
                          type="text"
                          placeholder="Contoh: Karakter narator berwibawa dengan intonasi jelas dan tempo tenang..."
                          value={newVoiceForm.personaPrompt}
                          onChange={(e) => setNewVoiceForm({ ...newVoiceForm, personaPrompt: e.target.value })}
                          className={`w-full p-2.5 rounded-xl text-xs outline-none ${inputStyle}`}
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingNew(false)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveNewPersona}
                          className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0C4E34] hover:bg-[#0e5c3e] text-white flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Simpan ke Registry Suara</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* MODAL EDIT PROMPT PERSONA KHUSUS */}
                  {promptEditingVoice && (
                    <div className={`p-5 rounded-3xl border space-y-4 animate-in fade-in duration-200 ${
                      isDarkTheme ? 'bg-[#091510] border-amber-500/50' : 'bg-amber-50/70 border-amber-300'
                    }`}>
                      <div className="flex items-center justify-between border-b pb-2.5 border-amber-900/40">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                          <h4 className="text-xs font-black uppercase tracking-wider">
                            Kustomisasi Persona Prompt: <span className="text-amber-400">{promptEditingVoice.name}</span>
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPromptEditingVoice(null)}
                          className="text-xs text-zinc-400 hover:text-white"
                        >
                          ✕ Batal
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold block uppercase">
                          Sistem Instruksi Persona Vokal (AI Voice Actor Guidance):
                        </label>
                        <textarea
                          rows={4}
                          value={promptInputText}
                          onChange={(e) => setPromptInputText(e.target.value)}
                          placeholder="Tuliskan karakter vokal, dialek, nada emosional, atau artikulasi pembacaan yang diinginkan..."
                          className={`w-full p-3 rounded-2xl text-xs font-mono outline-none resize-y leading-relaxed ${inputStyle}`}
                        />
                      </div>

                      {/* Preset Chips */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-zinc-400 block">Pilihan Cepat Gaya Prompt:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { label: 'Sunda Kental Medok', text: 'Logat Sunda sangat kental, medok, intonasi bersahaja penuh cengkok khas Priangan yang akrab dan ramah.' },
                            { label: 'Formal Penyiar Berita', text: 'Gaya pembaca berita nasional resmi, artikulasi presisi, vokal berwibawa, intonasi tenang dan terukur.' },
                            { label: 'Ramah Ceria Sapa Warga', text: 'Gaya bicara ramah, hangat, tersenyum, menyapa wargi dengan penuh semangat kebersamaan.' },
                            { label: 'Sepuh Bijak Tempo Lambat', text: 'Suara kakek sepuh Sunda bijaksana, tempo lambat tenang, penuh petuah dan nasihat mendalam.' },
                            { label: 'Tegas Komando Edukatif', text: 'Intonasi tegas, artikulatif, komando disiplin namun mendidik dan inspiratif.' }
                          ].map((chip, cIdx) => (
                            <button
                              key={cIdx}
                              type="button"
                              onClick={() => setPromptInputText(chip.text)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${subBg} hover:border-amber-400 hover:text-amber-300`}
                            >
                              + {chip.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-amber-900/30">
                        <button
                          type="button"
                          onClick={() => setPromptEditingVoice(null)}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedVoices = voices.map(v => {
                              if (v.name === promptEditingVoice.name) {
                                return { ...v, personaPrompt: promptInputText };
                              }
                              return v;
                            });
                            onUpdateVoices(updatedVoices);
                            try {
                              const savedPrompts = JSON.parse(localStorage.getItem('gentra_custom_voice_prompts') || '{}');
                              savedPrompts[promptEditingVoice.name] = promptInputText;
                              localStorage.setItem('gentra_custom_voice_prompts', JSON.stringify(savedPrompts));
                            } catch (e) {}
                            setPromptEditingVoice(null);
                          }}
                          className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0C4E34] hover:bg-[#0e5c3e] text-white flex items-center gap-1.5 shadow-sm"
                        >
                          <Check className="w-4 h-4 text-[#F59E0B]" />
                          <span>Simpan Prompt Karakter</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* MODAL / EDIT DIALOG JIKA SEDANG EDIT KARAKTER */}
                  {editingVoice && (
                    <div className={`p-5 rounded-3xl border space-y-4 animate-in fade-in duration-200 ${
                      isDarkTheme ? 'bg-[#091510] border-emerald-500/50' : 'bg-emerald-50/70 border-emerald-300'
                    }`}>
                      <div className="flex items-center justify-between border-b pb-2.5 border-emerald-900/40">
                        <div className="flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-[#F59E0B]" />
                          <h4 className="text-xs font-black uppercase tracking-wider">
                            Ganti Nama & Metadata: <span className="text-emerald-400">{editingVoice.name}</span>
                          </h4>
                        </div>
                        <span className={`text-[10px] font-mono ${subText}`}>
                          Base Model: {editingVoice.id}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold block uppercase">Nama Karakter Baru:</label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className={`w-full p-2.5 rounded-xl text-xs font-bold outline-none ${inputStyle}`}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold block uppercase">Deskripsi Suara:</label>
                          <input
                            type="text"
                            value={editForm.desc}
                            onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })}
                            className={`w-full p-2.5 rounded-xl text-xs outline-none ${inputStyle}`}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold block uppercase">Aksen / Logat:</label>
                          <input
                            type="text"
                            value={editForm.accent}
                            onChange={(e) => setEditForm({ ...editForm, accent: e.target.value })}
                            className={`w-full p-2.5 rounded-xl text-xs outline-none ${inputStyle}`}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold block uppercase">Kategori Blok:</label>
                          <select
                            value={editForm.category}
                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                            className={`w-full p-2.5 rounded-xl text-xs outline-none ${inputStyle}`}
                          >
                            <option value="Nasional">Blok 1 — NUSA VOICE (Nasional)</option>
                            <option value="Sunda">Blok 2 — PASUNDAN VOICE (Sunda)</option>
                            <option value="Kustom">Kustom / Kloning</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold block uppercase">Jenis Vokal:</label>
                          <select
                            value={editForm.gender}
                            onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                            className={`w-full p-2.5 rounded-xl text-xs outline-none ${inputStyle}`}
                          >
                            <option value="Female">Wanita (Female)</option>
                            <option value="Male">Pria (Male)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold block uppercase">Base Model Neural:</label>
                          <select
                            value={editForm.id}
                            onChange={(e) => setEditForm({ ...editForm, id: e.target.value })}
                            className={`w-full p-2.5 rounded-xl text-xs outline-none ${inputStyle}`}
                          >
                            {GEMINI_BASE_VOICES.map((base) => (
                              <option key={base.id} value={base.id}>
                                {base.name} ({base.gender === 'Male' ? 'Pria' : 'Wanita'})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold block uppercase">Persona Prompt (Sistem Instruksi Vokal):</label>
                        <input
                          type="text"
                          value={editForm.personaPrompt}
                          onChange={(e) => setEditForm({ ...editForm, personaPrompt: e.target.value })}
                          placeholder="Karakter vokal khusus..."
                          className={`w-full p-2.5 rounded-xl text-xs outline-none ${inputStyle}`}
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => handleResetSingleVoice(editingVoice)}
                          className="text-xs text-amber-400 hover:underline font-bold flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset ke Pengaturan Awal</span>
                        </button>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingVoice(null)}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveEdit}
                            className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0C4E34] hover:bg-[#0e5c3e] text-white flex items-center gap-1.5"
                          >
                            <Check className="w-4 h-4" />
                            <span>Simpan Perubahan</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DAFTAR REGISTRY SUARA */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold px-1">
                      <span className={subText}>
                        Menampilkan {filteredVoices.length} dari {totalVoices} karakter suara
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleExportRegistry}
                          className={`text-[11px] font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors ${subBg}`}
                          title="Ekspor Registry ke JSON"
                        >
                          <Download className="w-3 h-3" />
                          <span>Ekspor JSON</span>
                        </button>
                        <label className={`text-[11px] font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${subBg}`}>
                          <Upload className="w-3 h-3" />
                          <span>Impor JSON</span>
                          <input type="file" accept=".json" className="hidden" onChange={handleImportRegistry} />
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filteredVoices.map((v, idx) => {
                        const isHidden = Boolean(v.isHidden);
                        const isCustom = Boolean(v.isCustom || v.isCloned);
                        const hasCustomName = v.originalName && v.originalName !== v.name;

                        return (
                          <div
                            key={`${v.id}-${v.name}-${idx}`}
                            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 relative ${
                              isHidden
                                ? isDarkTheme 
                                  ? 'bg-[#0a0f0d]/80 border-dashed border-rose-950 text-zinc-400 opacity-60 hover:opacity-100' 
                                  : 'bg-zinc-100/80 border-dashed border-rose-300 text-zinc-500 opacity-70 hover:opacity-100'
                                : isDarkTheme
                                  ? 'bg-[#121d17] border-emerald-950 hover:border-emerald-700/80 text-zinc-100'
                                  : 'bg-white border-zinc-200 hover:border-[#0C4E34]/50 shadow-xs text-zinc-900'
                            }`}
                          >
                            <div>
                              {/* Top Row: Name, Status Badge & Toggle Hide */}
                              <div className="flex items-start justify-between gap-2 mb-1.5">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className={`text-base font-black tracking-tight truncate ${
                                      isHidden ? 'line-through text-zinc-400' : isDarkTheme ? 'text-white' : 'text-zinc-900'
                                    }`}>
                                      {v.name}
                                    </h4>
                                    
                                    {/* Indicator Tag */}
                                    {isHidden ? (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                                        Tersembunyi (Hide)
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-400/30 shrink-0 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                        Tampil Aktif
                                      </span>
                                    )}

                                    {hasCustomName && (
                                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                        Nama Diubah
                                      </span>
                                    )}
                                  </div>

                                  {/* Subtitle Model Base */}
                                  <p className={`text-[11px] mt-0.5 flex items-center gap-1.5 flex-wrap ${subText}`}>
                                    <span>Base Model: <code className="font-mono text-amber-400 font-bold">{v.id}</code></span>
                                    <span>•</span>
                                    <span className="font-medium">{v.gender === 'Male' ? 'Pria' : 'Wanita'}</span>
                                  </p>
                                </div>

                                {/* Quick Switch Toggle Hide/Unhide */}
                                <button
                                  type="button"
                                  onClick={() => handleToggleHideVoice(v)}
                                  className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border ${
                                    isHidden
                                      ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25'
                                      : isDarkTheme 
                                      ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/60'
                                      : 'bg-emerald-50 border-emerald-200 text-[#0C4E34] hover:bg-emerald-100'
                                  }`}
                                  title={isHidden ? "Klik untuk Tampilkan di Studio (Unhide)" : "Klik untuk Sembunyikan dari Studio (Hide)"}
                                >
                                  {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                  <span className="text-[10px] hidden sm:inline">
                                    {isHidden ? 'Unhide' : 'Hide'}
                                  </span>
                                </button>
                              </div>

                              {/* Description & Accent */}
                              <p className={`text-xs mt-1.5 leading-relaxed line-clamp-2 ${subText}`}>
                                {v.desc || 'Tidak ada deskripsi.'}
                              </p>

                              {v.personaPrompt && (
                                <div className={`mt-2 p-2 rounded-xl text-[10px] font-mono leading-relaxed border line-clamp-2 ${
                                  isDarkTheme ? 'bg-[#09110d] border-emerald-950/80 text-emerald-300/80' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                                }`}>
                                  Prompt: {v.personaPrompt}
                                </div>
                              )}
                            </div>

                            {/* Bottom Actions Row */}
                            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/40 mt-1 text-xs">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                v.category === 'Sunda' 
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                                  : (isDarkTheme ? 'bg-[#CCFF00]/10 text-[#CCFF00] border-[#CCFF00]/20' : 'bg-emerald-50 text-emerald-800 border-emerald-200')
                              }`}>
                                {v.category === 'Sunda' ? 'Pasundan' : 'Nasional'}
                              </span>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedLabVoice(v);
                                    handleTestGenerateLabAudio(v);
                                  }}
                                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors ${
                                    isDarkTheme ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
                                  }`}
                                  title="Uji karakter ini di laboratorium"
                                >
                                  <Play className="w-3 h-3 fill-current text-amber-400" />
                                  <span>Uji di Lab</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setPromptEditingVoice(v);
                                    setPromptInputText(v.personaPrompt || '');
                                  }}
                                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40`}
                                  title="Ganti Persona Prompt Khusus Karakter Ini"
                                >
                                  <Sparkles className="w-3 h-3 text-[#F59E0B]" />
                                  <span>Edit Prompt</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(v)}
                                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors ${
                                    isDarkTheme ? 'bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/40' : 'bg-[#0C4E34]/10 hover:bg-[#0C4E34]/20 text-[#0C4E34]'
                                  }`}
                                  title="Ganti nama karakter asli dan atribut"
                                >
                                  <Edit3 className="w-3 h-3 text-[#F59E0B]" />
                                  <span>Ganti Nama</span>
                                </button>

                                {isCustom && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCustomVoice(v)}
                                    className="p-1 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                                    title="Hapus karakter kustom ini"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}



              {/* TAB 3: POOL KUNCI API (FAIL-SAFE 8 SLOT) */}
              {activeTab === 'api' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Alert Sukses Simpan ke iPad */}
                  {poolSaveSuccess && (
                    <div className="p-3.5 rounded-2xl bg-[#CCFF00]/15 border border-[#CCFF00]/40 text-[#CCFF00] text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
                      <CheckCircle className="w-5 h-5 shrink-0" />
                      <span>Pool Kunci API Berhasil Disimpan Permanen ke iPad (LocalStorage + Cookie 365 Hari)!</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-zinc-800/40">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                        <Key className="w-4 h-4 text-[#F59E0B]" />
                        Pool Fail-Safe Multi-Slot API Engine
                      </h3>
                      <p className={`text-xs mt-0.5 ${subText}`}>
                        Sistem fail-safe multi-slot otomatis berganti ke slot cadangan jika kuota limit tercapai saat produksi audio.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const sanitized = geminiKeys.map(k => sanitizeApiKey(k));
                          try {
                            safeSetItem('gentra_gemini_keys_pool', JSON.stringify(sanitized));
                            if (sanitized[0]) safeSetItem('gentra_gemini_key', sanitized[0]);
                            if (sanitized[1]) safeSetItem('gentra_gemini_backup_key', sanitized[1]);
                          } catch (e) {}
                          setPoolSaveSuccess(true);
                          setTimeout(() => setPoolSaveSuccess(false), 4000);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#CCFF00] hover:bg-[#b8e600] text-black transition-all shadow-sm shrink-0"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Simpan Semua Kunci</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleTestAllKeys}
                        disabled={isTestingAll || activeKeyPool.length === 0}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0C4E34] hover:bg-[#0e5c3e] text-white transition-all disabled:opacity-40 shadow-sm shrink-0"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isTestingAll ? 'animate-spin' : ''}`} />
                        <span>{isTestingAll ? 'Menguji Semua Slot...' : 'Tes Semua Kuota'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {geminiKeys.map((keyVal, idx) => {
                      const isPrimary = idx === 0;
                      const isFilled = Boolean(keyVal && keyVal.trim());
                      const isVisible = keyVisibility[idx];

                      return (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-2xl border transition-all ${
                            isFilled
                              ? isDarkTheme ? 'bg-[#0d1813] border-emerald-900/80' : 'bg-emerald-50/50 border-emerald-200'
                              : isDarkTheme ? 'bg-[#09110d] border-zinc-800/80' : 'bg-zinc-50 border-zinc-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-bold flex items-center gap-1.5 ${
                              isPrimary ? 'text-amber-400' : isDarkTheme ? 'text-zinc-300' : 'text-zinc-700'
                            }`}>
                              <Key className="w-3.5 h-3.5 text-[#F59E0B]" />
                              {isPrimary ? 'Slot 1: Kunci Utama (Primary)' : `Slot ${idx + 1}: Kunci Cadangan ${idx}`}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isFilled 
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30' 
                                : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                            }`}>
                              {isFilled ? '● Siaga' : '○ Kosong'}
                            </span>
                          </div>

                          <div className="relative flex items-center">
                            <input
                              type="password"
                              placeholder={isPrimary ? "AIzaSy... (Kunci Utama)" : `AIzaSy... (Cadangan ${idx})`}
                              value={keyVal}
                              onChange={(e) => handleUpdateGeminiKey(idx, e.target.value)}
                              onBlur={() => {
                                const clean = sanitizeApiKey(keyVal);
                                handleUpdateGeminiKey(idx, clean);
                              }}
                              autoCapitalize="none"
                              autoCorrect="off"
                              spellCheck={false}
                              autoComplete="off"
                              inputMode="text"
                              className={`w-full py-2.5 pl-3 pr-9 rounded-xl text-xs font-mono outline-none transition-colors ${inputStyle}`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setKeyVisibility(prev => {
                                  const next = [...prev];
                                  next[idx] = !next[idx];
                                  return next;
                                });
                              }}
                              className="absolute right-2.5 p-1 text-zinc-400 hover:text-white"
                              title={isVisible ? "Tutup Info Masking" : "Lihat Info Masking & Salin"}
                            >
                              {isVisible ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>

                          {/* Masked Preview Pill (No plaintext raw key exposure) */}
                          {isVisible && keyVal && (
                            <div className="flex items-center justify-between mt-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-mono">
                              <span className="truncate">{formatMaskedKey(keyVal)}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyKey(keyVal, idx)}
                                className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/30 flex items-center gap-1 shrink-0"
                              >
                                {copiedPoolKeyIndex === idx ? (
                                  <>
                                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                                    <span className="text-emerald-300">Tersalin!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-2.5 h-2.5" />
                                    <span>Salin</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}

                          {/* Quota tester status & Action Buttons */}
                          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-zinc-800/30">
                            <div className="text-[10px] font-medium min-h-[18px]">
                              {keyTestStatuses[idx] ? (
                                <span className={
                                  keyTestStatuses[idx].status === 'active' ? 'text-emerald-400 font-bold' :
                                  keyTestStatuses[idx].status === 'quota_limit' ? 'text-rose-400 font-bold' :
                                  keyTestStatuses[idx].status === 'testing' ? 'text-amber-400 font-bold animate-pulse' :
                                  'text-zinc-400 font-medium'
                                }>
                                  {keyTestStatuses[idx].message}
                                </span>
                              ) : (
                                <span className="text-zinc-500">Status: Belum diuji</span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  const clean = sanitizeApiKey(keyVal);
                                  handleUpdateGeminiKey(idx, clean);
                                  setPoolSaveSuccess(true);
                                  setTimeout(() => setPoolSaveSuccess(false), 3000);
                                }}
                                disabled={!isFilled}
                                className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 hover:bg-emerald-900 transition-colors flex items-center gap-1 disabled:opacity-40"
                                title="Simpan slot ini ke memori permanen iPad"
                              >
                                <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                                <span>Simpan</span>
                              </button>

                              {isFilled && (
                                <button
                                  type="button"
                                  onClick={() => handleTestKey(idx)}
                                  disabled={keyTestStatuses[idx]?.status === 'testing'}
                                  className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors flex items-center gap-1 disabled:opacity-50"
                                >
                                  <Activity className="w-3 h-3 text-emerald-400" />
                                  <span>{keyTestStatuses[idx]?.status === 'testing' ? 'Mengecek...' : 'Tes Slot'}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: BENCHMARK & ARENA LATENSI */}
              {activeTab === 'benchmark' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#F59E0B]" />
                      Arena Benchmark Latensi & Kecepatan Suara
                    </h3>
                    <p className={`text-xs mt-0.5 ${subText}`}>
                      Bandingkan respons waktu pembuatan audio antar model vokal Neural TTS secara berurutan.
                    </p>
                  </div>

                  <div className={`p-4 rounded-2xl border space-y-3 ${subBg}`}>
                    <label className="text-xs font-bold uppercase block">Teks Uji Komparasi:</label>
                    <input
                      type="text"
                      value={benchmarkPrompt}
                      onChange={(e) => setBenchmarkPrompt(e.target.value)}
                      className={`w-full p-3 rounded-xl text-xs outline-none ${inputStyle}`}
                    />
                    <button
                      type="button"
                      disabled={isBenchmarking || activeKeyPool.length === 0}
                      onClick={async () => {
                        setIsBenchmarking(true);
                        setBenchmarkResults([]);
                        const key = activeKeyPool[0];
                        const testList = voices.filter(v => !v.isHidden).slice(0, 5);
                        const results = [];

                        for (const targetV of testList) {
                          const t0 = performance.now();
                          let success = false;
                          let url = null;
                          const modelsToTry = [TTS_MODEL, ...LAB_TTS_MODELS.filter(m => m !== TTS_MODEL)];

                          for (const mName of modelsToTry) {
                            try {
                              const res = await fetch(
                                `https://generativelanguage.googleapis.com/v1beta/models/${mName}:generateContent?key=${key}`,
                                {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    contents: [{ parts: [{ text: benchmarkPrompt }] }],
                                    generationConfig: {
                                      responseModalities: ['AUDIO'],
                                      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: targetV.id } } }
                                    }
                                  })
                                }
                              );
                              if (res.ok) {
                                const d = await res.json();
                                const raw = d?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
                                if (raw) {
                                  url = URL.createObjectURL(buildWavBlobFromPCM(base64ToPCM16(raw), 24000));
                                  success = true;
                                  break;
                                }
                              }
                            } catch (e) {}
                          }

                          const t1 = performance.now();
                          const duration = Math.round(t1 - t0);
                          results.push({ name: targetV.name, base: targetV.id, duration, success, url });
                          setBenchmarkResults([...results]);
                        }
                        setIsBenchmarking(false);
                      }}
                      className="px-4 py-2.5 bg-[#0C4E34] hover:bg-[#0e5c3e] text-white font-bold text-xs rounded-xl flex items-center gap-2 disabled:opacity-50"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>{isBenchmarking ? 'Menjalankan Arena Benchmark...' : 'Mulai Benchmark (Top 5 Suara Aktif)'}</span>
                    </button>
                  </div>

                  {benchmarkResults.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider">Hasil Latensi Sintesis:</h4>
                      <div className="space-y-2">
                        {benchmarkResults.map((b, i) => (
                          <div key={i} className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${subBg}`}>
                            <div>
                              <span className="font-bold text-xs">{b.name}</span>
                              <span className="text-[10px] text-zinc-400 ml-2">Base: {b.base}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-xs font-mono font-bold ${b.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {b.success ? `${b.duration} ms` : 'Gagal'}
                              </span>
                              {b.url && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const a = new Audio(b.url);
                                    a.play();
                                  }}
                                  className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                                >
                                  <Play className="w-3 h-3 fill-current" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: KEAMANAN & AKSES MASTER ADMIN */}
              {activeTab === 'security' && (
                <div className="space-y-6 animate-in fade-in duration-150 max-w-lg">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#F59E0B]" />
                      Keamanan & Akses Master Admin
                    </h3>
                    <p className={`text-xs mt-0.5 ${subText}`}>
                      Ganti kata sandi master admin untuk mengamankan laboratorium pengembangan suara.
                    </p>
                  </div>

                  <div className={`p-5 rounded-2xl border space-y-3 ${
                    isDarkTheme ? 'bg-amber-950/20 border-amber-900/60' : 'bg-amber-50/60 border-amber-200'
                  }`}>
                    <label className="text-xs font-bold uppercase block">Kata Sandi Master Admin Baru:</label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        placeholder="Minimal 4 karakter..."
                        value={newMasterKeyInput}
                        onChange={(e) => setNewMasterKeyInput(e.target.value)}
                        className={`flex-1 p-2.5 rounded-xl text-xs outline-none ${inputStyle}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newMasterKeyInput.trim() || newMasterKeyInput.trim().length < 4) {
                            alert('Sandi minimal 4 karakter.');
                            return;
                          }
                          try {
                            localStorage.setItem('gentra_master_key', newMasterKeyInput.trim());
                            setMasterKeySuccess('Kata sandi berhasil diperbarui!');
                            setNewMasterKeyInput('');
                            setTimeout(() => setMasterKeySuccess(''), 3000);
                          } catch (e) {}
                        }}
                        className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-sm shrink-0"
                      >
                        Perbarui Sandi
                      </button>
                    </div>
                    {masterKeySuccess && (
                      <p className="text-xs font-bold text-emerald-400">{masterKeySuccess}</p>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* MODAL FOOTER */}
            <div className={`p-4 sm:p-5 border-t flex items-center justify-between gap-3 ${isDarkTheme ? 'border-emerald-950 bg-[#09110d]' : 'border-zinc-200 bg-white'}`}>
              <div className={`text-[11px] font-mono ${subText}`}>
                {activeVoicesCount} Karakter Suara Aktif
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#0C4E34] hover:bg-[#0e5c3e] text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                >
                  Selesai & Tutup Laboratorium
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default VoiceLabModal;
