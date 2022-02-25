import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import swal from 'sweetalert';
import { deleteTask, updateTask } from '../reducers/taskReducers';

function DragNDrop({ data, handleEditTask }) {

    const dispatch = useDispatch();

    const [showTaskCompleted, setShowTaskCompleted] = useState(true);

    const [list, setList] = useState(data);

    const [taskChange, setTaskChange] = useState();

    const [dragging, setDragging] = useState(false);

    const [details, setDetails] = useState('');

    const [filter, setFilter] = useState("DEFAULT");

    const dragItem = useRef();
    const dragNode = useRef();

    useEffect(() => {
        setList(data);
    }, [data])

    useEffect(() => {
        if (dragItem.current) {
            const newTask = {
                title: taskChange.title,
                status: taskChange.status,
                description: taskChange.description,
                priority: taskChange.priority,
                deadline: taskChange.deadline
            }
            dispatch(updateTask({ id: taskChange.id, task: newTask }));
        }
    }, [taskChange, list, dispatch])

    const changeShowTaskCompleted = () => {
        if (parseInt(filter) === 4 && showTaskCompleted) {
            setFilter(-1);
        }
        setShowTaskCompleted(!showTaskCompleted);
    }

    const handleDragStart = (e, params) => {
        dragItem.current = params;
        dragNode.current = e.target;
        dragNode.current.addEventListener('dragend', handleDragEnd)
        setTimeout(() => {
            setDragging(true);
        }, 0)
    }

    const handleDragEnter = (e, params) => {
        const currentItem = dragItem.current;
        if (e.target !== dragNode.current) {
            setList(oldList => {
                let newList = JSON.parse(JSON.stringify(oldList));
                const TaskChange = newList[currentItem.grpI].items.splice(currentItem.itemI, 1)[0];
                TaskChange.status = newList[params.grpI].title;
                newList[params.grpI].items.splice(params.itemI, 0, TaskChange);
                dragItem.current = params;
                setTaskChange(TaskChange);
                return newList;
            });
        }
    }

    const handleDragEnd = () => {
        setDragging(false);
        dragNode.current.removeEventListener('dragend', handleDragEnd);
        dragItem.current = null;
        dragNode.current = null;
    }

    const getStyle = (params) => {
        const currentItem = dragItem.current;
        if (currentItem.grpI === params.grpI && currentItem.itemI === params.itemI) {
            return 'current list-task__group__item';
        }
        return 'list-task__group__item';

    }

    const DoneTask = (e, params) => {
        setList(oldList => {
            let newList = JSON.parse(JSON.stringify(oldList));
            let taskDone;
            if (newList[params.grpI].items[params.itemI].status === 'done') {
                newList[params.grpI].items[params.itemI].status = 'not started';
                taskDone = newList[params.grpI].items.splice(params.itemI, 1)[0];
                newList[0].items.unshift(taskDone);
            } else {
                newList[params.grpI].items[params.itemI].status = "done";
                taskDone = newList[params.grpI].items.splice(params.itemI, 1)[0];
                newList[4].items.unshift(taskDone);
            }
            const newTask = {
                title: taskDone.title,
                status: taskDone.status,
                description: taskDone.description,
                priority: taskDone.priority,
                deadline: taskDone.deadline
            }
            dispatch(updateTask({ id: taskDone.id, task: newTask }));
            return newList;
        })
    }

    const DetailsFeatures = (params) => {
        const newOption = `${params.grpI}-${params.itemI}`
        if (details.length > 0 && details === newOption)
            setDetails('');
        else
            setDetails(newOption);
    }

    const EditTask = (item) => {
        setDetails('');
        handleEditTask(item);
    }

    const DeleteTask = (item, params) => {
        setDetails('');
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to restore it!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    setList(oldList => {
                        let newList = JSON.parse(JSON.stringify(oldList));
                        newList[params.grpI].items.splice(params.itemI, 1);
                        return newList;
                    })
                    swal("Poof! Your task has been deleted!", {
                        icon: "success",
                    });
                    dispatch(deleteTask(item.id));
                }
            });
    }

    const ChangeFilter = (e) => {
        if (!showTaskCompleted && parseInt(e.target.value) === 4) {
            setFilter(e.target.value);
            setShowTaskCompleted(!showTaskCompleted);
        }
        else setFilter(e.target.value);

    }

    return (
        <div>
            <div className='ml-auto flex justify-between mb-3'>
                <label className="relative right-0 inline-flex items-center mb-2 cursor-pointer">
                    <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 cursor-pointer"
                        checked={!showTaskCompleted}
                        onChange={() => changeShowTaskCompleted()}
                    />
                    <span className="ml-2 text-base">Incompleted task only</span>
                </label>

                <select
                    onChange={ChangeFilter}
                    value={filter}
                    className='cursor-pointer px-3 py-1.5 text-base font-normal text-gray-700 bg-white border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                >
                    <option value="DEFAULT" disabled>Filter</option>
                    <option value="-1">All</option>
                    <option value="0">Not Started</option>
                    <option value="1">Pending</option>
                    <option value="2">In Progress</option>
                    <option value="3">Delayed</option>
                    <option value="4">Done</option>
                </select>
            </div>


            <div className='list-task'>


                {
                    list.length > 0 && list.map((grp, grpI) => (
                        <div
                            className={`list-task__group ${(grpI === 4 && !showTaskCompleted && filter !== 4) ? 'hidden' : ''} 
                            ${(filter === "DEFAULT" || parseInt(filter) === -1 || parseInt(filter) === grpI) ? '' : 'opacity-30'}`
                            }
                            key={grpI}
                            onDragEnter={dragging && !grp.items.length ? (e) => handleDragEnter(e, { grpI, itemI: 0 }) : null}
                        >
                            <h2 className='list-task__group__title'>{grp.title}</h2>
                            {
                                grp.items.map((item, itemI) => (
                                    <div
                                        draggable
                                        onDragStart={(e) => { handleDragStart(e, { grpI, itemI }) }}
                                        onDragEnter={dragging ? (e) => { handleDragEnter(e, { grpI, itemI }) } : null}
                                        className={`shadow px-3 cursor-pointer py-1 hover:scale-105 flex flex-col justify-around ${dragging ? getStyle({ grpI, itemI }) : 'list-task__group__item'}`}
                                        key={itemI}
                                        title='Task details'
                                    >
                                        <div className='flex items-center'>
                                            <input
                                                type="checkbox"
                                                className='h-6 mr-2 rounded-xl cursor-pointer'
                                                checked={item.status === 'done'}
                                                onChange={(e) => DoneTask(e, { grpI, itemI })}
                                            />
                                            <p className='capitalize font-medium title mr-1'>{item.title}</p>
                                            <div className='relative px-1 ml-auto border border-gray-300 rounded-md transition duration-150shadow cursor-pointer'>
                                                <i className="fas fa-ellipsis-h text-gray-400" onClick={() => DetailsFeatures({ grpI, itemI })}></i>
                                                {
                                                    (details === `${grpI}-${itemI}`) &&
                                                    <div className="absolute top-8 z-10 w-24 right-0 rounded shadow-lg bg-white ring-1 focus:outline-none">
                                                        <div className="divide-y divide-fuchsia-300">
                                                            <p className="text-gray-700 block px-2 py-1 hover:bg-blue-400 hover:text-white transition duration-150 ease-in-out cursor-pointer"
                                                                onClick={() => EditTask(item)}
                                                            >Edit
                                                            </p>
                                                            <p className="text-gray-700 block px-2 py-1 hover:bg-blue-400 hover:text-white transition duration-150 ease-in-out cursor-pointer"
                                                                onClick={() => DeleteTask(item, { grpI, itemI })}
                                                            >Delete</p>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <p className='text-sm text-gray-500 description'>{item.description}</p>
                                        <div className='flex items-center gap-2'>
                                            <button className={`btn-status ${item.status.replace(/ /g, "")}`}>{item.status}</button>
                                            <button className={`btn-priority ${item.priority}`}>{item.priority}</button>
                                        </div>

                                        <p className=' text-sm text-gray-400'>Deadline: {item.deadline}</p>
                                    </div>
                                ))
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default DragNDrop;