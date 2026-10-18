import React, { useState, useRef } from 'react';
import { 
  Mic, 
  Sparkles, 
  ArrowRight, 
  Volume2, 
  VolumeX,
  ShieldCheck, 
  Cpu, 
  Copy, 
  Megaphone, 
  FileAudio, 
  Play, 
  Pause,
  CheckCircle2, 
  Users, 
  Globe2, 
  Radio, 
  Zap,
  Sliders,
  Award,
  Layers,
  Share2,
  FileText,
  Headphones,
  Check,
  Building2,
  X,
  Activity,
  Download
} from 'lucide-react';

const FULL_PERSONAS = [
  // BLOK 1 — 14 Karakter Vokal Nasional (NUSA VOICE)
  { 
    id: 'Aoede', 
    name: 'Anita', 
    gender: 'Wanita', 
    category: 'Nasional', 
    role: 'Presenter Berita & Narator', 
    desc: 'Ramah, ceria, vokal wanita bersahabat dan kredibel.', 
    badge: 'Nasional',
    avatar: '🎙️',
    tags: ['Ramah', 'Ceria', 'Presenter'],
    sampleText: 'Halo pendengar setia, selamat datang kembali di warta informasi pembangunan Jawa Barat.'
  },
  { 
    id: 'Leda', 
    name: 'Siti', 
    gender: 'Wanita', 
    category: 'Nasional', 
    role: 'Pelayanan Publik & Edukasi', 
    desc: 'Lembut, santun, empati tinggi dan menenangkan.', 
    badge: 'Nasional',
    avatar: '🎧',
    tags: ['Lembut', 'Empati', 'Santun'],
    sampleText: 'Terima kasih telah menghubungi layanan informasi publik Jawa Barat. Ada yang bisa kami bantu?'
  },
  { 
    id: 'Charon', 
    name: 'Agus', 
    gender: 'Pria', 
    category: 'Nasional', 
    role: 'Naratif Dokumenter', 
    desc: 'Deep, maskulin, berbobot untuk narasi profil & dokumenter.', 
    badge: 'Nasional',
    avatar: '📻',
    tags: ['Deep', 'Maskulin', 'Dokumenter'],
    sampleText: 'Dari hamparan pegunungan Parahyangan hingga pesisir utara, Jawa Barat terus bergerak maju.'
  },
  { 
    id: 'Despina', 
    name: 'Dewi', 
    gender: 'Wanita', 
    category: 'Nasional', 
    role: 'Energik & Lugas', 
    desc: 'Jelas, artikulatif, vokal persuasif komersial & kampanye.', 
    badge: 'Nasional',
    avatar: '⚡',
    tags: ['Energik', 'Lugas', 'Persuasif'],
    sampleText: 'Ayo manfaatkan inovasi layanan digital terpadu sekarang juga untuk kemudahan hidup Anda!'
  },
  { 
    id: 'Callirrhoe', 
    name: 'Tina', 
    gender: 'Wanita', 
    category: 'Nasional', 
    role: 'Korporat & Resmi', 
    desc: 'Profesional, berbobot, intonasi formal dan tegas.', 
    badge: 'Nasional',
    avatar: '💼',
    tags: ['Formal', 'Profesional', 'Jelas'],
    sampleText: 'Berikut rangkuman capaian indikator reformasi birokrasi dan tata kelola pemerintah daerah.'
  },
  { 
    id: 'Autonoe', 
    name: 'Maya', 
    gender: 'Wanita', 
    category: 'Nasional', 
    role: 'Inspiratif & Hangat', 
    desc: 'Menggugah, puitis, dan penuh optimisme jiwa.', 
    badge: 'Nasional',
    avatar: '✨',
    tags: ['Inspiratif', 'Puitis', 'Optimis'],
    sampleText: 'Setiap karya dan dedikasi kita hari ini adalah warisan bermakna bagi generasi masa depan.'
  },
  { 
    id: 'Puck', 
    name: 'Rian', 
    gender: 'Pria', 
    category: 'Nasional', 
    role: 'Muda & Kreatif', 
    desc: 'Santai, lincah, relevan untuk audiens generasi muda.', 
    badge: 'Nasional',
    avatar: '📱',
    tags: ['Kreatif', 'Medsos', 'Santai'],
    sampleText: 'Yuk anak muda Jabar, satukan ide brilianmu dan wujudkan kreasi digital terbaik hari ini!'
  },
  { 
    id: 'Erinome', 
    name: 'Indah', 
    gender: 'Wanita', 
    category: 'Nasional', 
    role: 'Meditasi & Rileks', 
    desc: 'Halus, hening, damai dan sangat menyejukkan batin.', 
    badge: 'Nasional',
    avatar: '🍃',
    tags: ['Tenang', 'Halus', 'Meditatif'],
    sampleText: 'Tarik napas perlahan... rasakan ketenangan alam yang membawa kedamaian dalam batin Anda.'
  },
  { 
    id: 'Fenrir', 
    name: 'Gading', 
    gender: 'Pria', 
    category: 'Nasional', 
    role: 'Otoritatif & Maskulin', 
    desc: 'Tegas, berat, mantap untuk pengumuman kedaruratan.', 
    badge: 'Nasional',
    avatar: '🏛️',
    tags: ['Otoritatif', 'Berat', 'Tegas'],
    sampleText: 'Perhatian seluruh warga: patuhi arahan keselamatan publik demi keamanan dan ketertiban bersama.'
  },
  { 
    id: 'Laomedeia', 
    name: 'Shinta', 
    gender: 'Wanita', 
    category: 'Nasional', 
    role: 'Tegas & Berani', 
    desc: 'Lugas, artikulasi tajam, dan penuh komitmen integritas.', 
    badge: 'Nasional',
    avatar: '🛡️',
    tags: ['Tegas', 'Berani', 'Artikulatif'],
    sampleText: 'Transparansi informasi dan pelayanan prima adalah komitmen mutlak aparatur sipil negara.'
  },
  { 
    id: 'Orus', 
    name: 'Bayu', 
    gender: 'Pria', 
    category: 'Nasional', 
    role: 'Santai & Sejuk', 
    desc: 'Natural, bersahabat, seperti mengobrol santai bersama kawan.', 
    badge: 'Nasional',
    avatar: '☕',
    tags: ['Santai', 'Sejuk', 'Bersahabat'],
    sampleText: 'Mari kita luangkan waktu sejenak untuk saling mendengarkan dan mencari solusi terbaik bersama.'
  },
  { 
    id: 'Algenib', 
    name: 'Adi', 
    gender: 'Pria', 
    category: 'Nasional', 
    role: 'Dinamis & Ceria', 
    desc: 'Penuh energi positif, membakar semangat pendengar.', 
    badge: 'Nasional',
    avatar: '🚀',
    tags: ['Dinamis', 'Ceria', 'Semangat'],
    sampleText: 'Semangat pagi wargi semuanya! Awali hari ini dengan senyuman dan tekad untuk berprestasi!'
  },
  { 
    id: 'Iapetus', 
    name: 'Eko', 
    gender: 'Pria', 
    category: 'Nasional', 
    role: 'Akademik & Ilmiah', 
    desc: 'Serius, berwawasan, metodis dan runtut.', 
    badge: 'Nasional',
    avatar: '📊',
    tags: ['Akademik', 'Metodis', 'Serius'],
    sampleText: 'Analisis komparatif menunjukkan transformasi digital memberikan dampak signifikan pada efisiensi layanan.'
  },
  { 
    id: 'Achernar', 
    name: 'Laras', 
    gender: 'Wanita', 
    category: 'Nasional', 
    role: 'Protokoler & Anggun', 
    desc: 'Anggun, penuh tata krama, wibawa kenegaraan.', 
    badge: 'Nasional',
    avatar: '👑',
    tags: ['Anggun', 'Protokoler', 'Elegan'],
    sampleText: 'Dengan rasa bangga dan penghormatan setinggi-tingginya, marilah kita saksikan pembukaan acara resmi ini.'
  },

  // BLOK 2 — 8 Karakter Khas Sunda (PASUNDAN VOICE)
  { 
    id: 'sunda_abah', 
    name: 'Abah', 
    gender: 'Pria', 
    category: 'Khas Sunda', 
    role: 'Kakek / Sesepuh Priangan', 
    desc: 'Wibawa, bijak, parau hangat khas kakek Priangan.', 
    badge: 'Sunda',
    avatar: '👴🏼',
    tags: ['Wibawa', 'Parau Hangat', 'Bijak'],
    sampleText: 'Kasep, geulis... regepkeun piwuruk sepuh supados salamet di dunya tur aherat.'
  },
  { 
    id: 'sunda_nini', 
    name: 'Nini', 
    gender: 'Wanita', 
    category: 'Khas Sunda', 
    role: 'Nenek Sunda', 
    desc: 'Lembut, teduh, penuh welas asih dan doa seorang ibu.', 
    badge: 'Sunda',
    avatar: '👵🏼',
    tags: ['Teduh', 'Kasih Sayang', 'Santun'],
    sampleText: 'Sing sabar nya anaking, pancegkeun hate dina kahadean tur ibadah.'
  },
  { 
    id: 'sunda_ujang', 
    name: 'Ujang', 
    gender: 'Pria', 
    category: 'Khas Sunda', 
    role: 'Pemuda Pasundan', 
    desc: 'Ceria, lincah, bersemangat dan gaul nyunda.', 
    badge: 'Sunda',
    avatar: '👦🏻',
    tags: ['Ceria', 'Gaul Nyunda', 'Energik'],
    sampleText: 'Sampurasun wargi Jabar! Hayu urang babarengan ngamumule Jawa Barat Juara!'
  },
  { 
    id: 'sunda_bibi', 
    name: 'Bibi (Ceu Edah)', 
    gender: 'Wanita', 
    category: 'Khas Sunda', 
    role: 'Ibu / Tante Sunda', 
    desc: 'Heboh, akrab, guyub dan medok renyah bersahabat.', 
    badge: 'Sunda',
    avatar: '👩🏻',
    tags: ['Guyub', 'Medok Renyah', 'Heboh'],
    sampleText: 'Aduh euy wargi sadayana, tong hilap jaga kaberesihan sareng kasehatan lingkungan nya!'
  },
  { 
    id: 'sunda_budak_eneng', 
    name: 'Budak Leutik Eneng', 
    gender: 'Wanita', 
    category: 'Khas Sunda', 
    role: 'Anak Perempuan', 
    desc: 'Imut, polos, cempreng alami dan menggemaskan.', 
    badge: 'Sunda',
    avatar: '👧🏻',
    tags: ['Polos', 'Imut', 'Menggemaskan'],
    sampleText: 'Bapa, Ibu... Eneng hoyong diajar maca Al-Qur\'an sareng ngadongeng sasarengan!'
  },
  { 
    id: 'sunda_budak_ujang', 
    name: 'Budak Leutik Ujang Alit', 
    gender: 'Pria', 
    category: 'Khas Sunda', 
    role: 'Anak Laki-laki', 
    desc: 'Lincah, polos, suka bertanya dan periang.', 
    badge: 'Sunda',
    avatar: '👦🏻',
    tags: ['Lincah', 'Riang', 'Kreatif'],
    sampleText: 'Horeee! Hayu urang ulin ka buruan bari diajar elmu pangaweruh anyar!'
  },
  { 
    id: 'sunda_teh_neng', 
    name: 'Teh Neng', 
    gender: 'Wanita', 
    category: 'Khas Sunda', 
    role: 'Mojang Priangan', 
    desc: 'Lembut, santun, tutur kata merdu berayun khas Jawa Barat.', 
    badge: 'Sunda',
    avatar: '🧕🏻',
    tags: ['Merdu', 'Santun', 'Priangan'],
    sampleText: 'Wilujeng enjing wargi Priangan sadayana, mugia dinten ieu pinuh ku kurnia kabagjaan.'
  },
  { 
    id: 'sunda_kang_asep', 
    name: 'Kang Asep', 
    gender: 'Pria', 
    category: 'Khas Sunda', 
    role: 'Pria Dewasa Komunikatif', 
    desc: 'Lugas, ramah, artikulatif dan bersahabat.', 
    badge: 'Sunda',
    avatar: '👨🏻',
    tags: ['Komunikatif', 'Lugas', 'Artikulatif'],
    sampleText: 'Hayu wargi sadaya, urang silih rojong ngawangun tatar Pasundan anu maju tur berakhlak.'
  }
];

