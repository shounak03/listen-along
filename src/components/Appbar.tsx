// 'use client';


// import { Link, Music } from 'lucide-react';
// import { signIn, signOut, useSession } from 'next-auth/react'
// import React from 'react'
// import { Button } from './ui/button';

// function Appbar() {
//     const session = useSession();
//     return (
        
//         <header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-800">
            
//             <Link className="flex items-center justify-center" href="#" >
//                 <Music className="h-6 w-6 text-purple-500" />
//                 <span className="ml-2 text-2xl font-bold text-purple-500">muSpace</span>
//             </Link>

//             <nav className="ml-auto flex gap-4 sm:gap-6">

//                 <Link className="text-sm font-medium hover:text-purple-400 transition-colors" href="#">
//                     About
//                 </Link>
//                 {session.data?.user &&
//                     <Button type="submit" className="bg-purple-600 text-white hover:bg-purple-700" onClick={() => signIn()}>Logout</Button>
//                 }
//                 {!session.data?.user &&
//                     <Button type="submit" className="bg-purple-600 text-white hover:bg-purple-700" onClick={() => signIn()} >SignIn</Button>
//                 }

//             </nav>
//         </header>
//     )
// }

// export default Appbar

'use client';

import { Link as LucideLink, Music } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'
import { Button } from './ui/button';
import Link from 'next/link';

function Appbar() {
    const { data: session, status } = useSession();
    const isLoading = status === "loading";

    return (
        <header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-800">
            <Link className="flex items-center justify-center" href="/" >
                <Music className="h-6 w-6 text-purple-500" />
                <span className="ml-2 text-2xl font-bold text-purple-500">muSpace</span>
            </Link>

            <nav className="ml-auto flex gap-4 sm:gap-6">
                <Link className="text-sm font-medium hover:text-purple-400 transition-colors mt-2" href="#">
                    About
                </Link>
                {!isLoading && (
                    session ? (
                        <Button type="button" className="bg-purple-600 text-white hover:bg-purple-700" onClick={() => signOut()}>Logout</Button>
                    ) : (
                        <Button type="button" className="bg-purple-600 text-white hover:bg-purple-700" onClick={() => signIn()}>Sign In</Button>
                    )
                )}
            </nav>
        </header>
    )
}

export default Appbar