import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { Adamina } from 'next/font/google';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req.query;
  
  // Validar el parámetro 'query'
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Invalid query parameter' });
  }
 

  let url = `https://lrclib.net/api/search?q=${encodeURIComponent(query)}`;

  if(parseInt(query)) {
    url = `https://lrclib.net/api/get/${query}`
  }

  try {
    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error('Error fetching data');
    }

    let data = response.data;
    res.status(200).json(data);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: 'Error fetching data', details: err.message });
  }
};
