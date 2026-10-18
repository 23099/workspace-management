import { createSlice } from '@reduxjs/toolkit';
import { SEED_COMPANY } from '../../data/seedData';

const initialState = {
  ...SEED_COMPANY,
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    updateCompanyProfile: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetCompany: () => ({ ...SEED_COMPANY }),
  },
});

export const { updateCompanyProfile, resetCompany } = companySlice.actions;
export default companySlice.reducer;
