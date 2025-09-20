'use client';

import { useAuth, AuthProvider } from '../hooks/useAuth';
import LandingPage from '../components/LandingPage';
import AuthPage from '../components/AuthPage';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type PageType = 'landing' | 'login' | 'signup';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('landing');
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
        <div className="text-lg ml-4">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect to dashboard
  }

  switch (currentPage) {
    case 'login':
      return <AuthPage mode="login" onSwitchMode={() => setCurrentPage('signup')} onBack={() => setCurrentPage('landing')} />;
    case 'signup':
      return <AuthPage mode="signup" onSwitchMode={() => setCurrentPage('login')} onBack={() => setCurrentPage('landing')} />;
    default:
      return <LandingPage onNavigate={setCurrentPage} />;
  }
}

export default function Home() {
  return <AppContent />;
}