// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './loginSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    login: loginReducer,
    // 다른 리듀서가 있다면 여기에 추가
  },
});

export default store;