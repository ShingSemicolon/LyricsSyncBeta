"use client";
import LyricsController from "@/app/LyricsController";
import { useRouter } from 'next/router';
import "@/app/globals.css";
import parseSong from "@/app/parseSong";
import { useEffect } from "react";

// Vídeo de <a href="https://pixabay.com/es/users/tommyvideo-3092371/?utm_source=link-attribution&utm_medium=referral&utm_campaign=video&utm_content=5180">Tomislav Jakupec</a> de <a href="https://pixabay.com/es//?utm_source=link-attribution&utm_medium=referral&utm_campaign=video&utm_content=5180">Pixabay</a>
const PlaySong = () => {
    const router = useRouter();
   let { id } = router.query;

    if(!router.isReady) return;
   if(!id) {
     return (<meta httpEquiv="refresh" content={`0;URL=/`} />)
    
    }
    if (Array.isArray(id)) {
      id = id[0].toString();
    }

  return (
    <main className="flex  flex-col gap-3 min-h-screen align-middle p-3 sm:p-5">
      <header>
        <div className="flex gap-3 px-5 py-3 border-white border-[1px] rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="fill-white" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50">
<path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>
</svg>
          <input className="bg-transparent focus:outline-none" type="text" placeholder="Search..." />
        </div>
      </header>

      {/* <section> */}
        {/* <div>
        <h1 className="text-3xl font-bold">Search Results</h1>
        <p className="text-gray-500">No results found</p>
        </div> */}
       <div className="flex min-h-[80vh] flex-col gap-3 justify-center items-center ">
        <LyricsController query={id}/>
        </div> 
        <div className="w-full h-full fixed top-0 right-0 overflow-hidden background -z-50"/>
      {/* </section> */}
      </main>
  );
};
// 
export default PlaySong;
