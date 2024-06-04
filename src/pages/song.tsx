"use client";
import LyricsController from "@/app/LyricsController";
import { useRouter } from 'next/router';
import "@/app/globals.css";
import SearchBar from "@/app/SearchBar";

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

      <SearchBar />

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
