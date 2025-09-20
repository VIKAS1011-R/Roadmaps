'use client';

import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LanguageSelectionPage from '../../components/LanguageSelectionPage';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth loading to complete before making redirect decisions
    if (authLoading) {
      return;
    }
    
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLanguageSelect = (languageSlug: string) => {
    router.push(`/learn/${languageSlug}`);
  };

  const handleAdminAccess = () => {
    router.push('/admin');
  };

  // Show loading while authentication is being checked
  if (authLoading) {
    return (
      <div className="dashboard-wrapper">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="dashboard-wrapper">
      <LanguageSelectionPage 
        onLanguageSelect={handleLanguageSelect}
        isAdmin={isAdmin}
        onAdminAccess={handleAdminAccess}
      />
    </div>
  );
}