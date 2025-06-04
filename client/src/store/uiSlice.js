import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activePage: 'Overview',
  currentFilter: 'TOUT',
  pageInfo: {
    'Overview': {
      title: 'Overview',
      subtitle: 'Dashboard and summary of materials management',
      icon: 'dashboard'
    },
    'Materials': {
      title: 'Materials',
      subtitle: 'Manage and organize all materials',
      icon: 'inventory'
    },
    'Files': {
      title: 'Files',
      subtitle: 'Access and manage related documents',
      icon: 'folder'
    }
  }
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActivePage: (state, action) => {
      state.activePage = action.payload;
    },
    setCurrentFilter: (state, action) => {
      state.currentFilter = action.payload;
    }
  }
});

export const { setActivePage, setCurrentFilter } = uiSlice.actions;
export default uiSlice.reducer; 