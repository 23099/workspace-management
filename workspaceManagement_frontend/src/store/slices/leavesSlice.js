import { createSlice } from '@reduxjs/toolkit';
import { SEED_LEAVES } from '../../data/seedData';

const initialState = {
  leaves: [...SEED_LEAVES],
};

const leavesSlice = createSlice({
  name: 'leaves',
  initialState,
  reducers: {
    applyLeave: (state, action) => {
      state.leaves.unshift({
        id: `LV-${Date.now()}`,
        ...action.payload,
        status: 'PENDING',
        managerReviewComment: '',
        teamOverlapStatus: 'Clear • Verified by System',
      });
    },
    approveLeave: (state, action) => {
      const { leaveId, comment } = action.payload;
      const leave = state.leaves.find((l) => l.id === leaveId);
      if (leave) {
        leave.status = 'APPROVED';
        leave.managerReviewComment = comment || 'Approved by Manager';
      }
    },
    rejectLeave: (state, action) => {
      const { leaveId, comment } = action.payload;
      const leave = state.leaves.find((l) => l.id === leaveId);
      if (leave) {
        leave.status = 'REJECTED';
        leave.managerReviewComment = comment || 'Rejected by Manager';
      }
    },
    resetLeaves: () => ({ leaves: [...SEED_LEAVES] }),
  },
});

export const { applyLeave, approveLeave, rejectLeave, resetLeaves } = leavesSlice.actions;
export default leavesSlice.reducer;
