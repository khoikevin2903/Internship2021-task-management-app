import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { LIST_GROUP, LIST_PRIORITY } from '../constants/Option';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { addTask, updateTask } from '../reducers/taskReducers';

function DialogCreate(props) {

    const dispatch = useDispatch();

    const { isOpen, closeModal, data, EditTask, checkEdit } = props;

    const [edit, setEdit] = useState(checkEdit);

    const [err, setErr] = useState(false);

    const schema = yup.object().shape({
        title: yup.string().required(),
        priority: yup.string().required(),
        status: yup.string().required(),
        deadline: yup.date().required().min("2020-01-01").max("2100-01-01"),
        description: yup.string().required(),
    }).required();

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        setEdit(checkEdit);
    }, [checkEdit])

    useEffect(() => {
        if (typeof data !== "undefined" && data !== null) {
            setValue("title", data.title);
            setValue("priority", data.priority);
            setValue("status", data.status);
            setValue("deadline", data.deadline);
            setValue("description", data.description);
        }
    }, [setValue, data, checkEdit])

    const CloseModal = () => {
        reset();
        closeModal();
    }

    const handleEditTask = (e) => {
        e.preventDefault();
        setEdit(true);
    }

    const submitFormLogin = async (task) => {
        if (task.title.trim().length > 0 && task.description.trim().length > 0) {
            const today = moment(Date.now()).format().substring(0, 10);
            if (task.deadline < today) task.status = "delayed";
            if (data.id) {
                const newData = {
                    title: task.title,
                    description: task.description,
                    priority: task.priority,
                    status: task.status,
                    previousStatus: data.previousStatus,
                    deadline: moment(task.deadline).format().substring(0, 10)
                }
                EditTask({ id: data.id, ...task, deadline: moment(task.deadline).format().substring(0, 10) });
                dispatch(updateTask({ id: data.id, task: newData }));
            } else {
                const newData = {
                    ...task,
                    previousStatus: task.previousStatus,
                    deadline: moment(task.deadline).format().substring(0, 10)
                }
                dispatch(addTask(newData));
            }
            setTimeout(() => closeModal(), 0);
        } else setErr(true);

    }

    return (
        <div>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={closeModal}
                >
                    <div className="h-screen w-full">
                        <div className="grid grid-cols-dialogLayout h-full bg-white overflow-auto dialog">
                            <div className="relative flex w-full image">
                                <div className="w-full h-full absolute bg-black opacity-30">
                                </div>
                                <img
                                    className=' object-cover w-full'
                                    src="https://test.coopax.com/img/left-image-for-create-new-event-with-wizard-dialog.7a224fbf.jpeg"
                                    alt="" />
                            </div>

                            <div className="btn-close absolute right-10 top-4 text-gray-600 cursor-pointer hover:text-gray-800 transition duration-300 ease-in-out text-xl"
                                onClick={CloseModal}
                            >
                                <i className="fas fa-times"> </i>
                            </div>

                            <div className="">
                                <form
                                    className="py-10 px-10 shadow max-w-2xl mx-auto mt-20 xl:max-w-3xl form-task"
                                    onSubmit={handleSubmit(submitFormLogin)}
                                >

                                    <Dialog.Title
                                        as="h3"
                                        className="text-2xl font-medium leading-6 text-gray-900 text-center content"
                                    >
                                        Please fill in the details of the task you want to create
                                    </Dialog.Title>

                                    <div className="mt-10 title">
                                        <p className="font-medium mb-2">Title</p>
                                        <input className="focus:ring-indigo-500 focus:border focus:border-indigo-500 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                            disabled={!edit}
                                            placeholder="Enter the title"
                                            type="text"
                                            {...register("title", { onChange: () => setErr(false) })}
                                        />
                                        {errors.title && <span className="text-sm text-red-600 ml-2 tracking-tighter font-semibold">{errors.title.message}</span>}
                                    </div>

                                    <div className="mt-6 grid grid-cols-3 gap-2 xl:gap-4 select-value">
                                        <div>
                                            <p className="font-medium mb-2">Priority</p>
                                            <select
                                                disabled={!edit}
                                                {...register("priority")}
                                                className='cursor-pointer capitalize px-3 w-full py-1.5 text-base font-normal text-gray-700 bg-white border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                                            >
                                                {LIST_PRIORITY.map((option, index) => {
                                                    return (
                                                        <option
                                                            key={index}
                                                            value={option.name}
                                                            className='capitalize'
                                                        >
                                                            {option.name}
                                                        </option>
                                                    )
                                                })}
                                            </select>
                                        </div>

                                        <div>
                                            <p className="font-medium mb-2">Status</p>
                                            <select
                                                disabled={!edit}
                                                {...register("status")}
                                                className='cursor-pointer capitalize w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                                            >
                                                {LIST_GROUP.map((option, index) => {
                                                    return (
                                                        <option
                                                            key={index}
                                                            value={option.name}
                                                            className='capitalize'
                                                        >
                                                            {option.name}
                                                        </option>
                                                    )

                                                })}
                                            </select>
                                        </div>

                                        <div>
                                            <p className="font-medium mb-2">Deadline</p>
                                            <input
                                                disabled={!edit}
                                                {...register("deadline")}
                                                type="date"
                                                className="cursor-pointer w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                            />
                                            {errors.deadline && <span className="text-sm text-red-600 ml-2 tracking-tighter font-semibold">Invalid deadline</span>}
                                        </div>
                                    </div>


                                    <div className='mt-6 description'>
                                        <p className="font-medium mb-2">Description</p>
                                        <textarea
                                            disabled={!edit}
                                            {...register("description", { onChange: () => setErr(false) })}
                                            className='focus:ring-indigo-500 focus:border focus:border-indigo-500 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none'
                                            rows="4"
                                        ></textarea>
                                        {errors.description && <span className="text-sm text-red-600 ml-2 tracking-tighter font-semibold">{errors.description.message}</span>}
                                    </div>
                                    {err && <span className="text-sm text-red-600 ml-2 tracking-tighter font-semibold">Please check the information again</span>}
                                    {!edit ?
                                        <div className="mt-10 flex items-center justify-end">
                                            <button
                                                onClick={handleEditTask}
                                                className="justify-center px-6 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                            >
                                                Edit
                                            </button>
                                        </div> :
                                        <div className="mt-10 flex items-center justify-end">
                                            <button
                                                type="reset"
                                                className="mr-4 justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                            >
                                                Reset
                                            </button>

                                            <button
                                                type="submit"
                                                className="justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                            >
                                                {(data && data.title.length > 0) ? "Save" : "Create Task"}
                                            </button>
                                        </div>
                                    }

                                </form>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition >
        </div>
    );
}

export default DialogCreate;