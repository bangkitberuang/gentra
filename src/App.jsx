import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginModal } from './components/LoginModal';
import { GentraStudio } from './components/GentraStudio';
import { EngineSelectorModal } from './components/EngineSelectorModal';

export default function App() {
  const [user, setUser] = useState(() => {
    try {
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
    <div className="min-h-screen bg-[#FBFBFA]">
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
