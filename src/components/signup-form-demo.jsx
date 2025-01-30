"use client";

import { useRouter } from 'next/navigation';
import React, { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import axios from "axios";
import { debounce } from "lodash";
import { Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import Link from 'next/link';

export default function SignupFormDemo() {

  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitResponse, setFormSubmitResponse] = useState("");

  const checkUsernameAvailability = async (username) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/check-username-unique?username=${username}`);
      setResponse(response.data);
      // console.log(response.data)
    } catch (err) {
      setResponse(err.response.data);
      toast.error(err.response.data.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a debounced version of the function
  const debouncedCheckUsername = useRef(
    debounce((value) => checkUsernameAvailability(value), 500)
  ).current;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/sign-up`, { username, email, password });
      setFormSubmitResponse(response.data);
      toast.success("Account Created Successfully, Please Verify Your Email");
      router.replace(`/verify/${username}`);
    } catch (err) {
      toast.error(err.response.data.message);
      // console.log(err);
      setFormSubmitResponse(err.response.data);
      setIsLoading(false)
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 bg-transparent">
      <h2 className="font-bold text-3xl text-neutral-300">Sign Up 👻</h2>
      <p className="text-neutral-300 text-md max-w-sm mt-5">
        Sign up for GhostlyWords and start sharing mysterious messages! ✨
      </p>
      <form className="my-5" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label className="text-neutral-300 font-bold" htmlFor="username">
              Username
            </Label>
            <Input
              className="bg-[#27272a] border-0 text-white"
              id="firstname"
              value={username}
              minLength="2"
              placeholder="Enter Username"
              type="text"
              onChange={(e) => {
                setUsername(e.target.value);
                debouncedCheckUsername(e.target.value);
              }}
            />
            {username.length > 0 && <p className={`text-${response.success ? "green" : "red"}-500`}>{response.message}</p>}
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label className="text-neutral-300 font-bold" htmlFor="email">
            Email Address
          </Label>
          <Input
            className="bg-[#27272a] border-0 text-white"
            id="email"
            value={email}
            placeholder="mail@gmail.com"
            type="email"
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label className="text-neutral-300 font-bold" htmlFor="password">
            Password
          </Label>
          <Input
            className="bg-[#27272a] border-0 text-white"
            id="password"
            value={password}
            placeholder="••••••••"
            type="password"
            required
            minLength="8"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </LabelInputContainer>

        <button disabled={isLoading}
          className="bg-gradient-to-br flex items-center justify-center relative group/btn from-black  from-zinc-900  to-zinc-900 to-neutral-600   bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]  shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit">
          {isLoading ? <span className="flex gap-3 items-center justify-center"><Loader2 className="animate-spin h-5 w-5" />Loading...</span> : "Sign up"}
          <BottomGradient />
        </button>
      </form>
      <div className="text-center mt-4">
        <p className="text-neutral-300">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-blue-500 hover:text-blue-400">
            Sign in
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;
};
