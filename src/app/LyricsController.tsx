import React, { useState, useEffect, useRef } from "react";
import parseSong, { Lyric } from "./parseSong";
import localFont from "next/font/local";

const stopbuck = localFont({ src: "../../public/Stopbuck.ttf" });

interface LyricsControllerProps {
  query: string;
}

const LyricsController: React.FC<LyricsControllerProps> = ({ query }) => {
  const [response, setLyrics] = useState<Lyric>({ name: "", author: "", lyrics: [] });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`api/search-lyrics?q=${query}`);
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
    if (response.lyrics.length === 0) return;

    let interval: NodeJS.Timeout;

    const updateLyricIndex = () => {
      const audioElement = audioRef.current;
      if (!audioElement) return;

      const elapsedTime = audioElement.currentTime * 1000; // convert to milliseconds
      const nextIndex = response.lyrics.findIndex(lyric => lyric.timestamp > elapsedTime);

      if (nextIndex === -1) {
        setCurrentLyricIndex(response.lyrics.length - 1);
      } else {
        setCurrentLyricIndex(nextIndex - 1);
      }
    };

    const handlePlayPause = async () => {
      if (audioRef.current) {
        try {
          if (audioRef.current.paused) {
            await audioRef.current.play();
            interval = setInterval(updateLyricIndex, 100);
          } else {
            audioRef.current.pause();
            clearInterval(interval);
          }
        } catch (error) {
          console.error('Error al reproducir/pausar el audio:', error);
        }
      }
    };

    const button = buttonRef.current;
    button?.addEventListener('click', handlePlayPause);

    return () => {
      button?.removeEventListener('click', handlePlayPause);
      clearInterval(interval);
    };
  }, [response]);

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const lyricsName = response.name;
        const responseAudio = await fetch(`api/get-audio?q=${lyricsName + ' ' + response.author}&t=${response.lyrics.reduce((prev, curr) => prev + curr.timestamp, 0) / response.lyrics.length}`);
        const bodyAudio = await responseAudio.json();

        if (!audioRef.current) {
          audioRef.current = new Audio(bodyAudio.url);
        } else {
          audioRef.current.src = bodyAudio.url;
        }
      } catch (error) {
        console.error('Error fetching audio:', error);
      }
    };

    if (response.lyrics.length > 0) {
      fetchAudio();
    }
  }, [response]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button ref={buttonRef} id="play">Play/Pause</button>
      <div className={`${stopbuck.className} text-3xl`}>{response.lyrics[currentLyricIndex]?.lyric}</div>
    </div>
  );
};

export default LyricsController;
