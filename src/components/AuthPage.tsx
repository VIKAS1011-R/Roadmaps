'use client';

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AuthPageProps {
  mode: 'login' | 'signup';
  onSwitchMode: () => void;
  onBack: () => void;
}

export default function AuthPage({ mode, onSwitchMode, onBack }: AuthPageProps) {
  const { login, register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
    termsAccepted: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const clearErrors = () => setErrors({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return {
      isValid: minLength && hasUpper && hasLower && hasNumber,
      minLength, hasUpper, hasLower, hasNumber
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password, formData.rememberMe);
      } else {
        // Validation for signup
        const newErrors: Record<string, string> = {};
        
        if (!formData.name.trim()) {
          newErrors.name = 'Full name is required';
        }
        
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        }
        
        const passwordValidation = validatePassword(formData.password);
        if (!formData.password) {
          newErrors.password = 'Password is required';
        } else if (!passwordValidation.isValid) {
          newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and numbers';
        }
        
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        
        if (!formData.termsAccepted) {
          newErrors.terms = 'You must accept the terms and conditions';
        }
        
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          setLoading(false);
          return;
        }

        await register(formData.name, formData.email, formData.password);
      }
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!formData.password) return null;
    
    const validation = validatePassword(formData.password);
    const requirements = [];
    
    if (!validation.minLength) requirements.push('8+ characters');
    if (!validation.hasUpper) requirements.push('uppercase letter');
    if (!validation.hasLower) requirements.push('lowercase letter');
    if (!validation.hasNumber) requirements.push('number');
    
    if (requirements.length === 0) {
      return { text: '✓ Strong password', className: 'text-[var(--color-success)]' };
    } else {
      return { 
        text: `Missing: ${requirements.join(', ')}`, 
        className: 'text-[var(--color-error)]' 
      };
    }
  };

  const passwordStrength = mode === 'signup' ? getPasswordStrength() : null;

  return (
    <section className="auth-container">
      <div className="auth-form">
        <div className="container">
          <div className="auth-form__wrapper">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              {mode === 'login' 
                ? 'Sign in to continue your Java learning journey'
                : 'Start your Java learning journey today'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              {passwordStrength && (
                <div className={`text-xs mt-2 ${passwordStrength.className}`}>
                  {passwordStrength.text}
                </div>
              )}
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            {mode === 'signup' && (
              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-control"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
              </div>
            )}

            {mode === 'login' && (
              <div className="form-group">
                <label className="flex items-start gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="mt-0.5"
                  />
                  <span>Remember me for 7 days</span>
                </label>
              </div>
            )}

            {mode === 'signup' && (
              <div className="form-group">
                <label className="flex items-start gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    className="mt-0.5"
                    required
                  />
                  <span>
                    I agree to the <a href="#" className="text-[var(--color-primary)]">Terms of Service</a> and{' '}
                    <a href="#" className="text-[var(--color-primary)]">Privacy Policy</a>
                  </span>
                </label>
                {errors.terms && <div className="form-error">{errors.terms}</div>}
              </div>
            )}

            {errors.form && <div className="form-error">{errors.form}</div>}

            <button
              type="submit"
              className="btn btn--primary btn--full-width"
              disabled={loading}
            >
              {loading 
                ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
                : (mode === 'login' ? 'Sign In' : 'Create Account')
              }
            </button>

            {mode === 'login' && (
              <div className="text-center mt-4">
                <a href="#" className="text-[var(--color-primary)] text-sm">
                  Forgot your password?
                </a>
              </div>
            )}

            <div className="text-center mt-6 pt-4 border-t border-[var(--color-border)]">
              <span className="text-[var(--color-text-secondary)] text-sm">
                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              </span>
            </div>

            <button
              type="button"
              className="btn btn--outline btn--full-width"
              onClick={onSwitchMode}
            >
              {mode === 'login' ? 'Create Account' : 'Sign In'}
            </button>
          </form>
          </div>
        </div>
      </div>
    </section>
  );
}