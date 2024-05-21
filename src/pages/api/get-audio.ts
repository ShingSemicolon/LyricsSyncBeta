import { NextApiRequest, NextApiResponse } from "next";
import ytsr from "ytsr";
import ytdl from "ytdl-core";

  type PartialURL =  ytsr.Item & Partial<{ url: string }>;
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { query } = req.query;

    // Validar el parámetro 'query'
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Invalid query parameter' });
    }

    try {
      const video = await ytsr(query, { limit: 10 });
      const song: PartialURL = video.items[0];
      if(!song.url) {
        throw new Error('Error fetching data');
      }
      const audioStream = await ytdl.getInfo(song.url);
      const audio = audioStream.formats.filter((format) => format.hasAudio && format.audioQuality === 'AUDIO_QUALITY_MEDIUM')[0].url;
      res.status(200).json({ url: audio });
    } catch (error) {
      const err = error as Error;
      console.log(err)
      res.status(500).json({ error: 'Error fetching data', details: err.message });
    } 

  };
      