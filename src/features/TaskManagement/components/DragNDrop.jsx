import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import swal from 'sweetalert';
import axiosCLient from '../../../api/axiosClient';

function DragNDrop({ data, handleEditTask }) {

    const dispatch = useDispatch();

    const [list, setList] = useState(data);

    const [taskChange, setTaskChange] = useState();

    const [dragging, setDragging] = useState(false);

    const [details, setDetails] = useState('');

    const dragItem = useRef();
    const dragNode = useRef();

    useEffect(() => {
        setList(data);
    }, [data])

    useEffect(() => {
        const itemCurrent = dragItem.current;
        if (itemCurrent && list[itemCurrent.grpI].items[itemCurrent.itemI].status !== taskChange.task.status) {
            console.log(dragItem.current)
            axiosCLient.put(`/list-task/${taskChange.id}.json`, taskChange.task)
                .then((res) => console.log(res))
                .catch((err) => console.log(err))
        }
    }, [taskChange, list])

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
                TaskChange.task.status = newList[params.grpI].title;
                setTaskChange(TaskChange);
                newList[params.grpI].items.splice(params.itemI, 0, TaskChange);
                dragItem.current = params;
                return newList;
            })
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

    const handleDoneTask = (e, params) => {
        setList(oldList => {
            let newList = JSON.parse(JSON.stringify(oldList));
            newList[params.grpI].items[params.itemI].task.status = "done";
            const taskDone = newList[params.grpI].items.splice(params.itemI, 1)[0];
            newList[4].items.unshift(taskDone);
            return newList;
        })
    }

    const handleDetailsFeatures = (params) => {
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
                    axiosCLient.delete(`/list-task/${item.id}.json`)
                        .then(() => console.log('oke'))
                        .catch(() => console.log('err'))
                }
            });
    }

    return (
        <div className='list-task'>
            {
                list.length > 0 && list.map((grp, grpI) => (
                    <div
                        className='list-task__group'
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
                                            checked={item.task.status === 'done'}
                                            disabled={item.task.status === 'done'}
                                            onChange={(e) => handleDoneTask(e, { grpI, itemI })}
                                        />
                                        <p className='capitalize font-medium'>{item.task.title}</p>
                                        <div className='relative px-1 ml-auto border border-gray-300 rounded-md transition duration-150shadow cursor-pointer'>
                                            <i className="fas fa-ellipsis-h text-gray-400" onClick={() => handleDetailsFeatures({ grpI, itemI })}></i>
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
                                    <p className='text-sm text-gray-500 text-truncate'>{item.task.description}</p>
                                    <div className='flex items-center gap-2'>
                                        <button className={`btn-status ${item.task.status.replace(/ /g, "")}`}>{item.task.status}</button>
                                        <button className={`btn-status ${item.task.priority}`}>{item.task.priority}</button>
                                    </div>

                                    <p className=' text-sm text-gray-400'>Deadline: {item.task.deadline}</p>
                                </div>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    );
}

export default DragNDrop;