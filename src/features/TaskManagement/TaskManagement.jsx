import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import DialogCreate from './components/DialogCreateTask';
import DragNDrop from './components/DragNDrop';
import { fetchListTask, listTask, updateTask } from './reducers/taskReducers';
import './TaskManagement.scss';
import { LIST_GROUP, LIST_PRIORITY } from './constants/Option';
import moment from 'moment';

function TaskManagement(props) {

    const dispatch = useDispatch();

    const data = useSelector(listTask);

    const [sortType, setSortType] = useState('DEFAULT');

    const [optionSort, setOptionSort] = useState('ASC');

    const [ListTask, setListTask] = useState(data);

    const [isOpen, setIsOpen] = useState(false)

    const [task, setTask] = useState();

    useEffect(() => {
        dispatch(fetchListTask());
    }, [dispatch])

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
        setSortType(e.target.value);
        if (e.target.value !== sortType) dispatch(fetchListTask());
    }

    const EditTask = (item) => {
        setListTask(oldList => {
            const newList = oldList.map(task => {
                if (task.id === item.id) return item;
                return task;
            })

            return newList;
        })
    }

    const checkDeadlineTask = (task) => {
        const today = moment(Date.now()).format().substring(0, 10);
        if (task.deadline < today && task.status !== "done") {
            const newTask = {
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: "delayed",
                deadline: task.deadline
            }
            dispatch(updateTask({ id: task.id, task: newTask }));
            return { ...task, status: "delayed" };
        }
        return task;
    }

    const convertListTask = () => {
        const newOption = LIST_GROUP.map(title => {
            return {
                title: title,
                items: []
            }
        });

        const newList = newOption.map((option, index) => {
            for (let task of ListTask) {
                task = checkDeadlineTask(task);
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

        return sortTask(sortType, newList);
    }


    const sortTask = (type, listTask) => {

        if (type === "title")
            listTask = sortTaskByTitle(listTask);

        if (type === "priority")
            listTask = sortTaskByPriority(listTask);

        if (type === "deadline")
            listTask = sortTaskByDeadline(listTask);
        if (optionSort === "DESC")
            return listTask.map((tasks) => {
                if (tasks.items.length > 0) {
                    tasks.items.reverse();
                    return tasks;
                }
                return tasks
            });
        return listTask;
    }

    const sortTaskByTitle = (listTask) => {
        return listTask.map((tasks) => {
            tasks.items.sort(function (a, b) {
                let titleA = a.title.toUpperCase();
                let titleB = b.title.toUpperCase();
                if (titleA < titleB) {
                    return -1;
                }
                if (titleA > titleB) {
                    return 1;
                }
                return 0;
            });
            return tasks;
        })
    }

    const sortTaskByPriority = (listTask) => {
        return listTask.map((tasks) => {
            tasks.items.sort(function (a, b) {
                let priorityA = a.priority;
                let priorityB = b.priority;
                if (priorityA < priorityB) {
                    return -1;
                }
                if (priorityA > priorityB) {
                    return 1;
                }
                return 0;
            });
            return tasks;
        })
    }

    const sortTaskByDeadline = (listTask) => {
        return listTask.map((tasks) => {
            tasks.items.sort(function (a, b) {
                let deadlineA = a.deadline;
                let deadlineB = b.deadline;
                if (deadlineA < deadlineB) {
                    return -1;
                }
                if (deadlineA > deadlineB) {
                    return 1;
                }
                return 0;
            });
            return tasks;
        })
    }

    return (
        <div className='max-w-screen-xl mx-auto relative'>
            <div className='py-4 border-b border-gray-200 flex items-center justify-between'>
                <h1 className='text-2xl font-medium'>Task Board</h1>
                <div>
                    <div>
                        <select
                            onChange={handleChangeSortBy}
                            value={sortType}
                            className='cursor-pointer px-3 py-1.5 text-base font-normal text-gray-700 bg-white border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                        >
                            <option value="DEFAULT" disabled>Sort by</option>
                            <option value="title">Title</option>
                            <option value="priority">Priority</option>
                            <option value="deadline">Deadline</option>
                        </select>
                        <select
                            onChange={(e) => setOptionSort(e.target.value)}
                            value={optionSort}
                            className='ml-2 cursor-pointer px-3 py-1.5 text-base font-normal text-gray-700 bg-white border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                        >
                            <option value="ASC">ASC</option>
                            <option value="DESC">DESC</option>
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
                <DragNDrop data={convertListTask()} handleEditTask={handleEditTask} sortType={sortType} />
            </div>
            <DialogCreate isOpen={isOpen} closeModal={closeModal} data={task} EditTask={EditTask} />
        </div>
    );
}

export default TaskManagement;