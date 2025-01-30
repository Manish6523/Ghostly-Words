"use client";
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Skeleton } from './skeleton';

const Navbar = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { data: session } = useSession();
    const user = session?.user;
    return (
        <nav className='bg-white shadow-xl border border-b-black text-black p-2 flex justify-between sm:px-16 px-3 items-center'>
                <a href={window.location.protocol+'//'+window.location.host+'/'}><img className='invert h-[50px]' draggable={false} src="./icon-2.png" alt="" /></a>
                {session ? (
                    user ? 
                    <div className='flex items-center md:gap-14 gap-5'>
                        <button
                            className='bg-white text-black hover:bg-black hover:text-white sm:text-lg border border-black text-sm  font-semibold sm:px-6 px-4 py-2 rounded-md cursor-pointer transition-all duration-300 ease-in-out'
                            onClick={() => signOut()}
                        >
                            Logout
                        </button>
                    </div> : <Skeleton className={`w-40 h-10 bg-gray-500`} />
                ) : (
                    <Link href={'/sign-in'}
                    className='bg-white text-black hover:bg-black hover:text-white sm:text-lg border border-black text-sm  font-semibold sm:px-6 px-4 py-2 rounded-md cursor-pointer transition-all duration-300 ease-in-out'
                    onClick={() => {setIsLoading(true);}}>
                        {isLoading  ? <><Loader2 className='animate-spin size-5 text-black font-bold' /></>: 'Sign In'}
                    </Link>
                )}
        </nav>
    );
};

export default Navbar;