// Peta File Audio Preview Terkonfirmasi di Landing Page (22 Persona Lengkap Aktif - Kualitas Studio Alami)
export const LANDING_STATIC_PREVIEWS = {
  // 8 Persona Khas Sunda
  'Abah': '/audio/previews/abah.wav',
  'Nini': '/audio/previews/nini.wav',
  'Ujang': '/audio/previews/ujang.wav',
  'Bibi (Ceu Edah)': '/audio/previews/bibi.wav',
  'Budak Leutik Eneng': '/audio/previews/budak_eneng.wav',
  'Budak Leutik Ujang Alit': '/audio/previews/budak_ujang.mp3',
  'Teh Neng': '/audio/previews/teh_neng.wav',
  'Kang Asep': '/audio/previews/kang_asep.mp3',

  // 14 Persona Nasional (Studio-Grade Neural & High-Fidelity)
  'Anita': '/audio/previews/anita.wav',
  'Siti': '/audio/previews/siti.wav',
  'Agus': '/audio/previews/agus.wav',
  'Dewi': '/audio/previews/elevenlabs_laura.mp3',
  'Tina': '/audio/previews/elevenlabs_alice.mp3',
  'Maya': '/audio/previews/elevenlabs_sarah.mp3',
  'Rian': '/audio/previews/elevenlabs_callum.mp3',
  'Indah': '/audio/previews/siti.wav',
  'Gading': '/audio/previews/elevenlabs_george.mp3',
  'Shinta': '/audio/previews/elevenlabs_alice.mp3',
  'Bayu': '/audio/previews/elevenlabs_roger.mp3',
  'Adi': '/audio/previews/elevenlabs_charlie.mp3',
  'Eko': '/audio/previews/agus.wav',
  'Laras': '/audio/previews/teh_neng.wav'
};

