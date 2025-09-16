'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, AuthState, TopicStatus } from '@/lib/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateTopicStatus: (languageSlug: string, topicId: number, status: TopicStatus) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Convert MongoDB user document to our User type
function convertUserDocument(userDoc: any): User {
  // Handle both old and new progress format
  let progress: Record<string, any> = {};
  
  if (userDoc.progress) {
    if (userDoc.progress.topicStatuses && !userDoc.progress.java) {
      // Old format - convert to new format with 'java' key
      progress.java = {
        topicStatuses: new Map(Object.entries(userDoc.progress.topicStatuses).map(([k, v]) => [parseInt(k), v as TopicStatus])),
        completedTopics: userDoc.progress.completedTopics,
        totalTopics: userDoc.progress.totalTopics,
        lastUpdated: new Date(userDoc.progress.lastUpdated)
      };
    } else {
      // New format - convert each language progress
      Object.keys(userDoc.progress).forEach(langSlug => {
        const langProgress = userDoc.progress[langSlug];
        progress[langSlug] = {
          topicStatuses: new Map(Object.entries(langProgress.topicStatuses).map(([k, v]) => [parseInt(k), v as TopicStatus])),
          completedTopics: langProgress.completedTopics,
          totalTopics: langProgress.totalTopics,
          lastUpdated: new Date(langProgress.lastUpdated)
        };
      });
    }
  }

  return {
    id: userDoc._id,
    email: userDoc.email,
    hashedPassword: userDoc.hashedPassword,
    role: userDoc.role || 'user',
    profile: userDoc.profile,
    progress
  };
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password: string) {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return {
    isValid: minLength && hasUpper && hasLower && hasNumber,
    minLength, hasUpper, hasLower, hasNumber
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isAdmin: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    const token = localStorage.getItem('javaRoadmapToken');
    if (token) {
      try {
        // Verify token by fetching user progress
        const response = await fetch('/api/user/progress', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          // Token is valid, we need to get user data
          // For now, we'll store user data in localStorage as well
          const userData = localStorage.getItem('javaRoadmapUser');
          if (userData) {
            const user = convertUserDocument(JSON.parse(userData));
            setAuthState({
              user,
              isAuthenticated: true,
              isAdmin: user.role === 'admin'
            });
          }
        } else {
          // Token is invalid, clear storage
          localStorage.removeItem('javaRoadmapToken');
          localStorage.removeItem('javaRoadmapUser');
        }
      } catch (error) {
        // Session check error
        localStorage.removeItem('javaRoadmapToken');
        localStorage.removeItem('javaRoadmapUser');
      }
    }
    setLoading(false);
  };

  const login = async (email: string, password: string, rememberMe = false) => {
    if (!validateEmail(email)) {
      throw new Error('Please enter a valid email address');
    }

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Store token and user data
    localStorage.setItem('javaRoadmapToken', data.token);
    localStorage.setItem('javaRoadmapUser', JSON.stringify(data.user));

    const user = convertUserDocument(data.user);
    setAuthState({
      user,
      isAuthenticated: true,
      isAdmin: user.role === 'admin'
    });
  };

  const register = async (name: string, email: string, password: string) => {
    if (!validateEmail(email)) {
      throw new Error('Please enter a valid email address');
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error('Password must be at least 8 characters with uppercase, lowercase, and numbers');
    }

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    // Store token and user data
    localStorage.setItem('javaRoadmapToken', data.token);
    localStorage.setItem('javaRoadmapUser', JSON.stringify(data.user));

    const user = convertUserDocument(data.user);
    setAuthState({
      user,
      isAuthenticated: true,
      isAdmin: user.role === 'admin'
    });
  };

  const updateTopicStatus = async (languageSlug: string, topicId: number, status: TopicStatus) => {
    const token = localStorage.getItem('javaRoadmapToken');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch('/api/user/progress', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ languageSlug, topicId, status }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update progress');
    }

    // Update local state
    if (authState.user) {
      const updatedUser = { ...authState.user };
      if (!updatedUser.progress[languageSlug]) {
        updatedUser.progress[languageSlug] = {
          topicStatuses: new Map(),
          completedTopics: 0,
          totalTopics: data.progress.totalTopics,
          lastUpdated: new Date()
        };
      }
      updatedUser.progress[languageSlug].topicStatuses.set(topicId, status);
      updatedUser.progress[languageSlug].completedTopics = data.progress.completedTopics;
      updatedUser.progress[languageSlug].lastUpdated = new Date(data.progress.lastUpdated);

      setAuthState({
        user: updatedUser,
        isAuthenticated: true,
        isAdmin: updatedUser.role === 'admin'
      });

      // Update localStorage
      const userDoc = JSON.parse(localStorage.getItem('javaRoadmapUser') || '{}');
      if (!userDoc.progress) userDoc.progress = {};
      userDoc.progress[languageSlug] = {
        topicStatuses: Object.fromEntries(updatedUser.progress[languageSlug].topicStatuses),
        completedTopics: data.progress.completedTopics,
        totalTopics: data.progress.totalTopics,
        lastUpdated: data.progress.lastUpdated
      };
      localStorage.setItem('javaRoadmapUser', JSON.stringify(userDoc));
    }
  };

  const logout = () => {
    localStorage.removeItem('javaRoadmapToken');
    localStorage.removeItem('javaRoadmapUser');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isAdmin: false
    });
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      register,
      logout,
      updateTopicStatus,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}