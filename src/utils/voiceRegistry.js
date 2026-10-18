// src/utils/voiceRegistry.js
// Single Source of Truth untuk Seluruh Persona Suara GENTRA
// Sinkronisasi Terpusat 3-Arah: Landing Page <-> Aplikasi Studio <-> Lab Pengembangan

import { safeGetItem, safeSetItem } from './safeStorage.js';

export const GENTRA_VOICES_STORAGE_KEY = 'gentra_voices_v3';
export const GENTRA_VOICES_EVENT = 'gentra_voices_updated';

// --- Baseline Standar Pabrik (22 Persona Bawaan GENTRA: 14 Nasional + 8 Pasundan) ---
// Catatan: Nama asli sistem bawaan (originalName) dan backendVoiceId (Gemini Neural Engine ID)
// TIDAK BOLEH HILANG dalam kondisi apa pun meskipun nama aktif diubah di Studio atau Lab Suara.
export const DEFAULT_UNIFIED_VOICES = [
  // --- BLOK 1: 14 Karakter Vokal Nasional (NUSA VOICE) ---
  {
    id: 'Aoede',
    name: 'Anita',
    originalName: 'Anita',
    backendVoiceId: 'Aoede',
    geminiVoiceId: 'Aoede',
    engine: 'Google Gemini Neural',
    gender: 'Female',
    category: 'Nasional',
    role: 'Presenter Berita & Narator',
    desc: 'Ramah & Ceria (Wanita) - Vokal bersahabat dan kredibel.',
    accent: 'Nasional (Ramah)',
    avatar: '🎙️',
    tags: ['Ramah', 'Ceria', 'Presenter'],
    sampleText: 'Halo pendengar setia, selamat datang kembali di warta informasi pembangunan Jawa Barat.',
    previewUrl: '/audio/previews/anita.wav',
    personaPrompt: 'Karakter Anita (wanita presenter berita ramah, artikulatif, nada ceria dan bersahabat).',
    isCustom: false,
    isHidden: false
  },
  {
    id: 'Leda',
    name: 'Siti',
    originalName: 'Siti',
    backendVoiceId: 'Leda',
    geminiVoiceId: 'Leda',
    engine: 'Google Gemini Neural',
    gender: 'Female',
    category: 'Nasional',
    role: 'Pelayanan Publik & Edukasi',
    desc: 'Lembut & Sopan (Wanita) - Empati tinggi dan menenangkan.',
    accent: 'Nasional (Lembut)',
    avatar: '🎧',
    tags: ['Lembut', 'Empati', 'Santun'],
    sampleText: 'Terima kasih telah menghubungi layanan informasi publik Jawa Barat. Ada yang bisa kami bantu?',
    previewUrl: '/audio/previews/siti.wav',
    personaPrompt: 'Karakter Siti (wanita layanan publik yang santun, lembut, penuh empati dan bersahaja).',
    isCustom: false,
    isHidden: false
  },
  {
    id: 'Charon',
    name: 'Mugi',
    originalName: 'Agus',
    backendVoiceId: 'Charon',
    geminiVoiceId: 'Charon',
    engine: 'Google Gemini Neural',
    gender: 'Male',
    category: 'Nasional',
    role: 'Naratif Dokumenter',
    desc: 'Deep & Naratif (Pria) - Maskulin, berbobot untuk narasi profil & dokumenter.',
    accent: 'Nasional (Naratif)',
    avatar: '📻',
    tags: ['Deep', 'Maskulin', 'Dokumenter'],
    sampleText: 'Dari hamparan pegunungan Parahyangan hingga pesisir utara, Jawa Barat terus bergerak maju.',
    previewUrl: '/audio/previews/mugi.wav',
    personaPrompt: 'Karakter Mugi / Agus (pria suara deep berwibawa, intonasi tenang, narasi dokumenter maskulin).',
    isCustom: false,
    isHidden: false
  },
  {
    id: 'Despina',
    name: 'Dewi',
    originalName: 'Dewi',
    backendVoiceId: 'Despina',
    geminiVoiceId: 'Despina',
    engine: 'Google Gemini Neural',
    gender: 'Female',
    category: 'Nasional',
    role: 'Energik & Lugas',
    desc: 'Energik & Lugas (Wanita) - Artikulatif, vokal persuasif komersial & kampanye.',
    accent: 'Nasional (Energik)',
    avatar: '⚡',
    tags: ['Energik', 'Lugas', 'Persuasif'],
    sampleText: 'Ayo manfaatkan inovasi layanan digital terpadu sekarang juga untuk kemudahan hidup Anda!',
    previewUrl: '/audio/previews/dewi.wav',
    personaPrompt: 'Karakter Dewi (wanita energik, artikulasi lugas, cepat, persuasif dan ceria).',
    isCustom: false,
    isHidden: false
  },
  {
    id: 'Callirrhoe',
    name: 'Tina',
    originalName: 'Tina',
    backendVoiceId: 'Callirrhoe',
    geminiVoiceId: 'Callirrhoe',
    engine: 'Google Gemini Neural',
    gender: 'Female',
    category: 'Nasional',
    role: 'Korporat & Resmi',
    desc: 'Profesional & Jelas (Wanita) - Berbobot, intonasi formal dan tegas.',
    accent: 'Nasional (Formal)',
    avatar: '💼',
    tags: ['Formal', 'Profesional', 'Jelas'],
    sampleText: 'Berikut rangkuman capaian indikator reformasi birokrasi dan tata kelola pemerintah daerah.',
    previewUrl: '/audio/previews/tina.wav',
    personaPrompt: 'Karakter Tina (wanita profesional, pembaca laporan resmi, artikulasi presisi dan terukur).',
    isCustom: false,
    isHidden: false
  },
  {
    id: 'Autonoe',
    name: 'Maya',
    originalName: 'Maya',
    backendVoiceId: 'Autonoe',
    geminiVoiceId: 'Autonoe',
    engine: 'Google Gemini Neural',
    gender: 'Female',
    category: 'Nasional',
    role: 'Inspiratif & Hangat',
    desc: 'Inspiratif & Hangat (Wanita) - Menggugah, puitis, dan penuh optimisme jiwa.',
    accent: 'Nasional (Inspiratif)',
    avatar: '✨',
    tags: ['Inspiratif', 'Puitis', 'Optimis'],
    sampleText: 'Setiap karya dan dedikasi kita hari ini adalah warisan bermakna bagi generasi masa depan.',
    previewUrl: '/audio/previews/maya.wav',
    personaPrompt: 'Karakter Maya (wanita inspiratif hangat, intonasi menggugah, puitis dan penuh empati jiwa).',
    isCustom: false,
    isHidden: false
  },
  {
    id: 'Puck',
    name: 'Rian',
    originalName: 'Rian',
    backendVoiceId: 'Puck',
    geminiVoiceId: 'Puck',
    engine: 'Google Gemini Neural',
    gender: 'Male',
    category: 'Nasional',
    role: 'Muda & Bersemangat',
    desc: 'Muda & Bersemangat (Pria) - Santai, lincah, relevan untuk podcast & medsos.',
    accent: 'Nasional (Muda)',
    avatar: '📱',
    tags: ['Kreatif', 'Medsos', 'Santai'],
    sampleText: 'Yuk anak muda Jabar, satukan ide brilianmu dan wujudkan kreasi digital terbaik hari ini!',
    previewUrl: '/audio/previews/rian.wav',
    personaPrompt: 'Karakter Rian (pemuda bersemangat, gaul, santai komunikatif khas generasi kreatif).',
    isCustom: false,
    isHidden: false
  },
  {
    id: 'Erinome',
    name: 'Indah',
    originalName: 'Indah',
    backendVoiceId: 'Erinome',
    geminiVoiceId: 'Erinome',
    engine: 'Google Gemini Neural',
    gender: 'Female',
    category: 'Nasional',
    role: 'Meditasi & Rileks',
    desc: 'Halus & Menenangkan (Wanita) - Halus, hening, damai dan sangat menyejukkan batin.',
    accent: 'Nasional (Menenangkan)',
    avatar: '🍃',
    tags: ['Tenang', 'Halus', 'Meditatif'],
    sampleText: 'Tarik napas perlahan... rasakan ketenangan alam yang membawa kedamaian dalam batin Anda.',
    previewUrl: '/audio/previews/indah.wav',
    personaPrompt: 'Karakter Indah (wanita vokal sangat halus, intonasi tenang, relaksasi dan meditasi).',
    isCustom: false,
    isHidden: false
  },
  {
    id: 'Fenrir',
    name: 'Gading',
    originalName: 'Gading',
    backendVoiceId: 'Fenrir',
    geminiVoiceId: 'Fenrir',
    engine: 'Google Gemini Neural',
    gender: 'Male',
    category: 'Nasional',
    role: 'Otoritatif & Maskulin',
    desc: 'Berat & Maskulin (Pria) - Tegas, mantap untuk pengumuman kedaruratan & trailer.',
    accent: 'Nasional (Berat)',
    avatar: '🏛️',
    tags: ['Otoritatif', 'Berat', 'Tegas'],
    sampleText: 'Perhatian seluruh warga: patuhi arahan keselamatan publik demi keamanan dan ketertiban bersama.',
    previewUrl: '/audio/previews/gading.wav',
    personaPrompt: 'Karakter Gading (pria suara berat, tegas berwibawa, komando otoritatif resmi).',
    isCustom: false,
    isHidden: false
  },
  {
    id: 'Laomedeia',
    name: 'Shinta',
    originalName: 'Shinta',
    backendVoiceId: 'Laomedeia',
    geminiVoiceId: 'Laomedeia',
    engine: 'Google Gemini Neural',
    gender: 'Female',
    category: 'Nasional',
    role: 'Tegas & Berani',
    desc: 'Tegas & Berani (Wanita) - Lugas, artikulasi tajam, dan penuh komitmen integritas.',
    accent: 'Nasional (Tegas)',
    avatar: '🛡️',
    tags: ['Tegas', 'Berani', 'Artikulatif'],
    sampleText: 'Transparansi informasi dan pelayanan prima adalah komitmen mutlak aparatur sipil negara.',
    previewUrl: '/audio/previews/shinta.wav',
    personaPrompt: 'Karakter Shinta (wanita tegas, vokal lugas, artikulasi tajam dan berani).',
    isCustom: false,
    isHidden: false
  },
  {
    id: 'Orus',
    name: 'Bayu',
    originalName: 'Bayu',
    backendVoiceId: 'Orus',
    geminiVoiceId: 'Orus',
    engine: 'Google Gemini Neural',
    gender: 'Male',
    category: 'Nasional',
    role: 'Santai & Sejuk',
    desc: 'Santai & Sejuk (Pria) - Natural, bersahabat, mengalir ramah bersama kawan.',
    accent: 'Nasional (Santai)',
    avatar: '☕',
    tags: ['Santai', 'Sejuk', 'Bersahabat'],
    sampleText: 'Mari kita luangkan waktu sejenak untuk saling mendengarkan dan mencari solusi terbaik bersama.',
    previewUrl: '/audio/previews/bayu.wav',
    personaPrompt: 'Karakter Bayu (pria santai, intonasi sejuk, gaya bicara sahabat dekat yang ramah).',
    isCustom: false,
    isHidden: false
  },
  {
    id: 'Algenib',
    name: 'Adi',
    originalName: 'Adi',
    backendVoiceId: 'Algenib',
    geminiVoiceId: 'Algenib',
    engine: 'Google Gemini Neural',
    gender: 'Male',
    category: 'Nasional',
    role: 'Dinamis & Ceria',
    desc: 'Ceria & Bersemangat (Pria) - Penuh energi positif, membakar semangat pendengar.',
    accent: 'Nasional (Ceria)',
    avatar: '🚀',
    tags: ['Dinamis', 'Ceria', 'Semangat'],
    sampleText: 'Semangat pagi wargi semuanya! Awali hari ini dengan senyuman dan tekad untuk berprestasi!',
    previewUrl: '/audio/previews/adi.wav',
    personaPrompt: 'Karakter Adi (pria ceria bersemangat, vokal riang dan antusiasme tinggi).',
    isCustom: false,
    isHidden: false
  },
  {
    id: 'Iapetus',
    name: 'Eko',
    originalName: 'Eko',
    backendVoiceId: 'Iapetus',
    geminiVoiceId: 'Iapetus',
    engine: 'Google Gemini Neural',
    gender: 'Male',
    category: 'Nasional',
    role: 'Akademik & Ilmiah',
    desc: 'Serius & Edukatif (Pria) - Berwawasan, metodis dan runtut.',
    accent: 'Nasional (Edukatif)',
    avatar: '📊',
    tags: ['Akademik', 'Metodis', 'Serius'],
    sampleText: 'Analisis komparatif menunjukkan transformasi digital memberikan dampak signifikan pada efisiensi layanan.',
    previewUrl: '/audio/previews/eko.wav',
    personaPrompt: 'Karakter Eko (pria akademisi, intonasi serius, terstruktur, ilmiah dan edukatif).',
    isCustom: false,
    isHidden: false
  },
  {
    id: 'Achernar',
    name: 'Laras',
    originalName: 'Laras',
    backendVoiceId: 'Achernar',
    geminiVoiceId: 'Achernar',
    engine: 'Google Gemini Neural',
    gender: 'Female',
    category: 'Nasional',
    role: 'Protokoler & Anggun',
    desc: 'Anggun & Elegan (Wanita) - Penuh tata krama, wibawa kenegaraan seremonial.',
    accent: 'Nasional (Elegan)',
    avatar: '👑',
    tags: ['Anggun', 'Protokoler', 'Elegan'],
    sampleText: 'Dengan rasa bangga dan penghormatan setinggi-tingginya, marilah kita saksikan pembukaan acara resmi ini.',
    previewUrl: '/audio/previews/laras.wav',
    personaPrompt: 'Karakter Laras (wanita anggun berwibawa, seremonial kenegaraan, vokal puitis dan mulia).',
    isCustom: false,
    isHidden: false
  },

  // --- BLOK 2: 8 Karakter Vokal Khas Sunda (PASUNDAN VOICE) ---
  {
    id: 'Fenrir',
    name: 'Abah',
    originalName: 'Abah',
    backendVoiceId: 'Fenrir',
    geminiVoiceId: 'Fenrir',
    engine: 'Google Gemini Neural',
    gender: 'Male',
    category: 'Sunda',
    role: 'Kakek / Sesepuh Priangan',
    desc: 'Kakek / Sesepuh Sunda (Wibawa, Bijak & Parau Hangat khas Priangan)',
    accent: 'Sepuh Sunda (Bijaksana & Tenang)',
    avatar: '👴🏼',
    tags: ['Wibawa', 'Parau Hangat', 'Bijak'],
    sampleText: 'Kasep, geulis... regepkeun piwuruk sepuh supados salamet di dunya tur aherat.',
    previewUrl: '/audio/previews/abah.wav',
    personaPrompt: 'Karakter Abah (kakek/sesepuh Sunda yang bijaksana, suara berat berwibawa, tempo tenang bersahaja, vokal hangat khas kakek Priangan).',
    isCustom: false,
    isHidden: false
  },
  {
    id: 'Erinome',
    name: 'Nini',
    originalName: 'Nini',
    backendVoiceId: 'Erinome',
    geminiVoiceId: 'Erinome',
    engine: 'Google Gemini Neural',
    gender: 'Female',
    category: 'Sunda',
    role: 'Nenek Sunda',
    desc: 'Nenek Sunda (Penuh Kasih Sayang, Lembut & Keibuan)',
    accent: 'Nini Sunda (Halus & Welas Asih)',
    avatar: '👵🏼',
    tags: ['Teduh', 'Kasih Sayang', 'Santun'],
    sampleText: 'Sing sabar nya anaking, pancegkeun hate dina kahadean tur ibadah.',
    previewUrl: '/audio/previews/nini.wav',
    personaPrompt: 'Karakter Nini (nenek Sunda yang penuh welas asih, suara lembut penuh kehangatan nenek sepuh, tutur kata mengayomi dan damai).',
    isCustom: false,
    isHidden: false
  },
  {
    id: 'Puck',
    name: 'Ujang',
    originalName: 'Ujang',
    backendVoiceId: 'Puck',
    geminiVoiceId: 'Puck',
    engine: 'Google Gemini Neural',
    gender: 'Male',
    category: 'Sunda',
    role: 'Pemuda Pasundan',
    desc: 'Pemuda Sunda (Ceria, Lincah & Gaul Nyunda)',
    accent: 'Bujang Sunda (Lincah & Enerjik)',
    avatar: '👦🏻',
    tags: ['Ceria', 'Gaul Nyunda', 'Energik'],
    sampleText: 'Sampurasun wargi Jabar! Hayu urang babarengan ngamumule Jawa Barat Juara!',
    previewUrl: '/audio/previews/ujang.wav',
    personaPrompt: 'Karakter Ujang (pemuda Sunda yang lincah, bersahabat, ceria, vokal segar dan penuh semangat khas anak muda tanah Pasundan).',
    isCustom: false,
    isHidden: false
  },
  {
    id: 'Despina',
    name: 'Bibi (Ceu Edah)',
    originalName: 'Bibi (Ceu Edah)',
    backendVoiceId: 'Despina',
    geminiVoiceId: 'Despina',
    engine: 'Google Gemini Neural',
    gender: 'Female',
    category: 'Sunda',
    role: 'Ibu / Tante Sunda',
    desc: 'Ibu / Tante Sunda (Heboh, Ramah & Medok Sunda Guyub)',
    accent: 'Medok Sunda (Heboh & Guyub)',
    avatar: '👩🏻',
    tags: ['Guyub', 'Medok Renyah', 'Heboh'],
    sampleText: 'Aduh euy wargi sadayana, tong hilap jaga kaberesihan sareng kasehatan lingkungan nya!',
    previewUrl: '/audio/previews/bibi.wav',
    personaPrompt: 'Karakter Ceu Edah / Bibi (ibu-ibu/tante Sunda yang ekspresif, ceria heboh, akrab guyub, intonasi medok renyah khas ceu-ceu Sunda).',
    isCustom: false,
    isHidden: false
  },
  {
    id: 'Aoede',
    name: 'Neng Geulis',
    originalName: 'Budak Leutik (Eneng)',
    backendVoiceId: 'Aoede',
    geminiVoiceId: 'Aoede',
    engine: 'Google Gemini Neural',
    gender: 'Female',
    category: 'Sunda',
    role: 'Remaja Putri',
    desc: 'Remaja Putri Sunda (Ceria, Santun & Lugas mojang alami komunikatif)',
    accent: 'Mojang Remaja (Ceria & Santun)',
    avatar: '👧🏻',
    tags: ['Ceria', 'Santun', 'Remaja'],
    sampleText: 'Hayu wargi anom, urang gunakeun waktu ngora pikeun diajar jeung ngahontal cita-cita!',
    previewUrl: '/audio/previews/remaja_neng.wav',
    personaPrompt: 'Karakter Neng Geulis (mojang remaja putri Sunda yang ceria, santun, lugas, gaya bicara remaja alami yang komunikatif).',
    isCustom: false,
    isHidden: false
  },
  {
    id: 'Puck',
    name: 'Ujang Anom',
    originalName: 'Budak Leutik (Ujang Alit)',
    backendVoiceId: 'Puck',
    geminiVoiceId: 'Puck',
    engine: 'Google Gemini Neural',
    gender: 'Male',
    category: 'Sunda',
    role: 'Remaja Putra',
    desc: 'Remaja Putra Sunda (Energik, Santai & Ramah pemuda Pasundan)',
    accent: 'Pemuda Pasundan (Energik & Ramah)',
    avatar: '👦🏻',
    tags: ['Energik', 'Santai', 'Pemuda'],
    sampleText: 'Semangat wargi ngora Jawa Barat! Hayu babarengan ngamumule budaya tur prestasi!',
    previewUrl: '/audio/previews/remaja_ujang.wav',
    personaPrompt: 'Karakter Ujang Anom (pemuda remaja putra Sunda yang aktif, energik, santai, gaya bicara pemuda yang ramah dan bersemangat).',
    isCustom: false,
    isHidden: false
  },
  {
    id: 'Leda',
    name: 'Teh Neng',
    originalName: 'Teh Neng',
    backendVoiceId: 'Leda',
    geminiVoiceId: 'Leda',
    engine: 'Google Gemini Neural',
    gender: 'Female',
    category: 'Sunda',
    role: 'Mojang Priangan',
    desc: 'Gadis / Mojang Sunda (Lembut, Santun & Merdu berayun khas Priangan)',
    accent: 'Mojang Sunda (Halus & Santun)',
    avatar: '🧕🏻',
    tags: ['Merdu', 'Santun', 'Priangan'],
    sampleText: 'Wilujeng enjing wargi Priangan sadayana, mugia dinten ieu pinuh ku kurnia kabagjaan.',
    previewUrl: '/audio/previews/teh_neng.wav',
    personaPrompt: 'Karakter Teh Neng (gadis/mojang Sunda dengan intonasi halus santun, tutur kata ramah, lembut dan merdu berayun).',
    isCustom: false,
    isHidden: false
  },
  {
    id: 'Orus',
    name: 'Kang Asep',
    originalName: 'Kang Asep',
    backendVoiceId: 'Orus',
    geminiVoiceId: 'Orus',
    engine: 'Google Gemini Neural',
    gender: 'Male',
    category: 'Sunda',
    role: 'Pria Dewasa Komunikatif',
    desc: 'Pria Dewasa Sunda (Santai, Bersahabat & Luwes akrab hangat)',
    accent: 'Akang Sunda (Santai & Sahaja)',
    avatar: '👨🏻',
    tags: ['Komunikatif', 'Lugas', 'Artikulatif'],
    sampleText: 'Hayu wargi sadaya, urang silih rojong ngawangun tatar Pasundan anu maju tur berakhlak.',
    previewUrl: '/audio/previews/kang_asep.wav',
    personaPrompt: 'Karakter Kang Asep (pria dewasa Sunda yang bersahabat, luwes, santai, gaya bicara akrab dan hangat).',
    isCustom: false,
    isHidden: false
  }
];

