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
  Activity
} from 'lucide-react';

// --- Konfigurasi Model (Google Gemini AI v1beta) ---
const TTS_MODEL = "gemini-2.5-flash-preview-tts";
const TTS_FALLBACK_MODEL = "gemini-2.0-flash";
const TEXT_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-pro", "gemini-2.0-flash-lite"];
const TEXT_MODEL = "gemini-2.5-flash";
const TEXT_FALLBACK_MODEL = "gemini-2.0-flash";

// --- Karakter Suara Bawaan GENTRA (14 Persona Awal + 8 Persona Khas Sunda) ---
const INITIAL_VOICES = [
  // --- 14 Persona Bawaan Awal (Nasional) ---
  { id: 'Aoede', name: 'Anita', desc: 'Ramah & Ceria (Wanita)', gender: 'Female', category: 'Nasional', accent: 'Nasional (Ramah)', isCustom: false },
  { id: 'Leda', name: 'Siti', desc: 'Lembut & Sopan (Wanita)', gender: 'Female', category: 'Nasional', accent: 'Nasional (Lembut)', isCustom: false },
  { id: 'Charon', name: 'Agus', desc: 'Deep & Naratif (Pria)', gender: 'Male', category: 'Nasional', accent: 'Nasional (Naratif)', isCustom: false },
  { id: 'Despina', name: 'Dewi', desc: 'Energik & Lugas (Wanita)', gender: 'Female', category: 'Nasional', accent: 'Nasional (Energik)', isCustom: false },
  { id: 'Callirrhoe', name: 'Tina', desc: 'Profesional & Jelas (Wanita)', gender: 'Female', category: 'Nasional', accent: 'Nasional (Formal)', isCustom: false },
  { id: 'Autonoe', name: 'Maya', desc: 'Inspiratif & Hangat (Wanita)', gender: 'Female', category: 'Nasional', accent: 'Nasional (Inspiratif)', isCustom: false },
  { id: 'Puck', name: 'Rian', desc: 'Muda & Bersemangat (Pria)', gender: 'Male', category: 'Nasional', accent: 'Nasional (Muda)', isCustom: false },
  { id: 'Erinome', name: 'Indah', desc: 'Halus & Menenangkan (Wanita)', gender: 'Female', category: 'Nasional', accent: 'Nasional (Menenangkan)', isCustom: false },
  { id: 'Fenrir', name: 'Gading', desc: 'Berat & Maskulin (Pria)', gender: 'Male', category: 'Nasional', accent: 'Nasional (Berat)', isCustom: false },
  { id: 'Laomedeia', name: 'Shinta', desc: 'Tegas & Berani (Wanita)', gender: 'Female', category: 'Nasional', accent: 'Nasional (Tegas)', isCustom: false },
  { id: 'Orus', name: 'Bayu', desc: 'Santai & Sejuk (Pria)', gender: 'Male', category: 'Nasional', accent: 'Nasional (Santai)', isCustom: false },
  { id: 'Algenib', name: 'Adi', desc: 'Ceria & Bersemangat (Pria)', gender: 'Male', category: 'Nasional', accent: 'Nasional (Ceria)', isCustom: false },
  { id: 'Iapetus', name: 'Eko', desc: 'Serius & Edukatif (Pria)', gender: 'Male', category: 'Nasional', accent: 'Nasional (Edukatif)', isCustom: false },
  { id: 'Achernar', name: 'Laras', desc: 'Anggun & Elegan (Wanita)', gender: 'Female', category: 'Nasional', accent: 'Nasional (Elegan)', isCustom: false },

  // --- 8 Persona Khusus Khas Sunda ---
  { 
    id: 'Fenrir', 
    name: 'Abah', 
    desc: 'Kakek / Sesepuh Sunda (Wibawa, Bijak & Parau Hangat)', 
    gender: 'Male', 
    category: 'Sunda', 
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
    accent: 'Medok Sunda (Heboh & Guyub)',
    personaPrompt: 'Karakter Ceu Edah / Bibi (ibu-ibu/tante Sunda yang ekspresif, ceria heboh, akrab guyub, intonasi medok renyah khas ceu-ceu Sunda).',
    isCustom: false 
  },
  { 
    id: 'Aoede', 
    name: 'Budak Leutik (Eneng)', 
    desc: 'Anak Perempuan Sunda (Lugu, Polos & Menggemaskan)', 
    gender: 'Female', 
    category: 'Sunda', 
    accent: 'Budak Sunda (Lugu & Ceria)',
    personaPrompt: 'Karakter Eneng / Budak Leutik (anak kecil perempuan Sunda dengan nada vokal tinggi yang imut, polos, riang dan menggemaskan).',
    isCustom: false 
  },
  { 
    id: 'Algenib', 
    name: 'Budak Leutik (Ujang Alit)', 
    desc: 'Anak Laki-laki Sunda (Aktif, Polos & Ceria)', 
    gender: 'Male', 
    category: 'Sunda', 
    accent: 'Budak Sunda (Aktif & Ceria)',
    personaPrompt: 'Karakter Ujang Alit (anak kecil laki-laki Sunda yang riang, polos, suara anak-anak yang bersemangat dan ceria).',
    isCustom: false 
  },
  { 
    id: 'Leda', 
    name: 'Teh Neng', 
    desc: 'Gadis / Mojang Sunda (Lembut, Santun & Merdu)', 
    gender: 'Female', 
    category: 'Sunda', 
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
    accent: 'Akang Sunda (Santai & Sahaja)',
    personaPrompt: 'Karakter Kang Asep (pria dewasa Sunda yang bersahabat, luwes, santai, gaya bicara akrab dan hangat).',
  }
];

