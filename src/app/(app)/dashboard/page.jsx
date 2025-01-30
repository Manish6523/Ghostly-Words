"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, RefreshCcw, Router } from "lucide-react";
import MessageCard from "@/components/MessageCard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/Switch";
import { Skeleton } from "@/components/Skeleton";
import { toast } from "react-toastify";

export default function MessagesComponent() {

  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;
  // console.log(user)
  
  const [messages, setMessages] = useState([]); // Initial empty state
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isAcceptingMessages, setIsAcceptingMessages] = useState("")
  
  const BaseUrl = `${window.location.protocol}//${window.location.host}`

  const ProfileUrl = `${BaseUrl}/u/${user?.username}`
  // console.log("user Acceptance:--------",isAcceptingMessages)

  const fetchUserMessages = async (id) => {
    try {
      // Set loading state to true
      setIsLoading(true);
      // Make a POST request to the API to get user messages
      const response = await axios.post(`/api/get-messages`);
      setMessages(response.data.messages); // Update state
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAcceptance = async () => {
    try {
      setIsLoading2(true);
      const response = await axios.get(`/api/accept-messages`);
      setIsAcceptingMessages(response.data.isAcceptingMessages)
      // console.log("checking---------", response.data.isAcceptingMessages)
    } catch (error) {
      setIsLoading2(false);
      console.log(error)
    } finally {
      setIsLoading2(false);
    }
  }

  const toggleAcceptance = async () => {
    const response = await axios.post(`/api/accept-messages`, { acceptMessages: !isAcceptingMessages });
    // console.log("toggle---------", response.data.updatedUser.isAcceptingMessages)
    setIsAcceptingMessages(response.data.updatedUser.isAcceptingMessages)
  }

  const CopyUrl = async() => {
    if (navigator.clipboard) {
    await navigator.clipboard.writeText(ProfileUrl)
    toast.success("URL copied to Clipboard")
  }
  }

  useEffect(() => {
    if (!session && !session?.user) {
      router.replace("/")
    }
  }, [router, session])

  useEffect(() => {
    checkAcceptance()
    fetchUserMessages();
  }, []); // Only runs on component mount

  useEffect(() => {
  }, [messages]);

  return (
    <>
      {
        !user ? <Skeleton className={`w-full h-screen bg-zinc-600 rounded-none`} />
          :
          <div className="min-h-screen flex justify-center" >
            <div className="flex flex-col sm:w-[80vw] w-[90vw]">
              <h1 className="text-4xl font-semibold mt-10">
                {user.username}'s Dashboard
              </h1>
              <div className="flex flex-col gap-4 my-4">
                <span className="text-xl">
                  Copy Your Unique Link
                </span>
                <div className="flex flex-wrap sm:gap-16 gap-5">
                  <input className="border sm:w-[50vw] font-semibold w-full rounded-sm p-2"
                    value={ProfileUrl}
                    disabled
                  />
                  <button
                    onClick={CopyUrl}
                    className="bg-neutral-800 hover:bg-neutral-700 border text-white rounded-md font-bold px-4 py-2">Copy</button>
                </div>
                <div className="switch">
                  {
                    isLoading2 ?
                      <Loader2 className="animate-spin size-5 text-black" /> :
                      <Switch
                        isAcceptingMessages={isAcceptingMessages}
                        toggleAcceptance={toggleAcceptance}
                      />
                  }
                </div>
              </div>
              <button
                className="flex justify-center items-center my-5 p-2 w-fit border rounded-sm"
                onClick={fetchUserMessages} >
                <RefreshCcw className="size-5 cursor-pointer" />
              </button>
              <hr className="mb-5" />
              <div className="cardsContainer flex-wrap justify-around flex gap-4 mt-1">
                {
                  messages.length === 0 && !isLoading ?
                    (<p className="text-center text-xl font-semibold">No messages found.</p>) :
                    isLoading ? (<>
                      <Loader2 className="animate-spin size-5 text-black" />
                    </>
                    ) :
                      messages.map((e, index) => {
                        return (
                          <MessageCard key={index} content={e?.content} date={e?.createdAt} id={e?._id} fetchUserMessages={fetchUserMessages} />
                        )
                      }
                      )

                }
              </div>
            </div>
          </div>
      }

    </>

  );
}