// --- Peta Audio Preview Terkonfirmasi (Mendukung Nama Aktif & Nama Asli Bawaan) ---
export const STATIC_AUDIO_PREVIEWS = {
  // Pasundan (Blok 2)
  'Abah': '/audio/previews/abah.wav',
  'Nini': '/audio/previews/nini.wav',
  'Ujang': '/audio/previews/ujang.wav',
  'Bibi (Ceu Edah)': '/audio/previews/bibi.wav',
  'Neng Geulis': '/audio/previews/remaja_neng.wav',
  'Budak Leutik (Eneng)': '/audio/previews/remaja_neng.wav',
  'Budak Leutik Eneng': '/audio/previews/remaja_neng.wav',
  'Ujang Anom': '/audio/previews/remaja_ujang.wav',
  'Budak Leutik (Ujang Alit)': '/audio/previews/remaja_ujang.wav',
  'Budak Leutik Ujang Alit': '/audio/previews/remaja_ujang.wav',
  'Teh Neng': '/audio/previews/teh_neng.wav',
  'Kang Asep': '/audio/previews/kang_asep.wav',

  // Nasional (Blok 1 - NUSA VOICE)
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
  'Laras': '/audio/previews/laras.wav',

  // Fallback Gemini Voice IDs
  'Aoede': '/audio/previews/anita.wav',
  'Charon': '/audio/previews/mugi.wav',
  'Fenrir': '/audio/previews/gading.wav',
  'Puck': '/audio/previews/rian.wav',
  'Leda': '/audio/previews/siti.wav',
  'Despina': '/audio/previews/dewi.wav',
  'Callirrhoe': '/audio/previews/tina.wav',
  'Autonoe': '/audio/previews/maya.wav',
  'Erinome': '/audio/previews/indah.wav',
  'Laomedeia': '/audio/previews/shinta.wav',
  'Orus': '/audio/previews/bayu.wav',
  'Algenib': '/audio/previews/adi.wav',
  'Iapetus': '/audio/previews/eko.wav',
  'Achernar': '/audio/previews/laras.wav'
};

