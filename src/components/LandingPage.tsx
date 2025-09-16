'use client';

import { useAuth } from '@/hooks/useAuth';

interface LandingPageProps {
  onNavigate: (page: 'login' | 'signup') => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const { isAuthenticated } = useAuth();

  return (
    <section className="landing">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="container">
          <div className="navbar__brand">
            <h1 className="navbar__title">Roadmaps</h1>
          </div>
          <div className="navbar__menu">
            {!isAuthenticated && (
              <>
                <button 
                  className="btn btn--outline btn--sm"
                  onClick={() => onNavigate('login')}
                >
                  Login
                </button>
                <button 
                  className="btn btn--primary btn--sm"
                  onClick={() => onNavigate('signup')}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="hero">
        <div className="container">
          <div className="hero__content">
            <h1 className="hero__title">Master Programming Languages</h1>
            <p className="hero__subtitle">
              Follow a comprehensive, structured learning path designed by experts. Track your progress and become a Java developer.
            </p>
            <div className="hero__actions">
              <button 
                className="btn btn--primary btn--lg"
                onClick={() => onNavigate('signup')}
              >
                Get Started
              </button>
              <button 
                className="btn btn--outline btn--lg"
                onClick={() => {
                  document.querySelector('.features')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More
              </button>
            </div>
          </div>
          <div className="hero__visual">
            <div className="progress-preview">
              <div className="progress-circle">
                <svg className="progress-circle__svg" width="120" height="120">
                  <circle cx="60" cy="60" r="50" className="progress-circle__bg"></circle>
                  <circle cx="60" cy="60" r="50" className="progress-circle__fill" style={{strokeDashoffset: '220'}}></circle>
                </svg>
                <div className="progress-circle__text">
                  <span>40</span>
                  <small>Topics</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="features">
        <div className="container">
          <h2 className="features__title">Why Choose Our Roadmap?</h2>
          <div className="features__grid">
            <div className="feature-card">
              <div className="feature-card__icon">🛤️</div>
              <h3 className="feature-card__title">Structured Learning Path</h3>
              <p className="feature-card__description">Follow a comprehensive 7-phase roadmap designed by Java experts</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">📊</div>
              <h3 className="feature-card__title">Progress Tracking</h3>
              <p className="feature-card__description">Visual indicators and statistics to monitor your learning journey</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">🎯</div>
              <h3 className="feature-card__title">Interactive Topics</h3>
              <p className="feature-card__description">Click to update status: Pending, Learning, On Hold, Completed, Ignore</p>
            </div>
            <div className="feature-card">
              <div className="feature-card__icon">👤</div>
              <h3 className="feature-card__title">Personal Dashboard</h3>
              <p className="feature-card__description">Customized experience with your progress saved across sessions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="container">
          <h2 className="cta__title">Ready to Start Your Java Journey?</h2>
          <p className="cta__description">
            Join thousands of developers who have mastered Java using our structured roadmap.
          </p>
          <div className="cta__actions">
            <button 
              className="btn btn--primary btn--lg"
              onClick={() => onNavigate('signup')}
            >
              Create Free Account
            </button>
            <button 
              className="btn btn--secondary btn--lg"
              onClick={() => onNavigate('login')}
            >
              Already have an account?
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}