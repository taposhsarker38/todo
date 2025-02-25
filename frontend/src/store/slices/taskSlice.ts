'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: any;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, thunkAPI) => {
  try {
    const response = await api.get('/tasks/');
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (task: { title: string; description: string }, thunkAPI) => {
    try {
      const response = await api.post('/tasks/', task);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, task }: { id: number; task: Partial<Task> }, thunkAPI) => {
    try {
      const response = await api.put(`/tasks/${id}/`, task);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: number, thunkAPI) => {
  try {
    await api.delete(`/tasks/${id}/`);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
