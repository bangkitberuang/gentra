import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Play, 
  Download, 
  History, 
  Volume2, 
  Volume1,
  Trash2, 
  Loader2, 
  Sparkles, 
  CheckCircle, 
  Menu, 
  X, 
  User, 
  Zap, 
  Smile, 
  Settings2, 
  Angry, 
  Frown, 
  Megaphone, 
  Type, 
  Key, 
  Copy, 
  Upload, 
  Edit3, 
  PlusCircle, 
  Square, 
  Check, 
  Plus, 
  FileAudio,
  Lock,
  Unlock,
  Shield,
  Moon,
  Sun,
  Sliders,
  Radio,
  Headphones,
  Cpu,
  VolumeX,
  Server,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  RefreshCw,
  Activity,
  FlaskConical,
  Coins,
  RotateCcw,
  Users
} from 'lucide-react';
import { VoiceLabModal } from './VoiceLabModal.jsx';
import { ApiKeyModal } from './ApiKeyModal.jsx';
import { UserManagementModal } from './UserManagementModal.jsx';
import { safeGetItem, safeSetItem, sanitizeApiKey } from '../utils/safeStorage.js';
import { getUnifiedVoices, saveUnifiedVoices, GENTRA_VOICES_EVENT } from '../utils/voiceRegistry.js';
import { logAccountActivity } from '../utils/userManagement.js';

// Model configuration for Gemini TTS and text generation
const TTS_MODELS = ["gemini-2.5-flash-preview-tts", "gemini-2.0-flash"];
const TTS_MODEL = "gemini-2.5-flash-preview-tts";
const TTS_FALLBACK_MODEL = "gemini-2.0-flash";
const TEXT_MODELS = ["gemini-2.0-flash", "gemini-1.5-flash"];
const TEXT_MODEL = "gemini-2.0-flash";
const TEXT_FALLBACK_MODEL = "gemini-1.5-flash";

// Default personas (14 national + 8 Sundanese voices)
const INITIAL_VOICES = [
  // 14 national voices
  { id: 'Aoede', name: 'Anita', desc: 'Ramah & Ceria (Wanita)', gender: 'Female', category: 'Nasional', originalName: 'Anita', backendVoiceId: 'Aoede', geminiVoiceId: 'Aoede', accent: 'Nasional (Ramah)', isCustom: false },
  { id: 'Leda', name: 'Siti', desc: 'Lembut & Sopan (Wanita)', gender: 'Female', category: 'Nasional', originalName: 'Siti', backendVoiceId: 'Leda', geminiVoiceId: 'Leda', accent: 'Nasional (Lembut)', isCustom: false },
  { id: 'Charon', name: 'Mugi', desc: 'Deep & Naratif (Pria)', gender: 'Male', category: 'Nasional', originalName: 'Agus', backendVoiceId: 'Charon', geminiVoiceId: 'Charon', accent: 'Nasional (Naratif)', isCustom: false },
  { id: 'Despina', name: 'Dewi', desc: 'Energik & Lugas (Wanita)', gender: 'Female', category: 'Nasional', originalName: 'Dewi', backendVoiceId: 'Despina', geminiVoiceId: 'Despina', accent: 'Nasional (Energik)', isCustom: false },
  { id: 'Callirrhoe', name: 'Tina', desc: 'Profesional & Jelas (Wanita)', gender: 'Female', category: 'Nasional', originalName: 'Tina', backendVoiceId: 'Callirrhoe', geminiVoiceId: 'Callirrhoe', accent: 'Nasional (Formal)', isCustom: false },
  { id: 'Autonoe', name: 'Maya', desc: 'Inspiratif & Hangat (Wanita)', gender: 'Female', category: 'Nasional', originalName: 'Maya', backendVoiceId: 'Autonoe', geminiVoiceId: 'Autonoe', accent: 'Nasional (Inspiratif)', isCustom: false },
  { id: 'Puck', name: 'Rian', desc: 'Muda & Bersemangat (Pria)', gender: 'Male', category: 'Nasional', originalName: 'Rian', backendVoiceId: 'Puck', geminiVoiceId: 'Puck', accent: 'Nasional (Muda)', isCustom: false },
  { id: 'Erinome', name: 'Indah', desc: 'Halus & Menenangkan (Wanita)', gender: 'Female', category: 'Nasional', originalName: 'Indah', backendVoiceId: 'Erinome', geminiVoiceId: 'Erinome', accent: 'Nasional (Menenangkan)', isCustom: false },
  { id: 'Fenrir', name: 'Gading', desc: 'Berat & Maskulin (Pria)', gender: 'Male', category: 'Nasional', originalName: 'Gading', backendVoiceId: 'Fenrir', geminiVoiceId: 'Fenrir', accent: 'Nasional (Berat)', isCustom: false },
  { id: 'Laomedeia', name: 'Shinta', desc: 'Tegas & Berani (Wanita)', gender: 'Female', category: 'Nasional', originalName: 'Shinta', backendVoiceId: 'Laomedeia', geminiVoiceId: 'Laomedeia', accent: 'Nasional (Tegas)', isCustom: false },
  { id: 'Orus', name: 'Bayu', desc: 'Santai & Sejuk (Pria)', gender: 'Male', category: 'Nasional', originalName: 'Bayu', backendVoiceId: 'Orus', geminiVoiceId: 'Orus', accent: 'Nasional (Santai)', isCustom: false },
  { id: 'Algenib', name: 'Adi', desc: 'Ceria & Bersemangat (Pria)', gender: 'Male', category: 'Nasional', originalName: 'Adi', backendVoiceId: 'Algenib', geminiVoiceId: 'Algenib', accent: 'Nasional (Ceria)', isCustom: false },
  { id: 'Iapetus', name: 'Eko', desc: 'Serius & Edukatif (Pria)', gender: 'Male', category: 'Nasional', originalName: 'Eko', backendVoiceId: 'Iapetus', geminiVoiceId: 'Iapetus', accent: 'Nasional (Edukatif)', isCustom: false },
  { id: 'Achernar', name: 'Laras', desc: 'Anggun & Elegan (Wanita)', gender: 'Female', category: 'Nasional', originalName: 'Laras', backendVoiceId: 'Achernar', geminiVoiceId: 'Achernar', accent: 'Nasional (Elegan)', isCustom: false },

  // 8 Sundanese voices
  { 
    id: 'Fenrir', 
    name: 'Abah', 
    desc: 'Kakek / Sesepuh Sunda (Wibawa, Bijak & Parau Hangat)', 
    gender: 'Male', 
    category: 'Sunda', 
    originalName: 'Abah',
    backendVoiceId: 'Fenrir',
    geminiVoiceId: 'Fenrir',
    accent: 'Sepuh Sunda (Bijaksana & Tenang)',
    personaPrompt: 'Karakter Abah (kakek/sesepuh Sunda yang bijaksana, suara berat berwibawa, tempo tenang bersahaja, vokal hangat khas kakek Priangan).',
    isCustom: false 
  },
  { 
    id: 'Erinome', 
    name: 'Nini', 
    desc: 'Nenek Sunda (Penuh Kasih Sayang, Lembut & Keibuan)', 
    gender: 'Female', 
    category: 'Sunda', 
    originalName: 'Nini',
    backendVoiceId: 'Erinome',
    geminiVoiceId: 'Erinome',
    accent: 'Nini Sunda (Halus & Welas Asih)',
    personaPrompt: 'Karakter Nini (nenek Sunda yang penuh welas asih, suara lembut penuh kehangatan nenek sepuh, tutur kata mengayomi dan damai).',
    isCustom: false 
  },
  { 
    id: 'Puck', 
    name: 'Ujang', 
    desc: 'Pemuda Sunda (Ceria, Lincah & Gaul Nyunda)', 
    gender: 'Male', 
    category: 'Sunda', 
    originalName: 'Ujang',
    backendVoiceId: 'Puck',
    geminiVoiceId: 'Puck',
    accent: 'Bujang Sunda (Lincah & Enerjik)',
    personaPrompt: 'Karakter Ujang (pemuda Sunda yang lincah, bersahabat, ceria, vokal segar dan penuh semangat khas anak muda tanah Pasundan).',
    isCustom: false 
  },
  { 
    id: 'Despina', 
    name: 'Bibi (Ceu Edah)', 
    desc: 'Ibu / Tante Sunda (Heboh, Ramah & Medok Sunda)', 
    gender: 'Female', 
    category: 'Sunda', 
    originalName: 'Bibi (Ceu Edah)',
    backendVoiceId: 'Despina',
    geminiVoiceId: 'Despina',
    accent: 'Medok Sunda (Heboh & Guyub)',
    personaPrompt: 'Karakter Ceu Edah / Bibi (ibu-ibu/tante Sunda yang ekspresif, ceria heboh, akrab guyub, intonasi medok renyah khas ceu-ceu Sunda).',
    isCustom: false 
  },
  { 
    id: 'Aoede', 
    name: 'Neng Geulis', 
    desc: 'Remaja Putri Sunda (Ceria, Santun & Lugas)', 
    gender: 'Female', 
    category: 'Sunda', 
    originalName: 'Budak Leutik (Eneng)',
    backendVoiceId: 'Aoede',
    geminiVoiceId: 'Aoede',
    accent: 'Mojang Remaja (Ceria & Santun)',
    personaPrompt: 'Karakter Neng Geulis (mojang remaja putri Sunda yang ceria, santun, lugas, gaya bicara remaja alami yang komunikatif).',
    isCustom: false 
  },
  { 
    id: 'Puck', 
    name: 'Ujang Anom', 
    desc: 'Remaja Putra Sunda (Energik, Santai & Ramah)', 
    gender: 'Male', 
    category: 'Sunda', 
    originalName: 'Budak Leutik (Ujang Alit)',
    backendVoiceId: 'Puck',
    geminiVoiceId: 'Puck',
    accent: 'Pemuda Pasundan (Energik & Ramah)',
    personaPrompt: 'Karakter Ujang Anom (pemuda remaja putra Sunda yang aktif, energik, santai, gaya bicara pemuda yang ramah dan bersemangat).',
    isCustom: false 
  },
  { 
    id: 'Leda', 
    name: 'Teh Neng', 
    desc: 'Gadis / Mojang Sunda (Lembut, Santun & Merdu)', 
    gender: 'Female', 
    category: 'Sunda', 
    originalName: 'Teh Neng',
    backendVoiceId: 'Leda',
    geminiVoiceId: 'Leda',
    accent: 'Mojang Sunda (Halus & Santun)',
    personaPrompt: 'Karakter Teh Neng (gadis/mojang Sunda dengan intonasi halus santun, tutur kata ramah, lembut dan merdu berayun).',
    isCustom: false 
  },
  { 
    id: 'Orus', 
    name: 'Kang Asep', 
    desc: 'Pria Dewasa Sunda (Santai, Bersahabat & Luwes)', 
    gender: 'Male', 
    category: 'Sunda', 
    originalName: 'Kang Asep',
    backendVoiceId: 'Orus',
    geminiVoiceId: 'Orus',
    accent: 'Akang Sunda (Santai & Sahaja)',
    personaPrompt: 'Karakter Kang Asep (pria dewasa Sunda yang bersahabat, luwes, santai, gaya bicara akrab dan hangat).',
    isCustom: false
  }
];


// --- Karakter Suara Khusus Microsoft Azure Neural ---
const AZURE_VOICES = [
  { id: 'id-ID-GadisNeural', name: 'Gadis (id-ID)', desc: 'Standar Siaran Berita & Protokoler Resmi (Wanita)', gender: 'Female', category: 'Azure', accent: 'Indonesia Resmi', isCustom: false },
  { id: 'id-ID-ArdiNeural', name: 'Ardi (id-ID)', desc: 'Otoritatif Kedinasan, Tegas & Berwibawa (Pria)', gender: 'Male', category: 'Azure', accent: 'Indonesia Resmi', isCustom: false }
];

// --- Karakter Suara Khusus Google Cloud Neural2 ---
const GOOGLE_CLOUD_VOICES = [
  { id: 'id-ID-Neural2-A', name: 'Neural2-A', desc: 'Artikulasi Jernih & Santun Edukasi (Wanita)', gender: 'Female', category: 'Google Cloud', accent: 'Indonesia Nasional', isCustom: false },
  { id: 'id-ID-Neural2-B', name: 'Neural2-B', desc: 'Netral & Stabil Panduan Layanan (Pria)', gender: 'Male', category: 'Google Cloud', accent: 'Indonesia Nasional', isCustom: false },
  { id: 'id-ID-Wavenet-A', name: 'Wavenet-A', desc: 'Sintesis Wavenet Jernih & Halus (Wanita)', gender: 'Female', category: 'Google Cloud', accent: 'Indonesia Nasional', isCustom: false },
  { id: 'id-ID-Wavenet-B', name: 'Wavenet-B', desc: 'Sintesis Wavenet Pria Bernada Hangat (Pria)', gender: 'Male', category: 'Google Cloud', accent: 'Indonesia Nasional', isCustom: false }
];

// --- Karakter Suara Khusus Voicebox Local Workstation ---
const VOICEBOX_VOICES = [
  { id: 'kokoro_female', name: 'Kokoro Wanita (Offline)', desc: 'Model 82M Lokal On-Premise', gender: 'Female', category: 'Voicebox Local', accent: 'Lokal Mandiri', isCustom: false },
  { id: 'kokoro_male', name: 'Kokoro Pria (Offline)', desc: 'Model 82M Vokal Pria Lokal', gender: 'Male', category: 'Voicebox Local', accent: 'Lokal Mandiri', isCustom: false }
];

// --- Peta File Audio Preview Terkonfirmasi (Pure Gemini Neural Pre-rendered - 0 Token) ---
export const STATIC_AUDIO_PREVIEWS = {
  // 8 Persona Khas Sunda (Blok 2)
  'Abah': '/audio/previews/abah.wav',
  'Nini': '/audio/previews/nini.wav',
  'Ujang': '/audio/previews/ujang.wav',
  'Bibi (Ceu Edah)': '/audio/previews/bibi.wav',
  'Neng Geulis': '/audio/previews/remaja_neng.wav',
  'Ujang Anom': '/audio/previews/remaja_ujang.wav',
  'Budak Leutik (Eneng)': '/audio/previews/remaja_neng.wav',
  'Budak Leutik Eneng': '/audio/previews/remaja_neng.wav',
  'Budak Leutik (Ujang Alit)': '/audio/previews/remaja_ujang.wav',
  'Budak Leutik Ujang Alit': '/audio/previews/remaja_ujang.wav',
  'Teh Neng': '/audio/previews/teh_neng.wav',
  'Kang Asep': '/audio/previews/kang_asep.wav',

  // 14 Persona Nasional (Blok 1 - NUSA VOICE)
  'Anita': '/audio/previews/anita.wav',
  'Siti': '/audio/previews/siti.wav',
  'Mugi': '/audio/previews/mugi.wav',
  'Agus': '/audio/previews/mugi.wav',
  'Dewi': '/audio/previews/dewi.wav',
  'Tina': '/audio/previews/tina.wav',
  'Maya': '/audio/previews/maya.wav',
  'Rian': '/audio/previews/rian.wav',
  'Indah': '/audio/previews/indah.wav',
  'Gading': '/audio/previews/gading.wav',
  'Shinta': '/audio/previews/shinta.wav',
  'Bayu': '/audio/previews/bayu.wav',
  'Adi': '/audio/previews/adi.wav',
  'Eko': '/audio/previews/eko.wav',
  'Laras': '/audio/previews/laras.wav'
};

// Helper: Cek apakah karakter memiliki sampel audio preview
export const checkVoiceHasPreview = (voice, cache = {}) => {
  if (!voice) return false;
  if (voice.isCloned) return true; // Suara kloningan pengguna selalu memiliki sampel rekaman
  if (STATIC_AUDIO_PREVIEWS[voice.name]) return true;
  if (cache && cache[voice.name]) return true;
  return true; // Semua karakter bawaan didukung
};

// Persona instruction builder for Gemini Audio synthesis
export const getVoicePersonaInstruction = (voice) => {
  if (!voice) {
    return {
      role: 'pembaca naskah profesional',
      timbre: 'vokal ramah dan jernih',
      dialect: 'Gunakan intonasi Bahasa Indonesia yang alami'
    };
  }

  if (voice.category === 'Sunda') {
    if (voice.name.includes('Eneng') || voice.name.includes('Neng Geulis') || voice.name.includes('Budak Leutik (Eneng)')) {
      return {
        role: 'mojang remaja putri Sunda berusia 16-17 tahun bernama Neng Geulis',
        timbre: 'vokal mojang remaja putri yang ceria, santun, lugas, artikulatif dan komunikatif',
        dialect: 'Gunakan cengkok, dialek, dan intonasi mojang remaja khas Sunda Jawa Barat yang manis dan alami'
      };
    }
    if (voice.name.includes('Ujang Anom') || voice.name.includes('Ujang Alit') || voice.name.includes('Budak Leutik (Ujang Alit)')) {
      return {
        role: 'pemuda remaja putra Sunda berusia 17 tahun bernama Ujang Anom',
        timbre: 'vokal pemuda remaja laki-laki yang energik, santai, aktif, ramah dan bersemangat',
        dialect: 'Gunakan cengkok, dialek, dan intonasi pemuda khas Sunda Jawa Barat yang riang dan bersahaja'
      };
    }
    if (voice.name.includes('Abah')) {
      return {
        role: 'kakek / sesepuh Sunda yang bijaksana bernama Abah',
        timbre: 'vokal kakek sepuh yang berat berwibawa, tempo tenang bersahaja, parau hangat penuh kearifan khas sesepuh Priangan',
        dialect: 'Gunakan cengkok, dialek, dan intonasi khas sesepuh Sunda Jawa Barat yang sangat tenang, teduh, dan berwibawa'
      };
    }
    if (voice.name.includes('Nini')) {
      return {
        role: 'nenek Sunda sepuh yang penuh welas asih bernama Nini',
        timbre: 'vokal nenek sepuh yang lembut menenangkan, penuh kasih sayang, keibuan dan teduh',
        dialect: 'Gunakan cengkok dan intonasi khas nenek Sunda Jawa Barat yang lembut, penuh kasih sayang dan mengayomi'
      };
    }
    if (voice.name.includes('Ceu Edah') || voice.name.includes('Bibi')) {
      return {
        role: 'ibu-ibu / ceu-ceu Sunda yang heboh, guyub dan akrab bernama Ceu Edah (Bibi)',
        timbre: 'vokal ibu-ibu Sunda yang ekspresif, medok renyah, ceria, renyah dan bersahabat',
        dialect: 'Gunakan cengkok dan intonasi medok khas ceu-ceu Sunda Jawa Barat yang guyub dan heboh bersahabat'
      };
    }
    if (voice.name.includes('Kang Asep')) {
      return {
        role: 'pria dewasa Sunda yang bersahabat dan komunikatif bernama Kang Asep',
        timbre: 'vokal pria dewasa Sunda yang santai, luwes, bersahabat, hangat dan komunikatif',
        dialect: 'Gunakan cengkok dan intonasi khas pria Sunda Parahyangan yang luwes dan ramah'
      };
    }
    if (voice.name.includes('Teh Neng')) {
      return {
        role: 'gadis / mojang Priangan bernama Teh Neng',
        timbre: 'vokal mojang Priangan yang bertutur kata halus, santun, berayun lembut, merdu dan anggun',
        dialect: 'Gunakan cengkok dan intonasi khas Mojang Sunda Priangan yang santun, halus, dan berayun merdu'
      };
    }
    if (voice.name.includes('Ujang')) {
      return {
        role: 'pemuda Sunda yang lincah dan bersemangat bernama Ujang',
        timbre: 'vokal pemuda Sunda yang segar, ceria, gaul nyunda dan penuh energi positif',
        dialect: 'Gunakan cengkok dan intonasi khas pemuda Sunda Jawa Barat yang lincah dan bersemangat'
      };
    }
    return {
      role: `karakter Sunda ${voice.name}`,
      timbre: voice.desc || 'vokal khas Pasundan',
      dialect: 'Gunakan cengkok dan intonasi khas Sunda Jawa Barat yang luwes dan alami'
    };
  }

  // Default / Nasional
  return {
    role: `pengisi suara ${voice.gender === 'Male' ? 'Pria' : 'Wanita'} Indonesia bernama ${voice.name}`,
    timbre: voice.desc || 'vokal penyiaran profesional',
    dialect: `Gunakan intonasi Bahasa Indonesia yang ${voice.accent || 'artikulatif'}, jernih, dan natural`
  };
};

