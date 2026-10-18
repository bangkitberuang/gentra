import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginModal } from './components/LoginModal';
import { GentraStudio } from './components/GentraStudio';
import { EngineSelectorModal } from './components/EngineSelectorModal';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("GENTRA Studio Runtime Exception:", error, errorInfo);
  }

  handleResetCache = () => {
    try {
      localStorage.removeItem('gentra_voices_v3');
      localStorage.removeItem('gentra_custom_voice_prompts');
      localStorage.removeItem('gentra_hidden_voices');
      localStorage.removeItem('gentra_voice_cost_expenses');
      localStorage.removeItem('gentra_google_render_logs');
      localStorage.removeItem('gentra_active_engine');
    } catch (e) {}
    window.location.reload();
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0F141A] text-zinc-100 flex items-center justify-center p-6 font-sans">
          <div className="max-w-lg w-full bg-[#182029] border border-amber-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-500" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <span className="text-2xl font-black">🎙️</span>
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white font-serif">GENTRA AUDIO WORKSTATION</h1>
                <p className="text-xs text-amber-400 font-mono">PEMULIHAN SISTEM • SAFE MODE</p>
              </div>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed mb-6">
              Sistem studio mendeteksi ketidaksesuaian modul atau cache lokal browser. Anda dapat memuat ulang aplikasi secara normal atau mereset cache lokal studio untuk membersihkan data usang.
            </p>

            {this.state.error && (
              <div className="bg-black/40 border border-zinc-800 rounded-xl p-3 mb-6 text-[11px] font-mono text-zinc-400 overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#0C4E34] to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-900/30"
              >
                Muat Ulang Halaman
              </button>
              <button 
                onClick={this.handleResetCache}
                className="py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-amber-300 font-bold text-xs uppercase tracking-wider transition-all"
              >
                Reset Cache & Pulihkan
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainApp() {
  const [user, setUser] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('view') === 'studio') {
        return { email: 'tim@gentra.internal', role: 'Tim Produksi', name: 'TIM PRODUKSI' };
      }
      const saved = localStorage.getItem('gentra_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isEngineModalOpen, setIsEngineModalOpen] = useState(false);
  const [activeEngine, setActiveEngine] = useState(() => {
    try {
      return localStorage.getItem('gentra_active_engine') || 'gemini';
    } catch (e) {
      return 'gemini';
    }
  });

  // Sync session state across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('gentra_auth_user');
        setUser(saved ? JSON.parse(saved) : null);
        const savedEngine = localStorage.getItem('gentra_active_engine');
        if (savedEngine) setActiveEngine(savedEngine);
      } catch (e) {}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoginModalOpen(false);
    // Skema baru: Landing Page -> Login -> Langsung masuk POP pilihan engine!
    setIsEngineModalOpen(true);
  };

  const handleSelectEngine = (engineId) => {
    setActiveEngine(engineId);
    try {
      localStorage.setItem('gentra_active_engine', engineId);
    } catch (e) {}
    setIsEngineModalOpen(false);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('gentra_auth_user');
    } catch (e) {}
    setUser(null);
    setIsEngineModalOpen(false);
  };

  return (
    <div className={`min-h-screen ${user ? 'bg-[#0B0C0E]' : 'bg-[#FBFBFA]'}`}>
      {user ? (
        // 3. Aplikasi Studio Utama & POP Pilihan Engine
        <>
          <GentraStudio 
            user={user} 
            onLogout={handleLogout} 
            activeEngine={activeEngine}
            onOpenEngineModal={() => setIsEngineModalOpen(true)}
            onSelectEngine={handleSelectEngine}
          />

          <EngineSelectorModal 
            isOpen={isEngineModalOpen}
            onClose={() => setIsEngineModalOpen(false)}
            selectedEngine={activeEngine}
            onSelectEngine={handleSelectEngine}
          />
        </>
      ) : (
        // 1. Landing Page (Showcase Fitur) + 2. Login Page Pop Up
        <>
          <LandingPage onOpenLogin={() => setIsLoginModalOpen(true)} />
          <LoginModal 
            isOpen={isLoginModalOpen} 
            onClose={() => setIsLoginModalOpen(false)} 
            onLoginSuccess={handleLoginSuccess} 
          />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
