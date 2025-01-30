"use client"
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import messages from '@/messages.json'
import { toast, ToastContainer } from 'react-toastify';

const Page = () => {
  const params = useParams();
  const username = params.username;
  const [message, setMessage] = useState('');
  const [suggestedMessages, setSuggestedMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const SendMessageToUser = async () => {
    if (message.length >= 15) {
      try {
        setIsLoading(true);
        const response = await axios.post(`/api/send-message`,
          {
            username,
            content: message
          }
        )
        // console.log(response)
        setMessage("")
        toast.success(response.data.message);
        defaultMessage()
      } catch (error) {
        setIsLoading(false);
        // console.log(error.response.data.message);
        toast.error(error.response.data.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Message should be atleast 15 characters long");
    }
  }

  const defaultMessage = () => {
    setIsLoading(true);

    let newMessages = [];
    for (let i = 0; i < 7; i++) {
      const randomIndex = Math.floor(Math.random() * messages.suggestedMessage.length);
      const msg = messages.suggestedMessage[randomIndex];
      newMessages.push(msg);
    }

    setSuggestedMessages(newMessages); // Use the state setter to update suggestedMessages
    setTimeout(() => {
      setIsLoading(false);
    }, 1500)
  };

  // this api token for gemini is exhousted so i cant use it, there is an alternative method i have used
  const suggestMessages = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/suggest-messages`);
      if (response) {
        const messages = response.data.suggestedMessage;
        setSuggestedMessages(messages);
        SeperateMessages(messages);
      } else {
        console.log('No response');
      }
    } catch (error) {
      console.log("Your token for this model is exhausted");
    } finally {
      setIsLoading(false);
    }
  };

  const SeperateMessages = (e) => {
    let arr = e.split("||");
    return arr;
  };

  useEffect(() => {
    // Only call defaultMessage if there are no messages
    if (suggestedMessages.length === 0) {
      defaultMessage();
    }
  }, [suggestedMessages]); // This will only run when suggestedMessages changes

  return (
    <div className='min-h-screen flex justify-center bg-white'>
      <div className='sm:w-[80vw] w-[90vw] flex flex-col bg-white'>
        <h1 className='text-3xl font-bold text-center mt-10 '>Public Profile Link</h1>

        <div className='sendMessages flex flex-col gap-3 my-7 bg-white '>
          <span>Send Ghostly message to @{username}</span>
          <textarea
            className='md:w-[60vw] w-full border border-zinc-800 rounded-md p-2'
            name="message"
            id="message"
            required
            minLength={"20"}
            value={message}
            onChange={(e) => { setMessage(e.target.value); }}
          />
          <span>{ }</span>
          <button
            onClick={() => { SendMessageToUser() }}
            disabled={isLoading}
            className='bg-zinc-800 w-fit text-white px-4 py-2 rounded-md border border-black hover:bg-white hover:text-zinc-800 transition-colors'>
            {isLoading ? <Loader2 className="animate-spin size-5" /> : 'Send'}
          </button>
        </div>

        <hr />

        <div className="suggestMessages my-7 flex flex-col gap-3 bg-white">
          <button
            disabled={isLoading}
            className='bg-zinc-800 w-fit text-white px-4 py-2 rounded-md border border-black hover:bg-white hover:text-zinc-800 transition-colors'
            onClick={() => { defaultMessage() }}
          >
            Suggest Messages
          </button>
          <span>Click on any message below to select</span>
          <div className="messagesContainer p-3 border border-zinc-800 rounded-md flex flex-col flex-wrap gap-3 bg-[#dcdcdc]">
            <span className='font-bold text-lg'>Messages : </span>
            {isLoading ? (
              <Loader2 className="animate-spin size-5 text-center" />
            ) :
              suggestedMessages.map((message, index) => (
                <div
                  onClick={() => {
                    setMessage(message);
                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth', // Smooth scroll
                    });
                  }}
                  key={index}
                  className='messageBox p-2 border border-zinc-800 bg-white rounded-md text-center transition-all hover:bg-neutral-800 hover:text-white hover:-translate-y-2 hover:shadow-xl cursor-pointer'>
                  {message}
                </div>
              ))
            }
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Page;
