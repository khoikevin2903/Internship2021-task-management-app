import { createSlice } from '@reduxjs/toolkit';

const initialState = 'DEFAULT';

export const taskReducers = createSlice({
    name: 'listTask',
    initialState,
    reducers: {
        changeSortType: (state, action) => {
            return action.payload;
        },
    },
    extraReducers: () => {},
});

export const { changeSortType } = taskReducers.actions;

export const sortType = (state) => state.sortType;

export default taskReducers.reducer;
