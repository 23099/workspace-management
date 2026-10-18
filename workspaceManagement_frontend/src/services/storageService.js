// Centralized AsyncStorage Service
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SEED_COMPANY,
  SEED_DEPARTMENTS,
  SEED_USERS,
  SEED_ATTENDANCE,
  SEED_SALARY_CONFIG,
  SEED_HR_TICKETS,
  SEED_LEAVES,
  SEED_TASKS,
  SEED_REQUIREMENTS,
  SEED_ANNOUNCEMENTS,
  SEED_NOTIFICATIONS,
} from '../data/seedData';

export const STORAGE_KEYS = {
  APP_INITIALIZED: '@wms_app_initialized',
  AUTH_CURRENT_USER: '@wms_auth_current_user',
  THEME_PREFERENCE: '@wms_theme_preference',
  COMPANY: '@wms_company',
  DEPARTMENTS: '@wms_departments',
  USERS: '@wms_users',
  ATTENDANCE: '@wms_attendance',
  SALARY_CONFIG: '@wms_salary_config',
  TICKETS: '@wms_tickets',
  LEAVES: '@wms_leaves',
  TASKS: '@wms_tasks',
  REQUIREMENTS: '@wms_requirements',
  ANNOUNCEMENTS: '@wms_announcements',
  NOTIFICATIONS: '@wms_notifications',
};

export const storageService = {
  async getItem(key, defaultValue = null) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue === null || jsonValue === undefined) {
        return defaultValue;
      }
      return JSON.parse(jsonValue);
    } catch (e) {
      console.warn(`[storageService] Error getting item for key ${key}:`, e);
      return defaultValue;
    }
  },

  async setItem(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (e) {
      console.warn(`[storageService] Error setting item for key ${key}:`, e);
      return false;
    }
  },

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn(`[storageService] Error removing item for key ${key}:`, e);
      return false;
    }
  },

  async initializeSeedDataIfNeeded() {
    try {
      const isInit = await this.getItem(STORAGE_KEYS.APP_INITIALIZED, false);
      if (!isInit) {
        await this.resetToSeedData();
      }
    } catch (e) {
      console.warn('[storageService] Initialization check failed:', e);
    }
  },

  async resetToSeedData() {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.COMPANY, JSON.stringify(SEED_COMPANY)],
        [STORAGE_KEYS.DEPARTMENTS, JSON.stringify(SEED_DEPARTMENTS)],
        [STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS)],
        [STORAGE_KEYS.ATTENDANCE, JSON.stringify(SEED_ATTENDANCE)],
        [STORAGE_KEYS.SALARY_CONFIG, JSON.stringify(SEED_SALARY_CONFIG)],
        [STORAGE_KEYS.TICKETS, JSON.stringify(SEED_HR_TICKETS)],
        [STORAGE_KEYS.LEAVES, JSON.stringify(SEED_LEAVES)],
        [STORAGE_KEYS.TASKS, JSON.stringify(SEED_TASKS)],
        [STORAGE_KEYS.REQUIREMENTS, JSON.stringify(SEED_REQUIREMENTS)],
        [STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(SEED_ANNOUNCEMENTS)],
        [STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS)],
        [STORAGE_KEYS.APP_INITIALIZED, JSON.stringify(true)],
      ]);
      return true;
    } catch (e) {
      console.warn('[storageService] Failed resetting seed data:', e);
      return false;
    }
  },
};

export default storageService;