// --- Helper Utama: Membaca Suara Terpadu (Menggabungkan Standar Pabrik + Kustomisasi) ---
export function getUnifiedVoices() {
  try {
    const rawSaved = safeGetItem(GENTRA_VOICES_STORAGE_KEY);
    const customPrompts = JSON.parse(safeGetItem('gentra_custom_voice_prompts') || '{}');

    if (rawSaved) {
      const parsed = JSON.parse(rawSaved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const clonedVoices = parsed.filter(v => v.isCloned);

        const merged = DEFAULT_UNIFIED_VOICES.map(dv => {
          // Cari entri tersimpan berdasarkan originalName atau name
          const found = parsed.find(p => 
            p.originalName === dv.originalName ||
            p.originalName === dv.name ||
            p.name === dv.name ||
            p.name === dv.originalName ||
            (p.id === dv.id && p.category === dv.category && (p.role === dv.role || p.originalName === dv.originalName))
          );

          const customPrompt = customPrompts[dv.name] || (found && customPrompts[found.name]);

          if (found) {
            return {
              ...dv,
              ...found,
              // JAMINAN MUTLAK: Nama asli sistem dan backend voice ID tidak boleh hilang
              originalName: dv.originalName,
              backendVoiceId: dv.backendVoiceId,
              geminiVoiceId: dv.geminiVoiceId,
              engine: dv.engine || 'Google Gemini Neural',
              name: found.name || dv.name,
              personaPrompt: customPrompt || found.personaPrompt || dv.personaPrompt,
              previewUrl: dv.previewUrl || found.previewUrl || STATIC_AUDIO_PREVIEWS[found.name] || STATIC_AUDIO_PREVIEWS[dv.name]
            };
          }

          return {
            ...dv,
            personaPrompt: customPrompt || dv.personaPrompt
          };
        });

        return [...merged, ...clonedVoices];
      }
    }
  } catch (e) {
    console.warn("Gagal membaca registry vokal tersimpan:", e);
  }

  // Fallback ke standar pabrik
  return DEFAULT_UNIFIED_VOICES.map(v => ({ ...v }));
}

