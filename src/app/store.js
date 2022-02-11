import { configureStore } from '@reduxjs/toolkit';
import listTask from '../features/TaskManagement/reducers/taskReducers';
import sortType from '../features/TaskManagement/reducers/sortTypeReducers';

export const store = configureStore({
    reducer: {
        listTask: listTask,
        sortType: sortType
    },
});