export const LandingPage = ({ onOpenLogin }) => {
  const [playingVoice, setPlayingVoice] = useState(null);
  const [personaFilter, setPersonaFilter] = useState('Semua');
  const [unavailableVoiceToast, setUnavailableVoiceToast] = useState(null);
  const landingAudioRef = useRef(null);
  const landingAudioCache = useRef({});

  const filteredPersonas = FULL_PERSONAS.filter(p => {
    if (personaFilter === 'Semua') return true;
    if (personaFilter === 'Sunda') return p.category === 'Khas Sunda';
    if (personaFilter === 'Nasional') return p.category === 'Nasional';
    if (personaFilter === 'Pria') return p.gender === 'Pria';
    if (personaFilter === 'Wanita') return p.gender === 'Wanita';
    return true;
  });

  const handlePlayVoicePreview = async (persona) => {
    if (!persona) return;

    // Strict validation: jika file preview belum tersedia, tampilkan notifikasi abu dan blokir pemutaran
    const targetUrl = landingAudioCache.current[persona.name] || LANDING_STATIC_PREVIEWS[persona.name];
    if (!targetUrl) {
      setUnavailableVoiceToast(persona.name);
      setTimeout(() => setUnavailableVoiceToast(null), 4000);
      return;
    }

    if (playingVoice === persona.name) {
      if (landingAudioRef.current) {
        landingAudioRef.current.pause();
        landingAudioRef.current.currentTime = 0;
      }
      setPlayingVoice(null);
      return;
    }

    if (landingAudioRef.current) {
      landingAudioRef.current.pause();
      landingAudioRef.current.currentTime = 0;
    }

    setPlayingVoice(persona.name);

    try {
      const audio = new Audio(targetUrl);
      landingAudioRef.current = audio;
      audio.onended = () => setPlayingVoice(null);
      audio.onerror = () => setPlayingVoice(null);
      await audio.play();
    } catch (err) {
      console.warn('Gagal memutar audio preview langsung:', err);
      setPlayingVoice(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-zinc-900 font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand Lockup */}
          <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img 
              src="/logo.png" 
              alt="GENTRA Logo" 
              className="w-12 h-12 rounded-2xl object-cover shadow-sm border border-zinc-200/90 hover:scale-105 transition-transform shrink-0" 
            />
            <div className="flex flex-col justify-center">
              <span className="text-2xl sm:text-[27px] font-black tracking-tight text-slate-900 leading-none">GENTRA</span>
              <span className="text-[11px] sm:text-xs font-bold text-amber-600 tracking-tight mt-0.5 whitespace-nowrap leading-none">Ti Téks Jadi Sora</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-bold text-zinc-600">
            <a href="#fitur" className="hover:text-indigo-600 transition-colors">Fitur Unggulan</a>
            <a href="#ekosistem" className="hover:text-indigo-600 transition-colors">Bagan Ekosistem</a>
            <a href="#persona" className="hover:text-indigo-600 transition-colors">22 Karakter Vokal</a>
            <a href="#ilm" className="hover:text-indigo-600 transition-colors">Mode ILM</a>
          </nav>

          {/* Login CTA */}
          <button 
            onClick={onOpenLogin}
            className="px-5 sm:px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 group ring-1 ring-slate-800/20 shrink-0"
          >
            <span>Masuk ke Studio</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </header>

      {/* 2. Hero Section with Responsive Gedung Sate Parahyangan Background */}
      <section className="relative flex flex-col items-center justify-center pt-14 pb-16 sm:pt-18 sm:pb-20 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28 overflow-hidden bg-[#F8FAF9]">
        {/* Background Image: Gedung Sate & Pegunungan Parahyangan - Full Panorama */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
          <img 
            src="/hero-bg.jpg" 
            alt="Panorama Gedung Sate Bandung & Pegunungan Parahyangan" 
            className="w-full h-full object-cover object-[center_65%] opacity-90 sm:opacity-95 select-none pointer-events-none" 
          />
          {/* Gentle atmospheric balance: lets Gedung Sate & Parahyangan mountains shine brightly while keeping typography 100% readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FBFBFA]/75 via-white/50 to-[#FBFBFA]/85" />
          {/* Central diffuse glow: softens the bright sunset directly behind text so it doesn't clash */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.75)_0%,transparent_75%)]" />
          <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-white to-transparent" />
        </div>
        
        {/* Ambient Top Blend */}
        <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-[#FBFBFA]/90 to-transparent pointer-events-none z-10" />

        <div className="relative z-10 max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center space-y-5 sm:space-y-6">
          
          {/* Typography - Balanced, Impactful & Wide */}
          <div className="space-y-3.5 flex flex-col items-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.08] drop-shadow-sm">
              Ti Téks <span className="text-indigo-600">Jadi Sora.</span>
            </h1>
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/90 backdrop-blur-md border border-amber-300/70 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <p className="text-xs sm:text-sm md:text-base font-black tracking-wider text-amber-700 uppercase">
                Gentra Produksi Audio • Standar Penyiaran & Studio Rekaman
              </p>
            </div>
          </div>

          <p className="max-w-4xl mx-auto text-xs sm:text-sm md:text-base lg:text-[17px] text-zinc-800 font-semibold leading-relaxed bg-white/80 backdrop-blur-md px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl border border-white/90 shadow-xs">
            Platform sintesis suara natural berstandar studio untuk Tim Komunikasi Publik Pemprov Jawa Barat. Menghadirkan karakter vokal unik <strong className="text-slate-900 font-bold">Khas Sunda & Nasional</strong>, mesin mastering <strong className="text-slate-900 font-bold">Broadcast 48kHz / 44.1kHz</strong>, dan generator naskah <strong className="text-slate-900 font-bold">Iklan Layanan Masyarakat (ILM)</strong> berbasis kearifan lokal.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 w-full sm:w-auto">
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white text-xs sm:text-sm md:text-base font-bold shadow-xl shadow-slate-950/20 hover:shadow-2xl transition-all flex items-center justify-center gap-2.5 group ring-1 ring-slate-800 hover:scale-[1.02]"
            >
              <span>BUKA STUDIO VOICE OVER</span>
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#persona"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/95 hover:bg-white backdrop-blur-md border border-zinc-300 text-zinc-800 text-xs sm:text-sm md:text-base font-bold shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <Volume2 className="w-4 h-4 text-indigo-600" />
              <span>Dengarkan 22 Persona Suara</span>
            </a>
          </div>
        </div>

        {/* Quick Metrics in Frosted Glass - Expansive Wide Layout */}
        <div className="pt-4 sm:pt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-5xl lg:max-w-6xl mx-auto w-full text-left">
          <div className="bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/95 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 block">22 Karakter</span>
            <span className="text-xs sm:text-[13px] text-zinc-700 font-semibold mt-0.5 block">14 Nasional + 8 Khas Sunda</span>
          </div>
          <div className="bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/95 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-indigo-600 block">48 & 44.1 kHz</span>
            <span className="text-xs sm:text-[13px] text-zinc-700 font-semibold mt-0.5 block">Standar DAW & Broadcast WAV</span>
          </div>
          <div className="bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/95 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-600 block">Mode ILM</span>
            <span className="text-xs sm:text-[13px] text-zinc-700 font-semibold mt-0.5 block">Generator Kampanye 30s & 60s</span>
          </div>
          <div className="bg-white/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/95 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 block">Transkripsi AI</span>
            <span className="text-xs sm:text-[13px] text-zinc-700 font-semibold mt-0.5 block">Konversi Suara ke Naskah Instan</span>
          </div>
        </div>
      </section>



      {/* 3. Fitur Unggulan (Bento Grid) */}
      <section id="fitur" className="py-10 sm:py-12 md:py-14 bg-white border-y border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-2">
            <span className="text-xs font-bold tracking-widest text-[#0C4E34] uppercase bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              Fitur Terpadu
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
              Dirancang Khusus untuk Alur Kerja Tim Media Pemprov
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Seluruh perkakas produksi audio yang dibutuhkan dikemas dalam satu antarmuka yang bersih, cepat, dan berstandar studio siaran.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-[#FBFBFA] p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-4 hover:border-[#0C4E34]/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-[#0C4E34] flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">22 Karakter Vokal Bawaan</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Menyediakan 8 karakter otentik khas Sunda (Abah, Nini, Ujang, Bibi, Budak Leutik, Teh Neng, Kang Asep) dan 14 karakter penyiar nasional standar penyiaran resmi.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#FBFBFA] p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-4 hover:border-[#0C4E34]/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-[#F59E0B] flex items-center justify-center font-bold">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">Studio Resampling 48kHz / 44.1kHz</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Menghasilkan format WAV 48 kHz (Broadcast Video Timeline) dan 44.1 kHz (Studio DAW Mastering) dengan arsitektur Zero-Drift tanpa distorsi audio.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#FBFBFA] p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-4 hover:border-[#0C4E34]/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-blue-100/70 text-blue-700 flex items-center justify-center font-bold">
                <Megaphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">Generator Naskah ILM Otomatis</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Pembuatan naskah Iklan Layanan Masyarakat terukur 30 detik atau 60 detik secara instan, siap rekam untuk kampanye sosial dan himbauan publik.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#FBFBFA] p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-4 hover:border-[#0C4E34]/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-purple-100/70 text-purple-700 flex items-center justify-center font-bold">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">Kontrol Emosi & Dinamika Vokal</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Kustomisasi artikulasi, nada bicara, tempo cepat-lambat, dan variasi gaya emosi dari formal warta berita hingga narasi hangat bersahabat.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-[#FBFBFA] p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-4 hover:border-[#0C4E34]/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-rose-100/70 text-rose-700 flex items-center justify-center font-bold">
                <FileAudio className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">Transkripsi Naskah Otomatis</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Konversi audio rekaman rapat, konferensi pers, atau naskah lisan menjadi teks terstruktur dalam hitungan detik secara otomatis dengan presisi tinggi.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-[#FBFBFA] p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-4 hover:border-[#0C4E34]/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-teal-100/70 text-teal-700 flex items-center justify-center font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">Neural Engine & Kontrol Emosi</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Teknologi neural audio berstandar penyiaran dengan pengaturan nada, tempo, artikulasi, dan gaya emosi naratif.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. BAGAN EKOSISTEM PRODUKSI AUDIO IKP DISKOMINFO JABAR */}
      <section id="ekosistem" className="py-10 sm:py-12 md:py-14 bg-gradient-to-b from-[#FBFBFA] via-emerald-50/20 to-[#FBFBFA] border-b border-zinc-200 relative overflow-hidden">
        {/* Subtle Decorative Backdrop Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#0C4E34_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-2">
            <span className="text-xs font-black tracking-widest text-[#0C4E34] uppercase bg-white border border-emerald-200 px-3.5 py-1.5 rounded-full shadow-xs inline-flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#F59E0B]" />
              ARSITEKTUR & ALUR KERJA TERPADU
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
              Bagan Ekosistem Produksi Audio
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Alur kerja terpadu dari pengolahan naskah kebijakan pemerintah provinsi hingga distribusi siaran audio multi-kanal berstandar broadcast untuk wargi Jawa Barat.
            </p>
          </div>

          {/* 4-Stage Workflow Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            
            {/* Stage 1: Masukan Naskah */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all group flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-[#0C4E34] border border-emerald-200">
                    LANGKAH 01
                  </span>
                  <FileText className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-black text-zinc-900 group-hover:text-[#0C4E34] transition-colors">
                  1. Masukan Naskah
                </h3>
                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                  Ketik atau tempel naskah voice over langsung, buat naskah Iklan Layanan Masyarakat (ILM 30s/60s) otomatis, atau transkripsikan rekaman audio rapat secara otomatis.
                </p>
                
                <div className="mt-4 pt-3 border-t border-zinc-100 space-y-1.5 text-[11px] text-zinc-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Naskah Voice Over Bebas</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Generator ILM Otomatis (30s & 60s)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Transkripsi Suara Otomatis</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                <span>Format Input</span>
                <span className="font-bold text-emerald-700">Teks / Audio</span>
              </div>
            </div>

            {/* Stage 2: Pilih Karakter Suara */}
            <div className="bg-white rounded-3xl p-6 border-2 border-[#0C4E34]/30 shadow-md hover:shadow-xl hover:border-[#0C4E34] transition-all group flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0C4E34] to-[#F59E0B]" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#0C4E34] text-white">
                    LANGKAH 02 • INTI
                  </span>
                  <Headphones className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <h3 className="text-lg font-black text-zinc-900 group-hover:text-[#0C4E34] transition-colors">
                  2. Pilih Karakter Suara
                </h3>
                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                  Pilih dari 22 karakter vokal resmi: Blok 1 NUSA VOICE (14 karakter nasional penyiaran) dan Blok 2 PASUNDAN VOICE (8 karakter orisinal tatar Pasundan).
                </p>

                <div className="mt-4 pt-3 border-t border-zinc-100 space-y-1.5 text-[11px] text-zinc-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#0C4E34] shrink-0" />
                    <span>Blok 1: 14 Vokal Nasional</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#0C4E34] shrink-0" />
                    <span>Blok 2: 8 Vokal Khas Sunda</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#0C4E34] shrink-0" />
                    <span>Audisi Vokal Instan (Dengar)</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                <span>Pilihan Vokal</span>
                <span className="font-bold text-[#0C4E34]">22 Karakter Resmi</span>
              </div>
            </div>

            {/* Stage 3: Pilih Gaya Bicara & Emosi */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-amber-500/50 transition-all group flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#F59E0B] to-amber-600" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-[#F59E0B] border border-amber-200">
                    LANGKAH 03
                  </span>
                  <Sliders className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <h3 className="text-lg font-black text-zinc-900 group-hover:text-[#0C4E34] transition-colors">
                  3. Pilih Gaya Bicara
                </h3>
                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                  Modulasi gaya penyampaian: pilih emosi (Ramah, Semangat, Tenang, Tegas), atur tempo kecepatan dan nada vokal, serta sisipkan tag emosi alami [tertawa], [berbisik].
                </p>

                <div className="mt-4 pt-3 border-t border-zinc-100 space-y-1.5 text-[11px] text-zinc-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>9 Pilihan Emosi & Gaya Bicara</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Kontrol Tempo & Nada Dasar</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Tag Emosi Alami [tertawa], [bisik]</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                <span>Modulasi</span>
                <span className="font-bold text-amber-700">Emosi & Artikulasi</span>
              </div>
            </div>

            {/* Stage 4: Render & Unduh Audio WAV */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all group flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 to-emerald-600" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    LANGKAH 04
                  </span>
                  <Download className="w-5 h-5 text-teal-600" />
                </div>
                <h3 className="text-lg font-black text-zinc-900 group-hover:text-[#0C4E34] transition-colors">
                  4. Render & Unduh WAV
                </h3>
                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                  Sintesis vokal neural instan, proses mastering otomatis ke standar siaran (WAV 48 kHz / 44.1 kHz), dan unduh file audio berkualitas tanpa kompresi.
                </p>

                <div className="mt-4 pt-3 border-t border-zinc-100 space-y-1.5 text-[11px] text-zinc-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Sintesis Vokal Neural Seketika</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Mastering 48 kHz Broadcast</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>File WAV 16-bit Lossless Siap Siar</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                <span>Output Final</span>
                <span className="font-bold text-teal-700">WAV Broadcast</span>
              </div>
            </div>

          </div>

          {/* Bottom Ecosystem Callout */}
          <div className="mt-7 sm:mt-8 bg-white rounded-3xl p-5 sm:p-6 md:p-7 border border-emerald-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-[#0C4E34] text-[#F59E0B] flex items-center justify-center shrink-0 shadow-md">
                <Radio className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="text-base font-bold text-zinc-900 break-words">
                  Integrasi Langsung ke Alur Kerja Produksi
                </h4>
                <p className="text-xs text-zinc-600 mt-0.5 break-words">
                  Dari editor Premiere Pro, DaVinci Resolve, hingga kanal siaran radio — file WAV GENTRA siap pakai tanpa perlu penyesuaian sampling rate manual.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0C4E34] hover:bg-[#083B27] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all shrink-0 flex items-center justify-center gap-2"
            >
              <span>Mulai Produksi Konten</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F59E0B]" />
            </button>
          </div>

        </div>
      </section>

      {/* 5. SHOWCASE 22 KARAKTER PERSONA SUARA (DYNAMIC, INTERACTIVE, NON-FLAT) */}
      <section id="persona" className="py-10 sm:py-12 md:py-14 bg-white border-b border-zinc-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 space-y-2">
            <span className="text-xs font-black tracking-widest text-[#0C4E34] uppercase bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-xs">
              <Headphones className="w-3.5 h-3.5 text-[#F59E0B]" />
              KOLEKSI SUARA RESMI GENTRA
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 tracking-tight">
              22 Karakter Vokal Siap Pakai
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Dengarkan langsung contoh vokal dari 8 karakter khas Sunda Priangan dan 14 karakter penyiar nasional berstandar studio.
            </p>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              {[
                { id: 'Semua', label: 'Semua Karakter (22)' },
                { id: 'Sunda', label: '🌿 Khas Sunda (8)' },
                { id: 'Nasional', label: '🎙️ Vokal Nasional (14)' },
                { id: 'Pria', label: '👨 Suara Pria (11)' },
                { id: 'Wanita', label: '👩 Suara Wanita (11)' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setPersonaFilter(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${
                    personaFilter === tab.id
                      ? 'bg-[#0C4E34] text-white shadow-md scale-105'
                      : 'bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Persona Showcase Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredPersonas.map((persona) => {
              const isPlaying = playingVoice === persona.name;
              const hasAudio = Boolean(LANDING_STATIC_PREVIEWS[persona.name] || landingAudioCache.current[persona.name]);

              // JIKA TIDAK ADA PREVIEW AUDIO: TAMPILKAN ABU-ABU & NONAKTIFKAN
              if (!hasAudio) {
                return (
                  <div 
                    key={persona.name} 
                    onClick={() => {
                      setUnavailableVoiceToast(persona.name);
                      setTimeout(() => setUnavailableVoiceToast(null), 4000);
                    }}
                    className="rounded-3xl p-5 border border-dashed border-zinc-300 bg-zinc-100/75 opacity-60 hover:opacity-75 transition-all duration-200 flex flex-col justify-between group relative overflow-hidden cursor-not-allowed select-none"
                  >
                    <div>
                      {/* Header: Avatar, Name & Unavailable Badge */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-zinc-300 bg-zinc-200/80 grayscale opacity-60">
                            {persona.avatar}
                          </div>
                          <div>
                            <h4 className="text-base font-black text-zinc-500 leading-tight">
                              {persona.name}
                            </h4>
                            <span className="text-[10px] font-bold text-zinc-400 block mt-0.5">
                              {persona.gender} • {persona.role}
                            </span>
                          </div>
                        </div>

                        <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 bg-zinc-200 text-zinc-500 border border-zinc-300">
                          Belum Tersedia
                        </span>
                      </div>

                      <p className="text-xs text-zinc-400 leading-relaxed min-h-[36px]">
                        {persona.desc}
                      </p>

                      {/* Characteristic Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {persona.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-200/60 border border-zinc-300 text-zinc-400 font-semibold"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Spoken Quote Bubble */}
                      <div className="mt-3.5 p-2.5 rounded-xl border border-zinc-200 bg-zinc-200/40 text-[11px] leading-snug text-zinc-400 italic">
                        "{persona.sampleText}"
                      </div>
                    </div>

                    {/* Card Footer: Disabled Audio Spec & Button */}
                    <div className="pt-4 border-t border-zinc-200 mt-4 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-400 font-mono font-bold bg-zinc-200/70 px-2 py-0.5 rounded border border-zinc-300">
                        Belum Tersedia
                      </span>

                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUnavailableVoiceToast(persona.name);
                          setTimeout(() => setUnavailableVoiceToast(null), 4000);
                        }}
                        className="px-3 py-2 rounded-xl text-[10px] font-bold flex items-center gap-1.5 bg-zinc-200 text-zinc-400 border border-zinc-300 cursor-not-allowed hover:bg-zinc-300/60 transition-colors"
                        title="Sampel audio karakter belum tersedia"
                      >
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>Belum Tersedia</span>
                      </button>
                    </div>

                  </div>
                );
              }

              // JIKA PREVIEW TERSEDIA: TAMPILKAN AKTIF
              return (
                <div 
                  key={persona.name} 
                  className={`rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
                    isPlaying 
                      ? 'bg-gradient-to-br from-white via-emerald-50/40 to-white border-[#0C4E34] ring-2 ring-[#0C4E34] shadow-xl -translate-y-1' 
                      : 'bg-[#FBFBFA] hover:bg-white border-zinc-200/90 hover:border-emerald-500/50 shadow-sm hover:shadow-xl hover:-translate-y-1'
                  }`}
                >
                  {/* Subtle Accent Glow on Hover */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#0C4E34]/30 to-transparent group-hover:via-[#0C4E34] transition-all" />

                  <div>
                    {/* Header: Avatar, Name & Category Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm border transition-transform group-hover:scale-105 ${
                          persona.badge === 'Sunda' 
                            ? 'bg-gradient-to-tr from-emerald-100 to-amber-50 border-emerald-200' 
                            : 'bg-gradient-to-tr from-blue-50 to-indigo-50 border-blue-200'
                        }`}>
                          {persona.avatar}
                        </div>
                        <div>
                          <h4 className="text-base font-black text-zinc-900 group-hover:text-[#0C4E34] transition-colors leading-tight">
                            {persona.name}
                          </h4>
                          <span className="text-[10px] font-bold text-zinc-500 block mt-0.5">
                            {persona.gender} • {persona.role}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider shrink-0 border ${
                        persona.badge === 'Sunda' 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                          : 'bg-blue-100 text-blue-800 border-blue-200'
                      }`}>
                        {persona.badge}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-600 leading-relaxed min-h-[36px]">
                      {persona.desc}
                    </p>

                    {/* Characteristic Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {persona.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-zinc-200 text-zinc-600 font-semibold"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Spoken Quote Bubble */}
                    <div className={`mt-3.5 p-2.5 rounded-xl border text-[11px] leading-snug transition-colors ${
                      isPlaying 
                        ? 'bg-emerald-50/70 border-emerald-200 text-[#0C4E34] font-medium' 
                        : 'bg-white/80 border-zinc-200/70 text-zinc-600 italic'
                    }`}>
                      "{persona.sampleText}"
                    </div>
                  </div>

                  {/* Card Footer: Play Button & Audio Spec */}
                  <div className="pt-4 border-t border-zinc-200/80 mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500 font-mono font-bold bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                        WAV 48kHz / 44.1kHz
                      </span>

                      {/* Equalizer animation when playing */}
                      {isPlaying && (
                        <div className="flex items-center gap-1 h-3.5 pl-1">
                          <span className="w-1 bg-[#0C4E34] rounded-full animate-bounce h-3" style={{ animationDelay: '0ms' }} />
                          <span className="w-1 bg-[#F59E0B] rounded-full animate-bounce h-4" style={{ animationDelay: '150ms' }} />
                          <span className="w-1 bg-[#0C4E34] rounded-full animate-bounce h-2" style={{ animationDelay: '300ms' }} />
                          <span className="w-1 bg-[#F59E0B] rounded-full animate-bounce h-3.5" style={{ animationDelay: '450ms' }} />
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => handlePlayVoicePreview(persona)}
                      className={`p-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                        isPlaying 
                          ? 'bg-[#0C4E34] text-white shadow-md scale-105' 
                          : 'bg-white hover:bg-[#0C4E34] text-zinc-700 hover:text-white border border-zinc-200'
                      }`}
                      title={isPlaying ? "Hentikan Sampel" : "Dengarkan Sampel Suara"}
                    >
                      {isPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                      )}
                      <span className="text-[10px] font-bold">
                        {isPlaying ? "Jeda" : "Dengar"}
                      </span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 7. Mode Iklan Layanan Masyarakat Teaser (Vibrant Warm Emerald & Amber) */}
      <section id="ilm" className="py-10 sm:py-12 md:py-14 bg-gradient-to-br from-[#0C4E34] via-[#083825] to-[#041a11] text-white relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#F59E0B]/20 via-emerald-400/20 to-transparent blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center space-y-3.5 sm:space-y-4 relative z-10">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-[#F59E0B] to-amber-300 text-black flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/30 transform hover:rotate-6 transition-transform">
            <Megaphone className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-black tracking-widest text-[#F59E0B] uppercase bg-black/40 border border-[#F59E0B]/40 px-3.5 py-1 rounded-full inline-block shadow-sm">
              FITUR KHUSUS KOMUNIKASI PUBLIK JABAR
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Mode Iklan Layanan Masyarakat (ILM)
            </h2>
          </div>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-emerald-100/90 leading-relaxed font-medium">
            Hasilkan naskah himbauan warga, edukasi kesehatan, dan ajakan gotong royong dengan pilihan durasi standar penyiaran radio (30 detik & 60 detik) dalam Bahasa Sunda halus atau Bahasa Indonesia komunikatif.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-[#F59E0B] hover:bg-amber-400 text-black text-xs sm:text-sm font-black shadow-xl shadow-amber-500/40 hover:shadow-amber-500/60 transition-all inline-flex items-center justify-center gap-2 group ring-2 ring-amber-300/40 transform hover:scale-105"
            >
              <span>BUKA GENERATOR NASKAH ILM DI STUDIO</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="py-6 sm:py-7 bg-white text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-[#0C4E34]">GENTRA</span>
            <span className="text-zinc-400 font-mono">|</span>
            <span className="text-xs font-bold text-[#D97706]">Ti Téks Jadi Sora</span>
          </div>
          <p className="text-xs text-zinc-500 font-medium">
            © 2026 GENTRA • BANGKIT Beruang Ecosystem
          </p>
        </div>
      </footer>

      {/* Floating Notifikasi Abu (Grey Toast) jika karakter belum tersedia */}
      {unavailableVoiceToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3.5 rounded-2xl bg-zinc-900/95 text-zinc-200 border border-zinc-700 shadow-2xl backdrop-blur-md flex items-center gap-3.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-4 duration-200 max-w-md w-[92vw] sm:w-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-400 animate-pulse shrink-0" />
          <div className="flex-1">
            <p className="leading-snug">
              Sampel audio karakter <strong className="text-white underline decoration-zinc-500">{unavailableVoiceToast}</strong> belum tersedia saat ini.
            </p>
            <p className="text-[10px] text-zinc-400 mt-0.5">
              Karakter ini belum dapat digunakan untuk sintesis suara.
            </p>
          </div>
          <button 
            type="button"
            onClick={() => setUnavailableVoiceToast(null)} 
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0"
            title="Tutup notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
