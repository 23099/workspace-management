import { createSlice } from '@reduxjs/toolkit';
import { SEED_ANNOUNCEMENTS } from '../../data/seedData';

const initialState = {
  announcements: [...SEED_ANNOUNCEMENTS],
};

const announcementsSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    addAnnouncement: (state, action) => {
      state.announcements.unshift({
        id: `ANC-${Date.now()}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        ...action.payload,
      });
    },
    resetAnnouncements: () => ({ announcements: [...SEED_ANNOUNCEMENTS] }),
  },
});

export const { addAnnouncement, resetAnnouncements } = announcementsSlice.actions;
export default announcementsSlice.reducer;