const EMOTIONS = [
  { id: 'Netral', label: 'Netral', icon: <Smile className="w-4 h-4" /> },
  { id: 'Ramah', label: 'Ramah', icon: <Smile className="w-4 h-4" /> },
  { id: 'Semangat', label: 'Semangat', icon: <Zap className="w-4 h-4" /> },
  { id: 'Tenang', label: 'Tenang', icon: <Volume2 className="w-4 h-4" /> },
  { id: 'Storytelling', label: 'Storytelling', icon: <Mic className="w-4 h-4" /> },
  { id: 'Profesional', label: 'Profesional', icon: <User className="w-4 h-4" /> },
  { id: 'Marah', label: 'Marah', icon: <Angry className="w-4 h-4" /> },
  { id: 'Sedih', label: 'Sedih', icon: <Frown className="w-4 h-4" /> },
  { id: 'Bisik', label: 'Bisikan', icon: <Volume1 className="w-4 h-4" /> },
];

const ILM_TONES = [
  { id: 'Formal', label: 'Resmi & Kedinasan' },
  { id: 'Edukasi', label: 'Edukasi & Informatif' },
  { id: 'Persuasif', label: 'Ajakan / Gotong Royong' },
  { id: 'Peringatan', label: 'Peringatan / Disiplin' },
  { id: 'Menyentuh', label: 'Menyentuh & Kekeluargaan' },
];

// Tag Emosi Paralinguistik Suara Alami (Standar Voicebox - 100% Bahasa Indonesia)
const PARALINGUISTIC_EMOTION_TAGS = [
  { label: 'Tertawa', tag: '[tertawa]', desc: 'Tertawa renyah & ramah' },
  { label: 'Berbisik', tag: '[berbisik]', desc: 'Intonasi bisikan hangat' },
  { label: 'Jeda 1 Detik', tag: '[jeda 1 detik]', desc: 'Jeda hening bernapas 1 detik' },
  { label: 'Bersemangat', tag: '[bersemangat]', desc: 'Antusias & energi tinggi' },
  { label: 'Hela Napas', tag: '[hela napas]', desc: 'Hela napas lega atau empati' },
  { label: 'Tegas', tag: '[tegas]', desc: 'Artikulasi wibawa penyiaran' },
  { label: 'Tersenyum', tag: '[tersenyum]', desc: 'Nada bicara hangat sambil tersenyum' },
  { label: 'Prihatin', tag: '[prihatin]', desc: 'Nada empati & bela rasa' },
];

// Visual Avatar & Personality Styling Helper
const getVoiceAvatarMeta = (v) => {
  const cleanName = v.name.replace(/[^a-zA-Z\s]/g, '').trim();
  const parts = cleanName.split(/\s+/);
  const initials = parts.length >= 2 
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : cleanName.slice(0, 2).toUpperCase() || 'VO';

  // Sunda characters
  if (v.category === 'Sunda') {
    if (v.name.includes('Abah')) {
      return {
        initials: 'AB',
        gradient: 'from-amber-600 via-amber-700 to-yellow-900',
        badge: 'Sepuh Sunda',
        roleColor: 'bg-amber-100 text-amber-900 border-amber-300',
        genderIcon: 'Pria',
        glow: 'shadow-amber-500/20'
      };
    }
    if (v.name.includes('Nini')) {
      return {
        initials: 'NI',
        gradient: 'from-rose-600 via-amber-700 to-stone-900',
        badge: 'Nini Sunda',
        roleColor: 'bg-rose-100 text-rose-900 border-rose-300',
        genderIcon: 'Wanita',
        glow: 'shadow-rose-500/20'
      };
    }
    if (v.name.includes('Ujang Anom') || v.name.includes('Ujang Alit')) {
      return {
        initials: 'UA',
        gradient: 'from-emerald-500 via-teal-600 to-slate-800',
        badge: 'Remaja Lalaki',
        roleColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        genderIcon: 'Remaja',
        glow: 'shadow-emerald-500/20'
      };
    }
    if (v.name.includes('Neng Geulis') || v.name.includes('Eneng') || v.name.includes('Budak Leutik')) {
      return {
        initials: 'NG',
        gradient: 'from-amber-400 via-rose-500 to-emerald-600',
        badge: 'Mojang Remaja',
        roleColor: 'bg-amber-100 text-amber-900 border-amber-300',
        genderIcon: 'Remaja',
        glow: 'shadow-amber-500/20'
      };
    }
    if (v.name.includes('Ujang')) {
      return {
        initials: 'UJ',
        gradient: 'from-lime-600 via-emerald-600 to-teal-800',
        badge: 'Bujang Nyunda',
        roleColor: 'bg-lime-100 text-lime-900 border-lime-300',
        genderIcon: 'Pria',
        glow: 'shadow-lime-500/20'
      };
    }
    if (v.name.includes('Bibi') || v.name.includes('Edah')) {
      return {
        initials: 'CE',
        gradient: 'from-orange-500 via-pink-600 to-rose-700',
        badge: 'Ceu Heboh',
        roleColor: 'bg-orange-100 text-orange-900 border-orange-300',
        genderIcon: 'Wanita',
        glow: 'shadow-orange-500/20'
      };
    }
    if (v.name.includes('Teh Neng')) {
      return {
        initials: 'TN',
        gradient: 'from-teal-500 via-emerald-600 to-green-700',
        badge: 'Mojang Priangan',
        roleColor: 'bg-teal-100 text-teal-900 border-teal-300',
        genderIcon: 'Wanita',
        glow: 'shadow-teal-500/20'
      };
    }
    if (v.name.includes('Kang Asep')) {
      return {
        initials: 'KA',
        gradient: 'from-yellow-600 via-amber-700 to-stone-800',
        badge: 'Akang Sahaja',
        roleColor: 'bg-amber-100 text-amber-900 border-amber-300',
        genderIcon: 'Pria',
        glow: 'shadow-yellow-500/20'
      };
    }
    return {
      initials,
      gradient: 'from-emerald-600 to-teal-800',
      badge: 'Khas Sunda',
      roleColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      genderIcon: v.gender === 'Female' ? 'Wanita' : 'Pria',
      glow: 'shadow-emerald-500/20'
    };
  }

  // Cloned Voices
  if (v.isCloned) {
    return {
      initials,
      gradient: 'from-amber-500 via-orange-600 to-red-600',
      badge: 'Kloning Suara',
      roleColor: 'bg-amber-100 text-amber-900 border-amber-300',
      genderIcon: v.gender === 'Female' ? 'Wanita' : 'Pria',
      glow: 'shadow-amber-500/20'
    };
  }

  // Microsoft Azure Neural
  if (v.category === 'Azure') {
    return {
      initials,
      gradient: v.gender === 'Female' ? 'from-teal-500 via-emerald-600 to-slate-700' : 'from-slate-600 via-slate-700 to-slate-800',
      badge: 'Azure Neural',
      roleColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      genderIcon: v.gender === 'Female' ? 'Wanita' : 'Pria',
      glow: 'shadow-emerald-500/20'
    };
  }

  // Google Cloud Neural2
  if (v.category === 'Google Cloud') {
    return {
      initials,
      gradient: 'from-emerald-500 via-teal-600 to-slate-700',
      badge: 'Google Cloud',
      roleColor: 'bg-teal-50 text-teal-800 border-teal-200',
      genderIcon: v.gender === 'Female' ? 'Wanita' : 'Pria',
      glow: 'shadow-teal-500/20'
    };
  }

  // Voicebox Local
  if (v.category === 'Voicebox Local') {
    return {
      initials,
      gradient: 'from-emerald-600 via-teal-700 to-cyan-800',
      badge: 'Offline 82M',
      roleColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      genderIcon: v.gender === 'Female' ? 'Wanita' : 'Pria',
      glow: 'shadow-emerald-500/20'
    };
  }

  // Nasional Females
  if (v.gender === 'Female') {
    const palette = {
      'Anita': 'from-rose-500 via-pink-600 to-amber-600',
      'Siti': 'from-emerald-500 via-teal-600 to-cyan-700',
      'Dewi': 'from-amber-500 via-orange-600 to-red-600',
      'Tina': 'from-teal-500 via-emerald-600 to-slate-700',
      'Maya': 'from-teal-500 via-emerald-600 to-slate-700',
      'Indah': 'from-teal-500 via-emerald-600 to-teal-800',
      'Shinta': 'from-red-500 via-rose-600 to-pink-700',
      'Laras': 'from-amber-500 via-rose-600 to-slate-700'
    };
    return {
      initials,
      gradient: palette[v.name] || 'from-pink-500 to-rose-600',
      badge: 'Nasional',
      roleColor: 'bg-rose-50 text-rose-700 border-rose-200',
      genderIcon: 'Wanita',
      glow: 'shadow-rose-500/20'
    };
  }

  // Nasional Males
  const malePalette = {
    'Mugi': 'from-slate-600 via-slate-700 to-slate-800',
    'Agus': 'from-slate-600 via-slate-700 to-slate-800',
    'Rian': 'from-emerald-600 via-teal-600 to-slate-700',
    'Gading': 'from-slate-700 via-zinc-800 to-stone-900',
    'Bayu': 'from-emerald-600 via-teal-700 to-cyan-800',
    'Adi': 'from-amber-600 via-yellow-600 to-orange-700',
    'Eko': 'from-zinc-700 via-slate-700 to-slate-900'
  };
  return {
    initials,
    gradient: malePalette[v.name] || 'from-slate-700 to-slate-900',
    badge: 'Nasional',
    roleColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    genderIcon: 'Pria',
    glow: 'shadow-emerald-500/20'
  };
};

// Splits text into natural sentence chunks within model character limits.
const splitTextIntoNaturalChunks = (text, maxChars = 800) => {
  if (!text || !text.trim()) return [];
  const rawSentences = text
    .replace(/([.!?])\s*(?=[A-Z0-9\u00C0-\u017F])/g, "$1|")
    .replace(/\n+/g, "|")
    .split("|")
    .map(s => s.trim())
    .filter(Boolean);

  const chunks = [];
  let currentChunk = "";

  for (const sentence of rawSentences) {
    if ((currentChunk + " " + sentence).trim().length <= maxChars) {
      currentChunk = (currentChunk ? currentChunk + " " : "") + sentence;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      if (sentence.length > maxChars) {
        const subParts = sentence.split(/([,;:])\s*/).filter(Boolean);
        let subChunk = "";
        for (const part of subParts) {
          if ((subChunk + " " + part).length <= maxChars) {
            subChunk = (subChunk ? subChunk + " " : "") + part;
          } else {
            if (subChunk) chunks.push(subChunk);
            subChunk = part;
          }
        }
        if (subChunk) chunks.push(subChunk);
        currentChunk = "";
      } else {
        currentChunk = sentence;
      }
    }
  }
  if (currentChunk) chunks.push(currentChunk);
  return chunks;
};

// Exponential backoff fetch supporting failover across configured keys.
const fetchWithRetry = async (url, options, retries = 5, backoff = 1000, keyPool = [], keyIndex = 0) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      const errBody = await res.text();
      // Failover to next key in pool on 429 quota exhaustion or 503 unavailability.
      if ((res.status === 429 || res.status === 503) && keyPool.length > 1 && url.includes('key=')) {
        const nextIdx = (keyIndex + 1) % keyPool.length;
        const nextKey = keyPool[nextIdx];
        if (nextKey && nextKey !== keyPool[keyIndex]) {
          console.warn(`Kunci Gemini #${keyIndex + 1} limit/error (HTTP ${res.status}). Otomatis beralih ke Kunci Fail-Safe #${nextIdx + 1}...`);
          const nextUrl = url.replace(/key=[^&]+/, `key=${nextKey}`);
          return fetchWithRetry(nextUrl, options, retries, backoff, keyPool, nextIdx);
        }
      }
      throw new Error(`HTTP ${res.status}: ${errBody}`);
    }
    return await res.json();
  } catch (err) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2, keyPool, keyIndex);
    }
    throw err;
  }
};

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

const createSilenceBuffer = (durationMs = 220, sampleRate = 24000) => {
  const sampleCount = Math.floor((sampleRate * durationMs) / 1000);
  return new Int16Array(sampleCount);
};

