// Role Permissions & Palette Configurations

export const ROLES = {
  ADMIN: 'ADMIN',
  HR: 'HR',
  MANAGER: 'MANAGER',
  EMPLOYEE: 'EMPLOYEE',
  CLIENT: 'CLIENT',
};

export const ROLE_THEMES = {
  ADMIN: {
    primary: '#1E293B', // Deep Slate Navy
    secondary: '#0F172A',
    light: '#F1F5F9',
    badge: '#E2E8F0',
    text: '#0F172A',
    contrastText: '#FFFFFF',
    roleLabel: 'Company Administrator',
  },
  HR: {
    primary: '#0F766E', // Deep Emerald Teal
    secondary: '#115E59',
    light: '#F0FDFA',
    badge: '#CCFBF1',
    text: '#134E4A',
    contrastText: '#FFFFFF',
    roleLabel: 'HR & Payroll Specialist',
  },
  MANAGER: {
    primary: '#1D4ED8', // Royal Blue
    secondary: '#1E40AF',
    light: '#EFF6FF',
    badge: '#DBEAFE',
    text: '#1E3A8A',
    contrastText: '#FFFFFF',
    roleLabel: 'Engineering Manager',
  },
  EMPLOYEE: {
    primary: '#4338CA', // Deep Indigo
    secondary: '#3730A3',
    light: '#EEF2FF',
    badge: '#E0E7FF',
    text: '#312E81',
    contrastText: '#FFFFFF',
    roleLabel: 'Software Engineer II',
  },
  CLIENT: {
    primary: '#92400E', // Deep Amber Bronze
    secondary: '#78350F',
    light: '#FFFBEB',
    badge: '#FEF3C7',
    text: '#451A03',
    contrastText: '#FFFFFF',
    roleLabel: 'Client Representative',
  },
};

export const canEditUserAccounts = (role) => role === ROLES.ADMIN;
export const canEditOwnProfileFields = (role) => role === ROLES.ADMIN;
export const canCreateRequirements = (role) => role === ROLES.MANAGER || role === ROLES.ADMIN;
export const canCreateTasks = (role) => role === ROLES.MANAGER || role === ROLES.ADMIN;
export const canOverrideAttendance = (role) => role === ROLES.HR || role === ROLES.ADMIN;
export const canApproveLeaves = (role) => role === ROLES.MANAGER || role === ROLES.ADMIN;
export const canConfigureSalary = (role) => role === ROLES.HR || role === ROLES.ADMIN;
