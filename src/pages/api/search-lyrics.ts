import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { q } = req.query;
  
  // Validar el parámetro 'query'
  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Invalid query parameter' });
  }
 

  let url = `https://lrclib.net/api/search?q=${encodeURIComponent(q)}`;

  if(parseInt(q)) {
    url = `https://lrclib.net/api/get/${q}`
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
