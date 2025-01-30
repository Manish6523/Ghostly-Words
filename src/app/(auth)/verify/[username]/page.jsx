"use client"
import OtpVerify from '@/components/otp-page'
import React from 'react'

const page = () => {
    return (
        <div className='bg-gradient-to-r from-[#27272a] via-black to-[#27272a] min-h-screen  flex justify-center items-center'>
            <OtpVerify />
        </div>
    )
}

export default page