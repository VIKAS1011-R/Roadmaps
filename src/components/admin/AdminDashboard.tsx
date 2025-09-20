'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ProgrammingLanguage } from '../../lib/types';
import LanguageList from './LanguageList';
import LanguageForm from './LanguageForm';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [languages, setLanguages] = useState<ProgrammingLanguage[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const token = localStorage.getItem('javaRoadmapToken');
      const response = await fetch('/api/admin/languages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLanguages(data.languages);
      } else {
        // Failed to fetch languages
      }
    } catch (error) {
      // Error fetching languages
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLanguage = () => {
    setSelectedLanguage(null);
    setCurrentView('create');
  };

  const handleEditLanguage = (language: ProgrammingLanguage) => {
    setSelectedLanguage(language);
    setCurrentView('edit');
  };

  const handleDeleteLanguage = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this programming language? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('javaRoadmapToken');
      const response = await fetch(`/api/admin/languages/${slug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setLanguages(languages.filter(lang => lang.slug !== slug));
      } else {
        const data = await response.json();
        alert(`Failed to delete language: ${data.error}`);
      }
    } catch (error) {
      // Error deleting language
      alert('Failed to delete language');
    }
  };

  const handleLanguageSaved = (savedLanguage: ProgrammingLanguage) => {
    if (currentView === 'create') {
      setLanguages([savedLanguage, ...languages]);
    } else {
      setLanguages(languages.map(lang => 
        lang.slug === savedLanguage.slug ? savedLanguage : lang
      ));
    }
    setCurrentView('list');
    setSelectedLanguage(null);
  };

  if (!user) return null;

  return (
    <section className="dashboard">
      <header className="header">
        <div className="container">
          <div className="header__user">
            <h1 className="header__title">Admin Dashboard</h1>
            <p className="header__subtitle">Manage programming languages and learning paths</p>
          </div>
          <div className="header__actions">
            <button className="btn btn--outline" onClick={logout}>Logout</button>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="admin-nav">
            <div className="admin-nav__title">
              <h2>Programming Languages</h2>
            </div>
            <div className="admin-nav__actions">
              {currentView !== 'list' && (
                <button 
                  className="btn btn--outline btn--sm"
                  onClick={() => setCurrentView('list')}
                >
                  ← Back to List
                </button>
              )}
              {currentView === 'list' && (
                <button 
                  className="btn btn--primary"
                  onClick={handleCreateLanguage}
                >
                  + Add New Language
                </button>
              )}
            </div>
          </div>

          <div className="admin-content">
            {loading ? (
              <div className="loading-state">
                <p>Loading...</p>
              </div>
            ) : (
              <>
                {currentView === 'list' && (
                  <LanguageList
                    languages={languages}
                    onEdit={handleEditLanguage}
                    onDelete={handleDeleteLanguage}
                  />
                )}
                
                {(currentView === 'create' || currentView === 'edit') && (
                  <LanguageForm
                    language={selectedLanguage}
                    onSave={handleLanguageSaved}
                    onCancel={() => setCurrentView('list')}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </section>
  );
}