const buildWavBlobFromPCM = (mergedPCM, sampleRate = 24000) => {
  const buffer = new ArrayBuffer(44 + mergedPCM.length * 2);
  const view = new DataView(buffer);
  
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + mergedPCM.length * 2, true);
  view.setUint32(8, 0x57415645, false); // "WAVE"
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM Format (1 = Uncompressed Integer)
  view.setUint16(22, 1, true); // Mono Channel
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // Byte rate (SampleRate * 1 * 16/8)
  view.setUint16(32, 2, true); // Block align
  view.setUint16(34, 16, true); // 16 bits per sample
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, mergedPCM.length * 2, true);

  for (let i = 0; i < mergedPCM.length; i++) {
    view.setInt16(44 + i * 2, mergedPCM[i], true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
};

const resamplePCM = async (pcm16, sourceRate, targetRate) => {
  if (!pcm16 || pcm16.length === 0 || sourceRate === targetRate) return pcm16;
  try {
    const numSamples = pcm16.length;
    const duration = numSamples / sourceRate;
    const targetSamples = Math.round(duration * targetRate);

    const OfflineCtxClass = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (OfflineCtxClass) {
      const offlineCtx = new OfflineCtxClass(1, targetSamples, targetRate);
      const sourceBuffer = offlineCtx.createBuffer(1, numSamples, sourceRate);
      const channelData = sourceBuffer.getChannelData(0);
      for (let i = 0; i < numSamples; i++) {
        channelData[i] = pcm16[i] / 32768.0;
      }

      const source = offlineCtx.createBufferSource();
      source.buffer = sourceBuffer;
      source.connect(offlineCtx.destination);
      source.start(0);

      const renderedBuffer = await offlineCtx.startRendering();
      const renderedData = renderedBuffer.getChannelData(0);
      const outputPCM = new Int16Array(renderedData.length);
      for (let i = 0; i < renderedData.length; i++) {
        let s = Math.max(-1, Math.min(1, renderedData[i]));
        outputPCM[i] = s < 0 ? Math.round(s * 32768) : Math.round(s * 32767);
      }
      return outputPCM;
    }
  } catch (err) {
    console.warn('Browser OfflineAudioContext resampler fallback:', err);
  }

  // Fallback: high-precision linear interpolation
  const numSamples = pcm16.length;
  const duration = numSamples / sourceRate;
  const targetSamples = Math.round(duration * targetRate);
  const ratio = sourceRate / targetRate;
  const resampled = new Int16Array(targetSamples);
  for (let i = 0; i < targetSamples; i++) {
    const srcPos = i * ratio;
    const srcIdx = Math.floor(srcPos);
    const frac = srcPos - srcIdx;
    const nextIdx = Math.min(srcIdx + 1, numSamples - 1);
    resampled[i] = Math.round(pcm16[srcIdx] * (1 - frac) + pcm16[nextIdx] * frac);
  }
  return resampled;
};

const stitchPCMChunksToWav = (pcmChunks, sampleRate = 24000) => {
  let totalLength = 0;
  for (const chunk of pcmChunks) totalLength += chunk.length;

  const mergedPCM = new Int16Array(totalLength);
  let offset = 0;
  for (const chunk of pcmChunks) {
    mergedPCM.set(chunk, offset);
    offset += chunk.length;
  }

  return buildWavBlobFromPCM(mergedPCM, sampleRate);
};

export const GentraStudio = ({ 
  user, 
  onLogout, 
  activeEngine = 'gemini', 
  onOpenEngineModal, 
  onSelectEngine 
}) => {
  // Navigation State
  const [view, setView] = useState('studio'); // 'studio' | 'cloning' | 'ads' | 'history'
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServerDropdownOpen, setIsServerDropdownOpen] = useState(false);
  const serverDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (serverDropdownRef.current && !serverDropdownRef.current.contains(e.target)) {
        setIsServerDropdownOpen(false);
      }
    };
    if (isServerDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isServerDropdownOpen]);

  // Studio Theme State (Default: Dark Broadcast Studio)
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('theme') === 'light') return false;
      if (urlParams.get('theme') === 'dark') return true;
      const saved = localStorage.getItem('gentra_studio_theme');
      return saved ? saved === 'dark' : true;
    } catch (e) {
      return true;
    }
  });

  const toggleTheme = () => {
    const nextTheme = !isDarkTheme;
    setIsDarkTheme(nextTheme);
    try {
      localStorage.setItem('gentra_studio_theme', nextTheme ? 'dark' : 'light');
    } catch (e) {}
  };

  useEffect(() => {
    try {
      if (isDarkTheme) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  }, [isDarkTheme]);

  // Kunci Sovereign Vault Resmi Pemprov Jabar (Fail-Safe bawaan sistem agar studio langsung aktif tanpa input manual)
  const SOVEREIGN_VAULT_KEY = sanitizeApiKey(typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || (typeof atob === 'function' ? atob('QVEuQWI4Uk42SkV4WXg5bTZxY0Vzb2ZFRVQwbnFaU3gya0lIc1Npd1ZMVGY0d2tybkNPRWc=') : '');

  // Pool 8 Kunci API Google Gemini (Fail-Safe Key Pool) dengan Dual-Storage (iPad & Cross-Device)
  const [geminiKeys, setGeminiKeys] = useState(() => {
    const envKey = SOVEREIGN_VAULT_KEY;
    try {
      const saved = safeGetItem('gentra_gemini_keys_pool') || safeGetItem('gentra_sovereign_key_vault');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 8) {
          const sanitized = parsed.map(k => sanitizeApiKey(k));
          if (sanitized.some(k => k && k.length > 0)) {
            // Jika slot 1 kosong tetapi ada envKey, isi slot 1 dengan kunci sistem sovereign
            if (!sanitized[0] && envKey) sanitized[0] = envKey;
            return sanitized;
          }
        }
      }
    } catch (e) {}
    const defaultKey1 = sanitizeApiKey(safeGetItem('gentra_gemini_key')) || envKey;
    const defaultKey2 = sanitizeApiKey(safeGetItem('gentra_gemini_backup_key') || '');
    return [defaultKey1, defaultKey2, '', '', '', '', '', ''];
  });

  const [keyVisibility, setKeyVisibility] = useState([false, false, false, false, false, false, false, false]);
  const [keyTestStatuses, setKeyTestStatuses] = useState(Array(8).fill(null));
  const [isTestingAll, setIsTestingAll] = useState(false);

  const handleTestKey = async (index) => {
    const targetKey = geminiKeys[index]?.trim();
    if (!targetKey) {
      setKeyTestStatuses(prev => {
        const next = [...prev];
        next[index] = { status: 'empty', message: 'Slot kosong' };
        return next;
      });
      return;
    }

    setKeyTestStatuses(prev => {
      const next = [...prev];
      next[index] = { status: 'testing', message: 'Memeriksa koneksi & kuota Gemini 3.8...' };
      return next;
    });

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${targetKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'ping' }] }],
            generationConfig: { maxOutputTokens: 5 }
          })
        }
      );

      if (res.ok) {
        if (index === 0) {
          setApiQuotaStatus('active');
          try { localStorage.setItem('gentra_api_quota_status', 'active'); } catch(e){}
        }
        setKeyTestStatuses(prev => {
          const next = [...prev];
          next[index] = { status: 'active', message: 'Kunci Aktif & Siap Digunakan' };
          return next;
        });
      } else {
        const errJson = await res.json().catch(() => ({}));
        const code = res.status;
        const errMsg = errJson?.error?.message || '';
        if (code === 429) {
          if (index === 0) {
            setApiQuotaStatus('limited');
            try { localStorage.setItem('gentra_api_quota_status', 'limited'); } catch(e){}
          }
          setKeyTestStatuses(prev => {
            const next = [...prev];
            next[index] = { status: 'quota_limit', message: `Limit Kuota (HTTP 429): ${errMsg.slice(0, 65)}` };
            return next;
          });
        } else if (code === 400 || code === 403 || errMsg.toLowerCase().includes('api key') || errMsg.toLowerCase().includes('not valid')) {
          if (index === 0) {
            setApiQuotaStatus('invalid');
            try { localStorage.setItem('gentra_api_quota_status', 'invalid'); } catch(e){}
          }
          setKeyTestStatuses(prev => {
            const next = [...prev];
            next[index] = { status: 'invalid', message: 'Kunci Tidak Valid / Salah' };
            return next;
          });
        } else {
          setKeyTestStatuses(prev => {
            const next = [...prev];
            next[index] = { status: 'error', message: `HTTP ${code}: ${errMsg.slice(0, 50)}` };
            return next;
          });
        }
      }
    } catch (netErr) {
      setKeyTestStatuses(prev => {
        const next = [...prev];
        next[index] = { status: 'error', message: 'Gagal terhubung ke jaringan' };
        return next;
      });
    }
  };

  const handleTestAllKeys = async () => {
    setIsTestingAll(true);
    for (let i = 0; i < 8; i++) {
      if (geminiKeys[i]?.trim()) {
        await handleTestKey(i);
      }
    }
    setIsTestingAll(false);
  };

  const handleUpdateGeminiKey = (index, value) => {
    const sanitized = sanitizeApiKey(value);
    setGeminiKeys(prev => {
      const next = [...prev];
      next[index] = sanitized;
      try {
        safeSetItem('gentra_gemini_keys_pool', JSON.stringify(next));
        if (index === 0) safeSetItem('gentra_gemini_key', sanitized);
        if (index === 1) safeSetItem('gentra_gemini_backup_key', sanitized);
      } catch (e) {}
      return next;
    });
    // Reset status uji slot yang diubah
    setKeyTestStatuses(prev => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  const handleSaveAllGeminiKeys = (newKeys) => {
    setGeminiKeys(prev => {
      const next = [...prev];
      if (Array.isArray(newKeys)) {
        newKeys.forEach((k, idx) => {
          if (idx < 8) next[idx] = sanitizeApiKey(k);
        });
      }
      try {
        safeSetItem('gentra_gemini_keys_pool', JSON.stringify(next));
        if (next[0]) safeSetItem('gentra_gemini_key', next[0]);
        if (next[1]) safeSetItem('gentra_gemini_backup_key', next[1]);
      } catch (e) {}
      return next;
    });
  };

  const activeKeyPool = geminiKeys
    .map(k => sanitizeApiKey(k))
    .filter(k => k && k.length > 0);
  if (activeKeyPool.length === 0) {
    activeKeyPool.push(SOVEREIGN_VAULT_KEY);
  }
  const activeKey = activeKeyPool[0] || SOVEREIGN_VAULT_KEY;
  const apiKey = activeKey; // Alias compatibility

  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showVoiceLabModal, setShowVoiceLabModal] = useState(false);
  const [showUserManagementModal, setShowUserManagementModal] = useState(false);
  const [generationError, setGenerationError] = useState(null);

  // Indikator Status Kuota API Real-Time (Lampu Hijau / Merah / Kuning)
  const [apiQuotaStatus, setApiQuotaStatus] = useState('active');
  const [isQuotaBannerDismissed, setIsQuotaBannerDismissed] = useState(false);


  // Pengecekan otomatis di latar belakang saat studio dibuka
  useEffect(() => {
    if (activeKeyPool.length === 0) {
      setApiQuotaStatus('unconfigured');
      return;
    }
    const checkQuota = async () => {
      let anyActive = false;
      for (const k of activeKeyPool) {
        if (!k) continue;
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${k}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: 'p' }] }],
                generationConfig: { maxOutputTokens: 2 }
              })
            }
          );
          if (res.ok) {
            anyActive = true;
            break;
          }
        } catch (e) {}
      }
      if (anyActive) {
        setApiQuotaStatus('active');
      }
    };
    checkQuota();
  }, [activeKeyPool.length, activeKeyPool[0]]);

  const handleRetryTestQuota = async () => {
    setApiQuotaStatus('checking');
    let found = false;
    for (let idx = 0; idx < activeKeyPool.length; idx++) {
      const k = activeKeyPool[idx];
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${k}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: 'p' }] }], generationConfig: { maxOutputTokens: 2 } })
          }
        );
        if (res.ok) {
          found = true;
          setApiQuotaStatus('active');
          setIsQuotaBannerDismissed(true);
          break;
        }
      } catch (e) {}
    }
    if (!found) {
      setApiQuotaStatus('limited');
    }
  };

  // State 2 Blok Pemisah Karakter Studio (Expand & Collapse)
  const [isBlock1Open, setIsBlock1Open] = useState(true); // NUSA VOICE (Nasional - 14)
  const [isBlock2Open, setIsBlock2Open] = useState(false); // PASUNDAN VOICE (Sunda - 8)

  // Multi-Engine TTS State
  const [ttsEngine, setTtsEngine] = useState('gemini'); // 'gemini' | 'azure' | 'google'
  const [googleApiKey, setGoogleApiKey] = useState(() => {
    try { return localStorage.getItem('gentra_google_key') || ''; } catch (e) { return ''; }
  });
  const [azureKey, setAzureKey] = useState(() => {
    try { return localStorage.getItem('gentra_azure_key') || ''; } catch (e) { return ''; }
  });
  const [azureRegion, setAzureRegion] = useState(() => {
    try { return localStorage.getItem('gentra_azure_region') || 'southeastasia'; } catch (e) { return 'southeastasia'; }
  });

  // Benchmark / Arena Komparasi State (Dapur Pengujian Backend)
  const [showBenchmarkModal, setShowBenchmarkModal] = useState(false);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [benchmarkResults, setBenchmarkResults] = useState([]);
  const [playingBenchmarkIndex, setPlayingBenchmarkIndex] = useState(null);
  const [benchmarkText, setBenchmarkText] = useState('');
  const benchmarkAudioRef = useRef(null);

  // Ketersediaan Audio & Notifikasi Abu
  const [previewUnavailableVoice, setPreviewUnavailableVoice] = useState(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Master Admin Security State (Pengaturan Kunci API Terproteksi)
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => user?.role === 'Master Admin');
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState('');
  const [masterKey, setMasterKey] = useState(() => {
    try {
      return safeGetItem('gentra_master_key') || 'admin2026';
    } catch (e) {
      return 'admin2026';
    }
  });
  const [newMasterKeyInput, setNewMasterKeyInput] = useState('');
  const [masterKeySuccess, setMasterKeySuccess] = useState('');

  const [voices, setVoices] = useState(() => getUnifiedVoices());

  const handleUpdateVoices = (newVoices) => {
    setVoices(newVoices);
    saveUnifiedVoices(newVoices);
  };

  // Sinkronisasi otomatis real-time lintas tab / komponen jika daftar suara diperbarui di Lab
  useEffect(() => {
    const handleSyncVoices = () => {
      setVoices(getUnifiedVoices());
    };
    window.addEventListener(GENTRA_VOICES_EVENT, handleSyncVoices);
    window.addEventListener('storage', handleSyncVoices);
    return () => {
      window.removeEventListener(GENTRA_VOICES_EVENT, handleSyncVoices);
      window.removeEventListener('storage', handleSyncVoices);
    };
  }, []);

  const [voiceCategory, setVoiceCategory] = useState('Nasional');
  const [selectedVoice, setSelectedVoice] = useState(INITIAL_VOICES[0]);
  const [previewingVoice, setPreviewingVoice] = useState(null);
  const [showEmotionTags, setShowEmotionTags] = useState(false);

  // Auto-fallback jika karakter terpilih di-hide oleh admin lab
  useEffect(() => {
    if (selectedVoice) {
      const activeInList = voices.find(v => v.name === selectedVoice.name || (v.originalName && v.originalName === (selectedVoice.originalName || selectedVoice.name)));
      if (activeInList) {
        if (activeInList.isHidden) {
          const firstActive = voices.find(v => !v.isHidden) || voices[0];
          if (firstActive) setSelectedVoice(firstActive);
        } else if (
          activeInList.personaPrompt !== selectedVoice.personaPrompt || 
          activeInList.desc !== selectedVoice.desc || 
          activeInList.name !== selectedVoice.name ||
          activeInList.accent !== selectedVoice.accent
        ) {
          setSelectedVoice(activeInList);
        }
      }
    }
  }, [voices]);

  // Edit Persona Modal State
  const [editingVoice, setEditingVoice] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', desc: '', accent: '', category: 'Sunda' });

  // Main Form States
  const [text, setText] = useState('');
  const [dialect, setDialect] = useState('indonesia'); // Default: Bahasa Indonesia (Resmi/Nasional)
  const [emotion, setEmotion] = useState('Netral');
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(0);

  // Voicebox Local Engine status
  const [voiceboxStatus, setVoiceboxStatus] = useState('ready'); // 'ready' | 'connected' | 'offline'
  const textareaRef = useRef(null);

  // Fungsi Sisipkan Tag Emosi Paralinguistik Bahasa Indonesia
  const insertEmotionTag = (tag) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart || 0;
      const end = textareaRef.current.selectionEnd || 0;
      const newText = text.substring(0, start) + tag + ' ' + text.substring(end);
      setText(newText);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(start + tag.length + 1, start + tag.length + 1);
        }
      }, 50);
    } else {
      setText((prev) => (prev ? prev + ' ' + tag + ' ' : tag + ' '));
    }
  };

  // Audio Generation & Progress
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStatus, setProgressStatus] = useState('');
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [totalChunksCount, setTotalChunksCount] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isMainAudioPlaying, setIsMainAudioPlaying] = useState(false);
  const [history, setHistory] = useState([]);

  // Studio Audio Resampling State (Standar Studio Broadcast 48kHz & 44.1kHz, default 24kHz Native Vocoder)
  const [audioSampleRate, setAudioSampleRate] = useState(() => {
    try {
      return parseInt(localStorage.getItem('gentra_sample_rate')) || 24000;
    } catch (e) {
      return 24000;
    }
  });
  const rawPcmRef = useRef(null);

  const handleChangeSampleRate = async (newRate) => {
    setAudioSampleRate(newRate);
    try {
      localStorage.setItem('gentra_sample_rate', newRate);
    } catch (e) {}

    if (rawPcmRef.current && rawPcmRef.current.length > 0) {
      setProgressStatus(`Mastering audio ke standar ${newRate === 48000 ? '48 kHz Broadcast' : newRate === 44100 ? '44.1 kHz Studio CD' : '24 kHz Native AI'}...`);
      let convertedPCM;
      if (newRate === 24000) {
        convertedPCM = rawPcmRef.current;
      } else {
        convertedPCM = await resamplePCM(rawPcmRef.current, 24000, newRate);
      }
      const newBlob = buildWavBlobFromPCM(convertedPCM, newRate);
      const newUrl = URL.createObjectURL(newBlob);
      setAudioUrl(newUrl);
      setProgressStatus('');
    }
  };

  // Mode Iklan Layanan Masyarakat (ILM)
  const [ilmTopic, setIlmTopic] = useState('');
  const [ilmOrganization, setIlmOrganization] = useState('');
  const [ilmMessage, setIlmMessage] = useState('');
  const [ilmDuration, setIlmDuration] = useState('30s'); // '30s' | '60s'
  const [ilmFormat, setIlmFormat] = useState('monolog'); // 'monolog' | 'dialog'
  const [contentTone, setContentTone] = useState('Edukasi');
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);

  // Voice Cloning State
  const [cloneName, setCloneName] = useState('');
  const [cloneDesc, setCloneDesc] = useState('');
  const [cloneGender, setCloneGender] = useState('Male');
  const [cloneAccent, setCloneAccent] = useState('Logat Sunda');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);
  const [uploadedAudioFile, setUploadedAudioFile] = useState(null);

  // Whisper Transcription State
  const [showWhisperModal, setShowWhisperModal] = useState(false);
  const [whisperFile, setWhisperFile] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribeProgress, setTranscribeProgress] = useState('');
  const [transcribedText, setTranscribedText] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState(() => {
    try { return localStorage.getItem('gentra_openai_key') || ''; } catch (e) { return ''; }
  });

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const previewAudioCache = useRef({});
  const currentAudioRef = useRef(null);

  // Sinkronisasi daftar karakter vokal sesuai Server Engine aktif
  useEffect(() => {
    if (activeEngine === 'azure') {
      setVoices(AZURE_VOICES);
      setSelectedVoice(AZURE_VOICES[0]);
    
    } else {
      setVoices(INITIAL_VOICES);
      setSelectedVoice(INITIAL_VOICES[0]);
    }
    setVoiceCategory('Nasional');
  }, [activeEngine]);

  const filteredVoices = voices.filter(v => {
    if (v.isHidden) return false;
    if (voiceCategory === 'Semua') return true;
    return v.category === voiceCategory;
  });

  const handleSwitchView = (newView) => {
    setView(newView);
    setIsMenuOpen(false);
  };

  const handlePreviewVoice = async (v, e) => {
    if (e) e.stopPropagation();

    // 1. Cek ketersediaan sampel audio karakter
    const hasAudio = checkVoiceHasPreview(v, previewAudioCache.current);
    if (!hasAudio) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      }
      setPreviewingVoice(null);
      setPreviewUnavailableVoice(v.name);
      setTimeout(() => setPreviewUnavailableVoice(null), 4000);
      return;
    }

    // 2. Jika sedang memutar suara karakter ini, hentikan
    if (previewingVoice === v.name) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setPreviewingVoice(null);
      return;
    }

    // Hentikan pemutaran audio sebelumnya jika ada
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setPreviewingVoice(v.name);

    // Prioritas Mutlak: Putar langsung dari file audio pre-rendered statis (Tabungan audio tersimpan - Hemat 100% Token)
    const targetUrl = previewAudioCache.current[v.name] || STATIC_AUDIO_PREVIEWS[v.name];
    if (targetUrl) {
      const cleanUrl = targetUrl.includes('?') ? targetUrl : `${targetUrl}?v=gemini-neural-v2`;
      const audio = new Audio(cleanUrl);
      currentAudioRef.current = audio;
      audio.onended = () => setPreviewingVoice(null);
      audio.onerror = () => {
        setPreviewingVoice(null);
        setPreviewUnavailableVoice(v.name);
        setTimeout(() => setPreviewUnavailableVoice(null), 4000);
      };
      try {
        await audio.play();
        return;
      } catch (err) {
        console.warn('Gagal memutar audio preview langsung:', err);
        setPreviewingVoice(null);
        setPreviewUnavailableVoice(v.name);
        setTimeout(() => setPreviewUnavailableVoice(null), 4000);
        return;
      }
    }

    setPreviewUnavailableVoice(v.name);
    setTimeout(() => setPreviewUnavailableVoice(null), 4000);
    setPreviewingVoice(null);
  };

  // Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setRecordedAudioBlob(audioBlob);
        setRecordedAudioUrl(URL.createObjectURL(audioBlob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert("Gagal mengakses mikrofon: " + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const handleSaveClonedVoice = () => {
    if (!cloneName.trim()) {
      alert("Masukkan nama karakter suara terlebih dahulu.");
      return;
    }
    if (!recordedAudioBlob && !uploadedAudioFile) {
      alert("Silakan rekam suara atau unggah sampel audio minimal 5 detik.");
      return;
    }

    const baseId = cloneGender === 'Male' ? 'Puck' : 'Aoede';

    const newVoice = {
      id: baseId,
      name: cloneName.trim(),
      category: 'Kloningan',
      desc: cloneDesc.trim() || `Suara Kloning ${cloneName} (${cloneGender === 'Male' ? 'Pria' : 'Wanita'})`,
      gender: cloneGender,
      accent: cloneAccent,
      isCustom: true,
      isCloned: true,
      sampleAudioUrl: recordedAudioUrl || (uploadedAudioFile ? URL.createObjectURL(uploadedAudioFile) : null)
    };

    setVoices([newVoice, ...voices]);
    setSelectedVoice(newVoice);
    alert(`Karakter "${newVoice.name}" berhasil ditambahkan ke daftar suara.`);
    
    setCloneName('');
    setCloneDesc('');
    setRecordedAudioBlob(null);
    setRecordedAudioUrl(null);
    setUploadedAudioFile(null);
    setView('studio');
  };

  const handleOpenEditVoice = (voice, e) => {
    e.stopPropagation();
    setEditingVoice(voice);
    setEditForm({
      name: voice.name,
      desc: voice.desc,
      accent: voice.accent,
      category: voice.category
    });
  };

  const handleSaveEditVoice = () => {
    if (!editingVoice || !editForm.name.trim()) return;

    const updated = voices.map(v => {
      if (v.id === editingVoice.id && v.name === editingVoice.name) {
        return {
          ...v,
          name: editForm.name.trim(),
          desc: editForm.desc.trim(),
          accent: editForm.accent.trim(),
          category: editForm.category
        };
      }
      return v;
    });

    setVoices(updated);
    if (selectedVoice.name === editingVoice.name) {
      setSelectedVoice({ ...selectedVoice, ...editForm });
    }
    setEditingVoice(null);
  };

  const handleDeleteVoice = (voiceName, e) => {
    e.stopPropagation();
    if (confirm(`Hapus karakter "${voiceName}"?`)) {
      const filtered = voices.filter(v => v.name !== voiceName);
      setVoices(filtered);
      if (selectedVoice.name === voiceName) {
        setSelectedVoice(filtered[0]);
      }
    }
  };

  // Transcribes user-provided audio via Gemini speech-to-text.
  const handleTranscribeAudio = async () => {
    if (!whisperFile) {
      alert("Silakan pilih file audio terlebih dahulu.");
      return;
    }

    setIsTranscribing(true);
    setTranscribeProgress("Membaca file audio...");

    try {
      setTranscribeProgress("Membaca file audio...");
      const activeKey = activeKeyPool[0] || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || SOVEREIGN_VAULT_KEY;
      if (!activeKey) {
        setShowApiKeyModal(true);
        throw new Error("Masukkan Kunci API terlebih dahulu di menu pengaturan.");
      }

      const reader = new FileReader();
      const base64Promise = new Promise((resolve, reject) => {
        reader.onload = () => {
          const res = reader.result;
          const base64 = res.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(whisperFile);
      const base64Data = await base64Promise;

      const mimeType = whisperFile.type || (whisperFile.name.endsWith('.wav') ? 'audio/wav' : 'audio/mp3');
      const promptText = dialect === 'sunda'
        ? "Dengarkan rekaman audio ini. Transkripsikan seluruh isi percakapan kata demi kata ke dalam teks bahasa Sunda atau Indonesia secara rapi dan akurat sesuai pengucapan. Hanya berikan teks transkripsi saja tanpa tambahan kata pengantar atau penutup."
        : "Dengarkan rekaman audio ini. Transkripsikan seluruh isi percakapan kata demi kata ke dalam teks secara akurat dengan ejaan dan tanda baca yang tepat. Hanya berikan teks transkripsi saja tanpa komentar apapun.";

      setTranscribeProgress("Mentranskripsikan audio ke teks secara instan...");
      let result = null;
      let lastTransErr = null;
      for (const modelName of TEXT_MODELS) {
        try {
          result = await fetchWithRetry(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${activeKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{
                  parts: [
                    { inlineData: { mimeType: mimeType, data: base64Data } },
                    { text: promptText }
                  ]
                }]
              })
            },
            3,
            800,
            activeKeyPool
          );
          if (result?.candidates?.[0]?.content?.parts?.[0]?.text) break;
        } catch (tErr) {
          console.warn(`Transkripsi model ${modelName} gagal:`, tErr.message);
          lastTransErr = tErr;
        }
      }
      if (!result || !result.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw lastTransErr || new Error("Gagal mentranskripsikan audio.");
      }

      const textOutput = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
      setTranscribedText(textOutput.trim());
      setTranscribeProgress("Transkripsi berhasil diselesaikan!");
    } catch (err) {
      console.error(err);
      alert("Gagal mentranskripsi audio: " + err.message);
    } finally {
      setIsTranscribing(false);
    }
  };

  // Appends transcription output to the main script editor.
  const handleApplyTranscribedText = () => {
    if (!transcribedText.trim()) return;
    setText(prev => (prev ? prev + "\n\n" + transcribedText : transcribedText));
    setShowWhisperModal(false);
    setTranscribedText('');
    setWhisperFile(null);
  };

  const handleGenerateCopy = async () => {
    if (!ilmTopic || !ilmMessage) return;
    setIsGeneratingCopy(true);

    const isSunda = dialect === 'sunda';
    const languageInstruction = isSunda 
      ? "Gunakan Basa Sunda yang santun, guyub, luwes, dan menyentuh hati warga (misal: 'Wargi sadayana...', 'Hayu urang sasarengan...')."
      : "Gunakan Bahasa Indonesia baku yang komunikatif, artikulatif, santun, persuasif, dan berdampak kuat bagi kesadaran publik masyarakat.";

    let toneInstruction = `Gaya Penyampaian: ${contentTone}`;
    if (contentTone === 'Formal') {
      toneInstruction = isSunda 
        ? "Gaya Penyampaian: Resmi & Kedinasan (Gunakan Basa Sunda loma/lemes anu sopan tur otoritatif pamaréntah)."
        : "Gaya Penyampaian: Resmi & Kedinasan (Gunakan Bahasa Indonesia baku, kredibel, otoritatif, lugas, santun, dan sesuai standar protokol komunikasi publik Pemerintah Provinsi Jawa Barat).";
    }

    const prompt = `Sebagai pakar komunikasi publik dan penulis naskah Iklan Layanan Masyarakat (ILM), buatkan naskah voice-over ILM yang berdampak tinggi untuk:
Topik / Isu: ${ilmTopic}
Instansi / Penggagas: ${ilmOrganization || "Pemerintah Provinsi Jawa Barat"}
${toneInstruction}
Target Durasi: ${ilmDuration === '30s' ? 'Spot Singkat 30 Detik (~60-70 kata)' : 'Spot Lengkap 60 Detik (~120-140 kata)'}
Bahasa Output: ${languageInstruction}
Pesan Pokok & Himbauan Khusus: ${ilmMessage}

PENTING:
- Berikan naskah narasi siap baca yang mengalir alami untuk dibacakan oleh narator/pengisi suara.
- Gunakan tanda baca koma dan titik dengan cermat untuk jeda napas yang nyaman.
- Hanya berikan naskah bacaan narator saja tanpa judul, tanpa catatan panggung, dan tanpa kata pengantar/penutup.`;

    const generateLocalFallback = () => {
      const is30s = ilmDuration === '30s';
      const org = ilmOrganization || "Pemerintah Provinsi Jawa Barat";
      if (isSunda) {
        if (contentTone === 'Formal') {
          return is30s
            ? `Wawaran resmi ti ${org}. Dina raraga ngaronjatkeun katertiban sareng karaharjaan umum, sakumna wargi Jawa Barat dihimbau pikeun museurkeun perhatosan kana ${ilmTopic}. ${ilmMessage}. Hayu urang patuh kana aturan anu parantos ditangtoskeun demi kamaslahatan sasarengan.`
            : `Pamaréntah Daerah Provinsi Jawa Barat ngaliwatan ${org} ngémbarkeun wawaran resmi ka sakumna wargi. Ngeunaan tarékah ${ilmTopic}, dihaturanan ka sakumna masarakat supados silih rojong. ${ilmMessage}. Hayu urang babarengan ngajaga tatar Pasundan anu aman, tertib, tur barokah.`;
        }
        return is30s
          ? `Sampurasun wargi sadayana! Ti ${org}, hayu urang babarengan merhatoskeun ${ilmTopic}. ${ilmMessage}. Léngkah leutik urang sadaya, mangrupa harepan badag pikeun kamajuan tatar Parahyangan!`
          : `Sampurasun wargi Jawa Barat anu bageur tur salawasna guyub! Ti ${org}, hayu urang sami-sami ngiring rempug jukung dina perkawis ${ilmTopic}. ${ilmMessage}. Tong hilap, kasadaran urang mangrupikeun kakuatan nyata pikeun kasalametan kulawarga urang. Hayu babarengan ngawujudkeun Jabar Juara Lahir Batin!`;
      }
      if (contentTone === 'Formal') {
        return is30s
          ? `Pengumuman resmi dari ${org}. Dalam rangka menjaga ketertiban, keselamatan, dan kesehatan publik, seluruh warga diimbau untuk memperhatikan ${ilmTopic}. ${ilmMessage}. Kepatuhan dan kedisiplinan kita bersama adalah wujud nyata kepedulian terhadap kemajuan Jawa Barat.`
          : `Pemerintah Provinsi Jawa Barat melalui ${org} menyampaikan imbauan resmi kepada seluruh lapisan masyarakat. Terkait upaya optimalisasi ${ilmTopic}, kami mengajak setiap warga untuk mengambil peran aktif. ${ilmMessage}. Mari kita tingkatkan kepedulian demi terwujudnya tata kelola lingkungan dan masyarakat yang aman, tertib, dan sehat. Pesan ini disampaikan oleh ${org}.`;
      }
      return is30s
        ? `Halo Warga Jawa Barat! Tahukah Anda betapa pentingnya ${ilmTopic}? ${ilmMessage}. Mari bersama-sama kita wujudkan perubahan positif mulai dari diri sendiri dan keluarga kita. Pesan kepedulian ini dipersembahkan oleh ${org}.`
        : `Setiap langkah kecil yang kita ambil hari ini, menentukan masa depan Jawa Barat esok hari. Melalui ${org}, kami mengajak seluruh masyarakat untuk bersama-sama peduli terhadap ${ilmTopic}. ${ilmMessage}. Jadikan kebiasaan baik ini bagian dari kehidupan sehari-hari kita. Dari kita, oleh kita, untuk Jawa Barat Juara!`;
    };

    try {
      const activeKey = apiKey || activeKeyPool[0] || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || SOVEREIGN_VAULT_KEY;
      if (!activeKey) {
        setText(generateLocalFallback());
        return;
      }

      let result = null;
      let lastErr = null;

      for (const modelName of TEXT_MODELS) {
        try {
          result = await fetchWithRetry(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${activeKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                systemInstruction: { parts: [{ text: "Pakar komunikasi publik dan naskah Iklan Layanan Masyarakat (ILM)." }] }
              })
            },
            2,
            600,
            activeKeyPool
          );
          if (result?.candidates?.[0]?.content?.parts?.[0]?.text) break;
        } catch (errM) {
          console.warn(`Model ${modelName} pembuatan naskah gagal:`, errM.message);
          lastErr = errM;
        }
      }

      const finalGeneratedText = (result?.candidates?.[0]?.content?.parts?.[0]?.text || generateLocalFallback()).trim();
      setText(finalGeneratedText);
      try {
        logAccountActivity({
          userEmail: user?.email || 'tim@gentra.internal',
          userName: user?.name || user?.email || 'TIM PRODUKSI',
          type: 'SCRIPT_GENERATION',
          action: 'Pembuatan Naskah ILM',
          voiceName: selectedVoice?.name || 'Umum',
          backendVoiceId: selectedVoice?.backendVoiceId || selectedVoice?.id || 'gemini',
          scriptText: finalGeneratedText,
          script: finalGeneratedText,
          charCount: finalGeneratedText.length,
          wordCount: finalGeneratedText.split(/\s+/).filter(Boolean).length,
          category: 'ILM ' + contentTone,
          metadata: { topic: ilmTopic, organization: org, duration: is30s ? '30 Detik' : '60 Detik' }
        });
      } catch (e) {}
    } catch (err) {
      console.warn("Fallback ILM otomatis digunakan:", err.message);
      const fallbackText = generateLocalFallback().trim();
      setText(fallbackText);
      try {
        logAccountActivity({
          userEmail: user?.email || 'tim@gentra.internal',
          userName: user?.name || user?.email || 'TIM PRODUKSI',
          type: 'SCRIPT_GENERATION',
          action: 'Pembuatan Naskah ILM',
          voiceName: selectedVoice?.name || 'Umum',
          backendVoiceId: selectedVoice?.backendVoiceId || selectedVoice?.id || 'gemini',
          scriptText: fallbackText,
          script: fallbackText,
          charCount: fallbackText.length,
          wordCount: fallbackText.split(/\s+/).filter(Boolean).length,
          category: 'ILM (Lokal)',
          metadata: { topic: ilmTopic, organization: org }
        });
      } catch (e) {}
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  // Audio Synthesis
  const handleGenerateAudio = async () => {
    if (!text.trim()) return;

    // 1. Cek Ketersediaan Karakter: jika sampel preview tidak ada, karakter tidak dapat digunakan untuk generate
    if (!checkVoiceHasPreview(selectedVoice, previewAudioCache.current)) {
      setPreviewUnavailableVoice(selectedVoice.name);
      setTimeout(() => setPreviewUnavailableVoice(null), 4000);
      return;
    }

    // 2. Ambil Kunci Gemini API Aktif
    const activeKey = apiKey || activeKeyPool[0] || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || SOVEREIGN_VAULT_KEY;
    if (!activeKey) {
      setShowApiKeyModal(true);
      return;
    }

    setIsGenerating(true);
    setAudioUrl(null);
    setGenerationError(null);
    setGenerationProgress(15);
    setProgressStatus('Mempersiapkan naskah & konfigurasi vokal Neural Studio...');

    const chunks = splitTextIntoNaturalChunks(text, 800);
    setTotalChunksCount(chunks.length);

    const speedText = speed > 1.2 ? "tempo cepat" : speed < 0.8 ? "tempo lambat/santai" : "tempo normal";
    const pitchText = pitch > 0 ? "nada lebih tinggi" : pitch < 0 ? "nada lebih berat/rendah" : "nada standar";
    
    const clonePromptAddon = selectedVoice.isCloned 
      ? `Tirukan warna vokal, artikulasi, dan timbre dari persona ${selectedVoice.name} (${selectedVoice.desc}).`
      : "";

    const personaInstruction = selectedVoice.personaPrompt ? `${selectedVoice.personaPrompt} ` : "";

    const dialectInstruction = selectedVoice.category === 'Sunda' || dialect === 'sunda'
      ? `Gunakan cengkok dan intonasi khas Sunda yang ${selectedVoice.accent || 'luwes'}, natural, dan hangat.` 
      : `Gunakan intonasi Bahasa Indonesia yang ${selectedVoice.accent || 'artikulatif'}, artikulatif, dan natural.`;

    const emotionTagGuidance = text.includes('[') && text.includes(']')
      ? "Patuhi tag ekspresi emosi bahasa Indonesia dalam tanda kurung siku seperti [tertawa], [berbisik], [jeda 1 detik], [bersemangat], [hela napas], [tegas], [tersenyum]. Wujudkan ekspresi tersebut dalam intonasi suara dan jangan melafalkan kata kurung sikunya secara harafiah."
      : "";

    const persona = getVoicePersonaInstruction(selectedVoice);

    // Instruksi Persona Menyeluruh Sesuai Karakter Vokal Asli
    const systemInstructionText = `Sebagai ${persona.role}, Anda memiliki warna vokal dan karakter suara khas: ${persona.timbre}.
${persona.dialect}.
Emosi saat ini: ${emotion}, tempo pembacaan: ${speedText}, nada dasar: ${pitchText}. ${personaInstruction} ${clonePromptAddon} ${emotionTagGuidance}
Wajib menjiwai karakter ${selectedVoice.name} (${persona.timbre}) secara konsisten, alami, hangat, dan ekspresif.

ATURAN WAJIB & MUTLAK:
1. Bacakan HANYA teks naskah yang diminta persis dengan penjiwaan karakter ${selectedVoice.name}.
2. DILARANG KERAS mengucapkan intro, sapaan, atau basa-basi apa pun (jangan sebut "Tentu", "Baik", "Baiklah", "Halo", "Berikut adalah pembacaan naskah", atau "Oke").
3. Mulai bersuara langsung dari kata pertama teks naskah tanpa jeda.`;

    const pcmResults = [];

    try {
      for (let i = 0; i < chunks.length; i++) {
        setCurrentChunkIndex(i + 1);
        const chunkPct = Math.round(15 + ((i + 1) / chunks.length) * 70);
        setGenerationProgress(chunkPct);
        setProgressStatus(`Sintesis segmen ${i + 1} dari ${chunks.length} dengan Neural Engine...`);

        const chunkText = chunks[i];

        // Google Gemini TTS Audio endpoint menolak systemInstruction (HTTP 400 Developer instruction is not enabled).
        // Arahan persona dan larangan mutlak intro/basa-basi digabungkan langsung ke dalam contents user.
        const voiceDirective = `[Karakter vokal: ${selectedVoice.name} (${persona.timbre}). ${persona.dialect}. Emosi: ${emotion}, Tempo: ${speedText}, Nada: ${pitchText}. ${emotionTagGuidance}. ATURAN WAJIB & MUTLAK: Bacakan HANYA teks naskah. DILARANG KERAS mengucapkan intro, sapaan, atau basa-basi apa pun (jangan sebut "Tentu", "Baik", "Baiklah", "Halo", "Berikut adalah pembacaan naskah", atau "Oke"). Mulai bersuara langsung dari kata pertama teks naskah tanpa jeda]:\n`;

        const payload = {
          contents: [{ 
            role: "user",
            parts: [{ text: `${voiceDirective}${chunkText}` }] 
          }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: { 
              voiceConfig: { 
                prebuiltVoiceConfig: { voiceName: selectedVoice.id || 'Aoede' } 
              } 
            }
          }
        };

        let response;
        try {
          response = await fetchWithRetry(
            `https://generativelanguage.googleapis.com/v1beta/models/${TTS_MODEL}:generateContent?key=${activeKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            },
            5,
            1000,
            activeKeyPool,
            0
          );
        } catch (priErr) {
          console.warn(`Model ${TTS_MODEL} limit tercapai, mencoba fallback ke ${TTS_FALLBACK_MODEL}:`, priErr);
          response = await fetchWithRetry(
            `https://generativelanguage.googleapis.com/v1beta/models/${TTS_FALLBACK_MODEL}:generateContent?key=${activeKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            },
            5,
            1000,
            activeKeyPool,
            0
          );
        }

        const inlineData = response?.candidates?.[0]?.content?.parts?.[0]?.inlineData;
        if (!inlineData || !inlineData.data) {
          throw new Error(`Gagal menghasilkan suara pada bagian ke-${i + 1}`);
        }

        const pcm16 = base64ToPCM16(inlineData.data);
        pcmResults.push(pcm16);

        if (i < chunks.length - 1) {
          pcmResults.push(createSilenceBuffer(220, 24000));
        }
      }

      setGenerationProgress(88);
      setProgressStatus('Menggabungkan audio...');
      let totalLength = 0;
      for (const chunk of pcmResults) totalLength += chunk.length;
      const merged24k = new Int16Array(totalLength);
      let offset = 0;
      for (const chunk of pcmResults) {
        merged24k.set(chunk, offset);
        offset += chunk.length;
      }

      rawPcmRef.current = merged24k;

      let finalPCM = merged24k;
      if (audioSampleRate !== 24000) {
        setGenerationProgress(94);
        setProgressStatus(`Mastering audio ke standar studio (${audioSampleRate === 48000 ? '48 kHz Broadcast' : '44.1 kHz Studio CD'})...`);
        finalPCM = await resamplePCM(merged24k, 24000, audioSampleRate);
      }

      const finalWavBlob = buildWavBlobFromPCM(finalPCM, audioSampleRate);
      const url = URL.createObjectURL(finalWavBlob);

      setAudioUrl(url);
      setHistory(prev => [{
        id: Date.now(),
        text: text.substring(0, 60) + (text.length > 60 ? '...' : ''),
        voice: selectedVoice.name,
        accent: selectedVoice.accent,
        emotion: emotion,
        sampleRate: audioSampleRate,
        isCloned: selectedVoice.isCloned,
        date: new Date().toLocaleTimeString('id-ID'),
        url: url
      }, ...prev]);

      try {
        logAccountActivity({
          userEmail: user?.email || 'tim@gentra.internal',
          userName: user?.name || user?.email || 'TIM PRODUKSI',
          type: 'AUDIO_GENERATION',
          action: 'Sintesis Audio Voice Over',
          voiceName: selectedVoice.name,
          backendVoiceId: selectedVoice.backendVoiceId || selectedVoice.id,
          scriptText: text,
          script: text,
          charCount: text.length,
          wordCount: text.trim().split(/\s+/).filter(Boolean).length,
          category: selectedVoice.category,
          emotion: emotion,
          sampleRate: audioSampleRate
        });
      } catch (e) {}
      setGenerationProgress(100);
      setProgressStatus('Selesai! Audio siap diputar.');
    } catch (err) {
      console.error(err);
      if (err.message.includes('429') || err.message.toLowerCase().includes('quota')) {
        setApiQuotaStatus('limited');
        try { localStorage.setItem('gentra_api_quota_status', 'limited'); } catch (e) {}
        setGenerationError('Kuota harian Google AI Studio gratis (limit 10 request/hari) pada Kunci Aktif telah habis. Silakan buka menu Pengaturan Kunci API (Master Admin) untuk memasukkan Kunci Cadangan pada Slot 2-8 agar produksi suara berjalan lancar tanpa henti!');
      } else {
        setGenerationError(`Terjadi kendala sintesis: ${err.message}`);
      }
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 1200);
    }
  };

  // Dynamic Broadcast Studio Styling Tokens (Sovereign Emerald in Dark, Crisp Off-White in Light)
  const cardBg = isDarkTheme 
    ? 'bg-[#101522] border border-slate-800/80 shadow-2xl text-slate-100' 
    : 'bg-white border border-slate-200/80 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] text-slate-900';

  const subCardBg = isDarkTheme
    ? 'bg-[#141A29] border border-slate-800/60 text-slate-200'
    : 'bg-slate-50/80 border border-slate-200/70 text-slate-800';

  const inputBg = isDarkTheme
    ? 'bg-[#0B0F19] border border-slate-800 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
    : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10';

  const headingColor = isDarkTheme ? 'text-white' : 'text-slate-900';
  const subTextColor = isDarkTheme ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className={`min-h-[100dvh] transition-colors duration-300 font-sans selection:bg-[#064E3B] selection:text-white ${isDarkTheme ? 'bg-[#090D14] text-slate-100' : 'bg-[#F8FAF9] text-slate-900'}`}>
      {/* Top Navigation Bar */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md transition-colors duration-300 ${isDarkTheme ? 'bg-[#0D131F]/95 border-b border-slate-800 text-white' : 'bg-white/95 border-b border-slate-200/80 shadow-xs text-slate-900'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Logo & Tagline (Sisi Kiri - GENTRA) */}
            <div className="flex items-center gap-3 cursor-pointer group shrink-0" onClick={() => handleSwitchView('studio')}>
              <img 
                src="/logo.png" 
                alt="GENTRA" 
                className={`w-11 h-11 rounded-2xl object-cover shadow-xs transition-transform group-hover:scale-105 shrink-0 border ${
                  isDarkTheme ? 'border-slate-800 shadow-black/40' : 'border-slate-200'
                }`}
              />
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <span className={`text-2xl font-black tracking-tight leading-none ${isDarkTheme ? 'text-white' : 'text-[#064E3B]'}`}>
                    GENTRA
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs ${
                    isDarkTheme 
                      ? 'bg-[#14231A] text-[#4ADE80] border-[#166534]' 
                      : 'bg-[#ECFDF5] text-[#064E3B] border-[#6EE7B7]'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                    v2.6.4
                  </span>
                </div>
                <span className={`text-[12px] font-semibold mt-1 whitespace-nowrap leading-tight ${
                  isDarkTheme ? 'text-slate-400' : 'text-[#526170]'
                }`}>
                  Ti Téks Jadi Sora
                </span>
              </div>
            </div>

            {/* Desktop Menu (Segmented Pill Bar) */}
            <div className="hidden md:flex items-center justify-center shrink-0">
              <div className={`flex items-center gap-1 p-1 rounded-full border shadow-2xs ${isDarkTheme ? 'bg-[#141A29] border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                {/* Posisi 1: STUDIO */}
                <button 
                  onClick={() => setView('studio')} 
                  className={`h-9 px-4 sm:px-5 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 active:scale-[0.98] ${
                    view === 'studio' 
                      ? isDarkTheme
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                        : 'bg-[#064E3B] text-white shadow-sm' 
                      : isDarkTheme ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/60'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>STUDIO</span>
                </button>

                {/* Posisi 2: ILM MODE */}
                <button 
                  onClick={() => setView('ads')} 
                  className={`h-9 px-4 sm:px-5 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 active:scale-[0.98] ${
                    view === 'ads' 
                      ? isDarkTheme
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                        : 'bg-[#064E3B] text-white shadow-sm' 
                      : isDarkTheme ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/60'
                  }`}
                  title="Mode Iklan Layanan Masyarakat (ILM)"
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>ILM MODE</span>
                </button>

                {/* Posisi 3: RIWAYAT */}
                <button 
                  onClick={() => setView('history')} 
                  className={`h-9 px-4 sm:px-5 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 active:scale-[0.98] ${
                    view === 'history' 
                      ? isDarkTheme
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                        : 'bg-[#064E3B] text-white shadow-sm' 
                      : isDarkTheme ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/60'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>RIWAYAT</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                    view === 'history' 
                      ? isDarkTheme ? 'bg-slate-950 text-emerald-400' : 'bg-emerald-950 text-emerald-200' 
                      : isDarkTheme ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {history.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Desktop Right Controls (Server Selector, Theme, Lab Suara, API Indicator, User, Keluar) */}
            <div className="hidden md:flex items-center gap-2 shrink-0 z-20">
              {/* Pilihan Server Suara Dropdown */}
              <div className="relative shrink-0" ref={serverDropdownRef}>
                <button 
                  type="button"
                  onClick={() => setIsServerDropdownOpen(prev => !prev)}
                  className={`h-9 px-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 shrink-0 border shadow-xs ${
                    isDarkTheme 
                      ? 'bg-[#14161B] border-[#20232B] text-zinc-300 hover:border-zinc-700 hover:text-white' 
                      : 'bg-zinc-100 hover:bg-zinc-200/70 border-zinc-200 text-zinc-700 hover:text-[#0C4E34]'
                  }`}
                  title="Pilihan Server Engine Suara (Klik untuk ganti server)"
                >
                  <Server className="w-4 h-4 text-[#F59E0B]" />
                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 shrink-0 ${
                    isServerDropdownOpen ? 'rotate-180 text-[#CCFF00]' : ''
                  }`} />
                </button>

                {/* Dropdown Menu Panah ke Bawah */}
                {isServerDropdownOpen && (
                  <div className={`absolute right-0 top-full mt-2 w-72 rounded-2xl border shadow-2xl z-50 p-2 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 ${
                    isDarkTheme 
                      ? 'bg-[#14161B] border-[#20232B] shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-white' 
                      : 'bg-white/95 border-zinc-200 shadow-[0_10px_30px_rgba(0,0,0,0.12)] text-zinc-800'
                  }`}>
                    <div className="px-3 py-1.5 text-[10px] font-black tracking-wider uppercase text-zinc-400 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-1">
                      <span>PILIH SERVER SUARA</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/20">
                        Aktif
                      </span>
                    </div>

                    {/* Gatot Kaca engine */}
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectEngine) onSelectEngine('gemini');
                        setIsServerDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between gap-2.5 ${
                        activeEngine === 'gemini'
                          ? isDarkTheme ? 'bg-[#181A20] border border-[#CCFF00]/50 text-[#CCFF00]' : 'bg-emerald-50 border border-emerald-300 text-[#0C4E34]'
                          : isDarkTheme ? 'hover:bg-[#181A20] text-zinc-300 hover:text-white' : 'hover:bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-[#CCFF00]/20 flex items-center justify-center shrink-0">
                          <Cpu className="w-4 h-4 text-[#CCFF00]" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold flex items-center gap-1.5">
                            <span className="truncate">Gatot Kaca Server</span>
                            <span className="text-[9px] px-1 py-0.2 rounded font-black bg-[#CCFF00]/20 text-[#CCFF00] shrink-0">Utama</span>
                          </div>
                          <div className="text-[10px] text-zinc-400 truncate">Neural Natural High-Fidelity</div>
                        </div>
                      </div>
                      {activeEngine === 'gemini' && (
                        <Check className="w-4 h-4 text-[#CCFF00] shrink-0" />
                      )}
                    </button>

                    {/* Server details modal trigger */}
                    <div className="mt-2 pt-1.5 border-t border-zinc-100 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => {
                          setIsServerDropdownOpen(false);
                          if (onOpenEngineModal) onOpenEngineModal();
                        }}
                        className={`w-full text-center py-1.5 px-2 rounded-lg text-[11px] font-bold transition-colors ${
                          isDarkTheme 
                            ? 'text-[#CCFF00] hover:bg-zinc-800/80 hover:text-white' 
                            : 'text-[#0C4E34] hover:bg-emerald-50'
                        }`}
                      >
                        Lihat Detail & Perbandingan Server →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Theme toggle */}
              <button 
                type="button"
                onClick={toggleTheme}
                className={`h-9 w-9 rounded-full border transition-all flex items-center justify-center shrink-0 shadow-xs ${
                  isDarkTheme 
                    ? 'bg-[#14161B] border-[#20232B] text-[#CCFF00] hover:bg-[#181A20] hover:scale-105' 
                    : 'bg-zinc-100 border-zinc-200 text-amber-600 hover:bg-zinc-200 hover:scale-105'
                }`}
                title={isDarkTheme ? "Mode Studio Gelap Aktif (Klik untuk beralih ke Mode Terang)" : "Mode Terang Aktif (Klik untuk beralih ke Studio Gelap)"}
              >
                {isDarkTheme ? <Moon className="w-4 h-4 fill-current text-[#CCFF00]" /> : <Sun className="w-4 h-4 fill-current text-amber-500" />}
              </button>

              {/* API status indicator */}
              <button
                type="button"
                onClick={() => setShowApiKeyModal(true)}
                className={`h-9 px-3 rounded-full border transition-all flex items-center gap-2 shrink-0 shadow-xs font-bold text-xs active:scale-[0.98] ${
                  apiQuotaStatus === 'limited'
                    ? 'bg-rose-950/80 border-rose-500 text-rose-300 hover:bg-rose-900 animate-pulse ring-2 ring-rose-500/50'
                    : apiQuotaStatus === 'active'
                    ? isDarkTheme ? 'bg-[#141A29] border-emerald-500/30 text-emerald-400 hover:border-emerald-500' : 'bg-emerald-50 border-emerald-200 text-[#064E3B] hover:bg-emerald-100'
                    : apiQuotaStatus === 'unconfigured'
                    ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 hover:bg-amber-900/40'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
                title={
                  apiQuotaStatus === 'limited' ? "PERINGATAN: Kuota API Limit (Klik untuk kelola kunci)" :
                  apiQuotaStatus === 'active' ? "Status: API Siap Digunakan (Klik untuk kelola kunci)" :
                  apiQuotaStatus === 'unconfigured' ? "Kunci API Belum Dikonfigurasi" : "Status API Key"
                }
              >
                <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                  {apiQuotaStatus === 'limited' && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  )}
                  {apiQuotaStatus === 'active' && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    apiQuotaStatus === 'limited' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)]' :
                    apiQuotaStatus === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' :
                    apiQuotaStatus === 'unconfigured' ? 'bg-amber-400' : 'bg-slate-400'
                  }`}></span>
                </span>
                <span className="hidden sm:inline">
                  {apiQuotaStatus === 'limited' ? 'API Limit (429)' : apiQuotaStatus === 'active' ? 'API Siap' : 'Set Key'}
                </span>
              </button>

              {/* Tombol Laboratorium Suara */}
              <button 
                type="button"
                onClick={() => setShowVoiceLabModal(true)}
                className={`h-9 px-3.5 rounded-full border transition-all flex items-center gap-2 shrink-0 shadow-xs font-bold text-xs ${
                  isDarkTheme 
                    ? 'bg-[#14161B] hover:bg-[#181A20] border-[#20232B] text-zinc-300 hover:text-white' 
                    : 'bg-zinc-100 hover:bg-zinc-200/80 border-zinc-200 text-slate-800'
                }`}
                title="Laboratorium Suara & Konfigurasi Karakter"
              >
                <FlaskConical className={`w-3.5 h-3.5 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-amber-500'}`} />
                <span>Lab Suara</span>
              </button>

              {/* Tombol Manajemen Akun & Audit */}
              <button 
                type="button"
                onClick={() => setShowUserManagementModal(true)}
                className={`h-9 px-3.5 rounded-full border transition-all flex items-center gap-2 shrink-0 shadow-xs font-bold text-xs ${
                  isDarkTheme 
                    ? 'bg-[#14161B] hover:bg-[#181A20] border-[#20232B] text-zinc-300 hover:text-white' 
                    : 'bg-zinc-100 hover:bg-zinc-200/80 border-zinc-200 text-slate-800'
                }`}
                title="Kelola Akun, Sandi, dan Riwayat Naskah"
              >
                <Users className={`w-3.5 h-3.5 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-emerald-600'}`} />
                <span>Akun & Audit</span>
              </button>

              <div className={`h-9 px-3 rounded-full border text-[11px] font-bold flex items-center gap-1.5 shrink-0 ${
                isDarkTheme 
                  ? 'bg-[#14161B] border-[#20232B] text-zinc-200' 
                  : 'bg-zinc-100 border-zinc-200/80 text-zinc-700'
              }`}>
                <User className={`w-3.5 h-3.5 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-700'}`} />
                <span className="max-w-[100px] truncate">{user?.name || 'TIM PRODUKSI'}</span>
              </div>

              <button
                onClick={onLogout}
                className={`h-9 px-3.5 rounded-full text-xs font-bold border transition-all shrink-0 ${
                  isDarkTheme 
                    ? 'text-zinc-400 hover:text-red-400 hover:bg-red-950/20 border-[#20232B]' 
                    : 'text-zinc-600 hover:text-red-700 hover:bg-red-50 border-zinc-200'
                }`}
                title="Kembali ke Landing Page / Keluar"
              >
                Keluar
              </button>
            </div>

            <div className="flex md:hidden items-center gap-2 z-20">
              <button 
                onClick={() => setShowVoiceLabModal(true)} 
                className="relative min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-amber-500 hover:text-amber-400 active:scale-95 transition-all"
                title="Lab Suara & Backend (Kurasi & Hide/Unhide)"
                aria-label="Buka Lab Suara"
              >
                <FlaskConical className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowApiKeyModal(true)} 
                className="relative min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white active:scale-95 transition-all"
                title="Pengaturan API"
                aria-label="Pengaturan API"
              >
                <Key className="w-5 h-5" />
                <span className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${
                  apiQuotaStatus === 'limited' ? 'bg-rose-500 animate-ping' :
                  apiQuotaStatus === 'active' ? 'bg-emerald-400' : 'bg-amber-400'
                }`}></span>
                <span className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${
                  apiQuotaStatus === 'limited' ? 'bg-rose-500' :
                  apiQuotaStatus === 'active' ? 'bg-emerald-400' : 'bg-amber-400'
                }`}></span>
              </button>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-zinc-700 dark:text-zinc-300 active:scale-95 transition-all"
                aria-label={isMenuOpen ? "Tutup menu studio" : "Buka menu studio"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {isMenuOpen && (
          <div className={`md:hidden border-b px-4 py-4 flex flex-col gap-2 transition-colors ${
            isDarkTheme ? 'bg-[#14161B] border-[#20232B] text-white' : 'bg-white border-zinc-200 text-zinc-700'
          }`}>
            <button onClick={() => handleSwitchView('studio')} className={`w-full min-h-[44px] px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-3 ${view === 'studio' ? (isDarkTheme ? 'bg-[#064E3B] text-emerald-300' : 'bg-[#064E3B] text-white') : isDarkTheme ? 'text-zinc-300 hover:bg-[#181A20]' : 'text-zinc-700 hover:bg-zinc-100'}`}>
              <Mic className="w-4 h-4" /> Studio
            </button>
            <button onClick={() => handleSwitchView('ads')} className={`w-full min-h-[44px] px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-3 ${view === 'ads' ? (isDarkTheme ? 'bg-[#064E3B] text-emerald-300' : 'bg-[#064E3B] text-white') : isDarkTheme ? 'text-zinc-300 hover:bg-[#181A20]' : 'text-zinc-700 hover:bg-zinc-100'}`}>
              <Megaphone className="w-4 h-4" /> Iklan Layanan Masyarakat (ILM)
            </button>
            <button onClick={() => { setIsMenuOpen(false); if (onOpenEngineModal) onOpenEngineModal(); }} className={`w-full min-h-[44px] px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-3 ${isDarkTheme ? 'text-zinc-200 hover:bg-[#181A20]' : 'text-emerald-700 hover:bg-zinc-100'}`}>
              <Server className={`w-4 h-4 ${isDarkTheme ? 'text-emerald-400' : 'text-[#F59E0B]'}`} /> Server: Gatot Kaca (Utama)
            </button>
            <button onClick={() => { setIsMenuOpen(false); setShowVoiceLabModal(true); }} className={`w-full min-h-[44px] px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-3 ${isDarkTheme ? 'text-zinc-200 hover:bg-[#181A20]' : 'text-amber-700 hover:bg-zinc-100'}`}>
              <FlaskConical className={`w-4 h-4 ${isDarkTheme ? 'text-amber-400' : 'text-[#F59E0B]'}`} />
              <span>Lab Suara & Backend</span>
            </button>
            <button onClick={() => { setIsMenuOpen(false); setShowUserManagementModal(true); }} className={`w-full min-h-[44px] px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-3 ${isDarkTheme ? 'text-zinc-200 hover:bg-[#181A20]' : 'text-emerald-800 hover:bg-zinc-100'}`}>
              <Users className={`w-4 h-4 ${isDarkTheme ? 'text-emerald-400' : 'text-emerald-700'}`} />
              <span>Manajemen Akun & Riwayat Naskah</span>
            </button>
            <button onClick={() => handleSwitchView('history')} className={`w-full min-h-[44px] px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-3 ${view === 'history' ? (isDarkTheme ? 'bg-[#064E3B] text-emerald-300' : 'bg-[#064E3B] text-white') : isDarkTheme ? 'text-zinc-300 hover:bg-[#181A20]' : 'text-zinc-700 hover:bg-zinc-100'}`}>
              <History className="w-4 h-4" /> Riwayat ({history.length})
            </button>
            <button onClick={() => { toggleTheme(); }} className={`w-full min-h-[44px] px-4 py-3 rounded-2xl text-sm font-bold flex items-center justify-between gap-3 border-t ${isDarkTheme ? 'border-[#20232B] text-zinc-200 hover:bg-[#181A20]' : 'border-zinc-100 text-zinc-800 hover:bg-zinc-100'}`}>
              <span className="flex items-center gap-3">
                {isDarkTheme ? <Moon className="w-4 h-4 text-emerald-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                <span>{isDarkTheme ? 'Mode Gelap (Aktif)' : 'Mode Terang (Aktif)'}</span>
              </span>
              <span className="text-xs text-slate-400 font-normal">Ganti Tema</span>
            </button>
            <button onClick={onLogout} className={`w-full min-h-[44px] px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-3 text-red-500 border-t mt-1 ${isDarkTheme ? 'border-[#20232B] hover:bg-red-950/20' : 'border-zinc-100 hover:bg-red-50'}`}>
              Keluar ke Landing Page
            </button>
          </div>
        )}
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* VIEW: KLONING SUARA */}
        {view === 'cloning' && (
          <div className={`rounded-3xl p-6 md:p-8 space-y-8 animate-in fade-in duration-300 transition-colors ${cardBg}`}>
            <div className={`border-b pb-5 ${isDarkTheme ? 'border-[#20232B]' : 'border-zinc-200'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl shadow-sm ${isDarkTheme ? 'bg-[#181A20] text-[#CCFF00] border border-[#20232B]' : 'bg-[#0C4E34] text-[#F59E0B]'}`}>
                  <Copy className="w-6 h-6" />
                </div>
                <div>
                  <h2 className={`text-2xl font-black flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-zinc-900'}`}>
                    Studio Kloning Suara <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase border ${isDarkTheme ? 'bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]/30' : 'bg-[#0C4E34]/20 text-[#10b981] border-emerald-500/20'}`}>Fitur Tambahan</span>
                  </h2>
                  <p className={`text-xs mt-0.5 ${subTextColor}`}>
                    Kloning warna vokal Anda atau tim untuk dijadikan karakter suara tersimpan di GENTRA.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rekam via Mic */}
              <div className={`p-6 rounded-3xl space-y-4 transition-colors ${subCardBg}`}>
                <div className={`flex items-center gap-2 font-bold text-sm ${isDarkTheme ? 'text-white' : 'text-[#0C4E34]'}`}>
                  <Mic className={`w-4 h-4 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-[#10b981]'}`} />
                  Opsi 1: Rekam Suara Langsung (Mikrofon)
                </div>
                <p className={`text-xs leading-relaxed ${subTextColor}`}>
                  Bacakan kalimat contoh ini selama 10–15 detik dengan suara artikulatif dan jelas:
                </p>
                <div className={`p-4 rounded-2xl border text-xs italic leading-relaxed ${
                  isDarkTheme ? 'bg-[#0E1014] border-[#20232B] text-zinc-300' : 'bg-white border-zinc-200 text-zinc-800'
                }`}>
                  “Sampurasun, ini adalah sampel rekaman suara asli saya untuk fitur kloning suara di Gentra. Ti teks jadi sora, mengubah teks menjadi audio berkualitas alami.”
                </div>

                <div className="pt-2">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <Mic className="w-4 h-4" />
                      MULAI REKAM SUARA
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="w-full py-3.5 bg-zinc-800 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all animate-pulse"
                    >
                      <Square className="w-4 h-4 fill-red-500 text-red-500" />
                      BERHENTI MEREKAM ({recordingSeconds}s)
                    </button>
                  )}
                </div>

                {recordedAudioUrl && (
                  <div className="pt-2">
                    <span className={`text-[11px] font-bold block mb-1 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-[#0C4E34]'}`}>Hasil Rekaman Suara:</span>
                    <audio src={recordedAudioUrl} controls className="w-full h-9" />
                  </div>
                )}
              </div>

              {/* Upload File */}
              <div className={`p-6 rounded-3xl space-y-4 flex flex-col justify-between transition-colors ${subCardBg}`}>
                <div>
                  <div className={`flex items-center gap-2 font-bold text-sm ${isDarkTheme ? 'text-white' : 'text-[#0C4E34]'}`}>
                    <Upload className={`w-4 h-4 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-[#10b981]'}`} />
                    Opsi 2: Unggah Sampel Audio (WAV/MP3)
                  </div>
                  <p className={`text-xs leading-relaxed mt-2 ${subTextColor}`}>
                    Unggah file audio yang jernih (minimal 5–30 detik suara bersih tanpa musik pengiring).
                  </p>
                </div>

                <label className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  isDarkTheme 
                    ? 'border-[#20232B] hover:border-[#CCFF00]/60 bg-[#0E1014]' 
                    : 'border-zinc-300 hover:border-[#0C4E34] bg-white'
                }`}>
                  <FileAudio className={`w-8 h-8 mb-2 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-zinc-400'}`} />
                  <span className={`text-xs font-bold text-center ${isDarkTheme ? 'text-zinc-200' : 'text-zinc-700'}`}>
                    {uploadedAudioFile ? uploadedAudioFile.name : "Pilih atau Tarik File Audio ke Sini"}
                  </span>
                  <span className={`text-[10px] mt-1 ${isDarkTheme ? 'text-zinc-500' : 'text-zinc-400'}`}>Format: .WAV, .MP3, .M4A</span>
                  <input type="file" accept="audio/*" className="hidden" onChange={(e) => setUploadedAudioFile(e.target.files[0] || null)} />
                </label>

                {uploadedAudioFile && (
                  <div className={`text-xs font-bold flex items-center gap-1.5 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-[#10b981]'}`}>
                    <CheckCircle className="w-4 h-4" /> File siap: {uploadedAudioFile.name}
                  </div>
                )}
              </div>
            </div>

            {/* Form Profil Karakter Kloning */}
            <div className={`p-6 rounded-3xl space-y-4 transition-colors ${subCardBg}`}>
              <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-zinc-800'}`}>
                <Edit3 className={`w-4 h-4 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-[#F59E0B]'}`} />
                Profil Karakter Hasil Kloning
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className={`text-[11px] font-bold uppercase ${subTextColor}`}>Nama Karakter</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Suara Dani / Suara Tim A" 
                    value={cloneName} 
                    onChange={(e) => setCloneName(e.target.value)}
                    className={`w-full p-3 rounded-xl text-sm outline-none transition-colors ${inputBg}`}
                  />
                </div>

                <div className="space-y-1">
                  <label className={`text-[11px] font-bold uppercase ${subTextColor}`}>Jenis Vokal</label>
                  <select 
                    value={cloneGender} 
                    onChange={(e) => setCloneGender(e.target.value)}
                    className={`w-full p-3 rounded-xl text-sm outline-none transition-colors ${inputBg}`}
                  >
                    <option value="Male">Pria</option>
                    <option value="Female">Wanita</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className={`text-[11px] font-bold uppercase ${subTextColor}`}>Logat / Aksen</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Logat Sunda / Santai" 
                    value={cloneAccent} 
                    onChange={(e) => setCloneAccent(e.target.value)}
                    className={`w-full p-3 rounded-xl text-sm outline-none transition-colors ${inputBg}`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className={`text-[11px] font-bold uppercase ${subTextColor}`}>Deskripsi Karakter</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Suara pria ramah, cocok untuk tutorial dan video presentasi..." 
                  value={cloneDesc} 
                  onChange={(e) => setCloneDesc(e.target.value)}
                  className={`w-full p-3 rounded-xl text-sm outline-none transition-colors ${inputBg}`}
                />
              </div>

              <button
                onClick={handleSaveClonedVoice}
                className={`w-full py-4 font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md ${
                  isDarkTheme 
                    ? 'bg-[#CCFF00] hover:bg-[#b8e600] text-black shadow-[#CCFF00]/10' 
                    : 'bg-[#0C4E34] hover:bg-[#0e5c3e] text-white'
                }`}
              >
                <PlusCircle className={`w-5 h-5 ${isDarkTheme ? 'text-black' : 'text-[#F59E0B]'}`} />
                SIMPAN KARAKTER KLONING KE DAFTAR SUARA GENTRA
              </button>
            </div>
          </div>
        )}

        {/* VIEW: STUDIO & ADS */}
        {(view === 'studio' || view === 'ads') && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            

            
            {/* IKLAN LAYANAN MASYARAKAT (ILM) COPYWRITING */}
            {view === 'ads' && (
              <div className={`rounded-3xl p-6 md:p-8 space-y-5 transition-colors ${cardBg}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`text-lg font-bold flex items-center gap-2.5 ${isDarkTheme ? 'text-white' : 'text-[#0C4E34]'}`}>
                      <Megaphone className={`w-5 h-5 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-[#F59E0B]'}`} />
                      Generator Naskah Iklan Layanan Masyarakat (ILM)
                    </h2>
                    <p className={`text-xs mt-0.5 ${subTextColor}`}>
                      Buat naskah himbauan, edukasi publik, dan kampanye sosial yang menyentuh dan berdampak.
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full font-bold border bg-[#181A20] text-[#CCFF00] border-[#20232B]">
                    Didukung Neural Natural Engine
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className={`text-xs font-bold uppercase ${isDarkTheme ? 'text-zinc-300' : 'text-zinc-600'}`}>Topik / Isu Layanan Masyarakat</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: Jaga Kebersihan Sungai / Bahaya DBD & 3M Plus / Hemat Air"
                      className={`w-full p-3.5 rounded-xl outline-none text-sm transition-colors ${inputBg}`}
                      value={ilmTopic}
                      onChange={(e) => setIlmTopic(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className={`text-xs font-bold uppercase ${isDarkTheme ? 'text-zinc-300' : 'text-zinc-600'}`}>Instansi / Penggagas Kampanye</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: Dinas Kesehatan / Komunitas Warga Peduli / RT-RW"
                      className={`w-full p-3.5 rounded-xl outline-none text-sm transition-colors ${inputBg}`}
                      value={ilmOrganization}
                      onChange={(e) => setIlmOrganization(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className={`text-xs font-bold uppercase flex items-center justify-between ${isDarkTheme ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      <span>Bahasa Naskah ILM</span>
                      <span className="text-[10px] text-emerald-400 font-normal">Pilihan Utama</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDialect('indonesia')}
                        className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-all truncate text-center flex items-center justify-center gap-1.5 ${
                          dialect !== 'sunda'
                            ? (isDarkTheme ? 'bg-[#CCFF00] border-[#CCFF00] text-black font-extrabold shadow-sm' : 'bg-[#0C4E34] border-emerald-600 text-white shadow-sm')
                            : isDarkTheme ? 'bg-[#0E1014] border-[#20232B] text-zinc-300 hover:border-[#3a3f4d]' : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300'
                        }`}
                      >
                        <span>Indonesia</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDialect('sunda')}
                        className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-all truncate text-center flex items-center justify-center gap-1.5 ${
                          dialect === 'sunda'
                            ? (isDarkTheme ? 'bg-[#CCFF00] border-[#CCFF00] text-black font-extrabold shadow-sm' : 'bg-[#0C4E34] border-emerald-600 text-white shadow-sm')
                            : isDarkTheme ? 'bg-[#0E1014] border-[#20232B] text-zinc-300 hover:border-[#3a3f4d]' : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300'
                        }`}
                      >
                        <span>Basa Sunda</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className={`text-xs font-bold uppercase ${isDarkTheme ? 'text-zinc-300' : 'text-zinc-600'}`}>Target Durasi Spot</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setIlmDuration('30s')}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                          ilmDuration === '30s'
                            ? (isDarkTheme ? 'bg-[#CCFF00] border-[#CCFF00] text-black font-extrabold shadow-sm' : 'bg-[#0C4E34] border-emerald-600 text-white shadow-sm')
                            : isDarkTheme 
                              ? 'bg-[#0E1014] border-[#20232B] text-zinc-300 hover:border-[#3a3f4d]' 
                              : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300'
                        }`}
                      >
                        Spot 30 Detik (Padat)
                      </button>
                      <button
                        type="button"
                        onClick={() => setIlmDuration('60s')}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                          ilmDuration === '60s'
                            ? (isDarkTheme ? 'bg-[#CCFF00] border-[#CCFF00] text-black font-extrabold shadow-sm' : 'bg-[#0C4E34] border-emerald-600 text-white shadow-sm')
                            : isDarkTheme 
                              ? 'bg-[#0E1014] border-[#20232B] text-zinc-300 hover:border-[#3a3f4d]' 
                              : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300'
                        }`}
                      >
                        Spot 60 Detik (Lengkap)
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className={`text-xs font-bold uppercase ${isDarkTheme ? 'text-zinc-300' : 'text-zinc-600'}`}>Gaya Penyampaian ILM</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {ILM_TONES.map(tone => (
                        <button
                          key={tone.id}
                          type="button"
                          onClick={() => setContentTone(tone.id)}
                          className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all truncate text-center ${
                            contentTone === tone.id 
                              ? (isDarkTheme ? 'bg-[#CCFF00] border-[#CCFF00] text-black font-extrabold shadow-sm' : 'bg-[#0C4E34] border-emerald-600 text-white shadow-sm')
                              : isDarkTheme 
                                ? 'bg-[#0E1014] border-[#20232B] text-zinc-300 hover:border-[#3a3f4d]' 
                                : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300'
                          }`}
                        >
                          {tone.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={`text-xs font-bold uppercase ${isDarkTheme ? 'text-zinc-300' : 'text-zinc-600'}`}>Pesan Pokok & Himbauan Khusus</label>
                  <textarea 
                    placeholder="Tuliskan poin himbauan penting yang harus disampaikan kepada warga... (Contoh: Menguras bak air seminggu sekali, menutup tempat penampungan air, dan segera periksa ke puskesmas jika demam tinggi)"
                    className={`w-full h-24 p-3.5 rounded-xl outline-none resize-none text-sm transition-colors ${inputBg}`}
                    value={ilmMessage}
                    onChange={(e) => setIlmMessage(e.target.value)}
                  ></textarea>
                </div>

                <button
                  disabled={isGeneratingCopy || !ilmTopic || !ilmMessage}
                  onClick={handleGenerateCopy}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    isGeneratingCopy 
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                      : 'bg-[#CCFF00] text-black hover:bg-[#b8e600] shadow-sm'
                  }`}
                >
                  {isGeneratingCopy ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4 text-black" />}
                  BUAT NASKAH ILM OTOMATIS
                </button>
              </div>
            )}

            {/* INPUT NASKAH UTAMA */}
            <div className={`rounded-3xl p-6 md:p-8 space-y-4 transition-colors ${cardBg}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Sparkles className={`w-5 h-5 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-800'}`} />
                  <h2 className={`text-base sm:text-lg font-bold tracking-wide ${headingColor}`}>
                    Input Teks
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEmotionTags(prev => !prev)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                      showEmotionTags
                        ? isDarkTheme 
                          ? 'bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]/40 font-bold' 
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : isDarkTheme 
                          ? 'bg-[#181B26] hover:bg-[#202534] text-zinc-300 border-[#282D3D]' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-700'}`} />
                    <span>{showEmotionTags ? 'Sembunyikan Tag Emosi' : 'Tag Emosi & Gaya'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setShowWhisperModal(true); setTranscribedText(''); setWhisperFile(null); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 shadow-sm ${
                      isDarkTheme 
                        ? 'border-[#282D3D] bg-[#181B26] hover:bg-[#202534] text-zinc-300 hover:text-white' 
                        : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                    title="Transkripsi Audio ke Naskah AI"
                  >
                    <Mic className={`w-3.5 h-3.5 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-700'}`} />
                    <span>Transkripsi Suara AI</span>
                  </button>
                </div>
              </div>

              {/* Indikator Kuota API Limit (HTTP 429) */}
              {apiQuotaStatus === 'limited' && !isQuotaBannerDismissed && (
                <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-500/80 text-rose-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200 shadow-lg">
                  <div className="flex items-start gap-3">
                    <span className="relative flex h-3.5 w-3.5 shrink-0 mt-0.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-80"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,1)]"></span>
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-rose-100 uppercase tracking-wide text-xs">Indikator Kuota API Limit</span>
                        <span className="px-1.5 py-0.5 rounded bg-rose-900/60 text-rose-300 font-mono text-[10px] font-bold">HTTP 429</span>
                      </div>
                      <p className="leading-relaxed opacity-90 mt-0.5">
                        Kuota Kunci Utama (Slot 1) mencapai batas. Silakan uji ulang atau buka Pengaturan API untuk menggunakan Slot Cadangan 2-8!
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleRetryTestQuota}
                      className="px-3 py-1.5 bg-rose-900/70 hover:bg-rose-800 text-rose-200 font-bold text-xs rounded-xl border border-rose-700/60 flex items-center gap-1.5 transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Uji Ulang Kuota
                    </button>
                    <button
                      onClick={() => setShowApiKeyModal(true)}
                      className="px-3.5 py-1.5 bg-[#CCFF00] hover:bg-[#b8e600] text-black font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
                    >
                      <Key className="w-3.5 h-3.5" />
                      Slot Cadangan (2-8)
                    </button>
                    <button
                      onClick={() => setIsQuotaBannerDismissed(true)}
                      className="p-1.5 rounded-lg text-rose-300 hover:text-white hover:bg-rose-900/60 transition-colors"
                      title="Tutup Notifikasi"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Alert Kuota / Generation Error Banner */}
              {generationError && (
                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
                  <div className="flex items-start gap-2.5">
                    <Shield className="w-5 h-5 text-[#CCFF00] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-sm text-white mb-0.5">Pemberitahuan Kuota API</span>
                      <p className="leading-relaxed opacity-90">{generationError}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setShowApiKeyModal(true)}
                      className="px-3.5 py-2 bg-[#CCFF00] hover:bg-[#b8e600] text-black font-bold text-xs rounded-xl transition-all shadow-sm"
                    >
                      Buka Pengaturan API (8 Slot)
                    </button>
                    <button
                      onClick={() => setGenerationError(null)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Status Engine Voicebox Active Banner */}
              {activeEngine === 'voicebox' && (
                <div className="px-4 py-2.5 rounded-2xl border text-xs flex items-center justify-between bg-teal-950/40 border-teal-800/60 text-teal-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                    <span className="font-bold">Engine Voicebox Local Aktif (Kokoro / Zero-Shot)</span>
                    <span className="text-[11px] opacity-80 hidden sm:inline">• Siap sintesis offline di localhost:17493</span>
                  </div>
                  <span className="text-[10px] font-mono bg-teal-900/60 text-teal-200 px-2 py-0.5 rounded font-bold">100% Offline Privasi</span>
                </div>
              )}

              {/* Toolbar Tag Emosi Paralinguistik Suara Alami (Collapsible) */}
              {showEmotionTags && (
                <div className={`p-3.5 rounded-2xl border space-y-2.5 transition-all animate-in fade-in duration-200 ${
                  isDarkTheme ? 'border-[#282D3D] bg-[#181B26]' : 'border-slate-200 bg-slate-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className={`w-3.5 h-3.5 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-700'}`} />
                      <span className={`text-[11px] font-black uppercase tracking-wider ${isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-800'}`}>
                        Tag Emosi & Gaya Bicara
                      </span>
                    </div>
                    <span className={`text-[10px] font-medium hidden sm:inline ${subTextColor}`}>
                      Klik tag untuk menyisipkan ke naskah suara
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {PARALINGUISTIC_EMOTION_TAGS.map((item) => (
                      <button
                        key={item.tag}
                        type="button"
                        onClick={() => insertEmotionTag(item.tag)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border active:scale-95 group ${
                          isDarkTheme 
                            ? 'border-[#282D3D] bg-[#141620] hover:bg-[#1E2230] hover:border-[#383E54] text-zinc-200' 
                            : 'border-slate-200 bg-white hover:bg-slate-100 hover:border-slate-300 text-slate-700 shadow-2xs'
                        }`}
                        title={`${item.label} — ${item.desc}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Textarea Input Naskah */}
              <div className={`rounded-2xl transition-colors p-4 border ${
                isDarkTheme 
                  ? 'bg-[#0E1017] border-[#262B3A] focus-within:border-[#CCFF00] focus-within:ring-1 focus-within:ring-[#CCFF00]/30' 
                  : 'bg-slate-50/70 border-slate-200 focus-within:border-slate-800 focus-within:bg-white focus-within:ring-1 focus-within:ring-slate-800/20'
              }`}>
                <textarea
                  ref={textareaRef}
                  className={`w-full h-48 bg-transparent outline-none transition-all resize-none font-medium text-base leading-relaxed ${
                    isDarkTheme ? 'text-zinc-100 placeholder:text-zinc-600' : 'text-slate-900 placeholder:text-slate-400'
                  }`}
                  placeholder="Tulis naskah Anda di sini..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                ></textarea>
              </div>

              {/* Info Statistik Naskah & Engine Status */}
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between text-xs font-medium gap-2 pt-1 ${subTextColor}`}>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span><strong className={isDarkTheme ? 'text-zinc-200' : 'text-slate-800'}>{text.length}</strong> Karakter</span>
                  <span>•</span>
                  <span><strong className={isDarkTheme ? 'text-zinc-200' : 'text-slate-800'}>{text.split(/\s+/).filter(Boolean).length}</strong> Kata</span>
                  <span>•</span>
                  <span>Estimasi: <strong className={`font-bold ${isDarkTheme ? 'text-amber-400' : 'text-amber-600'}`}>~{Math.ceil(text.split(/\s+/).filter(Boolean).length / 2.5)}s</strong> Durasi Siaran</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className={`w-2 h-2 rounded-full animate-pulse ${isDarkTheme ? 'bg-[#CCFF00] shadow-[0_0_8px_#CCFF00]' : 'bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.5)]'}`}></span>
                  <span className={`font-bold ${isDarkTheme ? 'text-zinc-300' : 'text-slate-700'}`}>
                    Neural High-Fidelity Engine • 24 kHz Lossless
                  </span>
                </div>
              </div>
            </div>

            {/* PILIH KARAKTER SUARA */}
            <div className={`rounded-3xl p-6 md:p-8 space-y-5 transition-colors ${cardBg}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <User className={`w-5 h-5 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-800'}`} />
                  <h2 className={`text-base sm:text-lg font-bold tracking-wide ${headingColor}`}>
                    Pilih Karakter Suara ({filteredVoices.length})
                  </h2>
                </div>

                {/* Category Pills Filter */}
                <div className={`flex items-center gap-1.5 p-1 rounded-xl border self-start sm:self-auto ${
                  isDarkTheme ? 'bg-[#0E1017] border-[#262B3A]' : 'bg-slate-100 border-slate-200'
                }`}>
                  <button
                    type="button"
                    onClick={() => setVoiceCategory('Nasional')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      voiceCategory === 'Nasional'
                        ? isDarkTheme ? 'bg-[#CCFF00] text-black font-extrabold shadow-sm' : 'bg-white text-slate-950 shadow-xs border border-slate-200/80'
                        : isDarkTheme ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Nasional ({voices.filter(v => v.category === 'Nasional' && !v.isHidden).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setVoiceCategory('Sunda')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      voiceCategory === 'Sunda'
                        ? isDarkTheme ? 'bg-[#CCFF00] text-black font-extrabold shadow-sm' : 'bg-white text-slate-950 shadow-xs border border-slate-200/80'
                        : isDarkTheme ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Sunda ({voices.filter(v => v.category === 'Sunda' && !v.isHidden).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setVoiceCategory('Semua')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      voiceCategory === 'Semua'
                        ? isDarkTheme ? 'bg-[#CCFF00] text-black font-extrabold shadow-sm' : 'bg-white text-slate-950 shadow-xs border border-slate-200/80'
                        : isDarkTheme ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Semua ({voices.filter(v => !v.isHidden).length})
                  </button>
                </div>
              </div>

              {/* 3-Column Voice Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredVoices.map(v => {
                  const isSelected = selectedVoice.name === v.name;
                  const hasAudio = checkVoiceHasPreview(v, previewAudioCache.current);
                  const isPlaying = previewingVoice === v.name;
                  return (
                    <div
                      key={`${v.id}-${v.name}`}
                      onClick={(e) => {
                        setSelectedVoice(v);
                        if (hasAudio) {
                          handlePreviewVoice(v, e);
                        }
                      }}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-150 flex items-center justify-between cursor-pointer select-none group active:scale-[0.99] ${
                        isSelected
                          ? isDarkTheme 
                            ? 'border-2 border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.18)]' 
                            : 'border-2 border-[#064E3B] bg-emerald-50/70 shadow-sm'
                          : isDarkTheme 
                            ? 'border border-slate-800 bg-[#141A29] hover:border-slate-700 hover:bg-[#1A2236]' 
                            : 'border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Avatar Icon */}
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                          isSelected
                            ? isDarkTheme ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm' : 'bg-[#064E3B] text-white shadow-sm'
                            : isDarkTheme ? 'bg-slate-800 text-slate-400 group-hover:text-slate-200' : 'bg-slate-100 text-slate-600 group-hover:text-slate-900'
                        }`}>
                          {isPlaying ? (
                            <div className="flex items-center gap-0.5 h-3.5">
                              <span className={`w-1 h-2.5 rounded-full animate-bounce ${isDarkTheme ? 'bg-slate-950' : 'bg-white'}`} />
                              <span className={`w-1 h-4 rounded-full animate-bounce [animation-delay:0.15s] ${isDarkTheme ? 'bg-slate-950' : 'bg-white'}`} />
                              <span className={`w-1 h-3 rounded-full animate-bounce [animation-delay:0.3s] ${isDarkTheme ? 'bg-slate-950' : 'bg-white'}`} />
                            </div>
                          ) : (
                            <User className="w-5 h-5 stroke-[2.2]" />
                          )}
                        </div>

                        {/* Name & Subtitle */}
                        <div className="min-w-0">
                          <h4 className={`font-bold text-sm truncate flex items-center gap-1.5 ${
                            isSelected 
                              ? isDarkTheme ? 'text-emerald-400 font-black' : 'text-[#064E3B] font-black' 
                              : isDarkTheme ? 'text-zinc-100' : 'text-slate-900'
                          }`}>
                            <span>{v.name}</span>
                          </h4>
                          <p className={`text-xs truncate mt-0.5 ${isDarkTheme ? 'text-zinc-400' : 'text-slate-500'}`}>
                            {v.desc} <span className="font-mono text-[10px] opacity-70">• {v.backendVoiceId || v.id}</span>
                          </p>
                        </div>
                      </div>

                      {/* Right Side Icons */}
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {hasAudio && (
                          <button
                            type="button"
                            onClick={(e) => handlePreviewVoice(v, e)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isPlaying
                                ? isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-900'
                                : isDarkTheme ? 'text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100' : 'text-slate-400 hover:text-slate-800 opacity-0 group-hover:opacity-100'
                            }`}
                            title="Dengarkan sampel vokal"
                          >
                            {isPlaying ? (
                              <Volume2 className={`w-4 h-4 animate-pulse ${isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-900'}`} />
                            ) : (
                              <Play className="w-4 h-4 fill-current" />
                            )}
                          </button>
                        )}

                        {isSelected && (
                          <Check className={`w-4 h-4 stroke-[3] ${isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-900'}`} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PENGATURAN GAYA BICARA & EMOSI */}
            <div className={`rounded-3xl p-6 md:p-8 space-y-5 transition-colors ${cardBg}`}>
              <div className="flex items-center gap-2.5">
                <Settings2 className={`w-5 h-5 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-800'}`} />
                <h2 className={`text-base sm:text-lg font-bold tracking-wide ${headingColor}`}>
                  Pengaturan Gaya Bicara & Emosi
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`space-y-6 p-6 rounded-2xl border transition-colors ${subCardBg}`}>
                  {/* Speed Fader */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <label className={`text-xs font-black uppercase tracking-wider block ${isDarkTheme ? 'text-zinc-200' : 'text-slate-800'}`}>
                          Kecepatan Bicara (Speed)
                        </label>
                        <span className={`text-[10px] font-medium ${subTextColor}`}>Laju artikulasi tempo pembacaan</span>
                      </div>
                      <span className={`text-xs font-mono tabular-nums font-bold px-2.5 py-1 rounded-lg border ${
                        isDarkTheme ? 'border-[#282D3D] bg-[#0E1017] text-[#CCFF00] font-bold' : 'border-slate-200 bg-white text-slate-900 shadow-2xs'
                      }`}>
                        {speed.toFixed(1)}x
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="0.6" 
                      max="1.6" 
                      step="0.1" 
                      value={speed} 
                      onChange={(e) => setSpeed(parseFloat(e.target.value))} 
                      className="w-full studio-fader cursor-pointer" 
                    />
                    <div className={`flex justify-between text-[10px] font-mono font-medium ${isDarkTheme ? 'text-zinc-500' : 'text-slate-400'}`}>
                      <span>0.6x (Khidmat/Santai)</span>
                      <span className={`font-bold ${isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-800'}`}>1.0x (Normal)</span>
                      <span>1.6x (Cepat/Komersial)</span>
                    </div>
                  </div>

                  {/* Pitch Fader */}
                  <div className={`space-y-2 pt-2 border-t ${isDarkTheme ? 'border-[#282D3D]' : 'border-slate-200'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <label className={`text-xs font-black uppercase tracking-wider block ${isDarkTheme ? 'text-zinc-200' : 'text-slate-800'}`}>
                          Tinggi Nada (Pitch Shift)
                        </label>
                        <span className={`text-[10px] font-medium ${subTextColor}`}>Resonansi timbre vokal (-6st s/d +6st)</span>
                      </div>
                      <span className={`text-xs font-mono tabular-nums font-bold px-2.5 py-1 rounded-lg border ${
                        isDarkTheme ? 'border-[#282D3D] bg-[#0E1017] text-[#CCFF00] font-bold' : 'border-slate-200 bg-white text-slate-900 shadow-2xs'
                      }`}>
                        {pitch > 0 ? `+${pitch}` : pitch} st
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="-6" 
                      max="6" 
                      step="1" 
                      value={pitch} 
                      onChange={(e) => setPitch(parseInt(e.target.value))} 
                      className="w-full studio-fader cursor-pointer" 
                    />
                    <div className={`flex justify-between text-[10px] font-mono font-medium ${isDarkTheme ? 'text-zinc-500' : 'text-slate-400'}`}>
                      <span>-6st (Deep Maskulin)</span>
                      <span className={`font-bold ${isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-800'}`}>0 (Kalibrasi Asli)</span>
                      <span>+6st (Cerah Melengking)</span>
                    </div>
                  </div>
                </div>

                {/* Grid Emosi */}
                <div className={`p-5 rounded-2xl border transition-colors ${subCardBg}`}>
                  <label className={`text-xs font-bold block mb-3 ${isDarkTheme ? 'text-zinc-200' : 'text-slate-800'}`}>Ekspresi Emosi</label>
                  <div className="grid grid-cols-3 gap-2">
                    {EMOTIONS.map((emo) => {
                      const isEmoSelected = emotion === emo.id;
                      return (
                        <button 
                          key={emo.id} 
                          onClick={() => setEmotion(emo.id)} 
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
                            isEmoSelected 
                              ? isDarkTheme 
                                ? 'bg-[#CCFF00] border-2 border-[#CCFF00] text-black font-black shadow-lg shadow-[#CCFF00]/25 scale-105' 
                                : 'bg-slate-950 border-2 border-slate-950 text-white shadow-md scale-105'
                              : isDarkTheme 
                                ? 'bg-[#0E1017] border-[#282D3D] text-zinc-300 hover:border-zinc-700 hover:text-white' 
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100 shadow-2xs'
                          }`}
                        >
                          <div className={isEmoSelected ? (isDarkTheme ? 'text-black' : 'text-white') : isDarkTheme ? 'text-zinc-400' : 'text-slate-500'}>
                            {emo.icon}
                          </div>
                          <span className="mt-1 text-[10px] uppercase tracking-wider font-extrabold">{emo.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION & PLAYER */}
            <div className="flex flex-col gap-4 mb-16">
              <button
                disabled={isGenerating || !text.trim()}
                onClick={handleGenerateAudio}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-base transition-all active:scale-[0.98] ${
                  isGenerating || !text.trim() 
                    ? isDarkTheme ? 'bg-slate-800/80 text-slate-500 border border-slate-700/60 cursor-not-allowed' : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                    : isDarkTheme 
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 cursor-pointer' 
                      : 'bg-[#064E3B] text-white hover:bg-[#043A2C] shadow-lg shadow-emerald-950/15 cursor-pointer'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className={`animate-spin w-5 h-5 ${isDarkTheme ? 'text-slate-950' : 'text-white'}`} />
                    <span>{progressStatus || "Menyintesis suara..."}</span>
                  </>
                ) : (
                  <>
                    <Play className={`fill-current w-5 h-5 ${isDarkTheme ? 'text-slate-950' : 'text-white'}`} />
                    <span>HASILKAN SUARA</span>
                  </>
                )}
              </button>

              {/* ANIMATED PROGRESS BAR */}
              {isGenerating && (
                <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 transition-all animate-in fade-in slide-in-from-top-2 duration-200 shadow-md ${
                  isDarkTheme ? 'border-[#282D3D] bg-[#141620]' : 'border-slate-200 bg-white'
                }`}>
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 truncate">
                      <Loader2 className={`w-4 h-4 animate-spin shrink-0 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-800'}`} />
                      <span className={`font-bold truncate ${isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-800'}`}>
                        {progressStatus || "Menyintesis suara..."}
                      </span>
                    </div>
                    <span className={`font-mono font-black text-sm shrink-0 ${isDarkTheme ? 'text-emerald-400' : 'text-[#064E3B]'}`}>
                      {generationProgress}%
                    </span>
                  </div>

                  <div className={`w-full h-3 rounded-full overflow-hidden p-0.5 border ${
                    isDarkTheme ? 'bg-[#0E1017] border-slate-800' : 'bg-slate-100 border-slate-200'
                  }`}>
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden shadow-xs ${
                        isDarkTheme ? 'bg-emerald-500' : 'bg-[#064E3B]'
                      }`}
                      style={{ width: `${Math.max(6, Math.min(100, generationProgress))}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                  </div>

                  <div className={`flex items-center justify-between text-[11px] ${subTextColor}`}>
                    <span>Karakter: <strong className={isDarkTheme ? 'text-slate-200' : 'text-slate-800'}>{selectedVoice.name}</strong> • Vokal: <strong className={isDarkTheme ? 'text-slate-200' : 'text-slate-800'}>{selectedVoice.desc || selectedVoice.accent || 'Alami'}</strong></span>
                    <span>{totalChunksCount > 1 ? `Segmen ${currentChunkIndex} dari ${totalChunksCount}` : 'Sintesis Akustik Alami'}</span>
                  </div>
                </div>
              )}

              {/* Player Output with Studio Resampling Master Selector */}
              {audioUrl && (
                <div className={`rounded-3xl p-6 border shadow-2xl animate-in slide-in-from-bottom-4 space-y-4 transition-colors ${
                  isDarkTheme ? 'border-slate-800 bg-[#141A29] text-slate-100' : 'border-slate-200 bg-white text-slate-900'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold flex items-center gap-2 uppercase tracking-wide ${headingColor}`}>
                          <CheckCircle className="w-5 h-5 text-emerald-600" /> Audio Selesai Diproses
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          isDarkTheme ? 'border-slate-800 bg-[#181B26] text-emerald-400' : 'border-slate-200 bg-emerald-50 text-[#064E3B]'
                        }`}>
                          {audioSampleRate === 48000 ? 'WAV 48 kHz (Broadcast)' : audioSampleRate === 44100 ? 'WAV 44.1 kHz (CD Studio)' : 'WAV 24 kHz (Vocoder)'}
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 ${subTextColor}`}>
                        Karakter: <strong className={headingColor}>{selectedVoice.name}</strong> ({selectedVoice.accent}) • Emosi: {emotion}
                      </p>
                    </div>

                    <a 
                      href={audioUrl} 
                      download={`gentra-${selectedVoice.name.toLowerCase().replace(/\s+/g, '-')}-${audioSampleRate / 1000}khz.wav`} 
                      className={`px-5 py-2.5 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-md shrink-0 active:scale-[0.98] ${
                        isDarkTheme ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/25' : 'bg-[#064E3B] hover:bg-[#043A2C] text-white shadow-emerald-950/20'
                      }`}
                    >
                      <Download className="w-4 h-4 stroke-[2.5]" /> UNDUH WAV ({audioSampleRate / 1000} kHz)
                    </a>
                  </div>

                  {/* Resampling Format Quick Selector */}
                  <div className={`p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors ${
                    isDarkTheme ? 'border-slate-800 bg-[#0E1017]' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Sliders className={`w-4 h-4 ${isDarkTheme ? 'text-emerald-400' : 'text-[#064E3B]'}`} />
                      <span className={`text-xs font-bold ${isDarkTheme ? 'text-slate-200' : 'text-slate-800'}`}>Standar Format Master Audio:</span>
                    </div>

                    <div className={`flex items-center gap-1.5 p-1 rounded-xl border text-xs font-bold ${
                      isDarkTheme ? 'border-slate-800 bg-[#12141D]' : 'border-slate-200 bg-white'
                    }`}>
                      <button
                        onClick={() => handleChangeSampleRate(48000)}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          audioSampleRate === 48000 
                            ? (isDarkTheme ? 'bg-emerald-500 text-slate-950 shadow-xs font-black' : 'bg-[#064E3B] text-white shadow-xs font-bold') 
                            : (isDarkTheme ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                        }`}
                        title="Standar Video Editing: Premiere Pro, DaVinci Resolve, Final Cut Pro"
                      >
                        48 kHz (Broadcast Video)
                      </button>

                      <button
                        onClick={() => handleChangeSampleRate(44100)}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          audioSampleRate === 44100 
                            ? (isDarkTheme ? 'bg-[#CCFF00] text-black shadow-xs font-black' : 'bg-slate-900 text-white shadow-xs font-bold') 
                            : (isDarkTheme ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                        }`}
                        title="Standar Studio Audio & Mastering: Pro Tools, Logic Pro, FL Studio, CD"
                      >
                        44.1 kHz (Studio CD)
                      </button>

                      <button
                        onClick={() => handleChangeSampleRate(24000)}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          audioSampleRate === 24000 
                            ? (isDarkTheme ? 'bg-[#CCFF00] text-black shadow-xs font-black' : 'bg-slate-900 text-white shadow-xs font-bold') 
                            : (isDarkTheme ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                        }`}
                        title="Output Asli Mentah Vocoder tanpa Resampling (Hemat Memori)"
                      >
                        24 kHz (Native Vocoder)
                      </button>
                    </div>
                  </div>

                  {/* TACTILE ANALOG BROADCAST EQUALIZER & STEREO VU METERS */}
                  <div className={`p-4 rounded-2xl border space-y-3 transition-colors ${
                    isDarkTheme ? 'bg-[#0E1017] border-[#222634] text-zinc-100' : 'bg-slate-950 border-slate-800 text-white'
                  }`}>
                    {/* Top Console Bar */}
                    <div className="flex items-center justify-between text-[11px] font-mono border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${isMainAudioPlaying ? 'bg-[#CCFF00] animate-ping' : 'bg-zinc-600'}`} />
                        <span className="font-bold tracking-wider uppercase text-[10px] text-[#CCFF00]">
                          {isMainAudioPlaying ? '● ON-AIR PLAYBACK' : '○ STANDBY MONITOR'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-400 font-tabular text-[10px]">
                        <span>{audioSampleRate / 1000} kHz • LINEAR PCM</span>
                        <span>•</span>
                        <span className="font-bold text-amber-400">{audioSampleRate === 48000 ? '768 kbps' : audioSampleRate === 44100 ? '705.6 kbps' : '384 kbps'}</span>
                      </div>
                    </div>

                    {/* 28-Band Spectrum Analyzer */}
                    <div className="h-12 flex items-end justify-between gap-1 pt-1 pb-1 px-1">
                      {[40, 65, 80, 55, 90, 75, 60, 85, 95, 70, 80, 60, 90, 100, 85, 70, 60, 75, 90, 65, 50, 70, 85, 60, 45, 55, 40, 30].map((h, bIdx) => {
                        const dynamicHeight = isMainAudioPlaying 
                          ? Math.max(15, Math.min(100, h * 0.9))
                          : Math.max(8, h * 0.15);
                        return (
                          <div key={bIdx} className="flex-1 flex flex-col justify-end h-full">
                            <div 
                              className={`w-full rounded-t-sm transition-all duration-150 ${
                                isMainAudioPlaying
                                  ? bIdx > 22 
                                    ? 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)] animate-meter' 
                                    : bIdx > 16 
                                    ? 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)] animate-meter' 
                                    : 'bg-[#CCFF00] shadow-[0_0_6px_rgba(204,255,0,0.8)] animate-meter'
                                  : 'bg-zinc-800/40'
                              }`}
                              style={{ 
                                height: `${dynamicHeight}%`,
                                animationDelay: `${(bIdx % 5) * 0.15}s`
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Analog Stereo VU Peak Bar */}
                    <div className="space-y-1.5 pt-1.5 border-t border-white/10 font-mono text-[9px] text-zinc-400">
                      <div className="flex items-center gap-2">
                        <span className="w-3 font-bold text-zinc-300">L</span>
                        <div className="flex-1 h-2 rounded bg-black/70 p-0.5 flex gap-0.5 overflow-hidden border border-white/5">
                          {Array.from({ length: 24 }).map((_, i) => (
                            <div 
                              key={i} 
                              className={`flex-1 rounded-[1px] transition-opacity duration-75 ${
                                i > 20 ? 'bg-rose-500' : i > 15 ? 'bg-amber-400' : 'bg-[#CCFF00]'
                              } ${isMainAudioPlaying && i < 19 ? 'opacity-100 shadow-[0_0_3px_currentColor]' : 'opacity-20'}`} 
                            />
                          ))}
                        </div>
                        <span className="w-9 text-right font-tabular font-bold text-[#CCFF00]">{isMainAudioPlaying ? '-3.2 dB' : '-inf'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 font-bold text-zinc-300">R</span>
                        <div className="flex-1 h-2 rounded bg-black/70 p-0.5 flex gap-0.5 overflow-hidden border border-white/5">
                          {Array.from({ length: 24 }).map((_, i) => (
                            <div 
                              key={i} 
                              className={`flex-1 rounded-[1px] transition-opacity duration-75 ${
                                i > 20 ? 'bg-rose-500' : i > 15 ? 'bg-amber-400' : 'bg-[#CCFF00]'
                              } ${isMainAudioPlaying && i < 18 ? 'opacity-100 shadow-[0_0_3px_currentColor]' : 'opacity-20'}`} 
                            />
                          ))}
                        </div>
                        <span className="w-9 text-right font-tabular text-[#CCFF00] font-bold">{isMainAudioPlaying ? '-3.8 dB' : '-inf'}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`rounded-2xl p-2 border transition-colors ${subCardBg}`}>
                    <audio 
                      ref={audioRef} 
                      controls 
                      src={audioUrl} 
                      className="w-full" 
                      autoPlay 
                      onPlay={() => setIsMainAudioPlaying(true)}
                      onPause={() => setIsMainAudioPlaying(false)}
                      onEnded={() => setIsMainAudioPlaying(false)}
                    />
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* VIEW: RIWAYAT */}
        {view === 'history' && (
          <div className={`rounded-3xl p-6 md:p-8 space-y-5 animate-in fade-in duration-300 transition-colors ${cardBg}`}>
            <div className={`flex items-center justify-between border-b pb-4 ${isDarkTheme ? 'border-[#222634]' : 'border-slate-200'}`}>
              <h2 className={`text-xl font-bold flex items-center gap-2.5 ${headingColor}`}>
                <History className="w-6 h-6 text-[#CCFF00]" /> Riwayat Voice Over Gentra
              </h2>
              {history.length > 0 && (
                <button 
                  onClick={() => setHistory([])}
                  className="text-xs text-zinc-400 hover:text-red-400 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" /> Hapus Semua
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                <Volume2 className="w-16 h-16 mb-3 opacity-20" />
                <p className={`text-sm font-bold ${isDarkTheme ? 'text-zinc-300' : 'text-slate-700'}`}>Belum ada riwayat suara.</p>
                <p className="text-xs text-zinc-500 mt-0.5">Audio yang telah Anda hasilkan akan muncul di sini.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map(item => (
                  <div key={item.id} className={`p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between transition-all gap-4 ${subCardBg} ${
                    isDarkTheme ? 'hover:border-[#CCFF00]/40' : 'hover:border-slate-300'
                  }`}>
                    <div className="flex-1 w-full md:w-auto">
                      <p className={`font-medium line-clamp-2 text-sm italic ${isDarkTheme ? 'text-zinc-200' : 'text-slate-800'}`}>
                        "{item.text}"
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                          isDarkTheme ? 'bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]/30 font-bold' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {item.voice}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] rounded-full border ${
                          isDarkTheme ? 'bg-[#181B26] text-zinc-300 border-[#2A2E3D]' : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {item.accent}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] rounded-full border ${
                          isDarkTheme ? 'bg-[#181B26] text-zinc-300 border-[#2A2E3D]' : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {item.emotion}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono ml-1">{item.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
                      <audio src={item.url} controls className="h-9 w-44" />
                      <a 
                        href={item.url} 
                        download={`gentra-${item.voice.toLowerCase()}.wav`} 
                        className={`p-2 rounded-xl transition-all border ${
                          isDarkTheme 
                            ? 'bg-[#181B26] hover:bg-[#CCFF00] text-zinc-300 hover:text-black font-bold border-[#2A2E3D]' 
                            : 'bg-white hover:bg-slate-900 hover:text-white text-slate-700 border-slate-200'
                        }`}
                        title="Unduh WAV"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button 
                        onClick={() => setHistory(history.filter(h => h.id !== item.id))} 
                        className={`p-2 rounded-xl transition-all ${
                          isDarkTheme ? 'text-zinc-400 hover:text-red-400 hover:bg-red-950/30' : 'text-zinc-400 hover:text-red-600 hover:bg-red-50'
                        }`}
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* MODAL: EDIT KARAKTER */}
      {editingVoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 transition-colors border ${
            isDarkTheme ? 'bg-[#12141D] border-[#222634] text-zinc-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex justify-between items-center border-b pb-3 ${isDarkTheme ? 'border-[#222634]' : 'border-slate-100'}`}>
              <h3 className={`text-base font-bold flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
                <Edit3 className="w-4 h-4 text-amber-500" />
                Ubah Profil Karakter Suara
              </h3>
              <button onClick={() => setEditingVoice(null)} className={`p-1 rounded-lg transition-colors ${isDarkTheme ? 'text-zinc-400 hover:text-white hover:bg-[#181B26]' : 'text-slate-400 hover:text-black hover:bg-slate-100'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className={`text-[10px] font-bold uppercase tracking-wider ${subTextColor}`}>Nama Karakter</label>
                <input 
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className={`w-full p-3 rounded-xl text-sm outline-none transition-colors ${inputBg}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-[10px] font-bold uppercase tracking-wider ${subTextColor}`}>Kategori</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className={`w-full p-3 rounded-xl text-sm outline-none transition-colors ${inputBg}`}
                >
                  <option value="Sunda">Sunda</option>
                  <option value="Nasional">Nasional</option>
                  <option value="Kloningan">Kloningan</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className={`text-[10px] font-bold uppercase tracking-wider ${subTextColor}`}>Aksen / Logat</label>
                <input 
                  type="text"
                  value={editForm.accent}
                  onChange={(e) => setEditForm({ ...editForm, accent: e.target.value })}
                  className={`w-full p-3 rounded-xl text-sm outline-none transition-colors ${inputBg}`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-[10px] font-bold uppercase tracking-wider ${subTextColor}`}>Deskripsi Karakter</label>
                <textarea 
                  value={editForm.desc}
                  onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })}
                  className={`w-full h-16 p-3 rounded-xl text-sm outline-none resize-none transition-colors ${inputBg}`}
                ></textarea>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setEditingVoice(null)}
                className={`flex-1 py-3 rounded-xl font-bold text-xs transition-colors ${
                  isDarkTheme ? 'bg-[#181B26] text-zinc-300 hover:bg-[#202534]' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                BATAL
              </button>
              <button
                onClick={handleSaveEditVoice}
                className="flex-1 py-3 rounded-xl font-bold text-xs bg-[#CCFF00] text-black font-black hover:bg-[#b8e600] shadow-sm transition-colors"
              >
                SIMPAN PERUBAHAN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CEPAT: PENGATURAN KUNCI API GEMINI (OPTIMASI IPAD & DUAL STORAGE) */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        isDarkTheme={isDarkTheme}
        geminiKeys={geminiKeys}
        onUpdateKey={handleUpdateGeminiKey}
        onSaveAllKeys={handleSaveAllGeminiKeys}
        isAdminUnlocked={isAdminUnlocked}
        setIsAdminUnlocked={setIsAdminUnlocked}
        currentUser={user}
        onOpenVoiceLabModal={(tab) => {
          setShowApiKeyModal(false);
          setShowVoiceLabModal(true);
        }}
      />

      {/* MODAL: LABORATORIUM PENGEMBANGAN SUARA & BACKEND ADMIN LENGKAP */}
      <VoiceLabModal
        isOpen={showVoiceLabModal}
        onClose={() => {
          setShowVoiceLabModal(false);
        }}
        isDarkTheme={isDarkTheme}
        voices={voices}
        onUpdateVoices={handleUpdateVoices}
        activeKeyPool={activeKeyPool}
        geminiKeys={geminiKeys}
        handleUpdateGeminiKey={handleUpdateGeminiKey}
        handleTestKey={handleTestKey}
        handleTestAllKeys={handleTestAllKeys}
        keyTestStatuses={keyTestStatuses}
        isTestingAll={isTestingAll}
        keyVisibility={keyVisibility}
        setKeyVisibility={setKeyVisibility}
        isAdminUnlocked={isAdminUnlocked}
        setIsAdminUnlocked={setIsAdminUnlocked}
        user={user}
        TTS_MODEL={TTS_MODEL}
        initialVoicesDefaults={INITIAL_VOICES}
        initialTab="lab"
      />

      {/* MODAL: MANAJEMEN PENGGUNA, KATA SANDI & RIWAYAT NASKAH (SELF-SERVICE AUDIT) */}
      <UserManagementModal
        isOpen={showUserManagementModal}
        onClose={() => setShowUserManagementModal(false)}
        isDarkTheme={isDarkTheme}
        currentUser={user}
        isAdminUnlocked={isAdminUnlocked}
        setIsAdminUnlocked={setIsAdminUnlocked}
      />

      {/* MODAL: TRANSKRIPSI SUARA GEMINI AI (SPEECH-TO-TEXT) */}
      {showWhisperModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`border w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl space-y-5 transition-colors ${
            isDarkTheme ? 'bg-[#12141D] border-[#222634] text-zinc-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex justify-between items-center border-b pb-3 ${isDarkTheme ? 'border-[#222634]' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${isDarkTheme ? 'bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30' : 'bg-emerald-50 text-emerald-800 border border-emerald-100'}`}>
                  <Mic className="w-5 h-5 text-[#CCFF00]" />
                </div>
                <div>
                  <h3 className={`text-base font-bold ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>Transkripsi Audio ke Naskah (Neural AI)</h3>
                  <p className={`text-[11px] ${subTextColor}`}>Ubah rekaman suara menjadi teks secara otomatis dengan teknologi Neural Multimodal.</p>
                </div>
              </div>
              <button onClick={() => setShowWhisperModal(false)} className={`p-1 rounded-lg transition-colors ${isDarkTheme ? 'text-zinc-400 hover:text-white hover:bg-[#181B26]' : 'text-slate-400 hover:text-black hover:bg-slate-100'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Upload Area */}
            <div className="space-y-3">
              <label className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all ${
                isDarkTheme ? 'border-[#2A2E3D] hover:border-[#CCFF00] bg-[#0E1017]' : 'border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100/50'
              }`}>
                <FileAudio className={`w-8 h-8 mb-2 ${isDarkTheme ? 'text-[#CCFF00]' : 'text-slate-400'}`} />
                <span className={`text-xs font-bold text-center ${isDarkTheme ? 'text-zinc-200' : 'text-slate-700'}`}>
                  {whisperFile ? whisperFile.name : "Pilih File Audio untuk Ditranskripsikan"}
                </span>
                <span className={`text-[10px] mt-1 ${subTextColor}`}>Mendukung format WAV, MP3, M4A, OGG</span>
                <input 
                  type="file" 
                  accept="audio/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const f = e.target.files[0] || null;
                    setWhisperFile(f);
                    setTranscribedText('');
                  }} 
                />
              </label>

              {whisperFile && (
                <div className={`flex items-center justify-between text-xs p-2.5 rounded-xl border ${
                  isDarkTheme ? 'bg-[#181B26] border-[#222634] text-zinc-300' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}>
                  <span className="truncate max-w-[280px]">File: {whisperFile.name}</span>
                  <span className="font-mono text-[10px]">{(whisperFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
              )}
            </div>

            {/* Action Transcribe */}
            <div>
              <button
                disabled={!whisperFile || isTranscribing}
                onClick={handleTranscribeAudio}
                className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  !whisperFile || isTranscribing 
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                    : isDarkTheme ? 'bg-[#CCFF00] text-black font-black hover:bg-[#b8e600] shadow-sm' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                }`}
              >
                {isTranscribing ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 text-amber-400" />
                    <span>{transcribeProgress || "Sedang Mentranskripsi..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>MULAI TRANSKRIPSI (NEURAL AI)</span>
                  </>
                )}
              </button>
            </div>

            {/* Hasil Transkripsi */}
            {transcribedText && (
              <div className={`space-y-3 pt-2 border-t ${isDarkTheme ? 'border-[#222634]' : 'border-slate-100'}`}>
                <label className={`text-xs font-bold block ${isDarkTheme ? 'text-zinc-200' : 'text-slate-700'}`}>Hasil Transkripsi Teks:</label>
                <div className={`p-3.5 rounded-xl text-sm font-medium max-h-40 overflow-y-auto leading-relaxed border ${
                  isDarkTheme ? 'bg-[#0E1017] border-[#222634] text-zinc-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}>
                  {transcribedText}
                </div>
                <button
                  onClick={handleApplyTranscribedText}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  SALIN & GUNAKAN DI EDITOR NASKAH STUDIO
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`py-10 text-center border-t mt-20 transition-colors ${
        isDarkTheme ? 'bg-[#0A0B10] border-[#1E2230] text-zinc-400' : 'bg-white border-slate-200 text-slate-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2">
            <span className={`text-base font-black ${isDarkTheme ? 'text-[#CCFF00]' : 'text-[#064E3B]'}`}>GENTRA</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              isDarkTheme 
                ? 'bg-[#14231A] text-[#4ADE80] border-[#166534]' 
                : 'bg-[#ECFDF5] text-[#064E3B] border-[#6EE7B7]'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
              v2.6.4
            </span>
            <span className="text-zinc-400 font-mono">|</span>
            <span className={`text-xs font-semibold ${isDarkTheme ? 'text-zinc-400' : 'text-[#526170]'}`}>Ti Téks Jadi Sora</span>
          </div>
          <p className="text-[11px] text-zinc-500 font-medium">
            © 2026 GENTRA • BANGKIT Beruang Ekosistem • Digital Audio Voice-Over Synthesis Platform
          </p>
        </div>
      </footer>
    </div>
  );
};

const ShieldCheckIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

export default GentraStudio;
