import React, { useState, useEffect, useRef } from 'react';
import { getUnifiedVoices, GENTRA_VOICES_EVENT } from '../utils/voiceRegistry.js';
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
  Download,
  Search,
  Flame,
  AudioWaveform,
  Menu,
  Disc3
} from 'lucide-react';

const FULL_PERSONAS = [
  // 14 personas for national broadcaster voices
  { 
    id: 'Aoede', 
    name: 'Anita', 
    gender: 'Wanita', 
    category: 'Nasional', 
    role: 'Presenter Berita & Narator', 
    desc: 'Ramah, ceria, vokal wanita bersahabat dan kredibel.', 
    badge: 'Nasional',
    initials: 'AN',
    accentTone: 'emerald',
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
    initials: 'ST',
    accentTone: 'teal',
    tags: ['Lembut', 'Empati', 'Santun'],
    sampleText: 'Terima kasih telah menghubungi layanan informasi publik Jawa Barat. Ada yang bisa kami bantu?'
  },
  { 
    id: 'Charon', 
    name: 'Mugi', 
    gender: 'Pria', 
    category: 'Nasional', 
    role: 'Naratif Dokumenter', 
    desc: 'Deep, maskulin, berbobot untuk narasi profil & dokumenter.', 
    badge: 'Nasional',
    initials: 'MG',
    accentTone: 'slate',
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
    initials: 'DW',
    accentTone: 'amber',
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
    initials: 'TN',
    accentTone: 'slate',
    tags: ['Formal', 'Profesional', 'Jelas'],
    sampleText: 'Berikut rangkuman capaian indikator reformasi birokrasi dan tata kelola pemerintah daerah.'
  },
  { 
    id: 'Autonoe', 
    name: 'Maya', 
    gender: 'Wanita', 
    category: 'Nasional', 
    role: 'Inspiratif & Hangat', 
    desc: 'Empatik, memotivasi, cocok untuk video profil institusi.', 
    badge: 'Nasional',
    initials: 'MY',
    accentTone: 'emerald',
    tags: ['Inspiratif', 'Hangat', 'Motivasi'],
    sampleText: 'Setiap langkah kecil yang kita ambil bersama hari ini adalah fondasi masa depan Jawa Barat.'
  },
  { 
    id: 'Puck', 
    name: 'Rian', 
    gender: 'Pria', 
    category: 'Nasional', 
    role: 'Muda & Kasual', 
    desc: 'Segar, kasual kekinian, vokal pemuda dinamis.', 
    badge: 'Nasional',
    initials: 'RN',
    accentTone: 'sky',
    tags: ['Muda', 'Kasual', 'Segar'],
    sampleText: 'Yuk simak informasi beasiswa dan ruang inovasi pemuda Jawa Barat edisi minggu ini!'
  },
  { 
    id: 'Erinome', 
    name: 'Indah', 
    gender: 'Wanita', 
    category: 'Nasional', 
    role: 'Meditatif & Tenang', 
    desc: 'Sejuk, damai, ritme teratur dan anggun bersahaja.', 
    badge: 'Nasional',
    initials: 'IN',
    accentTone: 'teal',
    tags: ['Meditatif', 'Tenang', 'Damai'],
    sampleText: 'Tarik nafas perlahan, nikmati kesegaran alam tatar Pasundan yang menyejukkan jiwa kita.'
  },
  { 
    id: 'Fenrir', 
    name: 'Gading', 
    gender: 'Pria', 
    category: 'Nasional', 
    role: 'Otoritatif & Tegas', 
    desc: 'Bariton mantap, komando pengumuman dan peringatan darurat.', 
    badge: 'Nasional',
    initials: 'GD',
    accentTone: 'amber',
    tags: ['Otoritatif', 'Tegas', 'Bariton'],
    sampleText: 'Pemberitahuan darurat. Mohon seluruh warga waspada terhadap perubahan cuaca ekstrem.'
  },
  { 
    id: 'Laomedeia', 
    name: 'Shinta', 
    gender: 'Wanita', 
    category: 'Nasional', 
    role: 'Integritas & Lugas', 
    desc: 'Lugas, artikulasi tajam, dan penuh komitmen integritas.', 
    badge: 'Nasional',
    initials: 'SH',
    accentTone: 'emerald',
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
    initials: 'BY',
    accentTone: 'sky',
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
    initials: 'AD',
    accentTone: 'amber',
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
    initials: 'EK',
    accentTone: 'slate',
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
    initials: 'LR',
    accentTone: 'emerald',
    tags: ['Anggun', 'Protokoler', 'Elegan'],
    sampleText: 'Dengan rasa bangga dan penghormatan setinggi-tingginya, marilah kita saksikan pembukaan acara resmi ini.'
  },

  // 8 personas for authentic Sundanese voices
  { 
    id: 'sunda_abah', 
    name: 'Abah', 
    gender: 'Pria', 
    category: 'Khas Sunda', 
    role: 'Kakek / Sesepuh Priangan', 
    desc: 'Wibawa, bijak, parau hangat khas kakek Priangan.', 
    badge: 'Sunda',
    initials: 'AB',
    accentTone: 'amber',
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
    initials: 'NN',
    accentTone: 'teal',
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
    initials: 'UJ',
    accentTone: 'emerald',
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
    initials: 'BB',
    accentTone: 'amber',
    tags: ['Guyub', 'Medok Renyah', 'Heboh'],
    sampleText: 'Aduh euy wargi sadayana, tong hilap jaga kaberesihan sareng kasehatan lingkungan nya!'
  },
  { 
    id: 'sunda_remaja_putri', 
    name: 'Neng Geulis', 
    gender: 'Wanita', 
    category: 'Khas Sunda', 
    role: 'Remaja Putri', 
    desc: 'Ceria, santun, lugas, suara mojang remaja Sunda alami dan komunikatif.', 
    badge: 'Sunda',
    initials: 'NG',
    accentTone: 'teal',
    tags: ['Mojang Sunda', 'Santun', 'Ceria'],
    sampleText: 'Punten Akang Teteh, hayu urang sami-sami ngiringan program wirausaha anom Jawa Barat!'
  },
  { 
    id: 'sunda_remaja_putra', 
    name: 'Ujang Anom', 
    gender: 'Pria', 
    category: 'Khas Sunda', 
    role: 'Remaja Putra', 
    desc: 'Semangat muda Priangan, lincah, komunikatif.', 
    badge: 'Sunda',
    initials: 'UA',
    accentTone: 'emerald',
    tags: ['Anom', 'Lincah', 'Komunikatif'],
    sampleText: 'Hayu baraya, urang pintonkeun sumanget pamuda dina ngawangun desa mandiri!'
  },
  { 
    id: 'sunda_teh_neng', 
    name: 'Teh Neng', 
    gender: 'Wanita', 
    category: 'Khas Sunda', 
    role: 'Wanita Muda Santun', 
    desc: 'Ramah, luwes, lemah lembut khas mojang Priangan.', 
    badge: 'Sunda',
    initials: 'TN',
    accentTone: 'teal',
    tags: ['Ramah', 'Lemah Lembut', 'Priangan'],
    sampleText: 'Wilujeng sumping di tatar Pasundan, mugia dinten ieu pinuh ku kabagjaan sareng berkah.'
  },
  { 
    id: 'sunda_kang_asep', 
    name: 'Kang Asep', 
    gender: 'Pria', 
    category: 'Khas Sunda', 
    role: 'Pria Dewasa Komunikatif', 
    desc: 'Lugas, ramah, artikulatif dan bersahabat.', 
    badge: 'Sunda',
    initials: 'KA',
    accentTone: 'slate',
    tags: ['Komunikatif', 'Lugas', 'Artikulatif'],
    sampleText: 'Hayu wargi sadaya, urang silih rojong ngawangun tatar Pasundan anu maju tur berakhlak.'
  }
];

