import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginApi, getUserProfile, logout as logoutApi } from '../../api/auth';
import { getToken, setToken, removeToken } from '../../utils/request';

// 登录异步action
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: '登录失败' });
    }
  }
);

// 获取用户信息异步action
export const getUserInfoAsync = createAsyncThunk(
  'auth/getUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserProfile();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: '获取用户信息失败' });
    }
  }
);

// 登出异步action
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: '登出失败' });
    }
  }
);

// 身份验证状态切片
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: getToken() || null,
    isAuthenticated: !!getToken(),
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    // 清除错误
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 登录
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        // 保存token到localStorage
        setToken(action.payload.token);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '登录失败';
      })
      // 获取用户信息
      .addCase(getUserInfoAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserInfoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserInfoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || '获取用户信息失败';
      })
      // 登出
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        // 移除localStorage中的token
        removeToken();
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 