import React, { useState } from 'react';
import { 
  Mic, 
  Sparkles, 
  ArrowRight, 
  Volume2, 
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
  Building2
} from 'lucide-react';

const FULL_PERSONAS = [
  // 8 Khas Sunda
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
  },

  // 14 Nasional
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
  }
];

export const LandingPage = ({ onOpenLogin }) => {
  const [playingVoice, setPlayingVoice] = useState(null);
  const [personaFilter, setPersonaFilter] = useState('Semua');

  const filteredPersonas = FULL_PERSONAS.filter(p => {
    if (personaFilter === 'Semua') return true;
    if (personaFilter === 'Sunda') return p.category === 'Khas Sunda';
    if (personaFilter === 'Nasional') return p.category === 'Nasional';
    if (personaFilter === 'Pria') return p.gender === 'Pria';
    if (personaFilter === 'Wanita') return p.gender === 'Wanita';
    return true;
  });

  const handlePlayVoicePreview = (persona) => {
    if (playingVoice === persona.name) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setPlayingVoice(null);
      return;
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(persona.sampleText);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      utterance.pitch = persona.gender === 'Wanita' ? 1.15 : 0.9;
      
      utterance.onend = () => setPlayingVoice(null);
      utterance.onerror = () => setPlayingVoice(null);

      setPlayingVoice(persona.name);
      window.speechSynthesis.speak(utterance);
    } else {
      setPlayingVoice(persona.name);
      setTimeout(() => setPlayingVoice(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-zinc-900 font-sans selection:bg-[#0C4E34] selection:text-white">
      
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
              <span className="text-2xl sm:text-[27px] font-black tracking-tight text-[#0C4E34] leading-none">GENTRA</span>
              <span className="text-[11px] sm:text-xs font-bold text-[#D97706] tracking-tight mt-0.5 whitespace-nowrap leading-none">Generator Voice Over Natural</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-bold text-zinc-600">
            <a href="#fitur" className="hover:text-[#0C4E34] transition-colors">Fitur Unggulan</a>
            <a href="#ekosistem" className="hover:text-[#0C4E34] text-[#0C4E34] flex items-center gap-1 transition-colors">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
              Bagan Ekosistem
            </a>
            <a href="#persona" className="hover:text-[#0C4E34] transition-colors">22 Karakter Vokal</a>
            <a href="#multi-engine" className="hover:text-[#0C4E34] transition-colors">Multi-Engine TTS</a>
            <a href="#ilm" className="hover:text-[#0C4E34] transition-colors">Mode ILM</a>
          </nav>

          {/* Login CTA */}
          <button 
            onClick={onOpenLogin}
            className="px-5 sm:px-6 py-2.5 rounded-full bg-[#0C4E34] hover:bg-[#083B27] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 group ring-2 ring-emerald-600/20 shrink-0"
          >
            <span>Masuk ke Studio</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F59E0B] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </header>

      {/* 2. Hero Section with Responsive Gedung Sate Parahyangan Background */}
      <section className="relative flex flex-col items-center justify-center pt-10 pb-12 sm:pt-14 sm:pb-16 md:pt-16 md:pb-20 overflow-hidden bg-[#F8FAF9]">
        {/* Background Image: Gedung Sate & Pegunungan Parahyangan - Full Panorama */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
          <img 
            src="/hero-bg.jpg" 
            alt="Panorama Gedung Sate Bandung & Pegunungan Parahyangan" 
            className="w-full h-full object-cover object-[center_65%] opacity-90 sm:opacity-95 select-none pointer-events-none" 
          />
          {/* Gentle atmospheric balance: lets Gedung Sate & Parahyangan mountains shine brightly while keeping typography 100% readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FBFBFA]/75 via-white/40 to-[#FBFBFA]/85 backdrop-blur-[0.5px]" />
          <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-white to-transparent" />
        </div>
        
        {/* Ambient Top Blend */}
        <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-[#FBFBFA]/90 to-transparent pointer-events-none z-10" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center flex flex-col items-center space-y-4 sm:space-y-5">
          
          {/* Typography - Balanced, Impactful & Without Awkward Wraps */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-zinc-950 leading-[1.15] drop-shadow-sm">
              Ti Téks Jadi Sora.
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-extrabold tracking-wider text-[#D97706] uppercase drop-shadow-xs">
              Gentra Produksi Audio • Standar Penyiaran & Studio Rekaman
            </p>
          </div>

          <p className="max-w-3xl mx-auto text-xs sm:text-sm md:text-base text-zinc-800 font-semibold leading-relaxed bg-white/70 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-white/80 shadow-2xs">
            Platform sintesis suara natural berstandar studio untuk Tim Komunikasi Publik Pemprov Jawa Barat. Menghadirkan karakter vokal unik <strong className="text-[#0C4E34]">Khas Sunda & Nasional</strong>, mesin mastering <strong className="text-[#0C4E34]">Broadcast 48kHz / 44.1kHz</strong>, dan generator naskah <strong className="text-[#0C4E34]">Iklan Layanan Masyarakat (ILM)</strong> berbasis kearifan lokal.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1 w-full sm:w-auto">
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-[#0C4E34] hover:bg-[#083B27] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#0C4E34]/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 group ring-2 ring-emerald-600/30"
            >
              <span>BUKA STUDIO VOICE OVER</span>
              <ArrowRight className="w-4 h-4 text-[#F59E0B] group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#persona"
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-white/95 hover:bg-white backdrop-blur-md border border-zinc-300 text-zinc-800 text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Volume2 className="w-4 h-4 text-[#0C4E34]" />
              <span>Dengarkan 22 Persona Suara</span>
            </a>
          </div>

          {/* Quick Metrics in Frosted Glass - Tighter Spacing */}
          <div className="pt-3 sm:pt-4 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto w-full text-left">
            <div className="bg-white/85 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-white/90 shadow-sm hover:shadow-md transition-all">
              <span className="text-xl sm:text-2xl font-black text-[#0C4E34] block">22 Karakter</span>
              <span className="text-[11px] text-zinc-700 font-medium">14 Nasional + 8 Khas Sunda</span>
            </div>
            <div className="bg-white/85 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-white/90 shadow-sm hover:shadow-md transition-all">
              <span className="text-xl sm:text-2xl font-black text-[#0C4E34] block">48 & 44.1 kHz</span>
              <span className="text-[11px] text-zinc-700 font-medium">Standar DAW & Broadcast WAV</span>
            </div>
            <div className="bg-white/85 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-white/90 shadow-sm hover:shadow-md transition-all">
              <span className="text-xl sm:text-2xl font-black text-[#F59E0B] block">Mode ILM</span>
              <span className="text-[11px] text-zinc-700 font-medium">Generator Kampanye 30s & 60s</span>
            </div>
            <div className="bg-white/85 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-white/90 shadow-sm hover:shadow-md transition-all">
              <span className="text-xl sm:text-2xl font-black text-[#0C4E34] block">Whisper Audio</span>
              <span className="text-[11px] text-zinc-700 font-medium">Transkripsi Naskah Otomatis</span>
            </div>
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
              <h3 className="text-xl font-bold text-zinc-900">Whisper Transkripsi Otomatis</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Konversi audio rekaman rapat, konferensi pers, atau naskah lisan menjadi teks terstruktur dalam hitungan detik untuk langsung diisi suara.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-[#FBFBFA] p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-4 hover:border-[#0C4E34]/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-teal-100/70 text-teal-700 flex items-center justify-center font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">Multi-Engine TTS & Kontrol Emosi</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Pilihan engine Gemini 2.5 Flash, Google Cloud TTS, dan Azure Neural dengan pengaturan nada, tempo, dan gaya emosi naratif.
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
            
            {/* Stage 1 */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all group flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-[#0C4E34] border border-emerald-200">
                    TAHAP 01
                  </span>
                  <FileText className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-black text-zinc-900 group-hover:text-[#0C4E34] transition-colors">
                  Input & Riset Naskah
                </h3>
                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                  Pengumpulan materi kebijakan daerah, siaran pers resmi pemerintah daerah, serta transkripsi audio rapat penting via Whisper.
                </p>
                
                <div className="mt-4 pt-3 border-t border-zinc-100 space-y-1.5 text-[11px] text-zinc-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Naskah Kebijakan & Rilis Pers</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Whisper Voice-to-Text</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Brief Kampanye Sosial Jabar</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                <span>Sumber Konten</span>
                <span className="font-bold text-emerald-700">Dokumen / Audio</span>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="bg-white rounded-3xl p-6 border-2 border-[#0C4E34]/30 shadow-md hover:shadow-xl hover:border-[#0C4E34] transition-all group flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0C4E34] to-[#F59E0B]" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#0C4E34] text-white">
                    TAHAP 02 • INTI
                  </span>
                  <Cpu className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <h3 className="text-lg font-black text-zinc-900 group-hover:text-[#0C4E34] transition-colors">
                  Studio GENTRA
                </h3>
                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                  Generator naskah ILM (30s & 60s), pemilihan 22 Persona Sunda & Nasional, kontrol intonasi emosi, serta modulasi gaya siaran audio.
                </p>

                <div className="mt-4 pt-3 border-t border-zinc-100 space-y-1.5 text-[11px] text-zinc-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#0C4E34] shrink-0" />
                    <span>22 Karakter Vokal (Sunda & Nasional)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#0C4E34] shrink-0" />
                    <span>Mode ILM 30 Detik & 60 Detik</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#0C4E34] shrink-0" />
                    <span>Multi-Engine (Gemini/Google/Azure)</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                <span>Engine Audio</span>
                <span className="font-bold text-[#0C4E34]">GENTRA Engine</span>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-amber-500/50 transition-all group flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F59E0B] to-amber-600" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-[#F59E0B] border border-amber-200">
                    TAHAP 03
                  </span>
                  <Sliders className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <h3 className="text-lg font-black text-zinc-900 group-hover:text-[#0C4E34] transition-colors">
                  Mastering Studio
                </h3>
                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                  Resampling presisi tinggi ke standar broadcast penyiaran dan DAW editing timeline video tanpa degradasi (Zero-Drift).
                </p>

                <div className="mt-4 pt-3 border-t border-zinc-100 space-y-1.5 text-[11px] text-zinc-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>WAV 48 kHz (Standar Video & TV)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>WAV 44.1 kHz (Standar Audio CD)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Zero-Drift PCM 16-bit Lossless</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                <span>Output Format</span>
                <span className="font-bold text-amber-700">WAV Broadcast</span>
              </div>
            </div>

            {/* Stage 4 */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all group flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-600" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    TAHAP 04
                  </span>
                  <Share2 className="w-5 h-5 text-teal-600" />
                </div>
                <h3 className="text-lg font-black text-zinc-900 group-hover:text-[#0C4E34] transition-colors">
                  Distribusi Multi-Kanal
                </h3>
                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                  Penyebarluasan materi audio ke kanal media sosial, radio siaran Pemprov, podcast, dan layanan publik seluruh Jawa Barat.
                </p>

                <div className="mt-4 pt-3 border-t border-zinc-100 space-y-1.5 text-[11px] text-zinc-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Radio Siaran Jabar & TVRI</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Reels / TikTok Humas Jabar</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Podcast & Megafon Publik</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                <span>Penerima Akhir</span>
                <span className="font-bold text-teal-700">Wargi Jabar</span>
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

      {/* 6. Teknologi Multi-Engine TTS (Vibrant, Colorful Studio Theme) */}
      <section id="multi-engine" className="py-10 sm:py-12 md:py-14 bg-gradient-to-b from-zinc-950 via-[#072418] to-zinc-950 text-white relative overflow-hidden border-t border-zinc-800">
        {/* Ambient Color Glow Orbs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[500px] h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-7 sm:mb-8 space-y-2">
            <span className="text-xs font-black tracking-widest text-[#F59E0B] uppercase bg-[#0C4E34]/80 border border-emerald-500/40 px-4 py-1.5 rounded-full inline-flex items-center gap-2 shadow-lg backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
              KONEKTIVITAS MULTI-PROVIDER STUDIO
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Dukungan Multi-Engine TTS
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed max-w-2xl mx-auto">
              GENTRA mendukung beragam penyedia engine audio terkemuka kelas dunia agar tim Anda selalu memiliki fleksibilitas timbre, karakter, dan stabilitas terbaik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Gemini 2.5 Flash Audio (Vibrant Deep Emerald & Gold) */}
            <div className="relative rounded-3xl p-8 bg-gradient-to-b from-[#0C4E34] via-[#093523] to-[#041a11] border-2 border-emerald-400/80 shadow-2xl shadow-emerald-950/60 hover:shadow-emerald-500/20 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between group overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <Sparkles className="w-24 h-24 text-[#F59E0B]" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-black uppercase text-black bg-[#F59E0B] px-3 py-1 rounded-full shadow-md tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    ENGINE AUDIO UTAMA FLAGSHIP
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-[#F59E0B]">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white tracking-tight">Gemini 2.5 Flash Audio</h3>
                <p className="text-xs text-[#F59E0B] font-bold mt-1">Google DeepMind Multimodal Audio Engine</p>
                
                <p className="text-xs text-emerald-100/90 mt-4 leading-relaxed">
                  Paling ekspresif dan natural! Memiliki kemampuan akting emosi dinamis (gembira, haru, bisikan, tempo santai), serta cengkok vokal otentik khas Sunda Priangan dan karakter vokal nasional.
                </p>

                <div className="mt-6 pt-5 border-t border-emerald-700/50 space-y-2.5 text-xs text-emerald-100 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F59E0B] shrink-0" />
                    <span>22 Persona Sunda & Nasional Eksklusif</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F59E0B] shrink-0" />
                    <span>Kontrol Emosi & Modulasi Tempo Penuh</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#F59E0B] shrink-0" />
                    <span>Mastering Studio 48kHz / 44.1kHz Lossless</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-emerald-700/50 flex items-center justify-between text-[11px] font-mono text-emerald-300">
                <span>Latensi Sintesis</span>
                <span className="font-bold text-[#F59E0B] bg-black/40 px-2 py-0.5 rounded">&lt; 600ms Ultra-Fast</span>
              </div>
            </div>

            {/* Card 2: Google Cloud TTS (Vibrant Blue & Cyan) */}
            <div className="relative rounded-3xl p-8 bg-gradient-to-b from-[#0F3866] via-[#0B2545] to-[#061426] border-2 border-blue-400/60 shadow-2xl shadow-blue-950/60 hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between group overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <Globe2 className="w-24 h-24 text-blue-300" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-black uppercase text-white bg-blue-600 px-3 py-1 rounded-full shadow-md tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-3 h-3" />
                    ENGINE AUDIO PENDUKUNG RESMI
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300">
                    <Globe2 className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white tracking-tight">Google Cloud TTS</h3>
                <p className="text-xs text-blue-300 font-bold mt-1">Wavenet, Neural2 & Journey Architecture</p>

                <p className="text-xs text-blue-100/90 mt-4 leading-relaxed">
                  Stabilitas nada dan artikulasi sangat terukur. Pilihan tepat untuk pembacaan buku panjang, regulasi formal pemerintah, instruksi perizinan, dan audio dokumentasi teknis.
                </p>

                <div className="mt-6 pt-5 border-t border-blue-700/50 space-y-2.5 text-xs text-blue-100 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Model Neural2 & Journey High-Fidelity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Dukungan SSML Audio Tag Standar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Tingkat Kestabilan Durasi & Pitch 99.9%</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-blue-700/50 flex items-center justify-between text-[11px] font-mono text-blue-300">
                <span>Infrastruktur</span>
                <span className="font-bold text-blue-200 bg-black/40 px-2 py-0.5 rounded">Google Cloud Global SLA</span>
              </div>
            </div>

            {/* Card 3: Microsoft Azure Speech (Vibrant Indigo, Violet & Cyan) */}
            <div className="relative rounded-3xl p-8 bg-gradient-to-b from-[#251A5A] via-[#1A123E] to-[#0F0A24] border-2 border-purple-400/60 shadow-2xl shadow-purple-950/60 hover:shadow-purple-500/20 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between group overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <Radio className="w-24 h-24 text-purple-300" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-black uppercase text-white bg-purple-600 px-3 py-1 rounded-full shadow-md tracking-wider flex items-center gap-1.5">
                    <Radio className="w-3 h-3" />
                    STANDAR PENYIARAN BERITA
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
                    <Radio className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white tracking-tight">Microsoft Azure Speech</h3>
                <p className="text-xs text-purple-300 font-bold mt-1">GadisNeural & ArdiNeural Broadcasting</p>

                <p className="text-xs text-purple-100/90 mt-4 leading-relaxed">
                  Standar emas industri penyiaran warta berita radio dan audio korporat dengan artikulasi vokal yang sangat lugas, jernih, dan berbobot resmi kenegaraan.
                </p>

                <div className="mt-6 pt-5 border-t border-purple-700/50 space-y-2.5 text-xs text-purple-100 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Penyiar Berita GadisNeural & ArdiNeural</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Format RIFF PCM 48kHz Broadcast Siap Tayang</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Integrasi Serverless Region Southeast Asia</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-purple-700/50 flex items-center justify-between text-[11px] font-mono text-purple-300">
                <span>Optimasi</span>
                <span className="font-bold text-purple-200 bg-black/40 px-2 py-0.5 rounded">Warta Berita & Radio</span>
              </div>
            </div>

          </div>

          {/* Selector Switch Callout */}
          <div className="mt-7 sm:mt-8 bg-gradient-to-r from-emerald-900/40 via-blue-900/40 to-purple-900/40 border border-white/15 rounded-3xl p-5 sm:p-6 md:p-7 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#F59E0B] shrink-0 shadow-inner">
                <Sliders className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  Bebas Beralih Antar Engine Audio Kapan Saja di Studio
                </h4>
                <p className="text-xs text-zinc-300 mt-0.5">
                  Cukup pilih tab engine audio yang Anda inginkan di halaman editor naskah GENTRA tanpa perlu konfigurasi rumit.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenLogin}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#F59E0B] to-amber-500 hover:from-amber-400 hover:to-[#F59E0B] text-black font-black text-xs shadow-xl transition-all shrink-0 flex items-center gap-2 transform hover:scale-105"
            >
              <span>UJI COBA 3 ENGINE AUDIO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
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
            <span className="text-xs font-bold text-[#D97706]">Generator Voice Over Natural</span>
          </div>
          <p className="text-xs text-zinc-500 font-medium">
            © 2026 GENTRA • BANGKIT Beruang Ecosystem
          </p>
        </div>
      </footer>

    </div>
  );
};
