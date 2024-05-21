import React, { useState, useEffect } from "react";
import parseSong, { Lyric } from "./parseSong";

interface LyricsControllerProps {
  query: string;
}

const LyricsController: React.FC<LyricsControllerProps> = ({ query }) => {
  const [lyrics, setLyrics] = useState<Lyric[]>([]);
  // const [audio, setAudio] = useState("");
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`api/search-lyrics?query=${query}`);

        if (response.status === 200) {
          const body = await response.json();
          const parsedLyrics = Array.isArray(body) ? parseSong(body[0].name, body[0].syncedLyrics) : parseSong(body.name, body.syncedLyrics);
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
    if (lyrics.length === 0) return;

    let interval: NodeJS.Timeout;
    const startTime = Date.now();

    const updateLyricIndex = () => {
      const elapsedTime = Date.now() - startTime;
      const nextIndex = lyrics.findIndex(lyric => lyric.timestamp > elapsedTime);

      if (nextIndex === -1) {
        setCurrentLyricIndex(lyrics.length - 1); // Last lyric if no more timestamps
      } else {
        setCurrentLyricIndex(nextIndex - 1);
      }
    };

    interval = setInterval(updateLyricIndex, 100);

    return () => clearInterval(interval);
  }, [lyrics]);


  useState(() => {
    const fetchAudio = async() => {
      const response = await fetch(`api/get-audio?query=${query}`);
      const body = await response.json();
    }
  
  })


  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>{lyrics[currentLyricIndex]?.lyric}</div>;
};

export default LyricsController;
