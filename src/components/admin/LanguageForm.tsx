'use client';

import { useState, useEffect } from 'react';
import { ProgrammingLanguage, Phase, Topic } from '@/lib/types';

interface LanguageFormProps {
  language?: ProgrammingLanguage | null;
  onSave: (language: ProgrammingLanguage) => void;
  onCancel: () => void;
}

export default function LanguageForm({ language, onSave, onCancel }: LanguageFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phases: [] as Phase[]
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (language) {
      setFormData({
        name: language.name,
        description: language.description,
        phases: language.phases || []
      });
    }
  }, [language]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addPhase = () => {
    setFormData(prev => ({
      ...prev,
      phases: [...prev.phases, { phase: '', topics: [] }]
    }));
  };

  const updatePhase = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      phases: prev.phases.map((phase, i) => 
        i === index ? { ...phase, [field]: value } : phase
      )
    }));
  };

  const removePhase = (index: number) => {
    setFormData(prev => ({
      ...prev,
      phases: prev.phases.filter((_, i) => i !== index)
    }));
  };

  const addTopic = (phaseIndex: number) => {
    setFormData(prev => ({
      ...prev,
      phases: prev.phases.map((phase, i) => 
        i === phaseIndex 
          ? { ...phase, topics: [...phase.topics, { id: 0, name: '', description: '' }] }
          : phase
      )
    }));
  };

  const updateTopic = (phaseIndex: number, topicIndex: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      phases: prev.phases.map((phase, i) => 
        i === phaseIndex 
          ? {
              ...phase,
              topics: phase.topics.map((topic, j) => 
                j === topicIndex ? { ...topic, [field]: value } : topic
              )
            }
          : phase
      )
    }));
  };

  const removeTopic = (phaseIndex: number, topicIndex: number) => {
    setFormData(prev => ({
      ...prev,
      phases: prev.phases.map((phase, i) => 
        i === phaseIndex 
          ? { ...phase, topics: phase.topics.filter((_, j) => j !== topicIndex) }
          : phase
      )
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Language name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.phases.length === 0) {
      newErrors.phases = 'At least one phase is required';
    }

    formData.phases.forEach((phase, phaseIndex) => {
      if (!phase.phase.trim()) {
        newErrors[`phase_${phaseIndex}`] = 'Phase name is required';
      }

      if (phase.topics.length === 0) {
        newErrors[`phase_${phaseIndex}_topics`] = 'At least one topic is required per phase';
      }

      phase.topics.forEach((topic, topicIndex) => {
        if (!topic.name.trim()) {
          newErrors[`topic_${phaseIndex}_${topicIndex}_name`] = 'Topic name is required';
        }
        if (!topic.description.trim()) {
          newErrors[`topic_${phaseIndex}_${topicIndex}_description`] = 'Topic description is required';
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('javaRoadmapToken');
      const url = language 
        ? `/api/admin/languages/${language.slug}`
        : '/api/admin/languages';
      
      const method = language ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        onSave(data.language);
      } else {
        setErrors({ form: data.error || 'Failed to save language' });
      }
    } catch (error) {
      // Error saving language
      setErrors({ form: 'Failed to save language' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="language-form">
      <div className="language-form__header">
        <h3>{language ? 'Edit Language' : 'Create New Language'}</h3>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-section">
          <h4>Basic Information</h4>
          
          <div className="form-group">
            <label className="form-label" htmlFor="name">Language Name</label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., JavaScript, Python, Java"
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea
              id="description"
              className="form-control"
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of the programming language and learning path"
            />
            {errors.description && <div className="form-error">{errors.description}</div>}
          </div>
        </div>

        <div className="form-section">
          <div className="form-section__header">
            <h4>Learning Phases</h4>
            <button type="button" className="btn btn--sm btn--primary" onClick={addPhase}>
              + Add Phase
            </button>
          </div>

          {errors.phases && <div className="form-error">{errors.phases}</div>}

          <div className="phases-list">
            {formData.phases.map((phase, phaseIndex) => (
              <div key={phaseIndex} className="phase-form">
                <div className="phase-form__header">
                  <h5>Phase {phaseIndex + 1}</h5>
                  <button 
                    type="button" 
                    className="btn btn--sm btn--secondary"
                    onClick={() => removePhase(phaseIndex)}
                  >
                    Remove Phase
                  </button>
                </div>

                <div className="form-group">
                  <label className="form-label">Phase Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={phase.phase}
                    onChange={(e) => updatePhase(phaseIndex, 'phase', e.target.value)}
                    placeholder="e.g., Phase 1: Getting Started"
                  />
                  {errors[`phase_${phaseIndex}`] && (
                    <div className="form-error">{errors[`phase_${phaseIndex}`]}</div>
                  )}
                </div>

                <div className="topics-section">
                  <div className="topics-section__header">
                    <h6>Topics</h6>
                    <button 
                      type="button" 
                      className="btn btn--sm btn--outline"
                      onClick={() => addTopic(phaseIndex)}
                    >
                      + Add Topic
                    </button>
                  </div>

                  {errors[`phase_${phaseIndex}_topics`] && (
                    <div className="form-error">{errors[`phase_${phaseIndex}_topics`]}</div>
                  )}

                  <div className="topics-list">
                    {phase.topics.map((topic, topicIndex) => (
                      <div key={topicIndex} className="topic-form">
                        <div className="topic-form__header">
                          <span>Topic {topicIndex + 1}</span>
                          <button 
                            type="button" 
                            className="btn btn--sm btn--secondary"
                            onClick={() => removeTopic(phaseIndex, topicIndex)}
                          >
                            Remove
                          </button>
                        </div>

                        <div className="topic-form__fields">
                          <div className="form-group">
                            <label className="form-label">Topic Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={topic.name}
                              onChange={(e) => updateTopic(phaseIndex, topicIndex, 'name', e.target.value)}
                              placeholder="e.g., Variables and Data Types"
                            />
                            {errors[`topic_${phaseIndex}_${topicIndex}_name`] && (
                              <div className="form-error">{errors[`topic_${phaseIndex}_${topicIndex}_name`]}</div>
                            )}
                          </div>

                          <div className="form-group">
                            <label className="form-label">Topic Description</label>
                            <textarea
                              className="form-control"
                              rows={2}
                              value={topic.description}
                              onChange={(e) => updateTopic(phaseIndex, topicIndex, 'description', e.target.value)}
                              placeholder="Brief description of what this topic covers"
                            />
                            {errors[`topic_${phaseIndex}_${topicIndex}_description`] && (
                              <div className="form-error">{errors[`topic_${phaseIndex}_${topicIndex}_description`]}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {errors.form && <div className="form-error">{errors.form}</div>}

        <div className="form-actions">
          <button type="button" className="btn btn--outline" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Saving...' : (language ? 'Update Language' : 'Create Language')}
          </button>
        </div>
      </form>
    </div>
  );
}