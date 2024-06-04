import { useEffect, useState } from "react";


interface LyricsResult {
  albumName: string;
  artistName: string;
  duration: number;
  id: number;
  instrumental: boolean;
  name: string;
  syncedLyrics: {
    timestamp: number;
    lyric: string;
  }[];
  
}
const SearchBar = () => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<LyricsResult[]>([]);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        if(query.length === 0) return setResults([]);
          const response = await fetch(`api/search-lyrics?q=${query}`);
          if (response.status === 200) {
            const body = await response.json();
            console.log(body);
            setResults(body);
          } else {
            throw new Error('Error fetching data');
          }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

   setTimeout(fetchData, 500);
  }, [query]);


    return (
      <div className="flex flex-col gap-3">
        <div className="flex gap-3 px-5 py-3 border-white border-[1px] rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="fill-white" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50">
<path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>
</svg>
          <input className="bg-transparent focus:outline-none w-full" onChange={(e) => setQuery(e.target.value)} type="text" placeholder="Search..." />
        </div>
        {!loading && results.length > 0 && (
          <div className="flex flex-col gap-3">
            {results.map((result) => (
              <a href={`/song?id=${result.id}`}>
              <div key={result.id} className="flex flex-col gap-3">
                <h3 className="text-lg font-bold">{result.name}</h3>
                <p className="text-sm">{result.artistName}</p>
              </div>
              </a>
            ))}
          </div>
        )}
        </div>
    );
}

export default SearchBar;