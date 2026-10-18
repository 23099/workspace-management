import { createSlice } from '@reduxjs/toolkit';
import { SEED_TASKS } from '../../data/seedData';

const initialState = {
  tasks: [...SEED_TASKS],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    createTask: (state, action) => {
      const {
        title,
        description,
        assignedToId,
        assignedToName,
        requirementId,
        priority = 'MEDIUM',
        internalDeadline,
        clientDeadline = '2026-10-25',
      } = action.payload;

      const intDate = new Date(internalDeadline);
      const cliDate = new Date(clientDeadline);
      const diffMs = cliDate.getTime() - intDate.getTime();
      const bufferDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      const hasConflict = bufferDays < 0;

      const newTask = {
        id: `TSK-${Math.floor(400 + Math.random() * 500)}`,
        code: `#TSK-${Math.floor(400 + Math.random() * 500)}`,
        title,
        description: description || 'Task assigned by Engineering Manager',
        assignedToId,
        assignedToName,
        requirementId,
        priority,
        internalDeadline,
        clientDeadline,
        bufferDays,
        hasConflict,
        conflictDetails: hasConflict
          ? `${title} • ${Math.abs(bufferDays)}d slack • Internal Employee Due: ${internalDeadline} vs External Client Due: ${clientDeadline}`
          : null,
        status: 'TO_DO',
        progressPercent: 0,
        logs: [
          {
            time: 'Just now',
            note: 'Task created and assigned by Engineering Manager.',
          },
        ],
      };

      state.tasks.unshift(newTask);
    },
    updateTaskStatus: (state, action) => {
      const { taskId, status, progressPercent, note } = action.payload;
      const task = state.tasks.find((t) => t.id === taskId);
      if (task) {
        if (status) task.status = status;
        if (progressPercent !== undefined) task.progressPercent = progressPercent;
        if (note) {
          task.logs.unshift({
            time: 'Just now',
            note,
          });
        }
      }
    },
    addTaskLog: (state, action) => {
      const { taskId, note } = action.payload;
      const task = state.tasks.find((t) => t.id === taskId);
      if (task && note) {
        task.logs.unshift({
          time: 'Just now',
          note,
        });
      }
    },
    rescheduleTask: (state, action) => {
      const { taskId, internalDeadline, clientDeadline } = action.payload;
      const task = state.tasks.find((t) => t.id === taskId);
      if (task) {
        if (internalDeadline) task.internalDeadline = internalDeadline;
        if (clientDeadline) task.clientDeadline = clientDeadline;

        const intDate = new Date(task.internalDeadline);
        const cliDate = new Date(task.clientDeadline);
        const diffMs = cliDate.getTime() - intDate.getTime();
        task.bufferDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        task.hasConflict = task.bufferDays < 0;
        task.conflictDetails = task.hasConflict
          ? `${task.title} • ${Math.abs(task.bufferDays)}d slack • Internal Employee Due: ${task.internalDeadline} vs External Client Due: ${task.clientDeadline}`
          : null;
        task.logs.unshift({
          time: 'Just now',
          note: `Manager rescheduled task. New Internal Due: ${task.internalDeadline}`,
        });
      }
    },
    resetTasks: () => ({ tasks: [...SEED_TASKS] }),
  },
});

export const { createTask, updateTaskStatus, addTaskLog, rescheduleTask, resetTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