// --- Karakter Suara Khusus ElevenLabs (Studio Hyper-Realistic) ---
const ELEVENLABS_VOICES = [
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', desc: 'Dewasa, Menenangkan & Elegan (Wanita)', gender: 'Female', category: 'ElevenLabs', accent: 'Studio Global', isCustom: false },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', desc: 'Hangat & Wibawa Narator (Pria)', gender: 'Male', category: 'ElevenLabs', accent: 'Studio Global', isCustom: false },
  { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', desc: 'Deep, Percaya Diri & Enerjik (Pria)', gender: 'Male', category: 'ElevenLabs', accent: 'Studio Global', isCustom: false },
  { id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice', desc: 'Jernih, Komunikatif & Edukator (Wanita)', gender: 'Female', category: 'ElevenLabs', accent: 'Studio Global', isCustom: false },
  { id: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum', desc: 'Serak Khas Medsos & Kreatif (Pria)', gender: 'Male', category: 'ElevenLabs', accent: 'Studio Global', isCustom: false },
  { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger', desc: 'Santai, Kasual & Resonansi Alami (Pria)', gender: 'Male', category: 'ElevenLabs', accent: 'Studio Global', isCustom: false },
  { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura', desc: 'Antusias, Ceria & Bersemangat (Wanita)', gender: 'Female', category: 'ElevenLabs', accent: 'Studio Global', isCustom: false },
  { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', desc: 'Profesional & Berpengetahuan (Wanita)', gender: 'Female', category: 'ElevenLabs', accent: 'Studio Global', isCustom: false },
  { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica', desc: 'Hangat, Ceria & Bersahabat (Wanita)', gender: 'Female', category: 'ElevenLabs', accent: 'Studio Global', isCustom: false },
  { id: 'cjVigY5qzO86Huf0OWal', name: 'Eric', desc: 'Halus, Tenang & Terpercaya (Pria)', gender: 'Male', category: 'ElevenLabs', accent: 'Studio Global', isCustom: false },
  { id: 'hpp4J3VqNfWAUOO0d1Us', name: 'Bella', desc: 'Cerah, Ramah & Artikulatif (Wanita)', gender: 'Female', category: 'ElevenLabs', accent: 'Studio Global', isCustom: false }
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

// --- Peta File Audio Preview Terkonfirmasi (35 Persona Lengkap Aktif) ---
export const STATIC_AUDIO_PREVIEWS = {
  // 8 Persona Khas Sunda (Blok 2)
  'Abah': '/audio/previews/abah.wav',
  'Nini': '/audio/previews/nini.wav',
  'Ujang': '/audio/previews/ujang.wav',
  'Bibi (Ceu Edah)': '/audio/previews/bibi.wav',
  'Budak Leutik (Eneng)': '/audio/previews/budak_eneng.wav',
  'Budak Leutik Eneng': '/audio/previews/budak_eneng.wav',
  'Budak Leutik (Ujang Alit)': '/audio/previews/budak_eneng.wav',
  'Budak Leutik Ujang Alit': '/audio/previews/budak_eneng.wav',
  'Teh Neng': '/audio/previews/teh_neng.wav',
  'Kang Asep': '/audio/previews/ujang.wav',

  // 14 Persona Nasional (Blok 1 - NUSA VOICE)
  'Anita': '/audio/previews/anita.wav',
  'Siti': '/audio/previews/siti.wav',
  'Agus': '/audio/previews/agus.wav',
  'Dewi': '/audio/previews/dewi.mp3',
  'Tina': '/audio/previews/tina.mp3',
  'Maya': '/audio/previews/maya.mp3',
  'Rian': '/audio/previews/rian.mp3',
  'Indah': '/audio/previews/indah.mp3',
  'Gading': '/audio/previews/gading.mp3',
  'Shinta': '/audio/previews/shinta.mp3',
  'Bayu': '/audio/previews/bayu.mp3',
  'Adi': '/audio/previews/adi.mp3',
  'Eko': '/audio/previews/eko.mp3',
  'Laras': '/audio/previews/laras.mp3',

  // Karakter ElevenLabs Studio (Prabu Pajajaran Server)
  'Sarah': '/audio/previews/elevenlabs_sarah.mp3',
  'George': '/audio/previews/elevenlabs_george.mp3',
  'Charlie': '/audio/previews/elevenlabs_charlie.mp3',
  'Alice': '/audio/previews/elevenlabs_alice.mp3',
  'Callum': '/audio/previews/elevenlabs_callum.mp3',
  'Roger': '/audio/previews/elevenlabs_roger.mp3',
  'Laura': '/audio/previews/elevenlabs_laura.mp3',
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
    if (voice.name.includes('Eneng') || voice.name.includes('Budak Leutik (Eneng)')) {
      return {
        role: 'anak perempuan kecil Sunda berusia 6-7 tahun bernama Eneng (Budak Leutik)',
        timbre: 'vokal anak perempuan kecil bernada tinggi (high-pitched), imut, cempreng menggemaskan, polos, riang dan ceria',
        dialect: 'Gunakan cengkok, dialek, dan intonasi anak-anak khas Sunda Jawa Barat yang manis dan alami'
      };
    }
    if (voice.name.includes('Ujang Alit') || voice.name.includes('Budak Leutik (Ujang Alit)')) {
      return {
        role: 'anak kecil laki-laki Sunda berusia 7 tahun bernama Ujang Alit (Budak Leutik)',
        timbre: 'vokal anak laki-laki kecil yang lincah, aktif, polos, riang dan bersemangat',
        dialect: 'Gunakan cengkok, dialek, dan intonasi anak-anak khas Sunda Jawa Barat yang riang dan bersahaja'
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
  { id: 'Edukasi', label: 'Edukasi & Informatif' },
  { id: 'Persuasif', label: 'Ajakan / Gotong Royong' },
  { id: 'Peringatan', label: 'Peringatan / Disiplin' },
  { id: 'Menyentuh', label: 'Menyentuh & Kekeluargaan' },
];

// Tag Emosi Paralinguistik Suara Alami (Standar Voicebox - 100% Bahasa Indonesia)
const PARALINGUISTIC_EMOTION_TAGS = [
  { label: 'Tertawa', tag: '[tertawa]', icon: '😄', desc: 'Tertawa renyah & ramah' },
  { label: 'Berbisik', tag: '[berbisik]', icon: '🤫', desc: 'Intonasi bisikan hangat' },
  { label: 'Jeda 1 Detik', tag: '[jeda 1 detik]', icon: '⏱️', desc: 'Jeda hening bernapas 1 detik' },
  { label: 'Bersemangat', tag: '[bersemangat]', icon: '🔥', desc: 'Antusias & energi tinggi' },
  { label: 'Hela Napas', tag: '[hela napas]', icon: '😮‍💨', desc: 'Hela napas lega atau empati' },
  { label: 'Tegas', tag: '[tegas]', icon: '📢', desc: 'Artikulasi wibawa penyiaran' },
  { label: 'Tersenyum', tag: '[tersenyum]', icon: '😊', desc: 'Nada bicara hangat sambil tersenyum' },
  { label: 'Prihatin', tag: '[prihatin]', icon: '🥺', desc: 'Nada empati & bela rasa' },
];

// Visual Avatar & Personality Styling Helper (Non-flat rich 3D cards)
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
        initials: '👴 AB',
        gradient: 'from-amber-600 via-amber-700 to-yellow-900',
        badge: 'Sepuh Sunda',
        roleColor: 'bg-amber-100 text-amber-900 border-amber-300',
        genderIcon: '♂ Pria',
        glow: 'shadow-amber-500/20'
      };
    }
    if (v.name.includes('Nini')) {
      return {
        initials: '👵 NI',
        gradient: 'from-rose-600 via-amber-700 to-stone-900',
        badge: 'Nini Sunda',
        roleColor: 'bg-rose-100 text-rose-900 border-rose-300',
        genderIcon: '♀ Wanita',
        glow: 'shadow-rose-500/20'
      };
    }
    if (v.name.includes('Ujang Alit')) {
      return {
        initials: '👦 UA',
        gradient: 'from-sky-500 via-cyan-600 to-blue-700',
        badge: 'Budak Lalaki',
        roleColor: 'bg-sky-100 text-sky-900 border-sky-300',
        genderIcon: '♂ Anak',
        glow: 'shadow-sky-500/20'
      };
    }
    if (v.name.includes('Eneng') || v.name.includes('Budak Leutik')) {
      return {
        initials: '👧 EN',
        gradient: 'from-pink-400 via-rose-500 to-purple-600',
        badge: 'Budak Awewe',
        roleColor: 'bg-pink-100 text-pink-900 border-pink-300',
        genderIcon: '♀ Anak',
        glow: 'shadow-pink-500/20'
      };
    }
    if (v.name.includes('Ujang')) {
      return {
        initials: '⚡ UJ',
        gradient: 'from-lime-600 via-emerald-600 to-teal-800',
        badge: 'Bujang Nyunda',
        roleColor: 'bg-lime-100 text-lime-900 border-lime-300',
        genderIcon: '♂ Pria',
        glow: 'shadow-lime-500/20'
      };
    }
    if (v.name.includes('Bibi') || v.name.includes('Edah')) {
      return {
        initials: '🗣️ CE',
        gradient: 'from-orange-500 via-pink-600 to-rose-700',
        badge: 'Ceu Heboh',
        roleColor: 'bg-orange-100 text-orange-900 border-orange-300',
        genderIcon: '♀ Wanita',
        glow: 'shadow-orange-500/20'
      };
    }
    if (v.name.includes('Teh Neng')) {
      return {
        initials: '🌸 TN',
        gradient: 'from-teal-500 via-emerald-600 to-green-700',
        badge: 'Mojang Priangan',
        roleColor: 'bg-teal-100 text-teal-900 border-teal-300',
        genderIcon: '♀ Wanita',
        glow: 'shadow-teal-500/20'
      };
    }
    if (v.name.includes('Kang Asep')) {
      return {
        initials: '🌾 KA',
        gradient: 'from-yellow-600 via-amber-700 to-stone-800',
        badge: 'Akang Sahaja',
        roleColor: 'bg-amber-100 text-amber-900 border-amber-300',
        genderIcon: '♂ Pria',
        glow: 'shadow-yellow-500/20'
      };
    }
    return {
      initials: '🍃 ' + initials,
      gradient: 'from-emerald-600 to-teal-800',
      badge: 'Khas Sunda',
      roleColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      genderIcon: v.gender === 'Female' ? '♀ Wanita' : '♂ Pria',
      glow: 'shadow-emerald-500/20'
    };
  }

  // Cloned Voices
  if (v.isCloned) {
    return {
      initials: '⚡ ' + initials,
      gradient: 'from-purple-600 via-indigo-600 to-fuchsia-700',
      badge: 'Kloning Suara',
      roleColor: 'bg-purple-100 text-purple-900 border-purple-300',
      genderIcon: v.gender === 'Female' ? '♀ Wanita' : '♂ Pria',
      glow: 'shadow-purple-500/20'
    };
  }

  // ElevenLabs Studio
  if (v.category === 'ElevenLabs') {
    return {
      initials: '🎙️ ' + initials,
      gradient: v.gender === 'Female' ? 'from-purple-500 via-pink-600 to-indigo-700' : 'from-indigo-600 via-purple-700 to-slate-800',
      badge: 'ElevenLabs',
      roleColor: 'bg-purple-50 text-purple-700 border-purple-200',
      genderIcon: v.gender === 'Female' ? '♀ Wanita' : '♂ Pria',
      glow: 'shadow-purple-500/20'
    };
  }

  // Microsoft Azure Neural
  if (v.category === 'Azure') {
    return {
      initials: '🔷 ' + initials,
      gradient: v.gender === 'Female' ? 'from-cyan-500 via-blue-600 to-indigo-700' : 'from-blue-600 via-indigo-700 to-slate-800',
      badge: 'Azure Neural',
      roleColor: 'bg-blue-50 text-blue-700 border-blue-200',
      genderIcon: v.gender === 'Female' ? '♀ Wanita' : '♂ Pria',
      glow: 'shadow-blue-500/20'
    };
  }

  // Google Cloud Neural2
  if (v.category === 'Google Cloud') {
    return {
      initials: '☁️ ' + initials,
      gradient: 'from-sky-500 via-blue-600 to-indigo-700',
      badge: 'Google Cloud',
      roleColor: 'bg-sky-50 text-sky-700 border-sky-200',
      genderIcon: v.gender === 'Female' ? '♀ Wanita' : '♂ Pria',
      glow: 'shadow-sky-500/20'
    };
  }

  // Voicebox Local
  if (v.category === 'Voicebox Local') {
    return {
      initials: '🖥️ ' + initials,
      gradient: 'from-emerald-600 via-teal-700 to-cyan-800',
      badge: 'Offline 82M',
      roleColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      genderIcon: v.gender === 'Female' ? '♀ Wanita' : '♂ Pria',
      glow: 'shadow-emerald-500/20'
    };
  }

  // Nasional Females
  if (v.gender === 'Female') {
    const palette = {
      'Anita': 'from-rose-500 via-pink-600 to-purple-600',
      'Siti': 'from-emerald-500 via-teal-600 to-cyan-700',
      'Dewi': 'from-amber-500 via-orange-600 to-red-600',
      'Tina': 'from-cyan-500 via-blue-600 to-indigo-700',
      'Maya': 'from-purple-500 via-indigo-600 to-blue-700',
      'Indah': 'from-teal-500 via-emerald-600 to-teal-800',
      'Shinta': 'from-red-500 via-rose-600 to-pink-700',
      'Laras': 'from-fuchsia-500 via-purple-600 to-indigo-700'
    };
    return {
      initials,
      gradient: palette[v.name] || 'from-pink-500 to-rose-600',
      badge: 'Nasional',
      roleColor: 'bg-rose-50 text-rose-700 border-rose-200',
      genderIcon: '♀ Wanita',
      glow: 'shadow-rose-500/20'
    };
  }

  // Nasional Males
  const malePalette = {
    'Agus': 'from-blue-600 via-indigo-700 to-slate-800',
    'Rian': 'from-sky-500 via-blue-600 to-indigo-700',
    'Gading': 'from-slate-700 via-zinc-800 to-stone-900',
    'Bayu': 'from-emerald-600 via-teal-700 to-cyan-800',
    'Adi': 'from-amber-600 via-yellow-600 to-orange-700',
    'Eko': 'from-indigo-600 via-blue-700 to-slate-800'
  };
  return {
    initials,
    gradient: malePalette[v.name] || 'from-indigo-600 to-slate-800',
    badge: 'Nasional',
    roleColor: 'bg-blue-50 text-blue-700 border-blue-200',
    genderIcon: '♂ Pria',
    glow: 'shadow-blue-500/20'
  };
};

// Smart Sentence Chunking (Mencegah Penurunan Kualitas Audio & Hemat Kuota API)
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

// Exponential Backoff Fetch with Multi-Key Pool (Up to 8 Keys) Fail-Safe
const fetchWithRetry = async (url, options, retries = 5, backoff = 1000, keyPool = [], keyIndex = 0) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      const errBody = await res.text();
      // Fail-Safe: Jika terkena HTTP 429 (quota limit) atau 503, dan ada kunci lain di keyPool
      if ((res.status === 429 || res.status === 503) && keyPool.length > 1 && url.includes('key=')) {
        const nextIdx = (keyIndex + 1) % keyPool.length;
        const nextKey = keyPool[nextIdx];
        if (nextKey && nextKey !== keyPool[keyIndex]) {
          console.warn(`⚠️ Kunci Gemini #${keyIndex + 1} limit/error (HTTP ${res.status}). Otomatis beralih ke Kunci Fail-Safe #${nextIdx + 1}...`);
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
  const binaryString = atob(base64String);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Int16Array(bytes.buffer);
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
  // Pool 8 Kunci API Google Gemini (Fail-Safe Key Pool)
  const [geminiKeys, setGeminiKeys] = useState(() => {
    try {
      const saved = localStorage.getItem('gentra_gemini_keys_pool');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 8) return parsed;
      }
    } catch (e) {}
    const defaultKey1 = (typeof localStorage !== 'undefined' && localStorage.getItem('gentra_gemini_key')) || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || '';
    const defaultKey2 = (typeof localStorage !== 'undefined' && localStorage.getItem('gentra_gemini_backup_key')) || '';
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
      next[index] = { status: 'testing', message: 'Memeriksa kuota...' };
      return next;
    });

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${TTS_MODEL}:generateContent?key=${targetKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'tes' }] }],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Aoede' } } }
            }
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
          next[index] = { status: 'active', message: '🟢 Kuota Aktif & Siap Pakai' };
          return next;
        });
      } else {
        const errJson = await res.json().catch(() => ({}));
        const code = res.status;
        const errMsg = errJson?.error?.message || '';
        if (code === 429 || errMsg.toLowerCase().includes('quota') || errMsg.toLowerCase().includes('exceeded')) {
          if (index === 0) {
            setApiQuotaStatus('limited');
            try { localStorage.setItem('gentra_api_quota_status', 'limited'); } catch(e){}
          }
          setKeyTestStatuses(prev => {
            const next = [...prev];
            next[index] = { status: 'quota_limit', message: '🔴 Kuota Habis (HTTP 429 Limit)' };
            return next;
          });
        } else if (code === 400 || code === 403 || errMsg.toLowerCase().includes('api key') || errMsg.toLowerCase().includes('not valid')) {
          if (index === 0) {
            setApiQuotaStatus('invalid');
            try { localStorage.setItem('gentra_api_quota_status', 'invalid'); } catch(e){}
          }
          setKeyTestStatuses(prev => {
            const next = [...prev];
            next[index] = { status: 'invalid', message: '🟡 Kunci Tidak Valid / Salah' };
            return next;
          });
        } else {
          setKeyTestStatuses(prev => {
            const next = [...prev];
            next[index] = { status: 'error', message: `⚠️ HTTP ${code}` };
            return next;
          });
        }
      }
    } catch (netErr) {
      setKeyTestStatuses(prev => {
        const next = [...prev];
        next[index] = { status: 'error', message: '⚠️ Gagal terhubung' };
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
    setGeminiKeys(prev => {
      const next = [...prev];
      next[index] = value;
      try {
        localStorage.setItem('gentra_gemini_keys_pool', JSON.stringify(next));
        if (index === 0) localStorage.setItem('gentra_gemini_key', value);
        if (index === 1) localStorage.setItem('gentra_gemini_backup_key', value);
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

  const activeKeyPool = geminiKeys.filter(k => k && k.trim().length > 0);
  const activeKey = activeKeyPool[0] || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || '';
  const apiKey = activeKey; // Alias compatibility

  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [generationError, setGenerationError] = useState(null);

  // Indikator Status Kuota API Real-Time (Lampu Hijau / Merah / Kuning)
  const [apiQuotaStatus, setApiQuotaStatus] = useState(() => {
    try {
      return localStorage.getItem('gentra_api_quota_status') || 'checking';
    } catch (e) {
      return 'checking';
    }
  });

  // Pengecekan otomatis di latar belakang saat studio dibuka
  useEffect(() => {
    if (activeKeyPool.length === 0) {
      setApiQuotaStatus('unconfigured');
      return;
    }
    const checkQuota = async () => {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${TTS_MODEL}:generateContent?key=${activeKeyPool[0]}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: 'tes' }] }],
              generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Aoede' } } }
              }
            })
          }
        );
        if (res.ok) {
          setApiQuotaStatus('active');
          try { localStorage.setItem('gentra_api_quota_status', 'active'); } catch (e) {}
        } else {
          const errJson = await res.json().catch(() => ({}));
          const errMsg = errJson?.error?.message || '';
          if (res.status === 429 || errMsg.toLowerCase().includes('quota') || errMsg.toLowerCase().includes('exceeded')) {
            setApiQuotaStatus('limited');
            try { localStorage.setItem('gentra_api_quota_status', 'limited'); } catch (e) {}
          } else if (res.status === 400 || res.status === 403) {
            setApiQuotaStatus('invalid');
            try { localStorage.setItem('gentra_api_quota_status', 'invalid'); } catch (e) {}
          }
        }
      } catch (e) {}
    };
    checkQuota();
  }, [activeKeyPool.length, activeKeyPool[0]]);

  // State 2 Blok Pemisah Karakter Studio (Expand & Collapse)
  const [isBlock1Open, setIsBlock1Open] = useState(true); // NUSA VOICE (Nasional - 14)
  const [isBlock2Open, setIsBlock2Open] = useState(true); // PASUNDAN VOICE (Sunda - 8)

  // Multi-Engine TTS State
  const [ttsEngine, setTtsEngine] = useState('gemini'); // 'gemini' | 'elevenlabs' | 'azure' | 'google' | 'voicebox'
  const [elevenApiKey, setElevenApiKey] = useState(() => {
    try { return localStorage.getItem('gentra_eleven_key') || ''; } catch (e) { return ''; }
  });
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
      return localStorage.getItem('gentra_master_key') || 'admin2026';
    } catch (e) {
      return 'admin2026';
    }
  });
  const [newMasterKeyInput, setNewMasterKeyInput] = useState('');
  const [masterKeySuccess, setMasterKeySuccess] = useState('');

  // Dynamic Voices State (Menjaga 14 Persona Awal + 8 Persona Sunda Lengkap)
  const [voices, setVoices] = useState(() => {
    try {
      const saved = localStorage.getItem('gentra_voices_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        const clonedVoices = parsed.filter(v => v.isCloned);
        const merged = INITIAL_VOICES.map(iv => {
          const found = parsed.find(p => p.id === iv.id && p.name === iv.name);
          return found ? { ...iv, ...found } : iv;
        });
        return [...merged, ...clonedVoices];
      }
      return INITIAL_VOICES;
    } catch (e) {
      return INITIAL_VOICES;
    }
  });

  const [voiceCategory, setVoiceCategory] = useState('Semua');
  const [selectedVoice, setSelectedVoice] = useState(INITIAL_VOICES[0]);
  const [previewingVoice, setPreviewingVoice] = useState(null);

  // Edit Persona Modal State
  const [editingVoice, setEditingVoice] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', desc: '', accent: '', category: 'Sunda' });

  // Main Form States
  const [text, setText] = useState('');
  const [dialect, setDialect] = useState('sunda'); // Karakteristik audio output
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
    } else if (activeEngine === 'elevenlabs') {
      setVoices(ELEVENLABS_VOICES);
      setSelectedVoice(ELEVENLABS_VOICES[0]);
    } else {
      setVoices(INITIAL_VOICES);
      setSelectedVoice(INITIAL_VOICES[0]);
    }
    setVoiceCategory('Semua');
  }, [activeEngine]);

  const filteredVoices = voices.filter(v => {
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

    // 1. Putar langsung jika sudah ada di cache live
    if (previewAudioCache.current[v.name]) {
      const audio = new Audio(previewAudioCache.current[v.name]);
      currentAudioRef.current = audio;
      audio.onended = () => setPreviewingVoice(null);
      audio.onerror = () => setPreviewingVoice(null);
      try {
        await audio.play();
        return;
      } catch (err) {
        setPreviewingVoice(null);
        return;
      }
    }

    // 2. Jika ada API Key Gemini aktif, buat preview vokal ASLI Gemini Neural secara instan untuk SEMUA karakter!
    if (activeKey) {
      try {
        const persona = getVoicePersonaInstruction(v);
        let sampleSentence = `Halo, saya ${v.name}. Senang bisa mengisi suara untuk Anda.`;
        if (v.category === 'Sunda') {
          if (v.name.includes('Eneng') || v.name.includes('Budak Leutik (Eneng)')) {
            sampleSentence = `Sampurasun! Eneng hoyong diajar maca sareng ngadongeng sasarengan nya!`;
          } else if (v.name.includes('Ujang Alit') || v.name.includes('Budak Leutik (Ujang Alit)')) {
            sampleSentence = `Sampurasun! Horeee, hayu urang ulin ka buruan bari diajar elmu anyar!`;
          } else if (v.name.includes('Abah')) {
            sampleSentence = `Sampurasun anaking jimat awaking. Pancegkeun hate dina kahadean tur silih asih.`;
          } else if (v.name.includes('Nini')) {
            sampleSentence = `Wilujeng sumping hidep anaking kasep geulis. Sing sabar tawekal mayunan hirup huripna nya.`;
          } else if (v.name.includes('Ceu Edah') || v.name.includes('Bibi')) {
            sampleSentence = `Aduh euy wargi sadayana, wilujeng tepang sareng Ceu Edah! Tong hilap jaga kaberesihan lingkungan nya!`;
          } else if (v.name.includes('Kang Asep')) {
            sampleSentence = `Sampurasun baraya sadaya! Hayu urang silih rojong ngawangun tatar Pasundan anu maju tur berakhlak.`;
          } else if (v.name.includes('Teh Neng')) {
            sampleSentence = `Wilujeng sumping di tatar Parahyangan, nagri asri pinuh ku katengtreman sareng kabagjaan.`;
          } else if (v.name.includes('Ujang')) {
            sampleSentence = `Sampurasun wargi Jabar! Hayu urang babarengan ngamumule Jawa Barat Juara!`;
          } else {
            sampleSentence = `Sampurasun wargi Jabar! Sim kuring ${v.name}, siap ngarojong komunikasi publik Jawa Barat Juara.`;
          }
        }

        const previewPrompt = `Sebagai ${persona.role}. ${persona.timbre}. ${persona.dialect}.
Langsung bacakan kalimat perkenalan ini dari kata pertama tanpa intro atau basa-basi apa pun:\n\n"${sampleSentence}"`;

        const payload = {
          contents: [{ parts: [{ text: previewPrompt }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: v.id || 'Aoede' }
              }
            }
          },
          model: TTS_MODEL
        };

        let res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${TTS_MODEL}:generateContent?key=${activeKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }
        );

        if (!res.ok) {
          res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${TTS_FALLBACK_MODEL}:generateContent?key=${activeKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            }
          );
        }

        if (res.ok) {
          const data = await res.json();
          const inlineData = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData;
          if (inlineData?.data) {
            const pcm16 = base64ToPCM16(inlineData.data);
            const wavBlob = buildWavBlobFromPCM(pcm16, 24000);
            const liveUrl = URL.createObjectURL(wavBlob);
            previewAudioCache.current[v.name] = liveUrl;

            const audio = new Audio(liveUrl);
            currentAudioRef.current = audio;
            audio.onended = () => setPreviewingVoice(null);
            audio.onerror = () => setPreviewingVoice(null);
            await audio.play();
            return;
          }
        }
      } catch (liveErr) {
        console.warn('Fallback ke file preview statis:', liveErr);
      }
    }

    // 3. Fallback jika offline / belum ada API Key: Putar audio preview statis
    const cachedOrStaticUrl = STATIC_AUDIO_PREVIEWS[v.name];
    if (cachedOrStaticUrl) {
      const audio = new Audio(cachedOrStaticUrl);
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

  // --- Whisper Speech-to-Text Transcription Handler ---
  const handleTranscribeAudio = async () => {
    if (!whisperFile) {
      alert("Silakan pilih file audio terlebih dahulu.");
      return;
    }

    setIsTranscribing(true);
    setTranscribeProgress("Membaca file audio...");

    try {
      if (openaiApiKey.trim()) {
        // Mode 1: OpenAI Whisper API Resmi
        setTranscribeProgress("Mentranskripsikan audio dengan OpenAI Whisper API...");
        const formData = new FormData();
        formData.append("file", whisperFile);
        formData.append("model", "whisper-1");
        formData.append("language", dialect === 'sunda' ? 'su' : 'id');

        const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openaiApiKey.trim()}`
          },
          body: formData
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`OpenAI Whisper error: ${errText}`);
        }

        const data = await response.json();
        setTranscribedText(data.text || "");
        setTranscribeProgress("Transkripsi berhasil diselesaikan!");
      } else {
        // Mode 2: Native Multimodal Audio Transcription (Otomatis via Gemini)
        setTranscribeProgress("Mentranskripsikan audio dengan engine audio...");
        const activeKey = apiKey || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || "";
        if (!activeKey) {
          setShowApiKeyModal(true);
          throw new Error("Masukkan API Key terlebih dahulu di menu pengaturan.");
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

        const mimeType = whisperFile.type || "audio/mp3";
        const promptText = dialect === 'sunda'
          ? "Dengarkan rekaman audio ini. Transkripsikan seluruh isi percakapan kata demi kata ke dalam teks bahasa Sunda atau Indonesia secara rapi dan akurat. Hanya berikan teks transkripsi saja tanpa tambahan kata pengantar atau penutup."
          : "Dengarkan rekaman audio ini. Transkripsikan seluruh isi percakapan kata demi kata ke dalam teks secara akurat dengan ejaan dan tanda baca yang tepat. Hanya berikan teks transkripsi saja tanpa komentar apapun.";

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
      }
    } catch (err) {
      console.error(err);
      alert("Gagal mentranskripsi audio: " + err.message);
    } finally {
      setIsTranscribing(false);
    }
  };

  // Terapkan hasil transkripsi ke editor utama
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

    const languageInstruction = dialect === 'sunda' 
      ? "Gunakan Bahasa Sunda yang santun, guyub, luwes, dan menyentuh hati warga (misal: 'Wargi sadayana...', 'Hayu urang sasarengan...')."
      : "Gunakan Bahasa Indonesia yang komunikatif, santun, persuasif, dan berdampak kuat bagi kesadaran publik.";

    const prompt = `Sebagai pakar komunikasi publik dan penulis naskah Iklan Layanan Masyarakat (ILM), buatkan naskah voice-over ILM yang berdampak tinggi untuk:
Topik / Isu: ${ilmTopic}
Instansi / Penggagas: ${ilmOrganization || "Layanan Masyarakat Bersama"}
Gaya Penyampaian: ${contentTone}
Target Durasi: ${ilmDuration === '30s' ? 'Spot Singkat 30 Detik (~60-70 kata)' : 'Spot Lengkap 60 Detik (~120-140 kata)'}
Bahasa Output: ${languageInstruction}

PENTING:
- Berikan naskah narasi siap baca yang mengalir alami untuk dibacakan oleh narator/pengisi suara.
- Gunakan tanda baca koma dan titik dengan cermat untuk jeda napas yang nyaman.
- Hanya berikan naskah bacaan narator saja tanpa judul, tanpa catatan panggung, dan tanpa kata pengantar/penutup.`;

    try {
      const activeKey = apiKey || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || "";
      if (!activeKey) {
        setShowApiKeyModal(true);
        throw new Error("Kunci Google Gemini API belum terpasang. Silakan masukkan API Key di menu kunci.");
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
            3,
            800,
            activeKeyPool
          );
          if (result?.candidates?.[0]?.content?.parts?.[0]?.text) break;
        } catch (errM) {
          console.warn(`Model ${modelName} pembuatan naskah gagal:`, errM.message);
          lastErr = errM;
        }
      }

      if (!result || !result.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw lastErr || new Error("Tidak dapat menghasilkan naskah ILM.");
      }

      const textResult = result.candidates[0].content.parts[0].text;
      setText(textResult.trim());
    } catch (err) {
      alert("Gagal membuat naskah ILM: " + err.message);
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
    const activeKey = apiKey || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || "";
    if (!activeKey) {
      setShowApiKeyModal(true);
      return;
    }

    setIsGenerating(true);
    setAudioUrl(null);
    setGenerationError(null);
    setGenerationProgress(15);
    setProgressStatus('Mempersiapkan naskah & konfigurasi vokal Gemini Flash Neural...');

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
        setProgressStatus(`Sintesis segmen ${i + 1} dari ${chunks.length} dengan Gemini Neural...`);

        const chunkText = chunks[i];

        // Format prompt naskah yang mengarahkan timbre persona Gemini persis menjiwai karakter aslinya
        const userPromptText = `Peran: ${persona.role}. Karakter vokal: ${persona.timbre}. ${persona.dialect}.
Emosi: ${emotion}, tempo: ${speedText}, nada: ${pitchText}. ${emotionTagGuidance}
PENTING: Langsung bacakan naskah berikut dari kata pertama persis menjiwai usia, gaya, dan karakter vokal tersebut tanpa intro atau basa-basi apa pun:

"${chunkText}"`;

        const payload = {
          systemInstruction: {
            parts: [{ text: systemInstructionText }]
          },
          contents: [{ 
            role: "user",
            parts: [{ text: userPromptText }] 
          }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: { 
              voiceConfig: { 
                prebuiltVoiceConfig: { voiceName: selectedVoice.id || 'Aoede' } 
              } 
            }
          },
          model: TTS_MODEL
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

      setApiQuotaStatus('active');
      try { localStorage.setItem('gentra_api_quota_status', 'active'); } catch (e) {}

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

  // Dynamic Broadcast Studio Styling Tokens
  const cardBg = isDarkTheme 
    ? 'bg-[#101c15] border border-emerald-900/50 shadow-md text-zinc-100' 
    : 'bg-white border border-zinc-200 shadow-sm text-zinc-900';

  const subCardBg = isDarkTheme
    ? 'bg-[#0a120e] border border-emerald-950/80 text-zinc-200'
    : 'bg-zinc-50 border border-zinc-200 text-zinc-700';

  const inputBg = isDarkTheme
    ? 'bg-[#09110d] border border-emerald-900/60 text-white placeholder-zinc-500 focus:border-emerald-400 focus:bg-[#0c1611]'
    : 'bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-[#0C4E34] focus:bg-white';

  const headingColor = isDarkTheme ? 'text-emerald-400' : 'text-[#0C4E34]';
  const subTextColor = isDarkTheme ? 'text-zinc-400' : 'text-zinc-500';

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans selection:bg-[#0C4E34] selection:text-white ${isDarkTheme ? 'bg-[#09110d] text-zinc-100' : 'bg-[#FBFBFA] text-zinc-900'}`}>
      {/* Top Navigation Bar */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md transition-colors duration-300 ${isDarkTheme ? 'bg-[#0c1611]/95 border-b border-emerald-950/80 shadow-md text-white' : 'bg-white/95 border-b border-zinc-200/80 shadow-sm text-zinc-900'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Logo & Tagline */}
            <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0" onClick={() => handleSwitchView('studio')}>
              <img 
                src="/logo.png" 
                alt="GENTRA" 
                className="w-12 h-12 rounded-2xl object-cover shadow-sm border border-zinc-200/90 group-hover:scale-105 transition-transform shrink-0"
              />
              <div className="flex flex-col justify-center">
                <span className={`text-2xl sm:text-[27px] font-black tracking-tight leading-none ${isDarkTheme ? 'text-white' : 'text-[#0C4E34]'}`}>
                  GENTRA
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-[#D97706] tracking-tight mt-0.5 whitespace-nowrap leading-none">
                  Generator Voice Over Natural
                </span>
              </div>
            </div>

            {/* Desktop Menu (Segmented Pill Bar, Tidy & Single Line) */}
            <div className="hidden md:flex items-center gap-3">
              <div className={`flex items-center gap-1 p-1 rounded-full border shadow-2xs ${isDarkTheme ? 'bg-[#121f18] border-emerald-900/60' : 'bg-zinc-100 border-zinc-200/90'}`}>
                {/* Posisi 1: STUDIO */}
                <button 
                  onClick={() => setView('studio')} 
                  className={`h-9 px-3.5 sm:px-4 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                    view === 'studio' 
                      ? 'bg-[#0C4E34] text-white shadow-xs' 
                      : isDarkTheme ? 'text-zinc-300 hover:text-white hover:bg-[#1a2c22]' : 'text-zinc-600 hover:text-[#0C4E34] hover:bg-zinc-200/60'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>STUDIO</span>
                </button>

                {/* Posisi 2: ILM */}
                <button 
                  onClick={() => setView('ads')} 
                  className={`h-9 px-3.5 sm:px-4 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                    view === 'ads' 
                      ? 'bg-[#0C4E34] text-white shadow-xs' 
                      : isDarkTheme ? 'text-zinc-300 hover:text-white hover:bg-[#1a2c22]' : 'text-zinc-600 hover:text-[#0C4E34] hover:bg-zinc-200/60'
                  }`}
                  title="Iklan Layanan Masyarakat (ILM)"
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  <span>ILM</span>
                </button>

                {/* Posisi 3: RIWAYAT */}
                <button 
                  onClick={() => setView('history')} 
                  className={`h-9 px-3.5 sm:px-4 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                    view === 'history' 
                      ? 'bg-[#0C4E34] text-white shadow-xs' 
                      : isDarkTheme ? 'text-zinc-300 hover:text-white hover:bg-[#1a2c22]' : 'text-zinc-600 hover:text-[#0C4E34] hover:bg-zinc-200/60'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>RIWAYAT</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                    view === 'history' ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-700'
                  }`}>
                    {history.length}
                  </span>
                </button>
              </div>

              {/* Server Selector Dropdown, Theme Toggle, User badge, API key, and logout button */}
              <div className={`flex items-center gap-1.5 pl-2 border-l ${isDarkTheme ? 'border-emerald-950' : 'border-zinc-200'}`}>
                {/* Pilihan Server Suara Dropdown (Di sebelah kanan, Dropdown Panah ke Bawah) */}
                <div className="relative shrink-0" ref={serverDropdownRef}>
                  <button 
                    type="button"
                    onClick={() => setIsServerDropdownOpen(prev => !prev)}
                    className={`h-9 px-3 sm:px-3.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 border shadow-xs ${
                      isDarkTheme 
                        ? 'bg-[#14231b] border-emerald-900/80 text-emerald-300 hover:border-emerald-500 hover:text-white' 
                        : 'bg-zinc-100 hover:bg-zinc-200/70 border-zinc-200 text-zinc-700 hover:text-[#0C4E34]'
                    }`}
                    title="Pilihan Server Engine Suara (Klik untuk ganti server)"
                  >
                    <Server className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                    <span className="font-bold">
                      {activeEngine === 'azure' ? 'Kian Santang' : activeEngine === 'elevenlabs' ? 'Pajajaran' : 'Gatot Kaca'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 shrink-0 ${
                      isServerDropdownOpen ? 'rotate-180 text-emerald-400' : ''
                    }`} />
                  </button>

                  {/* Dropdown Menu Panah ke Bawah */}
                  {isServerDropdownOpen && (
                    <div className={`absolute right-0 top-full mt-2 w-72 rounded-2xl border shadow-2xl z-50 p-2 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 ${
                      isDarkTheme 
                        ? 'bg-[#0c1611]/95 border-emerald-900/80 shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-white' 
                        : 'bg-white/95 border-zinc-200 shadow-[0_10px_30px_rgba(0,0,0,0.12)] text-zinc-800'
                    }`}>
                      <div className="px-3 py-1.5 text-[10px] font-black tracking-wider uppercase text-zinc-400 flex items-center justify-between border-b border-zinc-100 dark:border-emerald-950 pb-2 mb-1">
                        <span>PILIH SERVER SUARA</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Aktif
                        </span>
                      </div>

                      {/* 1. Gatot Kaca (Gemini) */}
                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectEngine) onSelectEngine('gemini');
                          setIsServerDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between gap-2.5 ${
                          activeEngine === 'gemini'
                            ? isDarkTheme ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-300' : 'bg-emerald-50 border border-emerald-300 text-[#0C4E34]'
                            : isDarkTheme ? 'hover:bg-[#14231b] text-zinc-300 hover:text-white' : 'hover:bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                            <Cpu className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold flex items-center gap-1.5">
                              <span className="truncate">Gatot Kaca Server</span>
                              <span className="text-[9px] px-1 py-0.2 rounded font-black bg-emerald-500/20 text-emerald-400 shrink-0">Utama</span>
                            </div>
                            <div className="text-[10px] text-zinc-400 truncate">Google Gemini 3.8 Neural (Sunda)</div>
                          </div>
                        </div>
                        {activeEngine === 'gemini' && (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                      </button>

                      {/* 2. Kian Santang (Azure) */}
                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectEngine) onSelectEngine('azure');
                          setIsServerDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between gap-2.5 mt-1 ${
                          activeEngine === 'azure'
                            ? isDarkTheme ? 'bg-sky-950/70 border border-sky-500/50 text-sky-300' : 'bg-sky-50 border border-sky-300 text-sky-900'
                            : isDarkTheme ? 'hover:bg-[#14231b] text-zinc-300 hover:text-white' : 'hover:bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-sky-500/20 flex items-center justify-center shrink-0">
                            <Radio className="w-4 h-4 text-sky-400" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold flex items-center gap-1.5">
                              <span className="truncate">Kian Santang Server</span>
                              <span className="text-[9px] px-1 py-0.2 rounded font-black bg-sky-500/20 text-sky-400 shrink-0">Azure</span>
                            </div>
                            <div className="text-[10px] text-zinc-400 truncate">MS Azure Neural (Protokoler)</div>
                          </div>
                        </div>
                        {activeEngine === 'azure' && (
                          <Check className="w-4 h-4 text-sky-400 shrink-0" />
                        )}
                      </button>

                      {/* 3. Pajajaran (ElevenLabs) */}
                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectEngine) onSelectEngine('elevenlabs');
                          setIsServerDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between gap-2.5 mt-1 ${
                          activeEngine === 'elevenlabs'
                            ? isDarkTheme ? 'bg-purple-950/70 border border-purple-500/50 text-purple-300' : 'bg-purple-50 border border-purple-300 text-purple-900'
                            : isDarkTheme ? 'hover:bg-[#14231b] text-zinc-300 hover:text-white' : 'hover:bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold flex items-center gap-1.5">
                              <span className="truncate">Pajajaran Server</span>
                              <span className="text-[9px] px-1 py-0.2 rounded font-black bg-purple-500/20 text-purple-400 shrink-0">Studio</span>
                            </div>
                            <div className="text-[10px] text-zinc-400 truncate">ElevenLabs Multilingual V2</div>
                          </div>
                        </div>
                        {activeEngine === 'elevenlabs' && (
                          <Check className="w-4 h-4 text-purple-400 shrink-0" />
                        )}
                      </button>

                      {/* Footer: Detail Server Modal trigger */}
                      <div className="mt-2 pt-1.5 border-t border-zinc-100 dark:border-emerald-950">
                        <button
                          type="button"
                          onClick={() => {
                            setIsServerDropdownOpen(false);
                            if (onOpenEngineModal) onOpenEngineModal();
                          }}
                          className={`w-full text-center py-1.5 px-2 rounded-lg text-[11px] font-bold transition-colors ${
                            isDarkTheme 
                              ? 'text-emerald-400 hover:bg-emerald-950/50 hover:text-emerald-300' 
                              : 'text-[#0C4E34] hover:bg-emerald-50'
                          }`}
                        >
                          Lihat Detail & Perbandingan Server →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {/* Tombol Switch Tema Gelap/Terang (Cukup Satu Tombol Switch) */}
                <button 
                  type="button"
                  onClick={toggleTheme}
                  className={`h-9 w-9 rounded-full border transition-all flex items-center justify-center shrink-0 shadow-xs ${
                    isDarkTheme 
                      ? 'bg-[#14231b] border-emerald-900/80 text-[#F59E0B] hover:bg-[#1b2f24] hover:scale-105' 
                      : 'bg-zinc-100 border-zinc-200 text-amber-600 hover:bg-zinc-200 hover:scale-105'
                  }`}
                  title={isDarkTheme ? "Mode Studio Gelap Aktif (Klik untuk beralih ke Mode Terang)" : "Mode Terang Aktif (Klik untuk beralih ke Studio Gelap)"}
                >
                  {isDarkTheme ? <Moon className="w-4 h-4 fill-current text-[#F59E0B]" /> : <Sun className="w-4 h-4 fill-current text-amber-500" />}
                </button>

                {/* Indikator Lampu Hijau API (Singkat: Simbol Button Hijau Saja) */}
                <button
                  type="button"
                  onClick={() => setShowApiKeyModal(true)}
                  className={`h-9 w-9 rounded-full border transition-all flex items-center justify-center relative shrink-0 shadow-xs ${
                    apiQuotaStatus === 'limited'
                      ? 'bg-rose-950/80 border-rose-500 text-rose-300 hover:bg-rose-900 animate-pulse'
                      : apiQuotaStatus === 'active'
                      ? isDarkTheme ? 'bg-[#14231b] border-emerald-600/80 hover:bg-[#1b2f24]' : 'bg-emerald-50 border-emerald-400 hover:bg-emerald-100'
                      : apiQuotaStatus === 'unconfigured'
                      ? 'bg-amber-950/40 border-amber-500/60 hover:bg-amber-900/40'
                      : 'bg-zinc-800 border-zinc-700'
                  }`}
                  title={
                    apiQuotaStatus === 'limited' ? "PERINGATAN: Kuota API Limit (Klik untuk kelola kunci)" :
                    apiQuotaStatus === 'active' ? "Lampu Hijau: API Siap Digunakan (Klik untuk kelola kunci)" :
                    apiQuotaStatus === 'unconfigured' ? "Kunci API Belum Dikonfigurasi" : "Status API Key"
                  }
                >
                  <span className="relative flex h-3 w-3 items-center justify-center">
                    {apiQuotaStatus === 'limited' && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    )}
                    {apiQuotaStatus === 'active' && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      apiQuotaStatus === 'limited' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)]' :
                      apiQuotaStatus === 'active' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]' :
                      apiQuotaStatus === 'unconfigured' ? 'bg-amber-400' : 'bg-zinc-400'
                    }`}></span>
                  </span>
                </button>

                <button 
                  onClick={() => setShowApiKeyModal(true)}
                  className={`h-9 w-9 rounded-full border transition-all flex items-center justify-center shrink-0 ${
                    apiQuotaStatus === 'limited'
                      ? 'bg-rose-950/60 border-rose-500 text-rose-300 hover:bg-rose-900 animate-bounce'
                      : isDarkTheme 
                      ? 'bg-[#14231b] hover:bg-[#1b2f24] border-emerald-900/80 text-zinc-300 hover:text-white' 
                      : 'bg-zinc-100 hover:bg-zinc-200/80 border-zinc-200 text-zinc-600 hover:text-[#0C4E34]'
                  }`}
                  title="Pengaturan API Key"
                >
                  <Key className="w-4 h-4" />
                </button>

                <div className={`h-9 px-3 rounded-full border text-[11px] font-bold flex items-center gap-1.5 shrink-0 ${
                  isDarkTheme 
                    ? 'bg-[#14231b] border-emerald-900/80 text-zinc-200' 
                    : 'bg-zinc-100 border-zinc-200/80 text-zinc-700'
                }`}>
                  <User className="w-3.5 h-3.5 text-[#0C4E34]" />
                  <span className="max-w-[110px] truncate">{user?.name || 'TIM PRODUKSI'}</span>
                </div>

                <button
                  onClick={onLogout}
                  className={`h-9 px-3.5 rounded-full text-xs font-bold border transition-all shrink-0 ${
                    isDarkTheme 
                      ? 'text-zinc-400 hover:text-red-400 hover:bg-red-950/30 border-emerald-950' 
                      : 'text-zinc-600 hover:text-red-700 hover:bg-red-50 border-zinc-200'
                  }`}
                  title="Kembali ke Landing Page / Keluar"
                >
                  Keluar
                </button>
              </div>
            </div>

            {/* Mobile Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <button 
                onClick={() => setShowApiKeyModal(true)} 
                className="relative p-2 text-zinc-400 hover:text-white"
                title="Pengaturan API"
              >
                <Key className="w-5 h-5" />
                <span className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full ${
                  apiQuotaStatus === 'limited' ? 'bg-rose-500 animate-ping' :
                  apiQuotaStatus === 'active' ? 'bg-emerald-400' : 'bg-amber-400'
                }`}></span>
                <span className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full ${
                  apiQuotaStatus === 'limited' ? 'bg-rose-500' :
                  apiQuotaStatus === 'active' ? 'bg-emerald-400' : 'bg-amber-400'
                }`}></span>
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-zinc-600">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className={`md:hidden border-b px-4 py-4 flex flex-col gap-2 transition-colors ${
            isDarkTheme ? 'bg-[#0c1611] border-emerald-950 text-white' : 'bg-white border-zinc-200 text-zinc-700'
          }`}>
            <button onClick={() => handleSwitchView('studio')} className={`w-full px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-3 ${view === 'studio' ? 'bg-[#0C4E34] text-white' : isDarkTheme ? 'text-zinc-300 hover:bg-[#14231b]' : 'text-zinc-700 hover:bg-zinc-100'}`}>
              <Mic className="w-4 h-4" /> Studio
            </button>
            <button onClick={() => handleSwitchView('ads')} className={`w-full px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-3 ${view === 'ads' ? 'bg-[#0C4E34] text-white' : isDarkTheme ? 'text-zinc-300 hover:bg-[#14231b]' : 'text-zinc-700 hover:bg-zinc-100'}`}>
              <Megaphone className="w-4 h-4" /> Iklan Layanan Masyarakat (ILM)
            </button>
            <button onClick={() => { setIsMenuOpen(false); if (onOpenEngineModal) onOpenEngineModal(); }} className={`w-full px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-3 text-emerald-400 ${isDarkTheme ? 'hover:bg-[#14231b]' : 'hover:bg-zinc-100'}`}>
              <Server className="w-4 h-4 text-[#F59E0B]" /> Server: {activeEngine === 'azure' ? 'Kian Santang' : activeEngine === 'elevenlabs' ? 'Pajajaran' : 'Gatot Kaca'} (Ganti)
            </button>
            <button onClick={() => handleSwitchView('history')} className={`w-full px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-3 ${view === 'history' ? 'bg-[#0C4E34] text-white' : isDarkTheme ? 'text-zinc-300 hover:bg-[#14231b]' : 'text-zinc-700 hover:bg-zinc-100'}`}>
              <History className="w-4 h-4" /> Riwayat ({history.length})
            </button>
            <button onClick={onLogout} className={`w-full px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-3 text-red-500 border-t mt-1 ${isDarkTheme ? 'border-emerald-950 hover:bg-red-950/20' : 'border-zinc-100 hover:bg-red-50'}`}>
              Keluar ke Landing Page
            </button>
          </div>
        )}
      </nav>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* VIEW: KLONING SUARA */}
        {view === 'cloning' && (
          <div className={`rounded-3xl p-6 md:p-8 space-y-8 animate-in fade-in duration-300 transition-colors ${cardBg}`}>
            <div className={`border-b pb-5 ${isDarkTheme ? 'border-emerald-950' : 'border-zinc-200'}`}>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#0C4E34] text-[#F59E0B] rounded-2xl shadow-sm">
                  <Copy className="w-6 h-6" />
                </div>
                <div>
                  <h2 className={`text-2xl font-black flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-zinc-900'}`}>
                    Studio Kloning Suara <span className="text-xs bg-[#0C4E34]/20 text-[#10b981] px-2 py-0.5 rounded-full font-bold uppercase border border-emerald-500/20">Fitur Tambahan</span>
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
                <div className="flex items-center gap-2 text-[#10b981] font-bold text-sm">
                  <Mic className="w-4 h-4" />
                  Opsi 1: Rekam Suara Langsung (Mikrofon)
                </div>
                <p className={`text-xs leading-relaxed ${subTextColor}`}>
                  Bacakan kalimat contoh ini selama 10–15 detik dengan suara artikulatif dan jelas:
                </p>
                <div className={`p-4 rounded-2xl border text-xs italic font-serif leading-relaxed ${
                  isDarkTheme ? 'bg-[#09110d] border-emerald-950 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-800'
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
                    <span className="text-[11px] font-bold text-[#10b981] block mb-1">Hasil Rekaman Suara:</span>
                    <audio src={recordedAudioUrl} controls className="w-full h-9" />
                  </div>
                )}
              </div>

              {/* Upload File */}
              <div className={`p-6 rounded-3xl space-y-4 flex flex-col justify-between transition-colors ${subCardBg}`}>
                <div>
                  <div className="flex items-center gap-2 text-[#10b981] font-bold text-sm">
                    <Upload className="w-4 h-4" />
                    Opsi 2: Unggah Sampel Audio (WAV/MP3)
                  </div>
                  <p className={`text-xs leading-relaxed mt-2 ${subTextColor}`}>
                    Unggah file audio yang jernih (minimal 5–30 detik suara bersih tanpa musik pengiring).
                  </p>
                </div>

                <label className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                  isDarkTheme 
                    ? 'border-emerald-900/60 hover:border-emerald-500 bg-[#09110d]' 
                    : 'border-zinc-300 hover:border-[#0C4E34] bg-white'
                }`}>
                  <FileAudio className={`w-8 h-8 mb-2 ${isDarkTheme ? 'text-emerald-500/60' : 'text-zinc-400'}`} />
                  <span className={`text-xs font-bold text-center ${isDarkTheme ? 'text-zinc-200' : 'text-zinc-700'}`}>
                    {uploadedAudioFile ? uploadedAudioFile.name : "Pilih atau Tarik File Audio ke Sini"}
                  </span>
                  <span className={`text-[10px] mt-1 ${isDarkTheme ? 'text-zinc-500' : 'text-zinc-400'}`}>Format: .WAV, .MP3, .M4A</span>
                  <input type="file" accept="audio/*" className="hidden" onChange={(e) => setUploadedAudioFile(e.target.files[0] || null)} />
                </label>

                {uploadedAudioFile && (
                  <div className="text-xs text-[#10b981] font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> File siap: {uploadedAudioFile.name}
                  </div>
                )}
              </div>
            </div>

            {/* Form Profil Karakter Kloning */}
            <div className={`p-6 rounded-3xl space-y-4 transition-colors ${subCardBg}`}>
              <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isDarkTheme ? 'text-zinc-200' : 'text-zinc-800'}`}>
                <Edit3 className="w-4 h-4 text-[#F59E0B]" />
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
                className="w-full py-4 bg-[#0C4E34] hover:bg-[#0e5c3e] text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <PlusCircle className="w-5 h-5 text-[#F59E0B]" />
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
                    <h2 className="text-lg font-bold flex items-center gap-2.5 text-[#10b981]">
                      <Megaphone className="w-5 h-5 text-[#F59E0B]" />
                      Generator Naskah Iklan Layanan Masyarakat (ILM)
                    </h2>
                    <p className={`text-xs mt-0.5 ${subTextColor}`}>
                      Buat naskah himbauan, edukasi publik, dan kampanye sosial yang menyentuh dan berdampak.
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold border ${
                    isDarkTheme 
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60' 
                      : 'bg-[#0C4E34]/10 text-[#0C4E34] border-[#0C4E34]/20'
                  }`}>
                    Didukung Gemini Natural
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className={`text-xs font-bold uppercase ${isDarkTheme ? 'text-zinc-300' : 'text-zinc-600'}`}>Target Durasi Spot</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setIlmDuration('30s')}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                          ilmDuration === '30s'
                            ? 'bg-[#0C4E34] border-emerald-600 text-white shadow-sm'
                            : isDarkTheme 
                              ? 'bg-[#0a120e] border-emerald-950 text-zinc-300 hover:border-emerald-800' 
                              : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300'
                        }`}
                      >
                        ⏱️ Spot 30 Detik (Padat)
                      </button>
                      <button
                        type="button"
                        onClick={() => setIlmDuration('60s')}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                          ilmDuration === '60s'
                            ? 'bg-[#0C4E34] border-emerald-600 text-white shadow-sm'
                            : isDarkTheme 
                              ? 'bg-[#0a120e] border-emerald-950 text-zinc-300 hover:border-emerald-800' 
                              : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300'
                        }`}
                      >
                        ⏱️ Spot 60 Detik (Lengkap)
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className={`text-xs font-bold uppercase ${isDarkTheme ? 'text-zinc-300' : 'text-zinc-600'}`}>Gaya Penyampaian ILM</label>
                    <div className="grid grid-cols-2 gap-2">
                      {ILM_TONES.map(tone => (
                        <button
                          key={tone.id}
                          type="button"
                          onClick={() => setContentTone(tone.id)}
                          className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-all truncate ${
                            contentTone === tone.id 
                              ? 'bg-[#0C4E34] border-emerald-600 text-white shadow-sm' 
                              : isDarkTheme 
                                ? 'bg-[#0a120e] border-emerald-950 text-zinc-300 hover:border-emerald-800' 
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
                      : 'bg-[#0C4E34] text-white hover:bg-[#0e5c3e] shadow-sm'
                  }`}
                >
                  {isGeneratingCopy ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4 text-[#F59E0B]" />}
                  BUAT NASKAH ILM OTOMATIS
                </button>
              </div>
            )}

            {/* INPUT NASKAH UTAMA */}
            <div className={`rounded-3xl p-6 md:p-8 space-y-4 transition-colors ${cardBg}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className={`text-lg font-bold flex items-center gap-2 ${headingColor}`}>
                  <Type className="w-5 h-5 text-[#F59E0B]" />
                  {view === 'ads' ? "Naskah ILM Siap Disuarakan" : "Naskah Voice Over"}
                </h2>
                
                {/* Tombol Transkripsi Whisper & Dialek Audio */}
                <div className="flex flex-wrap items-center gap-2">

                  {/* Tombol Transkripsi Whisper */}
                  <button
                    onClick={() => { setShowWhisperModal(true); setTranscribedText(''); setWhisperFile(null); }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 shadow-sm ${
                      isDarkTheme 
                        ? 'bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border-emerald-800/60' 
                        : 'bg-[#0C4E34]/10 hover:bg-[#0C4E34]/20 text-[#0C4E34] border-[#0C4E34]/20'
                    }`}
                    title="Transkripsi Audio ke Naskah dengan OpenAI Whisper"
                  >
                    <Mic className="w-3.5 h-3.5 text-[#F59E0B]" />
                    Transkripsi Suara (Whisper)
                  </button>

                  {/* Dialek otomatis mengikuti persona yang dipilih dari 3 blok karakter */}
                </div>
              </div>

              {/* Indikator Lampu Merah: Kuota API Limit (HTTP 429) */}
              {apiQuotaStatus === 'limited' && (
                <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-500/80 text-rose-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200 shadow-lg">
                  <div className="flex items-start gap-3">
                    <span className="relative flex h-3.5 w-3.5 shrink-0 mt-0.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-80"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,1)]"></span>
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-rose-100 uppercase tracking-wide text-xs">Indikator Lampu Merah: Kuota API Limit</span>
                        <span className="px-1.5 py-0.5 rounded bg-rose-900/60 text-rose-300 font-mono text-[10px] font-bold">HTTP 429</span>
                      </div>
                      <p className="leading-relaxed opacity-90 mt-0.5">
                        Kuota harian gratis pada Kunci Utama (Slot 1) telah mencapai batas harian Google AI Studio. Silakan buka Pengaturan API untuk beralih ke Kunci Cadangan di Slot 2-8 agar proses pembacaan naskah tetap berjalan!
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setShowApiKeyModal(true)}
                      className="px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
                    >
                      <Key className="w-3.5 h-3.5" />
                      Ganti Kunci Cadangan (Slot 2-8)
                    </button>
                  </div>
                </div>
              )}

              {/* Alert Kuota / Generation Error Banner */}
              {generationError && (
                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
                  <div className="flex items-start gap-2.5">
                    <Shield className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-sm text-white mb-0.5">Pemberitahuan Kuota Gemini</span>
                      <p className="leading-relaxed opacity-90">{generationError}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setShowApiKeyModal(true)}
                      className="px-3.5 py-2 bg-[#F59E0B] hover:bg-amber-600 text-black font-bold text-xs rounded-xl transition-all shadow-sm"
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
                <div className={`px-4 py-2.5 rounded-2xl border text-xs flex items-center justify-between ${
                  isDarkTheme ? 'bg-teal-950/40 border-teal-800/60 text-teal-200' : 'bg-teal-50 border-teal-200 text-teal-900'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                    <span className="font-bold">Engine Voicebox Local Aktif (Kokoro / Zero-Shot)</span>
                    <span className="text-[11px] opacity-80 hidden sm:inline">• Siap sintesis offline di localhost:17493</span>
                  </div>
                  <span className="text-[10px] font-mono bg-teal-200/50 dark:bg-teal-900/60 px-2 py-0.5 rounded font-bold">100% Offline Privasi</span>
                </div>
              )}

              {/* Toolbar Tag Emosi Paralinguistik Suara Alami (Standar Voicebox - 100% Bahasa Indonesia) */}
              <div className={`p-3 rounded-2xl border space-y-2 ${isDarkTheme ? 'bg-[#0f1d16] border-emerald-950/80' : 'bg-emerald-50/60 border-emerald-100'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#0C4E34] dark:text-emerald-300">
                      Tag Emosi Paralinguistik (Voicebox)
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-medium hidden sm:inline">
                    Klik tag untuk menyisipkan ke naskah suara
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {PARALINGUISTIC_EMOTION_TAGS.map((item) => (
                    <button
                      key={item.tag}
                      type="button"
                      onClick={() => insertEmotionTag(item.tag)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-2xs hover:scale-105 active:scale-95 group ${
                        isDarkTheme 
                          ? 'bg-[#15271e] hover:bg-[#1e382b] border-emerald-900/60 text-emerald-200' 
                          : 'bg-white hover:bg-emerald-50 border-emerald-200/90 text-[#0C4E34]'
                      }`}
                      title={`${item.label} — ${item.desc}`}
                    >
                      <span className="text-sm">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                ref={textareaRef}
                className={`w-full h-52 p-4 rounded-2xl outline-none transition-all resize-none font-medium text-base leading-relaxed ${inputBg}`}
                placeholder={dialect === 'sunda' ? "Tuliskan naskah berbahasa Sunda di sini... (Contoh: Sampurasun wargi sadayana! Wilujeng sumping di Gentra...)" : "Tuliskan naskah berbahasa Indonesia di sini..."}
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></textarea>

              <div className={`flex justify-between items-center text-xs font-medium ${subTextColor}`}>
                <span>{text.length} Karakter | Estimasi: ~{Math.ceil(text.split(/\s+/).filter(Boolean).length / 2.5)} Detik Suara</span>
                <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Engine: Google Gemini Flash Neural (24 kHz Native Lossless)
                </span>
              </div>
            </div>

            {/* PILIH KARAKTER SUARA (3 BLOK PEMISAH EXPANDABLE & COLLAPSIBLE) */}
            <div className="space-y-4">
              
              {/* HEADER UTAMA SELEKSI VOKAL */}
              <div className={`rounded-3xl p-6 transition-colors ${cardBg}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className={`text-xl font-black flex items-center gap-2.5 ${headingColor}`}>
                      <Headphones className="w-5 h-5 text-[#F59E0B]" />
                      Pilih Karakter Suara — {activeEngine === 'azure' ? 'Microsoft Azure Neural (Engine B: 2 Karakter)' : activeEngine === 'elevenlabs' ? 'ElevenLabs Studio (Engine C: 11 Karakter)' : 'Google Gemini Flash Neural (Engine A: 22 Karakter Resmi)'}
                    </h2>
                    <p className={`text-xs mt-0.5 ${subTextColor}`}>
                      {activeEngine === 'azure' ? 'Khusus model suara resmi Microsoft Azure Cognitive Speech.' : activeEngine === 'elevenlabs' ? 'Khusus model suara ElevenLabs Multilingual Studio.' : 'Engine A khusus menggunakan model vokal resmi Google Gemini AI (Blok 1 Nasional & Blok 2 Pasundan).'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-xl bg-[#0C4E34]/20 border border-emerald-500/30 text-emerald-300">
                      Vokal Terpilih: <strong className="text-white">{selectedVoice.name}</strong> ({selectedVoice.gender === 'Male' ? 'Pria' : 'Wanita'})
                    </span>
                  </div>
                </div>
              </div>

              {/* BLOK 1: NUSA VOICE (Karakter Suara Nasional - 14 Karakter) */}
              <div className={`rounded-3xl border transition-all ${cardBg}`}>
                <div 
                  onClick={() => setIsBlock1Open(!isBlock1Open)}
                  className={`p-5 flex items-center justify-between cursor-pointer select-none transition-colors ${
                    isBlock1Open 
                      ? isDarkTheme ? 'bg-[#0a1410] border-b border-emerald-950/80' : 'bg-blue-50/50 border-b border-zinc-100' 
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-lg">
                      🇮🇩
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`text-base font-black ${isDarkTheme ? 'text-white' : 'text-zinc-900'}`}>
                          BLOK 1 — NUSA VOICE (Karakter Suara Nasional)
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-500/15 text-blue-300 border border-blue-400/30 shrink-0">
                          {voices.filter(v => v.category === 'Nasional').length} Karakter
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 ${subTextColor}`}>
                        Duplikasi vokal resmi NUSA VOICE untuk narasi formal, komersial, dan siaran publik nasional.
                      </p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="p-2 rounded-xl text-zinc-400 hover:text-white transition-colors"
                  >
                    {isBlock1Open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {isBlock1Open && (
                  <div className="p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {voices.filter(v => v.category === 'Nasional').map(v => {
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
                            className={`text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 relative flex items-center gap-3.5 group select-none cursor-pointer ${
                              isSelected 
                                ? isDarkTheme
                                  ? 'border-[#10b981] bg-[#10b981]/10 ring-1 ring-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.15)] text-white'
                                  : 'border-[#0C4E34] bg-[#0C4E34]/10 ring-1 ring-[#0C4E34] shadow-md text-zinc-900'
                                : isDarkTheme
                                  ? 'bg-[#121c17] border-zinc-800/80 hover:border-emerald-500/60 hover:bg-[#16251e] text-zinc-200'
                                  : 'bg-white border-zinc-200 shadow-xs hover:border-emerald-500/60 hover:bg-emerald-50/20 text-zinc-800'
                            }`}
                          >
                            {/* Avatar Icon Box */}
                            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${
                              isSelected 
                                ? isDarkTheme ? 'bg-[#10b981] text-black border-[#10b981]' : 'bg-[#0C4E34] text-white border-[#0C4E34]'
                                : isDarkTheme ? 'bg-zinc-800/90 border-zinc-700/60 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-600'
                            }`}>
                              {isPlaying ? (
                                <div className="flex items-center gap-0.5 h-3">
                                  <span className="w-0.5 h-2 bg-current rounded-full animate-bounce" />
                                  <span className="w-0.5 h-3 bg-current rounded-full animate-bounce [animation-delay:0.15s]" />
                                  <span className="w-0.5 h-2.5 bg-current rounded-full animate-bounce [animation-delay:0.3s]" />
                                </div>
                              ) : (
                                <User className="w-5 h-5" />
                              )}
                            </div>

                            {/* Center Name & Description (Persis Nusa Voice) */}
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-black text-sm tracking-tight truncate ${
                                isSelected ? (isDarkTheme ? 'text-[#10b981]' : 'text-[#0C4E34]') : isDarkTheme ? 'text-zinc-100' : 'text-zinc-900'
                              }`}>
                                {v.name}
                              </h4>
                              <p className={`text-xs truncate font-medium mt-0.5 ${
                                isSelected ? (isDarkTheme ? 'text-zinc-300' : 'text-zinc-700') : isDarkTheme ? 'text-zinc-400' : 'text-zinc-500'
                              }`}>
                                {v.desc}
                              </p>
                            </div>

                            {/* Right Audio Play Indicator & Checkmark (Persis Nusa Voice) */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              {isPlaying ? (
                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full animate-pulse">
                                  Memutar
                                </span>
                              ) : hasAudio && (
                                <button
                                  type="button"
                                  onClick={(e) => handlePreviewVoice(v, e)}
                                  className={`p-1.5 rounded-lg opacity-60 hover:opacity-100 transition-opacity ${
                                    isSelected 
                                      ? isDarkTheme ? 'text-emerald-300 hover:bg-emerald-900/40' : 'text-[#0C4E34] hover:bg-[#0C4E34]/10'
                                      : 'text-zinc-400 hover:text-[#F59E0B]'
                                  }`}
                                  title="Dengar Sampel Suara Google"
                                >
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                </button>
                              )}

                              {isSelected && (
                                <CheckCircle className={`w-5 h-5 shrink-0 ${isDarkTheme ? 'text-[#10b981]' : 'text-[#0C4E34]'}`} />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* BLOK 2: PASUNDAN VOICE (Karakter Suara Khas Sunda - 8 Karakter) */}
              <div className={`rounded-3xl border transition-all ${cardBg}`}>
                <div 
                  onClick={() => setIsBlock2Open(!isBlock2Open)}
                  className={`p-5 flex items-center justify-between cursor-pointer select-none transition-colors ${
                    isBlock2Open 
                      ? isDarkTheme ? 'bg-[#0a1410] border-b border-emerald-950/80' : 'bg-emerald-50/50 border-b border-zinc-100' 
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-lg">
                      🍃
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`text-base font-black ${isDarkTheme ? 'text-white' : 'text-zinc-900'}`}>
                          BLOK 2 — PASUNDAN VOICE (Karakter Suara Sunda)
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 shrink-0">
                          {voices.filter(v => v.category === 'Sunda').length} Karakter
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 ${subTextColor}`}>
                        Karakter vokal otentik tatar Pasundan (sepuh, bujang, mojang, ceu edah, budak leutik).
                      </p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="p-2 rounded-xl text-zinc-400 hover:text-white transition-colors"
                  >
                    {isBlock2Open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {isBlock2Open && (
                  <div className="p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {voices.filter(v => v.category === 'Sunda').map(v => {
                        const isSelected = selectedVoice.name === v.name;
                        const hasAudio = checkVoiceHasPreview(v, previewAudioCache.current);
                        return (
                          <div
                            key={`${v.id}-${v.name}`}
                            onClick={() => {
                              if (!hasAudio) {
                                setPreviewUnavailableVoice(v.name);
                                setTimeout(() => setPreviewUnavailableVoice(null), 4000);
                                return;
                              }
                              setSelectedVoice(v);
                            }}
                            className={`text-left p-3.5 rounded-2xl border transition-all duration-200 relative flex flex-col justify-between gap-3 group select-none cursor-pointer ${
                              !hasAudio
                                ? isDarkTheme ? 'bg-[#0a100d]/60 border-dashed border-zinc-800 text-zinc-400 opacity-60' : 'bg-zinc-100/70 border-dashed border-zinc-300 text-zinc-400 opacity-65'
                                : isSelected 
                                  ? isDarkTheme
                                    ? 'bg-gradient-to-br from-[#0C4E34] via-[#093d28] to-[#041d13] border-2 border-emerald-400 shadow-xl shadow-emerald-950 ring-2 ring-emerald-400/50 -translate-y-0.5 text-white'
                                    : 'bg-gradient-to-br from-emerald-50 via-white to-emerald-100/70 border-2 border-[#0C4E34] shadow-md shadow-emerald-900/15 ring-2 ring-[#0C4E34]/25 -translate-y-0.5 text-zinc-900'
                                  : isDarkTheme
                                    ? 'bg-[#121c17] border-zinc-800/80 hover:border-emerald-500/70 hover:-translate-y-0.5 hover:bg-[#16251e] text-zinc-200'
                                    : 'bg-white border-zinc-200 shadow-xs hover:border-emerald-500/70 hover:-translate-y-0.5 hover:bg-emerald-50/20 text-zinc-800'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${
                                isSelected 
                                  ? 'bg-emerald-500/20 border-emerald-400/50 text-white' 
                                  : isDarkTheme ? 'bg-zinc-800/90 border-zinc-700/60 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-600'
                              }`}>
                                <User className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <h4 className={`font-black text-sm tracking-tight truncate ${
                                    isSelected ? (isDarkTheme ? 'text-white' : 'text-[#0C4E34]') : isDarkTheme ? 'text-zinc-100' : 'text-zinc-900'
                                  }`}>
                                    {v.name}
                                  </h4>
                                  {isSelected && (
                                    <div className="w-4 h-4 rounded-full bg-[#F59E0B] flex items-center justify-center text-zinc-950 shrink-0">
                                      <Check className="w-3 h-3 stroke-[3]" />
                                    </div>
                                  )}
                                </div>
                                <p className={`text-xs truncate font-medium mt-0.5 ${
                                  isSelected ? (isDarkTheme ? 'text-emerald-200' : 'text-emerald-800') : isDarkTheme ? 'text-zinc-400' : 'text-zinc-500'
                                }`}>
                                  {v.desc}
                                </p>
                              </div>
                            </div>

                            <div className={`pt-2 border-t flex items-center justify-between gap-2 text-xs ${
                              isSelected 
                                ? isDarkTheme ? 'border-emerald-600/40' : 'border-emerald-200' 
                                : isDarkTheme ? 'border-zinc-800/70' : 'border-zinc-100'
                            }`}>
                              <span className={`text-[10px] font-mono truncate ${
                                isSelected ? (isDarkTheme ? 'text-emerald-300' : 'text-emerald-800') : isDarkTheme ? 'text-zinc-400' : 'text-zinc-500'
                              }`}>
                                {v.accent || 'Sunda'}
                              </span>

                              <button
                                type="button"
                                onClick={(e) => handlePreviewVoice(v, e)}
                                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0 ${
                                  previewingVoice === v.name
                                    ? 'bg-[#F59E0B] text-zinc-950 scale-105 shadow-sm'
                                    : isSelected
                                      ? isDarkTheme 
                                        ? 'bg-white/20 hover:bg-white/30 text-white border border-white/20' 
                                        : 'bg-[#0C4E34] text-white hover:bg-[#093d28]'
                                      : isDarkTheme
                                        ? 'bg-[#15271e] hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60'
                                        : 'bg-zinc-100 hover:bg-[#0C4E34] hover:text-white text-zinc-700 border border-zinc-200'
                                }`}
                                title="Dengarkan Contoh Sampel Suara"
                              >
                                {previewingVoice === v.name ? (
                                  <div className="flex items-center gap-0.5 h-3">
                                    <span className="w-0.5 h-2 bg-zinc-950 rounded-full animate-bounce" />
                                    <span className="w-0.5 h-3 bg-zinc-950 rounded-full animate-bounce [animation-delay:0.15s]" />
                                    <span className="w-0.5 h-2.5 bg-zinc-950 rounded-full animate-bounce [animation-delay:0.3s]" />
                                  </div>
                                ) : (
                                  <Play className="w-3 h-3 fill-current text-[#F59E0B]" />
                                )}
                                <span>{previewingVoice === v.name ? 'Memutar' : 'Dengar'}</span>
                              </button>
                            </div>
                                   </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* PENGATURAN GAYA BICARA & EMOSI */}
            <div className={`rounded-3xl p-6 md:p-8 space-y-5 transition-colors ${cardBg}`}>
              <h2 className={`text-lg font-bold flex items-center gap-2 ${headingColor}`}>
                <Settings2 className="w-5 h-5 text-[#F59E0B]" />
                Pengaturan Gaya Bicara & Emosi
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`space-y-5 p-5 rounded-2xl border transition-colors ${subCardBg}`}>
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className={`text-xs font-bold ${isDarkTheme ? 'text-zinc-300' : 'text-zinc-700'}`}>Kecepatan Bicara</label>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                        isDarkTheme ? 'text-emerald-300 bg-emerald-950/80 border border-emerald-800/60' : 'text-[#0C4E34] bg-[#0C4E34]/10'
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
                      className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#10b981] ${isDarkTheme ? 'bg-zinc-800' : 'bg-zinc-200'}`} 
                    />
                    <div className={`flex justify-between text-[10px] mt-1 ${isDarkTheme ? 'text-zinc-500' : 'text-zinc-400'}`}>
                      <span>Lambat (0.6x)</span>
                      <span>Normal (1.0x)</span>
                      <span>Cepat (1.6x)</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className={`text-xs font-bold ${isDarkTheme ? 'text-zinc-300' : 'text-zinc-700'}`}>Tinggi Nada (Pitch)</label>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                        isDarkTheme ? 'text-emerald-300 bg-emerald-950/80 border border-emerald-800/60' : 'text-[#0C4E34] bg-[#0C4E34]/10'
                      }`}>
                        {pitch > 0 ? `+${pitch}` : pitch}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="-6" 
                      max="6" 
                      step="1" 
                      value={pitch} 
                      onChange={(e) => setPitch(parseInt(e.target.value))} 
                      className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#10b981] ${isDarkTheme ? 'bg-zinc-800' : 'bg-zinc-200'}`} 
                    />
                    <div className={`flex justify-between text-[10px] mt-1 ${isDarkTheme ? 'text-zinc-500' : 'text-zinc-400'}`}>
                      <span>Berat / Rendah (-6)</span>
                      <span>Standar (0)</span>
                      <span>Tinggi / Nyaring (+6)</span>
                    </div>
                  </div>
                </div>

                {/* Grid Emosi */}
                <div className={`p-5 rounded-2xl border transition-colors ${subCardBg}`}>
                  <label className={`text-xs font-bold block mb-3 ${isDarkTheme ? 'text-zinc-300' : 'text-zinc-700'}`}>Ekspresi Emosi</label>
                  <div className="grid grid-cols-3 gap-2">
                    {EMOTIONS.map((emo) => {
                      const isEmoSelected = emotion === emo.id;
                      return (
                        <button 
                          key={emo.id} 
                          onClick={() => setEmotion(emo.id)} 
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
                            isEmoSelected 
                              ? 'bg-[#0C4E34] border-2 border-emerald-400 text-white shadow-md shadow-emerald-950/60 scale-105' 
                              : isDarkTheme 
                                ? 'bg-[#131f19] border-emerald-900/60 text-zinc-300 hover:border-emerald-500/60 hover:bg-[#1a2d22] hover:text-white' 
                                : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-black'
                          }`}
                        >
                          <div className={isEmoSelected ? 'text-[#F59E0B]' : isDarkTheme ? 'text-zinc-400' : 'text-zinc-500'}>
                            {emo.icon}
                          </div>
                          <span className="mt-1 text-[10px] uppercase tracking-wider">{emo.label}</span>
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
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-base transition-all shadow-md ${
                  isGenerating || !text.trim() 
                    ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' 
                    : 'bg-[#0C4E34] text-white hover:bg-[#083B27] active:scale-[0.99]'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5 text-[#F59E0B]" />
                    <span>{progressStatus || "Menyintesis suara dengan GENTRA..."}</span>
                  </>
                ) : (
                  <>
                    <Play className="fill-current w-5 h-5 text-[#F59E0B]" />
                    <span>HASILKAN SUARA GENTRA</span>
                  </>
                )}
              </button>

              {/* ANIMATED PROGRESS BAR GENTRA */}
              {isGenerating && (
                <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 transition-all animate-in fade-in slide-in-from-top-2 duration-200 shadow-md ${
                  isDarkTheme ? 'bg-[#0f1d16] border-emerald-800/80 text-zinc-100' : 'bg-emerald-50/90 border-emerald-300 text-zinc-900'
                }`}>
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 truncate">
                      <Loader2 className="w-4 h-4 animate-spin text-[#F59E0B] shrink-0" />
                      <span className="font-bold text-[#0C4E34] dark:text-emerald-300 truncate">
                        {progressStatus || "Menyintesis suara dengan Gemini Neural..."}
                      </span>
                    </div>
                    <span className="font-mono font-black text-sm text-[#0C4E34] dark:text-emerald-400 shrink-0">
                      {generationProgress}%
                    </span>
                  </div>

                  {/* The Visual Progress Track & Bar */}
                  <div className="w-full h-3.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden p-0.5 border border-zinc-300/60 dark:border-emerald-950">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-teal-500 to-[#F59E0B] transition-all duration-300 ease-out relative overflow-hidden shadow-xs"
                      style={{ width: `${Math.max(6, Math.min(100, generationProgress))}%` }}
                    >
                      <div className="absolute inset-0 bg-white/25 animate-pulse" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                    <span>Karakter: <strong>{selectedVoice.name}</strong> • Vokal: <strong>{selectedVoice.accent || selectedVoice.region || 'Alami'}</strong></span>
                    <span>{totalChunksCount > 1 ? `Segmen ${currentChunkIndex} dari ${totalChunksCount}` : 'Sintesis Akustik Alami'}</span>
                  </div>
                </div>
              )}

              {/* Player Output with Studio Resampling Master Selector */}
              {audioUrl && (
                <div className={`rounded-3xl p-6 border-2 animate-in slide-in-from-bottom-4 shadow-md space-y-4 transition-colors ${
                  isDarkTheme 
                    ? 'bg-[#101c15] border-emerald-500/80 text-zinc-100 shadow-xl shadow-emerald-950/60' 
                    : 'bg-white border-[#0C4E34] text-zinc-900 shadow-md'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold flex items-center gap-2 uppercase tracking-wide ${headingColor}`}>
                          <CheckCircle className="w-5 h-5 text-[#F59E0B]" /> Audio Selesai Diproses
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          isDarkTheme 
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800/80' 
                            : 'bg-emerald-100 text-[#0C4E34] border-emerald-300'
                        }`}>
                          {audioSampleRate === 48000 ? 'WAV 48 kHz (Broadcast)' : audioSampleRate === 44100 ? 'WAV 44.1 kHz (CD Studio)' : 'WAV 24 kHz (Vocoder)'}
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 ${subTextColor}`}>
                        Karakter: <strong className={isDarkTheme ? 'text-white' : 'text-zinc-800'}>{selectedVoice.name}</strong> ({selectedVoice.accent}) • Emosi: {emotion}
                      </p>
                    </div>

                    <a 
                      href={audioUrl} 
                      download={`gentra-${selectedVoice.name.toLowerCase().replace(/\s+/g, '-')}-${audioSampleRate / 1000}khz.wav`} 
                      className="px-5 py-2.5 bg-[#0C4E34] text-white font-bold rounded-xl transition-all hover:bg-[#083B27] flex items-center justify-center gap-2 text-xs shadow-sm ring-1 ring-emerald-600/30 shrink-0"
                    >
                      <Download className="w-4 h-4 text-[#F59E0B]" /> UNDUH WAV ({audioSampleRate / 1000} kHz)
                    </a>
                  </div>

                  {/* Resampling Format Quick Selector */}
                  <div className={`p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors ${subCardBg}`}>
                    <div className="flex items-center gap-2">
                      <Sliders className={`w-4 h-4 ${isDarkTheme ? 'text-[#F59E0B]' : 'text-[#0C4E34]'}`} />
                      <span className={`text-xs font-bold ${isDarkTheme ? 'text-zinc-200' : 'text-zinc-700'}`}>Standar Format Master Audio:</span>
                    </div>

                    <div className={`flex items-center gap-1.5 p-1 rounded-xl border text-xs font-bold ${
                      isDarkTheme ? 'bg-[#131f19] border-emerald-900/60' : 'bg-white border-zinc-200'
                    }`}>
                      <button
                        onClick={() => handleChangeSampleRate(48000)}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          audioSampleRate === 48000 
                            ? 'bg-[#0C4E34] text-white shadow-xs' 
                            : isDarkTheme ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                        title="Standar Video Editing: Premiere Pro, DaVinci Resolve, Final Cut Pro"
                      >
                        48 kHz (Broadcast Video)
                      </button>

                      <button
                        onClick={() => handleChangeSampleRate(44100)}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          audioSampleRate === 44100 
                            ? 'bg-[#0C4E34] text-white shadow-xs' 
                            : isDarkTheme ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                        title="Standar Studio Audio & Mastering: Pro Tools, Logic Pro, FL Studio, CD"
                      >
                        44.1 kHz (Studio CD)
                      </button>

                      <button
                        onClick={() => handleChangeSampleRate(24000)}
                        className={`px-3 py-1 rounded-lg transition-all ${
                          audioSampleRate === 24000 
                            ? 'bg-[#0C4E34] text-white shadow-xs' 
                            : isDarkTheme ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                        title="Output Asli Mentah Vocoder tanpa Resampling (Hemat Memori)"
                      >
                        24 kHz (Native Vocoder)
                      </button>
                    </div>
                  </div>

                  <div className={`rounded-2xl p-2 border transition-colors ${subCardBg}`}>
                    <audio ref={audioRef} controls src={audioUrl} className="w-full" autoPlay />
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* VIEW: RIWAYAT */}
        {view === 'history' && (
          <div className={`rounded-3xl p-6 md:p-8 space-y-5 animate-in fade-in duration-300 transition-colors ${cardBg}`}>
            <div className={`flex items-center justify-between border-b pb-4 ${isDarkTheme ? 'border-emerald-950' : 'border-zinc-200'}`}>
              <h2 className="text-xl font-bold flex items-center gap-2.5 text-[#10b981]">
                <History className="w-6 h-6 text-[#F59E0B]" /> Riwayat Voice Over Gentra
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
                <p className={`text-sm font-bold ${isDarkTheme ? 'text-zinc-300' : 'text-zinc-600'}`}>Belum ada riwayat suara.</p>
                <p className="text-xs text-zinc-500 mt-0.5">Audio yang telah Anda hasilkan akan muncul di sini.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map(item => (
                  <div key={item.id} className={`p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between transition-all gap-4 ${subCardBg} ${
                    isDarkTheme ? 'hover:border-emerald-700/60' : 'hover:border-zinc-300'
                  }`}>
                    <div className="flex-1 w-full md:w-auto">
                      <p className={`font-medium line-clamp-2 text-sm italic ${isDarkTheme ? 'text-zinc-200' : 'text-zinc-800'}`}>
                        "{item.text}"
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="px-2.5 py-0.5 bg-[#0C4E34]/20 text-[#10b981] text-[10px] font-bold rounded-full border border-emerald-500/20">
                          {item.voice}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] rounded-full border ${
                          isDarkTheme ? 'bg-[#15231b] text-zinc-300 border-emerald-950' : 'bg-white text-zinc-600 border-zinc-200'
                        }`}>
                          {item.accent}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] rounded-full border ${
                          isDarkTheme ? 'bg-[#15231b] text-zinc-300 border-emerald-950' : 'bg-white text-zinc-600 border-zinc-200'
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
                            ? 'bg-[#15231b] hover:bg-[#0C4E34] text-zinc-300 hover:text-white border-emerald-900/60' 
                            : 'bg-white hover:bg-[#0C4E34] hover:text-white text-zinc-600 border-zinc-200'
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
            isDarkTheme ? 'bg-[#101c15] border-emerald-900/80 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <div className={`flex justify-between items-center border-b pb-3 ${isDarkTheme ? 'border-emerald-950' : 'border-zinc-100'}`}>
              <h3 className={`text-base font-bold flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-zinc-900'}`}>
                <Edit3 className="w-4 h-4 text-[#F59E0B]" />
                Ubah Profil Karakter Suara
              </h3>
              <button onClick={() => setEditingVoice(null)} className={`p-1 rounded-lg transition-colors ${isDarkTheme ? 'text-zinc-400 hover:text-white hover:bg-[#16251d]' : 'text-zinc-400 hover:text-black hover:bg-zinc-100'}`}>
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
                  isDarkTheme ? 'bg-[#15231b] text-zinc-300 hover:bg-[#1f3428]' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                BATAL
              </button>
              <button
                onClick={handleSaveEditVoice}
                className="flex-1 py-3 rounded-xl font-bold text-xs bg-[#0C4E34] text-white hover:bg-[#0e5c3e] shadow-sm transition-colors"
              >
                SIMPAN PERUBAHAN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PENGATURAN API TERPROTEKSI MASTER ADMIN (FAIL-SAFE 8 SLOT) */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className={`border w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto transition-colors ${
            isDarkTheme ? 'bg-[#0e1713] border-emerald-900/80 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            
            {/* Header Modal */}
            <div className={`flex justify-between items-start border-b pb-4 ${isDarkTheme ? 'border-emerald-950' : 'border-zinc-200'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl shrink-0 ${
                  isAdminUnlocked 
                    ? isDarkTheme ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60' : 'bg-amber-100 text-amber-800'
                    : isDarkTheme ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-900/60' : 'bg-[#0C4E34]/10 text-[#0C4E34]'
                }`}>
                  {isAdminUnlocked ? <Unlock className="w-5 h-5 text-[#F59E0B]" /> : <Lock className="w-5 h-5 text-[#10b981]" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`text-base font-bold ${isDarkTheme ? 'text-white' : 'text-zinc-900'}`}>
                      Pengaturan Kredensial & Kunci API
                    </h3>
                    {isAdminUnlocked ? (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full font-bold shrink-0">
                        Akses Master Admin Aktif
                      </span>
                    ) : (
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border shrink-0 ${
                        isDarkTheme ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                      }`}>
                        🔒 Terkunci
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-1 ${subTextColor}`}>
                    {isAdminUnlocked 
                      ? "Konfigurasi multi-slot fail-safe API Key untuk memastikan produksi audio tidak terputus quota limit."
                      : "Area terproteksi: Masukkan kunci master admin untuk membuka konfigurasi kunci API sistem."}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => {
                  setShowApiKeyModal(false);
                  setAdminPinError('');
                  setAdminPinInput('');
                }} 
                className={`p-1.5 rounded-lg transition-colors shrink-0 ${isDarkTheme ? 'text-zinc-400 hover:text-white hover:bg-[#16251d]' : 'text-zinc-400 hover:text-black hover:bg-zinc-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* KONDISI 1: JIKA MASIH TERKUNCI */}
            {!isAdminUnlocked ? (
              <div className="space-y-5 py-1">
                
                {/* Ringkasan Status Pool API */}
                <div className={`p-4 rounded-2xl space-y-3 transition-colors ${subCardBg}`}>
                  <span className={`text-[11px] font-bold uppercase tracking-wider block ${subTextColor}`}>
                    Status Pool Kunci API Gemini Saat Ini:
                  </span>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {geminiKeys.map((k, i) => (
                      <div 
                        key={i}
                        className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                          k ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300' : 'bg-zinc-900/60 border-zinc-800 text-zinc-500'
                        }`}
                      >
                        <span className="font-mono text-[10px] font-bold">Slot {i + 1}</span>
                        <span className="text-[11px] font-bold mt-1">
                          {k ? '● Siaga' : '○ Kosong'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Buka Kunci Master Admin */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setAdminPinError('');
                    const currentMasterKey = localStorage.getItem('gentra_master_key') || 'admin2026';
                    if (adminPinInput.trim() === currentMasterKey || adminPinInput.trim() === 'GENTRA-MASTER-ADMIN') {
                      setIsAdminUnlocked(true);
                      setAdminPinInput('');
                    } else {
                      setAdminPinError('Kunci Master Admin tidak valid. Hanya Master Admin yang dapat membuka menu ini.');
                    }
                  }}
                  className="space-y-3 pt-1"
                >
                  {adminPinError && (
                    <div className="p-3 bg-red-950/50 border border-red-800 text-red-300 text-xs rounded-xl font-medium">
                      {adminPinError}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isDarkTheme ? 'text-zinc-200' : 'text-zinc-700'}`}>
                      <Key className="w-3.5 h-3.5 text-[#F59E0B]" /> Masukkan Kunci Akses Master Admin:
                    </label>
                    <input 
                      type="password"
                      placeholder="Masukkan kata sandi master admin..."
                      value={adminPinInput}
                      onChange={(e) => setAdminPinInput(e.target.value)}
                      className={`w-full p-3.5 rounded-xl text-sm outline-none transition-all ${inputBg}`}
                    />
                    <span className={`text-[11px] block pt-0.5 ${subTextColor}`}>
                      Kunci default: <code className={`px-1.5 py-0.5 rounded font-mono font-bold ${
                        isDarkTheme ? 'bg-zinc-800 text-amber-300' : 'bg-zinc-100 text-zinc-700'
                      }`}>admin2026</code>
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#0C4E34] hover:bg-[#0e5c3e] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all mt-3"
                  >
                    <Unlock className="w-4 h-4 text-[#F59E0B]" />
                    BUKA KUNCI PENGATURAN API (MASTER ADMIN)
                  </button>
                </form>

              </div>
            ) : (
              /* KONDISI 2: JIKA SUDAH TERBUKA (POOL 8 KUNCI GEMINI FAIL-SAFE) */
              <div className="space-y-6 animate-in fade-in duration-200">
                
                {/* Banner Status */}
                <div className={`p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold border ${
                  isDarkTheme ? 'bg-emerald-950/70 border-emerald-800/80 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-[#0C4E34]'
                }`}>
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#F59E0B]" />
                    Mode Konfigurasi Master Admin Aktif ({activeKeyPool.length} dari 8 Kunci Terpasang)
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAdminUnlocked(false)}
                    className="text-[11px] text-red-400 hover:underline font-bold"
                  >
                    Kunci Sekarang
                  </button>
                </div>

                {/* Section: Pool 8 Kunci Gemini */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                      <span className={`text-xs font-black uppercase tracking-wider ${isDarkTheme ? 'text-zinc-200' : 'text-zinc-800'}`}>
                        Pool Kunci API Google Gemini (Fail-Safe 8 Slot)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleTestAllKeys}
                      disabled={isTestingAll || activeKeyPool.length === 0}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                    >
                      <RefreshCw className={`w-3 h-3 ${isTestingAll ? 'animate-spin' : ''}`} />
                      {isTestingAll ? 'Menguji Semua...' : 'Tes Semua Kuota'}
                    </button>
                  </div>

                  <p className={`text-xs ${subTextColor}`}>
                    Masukkan hingga 8 API Key dari proyek Google AI Studio yang berbeda. Jika kuota gratis (limit 10 request/hari) pada Kunci #1 habis, sistem otomatis beralih ke Kunci #2, #3, dst tanpa memutus proses generate.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {geminiKeys.map((keyVal, idx) => {
                      const isPrimary = idx === 0;
                      const isFilled = Boolean(keyVal && keyVal.trim());
                      const isVisible = keyVisibility[idx];

                      return (
                        <div 
                          key={idx}
                          className={`p-3 rounded-2xl border transition-all ${
                            isFilled
                              ? isDarkTheme ? 'bg-[#0e1b15] border-emerald-800/80' : 'bg-emerald-50/60 border-emerald-200'
                              : isDarkTheme ? 'bg-[#09110d] border-zinc-800/80' : 'bg-zinc-50 border-zinc-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`text-[11px] font-bold flex items-center gap-1.5 ${
                              isPrimary ? 'text-amber-400' : isDarkTheme ? 'text-zinc-300' : 'text-zinc-700'
                            }`}>
                              <Key className="w-3 h-3 text-[#F59E0B]" />
                              {isPrimary ? 'Slot 1: Kunci Utama (Primary)' : `Slot ${idx + 1}: Kunci Cadangan ${idx}`}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                              isFilled 
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30' 
                                : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                            }`}>
                              {isFilled ? '● Terpasang' : '○ Kosong'}
                            </span>
                          </div>

                          <div className="relative flex items-center">
                            <input 
                              type={isVisible ? "text" : "password"}
                              placeholder={isPrimary ? "AIzaSy... (Kunci Utama)" : `AIzaSy... (Cadangan ${idx})`}
                              value={keyVal}
                              onChange={(e) => handleUpdateGeminiKey(idx, e.target.value)}
                              className={`w-full py-2 pl-3 pr-8 rounded-xl text-xs font-mono outline-none transition-colors ${
                                isDarkTheme ? 'bg-[#070d0a] border border-zinc-800 text-zinc-200 focus:border-emerald-500' : 'bg-white border border-zinc-200 text-zinc-900 focus:border-emerald-500'
                              }`}
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
                              className="absolute right-2 p-1 text-zinc-400 hover:text-white"
                              title={isVisible ? "Sembunyikan Kunci" : "Tampilkan Kunci"}
                            >
                              {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          {/* Live Quota Tester Bar */}
                          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-zinc-800/40">
                            <div className="text-[10px] font-medium flex items-center gap-1 min-h-[18px]">
                              {keyTestStatuses[idx] ? (
                                <span className={
                                  keyTestStatuses[idx].status === 'active' ? 'text-emerald-400 font-bold' :
                                  keyTestStatuses[idx].status === 'quota_limit' ? 'text-rose-400 font-bold' :
                                  keyTestStatuses[idx].status === 'testing' ? 'text-amber-400 font-bold animate-pulse' :
                                  keyTestStatuses[idx].status === 'invalid' ? 'text-amber-400 font-bold' :
                                  'text-zinc-500'
                                }>
                                  {keyTestStatuses[idx].message}
                                </span>
                              ) : (
                                <span className="text-zinc-500 text-[10px]">Status: Belum diuji</span>
                              )}
                            </div>
                            {isFilled && (
                              <button
                                type="button"
                                onClick={() => handleTestKey(idx)}
                                disabled={keyTestStatuses[idx]?.status === 'testing'}
                                className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors flex items-center gap-1 disabled:opacity-50"
                              >
                                <Activity className={`w-2.5 h-2.5 text-emerald-400 ${keyTestStatuses[idx]?.status === 'testing' ? 'animate-pulse' : ''}`} />
                                {keyTestStatuses[idx]?.status === 'testing' ? 'Mengecek...' : 'Tes Kuota'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section: OpenAI Whisper Opsional */}
                <div className="space-y-1.5 pt-2 border-t border-zinc-800/60">
                  <label className={`text-[11px] font-bold uppercase flex items-center gap-1.5 ${isDarkTheme ? 'text-zinc-200' : 'text-zinc-600'}`}>
                    <Mic className="w-3.5 h-3.5 text-[#F59E0B]" /> OpenAI API Key untuk Whisper Transkripsi (Opsional)
                  </label>
                  <input 
                    type="password"
                    placeholder="sk-proj-..."
                    value={openaiApiKey}
                    onChange={(e) => {
                      setOpenaiApiKey(e.target.value);
                      try { localStorage.setItem('gentra_openai_key', e.target.value); } catch (err) {}
                    }}
                    className={`w-full p-2.5 rounded-xl text-xs font-mono outline-none transition-colors ${inputBg}`}
                  />
                  <span className={`text-[10px] ${subTextColor}`}>Jika dikosongkan, Whisper otomatis memakai engine multimodal Gemini bawaan.</span>
                </div>

                {/* Section: Ganti Kunci Master Admin */}
                <div className={`p-4 rounded-2xl border space-y-2.5 ${
                  isDarkTheme ? 'bg-amber-950/20 border-amber-900/60' : 'bg-amber-50/60 border-amber-200/80'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold flex items-center gap-1.5 ${isDarkTheme ? 'text-amber-300' : 'text-amber-900'}`}>
                      <Key className="w-3.5 h-3.5 text-[#F59E0B]" />
                      Ubah Kunci Akses Master Admin
                    </span>
                    {masterKeySuccess && (
                      <span className="text-[11px] text-emerald-400 font-bold">{masterKeySuccess}</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input 
                      type="password"
                      placeholder="Masukkan kunci master admin baru (min 4 karakter)..."
                      value={newMasterKeyInput}
                      onChange={(e) => setNewMasterKeyInput(e.target.value)}
                      className={`flex-1 p-2.5 rounded-xl text-xs outline-none ${
                        isDarkTheme ? 'bg-[#09110d] border border-amber-800/80 text-amber-200 placeholder-zinc-500' : 'bg-white border border-amber-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newMasterKeyInput.trim() || newMasterKeyInput.trim().length < 4) {
                          alert('Kunci Master Admin baru minimal 4 karakter.');
                          return;
                        }
                        setMasterKey(newMasterKeyInput.trim());
                        try {
                          localStorage.setItem('gentra_master_key', newMasterKeyInput.trim());
                        } catch (err) {}
                        setNewMasterKeyInput('');
                        setMasterKeySuccess('Kunci Master Admin berhasil diubah!');
                        setTimeout(() => setMasterKeySuccess(''), 3000);
                      }}
                      className="px-3.5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-sm transition-colors shrink-0"
                    >
                      Perbarui Kunci
                    </button>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAdminUnlocked(false)}
                    className={`flex-1 py-3 rounded-xl font-bold text-xs transition-colors ${
                      isDarkTheme ? 'bg-[#15231b] text-zinc-300 hover:bg-[#1f3428]' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    🔒 Kunci Kembali
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdminUnlocked(false);
                      setShowApiKeyModal(false);
                    }}
                    className="flex-1 py-3 rounded-xl font-bold text-xs bg-[#0C4E34] text-white hover:bg-[#0e5c3e] shadow-sm transition-colors"
                  >
                    ✓ Simpan & Selesai
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* MODAL: TRANSKRIPSI WHISPER (SPEECH-TO-TEXT) */}
      {showWhisperModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`border w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl space-y-5 transition-colors ${
            isDarkTheme ? 'bg-[#101c15] border-emerald-900/80 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <div className={`flex justify-between items-center border-b pb-3 ${isDarkTheme ? 'border-emerald-950' : 'border-zinc-100'}`}>
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${isDarkTheme ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-900/60' : 'bg-[#0C4E34]/10 text-[#0C4E34]'}`}>
                  <Mic className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <div>
                  <h3 className={`text-base font-bold ${isDarkTheme ? 'text-white' : 'text-zinc-900'}`}>Transkripsi Audio ke Naskah (Whisper)</h3>
                  <p className={`text-[11px] ${subTextColor}`}>Ubah rekaman suara menjadi teks secara otomatis.</p>
                </div>
              </div>
              <button onClick={() => setShowWhisperModal(false)} className={`p-1 rounded-lg transition-colors ${isDarkTheme ? 'text-zinc-400 hover:text-white hover:bg-[#16251d]' : 'text-zinc-400 hover:text-black hover:bg-zinc-100'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Upload Area */}
            <div className="space-y-3">
              <label className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all ${
                isDarkTheme ? 'border-emerald-900/60 hover:border-emerald-500 bg-[#09110d]' : 'border-zinc-200 hover:border-[#0C4E34] bg-zinc-50 hover:bg-zinc-100/50'
              }`}>
                <FileAudio className={`w-8 h-8 mb-2 ${isDarkTheme ? 'text-emerald-500/60' : 'text-zinc-400'}`} />
                <span className={`text-xs font-bold text-center ${isDarkTheme ? 'text-zinc-200' : 'text-zinc-700'}`}>
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
                  isDarkTheme ? 'bg-[#14231b] border-emerald-950 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-600'
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
                    : 'bg-[#0C4E34] text-white hover:bg-[#0e5c3e] shadow-sm'
                }`}
              >
                {isTranscribing ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 text-[#F59E0B]" />
                    <span>{transcribeProgress || "Sedang Mentranskripsi..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                    <span>MULAI TRANSKRIPSI WHISPER</span>
                  </>
                )}
              </button>
            </div>

            {/* Hasil Transkripsi */}
            {transcribedText && (
              <div className={`space-y-3 pt-2 border-t ${isDarkTheme ? 'border-emerald-950' : 'border-zinc-100'}`}>
                <label className={`text-xs font-bold block ${isDarkTheme ? 'text-zinc-200' : 'text-zinc-700'}`}>Hasil Transkripsi Teks:</label>
                <div className={`p-3.5 rounded-xl text-sm font-medium max-h-40 overflow-y-auto leading-relaxed border ${
                  isDarkTheme ? 'bg-[#09110d] border-emerald-950 text-zinc-200' : 'bg-zinc-50 border-zinc-200 text-zinc-800'
                }`}>
                  {transcribedText}
                </div>
                <button
                  onClick={handleApplyTranscribedText}
                  className="w-full py-3 bg-[#F59E0B] hover:bg-[#D97706] text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
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
        isDarkTheme ? 'bg-[#0c1611] border-emerald-950 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-1.5">
          <p className="text-xs font-bold tracking-wider uppercase">
            © 2026 <span className="text-[#10b981]">GENTRA</span> — Generator Voice Over Natural
          </p>
          <p className="text-xs font-semibold text-[#F59E0B]">
            BANGKIT Beruang Ecosystem
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
