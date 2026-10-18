import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, X, Shield, Sparkles, Key } from 'lucide-react';
import { safeGetItem, safeSetItem } from '../utils/safeStorage';

export const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState(() => {
    try {
      return safeGetItem('gentra_saved_email') || 'tim@gentra.internal';
    } catch (e) {
      return 'tim@gentra.internal';
    }
  });
  const [password, setPassword] = useState('gentra2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Masukkan email atau identitas tim Anda.');
      return;
    }
    if (!password.trim()) {
      setError('Masukkan kata sandi akses internal.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Check stored master key (default: admin2026)
      const currentMasterKey = safeGetItem('gentra_master_key') || 'admin2026';
      const isMasterAdmin = password.trim() === currentMasterKey || email.toLowerCase().includes('admin');

      if (password.length >= 4) {
        const userData = {
          email: email.trim(),
          role: isMasterAdmin ? 'Master Admin' : 'Tim Produksi',
          name: isMasterAdmin ? 'MASTER ADMIN' : email.split('@')[0].toUpperCase(),
          loginAt: new Date().toISOString()
        };

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
        setError('Kata sandi minimal 4 karakter.');
      }
    }, 400);
  };

  const handleQuickLogin = (asAdmin = false) => {
    const currentMasterKey = safeGetItem('gentra_master_key') || 'admin2026';
    const emailVal = asAdmin ? 'admin@gentra.internal' : 'tim@gentra.internal';
    const passVal = asAdmin ? currentMasterKey : 'gentra2026';

    setEmail(emailVal);
    setPassword(passVal);

    const userData = {
      email: emailVal,
      role: asAdmin ? 'Master Admin' : 'Tim Produksi',
      name: asAdmin ? 'MASTER ADMIN' : 'TIM PRODUKSI',
      loginAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('gentra_auth_user', JSON.stringify(userData));
    } catch (e) {}
    onLoginSuccess(userData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ambient Banner */}
        <div className="bg-gradient-to-br from-[#0C4E34] to-[#083B27] px-8 pt-8 pb-7 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
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
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white leading-none">GENTRA</span>
              </div>
              <p className="text-xs text-amber-300 font-bold mt-1">Generator Voice Over Natural</p>
            </div>
          </div>

          <h2 className="text-lg font-bold tracking-tight text-white">Masuk ke Studio Voice Over</h2>
          <p className="text-xs text-emerald-100/80 mt-1 leading-relaxed">
            Portal produksi audio resmi. Silakan verifikasi akses tim Anda.
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
              <Mail className="w-3.5 h-3.5 text-[#0C4E34]" /> Email / Akun Tim
            </label>
            <input 
              type="text" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tim@gentra.internal" 
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
              placeholder="••••••••" 
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
            <span className="text-[11px] text-[#0C4E34] font-bold">Tim Internal Sandbox</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#0C4E34] hover:bg-[#083B27] text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] mt-2"
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

          {/* Quick 1-Click Access for Team & Master Admin */}
          <div className="pt-3 text-center border-t border-zinc-100 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">Akses Cepat Pengujian:</span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin(false)}
                className="text-xs px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold flex items-center gap-1.5 transition-colors"
              >
                👥 Tim Produksi
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin(true)}
                className="text-xs px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold flex items-center gap-1.5 transition-colors"
              >
                👑 Master Admin
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
