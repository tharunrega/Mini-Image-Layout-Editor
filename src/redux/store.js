import { configureStore } from '@reduxjs/toolkit';
import elementsReducer from './elementsSlice';

const store = configureStore({
  reducer: { elements: elementsReducer }
});

export default store;