// --- Helper: Menyimpan Suara & Menyiarkan Event Real-Time 3-Arah ---
export function saveUnifiedVoices(newVoices) {
  if (!Array.isArray(newVoices)) return;

  // Pastikan setiap suara memiliki originalName & backendVoiceId utuh
  const sanitized = newVoices.map(v => {
    const defaultRef = DEFAULT_UNIFIED_VOICES.find(d => 
      d.originalName === v.originalName || 
      d.name === v.originalName || 
      d.name === v.name
    );

    const originalName = defaultRef ? defaultRef.originalName : (v.originalName || v.name);
    const backendVoiceId = defaultRef ? defaultRef.backendVoiceId : (v.backendVoiceId || v.id || 'Aoede');

    return {
      ...v,
      originalName,
      backendVoiceId,
      geminiVoiceId: backendVoiceId,
      engine: v.engine || 'Google Gemini Neural'
    };
  });

  try {
    safeSetItem(GENTRA_VOICES_STORAGE_KEY, JSON.stringify(sanitized));
  } catch (e) {
    console.error("Gagal menyimpan ke storage:", e);
  }

  // Siarkan event ke Landing Page, Studio, dan Lab
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent(GENTRA_VOICES_EVENT, { detail: sanitized }));
    } catch (e) {}
  }

  return sanitized;
}

