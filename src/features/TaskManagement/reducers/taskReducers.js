import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { db } from '../../../firebase-config';
import {
    collection,
    getDocs,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    orderBy,
} from 'firebase/firestore';

const initialState = [];

const listTasksCollectionRef = collection(db, 'list-task');

export const fetchListTask = createAsyncThunk('task/fetchList', async () => {
    const response = await getDocs(listTasksCollectionRef);
    return response.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
});

export const addTask = createAsyncThunk('task/addTask', async (task) => {
    await addDoc(listTasksCollectionRef, { ...task });
    return task;
});

export const updateTask = createAsyncThunk('task/updateTask', async (params) => {
    const taskDoc = doc(db, 'list-task', params.id);
    await updateDoc(taskDoc, { ...params.task });
});

export const deleteTask = createAsyncThunk('task/deleteTask', async (id) => {
    const taskDoc = doc(db, 'list-task', id);
    await deleteDoc(taskDoc);
});

export const taskReducers = createSlice({
    name: 'listTask',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(fetchListTask.fulfilled, (state, action) => {
                state = action.payload;
                console.log(action.payload);
                return state;
            })

            .addCase(addTask.fulfilled, (state, action) => {
                const newTask = action.payload;
                state.push(newTask);
            });
    },
});

// export const { } = taskReducers.actions;

export const listTask = (state) => state.listTask;

export default taskReducers.reducer;
