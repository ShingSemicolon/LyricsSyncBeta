import { NextApiRequest, NextApiResponse } from "next";
import ytsr from "ytsr";
import ytdl from "ytdl-core";

  type PartialURL =  ytsr.Item & Partial<{ url: string }>;
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { query, t } = req.query;

    // Validar el parámetro 'query'
    if (!query || !t || typeof query !== 'string' || typeof t !== 'string' || query.trim() === '') {
      return res.status(400).json({ error: 'Invalid query parameter' });
    }

    try {
      const video = await ytsr(query, { limit: 5 });
      const songs: PartialURL[] = video.items;

      let allSongs: { timestamp: number, url: string }[] = [];
      for (const song of songs) {
      if(!song) continue;
      
      if(!song.url) continue;
      
      const audioStream = await ytdl.getInfo(song.url);
      const audio = audioStream.formats.filter((format) => format.hasAudio && format.audioQuality === 'AUDIO_QUALITY_MEDIUM');
      if(!audio.length) continue;
      
      const audioUrl = audio[0].url;
      const duration = audioStream.formats[0].approxDurationMs;
      if(!duration) continue;
      allSongs.push({ timestamp: parseInt(duration), url: audioUrl });
    }

      const url = allSongs.reduce((prev, curr) => Math.abs(curr.timestamp - parseInt(t)) < Math.abs(prev.timestamp - parseInt(t)) ? curr : prev).url;
      res.status(200).json({ url });
    } catch (error) {
      const err = error as Error;
      console.log(err)
      res.status(500).json({ error: 'Error fetching data', details: err.message });
    } 

  };
