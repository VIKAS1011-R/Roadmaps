'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { TopicStatus, Topic } from '@/lib/types';

export const dynamic = 'force-dynamic';

const statusIcons = {
  'pending': '⏳',
  'learning': '📚',
  'onhold': '⏸️',
  'completed': '✅',
  'ignore': '❌'
};

interface LanguageDashboardProps {
  params: { language: string };
}

export default function LanguageDashboard({ params }: LanguageDashboardProps) {
  const { user, logout, updateTopicStatus: updateTopicStatusAPI, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [languageData, setLanguageData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState<'all' | TopicStatus>('all');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [topicStatuses, setTopicStatuses] = useState<Map<number, TopicStatus>>(new Map());
  const [loading, setLoading] = useState(true);

  const languageSlug = params.language;

  useEffect(() => {
    // Wait for auth loading to complete before making redirect decisions
    if (authLoading) {
      return;
    }
    
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    
    fetchLanguageData();
  }, [isAuthenticated, authLoading, languageSlug, router]);

  useEffect(() => {
    // Update topic statuses when user or language changes
    if (user?.progress[languageSlug]) {
      setTopicStatuses(user.progress[languageSlug].topicStatuses);
    } else {
      setTopicStatuses(new Map());
    }
  }, [user, languageSlug]);

  const fetchLanguageData = async () => {
    try {
      const response = await fetch(`/api/languages/${languageSlug}`);
      if (response.ok) {
        const data = await response.json();
        setLanguageData(data.language);
      } else if (response.status === 404) {
        // Language not found, redirect to language selection
        router.push('/dashboard');
      } else {
        // Failed to fetch language data
      }
    } catch (error) {
      // Error fetching language data
    } finally {
      setLoading(false);
    }
  };

  const updateTopicStatus = async (topicId: number, status: TopicStatus) => {
    try {
      await updateTopicStatusAPI(languageSlug, topicId, status);
      setTopicStatuses(prev => {
        const newMap = new Map(prev);
        newMap.set(topicId, status);
        return newMap;
      });
      setSelectedTopic(null);
    } catch (error) {
      // Failed to update topic status
    }
  };

  const getTopicStatus = (topicId: number): TopicStatus => {
    return topicStatuses.get(topicId) || 'pending';
  };

  const stats = {
    completed: Array.from(topicStatuses.values()).filter(status => status === 'completed').length,
    learning: Array.from(topicStatuses.values()).filter(status => status === 'learning').length,
    total: languageData?.totalTopics || 0,
    percentage: languageData?.totalTopics ? Math.round((Array.from(topicStatuses.values()).filter(status => status === 'completed').length / languageData.totalTopics) * 100) : 0
  };

  const filteredPhases = languageData?.phases?.map((phase: any) => ({
    ...phase,
    topics: phase.topics.filter((topic: any) => {
      const matchesSearch = topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          topic.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = currentFilter === 'all' || 
                          (topicStatuses.get(topic.id) || 'pending') === currentFilter;
      return matchesSearch && matchesFilter;
    })
  })).filter((phase: any) => phase.topics.length > 0) || [];

  // Show loading while authentication is being checked
  if (authLoading) {
    return (
      <section className="dashboard">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Checking authentication...</p>
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <section className="dashboard">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading {languageSlug} roadmap...</p>
        </div>
      </section>
    );
  }

  if (!languageData) {
    return (
      <section className="dashboard">
        <div className="empty-state">
          <div className="empty-state__content">
            <h3>Language Not Found</h3>
            <p>The programming language &quot;{languageSlug}&quot; was not found.</p>
            <button className="btn btn--primary" onClick={() => router.push('/dashboard')}>
              Choose Another Language
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard">
      <header className="header">
        <div className="container">
          <div className="header__user">
            <div className="header__navigation">
              <button 
                className="language-back-btn"
                onClick={() => router.push('/dashboard')}
                title="Back to Language Selection"
              >
                ← Back to Languages
              </button>
            </div>
            <h1 className="header__title">
              {languageData.name} Learning Path
            </h1>
            <p className="header__subtitle">
              Welcome back, {user?.profile.name}! Continue your {languageData.name} journey
            </p>
          </div>

          <div className="header__progress">
            <div className="progress-stats">
              <div className="progress-circle">
                <svg className="progress-circle__svg" width="80" height="80">
                  <circle cx="40" cy="40" r="35" className="progress-circle__bg"></circle>
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="35" 
                    className="progress-circle__fill"
                    style={{
                      strokeDasharray: '219.8',
                      strokeDashoffset: `${219.8 - (219.8 * stats.percentage) / 100}`
                    }}
                  ></circle>
                </svg>
                <div className="progress-circle__text">
                  <span>{stats.percentage}%</span>
                </div>
              </div>
              <div className="stats-summary">
                <div className="stat-item">
                  <span className="stat-value">{stats.completed}</span>
                  <span className="stat-label">Completed</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.learning}</span>
                  <span className="stat-label">Learning</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.total}</span>
                  <span className="stat-label">Total</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="controls">
            <div className="search-filter">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search topics..."
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filter-buttons">
                {(['all', 'pending', 'learning', 'onhold', 'completed', 'ignore'] as const).map(filter => (
                  <button
                    key={filter}
                    className={`btn btn--sm filter-btn ${currentFilter === filter ? 'active' : ''}`}
                    onClick={() => setCurrentFilter(filter)}
                  >
                    {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="action-buttons">
              <button className="btn btn--secondary">Reset Progress</button>
              <button className="btn btn--outline">Export Progress</button>
            </div>
          </div>

          <div className="roadmap">
            {filteredPhases.map((phase: any, phaseIndex: number) => (
              <div key={phaseIndex} className="phase">
                <div className="phase__header">
                  <div>
                    <h2 className="phase__title">{phase.phase}</h2>
                  </div>
                </div>
                <div className="phase__content">
                  <div className="topics-grid">
                    {phase.topics.map((topic: any) => {
                      const status = getTopicStatus(topic.id);
                      return (
                        <div
                          key={topic.id}
                          className={`topic-card topic-card--${status}`}
                          data-topic-id={topic.id}
                          onClick={() => setSelectedTopic(topic)}
                        >
                          <div className="topic-card__header">
                            <h3 className="topic-card__title">{topic.name}</h3>
                            <span className="topic-card__status">{statusIcons[status]}</span>
                          </div>
                          <p className="topic-card__description">{topic.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Status Modal */}
      {selectedTopic && (
        <div className="modal">
          <div className="modal__backdrop" onClick={() => setSelectedTopic(null)}></div>
          <div className="modal__content">
            <div className="modal__header">
              <h3 className="modal__title">Update Topic Status</h3>
              <button className="modal__close" onClick={() => setSelectedTopic(null)}>×</button>
            </div>
            <div className="modal__body">
              <p className="modal__description">{selectedTopic.description}</p>
              <div className="status-options">
                {(['pending', 'learning', 'onhold', 'completed', 'ignore'] as const).map(status => (
                  <button
                    key={status}
                    className={`status-btn status-btn--${status}`}
                    onClick={() => updateTopicStatus(selectedTopic.id, status)}
                  >
                    <span className="status-icon">{statusIcons[status]}</span>
                    <span className="status-text">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}