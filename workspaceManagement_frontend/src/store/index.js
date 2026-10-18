import { configureStore } from '@reduxjs/toolkit';
import companyReducer from './slices/companySlice';
import attendanceReducer from './slices/attendanceSlice';
import salaryReducer from './slices/salarySlice';
import leavesReducer from './slices/leavesSlice';
import ticketsReducer from './slices/ticketsSlice';
import tasksReducer from './slices/tasksSlice';
import requirementsReducer from './slices/requirementsSlice';

export const store = configureStore({
  reducer: {
    company: companyReducer,
    attendance: attendanceReducer,
    salary: salaryReducer,
    leaves: leavesReducer,
    tickets: ticketsReducer,
    tasks: tasksReducer,
    requirements: requirementsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
