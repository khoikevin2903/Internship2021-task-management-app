import React from 'react';
import { Route, Routes } from 'react-router-dom';
import TaskManagement from './features/TaskManagement/TaskManagement';

function App() {
    return (
        <div>
            <Routes>
                <Route path="/task-management" element={<TaskManagement />}></Route>
            </Routes>
        </div>
    );
}

export default App;
