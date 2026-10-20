import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, X, ShieldCheck } from 'lucide-react';
import { safeGetItem, safeSetItem } from '../utils/safeStorage';
import { authenticateAccount } from '../utils/userManagement';

export const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState(() => {
    try {
      return safeGetItem('gentra_saved_email') || '';
    } catch (e) {
      return '';
    }
  });
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Masukkan alamat email atau identitas akun Anda.');
      return;
    }
    if (!password.trim()) {
      setError('Masukkan kata sandi akses akun Anda.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const authResult = authenticateAccount(email.trim(), password.trim());

      if (authResult.success) {
        const userData = authResult.user;

        if (rememberMe) {
          try {
            safeSetItem('gentra_auth_user', JSON.stringify(userData));
            safeSetItem('gentra_saved_email', email.trim());
          } catch (e) {}
        }

        setIsLoading(false);
        onLoginSuccess(userData);
      } else {
        setIsLoading(false);
        setError(authResult.message || 'Kredensial akses tidak cocok.');
      }
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ambient Banner */}
        <div className="bg-gradient-to-br from-[#0C4E34] to-[#083B27] px-8 pt-8 pb-7 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title="Tutup dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 mb-4">
            <img 
              src="/logo.png" 
              alt="GENTRA Logo" 
              className="w-[82px] h-[82px] rounded-2xl object-contain shadow-md border border-white/20 shrink-0" 
            />
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-2xl font-black tracking-tight text-white leading-none">GENTRA</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/15 text-emerald-300 border border-emerald-400/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  v2.6.4
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 font-semibold mt-1">Ti Téks Jadi Sora • Studio Voice Over</p>
            </div>
          </div>

          <h2 className="text-lg font-bold tracking-tight text-white">Masuk ke Studio Voice Over</h2>
          <p className="text-xs text-emerald-100/80 mt-1 leading-relaxed">
            Portal produksi audio resmi. Silakan masukkan kredensial akun terdaftar Anda.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#0C4E34]" /> Email / Akun Terdaftar
            </label>
            <input 
              type="text" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@jabarprov.go.id atau akun@gentra.internal" 
              className="w-full p-3.5 bg-zinc-50 border border-zinc-200 focus:border-[#0C4E34] focus:bg-white rounded-xl text-sm outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#0C4E34]" /> Kata Sandi Akses
            </label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi..." 
              className="w-full p-3.5 bg-zinc-50 border border-zinc-200 focus:border-[#0C4E34] focus:bg-white rounded-xl text-sm outline-none transition-all"
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-zinc-600 font-medium">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#0C4E34] accent-[#0C4E34]" 
              />
              Ingat Sesi di Perangkat Ini
            </label>
            <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0C4E34]" />
              Koneksi Terenkripsi
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#0C4E34] hover:bg-[#083B27] text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] mt-3"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">Memverifikasi Akses...</span>
            ) : (
              <>
                <span>MASUK KE STUDIO GENTRA</span>
                <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
