import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  darkMode: false,
  isMinimised: false,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    toggleMinimised: (state) => {
      state.isMinimised = !state.isMinimised;
    },
  },
});

export const { toggleDarkMode, toggleMinimised } = themeSlice.actions;

export default themeSlice.reducer;
