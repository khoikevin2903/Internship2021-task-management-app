import { configureStore } from '@reduxjs/toolkit';
import listTask from '../features/TaskManagement/reducers/taskReducers';

export const store = configureStore({
    reducer: {
        listTask: listTask,
    },
});
