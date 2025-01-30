import axios from "axios";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { toast,ToastContainer } from "react-toastify";

export default function OtpVerify() {
    const [otpValue, setOtpValue] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const params = useParams();
    const router = useRouter();

    const handleSubmit = async(e) => {
        setIsLoading(true)
        e.preventDefault();
        // console.log(otpValue)
        try {
            const response = await axios.post("/api/verify-code", {
                username: params.username,
                code: otpValue
            })
            toast.success("OTP verified successfully",{theme:"dark"});
            router.replace("/sign-in");
        } catch (error) {
            setIsLoading(false)
            toast.error(error.response.data.message,{theme:"dark"})
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md p-6 bg-transparent rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-center text-white mb-6">Verify OTP</h2>
            <p className="text-center text-gray-400 mb-6">
                Enter the OTP sent to your email to verify your account.
            </p>
            <form>

                <input
                    type="text"
                    maxLength="6"
                    required
                    className="w-full my-7 py-2 bg-gray-400 text-black text-center text-3xl rounded-md border border-gray-600 focus:ring-2 focus:ring-black"
                    onChange={(e) => {setOtpValue(e.target.value) }}
                />
                <button onClick={handleSubmit}
                    className="bg-gradient-to-br flex items-center justify-center relative group/btn from-black  from-zinc-900  to-zinc-900 to-neutral-600   bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]  shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="submit">
                    {
                    isLoading ? 
                    <span className="flex items-center justify-center gap-3"><Loader2 className="animate-spin" />Loading...</span> 
                    : 
                    "Verify OTP"
                    }
                    <BottomGradient />
                </button>
            </form>
            <ToastContainer theme="dark"/>
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
