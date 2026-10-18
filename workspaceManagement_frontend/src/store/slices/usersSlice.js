import { createSlice } from '@reduxjs/toolkit';
import { SEED_USERS, SEED_DEPARTMENTS } from '../../data/seedData';

const initialState = {
  users: [...SEED_USERS],
  departments: [...SEED_DEPARTMENTS],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.users.unshift(action.payload);
      // Increment department count if assigned
      if (action.payload.departmentId) {
        const dept = state.departments.find((d) => d.id === action.payload.departmentId);
        if (dept) dept.memberCount = (dept.memberCount || 0) + 1;
      }
    },
    updateUser: (state, action) => {
      const idx = state.users.findIndex((u) => u.id === action.payload.id);
      if (idx !== -1) {
        state.users[idx] = { ...state.users[idx], ...action.payload };
      }
    },
    toggleUserActive: (state, action) => {
      const user = state.users.find((u) => u.id === action.payload);
      if (user) {
        user.isActive = !user.isActive;
      }
    },
    updateOwnDP: (state, action) => {
      const { userId, avatarUri } = action.payload;
      const user = state.users.find((u) => u.id === userId);
      if (user) {
        user.avatarKey = avatarUri;
        user.avatarCustomUri = avatarUri;
      }
    },
    addDepartment: (state, action) => {
      state.departments.push(action.payload);
    },
    updateDepartment: (state, action) => {
      const idx = state.departments.findIndex((d) => d.id === action.payload.id);
      if (idx !== -1) {
        state.departments[idx] = { ...state.departments[idx], ...action.payload };
      }
    },
    archiveDepartment: (state, action) => {
      const dept = state.departments.find((d) => d.id === action.payload);
      if (dept) {
        dept.status = 'ARCHIVED';
      }
    },
    resetUsers: () => ({
      users: [...SEED_USERS],
      departments: [...SEED_DEPARTMENTS],
    }),
  },
});

export const {
  addUser,
  updateUser,
  toggleUserActive,
  updateOwnDP,
  addDepartment,
  updateDepartment,
  archiveDepartment,
  resetUsers,
} = usersSlice.actions;

export default usersSlice.reducer;
