// import ytsr from 'ytsr';
// import axios from 'axios';
// import { NextApiRequest, NextApiResponse } from 'next';

// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   const { query } = req.query;

//   // Validar el parámetro 'query'
//   if (!query || typeof query !== 'string') {
//     return res.status(400).json({ error: 'Invalid query parameter' });
//   }

//   try {
//     const response = await axios.get(`https://openapi.music.163.com/api/search/get/?s=${query}&type=1&limit=10`);
//     if(response.status !== 200) {
//       throw new Error('Error fetching data');
//     }
//     const body = response.data;
//     if(body.result.songs.length === 0) {
//      return;
//     }
//     console.log(body.result.songs.length)
//     const video = await ytsr(query, { limit: 10 });
//     let songs = video.items.filter((song: any) => song.type === 'video');   
//     res.status(200).json({ result: { songs } });
//   } catch (error) {
//     const err = error as Error;
//     res.status(500).json({ error: 'Error fetching data', details: err.message });
//   }

// };


import ytsr from 'ytsr';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req.query;

  // Validar el parámetro 'query'
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Invalid query parameter' });
  }

  try {
    const response = await axios.get(`https://openapi.music.163.com/api/search/get/?s=${query}&type=1&limit=10`);
    if(response.status !== 200) {
      throw new Error('Error fetching data');
    }
    const body = response.data;
    if(body.result.songs.length === 0) {
     return;
    }

    res.status(200).json({ result: body.songs });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: 'Error fetching data', details: err.message });
  }

};

