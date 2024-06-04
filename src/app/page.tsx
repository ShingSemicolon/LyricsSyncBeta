"use client";
// Vídeo de <a href="https://pixabay.com/es/users/tommyvideo-3092371/?utm_source=link-attribution&utm_medium=referral&utm_campaign=video&utm_content=5180">Tomislav Jakupec</a> de <a href="https://pixabay.com/es//?utm_source=link-attribution&utm_medium=referral&utm_campaign=video&utm_content=5180">Pixabay</a>
import SearchBar from "./SearchBar";

const SongSearch = () => {
 
  return (
    <main className="flex flex-col justify-center gap-3 min-h-screen align-middle p-3 sm:p-5">

    

      <section>
        {/* <div>
        <h1 className="text-3xl font-bold">Search Results</h1>
        <p className="text-gray-500">No results found</p>
        </div> */}
       <div className="flex flex-col mx-56 gap-3">
        <h1 className="text-4xl font-bold text-center">Welcome to Lyric Searcher</h1>
        <SearchBar />
        </div> 
        <div className="w-full h-full fixed top-0 right-0 overflow-hidden background -z-50"/>
      </section>
      </main>
  );
};
// 
export default SongSearch;
