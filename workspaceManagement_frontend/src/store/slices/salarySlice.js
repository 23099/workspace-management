import { createSlice } from '@reduxjs/toolkit';
import { SEED_SALARY_CONFIG } from '../../data/seedData';

const initialState = {
  ...SEED_SALARY_CONFIG,
};

const salarySlice = createSlice({
  name: 'salary',
  initialState,
  reducers: {
    updateCompanySalaryConfig: (state, action) => {
      state.companyWide = {
        ...state.companyWide,
        ...action.payload,
      };
    },
    updateEmployeeSalaryOverride: (state, action) => {
      const { userId, config } = action.payload;
      state.overrides[userId] = {
        ...(state.overrides[userId] || state.companyWide),
        ...config,
      };
    },
    resetSalary: () => ({ ...SEED_SALARY_CONFIG }),
  },
});

export const { updateCompanySalaryConfig, updateEmployeeSalaryOverride, resetSalary } = salarySlice.actions;
export default salarySlice.reducer;
