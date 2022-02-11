import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import DialogCreate from './components/DialogCreateTask';
import DragNDrop from './components/DragNDrop';
import { fetchListTask, listTask } from './reducers/taskReducers';
import './TaskManagement.scss';
import { LIST_GROUP, LIST_PRIORITY } from './constants/Option';
import moment from 'moment';
import { changeSortType, sortType } from './reducers/sortTypeReducers';

function TaskManagement(props) {

    const dispatch = useDispatch();

    const data = useSelector(listTask);

    const SortType = useSelector(sortType);

    const [ListTask, setListTask] = useState(data);

    const [isOpen, setIsOpen] = useState(false)

    const [task, setTask] = useState();

    useEffect(() => {
        dispatch(fetchListTask());
    }, [dispatch, SortType])

    useEffect(() => {
        setListTask(data);
    }, [data])

    const closeModal = () => {
        setIsOpen(false);
        setTask();
    }

    const openModal = () => {
        setTask({
            title: '',
            description: '',
            deadline: moment().format().substring(0, 10),
            priority: 'critical',
            status: 'not started'
        });
        setIsOpen(true);
    }

    const handleEditTask = (item) => {
        setTask(item);
        setIsOpen(true);
    }

    const handleChangeSortBy = (e) => {
        dispatch(changeSortType(e.target.value));
    }

    const EditTask = (item) => {
        console.log(item)
        setListTask(oldList => {
            const newList = oldList.map(task => {
                if (task.id === item.id) return item;
                return task;
            })

            return newList;
        })
    }

    const convertListTask = () => {
        const newOption = LIST_GROUP.map(title => {
            return {
                title: title,
                items: []
            }
        });

        const newList = newOption.map((option, index) => {
            for (const task of ListTask) {
                if (option.title === task.status) {
                    option.items.unshift(task);
                }
            }
            if (option.items.length > 0) {
                option.items.map(item => {
                    for (const option of LIST_PRIORITY) {
                        if (item.priority === option.name) {
                            return { ...item, priority: option.value }
                        }
                    }

                    return item;
                })

            }

            return option;
        })

        return newList;
    }

    return (
        <div className='max-w-screen-xl mx-auto relative'>
            <div className='py-4 border-b border-gray-200 flex items-center justify-between'>
                <h1 className='text-2xl font-medium'>Task Board</h1>
                <div>
                    <div>
                        <select
                            onChange={handleChangeSortBy}
                            value={SortType}
                            className='cursor-pointer px-3 py-1.5 text-base font-normal text-gray-700 bg-white border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                        >
                            <option value="DEFAULT" disabled>Sort by</option>
                            <option value="title">Title</option>
                            <option value="priority">Priority</option>
                            <option value="deadline">Deadline</option>
                        </select>
                        <button
                            onClick={openModal}
                            className='py-1.5 ml-3 px-4 bg-blue-500 rounded text-white font-normal text-base transition ease-in-out duration-200 hover:opacity-75'
                        >
                            <i className="fas fa-plus mr-2"></i>
                            <span>Add Task</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className='mt-3'>
                <DragNDrop data={convertListTask()} handleEditTask={handleEditTask} />
            </div>
            <DialogCreate isOpen={isOpen} closeModal={closeModal} data={task} EditTask={EditTask}/>
        </div>
    );
}

export default TaskManagement;