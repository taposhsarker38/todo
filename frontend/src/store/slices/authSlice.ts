'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/token/`, { username, password });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: any;
}

const initialState: AuthState = {
  token: Cookies.get('token') || null,
  isAuthenticated: !!Cookies.get('token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      Cookies.remove('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access;
        state.isAuthenticated = true;
        Cookies.set('token', action.payload.access, { expires: 1 });
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