// Static preview audio mappings
export const LANDING_STATIC_PREVIEWS = {
  // Sundanese personas
  'Abah': '/audio/previews/abah.wav',
  'Nini': '/audio/previews/nini.wav',
  'Ujang': '/audio/previews/ujang.wav',
  'Bibi (Ceu Edah)': '/audio/previews/bibi.wav',
  'Neng Geulis': '/audio/previews/remaja_neng.wav',
  'Ujang Anom': '/audio/previews/remaja_ujang.wav',
  'Budak Leutik Eneng': '/audio/previews/remaja_neng.wav',
  'Budak Leutik Ujang Alit': '/audio/previews/remaja_ujang.wav',
  'Teh Neng': '/audio/previews/teh_neng.wav',
  'Kang Asep': '/audio/previews/kang_asep.wav',

  // National personas
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

export const LandingPage = ({ onOpenLogin }) => {
  const [playingVoice, setPlayingVoice] = useState(null);
  const [personaFilter, setPersonaFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [unavailableVoiceToast, setUnavailableVoiceToast] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const landingAudioRef = useRef(null);
  const landingAudioCache = useRef({});

  const [personas, setPersonas] = useState(() => getUnifiedVoices());

  useEffect(() => {
    const handleVoiceSync = () => {
      setPersonas(getUnifiedVoices());
    };
    window.addEventListener(GENTRA_VOICES_EVENT, handleVoiceSync);
    window.addEventListener('storage', handleVoiceSync);
    return () => {
      window.removeEventListener(GENTRA_VOICES_EVENT, handleVoiceSync);
      window.removeEventListener('storage', handleVoiceSync);
    };
  }, []);

  const filteredPersonas = personas.filter(p => !p.isHidden).filter(p => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchRole = (p.role || p.desc || '').toLowerCase().includes(q);
      const matchTag = (p.tags || []).some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchRole && !matchTag) return false;
    }

    if (personaFilter === 'Semua') return true;
    if (personaFilter === 'Sunda') return p.category === 'Khas Sunda' || p.category === 'Sunda';
    if (personaFilter === 'Nasional') return p.category === 'Nasional';
    if (personaFilter === 'Pria') return p.gender === 'Pria' || p.gender === 'Male';
    if (personaFilter === 'Wanita') return p.gender === 'Wanita' || p.gender === 'Female';
    return true;
  });

  const handlePlayVoicePreview = async (persona) => {
    if (!persona) return;

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
      const cleanUrl = targetUrl.includes('?') ? targetUrl : `${targetUrl}?v=gemini-neural-v2`;
      const audio = new Audio(cleanUrl);
      landingAudioRef.current = audio;
      audio.onended = () => setPlayingVoice(null);
      audio.onerror = () => setPlayingVoice(null);
      await audio.play();
    } catch (err) {
      console.warn('Gagal memutar audio preview langsung:', err);
      setPlayingVoice(null);
    }
  };

  const currentPlayingPersona = personas.find(p => p.name === playingVoice) || null;

  return (
    <div className="min-h-[100dvh] bg-[#F8FAF9] text-slate-900 font-sans selection:bg-[#064E3B] selection:text-white">
      
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="GENTRA Logo" 
                className="w-11 h-11 rounded-2xl object-cover shadow-sm border border-slate-200 hover:scale-105 transition-transform shrink-0" 
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-[#064E3B] leading-none">GENTRA</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-[#064E3B] border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  v2.6.4
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500 mt-1 whitespace-nowrap leading-tight">Ti Téks Jadi Sora</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-8 text-xs font-bold text-slate-600">
            <a href="#fitur" className="hover:text-[#064E3B] transition-colors py-2">Fitur Unggulan</a>
            <a href="#ekosistem" className="hover:text-[#064E3B] transition-colors py-2">Bagan Ekosistem</a>
            <a href="#persona" className="hover:text-[#064E3B] transition-colors py-2">22 Karakter Vokal</a>
            <a href="#ilm" className="hover:text-[#064E3B] transition-colors py-2">Mode ILM</a>
          </nav>

          <div className="flex items-center gap-2">
            <button 
              onClick={onOpenLogin}
              className="px-4 sm:px-6 py-2.5 min-h-[44px] rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 group ring-1 ring-slate-800/20 shrink-0 active:scale-[0.98]"
            >
              <span>Masuk ke Studio</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              aria-label={isMobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden min-w-[44px] min-h-[44px] rounded-xl border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-150">
            <a 
              href="#fitur" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center min-h-[44px] px-3 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-[#064E3B] transition-colors"
            >
              Fitur Unggulan
            </a>
            <a 
              href="#ekosistem" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center min-h-[44px] px-3 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-[#064E3B] transition-colors"
            >
              Bagan Ekosistem
            </a>
            <a 
              href="#persona" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center min-h-[44px] px-3 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-[#064E3B] transition-colors"
            >
              22 Karakter Vokal
            </a>
            <a 
              href="#ilm" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center min-h-[44px] px-3 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-[#064E3B] transition-colors"
            >
              Mode ILM
            </a>
          </div>
        )}
      </header>

      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-20 md:pt-20 md:pb-24 overflow-hidden bg-[#F8FAF9]">
        
        {/* Full Panorama: Gedung Sate Bandung & Pegunungan Parahyangan */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
          <img 
            src="/hero-bg.jpg" 
            alt="Panorama Gedung Sate Bandung & Pegunungan Parahyangan" 
            className="w-full h-full object-cover object-[center_65%] opacity-90 sm:opacity-95 select-none pointer-events-none" 
          />
          {/* Left-to-right subtle atmospheric balance: gives left text crystal clarity while keeping Gedung Sate brightly visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F8FAF9]/85 via-white/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAF9]/75 via-transparent to-[#F8FAF9]/90" />
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#F8FAF9] to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl sm:max-w-3xl space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#064E3B] text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>STANDAR PENYIARAN PEMPROV JABAR • 24.000 HZ LOSSLESS</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-950 leading-[1.08]">
                Ti Téks Jadi Sora. <br />
                <span className="text-[#064E3B]">Otentik Tatar Pasundan.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed max-w-2xl bg-white/70 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-white/80 shadow-2xs">
                Platform sintesis vokal natural berstandar studio untuk Tim Komunikasi Publik Pemprov Jawa Barat. Menghadirkan 22 persona otentik <strong className="text-slate-900 font-bold">Khas Sunda & Nasional</strong>, mesin vokal <strong className="text-slate-900 font-bold">Broadcast 48kHz / 44.1kHz</strong>, dan generator naskah <strong className="text-slate-900 font-bold">Iklan Layanan Masyarakat (ILM)</strong>.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onOpenLogin}
                className="px-7 py-3.5 rounded-xl bg-[#064E3B] hover:bg-[#043A2C] text-white text-sm font-bold shadow-lg shadow-emerald-900/15 hover:shadow-xl transition-all flex items-center justify-center gap-2.5 group active:scale-[0.98]"
              >
                <Mic className="w-4 h-4 text-emerald-300" />
                <span>BUKA STUDIO VOICE OVER</span>
                <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#persona"
                className="px-6 py-3.5 rounded-xl bg-white/95 hover:bg-white backdrop-blur-md border border-slate-200 text-slate-700 hover:text-slate-950 text-sm font-semibold shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Headphones className="w-4 h-4 text-[#064E3B]" />
                <span>Dengarkan 22 Persona</span>
              </a>
            </div>

            {/* Metric Strip */}
            <div className="pt-6 border-t border-slate-200/90 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-left max-w-2xl">
              <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-xl border border-white/90 shadow-2xs">
                <span className="text-2xl font-black tracking-tight text-[#064E3B] block">22 Suara</span>
                <span className="text-xs text-slate-500 font-medium mt-0.5 block leading-tight">8 Sunda + 14 Nasional</span>
              </div>
              <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-xl border border-white/90 shadow-2xs">
                <span className="text-2xl font-black tracking-tight text-[#064E3B] block">48 & 44.1k</span>
                <span className="text-xs text-slate-500 font-medium mt-0.5 block leading-tight">Broadcast WAV Standar</span>
              </div>
              <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-xl border border-white/90 shadow-2xs">
                <span className="text-2xl font-black tracking-tight text-[#064E3B] block">Mode ILM</span>
                <span className="text-xs text-slate-500 font-medium mt-0.5 block leading-tight">Naskah 30s & 60s Siap Siar</span>
              </div>
              <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-xl border border-white/90 shadow-2xs">
                <span className="text-2xl font-black tracking-tight text-[#064E3B] block">Zero-Drift</span>
                <span className="text-xs text-slate-500 font-medium mt-0.5 block leading-tight">Lossless PCM 24.000 Hz</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Bento Grid 2.0: Fitur Unggulan Arsitektur Studio */}
      <section id="fitur" className="py-14 sm:py-18 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black tracking-widest text-[#064E3B] uppercase bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              ARSITEKTUR STUDIO AUDIO GENTRA
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Dirancang untuk Standar Penyiaran Resmi
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Seluruh perkakas produksi audio dikemas dalam antarmuka berstandar siaran tanpa latensi berlebih.
            </p>
          </div>

          {/* Bento 2.0 Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Bento 1: Zero-Drift & Broadcast 48kHz (Span 7) */}
            <div className="md:col-span-7 bg-[#F8FAF9] p-8 rounded-3xl border border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] space-y-4 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#064E3B] flex items-center justify-center font-bold border border-emerald-200">
                  <AudioWaveform className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    MASTERING ENGINE
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">
                    Zero-Drift 24.000 Hz & Resampling 48kHz / 44.1kHz
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                    Hasil audio diekspor langsung dalam format WAV 48 kHz (Timeline Video Siaran) dan 44.1 kHz (Mastering Audio DAW) tanpa pengenalan percakapan atau halusinasi teks.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-3 text-xs font-mono font-semibold text-slate-500">
                <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  PCM 16-bit Lossless
                </span>
                <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  0 Intro Conversational
                </span>
                <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Bitrate Sempurna
                </span>
              </div>
            </div>

            {/* Bento 2: Dual Identity Vokal (Span 5) */}
            <div className="md:col-span-5 bg-[#F8FAF9] p-8 rounded-3xl border border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] space-y-4 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold border border-amber-200">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    22 PERSONA LENGKAP
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">
                    8 Persona Khas Sunda + 14 Nasional
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                    Karakter Priangan otentik (Abah, Nini, Ujang, Bibi, Teh Neng, Kang Asep) berpadu harmonis dengan suara penyiar resmi nasional.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Dialek Priangan Otentik</span>
                <span className="text-[#064E3B] font-mono">100% Tersedia</span>
              </div>
            </div>

            {/* Bento 3: ILM Copywriter (Span 5) */}
            <div className="md:col-span-5 bg-[#F8FAF9] p-8 rounded-3xl border border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] space-y-4 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold border border-teal-200">
                  <Megaphone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    KAMPANYE PUBLIK
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">
                    Generator Naskah ILM 30s & 60s
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                    Hasilkan draf naskah himbauan warga, edukasi kesehatan, dan sosialisasi program dalam hitungan detik dengan kalkulasi durasi tepat siar.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Preset Radio & TV</span>
                <span className="text-teal-700 font-mono">30 detik / 60 detik</span>
              </div>
            </div>

            {/* Bento 4: Sovereign Vault & iPad Persistence (Span 7) */}
            <div className="md:col-span-7 bg-[#F8FAF9] p-8 rounded-3xl border border-slate-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] space-y-4 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded border border-slate-300">
                    PRIVASI & KEAMANAN
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-2">
                    Sovereign Vault & Multi-Device Key Persistence
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                    Penyimpanan kunci API terenkripsi di sisi klien dengan dual safeStorage (localStorage + Cookie) yang kompatibel penuh dengan iPadOS Safari dan desktop tanpa kehilangan konfigurasi.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-3 text-xs font-mono font-semibold text-slate-500">
                <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Masking Kunci Otomatis
                </span>
                <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Zero Third-Party Leaks
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Bagan Ekosistem Alur Kerja Produksi */}
      <section id="ekosistem" className="py-14 sm:py-18 bg-[#F8FAF9] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-black tracking-widest text-[#064E3B] uppercase bg-white border border-emerald-200 px-3.5 py-1.5 rounded-full shadow-xs inline-flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              ALUR KERJA TERPADU
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Bagan Ekosistem Produksi Audio
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Dari perumusan naskah publik hingga pengunduhan file WAV broadcast siap siar.
            </p>
          </div>

          {/* 4-Step Pipeline Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#064E3B] border border-emerald-200">
                  LANGKAH 01
                </span>
                <h3 className="text-base font-black text-slate-900 mt-3">Masukan Naskah</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Ketik atau tempel naskah bebas, atau gunakan Generator ILM otomatis dengan penghitung waktu akurat.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-600">
                Format: Teks Bebas / ILM
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-3xl border-2 border-[#064E3B]/40 shadow-md space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#064E3B] text-white">
                  LANGKAH 02 • INTI
                </span>
                <h3 className="text-base font-black text-slate-900 mt-3">Pilih Persona Vokal</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Pilih dari 22 karakter vokal (8 Khas Sunda & 14 Nasional) dengan audisi suara instan tanpa jeda.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-[11px] font-semibold text-[#064E3B]">
                22 Karakter Resmi
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                  LANGKAH 03
                </span>
                <h3 className="text-base font-black text-slate-900 mt-3">Modulasi Dinamika</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Sesuaikan kecepatan baca (0.5x - 1.5x), nada vokal dasar (-5 s.d +5), dan dialek Priangan.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-600">
                Slider Taktil Presisi
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                  LANGKAH 04
                </span>
                <h3 className="text-base font-black text-slate-900 mt-3">Render & Unduh WAV</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Sintesis vokal instan, mastering broadcast 48 kHz / 44.1 kHz, dan unduh file audio tanpa kompresi.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-600">
                WAV Siap Siar
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. SHOWCASE 22 KARAKTER PERSONA SUARA */}
      <section id="persona" className="py-14 sm:py-18 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-black tracking-widest text-[#064E3B] uppercase bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-emerald-600" />
              KOLEKSI SUARA RESMI GENTRA
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              22 Karakter Vokal Siap Pakai
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Dengarkan langsung contoh vokal dari 8 karakter khas Sunda Priangan dan 14 karakter penyiar nasional berstandar studio.
            </p>

            {/* Search and Category Filter Deck */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Cari persona..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 py-2 rounded-full border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#064E3B]/20 bg-slate-50"
                />
              </div>

              {/* Segmented Filter Tabs */}
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {[
                  { id: 'Semua', label: 'Semua (22)' },
                  { id: 'Sunda', label: 'Khas Sunda (8)' },
                  { id: 'Nasional', label: 'Nasional (14)' },
                  { id: 'Pria', label: 'Pria (11)' },
                  { id: 'Wanita', label: 'Wanita (11)' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setPersonaFilter(tab.id)}
                    className={`min-h-[44px] px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center active:scale-[0.98] ${
                      personaFilter === tab.id
                        ? 'bg-[#064E3B] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Persona Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredPersonas.map((persona) => {
              const isPlaying = playingVoice === persona.name;
              const hasAudio = Boolean(LANDING_STATIC_PREVIEWS[persona.name] || landingAudioCache.current[persona.name]);

              const initials = persona.initials || persona.name.slice(0, 2).toUpperCase();

              return (
                <div 
                  key={persona.name} 
                  className={`rounded-3xl p-5 border transition-all duration-200 flex flex-col justify-between group relative ${
                    isPlaying 
                      ? 'bg-emerald-50/40 border-[#064E3B] ring-2 ring-[#064E3B] shadow-md -translate-y-0.5' 
                      : 'bg-white hover:bg-slate-50/50 border-slate-200/80 hover:border-emerald-500/40 shadow-xs hover:shadow-md'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header: Initials Badge, Name & Role */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs border shadow-2xs ${
                          persona.badge === 'Sunda' || persona.category === 'Khas Sunda'
                            ? 'bg-amber-50 text-amber-900 border-amber-200' 
                            : 'bg-emerald-50 text-[#064E3B] border-emerald-200'
                        }`}>
                          {initials}
                        </div>
                        <div>
                          <h4 className="text-base font-black text-slate-900 group-hover:text-[#064E3B] transition-colors leading-tight">
                            {persona.name}
                          </h4>
                          <span className="text-[10px] font-semibold text-slate-500 block mt-0.5">
                            {persona.gender} • {persona.role || persona.desc}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 border ${
                        persona.badge === 'Sunda' || persona.category === 'Khas Sunda'
                          ? 'bg-amber-100 text-amber-900 border-amber-200' 
                          : 'bg-emerald-100 text-emerald-900 border-emerald-200'
                      }`}>
                        {persona.badge || persona.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
                      {persona.desc}
                    </p>

                    {/* Characteristic Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(persona.tags || []).map(tag => (
                        <span 
                          key={tag} 
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/60 text-slate-600 font-semibold"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Spoken Sample Quote */}
                    <div className={`p-2.5 rounded-xl border text-[11px] leading-snug transition-colors ${
                      isPlaying 
                        ? 'bg-white border-emerald-200 text-[#064E3B] font-medium' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 italic'
                    }`}>
                      "{persona.sampleText || 'Halo wargi sadayana!'}"
                    </div>
                  </div>

                  {/* Card Footer: Play Action & Spec */}
                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        WAV 48kHz
                      </span>

                      {isPlaying && (
                        <div className="flex items-center gap-1 h-3 pl-1">
                          <span className="w-1 bg-[#064E3B] rounded-full animate-bounce h-3" style={{ animationDelay: '0ms' }} />
                          <span className="w-1 bg-amber-500 rounded-full animate-bounce h-3.5" style={{ animationDelay: '150ms' }} />
                          <span className="w-1 bg-[#064E3B] rounded-full animate-bounce h-2" style={{ animationDelay: '300ms' }} />
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => handlePlayVoicePreview(persona)}
                      className={`min-h-[44px] min-w-[44px] px-3.5 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs font-bold active:scale-[0.98] ${
                        isPlaying 
                          ? 'bg-[#064E3B] text-white shadow-sm' 
                          : 'bg-slate-100 hover:bg-[#064E3B] text-slate-700 hover:text-white border border-slate-200'
                      }`}
                      title={isPlaying ? "Hentikan Sampel" : "Dengarkan Sampel Suara"}
                      aria-label={isPlaying ? `Hentikan sampel ${persona.name}` : `Dengarkan sampel ${persona.name}`}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Jeda</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Dengar</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      <section id="ilm" className="py-14 sm:py-18 bg-gradient-to-br from-[#064E3B] via-[#043A2C] to-[#02241B] text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-5 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-400/20">
            <Megaphone className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black tracking-widest text-amber-300 uppercase bg-black/30 border border-amber-300/30 px-3.5 py-1 rounded-full inline-block">
              FITUR KHUSUS KOMUNIKASI PUBLIK JABAR
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Mode Iklan Layanan Masyarakat (ILM)
            </h2>
          </div>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-emerald-100/90 leading-relaxed font-medium">
            Hasilkan naskah himbauan warga, edukasi kesehatan, dan ajakan gotong royong dengan pilihan durasi standar penyiaran radio (30 detik & 60 detik) dalam Bahasa Sunda halus atau Bahasa Indonesia komunikatif.
          </p>

          <div className="pt-2 flex items-center justify-center">
            <button
              onClick={onOpenLogin}
              className="px-8 py-3.5 min-h-[48px] rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-black shadow-lg shadow-amber-500/20 transition-all inline-flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              <span>BUKA GENERATOR NASKAH ILM DI STUDIO</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <footer className="py-8 bg-white border-t border-slate-200/80 text-center pb-[max(2rem,env(safe-area-inset-bottom,0px))]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-[#064E3B]">GENTRA</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#064E3B] border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              v2.6.4
            </span>
            <span className="text-slate-300 font-mono">|</span>
            <span className="text-xs font-semibold text-slate-500">Ti Téks Jadi Sora</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            © 2026 GENTRA • BANGKIT Beruang Ekosistem
          </p>
        </div>
      </footer>

      {currentPlayingPersona && (
        <div className="fixed bottom-4 sm:bottom-6 pb-[env(safe-area-inset-bottom,0px)] inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
          <div className="bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md flex items-center gap-4 max-w-md w-full pointer-events-auto animate-in slide-in-from-bottom-4 duration-200">
            <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-emerald-300 flex items-center justify-center font-black text-xs shrink-0 border border-emerald-500/30">
              {currentPlayingPersona.initials || currentPlayingPersona.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white truncate">{currentPlayingPersona.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">
                  {currentPlayingPersona.badge || currentPlayingPersona.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate">{currentPlayingPersona.role || currentPlayingPersona.desc}</p>
            </div>
            <button
              onClick={() => handlePlayVoicePreview(currentPlayingPersona)}
              className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-white text-slate-950 hover:bg-slate-100 transition-colors shrink-0 flex items-center justify-center"
              title="Hentikan audio"
              aria-label="Hentikan audio"
            >
              <Pause className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={onOpenLogin}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#043A2C] text-white text-xs font-bold shrink-0 transition-colors flex items-center justify-center"
            >
              Pakai di Studio
            </button>
          </div>
        </div>
      )}

      {unavailableVoiceToast && (
        <div className="fixed bottom-4 sm:bottom-6 pb-[env(safe-area-inset-bottom,0px)] left-1/2 -translate-x-1/2 z-50 px-5 py-3.5 rounded-2xl bg-slate-900/95 text-slate-200 border border-slate-700 shadow-2xl backdrop-blur-md flex items-center gap-3.5 text-xs font-semibold max-w-md w-[92vw] sm:w-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-400 animate-pulse shrink-0" />
          <div className="flex-1">
            <p className="leading-snug">
              Sampel audio karakter <strong className="text-white underline">{unavailableVoiceToast}</strong> belum tersedia saat ini.
            </p>
          </div>
          <button 
            type="button"
            onClick={() => setUnavailableVoiceToast(null)} 
            className="min-w-[44px] min-h-[44px] p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 flex items-center justify-center"
            aria-label="Tutup notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
