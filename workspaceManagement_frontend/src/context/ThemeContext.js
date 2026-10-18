import React, { createContext, useContext, useState, useEffect } from 'react';
import { ROLE_THEMES, ROLES } from '../utils/permissions';
import storageService, { STORAGE_KEYS } from '../services/storageService';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    (async () => {
      const savedTheme = await storageService.getItem(STORAGE_KEYS.THEME_PREFERENCE, false);
      setIsDark(Boolean(savedTheme));
    })();
  }, []);

  const toggleTheme = async () => {
    const nextVal = !isDark;
    setIsDark(nextVal);
    await storageService.setItem(STORAGE_KEYS.THEME_PREFERENCE, nextVal);
  };

  const getRolePalette = (role = ROLES.EMPLOYEE) => {
    const basePalette = ROLE_THEMES[role] || ROLE_THEMES.EMPLOYEE;
    return {
      ...basePalette,
      isDark,
      background: isDark ? '#0B0F17' : '#F8FAFC',
      surface: isDark ? '#151D2A' : '#FFFFFF',
      card: isDark ? '#1E293B' : '#FFFFFF',
      cardBorder: isDark ? '#334155' : '#E2E8F0',
      textPrimary: isDark ? '#F8FAFC' : '#0F172A',
      textSecondary: isDark ? '#94A3B8' : '#64748B',
      textMuted: isDark ? '#64748B' : '#94A3B8',
      divider: isDark ? '#334155' : '#F1F5F9',
      inputBackground: isDark ? '#0F172A' : '#F8FAFC',
      inputBorder: isDark ? '#334155' : '#CBD5E1',
      statusBar: isDark ? 'light-content' : 'dark-content',
    };
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, getRolePalette }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
