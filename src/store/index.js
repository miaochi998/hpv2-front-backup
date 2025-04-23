import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

// 创建Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    // 其他reducer将在后续添加
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store; 