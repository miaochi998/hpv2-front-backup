import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginApi, getUserProfile, logout as logoutApi } from '../../api/auth';

// Token处理
const TOKEN_KEY = 'auth_token';

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    return true;
  }
  return false;
};

const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// 登录异步action
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      
      if (response && response.code === 200 && response.data) {
        const { token, user_info } = response.data;
        
        // 保存token
        if (token && setToken(token)) {
          // 登录成功后自动获取用户信息
          if (!user_info) {
            dispatch(getUserInfoAsync());
          }
          return response.data;
        } else {
          throw new Error('登录失败，无法保存Token');
        }
      } else {
        throw new Error(response?.message || '登录失败，响应格式错误');
      }
    } catch (error) {
      // 登录失败，确保清除token
      removeToken();
      return rejectWithValue(error.message || '登录失败，请检查用户名和密码');
    }
  }
);

// 获取用户信息
export const getUserInfoAsync = createAsyncThunk(
  'auth/getUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserProfile();
      
      if (response && response.code === 200 && response.data) {
        return response.data;
      } else {
        throw new Error(response?.message || '获取用户信息失败');
      }
    } catch (error) {
      return rejectWithValue(error.message || '获取用户信息失败');
    }
  }
);

// 登出
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      removeToken();
      return true;
    } catch (error) {
      // 即使API失败也清除本地token
      removeToken();
      return rejectWithValue(error.message || '登出失败');
    }
  }
);

// 初始状态
const initialToken = getToken();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: initialToken,
    isAuthenticated: !!initialToken,
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // 调试登录
    debugLogin: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user_info;
      setToken(action.payload.token);
    },
    // 手动清除认证状态
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = null;
      removeToken();
    }
  },
  extraReducers: (builder) => {
    builder
      // 登录处理
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        
        if (action.payload.user_info) {
          state.user = action.payload.user_info;
        }
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = action.payload || '登录失败';
      })
      
      // 获取用户信息处理
      .addCase(getUserInfoAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserInfoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserInfoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || '获取用户信息失败';
        
        // 如果获取用户信息失败且状态码为401，清除认证状态
        if (action.error?.message?.includes('401')) {
          state.isAuthenticated = false;
          state.token = null;
          removeToken();
        }
      })
      
      // 登出处理
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state) => {
        // 即使登出API失败，也清除本地认证状态
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.error = null;
      });
  },
});

export const { clearError, debugLogin, clearAuth } = authSlice.actions;
export default authSlice.reducer; 