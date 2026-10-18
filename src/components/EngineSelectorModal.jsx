import React, { useState } from 'react';
import { 
  Server, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  ShieldCheck, 
  Radio, 
  Layers, 
  Sparkles,
  Activity,
  Award,
  Globe2,
  Lock
} from 'lucide-react';

export const ENGINE_SERVERS = [
  {
    id: 'gemini',
    code: 'ENGINE A',
    name: 'Gatot Kaca Server',
    engineLabel: 'Neural Natural High-Fidelity Engine',
    provider: 'Neural Voice Engine Core',
    status: 'online',
    statusText: '100% Online & Kuota Siap',
    recommended: true,
    badges: ['Server Utama', 'Kearifan Pasundan', 'Fail-Safe Key'],
    accentColor: 'emerald',
    gradientBg: 'from-zinc-900/90 via-[#14161B] to-[#0B0C0E]',
    borderColor: 'border-[#CCFF00]/60',
    selectedRing: 'ring-[#CCFF00] border-[#CCFF00] shadow-[#CCFF00]/20',
    activeTagColor: 'bg-[#CCFF00]/20 text-[#CCFF00] border-[#CCFF00]/30',
    description: 'Server vokal utama dengan prosodi Sunda yang luwes, alami, dan hangat. Dilengkapi fail-safe backup key otomatis dan dukungan artikulasi paralinguistik ekspresif.',
    features: [
      { label: 'Karakter Utama', value: 'Anita, Agus, Siti, Abah, Teh Neng' },
      { label: 'Dialek & Gaya', value: 'Cengkok Pasundan & Bahasa Indonesia Resmi' },
      { label: 'Kecepatan Latensi', value: 'Ultra-Fast (~1.1 detik)' },
      { label: 'Keamanan Kuota', value: 'Dual-Key Fail-Safe Auto Rotation' }
    ],
    sampleVoices: ['Anita (Sunda Halus)', 'Agus (Naratif)', 'Abah (Sesepuh)', 'Teh Neng (Ceria)']
  },
  {
    id: 'azure',
    code: 'ENGINE B',
    name: 'Kian Santang Server',
    engineLabel: 'Neural Broadcast Speech Engine',
    provider: 'Cognitive Broadcast Service',
    status: 'testing',
    statusText: 'Dapur Pengujian Backend',
    recommended: false,
    badges: ['Dapur Pengujian', 'Siaran Berita', 'Standard Protokoler'],
    accentColor: 'sky',
    gradientBg: 'from-zinc-900/90 via-[#14161B] to-[#0B0C0E]',
    borderColor: 'border-sky-500/50',
    selectedRing: 'ring-sky-400 border-sky-400 shadow-sky-950/80',
    activeTagColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    description: 'Server presisi artikulasi formal untuk siaran berita resmi dan keprotokoleran kedinasan. Siap diuji coba di dapur backend.',
    features: [
      { label: 'Karakter Utama', value: 'Gadis (id-ID) & Ardi (id-ID)' },
      { label: 'Dialek & Gaya', value: 'Diksi Protokoler & Siaran Berita Nasional' },
      { label: 'Kecepatan Latensi', value: 'Stabil (~1.8 detik)' },
      { label: 'Arsitektur', value: 'SSML Compliant & Cognitive Speech' }
    ],
    sampleVoices: ['Gadis Sunda (id-ID)', 'Ardi Priangan (id-ID)']
  },
  {
    id: 'elevenlabs',
    code: 'ENGINE C',
    name: 'Prabu Pajajaran Server',
    engineLabel: 'Neural Ultra Studio Master v2',
    provider: 'Multilingual Sound Lab',
    status: 'online',
    statusText: 'API Key Aktif & Siap Uji',
    recommended: false,
    badges: ['Studio Grade', '44.1kHz Master', 'Hyper-Realistic'],
    accentColor: 'purple',
    gradientBg: 'from-zinc-900/90 via-[#14161B] to-[#0B0C0E]',
    borderColor: 'border-purple-500/50',
    selectedRing: 'ring-purple-400 border-purple-400 shadow-purple-950/80',
    activeTagColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    description: 'Server vokal hyper-realistic standar broadcast studio 44.1kHz dengan artikulasi mikro dan kedalaman emosional untuk produksi audio profesional.',
    features: [
      { label: 'Karakter Utama', value: 'Sarah, George, Charlie, Alice, Callum' },
      { label: 'Dialek & Gaya', value: 'Multilingual Master & International Timbre' },
      { label: 'Kecepatan Latensi', value: 'Studio Rendering (~2.2 detik)' },
      { label: 'Format Output', value: 'Studio CD 44.1 kHz MP3' }
    ],
    sampleVoices: ['Sarah (Elegan)', 'George (Wibawa)', 'Charlie (Deep)', 'Alice (Jernih)']
  }
];

