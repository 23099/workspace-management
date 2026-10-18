import { createSlice } from '@reduxjs/toolkit';
import { SEED_NOTIFICATIONS } from '../../data/seedData';

const initialState = {
  notifications: [...SEED_NOTIFICATIONS],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAsRead: (state, action) => {
      const item = state.notifications.find((n) => n.id === action.payload);
      if (item) item.read = true;
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.read = true;
      });
    },
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: `NOTIF-${Date.now()}`,
        time: 'Just now',
        read: false,
        ...action.payload,
      });
    },
    resetNotifications: () => ({ notifications: [...SEED_NOTIFICATIONS] }),
  },
});

export const { markAsRead, markAllAsRead, addNotification, resetNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
