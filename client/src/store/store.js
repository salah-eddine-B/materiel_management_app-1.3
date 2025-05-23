import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './themeSlice';
import uiReducer from './uiSlice';

const store = configureStore({
  reducer: {
    theme: themeReducer,
    ui: uiReducer
  },
})

export default store