export const EngineSelectorModal = ({ 
  isOpen, 
  onClose, 
  selectedEngine = 'gemini', 
  onSelectEngine 
}) => {
  const [currentChoice, setCurrentChoice] = useState(selectedEngine);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSelectEngine(currentChoice);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#0B0C0E] rounded-3xl shadow-2xl border border-[#20232B] text-zinc-100 overflow-hidden my-auto transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-1/4 w-96 h-60 bg-[#CCFF00]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-60 bg-[#CCFF00]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative px-6 sm:px-8 pt-7 pb-5 border-b border-[#20232B] bg-[#14161B]">
          {onClose && (
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Tutup dialog"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30 shadow-md">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#CCFF00] px-2.5 py-0.5 rounded-full bg-[#181A20] border border-[#20232B]">
                Voice Engine Cluster Selector
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                Pilih Server Engine Suara
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
            Pilih kluster server pemrosesan audio untuk sesi produksi Anda. Setiap server ditenagai arsitektur vokal mandiri dengan karakter dan karakteristik suara yang berbeda.
          </p>
        </div>

        {/* Cards Grid: 3 Engines (A: Gatot Kaca, B: Kian Santang, C: Pajajaran) */}
        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-3 gap-4.5">
          {ENGINE_SERVERS.map((srv) => {
            const isSelected = currentChoice === srv.id;

            return (
              <div
                key={srv.id}
                onClick={() => setCurrentChoice(srv.id)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between relative group select-none ${
                  isSelected 
                    ? `bg-gradient-to-b ${srv.gradientBg} border-2 ${srv.selectedRing} shadow-2xl -translate-y-1`
                    : `bg-[#14161B] hover:bg-[#181A20] border-[#20232B] hover:border-[#3a3f4d] hover:-translate-y-0.5`
                }`}
              >
                {/* Top Badge: Server Code & Recommendation */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/10 text-white border border-white/10">
                    {srv.code}
                  </span>

                  {srv.recommended && (
                    <span className="text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-400 text-zinc-950 flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-2.5 h-2.5 fill-current" /> Rekomendasi
                    </span>
                  )}

                  {!srv.recommended && (
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${srv.activeTagColor}`}>
                      {srv.statusText}
                    </span>
                  )}
                </div>

                {/* Server Title & Engine Name */}
                <div className="mb-3.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                      {srv.name}
                    </h3>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] font-semibold text-emerald-400/90 mt-0.5">
                    {srv.engineLabel}
                  </p>
                </div>

                {/* Badges Pill Row */}
                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  {srv.badges.map((b, idx) => (
                    <span 
                      key={idx}
                      className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-black/40 text-zinc-300 border border-white/5"
                    >
                      {b}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-400 leading-relaxed mb-4 flex-1">
                  {srv.description}
                </p>

                {/* Specs / Features Mini Table */}
                <div className="bg-black/30 rounded-xl p-3 space-y-2 border border-white/5 text-[11px] mb-4">
                  {srv.features.map((f, i) => (
                    <div key={i} className="flex justify-between items-start gap-2">
                      <span className="text-zinc-400 text-[10px] font-medium">{f.label}:</span>
                      <span className="text-zinc-200 text-[10px] font-bold text-right truncate max-w-[140px]">{f.value}</span>
                    </div>
                  ))}
                </div>

                {/* Selection Radio Footer */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 font-medium">Status Server</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${srv.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                    <span className="text-[10px] font-bold text-white">
                      {srv.status === 'online' ? 'Aktif' : 'Dapur Uji'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer with Active Server Banner and Proceed Button */}
        <div className="px-6 sm:px-8 py-5 border-t border-[#20232B] bg-[#14161B] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-[#CCFF00] shrink-0" />
            <span>
              Server Terpilih:{' '}
              <strong className="text-white">
                {ENGINE_SERVERS.find(s => s.id === currentChoice)?.name}
              </strong>{' '}
              ({ENGINE_SERVERS.find(s => s.id === currentChoice)?.engineLabel})
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold border border-[#20232B] text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                Batal
              </button>
            )}
            <button
              type="button"
              onClick={handleConfirm}
              className="w-full sm:w-auto px-7 py-3 rounded-xl text-xs font-black bg-[#CCFF00] hover:bg-[#b8e600] text-black shadow-lg shadow-[#CCFF00]/15 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>MASUK KE STUDIO VOKAL</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
