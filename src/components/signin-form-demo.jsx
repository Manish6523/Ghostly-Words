"use client";

import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react"
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import nextAuth from 'next-auth';
import Link from 'next/link';

export default function SigninFormDemo() {

  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitResponse, setFormSubmitResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(identifier, password)
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: identifier,
        password: password
      })
      // console.log(result)

      if (result?.error) {
        toast.error("Invalid Credentials")
      }
      if (result?.url) {
        router.replace('/dashboard')
      }
    } catch (error) {
      console.error(error)
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 bg-transparent">
      <h2 className="font-bold text-3xl text-neutral-300">Log In • 😱</h2>
      <p className="text-neutral-300 text-md max-w-sm mt-5">
        Log in to GhostlyWords and uncover the mystery! 👻
      </p>
      <form className="my-5" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label className="text-neutral-300 font-bold" htmlFor="email">
            Username or Email
          </Label>
          <Input
            className="bg-[#27272a] border-0 text-white"
            id="email"
            value={identifier}
            placeholder="adam / mail@gmail"
            type="text"
            required
            onChange={(e) => {
              setIdentifier(e.target.value);
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
          {isLoading ? <span className="flex gap-3 items-center justify-center"><Loader2 className="animate-spin h-5 w-5" />Loading...</span> : "Log In"}
          <BottomGradient />
        </button>
      </form>
      <div className="text-center mt-4">
        <p className="text-neutral-300">
          Doesn't have an account ?{" "}
          <Link href="/sign-up" className="text-blue-500 hover:text-blue-400">
            Sign Up
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
