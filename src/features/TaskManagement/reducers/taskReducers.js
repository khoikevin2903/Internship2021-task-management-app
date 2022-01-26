import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosCLient from '../../../api/axiosClient';

const initialState = [];

export const fetchListTask = createAsyncThunk('task/fetchList', async (config) => {
    const response = await axiosCLient.get(config);
    return response;
});

export const taskReducers = createSlice({
    name: 'listTask',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchListTask.fulfilled, (state, action) => {
                state = action.payload;
                return state;
            });
    },
});

// export const { } = taskReducers.actions;

export const listTask = (state) => state.listTask;

export default taskReducers.reducer;
