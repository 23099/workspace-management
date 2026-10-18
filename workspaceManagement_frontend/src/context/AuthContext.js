import React, { createContext, useContext, useState, useEffect } from 'react';
import storageService, { STORAGE_KEYS } from '../services/storageService';
import { SEED_USERS } from '../data/seedData';
import { isValidEmail, isValidPassword } from '../utils/validation';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSplashLoading, setIsSplashLoading] = useState(true);

  // Initialize seed data and restore session
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        await storageService.initializeSeedDataIfNeeded();
        const savedUser = await storageService.getItem(STORAGE_KEYS.AUTH_CURRENT_USER, null);
        if (isMounted) {
          // If no session exists, default to Admin or null
          setCurrentUser(savedUser);
        }
      } catch (err) {
        console.warn('[AuthContext] Session restore error:', err);
      } finally {
        if (isMounted) {
          // Brief splash timer to simulate network/system initialization
          setTimeout(() => setIsSplashLoading(false), 500);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    if (!isValidEmail(email)) {
      return { success: false, error: 'Please enter a valid work email address' };
    }
    if (!isValidPassword(password)) {
      return { success: false, error: '! Password must be at least 6 characters' };
    }

    const storedUsers = await storageService.getItem(STORAGE_KEYS.USERS, SEED_USERS);
    const user = storedUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (!user) {
      return { success: false, error: 'No user found with this email address' };
    }

    if (user.password && user.password !== password) {
      return { success: false, error: 'Incorrect password entered' };
    }

    if (user.isActive === false) {
      return { success: false, error: 'Account has been deactivated. Contact Admin.' };
    }

    setCurrentUser(user);
    await storageService.setItem(STORAGE_KEYS.AUTH_CURRENT_USER, user);
    return { success: true, user };
  };

  const quickDemoLogin = async (roleOrUserId) => {
    const storedUsers = await storageService.getItem(STORAGE_KEYS.USERS, SEED_USERS);
    let target = storedUsers.find((u) => u.id === roleOrUserId || u.role === roleOrUserId);
    if (!target) {
      target = SEED_USERS.find((u) => u.id === roleOrUserId || u.role === roleOrUserId);
    }
    if (target) {
      setCurrentUser(target);
      await storageService.setItem(STORAGE_KEYS.AUTH_CURRENT_USER, target);
      return { success: true, user: target };
    }
    return { success: false, error: 'Demo user not found' };
  };

  const updateCurrentUserDP = async (avatarUriOrKey) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      avatarKey: avatarUriOrKey,
      avatarCustomUri: avatarUriOrKey,
    };
    setCurrentUser(updated);
    await storageService.setItem(STORAGE_KEYS.AUTH_CURRENT_USER, updated);

    // Also update in stored users
    const storedUsers = await storageService.getItem(STORAGE_KEYS.USERS, SEED_USERS);
    const updatedUsers = storedUsers.map((u) =>
      u.id === currentUser.id ? { ...u, avatarKey: avatarUriOrKey, avatarCustomUri: avatarUriOrKey } : u
    );
    await storageService.setItem(STORAGE_KEYS.USERS, updatedUsers);
  };

  const updateAdminProfile = async (fields) => {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return { success: false, error: 'Only Administrator can edit profile fields.' };
    }
    const updated = { ...currentUser, ...fields };
    setCurrentUser(updated);
    await storageService.setItem(STORAGE_KEYS.AUTH_CURRENT_USER, updated);

    const storedUsers = await storageService.getItem(STORAGE_KEYS.USERS, SEED_USERS);
    const updatedUsers = storedUsers.map((u) =>
      u.id === currentUser.id ? { ...u, ...fields } : u
    );
    await storageService.setItem(STORAGE_KEYS.USERS, updatedUsers);
    return { success: true, user: updated };
  };

  const logout = async () => {
    setCurrentUser(null);
    await storageService.removeItem(STORAGE_KEYS.AUTH_CURRENT_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isSplashLoading,
        login,
        quickDemoLogin,
        updateCurrentUserDP,
        updateAdminProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
