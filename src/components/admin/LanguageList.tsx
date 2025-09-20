'use client';

import { ProgrammingLanguage } from '../../lib/types';

interface LanguageListProps {
  languages: ProgrammingLanguage[];
  onEdit: (language: ProgrammingLanguage) => void;
  onDelete: (slug: string) => void;
}

export default function LanguageList({ languages, onEdit, onDelete }: LanguageListProps) {
  if (languages.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__content">
          <h3>No Programming Languages</h3>
          <p>Get started by creating your first programming language roadmap.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="language-list">
      <div className="language-grid">
        {languages.map((language) => (
          <div key={language.slug} className="language-card">
            <div className="language-card__header">
              <h3 className="language-card__title">{language.name}</h3>
              <div className="language-card__meta">
                <span className="language-card__topics">{language.totalTopics} topics</span>
                <span className="language-card__phases">{language.phases?.length || 0} phases</span>
              </div>
            </div>
            
            <div className="language-card__body">
              <p className="language-card__description">{language.description}</p>
              
              <div className="language-card__phases">
                {language.phases?.slice(0, 3).map((phase, index) => (
                  <div key={index} className="phase-preview">
                    <span className="phase-preview__name">{phase.phase}</span>
                    <span className="phase-preview__count">{phase.topics?.length || 0} topics</span>
                  </div>
                ))}
                {language.phases && language.phases.length > 3 && (
                  <div className="phase-preview phase-preview--more">
                    +{language.phases.length - 3} more phases
                  </div>
                )}
              </div>
            </div>
            
            <div className="language-card__footer">
              <div className="language-card__date">
                Created: {new Date(language.createdAt).toLocaleDateString()}
              </div>
              <div className="language-card__actions">
                <button 
                  className="btn btn--sm btn--outline"
                  onClick={() => onEdit(language)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn--sm btn--secondary"
                  onClick={() => onDelete(language.slug)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}