import React, { useState, useEffect, useRef } from "react";
import parseSong, { Lyric } from "./parseSong";

interface LyricsControllerProps {
  query: string;
}

 const LyricsController: React.FC<LyricsControllerProps> = ({ query }) => {
  const [lyrics, setLyrics] = useState<Lyric>({ name: "", author: "", lyrics: [] });
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`api/search-lyrics?query=${query}`);

        if (response.status === 200) {
          const body = await response.json();
          const parsedLyrics = Array.isArray(body) ? parseSong(body[0].name, body[0].artistName, body[0].syncedLyrics) : parseSong(body.name, body.artistName, body.syncedLyrics);
          setLyrics(parsedLyrics);
        } else {
          throw new Error('Error fetching data');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  useEffect(() => {
    if (lyrics.lyrics.length === 0) return;

    let interval: NodeJS.Timeout;
    const startTime = Date.now();

    const updateLyricIndex = () => {
      const elapsedTime = Date.now() - startTime;
      const nextIndex = lyrics.lyrics.findIndex(lyric => lyric.timestamp > elapsedTime);
      console.log(lyrics.lyrics[nextIndex])

      if(!lyrics.lyrics[nextIndex+1]) {
        return;
      }
      if (lyrics.lyrics[nextIndex+1].timestamp < elapsedTime) {
        clearInterval(interval);
        console.log("done");
        return;
      }
   
      if (nextIndex === -1) {
      console.log("["+(lyrics.lyrics.length-1)+"] "+lyrics.lyrics[lyrics.lyrics.length - 1].lyric,elapsedTime - lyrics.lyrics[lyrics.lyrics.length - 1].timestamp)
        setTimeout(() => setCurrentLyricIndex(lyrics.lyrics.length - 1), lyrics.lyrics[lyrics.lyrics.length - 1].timestamp - elapsedTime);
      } else {
      console.log("["+(nextIndex)+"] "+ lyrics.lyrics[nextIndex].lyric,elapsedTime - lyrics.lyrics[nextIndex].timestamp)
        setTimeout(() => setCurrentLyricIndex(nextIndex), lyrics.lyrics[nextIndex].timestamp - elapsedTime);
      }
      const button = document.querySelector('#play');
  
      button?.addEventListener('click', () => {
        if (interval) {
          clearInterval(interval);
        } else {
          interval = setInterval(updateLyricIndex, 100);
        }
      })

    };
    updateLyricIndex();
    // interval = setInterval(updateLyricIndex, 100);
 
    
    return () => clearInterval(interval);
  }, [lyrics]);


  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const responseLyrics = await fetch(`api/search-lyrics?query=${query}`);
        const bodyLyric = await responseLyrics.json();
        const lyricsName = Array.isArray(bodyLyric) ? bodyLyric[0].name : bodyLyric.name;
        
        const responseAudio = await fetch(`api/get-audio?query=${lyricsName + ' ' + lyrics.author}&t=${lyrics.lyrics[currentLyricIndex]?.timestamp}`);
        const bodyAudio = await responseAudio.json();

        if (!audioRef.current) {
          audioRef.current = new Audio(bodyAudio.url);
        } else {
          audioRef.current.src = bodyAudio.url;
        }
      } catch (error) {
        console.error('Error fetching audio or lyrics:', error);
      }
    };

    fetchAudio();
  }, [query, lyrics, currentLyricIndex]);

  useEffect(() => {
    const handlePlayPause = async () => {
      if (audioRef.current) {
        try {
          if (audioRef.current.paused) {
            await audioRef.current.play();
            console.log('Reproduciendo audio');
          } else {
            audioRef.current.pause();
            console.log('Audio pausado');
          }
        } catch (error) {
          console.error('Error al reproducir/pausar el audio:', error);
        }
      }
    };

    const button = buttonRef.current;
    button?.addEventListener('click', handlePlayPause);

    // Cleanup function to remove the event listener
    return () => {
      button?.removeEventListener('click', handlePlayPause);
    };
  }, []);




  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>{lyrics.lyrics[currentLyricIndex]?.lyric}</div>;

};

export default LyricsController;