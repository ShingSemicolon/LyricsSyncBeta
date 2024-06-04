import { NextApiRequest, NextApiResponse } from "next";
import ytsr from "ytsr";
import ytdl from "ytdl-core";

type PartialURL = ytsr.Item & Partial<{ url: string }>;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { q, t } = req.query;

  // Validate the 'query' and 't' parameters
  if (!q || !t || typeof q !== 'string' || typeof t !== 'string' || q.trim() === '' || isNaN(parseInt(t))) {
    return res.status(400).json({ error: 'Invalid query parameter' });
  }

  try {
    const video = await ytsr(q, { limit: 3 });
    const songs: PartialURL[] = video.items as PartialURL[];

    const songPromises = songs.map(async (song) => {
      if (!song || !song.url) return null;

      const audioStream = await ytdl.getInfo(song.url);
      const audio = audioStream.formats.find((format) => format.hasAudio && format.audioQuality === 'AUDIO_QUALITY_MEDIUM');
      if (!audio) return null;

      const duration = audioStream.videoDetails.lengthSeconds;
      if (!duration) return null;

      return { timestamp: parseInt(duration) * 1000, url: audio.url };
    });

    const allSongs = (await Promise.all(songPromises)).filter(song => song !== null) as { timestamp: number, url: string }[];

    if (allSongs.length === 0) {
      return res.status(404).json({ error: 'No suitable audio found' });
    }

    const targetTimestamp = parseInt(t);
    const closestSong = allSongs.reduce((prev, curr) => Math.abs(curr.timestamp - targetTimestamp) < Math.abs(prev.timestamp - targetTimestamp) ? curr : prev);
    
    res.status(200).json({ url: closestSong.url });
  } catch (error) {
    const err = error as Error;
    console.error(err);
    res.status(500).json({ error: 'Error fetching data', details: err.message });
  }
};