// --- Helper: Reset 1 Karakter ke Nama Asli Bawaan ---
export function resetVoiceToOriginal(voiceIdentifier) {
  const currentVoices = getUnifiedVoices();
  const defaultRef = DEFAULT_UNIFIED_VOICES.find(d => 
    d.name === voiceIdentifier || 
    d.originalName === voiceIdentifier || 
    d.id === voiceIdentifier
  );

  if (!defaultRef) return currentVoices;

  const updated = currentVoices.map(v => {
    if (v.originalName === defaultRef.originalName || v.name === defaultRef.name || v.name === voiceIdentifier) {
      return {
        ...defaultRef,
        isHidden: false
      };
    }
    return v;
  });

  return saveUnifiedVoices(updated);
}

// --- Helper: Reset Seluruh Karakter Suara ke Standar Pabrik ---
export function resetAllVoicesToOriginal() {
  const factoryVoices = DEFAULT_UNIFIED_VOICES.map(v => ({ ...v }));
  try {
    safeSetItem(GENTRA_VOICES_STORAGE_KEY, JSON.stringify(factoryVoices));
  } catch (e) {}

  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent(GENTRA_VOICES_EVENT, { detail: factoryVoices }));
    } catch (e) {}
  }

  return factoryVoices;
}

// --- Helper: Cek URL Preview Karakter ---
export function getVoicePreviewUrl(voiceNameOrId) {
  if (!voiceNameOrId) return null;
  return STATIC_AUDIO_PREVIEWS[voiceNameOrId] || null;
}
