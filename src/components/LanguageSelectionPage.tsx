'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface Language {
  _id: string;
  name: string;
  slug: string;
  description: string;
  totalTopics: number;
  phases: Array<{
    phase: string;
    topics: Array<{
      id: number;
      name: string;
      description: string;
    }>;
  }>;
  createdAt: string;
}

interface LanguageSelectionPageProps {
  onLanguageSelect: (languageSlug: string) => void;
  isAdmin?: boolean;
  onAdminAccess?: () => void;
}

export default function LanguageSelectionPage({ onLanguageSelect, isAdmin, onAdminAccess }: LanguageSelectionPageProps) {
  const { user, logout } = useAuth();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const response = await fetch('/api/languages');
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

  const handleLanguageClick = (languageSlug: string) => {
    onLanguageSelect(languageSlug);
  };

  // Calculate completion percentage for a language
  const getLanguageProgress = (language: Language) => {
    if (!user?.progress[language.slug]) {
      return { completed: 0, total: language.totalTopics, percentage: 0 };
    }

    const languageProgress = user.progress[language.slug];
    const completedCount = Array.from(languageProgress.topicStatuses.values()).filter(
      status => status === 'completed'
    ).length;
    
    return {
      completed: completedCount,
      total: language.totalTopics,
      percentage: Math.round((completedCount / language.totalTopics) * 100)
    };
  };

  if (!user) return null;

  return (
    <section className="language-selection-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header__user" id='header_position'>
            <div>
              <h1 className="header__title">Welcome, {user.profile.name}!</h1>
              <p className="header__subtitle">Choose your programming language to start learning</p>
            </div>
          
            <div className="header__actions">
              {isAdmin && (
                <button 
                  className="btn btn--secondary btn--sm"
                  onClick={onAdminAccess}
                >
                  Admin Panel
                </button>
              )}
              <button className="btn btn--outline" onClick={logout}>Logout</button>
            </div>
          </div>
          
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          <div className="language-selection-page__content">
            <div className="language-selection-page__header">
              <h2>Select a Programming Language</h2>
              <p>Choose the programming language you&apos;d like to learn. Each language has its own structured learning path with topics and phases.</p>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading programming languages...</p>
              </div>
            ) : languages.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__content">
                  <div className="empty-state__icon">📚</div>
                  <h3>No Programming Languages Available</h3>
                  <p>Please contact an administrator to add programming languages to the platform.</p>
                </div>
              </div>
            ) : (
              <div className="language-cards-grid">
                {languages.map((language) => {
                  const progress = getLanguageProgress(language);
                  const isCompleted = progress.percentage === 100;
                  
                  return (
                    <div
                      key={language.slug}
                      className={`language-card ${isCompleted ? 'language-card--completed' : ''}`}
                      onClick={() => handleLanguageClick(language.slug)}
                    >
                      <div className="language-card__header">
                        <div className="language-card__title-section">
                          <h3 className="language-card__title">{language.name}</h3>
                          {isCompleted && (
                            <div className="language-card__completion-badge">
                              <span className="completion-icon">✅</span>
                              <span className="completion-text">Completed</span>
                            </div>
                          )}
                        </div>
                        <div className="language-card__stats">
                          <div className="language-card__stat">
                            <span className="language-card__stat-number">{language.totalTopics}</span>
                            <span className="language-card__stat-label">Topics</span>
                          </div>
                          <div className="language-card__stat">
                            <span className="language-card__stat-number">{language.phases?.length || 0}</span>
                            <span className="language-card__stat-label">Phases</span>
                          </div>
                          {progress.completed > 0 && (
                            <div className="language-card__stat">
                              <span className="language-card__stat-number">{progress.percentage}%</span>
                              <span className="language-card__stat-label">Complete</span>
                            </div>
                          )}
                        </div>
                      </div>
                    
                    <div className="language-card__body">
                      <p className="language-card__description">{language.description}</p>
                      
                      {language.phases && language.phases.length > 0 && (
                        <div className="language-card__phases">
                          <h4>Learning Path Preview:</h4>
                          <ul className="phase-list">
                            {language.phases.slice(0, 3).map((phase, index) => (
                              <li key={index} className="phase-item">
                                <span className="phase-name">{phase.phase}</span>
                                <span className="phase-topics">({phase.topics?.length || 0} topics)</span>
                              </li>
                            ))}
                            {language.phases.length > 3 && (
                              <li className="phase-item phase-item--more">
                                +{language.phases.length - 3} more phases
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="language-card__footer">
                      <div className="language-card__cta">
                        <span className="language-card__cta-text">
                          {isCompleted 
                            ? `🎉 ${language.name} Mastered!` 
                            : progress.completed > 0 
                              ? `Continue Learning ${language.name}` 
                              : `Start Learning ${language.name}`
                          }
                        </span>
                        <span className="language-card__cta-arrow">→</span>
                      </div>
                    </div>
                    
                    {/* Progress bar for languages with progress */}
                    {progress.completed > 0 && (
                      <div className="language-card__progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-bar__fill"
                            style={{ width: `${progress.percentage}%` }}
                          ></div>
                        </div>
                        <div className="progress-text">
                          {progress.completed} of {progress.total} topics completed
                        </div>
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </section>
  );
}