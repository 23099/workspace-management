import { configureStore } from '@reduxjs/toolkit';
import companyReducer from './slices/companySlice';
import usersReducer from './slices/usersSlice';
import attendanceReducer from './slices/attendanceSlice';
import salaryReducer from './slices/salarySlice';
import leavesReducer from './slices/leavesSlice';
import ticketsReducer from './slices/ticketsSlice';
import tasksReducer from './slices/tasksSlice';
import requirementsReducer from './slices/requirementsSlice';
import announcementsReducer from './slices/announcementsSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    company: companyReducer,
    users: usersReducer,
    attendance: attendanceReducer,
    salary: salaryReducer,
    leaves: leavesReducer,
    tickets: ticketsReducer,
    tasks: tasksReducer,
    requirements: requirementsReducer,
    announcements: announcementsReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
