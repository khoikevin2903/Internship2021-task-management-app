import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import axiosCLient from '../../../api/axiosClient';
import { LIST_GROUP, LIST_PRIORITY } from '../constants/Option';
// import swal from 'sweetalert'

function DialogCreate(props) {

    const { isOpen, closeModal, task } = props;

    const [Task, setTask] = useState(task);

    useEffect(() => {
        if (typeof task !== "undefined") {
            // setTask({
            //     id: task ? Object.keys(task)[0] : "",
            //     task: task ? Object.values(task)[0] : ""
            // })
            setTask(task);
        }
    }, [task])

    const schema = yup.object().shape({
        title: yup.string().required(),
        priority: yup.string().required(),
        status: yup.string().required(),
        deadline: yup.string().required(),
        description: yup.string().required(),
    }).required();

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (typeof Task !== "undefined") {
            setValue("title", Task.title);
            setValue("priority", Task.priority);
            setValue("status", Task.status);
            setValue("deadline", Task.deadline);
            setValue("description", Task.description);
        }
    }, [Task, setValue])

    const CloseModal = () => {
        reset();
        closeModal();
    }

    const submitFormLogin = (data) => {
        const item =
        {
            title: 'marketing & sales 9',
            description: 'Increase conversion on our landing page',
            deadline: '2021-01-21',
            priority: 'high',
            status: 'done'

        }

        axiosCLient.post("/list-task.json", item)
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
                        <div className="grid grid-cols-dialogLayout h-full bg-white overflow-auto">
                            <div className="relative flex w-full">
                                <div className="w-full h-full absolute bg-black opacity-30">
                                </div>
                                <img
                                    className=' object-cover w-full'
                                    src="https://test.coopax.com/img/left-image-for-create-new-event-with-wizard-dialog.7a224fbf.jpeg"
                                    alt="" />
                            </div>

                            <div className="absolute right-10 top-4 text-gray-600 cursor-pointer hover:text-gray-800 transition duration-300 ease-in-out text-xl"
                                onClick={CloseModal}
                            >
                                <i className="fas fa-times"> </i>
                            </div>

                            <div className="">
                                <form
                                    className="py-10 px-10 shadow max-w-2xl mx-auto mt-20 xl:max-w-3xl"
                                    onSubmit={handleSubmit(submitFormLogin)}
                                >

                                    <Dialog.Title
                                        as="h3"
                                        className="text-2xl font-medium leading-6 text-gray-900 text-center"
                                    >
                                        Please fill in the details of the task you want to create
                                    </Dialog.Title>

                                    <div className="mt-10">
                                        <p className="font-medium mb-2">Title</p>
                                        <input className="focus:ring-indigo-500 focus:border focus:border-indigo-500 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                            placeholder="Enter the title"
                                            type="text"
                                            {...register("title")}
                                        />
                                        {errors.title && <span className="text-sm text-red-600 ml-2 tracking-tighter font-semibold">{errors.title.message}</span>}
                                    </div>

                                    <div className="mt-6 grid grid-cols-3 gap-2 xl:gap-4">
                                        <div>
                                            <p className="font-medium mb-2">Priority</p>
                                            <select
                                                {...register("priority")}
                                                className='cursor-pointer capitalize px-3 w-full py-1.5 text-base font-normal text-gray-700 bg-white border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                                            >
                                                {LIST_PRIORITY.map((option, index) => {
                                                    return (
                                                        <option
                                                            key={index}
                                                            value={option}
                                                            className='capitalize'
                                                        >
                                                            {option}
                                                        </option>
                                                    )
                                                })}
                                            </select>
                                        </div>

                                        <div>
                                            <p className="font-medium mb-2">Status</p>
                                            <select
                                                {...register("status")}
                                                className='cursor-pointer capitalize w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
                                            >
                                                {LIST_GROUP.map((option, index) => {
                                                    return (
                                                        <option
                                                            key={index}
                                                            value={option}
                                                            className='capitalize'
                                                        >
                                                            {option}
                                                        </option>
                                                    )

                                                })}
                                            </select>
                                        </div>


                                        <div>
                                            <p className="font-medium mb-2">Deadline</p>
                                            <input
                                                {...register("deadline")}
                                                type="date"
                                                className="cursor-pointer w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                            />
                                        </div>
                                    </div>


                                    <div className='mt-6'>
                                        <p className="font-medium mb-2">Description</p>
                                        <textarea
                                            {...register("description")}
                                            className='focus:ring-indigo-500 focus:border focus:border-indigo-500 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none'
                                            rows="4"
                                        ></textarea>
                                    </div>

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
                                            {typeof music !== "undefined" ? "Save" : "Create Task"}
                                        </button>
                                    </div>
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