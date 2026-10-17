import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginModal } from './components/LoginModal';
import { GentraStudio } from './components/GentraStudio';

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

  // Sync session state across tabs
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('gentra_auth_user');
        setUser(saved ? JSON.parse(saved) : null);
      } catch (e) {}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('gentra_auth_user');
    } catch (e) {}
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA]">
      {user ? (
        // 3. Aplikasi Studio Utama
        <GentraStudio user={user} onLogout={handleLogout} />
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
