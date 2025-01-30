"use client";
import axios from 'axios';
import { Loader2, X } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'react-toastify';
// import AlertBox from './AlertBox';


const MessageCard = ({ content, date, id, fetchUserMessages }) => {

    const [msgId, setMsgId] = useState("");
    const [isAlertShown, setIsAlertShown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteMessage = async () => {
        try {
            setIsLoading(true);
            const response = await axios.delete(`/api/delete-message/${msgId}`)
            setIsAlertShown(false);
            fetchUserMessages()
            toast.success("Message deleted successfully")
        } catch (error) {
            setIsLoading(false);
            toast.error("Something went wrong")
            console.error(error)
            setIsAlertShown(false);
        } finally {
            setIsLoading(false);
        }
    }

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        // Month names
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        // Get date components
        const month = months[date.getMonth()];
        const day = date.getDate();
        // Add suffix to the day (st, nd, rd, th)
        const daySuffix = (day) => {
            if (day % 10 === 1 && day !== 11) return `${day}st`;
            if (day % 10 === 2 && day !== 12) return `${day}nd`;
            if (day % 10 === 3 && day !== 13) return `${day}rd`;
            return `${day}th`;
        };

        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        return `${month} ${daySuffix(day)} | ${hours}:${minutes}:${seconds}`;
    };

    // Example usage
    // console.log(formatDate(timestamp));
    if (isAlertShown) {
        return (
            <div className="alertBox fixed top-0 left-0 w-screen min-h-screen z-10 backdrop-blur-md flex justify-center items-center">
                <div className="bg-neutral-100 rounded-lg text-black shadow-lg border border-black p-6 w-[400px]">
                    <h2 className="text-2xl font-bold text-gray-800">Alert</h2>
                    <p className="mt-4 text-gray-600 font-bold">Confirm to delete this message this process can't be revertes</p>
                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            disabled={isLoading}
                            className="px-4 py-2 text-white font-semibold border rounded-lg bg-neutral-500"
                            onClick={() => { setIsAlertShown(false) }}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 text-white font-semibold border rounded-lg bg-neutral-500"
                            disabled={isLoading}
                            onClick={() => { handleDeleteMessage() }}
                        >
                            {
                                isLoading ?
                                    (<Loader2 className="animate-spin" />)
                                    : "ok"
                            }
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="bg-white border border-gray-300 rounded-lg shadow-lg max-w-[450px] m-4 overflow-hidden transition-transform transform hover:shadow-xl hover:-translate-y-1 ">
                <div className="bg-gray-100 p-4 border-b flex justify-between border-gray-300">
                    <h2 className="sm:text-xl text-md font-semibold text-gray-800">{formatDate(date)}</h2>
                    <X className='bg-red-500 rounded-full sm:size-7 size-6 p-1 text-white cursor-pointer'
                        onClick={() => { setIsAlertShown(true); setMsgId(id) }}
                    />
                </div>
                <div className="p-4">
                    <p className="sm:text-xl text-md sm:text-black font-semibold">
                        {content}
                    </p>
                </div>
            </div>
        </>
    )
}

export default MessageCard