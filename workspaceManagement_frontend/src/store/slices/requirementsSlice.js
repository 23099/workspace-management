import { createSlice } from '@reduxjs/toolkit';
import { SEED_REQUIREMENTS } from '../../data/seedData';

const initialState = {
  requirements: [...SEED_REQUIREMENTS],
};

const requirementsSlice = createSlice({
  name: 'requirements',
  initialState,
  reducers: {
    addRequirement: (state, action) => {
      // ONLY Manager or Admin can create
      const {
        title,
        organization = 'Zafar Corp',
        clientRepresentative = 'Zafar Ahmed',
        contractDeadline = '2026-11-15',
        initialMilestones = ['System Architecture Sign-Off', 'Alpha Build Release'],
      } = action.payload;

      const newId = `REQ-${Math.floor(100 + Math.random() * 900)}`;
      const milestones = initialMilestones.map((m, idx) => ({
        id: `m_${Date.now()}_${idx}`,
        title: typeof m === 'string' ? m : m.title,
        isCompleted: false,
      }));

      state.requirements.unshift({
        id: newId,
        code: newId,
        title,
        organization,
        clientRepresentative,
        contractDeadline,
        lifecycleState: 'IN_PROGRESS',
        completedMilestones: 0,
        totalMilestones: milestones.length,
        progressPercent: 0,
        milestones,
        privateLinkedTasks: [],
        broadcasts: [
          {
            id: `bc_${Date.now()}`,
            time: 'Just now',
            author: 'Engineering Management',
            content: `Requirement created and scoped for ${organization}. Deliverables scheduled for ${contractDeadline}.`,
          },
        ],
        clarificationReplies: [],
      });
    },
    toggleMilestone: (state, action) => {
      const { reqId, milestoneId } = action.payload;
      const req = state.requirements.find((r) => r.id === reqId);
      if (req) {
        const ms = req.milestones.find((m) => m.id === milestoneId);
        if (ms) {
          ms.isCompleted = !ms.isCompleted;
        }
        const completedCount = req.milestones.filter((m) => m.isCompleted).length;
        req.completedMilestones = completedCount;
        req.totalMilestones = req.milestones.length;
        req.progressPercent = req.totalMilestones > 0
          ? Math.round((completedCount / req.totalMilestones) * 100)
          : 0;
      }
    },
    addMilestone: (state, action) => {
      const { reqId, title } = action.payload;
      const req = state.requirements.find((r) => r.id === reqId);
      if (req && title) {
        req.milestones.push({
          id: `m_${Date.now()}`,
          title,
          isCompleted: false,
        });
        req.totalMilestones = req.milestones.length;
        const completedCount = req.milestones.filter((m) => m.isCompleted).length;
        req.progressPercent = Math.round((completedCount / req.totalMilestones) * 100);
      }
    },
    publishBroadcast: (state, action) => {
      const { reqId, author, content } = action.payload;
      const req = state.requirements.find((r) => r.id === reqId);
      if (req && content) {
        req.broadcasts.unshift({
          id: `bc_${Date.now()}`,
          time: 'Just now',
          author: author || 'Engineering Management',
          content,
        });
      }
    },
    addClientClarificationReply: (state, action) => {
      const { reqId, author, content } = action.payload;
      const req = state.requirements.find((r) => r.id === reqId);
      if (req && content) {
        req.clarificationReplies.unshift({
          id: `cr_${Date.now()}`,
          time: 'Just now',
          author: author || 'Client Representative',
          content,
        });
      }
    },
    updateLifecycleState: (state, action) => {
      const { reqId, lifecycleState } = action.payload;
      const req = state.requirements.find((r) => r.id === reqId);
      if (req) {
        req.lifecycleState = lifecycleState;
      }
    },
    resetRequirements: () => ({ requirements: [...SEED_REQUIREMENTS] }),
  },
});

export const {
  addRequirement,
  toggleMilestone,
  addMilestone,
  publishBroadcast,
  addClientClarificationReply,
  updateLifecycleState,
  resetRequirements,
} = requirementsSlice.actions;

export default requirementsSlice.reducer;
